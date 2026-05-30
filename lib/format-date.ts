export function formatGeneratedAt(iso: string): string {
  const d = new Date(iso)
  const day = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" })
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })
  return `${day} às ${time}`
}
