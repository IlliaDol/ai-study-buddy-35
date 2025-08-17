import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const currentLang = i18n.language || 'uk'
  
  return (
    <div className="relative group">
      <button 
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-xl hover:bg-white hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        aria-label="Вибір мови"
      >
        <span className="text-lg">{LANGS.find(l => l.code === currentLang)?.flag}</span>
        <span className="hidden sm:inline">{currentLang.toUpperCase()}</span>
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {LANGS.map(lang => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-150 ${
              currentLang === lang.code ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
            }`}
            aria-pressed={currentLang === lang.code}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
            {currentLang === lang.code && (
              <svg className="w-4 h-4 ml-auto text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
