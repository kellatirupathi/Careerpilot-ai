import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { api } from '../lib/api.js';
import AuthLayout from '../components/AuthLayout.jsx';
import { Field, TextInput, PasswordInput } from '../components/ui/Field.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError('');
    setNotice('');
    if (!validate()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { full_name: form.fullName.trim() },
        // Send users back to the deployed app (not localhost) after confirming.
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setLoading(false);
      setServerError(error.message || 'Could not register');
      return;
    }

    // If email confirmation is off, we have a session and can create the profile.
    if (data.session) {
      try {
        await api.saveProfile(form.fullName.trim(), form.email.trim());
      } catch {
        /* profile creation is best-effort; can be retried from Profile page */
      }
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    // Email confirmation required.
    setLoading(false);
    setNotice('Check your email to confirm your account, then log in.');
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start learning with your personal AI assistant."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {serverError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}
      {notice && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label="Full name" error={errors.fullName}>
          <TextInput
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={errors.fullName}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters">
          <PasswordInput
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <PasswordInput
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            error={errors.confirm}
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
        </Field>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
