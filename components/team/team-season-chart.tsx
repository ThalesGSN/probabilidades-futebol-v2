"use client"

import { useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { SeasonPoint, Team } from "@/lib/teams"

type Metric = "titleProb" | "g4Prob" | "relegationProb"

const metrics: { id: Metric; label: string; helper: string }[] = [
  { id: "titleProb", label: "Título", helper: "probabilidade de campeão" },
  { id: "g4Prob", label: "G4", helper: "vaga na Libertadores" },
  { id: "relegationProb", label: "Rebaixamento", helper: "risco de queda à Série B" },
]

export function TeamSeasonChart({
  team,
  data,
}: {
  team: Team
  data: SeasonPoint[]
}) {
  const [metric, setMetric] = useState<Metric>("titleProb")
  const lastValue = data[data.length - 1][metric]
  const showBand = metric === "titleProb"

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Cardiograma da temporada
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              A jornada do {team.nickname}, rodada por rodada.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Cada ponto é o resultado de 10 mil simulações de Monte Carlo após a rodada correspondente. A faixa
              clara indica o intervalo de confiança de 95% — quanto mais estreita, mais consenso há entre os
              cenários simulados.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {metrics.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetric(m.id)}
                  className={`rounded-sm border px-3 py-1.5 text-xs transition-colors ${
                    metric === m.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {metrics.find((m) => m.id === metric)?.helper}
            </p>

            <div className="mt-10 border-t border-border pt-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                após a rodada 31
              </p>
              <p className="mt-2 font-serif text-5xl tabular" style={{ color: team.brand }}>
                {lastValue.toFixed(1)}
                <span className="text-2xl text-muted-foreground">%</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-md border border-border bg-card p-6 lg:p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                  <p className="font-serif text-xl text-foreground">
                    {metrics.find((m) => m.id === metric)?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">probabilidade (%) por rodada</p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">10 000 simulações</p>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: -16 }}>
                    <defs>
                      <linearGradient id={`band-${team.slug}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={team.brand} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={team.brand} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                    <XAxis
                      dataKey="rodada"
                      stroke="var(--color-muted-foreground)"
                      tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--color-border)" }}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                      tickLine={false}
                      axisLine={false}
                      domain={metric === "relegationProb" ? [0, 30] : [0, 100]}
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
                        if (name === "titleHigh" || name === "titleLow") return [`${value.toFixed(1)}%`, "IC 95%"]
                        return [`${value.toFixed(1)}%`, team.shortName]
                      }}
                    />
                    {showBand && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="titleHigh"
                          stroke="none"
                          fill={`url(#band-${team.slug})`}
                          isAnimationActive={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="titleLow"
                          stroke="none"
                          fill="var(--color-card)"
                          isAnimationActive={false}
                        />
                      </>
                    )}
                    <Line
                      type="monotone"
                      dataKey={metric}
                      stroke={team.brand}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
