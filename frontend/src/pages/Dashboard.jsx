import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
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
          supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
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
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {greeting} 👋</h1>
            <p className="mt-1 text-slate-600">Ask a question or continue a past conversation.</p>
          </div>
          <button
            onClick={startNewChat}
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
          >
            + Start new chat
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-10">
            <Spinner label="Loading your dashboard…" />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Stat label="Total conversations" value={conversations.length} />
              <Stat label="Total messages" value={messageCount} />
              <Stat
                label="Latest conversation"
                value={latest ? latest.title : '—'}
                small
              />
            </div>

            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent conversations</h2>
                <Link to="/history" className="text-sm font-medium text-brand-600 hover:underline">
                  View all
                </Link>
              </div>

              {conversations.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                  No conversations yet. Start your first chat!
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                  {conversations.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/chat/${c.id}`}
                        className="flex items-center justify-between px-5 py-4 hover:bg-slate-50"
                      >
                        <span className="font-medium text-slate-800">{c.title}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(c.updated_at).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-10 rounded-xl bg-brand-50 p-6">
              <h3 className="font-semibold text-brand-700">How to get the best answers</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                <li>Ask about one topic at a time for focused explanations.</li>
                <li>Follow up in the same conversation to build on context.</li>
                <li>Use the revision questions to test your understanding.</li>
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, small }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-1 font-bold text-slate-900 ${small ? 'text-lg truncate' : 'text-3xl'}`}>
        {value}
      </div>
    </div>
  );
}
