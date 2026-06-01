import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import type { Division } from "@/lib/teams"
import { computeStandingsFromResults, type StandingMode, type StandingRow } from "@/lib/brasileirao"
import { useStandings, useMatchResults, useTeams } from "@/hooks/use-static-data"
import { Slider } from "@/components/ui/slider"

const modeLabels: Record<StandingMode, string> = {
  geral: "Classificação geral",
  "ultimas-10": "Últimas {n} rodadas",
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
  const [range, setRange] = useState<[number, number]>([1, 38])
  const [rangeStart, rangeEnd] = range

  const { data: standingsJson, isLoading: standingsLoading } = useStandings(division)
  const { data: results, isLoading: resultsLoading } = useMatchResults(division)
  const { data: allTeams, isLoading: teamsLoading } = useTeams()

  const maxRound = results && results.length > 0
    ? results.reduce((max, r) => Math.max(max, r.round), 0)
    : 0

  useEffect(() => {
    if (maxRound > 0) {
      setRange([Math.max(1, maxRound - 9), maxRound])
    }
  }, [maxRound])

  const divisionTeams = allTeams?.filter((t) => t.division === division) ?? []

  const isLoading = mode === "ultimas-10"
    ? resultsLoading || teamsLoading
    : standingsLoading

  let rows: StandingRow[] = []
  if (mode === "ultimas-10") {
    if (results && divisionTeams.length > 0) {
      rows = computeStandingsFromResults(results, divisionTeams as never, range)
    }
  } else if (standingsJson) {
    rows = standingsJson[mode] ?? []
  }

  const footerLabel =
    mode === "ultimas-10"
      ? `Rodadas ${rangeStart}–${rangeEnd} · ${rangeEnd - rangeStart + 1} jogos`
      : modeLabels[mode]

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

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-sm bg-muted" />
  }

  if (mode === "ultimas-10" && results?.length === 0) {
    return (
      <div className="rounded-sm border border-border bg-card px-6 py-12 text-center">
        <p className="font-serif text-lg text-foreground">Resultados ainda não disponíveis</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta visão é gerada a partir dos resultados individuais de cada partida,
          que serão carregados na próxima execução do pipeline.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {mode === "ultimas-10" && (
        <div className="rounded-sm border border-border bg-card px-4 py-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Janela de rodadas
            </span>
            <span className="font-mono text-sm tabular-nums text-foreground">
              Rodada {rangeStart} — {rangeEnd}
            </span>
          </div>
          <Slider
            min={1}
            max={maxRound || 38}
            step={1}
            value={range}
            onValueChange={(v) => {
              if (v[0] < v[1]) setRange([v[0], v[1]])
            }}
            minStepsBetweenThumbs={1}
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>Rd. 1</span>
            <span>{rangeEnd - rangeStart + 1} rodada{rangeEnd - rangeStart + 1 !== 1 ? "s" : ""}</span>
            <span>Rd. {maxRound || 38}</span>
          </div>
        </div>
      )}
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
                    to={`/times/${row.team.slug}`}
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
        <span>{footerLabel}</span>
        <span className="ml-auto">
          {division === "A"
            ? "Verde · G6 · Vermelho · Z4"
            : "Âmbar · G4 acesso · Vermelho · Z4"}
        </span>
      </div>
      </div>
    </div>
  )
}
