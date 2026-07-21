import express from 'express';
import cors from 'cors';
import { env } from './lib/env.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import conversationRoutes from './routes/conversations.js';
import chatRoutes from './routes/chat.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
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
