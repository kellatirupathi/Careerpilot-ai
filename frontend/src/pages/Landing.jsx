import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { ArrowRightIcon, SparklesIcon } from '../components/ui/Icons.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero — asymmetric: copy left, product preview right */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white px-3 py-1 text-[13px] font-medium text-sand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            For undergraduate students
          </span>
          <h1 className="mt-5 font-display text-[2.9rem] font-semibold leading-[1.05] text-ink sm:text-[3.6rem]">
            Understand hard topics, one clear answer at a time.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-sand-600">
            Ask anything technical. Learnwell replies with a direct answer, a step-by-step
            explanation, a worked example, and questions to test yourself — in plain language.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/register" className="btn-primary px-5 py-3 text-[15px]">
              Start learning free <ArrowRightIcon width={17} height={17} />
            </Link>
            <Link to="/login" className="btn-ghost px-5 py-3 text-[15px]">
              I already have an account
            </Link>
          </div>
          <p className="mt-4 text-sm text-sand-400">Free to use · No credit card · Your chats stay private</p>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <ChatPreview />
        </div>
      </section>

      {/* How it works — numbered, editorial, left-aligned */}
      <section className="border-t border-sand-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-brand-600">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Every answer follows the same reliable shape.
            </h2>
            <p className="mt-3 text-sand-600">
              No wall of text. The assistant is instructed to always structure its reply so it's
              easy to follow and easy to revise from.
            </p>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Direct answer', 'The short version first, so you get unblocked immediately.'],
              ['Step-by-step', 'The reasoning broken down into plain, ordered steps.'],
              ['Worked example', 'One concrete example that shows the idea in practice.'],
              ['Common mistake', 'The trap most learners fall into — pointed out early.'],
              ['Revision questions', 'Three questions to check you actually understood.'],
              ['Saved & searchable', 'Every conversation is kept so you can return to it.'],
            ].map(([title, body], i) => (
              <div key={title} className="border-t border-sand-200 pt-5">
                <div className="font-display text-sm text-sand-400">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-1.5 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-sand-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiet trust strip */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-2xl border border-sand-200 bg-white p-10 sm:p-14">
          <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr] sm:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-ink">Built like real software, not a toy.</h2>
              <p className="mt-4 text-sand-600">
                A React frontend, an Express API that keeps your keys secret, Supabase for auth and
                your database with row-level security, and Google Gemini for the answers. Your data
                is only ever yours.
              </p>
              <Link to="/register" className="btn-primary mt-7 px-5 py-3 text-[15px]">
                Create your account <ArrowRightIcon width={17} height={17} />
              </Link>
            </div>
            <ul className="grid gap-3 text-sm">
              {['React + Vite', 'Node · Express', 'Supabase (Postgres)', 'Row-level security', 'Google Gemini', 'Real-time status'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2.5 rounded-lg bg-sand-50 px-4 py-2.5 text-sand-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {t}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-sand-200 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 text-sm text-sand-500">
          <span className="font-display font-semibold text-ink">Learnwell</span>
          <span>Built for students.</span>
        </div>
      </footer>
    </div>
  );
}

/** A faithful, static preview of the actual chat UI. */
function ChatPreview() {
  return (
    <div className="rotate-[0.6deg] rounded-2xl border border-sand-200 bg-white shadow-lift">
      <div className="flex items-center gap-2 border-b border-sand-200 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-sand-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-sand-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-sand-200" />
        <span className="ml-2 text-xs text-sand-400">Learnwell · What is a hash map?</span>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2 text-sm text-white">
            What is a hash map, in simple terms?
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <SparklesIcon width={14} height={14} />
          </span>
          <div className="max-w-[85%] space-y-2.5 rounded-2xl rounded-tl-sm bg-sand-100 px-3.5 py-3 text-sm text-sand-800">
            <p><span className="font-semibold">Direct answer:</span> a hash map stores key–value pairs so you can look a value up by its key almost instantly.</p>
            <p className="text-sand-600"><span className="font-semibold text-sand-800">Example:</span> a phone book — you jump straight to a name instead of reading every page.</p>
            <div className="flex gap-1.5 pt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sand-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-sand-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-sand-300" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-sand-200 p-3">
        <div className="flex-1 rounded-lg border border-sand-200 px-3 py-2 text-sm text-sand-400">
          Ask a follow-up…
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
          <ArrowRightIcon width={16} height={16} />
        </span>
      </div>
    </div>
  );
}
