import Link from "next/link"

const groups = [
  {
    title: "Competições",
    links: ["Brasileirão Série A", "Brasileirão Série B"],
  },
  {
    title: "Explorar",
    links: ["Cardiograma", "Série histórica", "Bump chart", "Comparador de eras", "Distribuição Monte Carlo"],
  },
  {
    title: "Instituto",
    links: ["Sobre o grupo", "Equipe", "Publicações acadêmicas", "Metodologia", "Imprensa"],
  },
  {
    title: "Recursos",
    links: ["API", "Aplicativo móvel", "Newsletter", "RSS", "Contato"],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <span className="font-serif text-xl leading-none">π</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg text-foreground">Probabilidades no Futebol</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">UFMG · desde 2005</span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
              Um observatório estatístico mantido pelo Departamento de Estatística da Universidade Federal de Minas
              Gerais. Pesquisa, divulgação científica e paixão pelo futebol.
            </p>

            <div className="mt-6 flex flex-col gap-1 text-xs text-muted-foreground">
              <span>ICEx · UFMG</span>
              <span>Av. Antônio Carlos, 6627 — Pampulha</span>
              <span>Belo Horizonte / MG</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="text-xs uppercase tracking-[0.18em] text-foreground">{g.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l}>
                      <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2005–2026 Probabilidades no Futebol · Universidade Federal de Minas Gerais</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">
              Termos
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacidade
            </Link>
            <Link href="#" className="hover:text-foreground">
              Acessibilidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
