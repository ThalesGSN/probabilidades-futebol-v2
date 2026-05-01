import { ArrowRight } from "lucide-react"

const steps = [
  {
    n: "01",
    title: "Estimar a força",
    body: "Cada clube recebe um parâmetro de ataque e defesa, ajustado por máxima verossimilhança a partir do histórico recente.",
  },
  {
    n: "02",
    title: "Modelar o placar",
    body: "Os gols de uma partida seguem distribuições de Poisson independentes, condicionadas pelas forças e pelo mando de campo.",
  },
  {
    n: "03",
    title: "Simular o futuro",
    body: "Dez mil cenários são gerados rodada a rodada. A probabilidade de cada evento é a frequência com que ele ocorre.",
  },
]

export function MethodologyTeaser() {
  return (
    <section id="metodologia" className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
              Metodologia
            </span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              Sem mistério. Apenas matemática.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-primary-foreground/75 text-pretty">
              Toda probabilidade publicada aqui é produto de um modelo público, revisado por pares e atualizado
              diariamente. O mesmo método aplicado por professores da UFMG desde 2005 — refinado, transparente
              e aberto à inspeção.
            </p>

            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 border-b border-primary-foreground/30 pb-1 text-sm text-primary-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Ler a documentação completa
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="lg:col-span-7">
            <ol className="divide-y divide-primary-foreground/10 border-y border-primary-foreground/10">
              {steps.map((s) => (
                <li key={s.n} className="grid gap-4 py-7 sm:grid-cols-12 sm:gap-8">
                  <span className="font-mono text-xs text-primary-foreground/50 sm:col-span-2">{s.n}</span>
                  <div className="sm:col-span-10">
                    <h3 className="font-serif text-2xl text-primary-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70 text-pretty">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-md border border-primary-foreground/15 bg-primary-foreground/[0.04] p-6">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/60">
                Modelo de gols
              </p>
              <p className="mt-3 font-serif text-2xl text-primary-foreground">
                {"P(X = k) = (λ"}
                <sup className="text-sm">k</sup>
                {" e"}
                <sup className="text-sm">−λ</sup>
                {") / k!"}
              </p>
              <p className="mt-3 text-xs text-primary-foreground/60">
                Distribuição de Poisson para a contagem de gols por equipe em uma partida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
