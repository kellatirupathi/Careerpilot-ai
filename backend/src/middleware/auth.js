import { supabaseAdmin } from '../lib/supabase.js';
import { unauthorized, asyncHandler } from '../utils/errors.js';

/**
 * Verifies the Supabase access token from the Authorization header and attaches
 * `req.user` and `req.accessToken`. Rejects any request without a valid user.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) throw unauthorized('Missing authentication token');

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) throw unauthorized('Invalid or expired session');

  req.user = data.user;
  req.accessToken = token;
  next();
});
