import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import {
  SparklesIcon,
  BoltIcon,
  BookIcon,
  HistoryIcon,
  ShieldIcon,
  ChatIcon,
  ArrowRightIcon,
  CheckIcon,
} from '../components/ui/Icons.jsx';

const FEATURES = [
  { icon: BookIcon, title: 'Beginner-friendly answers', body: 'Every explanation starts with a direct answer, then a clear step-by-step breakdown.' },
  { icon: BoltIcon, title: 'Practical examples', body: 'Learn with a real example and a common mistake to avoid on every topic.' },
  { icon: SparklesIcon, title: 'Revision questions', body: 'Three questions after each answer help you check your understanding.' },
  { icon: HistoryIcon, title: 'Saved conversations', body: 'Reopen past chats anytime — your learning history stays with you.' },
  { icon: ChatIcon, title: 'Real-time status', body: 'Watch the assistant think with live generation status updates.' },
  { icon: ShieldIcon, title: 'Private & secure', body: 'Row-level security keeps your data yours. No one else can see your chats.' },
];

const STEPS = [
  { n: '01', title: 'Create an account', body: 'Register with your name and email in seconds.' },
  { n: '02', title: 'Ask a question', body: 'Type any technical topic you want to understand.' },
  { n: '03', title: 'Learn & revise', body: 'Get a structured explanation and save it for later.' },
];

const STACK = ['React', 'Node.js + Express', 'Supabase', 'PostgreSQL', 'Gemini API', 'Tailwind CSS'];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-fade [background-size:22px_22px]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-100/70 to-transparent blur-2xl" />

        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <span className="chip mx-auto border border-brand-200 bg-brand-50 text-brand-700">
            <SparklesIcon width={14} height={14} /> Learn technical topics faster
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Your personal{' '}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              AI Learning Assistant
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Ask any technical question and get clear, beginner-friendly explanations with examples and
            revision questions — built for undergraduate students.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary px-7 py-3 text-base">
              Get Started Free <ArrowRightIcon width={18} height={18} />
            </Link>
            <Link to="/login" className="btn-ghost px-7 py-3 text-base">
              Login
            </Link>
          </div>
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
            <CheckIcon width={16} height={16} className="text-emerald-500" /> No credit card required
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="How it works" title="From question to understanding in three steps" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="card p-7">
                <div className="text-sm font-bold text-brand-500">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Features" title="Everything you need to learn effectively" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card group p-7 transition hover:shadow-glow">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <f.icon />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <SectionHeading eyebrow="Technology" title="Built on a modern, production-grade stack" center />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {STACK.map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-ink-800 p-12 text-center text-white shadow-glow">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <h2 className="text-3xl font-bold">Ready to learn smarter?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Join now and get your first beginner-friendly explanation in under a minute.
            </p>
            <Link to="/register" className="btn mt-8 bg-white px-7 py-3 text-base text-brand-700 hover:bg-slate-100">
              Create your free account <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        AI Learning Assistant — built for students.
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, center }) {
  return (
    <div className={center ? 'text-center' : 'mx-auto max-w-2xl text-center'}>
      <div className="text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
    </div>
  );
}
