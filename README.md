# AI Learning Assistant

A full-stack Generative AI web app that helps undergraduate students learn technical
topics. Students register, ask questions, and receive beginner-friendly explanations
(direct answer → step-by-step → example → common mistake → revision questions).
Conversations are saved per user, reopenable, and show real-time generation status.

> 📘 **New here? Read the [Complete Deployment Guide](DEPLOYMENT_GUIDE.md)** — a step-by-step,
> student-friendly walkthrough covering account creation, getting Supabase credentials and the
> Gemini API key, and deploying the backend (Render) and frontend (Vercel).

## Features

- Landing, Register, Login pages
- Supabase email/password authentication
- Protected dashboard with **real** conversation and message counts
- AI chat interface with user/assistant bubbles, loading and error states
- Gemini API integration **from the backend only** (key never reaches the browser)
- Per-user conversation history (create, reopen, delete)
- Real-time conversation status via Supabase Realtime
- Profile page (view/update name & email)
- Row Level Security so no user can read another user's data
- Input validation on the frontend **and** backend
- Responsive UI with Tailwind CSS

## Tech stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Supabase JS client
- **Backend:** Node.js, Express
- **Auth & DB:** Supabase (PostgreSQL + Auth + Realtime)
- **AI:** Google Gemini API (`@google/generative-ai`)

## Architecture

```
User Browser
  → React Frontend
    → Node.js / Express Backend
      → Supabase Auth verification (token)
      → Gemini API
      → Supabase PostgreSQL (profiles, conversations, messages)
      → Supabase Realtime (conversation status)
```

The frontend never calls Gemini directly. The Gemini key and the Supabase service
role key live only in the **backend** `.env`.

## Folder structure

```
carrerpilot_ai/
├── backend/
│   └── src/
│       ├── server.js
│       ├── lib/          # env, supabase clients
│       ├── middleware/    # auth, error handler
│       ├── routes/        # auth, profile, conversations, chat
│       ├── services/      # gemini
│       ├── validation/    # validators
│       └── utils/         # typed errors
├── frontend/
│   └── src/
│       ├── components/    # Navbar, Spinner, StatusBadge
│       ├── pages/         # Landing, Login, Register, Dashboard, Chat, History, Profile
│       ├── routes/        # ProtectedRoute
│       ├── hooks/         # useConversationStatus (Realtime)
│       ├── context/       # AuthContext
│       └── lib/           # supabase client, api wrapper
└── supabase/
    └── migrations/0001_init.sql
```

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy:
   - Project URL → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `anon` public key → `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**backend only**)
3. (Optional, for the smoothest demo) In **Authentication → Providers → Email**,
   turn **off** "Confirm email" so signup returns a session immediately.

### Database migration

Open the **SQL Editor** in Supabase and run the contents of
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
It creates the `profiles`, `conversations`, and `messages` tables, enables RLS with
per-user policies, adds an `updated_at` trigger, and registers `conversations`
with the Realtime publication.

## 2. Gemini setup

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Put it in the backend `.env` as `GEMINI_API_KEY`.

## 3. Environment variables

**backend/.env** (copy from `backend/.env.example`):

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**frontend/.env** (copy from `frontend/.env.example`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:5000
```

## 4. Run locally

Backend:

```bash
cd backend
npm install
cp .env.example .env   # then fill in values
npm run dev            # http://localhost:5000
```

Frontend (separate terminal):

```bash
cd frontend
npm install
cp .env.example .env   # then fill in values
npm run dev            # http://localhost:5173
```

Open http://localhost:5173.

## API routes

| Method | Route                       | Purpose                              |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/auth/profile`         | Create/update profile after signup   |
| GET    | `/api/profile`              | Get current user's profile           |
| PUT    | `/api/profile`              | Update current user's profile        |
| POST   | `/api/conversations`        | Create a conversation                |
| GET    | `/api/conversations`        | List the user's conversations        |
| GET    | `/api/conversations/:id`    | Get one conversation + its messages  |
| DELETE | `/api/conversations/:id`    | Delete a conversation                |
| POST   | `/api/chat`                 | Main AI chat endpoint                |

Every protected route reads the `Authorization` bearer token, verifies the Supabase
user, validates input, checks resource ownership, and returns safe errors only.

## Security notes

- Gemini API key stays in `backend/.env` only; the frontend never sees it.
- Supabase **service role** key is backend-only; the frontend uses the anon key.
- Inputs validated on both client and server.
- Auth verified on every protected route; conversation ownership checked on read/write/delete.
- RLS enabled on all tables — a user can only touch their own rows.
- No stack traces returned to clients; API keys are never logged.
- `.env` is gitignored; `.env.example` files are provided.

## Deployment steps

- **Database/Auth:** already hosted on Supabase; just run the migration.
- **Backend:** deploy to Render / Railway / Fly.io. Set all backend env vars in the
  host dashboard. Set `FRONTEND_URL` to your deployed frontend origin (CORS).
- **Frontend:** build with `npm run build` and deploy `frontend/dist` to Vercel /
  Netlify. Set the `VITE_*` env vars, pointing `VITE_API_BASE_URL` at the deployed backend.

## Demo flow

1. Register a new account → profile is created.
2. Log in → redirected to the dashboard (real counts shown).
3. Click **Start new chat** → ask a technical question.
4. Watch the status badge move `sending → generating → completed` in real time.
5. Reload / open **History** → your conversation is saved and reopenable.
6. Delete a conversation → it disappears.
7. Log out → protected routes redirect to `/login`.

## Testing checklist

Register, login, logout, protected-route redirect, create conversation, send message,
receive Gemini response, messages saved, history reloads, delete conversation, empty
input rejected, over-long input rejected, another user cannot access your conversation
(RLS), Gemini failure shows an error, mobile layout works.
