import { apiClient } from "./client"

/**
 * Fetcher genérico SWR-compatível usando o cliente axios.
 *
 * Uso:
 * ```ts
 * const { data } = useSWR<TeamProfile>(`/teams/${slug}`, fetcher)
 * ```
 *
 * Aceita uma string (apenas URL) ou um array `[url, params]` para queries.
 */
export const fetcher = async <T>(input: string | [string, Record<string, unknown>]): Promise<T> => {
  if (Array.isArray(input)) {
    const [url, params] = input
    const res = await apiClient.get<T>(url, { params })
    return res.data
  }
  const res = await apiClient.get<T>(input)
  return res.data
}
