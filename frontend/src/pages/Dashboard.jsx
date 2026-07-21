import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import { ChatIcon, HistoryIcon, SparklesIcon, PlusIcon, ArrowRightIcon } from '../components/ui/Icons.jsx';
import { api } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [{ conversations: convs }, { count }] = await Promise.all([
          api.listConversations(),
          supabase.from('messages').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        ]);
        if (!active) return;
        setConversations(convs);
        setMessageCount(count ?? 0);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }

      try {
        const { profile } = await api.getProfile();
        if (active) setFullName(profile?.full_name || '');
      } catch {
        /* profile may not exist yet */
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user.id]);

  async function startNewChat() {
    try {
      const { conversation } = await api.createConversation();
      navigate(`/chat/${conversation.id}`);
    } catch (e) {
      setError(e.message);
    }
  }

  const latest = conversations[0];
  const greeting = fullName || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero band */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-ink-800 p-8 text-white shadow-glow">
          <div className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {greeting} 👋</h1>
              <p className="mt-1 text-white/80">Ask a question or continue a past conversation.</p>
            </div>
            <button
              onClick={startNewChat}
              className="btn bg-white px-5 py-2.5 text-brand-700 hover:bg-slate-100"
            >
              <PlusIcon width={18} height={18} /> Start new chat
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-10">
            <Spinner label="Loading your dashboard…" />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Stat icon={ChatIcon} label="Total conversations" value={conversations.length} />
              <Stat icon={SparklesIcon} label="Total messages" value={messageCount} />
              <Stat icon={HistoryIcon} label="Latest conversation" value={latest ? latest.title : '—'} small />
            </div>

            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent conversations</h2>
                <Link to="/history" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
                  View all <ArrowRightIcon width={15} height={15} />
                </Link>
              </div>

              {conversations.length === 0 ? (
                <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <ChatIcon />
                  </span>
                  <p className="mt-3 font-medium text-slate-700">No conversations yet</p>
                  <p className="text-sm text-slate-500">Start your first chat to see it here.</p>
                  <button onClick={startNewChat} className="btn-primary mt-4">
                    <PlusIcon width={16} height={16} /> New chat
                  </button>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {conversations.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <Link to={`/chat/${c.id}`} className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50">
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                            <ChatIcon width={18} height={18} />
                          </span>
                          <span className="truncate font-medium text-slate-800">{c.title}</span>
                        </span>
                        <span className="ml-3 shrink-0 text-xs text-slate-400">
                          {new Date(c.updated_at).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/60 p-6">
              <h3 className="flex items-center gap-2 font-semibold text-brand-700">
                <SparklesIcon width={18} height={18} /> How to get the best answers
              </h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                <li className="rounded-xl bg-white/70 px-4 py-3">Ask about one topic at a time for focused explanations.</li>
                <li className="rounded-xl bg-white/70 px-4 py-3">Follow up in the same conversation to build on context.</li>
                <li className="rounded-xl bg-white/70 px-4 py-3">Use the revision questions to test your understanding.</li>
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, small }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon />
      </span>
      <div className="min-w-0">
        <div className="text-sm text-slate-500">{label}</div>
        <div className={`mt-0.5 font-bold text-slate-900 ${small ? 'truncate text-base' : 'text-2xl'}`}>{value}</div>
      </div>
    </div>
  );
}
