import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { COMPANY } from '../lib/company';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Deals', href: '#deals' },
  { label: 'Lodges', href: '#lodges' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-forest-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="font-display text-white text-lg font-bold">M</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`font-display text-lg font-semibold tracking-wide transition-colors ${scrolled ? 'text-forest-900' : 'text-white'}`}>
              Mabunda
            </span>
            <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-medium">
              Travel & Tours
            </span>
          </div>
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors relative group ${
                  scrolled ? 'text-forest-800 hover:text-gold' : 'text-white/90 hover:text-gold'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${COMPANY.phone}`}
            className={`flex items-center gap-2 text-sm transition-colors ${scrolled ? 'text-forest-700 hover:text-gold' : 'text-white/80 hover:text-gold'}`}
          >
            <Phone size={15} />
            {COMPANY.phone}
          </a>
          <a
            href="#contact"
            className="bg-forest-800 hover:bg-forest-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:scale-105"
          >
            Plan My Journey
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 ${scrolled ? 'text-forest-900' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-xl border border-gray-100">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-forest-800 hover:text-gold py-3 px-4 rounded-lg hover:bg-forest-50 transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center bg-forest-800 text-white font-semibold text-sm px-5 py-3 rounded-full"
          >
            Plan My Journey
          </a>
        </div>
      </div>
    </header>
  );
}
