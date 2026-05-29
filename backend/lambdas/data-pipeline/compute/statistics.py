"""
Computa rankings de estatísticas a partir dos resultados disputados.

Chaves suportadas:
  vitorias, derrotas, invencibilidade, sem-vitorias, melhor-ataque, melhor-defesa
"""

from models.team import Team
from models.brasileirao import MatchResult, StatRow


StatKey = str  # "vitorias" | "derrotas" | "invencibilidade" | "sem-vitorias" | "melhor-ataque" | "melhor-defesa"


def _team_results_ordered(slug: str, results: list[MatchResult]) -> list[tuple[int, int]]:
    """Retorna [(gols_marcados, gols_sofridos), ...] em ordem de rodada."""
    relevant = sorted(
        [r for r in results if r.home_slug == slug or r.away_slug == slug],
        key=lambda r: r.round,
    )
    out = []
    for r in relevant:
        if r.home_slug == slug:
            out.append((r.home_goals, r.away_goals))
        else:
            out.append((r.away_goals, r.home_goals))
    return out


def _max_streak(games: list[tuple[int, int]], condition) -> tuple[int, bool]:
    """
    Retorna (maior_sequência, ainda_em_curso).
    condition(gf, ga) → bool
    """
    best = 0
    cur = 0
    for gf, ga in games:
        if condition(gf, ga):
            cur += 1
            best = max(best, cur)
        else:
            cur = 0
    still_active = cur == best and best > 0
    return best, still_active


def compute_stats(
    results: list[MatchResult],
    teams: list[Team],
) -> dict[StatKey, list[StatRow]]:
    """Retorna um dict com as 6 categorias de estatísticas, cada uma com StatRow[] ordenado."""
    stat_data: dict[str, list[tuple[Team, int | float, str]]] = {k: [] for k in [
        "vitorias", "derrotas", "invencibilidade", "sem-vitorias", "melhor-ataque", "melhor-defesa"
    ]}

    for team in teams:
        games = _team_results_ordered(team.slug, results)
        n_played = len(games)

        wins,      wins_active      = _max_streak(games, lambda gf, ga: gf > ga)
        losses,    losses_active    = _max_streak(games, lambda gf, ga: gf < ga)
        unbeaten,  unbeaten_active  = _max_streak(games, lambda gf, ga: gf >= ga)
        no_win,    no_win_active    = _max_streak(games, lambda gf, ga: gf <= ga)
        goals_for     = sum(gf for gf, _ in games)
        goals_against = sum(ga for _, ga in games)

        stat_data["vitorias"].append((
            team, wins,
            f"jogos · ainda em curso" if wins_active else f"jogos · encerrada",
        ))
        stat_data["derrotas"].append((
            team, losses,
            f"jogos · ainda em curso" if losses_active else f"jogos · encerrada",
        ))
        stat_data["invencibilidade"].append((
            team, unbeaten,
            f"jogos · ainda em curso" if unbeaten_active else f"jogos · encerrada",
        ))
        stat_data["sem-vitorias"].append((
            team, no_win,
            f"jogos · ainda em curso" if no_win_active else f"jogos · encerrada",
        ))
        stat_data["melhor-ataque"].append((
            team, goals_for,
            f"gols marcados em {n_played} jogos",
        ))
        stat_data["melhor-defesa"].append((
            team, goals_against,
            f"gols sofridos em {n_played} jogos",
        ))

    ascending = {"derrotas", "sem-vitorias", "melhor-defesa"}
    out: dict[str, list[StatRow]] = {}
    for key, rows in stat_data.items():
        rows.sort(key=lambda x: x[1], reverse=(key not in ascending))
        out[key] = [StatRow(team=t, value=v, detail=d) for t, v, d in rows]
    return out
