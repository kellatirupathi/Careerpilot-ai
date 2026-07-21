import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest, notFound } from '../utils/errors.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { validateUuid, validateMessage } from '../validation/validators.js';
import { generateAnswer } from '../services/gemini.js';

const router = Router();

const CONTEXT_WINDOW = 6; // last N messages used for Gemini context

async function setStatus(conversationId, status) {
  await supabaseAdmin
    .from('conversations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', conversationId);
}

/**
 * POST /api/chat
 * Body: { conversationId, message }
 * Runs the full chat flow and returns the assistant reply.
 */
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const conversationId = validateUuid(req.body?.conversationId, 'conversation id');
    const message = validateMessage(req.body?.message);
    const userId = req.user.id;

    // Confirm the conversation belongs to this user.
    const { data: conversation, error: convErr } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();

    if (convErr) throw badRequest('Could not load conversation');
    if (!conversation) throw notFound('Conversation not found');

    // Save the user's message.
    const { error: userMsgErr } = await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      user_id: userId,
      role: 'user',
      content: message,
    });
    if (userMsgErr) throw badRequest('Could not save message');

    // If this is the first message, use it as the conversation title.
    if (conversation.title === 'New Conversation') {
      const title = message.slice(0, 60);
      await supabaseAdmin
        .from('conversations')
        .update({ title })
        .eq('id', conversationId);
    }

    try {
      await setStatus(conversationId, 'generating');

      // Retrieve recent context (excluding the message we just inserted is fine
      // to include; we fetch the latest N ordered oldest-first for the prompt).
      const { data: history } = await supabaseAdmin
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(CONTEXT_WINDOW + 1);

      const previous = (history ?? [])
        .reverse()
        .filter((m) => m.content !== message)
        .slice(-CONTEXT_WINDOW);

      const answer = await generateAnswer(message, previous);

      await setStatus(conversationId, 'saving');

      const { data: assistantMsg, error: aErr } = await supabaseAdmin
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'assistant',
          content: answer,
        })
        .select()
        .single();
      if (aErr) throw new Error('Could not save assistant response');

      await setStatus(conversationId, 'completed');

      res.json({ message: assistantMsg });
    } catch (err) {
      console.error('[chat] generation failed', err);
      await setStatus(conversationId, 'failed');
      throw badRequest('The assistant could not generate a response. Please try again.');
    }
  })
);

export default router;
