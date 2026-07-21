import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest, notFound } from '../utils/errors.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { validateFullName, validateEmail } from '../validation/validators.js';

const router = Router();

/** GET /api/profile — current user's profile. */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) throw badRequest('Could not load profile');
    if (!data) throw notFound('Profile not found');
    res.json({ profile: data });
  })
);

/** PUT /api/profile — update current user's profile. */
router.put(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const fullName = validateFullName(req.body?.fullName);
    const email = req.body?.email
      ? validateEmail(req.body.email)
      : undefined;

    const patch = { full_name: fullName, updated_at: new Date().toISOString() };
    if (email) patch.email = email;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(patch)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw badRequest('Could not update profile');
    res.json({ profile: data });
  })
);

export default router;
