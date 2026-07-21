import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const FEATURES = [
  { title: 'Beginner-friendly answers', body: 'Every explanation starts with a direct answer, then a step-by-step breakdown.' },
  { title: 'Practical examples', body: 'Learn with a real example and a common mistake to avoid on every topic.' },
  { title: 'Revision questions', body: 'Three questions after each answer help you check your understanding.' },
  { title: 'Saved conversations', body: 'Reopen past chats anytime — your learning history stays with you.' },
  { title: 'Real-time status', body: 'Watch the assistant think with live generation status updates.' },
  { title: 'Private & secure', body: 'Your data is protected by row-level security. Only you can see your chats.' },
];

const STEPS = [
  { n: 1, title: 'Create an account', body: 'Register with your name and email in seconds.' },
  { n: 2, title: 'Ask a question', body: 'Type any technical topic you want to understand.' },
  { n: 3, title: 'Learn & revise', body: 'Get a structured explanation and save it for later.' },
];

const STACK = ['React', 'Node.js + Express', 'Supabase', 'PostgreSQL', 'Gemini API', 'Tailwind CSS'];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
          Learn technical topics faster
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Your personal <span className="text-brand-600">AI Learning Assistant</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Ask any technical question and get clear, beginner-friendly explanations with examples and
          revision questions. Built for undergraduate students.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register" className="rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
            Get Started
          </Link>
          <Link to="/login" className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100">
            Login
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-slate-200 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 font-semibold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-slate-900">Feature highlights</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Technology stack</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {STACK.map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        AI Learning Assistant — built for students.
      </footer>
    </div>
  );
}
