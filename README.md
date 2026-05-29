# Probabilidades Futebol

Visualizador de probabilidades do **Brasileirão Série A e B** — classificação, simulação Monte Carlo por time e próximas rodadas.

**[probabilidades-futebol.vercel.app](https://probabilidades-futebol.vercel.app)**

---

## Visão geral

```
GitHub Actions (cron 22h BRT)
  └── pipeline Python
        ├── API Futebol  →  resultados e fixtures
        ├── Monte Carlo  →  10 000 simulações por campeonato
        └── public/data/ →  JSONs commitados no repo
              └── Vercel (redeploy automático ao push)
                    └── React + Vite + Recharts
```

O pipeline roda diariamente, commita os JSONs gerados em `public/data/` e o Vercel detecta o push e faz redeploy — sem servidor, sem banco de dados, sem infraestrutura para manter.

---

## Frontend

**Stack:** React 18, Vite, React Router, Tailwind CSS, shadcn/ui, Recharts, SWR

**Páginas:**
- `/` — home com links para cada divisão
- `/brasileirao/:division` — classificação, probabilidades, próxima rodada, estatísticas
- `/clubes` — índice de times
- `/times/:slug` — página individual do time (trajetória, distribuição Monte Carlo)

Os hooks em `hooks/use-static-data.ts` buscam os JSONs via SWR direto de `/data/` (servido pelo Vercel junto com o build).

### Rodar localmente

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Backend — Pipeline de dados

Código em `backend/lambdas/data-pipeline/`.

### Estrutura

```
handler.py          ← entrypoint; orquestra as etapas
sources/
  api_futebol.py    ← cliente REST da API Futebol (times, resultados, fixtures)
models/
  team.py           ← dataclasses Team, SeasonPoint, DistributionBucket
  brasileirao.py    ← MatchResult, StandingRow, NextRoundFixture
compute/
  standings.py      ← classificação real (geral, home, away, últimas N rodadas)
  monte_carlo.py    ← simulação Monte Carlo (modelo de Poisson)
  statistics.py     ← artilharia, assistências, desempenho por time
  probabilities.py  ← agrega probabilidades por time em ProbabilityRow
  next_round.py     ← fixtures da próxima rodada com probabilidades do MC
upload/
  local.py          ← salva JSONs em public/data/ (usado pelo pipeline atual)
  s3.py             ← upload S3 (legado, mantido como referência)
```

### Modelo Monte Carlo

O modelo segue a abordagem de **Dixon-Coles simplificado** (Poisson independente):

```
λ_home = attack_home × defense_away × home_advantage × league_avg_goals
λ_away = attack_away × defense_home × league_avg_goals
```

Os parâmetros de ataque e defesa de cada time são estimados a partir dos resultados já disputados na temporada. Para cada uma das **10 000 simulações**, os jogos restantes são resolvidos amostrando de `Poisson(λ)` para cada lado, e a tabela final é calculada com os critérios de desempate do Brasileirão.

**Saídas por time (Série A):**
| Campo | Descrição |
|---|---|
| `title_prob` | % de ser campeão |
| `libertadores_prob` | % de terminar top 6 |
| `sulamericana_prob` | % de terminar 7º–12º |
| `relegation_prob` | % de cair para Série B |
| `expected_points` | média de pontos nas simulações |
| `points_range` | intervalo de confiança 95% |

### JSONs gerados em `public/data/`

```
brasileirao-a/
  probabilities.json        ← probabilidades agregadas por time
  points-distribution.json  ← distribuição de pontos finais (histograma)
  standings.json            ← classificação (geral, casa, fora, últimas rodadas)
  results.json              ← todos os resultados disputados
  next-round.json           ← fixtures com probabilidades
  stats.json                ← artilheiros, assistências
teams.json                  ← índice de todos os times
teams/<slug>.json           ← trajetória e distribuição Monte Carlo por time
```

### Rodar localmente

```bash
cd backend/lambdas/data-pipeline
pip install -r requirements.txt

export API_FUTEBOL_KEY=SUA_KEY
python handler.py
# JSONs salvos em public/data/
```

### IDs dos campeonatos

Verificar os IDs corretos para a temporada atual no painel da [API Futebol](https://www.api-futebol.com.br/) e ajustar as variáveis de ambiente se necessário:

| Variável | Default | Descrição |
|---|---|---|
| `SERIE_A_ID` | `10` | ID do campeonato Série A |
| `SERIE_B_ID` | `11` | ID do campeonato Série B |
| `MONTE_CARLO_N` | `10000` | Número de simulações |
| `TOTAL_ROUNDS` | `38` | Total de rodadas na temporada |

---

## GitHub Actions — cron diário

O workflow em `.github/workflows/data-pipeline.yml` roda todo dia às **22h BRT** (01:00 UTC):

1. Instala dependências Python
2. Executa `handler.py`
3. Commita os JSONs atualizados em `public/data/`
4. O push dispara redeploy automático no Vercel

**Secret necessário no repositório:**
`API_FUTEBOL_KEY` → chave da [API Futebol](https://www.api-futebol.com.br/)

Para rodar manualmente: **Actions → Data Pipeline → Run workflow**

---

## Infra legada (AWS)

O código Terraform em `backend/terraform/` provisionava Lambda + S3 + CloudFront + EventBridge. Mantido como referência caso seja necessário voltar para esse setup.
