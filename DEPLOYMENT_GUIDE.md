# 🚀 AI Learning Assistant — Complete Deployment Guide

> A step-by-step guide for students to take this project from **zero → fully deployed on the internet**.
> Follow the parts **in order**. Each part tells you exactly what to click, copy, and paste.

**Live example of a finished deployment:**
- Frontend (Vercel): `https://careerpilot-ai-omega-three.vercel.app`
- Backend (Render): `https://careerpilot-backend-l73z.onrender.com`

---

## 📖 Table of Contents

1. [What you are building](#1-what-you-are-building)
2. [Before you start (accounts you need)](#2-before-you-start)
3. [Get the code onto your computer & GitHub](#3-get-the-code)
4. [PART A — Supabase (database + login)](#part-a--supabase-setup)
5. [PART B — Gemini API key (the AI)](#part-b--gemini-api-key)
6. [PART C — Run it locally first (recommended)](#part-c--run-locally-first)
7. [PART D — Deploy the Backend on Render](#part-d--deploy-backend-on-render)
8. [PART E — Deploy the Frontend on Vercel](#part-e--deploy-frontend-on-vercel)
9. [PART F — Connect frontend & backend (final wiring)](#part-f--connect-them)
10. [PART G — Fix the confirmation email link](#part-g--fix-the-email-link)
11. [Testing checklist](#testing-checklist)
12. [Troubleshooting](#troubleshooting)
13. [All environment variables in one place](#environment-variables-cheat-sheet)
14. [Security notes](#security-notes)

---

## 1. What you are building

A full-stack web app where a student can register, log in, ask an AI technical questions,
and save conversations. It uses:

| Layer | Technology | Where it is hosted |
| ----- | ---------- | ------------------ |
| Frontend (the website) | React + Vite + Tailwind | **Vercel** |
| Backend (the API) | Node.js + Express | **Render** |
| Database + Login | Supabase (PostgreSQL) | **Supabase cloud** |
| AI answers | Google Gemini API | Called from the backend |

**The flow:**

```
Your Browser  →  Frontend (Vercel)  →  Backend (Render)  →  Gemini API
                                                        →  Supabase (DB + Auth + Realtime)
```

> 🔒 **Important idea:** The Gemini key and the Supabase *secret* key live **only in the backend**.
> The browser never sees them. This keeps your app secure.

---

## 2. Before you start

Create these **free** accounts (all support "Sign in with GitHub"):

| Account | Website | What it's for |
| ------- | ------- | ------------- |
| GitHub | https://github.com | Stores your code |
| Supabase | https://supabase.com | Database + user login |
| Google AI Studio | https://aistudio.google.com | Gemini API key |
| Render | https://render.com | Hosts the backend |
| Vercel | https://vercel.com | Hosts the frontend |

You also need on your computer:
- **Node.js** (v18 or newer) → https://nodejs.org
- **Git** → https://git-scm.com
- A code editor like **VS Code**

Check they're installed (open a terminal / PowerShell):

```bash
node -v
git --version
```

---

## 3. Get the code

If the project is already on GitHub, clone it:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

If you built it locally and want to push it to a **new** GitHub repo:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

**Project folder structure:**

```
your-repo/
├── frontend/     ← React app (deploys to Vercel)
├── backend/      ← Express API (deploys to Render)
├── supabase/
│   └── migrations/0001_init.sql   ← database setup script
├── README.md
└── DEPLOYMENT_GUIDE.md            ← this file
```

---

## PART A — Supabase Setup

> This gives you a database, user authentication, and the two Supabase keys you need.
> **Do this part first** — everything else depends on it.

### A.1 — Create the project

1. Go to https://supabase.com → **Sign in** (use GitHub).
2. Click **New Project**.
3. Fill in:
   - **Name:** `careerpilot` (any name)
   - **Database Password:** create a strong one and **save it somewhere**
   - **Region:** pick the one closest to you
4. Click **Create new project** and wait ~2 minutes while it sets up.

### A.2 — Copy your Supabase URL and keys

1. In the left sidebar click the **gear icon (Project Settings)** → **API**.
2. You will see (copy each into a notepad):

| What you see in Supabase | Save it as | Used where |
| ------------------------ | ---------- | ---------- |
| **Project URL** (e.g. `https://abcd1234.supabase.co`) | `SUPABASE_URL` | backend **and** frontend |
| **anon / public** key | `SUPABASE_ANON_KEY` | backend **and** frontend |
| **service_role** key (click *Reveal*) | `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ **backend only** |

> 🔑 **Note on newer projects:** Supabase now sometimes shows keys named
> `sb_publishable_...` (that is your **anon** key) and `sb_secret_...` (that is your **service_role** key).
> Either naming is fine — just map them to the right variable above.

> ⛔ **NEVER** put the `service_role` / `sb_secret_...` key in the frontend. It can bypass all
> security rules. It belongs **only** in the backend.

### A.3 — Create the database tables (run the migration)

1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open the file [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) from your project.
4. **Copy its entire contents**, paste into the SQL editor.
5. Click **Run** (or press Ctrl+Enter).
6. You should see **"Success. No rows returned."** ✅

This creates 3 tables (`profiles`, `conversations`, `messages`), turns on **Row Level Security**
(so users can only see their own data), and enables **Realtime** for live status updates.

### A.4 — (Recommended for demos) Turn off email confirmation

By default Supabase makes users click an email link before they can log in. For a smooth demo:

1. Go to **Authentication → Sign In / Providers → Email**.
2. Turn **OFF** the **"Confirm email"** toggle.
3. Click **Save**.

Now registration logs the user in instantly. *(If you keep it ON, see [PART G](#part-g--fix-the-email-link).)*

✅ **Supabase is ready.**

---

## PART B — Gemini API Key

> This is the key that lets your backend generate AI answers.

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with a Google account.
3. Click **Create API key** → **Create API key in new project**.
4. Copy the key (it starts with `AIza...`).
5. Save it as `GEMINI_API_KEY`.

> 💡 The API key is **free** with generous limits — perfect for learning and demos.

✅ **You now have all your credentials:**
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`.

---

## PART C — Run Locally First

> Optional but **strongly recommended** — confirm everything works on your computer
> before deploying. Skip to [PART D](#part-d--deploy-backend-on-render) if you want to deploy directly.

### C.1 — Backend

Open a terminal:

```bash
cd backend
npm install
```

Create a file named `.env` inside the `backend` folder (copy from `.env.example`) and fill it:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Start it:

```bash
npm run dev
```

You should see: `[server] AI Learning Assistant backend on http://localhost:5000`
Test it by opening http://localhost:5000/api/health → you should see `{"ok":true}`.

### C.2 — Frontend

Open a **second** terminal:

```bash
cd frontend
npm install
```

Create a file named `.env` inside the `frontend` folder and fill it:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:5000
```

Start it:

```bash
npm run dev
```

Open the URL it prints (usually http://localhost:5173) and test registration + chat.

> ⚠️ **Never commit `.env` files to GitHub.** They are already listed in `.gitignore`,
> so Git will ignore them automatically. Only `.env.example` (with blank values) is committed.

---

## PART D — Deploy Backend on Render

> This puts your Express API on the internet with a public URL.

1. Go to https://render.com → sign in with **GitHub** → authorize it.
2. Click **New +** → **Web Service**.
3. Find and connect your repository. (If it's not listed, click **Configure account** and give Render access.)
4. Fill in the settings **exactly**:

   | Setting | Value |
   | ------- | ----- |
   | **Name** | `careerpilot-backend` (any name) |
   | **Root Directory** | `backend` |
   | **Language / Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

   > ⚠️ **Root Directory = `backend` is critical** — the backend lives in a subfolder.

5. Scroll down to **Environment Variables**. Click **Add Environment Variable** for each of these **6**:

   | Key | Value |
   | --- | ----- |
   | `SUPABASE_URL` | your Supabase Project URL |
   | `SUPABASE_ANON_KEY` | your anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |
   | `GEMINI_API_KEY` | your Gemini key |
   | `PORT` | `5000` |
   | `FRONTEND_URL` | `http://localhost:5173` *(temporary — fixed in PART F)* |

6. Click **Create Web Service**. Render builds and deploys (~2–3 minutes).
7. When the top of the page shows **"Live"**, copy your backend URL, e.g.
   **`https://careerpilot-backend-l73z.onrender.com`** — **save it.**
8. **Test it:** open `https://<your-backend>.onrender.com/api/health`
   → you should see `{"ok":true}` ✅

> 💤 **Free tier note:** The free backend "sleeps" after 15 minutes of no traffic.
> The first request after it sleeps takes ~50 seconds to wake up. This is normal.

---

## PART E — Deploy Frontend on Vercel

> This puts your React website on the internet.

1. Go to https://vercel.com → sign in with **GitHub**.
2. Click **Add New… → Project** → **Import** your repository.
3. Configure:

   | Setting | Value |
   | ------- | ----- |
   | **Framework Preset** | `Vite` (auto-detected) |
   | **Root Directory** | click **Edit** → choose **`frontend`** |
   | **Build Command** | `npm run build` (default) |
   | **Output Directory** | `dist` (default) |

   > ⚠️ **Root Directory = `frontend` is critical.**

4. Expand **Environment Variables** and add these **3**
   (make sure the **Production, Preview, and Development** boxes are all checked):

   | Key | Value |
   | --- | ----- |
   | `VITE_SUPABASE_URL` | your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your anon key |
   | `VITE_API_BASE_URL` | your Render backend URL (from PART D — **no trailing slash**) |

   > ⚠️ Frontend variables **must** start with `VITE_`. Do **not** add the service_role key here.

5. Click **Deploy**. Wait ~1 minute.
6. Copy your live frontend URL, e.g. **`https://careerpilot-ai-omega-three.vercel.app`** — **save it.**

> 📝 A Vercel project shows two kinds of URLs. Use the **stable domain**
> (like `careerpilot-ai-omega-three.vercel.app`), *not* the long deployment-specific one,
> because the stable one never changes.

---

## PART F — Connect Them

> ⚠️ **This is the step everyone forgets.** Right now the backend blocks your website
> because of CORS security. You must tell the backend the frontend's real address, and
> rebuild the frontend so it picks up the variables.

### F.1 — Point the backend at the frontend

1. Go to **Render → your service → Environment**.
2. Click **Edit**.
3. Change **`FRONTEND_URL`** to your **Vercel URL** (no trailing slash):
   ```
   https://careerpilot-ai-omega-three.vercel.app
   ```
4. Click **Save changes** → Render redeploys automatically (~1 minute).

### F.2 — Redeploy the frontend

> Vite bakes `VITE_*` variables into the site **at build time**. If you added them after
> the first deploy, you must rebuild.

1. Go to **Vercel → Deployments** tab.
2. Click the **⋯** menu on the latest deployment → **Redeploy** → confirm.

✅ **Your app is now fully live and connected.** Open your Vercel URL and test it.

---

## PART G — Fix the Email Link

> Only needed if you kept **"Confirm email" ON** in Supabase (PART A.4).
> Symptom: the confirmation email link opens `localhost:3000` and shows **"Cannot GET /"**.

Supabase only redirects to URLs you allow-list:

1. Go to **Supabase → Authentication → URL Configuration**.
2. Set **Site URL** to your Vercel URL:
   ```
   https://careerpilot-ai-omega-three.vercel.app
   ```
3. Under **Redirect URLs**, click **Add URL** and add:
   ```
   https://careerpilot-ai-omega-three.vercel.app/**
   ```
4. Click **Save.**

New confirmation emails will now link to your live app instead of localhost.
*(The app's code already requests this redirect; this dashboard step allows it.)*

---

## Testing Checklist

Open your live Vercel URL and confirm each works:

- [ ] Landing page loads with the new design
- [ ] Register a new account (password show/hide 👁 works)
- [ ] Redirected to the Dashboard after signup/login
- [ ] Dashboard shows real counts (starts at 0)
- [ ] Start a new chat and ask a question
- [ ] Status badge changes: `sending → generating → completed`
- [ ] AI answer appears and is saved
- [ ] Refresh the page — the conversation is still there
- [ ] History page lists conversations; delete one
- [ ] Log out → visiting `/dashboard` redirects to `/login`
- [ ] Works on a mobile screen size

---

## Troubleshooting

| Problem | Cause & Fix |
| ------- | ----------- |
| Chat fails / **CORS error** in browser console | `FRONTEND_URL` on Render doesn't exactly match your Vercel URL. Recheck PART F.1 (no trailing slash). |
| First request takes ~50 seconds | Render free tier waking from sleep — normal. |
| Confirmation email opens `localhost:3000` | Do PART G, **or** turn off "Confirm email" (PART A.4). |
| "Invalid or expired session" | Frontend `VITE_SUPABASE_*` values don't match the backend's / your project. |
| Login works but chat fails | `GEMINI_API_KEY` on Render is missing or wrong. |
| Blank page / 404 on refresh of a route | On Vercel, confirm Root Directory = `frontend` and Framework = Vite. |
| Env var changes not taking effect on frontend | You must **redeploy** Vercel after changing `VITE_*` variables. |
| Backend won't start | A required env var is missing on Render. Check all 6 in PART D. |

> **How to open the browser console:** press **F12** → click the **Console** tab. Red text = the error.

---

## Environment Variables Cheat Sheet

### Backend (Render) — 6 variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

### Frontend (Vercel) — 3 variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## Security Notes

1. ✅ The **Gemini key** and **Supabase service_role key** are stored **only in the backend** (Render).
2. ✅ The frontend uses **only** the `anon` (public) key — safe to expose.
3. ✅ Never commit `.env` files to GitHub — only `.env.example` with blank values.
4. ✅ **Row Level Security** is on, so one user can never read another user's data.
5. ✅ The backend verifies every request's login token and checks resource ownership.
6. ⚠️ If you ever paste a secret key somewhere public (chat, screenshot, commit),
   **regenerate it** in Supabase (Project Settings → API) or Google AI Studio.

---

## 🔄 Updating your app after deployment

Both Render and Vercel **auto-deploy** whenever you push to the `main` branch:

```bash
git add .
git commit -m "describe your change"
git push origin main
```

Within a minute or two, both your backend and frontend rebuild automatically. 🎉

---

**You're done!** Your AI Learning Assistant is live on the internet.
Share your Vercel link and let people try it.
