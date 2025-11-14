# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repo is a very small full-stack demo for username/password authentication:

- **Backend**: Node.js + Express server in `backend/server.js`, exposing JSON endpoints for registration, login, and a health check.
- **Frontend**: A single-page Vue 3 app in `frontend/index.html` + `frontend/app.js` that calls the backend over HTTP and manages basic auth state in the browser.
- **Package management**: The root `package.json` declares runtime dependencies (`express`, `cors`) shared by the backend, with minimal npm scripting.

There are no tests, linters, or framework-specific configs defined yet.

## Commands

### Install dependencies

Install dependencies separately for backend and frontend.

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Run the backend server

The backend is a simple Express server defined in `backend/server.js`.

```bash
# From backend/
npm start

# Or from the repo root
npm run backend:start
```

- Binds to `PORT` from the environment or defaults to `3000`.
- Exposes the following endpoints:
  - `POST /api/register` – register a new user in an in-memory `Map`.
  - `POST /api/login` – validate username/password against the in-memory store.
  - `GET /api/health` – simple health check returning `{ status: 'ok' }`.

**Note:** The user store is in memory and intended only for demo/local use.

### Run the frontend

The frontend is a static Vue 3 app that expects the backend at `http://localhost:3000` and is served from the `frontend/` folder.

```bash
# From frontend/
npm start

# Or from the repo root
npm run frontend:start
```

This serves the frontend at `http://localhost:4173` using the local `serve` dependency.

The Vue app in `frontend/app.js` performs:

- `POST /api/register` with `registerForm` (username, password).
- `POST /api/login` with `loginForm` (username, password).
- Tracks `loggedIn`, `currentUser`, and shows error/success messages.

### Tests and linting

No test or lint commands are currently configured:

- There is no `npm test` script.
- There are no lint scripts (ESLint, Prettier, etc.) defined.

If you add test or lint tooling, update this section with the concrete commands (e.g., `npm test`, `npm run lint`, and how to run single tests).

## Architecture and code structure

### Backend (`backend/server.js`)

- **App setup**
  - Creates an Express app, enables CORS (`app.use(cors())`), and JSON body parsing (`app.use(express.json())`).
  - Listens on `PORT` (env) or `3000`.
- **State**
  - Uses an in-memory `Map` called `users` keyed by `username` with `{ password }` objects.
- **Routes**
  - `POST /api/register`
    - Validates presence of `username` and `password` in `req.body`.
    - Rejects duplicate usernames with `409`.
    - Stores new users in the `users` map and returns `201`.
  - `POST /api/login`
    - Validates presence of `username` and `password`.
    - Looks up the user in `users`, compares plain-text passwords.
    - Returns `401` for invalid credentials, simple success message otherwise.
  - `GET /api/health`
    - Returns `{ status: 'ok' }` for basic liveliness checks.

There is no persistence, no session management, and no JWT handling—future work could introduce these.

### Frontend (`frontend/index.html`, `frontend/app.js`)

- **HTML shell** (`index.html`)
  - Declares a basic Vue 3 app root (`<div id="app">`).
  - Defines register and login forms with Vue bindings (`v-model`, `@submit.prevent`).
  - Shows different sections depending on `loggedIn` and prints `error`/`message` status.
  - Loads Vue 3 from the local `frontend/node_modules/vue/dist/vue.global.js` and then `app.js`.
- **Vue 3 app** (`app.js`)
  - Uses the global Vue build: `const { createApp, ref, reactive } = Vue;`.
  - `apiBase` is hard-coded to `http://localhost:3000`.
  - Reactive state:
    - `registerForm`, `loginForm` – objects with `username`/`password`.
    - `loggedIn`, `currentUser`, `error`, `message` – managed via `ref`.
  - Methods:
    - `clearStatus()` – resets `error` and `message` before each action.
    - `register()` – `fetch` POST to `/api/register`, handles non-2xx responses via thrown errors.
    - `login()` – `fetch` POST to `/api/login`, sets `loggedIn` and `currentUser` on success.
    - `logout()` – clears auth state and login form fields.

The frontend relies entirely on the backend’s response messages and status codes; there is no client-side routing or advanced state management.

## Notes for future Warp agents

- When adding new functionality (e.g., persistence, tokens, or a richer UI), prefer to keep the backend and frontend responsibilities separated as they are now: HTTP/API concerns in `backend/`, UI behavior in `frontend/`.
- If you introduce build tooling (bundlers, Vue SFCs, TypeScript, etc.), document the new build/test/lint commands here and update the architecture section to reflect any major structural changes (e.g., moving from CDN Vue to a bundled SPA).
