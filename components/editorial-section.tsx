import { ArrowUpRight } from "lucide-react"

const articles = [
  {
    kicker: "Análise · 31ª rodada",
    title: "Como o Palmeiras virou o favorito quase imperceptivelmente",
    excerpt:
      "Há cinco rodadas, três clubes ainda dividiam a liderança probabilística. Uma sequência de jogos discretos — e estatisticamente decisivos — mudou tudo.",
    author: "Bernardo Costa",
    date: "28 abr 2026",
    readTime: "8 min",
    featured: true,
  },
  {
    kicker: "Histórico",
    title: "O Brasileirão mais imprevisível do século",
    excerpt: "Comparando a entropia das probabilidades de título em todas as edições desde 2003.",
    author: "Mariana Andrade",
    date: "22 abr 2026",
    readTime: "6 min",
  },
  {
    kicker: "Metodologia",
    title: "Por que 10 mil simulações?",
    excerpt: "Um exercício didático sobre convergência e a Lei dos Grandes Números aplicada ao futebol.",
    author: "Prof. Roger Silva",
    date: "15 abr 2026",
    readTime: "5 min",
  },
]

export function EditorialSection() {
  const featured = articles.find((a) => a.featured)
  const rest = articles.filter((a) => !a.featured)

  return (
    <section id="editorial" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Editorial</span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              Os números têm histórias para contar.
            </h2>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-2 self-start text-sm text-foreground transition-colors hover:text-primary lg:self-end"
          >
            Ver todas as publicações
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
          {featured && (
            <article className="group relative bg-background p-8 lg:col-span-2 lg:p-10">
              <div className="flex h-full flex-col justify-between gap-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{featured.kicker}</p>
                  <h3 className="mt-4 font-serif text-3xl leading-[1.1] tracking-tight text-foreground text-balance lg:text-4xl">
                    {featured.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="text-foreground">{featured.author}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </div>
            </article>
          )}

          <div className="grid gap-px bg-border">
            {rest.map((a) => (
              <article key={a.title} className="group flex flex-col justify-between gap-6 bg-background p-7 transition-colors hover:bg-card">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{a.kicker}</p>
                  <h3 className="mt-3 font-serif text-xl leading-tight text-foreground text-balance">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">{a.excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <span className="text-foreground">{a.author}</span> · {a.readTime}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
