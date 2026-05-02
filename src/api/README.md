# API · Probabilidades no Futebol UFMG v2

Catálogo dos endpoints sugeridos para o backend e dos DTOs consumidos pelo frontend.

- **Base URL**: `VITE_API_BASE_URL` (ex.: `https://api.mat.ufmg.br/futebol/v2`)
- **Cliente HTTP**: axios — `src/api/client.ts`
- **Fetcher SWR**: `src/api/fetcher.ts`
- **Tipos (DTO)**: `src/api/types.ts`
- **Catálogo de URLs**: `src/api/endpoints.ts`
- **Serviços (Promises)**: `src/api/services/*.ts`
- **Hooks SWR**: `src/hooks/api/*.ts`

Todos os endpoints retornam JSON e seguem as convenções:

- Probabilidades em **percentual (0–100)**, 1 casa decimal.
- Datas no formato **`YYYY-MM-DD`** (sem timezone) salvo quando indicado.
- Cores de clube em **hex `#RRGGBB`**.
- Slugs em **kebab-case ASCII** (`atletico-mg`, `sao-paulo`).
- Erros usam o envelope `ApiErrorPayload` com `code` e `message`.

---

## 1. Times

| Método | URL                              | Retorno              | Usado em                                  |
| ------ | -------------------------------- | -------------------- | ----------------------------------------- |
| GET    | `/teams[?division=A\|B]`         | `TeamSummary[]`      | `TeamsIndex`, `ClubesPage`, `TeamRelated` |
| GET    | `/teams/:slug`                   | `TeamProfile`        | `TeamPage` (hero)                         |
| GET    | `/teams/:slug/season`            | `SeasonPoint[]`      | `TeamSeasonChart`                         |
| GET    | `/teams/:slug/history`           | `HistoryPoint[]`     | `TeamHistoryChart`                        |
| GET    | `/teams/:slug/monte-carlo`       | `DistributionBucket[]` | `TeamMonteCarlo`                        |
| GET    | `/teams/:slug/fixtures`          | `TeamFixture[]`      | `TeamFixtures`                            |

## 2. Competições

| Método | URL                              | Retorno               | Usado em                  |
| ------ | -------------------------------- | --------------------- | ------------------------- |
| GET    | `/competitions`                  | `CompetitionSummary[]`| `ChampionshipsGrid`       |
| GET    | `/competitions/:id`              | `CompetitionSummary`  | `BrasileiraoPanel` (header) |
| GET    | `/competitions/:id/round-state`  | `RoundState`          | `HeroSection` (home)      |

`:id` ∈ `brasileirao-a` · `brasileirao-b`.

## 3. Brasileirão (painel `/brasileirao`)

Todos aceitam `?division=A|B`.

| Método | URL                                                       | Retorno                       | Sub-aba                |
| ------ | --------------------------------------------------------- | ----------------------------- | ---------------------- |
| GET    | `/competitions/brasileirao/probabilities`                 | `TeamProbabilityRow[]`        | Probabilidades por time |
| GET    | `/competitions/brasileirao/points-distribution`           | `TeamPointsDistribution[]`    | Probabilidade por pontuação |
| GET    | `/competitions/brasileirao/standings?mode=...`            | `StandingRow[]`               | Classificação          |
| GET    | `/competitions/brasileirao/next-round`                    | `UpcomingFixture[]`           | Próxima rodada         |
| GET    | `/competitions/brasileirao/stats?key=...`                 | `StatRankingRow[]`            | Estatísticas           |

`mode` ∈ `geral` · `ultimas-10` · `mandante` · `visitante` · `turno` · `returno`.
`key` ∈ `vitorias` · `derrotas` · `invencibilidade` · `sem-vitorias` · `melhor-ataque` · `melhor-defesa`.

## 4. Histórico

| Método | URL                                                                    | Retorno              | Usado em                  |
| ------ | ---------------------------------------------------------------------- | -------------------- | ------------------------- |
| GET    | `/historical/heatmap?startYear=2005&endYear=2025`                      | `HeatmapResponse`    | `HistoricalHeatmap`       |
| GET    | `/historical/cardiogram?competition=...&metric=...&teams=slug,slug`    | `CardiogramResponse` | `ProbabilityCardiogram`   |

`metric` ∈ `titleProb` · `g4Prob` · `relegationProb`.

## 5. Editorial / Conteúdo

| Método | URL                       | Retorno              | Usado em                |
| ------ | ------------------------- | -------------------- | ----------------------- |
| GET    | `/editorial?limit=N`      | `EditorialArticle[]` | `EditorialSection`      |
| GET    | `/editorial/:slug`        | `EditorialArticle`   | (futuro: leitura full)  |
| GET    | `/content/methodology`    | `MethodologyContent` | `MethodologyTeaser`     |
| GET    | `/about/team`             | `TeamMember[]`       | `OurTeamSection`        |

## 6. Newsletter

| Método | URL                       | Body                            | Retorno                            | Usado em            |
| ------ | ------------------------- | ------------------------------- | ---------------------------------- | ------------------- |
| POST   | `/newsletter/subscribe`   | `NewsletterSubscriptionRequest` | `NewsletterSubscriptionResponse`   | `NewsletterSection` |

Erros relevantes: `409 ALREADY_SUBSCRIBED`, `422 INVALID_EMAIL`.

---

## Cabeçalhos

Todas as requisições enviam:

- `x-client: ufmg-futebol-v2` — diferencia tráfego do site v2 nos logs.
- `x-request-id: <uuid>` — correlaciona logs cliente↔servidor.

Sugestão para o backend:

- `Cache-Control: public, max-age=60, stale-while-revalidate=300` em endpoints de leitura.
- `Last-Modified` no snapshot da rodada para permitir `If-Modified-Since`.

## Rate limiting

`POST /newsletter/subscribe` deve ter rate limit **5 req / 15 min / IP**.
Demais endpoints podem usar `60 req / min / IP` em CDN.

## Autenticação

O MVP é **público / read-only**. `POST` autenticados (admin, futuramente) usarão
header `Authorization: Bearer <token>` validado no backend.
