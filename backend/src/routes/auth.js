import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest } from '../utils/errors.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { validateFullName, validateEmail } from '../validation/validators.js';

const router = Router();

/**
 * POST /api/auth/profile
 * Create or update the current user's profile after signup (upsert).
 */
router.post(
  '/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const fullName = validateFullName(req.body?.fullName);
    const email = req.body?.email
      ? validateEmail(req.body.email)
      : req.user.email;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: req.user.id,
          full_name: fullName,
          email,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) throw badRequest('Could not save profile');
    res.status(200).json({ profile: data });
  })
);

export default router;
