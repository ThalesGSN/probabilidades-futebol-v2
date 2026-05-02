import { apiClient } from "../client"
import { endpoints } from "../endpoints"
import type {
  Division,
  StandingMode,
  StandingRow,
  StatKey,
  StatRankingRow,
  TeamPointsDistribution,
  TeamProbabilityRow,
  UpcomingFixture,
} from "../types"

/**
 * Probabilidades agregadas por clube para uma divisão do Brasileirão.
 * Inclui chances de título, G4, Sul-Americana e rebaixamento.
 *
 * @route GET /competitions/brasileirao/probabilities?division=A|B
 */
export async function getBrasileiraoProbabilities(
  division: Division,
): Promise<TeamProbabilityRow[]> {
  const { data } = await apiClient.get<TeamProbabilityRow[]>(
    endpoints.brasileiraoProbabilities(division),
  )
  return data
}

/**
 * Distribuição da pontuação final por clube, agregada em faixas de 5 em 5.
 *
 * @route GET /competitions/brasileirao/points-distribution?division=A|B
 */
export async function getBrasileiraoPointsDistribution(
  division: Division,
): Promise<TeamPointsDistribution[]> {
  const { data } = await apiClient.get<TeamPointsDistribution[]>(
    endpoints.brasileiraoPointsDistribution(division),
  )
  return data
}

/**
 * Tabela de classificação sob diferentes recortes (geral, mandante, turno…).
 *
 * @route GET /competitions/brasileirao/standings?division=A|B&mode=...
 * @param mode geral · ultimas-10 · mandante · visitante · turno · returno
 */
export async function getBrasileiraoStandings(
  division: Division,
  mode: StandingMode,
): Promise<StandingRow[]> {
  const { data } = await apiClient.get<StandingRow[]>(
    endpoints.brasileiraoStandings(division, mode),
  )
  return data
}

/**
 * Confrontos da próxima rodada com probabilidades de resultado e gols esperados.
 *
 * @route GET /competitions/brasileirao/next-round?division=A|B
 */
export async function getBrasileiraoNextRound(
  division: Division,
): Promise<UpcomingFixture[]> {
  const { data } = await apiClient.get<UpcomingFixture[]>(
    endpoints.brasileiraoNextRound(division),
  )
  return data
}

/**
 * Ranking de uma estatística específica (sequências, ataque, defesa).
 *
 * @route GET /competitions/brasileirao/stats?division=A|B&key=...
 */
export async function getBrasileiraoStatRanking(
  division: Division,
  key: StatKey,
): Promise<StatRankingRow[]> {
  const { data } = await apiClient.get<StatRankingRow[]>(
    endpoints.brasileiraoStats(division, key),
  )
  return data
}
