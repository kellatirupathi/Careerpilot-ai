# 🚀 Common Deployment Guide for Full-Stack Gemini AI Assignments

> A reusable deployment guide for all assignments built with **React.js**, **Node.js/Express**, a supported database, and the **Google Gemini API**.
>
> Replace placeholders such as `<your-project-name>` and `<your-backend-url>` with values from your own assignment.

---

## 1. Common Architecture

| Layer | Technology | Recommended Hosting |
|---|---|---|
| Frontend | React.js + Vite + React Router | Vercel |
| Backend | Node.js + Express.js | Render |
| AI | Google Gemini API | Called only from backend |
| Database | Supabase, MongoDB, PostgreSQL, MySQL, or SQLite | Managed database provider |
| Authentication | Supabase Auth or JWT | Supabase or backend |

```text
Browser → React Frontend → Node.js Backend → Gemini API
                                  └──────→ Database
```

> 🔒 Keep the Gemini API key, database admin credentials, JWT secret, and storage secrets only in the backend.

---

## 2. Accounts and Software Required

Create accounts for:

- GitHub
- Google AI Studio
- Render
- Vercel
- Your selected database provider

Install:

- Node.js LTS
- npm
- Git
- VS Code or another editor

```bash
node -v
npm -v
git --version
```

---

## 3. Recommended Project Structure

```text
<your-project-name>/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── database/
│   ├── migrations/
│   └── schema.sql
├── .gitignore
├── README.md
└── DEPLOYMENT_GUIDE.md
```

If frontend and backend are stored in separate repositories, deploy each repository independently and leave the hosting root directory empty.

---

## 4. Prepare the Backend for Production

### 4.1 Add scripts

JavaScript example:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

TypeScript example:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 4.2 Use the platform port

```js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
```

### 4.3 Add a health endpoint

```js
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});
```

### 4.4 Configure CORS

```js
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed'));
  },
  credentials: true
}));
```

---

## 5. Prepare the Frontend for Production

Run:

```bash
cd frontend
npm install
npm run build
```

Vite should create a `dist` directory.

For React Router refresh support, add `frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 6. Configure `.gitignore`

```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
coverage/
*.log
.DS_Store
```

Never commit real secrets.

---

## 7. Push the Project to GitHub

```bash
git init
git add .
git commit -m "Initial full-stack Gemini AI application"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repository>.git
git push -u origin main
```

Confirm that the repository contains source code, migrations/schema, README, and `.env.example` files—but no real keys.

---

## 8. Create the Gemini API Key

1. Open Google AI Studio.
2. Create an API key.
3. Store it as `GEMINI_API_KEY` in the backend only.

Backend `.env.example`:

```env
GEMINI_API_KEY=
GEMINI_MODEL=
```

Example initialization:

```js
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

> Never call Gemini directly from React using a secret API key.

---

## 9. Database Setup

Choose only one database option.

### Option A: Supabase PostgreSQL

Use when the project needs hosted PostgreSQL, authentication, realtime, or storage.

Backend variables:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Frontend variables, only when the frontend uses Supabase directly:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Rules:

- Keep `SUPABASE_SERVICE_ROLE_KEY` only in the backend.
- Run the project migration/schema in the Supabase SQL Editor.
- Enable Row Level Security where required.
- Create policies based on authenticated user ownership or roles.

### Option B: MongoDB Atlas

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

```js
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
```

Create an Atlas database user and configure network access for the hosting platform.

### Option C: PostgreSQL or MySQL

```env
DATABASE_URL=
```

Run the ORM migration command used by the project, for example:

```bash
npx prisma generate
npx prisma migrate deploy
```

Never reset a production database.

### Option D: SQLite

```env
SQLITE_PATH=./data/application.db
```

Use SQLite in production only with persistent disk storage. If the platform filesystem is temporary, use a hosted database instead.

---

## 10. Environment Variables

### Common backend variables

```env
NODE_ENV=production
APP_NAME=<your-project-name>
PORT=5000
FRONTEND_URL=https://<your-frontend>.vercel.app
GEMINI_API_KEY=<secret>
GEMINI_MODEL=<model-used-by-code>
JWT_SECRET=<long-random-secret-if-required>
```

Add only the database variables required by your project:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MONGODB_URI=
DATABASE_URL=
SQLITE_PATH=
```

### Common frontend variables

```env
VITE_API_BASE_URL=https://<your-backend>.onrender.com
```

Optional Supabase public variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> Every `VITE_*` value is visible in the browser. Never store backend secrets in a `VITE_*` variable.

---

## 11. Run Locally Before Deployment

### Backend

```bash
cd backend
npm install
npm run dev
```

Test:

```text
http://localhost:5000/api/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Test all project-specific flows before deployment:

- Registration and login
- Protected routes
- Create/read/update/delete operations
- Gemini generation
- Saving AI output
- Role permissions
- Search and filtering
- File uploads or realtime features, when required
- Error, loading, and empty states

---

## 12. Deploy the Backend on Render

1. Sign in to Render with GitHub.
2. Create a new Web Service.
3. Connect the repository.
4. Configure:

| Setting | Monorepo Value |
|---|---|
| Name | `<project-name>-backend` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Branch | `main` |

For TypeScript:

```bash
npm install && npm run build
```

Add backend environment variables in Render.

Initially use:

```env
FRONTEND_URL=http://localhost:5173
```

After deployment, copy the stable backend URL:

```text
https://<your-backend>.onrender.com
```

Test:

```text
https://<your-backend>.onrender.com/api/health
```

---

## 13. Deploy the Frontend on Vercel

1. Sign in to Vercel with GitHub.
2. Import the repository.
3. Configure:

| Setting | Monorepo Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add:

```env
VITE_API_BASE_URL=https://<your-backend>.onrender.com
```

Add Supabase public variables only if required.

Deploy and copy the stable frontend URL:

```text
https://<your-frontend>.vercel.app
```

---

## 14. Connect Frontend and Backend

Update Render:

```env
FRONTEND_URL=https://<your-frontend>.vercel.app
```

Redeploy the backend.

Verify Vercel:

```env
VITE_API_BASE_URL=https://<your-backend>.onrender.com
```

Redeploy the frontend after changing any `VITE_*` variable.

Do not leave production requests pointing to `localhost`.

---

## 15. Authentication Configuration

### Supabase Auth

In Supabase Authentication URL Configuration:

- Set the Site URL to the production Vercel URL.
- Add localhost for development.
- Add the production URL to allowed redirect URLs.

```text
http://localhost:5173/**
https://<your-frontend>.vercel.app/**
```

### JWT authentication

Confirm that:

- Passwords are hashed with bcrypt.
- Login returns a token only after credential validation.
- Protected APIs verify the token.
- Backend routes enforce resource ownership and user roles.
- Expired tokens are rejected.

### Cookie authentication

For cross-origin cookies, configure:

- `credentials: 'include'` in frontend requests
- `credentials: true` in CORS
- `httpOnly: true`
- `secure: true` in production
- Appropriate `sameSite` behavior

---

## 16. File Uploads, Realtime, and Background Tasks

### File uploads

Use managed storage such as Supabase Storage, Cloudinary, or S3-compatible storage. Do not depend on a temporary backend upload folder.

### Realtime features

Verify:

- Production frontend origin is allowed.
- Users can subscribe only to authorized records.
- Reconnect works after refresh.
- Private data is never published to public channels.

### WebSockets

Use the production backend URL and a hosting plan that supports long-lived connections.

### Background tasks

For document processing, emails, reports, or long AI jobs:

- Save job status in the database.
- Show pending, completed, and failed states.
- Use a queue/worker when reliability is required.

---

## 17. Common Production Testing Checklist

### Application

- [ ] Landing page loads.
- [ ] Direct route refresh works.
- [ ] Registration, login, and logout work.
- [ ] Protected pages reject unauthenticated users.
- [ ] Role-based pages reject unauthorized users.
- [ ] Project records can be created and viewed.
- [ ] Required update/archive/delete actions work.
- [ ] Search and filters work.
- [ ] Loading, empty, validation, and error states work.
- [ ] Mobile and desktop layouts work.

### Gemini AI

- [ ] Gemini requests go through the backend.
- [ ] Gemini API key is not visible in browser tools.
- [ ] Inputs are validated.
- [ ] Model errors are handled safely.
- [ ] JSON output is parsed safely when required.
- [ ] Generated output is saved only when needed.
- [ ] Human review/disclaimers exist for high-impact use cases.

### Database and Authorization

- [ ] Migrations/schema are applied.
- [ ] Production database is being used.
- [ ] Users cannot access another user's private data.
- [ ] Admin-only APIs enforce roles on the backend.
- [ ] Database admin credentials are not in React.

### Deployment

- [ ] Backend health endpoint works.
- [ ] Frontend uses the production backend URL.
- [ ] CORS allows the exact frontend origin.
- [ ] Authentication redirects use production URLs.
- [ ] Required environment variables are present.
- [ ] No secrets are committed to GitHub.

---

## 18. Project-Specific Testing

The deployment process is common, but functional testing must match the assignment title.

Examples:

- **Cybersecurity:** incidents, evidence, affected assets, severity, response actions, and reports.
- **Construction:** projects, sites, milestones, materials, inspections, risks, and approvals.
- **Healthcare:** symptom records, urgency warnings, follow-up questions, and safety disclaimers.
- **E-commerce:** products, recommendations, support requests, and saved items.
- **Education:** lessons, quizzes, flashcards, progress, and scores.
- **Logistics:** shipments, routes, stops, delays, and delivery status.
- **Recruitment:** job descriptions, candidate records, screening, shortlists, and interview workflows.

Do not use education features in unrelated assignments.

---

## 19. Troubleshooting

| Problem | Fix |
|---|---|
| Backend deployment fails | Check Render logs, root directory, build command, start command, and packages. |
| `npm start` fails | Add a valid `start` script. |
| Health endpoint is 404 | Confirm the deployed backend and route path. |
| Frontend is blank | Check Vercel logs, browser console, imports, and environment variables. |
| Route refresh is 404 | Add `vercel.json` SPA rewrite. |
| CORS error | Set `FRONTEND_URL` to the exact Vercel origin and redeploy. |
| Frontend calls localhost | Correct `VITE_API_BASE_URL` and redeploy Vercel. |
| Gemini fails | Check key, model name, quota, request format, and backend logs. |
| Database connection fails | Check credentials, network access, SSL, and connection string. |
| Users see other users' data | Fix backend ownership checks or RLS immediately. |
| Email confirmation opens localhost | Update authentication redirect URLs. |
| Uploaded files disappear | Use managed object storage. |
| SQLite data disappears | Use persistent disk or migrate to hosted PostgreSQL. |
| Environment change has no effect | Redeploy the relevant service. |

Debug in this order:

1. Backend health route
2. Render logs
3. API test using Postman/curl
4. Browser Network tab
5. Browser Console
6. Frontend environment variables
7. Backend environment variables
8. CORS and auth settings
9. Database permissions
10. Gemini endpoint

---

## 20. Security Checklist

1. Keep Gemini and database secrets only in the backend.
2. Never commit `.env` files.
3. Rotate exposed secrets immediately.
4. Hash passwords with bcrypt.
5. Validate all request data.
6. Use authentication middleware.
7. Enforce ownership and roles in backend APIs.
8. Configure RLS when React directly accesses Supabase.
9. Limit file types and sizes.
10. Rate-limit Gemini endpoints.
11. Do not return stack traces or secrets to users.
12. Avoid logging passwords, tokens, API keys, or sensitive data.
13. Use HTTPS production URLs.
14. Back up important data.
15. Add human review and disclaimers for medical, legal, financial, safety, and security-related AI output.

---

## 21. Updating and Redeploying

```bash
git status
git add .
git commit -m "Update application"
git push origin main
```

Render and Vercel normally redeploy automatically.

After every update:

1. Review deployment logs.
2. Test the health endpoint.
3. Open the production frontend.
4. Test the changed business workflow.
5. Verify Gemini and database operations.
6. Confirm environment variables remain configured.

---

## 22. Final Submission Checklist

- [ ] GitHub repository link
- [ ] Frontend URL
- [ ] Backend URL
- [ ] Working health endpoint
- [ ] README with setup instructions
- [ ] Deployment guide
- [ ] Frontend and backend `.env.example` files
- [ ] Database schema/migrations
- [ ] Screenshots
- [ ] Gemini integration explanation
- [ ] Assignment-specific Gemini feature list
- [ ] No committed secrets

---

## ✅ Deployment Complete

The application is ready when:

- The React frontend is publicly accessible.
- The Node.js backend health route works.
- The frontend communicates with the production backend.
- The database stores and protects project-specific data.
- Gemini features work through the backend.
- Authentication and authorization are enforced.
- Secrets remain private.
- The assignment-specific workflow passes production testing.
