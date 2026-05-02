"use client"

import Link from "next/link"
import type { Division } from "@/lib/teams"
import { getStatRanking, type StatKey } from "@/lib/brasileirao"

const config: Record<StatKey, { label: string; unit: string; description: string }> = {
  vitorias: {
    label: "Sequência de vitórias",
    unit: "jogos",
    description: "Maior sequência de vitórias consecutivas na temporada.",
  },
  derrotas: {
    label: "Sequência de derrotas",
    unit: "jogos",
    description: "Maior sequência de derrotas consecutivas na temporada.",
  },
  invencibilidade: {
    label: "Sequência de invencibilidade",
    unit: "jogos",
    description: "Maior sequência sem derrotas (vitória ou empate).",
  },
  "sem-vitorias": {
    label: "Sequência sem vitórias",
    unit: "jogos",
    description: "Maior sequência sem vencer (empate ou derrota).",
  },
  "melhor-ataque": {
    label: "Melhor ataque",
    unit: "gols",
    description: "Total de gols marcados na temporada.",
  },
  "melhor-defesa": {
    label: "Melhor defesa",
    unit: "gols",
    description: "Total de gols sofridos na temporada (menor é melhor).",
  },
}

export function StatsRanking({
  division,
  statKey,
}: {
  division: Division
  statKey: StatKey
}) {
  const rows = getStatRanking(division, statKey)
  const max = Math.max(...rows.map((r) => r.value))
  const c = config[statKey]

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>

      <ol className="space-y-1.5">
        {rows.map((row, idx) => {
          const widthPct = max > 0 ? (row.value / max) * 100 : 0
          const isLeader = idx === 0
          return (
            <li
              key={row.team.slug}
              className="grid grid-cols-[2rem_minmax(0,1fr)_4rem] items-center gap-3 rounded-sm border border-border bg-card px-3 py-2.5"
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/times/${row.team.slug}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <span
                    aria-hidden
                    className="h-4 w-0.5 rounded-full"
                    style={{ backgroundColor: row.team.brand }}
                  />
                  <span className="truncate font-medium text-foreground">{row.team.shortName}</span>
                </Link>
                <div className="relative mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: isLeader
                        ? "var(--color-accent)"
                        : "color-mix(in oklab, var(--color-primary) 60%, transparent)",
                    }}
                  />
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {row.detail}
                </p>
              </div>
              <span className="text-right">
                <span className="block font-serif text-2xl leading-none tabular-nums">{row.value}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {c.unit}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
