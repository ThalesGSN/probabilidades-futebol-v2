/**
 * Camada de API da aplicação.
 *
 * Estrutura:
 *   - client.ts        → instância axios + ApiError
 *   - fetcher.ts       → fetcher SWR-compatível
 *   - endpoints.ts     → catálogo central de URLs
 *   - types.ts         → DTOs trocados com o backend
 *   - services/*.ts    → funções por domínio (Promises)
 *
 * Veja `src/api/README.md` para o catálogo completo de endpoints.
 */
export { apiClient, ApiError } from "./client"
export { fetcher } from "./fetcher"
export { endpoints } from "./endpoints"
export * from "./types"

export * from "./services/teams"
export * from "./services/competitions"
export * from "./services/brasileirao"
export * from "./services/historical"
export * from "./services/editorial"
export * from "./services/newsletter"
