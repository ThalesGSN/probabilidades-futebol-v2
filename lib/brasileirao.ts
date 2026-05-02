// Dados sintéticos para o painel do Brasileirão.
// Em produção, viriam do pipeline diário de simulações Monte Carlo.

import { getTeamsByDivision, type Division, type Team } from "@/lib/teams"

// Ruído determinístico (mesmo padrão do cardiograma) para evitar mismatch SSR/CSR.
const noise = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x) - 0.5
}

const seedFromSlug = (slug: string) => {
  let s = 0
  for (let i = 0; i < slug.length; i++) s += slug.charCodeAt(i) * (i + 1)
  return s
}

// ============ Probabilidades por time ============
export type TeamProbabilityRow = {
  team: Team
  champion: number
  libertadores: number // ou "acesso" na Série B
  sulamericana: number // ou "permanência" na Série B
  relegation: number
}

export function getTeamProbabilities(division: Division): TeamProbabilityRow[] {
  const teams = getTeamsByDivision(division)
  return teams
    .map((t) => {
      const seed = seedFromSlug(t.slug)
      const champion = t.current.titleProb
      const libertadores = t.current.g4Prob
      const sulaBase = Math.max(0, Math.min(100, 100 - libertadores - t.current.relegationProb * 0.3))
      const sulamericana = Math.round((sulaBase * 0.6 + noise(seed) * 12 + 20) * 10) / 10
      return {
        team: t,
        champion,
        libertadores,
        sulamericana: Math.max(0, Math.min(99.9, sulamericana)),
        relegation: t.current.relegationProb,
      }
    })
    .sort((a, b) => b.champion - a.champion)
}

// ============ Probabilidade por pontuação ============
// Para cada time, uma distribuição de probabilidade sobre faixas de pontuação final.
export type PointsBucket = { range: string; min: number; max: number; prob: number }
export type TeamPointsDistribution = {
  team: Team
  expected: number
  buckets: PointsBucket[]
}

export function getPointsDistributions(division: Division): TeamPointsDistribution[] {
  const teams = getTeamsByDivision(division)
  // Faixas de 5 em 5 pontos, de 25 a 90.
  const ranges: { min: number; max: number }[] = []
  for (let p = 25; p < 90; p += 5) ranges.push({ min: p, max: p + 4 })

  return teams
    .map((t) => {
      const mean = t.current.expectedPoints
      const sd = 4.2
      const buckets = ranges.map((r) => {
        const center = (r.min + r.max) / 2
        // Aproximação de densidade gaussiana discretizada.
        const z = (center - mean) / sd
        const density = Math.exp(-(z * z) / 2)
        return { ...r, range: `${r.min}-${r.max}`, prob: density }
      })
      const total = buckets.reduce((s, b) => s + b.prob, 0) || 1
      return {
        team: t,
        expected: mean,
        buckets: buckets.map((b) => ({ ...b, prob: Math.round((b.prob / total) * 1000) / 10 })),
      }
    })
    .sort((a, b) => b.expected - a.expected)
}

// ============ Classificação ============
export type StandingRow = {
  team: Team
  position: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export type StandingMode =
  | "geral"
  | "ultimas-10"
  | "mandante"
  | "visitante"
  | "turno"
  | "returno"

export function getStandings(division: Division, mode: StandingMode): StandingRow[] {
  const teams = getTeamsByDivision(division)
  const matchesByMode: Record<StandingMode, number> = {
    geral: 30,
    "ultimas-10": 10,
    mandante: 15,
    visitante: 15,
    turno: 19,
    returno: 19,
  }
  const totalMatches = matchesByMode[mode]

  return teams
    .map((t, idx) => {
      const seed = seedFromSlug(t.slug + mode)
      const strength = (t.current.expectedPoints - 30) / 50 // 0..1 aprox
      const winRate = Math.max(0.05, Math.min(0.85, strength * 0.65 + 0.2 + noise(seed) * 0.1))
      const drawRate = Math.max(0.1, Math.min(0.45, 0.25 + noise(seed + 1) * 0.1))
      const wins = Math.round(totalMatches * winRate)
      const draws = Math.round(totalMatches * drawRate)
      const losses = Math.max(0, totalMatches - wins - draws)
      const goalsFor = Math.round(wins * 1.9 + draws * 0.8 + Math.abs(noise(seed + 2)) * 6)
      const goalsAgainst = Math.round(losses * 1.7 + draws * 0.8 + Math.abs(noise(seed + 3)) * 6)
      const points = wins * 3 + draws
      return {
        team: t,
        position: idx + 1,
        played: totalMatches,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDiff: goalsFor - goalsAgainst,
        points,
      }
    })
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor)
    .map((row, i) => ({ ...row, position: i + 1 }))
}

// ============ Próxima rodada ============
export type FixtureRow = {
  id: string
  home: Team
  away: Team
  date: string
  time: string
  venue: string
  homeWin: number
  draw: number
  awayWin: number
  expectedGoals: [number, number]
}

export function getNextRoundFixtures(division: Division): FixtureRow[] {
  const teams = getTeamsByDivision(division)
  const fixtures: FixtureRow[] = []
  // Pares determinísticos
  for (let i = 0; i < teams.length; i += 2) {
    const home = teams[i]
    const away = teams[(i + 1) % teams.length]
    if (!home || !away || home.slug === away.slug) continue
    const seed = seedFromSlug(home.slug + away.slug)
    const homeStrength = home.current.expectedPoints + 5
    const awayStrength = away.current.expectedPoints
    const total = homeStrength + awayStrength + 10
    const homeWin = Math.round(((homeStrength / total) * 100 + noise(seed) * 8) * 10) / 10
    const awayWin = Math.round(((awayStrength / total) * 100 + noise(seed + 1) * 8) * 10) / 10
    const draw = Math.max(5, Math.round((100 - homeWin - awayWin) * 10) / 10)
    fixtures.push({
      id: `${home.slug}-${away.slug}`,
      home,
      away,
      date: ["Sáb 09 Nov", "Dom 10 Nov", "Qua 13 Nov"][i % 3],
      time: ["16:00", "18:30", "20:00", "21:30"][i % 4],
      venue: `${home.city}, ${home.state}`,
      homeWin: Math.max(5, homeWin),
      draw,
      awayWin: Math.max(5, awayWin),
      expectedGoals: [
        Math.round((1.2 + (homeStrength / total) * 1.5) * 10) / 10,
        Math.round((0.8 + (awayStrength / total) * 1.5) * 10) / 10,
      ],
    })
  }
  return fixtures
}

// ============ Estatísticas ============
export type StatRow = {
  team: Team
  value: number
  detail: string
}

export type StatKey =
  | "vitorias"
  | "derrotas"
  | "invencibilidade"
  | "sem-vitorias"
  | "melhor-ataque"
  | "melhor-defesa"

export function getStatRanking(division: Division, key: StatKey): StatRow[] {
  const teams = getTeamsByDivision(division)
  return teams
    .map((t) => {
      const seed = seedFromSlug(t.slug + key)
      const strength = (t.current.expectedPoints - 30) / 50
      const baseByKey: Record<StatKey, number> = {
        vitorias: 4 + strength * 7,
        derrotas: 4 + (1 - strength) * 6,
        invencibilidade: 5 + strength * 10,
        "sem-vitorias": 3 + (1 - strength) * 7,
        "melhor-ataque": 30 + strength * 35,
        "melhor-defesa": 18 + (1 - strength) * 30,
      }
      const value = Math.max(1, Math.round(baseByKey[key] + noise(seed) * 3))
      const detailByKey: Record<StatKey, string> = {
        vitorias: `jogos · iniciada na rodada ${20 - Math.round(noise(seed + 5) * 5)}`,
        derrotas: `jogos · iniciada na rodada ${22 - Math.round(noise(seed + 5) * 5)}`,
        invencibilidade: `jogos · ${value > 8 ? "ainda em curso" : "encerrada"}`,
        "sem-vitorias": `jogos · ${value > 6 ? "ainda em curso" : "encerrada"}`,
        "melhor-ataque": `gols marcados em 30 jogos`,
        "melhor-defesa": `gols sofridos em 30 jogos`,
      }
      return { team: t, value, detail: detailByKey[key] }
    })
    .sort((a, b) => {
      const ascendingKeys: StatKey[] = ["derrotas", "sem-vitorias", "melhor-defesa"]
      return ascendingKeys.includes(key) ? a.value - b.value : b.value - a.value
    })
}
