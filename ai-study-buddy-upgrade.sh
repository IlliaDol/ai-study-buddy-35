#!/usr/bin/env bash
set -euo pipefail

# === AI Study Buddy – Homepage & Design System Upgrade ===
# Run from project root (where package.json is).

backup_once() {
  local f="$1"
  if [[ -f "$f" && ! -f "$f.bak" ]]; then
    cp "$f" "$f.bak"
    echo "Backup: $f -> $f.bak"
  fi
}

write_heredoc() {
  local target="$1"
  local marker="$2"
  mkdir -p "$(dirname "$target")"
  if [[ -f "$target" ]]; then
    backup_once "$target"
  fi
  cat >"$target" <<"$marker"
$3
$marker
  echo "Wrote: $target"
}

pkg_manager() {
  if command -v pnpm >/dev/null 2>&1; then echo pnpm; return; fi
  if command -v yarn >/dev/null 2>&1; then echo yarn; return; fi
  echo npm
}

assert_root() {
  if [[ ! -f package.json ]]; then
    echo "ERROR: Run this script at the project root (package.json not found)." >&2
    exit 1
  fi
}

assert_root
PM=$(pkg_manager)
echo "Using package manager: $PM"

# Deps
if [[ "$PM" == "pnpm" ]]; then
  pnpm add -D tailwindcss postcss autoprefixer
  pnpm add i18next react-i18next framer-motion lucide-react zustand
elif [[ "$PM" == "yarn" ]]; then
  yarn add -D tailwindcss postcss autoprefixer
  yarn add i18next react-i18next framer-motion lucide-react zustand
else
  npm install -D tailwindcss postcss autoprefixer
  npm install i18next react-i18next framer-motion lucide-react zustand
fi

# Tailwind init if missing
if [[ ! -f tailwind.config.ts && ! -f tailwind.config.js ]]; then
  npx tailwindcss init -p >/dev/null 2>&1 || npx tailwindcss init
fi

# postcss.config.js
write_heredoc postcss.config.js EOF_POSTCSS "$(cat <<'INNER'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
INNER
)"

# tailwind config (ts preferred)
if [[ -f tailwind.config.ts ]]; then
  write_heredoc tailwind.config.ts EOF_TWTS "$(cat <<'INNER'
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        success: '#22C55E',
        warn: '#F59E0B',
        error: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'Helvetica', 'Arial'],
        serif: ['Merriweather', 'serif']
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem'
      },
      lineHeight: {
        base: '1.4',
        heading: '1.2'
      }
    }
  },
  plugins: []
} satisfies Config
INNER
)"
else
  write_heredoc tailwind.config.js EOF_TWJS "$(cat <<'INNER'
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        success: '#22C55E',
        warn: '#F59E0B',
        error: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'Helvetica', 'Arial'],
        serif: ['Merriweather', 'serif']
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem'
      },
      lineHeight: {
        base: '1.4',
        heading: '1.2'
      }
    }
  },
  plugins: []
}
INNER
)"
fi

# tokens.css
write_heredoc src/styles/tokens.css EOF_TOKENS "$(cat <<'INNER'
:root {
  --color-primary: #4F46E5;
  --color-secondary: #10B981;
  --color-success: #22C55E;
  --color-warn: #F59E0B;
  --color-error: #EF4444;

  --neutral-0: #ffffff;
  --neutral-50: #f3f4f6;
  --neutral-200: #d1d5db;
  --neutral-500: #6b7280;
  --neutral-700: #374151;
  --neutral-900: #111827;

  --radius-sm: 2px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  --motion-short: 150ms;
  --motion-medium: 300ms;
  --motion-long: 500ms;
  --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

.dark {
  --neutral-0: #000000;
  --neutral-50: #1f2937;
  --neutral-200: #374151;
  --neutral-500: #9ca3af;
  --neutral-700: #d1d5db;
  --neutral-900: #f3f4f6;
}
INNER
)"

# index.css
write_heredoc src/index.css EOF_IDXCSS "$(cat <<'INNER'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { color-scheme: light dark; }
  body {
    @apply bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
  }
  a { @apply text-primary hover:underline; }
}
@import './styles/tokens.css';
INNER
)"

# i18n core
write_heredoc src/i18n.ts EOF_I18N "$(cat <<'INNER'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import uk from './locales/uk.json'
import en from './locales/en.json'
import de from './locales/de.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { uk: { translation: uk }, en: { translation: en }, de: { translation: de } },
    lng: 'uk',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

export default i18n
INNER
)"

# locales
write_heredoc src/locales/uk.json EOF_UK "$(cat <<'INNER'
{
  "hero": {
    "title": "Навчайся з AI-помічником!",
    "subtitle": "AI Study Buddy допоможе вчитися легко: адаптивні курси, мови, тренажери та гейміфікація.",
    "cta": "Запустити Deep Research"
  },
  "nav": { "home": "Головна", "about": "Про нас", "courses": "Курси", "faq": "FAQ", "contact": "Контакти" },
  "cards": {
    "learn": { "title": "Вивчення", "desc": "Адаптивні уроки та тести з будь-якої теми", "cta": "Почати" },
    "create": { "title": "Створення", "desc": "Створи свій курс за 5 хвилин", "cta": "Створи" },
    "language": { "title": "Мовна", "desc": "Практикуй англійську, німецьку та інші", "cta": "Прокачай" }
  },
  "how": {
    "title": "Як це працює",
    "steps": ["Обери тему", "Налаштуй рівень", "Запусти дослідження", "Вчися за планом"]
  },
  "faq": { "title": "Питання та відповіді" },
  "footer": { "privacy": "Політика конфіденційності", "terms": "Умови використання" },
  "ui": { "language": "Мова", "theme": "Тема", "light": "Світла", "dark": "Темна" }
}
INNER
)"
write_heredoc src/locales/en.json EOF_EN "$(cat <<'INNER'
{
  "hero": {
    "title": "Learn with Your AI Buddy!",
    "subtitle": "Master any topic with adaptive courses, languages, and fun challenges powered by AI.",
    "cta": "Run Deep Research"
  },
  "nav": { "home": "Home", "about": "About", "courses": "Courses", "faq": "FAQ", "contact": "Contact" },
  "cards": {
    "learn": { "title": "Learn", "desc": "Adaptive lessons and quizzes on any topic", "cta": "Learn Now" },
    "create": { "title": "Create", "desc": "Build your own course in 5 minutes", "cta": "Create" },
    "language": { "title": "Language", "desc": "Practice English, German and more", "cta": "Boost" }
  },
  "how": {
    "title": "How it works",
    "steps": ["Pick a topic", "Set your level", "Run research", "Study the plan"]
  },
  "faq": { "title": "FAQ" },
  "footer": { "privacy": "Privacy Policy", "terms": "Terms of Use" },
  "ui": { "language": "Language", "theme": "Theme", "light": "Light", "dark": "Dark" }
}
INNER
)"
write_heredoc src/locales/de.json EOF_DE "$(cat <<'INNER'
{
  "hero": {
    "title": "Lerne mit deinem AI-Buddy!",
    "subtitle": "Beherrsche jedes Thema mit KI-gestützten Kursen, Sprachübungen und Spaß-Funktionen.",
    "cta": "Deep Research starten"
  },
  "nav": { "home": "Start", "about": "Über uns", "courses": "Kurse", "faq": "FAQ", "contact": "Kontakt" },
  "cards": {
    "learn": { "title": "Lernen", "desc": "Adaptive Lektionen und Quiz zu jedem Thema", "cta": "Starten" },
    "create": { "title": "Erstellen", "desc": "Erstelle deinen Kurs in 5 Minuten", "cta": "Erstellen" },
    "language": { "title": "Sprachen", "desc": "Übe Englisch, Deutsch und mehr", "cta": "Stärken" }
  },
  "how": {
    "title": "So funktioniert’s",
    "steps": ["Thema wählen", "Niveau festlegen", "Research starten", "Nach Plan lernen"]
  },
  "faq": { "title": "FAQ" },
  "footer": { "privacy": "Datenschutz", "terms": "Nutzungsbedingungen" },
  "ui": { "language": "Sprache", "theme": "Thema", "light": "Hell", "dark": "Dunkel" }
}
INNER
)"

# Components
write_heredoc src/components/ThemeToggle.tsx EOF_THEME "$(cat <<'INNER'
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
    <button aria-label="Toggle theme" onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
      {dark ? <Sun size={16}/> : <Moon size={16}/>}
      <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
INNER
)"
write_heredoc src/components/LanguageSwitcher.tsx EOF_LANG "$(cat <<'INNER'
import { useTranslation } from 'react-i18next'

const LANGS = ['uk','en','de'] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <div className="inline-flex rounded-md border overflow-hidden">
      {LANGS.map(l => (
        <button key={l}
          onClick={() => i18n.changeLanguage(l)}
          className={`px-3 py-2 text-sm ${i18n.language===l ? 'bg-primary text-white' : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
          aria-pressed={i18n.language===l}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
INNER
)"
write_heredoc src/components/ModelPicker.tsx EOF_MODEL "$(cat <<'INNER'
import { useState } from 'react'

const MODELS = ['Deep', 'Chat', 'Fast'] as const

export default function ModelPicker() {
  const [m, setM] = useState<typeof MODELS[number]>('Deep')
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-neutral-600 dark:text-neutral-300">Model</span>
      <select className="rounded-md border px-2 py-1 bg-white dark:bg-neutral-900"
        value={m} onChange={e=>setM(e.target.value as any)} aria-label="Model picker">
        {MODELS.map(x=><option key={x} value={x}>{x}</option>)}
      </select>
    </label>
  )
}
INNER
)"
write_heredoc src/components/Navbar.tsx EOF_NAV "$(cat <<'INNER'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t } = useTranslation()
  return (
    <nav aria-label="Головна навігація" className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-serif text-xl">AI Study Buddy</a>
        <div className="hidden md:flex items-center gap-4">
          <a className="hover:underline" href="#about">{t('nav.about')}</a>
          <a className="hover:underline" href="#courses">{t('nav.courses')}</a>
          <a className="hover:underline" href="#faq">{t('nav.faq')}</a>
          <a className="hover:underline" href="#contact">{t('nav.contact')}</a>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher/>
          <ThemeToggle/>
          <a href="#run" className="ml-2 rounded-md bg-primary text-white px-4 py-2 text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-warn">
            {t('hero.cta')}
          </a>
        </div>
      </div>
    </nav>
  )
}
INNER
)"
write_heredoc src/components/Hero.tsx EOF_HERO "$(cat <<'INNER'
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">{t('hero.title')}</h1>
          <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">{t('hero.subtitle')}</p>
          <div className="mt-6 flex gap-3">
            <a id="run" href="#run" className="rounded-lg bg-primary text-white px-6 py-3 text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-warn">
              {t('hero.cta')}
            </a>
            <a href="#how" className="rounded-lg border px-6 py-3 text-base hover:bg-neutral-50 dark:hover:bg-neutral-800">Як це працює</a>
          </div>
        </div>
        <div className="md:justify-self-end">
          <div className="h-64 md:h-80 w-full rounded-xl bg-white/50 dark:bg-neutral-900/50 border shadow-md flex items-center justify-center">
            <span className="text-neutral-500">Ілюстрація / прев’ю</span>
          </div>
        </div>
      </div>
    </section>
  )
}
INNER
)"
write_heredoc src/components/FeatureCard.tsx EOF_CARD "$(cat <<'INNER'
type Props = { title: string; desc: string; cta: string; href: string }
export default function FeatureCard({ title, desc, cta, href }: Props) {
  return (
    <a href={href} className="block rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-neutral-900">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
      <span className="mt-4 inline-block text-primary">{cta} →</span>
    </a>
  )
}
INNER
)"
write_heredoc src/components/Features.tsx EOF_FEATURES "$(cat <<'INNER'
import { useTranslation } from 'react-i18next'
import FeatureCard from './FeatureCard'

export default function Features() {
  const { t } = useTranslation()
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid md:grid-cols-3 gap-4">
        <FeatureCard title={t('cards.learn.title')} desc={t('cards.learn.desc')} cta={t('cards.learn.cta')} href="#learn"/>
        <FeatureCard title={t('cards.create.title')} desc={t('cards.create.desc')} cta={t('cards.create.cta')} href="#create"/>
        <FeatureCard title={t('cards.language.title')} desc={t('cards.language.desc')} cta={t('cards.language.cta')} href="#language"/>
      </div>
    </section>
  )
}
INNER
)"
write_heredoc src/components/HowItWorks.tsx EOF_HOW "$(cat <<'INNER'
import { useTranslation } from 'react-i18next'

export default function HowItWorks() {
  const { t } = useTranslation()
  const steps: string[] = t('how.steps', { returnObjects: true })
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-3xl font-bold mb-6">{t('how.title')}</h2>
      <ol className="grid md:grid-cols-4 gap-4 list-decimal list-inside">
        {steps.map((s, i) => (
          <li key={i} className="rounded-lg border p-4 bg-white dark:bg-neutral-900">{s}</li>
        ))}
      </ol>
    </section>
  )
}
INNER
)"
write_heredoc src/components/FAQ.tsx EOF_FAQ "$(cat <<'INNER'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const QA = [
  { q: 'Що таке AI Study Buddy?', a: 'Це інструмент для швидкого навчання з допомогою ШІ.' },
  { q: 'Як запустити дослідження?', a: 'Натисніть головну кнопку та введіть тему.' },
  { q: 'Чи є безкоштовний план?', a: 'Так, доступний базовий режим безкоштовно.' }
]

export default function FAQ() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-3xl font-bold mb-6">{t('faq.title')}</h2>
      <div className="space-y-3">
        {QA.map((item, idx) => (
          <div key={idx} className="border rounded-lg">
            <button className="w-full text-left px-4 py-3 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
              aria-expanded={open===idx} onClick={()=>setOpen(open===idx ? null : idx)}>
              {item.q}
            </button>
            {open===idx && <div className="px-4 pb-4 text-neutral-600 dark:text-neutral-300">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
INNER
)"
write_heredoc src/components/Footer.tsx EOF_FOOTER "$(cat <<'INNER'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-16 border-t bg-white dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} AI Study Buddy</p>
        <nav className="flex gap-4 text-sm">
          <a href="/privacy" className="hover:underline">{t('footer.privacy')}</a>
          <a href="/terms" className="hover:underline">{t('footer.terms')}</a>
        </nav>
      </div>
    </footer>
  )
}
INNER
)"

# Home page and wiring
write_heredoc src/pages/Home.tsx EOF_HOME "$(cat <<'INNER'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <section aria-label="Social proof" className="mx-auto max-w-7xl px-4 py-8 opacity-80">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </section>
        <HowItWorks />
        <Features />
        <section className="mx-auto max-w-7xl px-4 py-12 text-center">
          <a href="#run" className="inline-block rounded-lg bg-primary text-white px-8 py-4 text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-warn">
            Запустити Deep Research
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
INNER
)"
# App.tsx
if [[ -f src/App.tsx ]]; then backup_once src/App.tsx; fi
write_heredoc src/App.tsx EOF_APP "$(cat <<'INNER'
import './index.css'
import './i18n'
import Home from './pages/Home'

export default function App() {
  return <Home />
}
INNER
)"
# main.tsx
if [[ -f src/main.tsx ]]; then backup_once src/main.tsx; fi
write_heredoc src/main.tsx EOF_MAIN "$(cat <<'INNER'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
INNER
)"

# index.html
if [[ -f index.html ]]; then backup_once index.html; fi
write_heredoc index.html EOF_HTML "$(cat <<'INNER'
<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI Study Buddy — навчання тем, курсів і мов з допомогою ШІ." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Merriweather:wght@700&display=swap" rel="stylesheet">
    <title>AI Study Buddy</title>
    <script>
      try {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const dark = saved ? saved === 'dark' : prefersDark;
        if (dark) document.documentElement.classList.add('dark');
      } catch (e) {}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
INNER
)"

# layout spec
write_heredoc src/config/layout.json EOF_LAYOUT "$(cat <<'INNER'
{
  "pageTitle": "AI Study Buddy – Головна",
  "modules": [
    {"name": "Navbar", "order": 1},
    {"name": "Hero", "order": 2},
    {"name": "SocialProof", "order": 3},
    {"name": "HowItWorks", "order": 4},
    {"name": "Features", "order": 5},
    {"name": "CTA2", "order": 6},
    {"name": "FAQ", "order": 7},
    {"name": "Footer", "order": 8}
  ]
}
INNER
)"

echo "---------------------------------------------"
echo "✅ Upgrade complete."
echo "Next steps:"
echo "  1) $PM run dev"
echo "  2) Verify: hero, CTA, language switch, theme toggle."
echo "  3) Run Lighthouse; target LCP ≤2.0s, CLS ≤0.05."
echo "---------------------------------------------"
