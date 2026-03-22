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
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { useQuery } from "@tanstack/react-query";

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

async function fetchDashboardData() {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    refetchInterval: 15000,
  });

  const [expandedInfo, setExpandedInfo] = useState(false);

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
    timelineEventi,
    proiezioneYoodata,
    proiezioneIpsos
  } = data;

  const latestAffluenza = affluenzaTempoReale[affluenzaTempoReale.length - 1];

  // Chart data prep
  const regioniSorted = [...affluenzaRegioni].sort((a, b) => (b.affluenzaOre19 || b.affluenzaOre12) - (a.affluenzaOre19 || a.affluenzaOre12));

  const confrontoOre12 = referendumStorici.map((r: any) => ({
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
    fill: p.colore,
  }));

  const afflAreaChart = affluenzaPerArea.map((a: any) => ({
    area: a.area,
    affluenza: a.ore19 || a.ore12,
    fill: AREA_COLORS[a.area] || "#888",
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="w-8 h-8" aria-label="Logo Referendum">
                <rect x="2" y="2" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              </svg>
              <div>
                <h1 className="text-base font-bold leading-tight">Referendum Giustizia 2026</h1>
                <p className="text-xs text-muted-foreground">Dashboard in tempo reale</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Seggi aperti
            </Badge>
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
            label="Affluenza ore 19"
            value={`${latestAffluenza.percentuale}%`}
            sublabel={`Ore ${latestAffluenza.ora} — Dom 22 Mar | 61.533 sezioni`}
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
                    <MapPin className="w-4 h-4" /> Affluenza per area (ore 19)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={afflAreaChart} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="area" type="category" tick={{ fontSize: 11 }} width={80} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
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
                        <td className="py-1.5 px-2">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min((r.affluenzaOre19 || r.affluenzaOre12) / 50 * 100, 100)}%`,
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
                <CardTitle className="text-sm">Principali città — Ore 12 e Ore 19</CardTitle>
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
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
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
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="si" fill="hsl(145, 55%, 38%)" name="Sì %" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="no" fill="hsl(0, 72%, 50%)" name="No %" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 p-3 rounded-lg bg-secondary/50 space-y-1">
                    <p className="text-xs font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Insight chiave</p>
                    <p className="text-[11px] text-muted-foreground">
                      Con il 38.9% alle ore 19 di domenica, l'affluenza è già vicina allo scenario base Ipsos (42%). Con ancora le ore serali e tutto lunedì mattina, la proiezione Yoodata (~60%) appare realistica. Ad alta affluenza, i sondaggi convergono verso la parità o un leggero vantaggio del Sì.
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
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="si" stackId="a" fill="hsl(145, 55%, 38%)" name="Sì %" />
                      <Bar dataKey="no" stackId="a" fill="hsl(0, 72%, 50%)" name="No %" />
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
                  Alle ore 19 l'affluenza è al 38.9%, già più del doppio del 2025. Bologna sfiora il 50%, il Nord supera il 42%. La proiezione Yoodata di ~60% si sta confermando.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB RISULTATI */}
          <TabsContent value="risultati" className="space-y-6">
            <Card>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-40 pointer-events-none">
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
            Dati: Eligendo (Ministero dell'Interno), Ipsos Doxa, YouTrend, Yoodata.
            Ultimo aggiornamento: 22 Marzo 2026, ore 20:45 CET.
          </p>
          <p className="text-[11px] text-muted-foreground">
            I dati presentati hanno carattere informativo. Per i risultati ufficiali consultare{" "}
            <a href="https://elezioni.interno.gov.it" target="_blank" rel="noopener" className="text-primary underline">
              elezioni.interno.gov.it
            </a>
          </p>
          <PerplexityAttribution />
        </footer>
      </main>
    </div>
  );
}
