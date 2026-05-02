import { useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Metric = "titulo" | "g4" | "rebaixamento"

const metrics: { id: Metric; label: string; helper: string }[] = [
  { id: "titulo", label: "Título", helper: "Probabilidade de campeão" },
  { id: "g4", label: "G4", helper: "Vaga na Libertadores" },
  { id: "rebaixamento", label: "Rebaixamento", helper: "Risco de queda à Série B" },
]

const teams = [
  { id: "palmeiras", name: "Palmeiras", color: "var(--color-chart-1)" },
  { id: "flamengo", name: "Flamengo", color: "var(--color-chart-4)" },
  { id: "botafogo", name: "Botafogo", color: "var(--color-chart-3)" },
  { id: "atletico", name: "Atlético-MG", color: "var(--color-chart-2)" },
] as const

// Série fictícia mas plausível: 31 rodadas x 4 times x 3 métricas
// (em produção viria do pipeline diário de Monte Carlo)
// Usamos ruído determinístico (não Math.random) para evitar mismatch de hidratação SSR/CSR.
const noise = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x) - 0.5
}
const data = Array.from({ length: 31 }, (_, i) => {
  const r = i + 1
  const wave = (offset: number, amp: number, base: number) =>
    Math.max(0, Math.min(100, base + Math.sin((r + offset) / 3.2) * amp + noise(r + offset * 7) * 4))

  return {
    rodada: r,
    palmeiras_titulo: wave(0, 14, 28 + r * 0.4),
    flamengo_titulo: wave(2, 18, 32 - r * 0.2),
    botafogo_titulo: wave(5, 12, 18 + Math.sin(r / 4) * 6),
    atletico_titulo: wave(7, 10, 12 + r * 0.15),

    palmeiras_g4: wave(0, 8, 72 + r * 0.5),
    flamengo_g4: wave(2, 10, 78 - r * 0.1),
    botafogo_g4: wave(5, 12, 58 + r * 0.3),
    atletico_g4: wave(7, 14, 42 + r * 0.6),

    palmeiras_rebaixamento: wave(0, 1, 0.5),
    flamengo_rebaixamento: wave(2, 1, 0.7),
    botafogo_rebaixamento: wave(5, 2, 1.4),
    atletico_rebaixamento: wave(7, 3, 4),
  }
})

const annotations = [
  { rodada: 12, label: "Clássico paulista", team: "palmeiras" },
  { rodada: 22, label: "Troca de técnico", team: "flamengo" },
  { rodada: 28, label: "Lesão do artilheiro", team: "botafogo" },
]

export function ProbabilityCardiogram() {
  const [metric, setMetric] = useState<Metric>("titulo")
  const [activeTeams, setActiveTeams] = useState<string[]>(teams.map((t) => t.id))

  const toggleTeam = (id: string) => {
    setActiveTeams((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const currentMetricLabel = useMemo(() => metrics.find((m) => m.id === metric)?.label, [metric])

  return (
    <section id="brasileirao" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Cardiograma · Brasileirão 2026</span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              Cada rodada é um batimento.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Acompanhe como a probabilidade de cada time evolui ao longo da temporada. Selecione a métrica,
              compare clubes e observe os pontos de inflexão — vitórias, derrotas e episódios que mudaram o rumo
              do campeonato.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Métrica</p>
                <div className="flex flex-wrap gap-2">
                  {metrics.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMetric(m.id)}
                      className={`rounded-sm border px-3 py-1.5 text-xs transition-colors ${
                        metric === m.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {metrics.find((m) => m.id === metric)?.helper}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Clubes</p>
                <div className="space-y-1.5">
                  {teams.map((t) => {
                    const active = activeTeams.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTeam(t.id)}
                        className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 text-sm transition-colors ${
                          active
                            ? "border-border bg-card text-foreground"
                            : "border-border/60 bg-transparent text-muted-foreground hover:bg-muted/40"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full transition-opacity"
                            style={{
                              backgroundColor: t.color,
                              opacity: active ? 1 : 0.25,
                            }}
                          />
                          {t.name}
                        </span>
                        <span className="tabular text-xs text-muted-foreground">
                          {(data[data.length - 1] as Record<string, number>)[`${t.id}_${metric}`]?.toFixed(1)}%
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-md border border-border bg-card p-6 lg:p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                  <p className="font-serif text-xl text-foreground">{currentMetricLabel}</p>
                  <p className="text-xs text-muted-foreground">probabilidade (%) por rodada</p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">10 mil simulações · Monte Carlo</p>
              </div>

              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: -16 }}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                    <XAxis
                      dataKey="rodada"
                      stroke="var(--color-muted-foreground)"
                      tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--color-border)" }}
                      label={{
                        value: "rodada",
                        position: "insideBottom",
                        offset: -2,
                        style: { fontSize: 10, fill: "var(--color-muted-foreground)" },
                      }}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}`}
                      domain={metric === "rebaixamento" ? [0, 20] : [0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: "var(--font-sans)",
                      }}
                      labelFormatter={(v) => `Rodada ${v}`}
                      formatter={(value: number, name: string) => {
                        const team = teams.find((t) => name.startsWith(t.id))
                        return [`${value.toFixed(1)}%`, team?.name ?? name]
                      }}
                    />
                    {teams.map(
                      (t) =>
                        activeTeams.includes(t.id) && (
                          <Line
                            key={t.id}
                            type="monotone"
                            dataKey={`${t.id}_${metric}`}
                            stroke={t.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                            isAnimationActive={false}
                          />
                        ),
                    )}
                    {annotations
                      .filter((a) => activeTeams.includes(a.team))
                      .map((a) => {
                        const team = teams.find((t) => t.id === a.team)
                        const point = data[a.rodada - 1] as Record<string, number>
                        const y = point[`${a.team}_${metric}`]
                        if (y === undefined) return null
                        return (
                          <ReferenceDot
                            key={`${a.rodada}-${a.team}`}
                            x={a.rodada}
                            y={y}
                            r={4}
                            fill="var(--color-accent)"
                            stroke="var(--color-card)"
                            strokeWidth={2}
                          />
                        )
                      })}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
                {annotations.map((a) => {
                  const team = teams.find((t) => t.id === a.team)
                  return (
                    <div key={a.label} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          rodada {a.rodada} · {team?.name}
                        </p>
                        <p className="text-sm text-foreground">{a.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
