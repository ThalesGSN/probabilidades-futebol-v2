"""
Serializa e faz upload dos JSONs gerados para o bucket S3.
A estrutura de chaves espelha public/data/ do frontend.
"""

import json
import logging
import os
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class S3Uploader:
    def __init__(self, bucket: str | None = None):
        self.bucket = bucket or os.environ["S3_BUCKET_NAME"]
        self._client = boto3.client("s3")

    def _put(self, key: str, data: object) -> None:
        body = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
        try:
            self._client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=body.encode("utf-8"),
                ContentType="application/json",
                CacheControl="max-age=3600",
            )
            logger.info("Uploaded s3://%s/%s (%d bytes)", self.bucket, key, len(body))
        except ClientError as e:
            logger.error("Failed to upload %s: %s", key, e)
            raise

    # ── Brasileirão ──────────────────────────────────────────────────────────

    def upload_probabilities(self, division: str, rows) -> None:
        key = f"brasileirao-{division.lower()}/probabilities.json"
        self._put(key, [r.to_dict() for r in rows])

    def upload_points_distribution(self, division: str, rows) -> None:
        key = f"brasileirao-{division.lower()}/points-distribution.json"
        self._put(key, [r.to_dict() for r in rows])

    def upload_standings(self, division: str, standings: dict) -> None:
        key = f"brasileirao-{division.lower()}/standings.json"
        self._put(key, {mode: [r.to_dict() for r in rows] for mode, rows in standings.items()})

    def upload_results(self, division: str, results) -> None:
        key = f"brasileirao-{division.lower()}/results.json"
        self._put(key, [r.to_dict() for r in results])

    def upload_next_round(self, division: str, fixtures) -> None:
        key = f"brasileirao-{division.lower()}/next-round.json"
        self._put(key, [f.to_dict() for f in fixtures])

    def upload_stats(self, division: str, stats: dict) -> None:
        key = f"brasileirao-{division.lower()}/stats.json"
        self._put(key, {k: [r.to_dict() for r in rows] for k, rows in stats.items()})

    # ── Times ────────────────────────────────────────────────────────────────

    def upload_teams_index(self, teams) -> None:
        self._put("teams.json", [t.to_dict() for t in teams])

    def upload_team_page(self, slug: str, season, history, monte_carlo, fixtures) -> None:
        key = f"teams/{slug}.json"
        self._put(key, {
            "season":     [s.to_dict() for s in season],
            "history":    [h.to_dict() for h in history],
            "monteCarlo": [b.to_dict() for b in monte_carlo],
            "fixtures":   [f.to_dict() for f in fixtures],
        })
