import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Smartphone, Loader2 } from 'lucide-react';
import { getPublishedTours } from '../lib/queries';
import type { Tour } from '../lib/types';
import Reveal from './Reveal';

function ActivityCard({ tour }: { tour: Tour }) {
  const [flipped, setFlipped] = useState(false);
  const image = tour.images[0]?.url;

  return (
    <Reveal>
      <article
        className="activity-card h-80 rounded-2xl overflow-hidden cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f); }}
        tabIndex={0}
        aria-label={`${tour.name} — tap to learn more`}
        role="button"
        aria-pressed={flipped}
      >
        <div className={`activity-card-inner w-full h-full${flipped ? ' flipped' : ''}`}>

          {/* Front face */}
          <div className="activity-card-face activity-card-front rounded-2xl">
            {image ? (
              <img
                src={image}
                alt={tour.images[0]?.alt || tour.name}
                className="w-full h-full object-cover"
                loading="lazy"
                width="400"
                height="320"
              />
            ) : (
              <div className="w-full h-full bg-forest-100" aria-hidden="true" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {tour.tag && (
              <span className="absolute top-4 right-4 bg-gold text-forest-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                {tour.tag}
              </span>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5">
              {tour.destination?.name && (
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5">
                  <MapPin size={12} aria-hidden="true" />
                  <span>{tour.destination.name}</span>
                </div>
              )}
              <h3 className="font-display text-white font-semibold text-lg leading-snug mb-2">
                {tour.name}
              </h3>
              <p className="text-white/75 text-xs line-clamp-2">{tour.short_description}</p>

              <span className="hidden sm:flex items-center gap-1.5 mt-3 text-gold text-[10px] font-semibold uppercase tracking-wide">
                Hover to explore
                <ArrowRight size={10} aria-hidden="true" />
              </span>
              <span className="flex sm:hidden items-center gap-1.5 mt-3 text-gold text-[10px] font-semibold uppercase tracking-wide">
                <Smartphone size={10} aria-hidden="true" />
                Tap to explore
              </span>
            </div>
          </div>

          {/* Back face */}
          <div className="activity-card-face activity-card-back rounded-2xl bg-forest-900 p-6 flex flex-col justify-between">
            <div>
              {tour.tag && (
                <span className="inline-block bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3">
                  {tour.tag}
                </span>
              )}
              <h3 className="font-display text-white font-bold text-lg leading-snug mb-3">
                {tour.name}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed line-clamp-5">
                {tour.full_description || tour.short_description}
              </p>
            </div>
            {tour.destination?.name && (
              <div className="flex items-center gap-2 mt-4">
                <MapPin size={13} className="text-gold flex-shrink-0" aria-hidden="true" />
                <span className="text-white/60 text-xs">{tour.destination.name}</span>
              </div>
            )}
          </div>

        </div>
      </article>
    </Reveal>
  );
}

export default function DealsSection() {
  const [tours, setTours] = useState<Tour[] | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublishedTours().then((data) => { if (mounted) setTours(data); });
    return () => { mounted = false; };
  }, []);

  // While loading, or if there's genuinely nothing published yet, render
  // nothing rather than a placeholder — no fabricated content.
  if (tours !== null && tours.length === 0) return null;

  return (
    <section id="experiences" aria-label="Experiences and activities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block bg-forest-50 text-forest-700 text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4">
              What we offer
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mb-3">
              Extraordinary experiences &amp; activities
            </h2>
            <p className="text-forest-500 max-w-xl mx-auto text-base">
              From the Big Five to balloon rides and conservation encounters — hover or tap each card to discover the experience.
            </p>
          </div>
        </Reveal>

        {tours === null ? (
          <div className="flex justify-center py-12" role="status" aria-label="Loading tours">
            <Loader2 size={28} className="animate-spin text-forest-400" aria-hidden="true" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tours.map((tour) => (
              <ActivityCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}

        <Reveal>
          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:scale-105"
            >
              Plan my experience
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
