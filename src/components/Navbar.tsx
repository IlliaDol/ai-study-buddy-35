import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const languages = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'uk', name: 'UK', flag: '🇺🇦' },
    { code: 'de', name: 'DE', flag: '🇩🇪' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}>
              Study Buddy
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className={`font-medium transition-colors duration-300 hover:text-cyan-500 ${
                isScrolled ? 'text-slate-700' : 'text-white/90'
              }`}
            >
              Можливості
            </a>
            <a 
              href="#how" 
              className={`font-medium transition-colors duration-300 hover:text-cyan-500 ${
                isScrolled ? 'text-slate-700' : 'text-white/90'
              }`}
            >
              Як це працює
            </a>
            <a 
              href="#pricing" 
              className={`font-medium transition-colors duration-300 hover:text-cyan-500 ${
                isScrolled ? 'text-slate-700' : 'text-white/90'
              }`}
            >
              Ціни
            </a>
            <a 
              href="#contact" 
              className={`font-medium transition-colors duration-300 hover:text-cyan-500 ${
                isScrolled ? 'text-slate-700' : 'text-white/90'
              }`}
            >
              Контакти
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative group">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                isScrolled 
                  ? 'border-slate-200 text-slate-700 hover:border-slate-300' 
                  : 'border-white/20 text-white/90 hover:border-white/40'
              }`}>
                <span className="text-lg">{currentLanguage?.flag}</span>
                <span className="font-medium">{currentLanguage?.name}</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Language Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-200 ${
                      i18n.language === lang.code ? 'text-cyan-600 bg-cyan-50' : 'text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => navigate('/learning')}
              className={`hidden md:block px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30'
              }`}>
              Почати навчання
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 space-y-4 border-t border-white/10">
            <a 
              href="#features" 
              className={`block py-3 px-4 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white/90 hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Можливості
            </a>
            <a 
              href="#how" 
              className={`block py-3 px-4 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white/90 hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Як це працює
            </a>
            <a 
              href="#pricing" 
              className={`block py-3 px-4 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white/90 hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ціни
            </a>
            <a 
              href="#contact" 
              className={`block py-3 px-4 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white/90 hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Контакти
            </a>
            
            {/* Mobile CTA */}
            <button 
              onClick={() => {
                navigate('/learning')
                setIsMobileMenuOpen(false)
              }}
              className={`w-full mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-white/20 backdrop-blur-xl border border-white/30 text-white'
              }`}>
              Почати навчання
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
