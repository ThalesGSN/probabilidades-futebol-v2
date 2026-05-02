import useSWR from "swr"
import { fetcher } from "@/src/api/fetcher"
import { endpoints } from "@/src/api/endpoints"
import type { EditorialArticle, MethodologyContent, Slug, TeamMember } from "@/src/api/types"

export function useEditorial(limit = 10) {
  return useSWR<EditorialArticle[]>(endpoints.editorial(limit), fetcher)
}

export function useEditorialArticle(slug: Slug | undefined) {
  return useSWR<EditorialArticle>(slug ? endpoints.editorialArticle(slug) : null, fetcher)
}

export function useMethodology() {
  return useSWR<MethodologyContent>(endpoints.methodology(), fetcher)
}

export function useOurTeam() {
  return useSWR<TeamMember[]>(endpoints.ourTeam(), fetcher)
}
