import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogoutIcon } from './ui/Icons.jsx';

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-[17px] font-semibold text-ink">Learnwell</span>
    </span>
  );
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-sand-200/80 bg-sand-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to={user ? '/dashboard' : '/'}>
          <Wordmark />
        </Link>

        {user ? (
          <nav className="flex items-center gap-0.5 text-sm">
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/chat">Chat</NavItem>
            <NavItem to="/history">History</NavItem>
            <NavItem to="/profile">Profile</NavItem>
            <button onClick={handleSignOut} className="btn-subtle ml-1 px-2.5 py-1.5" title="Sign out">
              <LogoutIcon width={16} height={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-1.5 text-sm">
            <Link to="/login" className="btn-subtle px-3 py-1.5">
              Log in
            </Link>
            <Link to="/register" className="btn-primary px-4 py-1.5">
              Get started
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
        `rounded-lg px-3 py-1.5 font-medium transition ${
          isActive ? 'text-brand-700' : 'text-sand-600 hover:text-ink'
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}
