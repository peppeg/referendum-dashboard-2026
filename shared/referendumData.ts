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
  { ora: "19:00", percentuale: 38.9, sezioniPervenute: 61533, sezioniTotali: 61533, label: "Dom 19:00" },
  // I seguenti dati verranno aggiornati man mano
  // { ora: "23:00", percentuale: 0, sezioniPervenute: 0, sezioniTotali: 61533, label: "Dom 23:00" },
  // { ora: "15:00", percentuale: 0, sezioniPervenute: 0, sezioniTotali: 61533, label: "Lun 15:00" },
];

// Affluenza per regione — ore 12:00 del 22 Marzo
export interface AffluenzaRegione {
  regione: string;
  affluenzaOre12: number;
  affluenzaOre19: number | null;
  area: "Nord-Ovest" | "Nord-Est" | "Centro" | "Sud" | "Isole";
}

export const affluenzaRegioni: AffluenzaRegione[] = [
  { regione: "Emilia-Romagna", affluenzaOre12: 19.44, affluenzaOre19: 46.29, area: "Nord-Est" },
  { regione: "Lombardia", affluenzaOre12: 17.56, affluenzaOre19: 44.99, area: "Nord-Ovest" },
  { regione: "Toscana", affluenzaOre12: 16.90, affluenzaOre19: 44.70, area: "Centro" },
  { regione: "Veneto", affluenzaOre12: 17.06, affluenzaOre19: 43.23, area: "Nord-Est" },
  { regione: "Friuli Venezia Giulia", affluenzaOre12: 17.86, affluenzaOre19: 42.50, area: "Nord-Est" },
  { regione: "Umbria", affluenzaOre12: 14.37, affluenzaOre19: 42.13, area: "Centro" },
  { regione: "Liguria", affluenzaOre12: 17.49, affluenzaOre19: 41.96, area: "Nord-Ovest" },
  { regione: "Piemonte", affluenzaOre12: 14.42, affluenzaOre19: 41.57, area: "Nord-Ovest" },
  { regione: "Marche", affluenzaOre12: 15.63, affluenzaOre19: 41.29, area: "Centro" },
  { regione: "Lazio", affluenzaOre12: 16.28, affluenzaOre19: 41.22, area: "Centro" },
  { regione: "Abruzzo", affluenzaOre12: 14.07, affluenzaOre19: 39.19, area: "Centro" },
  { regione: "Valle d'Aosta", affluenzaOre12: 14.80, affluenzaOre19: 37.98, area: "Nord-Ovest" },
  { regione: "Trentino-Alto Adige", affluenzaOre12: 13.36, affluenzaOre19: 35.10, area: "Nord-Est" },
  { regione: "Sardegna", affluenzaOre12: 14.07, affluenzaOre19: 33.02, area: "Isole" },
  { regione: "Molise", affluenzaOre12: 11.48, affluenzaOre19: 32.61, area: "Sud" },
  { regione: "Puglia", affluenzaOre12: 12.13, affluenzaOre19: 30.96, area: "Sud" },
  { regione: "Basilicata", affluenzaOre12: 9.84, affluenzaOre19: 30.48, area: "Sud" },
  { regione: "Campania", affluenzaOre12: 10.95, affluenzaOre19: 29.92, area: "Sud" },
  { regione: "Calabria", affluenzaOre12: 9.74, affluenzaOre19: 29.34, area: "Sud" },
  { regione: "Sicilia", affluenzaOre12: 10.02, affluenzaOre19: 28.77, area: "Isole" },
];

// Affluenza principali città
export interface AffluenzaCitta {
  citta: string;
  affluenzaOre12: number;
  affluenzaOre19: number | null;
}

export const affluenzaCitta: AffluenzaCitta[] = [
  { citta: "Bologna", affluenzaOre12: 21.57, affluenzaOre19: 49.2 },
  { citta: "Firenze", affluenzaOre12: 20.47, affluenzaOre19: 48.3 },
  { citta: "Milano", affluenzaOre12: 17.09, affluenzaOre19: 45.7 },
  { citta: "Venezia", affluenzaOre12: 19.01, affluenzaOre19: 42.9 },
  { citta: "Roma", affluenzaOre12: 17.83, affluenzaOre19: 42.3 },
  { citta: "Genova", affluenzaOre12: 18.51, affluenzaOre19: 42.0 },
  { citta: "Torino", affluenzaOre12: 10.75, affluenzaOre19: 41.1 },
  { citta: "Bari", affluenzaOre12: 15.62, affluenzaOre19: 32.0 },
  { citta: "Napoli", affluenzaOre12: 12.15, affluenzaOre19: 29.5 },
  { citta: "Palermo", affluenzaOre12: 10.70, affluenzaOre19: null },
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
    affluenzaFinale: 0, // da aggiornare
    affluenzaOre12Giorno1: 14.92,
    risultato: "In corso",
    vincolante: "Senza quorum",
    descrizione: "Separazione delle carriere dei magistrati",
    siPercentuale: 0,
    noPercentuale: 0,
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
  { area: "Nord-Est", ore12: 17.7, ore19: 42.8, diff2025: "+9.2" },
  { area: "Nord-Ovest", ore12: 16.7, ore19: 42.9, diff2025: "+8.5" },
  { area: "Centro", ore12: 16.2, ore19: 41.5, diff2025: "+7.8" },
  { area: "Sud", ore12: 11.4, ore19: 30.6, diff2025: "+5.5" },
  { area: "Isole", ore12: 11.0, ore19: 30.1, diff2025: "+5.2" },
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
