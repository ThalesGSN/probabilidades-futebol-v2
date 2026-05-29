"""
Espelha computeStandingsFromResults de lib/brasileirao.ts.

Modos suportados:
  geral     → todas as rodadas
  mandante  → só partidas em casa
  visitante → só partidas fora
  turno     → rodadas 1-19
  returno   → rodadas 20-38
"""

from models.team import Team
from models.brasileirao import MatchResult, StandingRow


def _blank(team: Team) -> dict:
    return dict(team=team, played=0, wins=0, draws=0, losses=0,
                goals_for=0, goals_against=0, points=0)


def _sort(rows: list[StandingRow]) -> list[StandingRow]:
    rows.sort(key=lambda r: (-r.points, -r.goal_diff, -r.goals_for))
    for i, r in enumerate(rows):
        r.position = i + 1
    return rows


def _compute(
    results: list[MatchResult],
    teams: list[Team],
    *,
    only_home: bool = False,
    only_away: bool = False,
    round_range: tuple[int, int] | None = None,
) -> list[StandingRow]:
    team_map = {t.slug: _blank(t) for t in teams}

    for r in results:
        if round_range and not (round_range[0] <= r.round <= round_range[1]):
            continue
        home = team_map.get(r.home_slug)
        away = team_map.get(r.away_slug)
        if not home or not away:
            continue

        if not only_away:
            home["played"] += 1
            home["goals_for"] += r.home_goals
            home["goals_against"] += r.away_goals
            if r.home_goals > r.away_goals:
                home["wins"] += 1
                home["points"] += 3
            elif r.home_goals == r.away_goals:
                home["draws"] += 1
                home["points"] += 1
            else:
                home["losses"] += 1

        if not only_home:
            away["played"] += 1
            away["goals_for"] += r.away_goals
            away["goals_against"] += r.home_goals
            if r.away_goals > r.home_goals:
                away["wins"] += 1
                away["points"] += 3
            elif r.away_goals == r.home_goals:
                away["draws"] += 1
                away["points"] += 1
            else:
                away["losses"] += 1

    rows = [
        StandingRow(
            team=v["team"],
            position=0,
            played=v["played"],
            wins=v["wins"],
            draws=v["draws"],
            losses=v["losses"],
            goals_for=v["goals_for"],
            goals_against=v["goals_against"],
            goal_diff=v["goals_for"] - v["goals_against"],
            points=v["points"],
        )
        for v in team_map.values()
    ]
    return _sort(rows)


def compute_standings(
    results: list[MatchResult],
    teams: list[Team],
) -> dict[str, list[StandingRow]]:
    """Retorna um dict com as 5 classificações fixas, pronto para serialização."""
    return {
        "geral":     _compute(results, teams),
        "mandante":  _compute(results, teams, only_home=True),
        "visitante": _compute(results, teams, only_away=True),
        "turno":     _compute(results, teams, round_range=(1, 19)),
        "returno":   _compute(results, teams, round_range=(20, 38)),
    }
