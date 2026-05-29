"""
Gera FixtureRow[] para a próxima rodada com probabilidades do modelo Poisson.
"""

import math
from models.team import Team
from models.brasileirao import FixtureRow
from .monte_carlo import MonteCarlo, HOME_ADVANTAGE, MIN_LAMBDA


def _poisson_win_prob(lh: float, la: float, max_goals: int = 10) -> tuple[float, float, float]:
    """
    Calcula P(home win), P(draw), P(away win) via distribuição Poisson bivariada.
    """
    home_win = draw = away_win = 0.0
    for g in range(max_goals + 1):
        ph_g = math.exp(-lh) * lh**g / math.factorial(g)
        pa_g = math.exp(-la) * la**g / math.factorial(g)
        for a in range(max_goals + 1):
            pa_a = math.exp(-la) * la**a / math.factorial(a)
            ph_g2 = math.exp(-lh) * lh**g / math.factorial(g)
            p = ph_g2 * pa_a
            if g > a:
                home_win += p
            elif g == a:
                draw += p
            else:
                away_win += p
    return home_win * 100, draw * 100, away_win * 100


def build_next_round(
    raw_fixtures: list[dict],
    teams: list[Team],
    mc: MonteCarlo,
) -> list[FixtureRow]:
    """
    raw_fixtures: saída de ApiFutebolClient.fetch_next_round_fixtures()
    mc: MonteCarlo já inicializado (para usar os λ estimados)
    """
    team_map = {t.slug: t for t in teams}
    fixtures: list[FixtureRow] = []

    for f in raw_fixtures:
        home_name = f.get("time_mandante", {}).get("nome_popular", "")
        away_name = f.get("time_visitante", {}).get("nome_popular", "")

        # Importar _to_slug do sources
        from sources.api_futebol import _to_slug
        home_slug = _to_slug(home_name)
        away_slug = _to_slug(away_name)

        home = team_map.get(home_slug)
        away = team_map.get(away_slug)
        if not home or not away:
            continue

        lh, la = mc._lambda(home_slug, away_slug)
        hw, draw, aw = _poisson_win_prob(lh, la)

        # Data/hora
        date_str = f.get("data_realizacao", f.get("data", ""))[:10] if f.get("data_realizacao") else ""
        time_str = f.get("hora_realizacao", f.get("hora", ""))[:5] if f.get("hora_realizacao") else ""

        fixtures.append(FixtureRow(
            id=f"{home_slug}-{away_slug}",
            home=home,
            away=away,
            date=date_str,
            time=time_str,
            venue=(f.get("estadio") or {}).get("nome_popular") or f"{home.city}, {home.state}",
            home_win=max(5.0, round(hw, 1)),
            draw=max(5.0, round(draw, 1)),
            away_win=max(5.0, round(aw, 1)),
            expected_goals=(round(lh, 1), round(la, 1)),
        ))

    return fixtures
