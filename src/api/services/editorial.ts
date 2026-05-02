import { apiClient } from "../client"
import { endpoints } from "../endpoints"
import type { EditorialArticle, MethodologyContent, Slug, TeamMember } from "../types"

/**
 * Artigos do blog editorial. Ordenados por data, mais recentes primeiro.
 *
 * @route GET /editorial?limit=10
 */
export async function listEditorial(limit = 10): Promise<EditorialArticle[]> {
  const { data } = await apiClient.get<EditorialArticle[]>(endpoints.editorial(limit))
  return data
}

/**
 * Artigo individual.
 *
 * @route GET /editorial/:slug
 */
export async function getEditorialArticle(slug: Slug): Promise<EditorialArticle> {
  const { data } = await apiClient.get<EditorialArticle>(endpoints.editorialArticle(slug))
  return data
}

/**
 * Conteúdo institucional da página de metodologia (markdown + fórmulas).
 *
 * @route GET /content/methodology
 */
export async function getMethodology(): Promise<MethodologyContent> {
  const { data } = await apiClient.get<MethodologyContent>(endpoints.methodology())
  return data
}

/**
 * Equipe do projeto (seção "Nosso time" da home).
 *
 * @route GET /about/team
 */
export async function getOurTeam(): Promise<TeamMember[]> {
  const { data } = await apiClient.get<TeamMember[]>(endpoints.ourTeam())
  return data
}
