import {
  affluenzaCitta,
  affluenzaPerArea,
  affluenzaRegioni,
  affluenzaTempoReale,
  puntiChiave,
  propensionePartiti,
  referendumInfo,
  risultatiNazionali,
  risultatiRegionali,
  referendumStorici,
  sondaggi,
  timelineEventi,
  type AffluenzaCitta,
  type AffluenzaRegione,
  type AffluenzaRilevazione,
  type PropensionePartito,
  type ReferendumStorico,
  type RisultatiNazionali,
  type RisultatoRegione,
  type Sondaggio,
} from "./referendumData.js";

export type DashboardData = {
  referendumInfo: {
    titolo: string;
    data: string;
    tipo: string;
    quorum: string;
    oggetto: string;
    quesito: string;
    aventiDiritto: number;
    aventiDirittoEstero: number;
    sezioniTotali: number;
    orariVoto: string;
    significatoSi: string;
    significatoNo: string;
  };
  puntiChiave: Array<{
    titolo: string;
    descrizione: string;
    icona: string;
  }>;
  affluenzaTempoReale: AffluenzaRilevazione[];
  affluenzaRegioni: AffluenzaRegione[];
  affluenzaCitta: AffluenzaCitta[];
  referendumStorici: ReferendumStorico[];
  sondaggi: Sondaggio[];
  propensionePartiti: PropensionePartito[];
  affluenzaPerArea: Array<{
    area: string;
    ore12: number;
    ore19: number;
    ore23: number;
    diff2025: string;
  }>;
  risultatiNazionali: RisultatiNazionali;
  risultatiRegionali: RisultatoRegione[];
  timelineEventi: Array<{
    data: string;
    evento: string;
  }>;
  proiezioneYoodata: number;
  proiezioneIpsos: number;
};

export type DashboardDataPatch = Partial<DashboardData> & {
  referendumInfo?: Partial<DashboardData["referendumInfo"]>;
  risultatiNazionali?: Partial<DashboardData["risultatiNazionali"]>;
};

export const dashboardSeedData: DashboardData = {
  referendumInfo,
  puntiChiave,
  affluenzaTempoReale: [...affluenzaTempoReale],
  affluenzaRegioni: [...affluenzaRegioni],
  affluenzaCitta: [...affluenzaCitta],
  referendumStorici: [...referendumStorici],
  sondaggi,
  propensionePartiti,
  affluenzaPerArea: [...affluenzaPerArea],
  risultatiNazionali: { ...risultatiNazionali },
  risultatiRegionali: [...risultatiRegionali],
  timelineEventi,
  proiezioneYoodata: 60,
  proiezioneIpsos: 49,
};

export function isDashboardData(value: unknown): value is DashboardData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const info = candidate.referendumInfo;

  return (
    !!info &&
    typeof info === "object" &&
    typeof (info as Record<string, unknown>).titolo === "string" &&
    Array.isArray(candidate.affluenzaTempoReale) &&
    Array.isArray(candidate.affluenzaRegioni) &&
    Array.isArray(candidate.affluenzaCitta) &&
    Array.isArray(candidate.referendumStorici) &&
    Array.isArray(candidate.sondaggi) &&
    Array.isArray(candidate.propensionePartiti) &&
    Array.isArray(candidate.affluenzaPerArea) &&
    !!candidate.risultatiNazionali &&
    typeof candidate.risultatiNazionali === "object" &&
    Array.isArray(candidate.risultatiRegionali) &&
    Array.isArray(candidate.timelineEventi)
  );
}

export function mergeDashboardData(
  base: DashboardData,
  patch: DashboardDataPatch,
): DashboardData {
  return {
    ...base,
    ...patch,
    referendumInfo: patch.referendumInfo
      ? {
          ...base.referendumInfo,
          ...patch.referendumInfo,
        }
      : base.referendumInfo,
    puntiChiave: patch.puntiChiave ?? base.puntiChiave,
    affluenzaTempoReale: patch.affluenzaTempoReale ?? base.affluenzaTempoReale,
    affluenzaRegioni: patch.affluenzaRegioni ?? base.affluenzaRegioni,
    affluenzaCitta: patch.affluenzaCitta ?? base.affluenzaCitta,
    referendumStorici: patch.referendumStorici ?? base.referendumStorici,
    sondaggi: patch.sondaggi ?? base.sondaggi,
    propensionePartiti: patch.propensionePartiti ?? base.propensionePartiti,
    affluenzaPerArea: patch.affluenzaPerArea ?? base.affluenzaPerArea,
    risultatiNazionali: patch.risultatiNazionali
      ? {
          ...base.risultatiNazionali,
          ...patch.risultatiNazionali,
        }
      : base.risultatiNazionali,
    risultatiRegionali: patch.risultatiRegionali ?? base.risultatiRegionali,
    timelineEventi: patch.timelineEventi ?? base.timelineEventi,
    proiezioneYoodata: patch.proiezioneYoodata ?? base.proiezioneYoodata,
    proiezioneIpsos: patch.proiezioneIpsos ?? base.proiezioneIpsos,
  };
}
