import { useMemo, useState } from "react"
import type { HistoryPoint, Team } from "@/lib/teams"

export function TeamHistoryChart({
  team,
  data,
}: {
  team: Team
  data: HistoryPoint[]
}) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)

  const stats = useMemo(() => {
    const titles = data.filter((d) => d.champion).length
    const top4 = data.filter((d) => d.position <= 4).length
    const avg = data.reduce((s, d) => s + d.position, 0) / data.length
    const best = Math.min(...data.map((d) => d.position))
    return { titles, top4, avg, best }
  }, [data])

  const maxPosition = 20

  const hovered = hoveredYear ? data.find((d) => d.year === hoveredYear) : null

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Série histórica · 2005–2025
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
              21 temporadas em uma vista.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Cada barra representa a posição final do {team.shortName} no Brasileirão. Quanto mais alta, melhor a
              campanha. As barras destacadas em âmbar marcam os títulos.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6">
              <Stat label="Títulos" value={stats.titles.toString()} />
              <Stat label="Melhor posição" value={`${stats.best}º`} />
              <Stat label="Top 4" value={`${stats.top4}×`} />
              <Stat label="Posição média" value={stats.avg.toFixed(1)} />
            </dl>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-md border border-border bg-background p-6 lg:p-8">
              <div className="mb-8 flex items-baseline justify-between gap-4">
                <div>
                  {hovered ? (
                    <>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Brasileirão {hovered.year}
                      </p>
                      <p className="mt-1 font-serif text-2xl">
                        <span className="tabular">{hovered.position}º</span>
                        <span className="ml-3 text-base text-muted-foreground tabular">
                          {hovered.points} pontos
                        </span>
                        {hovered.champion && (
                          <span className="ml-3 rounded-sm bg-accent px-2 py-0.5 text-xs uppercase tracking-wider text-accent-foreground">
                            Campeão
                          </span>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        passe o cursor sobre uma temporada
                      </p>
                      <p className="mt-1 font-serif text-2xl text-muted-foreground">
                        Posição final por ano
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Gráfico de barras vertical inline (sem Recharts: melhor controle visual) */}
              <div
                className="relative flex h-[280px] items-end gap-[3px]"
                onMouseLeave={() => setHoveredYear(null)}
                role="img"
                aria-label={`Posições finais do ${team.shortName} de 2005 a 2025`}
              >
                {/* Linhas de referência */}
                {[1, 4, 8, 16, 20].map((pos) => (
                  <div
                    key={pos}
                    className="pointer-events-none absolute inset-x-0 flex items-center"
                    style={{ bottom: `${((maxPosition - pos) / (maxPosition - 1)) * 100}%` }}
                  >
                    <span className="font-mono text-[9px] text-muted-foreground/70 mr-2">{pos}º</span>
                    <div className="h-px flex-1 border-t border-dashed border-border" />
                  </div>
                ))}

                {data.map((d) => {
                  const heightPct = ((maxPosition - d.position + 1) / maxPosition) * 100
                  const isHovered = hoveredYear === d.year
                  const color = d.champion ? "var(--color-accent)" : team.brand
                  return (
                    <button
                      key={d.year}
                      onMouseEnter={() => setHoveredYear(d.year)}
                      onFocus={() => setHoveredYear(d.year)}
                      className="group relative flex flex-1 cursor-pointer flex-col items-center justify-end"
                      aria-label={`${d.year}: ${d.position}º lugar`}
                    >
                      <div
                        className="w-full transition-opacity"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: color,
                          opacity: hoveredYear === null ? 1 : isHovered ? 1 : 0.3,
                        }}
                      />
                    </button>
                  )
                })}
              </div>

              {/* Eixo X */}
              <div className="mt-3 flex gap-[3px] border-t border-border pt-2">
                {data.map((d) => (
                  <div key={d.year} className="flex flex-1 justify-center">
                    {d.year % 5 === 0 && (
                      <span className="font-mono text-[9px] text-muted-foreground">
                        &apos;{String(d.year).slice(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
                <Legend label="Campanha" color={team.brand} />
                <Legend label="Título" color="var(--color-accent)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-serif text-2xl tabular text-foreground">{value}</dd>
    </div>
  )
}

function Legend({ label, color }: { label: string; color: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-2.5 w-2.5" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
