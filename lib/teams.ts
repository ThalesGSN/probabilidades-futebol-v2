// Base de dados dos clubes para a v2.
// Em produção, viria do pipeline de simulações Monte Carlo.
// Aqui, valores sintéticos plausíveis derivados deterministicamente do slug.

export type Division = "A" | "B"

export type TeamSlug =
  // Série A
  | "palmeiras"
  | "flamengo"
  | "botafogo"
  | "atletico-mg"
  | "fluminense"
  | "internacional"
  | "sao-paulo"
  | "cruzeiro"
  // Série B
  | "santos"
  | "coritiba"
  | "goias"
  | "avai"
  | "ponte-preta"
  | "novorizontino"
  | "sport"
  | "crb"
  | "chapecoense"
  | "athletic-club"
  | "operario-pr"
  | "paysandu"

export type Team = {
  slug: TeamSlug
  name: string
  shortName: string
  city: string
  state: string
  founded: number
  nickname: string
  division: Division
  // Cor do clube — usada APENAS como destaque pontual em gráficos.
  // Tons foram dessaturados para harmonizar com a paleta editorial.
  brand: string
  // Probabilidades atuais (rodada simulada da temporada corrente)
  current: {
    position: number
    points: number
    played: number
    // Para Série A: chance de título do Brasileirão.
    // Para Série B: chance de título da Série B.
    titleProb: number
    // Para Série A: G4 (Libertadores).
    // Para Série B: G4 (acesso à Série A).
    g4Prob: number
    // Para Série A: rebaixamento à Série B.
    // Para Série B: rebaixamento à Série C.
    relegationProb: number
    expectedPoints: number
    pointsRange: [number, number]
  }
  // Bio editorial curta
  bio: string
}

const TEAMS: Record<TeamSlug, Team> = {
  // ============ SÉRIE A ============
  palmeiras: {
    slug: "palmeiras",
    name: "Sociedade Esportiva Palmeiras",
    shortName: "Palmeiras",
    city: "São Paulo",
    state: "SP",
    founded: 1914,
    nickname: "Verdão",
    division: "A",
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
    division: "A",
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
    division: "A",
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
    division: "A",
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
    division: "A",
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
    division: "A",
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
    division: "A",
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
    division: "A",
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

  // ============ SÉRIE B ============
  santos: {
    slug: "santos",
    name: "Santos Futebol Clube",
    shortName: "Santos",
    city: "Santos",
    state: "SP",
    founded: 1912,
    nickname: "Peixe",
    division: "B",
    brand: "#2A2A2A",
    current: {
      position: 1,
      points: 58,
      titleProb: 34.8,
      g4Prob: 91.2,
      relegationProb: 0.0,
      expectedPoints: 71.6,
      pointsRange: [65, 79],
    },
    bio: "Oito vezes campeão brasileiro, lidera a Série B com a maior média de público da divisão e busca o retorno à elite.",
  },
  coritiba: {
    slug: "coritiba",
    name: "Coritiba Foot Ball Club",
    shortName: "Coritiba",
    city: "Curitiba",
    state: "PR",
    founded: 1909,
    nickname: "Coxa",
    division: "B",
    brand: "#1A6B3A",
    current: {
      position: 3,
      points: 51,
      titleProb: 14.7,
      g4Prob: 67.9,
      relegationProb: 0.3,
      expectedPoints: 64.2,
      pointsRange: [58, 71],
    },
    bio: "Campeão brasileiro de 1985, alterna entre as duas divisões na última década e reformulou seu projeto esportivo em 2025.",
  },
  goias: {
    slug: "goias",
    name: "Goiás Esporte Clube",
    shortName: "Goiás",
    city: "Goiânia",
    state: "GO",
    founded: 1943,
    nickname: "Esmeraldino",
    division: "B",
    brand: "#0F5F3F",
    current: {
      position: 5,
      points: 47,
      titleProb: 6.9,
      g4Prob: 38.4,
      relegationProb: 1.2,
      expectedPoints: 60.1,
      pointsRange: [53, 68],
    },
    bio: "Maior clube do Centro-Oeste brasileiro, com 12 títulos estaduais consecutivos e tradição em formação de jovens atletas.",
  },
  avai: {
    slug: "avai",
    name: "Avaí Futebol Clube",
    shortName: "Avaí",
    city: "Florianópolis",
    state: "SC",
    founded: 1923,
    nickname: "Leão da Ilha",
    division: "B",
    brand: "#1E5BA3",
    current: {
      position: 9,
      points: 41,
      titleProb: 1.4,
      g4Prob: 14.2,
      relegationProb: 4.8,
      expectedPoints: 54.8,
      pointsRange: [48, 62],
    },
    bio: "Tradicional clube catarinense, busca estabilidade na Série B após sucessivas trocas de comissão técnica.",
  },
  "ponte-preta": {
    slug: "ponte-preta",
    name: "Associação Atlética Ponte Preta",
    shortName: "Ponte Preta",
    city: "Campinas",
    state: "SP",
    founded: 1900,
    nickname: "Macaca",
    division: "B",
    brand: "#1A1A1A",
    current: {
      position: 11,
      points: 38,
      titleProb: 0.4,
      g4Prob: 6.7,
      relegationProb: 12.4,
      expectedPoints: 50.9,
      pointsRange: [44, 58],
    },
    bio: "Mais antigo clube em atividade do país, vive temporada delicada e luta para se afastar da zona de rebaixamento.",
  },
  novorizontino: {
    slug: "novorizontino",
    name: "Grêmio Novorizontino",
    shortName: "Novorizontino",
    city: "Novo Horizonte",
    state: "SP",
    founded: 1973,
    nickname: "Tigre",
    division: "B",
    brand: "#1E3F8C",
    current: {
      position: 4,
      points: 49,
      titleProb: 9.8,
      g4Prob: 54.1,
      relegationProb: 0.6,
      expectedPoints: 62.4,
      pointsRange: [56, 69],
    },
    bio: "Surpresa positiva da última temporada, consolidou-se na briga pelo acesso após duas Séries B consecutivas no G8.",
  },
  sport: {
    slug: "sport",
    name: "Sport Club do Recife",
    shortName: "Sport",
    city: "Recife",
    state: "PE",
    founded: 1905,
    nickname: "Leão",
    division: "B",
    brand: "#B61E2B",
    current: {
      position: 6,
      points: 45,
      titleProb: 4.2,
      g4Prob: 28.7,
      relegationProb: 1.9,
      expectedPoints: 58.6,
      pointsRange: [52, 66],
    },
    bio: "Campeão brasileiro de 1987 pela CBF, é a maior torcida do Nordeste e tem na Ilha do Retiro um de seus maiores ativos.",
  },
  crb: {
    slug: "crb",
    name: "Clube de Regatas Brasil",
    shortName: "CRB",
    city: "Maceió",
    state: "AL",
    founded: 1912,
    nickname: "Galo",
    division: "B",
    brand: "#B61E2B",
    current: {
      position: 12,
      points: 36,
      titleProb: 0.2,
      g4Prob: 4.1,
      relegationProb: 16.8,
      expectedPoints: 48.7,
      pointsRange: [42, 56],
    },
    bio: "Clássico clube alagoano, especialista em decisões na Copa do Nordeste e tradicional escola de revelações.",
  },
  chapecoense: {
    slug: "chapecoense",
    name: "Associação Chapecoense de Futebol",
    shortName: "Chapecoense",
    city: "Chapecó",
    state: "SC",
    founded: 1973,
    nickname: "Chape",
    division: "B",
    brand: "#0F5F3F",
    current: {
      position: 14,
      points: 32,
      titleProb: 0.1,
      g4Prob: 1.8,
      relegationProb: 28.4,
      expectedPoints: 44.2,
      pointsRange: [38, 51],
    },
    bio: "Símbolo de superação no futebol mundial, segue em reconstrução técnica após anos turbulentos no calendário nacional.",
  },
  "athletic-club": {
    slug: "athletic-club",
    name: "Athletic Club",
    shortName: "Athletic",
    city: "São João del-Rei",
    state: "MG",
    founded: 2008,
    nickname: "Esquadrão",
    division: "B",
    brand: "#1A1A1A",
    current: {
      position: 7,
      points: 43,
      titleProb: 2.6,
      g4Prob: 19.4,
      relegationProb: 3.1,
      expectedPoints: 56.3,
      pointsRange: [50, 64],
    },
    bio: "Clube mineiro de ascensão acelerada, conquistou o acesso à Série B em 2023 e estreou na divisão com solidez tática.",
  },
  "operario-pr": {
    slug: "operario-pr",
    name: "Operário Ferroviário Esporte Clube",
    shortName: "Operário-PR",
    city: "Ponta Grossa",
    state: "PR",
    founded: 1912,
    nickname: "Fantasma",
    division: "B",
    brand: "#1A1A1A",
    current: {
      position: 10,
      points: 39,
      titleProb: 0.7,
      g4Prob: 9.2,
      relegationProb: 7.6,
      expectedPoints: 52.7,
      pointsRange: [46, 60],
    },
    bio: "Tradicional clube paranaense que se reergueu nos anos 2010 e tornou-se presença constante na segunda divisão.",
  },
  paysandu: {
    slug: "paysandu",
    name: "Paysandu Sport Club",
    shortName: "Paysandu",
    city: "Belém",
    state: "PA",
    founded: 1914,
    nickname: "Papão",
    division: "B",
    brand: "#1A6B3A",
    current: {
      position: 8,
      points: 42,
      titleProb: 1.8,
      g4Prob: 16.8,
      relegationProb: 4.4,
      expectedPoints: 55.4,
      pointsRange: [49, 63],
    },
    bio: "Maior torcida do Norte do país, ergueu o histórico título da Copa dos Campeões em 2002 e mantém forte identidade regional.",
  },
}

export function getAllTeams(): Team[] {
  return Object.values(TEAMS)
}

export function getTeamsByDivision(division: Division): Team[] {
  return Object.values(TEAMS).filter((t) => t.division === division)
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
  santos: [],
  coritiba: [],
  goias: [],
  avai: [],
  "ponte-preta": [],
  novorizontino: [],
  sport: [],
  crb: [],
  chapecoense: [],
  "athletic-club": [],
  "operario-pr": [],
  paysandu: [],
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
    const u1 = Math.max(rand(), 1e-9)
    const u2 = rand()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const points = Math.round(center + z * sigma)
    counts.set(points, (counts.get(points) ?? 0) + 1)
  }

  const sorted = Array.from(counts.entries())
    .map(([points, count]) => ({ points, count, density: count / samples }))
    .sort((a, b) => a.points - b.points)

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

const opponentsByDivision: Record<Division, string[]> = {
  A: [
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
  ],
  B: [
    "Santos",
    "Coritiba",
    "Goiás",
    "Avaí",
    "Ponte Preta",
    "Novorizontino",
    "Sport",
    "CRB",
    "Chapecoense",
    "Athletic",
    "Operário-PR",
    "Paysandu",
    "América-MG",
    "Vila Nova",
    "Botafogo-SP",
  ],
}

export function getTeamFixtures(team: Team): Fixture[] {
  const rand = mulberry32(seedFromSlug(team.slug + "fix"))
  const items: Fixture[] = []
  const pool = opponentsByDivision[team.division]
  for (let i = -4; i < 4; i++) {
    const rodada = team.current.position > 0 ? 31 + i : 31 + i
    const opponent = pool.filter((o) => o !== team.shortName)[Math.floor(rand() * (pool.length - 1))]
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
