import { BrasileiraoPanel } from "@/components/brasileirao/brasileirao-panel"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useDocumentTitle } from "@/src/hooks/use-document-title"

export function BrasileiraoPage() {
  useDocumentTitle("Brasileirão · Probabilidades no Futebol UFMG")

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
