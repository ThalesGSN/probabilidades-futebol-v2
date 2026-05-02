import { Routes, Route } from "react-router-dom"
import { ScrollToTop } from "./components/scroll-to-top"
import { HomePage } from "./pages/HomePage"
import { BrasileiraoPage } from "./pages/BrasileiraoPage"
import { ClubesPage } from "./pages/ClubesPage"
import { TeamPage } from "./pages/TeamPage"

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brasileirao" element={<BrasileiraoPage />} />
        <Route path="/clubes" element={<ClubesPage />} />
        <Route path="/times/:slug" element={<TeamPage />} />
      </Routes>
    </>
  )
}
