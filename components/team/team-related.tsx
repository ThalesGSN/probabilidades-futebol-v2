import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import type { Team } from "@/lib/teams"

export function TeamRelated({
  current,
  others,
}: {
  current: Team
  others: Team[]
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Outros clubes
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-[1.05] tracking-tight lg:text-4xl">
              Compare com o resto da Série {current.division}.
            </h2>
          </div>
          <Link
            to={`/clubes#serie-${current.division.toLowerCase()}`}
            className="hidden items-center gap-1 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Todos os clubes
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {others.map((t) => (
            <li key={t.slug}>
              <Link
                to={`/times/${t.slug}`}
                className="group flex h-full flex-col justify-between gap-6 bg-card p-6 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="inline-block h-1 w-8 mb-3"
                      style={{ backgroundColor: t.brand }}
                      aria-hidden
                    />
                    <p className="font-serif text-2xl text-foreground">{t.shortName}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.city} · fund. {t.founded}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <Mini label="Posição" value={`${t.current.position}º`} />
                  <Mini label="Título" value={`${t.current.titleProb.toFixed(1)}%`} />
                  <Mini label="G4" value={`${t.current.g4Prob.toFixed(0)}%`} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-md border border-border bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">
              em breve
            </p>
            <p className="mt-2 font-serif text-2xl text-balance">
              Comparador de eras: {current.shortName} vs qualquer clube, em qualquer Brasileirão desde 2005.
            </p>
          </div>
          <button
            disabled
            className="rounded-sm border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 text-sm text-primary-foreground/80"
          >
            Notificar quando lançar
          </button>
        </div>
      </div>
    </section>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm tabular text-foreground">{value}</p>
    </div>
  )
}
