import { GraduationCap, Mail } from "lucide-react"

type Member = {
  name: string
  role: string
  area: string
  bio: string
  email?: string
  lattes?: string
  founder?: boolean
}

const members: Member[] = [
  {
    name: "Bernardo Nunes Borges de Lima",
    role: "Coordenador",
    area: "Probabilidade",
    bio: "Professor titular do Departamento de Matemática da UFMG. Idealizou o projeto Probabilidades no Futebol em 2005, traduzindo modelos estocásticos para o público esportivo.",
    email: "bnblima@mat.ufmg.br",
    founder: true,
  },
  {
    name: "Marcelo Richard Hilário",
    role: "Pesquisador",
    area: "Processos Estocásticos",
    bio: "Doutor em Matemática pelo IMPA. Trabalha com percolação, sistemas de partículas e a calibração dos modelos por trás das probabilidades de classificação.",
    email: "mhilario@mat.ufmg.br",
  },
  {
    name: "Rémy Sanchis",
    role: "Pesquisador",
    area: "Estatística Aplicada",
    bio: "Pesquisa em mecânica estatística e métodos de Monte Carlo. Responsável pelas simulações de longo prazo que alimentam as projeções rodada a rodada.",
    email: "rsanchis@mat.ufmg.br",
  },
  {
    name: "Roger William Câmara Silva",
    role: "Pesquisador",
    area: "Probabilidade",
    bio: "Estuda processos de ramificação e modelos de competição. Cuida da metodologia de força relativa entre clubes e dos pesos por mando de campo.",
    email: "rogerwcs@mat.ufmg.br",
  },
  {
    name: "Daniel Ungaretti",
    role: "Pesquisador",
    area: "Combinatória Probabilística",
    bio: "Doutor em Matemática pelo IMPA. Atua na validação dos cenários e na construção das séries históricas que comparam temporadas desde 2005.",
    email: "ungaretti@mat.ufmg.br",
  },
  {
    name: "Equipe de Iniciação Científica",
    role: "Bolsistas",
    area: "Graduação e Pós",
    bio: "Estudantes da UFMG que mantêm a base de resultados, automatizam a coleta de dados rodada a rodada e desenvolvem as visualizações deste portal.",
  },
]

function Initials({ name }: { name: string }) {
  const parts = name.split(" ").filter(Boolean)
  const initials = (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-card font-serif text-lg tracking-tight text-foreground">
      {initials.toUpperCase()}
    </div>
  )
}

export function OurTeamSection() {
  return (
    <section id="nosso-time" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Nosso time
            </span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-foreground text-balance lg:text-5xl">
              Pesquisadores do Departamento de Matemática da UFMG.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Desde 2005, um grupo de probabilistas mantém este observatório como projeto de extensão.
              Não somos uma redação esportiva — somos cientistas que traduzem modelos matemáticos para
              quem ama futebol.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                ICEx · UFMG
              </span>
              <span>20 anos de projeto</span>
              <span>Belo Horizonte · MG</span>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {members.map((m) => (
              <li
                key={m.name}
                className="flex flex-col gap-4 bg-card p-6 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start gap-4">
                  <Initials name={m.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {m.role}
                      </span>
                      {m.founder ? (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent-foreground">
                          Fundador
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-1 font-serif text-lg leading-tight tracking-tight text-foreground text-balance">
                      {m.name}
                    </h3>
                    <span className="mt-0.5 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                      {m.area}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{m.bio}</p>
                {m.email ? (
                  <a
                    href={`mailto:${m.email}`}
                    className="group mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{m.email}</span>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
