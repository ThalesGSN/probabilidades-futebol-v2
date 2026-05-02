import useSWR from "swr"
import { fetcher } from "@/src/api/fetcher"
import { endpoints } from "@/src/api/endpoints"
import type {
  Division,
  StandingMode,
  StandingRow,
  StatKey,
  StatRankingRow,
  TeamPointsDistribution,
  TeamProbabilityRow,
  UpcomingFixture,
} from "@/src/api/types"

export function useBrasileiraoProbabilities(division: Division) {
  return useSWR<TeamProbabilityRow[]>(endpoints.brasileiraoProbabilities(division), fetcher)
}

export function useBrasileiraoPointsDistribution(division: Division) {
  return useSWR<TeamPointsDistribution[]>(
    endpoints.brasileiraoPointsDistribution(division),
    fetcher,
  )
}

export function useBrasileiraoStandings(division: Division, mode: StandingMode) {
  return useSWR<StandingRow[]>(endpoints.brasileiraoStandings(division, mode), fetcher)
}

export function useBrasileiraoNextRound(division: Division) {
  return useSWR<UpcomingFixture[]>(endpoints.brasileiraoNextRound(division), fetcher)
}

export function useBrasileiraoStats(division: Division, key: StatKey) {
  return useSWR<StatRankingRow[]>(endpoints.brasileiraoStats(division, key), fetcher)
}
