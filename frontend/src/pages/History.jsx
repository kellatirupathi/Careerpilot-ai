import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { ChatIcon, TrashIcon, PlusIcon } from '../components/ui/Icons.jsx';
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

  async function handleDelete(id, ev) {
    ev.preventDefault();
    ev.stopPropagation();
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Conversation history</h1>
            <p className="mt-1 text-slate-600">All your saved conversations.</p>
          </div>
          <Link to="/chat" className="btn-primary hidden sm:inline-flex">
            <PlusIcon width={16} height={16} /> New chat
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-8">
            <Spinner label="Loading history…" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <ChatIcon />
            </span>
            <p className="mt-3 font-medium text-slate-700">No conversations yet</p>
            <Link to="/chat" className="btn-primary mt-4">
              <PlusIcon width={16} height={16} /> Start one
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {conversations.map((c) => (
              <li key={c.id} className="card group flex items-center justify-between p-4 transition hover:shadow-soft">
                <Link to={`/chat/${c.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <ChatIcon width={18} height={18} />
                  </span>
                  <span className="min-w-0">
                    <div className="truncate font-medium text-slate-800">{c.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <StatusBadge status={c.status} />
                      <span>{new Date(c.updated_at).toLocaleString()}</span>
                    </div>
                  </span>
                </Link>
                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  disabled={deletingId === c.id}
                  className="btn-danger ml-4 px-3 py-2"
                  title="Delete conversation"
                >
                  <TrashIcon width={16} height={16} />
                  <span className="hidden sm:inline">{deletingId === c.id ? 'Deleting…' : 'Delete'}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
