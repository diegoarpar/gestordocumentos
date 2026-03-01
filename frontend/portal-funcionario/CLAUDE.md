# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack on http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run Next.js lint
```

No test runner is configured. The `src/app/src/App.test.js` file is a leftover from a previous CRA setup and is not active.

## Architecture

**Stack**: Next.js 15 (App Router), React 19, TypeScript (partial — many files are `.js`/`.jsx`), Material UI v7, Tailwind CSS v4, Formio (`@formio/react`).

### Directory layout

```
src/app/
  api/           # Service modules (HTTP calls to backend)
  config/        # url.config.js — legacy host URLs for axios services
  components/    # Shared UI primitives (Card, Header, Grid, etc.)
  feature/       # Domain-specific feature components
  pages/         # Next.js route pages — thin wrappers that render feature components
  page.tsx       # Root page — renders Login toggle
  layout.tsx     # Root layout
```

`src/app/src/` is an unused CRA remnant; do not modify it.

### Backend proxy (next.config.ts)

All API calls go through Next.js rewrites — there is no separate API layer:

| Frontend path | Backend |
|---|---|
| `/api/authentication/*` | `localhost:8080` |
| `/api/tenant/*` | `localhost:8081` |
| `/api/workflow/*` | `localhost:8082` |

### Two coexisting API patterns

**Modern (preferred)**: `fetch("/api/...")` using the rewrites above. Used in `userServices.js`, `tenantServices.js`, and new feature files like `rolePortal.tsx`.

**Legacy**: `axios` calls with hardcoded host URLs from `src/app/config/url.config.js`. Used in `processTaskServices.js`, `processServices.js`, `processInstanceServices.js`, etc. These services are not functional in the current dev setup — they bypass the Next.js proxy.

New service functions should use `fetch` with `/api/...` paths.

### Session management

`src/app/api/session.jsx` is a `"use server"` module. It manages `session` and `tenant` cookies via Next.js `cookies()`. Client components call service modules which call session helpers; they cannot import `session.jsx` directly.

### Routing / navigation

Pages live under `src/app/pages/<domain>/page.tsx` and are accessed by the sidebar in `feature/menus/menu.js` via plain `<a href="/pages/...">` links. After login, `feature/loginForm/page.tsx` redirects to `../../pages/portal`.

### Feature modules

- `feature/portal/` — Main dashboard: `portal.jsx` (app bar + drawer), `tasksInformation.jsx` (task list with assign/open actions), `processTaskForm.jsx`, `processForm.jsx`
- `feature/role/rolePortal.tsx` — Role CRUD with optimistic updates; falls back to seed data if API is unavailable
- `feature/menus/menu.js` — MUI Drawer sidebar with navigation links
- `feature/user/` — User management (manager, finder, detail dialog, change password, waiting approval)
- `feature/request/` — Request viewing and document display

### Styling conventions

- Tailwind utility classes for new/simple layout
- MUI components with `styled()` (from `@mui/material/styles`) for component-level theming — **not** `makeStyles` or `withStyles`
- `rolePortal.tsx` uses scoped `<style>` tags with `.rp-*` class names (self-contained, dark-themed)
