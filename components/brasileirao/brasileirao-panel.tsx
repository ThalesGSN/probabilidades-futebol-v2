"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { Division } from "@/lib/teams"
import type { StandingMode, StatKey } from "@/lib/brasileirao"
import { TeamProbabilitiesTable } from "@/components/brasileirao/team-probabilities-table"
import { PointsDistributionTable } from "@/components/brasileirao/points-distribution-table"
import { StandingsTable } from "@/components/brasileirao/standings-table"
import { NextRoundTable } from "@/components/brasileirao/next-round-table"
import { StatsRanking } from "@/components/brasileirao/stats-ranking"

type SectionKey =
  | "prob-time"
  | "prob-pontuacao"
  | "classificacao"
  | "proxima-rodada"
  | "estatisticas"

type ItemKey = string

type Section = {
  key: SectionKey
  label: string
  items: { key: ItemKey; label: string; labelB?: string }[]
}

const SECTIONS: Section[] = [
  {
    key: "prob-time",
    label: "Probabilidades por time",
    items: [
      { key: "champion", label: "Campeão" },
      { key: "libertadores", label: "Libertadores", labelB: "Acesso à Série A" },
      { key: "sulamericana", label: "Sulamericana", labelB: "Disputa de acesso" },
      { key: "relegation", label: "Rebaixamento" },
    ],
  },
  {
    key: "prob-pontuacao",
    label: "Probabilidade por pontuação",
    items: [
      { key: "champion", label: "Campeão" },
      { key: "libertadores", label: "Libertadores", labelB: "Acesso à Série A" },
      { key: "sulamericana", label: "Sulamericana", labelB: "Disputa de acesso" },
      { key: "relegation", label: "Rebaixamento" },
    ],
  },
  {
    key: "classificacao",
    label: "Classificação",
    items: [
      { key: "geral", label: "Classificação geral" },
      { key: "ultimas-10", label: "Últimas 10 rodadas" },
      { key: "mandante", label: "Como mandante" },
      { key: "visitante", label: "Como visitante" },
      { key: "turno", label: "Classificação do turno" },
      { key: "returno", label: "Classificação do returno" },
    ],
  },
  {
    key: "proxima-rodada",
    label: "Próxima rodada",
    items: [
      { key: "fixtures", label: "Tabela da próxima rodada" },
      { key: "probabilities", label: "Tabela de probabilidades" },
    ],
  },
  {
    key: "estatisticas",
    label: "Estatísticas",
    items: [
      { key: "vitorias", label: "Sequência de vitórias" },
      { key: "derrotas", label: "Sequência de derrotas" },
      { key: "invencibilidade", label: "Sequência de invencibilidade" },
      { key: "sem-vitorias", label: "Sequência sem vitórias" },
      { key: "melhor-ataque", label: "Melhor ataque" },
      { key: "melhor-defesa", label: "Melhor defesa" },
    ],
  },
]

const sectionDescriptions: Record<SectionKey, string> = {
  "prob-time": "Probabilidades agregadas por clube em cada cenário do campeonato.",
  "prob-pontuacao": "Distribuição da pontuação final de cada clube em 10.000 simulações.",
  classificacao: "A tabela do Brasileirão sob diferentes recortes.",
  "proxima-rodada": "Jogos e probabilidades da próxima rodada.",
  estatisticas: "Rankings e marcas da temporada em curso.",
}

export function BrasileiraoPanel() {
  const [division, setDivision] = useState<Division>("A")
  const [section, setSection] = useState<SectionKey>("prob-time")
  const [item, setItem] = useState<ItemKey>("champion")

  const currentSection = SECTIONS.find((s) => s.key === section)!
  const currentItem = currentSection.items.find((i) => i.key === item) ?? currentSection.items[0]

  const onSelectItem = (sectionKey: SectionKey, itemKey: ItemKey) => {
    setSection(sectionKey)
    setItem(itemKey)
  }

  const onSelectSection = (sectionKey: SectionKey) => {
    const target = SECTIONS.find((s) => s.key === sectionKey)!
    setSection(sectionKey)
    setItem(target.items[0].key)
  }

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Cabeçalho editorial */}
        <div className="max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Painel · Brasileirão 2025
          </span>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-pretty md:text-5xl">
            Brasileirão em todas as suas dimensões.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
            Probabilidades, classificações e estatísticas das duas divisões do Campeonato Brasileiro,
            atualizadas diariamente após cada rodada.
          </p>
        </div>

        {/* Tabs principais Série A / Série B */}
        <div
          role="tablist"
          aria-label="Divisão"
          className="mt-10 inline-flex items-center gap-0 rounded-sm border border-border bg-card p-1"
        >
          {(["A", "B"] as const).map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={division === d}
              onClick={() => setDivision(d)}
              className={`relative px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                division === d
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Série {d}
            </button>
          ))}
        </div>

        {/* Layout sidebar + conteúdo */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-7 border-l border-border pl-5">
              {SECTIONS.map((s) => (
                <div key={s.key}>
                  <button
                    onClick={() => onSelectSection(s.key)}
                    className={`block text-left font-serif text-base leading-tight transition-colors ${
                      section === s.key ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                  <ul className="mt-2 space-y-1.5">
                    {s.items.map((it) => {
                      const active = section === s.key && item === it.key
                      const label = division === "B" && it.labelB ? it.labelB : it.label
                      return (
                        <li key={it.key}>
                          <button
                            onClick={() => onSelectItem(s.key, it.key)}
                            className={`block text-left text-sm leading-snug transition-colors ${
                              active
                                ? "font-medium text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {active && <span aria-hidden>· </span>}
                            {label}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Sidebar — mobile (select grouped) */}
          <div className="lg:hidden">
            <label htmlFor="section-select" className="sr-only">
              Selecione a categoria
            </label>
            <div className="relative">
              <select
                id="section-select"
                value={`${section}::${item}`}
                onChange={(e) => {
                  const [s, i] = e.target.value.split("::") as [SectionKey, ItemKey]
                  setSection(s)
                  setItem(i)
                }}
                className="w-full appearance-none rounded-sm border border-border bg-card px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {SECTIONS.map((s) => (
                  <optgroup key={s.key} label={s.label}>
                    {s.items.map((it) => {
                      const label = division === "B" && it.labelB ? it.labelB : it.label
                      return (
                        <option key={`${s.key}::${it.key}`} value={`${s.key}::${it.key}`}>
                          {label}
                        </option>
                      )
                    })}
                  </optgroup>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="min-w-0">
            <div className="border-b border-border pb-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {currentSection.label}
              </span>
              <h2 className="mt-1 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
                {division === "B" && currentItem.labelB ? currentItem.labelB : currentItem.label}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {sectionDescriptions[section]}
              </p>
            </div>

            <div className="mt-6">
              {section === "prob-time" && (
                <TeamProbabilitiesTable
                  division={division}
                  highlight={item as "champion" | "libertadores" | "sulamericana" | "relegation"}
                />
              )}
              {section === "prob-pontuacao" && (
                <PointsDistributionTable
                  division={division}
                  goal={item as "champion" | "libertadores" | "sulamericana" | "relegation"}
                />
              )}
              {section === "classificacao" && (
                <StandingsTable division={division} mode={item as StandingMode} />
              )}
              {section === "proxima-rodada" && (
                <NextRoundTable
                  division={division}
                  variant={item === "probabilities" ? "probabilities" : "fixtures"}
                />
              )}
              {section === "estatisticas" && (
                <StatsRanking division={division} statKey={item as StatKey} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
