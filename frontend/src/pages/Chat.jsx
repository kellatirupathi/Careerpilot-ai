import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { api } from '../lib/api.js';
import { useConversationStatus } from '../hooks/useConversationStatus.js';

const MSG_MIN = 2;
const MSG_MAX = 3000;

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingConv, setLoadingConv] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [status, setStatus] = useConversationStatus(conversationId, 'idle');
  const bottomRef = useRef(null);

  // Load sidebar list.
  useEffect(() => {
    api
      .listConversations()
      .then(({ conversations: c }) => setConversations(c))
      .catch((e) => setError(e.message));
  }, [conversationId]);

  // Load the active conversation + messages.
  useEffect(() => {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      return;
    }
    setLoadingConv(true);
    setError('');
    api
      .getConversation(conversationId)
      .then(({ conversation: conv, messages: msgs }) => {
        setConversation(conv);
        setMessages(msgs);
        setStatus(conv.status || 'idle');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingConv(false));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  async function startNewChat() {
    try {
      const { conversation: conv } = await api.createConversation();
      navigate(`/chat/${conv.id}`);
    } catch (e) {
      setError(e.message);
    }
  }

  const trimmed = input.trim();
  const disabled = sending || status === 'generating' || trimmed.length < MSG_MIN || trimmed.length > MSG_MAX;

  async function handleSend(ev) {
    ev.preventDefault();
    setError('');
    if (trimmed.length < MSG_MIN) return setError(`Message must be at least ${MSG_MIN} characters`);
    if (trimmed.length > MSG_MAX) return setError(`Message must be at most ${MSG_MAX} characters`);

    let convId = conversationId;
    // If no conversation is open, create one first.
    if (!convId) {
      try {
        const { conversation: conv } = await api.createConversation();
        convId = conv.id;
        navigate(`/chat/${conv.id}`, { replace: true });
      } catch (e) {
        return setError(e.message);
      }
    }

    // Optimistically show the user message.
    const optimistic = {
      id: `tmp-${Date.now()}`,
      role: 'user',
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setInput('');
    setSending(true);
    setStatus('sending');

    try {
      const { message } = await api.sendMessage(convId, trimmed);
      setMessages((m) => [...m, message]);
      setStatus('completed');
      // Refresh sidebar titles.
      api.listConversations().then(({ conversations: c }) => setConversations(c)).catch(() => {});
    } catch (e) {
      setStatus('failed');
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <button
            onClick={startNewChat}
            className="mb-3 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            + New chat
          </button>
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/chat/${c.id}`}
                  className={`block truncate rounded-lg px-3 py-2 text-sm hover:bg-slate-100 ${
                    c.id === conversationId ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600'
                  }`}
                >
                  {c.title}
                </Link>
              </li>
            ))}
            {conversations.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400">No conversations yet</li>
            )}
          </ul>
        </aside>

        {/* Chat panel */}
        <section className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h1 className="truncate font-semibold text-slate-900">
              {conversation ? conversation.title : 'New Conversation'}
            </h1>
            <StatusBadge status={status} />
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6" style={{ minHeight: 320 }}>
            {loadingConv ? (
              <Spinner label="Loading conversation…" />
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              messages.map((m) => <Bubble key={m.id} message={m} />)
            )}

            {(status === 'generating' || (sending && status !== 'failed')) && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Spinner /> The assistant is thinking…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && (
            <div className="mx-5 mb-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSend} className="border-t border-slate-200 p-4">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!disabled) handleSend(e);
                  }
                }}
                rows={2}
                maxLength={MSG_MAX}
                placeholder="Ask a technical question…"
                className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                disabled={disabled}
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
            <div className="mt-1 text-right text-xs text-slate-400">
              {trimmed.length}/{MSG_MAX}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Bubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
          isUser ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center py-10 text-center text-slate-400">
      <div>
        <p className="text-lg font-medium text-slate-500">Start the conversation</p>
        <p className="mt-1 text-sm">Ask about any technical topic to get a clear explanation.</p>
      </div>
    </div>
  );
}
