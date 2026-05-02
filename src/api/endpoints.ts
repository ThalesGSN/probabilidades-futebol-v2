import type { CompetitionId, Division, Slug, StandingMode, StatKey } from "./types"

/**
 * Catálogo central de URLs da API.
 *
 * Tudo concentrado aqui para facilitar refatorações de versão (`/v2` → `/v3`)
 * e para permitir uso direto como chaves SWR (cada path é estável e único).
 */
export const endpoints = {
  // ---- Competições ----
  competitions: () => "/competitions",
  competition: (id: CompetitionId) => `/competitions/${id}`,
  roundState: (id: CompetitionId) => `/competitions/${id}/round-state`,

  // ---- Times ----
  teams: () => "/teams",
  teamsByDivision: (division: Division) => `/teams?division=${division}`,
  team: (slug: Slug) => `/teams/${slug}`,
  teamSeason: (slug: Slug) => `/teams/${slug}/season`,
  teamHistory: (slug: Slug) => `/teams/${slug}/history`,
  teamMonteCarlo: (slug: Slug) => `/teams/${slug}/monte-carlo`,
  teamFixtures: (slug: Slug) => `/teams/${slug}/fixtures`,

  // ---- Brasileirão (painel) ----
  brasileiraoProbabilities: (division: Division) =>
    `/competitions/brasileirao/probabilities?division=${division}`,
  brasileiraoPointsDistribution: (division: Division) =>
    `/competitions/brasileirao/points-distribution?division=${division}`,
  brasileiraoStandings: (division: Division, mode: StandingMode) =>
    `/competitions/brasileirao/standings?division=${division}&mode=${mode}`,
  brasileiraoNextRound: (division: Division) =>
    `/competitions/brasileirao/next-round?division=${division}`,
  brasileiraoStats: (division: Division, key: StatKey) =>
    `/competitions/brasileirao/stats?division=${division}&key=${key}`,

  // ---- Histórico ----
  historicalHeatmap: (start: number, end: number) =>
    `/historical/heatmap?startYear=${start}&endYear=${end}`,
  cardiogram: (id: CompetitionId, metric: string, teams: Slug[]) =>
    `/historical/cardiogram?competition=${id}&metric=${metric}&teams=${teams.join(",")}`,

  // ---- Editorial / Conteúdo ----
  editorial: (limit = 10) => `/editorial?limit=${limit}`,
  editorialArticle: (slug: Slug) => `/editorial/${slug}`,
  methodology: () => "/content/methodology",
  ourTeam: () => "/about/team",

  // ---- Newsletter ----
  newsletterSubscribe: () => "/newsletter/subscribe",
} as const
