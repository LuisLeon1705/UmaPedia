# Uma Musume Auth Demo

This project is a small full-stack demo for username/password authentication.

- **Backend**: Node.js + Express server in `backend/server.js`.
- **Frontend**: Vue 3 single-page app in `frontend/`.

## Installation

Install dependencies separately for each project.

### Backend

From the repo root:

```bash
cd backend
npm install
```

### Frontend

From the repo root:

```bash
cd frontend
npm install
```

This will install Vue locally (no CDN) along with a simple static file server.

## Running the app

### Start the backend + database together (Docker Compose)

The simplest way to run the backend and database together is via Docker Compose.

From the repo root:

```bash
cd backend
docker compose up --build
```

This will:

- Build and start the PostgreSQL database using `Dockerfile.db` and `schema.sql`.
- Build and start the backend Node/Express app using `Dockerfile`.
- Expose:
  - Postgres on `localhost:5432`.
  - Backend API on `http://localhost:3000`.

The backend reads its DB connection settings from `backend/.env`; when running under Compose, `DB_HOST` is automatically overridden to `db` so the backend connects to the `db` service.

### Start the backend (locally)

From the repo root or `backend`:

```bash
# Option 1: from backend/
cd backend
npm start

# Option 2: from repo root
npm run backend:start
```

The backend will listen on `http://localhost:3000` and exposes:

- `POST /api/register`
- `POST /api/login`
- `GET /api/health`

### Start the backend (Docker, using `.env`)

If you prefer to run only the backend in Docker (for example, with the database already running elsewhere), you can still use the backend Dockerfile directly.

1. Ensure `backend/.env` contains the correct DB connection settings for your environment.
2. Build the backend image:

   ```bash
   cd backend
   docker build -t uma_musume_backend .
   ```

3. Run the backend container, loading environment variables from `.env`:

   ```bash
   cd backend
   docker run --name uma_musume_backend --env-file .env -p 3000:3000 uma_musume_backend
   ```

The backend inside Docker will then use the values from `backend/.env` to connect to the configured database and listen on port 3000.

### Start the frontend

From the repo root or `frontend/`:

```bash
# Option 1: from frontend/
cd frontend
npm start

# Option 2: from repo root
npm run frontend:start
```

This serves `frontend/` at `http://localhost:4173` using the local `serve` dependency.

The frontend Vue app expects the backend at `http://localhost:3000` (configured in `frontend/app.js`), so make sure the backend is running first.

## Project structure

- `backend/server.js` – Express app with in-memory user store and auth endpoints.
- `backend/package.json` – Backend-specific dependencies and `npm start` script.
- `frontend/index.html` – HTML shell for the Vue app, loading Vue from `./node_modules/vue/dist/vue.global.js`.
- `frontend/app.js` – Vue 3 app logic (register, login, logout, UI state).
- `frontend/package.json` – Frontend-specific dependencies (Vue, static server) and `npm start` script.
- `package.json` – Root helper scripts to run backend and frontend.
