import { Phone, Mail, MapPin, Compass } from 'lucide-react';
import { COMPANY } from '../lib/company';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Deals', href: '#deals' },
  { label: 'Lodges', href: '#lodges' },
  { label: 'About', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const SERVICES_LIST = [
  'Safari Experiences',
  'Holiday Packages',
  'Accommodation Bookings',
  'Group Tours',
  'Corporate Travel',
  'Custom Trips',
];

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpeg"
                alt="Mabunda Travel & Tours logo"
                className="w-12 h-12 rounded-full object-cover shadow-lg"
              />
              <div>
                <span className="font-display text-white text-lg font-semibold">Mabunda</span>
                <span className="block text-gold text-[10px] tracking-[0.2em] uppercase">Travel & Tours</span>
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
          <div>
            <h4 className="font-display text-base font-semibold mb-5 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/60 hover:text-gold text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-base font-semibold mb-5 text-gold">Our Services</h4>
            <ul className="space-y-3">
              {SERVICES_LIST.map((s) => (
                <li key={s}>
                  <a href="#lodges" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2">
                    <Compass size={12} className="text-olive" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-semibold mb-5 text-gold">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${COMPANY.phone}`} className="flex items-start gap-3 text-white/60 hover:text-gold transition-colors text-sm">
                  <Phone size={16} className="mt-0.5 flex-shrink-0 text-olive" />
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex items-start gap-3 text-white/60 hover:text-gold transition-colors text-sm break-all">
                  <Mail size={16} className="mt-0.5 flex-shrink-0 text-olive" />
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-olive" />
                  {COMPANY.address}
                </div>
              </li>
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
        </div>
      </div>
    </footer>
  );
}
