import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY } from '../lib/company';
import Reveal from './Reveal';

interface CTASectionProps {
  title?: string;
  text?: string;
}

/** Reusable conversion banner shown near the bottom of most pages. */
export default function CTASection({
  title = 'Ready to start your journey?',
  text = 'Tell us where you dream of going and we will craft a personalised itinerary with an obligation-free quote — usually within one business day.',
}: CTASectionProps) {
  return (
    <section className="py-20 sm:py-24 bg-forest-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight mb-4">
            {title}
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-9 max-w-2xl mx-auto">
            {text}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-lg"
            >
              Request a Quote
              <ArrowRight size={18} />
            </Link>
            <a
              href={COMPANY.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-gold text-white hover:text-gold font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
