import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Mail } from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';

const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'About',    to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Maps',     to: '/maps' },
  { label: 'Gallery',  to: '/gallery' },
  { label: 'Contact',  to: '/contact' },
];

export default function Navbar() {
  const { email } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkColor = scrolled
    ? 'text-forest-800 hover:text-gold'
    : 'text-white/90 hover:text-gold';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/96 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-3.5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Mabunda Travel & Tours — home">
          <img
            src="/logo.jpeg"
            alt=""
            width="56"
            height="56"
            className={`rounded-full object-cover shadow-md group-hover:scale-105 transition-all duration-300 ${
              scrolled ? 'w-12 h-12' : 'w-14 h-14'
            }`}
          />
          <span className="flex flex-col leading-none">
            <span className={`font-display text-lg font-semibold tracking-wide transition-colors ${scrolled ? 'text-forest-900' : 'text-white'}`}>
              Mabunda
            </span>
            <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-medium">
              Travel &amp; Tours
            </span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6 xl:gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors relative group ${
                    isActive ? 'text-gold' : linkColor
                  }`
                }
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" aria-hidden="true" />
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`mailto:${email}`}
            className={`flex items-center gap-2 text-sm transition-colors ${scrolled ? 'text-forest-700 hover:text-gold' : 'text-white/80 hover:text-gold'}`}
          >
            <Mail size={15} aria-hidden="true" />
            <span className="hidden xl:inline">{email}</span>
            <span className="xl:hidden">Email us</span>
          </a>
          <Link
            to="/contact"
            className="bg-forest-800 hover:bg-forest-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:scale-105"
          >
            Plan My Journey
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 ${scrolled ? 'text-forest-900' : 'text-white'}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-xl border border-gray-100">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg hover:bg-forest-50 transition-colors text-sm font-medium ${
                      isActive ? 'text-gold bg-amber-50' : 'text-forest-800 hover:text-gold'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <a
              href={`mailto:${email}`}
              className="block py-2.5 px-4 text-forest-600 hover:text-gold text-sm transition-colors truncate"
            >
              {email}
            </a>
            <Link
              to="/contact"
              className="block text-center bg-forest-800 text-white font-semibold text-sm px-5 py-3 rounded-full"
            >
              Plan My Journey
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
