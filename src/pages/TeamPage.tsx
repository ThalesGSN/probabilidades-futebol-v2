import { Navigate, useParams } from "react-router-dom"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TeamHero } from "@/components/team/team-hero"
import { TeamSeasonChart } from "@/components/team/team-season-chart"
import { TeamHistoryChart } from "@/components/team/team-history-chart"
import { TeamMonteCarlo } from "@/components/team/team-monte-carlo"
import { TeamFixtures } from "@/components/team/team-fixtures"
import { TeamRelated } from "@/components/team/team-related"
import {
  getAllTeams,
  getMonteCarloDistribution,
  getTeam,
  getTeamFixtures,
  getTeamHistory,
  getTeamSeason,
} from "@/lib/teams"
import { useDocumentTitle } from "@/src/hooks/use-document-title"

export function TeamPage() {
  const { slug = "" } = useParams<{ slug: string }>()
  const team = getTeam(slug)

  useDocumentTitle(
    team ? `${team.shortName} — Probabilidades no Futebol UFMG` : "Clube não encontrado",
  )

  if (!team) return <Navigate to="/clubes" replace />

  const season = getTeamSeason(team)
  const history = getTeamHistory(team)
  const distribution = getMonteCarloDistribution(team)
  const fixtures = getTeamFixtures(team)
  const others = getAllTeams()
    .filter((t) => t.slug !== team.slug && t.division === team.division)
    .slice(0, 6)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <TeamHero team={team} />
      <TeamSeasonChart team={team} data={season} />
      <TeamHistoryChart team={team} data={history} />
      <TeamMonteCarlo team={team} data={distribution} />
      <TeamFixtures team={team} data={fixtures} />
      <TeamRelated current={team} others={others} />
      <SiteFooter />
    </main>
  )
}
