import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Area,
} from "recharts";
import {
  Vote, Users, TrendingUp, Clock, MapPin, Scale, Sun, Moon, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle2, XCircle, Timer, Building2, Gavel, Shuffle, SplitSquareVertical,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "@shared/dashboardData";

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      data-testid="theme-toggle"
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg hover:bg-secondary transition-colors"
      aria-label={dark ? "Passa alla modalità chiara" : "Passa alla modalità scura"}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

function KpiCard({ label, value, sublabel, icon: Icon, trend, color }: {
  label: string; value: string; sublabel?: string;
  icon: any; trend?: "up" | "down" | "neutral"; color?: string;
}) {
  return (
    <Card data-testid={`kpi-${label.replace(/\s/g, "-").toLowerCase()}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg ${color || "bg-primary/10"}`}>
          <Icon className={`w-5 h-5 ${color ? "text-white" : "text-primary"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold tabular-nums mt-0.5">{value}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              {trend === "up" && <ChevronUp className="w-3 h-3 text-emerald-500" />}
              {trend === "down" && <ChevronDown className="w-3 h-3 text-red-500" />}
              {sublabel}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-primary" />
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

const AREA_COLORS: Record<string, string> = {
  "Nord-Ovest": "hsl(215, 65%, 42%)",
  "Nord-Est": "hsl(215, 65%, 55%)",
  "Centro": "hsl(40, 80%, 52%)",
  "Sud": "hsl(0, 72%, 50%)",
  "Isole": "hsl(280, 50%, 50%)",
};

type SeggiStatus = {
  badgeLabel: string;
  detail: string;
  badgeClassName: string;
  dotClassName: string;
};

function formatPercent(value: number | null, digits = 2) {
  return value === null ? "—" : `${value.toFixed(digits)}%`;
}

function getWinnerBadgeClass(vincitore: "SI" | "NO" | "PARITA" | "N/D") {
  switch (vincitore) {
    case "SI":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-300";
    case "NO":
      return "bg-red-500/15 text-red-700 border-red-300";
    case "PARITA":
      return "bg-amber-500/15 text-amber-700 border-amber-300";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}

function mixHexColors(baseHex: string, targetHex: string, weight: number) {
  const normalizedBase = baseHex.replace("#", "");
  const normalizedTarget = targetHex.replace("#", "");
  if (normalizedBase.length !== 6 || normalizedTarget.length !== 6) {
    return baseHex;
  }

  const mixChannel = (start: number, end: number) =>
    Math.round(start + (end - start) * weight)
      .toString(16)
      .padStart(2, "0");

  const baseChannels = [
    Number.parseInt(normalizedBase.slice(0, 2), 16),
    Number.parseInt(normalizedBase.slice(2, 4), 16),
    Number.parseInt(normalizedBase.slice(4, 6), 16),
  ];
  const targetChannels = [
    Number.parseInt(normalizedTarget.slice(0, 2), 16),
    Number.parseInt(normalizedTarget.slice(2, 4), 16),
    Number.parseInt(normalizedTarget.slice(4, 6), 16),
  ];

  return `#${mixChannel(baseChannels[0], targetChannels[0])}${mixChannel(baseChannels[1], targetChannels[1])}${mixChannel(baseChannels[2], targetChannels[2])}`;
}

function getRomeDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const lookup = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    isoDate: `${lookup.year}-${lookup.month}-${lookup.day}`,
    minutes: Number(lookup.hour) * 60 + Number(lookup.minute),
  };
}

function getSeggiStatus(date = new Date()): SeggiStatus {
  const { isoDate, minutes } = getRomeDateParts(date);
  const openMorning = 7 * 60;
  const closeSunday = 23 * 60;
  const closeMonday = 15 * 60;

  if (isoDate < "2026-03-22" || (isoDate === "2026-03-22" && minutes < openMorning)) {
    return {
      badgeLabel: "Seggi chiusi",
      detail: "Apertura dom 22 marzo alle 07:00",
      badgeClassName: "text-xs gap-1 border-amber-300 text-amber-700 bg-amber-50",
      dotClassName: "bg-amber-500",
    };
  }

  if (isoDate === "2026-03-22" && minutes < closeSunday) {
    return {
      badgeLabel: "Seggi aperti",
      detail: "Chiusura oggi alle 23:00",
      badgeClassName: "text-xs gap-1 border-emerald-300 text-emerald-700 bg-emerald-50",
      dotClassName: "bg-emerald-500 animate-pulse",
    };
  }

  if (
    (isoDate === "2026-03-22" && minutes >= closeSunday) ||
    (isoDate === "2026-03-23" && minutes < openMorning)
  ) {
    return {
      badgeLabel: "Seggi chiusi",
      detail: "Riaprono lun 23 marzo alle 07:00",
      badgeClassName: "text-xs gap-1 border-amber-300 text-amber-700 bg-amber-50",
      dotClassName: "bg-amber-500",
    };
  }

  if (isoDate === "2026-03-23" && minutes < closeMonday) {
    return {
      badgeLabel: "Seggi aperti",
      detail: "Chiusura oggi alle 15:00",
      badgeClassName: "text-xs gap-1 border-emerald-300 text-emerald-700 bg-emerald-50",
      dotClassName: "bg-emerald-500 animate-pulse",
    };
  }

  return {
    badgeLabel: "Seggi chiusi",
    detail: "Scrutinio da lun 23 marzo alle 15:00",
    badgeClassName: "text-xs gap-1 border-slate-300 text-slate-700 bg-slate-50",
    dotClassName: "bg-slate-500",
  };
}

async function fetchDashboardData() {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    refetchInterval: 15000,
  });

  const [expandedInfo, setExpandedInfo] = useState(false);
  const [clockTick, setClockTick] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClockTick(Date.now());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Caricamento dati in tempo reale...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-red-500">Errore nel caricamento dei dati live</div>;
  }

  const {
    referendumInfo,
    puntiChiave,
    affluenzaTempoReale,
    affluenzaRegioni,
    affluenzaCitta,
    referendumStorici,
    sondaggi,
    propensionePartiti,
    affluenzaPerArea,
    risultatiNazionali,
    risultatiRegionali,
    timelineEventi,
    proiezioneYoodata,
    proiezioneIpsos
  } = data;

  const latestAffluenza = affluenzaTempoReale[affluenzaTempoReale.length - 1];
  const seggiStatus = getSeggiStatus(new Date(clockTick));
  const latestAffluenzaLabel = latestAffluenza?.label || latestAffluenza?.ora || "N/D";

  // Chart data prep
  const regioniSorted = [...affluenzaRegioni].sort(
    (a, b) =>
      (b.affluenzaOre23 || b.affluenzaOre19 || b.affluenzaOre12) -
      (a.affluenzaOre23 || a.affluenzaOre19 || a.affluenzaOre12),
  );

  const confrontoOre12 = referendumStorici.map((r) => ({
    nome: `${r.anno}`,
    label: r.nome,
    affluenza: r.affluenzaOre12Giorno1,
    fill: r.anno === 2026 ? "hsl(215, 65%, 42%)" : "hsl(215, 30%, 70%)",
  }));

  const confrontoFinale = referendumStorici.filter(r => r.affluenzaFinale > 0).map(r => ({
    anno: r.anno,
    nome: r.nome,
    affluenza: r.affluenzaFinale,
    si: r.siPercentuale,
    no: r.noPercentuale,
  }));

  const scenariData = sondaggi.filter(s => s.siPerc > 0).map(s => ({
    scenario: `${s.istituto} (${s.scenarioAffl})`,
    si: s.siPerc,
    no: s.noPerc,
    affluenza: s.affluenzaStimata,
  }));

  const partitiBarData = propensionePartiti.map(p => ({
    partito: p.partito,
    si: p.orientamentoSi,
    no: p.orientamentoNo,
    propensione: p.propensioneVoto,
    siFill: mixHexColors(p.colore, "ffffff", 0.18),
    noFill: mixHexColors(p.colore, "111827", 0.24),
  }));

  const afflAreaChart = affluenzaPerArea.map((a) => ({
    area: a.area,
    affluenza: a.ore23 || a.ore19 || a.ore12,
    fill: AREA_COLORS[a.area] || "#888",
  }));

  const scrutinioStarted =
    risultatiNazionali.stato !== "in-attesa" ||
    risultatiNazionali.sezioniScrutinate > 0;

  const scrutinioPieData = [
    { name: "Sì", value: risultatiNazionali.siPercentuale ?? 0, fill: "hsl(145, 55%, 38%)" },
    { name: "No", value: risultatiNazionali.noPercentuale ?? 0, fill: "hsl(0, 72%, 50%)" },
  ];

  const risultatiRegionaliOrdinati = [...risultatiRegionali].sort((a, b) => {
    if (b.percentualeSezioniScrutinate !== a.percentualeSezioniScrutinate) {
      return b.percentualeSezioniScrutinate - a.percentualeSezioniScrutinate;
    }

    return a.regione.localeCompare(b.regione);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-5 w-5" aria-label="Bilancia della giustizia" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">Referendum Giustizia 2026</h1>
                <p className="text-xs text-muted-foreground">Dashboard in tempo reale</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={seggiStatus.badgeClassName} title={seggiStatus.detail}>
              <span className={`w-2 h-2 rounded-full inline-block ${seggiStatus.dotClassName}`} />
              {seggiStatus.badgeLabel}
            </Badge>
            <span className="hidden text-xs text-muted-foreground sm:inline">{seggiStatus.detail}</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20" data-testid="info-banner">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary text-primary-foreground">Confermativo</Badge>
                  <Badge variant="outline">Art. 138 Cost.</Badge>
                  <Badge variant="outline" className="text-xs">{referendumInfo.quorum}</Badge>
                </div>
                <p className="text-sm font-medium mt-2">{referendumInfo.oggetto}</p>
                <p className="text-xs text-muted-foreground">{referendumInfo.orariVoto}</p>
                {expandedInfo && (
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="text-xs italic border-l-2 border-primary/30 pl-3">{referendumInfo.quesito}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/10">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-xs">Se vince il SI</p>
                          <p className="text-xs text-muted-foreground">{referendumInfo.significatoSi}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-xs">Se vince il NO</p>
                          <p className="text-xs text-muted-foreground">{referendumInfo.significatoNo}</p>
                        </div>
                      </div>
                    </div>
                    {/* Punti chiave della riforma */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {puntiChiave.map((p) => {
                        const icons: Record<string, any> = { split: SplitSquareVertical, building: Building2, dice: Shuffle, gavel: Gavel };
                        const PIcon = icons[p.icona] || Scale;
                        return (
                          <div key={p.titolo} className="p-2 rounded-lg bg-secondary/50 text-center">
                            <PIcon className="w-4 h-4 mx-auto mb-1 text-primary" />
                            <p className="text-xs font-medium">{p.titolo}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{p.descrizione}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <button
                data-testid="toggle-info"
                onClick={() => setExpandedInfo(!expandedInfo)}
                className="ml-2 p-1 hover:bg-secondary rounded shrink-0"
              >
                {expandedInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Ultima affluenza"
            value={`${latestAffluenza.percentuale}%`}
            sublabel={`${latestAffluenzaLabel} | ${latestAffluenza.sezioniPervenute.toLocaleString("it-IT")} sezioni`}
            icon={Vote}
            trend="up"
          />
          <KpiCard
            label="Aventi diritto"
            value={(referendumInfo.aventiDiritto / 1e6).toFixed(1) + "M"}
            sublabel={`di cui ${(referendumInfo.aventiDirittoEstero / 1e6).toFixed(1)}M estero`}
            icon={Users}
          />
          <KpiCard
            label="Proiezione finale"
            value={`~${proiezioneYoodata}%`}
            sublabel="Stima Yoodata da aff. ore 12"
            icon={TrendingUp}
            trend="up"
          />
          <KpiCard
            label="Sezioni"
            value={referendumInfo.sezioniTotali.toLocaleString("it-IT")}
            sublabel="Scrutinio da Lun 23/03 h15"
            icon={MapPin}
          />
        </div>

        {/* Main content tabs */}
        <Tabs defaultValue="affluenza" className="space-y-4">
          <TabsList className="grid grid-cols-4 max-w-lg">
            <TabsTrigger value="affluenza" data-testid="tab-affluenza" className="text-xs">Affluenza</TabsTrigger>
            <TabsTrigger value="confronto" data-testid="tab-confronto" className="text-xs">Storico</TabsTrigger>
            <TabsTrigger value="proiezioni" data-testid="tab-proiezioni" className="text-xs">Proiezioni</TabsTrigger>
            <TabsTrigger value="risultati" data-testid="tab-risultati" className="text-xs">Risultati</TabsTrigger>
          </TabsList>

          {/* TAB AFFLUENZA */}
          <TabsContent value="affluenza" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Affluenza temporale */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Affluenza nel tempo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <ComposedChart data={affluenzaTempoReale}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis unit="%" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      />
                      <Area type="monotone" dataKey="percentuale" fill="hsl(var(--chart-1))" fillOpacity={0.15} stroke="none" />
                      <Line type="monotone" dataKey="percentuale" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(var(--chart-1))" }} name="Affluenza %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">Dati Eligendo — Ministero dell'Interno</p>
                </CardContent>
              </Card>

              {/* Affluenza per area */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Affluenza per area (ultimo dato)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={afflAreaChart} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="area" type="category" tick={{ fontSize: 11 }} width={80} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "hsl(var(--foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="affluenza" name="Affluenza %" radius={[0, 4, 4, 0]}>
                        {afflAreaChart.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {affluenzaPerArea.map(a => (
                      <span key={a.area} className="text-[10px] text-emerald-600 font-medium">{a.area}: {a.diff2025} vs 2025</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabella regioni */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Affluenza per regione</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-xs" data-testid="table-regioni">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Regione</th>
                      <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Area</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Ore 12</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Ore 19</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Ore 23</th>
                      <th className="py-2 px-2 font-semibold text-muted-foreground text-left" style={{ width: "30%" }}>Barra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regioniSorted.map((r) => (
                      <tr key={r.regione} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-1.5 px-2 font-medium">{r.regione}</td>
                        <td className="py-1.5 px-2">
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5"
                            style={{ borderColor: AREA_COLORS[r.area], color: AREA_COLORS[r.area] }}>
                            {r.area}
                          </Badge>
                        </td>
                        <td className="py-1.5 px-2 text-right tabular-nums font-semibold">{r.affluenzaOre12}%</td>
                        <td className="py-1.5 px-2 text-right tabular-nums font-semibold">
                          {r.affluenzaOre19 ? `${r.affluenzaOre19}%` : "—"}
                        </td>
                        <td className="py-1.5 px-2 text-right tabular-nums font-semibold">
                          {r.affluenzaOre23 ? `${r.affluenzaOre23}%` : "—"}
                        </td>
                        <td className="py-1.5 px-2">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min((r.affluenzaOre23 || r.affluenzaOre19 || r.affluenzaOre12) / 60 * 100, 100)}%`,
                                backgroundColor: AREA_COLORS[r.area],
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Affluenza città */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Principali città — Ore 12, Ore 19 e Ore 23</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={affluenzaCitta}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="citta" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" angle={-30} textAnchor="end" height={50} />
                    <YAxis unit="%" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="affluenzaOre12" name="Ore 12" fill="hsl(var(--chart-1))" fillOpacity={0.4} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="affluenzaOre19" name="Ore 19" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="affluenzaOre23" name="Ore 23" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB CONFRONTO STORICO */}
          <TabsContent value="confronto" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Confronto affluenza ore 12 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Affluenza ore 12 — Confronto ref. costituzionali</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={confrontoOre12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="nome" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis unit="%" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: any, _: any, props: any) => [`${v}%`, props.payload.label]}
                      />
                      <Bar dataKey="affluenza" name="Affluenza ore 12" radius={[4, 4, 0, 0]}>
                        {confrontoOre12.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Nota: il ref. 2016 si tenne in un solo giorno. Il 2026 supera il 2020 (12.2%) di +2.7 punti.
                  </p>
                </CardContent>
              </Card>

              {/* Risultati storici */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Risultati referendum costituzionali</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={confrontoFinale} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                      <YAxis dataKey="anno" type="category" tick={{ fontSize: 11 }} width={40} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "hsl(var(--foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="si" stackId="a" fill="hsl(145, 55%, 38%)" name="Sì %" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="no" stackId="a" fill="hsl(0, 72%, 50%)" name="No %" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabella storica dettagliata */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Riepilogo referendum costituzionali</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-xs" data-testid="table-storici">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Anno</th>
                      <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Riforma</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Affluenza</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Sì</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">No</th>
                      <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Esito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referendumStorici.map((r) => (
                      <tr key={r.anno} className={`border-b border-border/50 ${r.anno === 2026 ? "bg-primary/5 font-bold" : ""}`}>
                        <td className="py-2 px-2 font-semibold">{r.anno}</td>
                        <td className="py-2 px-2">
                          <p className="font-medium">{r.nome}</p>
                          <p className="text-[10px] text-muted-foreground">{r.descrizione}</p>
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums">
                          {r.affluenzaFinale > 0 ? `${r.affluenzaFinale}%` : "—"}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums text-emerald-600">
                          {r.siPercentuale > 0 ? `${r.siPercentuale}%` : "—"}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums text-red-500">
                          {r.noPercentuale > 0 ? `${r.noPercentuale}%` : "—"}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {r.risultato === "In corso" ? (
                            <Badge variant="outline" className="text-[10px]"><Timer className="w-3 h-3 mr-1" />In corso</Badge>
                          ) : r.risultato === "Sì" ? (
                            <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px]">{r.risultato}</Badge>
                          ) : (
                            <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 text-[10px]">{r.risultato}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Tutti i referendum costituzionali non richiedono quorum. L'esito è determinato dalla maggioranza dei voti validi.
                </p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Iter della riforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-3">
                    {timelineEventi.map((e, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10
                          ${i === timelineEventi.length - 1 ? "border-primary bg-primary/20" : "border-border bg-background"}`}>
                          <div className={`w-2 h-2 rounded-full ${i === timelineEventi.length - 1 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{e.data}</p>
                          <p className="text-xs text-muted-foreground">{e.evento}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB PROIEZIONI */}
          <TabsContent value="proiezioni" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scenari sondaggi */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Scenari pre-voto (sondaggi)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={scenariData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" unit="%" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[40, 60]} />
                      <YAxis dataKey="scenario" type="category" tick={{ fontSize: 9 }} width={150} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "hsl(var(--foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="si" fill="hsl(145, 55%, 38%)" name="Sì %" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="no" fill="hsl(0, 72%, 50%)" name="No %" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 p-3 rounded-lg bg-secondary/50 space-y-1">
                    <p className="text-xs font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Insight chiave</p>
                    <p className="text-[11px] text-muted-foreground">
                      Alle 23:00 di domenica l'affluenza nazionale è al 46.07%, già oltre lo scenario base Ipsos (42%). Resta ora la finestra di voto di lunedì 23 marzo 2026 dalle 07:00 alle 15:00, prima dell'avvio dello scrutinio.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Orientamento per partito */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Orientamento per elettorato</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={partitiBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="partito" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis unit="%" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "hsl(var(--foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="si" stackId="a" name="Sì %" radius={[0, 0, 0, 0]}>
                        {partitiBarData.map((entry) => (
                          <Cell key={`${entry.partito}-si`} fill={entry.siFill} />
                        ))}
                      </Bar>
                      <Bar dataKey="no" stackId="a" name="No %" radius={[4, 4, 0, 0]}>
                        {partitiBarData.map((entry) => (
                          <Cell key={`${entry.partito}-no`} fill={entry.noFill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-muted-foreground mt-2">Fonte: Ipsos Doxa / YouTrend — Febbraio-Marzo 2026</p>
                </CardContent>
              </Card>
            </div>

            {/* Propensione al voto */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Propensione al voto per partito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {propensionePartiti.map(p => (
                    <div key={p.partito} className="text-center p-3 rounded-lg bg-secondary/30">
                      <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: p.colore }} />
                      <p className="text-xs font-semibold">{p.partito}</p>
                      <p className="text-lg font-bold tabular-nums">{p.propensioneVoto}%</p>
                      <p className="text-[10px] text-muted-foreground">propensi al voto</p>
                      <div className="mt-1 flex gap-0.5 justify-center">
                        <span className="text-[10px] text-emerald-600">Sì {p.orientamentoSi}%</span>
                        <span className="text-[10px] text-muted-foreground">|</span>
                        <span className="text-[10px] text-red-500">No {p.orientamentoNo}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-lg bg-secondary/50 space-y-1">
                  <p className="text-xs font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Dato notevole</p>
                  <p className="text-[11px] text-muted-foreground">
                    L'opposizione (PD 63%, M5S 57%) mostra una propensione al voto superiore alla maggioranza (FdI 59%, FI 45%, Lega 44%).
                    Il M5S è significativamente spaccato: nonostante la linea ufficiale per il No, il 22% degli elettori è orientato per il Sì.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Proiezioni affluenza */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Proiezioni affluenza finale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border text-center">
                    <p className="text-xs text-muted-foreground">Ipsos — scenario massimo</p>
                    <p className="text-2xl font-bold tabular-nums text-primary mt-1">49%</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Pre-voto, 5 marzo</p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-primary bg-primary/5 text-center">
                    <p className="text-xs text-muted-foreground">Yoodata — modello predittivo</p>
                    <p className="text-2xl font-bold tabular-nums text-primary mt-1">~60%</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Basato su aff. ore 12 (14.92%)</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border text-center">
                    <p className="text-xs text-muted-foreground">YouTrend — affluenza potenziale</p>
                    <p className="text-2xl font-bold tabular-nums text-primary mt-1">55.4%</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Scenario alta partecipazione</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 text-center">
                  Alle 23:00 di domenica l'affluenza è al 46.07%. Lunedì 23 marzo 2026 i seggi riaprono alle 07:00 e chiudono alle 15:00, quando inizierà anche lo scrutinio.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB RISULTATI */}
          <TabsContent value="risultati" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard
                label="Sì"
                value={formatPercent(risultatiNazionali.siPercentuale)}
                sublabel="Quota nazionale aggiornata"
                icon={CheckCircle2}
                color="bg-emerald-600"
              />
              <KpiCard
                label="No"
                value={formatPercent(risultatiNazionali.noPercentuale)}
                sublabel="Quota nazionale aggiornata"
                icon={XCircle}
                color="bg-red-600"
              />
              <KpiCard
                label="Sezioni scrutinate"
                value={risultatiNazionali.sezioniScrutinate.toLocaleString("it-IT")}
                sublabel={`su ${risultatiNazionali.sezioniTotali.toLocaleString("it-IT")}`}
                icon={Vote}
              />
              <KpiCard
                label="% scrutinio"
                value={`${risultatiNazionali.percentualeSezioniScrutinate.toFixed(2)}%`}
                sublabel={risultatiNazionali.ultimoAggiornamento || "In attesa dei primi dati"}
                icon={Timer}
                trend={scrutinioStarted ? "up" : "neutral"}
              />
            </div>

            <Card>
              <CardContent className="p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Monitor scrutinio in tempo reale</p>
                  <p className="text-sm text-muted-foreground">
                    La tab è centrata su Sì, No e avanzamento delle sezioni scrutinate.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    scrutinioStarted
                      ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                      : "border-amber-300 text-amber-700 bg-amber-50"
                  }
                >
                  {scrutinioStarted ? "Scrutinio in corso" : "In attesa dei primi verbali"}
                </Badge>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Quadro nazionale</CardTitle>
                </CardHeader>
                <CardContent>
                  {scrutinioStarted ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={scrutinioPieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={2}
                        >
                          {scrutinioPieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[260px] flex items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20 px-6 text-center text-sm text-muted-foreground">
                      Appena arrivano i primi dati di scrutinio, qui vedrai la distribuzione nazionale tra Sì e No.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Avanzamento sezioni scrutinate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Scrutinio completato</span>
                      <span className="font-semibold tabular-nums">
                        {risultatiNazionali.percentualeSezioniScrutinate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min(risultatiNazionali.percentualeSezioniScrutinate, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground">Sezioni scrutinate</p>
                      <p className="mt-1 text-2xl font-bold tabular-nums">
                        {risultatiNazionali.sezioniScrutinate.toLocaleString("it-IT")}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground">Sezioni totali</p>
                      <p className="mt-1 text-2xl font-bold tabular-nums">
                        {risultatiNazionali.sezioniTotali.toLocaleString("it-IT")}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/40 p-4 text-sm text-muted-foreground">
                    {risultatiNazionali.ultimoAggiornamento
                      ? `Ultimo aggiornamento: ${risultatiNazionali.ultimoAggiornamento}`
                      : "In attesa dei primi aggiornamenti di scrutinio da Eligendo."}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quadro regionale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-700">Verde: vantaggio Sì</span>
                  <span className="rounded-full bg-red-500/10 px-2 py-1 text-red-700">Rosso: vantaggio No</span>
                  <span className="rounded-full bg-secondary px-2 py-1">Grigio: dati non disponibili</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {risultatiRegionaliOrdinati.map((regione) => (
                    <div key={regione.regione} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{regione.regione}</p>
                          <p className="text-xs text-muted-foreground">
                            {regione.sezioniScrutinate.toLocaleString("it-IT")} / {regione.sezioniTotali.toLocaleString("it-IT")} sezioni
                          </p>
                        </div>
                        <Badge variant="outline" className={getWinnerBadgeClass(regione.vincitore)}>
                          {regione.vincitore}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Sì</p>
                          <p className="font-semibold text-emerald-600">{formatPercent(regione.siPercentuale)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">No</p>
                          <p className="font-semibold text-red-600">{formatPercent(regione.noPercentuale)}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Scrutinio</span>
                          <span>{regione.percentualeSezioniScrutinate.toFixed(2)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              regione.vincitore === "SI"
                                ? "bg-emerald-500"
                                : regione.vincitore === "NO"
                                  ? "bg-red-500"
                                  : "bg-muted-foreground/40"
                            }`}
                            style={{ width: `${Math.min(regione.percentualeSezioniScrutinate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
                  Questa sezione è già pronta per una cartina dell'Italia colorata regione per regione. Per farla bene ci manca solo una base SVG o GeoJSON affidabile e l'endpoint live dei risultati regionali.
                </div>
              </CardContent>
            </Card>
            <Card className="hidden">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Timer className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Scrutinio non ancora iniziato</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lo spoglio inizierà lunedì 23 marzo alle ore 15:00, subito dopo la chiusura dei seggi.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mt-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-3xl font-bold text-emerald-600">SÌ</p>
                    <p className="text-sm text-muted-foreground">—</p>
                    <p className="text-xs text-muted-foreground mt-1">La riforma entra in vigore</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800">
                    <p className="text-3xl font-bold text-red-600">NO</p>
                    <p className="text-sm text-muted-foreground">—</p>
                    <p className="text-xs text-muted-foreground mt-1">Resta la Costituzione attuale</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground max-w-lg mx-auto mt-2">
                  <p>I risultati verranno aggiornati in tempo reale man mano che le sezioni completeranno lo scrutinio.</p>
                  <p className="mt-1">Segui la diretta su <a href="https://elezioni.interno.gov.it" target="_blank" rel="noopener" className="text-primary underline">Eligendo</a> per i dati ufficiali del Ministero dell'Interno.</p>
                </div>
              </CardContent>
            </Card>

            {/* Struttura preparata per i risultati */}
            <div className="hidden grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-40 pointer-events-none">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Risultati per regione</CardTitle></CardHeader>
                <CardContent className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  In attesa dello scrutinio
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Avanzamento sezioni scrutinate</CardTitle></CardHeader>
                <CardContent className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  In attesa dello scrutinio
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="border-t border-border pt-4 pb-6 text-center space-y-2">
          <p className="text-[11px] text-muted-foreground">
            Dati: Eligendo (Ministero dell'Interno), Ipsos Doxa, YouTrend, Yoodata.{" "}
            Ultima rilevazione disponibile: {latestAffluenzaLabel}.
          </p>
          <p className="text-[11px] text-muted-foreground">
            I dati presentati hanno carattere informativo. Per i risultati ufficiali consultare{" "}
            <a href="https://elezioni.interno.gov.it" target="_blank" rel="noopener" className="text-primary underline">
              elezioni.interno.gov.it
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
