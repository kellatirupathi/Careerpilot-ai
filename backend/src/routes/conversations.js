import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest, notFound } from '../utils/errors.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { validateUuid } from '../validation/validators.js';

const router = Router();

/** POST /api/conversations — create a new conversation for the current user. */
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const rawTitle = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const title = rawTitle ? rawTitle.slice(0, 120) : 'New Conversation';

    const { data, error } = await supabaseAdmin
      .from('conversations')
      .insert({ user_id: req.user.id, title, status: 'idle' })
      .select()
      .single();

    if (error) throw badRequest('Could not create conversation');
    res.status(201).json({ conversation: data });
  })
);

/** GET /api/conversations — list current user's conversations (newest first). */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw badRequest('Could not load conversations');
    res.json({ conversations: data ?? [] });
  })
);

/** GET /api/conversations/:id — one conversation plus its messages. */
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = validateUuid(req.params.id, 'conversation id');

    const { data: conversation, error: convErr } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (convErr) throw badRequest('Could not load conversation');
    if (!conversation) throw notFound('Conversation not found');

    const { data: messages, error: msgErr } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (msgErr) throw badRequest('Could not load messages');
    res.json({ conversation, messages: messages ?? [] });
  })
);

/** DELETE /api/conversations/:id — delete a conversation the user owns. */
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = validateUuid(req.params.id, 'conversation id');

    // Verify ownership before deleting.
    const { data: existing, error: findErr } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (findErr) throw badRequest('Could not delete conversation');
    if (!existing) throw notFound('Conversation not found');

    const { error } = await supabaseAdmin
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw badRequest('Could not delete conversation');
    res.json({ ok: true });
  })
);

export default router;
