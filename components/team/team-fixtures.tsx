import type { Fixture, Team } from "@/lib/teams"

export function TeamFixtures({
  team,
  data,
}: {
  team: Team
  data: Fixture[]
}) {
  const played = data.filter((f) => f.played)
  const upcoming = data.filter((f) => !f.played)

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Calendário · rodadas 27–34
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              O que já passou e o que vem por aí.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Resultados recentes ao lado das probabilidades dos próximos jogos. As barras horizontais mostram a
              divisão entre vitória, empate e derrota segundo o modelo do site.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border">
              <FixtureGroup title="Últimos resultados" fixtures={played} team={team} />
              <FixtureGroup title="Próximos jogos" fixtures={upcoming} team={team} probabilistic />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FixtureGroup({
  title,
  fixtures,
  team,
  probabilistic,
}: {
  title: string
  fixtures: Fixture[]
  team: Team
  probabilistic?: boolean
}) {
  return (
    <div className="bg-background">
      <div className="border-b border-border bg-background px-6 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      </div>
      <ul className="divide-y divide-border">
        {fixtures.map((f) => (
          <li key={`${f.rodada}-${f.opponent}`} className="px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="w-16 shrink-0">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  rodada {f.rodada}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(f.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>

              <div className="flex flex-1 items-center gap-3 text-sm">
                <span className={f.home ? "font-medium text-foreground" : "text-muted-foreground"}>
                  {f.home ? team.shortName : f.opponent}
                </span>
                <span className="font-mono text-xs text-muted-foreground">×</span>
                <span className={!f.home ? "font-medium text-foreground" : "text-muted-foreground"}>
                  {f.home ? f.opponent : team.shortName}
                </span>
              </div>

              {probabilistic ? (
                <div className="flex w-56 shrink-0 items-center gap-2">
                  <ProbBar
                    win={f.winProb ?? 0}
                    draw={f.drawProb ?? 0}
                    loss={f.lossProb ?? 0}
                    color={team.brand}
                  />
                </div>
              ) : (
                <div className="w-56 shrink-0 text-right">
                  {f.result && (
                    <span className="font-serif text-lg tabular text-foreground">
                      {f.home ? f.result.team : f.result.opponent}
                      <span className="mx-2 text-muted-foreground">–</span>
                      {f.home ? f.result.opponent : f.result.team}
                    </span>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProbBar({
  win,
  draw,
  loss,
  color,
}: {
  win: number
  draw: number
  loss: number
  color: string
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex h-1.5 w-full overflow-hidden rounded-sm bg-border">
        <div style={{ width: `${win}%`, backgroundColor: color }} />
        <div style={{ width: `${draw}%`, backgroundColor: "var(--color-muted-foreground)" }} />
        <div
          style={{ width: `${loss}%`, backgroundColor: "var(--color-border)", opacity: 1 }}
          className="bg-border"
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] tabular text-muted-foreground">
        <span style={{ color }}>{win.toFixed(0)}V</span>
        <span>{draw.toFixed(0)}E</span>
        <span>{loss.toFixed(0)}D</span>
      </div>
    </div>
  )
}
