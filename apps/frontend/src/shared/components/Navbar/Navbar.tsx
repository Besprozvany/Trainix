import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/shared/ui/Button/Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/specialists', label: 'Trainers' },
  { href: '/services', label: 'Services' },
];

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-[#2e2e3e] bg-[#0f0f13]/80 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
            <span className="text-sm font-bold text-white">T</span>
          </div>
          <span className="text-lg font-semibold text-[#e8e8f0] tracking-tight">Trainix</span>
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = location.pathname === href;
            return (
              <li key={href}>
                <Link
                  to={href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? 'text-indigo-400' : 'text-[#8b8ba0] hover:text-[#e8e8f0]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-indigo-500/10"
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium">
                  {user?.name[0].toUpperCase()}
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
