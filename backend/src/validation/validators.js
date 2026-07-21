import { badRequest } from '../utils/errors.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MESSAGE_MIN = 2;
export const MESSAGE_MAX = 3000;

export function validateEmail(email) {
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    throw badRequest('A valid email is required');
  }
  return email.trim();
}

export function validateFullName(fullName) {
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    throw badRequest('Full name is required');
  }
  return fullName.trim();
}

export function validateMessage(message) {
  if (typeof message !== 'string' || !message.trim()) {
    throw badRequest('Message is required');
  }
  const trimmed = message.trim();
  if (trimmed.length < MESSAGE_MIN) {
    throw badRequest(`Message must be at least ${MESSAGE_MIN} characters`);
  }
  if (trimmed.length > MESSAGE_MAX) {
    throw badRequest(`Message must be at most ${MESSAGE_MAX} characters`);
  }
  return trimmed;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateUuid(id, label = 'id') {
  if (!id || typeof id !== 'string' || !UUID_RE.test(id)) {
    throw badRequest(`Invalid ${label}`);
  }
  return id;
}
