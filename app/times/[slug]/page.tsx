import { notFound } from "next/navigation"
import type { Metadata } from "next"
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

export async function generateStaticParams() {
  return getAllTeams().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const team = getTeam(slug)
  if (!team) return { title: "Clube não encontrado" }
  return {
    title: `${team.shortName} — Probabilidades no Futebol UFMG`,
    description: `Probabilidades, histórico e simulações de Monte Carlo para o ${team.shortName} no Brasileirão.`,
  }
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const team = getTeam(slug)
  if (!team) notFound()

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
