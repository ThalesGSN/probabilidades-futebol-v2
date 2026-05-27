import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import type { Division } from "@/lib/teams"
import { useProbabilities } from "@/hooks/use-static-data"

type Column = "champion" | "libertadores" | "sulamericana" | "relegation"

const labels: Record<
  Division,
  { champion: string; libertadores: string; sulamericana: string; relegation: string }
> = {
  A: {
    champion: "Campeão",
    libertadores: "Libertadores",
    sulamericana: "Sulamericana",
    relegation: "Rebaixamento",
  },
  B: {
    champion: "Campeão",
    libertadores: "Acesso à Série A",
    sulamericana: "Disputa de acesso",
    relegation: "Rebaixamento",
  },
}

export function TeamProbabilitiesTable({
  division,
  highlight,
}: {
  division: Division
  highlight: Column
}) {
  const { data, isLoading } = useProbabilities(division)

  if (isLoading || !data) {
    return <div className="h-64 animate-pulse rounded-sm bg-muted" />
  }

  const rows = [...data].sort((a, b) => b[highlight] - a[highlight])
  const l = labels[division]

  const cellClass = (col: Column, value: number) => {
    const isFocus = col === highlight
    const intensity = Math.min(1, value / 100)
    const danger = col === "relegation" && value >= 10
    const success = (col === "champion" && value >= 20) || (col === "libertadores" && value >= 60)

    if (isFocus) {
      if (danger) return `bg-destructive/10 text-destructive font-medium`
      if (success) return `bg-accent/15 text-accent-foreground font-medium`
      return `bg-primary/8 text-foreground font-medium`
    }
    return value < 0.1 ? "text-muted-foreground/40" : "text-muted-foreground"
  }

  const formatPct = (n: number) => {
    if (n >= 99.95) return "—"
    if (n < 0.1) return "<0.1"
    return n.toFixed(1)
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Clube
              </th>
              {(["champion", "libertadores", "sulamericana", "relegation"] as Column[]).map((c) => (
                <th
                  key={c}
                  className={`px-4 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${
                    c === highlight ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {l[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.team.slug}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/times/${row.team.slug}`}
                    className="group inline-flex items-center gap-2.5"
                  >
                    <span
                      aria-hidden
                      className="h-5 w-1 rounded-full"
                      style={{ backgroundColor: row.team.brand }}
                    />
                    <span className="font-medium text-foreground group-hover:underline">
                      {row.team.shortName}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" />
                  </Link>
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${cellClass("champion", row.champion)}`}>
                  {formatPct(row.champion)}
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${cellClass("libertadores", row.libertadores)}`}>
                  {formatPct(row.libertadores)}
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${cellClass("sulamericana", row.sulamericana)}`}>
                  {formatPct(row.sulamericana)}
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${cellClass("relegation", row.relegation)}`}>
                  {formatPct(row.relegation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border bg-muted/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Valores em % · 10.000 simulações de Monte Carlo</span>
        <span className="ml-auto">Atualizado há 2 horas</span>
      </div>
    </div>
  )
}
