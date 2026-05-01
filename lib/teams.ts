// Base de dados dos clubes para a v2.
// Em produção, viria do pipeline de simulações Monte Carlo.
// Aqui, valores sintéticos plausíveis derivados deterministicamente do slug.

export type TeamSlug =
  | "palmeiras"
  | "flamengo"
  | "botafogo"
  | "atletico-mg"
  | "fluminense"
  | "internacional"
  | "sao-paulo"
  | "cruzeiro"

export type Team = {
  slug: TeamSlug
  name: string
  shortName: string
  city: string
  state: string
  founded: number
  nickname: string
  // Cor do clube — usada APENAS como destaque pontual em gráficos.
  // Tons foram dessaturados para harmonizar com a paleta editorial.
  brand: string
  // Probabilidades atuais (rodada simulada 31 de 38)
  current: {
    position: number
    points: number
    titleProb: number
    g4Prob: number
    relegationProb: number
    expectedPoints: number
    pointsRange: [number, number]
  }
  // Bio editorial curta
  bio: string
}

const TEAMS: Record<TeamSlug, Team> = {
  palmeiras: {
    slug: "palmeiras",
    name: "Sociedade Esportiva Palmeiras",
    shortName: "Palmeiras",
    city: "São Paulo",
    state: "SP",
    founded: 1914,
    nickname: "Verdão",
    brand: "#0E5C3A",
    current: {
      position: 2,
      points: 62,
      titleProb: 41.2,
      g4Prob: 96.8,
      relegationProb: 0.0,
      expectedPoints: 76.4,
      pointsRange: [70, 83],
    },
    bio: "Time mais consistente da década. Desde 2018, terminou entre os quatro primeiros em todas as edições do Brasileirão.",
  },
  flamengo: {
    slug: "flamengo",
    name: "Clube de Regatas do Flamengo",
    shortName: "Flamengo",
    city: "Rio de Janeiro",
    state: "RJ",
    founded: 1895,
    nickname: "Mengão",
    brand: "#B61E2B",
    current: {
      position: 1,
      points: 65,
      titleProb: 38.7,
      g4Prob: 98.2,
      relegationProb: 0.0,
      expectedPoints: 78.1,
      pointsRange: [72, 85],
    },
    bio: "Maior torcida do país. Após o título histórico de 2019, manteve-se entre os principais favoritos em todas as temporadas.",
  },
  botafogo: {
    slug: "botafogo",
    name: "Botafogo de Futebol e Regatas",
    shortName: "Botafogo",
    city: "Rio de Janeiro",
    state: "RJ",
    founded: 1904,
    nickname: "Fogão",
    brand: "#1A1A1A",
    current: {
      position: 4,
      points: 56,
      titleProb: 12.4,
      g4Prob: 78.3,
      relegationProb: 0.1,
      expectedPoints: 68.9,
      pointsRange: [62, 76],
    },
    bio: "O renascimento mais comentado do futebol brasileiro. Campeão em 2024 após uma virada matemática histórica.",
  },
  "atletico-mg": {
    slug: "atletico-mg",
    name: "Clube Atlético Mineiro",
    shortName: "Atlético-MG",
    city: "Belo Horizonte",
    state: "MG",
    founded: 1908,
    nickname: "Galo",
    brand: "#2A2A2A",
    current: {
      position: 6,
      points: 51,
      titleProb: 4.1,
      g4Prob: 41.7,
      relegationProb: 0.4,
      expectedPoints: 63.2,
      pointsRange: [56, 71],
    },
    bio: "Tradição mineira que conquistou o Brasileirão de 2021 com a maior pontuação da era dos pontos corridos.",
  },
  fluminense: {
    slug: "fluminense",
    name: "Fluminense Football Club",
    shortName: "Fluminense",
    city: "Rio de Janeiro",
    state: "RJ",
    founded: 1902,
    nickname: "Tricolor",
    brand: "#7E1E3A",
    current: {
      position: 8,
      points: 47,
      titleProb: 1.2,
      g4Prob: 22.1,
      relegationProb: 1.4,
      expectedPoints: 58.7,
      pointsRange: [52, 66],
    },
    bio: "Campeão da Libertadores em 2023 sob comando de Diniz, em uma das campanhas continentais mais aclamadas da década.",
  },
  internacional: {
    slug: "internacional",
    name: "Sport Club Internacional",
    shortName: "Internacional",
    city: "Porto Alegre",
    state: "RS",
    founded: 1909,
    nickname: "Colorado",
    brand: "#A8232E",
    current: {
      position: 11,
      points: 41,
      titleProb: 0.2,
      g4Prob: 6.8,
      relegationProb: 8.2,
      expectedPoints: 52.4,
      pointsRange: [46, 60],
    },
    bio: "Bicampeão da Libertadores. Vive temporada de reconstrução após oscilações nas últimas três edições.",
  },
  "sao-paulo": {
    slug: "sao-paulo",
    name: "São Paulo Futebol Clube",
    shortName: "São Paulo",
    city: "São Paulo",
    state: "SP",
    founded: 1930,
    nickname: "Tricolor",
    brand: "#A8232E",
    current: {
      position: 5,
      points: 53,
      titleProb: 6.7,
      g4Prob: 52.4,
      relegationProb: 0.2,
      expectedPoints: 65.1,
      pointsRange: [58, 72],
    },
    bio: "Tricampeão da Libertadores e único brasileiro com três Mundiais. Voltou ao topo em 2024 com seu primeiro Brasileirão.",
  },
  cruzeiro: {
    slug: "cruzeiro",
    name: "Cruzeiro Esporte Clube",
    shortName: "Cruzeiro",
    city: "Belo Horizonte",
    state: "MG",
    founded: 1921,
    nickname: "Raposa",
    brand: "#1E3F8C",
    current: {
      position: 7,
      points: 49,
      titleProb: 2.1,
      g4Prob: 28.9,
      relegationProb: 0.8,
      expectedPoints: 60.3,
      pointsRange: [54, 67],
    },
    bio: "Bicampeão brasileiro nos anos 2000 e 2010. Retornou à elite em 2023 e busca reposicionar-se entre os principais.",
  },
}

export function getAllTeams(): Team[] {
  return Object.values(TEAMS)
}

export function getTeam(slug: string): Team | undefined {
  return TEAMS[slug as TeamSlug]
}

// === Geração de séries sintéticas determinísticas ===

// PRNG simples (mulberry32) para garantir dados estáveis por slug
function seedFromSlug(slug: string): number {
  let h = 2166136261
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export type SeasonPoint = {
  rodada: number
  titleProb: number
  g4Prob: number
  relegationProb: number
  // Banda de confiança (95%) ao redor da probabilidade de título
  titleLow: number
  titleHigh: number
  expectedPoints: number
}

export function getTeamSeason(team: Team): SeasonPoint[] {
  const rand = mulberry32(seedFromSlug(team.slug))
  const baseTitle = team.current.titleProb
  const baseG4 = team.current.g4Prob
  const baseReleg = team.current.relegationProb
  const finalRound = 31

  return Array.from({ length: finalRound }, (_, i) => {
    const r = i + 1
    const progress = r / finalRound
    // Trajetória: começa próximo de 100/N e converge ao valor atual com ruído
    const titleStart = 100 / 20
    const titleNow = titleStart + (baseTitle - titleStart) * progress + (rand() - 0.5) * 8
    const titleProb = Math.max(0, Math.min(100, titleNow))

    const g4Start = 100 / 5
    const g4Now = g4Start + (baseG4 - g4Start) * progress + (rand() - 0.5) * 10
    const g4Prob = Math.max(0, Math.min(100, g4Now))

    const relegStart = 100 / 4
    const relegNow = relegStart + (baseReleg - relegStart) * progress + (rand() - 0.5) * 6
    const relegationProb = Math.max(0, Math.min(100, relegNow))

    const ciWidth = 12 * (1 - progress) + 4
    const titleLow = Math.max(0, titleProb - ciWidth / 2)
    const titleHigh = Math.min(100, titleProb + ciWidth / 2)

    const expectedPoints = r * (team.current.expectedPoints / 38) + (rand() - 0.5) * 1.5

    return {
      rodada: r,
      titleProb: Number(titleProb.toFixed(1)),
      g4Prob: Number(g4Prob.toFixed(1)),
      relegationProb: Number(relegationProb.toFixed(1)),
      titleLow: Number(titleLow.toFixed(1)),
      titleHigh: Number(titleHigh.toFixed(1)),
      expectedPoints: Number(expectedPoints.toFixed(1)),
    }
  })
}

export type HistoryPoint = {
  year: number
  position: number
  points: number
  titleProb: number
  champion: boolean
}

const champions: Record<TeamSlug, number[]> = {
  palmeiras: [2016, 2018, 2022, 2023],
  flamengo: [2009, 2019, 2020],
  botafogo: [2024],
  "atletico-mg": [2021],
  fluminense: [2010, 2012],
  internacional: [],
  "sao-paulo": [2006, 2007, 2008, 2025],
  cruzeiro: [2013, 2014],
}

export function getTeamHistory(team: Team): HistoryPoint[] {
  const rand = mulberry32(seedFromSlug(team.slug + "history"))
  const years = Array.from({ length: 21 }, (_, i) => 2005 + i) // 2005..2025
  const champYears = new Set(champions[team.slug])

  return years.map((year) => {
    const champion = champYears.has(year)
    let position: number
    if (champion) {
      position = 1
    } else {
      // Posição plausível centrada em torno da posição atual + ruído
      const center = team.current.position
      const drift = (rand() - 0.5) * 8
      position = Math.max(1, Math.min(20, Math.round(center + drift)))
    }
    const points = Math.max(20, 90 - position * 2.4 + (rand() - 0.5) * 5)
    const titleProb = champion ? 100 : Math.max(0, 60 - position * 4 + (rand() - 0.5) * 12)

    return {
      year,
      position,
      points: Math.round(points),
      titleProb: Number(titleProb.toFixed(1)),
      champion,
    }
  })
}

export type DistributionBucket = {
  points: number
  count: number
  density: number
}

// Histograma de pontos finais simulados (10 mil cenários sintéticos)
export function getMonteCarloDistribution(team: Team): DistributionBucket[] {
  const rand = mulberry32(seedFromSlug(team.slug + "mc"))
  const center = team.current.expectedPoints
  const sigma = (team.current.pointsRange[1] - team.current.pointsRange[0]) / 4
  const samples = 10000
  const counts = new Map<number, number>()

  for (let i = 0; i < samples; i++) {
    // Box-Muller para amostra normal
    const u1 = Math.max(rand(), 1e-9)
    const u2 = rand()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const points = Math.round(center + z * sigma)
    counts.set(points, (counts.get(points) ?? 0) + 1)
  }

  const sorted = Array.from(counts.entries())
    .map(([points, count]) => ({ points, count, density: count / samples }))
    .sort((a, b) => a.points - b.points)

  // Filtra apenas a região com massa relevante
  return sorted.filter((b) => b.density > 0.001)
}

export type Fixture = {
  rodada: number
  date: string
  opponent: string
  home: boolean
  played: boolean
  result?: { team: number; opponent: number }
  winProb?: number
  drawProb?: number
  lossProb?: number
}

const opponents = [
  "Flamengo",
  "Palmeiras",
  "Botafogo",
  "São Paulo",
  "Atlético-MG",
  "Cruzeiro",
  "Fluminense",
  "Internacional",
  "Grêmio",
  "Corinthians",
  "Bahia",
  "Vasco",
  "Fortaleza",
  "Bragantino",
  "Athletico-PR",
]

export function getTeamFixtures(team: Team): Fixture[] {
  const rand = mulberry32(seedFromSlug(team.slug + "fix"))
  // 4 últimas + 4 próximas
  const items: Fixture[] = []
  for (let i = -4; i < 4; i++) {
    const rodada = team.current.position > 0 ? 31 + i : 31 + i
    const opponent = opponents.filter((o) => o !== team.shortName)[Math.floor(rand() * 14)]
    const home = rand() > 0.5
    const played = i < 0
    const date = new Date(2026, 4, 15 + i * 6).toISOString().slice(0, 10)

    if (played) {
      const goalsTeam = Math.floor(rand() * 4)
      const goalsOpp = Math.floor(rand() * 3)
      items.push({
        rodada,
        date,
        opponent,
        home,
        played,
        result: { team: goalsTeam, opponent: goalsOpp },
      })
    } else {
      const winProb = 0.3 + rand() * 0.4
      const drawProb = (1 - winProb) * 0.45
      const lossProb = 1 - winProb - drawProb
      items.push({
        rodada,
        date,
        opponent,
        home,
        played,
        winProb: Number((winProb * 100).toFixed(1)),
        drawProb: Number((drawProb * 100).toFixed(1)),
        lossProb: Number((lossProb * 100).toFixed(1)),
      })
    }
  }
  return items
}
