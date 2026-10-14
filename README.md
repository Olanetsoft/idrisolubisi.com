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

One page, in this order: the hero (intro, status line and four "What I do" cards), Projects, Talks and workshops, Experience (with Community and Education), Writing, Recognition and Contact. The header links every section after the hero, plus the blog; an underline glides to the section being read.

## Where things live

| What                                                                          | Where                                                                                                                      |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Name, intro, availability, links, hand-kept follower counts, the long summary | `src/data/site.ts`                                                                                                         |
| Hero headline and the four "What I do" cards                                  | `src/data/hero.ts`                                                                                                         |
| Projects: the agent harness and More builds                                   | `src/data/projects.ts`                                                                                                     |
| Talks, the Latest and Keynote cards, speaking topics                          | `src/data/talks.ts`                                                                                                        |
| Videos under Talks and workshops                                              | `src/data/videos.ts`                                                                                                       |
| Experience, community, education and skills                                   | `src/data/experience.ts`                                                                                                   |
| Curated articles, "Published on" platforms, writing stats                     | `src/data/writing.ts`                                                                                                      |
| Press, awards and interviews                                                  | `src/data/recognition.ts`                                                                                                  |
| Build-time data (written by `npm run data`, do not edit by hand)              | `src/data/generated/github.json`, `src/data/generated/blog.json`, typed in `src/lib/generated.ts`                          |
| Logos and icons                                                               | `src/components/icon-data.json`, built into `public/icons.svg` by `npm run icons`; used through `src/components/icons.tsx` |
| Styles and design tokens                                                      | `src/app/globals.css`                                                                                                      |
| Browser-bar colours (keep in step with `--bg` in `globals.css`)               | `src/lib/theme.ts`                                                                                                         |
| Metadata and structured data (JSON-LD)                                        | `src/app/layout.tsx`                                                                                                       |
| Social preview image                                                          | `src/app/opengraph-image.tsx`                                                                                              |
| Favicon and home-screen icons                                                 | `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `manifest.ts`; `public/icon-192.png`, `public/icon-512.png`           |
| Sitemap and robots                                                            | `src/app/sitemap.ts`, `src/app/robots.ts`                                                                                  |
| `/llms.txt` and `/llms-full.txt`                                              | `src/lib/llms.ts`, `src/lib/llms-full.ts`                                                                                  |
| CV PDF (refresh with `npm run cv`)                                            | `public/Idris-Olubisi-CV.pdf`                                                                                              |
| Portrait                                                                      | `public/images/idris-portrait.jpg`                                                                                         |
| humans.txt                                                                    | `public/humans.txt`                                                                                                        |
| Archived 2020 post, served at `/how-to-create-react-app`                      | `src/content/how-to-create-react-app.ts`, images in `public/archive/`                                                      |

## Build-time data

`scripts/fetch-data.mjs` runs before every build and writes two committed files:

- `src/data/generated/github.json`: stars and visibility for each repo in its `REPOS` list, plus the GitHub follower count. A project card shows its stars only from 100 up, and a link to a private repo is left out until the repo is public.
- `src/data/generated/blog.json`: posts from the blog's RSS feed (`https://blog.idrisolubisi.com/rss.xml`). Any post newer than the newest article in `src/data/writing.ts` appears at the top of Writing.

The script never fails a build. On a network or parse error it keeps the last good file. Set `GITHUB_TOKEN` (a token with no scopes is enough) locally or in Netlify's environment variables to avoid GitHub's unauthenticated rate limit. A local build rewrites both files, so commit or discard them.

When you add a project with a `githubRepo`, add the same `owner/repo` to `REPOS` in `scripts/fetch-data.mjs`. Without it the card gets no star count, and a private repo's link is not hidden.

Updated by hand, not by the build: the X, LinkedIn and Hashnode follower counts, the public repo count and the GitHub achievements in `src/data/site.ts`.

## For AI agents and crawlers

- `/llms.txt` and `/llms-full.txt` are route handlers that compose the text from the same data files as the page, so they always match it. A few fields, marked in their comments, are not shown on the page and feed only these files.
- `src/app/robots.ts` allows search engines and named AI crawlers.
- `src/app/layout.tsx` publishes ProfilePage, Person and WebSite structured data.

## Design

IBM Plex Sans for content and IBM Plex Mono for labels and metadata. Dark by default, in pure black with warm ink; visitors can switch to a light "paper" theme, and the choice is remembered. Content sits on raised cards with a hairline border, over faint film grain and a few soft colour glows, and the header frosts once the page scrolls. On a desktop with a mouse, cards catch a soft light under the pointer and lean slightly toward it, lists light up row by row, and pointing at a stack chip lights every project that uses it. Talk videos play in a dialog on the page and load YouTube only on click. The theme switch spreads out in a circle where view transitions are supported. Motion is off for reduced-motion users, and print has its own styles. One small flourish: a line-drawn flower in the footer (`src/components/Bloom.tsx`) opens when the footer scrolls into view.

## Deploy

Netlify builds the site with `@netlify/plugin-nextjs` (see `netlify.toml`). The build fetches fresh data first, so GitHub stars and followers, new blog posts and the footer's "Last updated" month change on each deploy, and only then.

- **Redirects:** old Gatsby-era paths that are still in search indexes redirect in `next.config.ts`. `/blog` goes to blog.idrisolubisi.com, old posts go to their Hashnode or dev.to copies, and the old sitemap URLs go to `/sitemap.xml`.
- **Kept on purpose:** `public/dp.png` is the old site's avatar, kept because other sites link to it.
- **Press photos:** headshots and event photos live in a public Google Drive folder, linked from Contact (`site.links.photos`).
- After a deploy that changes URLs, resubmit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Credits

Brand logos from [Simple Icons](https://simpleicons.org) (CC0). Two-tone icons from [Phosphor](https://phosphoricons.com) (MIT).

## License

MIT. See `LICENSE`.
