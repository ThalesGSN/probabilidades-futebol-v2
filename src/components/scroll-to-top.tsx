import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Restaura scroll ao topo a cada navegação. Se houver hash, tenta rolar até a âncora.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Pequeno delay para garantir que o conteúdo foi renderizado
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
          window.scrollTo({ top: 0 })
        }
      })
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}
