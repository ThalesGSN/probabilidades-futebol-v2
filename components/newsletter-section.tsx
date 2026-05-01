import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-md border border-border bg-card p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Boletim semanal</span>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-balance lg:text-4xl">
              As três maiores variações da semana, toda segunda no seu e-mail.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
              Curado por nossos pesquisadores. Sem spam. Cancele quando quiser.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="email" className="sr-only">
              Seu e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="flex-1 rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Assinar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
