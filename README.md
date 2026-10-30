# idrisolubisi.com

Personal site of [Idris Olubisi](https://idrisolubisi.com), Senior Developer Relations Engineer and educator who builds AI agents.

Built with Next.js 16 (App Router), React 19, TypeScript and hand-written CSS. There is no UI framework and no CMS: content lives in typed data files, so every change is a pull request. A build step adds live GitHub numbers and new blog posts. Every route is prerendered as static content.

## Develop

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # production build; runs `data` and `icons` first
npm run start       # serve the production build
npm run lint
npm run typecheck
npm run format      # prettier --write .
npm run data        # refresh GitHub stats and blog posts in src/data/generated/
npm run icons       # rebuild public/icons.svg from src/components/icon-data.json
npm run cv          # refresh the CV PDF from the Google Doc
```

Requires Node 22 (see `.nvmrc`). Node 20.9 or later also works. `npm run dev` fetches nothing; it uses the committed files in `src/data/generated/`.

## The page

One page, in this order: the hero (status line, name and role, one intro, the call and the CV), Projects, Talks and workshops, Experience (with Community and Education), Writing, Recognition and Contact. The header links every section after the hero, plus the blog; an underline glides to the section being read.

## Where things live

| What                                                                          | Where                                                                                                                      |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Name, intro, availability, links, hand-kept follower counts, the long summary | `src/data/site.ts`                                                                                                         |
| Hero headline and intro                                                       | `src/data/hero.ts`                                                                                                         |
| Projects: the agent harness and More builds                                   | `src/data/projects.ts`                                                                                                     |
| Talks, the Guest lecture and Keynote cards, speaking topics                   | `src/data/talks.ts`                                                                                                        |
| Videos under Talks and workshops                                              | `src/data/videos.ts`                                                                                                       |
| Experience, community, education and skills                                   | `src/data/experience.ts`                                                                                                   |
| Curated articles, "Published on" platforms, writing stats                     | `src/data/writing.ts`                                                                                                      |
| Press, awards and interviews                                                  | `src/data/recognition.ts`                                                                                                  |
| Build-time data (written by `npm run data`, do not edit by hand)              | `src/data/generated/github.json`, `src/data/generated/blog.json`, typed in `src/lib/generated.ts`                          |
| Brand marks                                                                   | `src/components/icon-data.json`, built into `public/icons.svg` by `npm run icons`; used through `src/components/icons.tsx` |
| Styles and design tokens                                                      | `src/app/globals.css`                                                                                                      |
| Browser-bar colours (keep in step with `--bg` in `globals.css`)               | `src/lib/theme.ts`                                                                                                         |
| Metadata and structured data (JSON-LD)                                        | `src/app/layout.tsx`                                                                                                       |
| Social preview image                                                          | `src/app/opengraph-image.tsx`                                                                                              |
| Favicon and home-screen icons                                                 | `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `manifest.ts`; `public/icon-192.png`, `public/icon-512.png`           |
| Sitemap and robots                                                            | `src/app/sitemap.ts`, `src/app/robots.ts`                                                                                  |
| `/llms.txt` and `/llms-full.txt`                                              | `src/lib/llms.ts`, `src/lib/llms-full.ts`                                                                                  |
| CV PDF (refresh with `npm run cv`)                                            | `public/Idris-Olubisi-CV.pdf`                                                                                              |
| Portrait                                                                      | `public/images/idris-portrait.jpg`                                                                                         |
| Card pictures (1280x800 JPEG; set `image` in projects.ts or experience.ts)    | `public/images/work/`, `public/images/community/`                                                                          |
| humans.txt                                                                    | `public/humans.txt`                                                                                                        |
| Archived 2020 post, served at `/how-to-create-react-app`                      | `src/content/how-to-create-react-app.ts`, images in `public/archive/`                                                      |

## Build-time data

`scripts/fetch-data.mjs` runs before every build and writes two committed files:

- `src/data/generated/github.json`: stars and visibility for each repo in its `REPOS` list, plus the GitHub follower count. Cards show no star counts; /llms-full.txt lists a repo's stars from 100 up. A link to a private repo is left out until the repo is public.
- `src/data/generated/blog.json`: posts from the blog's RSS feed (`https://blog.idrisolubisi.com/rss.xml`). Any post newer than the newest article in `src/data/writing.ts` appears at the top of Writing.

The script never fails a build. On a network or parse error it keeps the last good file. Set `GITHUB_TOKEN` (a token with no scopes is enough) locally or in Netlify's environment variables to avoid GitHub's unauthenticated rate limit. A local build rewrites both files, so commit or discard them.

When you add a project with a `githubRepo`, add the same `owner/repo` to `REPOS` in `scripts/fetch-data.mjs`. Without it /llms-full.txt gets no star count, and a private repo's link is not hidden.

Updated by hand, not by the build: the X, LinkedIn and Hashnode follower counts, the public repo count and the GitHub achievements in `src/data/site.ts`.

## For AI agents and crawlers

- `/llms.txt` and `/llms-full.txt` are route handlers that compose the text from the same data files as the page, so they always match it. A few fields, marked in their comments, are not shown on the page and feed only these files.
- `src/app/robots.ts` allows search engines and named AI crawlers.
- `src/app/layout.tsx` publishes ProfilePage, Person and WebSite structured data.

## Design

IBM Plex Sans for content and IBM Plex Mono for labels and metadata. Dark by default, in pure black with warm ink; visitors can switch to a light "paper" theme, and the choice is remembered. Content sits on raised cards with a hairline border, over faint film grain and a faint warm glow, and the header frosts once the page scrolls. Amber is the one accent colour (section numbers, the nav underline, the highlighted intro clause, the footer flower and the SwoopAgent diagram, and also the favicon and the share image); green is kept for things that are live now. On a desktop with a mouse, the project and community cards catch a soft light under the pointer and lean slightly toward it, and list rows light up as you point at them. Projects, more builds and community are picture cards: each one is a single link with a screenshot of the site, the repo page or README, his own event photo or the project's code, a name, a few words and one number. The page is one centred 960px column. Projects sit three to a row (two on phones); talk videos sit three to a row too, and become a compact list on phones. More builds shows three cards, the videos six and On stage ten events, each with a button for the rest. An event still to come carries a `date` in `src/data/talks.ts` and is marked upcoming until that day; the page and `/llms-full.txt` are rebuilt daily, so the mark drops on its own. Talks opens with his own stage photographs (`public/images/talks/`, listed in `src/data/talks.ts`). Talk videos play in a dialog on the page and load YouTube only on click. On load, one ring of lit grid lines goes out from the hero's live dot; on a desktop with a mouse, the pointer leaves a fading amber wake along the hero grid and bends the lines slightly around it (a small WebGL shader in `src/lib/grid-wake.ts`, loaded once the page is idle and drawing only while something moves); as the hero scrolls away, the dot docks beside the name in the header, and the header hairline becomes a run trace with one segment per section (amber while read, grey once read). All three are CSS-first and need no extra requests. The theme switch spreads out in a circle where view transitions are supported. Motion is off for reduced-motion users, and print has its own styles. One small flourish: a line-drawn flower in the footer (`src/components/Bloom.tsx`) opens when the footer scrolls into view.

## Deploy

Netlify builds the site with `@netlify/plugin-nextjs` (see `netlify.toml`). The build fetches fresh data first, so GitHub stars and followers, new blog posts and the footer's "Last updated" month change on each deploy, and only then.

- **Redirects:** old Gatsby-era paths that are still in search indexes redirect in `next.config.ts`. `/blog` goes to blog.idrisolubisi.com, old posts go to their Hashnode or dev.to copies, and the old sitemap URLs go to `/sitemap.xml`.
- **Kept on purpose:** `public/dp.png` is the old site's avatar, kept because other sites link to it.
- **Press photos:** headshots and event photos live in a public Google Drive folder, linked from Contact (`site.links.photos`).
- After a deploy that changes URLs, resubmit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Credits

Brand marks from [Simple Icons](https://simpleicons.org) (CC0), shown only on the Contact profile links and drawn in the text colour.

## License

MIT. See `LICENSE`.
