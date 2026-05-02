import useSWR from "swr"
import { fetcher } from "@/src/api/fetcher"
import { endpoints } from "@/src/api/endpoints"
import type {
  CardiogramResponse,
  CompetitionId,
  HeatmapResponse,
  Slug,
} from "@/src/api/types"

export function useHistoricalHeatmap(
  startYear = 2005,
  endYear: number = new Date().getUTCFullYear(),
) {
  return useSWR<HeatmapResponse>(endpoints.historicalHeatmap(startYear, endYear), fetcher)
}

export function useCardiogram(params: {
  competition: CompetitionId
  metric: "titleProb" | "g4Prob" | "relegationProb"
  teams: Slug[]
}) {
  const enabled = params.teams.length > 0
  return useSWR<CardiogramResponse>(
    enabled ? endpoints.cardiogram(params.competition, params.metric, params.teams) : null,
    fetcher,
  )
}
