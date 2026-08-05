import Reveal from './Reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional background photograph; falls back to a brand gradient. */
  image?: string;
  imageAlt?: string;
}

/**
 * Dark hero banner used at the top of every inner page. Provides the
 * contrast backdrop the transparent navbar needs.
 */
export default function PageHeader({ eyebrow, title, subtitle, image, imageAlt = '' }: PageHeaderProps) {
  return (
    <section className="relative bg-forest-900 pt-36 pb-20 sm:pt-44 sm:pb-24 overflow-hidden">
      {image && (
        <>
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-forest-900/60 to-forest-900/80" />
        </>
      )}
      {!image && (
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" aria-hidden="true" />
      )}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">{eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold mt-3 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
