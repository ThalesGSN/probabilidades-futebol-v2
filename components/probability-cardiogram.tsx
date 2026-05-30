import { useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useCardiogram } from "@/hooks/use-static-data"
import type { CardiogramTeam } from "@/hooks/use-static-data"

type Metric = "titulo" | "g4" | "rebaixamento"

const metrics: { id: Metric; label: string; helper: string }[] = [
  { id: "titulo", label: "Título", helper: "Probabilidade de campeão" },
  { id: "g4", label: "G4", helper: "Vaga na Libertadores" },
  { id: "rebaixamento", label: "Rebaixamento", helper: "Risco de queda à Série B" },
]

// Cores fixas para os primeiros N times (por ordem no JSON, que já vem sorted por title_prob)
const PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-4)",
  "var(--color-chart-3)",
  "var(--color-chart-2)",
  "var(--color-chart-5)",
]

const TOP_N = 4

function useCardiogramData(division: "A" | "B") {
  const { data } = useCardiogram(division)

  return useMemo(() => {
    if (!data?.teams?.length || !data?.series?.length) return null

    // Top N times por prob de título na última rodada disponível
    const lastPoint = data.series[data.series.length - 1]
    const ranked = [...data.teams]
      .sort((a, b) =>
        (lastPoint[`${b.slug}_titulo`] ?? 0) - (lastPoint[`${a.slug}_titulo`] ?? 0),
      )
      .slice(0, TOP_N)

    const teams: (CardiogramTeam & { color: string })[] = ranked.map((t, i) => ({
      ...t,
      color: PALETTE[i] ?? "var(--color-chart-1)",
    }))

    return { teams, series: data.series }
  }, [data])
}

export function ProbabilityCardiogram() {
  const [metric, setMetric] = useState<Metric>("titulo")
  const [activeTeams, setActiveTeams] = useState<string[] | null>(null)
  const cardiogram = useCardiogramData("A")

  const teams = cardiogram?.teams ?? []
  const series = cardiogram?.series ?? []

  // Inicializa activeTeams quando os dados chegam
  const effectiveActive = activeTeams ?? teams.map((t) => t.slug)

  const toggleTeam = (id: string) => {
    const current = activeTeams ?? teams.map((t) => t.slug)
    setActiveTeams(current.includes(id) ? current.filter((t) => t !== id) : [...current, id])
  }

  const currentMetricLabel = useMemo(() => metrics.find((m) => m.id === metric)?.label, [metric])

  const yDomain = useMemo((): [number, number] => {
    if (!series.length || !teams.length) return [0, 100]
    if (metric === "rebaixamento") {
      const max = Math.max(
        ...series.flatMap((p) => teams.map((t) => p[`${t.slug}_rebaixamento`] ?? 0)),
      )
      return [0, Math.min(100, Math.ceil(max * 1.3 / 5) * 5 || 20)]
    }
    return [0, 100]
  }, [series, teams, metric])

  const lastPoint = series[series.length - 1]

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
                {!cardiogram ? (
                  <div className="space-y-1.5">
                    {Array.from({ length: TOP_N }).map((_, i) => (
                      <div key={i} className="h-9 animate-pulse rounded-sm bg-muted" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {teams.map((t) => {
                      const active = effectiveActive.includes(t.slug)
                      const currentValue = lastPoint?.[`${t.slug}_${metric}`]
                      return (
                        <button
                          key={t.slug}
                          onClick={() => toggleTeam(t.slug)}
                          className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 text-sm transition-colors ${
                            active
                              ? "border-border bg-card text-foreground"
                              : "border-border/60 bg-transparent text-muted-foreground hover:bg-muted/40"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full transition-opacity"
                              style={{ backgroundColor: t.color, opacity: active ? 1 : 0.25 }}
                            />
                            {t.shortName}
                          </span>
                          <span className="tabular text-xs text-muted-foreground">
                            {currentValue != null ? `${currentValue.toFixed(1)}%` : "—"}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
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
                {!cardiogram ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-full w-full animate-pulse rounded bg-muted" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series} margin={{ top: 8, right: 16, bottom: 8, left: -16 }}>
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
                        domain={yDomain}
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
                          const team = teams.find((t) => name.startsWith(t.slug))
                          return [`${(value as number).toFixed(1)}%`, team?.shortName ?? name]
                        }}
                      />
                      {teams.map(
                        (t) =>
                          effectiveActive.includes(t.slug) && (
                            <Line
                              key={t.slug}
                              type="monotone"
                              dataKey={`${t.slug}_${metric}`}
                              stroke={t.color}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4, strokeWidth: 0 }}
                              isAnimationActive={false}
                              connectNulls
                            />
                          ),
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {series.length <= 1 && cardiogram && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  O gráfico ganha curvas a cada nova rodada processada pelo pipeline.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
