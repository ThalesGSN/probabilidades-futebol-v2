import type { Metadata } from "next"
import { Inter, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
})

export const metadata: Metadata = {
  title: "Probabilidades no Futebol — UFMG",
  description:
    "Observatório estatístico do futebol brasileiro. Probabilidades de título, classificação e rebaixamento atualizadas rodada a rodada por pesquisadores da UFMG desde 2005.",
  generator: "v0.app",
  metadataBase: new URL("https://www.mat.ufmg.br/futebol"),
  openGraph: {
    title: "Probabilidades no Futebol — UFMG",
    description:
      "Onde a matemática encontra a paixão pelo futebol. Probabilidades, séries históricas e visualizações interativas.",
    type: "website",
    locale: "pt_BR",
  },
}

export const viewport = {
  themeColor: "#0F3D2E",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
