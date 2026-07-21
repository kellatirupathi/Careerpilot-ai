import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { ChatIcon, PlusIcon, SendIcon, SparklesIcon, UserIcon } from '../components/ui/Icons.jsx';
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

  useEffect(() => {
    api
      .listConversations()
      .then(({ conversations: c }) => setConversations(c))
      .catch((e) => setError(e.message));
  }, [conversationId]);

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
    if (!convId) {
      try {
        const { conversation: conv } = await api.createConversation();
        convId = conv.id;
        navigate(`/chat/${conv.id}`, { replace: true });
      } catch (e) {
        return setError(e.message);
      }
    }

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
      api.listConversations().then(({ conversations: c }) => setConversations(c)).catch(() => {});
    } catch (e) {
      setStatus('failed');
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-sand-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-5 overflow-hidden px-5 py-5">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col md:flex">
          <button onClick={startNewChat} className="btn-ghost mb-2 w-full justify-start">
            <PlusIcon width={16} height={16} /> New chat
          </button>
          <div className="scroll-thin -mr-1 flex-1 space-y-0.5 overflow-y-auto pr-1">
            {conversations.map((c) => (
              <Link
                key={c.id}
                to={`/chat/${c.id}`}
                className={`block truncate rounded-lg px-3 py-2 text-sm transition ${
                  c.id === conversationId
                    ? 'bg-white font-medium text-ink shadow-card'
                    : 'text-sand-600 hover:bg-white/70'
                }`}
                title={c.title}
              >
                {c.title}
              </Link>
            ))}
            {conversations.length === 0 && (
              <p className="px-3 py-2 text-sm text-sand-400">No conversations yet</p>
            )}
          </div>
        </aside>

        {/* Chat panel */}
        <section className="card flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-sand-200 px-5 py-3">
            <h2 className="truncate text-[15px] font-semibold text-ink">
              {conversation ? conversation.title : 'New conversation'}
            </h2>
            <StatusBadge status={status} />
          </header>

          <div className="scroll-thin flex-1 space-y-5 overflow-y-auto px-5 py-6">
            {loadingConv ? (
              <Spinner label="Loading…" />
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              messages.map((m) => <Bubble key={m.id} message={m} />)
            )}

            {(status === 'generating' || (sending && status !== 'failed')) && (
              <div className="flex items-start gap-2.5">
                <Avatar role="assistant" />
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-sand-100 px-4 py-3.5">
                  <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && (
            <div className="mx-5 mb-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSend} className="border-t border-sand-200 p-3.5">
            <div className="flex items-end gap-2.5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!disabled) handleSend(e);
                  }
                }}
                rows={1}
                maxLength={MSG_MAX}
                placeholder="Ask a technical question…"
                className="scroll-thin field max-h-40 flex-1 resize-none"
              />
              <button type="submit" disabled={disabled} className="btn-primary h-[42px] px-4" title="Send">
                <SendIcon width={17} height={17} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <div className="mt-1.5 flex justify-between px-0.5 text-xs text-sand-400">
              <span>Enter to send · Shift+Enter for a new line</span>
              <span>{trimmed.length}/{MSG_MAX}</span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Avatar({ role }) {
  const isUser = role === 'user';
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
        isUser ? 'bg-sand-700 text-white' : 'bg-brand-50 text-brand-600'
      }`}
    >
      {isUser ? <UserIcon width={15} height={15} /> : <SparklesIcon width={15} height={15} />}
    </span>
  );
}

function Bubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar role={message.role} />
      <div
        className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser ? 'rounded-tr-sm bg-brand-600 text-white' : 'rounded-tl-sm bg-sand-100 text-sand-800'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function Dot({ delay = '0ms' }) {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-sand-300" style={{ animationDelay: delay }} />;
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center py-10 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <SparklesIcon />
        </span>
        <p className="mt-4 font-display text-xl font-semibold text-ink">What do you want to understand?</p>
        <p className="mt-1.5 text-sm text-sand-500">
          Ask about any technical topic and get a clear, structured explanation.
        </p>
      </div>
    </div>
  );
}
