"""
Agrega os resultados da simulação Monte Carlo em TeamProbabilityRow[]
e TeamPointsDistribution[].
"""

import math
from models.team import Team
from models.brasileirao import TeamProbabilityRow, TeamPointsDistribution, PointsBucket
from .monte_carlo import MonteCarlo, SimResult


def build_probability_rows(
    teams: list[Team],
) -> list[TeamProbabilityRow]:
    """Lê title_prob/g4_prob/relegation_prob já preenchidos pelo MonteCarlo.update_teams()."""
    rows = []
    for team in teams:
        c = team.current
        # sulamericana: área entre g4 e rebaixamento
        sula = max(0.0, min(99.9, 100 - c.g4_prob - c.relegation_prob * 0.3))
        rows.append(TeamProbabilityRow(
            team=team,
            champion=c.title_prob,
            libertadores=c.g4_prob,
            sulamericana=round(sula * 0.6 + 20, 1),
            relegation=c.relegation_prob,
        ))
    rows.sort(key=lambda r: -r.champion)
    return rows


def build_points_distributions(
    teams: list[Team],
    sim: dict[str, SimResult],
) -> list[TeamPointsDistribution]:
    """Gera distribuição de pontos por faixa de 5 pontos (25-89)."""
    ranges = [(p, p + 4) for p in range(25, 90, 5)]
    out = []

    for team in teams:
        sr = sim.get(team.slug)
        if not sr or not sr.point_totals:
            continue

        buckets: list[PointsBucket] = []
        total = len(sr.point_totals)
        for lo, hi in ranges:
            count = sum(1 for p in sr.point_totals if lo <= p <= hi)
            prob = round(count / total * 100, 1)
            buckets.append(PointsBucket(range=f"{lo}-{hi}", min=lo, max=hi, prob=prob))

        out.append(TeamPointsDistribution(
            team=team,
            expected=team.current.expected_points,
            buckets=buckets,
        ))

    out.sort(key=lambda r: -r.expected)
    return out
