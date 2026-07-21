import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import { Field, FieldStyles } from './Login.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .getProfile()
      .then(({ profile }) => {
        if (!active) return;
        setFullName(profile?.full_name || '');
        setEmail(profile?.email || user.email || '');
      })
      .catch(() => {
        // No profile yet — seed from auth metadata.
        setFullName(user.user_metadata?.full_name || '');
        setEmail(user.email || '');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  function validate() {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim() || !EMAIL_RE.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave(ev) {
    ev.preventDefault();
    setMessage('');
    setError('');
    if (!validate()) return;
    setSaving(true);
    try {
      // Upsert so it works whether or not a profile row exists yet.
      await api.saveProfile(fullName.trim(), email.trim());
      setMessage('Profile saved.');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Your profile</h1>
        <p className="mt-1 text-slate-600">Manage your account details.</p>

        {loading ? (
          <div className="mt-8">
            <Spinner label="Loading profile…" />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            {message && (
              <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
            )}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <form onSubmit={handleSave} className="space-y-4" noValidate>
              <Field label="Full name" error={errors.fullName}>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              </Field>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>
        )}
      </main>
      <FieldStyles />
    </div>
  );
}
