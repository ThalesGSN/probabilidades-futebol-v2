import { useMemo } from "react"
import { ArrowUpRight } from "lucide-react"
import { useProbabilities } from "@/hooks/use-static-data"
import type { TeamProbabilityRow } from "@/lib/brasileirao"

function formatPct(v: number) {
  return v.toFixed(1).replace(".", ",") + "%"
}

function ordinal(n: number) {
  return `${n}º`
}

function StatCard({
  label,
  team,
  value,
  sub,
}: {
  label: string
  team: string
  value: string
  sub: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-primary-foreground/60">{label}</p>
        <p className="mt-1 font-serif text-xl text-primary-foreground">{team}</p>
      </div>
      <div className="text-right">
        <p className="tabular font-serif text-3xl text-primary-foreground">{value}</p>
        <p className="mt-1 text-xs text-primary-foreground/60">{sub}</p>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-2.5 w-32 rounded bg-primary-foreground/10" />
        <div className="h-5 w-24 rounded bg-primary-foreground/10" />
      </div>
      <div className="h-8 w-16 rounded bg-primary-foreground/10" />
    </div>
  )
}

export function HeroSection() {
  const { data: probs } = useProbabilities("A")

  const currentRound = useMemo(() => {
    if (!probs?.length) return null
    return Math.max(...probs.map((p) => p.team.current.played ?? 0)) || null
  }, [probs])

  const byChampion = useMemo(
    () => probs ? [...probs].sort((a: TeamProbabilityRow, b: TeamProbabilityRow) => b.champion - a.champion) : null,
    [probs],
  )
  const byRelegation = useMemo(
    () => probs ? [...probs].sort((a: TeamProbabilityRow, b: TeamProbabilityRow) => b.relegation - a.relegation) : null,
    [probs],
  )
  const byLibertadores = useMemo(
    () => probs ? [...probs].sort((a: TeamProbabilityRow, b: TeamProbabilityRow) => b.libertadores - a.libertadores) : null,
    [probs],
  )

  const leader = byChampion?.[0]
  const libertadoresLeader = byLibertadores?.[0]
  const relegationLeader = byRelegation?.[0]

  const roundBadge = currentRound
    ? `Atualizado · ${ordinal(currentRound)} rodada`
    : "Atualizado · Brasileirão 2026"

  return (
    <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
      {/* Linhas decorativas tipo marcação de campo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute left-1/2 top-0 h-full w-px bg-primary-foreground" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-primary-foreground" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary-foreground/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {roundBadge}
            </div>

            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Onde a matemática encontra a paixão pelo futebol.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75 text-pretty">
              Há vinte anos, pesquisadores da UFMG calculam, rodada após rodada, as chances reais do seu time.
              Na v2, cada probabilidade vira um gráfico vivo — e cada gráfico, uma história.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="/brasileirao"
                className="group inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Ver o Brasileirão agora
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#metodologia"
                className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/30 px-5 py-3 text-sm text-primary-foreground/90 transition-colors hover:bg-primary-foreground/5"
              >
                Como calculamos
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
                Estado da temporada · Série A
              </span>
              {currentRound && (
                <span className="font-mono text-xs text-primary-foreground/60">
                  {currentRound} / 38
                </span>
              )}
            </div>

            <div className="divide-y divide-primary-foreground/10 rounded-md border border-primary-foreground/15 bg-primary-foreground/[0.04]">
              {!probs ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                <>
                  {leader && (
                    <StatCard
                      label="Favorito ao título"
                      team={leader.team.shortName}
                      value={formatPct(leader.champion)}
                      sub={`${ordinal(leader.team.current.position)} · ${leader.team.current.points} pts`}
                    />
                  )}
                  {libertadoresLeader && (
                    <StatCard
                      label="Favorito à Libertadores"
                      team={libertadoresLeader.team.shortName}
                      value={formatPct(libertadoresLeader.libertadores)}
                      sub={`${ordinal(libertadoresLeader.team.current.position)} · ${libertadoresLeader.team.current.points} pts`}
                    />
                  )}
                  {relegationLeader && (
                    <StatCard
                      label="Maior risco de rebaixamento"
                      team={relegationLeader.team.shortName}
                      value={formatPct(relegationLeader.relegation)}
                      sub={`${ordinal(relegationLeader.team.current.position)} · ${relegationLeader.team.current.points} pts`}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
