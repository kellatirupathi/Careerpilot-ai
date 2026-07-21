import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import { Field, TextInput } from '../components/ui/Field.jsx';
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
      await api.saveProfile(fullName.trim(), email.trim());
      setMessage('Saved.');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const initials = (fullName || email || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10">
        <h1 className="text-3xl font-semibold text-ink">Profile</h1>
        <p className="mt-1 text-sand-600">Manage your account details.</p>

        {loading ? (
          <div className="mt-8">
            <Spinner label="Loading…" />
          </div>
        ) : (
          <div className="card mt-6 p-6">
            <div className="flex items-center gap-4 border-b border-sand-200 pb-6">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-lg font-semibold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-ink">{fullName || 'Your name'}</div>
                <div className="truncate text-sm text-sand-500">{email}</div>
              </div>
            </div>

            {message && (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-6 space-y-5" noValidate>
              <Field label="Full name" error={errors.fullName}>
                <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
              </Field>
              <Field label="Email" error={errors.email}>
                <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              </Field>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
