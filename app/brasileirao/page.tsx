import type { Metadata } from "next"
import { BrasileiraoPanel } from "@/components/brasileirao/brasileirao-panel"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Brasileirão · Probabilidades no Futebol UFMG",
  description:
    "Painel completo do Campeonato Brasileiro Série A e Série B: probabilidades de título, Libertadores, rebaixamento, classificação, próxima rodada e estatísticas.",
}

export default function BrasileiraoPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <BrasileiraoPanel />
      </main>
      <SiteFooter />
    </div>
  )
}
