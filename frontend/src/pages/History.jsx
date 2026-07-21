import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { api } from '../lib/api.js';

export default function History() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api
      .listConversations()
      .then(({ conversations: c }) => setConversations(c))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.deleteConversation(id);
      setConversations((cs) => cs.filter((c) => c.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Conversation history</h1>
        <p className="mt-1 text-slate-600">All your saved conversations.</p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-8">
            <Spinner label="Loading history…" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No conversations yet.{' '}
            <Link to="/chat" className="font-medium text-brand-600 hover:underline">
              Start one
            </Link>
            .
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {conversations.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4"
              >
                <Link to={`/chat/${c.id}`} className="min-w-0 flex-1">
                  <div className="truncate font-medium text-slate-800">{c.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <StatusBadge status={c.status} />
                    <span>{new Date(c.updated_at).toLocaleString()}</span>
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deletingId === c.id}
                  className="ml-4 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === c.id ? 'Deleting…' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
