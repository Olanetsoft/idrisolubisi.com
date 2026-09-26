# idrisolubisi.com

Personal site of [Idris Olubisi](https://idrisolubisi.com), Senior Developer Relations Engineer and AI Engineer.

Built with Next.js (App Router), TypeScript and hand-written CSS. There is no UI framework and no CMS: content lives in typed data files, so every change is a pull request. Every route is prerendered as static HTML.

## Develop

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # production build
npm run lint
npm run typecheck
npm run format
npm run cv          # refresh the CV PDF from the Google Doc
```

Requires Node 22 (see `.nvmrc`). Node 20.9 or later also works.

## Where things live

| What                                                            | Where                                                                                                            |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Name, bio, availability, "What I do", links                     | `src/data/site.ts`                                                                                               |
| Experience timeline                                             | `src/data/experience.ts`                                                                                         |
| Current tech interests                                          | `src/data/interests.ts`                                                                                          |
| Talks                                                           | `src/data/talks.ts`                                                                                              |
| Articles and writing stats                                      | `src/data/writing.ts`                                                                                            |
| Press and recognition                                           | `src/data/recognition.ts`                                                                                        |
| Open-source projects (in `/llms.txt`, not on the page)          | `src/data/projects.ts`                                                                                           |
| Styles and design tokens                                        | `src/app/globals.css`                                                                                            |
| Browser-bar colours (keep in step with `--bg` in `globals.css`) | `src/lib/theme.ts`                                                                                               |
| Metadata and structured data (JSON-LD)                          | `src/app/layout.tsx`                                                                                             |
| Social preview image                                            | `src/app/opengraph-image.tsx`                                                                                    |
| Favicon and home-screen icons                                   | `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `manifest.ts`; `public/icon-192.png`, `public/icon-512.png` |
| Sitemap and robots                                              | `src/app/sitemap.ts`, `src/app/robots.ts`                                                                        |
| CV PDF (refresh with `npm run cv`)                              | `public/Idris-Olubisi-CV.pdf`                                                                                    |
| Portrait                                                        | `public/images/idris-portrait.jpg`                                                                               |
| Archived 2020 post, served at `/how-to-create-react-app`        | `src/content/how-to-create-react-app.ts`                                                                         |

## For AI agents and crawlers

- `/llms.txt` is generated from the data files by `src/lib/llms.ts`, so it always matches the page.
- `/llms-full.txt` is written by hand in `public/llms-full.txt`. Update it when a role, project or number changes.
- `src/app/robots.ts` allows search engines and named AI crawlers.

## Design

One typeface (IBM Plex Sans) on warm paper and ink. Each section has an open heading, with its content in a thin outlined box: no shadows, gradients or fills. Dark by default, in pure black; visitors can switch to a light theme, and the choice is remembered. One small flourish: a line-drawn flower in the footer (`src/components/Bloom.tsx`) opens when the footer scrolls into view.

## Deploy

Netlify builds the site with `@netlify/plugin-nextjs` (see `netlify.toml`).

- **Redirects:** old Gatsby-era paths that are still in search indexes redirect in `next.config.ts`. `/blog` goes to blog.idrisolubisi.com, old posts go to their Hashnode or dev.to copies, and the old sitemap URLs go to `/sitemap.xml`.
- **Kept on purpose:** `public/dp.png` is the old site's avatar, kept because other sites link to it.
- After a deploy that changes URLs, resubmit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## License

MIT. See `LICENSE`.
