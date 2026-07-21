import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Service-role client. Bypasses RLS — use ONLY on the server, never expose
 * this key to the frontend. We still scope every query by user_id manually
 * and verify ownership in the route handlers.
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/**
 * Returns a Supabase client scoped to a specific user's access token, so all
 * queries run under that user's RLS policies. Useful for defense-in-depth.
 */
export function supabaseForToken(accessToken) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
