import useSWR from "swr"
import { fetcher } from "@/src/api/fetcher"
import { endpoints } from "@/src/api/endpoints"
import type {
  DistributionBucket,
  Division,
  HistoryPoint,
  SeasonPoint,
  Slug,
  TeamFixture,
  TeamProfile,
  TeamSummary,
} from "@/src/api/types"

/** Lista de clubes, opcionalmente filtrada por divisão. */
export function useTeams(division?: Division) {
  const key = division ? endpoints.teamsByDivision(division) : endpoints.teams()
  return useSWR<TeamSummary[]>(key, fetcher)
}

/** Perfil completo de um clube. */
export function useTeam(slug: Slug | undefined) {
  return useSWR<TeamProfile>(slug ? endpoints.team(slug) : null, fetcher)
}

/** Cardiograma da temporada do clube. */
export function useTeamSeason(slug: Slug | undefined) {
  return useSWR<SeasonPoint[]>(slug ? endpoints.teamSeason(slug) : null, fetcher)
}

/** Histórico anual do clube. */
export function useTeamHistory(slug: Slug | undefined) {
  return useSWR<HistoryPoint[]>(slug ? endpoints.teamHistory(slug) : null, fetcher)
}

/** Distribuição Monte Carlo da pontuação final. */
export function useTeamMonteCarlo(slug: Slug | undefined) {
  return useSWR<DistributionBucket[]>(slug ? endpoints.teamMonteCarlo(slug) : null, fetcher)
}

/** Calendário do clube. */
export function useTeamFixtures(slug: Slug | undefined) {
  return useSWR<TeamFixture[]>(slug ? endpoints.teamFixtures(slug) : null, fetcher)
}
