import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios"

/**
 * Cliente HTTP central da aplicação.
 *
 * Configurado para o backend "Probabilidades no Futebol UFMG v2".
 * Todas as URLs são relativas a `VITE_API_BASE_URL` (definido em `.env`).
 *
 * Convenções:
 * - Sempre retorna JSON.
 * - Erros 4xx/5xx levantam `ApiError` (com payload original em `.data`).
 * - Aceita um `requestId` opcional via header `x-request-id` para tracing.
 * - Inclui um cabeçalho `x-client` para diferenciar tráfego do site v2.
 */

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "https://api.mat.ufmg.br/futebol/v2"

export class ApiError<T = unknown> extends Error {
  status: number
  data: T | null
  requestId?: string

  constructor(message: string, status: number, data: T | null, requestId?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
    this.requestId = requestId
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 12_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-client": "ufmg-futebol-v2",
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Identificador único de requisição (útil para correlacionar com o backend)
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    config.headers.set("x-request-id", crypto.randomUUID())
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const status = error.response?.status ?? 0
    const payload = error.response?.data ?? null
    const message =
      payload?.message ??
      error.message ??
      `Erro de rede ao chamar ${error.config?.url ?? "API"}`
    const requestId = error.response?.headers["x-request-id"]
    return Promise.reject(new ApiError(message, status, payload, requestId))
  },
)
