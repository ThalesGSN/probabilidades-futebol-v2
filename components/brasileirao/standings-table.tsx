"use client"

import Link from "next/link"
import type { Division } from "@/lib/teams"
import { getStandings, type StandingMode } from "@/lib/brasileirao"

const modeLabels: Record<StandingMode, string> = {
  geral: "Classificação geral",
  "ultimas-10": "Últimas 10 rodadas",
  mandante: "Como mandante",
  visitante: "Como visitante",
  turno: "1º turno",
  returno: "2º turno",
}

export function StandingsTable({
  division,
  mode,
}: {
  division: Division
  mode: StandingMode
}) {
  const rows = getStandings(division, mode)

  // Faixas visuais por divisão
  const zoneColor = (pos: number) => {
    if (division === "A") {
      if (pos <= 4) return "border-l-2 border-l-primary"
      if (pos <= 6) return "border-l-2 border-l-primary/40"
      if (pos >= 17) return "border-l-2 border-l-destructive"
      return "border-l-2 border-l-transparent"
    }
    if (pos <= 4) return "border-l-2 border-l-accent"
    if (pos >= 17) return "border-l-2 border-l-destructive"
    return "border-l-2 border-l-transparent"
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Clube
              </th>
              {["P", "J", "V", "E", "D", "GP", "GC", "SG"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.team.slug}
                className={`border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30 ${zoneColor(row.position)}`}
              >
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground tabular-nums">
                  {String(row.position).padStart(2, "0")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/times/${row.team.slug}`}
                    className="inline-flex items-center gap-2.5 hover:underline"
                  >
                    <span
                      aria-hidden
                      className="h-5 w-1 rounded-full"
                      style={{ backgroundColor: row.team.brand }}
                    />
                    <span className="font-medium text-foreground">{row.team.shortName}</span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-right font-medium tabular-nums">{row.points}</td>
                <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">{row.played}</td>
                <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">{row.wins}</td>
                <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">{row.draws}</td>
                <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">{row.losses}</td>
                <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">{row.goalsFor}</td>
                <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">{row.goalsAgainst}</td>
                <td
                  className={`px-3 py-3 text-right tabular-nums ${
                    row.goalDiff > 0
                      ? "text-foreground"
                      : row.goalDiff < 0
                        ? "text-destructive/80"
                        : "text-muted-foreground"
                  }`}
                >
                  {row.goalDiff > 0 ? "+" : ""}
                  {row.goalDiff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border bg-muted/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{modeLabels[mode]}</span>
        <span className="ml-auto">
          {division === "A"
            ? "Verde · G6 · Vermelho · Z4"
            : "Âmbar · G4 acesso · Vermelho · Z4"}
        </span>
      </div>
    </div>
  )
}
