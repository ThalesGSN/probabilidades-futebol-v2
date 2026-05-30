/**
 * Hooks SWR que lêem JSON estáticos de /public/data/.
 * O pipeline de simulação substitui esses arquivos após cada rodada.
 */

import useSWR from "swr"
import type { Division } from "@/lib/teams"
import type {
  TeamProbabilityRow,
  TeamPointsDistribution,
  StandingRow,
  FixtureRow,
  StatRow,
  StatKey,
} from "@/lib/brasileirao"
import type { Team } from "@/lib/teams"

export type MatchResult = {
  round: number
  homeSlug: string
  awaySlug: string
  homeGoals: number
  awayGoals: number
}

export type TeamPageData = {
  season: import("@/lib/teams").SeasonPoint[]
  history: import("@/lib/teams").HistoryPoint[]
  monteCarlo: import("@/lib/teams").DistributionBucket[]
  fixtures: import("@/lib/teams").Fixture[]
}

export type StandingsJson = {
  geral: StandingRow[]
  mandante: StandingRow[]
  visitante: StandingRow[]
  turno: StandingRow[]
  returno: StandingRow[]
}

const jsonFetcher = (url: string) => fetch(url).then((r) => r.json())

function divPath(division: Division) {
  return `/data/brasileirao-${division.toLowerCase()}`
}

export function useProbabilities(division: Division) {
  return useSWR<TeamProbabilityRow[]>(
    `${divPath(division)}/probabilities.json`,
    jsonFetcher,
  )
}

export function usePointsDistribution(division: Division) {
  return useSWR<TeamPointsDistribution[]>(
    `${divPath(division)}/points-distribution.json`,
    jsonFetcher,
  )
}

export function useStandings(division: Division) {
  return useSWR<StandingsJson>(
    `${divPath(division)}/standings.json`,
    jsonFetcher,
  )
}

export function useMatchResults(division: Division) {
  return useSWR<MatchResult[]>(
    `${divPath(division)}/results.json`,
    jsonFetcher,
  )
}

export function useNextRound(division: Division) {
  return useSWR<FixtureRow[]>(
    `${divPath(division)}/next-round.json`,
    jsonFetcher,
  )
}

export function useStats(division: Division) {
  return useSWR<Record<StatKey, StatRow[]>>(
    `${divPath(division)}/stats.json`,
    jsonFetcher,
  )
}

export type DivisionMetadata = { generatedAt: string }

export function useMetadata(division: Division) {
  return useSWR<DivisionMetadata>(
    `${divPath(division)}/metadata.json`,
    jsonFetcher,
  )
}

export function useTeams() {
  return useSWR<Team[]>("/data/teams.json", jsonFetcher)
}

export function useTeamPageData(slug: string) {
  return useSWR<TeamPageData>(`/data/teams/${slug}.json`, jsonFetcher)
}
