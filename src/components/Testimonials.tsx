import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { getFeaturedTestimonials } from '../lib/queries';
import type { HomepageContentData } from '../lib/homepage';
import type { Testimonial } from '../lib/types';
import Reveal from './Reveal';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex text-gold" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? 'fill-gold' : 'text-white/20'} aria-hidden="true" />
      ))}
    </span>
  );
}

/**
 * Real customer testimonials, managed via the admin dashboard. Renders
 * nothing until there is at least one published+featured testimonial —
 * no placeholder or fabricated reviews.
 */
export default function Testimonials({ section }: { section: HomepageContentData['testimonials'] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    let mounted = true;
    getFeaturedTestimonials().then((data) => { if (mounted) setTestimonials(data); });
    return () => { mounted = false; };
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section aria-label="Customer testimonials" className="py-20 bg-forest-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block bg-white/10 text-gold text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4">
              {section.eyebrow}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              {section.title}
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Reveal key={t.id}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                <Quote size={22} className="text-gold/50 mb-3" aria-hidden="true" />
                <Stars rating={t.rating} />
                <p className="text-white/80 text-sm leading-relaxed my-4 flex-1">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {t.photo_url && (
                    <img src={t.photo_url} alt="" className="w-9 h-9 rounded-full object-cover" loading="lazy" />
                  )}
                  <div>
                    <div className="text-white text-sm font-medium">{t.customer_name}</div>
                    {(t.customer_location || t.source) && (
                      <div className="text-white/40 text-xs">
                        {[t.customer_location, t.source ? `via ${t.source}` : null].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
