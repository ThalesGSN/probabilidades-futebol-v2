import { apiClient } from "../client"
import { endpoints } from "../endpoints"
import type { CompetitionId, CompetitionSummary, RoundState } from "../types"

/**
 * Lista os campeonatos cobertos pelo site (Série A e Série B no MVP).
 * Ordem ditada pelo backend; o frontend respeita.
 *
 * @route GET /competitions
 */
export async function listCompetitions(): Promise<CompetitionSummary[]> {
  const { data } = await apiClient.get<CompetitionSummary[]>(endpoints.competitions())
  return data
}

/**
 * Snapshot de uma competição (líder, rodada atual, última atualização).
 *
 * @route GET /competitions/:id
 */
export async function getCompetition(id: CompetitionId): Promise<CompetitionSummary> {
  const { data } = await apiClient.get<CompetitionSummary>(endpoints.competition(id))
  return data
}

/**
 * "Estado da rodada" — manchetes editoriais do hero da home:
 * líder, time mais ameaçado, surpresa da rodada, etc.
 *
 * @route GET /competitions/:id/round-state
 */
export async function getRoundState(id: CompetitionId): Promise<RoundState> {
  const { data } = await apiClient.get<RoundState>(endpoints.roundState(id))
  return data
}
