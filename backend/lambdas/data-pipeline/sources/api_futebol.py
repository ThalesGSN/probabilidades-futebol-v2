"""
Cliente para https://api.api-futebol.com.br/v1

Documentação: https://www.api-futebol.com.br/documentacao
Auth: Authorization: Bearer <API_FUTEBOL_KEY>

IDs de campeonato são descobertos automaticamente via /campeonatos.
As variáveis SERIE_A_ID / SERIE_B_ID sobrescrevem a descoberta automática.
"""

import os
import logging
from typing import Any
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from models.team import Team, TeamCurrent
from models.brasileirao import MatchResult, FixtureRow

logger = logging.getLogger(__name__)

BASE_URL = "https://api.api-futebol.com.br/v1"

# Slugs canônicos: mapeamento do nome curto da API → slug do projeto
# Atualizar conforme os nomes retornados pela API.
_SLUG_MAP: dict[str, str] = {
    "Palmeiras": "palmeiras",
    "Flamengo": "flamengo",
    "Botafogo": "botafogo",
    "Atlético-MG": "atletico-mg",
    "Atlético Mineiro": "atletico-mg",
    "Fluminense": "fluminense",
    "Internacional": "internacional",
    "São Paulo": "sao-paulo",
    "Cruzeiro": "cruzeiro",
    "Santos": "santos",
    "Coritiba": "coritiba",
    "Goiás": "goias",
    "Avaí": "avai",
    "Ponte Preta": "ponte-preta",
    "Novorizontino": "novorizontino",
    "Sport": "sport",
    "CRB": "crb",
    "Chapecoense": "chapecoense",
    "Athletic Club": "athletic-club",
    "Operário-PR": "operario-pr",
    "Operário": "operario-pr",
    "Paysandu": "paysandu",
}

# Cores primárias por slug (para preencher brand quando a API não fornece)
_BRAND_MAP: dict[str, str] = {
    "palmeiras": "#0E5C3A",
    "flamengo": "#B61E2B",
    "botafogo": "#1A1A1A",
    "atletico-mg": "#2A2A2A",
    "fluminense": "#7E1E3A",
    "internacional": "#A8232E",
    "sao-paulo": "#A8232E",
    "cruzeiro": "#1E3F8C",
    "santos": "#2A2A2A",
    "coritiba": "#1A6B3A",
    "goias": "#0F5F3F",
    "avai": "#1E5BA3",
    "ponte-preta": "#1A1A1A",
    "novorizontino": "#1E3F8C",
    "sport": "#B61E2B",
    "crb": "#B61E2B",
    "chapecoense": "#0F5F3F",
    "athletic-club": "#1A1A1A",
    "operario-pr": "#1A1A1A",
    "paysandu": "#1A6B3A",
}


def _to_slug(name: str) -> str:
    slug = _SLUG_MAP.get(name)
    if not slug:
        # Fallback: lowercase kebab
        import unicodedata, re
        normalized = unicodedata.normalize("NFD", name)
        ascii_name = normalized.encode("ascii", "ignore").decode()
        slug = re.sub(r"[^a-z0-9]+", "-", ascii_name.lower()).strip("-")
        logger.warning("Slug não mapeado para '%s' → '%s'", name, slug)
    return slug


class ApiFutebolClient:
    def __init__(self, api_key: str | None = None):
        self._key = api_key or os.environ["API_FUTEBOL_KEY"]
        self._session = self._build_session()

    def _build_session(self) -> requests.Session:
        session = requests.Session()
        session.headers.update({
            "Authorization": f"Bearer {self._key}",
            "Accept": "application/json",
        })
        retry = Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
        session.mount("https://", HTTPAdapter(max_retries=retry))
        return session

    def _get(self, path: str) -> Any:
        url = f"{BASE_URL}{path}"
        resp = self._session.get(url, timeout=15)
        resp.raise_for_status()
        return resp.json()

    # ── Descoberta de IDs ────────────────────────────────────────────────────

    def discover_campeonato_ids(self) -> dict[str, int]:
        """
        Consulta /campeonatos e retorna os IDs da Série A e B do ano corrente.
        Retorna {'A': id_a, 'B': id_b}; lança RuntimeError se não encontrar.
        """
        import datetime
        ano = datetime.date.today().year
        data = self._get("/campeonatos")
        campeonatos = data if isinstance(data, list) else data.get("campeonatos", [])

        _SKIP = {"feminino", "sub-17", "sub-20", "série c", "série d", "serie-c", "serie-d"}

        ids: dict[str, int] = {}
        for c in campeonatos:
            nome = c.get("nome", "") or ""
            slug_api = c.get("slug", "") or ""
            temporada = str(c.get("temporada", "") or c.get("ano", "") or "")
            cid = c.get("campeonato_id") or c.get("id")

            is_current = str(ano) in temporada or not temporada
            nome_lower = (nome + " " + slug_api).lower()

            if not is_current:
                continue
            if not any(k in nome_lower for k in ("brasileiro", "brasileirao")):
                continue
            if any(k in nome_lower for k in _SKIP):
                continue

            if "série b" in nome_lower or "serie-b" in nome_lower:
                ids["B"] = int(cid)
                logger.info("Série B descoberta: id=%d nome='%s'", cid, nome)
            elif "série a" in nome_lower or "serie-a" in nome_lower:
                ids["A"] = int(cid)
                logger.info("Série A descoberta: id=%d nome='%s'", cid, nome)
            elif "A" not in ids:
                # "Campeonato Brasileiro" sem sufixo de série = Série A
                ids["A"] = int(cid)
                logger.info("Série A descoberta: id=%d nome='%s'", cid, nome)

        missing = [d for d in ("A", "B") if d not in ids]
        if missing:
            nomes = [c.get("nome", "") for c in campeonatos]
            raise RuntimeError(
                f"Não foi possível descobrir IDs para Série {missing}. "
                f"Campeonatos disponíveis: {nomes}"
            )
        return ids

    # ── Times ────────────────────────────────────────────────────────────────

    def fetch_teams(self, campeonato_id: int, division: str) -> list[Team]:
        """
        Retorna todos os times de um campeonato como objetos Team.
        Usa /tabela (classificação) como fonte primária — endpoint que a API
        Futebol expõe para todos os campeonatos.
        """
        data = self._get(f"/campeonatos/{campeonato_id}/tabela")
        rows = data if isinstance(data, list) else data.get("tabela", [])
        teams = []
        for pos, t in enumerate(rows, start=1):
            # A tabela pode aninhar dados do time em "time" ou no próprio objeto
            time_obj = t.get("time", t)
            nome_popular = time_obj.get("nome_popular", time_obj.get("nome", ""))
            slug = _to_slug(nome_popular)
            current = TeamCurrent(
                position=pos,
                points=t.get("pontos", 0),
                title_prob=0.0,
                g4_prob=0.0,
                relegation_prob=0.0,
                expected_points=float(t.get("pontos", 0)),
                points_range=(0, 0),
            )
            team = Team(
                slug=slug,
                name=time_obj.get("nome", nome_popular or slug),
                short_name=nome_popular or slug,
                city=time_obj.get("cidade", ""),
                state=time_obj.get("estado", time_obj.get("uf", "")),
                founded=time_obj.get("fundacao", 0),
                nickname=time_obj.get("apelido", ""),
                division=division,
                brand=_BRAND_MAP.get(slug, "#888888"),
                bio="",
                current=current,
            )
            teams.append(team)
        return teams

    # ── Resultados ───────────────────────────────────────────────────────────

    def fetch_results(self, campeonato_id: int) -> list[MatchResult]:
        """Retorna todos os resultados de partidas disputadas."""
        data = self._get(f"/campeonatos/{campeonato_id}/rodadas")
        results: list[MatchResult] = []

        rodadas = data if isinstance(data, list) else data.get("rodadas", [])
        for rodada in rodadas:
            round_num = rodada.get("rodada", rodada.get("numero", 0))
            for jogo in rodada.get("partidas", []):
                # Só partidas já disputadas têm placar
                status = jogo.get("status", "")
                if status not in ("encerrado", "finalizado", "realizado"):
                    continue
                home_slug = _to_slug(
                    jogo.get("time_mandante", {}).get("nome_popular", "")
                )
                away_slug = _to_slug(
                    jogo.get("time_visitante", {}).get("nome_popular", "")
                )
                placar = jogo.get("placar", "")
                try:
                    home_goals, away_goals = (int(x) for x in str(placar).split("x"))
                except (ValueError, AttributeError):
                    home_goals = jogo.get("placar_mandante", 0)
                    away_goals = jogo.get("placar_visitante", 0)

                results.append(MatchResult(
                    round=round_num,
                    home_slug=home_slug,
                    away_slug=away_slug,
                    home_goals=home_goals,
                    away_goals=away_goals,
                ))
        return results

    # ── Próxima rodada ───────────────────────────────────────────────────────

    def fetch_next_round_fixtures(self, campeonato_id: int) -> list[dict]:
        """Retorna os jogos da próxima rodada ainda não disputados."""
        data = self._get(f"/campeonatos/{campeonato_id}/rodadas")
        rodadas = data if isinstance(data, list) else data.get("rodadas", [])

        for rodada in rodadas:
            partidas = rodada.get("partidas", [])
            pendentes = [
                p for p in partidas
                if p.get("status", "") not in ("encerrado", "finalizado", "realizado")
            ]
            if pendentes:
                round_num = rodada.get("rodada", rodada.get("numero", 0))
                return [{"round": round_num, **p} for p in pendentes]
        return []
