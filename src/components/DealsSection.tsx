import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, X, Loader2 } from 'lucide-react';
import { getPublishedTours } from '../lib/queries';
import type { HomepageExperiences } from '../lib/homepage';
import type { Tour } from '../lib/types';
import Reveal from './Reveal';

function ActivityDetailModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const image = tour.images[0]?.url;
  const description = tour.full_description || tour.short_description;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="activity-modal-title">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full sm:max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-20"
          aria-label="Close"
        >
          <X size={18} aria-hidden="true" />
        </button>
        {image && (
          <div className="relative h-48 sm:h-56 flex-shrink-0">
            <img src={image} alt={tour.images[0]?.alt || tour.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 id="activity-modal-title" className="font-display text-xl font-bold text-forest-900 leading-snug mb-3 pr-10">
            {tour.name}
          </h3>
          {tour.destination?.name && (
            <div className="flex items-center gap-1.5 text-forest-500 text-sm mb-4">
              <MapPin size={14} className="text-olive flex-shrink-0" aria-hidden="true" />
              <span>{tour.destination.name}</span>
            </div>
          )}
          <p className="text-forest-600/90 text-sm leading-relaxed whitespace-pre-line">{description}</p>
        </div>
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50">
          <Link
            to={`/contact?service=${encodeURIComponent(tour.name)}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-dark text-forest-900 font-semibold py-3 rounded-xl transition-colors"
          >
            Enquire about this experience
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ tour, onOpen }: { tour: Tour; onOpen: () => void }) {
  const image = tour.images[0]?.url;

  return (
    <Reveal>
      <article
        className="activity-card h-80 rounded-2xl overflow-hidden cursor-pointer select-none"
        onClick={onOpen}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
        tabIndex={0}
        aria-label={`${tour.name} — click for full details`}
        role="button"
      >
        <div className="activity-card-inner w-full h-full">

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

              <span className="flex items-center gap-1.5 mt-3 text-gold text-[10px] font-semibold uppercase tracking-wide">
                <span className="hidden sm:inline">Hover for preview · </span>
                Click for full details
                <ArrowRight size={10} aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Back face — scrollable full description on hover (desktop) */}
          <div className="activity-card-face activity-card-back rounded-2xl bg-forest-900 p-5 flex flex-col min-h-0">
            <h3 className="font-display text-white font-bold text-base leading-snug mb-2 flex-shrink-0">
              {tour.name}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed flex-1 min-h-0">
              {tour.full_description || tour.short_description}
            </p>
            <p className="text-gold/80 text-[10px] font-semibold uppercase tracking-wide mt-3 flex-shrink-0 pt-2 border-t border-white/10">
              Click for full details
            </p>
          </div>

        </div>
      </article>
    </Reveal>
  );
}

export default function DealsSection({ section }: { section: HomepageExperiences }) {
  const [tours, setTours] = useState<Tour[] | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublishedTours().then((data) => { if (mounted) setTours(data); });
    return () => { mounted = false; };
  }, []);

  if (tours !== null && tours.length === 0) return null;

  return (
    <section id="experiences" aria-label="Experiences and activities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block bg-forest-50 text-forest-700 text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4">
              {section.eyebrow}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mb-3">
              {section.title}
            </h2>
            <p className="text-forest-500 max-w-xl mx-auto text-base">
              {section.description}
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
              <ActivityCard key={tour.id} tour={tour} onOpen={() => setSelectedTour(tour)} />
            ))}
          </div>
        )}

        <Reveal>
          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:scale-105"
            >
              {section.cta_text}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

      </div>

      {selectedTour && (
        <ActivityDetailModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}
    </section>
  );
}
