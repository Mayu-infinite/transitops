# TransitOps — Frontend

Web client for the TransitOps transport operations platform.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · HeroUI v3 · Tailwind CSS v4 · TypeScript.

## Getting started

```bash
npm install
cp .env.example .env.local   # adjust NEXT_PUBLIC_API_URL if needed
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). The frontend runs on **:3001**
because the NestJS backend uses **:3000**.

## Environment

| Variable              | Default                 | Description                     |
| --------------------- | ----------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | Base URL of the NestJS backend. |

## Authentication

Auth is client-side against the backend's JWT endpoints. On login/register the
access token is stored in `localStorage` (for the API client) and in a cookie
(so `proxy.ts` can guard routes before render). The backend remains the
authority on every request.

### Expected backend contract

```
POST /auth/register  { name, email, password, role }  -> { accessToken, user }
POST /auth/login      { email, password }              -> { accessToken, user }
GET  /auth/me         (Authorization: Bearer <token>)  -> user
```

`user` shape: `{ id, name, email, role }`. `role` is one of
`FLEET_MANAGER | DRIVER | SAFETY_OFFICER | FINANCIAL_ANALYST`.

> The backend must enable CORS for `http://localhost:3001`.

## Project structure

```
app/
  layout.tsx            Root layout: fonts, providers, pre-paint theme script
  providers.tsx         Theme + Auth context providers (client)
  page.tsx              Redirects to /dashboard
  (auth)/               Public auth pages (login, register)
  (app)/                Protected app shell + dashboard
components/             Logo, theme toggle, form fields, sidebar, user menu
lib/
  types.ts              Domain types, Role enum + labels
  rbac.ts               Role-based navigation map + helpers
  api.ts                Fetch client for the backend
  session.ts            Token/cookie/localStorage persistence
  auth-context.tsx      useAuth() — session state, login/register/logout
  theme-context.tsx     useTheme() — light/dark toggle
proxy.ts                Optimistic route guard (Next 16 replaces middleware)
```

## Notes on Next.js 16

This project uses Next.js 16, which differs from earlier versions: `middleware`
is replaced by `proxy.ts` (Node runtime), request APIs (`params`, `searchParams`,
`cookies`, `headers`) are async, Turbopack is the default bundler, and Tailwind
CSS v4 uses `@import` instead of the old `@tailwind` directives.
