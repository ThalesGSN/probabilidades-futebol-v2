"""
Modelo de simulação Monte Carlo para o Brasileirão.

Método:
  - Modelo de Poisson independente (Dixon-Coles simplificado sem correlação)
  - λ_home = attack_home * defense_away * home_advantage * league_avg_goals
  - λ_away = attack_away * defense_home * league_avg_goals
  - Parâmetros estimados a partir dos resultados disputados

Saída por time (N=10_000 simulações):
  - title_prob, g4_prob, relegation_prob (Série A/B)
  - expected_points, points_range (IC 95%)
  - season_trajectory: SeasonPoint por rodada já disputada + média simulada
  - monte_carlo_distribution: DistributionBucket[]
"""

import math
import random
from collections import defaultdict
from dataclasses import dataclass, field

from models.team import Team, SeasonPoint, DistributionBucket
from models.brasileirao import MatchResult


HOME_ADVANTAGE = 1.25    # fator multiplicativo sobre λ_away
MIN_LAMBDA = 0.05        # evita Poisson(0)

# Posições que definem cada zona por divisão
ZONES: dict[str, dict[str, range]] = {
    "A": {
        "title":        range(1, 2),   # 1º
        "libertadores": range(1, 7),   # top 6
        "sulamericana": range(7, 13),  # 7º-12º
        "relegation":   range(17, 21), # 17º-20º
    },
    "B": {
        "title":        range(1, 2),
        "g4":           range(1, 5),   # acesso
        "playouts":     range(5, 9),   # disputa de acesso
        "relegation":   range(17, 21),
    },
}


@dataclass
class SimResult:
    """Agregados de N simulações para um único time."""
    slug: str
    title_count: int = 0
    g4_count: int = 0
    sula_count: int = 0
    relegation_count: int = 0
    point_totals: list[int] = field(default_factory=list)


class MonteCarlo:
    def __init__(
        self,
        results: list[MatchResult],
        teams: list[Team],
        division: str,
        n: int = 10_000,
        total_rounds: int = 38,
        seed: int | None = None,
    ):
        self.results = results
        self.teams = teams
        self.division = division
        self.n = n
        self.total_rounds = total_rounds
        if seed is not None:
            random.seed(seed)

        self._slugs = [t.slug for t in teams]
        self._team_map = {t.slug: t for t in teams}

        # Rodada atual = maior rodada com pelo menos um jogo disputado
        self.current_round = max((r.round for r in results), default=0)

        # Calendário dos jogos restantes (deduzido de forma simplificada)
        self._remaining = self._build_remaining_fixtures()

        # Parâmetros do modelo Poisson
        self._attack, self._defense, self._avg = self._estimate_params()

    # ── Calendário ──────────────────────────────────────────────────────────

    def _build_remaining_fixtures(self) -> list[tuple[str, str, int]]:
        """
        Retorna [(home_slug, away_slug, round), ...] para rodadas não disputadas.

        Usa os resultados já conhecidos para deduzir quais pares já jogaram
        e recria o calendário faltante por round-robin simples.
        """
        played_pairs: set[tuple[str, str, int]] = {
            (r.home_slug, r.away_slug, r.round) for r in self.results
        }
        remaining = []
        slugs = self._slugs
        n = len(slugs)

        for rnd in range(self.current_round + 1, self.total_rounds + 1):
            for i in range(0, n, 2):
                home = slugs[i % n]
                away = slugs[(i + 1) % n]
                if home != away and (home, away, rnd) not in played_pairs:
                    remaining.append((home, away, rnd))
        return remaining

    # ── Estimativa de parâmetros ─────────────────────────────────────────────

    def _estimate_params(self) -> tuple[dict, dict, float]:
        goals_for: dict[str, int] = defaultdict(int)
        goals_against: dict[str, int] = defaultdict(int)
        played: dict[str, int] = defaultdict(int)
        total_goals = 0

        for r in self.results:
            goals_for[r.home_slug] += r.home_goals
            goals_against[r.home_slug] += r.away_goals
            goals_for[r.away_slug] += r.away_goals
            goals_against[r.away_slug] += r.home_goals
            played[r.home_slug] += 1
            played[r.away_slug] += 1
            total_goals += r.home_goals + r.away_goals

        n_matches = len(self.results) or 1
        league_avg = total_goals / (2 * n_matches)
        if league_avg < 0.5:
            league_avg = 1.2  # fallback se poucos jogos

        attack: dict[str, float] = {}
        defense: dict[str, float] = {}
        for slug in self._slugs:
            g = played[slug] or 1
            attack[slug]  = (goals_for[slug] / g) / league_avg if league_avg else 1.0
            defense[slug] = (goals_against[slug] / g) / league_avg if league_avg else 1.0
            # Suavização em direção a 1.0 (prior neutro)
            alpha = min(g / 10, 1.0)
            attack[slug]  = alpha * attack[slug]  + (1 - alpha) * 1.0
            defense[slug] = alpha * defense[slug] + (1 - alpha) * 1.0

        return attack, defense, league_avg

    # ── Simulação ────────────────────────────────────────────────────────────

    def _lambda(self, home: str, away: str) -> tuple[float, float]:
        lh = max(MIN_LAMBDA, self._attack[home] * self._defense[away] * HOME_ADVANTAGE * self._avg)
        la = max(MIN_LAMBDA, self._attack[away] * self._defense[home] * self._avg)
        return lh, la

    @staticmethod
    def _poisson_sample(lam: float) -> int:
        L = math.exp(-lam)
        k, p = 0, 1.0
        while p > L:
            k += 1
            p *= random.random()
        return k - 1

    def _simulate_once(self) -> dict[str, int]:
        """Retorna pontuação final de um cenário (pontos acumulados disputados + simulados)."""
        # Pontuação acumulada dos jogos já disputados
        points: dict[str, int] = defaultdict(int)
        for r in self.results:
            if r.home_goals > r.away_goals:
                points[r.home_slug] += 3
            elif r.home_goals == r.away_goals:
                points[r.home_slug] += 1
                points[r.away_slug] += 1
            else:
                points[r.away_slug] += 3

        # Simula rodadas restantes
        for home, away, _ in self._remaining:
            if home not in self._attack or away not in self._attack:
                continue
            lh, la = self._lambda(home, away)
            gh = self._poisson_sample(lh)
            ga = self._poisson_sample(la)
            if gh > ga:
                points[home] += 3
            elif gh == ga:
                points[home] += 1
                points[away] += 1
            else:
                points[away] += 3

        return dict(points)

    # ── Execução principal ───────────────────────────────────────────────────

    def run(self) -> dict[str, SimResult]:
        agg: dict[str, SimResult] = {s: SimResult(slug=s) for s in self._slugs}
        zones = ZONES[self.division]

        for _ in range(self.n):
            pts = self._simulate_once()
            ranking = sorted(self._slugs, key=lambda s: -pts.get(s, 0))

            for pos, slug in enumerate(ranking, start=1):
                sr = agg[slug]
                sr.point_totals.append(pts.get(slug, 0))
                if pos in zones.get("title", range(0)):
                    sr.title_count += 1
                if pos in zones.get("libertadores", zones.get("g4", range(0))):
                    sr.g4_count += 1
                if pos in zones.get("sulamericana", zones.get("playouts", range(0))):
                    sr.sula_count += 1
                if pos in zones.get("relegation", range(0)):
                    sr.relegation_count += 1

        return agg

    # ── Helpers de saída ─────────────────────────────────────────────────────

    def update_teams(self, sim: dict[str, SimResult]) -> None:
        """Atualiza os campos current do Team com os resultados da simulação."""
        for team in self.teams:
            sr = sim.get(team.slug)
            if not sr or not sr.point_totals:
                continue
            pts = sorted(sr.point_totals)
            n = len(pts)
            lo = pts[int(n * 0.025)]
            hi = pts[int(n * 0.975)]
            mean = sum(pts) / n
            team.current.title_prob      = round(sr.title_count / self.n * 100, 1)
            team.current.g4_prob         = round(sr.g4_count / self.n * 100, 1)
            team.current.relegation_prob = round(sr.relegation_count / self.n * 100, 1)
            team.current.expected_points = round(mean, 1)
            team.current.points_range    = (lo, hi)

    def season_trajectory(self, slug: str) -> list[SeasonPoint]:
        """
        Reconstrói a trajetória de probabilidade rodada-a-rodada
        a partir dos resultados reais (passado) + média das simulações (futuro).
        """
        # Filtra jogos do time em ordem
        team_results = sorted(
            [r for r in self.results if r.home_slug == slug or r.away_slug == slug],
            key=lambda r: r.round,
        )
        points = 0
        trajectory: list[SeasonPoint] = []
        for r in team_results:
            if r.home_slug == slug:
                if r.home_goals > r.away_goals: points += 3
                elif r.home_goals == r.away_goals: points += 1
            else:
                if r.away_goals > r.home_goals: points += 3
                elif r.away_goals == r.home_goals: points += 1

            # Probabilidades simplificadas: proporção dos cenários em que o time
            # ainda está em cada zona, fixando os pontos reais até essa rodada.
            # (Aqui usamos aproximação linear por simplicidade.)
            progress = r.round / self.total_rounds
            team = self._team_map[slug]
            tp  = team.current.title_prob * progress + (100 / len(self._slugs)) * (1 - progress)
            g4p = team.current.g4_prob   * progress + (100 * 4 / len(self._slugs)) * (1 - progress)
            rp  = team.current.relegation_prob * progress + (100 * 4 / len(self._slugs)) * (1 - progress)
            ci  = 12 * (1 - progress) + 4

            trajectory.append(SeasonPoint(
                rodada=r.round,
                title_prob=min(100, max(0, tp)),
                g4_prob=min(100, max(0, g4p)),
                relegation_prob=min(100, max(0, rp)),
                title_low=max(0, tp - ci / 2),
                title_high=min(100, tp + ci / 2),
                expected_points=round(points, 1),
            ))
        return trajectory

    def monte_carlo_distribution(self, slug: str, sim: dict[str, SimResult]) -> list[DistributionBucket]:
        """Histograma de pontos finais para o time."""
        sr = sim.get(slug)
        if not sr:
            return []
        counts: dict[int, int] = defaultdict(int)
        for p in sr.point_totals:
            counts[p] += 1
        total = len(sr.point_totals) or 1
        buckets = [
            DistributionBucket(points=p, count=c, density=c / total)
            for p, c in sorted(counts.items())
            if c / total > 0.001
        ]
        return buckets
