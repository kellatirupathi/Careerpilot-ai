import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import { ChatIcon, PlusIcon, ArrowRightIcon } from '../components/ui/Icons.jsx';
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

  const greeting = fullName?.split(' ')[0] || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-sand-500">Welcome back</p>
            <h1 className="mt-0.5 text-3xl font-semibold text-ink">{greeting}</h1>
          </div>
          <button onClick={startNewChat} className="btn-primary px-4 py-2.5">
            <PlusIcon width={17} height={17} /> New chat
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-10">
            <Spinner label="Loading…" />
          </div>
        ) : (
          <>
            {/* Stats — quiet inline figures, not big gradient cards */}
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-sand-200 bg-sand-200 sm:grid-cols-3">
              <Figure label="Conversations" value={conversations.length} />
              <Figure label="Messages" value={messageCount} />
              <Figure
                label="Last active"
                value={conversations[0] ? new Date(conversations[0].updated_at).toLocaleDateString() : '—'}
              />
            </div>

            <section className="mt-10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Recent</h2>
                {conversations.length > 0 && (
                  <Link to="/history" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
                    All conversations <ArrowRightIcon width={14} height={14} />
                  </Link>
                )}
              </div>

              {conversations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-sand-300 bg-white p-12 text-center">
                  <p className="font-medium text-sand-700">No conversations yet</p>
                  <p className="mt-1 text-sm text-sand-500">Ask your first question to get started.</p>
                  <button onClick={startNewChat} className="btn-primary mt-5 px-4 py-2.5">
                    <PlusIcon width={16} height={16} /> Start a chat
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-sand-200 overflow-hidden rounded-xl border border-sand-200 bg-white">
                  {conversations.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <Link to={`/chat/${c.id}`} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-sand-50">
                        <ChatIcon width={17} height={17} className="shrink-0 text-sand-400" />
                        <span className="min-w-0 flex-1 truncate text-[15px] text-sand-800">{c.title}</span>
                        <span className="shrink-0 text-xs text-sand-400">
                          {new Date(c.updated_at).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Figure({ label, value }) {
  return (
    <div className="bg-white px-5 py-5">
      <div className="text-2xl font-semibold text-ink">{value}</div>
      <div className="mt-0.5 text-sm text-sand-500">{label}</div>
    </div>
  );
}
