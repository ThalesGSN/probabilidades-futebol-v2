import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { getTeamsByDivision } from "@/lib/teams"

export function TeamsIndex() {
  const teams = getTeamsByDivision("A")

  return (
    <section id="times" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Clubes</p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              Cada clube tem sua própria história nos números.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Páginas dedicadas com cardiograma da temporada, série histórica desde 2005, distribuição de
              Monte Carlo da pontuação final e calendário probabilístico dos próximos jogos.
            </p>
            <Link
              to="/clubes"
              className="group mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
            >
              Ver Série A e Série B completas
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ul className="lg:col-span-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            {teams.map((t) => (
              <li key={t.slug}>
                <Link
                  to={`/times/${t.slug}`}
                  className="group flex h-full items-center justify-between gap-6 bg-card p-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="block h-10 w-1"
                      style={{ backgroundColor: t.brand }}
                      aria-hidden
                    />
                    <div>
                      <p className="font-serif text-xl text-foreground">{t.shortName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.city} · {t.current.position}º · {t.current.points} pts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="hidden text-right sm:block">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Título
                      </p>
                      <p className="text-sm tabular text-foreground">
                        {t.current.titleProb.toFixed(1)}%
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
