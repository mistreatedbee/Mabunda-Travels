import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, TreePine, Loader2, ZoomIn } from 'lucide-react';
import Reveal from './Reveal';
import { getPublishedDestinations } from '../lib/queries';
import type { Destination } from '../lib/types';

const STATS = [
  { label: 'Main Gates', value: '9' },
  { label: 'Total Area', value: '±19 633 km²' },
  { label: 'Animal Species', value: '147+' },
  { label: 'Private Reserves', value: '20+' },
];

const RESERVE_NAMES = [
  'Timbavati', 'Klaserie', 'Sabi Sand North', 'Sabi Sand South',
  'Manyeleti', 'Thornybush', 'Kapama', 'Balule', 'Umbabat',
];

export function MapImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  return (
    <figure className="group">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="relative block w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`View full size: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto object-contain bg-forest-50"
        />
        <span className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={14} aria-hidden="true" />
          Click to enlarge
        </span>
      </button>
      <figcaption className="mt-3 text-sm text-forest-600/70 text-center">{caption}</figcaption>

      {expanded && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setExpanded(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-full bg-white/10"
            onClick={() => setExpanded(false)}
          >
            Close
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </figure>
  );
}

export default function MapsSection() {
  const [destinations, setDestinations] = useState<Destination[] | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublishedDestinations().then((data) => { if (mounted) setDestinations(data); });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <section className="bg-forest-900 py-10" aria-label="Kruger National Park statistics">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl sm:text-4xl font-bold text-gold mb-1">{s.value}</div>
                <div className="text-white/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Kruger National Park map">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
              Kruger National Park
            </h2>
            <p className="text-forest-600/70 text-sm mb-6 max-w-2xl">
              The full park map showing main gates, rest camps, tar and gravel roads across all regions — from Pafuri in the north to Crocodile Bridge in the south.
            </p>
          </Reveal>
          <Reveal>
            <MapImage
              src="/maps/kruger-national-park.png"
              alt="Full map of Kruger National Park showing gates, camps and roads"
              caption="Kruger National Park — gates, rest camps and road network"
            />
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-gray-50" aria-label="Private game reserves map">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
              Private reserves &amp; Greater Kruger
            </h2>
            <p className="text-forest-600/70 text-sm mb-4 max-w-2xl">
              The private reserves along Kruger&apos;s western boundary share unfenced borders with the park, allowing wildlife to roam freely. Most lodges in these reserves include guided game drives and transfers.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {RESERVE_NAMES.map((name) => (
                <span
                  key={name}
                  className="inline-block bg-forest-100 text-forest-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <MapImage
              src="/maps/private-reserves.jpg"
              alt="Map of private game reserves bordering Kruger National Park including Timbavati, Klaserie, Sabi Sand, Manyeleti, Thornybush and Kapama"
              caption="Greater Kruger private reserves — Timbavati, Klaserie, Sabi Sand, Manyeleti, Thornybush, Kapama and more"
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white" aria-label="Private game reserves">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block bg-forest-100 text-forest-700 text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4">
                Surrounding Reserves
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mb-3">
                Private game reserves
              </h2>
              <p className="text-forest-500 max-w-xl mx-auto text-base">
                These exclusive reserves share unfenced borders with Kruger, allowing wildlife to roam freely while offering a more intimate experience.
              </p>
            </div>
          </Reveal>

          {destinations === null ? (
            <div className="flex justify-center py-12" role="status" aria-label="Loading destinations">
              <Loader2 size={28} className="animate-spin text-forest-400" aria-hidden="true" />
            </div>
          ) : destinations.length === 0 ? (
            <p className="text-center text-forest-500 text-sm">Destination details are coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <Reveal key={dest.id}>
                  <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      {dest.images[0]?.url ? (
                        <img
                          src={dest.images[0].url}
                          alt={dest.images[0].alt || dest.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-forest-100" aria-hidden="true" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {dest.tag && (
                        <span className="absolute top-3 right-3 bg-gold text-forest-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                          {dest.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {dest.stat_value && (
                        <div className="flex items-center gap-1.5 text-forest-500 text-xs mb-2">
                          <TreePine size={12} aria-hidden="true" />
                          <span>{dest.stat_label ? `${dest.stat_label}: ` : ''}{dest.stat_value}</span>
                        </div>
                      )}
                      <h3 className="font-display text-forest-900 font-semibold text-base mb-2 leading-snug">
                        {dest.name}
                      </h3>
                      <p className="text-forest-500 text-sm leading-relaxed flex-1">
                        {dest.description}
                      </p>
                      <Link
                        to={`/contact?service=${encodeURIComponent(dest.name)}`}
                        className="inline-flex items-center gap-1.5 mt-4 text-forest-700 hover:text-gold text-sm font-medium transition-colors"
                      >
                        Enquire about a transfer
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="bg-forest-50 rounded-3xl p-8 border border-forest-100 text-center">
              <MapPin size={32} className="text-forest-700 mx-auto mb-4" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold text-forest-900 mb-3">
                Not sure which reserve is right for you?
              </h2>
              <p className="text-forest-600/80 text-base leading-relaxed mb-6 max-w-xl mx-auto">
                We know these reserves intimately. Share your budget, travel dates and what matters most to you — and we will match you with the right experience and arrange your transfer.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-lg"
              >
                Ask for a recommendation
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
