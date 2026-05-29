"""
Dataclasses espelhando lib/brasileirao.ts.
"""

from dataclasses import dataclass
from typing import Optional
from .team import Team


@dataclass
class MatchResult:
    round: int
    home_slug: str
    away_slug: str
    home_goals: int
    away_goals: int

    def to_dict(self) -> dict:
        return {
            "round": self.round,
            "homeSlug": self.home_slug,
            "awaySlug": self.away_slug,
            "homeGoals": self.home_goals,
            "awayGoals": self.away_goals,
        }


@dataclass
class StandingRow:
    team: Team
    position: int
    played: int
    wins: int
    draws: int
    losses: int
    goals_for: int
    goals_against: int
    goal_diff: int
    points: int

    def to_dict(self) -> dict:
        return {
            "team": self.team.to_dict(),
            "position": self.position,
            "played": self.played,
            "wins": self.wins,
            "draws": self.draws,
            "losses": self.losses,
            "goalsFor": self.goals_for,
            "goalsAgainst": self.goals_against,
            "goalDiff": self.goal_diff,
            "points": self.points,
        }


@dataclass
class FixtureRow:
    id: str
    home: Team
    away: Team
    date: str
    time: str
    venue: str
    home_win: float
    draw: float
    away_win: float
    expected_goals: tuple[float, float]

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "home": self.home.to_dict(),
            "away": self.away.to_dict(),
            "date": self.date,
            "time": self.time,
            "venue": self.venue,
            "homeWin": round(self.home_win, 1),
            "draw": round(self.draw, 1),
            "awayWin": round(self.away_win, 1),
            "expectedGoals": [round(self.expected_goals[0], 1), round(self.expected_goals[1], 1)],
        }


@dataclass
class StatRow:
    team: Team
    value: int | float
    detail: str

    def to_dict(self) -> dict:
        return {
            "team": self.team.to_dict(),
            "value": self.value,
            "detail": self.detail,
        }


@dataclass
class TeamProbabilityRow:
    team: Team
    champion: float
    libertadores: float
    sulamericana: float
    relegation: float

    def to_dict(self) -> dict:
        return {
            "team": self.team.to_dict(),
            "champion": round(self.champion, 1),
            "libertadores": round(self.libertadores, 1),
            "sulamericana": round(self.sulamericana, 1),
            "relegation": round(self.relegation, 1),
        }


@dataclass
class PointsBucket:
    range: str
    min: int
    max: int
    prob: float

    def to_dict(self) -> dict:
        return {
            "range": self.range,
            "min": self.min,
            "max": self.max,
            "prob": round(self.prob, 1),
        }


@dataclass
class TeamPointsDistribution:
    team: Team
    expected: float
    buckets: list[PointsBucket]

    def to_dict(self) -> dict:
        return {
            "team": self.team.to_dict(),
            "expected": round(self.expected, 1),
            "buckets": [b.to_dict() for b in self.buckets],
        }
