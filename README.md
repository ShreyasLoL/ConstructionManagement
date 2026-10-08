# BuildTrack

Construction project operations in one place. Track projects, workers, materials, costs and schedules for multiple sites, with a dashboard that flags what needs attention.

Built as a hackathon project. BuildTrack reads and writes shared project records in Supabase Postgres. The selected color theme is kept in browser localStorage.

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
| State | React Context + Supabase Postgres |
| Styling | Plain CSS, design tokens via CSS variables |
| Auth + database | Supabase Auth + Postgres with Row Level Security |

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
│       Supabase Auth + Postgres (projects, workers, ...)           │
└──────────────────────────────────────────────────────────────────┘
```

**Data flow**

1. `context/schema.js` defines the entity form fields and empty initial state. Demo records are inserted into the database by `schema.sql`, not silently substituted by the UI.
2. `context/AppData.jsx` loads authenticated Supabase records and handles reads, writes, deletes, login, and loading/error states.
3. Pages read via `useAppData()` and derive totals, alerts, chart data, and project detail views from the loaded Supabase records.
4. Tasks, workers, materials, expenses, and activities reference project names with database foreign keys. Updating a project name cascades to its related records.

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

Requires Node 20+ and a Supabase project.

```bash
git clone https://github.com/ShreyasLoL/ConstructionManagement.git
cd ConstructionManagement
```

Copy `.env.example` to `.env.local` and fill in the Supabase Project URL and publishable key from the project’s **Connect** panel. Then run `schema.sql` in the Supabase SQL Editor and create or invite an account in **Authentication → Users**. Turn off public sign-ups and invite only trusted BuildTrack users; authenticated members share the workspace records.

```bash
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

The SQL file enables RLS and grants access only to the `authenticated` role. It contains demo rows for an initial setup. It does not drop existing tables or records. Run it again to restore missing sample rows; it will not overwrite changed rows.

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

Set the same two `VITE_SUPABASE_*` variables in Vercel before deploying. The `backend/` Express folder is not part of this architecture; the app uses Supabase’s browser client and RLS directly.

## Roadmap

- [x] Replace localStorage data with Supabase Auth, Postgres, and row-level security
- [x] Use Supabase directly; the Express skeleton is not required
- [ ] Migrate links from names to UUID foreign keys
- [ ] Role-based access (project manager vs site supervisor)
- [ ] CSV export for costs and worker rosters
- [ ] Tests for derived metrics (budget, alerts)

## Known limitations

- BuildTrack is currently one shared workspace: all authenticated accounts have full access. Keep public sign-ups disabled and invite trusted users only.
- A Supabase project must be configured and `schema.sql` applied before the app can load records.
- `backend/` contains only dependencies (Express, cors, dotenv); it is unused.
