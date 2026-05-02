/**
 * Catálogo central de DTOs trocados entre o frontend e a API v2.
 *
 * Cada bloco descreve um domínio (Times, Competições, Brasileirão, Histórico,
 * Editorial, Newsletter). Os tipos refletem 1:1 a forma esperada do JSON
 * retornado pelos endpoints documentados em `src/api/README.md`.
 *
 * Convenções:
 * - Probabilidades sempre em percentual (0–100), com 1 casa decimal.
 * - Datas como `YYYY-MM-DD` (sem timezone).
 * - Cores de clube em hexadecimal (`#RRGGBB`).
 * - Slugs sempre em kebab-case ASCII.
 */

// ============================================================
// Identificadores compartilhados
// ============================================================
export type Division = "A" | "B"
export type CompetitionId = "brasileirao-a" | "brasileirao-b"
export type Slug = string

// ============================================================
// Times
// ============================================================
export interface TeamSummary {
  /** Identificador único, usado em URLs (`/times/:slug`). */
  slug: Slug
  /** Nome oficial completo. */
  name: string
  /** Nome curto editorial (ex.: "Atlético-MG"). */
  shortName: string
  /** Apelido institucional (ex.: "Galo"). */
  nickname: string
  city: string
  state: string
  founded: number
  division: Division
  /** Cor primária do clube em hex (`#RRGGBB`). */
  brand: string
  /** Bio curta para o hero da página do clube. */
  bio: string
}

/** Snapshot da temporada corrente para um clube. */
export interface TeamCurrentSnapshot {
  position: number
  points: number
  /** % de chance de título da divisão. */
  titleProb: number
  /** % de chance de G4 (Libertadores na A, acesso na B). */
  g4Prob: number
  /** % de chance de rebaixamento. */
  relegationProb: number
  /** Pontuação esperada ao fim da temporada. */
  expectedPoints: number
  /** Intervalo de confiança 95% da pontuação final. */
  pointsRange: [number, number]
}

/** Perfil completo do clube usado na página `/times/:slug`. */
export interface TeamProfile extends TeamSummary {
  current: TeamCurrentSnapshot
}

/** Ponto da série temporal "cardiograma da temporada". */
export interface SeasonPoint {
  rodada: number
  titleProb: number
  g4Prob: number
  relegationProb: number
  /** IC 95% inferior da prob. de título. */
  titleLow: number
  /** IC 95% superior da prob. de título. */
  titleHigh: number
  expectedPoints: number
}

/** Posição final histórica do clube em uma temporada passada. */
export interface HistoryPoint {
  year: number
  position: number
  points: number
  /** Prob. simulada de título naquela temporada (0–100). */
  titleProb: number
  champion: boolean
}

/** Bin do histograma de pontuação final simulada. */
export interface DistributionBucket {
  /** Faixa central de pontos (inteiro). */
  points: number
  /** Quantidade de cenários simulados que terminaram nessa faixa. */
  count: number
  /** Densidade normalizada (soma de `density` em todos os buckets = 1). */
  density: number
}

/** Jogo do calendário do clube (passado ou futuro). */
export interface TeamFixture {
  rodada: number
  /** ISO date `YYYY-MM-DD`. */
  date: string
  /** Nome curto do adversário. */
  opponent: string
  home: boolean
  played: boolean
  /** Resultado em jogos já disputados. */
  result?: { team: number; opponent: number }
  /** Probabilidades em jogos futuros. */
  winProb?: number
  drawProb?: number
  lossProb?: number
}

// ============================================================
// Competições (catálogo + estado da rodada)
// ============================================================
export interface CompetitionSummary {
  id: CompetitionId
  name: string
  /** Ex.: "Brasileirão Série A 2026". */
  fullName: string
  season: number
  /** Total de rodadas; vem `null` em copas mata-mata. */
  rounds: number | null
  currentRound: number
  /** Slug do líder atual. */
  leaderSlug: Slug
  leaderName: string
  /** Probabilidade de título do líder. */
  leaderTitleProb: number
  lastUpdatedAt: string
}

/** Snapshot de manchete usado no hero da home. */
export interface RoundStateCard {
  /** Categoria editorial: liderança, ameaça, surpresa. */
  kind: "leader" | "threat" | "highlight"
  team: TeamSummary
  /** Métrica em destaque (`titleProb`, `relegationProb`, etc.). */
  metric: string
  /** Valor numérico da métrica (em %). */
  value: number
  /** Diferença para o snapshot da rodada anterior, em pontos percentuais. */
  delta: number
  /** Manchete editorial curta. */
  headline: string
}

export interface RoundState {
  competition: CompetitionId
  round: number
  totalRounds: number
  lastUpdatedAt: string
  cards: RoundStateCard[]
}

// ============================================================
// Brasileirão — painel
// ============================================================
export type StandingMode =
  | "geral"
  | "ultimas-10"
  | "mandante"
  | "visitante"
  | "turno"
  | "returno"

export type StatKey =
  | "vitorias"
  | "derrotas"
  | "invencibilidade"
  | "sem-vitorias"
  | "melhor-ataque"
  | "melhor-defesa"

export interface TeamProbabilityRow {
  team: TeamSummary
  champion: number
  /** Libertadores (A) ou acesso à Série A (B). */
  libertadores: number
  /** Sulamericana (A) ou disputa de acesso (B). */
  sulamericana: number
  relegation: number
}

export interface PointsBucket {
  /** Faixa textual ex.: "60-64". */
  range: string
  min: number
  max: number
  /** Probabilidade do clube terminar nessa faixa (0–100). */
  prob: number
}

export interface TeamPointsDistribution {
  team: TeamSummary
  expected: number
  buckets: PointsBucket[]
}

export interface StandingRow {
  team: TeamSummary
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

/** Linha do confronto da próxima rodada. */
export interface UpcomingFixture {
  id: string
  home: TeamSummary
  away: TeamSummary
  /** Data por extenso já formatada para PT-BR (ex.: "Sáb 09 Nov"). */
  date: string
  /** Hora local de Brasília (HH:mm). */
  time: string
  venue: string
  homeWin: number
  draw: number
  awayWin: number
  /** Gols esperados [casa, fora]. */
  expectedGoals: [number, number]
}

export interface StatRankingRow {
  team: TeamSummary
  value: number
  /** Texto auxiliar (ex.: "iniciada na rodada 18"). */
  detail: string
}

// ============================================================
// Histórico
// ============================================================
export interface HeatmapCell {
  teamSlug: Slug
  year: number
  position: number
  champion: boolean
  /** Prob. média de título naquela temporada. */
  titleProb: number
}

export interface HeatmapResponse {
  startYear: number
  endYear: number
  teams: TeamSummary[]
  cells: HeatmapCell[]
}

/** Série de probabilidade ao longo de uma temporada (cardiograma da home). */
export interface CardiogramSeries {
  team: TeamSummary
  /** Ponto a ponto ao longo da temporada. */
  points: { rodada: number; value: number }[]
}

export interface CardiogramResponse {
  competition: CompetitionId
  metric: "titleProb" | "g4Prob" | "relegationProb"
  /** Eventos editoriais sobrepostos no gráfico. */
  annotations: { rodada: number; label: string }[]
  series: CardiogramSeries[]
}

// ============================================================
// Editorial / Conteúdo
// ============================================================
export interface EditorialArticle {
  slug: Slug
  title: string
  excerpt: string
  /** Categoria editorial. */
  kind: "analysis" | "interview" | "explainer" | "data-story"
  /** Imagem de capa (URL absoluta). */
  cover?: string
  publishedAt: string
  readingMinutes: number
  authorSlug: Slug
}

export interface MethodologyContent {
  /** Markdown da página de metodologia. */
  body: string
  steps: { title: string; description: string }[]
  formulas: { caption: string; latex: string }[]
  updatedAt: string
}

export interface TeamMember {
  slug: Slug
  name: string
  role: string
  area: string
  bio: string
  email: string
  founder?: boolean
  /** URL de página institucional (ex.: Lattes). */
  externalUrl?: string
}

// ============================================================
// Newsletter
// ============================================================
export interface NewsletterSubscriptionRequest {
  email: string
  /** Slugs de clubes favoritos. */
  favoriteTeams?: Slug[]
  /** Frequência preferida. */
  frequency?: "weekly" | "after-each-round"
}

export interface NewsletterSubscriptionResponse {
  ok: true
  email: string
  /** Token de confirmação enviado por e-mail (double opt-in). */
  confirmationSent: boolean
}

// ============================================================
// Envelopes utilitários
// ============================================================
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** Envelope de erro estável retornado pelo backend. */
export interface ApiErrorPayload {
  code: string
  message: string
  details?: Record<string, unknown>
}
