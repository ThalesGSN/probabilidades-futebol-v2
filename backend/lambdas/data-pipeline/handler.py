"""
Data-pipeline do Brasileirão.

Roda diariamente (GitHub Actions cron), busca resultados na API Futebol,
executa simulação Monte Carlo e salva os JSONs em public/data/.

Variáveis de ambiente:
  API_FUTEBOL_KEY    Chave da api-futebol.com.br
  OUTPUT_DIR         Diretório de saída dos JSONs (default: public/data/ na raiz do repo)
  SERIE_A_ID         ID do campeonato Série A na API (default: 10)
  SERIE_B_ID         ID do campeonato Série B na API (default: 11)
  MONTE_CARLO_N      Número de simulações (default: 10000)
  TOTAL_ROUNDS       Total de rodadas na temporada (default: 38)
"""

import logging
import os

from sources import ApiFutebolClient
from compute import (
    compute_standings,
    MonteCarlo,
    compute_stats,
    build_probability_rows,
    build_points_distributions,
    build_next_round,
)
from upload import LocalUploader

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)

_SERIE_A_ID_ENV = os.environ.get("SERIE_A_ID")
_SERIE_B_ID_ENV = os.environ.get("SERIE_B_ID")
MC_N            = int(os.environ.get("MONTE_CARLO_N", "10000"))
ROUNDS          = int(os.environ.get("TOTAL_ROUNDS", "38"))


def _process_division(
    client: ApiFutebolClient,
    uploader: LocalUploader,
    campeonato_id: int,
    division: str,
) -> list:
    logger.info("=== Série %s (campeonato_id=%d) ===", division, campeonato_id)

    # 1. Busca dados na API
    # Apenas tabela (standings agregados) — evita 38 chamadas por divisão.
    # O Monte Carlo usa goals_for/goals_against/played do TeamCurrent como parâmetros.
    teams   = client.fetch_teams(campeonato_id, division)
    results = []
    logger.info("%d times carregados da tabela (Série %s)", len(teams), division)

    # 2. Monte Carlo
    mc  = MonteCarlo(results, teams, division, n=MC_N, total_rounds=ROUNDS)
    sim = mc.run()
    mc.update_teams(sim)   # preenche title_prob, g4_prob, etc. em cada Team

    # 3. Classificações
    standings = compute_standings(results, teams)

    # 4. Estatísticas
    stats = compute_stats(results, teams)

    # 5. Probabilidades agregadas
    prob_rows    = build_probability_rows(teams)
    points_dist  = build_points_distributions(teams, sim)

    # 6. Próxima rodada
    raw_next     = client.fetch_next_round_fixtures(campeonato_id)
    next_round   = build_next_round(raw_next, teams, mc)

    # 7. Upload
    uploader.upload_probabilities(division, prob_rows)
    uploader.upload_points_distribution(division, points_dist)
    uploader.upload_standings(division, standings)
    uploader.upload_results(division, results)
    uploader.upload_next_round(division, next_round)
    uploader.upload_stats(division, stats)

    # 8. Páginas por time
    for team in teams:
        trajectory  = mc.season_trajectory(team.slug)
        mc_dist     = mc.monte_carlo_distribution(team.slug, sim)
        # history: usa dados já armazenados ou vazio (pipeline separado de histórico)
        uploader.upload_team_page(
            slug=team.slug,
            season=trajectory,
            history=[],          # atualizado por pipeline separado de dados históricos
            monte_carlo=mc_dist,
            fixtures=[],         # TODO: integrar fixtures individuais por time
        )

    logger.info("Série %s concluída.", division)
    return teams


def handler(event, context):
    logger.info("Pipeline iniciado. event=%s", event)

    client   = ApiFutebolClient()
    uploader = LocalUploader()

    if _SERIE_A_ID_ENV and _SERIE_B_ID_ENV:
        serie_a_id = int(_SERIE_A_ID_ENV)
        serie_b_id = int(_SERIE_B_ID_ENV)
    else:
        logger.info("SERIE_A_ID/SERIE_B_ID não definidos — descobrindo via API...")
        ids = client.discover_campeonato_ids()
        serie_a_id = ids["A"]
        serie_b_id = ids["B"]

    all_teams = []
    for campeonato_id, division in [(serie_a_id, "A"), (serie_b_id, "B")]:
        teams = _process_division(client, uploader, campeonato_id, division)
        all_teams.extend(teams)

    uploader.upload_teams_index(all_teams)
    logger.info("Pipeline finalizado. %d times publicados.", len(all_teams))

    return {"statusCode": 200, "teams": len(all_teams)}


# Execução local para teste
if __name__ == "__main__":
    handler({}, None)
