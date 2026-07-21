import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">AI</span>
          Learning Assistant
        </Link>

        {user ? (
          <nav className="flex items-center gap-1 text-sm">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/chat">Chat</NavLink>
            <NavLink to="/history">History</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button
              onClick={handleSignOut}
              className="ml-2 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
            >
              Sign out
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/login" className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700">
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
      {children}
    </Link>
  );
}
