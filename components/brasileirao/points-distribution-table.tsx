import { Link } from "react-router-dom"
import type { Division } from "@/lib/teams"
import { usePointsDistribution } from "@/hooks/use-static-data"

const labels: Record<Division, { title: string; description: string }> = {
  A: {
    title: "Probabilidade por pontuação",
    description: "Para cada faixa de pontos finais, a chance de o clube terminar nela.",
  },
  B: {
    title: "Probabilidade por pontuação",
    description: "Distribuição da pontuação final em 10.000 simulações.",
  },
}

export function PointsDistributionTable({
  division,
  goal,
}: {
  division: Division
  goal: "champion" | "libertadores" | "sulamericana" | "relegation"
}) {
  const { data: rows, isLoading } = usePointsDistribution(division)

  if (isLoading || !rows) {
    return <div className="h-64 animate-pulse rounded-sm bg-muted" />
  }

  // Limiar didático associado ao "objetivo" da sub-aba.
  const thresholdByGoal: Record<typeof goal, number> = {
    champion: 75,
    libertadores: 65,
    sulamericana: 55,
    relegation: 45,
  }
  const threshold = thresholdByGoal[goal]

  // Faixas em comum
  const ranges = rows[0]?.buckets.map((b) => b.range) ?? []

  const cellShade = (prob: number) => {
    // Escala em verde-campo. 0..30%
    const v = Math.min(1, prob / 30)
    if (v < 0.04) return { background: "transparent", color: "var(--color-muted-foreground)", opacity: 0.35 }
    return {
      background: `color-mix(in oklab, var(--color-primary) ${Math.round(v * 70)}%, transparent)`,
      color: v > 0.55 ? "var(--color-primary-foreground)" : "var(--color-foreground)",
    }
  }

  const cumulativeAbove = (row: (typeof rows)[number], min: number) =>
    row.buckets.filter((b) => b.min >= min).reduce((s, b) => s + b.prob, 0)

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-wider text-foreground">Limiar do objetivo:</span>{" "}
        {threshold} pontos · a coluna em destaque mostra a chance acumulada de atingi-lo.
      </div>

      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="sticky left-0 z-10 bg-muted/40 px-4 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Clube
                </th>
                {ranges.map((r) => (
                  <th
                    key={r}
                    className="px-2.5 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {r}
                  </th>
                ))}
                <th className="bg-primary/10 px-3 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-wider text-foreground">
                  ≥ {threshold}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const acc = cumulativeAbove(row, threshold)
                return (
                  <tr key={row.team.slug} className="border-b border-border/60 last:border-0">
                    <td className="sticky left-0 z-10 bg-card px-4 py-2">
                      <Link
                        to={`/times/${row.team.slug}`}
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <span
                          aria-hidden
                          className="h-4 w-0.5 rounded-full"
                          style={{ backgroundColor: row.team.brand }}
                        />
                        <span className="font-medium text-foreground">{row.team.shortName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                          {row.expected.toFixed(0)}p
                        </span>
                      </Link>
                    </td>
                    {row.buckets.map((b) => (
                      <td
                        key={b.range}
                        className="px-1 py-1 text-center font-mono text-[11px] tabular-nums"
                      >
                        <div
                          className="mx-auto rounded-[2px] px-1.5 py-1.5"
                          style={cellShade(b.prob)}
                          title={`${b.range}: ${b.prob.toFixed(1)}%`}
                        >
                          {b.prob >= 0.5 ? b.prob.toFixed(0) : ""}
                        </div>
                      </td>
                    ))}
                    <td className="bg-primary/8 px-3 py-2 text-right font-mono text-[12px] font-medium tabular-nums text-foreground">
                      {acc.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border bg-muted/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {labels[division].description}
        </div>
      </div>
    </div>
  )
}
