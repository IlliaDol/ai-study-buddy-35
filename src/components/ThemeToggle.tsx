import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const enabled = saved ? saved === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', enabled)
    setDark(enabled)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button 
      aria-label="Toggle theme" 
      onClick={toggle}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-xl hover:bg-white hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    >
      {dark ? (
        <>
          <Sun size={16} className="text-yellow-500" />
          <span className="hidden sm:inline text-slate-700">Світла</span>
        </>
      ) : (
        <>
          <Moon size={16} className="text-slate-600" />
          <span className="hidden sm:inline text-slate-700">Темна</span>
        </>
      )}
    </button>
  )
}
