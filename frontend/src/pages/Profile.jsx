import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import { Field, TextInput } from '../components/ui/Field.jsx';
import { UserIcon } from '../components/ui/Icons.jsx';
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
      setMessage('Profile saved successfully.');
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your profile</h1>
        <p className="mt-1 text-slate-600">Manage your account details.</p>

        {loading ? (
          <div className="mt-8">
            <Spinner label="Loading profile…" />
          </div>
        ) : (
          <div className="card mt-6 overflow-hidden">
            {/* Header band */}
            <div className="flex items-center gap-4 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-slate-50 p-6">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-soft">
                {initials || <UserIcon />}
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold text-slate-900">{fullName || 'Your name'}</div>
                <div className="truncate text-sm text-slate-500">{email}</div>
              </div>
            </div>

            <div className="p-6">
              {message && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <form onSubmit={handleSave} className="space-y-5" noValidate>
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
          </div>
        )}
      </main>
    </div>
  );
}
