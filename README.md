# AI Study Buddy (Demo)

AI-powered learning platform (demo). Generate study materials, flashcards, quizzes, and courses. Real AI (LLM/RAG) to be integrated next.

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

## Features

- Topic and language learning flows
- Flashcards and quizzes with basic spaced-review hooks
- Course generator (demo content)
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

- Real AI backend (LLM, embeddings, RAG)
- Auth + DB + server SRS logic
- i18n infrastructure
- Detailed analytics dashboards
- SSR/SSG for SEO
