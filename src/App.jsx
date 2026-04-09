import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CTViewer from './pages/CTViewer'
import OrganExplorer from './pages/OrganExplorer'
import AnimationShowcase from './pages/AnimationShowcase'
import LearnCenter from './pages/LearnCenter'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/viewer" element={<CTViewer />} />
          <Route path="/organs" element={<OrganExplorer />} />
          <Route path="/animations" element={<AnimationShowcase />} />
          <Route path="/learn" element={<LearnCenter />} />
        </Routes>
      </div>
    </Router>
  )
}
