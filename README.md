# BuildTrack

Construction project operations in one place. Track projects, workers, materials, costs and schedules for multiple sites, with a dashboard that flags what needs attention.

Built as a hackathon project. Frontend-first: all data currently lives in the browser (localStorage) with realistic seed data, so it runs with zero setup.

## Features

- **Dashboard**: portfolio spent-vs-budget hero, KPIs, per-project spend chart, active project list, and a "Needs attention" feed (low stock, overdue tasks, over-budget projects)
- **Projects**: create, edit, delete; status, progress, budget, client, manager; detail page per project (`/projects/:id`)
- **Workers**: roster with role, daily wage, salary, status, assigned project, auto-generated employee IDs (`BT-W-001`)
- **Materials**: stock levels with low-stock thresholds, cost per unit, supplier
- **Costs**: expense log by category and project, totals against budget
- **Schedule**: tasks with assignee, priority, start/due dates and status
- **Light / dark theme** with persistence
- Indian number formatting (₹4,39,300) and responsive layout

## Tech stack

| Layer | Tech |
| --- | --- |
| UI | React 19, React Router 7 (data router, lazy routes) |
| Build | Vite 8 |
| Charts | Recharts |
| Icons | lucide-react |
| State | React Context + localStorage |
| Styling | Plain CSS, design tokens via CSS variables |
| Planned | Supabase (auth + Postgres), Express API in `backend/` |

## Architecture

```
┌──────────────────────────── Browser ────────────────────────────┐
│  main.jsx  ──►  tokens.css + global.css, applies saved theme     │
│     │                                                            │
│  App.jsx  ──►  AppDataProvider ──► RouterProvider                │
│                     │                    │                       │
│        (global state + modal forms)   Layout (Sidebar + Topbar)  │
│                     │                    │                       │
│                     │          lazy pages via <Outlet/>          │
│                     │   Dashboard · Projects · ProjectDetail ·   │
│                     │   Workers · Materials · Costs · Schedule   │
│                     ▼                                            │
│            localStorage  ("buildtrack-data")                     │
└──────────────────────────────────────────────────────────────────┘
```

**Data flow**

1. `context/schema.js` defines the entities (`projects`, `workers`, `materials`, `expenses`, `tasks`, `activities`), the form field definitions, and seed data.
2. `context/AppData.jsx` loads state from localStorage (falling back to seed data), exposes `data`, `openForm`, `saveForm`, `removeRecord` and a toast, and writes back on every change.
3. Pages read via `useAppData()` and derive everything (totals, alerts, chart data) from that state. A single generic modal form is driven by `fieldDefs`, so adding a field means editing one schema entry.
4. Records link to each other by **name** (e.g. an expense's `project` is the project's name), not by id.

**Theming**

All colors, spacing, radii, shadows and fonts are CSS variables in `src/styles/tokens.css`. Dark mode overrides the same variables under `[data-theme="dark"]`. Components and pages only reference tokens, so re-skinning the app means editing one file. Each page has its own CSS file for layout.

## Project structure

```
.
├── index.html
├── vite.config.js
├── vercel.json              # SPA rewrite for client-side routes
├── src/
│   ├── main.jsx             # entry, theme bootstrap
│   ├── App.jsx              # router + providers
│   ├── context/             # AppData provider, schema + seed data
│   ├── components/
│   │   ├── Layout/          # sidebar, topbar, shell
│   │   └── ui/              # Card, Badge, ProgressBar, StatCard, skeletons
│   ├── pages/               # one folder per route (JSX + CSS)
│   ├── styles/              # tokens.css, global.css
│   └── utils/               # formatINR, helpers
├── public/
└── backend/                 # Express skeleton (not wired up yet)
```

## Getting started

Requires Node 20+.

```bash
git clone https://github.com/ShreyasLoL/ConstructionManagement.git
cd ConstructionManagement
npm install
npm run dev
```

Open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

To reset the demo data, clear `buildtrack-data` from localStorage (DevTools → Application → Local Storage).

## Deploy to Vercel

The frontend deploys as a static Vite site.

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo.
3. Settings (auto-detected):
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: repo root (not `backend/`)
4. Deploy.

`vercel.json` rewrites all paths to `index.html`, so refreshing on `/projects/3` or opening a deep link doesn't 404.

Note: `backend/` is not deployed by this setup. It is only needed once the app moves off localStorage.

## Roadmap

- [ ] Replace localStorage with Supabase (auth, per-workspace data, row-level security)
- [ ] Wire `backend/` Express API or drop it in favor of Supabase directly
- [ ] Link records by id instead of name
- [ ] Role-based access (project manager vs site supervisor)
- [ ] CSV export for costs and worker rosters
- [ ] Tests for derived metrics (budget, alerts)

## Known limitations

- Data is per-browser and per-device; clearing site data wipes it.
- `@supabase/supabase-js` and `axios` are installed but not used yet.
- `backend/` contains only dependencies (Express, cors, dotenv); no routes yet.
- No authentication: the "user" and workspace in the sidebar are static.
