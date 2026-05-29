import { useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { useProbabilities } from "@/hooks/use-static-data"
import type { Division } from "@/lib/teams"
import type { TeamProbabilityRow } from "@/lib/brasileirao"

function useDivisionStats(division: Division) {
  const { data: probs } = useProbabilities(division)

  return useMemo(() => {
    if (!probs?.length) return null
    const sorted = [...probs].sort((a: TeamProbabilityRow, b: TeamProbabilityRow) => b.champion - a.champion)
    const leader = sorted[0]
    const currentRound = Math.max(...probs.map((p) => p.team.current.played ?? 0)) || null
    const relegationHigh = division === "A"
      ? probs.filter((p) => p.relegation > 50).length
      : null
    const accessHigh = division === "B"
      ? probs.filter((p) => p.libertadores > 50).length
      : null
    return { leader, currentRound, relegationHigh, accessHigh }
  }, [probs, division])
}

export function ChampionshipsGrid() {
  const statsA = useDivisionStats("A")
  const statsB = useDivisionStats("B")

  const leaderAProb = statsA?.leader?.champion ?? null
  const leaderBProb = statsB?.leader?.champion ?? null

  return (
    <section id="campeonatos" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Competições ativas</span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              Duas divisões. Um único método.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Nesta primeira versão, o observatório acompanha o Brasileirão Série A e o Brasileirão Série B —
              cobertos pelo mesmo modelo estatístico, com o mesmo cuidado editorial.
            </p>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          {/* Série A */}
          <Link
            to="/brasileirao"
            className="group relative flex flex-col justify-between gap-10 bg-background p-8 transition-colors hover:bg-card lg:p-10"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    2026 ·{" "}
                    {statsA?.currentRound
                      ? `Em curso · ${statsA.currentRound}ª rodada`
                      : "Em curso"}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight text-foreground lg:text-4xl">
                    Brasileirão Série A
                  </h3>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-baseline justify-between border-t border-border pt-5">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Favorito</p>
                  <p className="mt-0.5 text-base text-foreground">
                    {statsA?.leader?.team.shortName ?? "—"}
                  </p>
                </div>
                <p className="tabular font-serif text-4xl text-foreground">
                  {leaderAProb != null ? `${leaderAProb.toFixed(1).replace(".", ",")}%` : "—"}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Risco de rebaixamento concentrado
                </p>
                <p className="mt-0.5 text-base text-foreground">
                  {statsA?.relegationHigh != null
                    ? `${statsA.relegationHigh} clube${statsA.relegationHigh !== 1 ? "s" : ""} acima de 50%`
                    : "—"}
                </p>
              </div>
            </div>

            <span className="absolute left-0 top-0 h-full w-0.5 bg-accent" aria-hidden="true" />
          </Link>

          {/* Série B */}
          <Link
            to="/brasileirao"
            className="group relative flex flex-col justify-between gap-10 bg-background p-8 transition-colors hover:bg-card lg:p-10"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    2026 ·{" "}
                    {statsB?.currentRound
                      ? `Em curso · ${statsB.currentRound}ª rodada`
                      : "Em curso"}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight text-foreground lg:text-4xl">
                    Brasileirão Série B
                  </h3>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-baseline justify-between border-t border-border pt-5">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Favorito</p>
                  <p className="mt-0.5 text-base text-foreground">
                    {statsB?.leader?.team.shortName ?? "—"}
                  </p>
                </div>
                <p className="tabular font-serif text-4xl text-foreground">
                  {leaderBProb != null ? `${leaderBProb.toFixed(1).replace(".", ",")}%` : "—"}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Disputa pelo acesso
                </p>
                <p className="mt-0.5 text-base text-foreground">
                  {statsB?.accessHigh != null
                    ? `${statsB.accessHigh} clube${statsB.accessHigh !== 1 ? "s" : ""} com chance acima de 50%`
                    : "—"}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
