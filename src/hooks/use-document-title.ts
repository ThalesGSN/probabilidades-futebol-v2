import { useEffect } from "react"

/**
 * Substitui o `metadata` do Next.js: define `document.title` por página.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
