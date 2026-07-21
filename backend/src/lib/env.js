import dotenv from 'dotenv';

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`[env] Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  SUPABASE_URL: required('SUPABASE_URL'),
  SUPABASE_ANON_KEY: required('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: required('SUPABASE_SERVICE_ROLE_KEY'),
  GEMINI_API_KEY: required('GEMINI_API_KEY'),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  PORT: Number(process.env.PORT) || 5000,
};
