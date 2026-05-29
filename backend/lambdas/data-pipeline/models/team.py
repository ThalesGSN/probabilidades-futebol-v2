"""
Dataclasses espelhando lib/teams.ts.
Todos os campos numéricos de probabilidade estão em % (0-100).
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class TeamCurrent:
    position: int
    points: int
    title_prob: float        # % chance de título
    g4_prob: float           # % G4 (Libertadores na A, acesso na B)
    relegation_prob: float   # % rebaixamento
    expected_points: float
    points_range: tuple[int, int]
    played: int = 0          # jogos disputados (da tabela da API)
    goals_for: int = 0       # gols marcados (da tabela da API)
    goals_against: int = 0   # gols sofridos (da tabela da API)

    def to_dict(self) -> dict:
        return {
            "position": self.position,
            "points": self.points,
            "played": self.played,
            "titleProb": round(self.title_prob, 1),
            "g4Prob": round(self.g4_prob, 1),
            "relegationProb": round(self.relegation_prob, 1),
            "expectedPoints": round(self.expected_points, 1),
            "pointsRange": list(self.points_range),
        }


@dataclass
class Team:
    slug: str
    name: str
    short_name: str
    city: str
    state: str
    founded: int
    nickname: str
    division: str            # "A" | "B"
    brand: str               # hex color
    bio: str
    current: TeamCurrent

    def to_dict(self) -> dict:
        return {
            "slug": self.slug,
            "name": self.name,
            "shortName": self.short_name,
            "city": self.city,
            "state": self.state,
            "founded": self.founded,
            "nickname": self.nickname,
            "division": self.division,
            "brand": self.brand,
            "bio": self.bio,
            "current": self.current.to_dict(),
        }


@dataclass
class SeasonPoint:
    rodada: int
    title_prob: float
    g4_prob: float
    relegation_prob: float
    title_low: float
    title_high: float
    expected_points: float

    def to_dict(self) -> dict:
        return {
            "rodada": self.rodada,
            "titleProb": round(self.title_prob, 1),
            "g4Prob": round(self.g4_prob, 1),
            "relegationProb": round(self.relegation_prob, 1),
            "titleLow": round(self.title_low, 1),
            "titleHigh": round(self.title_high, 1),
            "expectedPoints": round(self.expected_points, 1),
        }


@dataclass
class HistoryPoint:
    year: int
    position: int
    points: int
    title_prob: float
    champion: bool

    def to_dict(self) -> dict:
        return {
            "year": self.year,
            "position": self.position,
            "points": self.points,
            "titleProb": round(self.title_prob, 1),
            "champion": self.champion,
        }


@dataclass
class DistributionBucket:
    points: int
    count: int
    density: float

    def to_dict(self) -> dict:
        return {
            "points": self.points,
            "count": self.count,
            "density": round(self.density, 4),
        }


@dataclass
class Fixture:
    rodada: int
    date: str               # YYYY-MM-DD
    opponent: str
    home: bool
    played: bool
    result: Optional[dict] = None    # {"team": int, "opponent": int}
    win_prob: Optional[float] = None
    draw_prob: Optional[float] = None
    loss_prob: Optional[float] = None

    def to_dict(self) -> dict:
        d: dict = {
            "rodada": self.rodada,
            "date": self.date,
            "opponent": self.opponent,
            "home": self.home,
            "played": self.played,
        }
        if self.played and self.result:
            d["result"] = self.result
        if not self.played:
            d["winProb"] = round(self.win_prob or 0, 1)
            d["drawProb"] = round(self.draw_prob or 0, 1)
            d["lossProb"] = round(self.loss_prob or 0, 1)
        return d
