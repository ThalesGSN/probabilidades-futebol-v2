import { ArrowUpRight } from "lucide-react"

const championships = [
  {
    name: "Brasileirão Série A",
    season: "2026",
    status: "Em curso · 31ª rodada",
    leader: "Palmeiras",
    leaderProb: "38,4%",
    secondary: { label: "Risco de rebaixamento concentrado", value: "4 clubes acima de 50%" },
    accent: true,
  },
  {
    name: "Brasileirão Série B",
    season: "2026",
    status: "Em curso · 28ª rodada",
    leader: "Coritiba",
    leaderProb: "26,1%",
    secondary: { label: "Disputa pelo acesso", value: "9 clubes com chance > 20%" },
  },
  {
    name: "Campeonato Mineiro",
    season: "2026",
    status: "Encerrado",
    leader: "Atlético-MG",
    leaderProb: "100%",
    secondary: { label: "Probabilidade no início do mata-mata", value: "32,7%" },
  },
  {
    name: "Libertadores",
    season: "2026",
    status: "Quartas de final",
    leader: "Flamengo",
    leaderProb: "21,3%",
    secondary: { label: "Brasileiros vivos", value: "3 de 8" },
  },
  {
    name: "Sul-Americana",
    season: "2026",
    status: "Oitavas de final",
    leader: "Independiente",
    leaderProb: "14,8%",
    secondary: { label: "Maior outsider", value: "Lanús · 11,2%" },
  },
  {
    name: "Copa do Mundo",
    season: "2026",
    status: "Fase de grupos",
    leader: "França",
    leaderProb: "16,9%",
    secondary: { label: "Brasil", value: "12,4%" },
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
              Seis campeonatos. Um único método.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Do Mineiro à Copa do Mundo, todas as competições compartilham a mesma fundação estatística e o
              mesmo cuidado editorial. Escolha onde mergulhar.
            </p>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {championships.map((c) => (
            <a
              key={c.name}
              href="#"
              className="group relative flex flex-col justify-between gap-8 bg-background p-7 transition-colors hover:bg-card"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.season} · {c.status}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl leading-tight text-foreground">{c.name}</h3>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Favorito</p>
                    <p className="mt-0.5 text-sm text-foreground">{c.leader}</p>
                  </div>
                  <p className="tabular font-serif text-3xl text-foreground">{c.leaderProb}</p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.secondary.label}</p>
                  <p className="mt-0.5 text-sm text-foreground">{c.secondary.value}</p>
                </div>
              </div>

              {c.accent && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-accent" aria-hidden="true" />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
