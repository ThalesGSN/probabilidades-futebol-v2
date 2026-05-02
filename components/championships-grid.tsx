import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

const championships = [
  {
    name: "Brasileirão Série A",
    href: "/clubes#serie-a",
    season: "2026",
    status: "Em curso · 31ª rodada",
    leader: "Palmeiras",
    leaderProb: "38,4%",
    secondary: { label: "Risco de rebaixamento concentrado", value: "4 clubes acima de 50%" },
    accent: true,
  },
  {
    name: "Brasileirão Série B",
    href: "/clubes#serie-b",
    season: "2026",
    status: "Em curso · 28ª rodada",
    leader: "Coritiba",
    leaderProb: "26,1%",
    secondary: { label: "Disputa pelo acesso", value: "9 clubes com chance > 20%" },
  },
]

export function ChampionshipsGrid() {
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
          {championships.map((c) => (
            <Link
              key={c.name}
              to={c.href}
              className="group relative flex flex-col justify-between gap-10 bg-background p-8 transition-colors hover:bg-card lg:p-10"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.season} · {c.status}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl leading-tight text-foreground lg:text-4xl">
                      {c.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-baseline justify-between border-t border-border pt-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Favorito</p>
                    <p className="mt-0.5 text-base text-foreground">{c.leader}</p>
                  </div>
                  <p className="tabular font-serif text-4xl text-foreground">{c.leaderProb}</p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.secondary.label}</p>
                  <p className="mt-0.5 text-base text-foreground">{c.secondary.value}</p>
                </div>
              </div>

              {c.accent && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-accent" aria-hidden="true" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
