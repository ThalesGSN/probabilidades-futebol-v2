import useSWR from "swr"
import { fetcher } from "@/src/api/fetcher"
import { endpoints } from "@/src/api/endpoints"
import type { CompetitionId, CompetitionSummary, RoundState } from "@/src/api/types"

export function useCompetitions() {
  return useSWR<CompetitionSummary[]>(endpoints.competitions(), fetcher)
}

export function useCompetition(id: CompetitionId | undefined) {
  return useSWR<CompetitionSummary>(id ? endpoints.competition(id) : null, fetcher)
}

export function useRoundState(id: CompetitionId | undefined) {
  return useSWR<RoundState>(id ? endpoints.roundState(id) : null, fetcher, {
    refreshInterval: 60_000, // mantém o hero da home "vivo"
  })
}
