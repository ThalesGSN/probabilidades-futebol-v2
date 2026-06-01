import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const nav = [
  { label: "Brasileirão", href: "/brasileirao" },
  { label: "Campeonatos", href: "/#campeonatos" },
  { label: "Clubes", href: "/clubes" },
  { label: "Histórico", href: "/#historico" },
  { label: "Metodologia", href: "/#metodologia" },
  { label: "Nosso time", href: "/#nosso-time" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <span className="font-serif text-lg leading-none">π</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base font-medium text-foreground">Probabilidades no Futebol</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">UFMG · desde 2005</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Buscar">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-border lg:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
