/**
 * Gera os arquivos JSON estáticos em public/data/ a partir das funções
 * sintéticas em lib/. Substituir os retornos dessas funções com dados
 * reais do pipeline produz automaticamente os JSONs corretos.
 *
 * Uso: npx tsx scripts/generate-data.ts
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

// ─── helpers ────────────────────────────────────────────────────────────────

function write(relPath: string, data: unknown) {
  const abs = resolve(root, "public/data", relPath)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, JSON.stringify(data, null, 2))
  console.log("✓", relPath)
}

// ─── imports (path aliases resolvidos pelo tsconfig + tsx) ───────────────────

import { getTeamsByDivision, getAllTeams, getTeamSeason, getTeamHistory, getMonteCarloDistribution, getTeamFixtures, type Division } from "../lib/teams"
import {
  getTeamProbabilities,
  getPointsDistributions,
  getStandings,
  getNextRoundFixtures,
  getStatRanking,
  type StatKey,
} from "../lib/brasileirao"

// ─── MatchResult sintético por rodada ────────────────────────────────────────

type MatchResult = {
  round: number
  homeSlug: string
  awaySlug: string
  homeGoals: number
  awayGoals: number
}

function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x) - 0.5
}

function generateResults(division: Division): MatchResult[] {
  const teams = getTeamsByDivision(division)
  const results: MatchResult[] = []

  for (let round = 1; round <= 38; round++) {
    const shuffled = [...teams].sort((a, b) => {
      const s = noise(round * 7 + a.slug.length - b.slug.length)
      return s
    })

    for (let i = 0; i < shuffled.length; i += 2) {
      const home = shuffled[i]
      const away = shuffled[(i + 1) % shuffled.length]
      if (!home || !away || home.slug === away.slug) continue

      const seed = home.slug.length * round + away.slug.length * round * 3
      const homeGoals = Math.max(0, Math.round(1.3 + noise(seed) * 1.4))
      const awayGoals = Math.max(0, Math.round(1.0 + noise(seed + 7) * 1.4))

      results.push({
        round,
        homeSlug: home.slug,
        awaySlug: away.slug,
        homeGoals,
        awayGoals,
      })
    }
  }

  return results
}

// ─── Geração ─────────────────────────────────────────────────────────────────

const STAT_KEYS: StatKey[] = [
  "vitorias",
  "derrotas",
  "invencibilidade",
  "sem-vitorias",
  "melhor-ataque",
  "melhor-defesa",
]

for (const division of ["A", "B"] as Division[]) {
  const dir = `brasileirao-${division.toLowerCase()}`

  write(`${dir}/probabilities.json`, getTeamProbabilities(division))
  write(`${dir}/points-distribution.json`, getPointsDistributions(division))

  // Classificações pré-computadas para modos fixos
  write(`${dir}/standings.json`, {
    geral: getStandings(division, "geral"),
    mandante: getStandings(division, "mandante"),
    visitante: getStandings(division, "visitante"),
    turno: getStandings(division, "turno"),
    returno: getStandings(division, "returno"),
  })

  // Resultados por rodada (para o range slider)
  write(`${dir}/results.json`, generateResults(division))

  write(`${dir}/next-round.json`, getNextRoundFixtures(division))

  // Estatísticas: um único objeto com todas as chaves
  write(
    `${dir}/stats.json`,
    Object.fromEntries(STAT_KEYS.map((k) => [k, getStatRanking(division, k)])),
  )
}

// Teams index
write("teams.json", getAllTeams())

// Per-team pages
for (const team of getAllTeams()) {
  write(`teams/${team.slug}.json`, {
    season: getTeamSeason(team),
    history: getTeamHistory(team),
    monteCarlo: getMonteCarloDistribution(team),
    fixtures: getTeamFixtures(team),
  })
}

console.log("\nDone — arquivos em public/data/")
