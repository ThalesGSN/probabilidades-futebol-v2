import { apiClient } from "../client"
import { endpoints } from "../endpoints"
import type {
  Division,
  Slug,
  TeamFixture,
  TeamProfile,
  TeamSummary,
  SeasonPoint,
  HistoryPoint,
  DistributionBucket,
} from "../types"

/**
 * Lista todos os clubes (Série A e B), opcionalmente filtrando por divisão.
 *
 * @route GET /teams[?division=A|B]
 * @example const all = await listTeams()
 * @example const serieB = await listTeams({ division: "B" })
 */
export async function listTeams(params?: { division?: Division }): Promise<TeamSummary[]> {
  const url = params?.division ? endpoints.teamsByDivision(params.division) : endpoints.teams()
  const { data } = await apiClient.get<TeamSummary[]>(url)
  return data
}

/**
 * Perfil completo do clube — usado no hero de `/times/:slug`.
 *
 * @route GET /teams/:slug
 * @throws {ApiError} 404 se o slug não existir.
 */
export async function getTeamProfile(slug: Slug): Promise<TeamProfile> {
  const { data } = await apiClient.get<TeamProfile>(endpoints.team(slug))
  return data
}

/**
 * Cardiograma da temporada corrente do clube — uma entrada por rodada.
 *
 * @route GET /teams/:slug/season
 */
export async function getTeamSeason(slug: Slug): Promise<SeasonPoint[]> {
  const { data } = await apiClient.get<SeasonPoint[]>(endpoints.teamSeason(slug))
  return data
}

/**
 * Posições finais do clube por temporada (2005 → atual).
 *
 * @route GET /teams/:slug/history
 */
export async function getTeamHistory(slug: Slug): Promise<HistoryPoint[]> {
  const { data } = await apiClient.get<HistoryPoint[]>(endpoints.teamHistory(slug))
  return data
}

/**
 * Distribuição de pontuação final em 10.000 simulações de Monte Carlo.
 *
 * @route GET /teams/:slug/monte-carlo
 */
export async function getTeamMonteCarlo(slug: Slug): Promise<DistributionBucket[]> {
  const { data } = await apiClient.get<DistributionBucket[]>(endpoints.teamMonteCarlo(slug))
  return data
}

/**
 * Calendário do clube — últimos resultados + próximos jogos com probabilidades.
 *
 * @route GET /teams/:slug/fixtures
 */
export async function getTeamFixtures(slug: Slug): Promise<TeamFixture[]> {
  const { data } = await apiClient.get<TeamFixture[]>(endpoints.teamFixtures(slug))
  return data
}
