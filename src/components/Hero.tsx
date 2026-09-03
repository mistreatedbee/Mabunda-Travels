import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { HomepageHero } from '../lib/homepage';

interface HeroProps {
  content: HomepageHero;
}

export default function Hero({ content }: HeroProps) {
  const backgrounds = content.background_images.length > 0 ? content.background_images : [{ url: '/logo.jpeg', alt: '' }];

  return (
    <section id="home" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {backgrounds.map((img, i) => (
          <img
            key={`${img.url}-${i}`}
            src={img.url}
            alt=""
            aria-hidden="true"
            className="hero-bg-slide absolute inset-0 w-full h-full object-cover"
            style={{ animationDelay: `${i * 8}s` }}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent z-[1]" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center pt-32 pb-24">
        <div className="mx-auto mb-8 w-64 sm:w-80 lg:w-96 animate-fade-in">
          <img
            src="/logo.jpeg"
            alt="Mabunda Travel & Tours logo"
            width="746"
            height="741"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <Sparkles size={13} className="text-gold" aria-hidden="true" />
          <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
            {content.location_chip}
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white font-bold leading-[1.08] mb-5 animate-fade-in-up">
          {content.headline_line1}
          <br />
          <span className="text-gold">{content.headline_highlight}</span>
        </h1>

        <p
          className="text-white/85 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.12s' }}
        >
          {content.subtitle}
        </p>

        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/70 text-sm animate-fade-in"
          style={{ animationDelay: '0.24s' }}
        >
          {content.trust_badges.map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>

        <Link
          to={content.discover_link_url || '/services'}
          className="inline-flex items-center gap-2 mt-10 text-white/80 hover:text-gold text-sm font-medium transition-colors animate-fade-in"
          style={{ animationDelay: '0.36s' }}
        >
          {content.discover_link_text}
          <ArrowRight size={16} className="animate-bounce" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
