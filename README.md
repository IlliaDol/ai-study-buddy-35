# AI Study Buddy

A modern, AI-powered study application built with React, TypeScript, and Vite. Transform any topic into interactive flashcards and quizzes with AI assistance.

## 🚀 Features

- **AI-Powered Content Generation**: Create flashcards and quizzes from any topic
- **Spaced Repetition System (SRS)**: Optimize learning with scientifically-proven intervals
- **Multiple Study Modes**: Flashcards, quizzes, and structured courses
- **Language Learning**: Specialized tools for vocabulary and phrase practice
- **PWA Support**: Install as a native app with offline capabilities
- **Multi-language**: English, Ukrainian, and German support
- **Accessibility**: Full keyboard navigation and screen reader support

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui (Radix)
- React Router v6
- PWA ready (service worker, manifest)

## Getting Started

Requirements: Node 18+

```bash
npm i
npm run dev
```

Build/preview:
```bash
npm run build
npm run preview
```

## Environment (optional)

Analytics and error tracking are optional. See `docs/ENV.md`.

```env
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_SENTRY_DSN=
```

If you plan to use them:
```bash
npm i posthog-js @sentry/browser
```

## AI Provider & Keys

- Default provider: DeepSeek Reasoner (`deepseek-reasoner`).
- Configure your key via the in-app Settings modal (Main nav → AI Settings). Keys are stored locally in `localStorage` for development.
- Config utilities are in `src/config/apiConfig.ts`.

## Countdown During Generation

- When generating with an API provider, the UI shows a 20-second countdown on buttons in `src/components/CourseGenerator.tsx` and `src/components/TopicGenerator.tsx` to set expectations for response time.

## Features

- Topic and language learning flows
- Flashcards and quizzes with basic spaced-review hooks
- Course generator (DeepSeek-powered)
- Gamification (XP, streaks)
- Accessible UI improvements (semantic buttons, aria-live status)
- Basic analytics facade with safe no-ops
- Offline support: `public/sw.js`, `public/site.webmanifest`

## Accessibility

- Click handlers moved from containers to real buttons in `src/components/MainNavigation.tsx`.
- `aria-live` region in `src/components/TopicCheckButton.tsx` to announce status.
- Continued audit recommended for labels, roles, and focus styles.

## SEO & PWA

- SEO tags in `index.html` with canonical and structured data (update domain before prod)
- `public/sitemap.xml` and `public/robots.txt` (staging locked down)
- PWA manifest `public/site.webmanifest` and service worker `public/sw.js`

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run build:dev` - development-mode build
- `npm run preview` - local preview
- `npm run lint` - lint code

## Dependencies

Unused chart/toast wrappers and their packages have been removed.

## Roadmap

- Optional serverless proxy for API keys (move keys server-side)
- Embeddings and RAG for retrieval-augmented content
- Auth + DB + server SRS logic
- i18n infrastructure
- Detailed analytics dashboards
- SSR/SSG for SEO
