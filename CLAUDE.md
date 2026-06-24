# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Next.js, port 3000)
npm run build    # production build
npm run lint     # ESLint
```

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **SCSS Modules** for component styles (`Component.module.scss` co-located with each component)
- **Tailwind CSS v4** via `@import "tailwindcss"` in `globals.scss` — use `@theme` for design tokens
- **GSAP 3** for animations

## Architecture

Two routes:
- `/` — landing page (`src/app/page.tsx`) renders `<Nav>` + `<Hero>`
- `/questionnaire` — scent quiz (`src/app/questionnaire/page.tsx`) renders `<Questionnaire>`

Components live in `src/components/<Name>/` with their module SCSS alongside.

`src/lib/const.ts` holds the quiz data: `QUESTIONS` (4 questions, each with 4 options and a `pourcentage` array mapping to `ESSENCES`) and `ESSENCES` (4 Cire Trudon scent profiles). The quiz result logic derives a recommended essence from accumulated percentages.

## Design tokens

Defined in `globals.scss` under `@theme`:

| Token | Value |
|---|---|
| `--color-trudon-black` | `#0e0e0b` |
| `--color-trudon-cream` | `#f2ece0` |
| `--color-trudon-gold` | `#b8975a` |
| `--color-trudon-dark` | `#1a1a14` |
| `--color-trudon-muted` | `#8a8070` |

## Fonts

- `--font-serif`: EB Garamond (self-hosted variable font in `src/font/`) + Cormorant Garamond fallback (Google Fonts via `--font-cormorant`)
- `--font-sans`: Jost (Google Fonts via `--font-sans`)

Both CSS variables are set on `<html>` in `src/app/layout.tsx`.
