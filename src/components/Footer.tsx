import { Link } from 'react-router-dom';
import { Mail, MapPin, Compass, MessageCircle, Star, Lock } from 'lucide-react';
import { COMPANY } from '../lib/company';
import { SERVICES } from '../lib/data';
import { useSettings } from '../lib/SettingsContext';

const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'About',    to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Maps',     to: '/maps' },
  { label: 'Gallery',  to: '/gallery' },
  { label: 'Contact',  to: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',    to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

export default function Footer() {
  const { email, address, whatsappLink, tripadvisorReviewUrl } = useSettings();
  return (
    <footer className="bg-forest-900 text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpeg"
                alt="Mabunda Travel & Tours logo"
                width="56"
                height="56"
                loading="lazy"
                className="w-14 h-14 rounded-full object-cover shadow-lg"
              />
              <div>
                <span className="font-display text-white text-lg font-semibold">Mabunda</span>
                <span className="block text-gold text-[10px] tracking-[0.2em] uppercase">Travel &amp; Tours</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {COMPANY.tagline} Your trusted travel partner in Mpumalanga,
              connecting you with authentic African destinations.
            </p>
            <p className="text-white/40 text-xs">
              {COMPANY.legalName}
              <br />
              Reg: {COMPANY.regNumber}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h2 className="font-display text-base font-semibold mb-5 text-gold">Quick Links</h2>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/60 hover:text-gold text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/60 hover:text-gold text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h2 className="font-display text-base font-semibold mb-5 text-gold">Our Services</h2>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <Link to="/services" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2">
                    <Compass size={12} className="text-olive" aria-hidden="true" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-display text-base font-semibold mb-5 text-gold">Contact Us</h2>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-white/60 hover:text-gold transition-colors text-sm break-all">
                  <Mail size={16} className="mt-0.5 flex-shrink-0 text-olive" aria-hidden="true" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hello Mabunda Travel & Tours, I'd like to enquire about a trip.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm"
                >
                  <MessageCircle size={16} className="flex-shrink-0 text-olive" aria-hidden="true" />
                  WhatsApp us
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-olive" aria-hidden="true" />
                  {address}
                </div>
              </li>
              {tripadvisorReviewUrl && (
                <li>
                  <a
                    href={tripadvisorReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    <Star size={16} className="flex-shrink-0 text-olive" aria-hidden="true" />
                    Leave us a Review
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Designed with care for travellers seeking authentic African experiences.
          </p>
          {/* Discreet staff-only entry point — not part of the main nav, not indexed (robots.txt), low-contrast so casual visitors won't notice it. */}
          <Link
            to="/admin/login"
            className="text-white/15 hover:text-white/50 transition-colors flex-shrink-0"
            aria-label="Staff login"
            title="Staff login"
          >
            <Lock size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
