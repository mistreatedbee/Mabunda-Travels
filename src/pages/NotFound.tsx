import { Link } from 'react-router-dom';
import { Home, Map, MessageCircle, Compass } from 'lucide-react';
import Seo from '../components/Seo';
import { COMPANY } from '../lib/company';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | Mabunda Travel & Tours"
        description="The page you were looking for could not be found. Explore our travel packages or contact Mabunda Travel & Tours."
        path="/404"
        noindex
      />
      <section className="relative bg-forest-900 min-h-screen flex items-center justify-center overflow-hidden py-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-olive/20 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 mb-8">
            <Compass className="text-gold" size={36} aria-hidden="true" />
          </div>
          <p className="font-display text-7xl sm:text-8xl font-bold text-gold mb-4">404</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mb-4 leading-tight">
            Looks like you've wandered off the trail
          </h1>
          <p className="text-white/75 leading-relaxed mb-10 max-w-lg mx-auto">
            The page you're looking for doesn't exist or may have moved. Don't worry —
            even the best explorers take a wrong turn. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-lg"
            >
              <Home size={18} aria-hidden="true" />
              Back to Home
            </Link>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-gold text-white hover:text-gold font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              <Map size={18} aria-hidden="true" />
              Browse Packages
            </Link>
            <a
              href={COMPANY.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-gold text-white hover:text-gold font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
