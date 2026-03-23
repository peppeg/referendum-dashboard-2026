import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import {
  dashboardSeedData,
  isDashboardData,
  mergeDashboardData,
  type DashboardData,
  type DashboardDataPatch,
} from "../shared/dashboardData.js";

const ELEAPI_BASE_URL = "https://eleapi.interno.gov.it/siel/PX";
const RESULTS_CACHE_MS = 15_000;

type EleapiScrutiniResponse = {
  int: {
    sz_tot: number;
    desc_reg?: string;
  };
  scheda?: Array<{
    sz_perv: number;
    voti_si: number;
    voti_no: number;
    perc_si: string | number;
    perc_no: string | number;
    dt_agg: string | number | null;
  }>;
};

type RegionConfig = {
  code: string;
  name: string;
};

let liveData: DashboardData = dashboardSeedData;
let resultsCache:
  | {
      data: Pick<DashboardData, "risultatiNazionali" | "risultatiRegionali">;
      fetchedAt: number;
    }
  | undefined;

const REGION_CONFIG: RegionConfig[] = [
  { code: "01", name: "Piemonte" },
  { code: "02", name: "Valle d'Aosta" },
  { code: "03", name: "Lombardia" },
  { code: "04", name: "Trentino-Alto Adige" },
  { code: "05", name: "Veneto" },
  { code: "06", name: "Friuli Venezia Giulia" },
  { code: "07", name: "Liguria" },
  { code: "08", name: "Emilia-Romagna" },
  { code: "09", name: "Toscana" },
  { code: "10", name: "Umbria" },
  { code: "11", name: "Marche" },
  { code: "12", name: "Lazio" },
  { code: "13", name: "Abruzzo" },
  { code: "14", name: "Molise" },
  { code: "15", name: "Campania" },
  { code: "16", name: "Puglia" },
  { code: "17", name: "Basilicata" },
  { code: "18", name: "Calabria" },
  { code: "19", name: "Sicilia" },
  { code: "20", name: "Sardegna" },
];

function parsePercent(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  const numeric = typeof value === "number"
    ? value
    : Number(String(value).replace(",", "."));

  return Number.isFinite(numeric) ? numeric : null;
}

function formatEleapiTimestamp(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  if (!/^\d{14}$/.test(normalized)) {
    return normalized || null;
  }

  return `${normalized.slice(6, 8)}/${normalized.slice(4, 6)} ${normalized.slice(8, 10)}:${normalized.slice(10, 12)}`;
}

function getWinner(
  siPercentuale: number | null,
  noPercentuale: number | null,
  sezioniScrutinate: number,
) {
  if (sezioniScrutinate === 0 || siPercentuale === null || noPercentuale === null) {
    return "N/D" as const;
  }

  if (siPercentuale === noPercentuale) {
    return "PARITA" as const;
  }

  return siPercentuale > noPercentuale ? "SI" as const : "NO" as const;
}

async function fetchEleapiJson(path: string) {
  const response = await fetch(`${ELEAPI_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Origin: "https://elezioni.interno.gov.it",
      Referer: "https://elezioni.interno.gov.it/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`eleapi returned ${response.status} for ${path}`);
  }

  return (await response.json()) as EleapiScrutiniResponse;
}

async function loadLiveResults() {
  if (resultsCache && Date.now() - resultsCache.fetchedAt < RESULTS_CACHE_MS) {
    return resultsCache.data;
  }

  const nazionale = await fetchEleapiJson("/scrutiniFI/DE/20260322/TE/09/SK/01");
  const schedaNazionale = nazionale.scheda?.[0];

  if (!schedaNazionale) {
    throw new Error("eleapi national payload is missing scheda[0]");
  }

  const regionResponses = await Promise.allSettled(
    REGION_CONFIG.map(async (region) => ({
      region,
      payload: await fetchEleapiJson(`/scrutiniFI/DE/20260322/TE/09/SK/01/RE/${region.code}`),
    })),
  );

  const risultatiNazionali: DashboardData["risultatiNazionali"] = {
    stato:
      schedaNazionale.sz_perv === 0
        ? "in-attesa"
        : schedaNazionale.sz_perv >= nazionale.int.sz_tot
          ? "completato"
          : "in-corso",
    siPercentuale: parsePercent(schedaNazionale.perc_si),
    noPercentuale: parsePercent(schedaNazionale.perc_no),
    sezioniScrutinate: schedaNazionale.sz_perv,
    sezioniTotali: nazionale.int.sz_tot,
    percentualeSezioniScrutinate:
      nazionale.int.sz_tot > 0
        ? Number(((schedaNazionale.sz_perv / nazionale.int.sz_tot) * 100).toFixed(2))
        : 0,
    ultimoAggiornamento: formatEleapiTimestamp(schedaNazionale.dt_agg),
  };

  const risultatiRegionali: DashboardData["risultatiRegionali"] = regionResponses.map((result, index) => {
    const fallback = liveData.risultatiRegionali[index];
    if (result.status !== "fulfilled") {
      console.error(`Unable to refresh regional scrutiny for ${REGION_CONFIG[index]?.name}:`, result.reason);
      return fallback;
    }

    const { region, payload } = result.value;
    const scheda = payload.scheda?.[0];
    const siPercentuale = parsePercent(scheda?.perc_si);
    const noPercentuale = parsePercent(scheda?.perc_no);
    const szPerv = scheda?.sz_perv ?? 0;
    const szTot = payload.int.sz_tot ?? 0;

    return {
      regione: region.name,
      siPercentuale,
      noPercentuale,
      sezioniScrutinate: szPerv,
      sezioniTotali: szTot,
      percentualeSezioniScrutinate:
        szTot > 0 ? Number(((szPerv / szTot) * 100).toFixed(2)) : 0,
        vincitore: getWinner(siPercentuale, noPercentuale, szPerv),
    };
  });

  const data = {
    risultatiNazionali,
    risultatiRegionali,
  };

  resultsCache = {
    data,
    fetchedAt: Date.now(),
  };

  return data;
}

function getRefreshToken() {
  const value = process.env.DASHBOARD_REFRESH_TOKEN?.trim();
  return value ? value : null;
}

function isAuthorizedRefreshRequest(req: Request) {
  const expectedToken = getRefreshToken();
  if (!expectedToken) {
    return false;
  }

  const bearerHeader = req.header("authorization");
  const bearerToken = bearerHeader?.startsWith("Bearer ")
    ? bearerHeader.slice("Bearer ".length)
    : undefined;

  return bearerToken === expectedToken;
}

export async function registerRoutes(
  app: Express,
  httpServer?: Server
) {
  // Public endpoint for dashboard data
  app.get("/api/dashboard", async (_req, res) => {
    try {
      const liveResults = await loadLiveResults();
      res.json({
        ...liveData,
        ...liveResults,
      });
    } catch (error) {
      console.error("Unable to refresh live scrutiny results:", error);
      res.json(liveData);
    }
  });

  if (getRefreshToken()) {
    app.post("/api/dashboard", (req, res) => {
      if (!isAuthorizedRefreshRequest(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const payload = req.body as DashboardData | DashboardDataPatch;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ error: "Invalid payload" });
      }

      liveData = isDashboardData(payload)
        ? payload
        : mergeDashboardData(liveData, payload);
      resultsCache = undefined;

      res.json({
        success: true,
        liveData,
      });
    });
  }

  return httpServer || app;
}
