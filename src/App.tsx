import './index.css'
import './i18n'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Learning from './pages/Learning'
import CoursePlayer from './pages/CoursePlayer'
import CourseComplete from './pages/CourseComplete'
import LanguageLab from './pages/LanguageLab'
import QuickStudy from './pages/QuickStudy'
import Analytics from './pages/Analytics'
import Social from './pages/Social'

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/course-player" element={<CoursePlayer />} />
          <Route path="/course-complete" element={<CourseComplete />} />
          <Route path="/language-lab" element={<LanguageLab />} />
          <Route path="/quick-study" element={<QuickStudy />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/social" element={<Social />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}
