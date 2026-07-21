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
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-ink">History</h1>
          <Link to="/chat" className="btn-primary px-4 py-2.5">
            <PlusIcon width={16} height={16} /> New chat
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-8">
            <Spinner label="Loading…" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-sand-300 bg-white p-12 text-center">
            <p className="font-medium text-sand-700">Nothing here yet</p>
            <Link to="/chat" className="btn-primary mt-5 px-4 py-2.5">
              <PlusIcon width={16} height={16} /> Start a conversation
            </Link>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-sand-200 overflow-hidden rounded-xl border border-sand-200 bg-white">
            {conversations.map((c) => (
              <li key={c.id} className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-sand-50">
                <ChatIcon width={17} height={17} className="shrink-0 text-sand-400" />
                <Link to={`/chat/${c.id}`} className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium text-sand-800">{c.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-sand-400">
                    <StatusBadge status={c.status} />
                    <span>{new Date(c.updated_at).toLocaleString()}</span>
                  </div>
                </Link>
                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  disabled={deletingId === c.id}
                  className="btn-danger px-2.5 py-2 opacity-0 transition group-hover:opacity-100"
                  title="Delete"
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
