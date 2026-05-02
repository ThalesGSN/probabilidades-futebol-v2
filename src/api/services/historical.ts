import { apiClient } from "../client"
import { endpoints } from "../endpoints"
import type {
  CardiogramResponse,
  CompetitionId,
  HeatmapResponse,
  Slug,
} from "../types"

/**
 * Heatmap histórico — matriz [clube × ano] usada na home.
 *
 * @route GET /historical/heatmap?startYear=2005&endYear=2025
 * @param startYear ano inicial (default: 2005, primeiro ano de pontos corridos)
 * @param endYear ano final (default: temporada atual)
 */
export async function getHistoricalHeatmap(
  startYear = 2005,
  endYear: number = new Date().getUTCFullYear(),
): Promise<HeatmapResponse> {
  const { data } = await apiClient.get<HeatmapResponse>(
    endpoints.historicalHeatmap(startYear, endYear),
  )
  return data
}

/**
 * Cardiograma multi-time da temporada corrente (gráfico-coração da home).
 *
 * Cada série traz os pontos por rodada para a métrica selecionada.
 * Aceita até ~6 clubes para preservar legibilidade.
 *
 * @route GET /historical/cardiogram?competition=...&metric=...&teams=slug,slug
 */
export async function getCardiogram(params: {
  competition: CompetitionId
  metric: "titleProb" | "g4Prob" | "relegationProb"
  teams: Slug[]
}): Promise<CardiogramResponse> {
  const { data } = await apiClient.get<CardiogramResponse>(
    endpoints.cardiogram(params.competition, params.metric, params.teams),
  )
  return data
}
