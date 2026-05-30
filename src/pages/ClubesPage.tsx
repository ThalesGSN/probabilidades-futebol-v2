import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { Team } from "@/lib/teams"
import { useDocumentTitle } from "@/src/hooks/use-document-title"
import { useTeams, useMetadata } from "@/hooks/use-static-data"
import { formatGeneratedAt } from "@/lib/format-date"

export function ClubesPage() {
  useDocumentTitle("Clubes — Probabilidades no Futebol UFMG")

  const { data: allTeams } = useTeams()
  const serieA = (allTeams?.filter((t) => t.division === "A") ?? []).sort(
    (a, b) => a.current.position - b.current.position,
  )
  const serieB = (allTeams?.filter((t) => t.division === "B") ?? []).sort(
    (a, b) => a.current.position - b.current.position,
  )
  const { data: metaA } = useMetadata("A")
  const { data: metaB } = useMetadata("B")
  const updatedAtA = metaA?.generatedAt ? formatGeneratedAt(metaA.generatedAt) : null
  const updatedAtB = metaB?.generatedAt ? formatGeneratedAt(metaB.generatedAt) : null

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero da página de índice */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
                Índice de clubes · Brasileirão 2026
              </p>
              <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-balance lg:text-7xl">
                Cada clube. Cada número. Cada história.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 text-pretty lg:text-lg">
                Selecione um clube para abrir sua página dedicada com cardiograma da temporada, série
                histórica desde 2005, distribuição de Monte Carlo da pontuação final e calendário
                probabilístico das próximas rodadas.
              </p>
            </div>
            <div className="lg:col-span-5 lg:border-l lg:border-primary-foreground/15 lg:pl-10">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-2">
                <Stat label="Série A" value={String(serieA.length).padStart(2, "0")} />
                <Stat label="Série B" value={String(serieB.length).padStart(2, "0")} />
                <Stat label="Temporadas" value="21" sub="2005 — 2026" />
                <Stat label="Simulações" value="10k" sub="por rodada" />
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Série A */}
      <DivisionSection
        id="serie-a"
        eyebrow="Primeira divisão"
        title="Série A"
        description="Os 20 clubes que disputam o título do Brasileirão, vagas na Libertadores e a luta contra o rebaixamento."
        teams={serieA}
        accent="primary"
        updatedAt={updatedAtA}
      />

      {/* Série B */}
      <DivisionSection
        id="serie-b"
        eyebrow="Segunda divisão"
        title="Série B"
        description="Os 20 clubes que brigam pelas quatro vagas de acesso à elite e tentam evitar a queda à Série C."
        teams={serieB}
        accent="accent"
        updatedAt={updatedAtB}
      />

      <SiteFooter />
    </main>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-4xl tabular leading-none text-primary-foreground">{value}</dd>
      {sub && <p className="mt-1 text-xs text-primary-foreground/60">{sub}</p>}
    </div>
  )
}

function DivisionSection({
  id,
  eyebrow,
  title,
  description,
  teams,
  accent,
  updatedAt,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  teams: Team[]
  accent: "primary" | "accent"
  updatedAt?: string | null
}) {
  const accentBar = accent === "primary" ? "bg-primary" : "bg-accent"
  const accentText = accent === "primary" ? "text-primary" : "text-accent"

  return (
    <section id={id} className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <header className="grid gap-8 border-b border-border pb-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className={`inline-block h-2 w-10 ${accentBar}`} aria-hidden />
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </p>
            </div>
            <h2 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-balance lg:text-6xl">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-2">
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>{teams.length > 0 ? `${teams.length.toString().padStart(2, "0")} clubes` : "— clubes"}</span>
              {updatedAt && <><span aria-hidden>·</span><span>Atualizado em {updatedAt}</span></>}
              <span aria-hidden>·</span>
              <span className={accentText}>10.000 simulações</span>
            </div>
          </div>
        </header>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {teams.length === 0 && Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <div className="flex h-[148px] flex-col gap-4 bg-card p-6 animate-pulse">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-6 w-36 rounded bg-muted" />
                <div className="mt-auto flex gap-6">
                  <div className="h-3 w-12 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
              </div>
            </li>
          ))}
          {teams.map((t) => (
            <li key={t.slug}>
              <Link
                to={`/times/${t.slug}`}
                className="group relative flex h-full flex-col gap-6 bg-card p-6 transition-colors hover:bg-muted/40"
              >
                <span
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: t.brand }}
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-4 pl-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {t.current.position.toString().padStart(2, "0")}º · {t.state}
                    </p>
                    <p className="mt-1 font-serif text-2xl leading-tight text-foreground">{t.shortName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.nickname} · fund. {t.founded}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-border pt-4 pl-3">
                  <Mini label="Pontos" value={t.current.points.toString()} />
                  <Mini
                    label="Título"
                    value={`${t.current.titleProb.toFixed(1)}%`}
                    highlight={t.current.titleProb >= 20}
                  />
                  <Mini
                    label={t.division === "A" ? "Rebaix." : "Acesso"}
                    value={
                      t.division === "A"
                        ? `${t.current.relegationProb.toFixed(1)}%`
                        : `${t.current.g4Prob.toFixed(0)}%`
                    }
                    danger={t.division === "A" && t.current.relegationProb >= 10}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Mini({
  label,
  value,
  highlight,
  danger,
}: {
  label: string
  value: string
  highlight?: boolean
  danger?: boolean
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-0.5 text-sm tabular ${
          danger ? "text-destructive" : highlight ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
