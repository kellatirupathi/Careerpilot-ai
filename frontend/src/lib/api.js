import { supabase } from './supabase.js';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(await authHeaders()) };
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    throw new Error(payload?.error || 'Request failed');
  }
  return payload;
}

export const api = {
  // profile / auth
  saveProfile: (fullName, email) =>
    request('/auth/profile', { method: 'POST', body: { fullName, email } }),
  getProfile: () => request('/profile'),
  updateProfile: (fullName, email) =>
    request('/profile', { method: 'PUT', body: { fullName, email } }),

  // conversations
  createConversation: (title) =>
    request('/conversations', { method: 'POST', body: { title } }),
  listConversations: () => request('/conversations'),
  getConversation: (id) => request(`/conversations/${id}`),
  deleteConversation: (id) =>
    request(`/conversations/${id}`, { method: 'DELETE' }),

  // chat
  sendMessage: (conversationId, message) =>
    request('/chat', { method: 'POST', body: { conversationId, message } }),
};
