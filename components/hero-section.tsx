import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"

const liveStats = [
  {
    label: "Líder em probabilidade de título",
    team: "Palmeiras",
    value: "38,4%",
    delta: "+4,1 p.p.",
    trend: "up" as const,
  },
  {
    label: "Maior queda da rodada",
    team: "Internacional",
    value: "9,7%",
    delta: "−6,2 p.p.",
    trend: "down" as const,
  },
  {
    label: "Em risco de rebaixamento",
    team: "Vitória",
    value: "71,8%",
    delta: "+3,5 p.p.",
    trend: "up" as const,
  },
]

export function HeroSection() {
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
              Atualizado após a 31ª rodada · há 2h
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
                href="#brasileirao"
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
              <span className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">Estado da rodada</span>
              <span className="font-mono text-xs text-primary-foreground/60">31 / 38</span>
            </div>

            <div className="divide-y divide-primary-foreground/10 rounded-md border border-primary-foreground/15 bg-primary-foreground/[0.04]">
              {liveStats.map((stat) => (
                <div key={stat.team} className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-primary-foreground/60">{stat.label}</p>
                    <p className="mt-1 font-serif text-xl text-primary-foreground">{stat.team}</p>
                  </div>
                  <div className="text-right">
                    <p className="tabular font-serif text-3xl text-primary-foreground">{stat.value}</p>
                    <div
                      className={`mt-1 inline-flex items-center gap-1 text-xs ${
                        stat.trend === "up" ? "text-accent" : "text-primary-foreground/60"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="tabular">{stat.delta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
