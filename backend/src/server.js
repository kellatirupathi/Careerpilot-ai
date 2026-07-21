import express from 'express';
import cors from 'cors';
import { env } from './lib/env.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import conversationRoutes from './routes/conversations.js';
import chatRoutes from './routes/chat.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Allowed origins: the configured FRONTEND_URL (comma-separated list supported)
// plus common local dev ports so the app works whether Vite lands on 5173/5174.
const allowedOrigins = new Set([
  ...env.FRONTEND_URL.split(',').map((s) => s.trim()).filter(Boolean),
  'http://localhost:5173',
  'http://localhost:5174',
]);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser tools (no origin) and any allow-listed origin.
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`[server] AI Learning Assistant backend on http://localhost:${env.PORT}`);
});
