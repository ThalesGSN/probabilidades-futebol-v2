"use client"

import { useState } from "react"

// Cada linha é um clube, cada coluna é um ano (2005-2025)
// O valor representa a probabilidade média de título naquela temporada (%)
const years = Array.from({ length: 21 }, (_, i) => 2005 + i)

const clubs: { name: string; values: number[] }[] = [
  { name: "Palmeiras",     values: [12, 8, 6, 14, 10, 9, 4, 8, 11, 22, 28, 19, 16, 24, 31, 38, 26, 34, 29, 27, 33] },
  { name: "Flamengo",      values: [9, 11, 8, 7, 14, 12, 10, 13, 7, 9, 11, 8, 12, 22, 36, 29, 31, 24, 28, 22, 19] },
  { name: "Corinthians",   values: [18, 14, 5, 6, 12, 16, 22, 28, 15, 14, 31, 21, 14, 9, 7, 6, 8, 11, 10, 9, 12] },
  { name: "São Paulo",     values: [38, 32, 27, 18, 14, 12, 9, 11, 8, 7, 9, 11, 8, 6, 8, 11, 14, 16, 12, 14, 11] },
  { name: "Atlético-MG",   values: [4, 6, 5, 4, 6, 8, 7, 11, 22, 14, 8, 11, 9, 12, 14, 18, 32, 14, 12, 16, 21] },
  { name: "Fluminense",    values: [7, 8, 9, 14, 22, 18, 12, 26, 14, 8, 7, 9, 6, 8, 7, 9, 8, 11, 14, 12, 14] },
  { name: "Internacional", values: [11, 14, 18, 12, 14, 16, 14, 11, 9, 8, 11, 9, 6, 12, 14, 16, 18, 14, 11, 9, 11] },
  { name: "Grêmio",        values: [8, 11, 9, 11, 8, 7, 9, 11, 8, 9, 11, 14, 18, 11, 9, 7, 6, 11, 14, 11, 9] },
  { name: "Botafogo",      values: [3, 4, 6, 5, 4, 6, 5, 4, 5, 4, 3, 4, 5, 6, 4, 3, 4, 5, 19, 28, 18] },
  { name: "Cruzeiro",      values: [9, 12, 14, 11, 9, 8, 11, 14, 18, 24, 11, 9, 8, 6, 4, 3, 4, 5, 6, 8, 11] },
]

function intensity(value: number): { bg: string; text: string } {
  // Escala sequencial usando o verde-campo como anchor
  if (value < 5) return { bg: "oklch(0.93 0.012 95)", text: "var(--color-muted-foreground)" }
  if (value < 10) return { bg: "oklch(0.85 0.04 158)", text: "var(--color-foreground)" }
  if (value < 18) return { bg: "oklch(0.7 0.07 158)", text: "var(--color-foreground)" }
  if (value < 25) return { bg: "oklch(0.55 0.08 158)", text: "var(--color-primary-foreground)" }
  if (value < 32) return { bg: "oklch(0.42 0.08 158)", text: "var(--color-primary-foreground)" }
  return { bg: "oklch(0.3 0.07 158)", text: "var(--color-primary-foreground)" }
}

export function HistoricalHeatmap() {
  const [hover, setHover] = useState<{ club: string; year: number; value: number } | null>(null)

  return (
    <section id="historico" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Série histórica · 2005 — 2025
            </span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              Vinte anos. Um mapa de calor.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Cada célula representa a probabilidade média de título de um clube em uma temporada. As manchas
              escuras revelam os ciclos: a era Tricolor do começo do milênio, a hegemonia rubro-negra do fim da
              década de 2010, o renascimento alviverde.
            </p>

            <div className="mt-8 rounded-md border border-border bg-card p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Selecionado</p>
              {hover ? (
                <>
                  <p className="mt-1 font-serif text-xl text-foreground">{hover.club}</p>
                  <p className="font-mono text-xs text-muted-foreground">temporada {hover.year}</p>
                  <p className="mt-3 tabular font-serif text-4xl text-foreground">{hover.value}%</p>
                  <p className="text-xs text-muted-foreground">probabilidade média de título</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Passe o mouse sobre uma célula para inspecionar.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="tabular">0%</span>
              <div className="flex h-2 flex-1 overflow-hidden rounded-sm">
                {[5, 10, 18, 25, 32, 40].map((v) => (
                  <div key={v} className="flex-1" style={{ backgroundColor: intensity(v).bg }} />
                ))}
              </div>
              <span className="tabular">40%+</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="overflow-x-auto rounded-md border border-border bg-card p-5">
              <div className="min-w-[640px]">
                <div className="grid" style={{ gridTemplateColumns: `120px repeat(${years.length}, minmax(0, 1fr))` }}>
                  <div />
                  {years.map((y) => (
                    <div
                      key={y}
                      className="px-0.5 pb-2 text-center font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                    >
                      {y % 5 === 0 ? y : "·"}
                    </div>
                  ))}

                  {clubs.map((club) => (
                    <div key={club.name} className="contents">
                      <div className="flex items-center pr-3 text-xs text-foreground">{club.name}</div>
                      {club.values.map((v, i) => {
                        const c = intensity(v)
                        const year = years[i]
                        const isHover = hover?.club === club.name && hover?.year === year
                        return (
                          <button
                            key={`${club.name}-${year}`}
                            onMouseEnter={() => setHover({ club: club.name, year, value: v })}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover({ club: club.name, year, value: v })}
                            onBlur={() => setHover(null)}
                            className="m-px flex aspect-square items-center justify-center rounded-[2px] text-[9px] transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-accent"
                            style={{
                              backgroundColor: c.bg,
                              color: c.text,
                              outline: isHover ? "1px solid var(--color-accent)" : undefined,
                            }}
                            aria-label={`${club.name} em ${year}: ${v}%`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Fonte: simulações Monte Carlo · grupo Probabilidades no Futebol UFMG
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
