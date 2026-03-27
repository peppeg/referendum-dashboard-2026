// Referendum Costituzionale 22-23 Marzo 2026
// Dati di affluenza, storici e proiezioni

export const referendumInfo = {
  titolo: "Referendum Costituzionale sulla Giustizia",
  data: "22-23 Marzo 2026",
  tipo: "Confermativo (Art. 138 Cost.)",
  quorum: "Nessun quorum richiesto",
  oggetto: "Riforma Nordio — Separazione delle carriere dei magistrati",
  quesito: "Approvate il testo della legge costituzionale concernente «Norme in materia di ordinamento giurisdizionale e di istituzione della Corte disciplinare»?",
  aventiDiritto: 51424729,
  aventiDirittoEstero: 5477619,
  sezioniTotali: 61533,
  orariVoto: "Dom 22/03: 07:00–23:00 | Lun 23/03: 07:00–15:00",
  significatoSi: "La riforma entra in vigore: separazione carriere, due CSM, Alta Corte disciplinare",
  significatoNo: "La riforma è respinta: resta l'assetto costituzionale attuale",
};

export const puntiChiave = [
  {
    titolo: "Separazione delle carriere",
    descrizione: "Giudici e PM seguono percorsi distinti, senza possibilità di passaggio",
    icona: "split",
  },
  {
    titolo: "Due CSM separati",
    descrizione: "Un Consiglio per i giudici e uno per i PM, entrambi presieduti dal PdR",
    icona: "building",
  },
  {
    titolo: "Sorteggio componenti",
    descrizione: "I membri togati selezionati tramite sorteggio invece che per elezione",
    icona: "dice",
  },
  {
    titolo: "Alta Corte disciplinare",
    descrizione: "Nuovo organo autonomo per i procedimenti disciplinari dei magistrati",
    icona: "gavel",
  },
];

// Affluenza in tempo reale — Dati del 22 Marzo 2026
export interface AffluenzaRilevazione {
  ora: string;
  percentuale: number;
  sezioniPervenute: number;
  sezioniTotali: number;
  label: string;
}

export const affluenzaTempoReale: AffluenzaRilevazione[] = [
  { ora: "12:00", percentuale: 14.92, sezioniPervenute: 61533, sezioniTotali: 61533, label: "Dom 12:00" },
  { ora: "19:00", percentuale: 38.89, sezioniPervenute: 61533, sezioniTotali: 61533, label: "Dom 19:00" },
  { ora: "23:00", percentuale: 46.06, sezioniPervenute: 61533, sezioniTotali: 61533, label: "Dom 23:00" },
  { ora: "15:00", percentuale: 58.93, sezioniPervenute: 61531, sezioniTotali: 61533, label: "Lun 15:00" },
];

// Affluenza per regione — ore 12:00 del 22 Marzo
export interface AffluenzaRegione {
  regione: string;
  affluenzaOre12: number;
  affluenzaOre19: number | null;
  affluenzaOre23: number | null;
  affluenzaOre15: number | null;
  area: "Nord-Ovest" | "Nord-Est" | "Centro" | "Sud" | "Isole";
}

export const affluenzaRegioni: AffluenzaRegione[] = [
  { regione: "Emilia-Romagna", affluenzaOre12: 19.44, affluenzaOre19: 46.27, affluenzaOre23: 53.68, affluenzaOre15: 66.67, area: "Nord-Est" },
  { regione: "Lombardia", affluenzaOre12: 17.56, affluenzaOre19: 44.97, affluenzaOre23: 51.81, affluenzaOre15: 63.76, area: "Nord-Ovest" },
  { regione: "Toscana", affluenzaOre12: 16.90, affluenzaOre19: 44.69, affluenzaOre23: 52.49, affluenzaOre15: 66.27, area: "Centro" },
  { regione: "Veneto", affluenzaOre12: 17.06, affluenzaOre19: 43.22, affluenzaOre23: 50.55, affluenzaOre15: 63.47, area: "Nord-Est" },
  { regione: "Friuli Venezia Giulia", affluenzaOre12: 17.87, affluenzaOre19: 42.49, affluenzaOre23: 48.55, affluenzaOre15: 61.64, area: "Nord-Est" },
  { regione: "Umbria", affluenzaOre12: 14.37, affluenzaOre19: 42.12, affluenzaOre23: 50.11, affluenzaOre15: 65.06, area: "Centro" },
  { regione: "Liguria", affluenzaOre12: 17.49, affluenzaOre19: 41.96, affluenzaOre23: 48.14, affluenzaOre15: 62.24, area: "Nord-Ovest" },
  { regione: "Piemonte", affluenzaOre12: 14.42, affluenzaOre19: 41.57, affluenzaOre23: 48.94, affluenzaOre15: 62.61, area: "Nord-Ovest" },
  { regione: "Marche", affluenzaOre12: 15.64, affluenzaOre19: 41.29, affluenzaOre23: 49.42, affluenzaOre15: 63.77, area: "Centro" },
  { regione: "Lazio", affluenzaOre12: 16.28, affluenzaOre19: 41.20, affluenzaOre23: 48.22, affluenzaOre15: 61.69, area: "Centro" },
  { regione: "Abruzzo", affluenzaOre12: 14.07, affluenzaOre19: 39.19, affluenzaOre23: 46.56, affluenzaOre15: 60.50, area: "Centro" },
  { regione: "Valle d'Aosta", affluenzaOre12: 14.80, affluenzaOre19: 37.98, affluenzaOre23: 44.25, affluenzaOre15: 58.59, area: "Nord-Ovest" },
  { regione: "Trentino-Alto Adige", affluenzaOre12: 13.36, affluenzaOre19: 35.09, affluenzaOre23: 41.33, affluenzaOre15: 52.45, area: "Nord-Est" },
  { regione: "Sardegna", affluenzaOre12: 14.07, affluenzaOre19: 32.99, affluenzaOre23: 39.09, affluenzaOre15: 52.84, area: "Isole" },
  { regione: "Molise", affluenzaOre12: 11.49, affluenzaOre19: 32.63, affluenzaOre23: 39.81, affluenzaOre15: 54.03, area: "Sud" },
  { regione: "Puglia", affluenzaOre12: 12.13, affluenzaOre19: 30.97, affluenzaOre23: 39.02, affluenzaOre15: 52.03, area: "Sud" },
  { regione: "Basilicata", affluenzaOre12: 9.84, affluenzaOre19: 30.48, affluenzaOre23: 39.88, affluenzaOre15: 53.26, area: "Sud" },
  { regione: "Campania", affluenzaOre12: 10.95, affluenzaOre19: 29.90, affluenzaOre23: 37.77, affluenzaOre15: 50.38, area: "Sud" },
  { regione: "Calabria", affluenzaOre12: 9.74, affluenzaOre19: 29.34, affluenzaOre23: 35.68, affluenzaOre15: 48.38, area: "Sud" },
  { regione: "Sicilia", affluenzaOre12: 10.02, affluenzaOre19: 28.75, affluenzaOre23: 34.90, affluenzaOre15: 46.13, area: "Isole" },
];

// Affluenza principali città
export interface AffluenzaCitta {
  citta: string;
  affluenzaOre12: number;
  affluenzaOre19: number | null;
  affluenzaOre23: number | null;
  affluenzaOre15: number | null;
}

export const affluenzaCitta: AffluenzaCitta[] = [
  { citta: "Bologna", affluenzaOre12: 21.08, affluenzaOre19: 49.20, affluenzaOre23: 57.23, affluenzaOre15: 70.26 },
  { citta: "Firenze", affluenzaOre12: 18.78, affluenzaOre19: 48.33, affluenzaOre23: 56.41, affluenzaOre15: 70.05 },
  { citta: "Milano", affluenzaOre12: 17.29, affluenzaOre19: 45.69, affluenzaOre23: 53.19, affluenzaOre15: 64.60 },
  { citta: "Venezia", affluenzaOre12: 17.21, affluenzaOre19: 42.96, affluenzaOre23: 49.69, affluenzaOre15: 62.36 },
  { citta: "Roma", affluenzaOre12: 17.10, affluenzaOre19: 42.37, affluenzaOre23: 49.49, affluenzaOre15: 62.58 },
  { citta: "Genova", affluenzaOre12: 18.41, affluenzaOre19: 42.88, affluenzaOre23: 49.45, affluenzaOre15: 63.37 },
  { citta: "Torino", affluenzaOre12: 12.65, affluenzaOre19: 41.13, affluenzaOre23: 49.36, affluenzaOre15: 63.80 },
  { citta: "Bari", affluenzaOre12: 13.08, affluenzaOre19: 32.05, affluenzaOre23: 40.80, affluenzaOre15: 53.89 },
  { citta: "Napoli", affluenzaOre12: 11.14, affluenzaOre19: 29.47, affluenzaOre23: 37.18, affluenzaOre15: 49.29 },
  { citta: "Palermo", affluenzaOre12: 10.72, affluenzaOre19: 30.27, affluenzaOre23: 36.03, affluenzaOre15: 46.37 },
];

export interface RisultatiNazionali {
  stato: "in-attesa" | "in-corso" | "completato";
  siPercentuale: number | null;
  noPercentuale: number | null;
  sezioniScrutinate: number;
  sezioniTotali: number;
  percentualeSezioniScrutinate: number;
  ultimoAggiornamento: string | null;
}

export interface RisultatoRegione {
  regione: string;
  siPercentuale: number | null;
  noPercentuale: number | null;
  sezioniScrutinate: number;
  sezioniTotali: number;
  percentualeSezioniScrutinate: number;
  vincitore: "SI" | "NO" | "PARITA" | "N/D";
}

export const risultatiNazionali: RisultatiNazionali = {
  stato: "completato",
  siPercentuale: 46.25,
  noPercentuale: 53.75,
  sezioniScrutinate: 61533,
  sezioniTotali: referendumInfo.sezioniTotali,
  percentualeSezioniScrutinate: 100,
  ultimoAggiornamento: "26/03 17:32",
};

export const risultatiRegionali: RisultatoRegione[] = [
  { regione: "Piemonte", siPercentuale: 46.5, noPercentuale: 53.5, sezioniScrutinate: 4790, sezioniTotali: 4790, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Valle d'Aosta", siPercentuale: 48.19, noPercentuale: 51.81, sezioniScrutinate: 150, sezioniTotali: 150, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Lombardia", siPercentuale: 53.56, noPercentuale: 46.44, sezioniScrutinate: 9258, sezioniTotali: 9258, percentualeSezioniScrutinate: 100, vincitore: "SI" },
  { regione: "Trentino-Alto Adige", siPercentuale: 49.41, noPercentuale: 50.59, sezioniScrutinate: 1019, sezioniTotali: 1019, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Veneto", siPercentuale: 58.4, noPercentuale: 41.6, sezioniScrutinate: 4729, sezioniTotali: 4729, percentualeSezioniScrutinate: 100, vincitore: "SI" },
  { regione: "Friuli Venezia Giulia", siPercentuale: 54.47, noPercentuale: 45.53, sezioniScrutinate: 1354, sezioniTotali: 1354, percentualeSezioniScrutinate: 100, vincitore: "SI" },
  { regione: "Liguria", siPercentuale: 42.97, noPercentuale: 57.03, sezioniScrutinate: 1784, sezioniTotali: 1784, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Emilia-Romagna", siPercentuale: 42.74, noPercentuale: 57.26, sezioniScrutinate: 4525, sezioniTotali: 4525, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Toscana", siPercentuale: 41.83, noPercentuale: 58.17, sezioniScrutinate: 3923, sezioniTotali: 3923, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Umbria", siPercentuale: 48.32, noPercentuale: 51.68, sezioniScrutinate: 997, sezioniTotali: 997, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Marche", siPercentuale: 46.25, noPercentuale: 53.75, sezioniScrutinate: 1570, sezioniTotali: 1570, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Lazio", siPercentuale: 45.4, noPercentuale: 54.6, sezioniScrutinate: 5314, sezioniTotali: 5314, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Abruzzo", siPercentuale: 48.23, noPercentuale: 51.77, sezioniScrutinate: 1628, sezioniTotali: 1628, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Molise", siPercentuale: 45.3, noPercentuale: 54.7, sezioniScrutinate: 393, sezioniTotali: 393, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Campania", siPercentuale: 34.77, noPercentuale: 65.23, sezioniScrutinate: 5824, sezioniTotali: 5824, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Puglia", siPercentuale: 42.86, noPercentuale: 57.14, sezioniScrutinate: 4032, sezioniTotali: 4032, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Basilicata", siPercentuale: 39.97, noPercentuale: 60.03, sezioniScrutinate: 683, sezioniTotali: 683, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Calabria", siPercentuale: 42.74, noPercentuale: 57.26, sezioniScrutinate: 2407, sezioniTotali: 2407, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Sicilia", siPercentuale: 39.02, noPercentuale: 60.98, sezioniScrutinate: 5306, sezioniTotali: 5306, percentualeSezioniScrutinate: 100, vincitore: "NO" },
  { regione: "Sardegna", siPercentuale: 40.56, noPercentuale: 59.44, sezioniScrutinate: 1847, sezioniTotali: 1847, percentualeSezioniScrutinate: 100, vincitore: "NO" },
];

// Confronto con referendum precedenti
export interface ReferendumStorico {
  anno: number;
  nome: string;
  tipo: string;
  affluenzaFinale: number;
  affluenzaOre12Giorno1: number;
  risultato: string;
  vincolante: string;
  descrizione: string;
  siPercentuale: number;
  noPercentuale: number;
}

export const referendumStorici: ReferendumStorico[] = [
  {
    anno: 2001,
    nome: "Riforma Titolo V",
    tipo: "Costituzionale",
    affluenzaFinale: 34.05,
    affluenzaOre12Giorno1: 7.8,
    risultato: "Sì",
    vincolante: "Senza quorum",
    descrizione: "Modifica del Titolo V della Costituzione (poteri alle Regioni)",
    siPercentuale: 64.21,
    noPercentuale: 35.79,
  },
  {
    anno: 2006,
    nome: "Devolution",
    tipo: "Costituzionale",
    affluenzaFinale: 52.46,
    affluenzaOre12Giorno1: 10.1,
    risultato: "No",
    vincolante: "Senza quorum",
    descrizione: "Riforma della Parte II della Costituzione (Berlusconi)",
    siPercentuale: 38.71,
    noPercentuale: 61.29,
  },
  {
    anno: 2016,
    nome: "Riforma Renzi-Boschi",
    tipo: "Costituzionale",
    affluenzaFinale: 65.48,
    affluenzaOre12Giorno1: 20.1,
    risultato: "No",
    vincolante: "Senza quorum",
    descrizione: "Superamento del bicameralismo paritario, riduzione parlamentari",
    siPercentuale: 40.88,
    noPercentuale: 59.12,
  },
  {
    anno: 2020,
    nome: "Taglio parlamentari",
    tipo: "Costituzionale",
    affluenzaFinale: 51.12,
    affluenzaOre12Giorno1: 12.2,
    risultato: "Sì",
    vincolante: "Senza quorum",
    descrizione: "Riduzione del numero dei parlamentari",
    siPercentuale: 69.96,
    noPercentuale: 30.04,
  },
  {
    anno: 2026,
    nome: "Riforma Nordio",
    tipo: "Costituzionale",
    affluenzaFinale: 58.93,
    affluenzaOre12Giorno1: 14.92,
    risultato: "No",
    vincolante: "Senza quorum",
    descrizione: "Separazione delle carriere dei magistrati",
    siPercentuale: 46.25,
    noPercentuale: 53.75,
  },
];

// Sondaggi pre-voto
export interface Sondaggio {
  istituto: string;
  data: string;
  scenarioAffl: string;
  affluenzaStimata: number;
  siPerc: number;
  noPerc: number;
  incerti: number;
}

export const sondaggi: Sondaggio[] = [
  { istituto: "Ipsos Doxa", data: "5 Mar 2026", scenarioAffl: "Base (42%)", affluenzaStimata: 42, siPerc: 47.6, noPerc: 52.4, incerti: 7 },
  { istituto: "Ipsos Doxa", data: "5 Mar 2026", scenarioAffl: "Alto (49%)", affluenzaStimata: 49, siPerc: 50.2, noPerc: 49.8, incerti: 9 },
  { istituto: "YouTrend", data: "27 Feb 2026", scenarioAffl: "Bassa (46%)", affluenzaStimata: 46, siPerc: 46.9, noPerc: 53.1, incerti: 0 },
  { istituto: "YouTrend", data: "27 Feb 2026", scenarioAffl: "Alta (55%)", affluenzaStimata: 55.4, siPerc: 50.0, noPerc: 50.0, incerti: 0 },
  { istituto: "Yoodata", data: "22 Mar 2026", scenarioAffl: "Stima da aff. 12h", affluenzaStimata: 60, siPerc: 0, noPerc: 0, incerti: 0 },
];

// Propensione al voto per partito
export interface PropensionePartito {
  partito: string;
  colore: string;
  propensioneVoto: number;
  orientamentoSi: number;
  orientamentoNo: number;
  schieramento: "Centrodestra" | "Centrosinistra" | "Altro";
}

export const propensionePartiti: PropensionePartito[] = [
  { partito: "PD", colore: "#e03131", propensioneVoto: 63, orientamentoSi: 8, orientamentoNo: 92, schieramento: "Centrosinistra" },
  { partito: "FdI", colore: "#1c3f80", propensioneVoto: 59, orientamentoSi: 97, orientamentoNo: 3, schieramento: "Centrodestra" },
  { partito: "M5S", colore: "#f5c542", propensioneVoto: 57, orientamentoSi: 22, orientamentoNo: 78, schieramento: "Centrosinistra" },
  { partito: "AVS", colore: "#3aa848", propensioneVoto: 51, orientamentoSi: 5, orientamentoNo: 95, schieramento: "Centrosinistra" },
  { partito: "FI/NM", colore: "#0070c0", propensioneVoto: 45, orientamentoSi: 92, orientamentoNo: 8, schieramento: "Centrodestra" },
  { partito: "Lega", colore: "#008c45", propensioneVoto: 44, orientamentoSi: 81, orientamentoNo: 19, schieramento: "Centrodestra" },
  { partito: "Azione", colore: "#2b6cb0", propensioneVoto: 48, orientamentoSi: 35, orientamentoNo: 65, schieramento: "Altro" },
];

// Affluenza per area geografica (ore 12 e ore 19)
export const affluenzaPerArea = [
  { area: "Nord-Est", ore12: 17.76, ore19: 43.61, ore23: 50.73, ore15: 63.54, diff2025: "+9.2" },
  { area: "Nord-Ovest", ore12: 16.59, ore19: 43.55, ore23: 50.47, ore15: 63.20, diff2025: "+8.5" },
  { area: "Centro", ore12: 15.98, ore19: 42.05, ore23: 49.55, ore15: 63.38, diff2025: "+7.8" },
  { area: "Sud", ore12: 11.05, ore19: 30.23, ore23: 37.94, ore15: 50.77, diff2025: "+5.5" },
  { area: "Isole", ore12: 11.07, ore19: 29.84, ore23: 35.98, ore15: 47.86, diff2025: "+5.2" },
];

// Timeline degli eventi chiave
export const timelineEventi = [
  { data: "29 Mag 2024", evento: "CDM approva il DDL Nordio" },
  { data: "30 Ott 2025", evento: "Senato approva in via definitiva" },
  { data: "18 Nov 2025", evento: "Cassazione accoglie richieste referendum" },
  { data: "15 Gen 2026", evento: "Raggiunge 500.000 firme" },
  { data: "14 Gen 2026", evento: "DPR fissa data al 22-23 marzo" },
  { data: "6 Feb 2026", evento: "Cassazione accoglie nuovo quesito" },
  { data: "22-23 Mar 2026", evento: "Giornate di voto" },
];
