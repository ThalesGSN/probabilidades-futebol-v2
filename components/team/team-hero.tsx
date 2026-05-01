import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { Team } from "@/lib/teams"

export function TeamHero({ team }: { team: Team }) {
  const { current } = team

  return (
    <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
      {/* Faixa de cor do clube — sutil, na parte superior */}
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: team.brand }} aria-hidden />

      {/* Grid de fundo */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary-foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Link
          href="/#times"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Todos os clubes
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-foreground/60">
              {team.city}, {team.state} · fundado em {team.founded}
            </p>
            <h1 className="mt-4 font-serif text-6xl leading-[0.95] tracking-tight text-balance lg:text-8xl">
              {team.shortName}
            </h1>
            <p className="mt-3 font-serif text-2xl italic text-primary-foreground/70 lg:text-3xl">
              {team.nickname}
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-primary-foreground/80 text-pretty">
              {team.bio}
            </p>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-primary-foreground/15 lg:pl-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
              Brasileirão 2026 · rodada 31 de 38
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-serif text-7xl leading-none tabular">
                {String(current.position).padStart(2, "0")}º
              </span>
              <div className="flex flex-col">
                <span className="text-2xl tabular text-primary-foreground/90">{current.points} pts</span>
                <span className="text-xs text-primary-foreground/60">posição atual</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-sm bg-primary-foreground/10">
              <Stat label="Título" value={current.titleProb} highlight />
              <Stat label="G4" value={current.g4Prob} />
              <Stat label="Rebaixamento" value={current.relegationProb} muted />
            </div>

            <p className="mt-4 text-xs text-primary-foreground/60">
              Pontuação esperada ao fim da temporada:{" "}
              <span className="tabular text-primary-foreground/90">
                {current.expectedPoints.toFixed(0)} pts
              </span>{" "}
              <span className="text-primary-foreground/40">
                ({current.pointsRange[0]}–{current.pointsRange[1]}, IC 95%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  highlight,
  muted,
}: {
  label: string
  value: number
  highlight?: boolean
  muted?: boolean
}) {
  return (
    <div className="bg-primary p-5">
      <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">{label}</p>
      <p
        className={`mt-2 font-serif text-3xl tabular ${
          highlight
            ? "text-accent"
            : muted
              ? "text-primary-foreground/50"
              : "text-primary-foreground"
        }`}
      >
        {value.toFixed(1)}
        <span className="ml-0.5 text-base text-primary-foreground/50">%</span>
      </p>
    </div>
  )
}
