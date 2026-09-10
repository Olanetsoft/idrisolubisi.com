# idrisolubisi.com

Personal site of [Idris Olubisi](https://idrisolubisi.com) — Senior Developer Relations Engineer and AI engineer.

Built with Next.js (App Router), TypeScript and hand-written CSS. No UI framework, no CMS: content lives in typed data files so it can be edited in a pull request.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

Requires Node 22 (see `.nvmrc`); Node 20.9+ also works.

## Where things live

| What | Where |
| --- | --- |
| Name, links, nav, hero metrics | `src/data/site.ts` |
| Case studies (home cards + `/work/[slug]` pages) | `src/data/case-studies.ts` |
| Experience, skills, community, education | `src/data/experience.ts` |
| Talks and speaking topics | `src/data/talks.ts` |
| Articles and press | `src/data/writing.ts` |
| Open-source repos and products | `src/data/projects.ts` |
| Design tokens and all styles | `src/app/globals.css` |
| Résumé PDF (served at `/resume.pdf`) | `public/resume.pdf` |
| Photos | `public/images/` |
| Info for LLM crawlers | `public/llms.txt`, `public/llms-full.txt` |

## Contact form

Uses Netlify Forms. `public/__forms.html` is a static twin of the React form so Netlify can detect it at build time; the React component POSTs to that path. Submissions appear under **Forms** in the Netlify dashboard.

## Deploy

Netlify builds from `netlify.toml` using the Next.js runtime. Old `/blog` paths redirect to `blog.idrisolubisi.com` (see `next.config.ts`).
