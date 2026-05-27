import { Link } from "react-router-dom"
import type { Division } from "@/lib/teams"
import { useNextRound } from "@/hooks/use-static-data"

export function NextRoundTable({
  division,
  variant,
}: {
  division: Division
  variant: "fixtures" | "probabilities"
}) {
  const { data: fixtures, isLoading } = useNextRound(division)

  if (isLoading || !fixtures) {
    return <div className="h-64 animate-pulse rounded-sm bg-muted" />
  }

  return (
    <div className="space-y-3">
      {fixtures.map((f) => {
        const max = Math.max(f.homeWin, f.draw, f.awayWin)
        return (
          <div
            key={f.id}
            className="overflow-hidden rounded-sm border border-border bg-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>
                {f.date} · {f.time}
              </span>
              <span>{f.venue}</span>
            </div>

            <div className="grid items-center gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_1fr]">
              <Link
                to={`/times/${f.home.slug}`}
                className="flex items-center gap-3 sm:justify-end"
              >
                <span className="text-right">
                  <span className="block font-serif text-lg leading-tight">{f.home.shortName}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Mandante · {f.home.current.expectedPoints.toFixed(0)}p esp.
                  </span>
                </span>
                <span
                  aria-hidden
                  className="h-10 w-1 rounded-full"
                  style={{ backgroundColor: f.home.brand }}
                />
              </Link>

              <div className="flex flex-col items-center justify-center px-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Gols esperados
                </span>
                <span className="mt-0.5 font-serif text-2xl tabular-nums">
                  {f.expectedGoals[0]} <span className="text-muted-foreground">·</span>{" "}
                  {f.expectedGoals[1]}
                </span>
              </div>

              <Link
                to={`/times/${f.away.slug}`}
                className="flex items-center gap-3"
              >
                <span
                  aria-hidden
                  className="h-10 w-1 rounded-full"
                  style={{ backgroundColor: f.away.brand }}
                />
                <span>
                  <span className="block font-serif text-lg leading-tight">{f.away.shortName}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Visitante · {f.away.current.expectedPoints.toFixed(0)}p esp.
                  </span>
                </span>
              </Link>
            </div>

            {variant === "probabilities" && (
              <div className="border-t border-border/60 px-4 pb-4 pt-3">
                <div className="flex h-7 w-full overflow-hidden rounded-sm border border-border">
                  <div
                    className="flex items-center justify-center font-mono text-[10px] uppercase tracking-wider text-primary-foreground"
                    style={{
                      width: `${f.homeWin}%`,
                      backgroundColor: "var(--color-primary)",
                    }}
                    title={`Vitória ${f.home.shortName}`}
                  >
                    {f.homeWin >= 12 && `${f.homeWin.toFixed(0)}%`}
                  </div>
                  <div
                    className="flex items-center justify-center font-mono text-[10px] uppercase tracking-wider text-foreground"
                    style={{
                      width: `${f.draw}%`,
                      backgroundColor: "var(--color-muted)",
                    }}
                    title="Empate"
                  >
                    {f.draw >= 12 && `${f.draw.toFixed(0)}%`}
                  </div>
                  <div
                    className="flex items-center justify-center font-mono text-[10px] uppercase tracking-wider text-foreground"
                    style={{
                      width: `${f.awayWin}%`,
                      backgroundColor: "var(--color-accent)",
                    }}
                    title={`Vitória ${f.away.shortName}`}
                  >
                    {f.awayWin >= 12 && `${f.awayWin.toFixed(0)}%`}
                  </div>
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className={f.homeWin === max ? "text-foreground" : ""}>
                    Mandante {f.homeWin.toFixed(1)}%
                  </span>
                  <span className={f.draw === max ? "text-foreground" : ""}>
                    Empate {f.draw.toFixed(1)}%
                  </span>
                  <span className={f.awayWin === max ? "text-foreground" : ""}>
                    Visitante {f.awayWin.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
