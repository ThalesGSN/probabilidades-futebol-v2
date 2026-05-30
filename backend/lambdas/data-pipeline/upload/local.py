"""
Serializa e salva os JSONs gerados no sistema de arquivos local.
A estrutura de diretórios espelha public/data/ do frontend.

OUTPUT_DIR: caminho para o diretório de saída (default: public/data/ na raiz do repo).
"""

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

_DEFAULT_OUTPUT = Path(__file__).resolve().parents[4] / "public" / "data"


class LocalUploader:
    def __init__(self, output_dir: str | None = None):
        self.root = Path(output_dir or os.environ.get("OUTPUT_DIR", _DEFAULT_OUTPUT))
        self.root.mkdir(parents=True, exist_ok=True)

    def _write(self, key: str, data: object) -> None:
        path = self.root / key
        path.parent.mkdir(parents=True, exist_ok=True)
        body = json.dumps(data, ensure_ascii=False, indent=2)
        path.write_text(body, encoding="utf-8")
        logger.info("Saved %s (%d bytes)", path, len(body))

    # ── Brasileirão ──────────────────────────────────────────────────────────

    def upload_probabilities(self, division: str, rows) -> None:
        self._write(f"brasileirao-{division.lower()}/probabilities.json", [r.to_dict() for r in rows])

    def upload_points_distribution(self, division: str, rows) -> None:
        self._write(f"brasileirao-{division.lower()}/points-distribution.json", [r.to_dict() for r in rows])

    def upload_standings(self, division: str, standings: dict) -> None:
        self._write(
            f"brasileirao-{division.lower()}/standings.json",
            {mode: [r.to_dict() for r in rows] for mode, rows in standings.items()},
        )

    def upload_results(self, division: str, results) -> None:
        self._write(f"brasileirao-{division.lower()}/results.json", [r.to_dict() for r in results])

    def upload_next_round(self, division: str, fixtures) -> None:
        self._write(f"brasileirao-{division.lower()}/next-round.json", [f.to_dict() for f in fixtures])

    def upload_stats(self, division: str, stats: dict) -> None:
        self._write(
            f"brasileirao-{division.lower()}/stats.json",
            {k: [r.to_dict() for r in rows] for k, rows in stats.items()},
        )

    def upload_metadata(self, division: str) -> None:
        self._write(
            f"brasileirao-{division.lower()}/metadata.json",
            {"generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")},
        )

    # ── Times ────────────────────────────────────────────────────────────────

    def upload_teams_index(self, teams) -> None:
        self._write("teams.json", [t.to_dict() for t in teams])

    def upload_team_page(self, slug: str, season, history, monte_carlo, fixtures) -> None:
        self._write(
            f"teams/{slug}.json",
            {
                "season":     [s.to_dict() for s in season],
                "history":    [h.to_dict() for h in history],
                "monteCarlo": [b.to_dict() for b in monte_carlo],
                "fixtures":   [f.to_dict() for f in fixtures],
            },
        )
