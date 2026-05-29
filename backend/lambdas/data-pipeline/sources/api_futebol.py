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
                played=t.get("jogos", 0),
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

    # ── Helpers internos ─────────────────────────────────────────────────────

    def _list_rodadas(self, campeonato_id: int) -> list[dict]:
        """
        Retorna a lista de rodadas do campeonato, normalizando as diferentes
        estruturas que a API pode retornar (list, dict com 'rodadas',
        dict com chave de fase como 'fase-unica').
        """
        data = self._get(f"/campeonatos/{campeonato_id}/rodadas")
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            if "rodadas" in data:
                return data["rodadas"]
            # Estrutura por fase: {'fase-unica': [...], ...}
            for v in data.values():
                if isinstance(v, list) and v and isinstance(v[0], dict):
                    return v
        return []

    def _fetch_rodada_detail(self, rodada: dict, *, sleep_s: float = 0.4) -> list[dict]:
        """
        Busca as partidas de uma rodada. Se as partidas não estiverem inline
        (campo 'partidas' vazio), segue o '_link' da rodada.
        sleep_s: pausa antes da chamada HTTP para respeitar rate limits da API.
        """
        partidas = rodada.get("partidas") or []
        if partidas:
            return partidas
        link = rodada.get("_link", "")
        if link:
            import time
            time.sleep(sleep_s)
            # _link pode vir como "/v1/campeonatos/..." — remove o prefixo /v1
            # para não duplicar com o BASE_URL
            path = link.removeprefix("/v1")
            detail = self._get(path)
            return detail.get("partidas", []) if isinstance(detail, dict) else []
        return []

    @staticmethod
    def _score_from_jogo(jogo: dict) -> tuple[int, int] | None:
        """Extrai (home_goals, away_goals) de um jogo; None se sem placar."""
        placar_m = jogo.get("placar_mandante")
        placar_v = jogo.get("placar_visitante")
        if placar_m is not None and placar_v is not None:
            try:
                return int(placar_m), int(placar_v)
            except (ValueError, TypeError):
                pass
        placar = jogo.get("placar", "") or ""
        try:
            a, b = str(placar).split("x")
            return int(a), int(b)
        except (ValueError, AttributeError):
            return None

    # ── Resultados ───────────────────────────────────────────────────────────

    def fetch_results(self, campeonato_id: int) -> list[MatchResult]:
        """
        Retorna todos os resultados de partidas disputadas.
        Busca o detalhe de cada rodada encerrada via _link, pois a listagem
        de rodadas não inclui partidas inline.
        """
        rodadas = self._list_rodadas(campeonato_id)
        logger.info("%d rodadas listadas para campeonato_id=%d", len(rodadas), campeonato_id)

        results: list[MatchResult] = []
        for rodada in rodadas:
            round_num = rodada.get("rodada", rodada.get("numero", 0))
            partidas = self._fetch_rodada_detail(rodada)
            for jogo in partidas:
                score = self._score_from_jogo(jogo)
                if score is None:
                    continue
                home_goals, away_goals = score
                home_slug = _to_slug(
                    jogo.get("time_mandante", {}).get("nome_popular", "")
                )
                away_slug = _to_slug(
                    jogo.get("time_visitante", {}).get("nome_popular", "")
                )
                if not home_slug or not away_slug:
                    continue
                results.append(MatchResult(
                    round=round_num,
                    home_slug=home_slug,
                    away_slug=away_slug,
                    home_goals=home_goals,
                    away_goals=away_goals,
                ))

        logger.info("%d resultados para campeonato_id=%d", len(results), campeonato_id)
        return results

    # ── Próxima rodada ───────────────────────────────────────────────────────

    def fetch_next_round_fixtures(self, campeonato_id: int) -> list[dict]:
        """
        Retorna os jogos da próxima rodada ainda não disputados.
        Busca o detalhe da primeira rodada não encerrada via _link.
        """
        rodadas = self._list_rodadas(campeonato_id)

        # A API marca a próxima rodada com proxima_rodada=True — 1 chamada só.
        next_rodada = next(
            (r for r in rodadas if r.get("proxima_rodada") is True),
            None,
        )
        if next_rodada is None:
            # Fallback: primeira rodada sem placar em nenhum jogo
            next_rodada = next(
                (r for r in rodadas
                 if not any(self._score_from_jogo(p) for p in (r.get("partidas") or []))),
                None,
            )

        if next_rodada is None:
            return []

        round_num = next_rodada.get("rodada", next_rodada.get("numero", 0))
        partidas = self._fetch_rodada_detail(next_rodada)
        pendentes = [p for p in partidas if self._score_from_jogo(p) is None]
        logger.info("Próxima rodada: %d | %d jogos pendentes", round_num, len(pendentes))
        return [{"round": round_num, **p} for p in pendentes]
