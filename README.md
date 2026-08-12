# Portfolio — Career Command Center

A static portfolio site: React 18 + Vite + Tailwind + shadcn/ui.

All content lives in JSON files under `src/content/`. There is no database, no
login, and no server — the site builds to plain HTML, CSS, and JS that can be
hosted anywhere.

**If you want to change what the site says, read [EDITING.md](EDITING.md).**
You do not need to touch any code.

## Running it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the built `dist/` folder locally |
| `npm run lint` | Run ESLint |

## Where things live

```
src/content/        Your content — profile, projects, documents, links (JSON)
src/lib/content.js  Reads those JSON files and hands them to the pages
src/pages/          Home and the project detail page
src/components/portfolio/   The site's own sections (hero, project grid, ...)
src/components/ui/  Stock shadcn/ui components — not customised
src/index.css       Design tokens (colours, fonts) and the glass utilities
public/images/      Images referenced as /images/<name>
public/documents/   CV and other downloadable files, as /documents/<name>
```

## Deploying

`npm run build` produces a static `dist/` folder. Any static host works —
Netlify, Vercel, Cloudflare Pages, GitHub Pages.

One requirement: the site uses client-side routing, so the host must serve
`index.html` for unknown paths, otherwise `/project/aurora-ledger` will 404 on
a hard refresh. See [EDITING.md](EDITING.md) for per-host instructions.
