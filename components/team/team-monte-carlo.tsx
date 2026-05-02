import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { DistributionBucket, Team } from "@/lib/teams"

export function TeamMonteCarlo({
  team,
  data,
}: {
  team: Team
  data: DistributionBucket[]
}) {
  const [threshold, setThreshold] = useState(team.current.expectedPoints)

  const probAbove = useMemo(() => {
    return data.filter((d) => d.points >= threshold).reduce((s, d) => s + d.density, 0) * 100
  }, [data, threshold])

  const min = data[0]?.points ?? 0
  const max = data[data.length - 1]?.points ?? 100

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Distribuição de Monte Carlo
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              Onde o {team.shortName} pode terminar?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Cada barra é a frequência com que uma pontuação final apareceu nas dez mil simulações. Arraste o
              limiar abaixo e veja a chance do clube ultrapassar essa marca.
            </p>

            <div className="mt-8 rounded-md border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  P(pontos ≥ {Math.round(threshold)})
                </p>
                <p className="font-serif text-3xl tabular text-foreground">
                  {probAbove.toFixed(1)}
                  <span className="text-base text-muted-foreground">%</span>
                </p>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={1}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="mt-4 w-full accent-foreground"
                aria-label="Limiar de pontos"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>{min} pts</span>
                <span>{max} pts</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Cenário mais provável:{" "}
              <span className="tabular text-foreground">
                {team.current.expectedPoints.toFixed(0)} pts
              </span>{" "}
              — intervalo de 95%:{" "}
              <span className="tabular text-foreground">
                {team.current.pointsRange[0]}–{team.current.pointsRange[1]}
              </span>
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-md border border-border bg-card p-6 lg:p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                  <p className="font-serif text-xl text-foreground">Pontuação final simulada</p>
                  <p className="text-xs text-muted-foreground">
                    densidade sobre 10 000 cenários
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">↑ mais provável</p>
              </div>

              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: -16 }}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                    <XAxis
                      dataKey="points"
                      stroke="var(--color-muted-foreground)"
                      tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--color-border)" }}
                      label={{
                        value: "pontos",
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
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-background)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                      labelFormatter={(v) => `${v} pontos`}
                      formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "frequência"]}
                    />
                    <ReferenceLine
                      x={Math.round(threshold)}
                      stroke="var(--color-foreground)"
                      strokeDasharray="3 3"
                    />
                    <Bar dataKey="density" isAnimationActive={false}>
                      {data.map((d) => (
                        <Cell
                          key={d.points}
                          fill={d.points >= threshold ? team.brand : "var(--color-border)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
