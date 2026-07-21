import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SparklesIcon, LogoutIcon } from './ui/Icons.jsx';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 font-bold text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
            <SparklesIcon width={18} height={18} />
          </span>
          <span className="tracking-tight">AI Learning Assistant</span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-1 text-sm">
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/chat">Chat</NavItem>
            <NavItem to="/history">History</NavItem>
            <NavItem to="/profile">Profile</NavItem>
            <button onClick={handleSignOut} className="btn-ghost ml-2 px-3 py-1.5">
              <LogoutIcon width={16} height={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/login" className="rounded-xl px-4 py-2 font-medium text-slate-700 hover:bg-slate-100">
              Login
            </Link>
            <Link to="/register" className="btn-primary px-4 py-2">
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-1.5 font-medium transition ${
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}
