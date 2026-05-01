import { ChampionshipsGrid } from "@/components/championships-grid"
import { EditorialSection } from "@/components/editorial-section"
import { HeroSection } from "@/components/hero-section"
import { HistoricalHeatmap } from "@/components/historical-heatmap"
import { MethodologyTeaser } from "@/components/methodology-teaser"
import { NewsletterSection } from "@/components/newsletter-section"
import { ProbabilityCardiogram } from "@/components/probability-cardiogram"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ProbabilityCardiogram />
        <ChampionshipsGrid />
        <HistoricalHeatmap />
        <MethodologyTeaser />
        <EditorialSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
