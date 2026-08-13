import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, TreePine, Loader2 } from 'lucide-react';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import Reveal from '../components/Reveal';
import { COMPANY } from '../lib/company';
import { getPublishedDestinations } from '../lib/queries';
import type { Destination } from '../lib/types';

const MAPS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Safari Maps — Kruger & Private Reserves | Mabunda Travel & Tours',
  url: `${COMPANY.siteUrl}/maps`,
  description: 'Interactive maps of Kruger National Park and the surrounding private game reserves in Mpumalanga and Limpopo.',
};

const STATS = [
  { label: 'Main Gates', value: '9' },
  { label: 'Total Area', value: '±19 633 km²' },
  { label: 'Animal Species', value: '147+' },
  { label: 'Private Reserves', value: '20+' },
];

export default function Maps() {
  const [destinations, setDestinations] = useState<Destination[] | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublishedDestinations().then((data) => { if (mounted) setDestinations(data); });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Seo
        title="Safari Maps — Kruger & Private Reserves | Mabunda Travel & Tours"
        description="Interactive maps of Kruger National Park and the surrounding private game reserves. Plan your safari with Mabunda Travel & Tours — Mpumalanga's local transfer experts."
        path="/maps"
        jsonLd={MAPS_JSONLD}
      />
      <PageHeader
        eyebrow="Safari Maps"
        title="Kruger &amp; the private reserves"
        subtitle="Everything you need to know about Africa's most iconic wildlife destination — and the exclusive private reserves that surround it."
        image="https://images.pexels.com/photos/30878973/pexels-photo-30878973.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* Stats bar */}
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

      {/* Map embed */}
      <section className="py-16 bg-white" aria-label="Kruger National Park map">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
              Kruger National Park
            </h2>
            <p className="text-forest-600/70 text-sm mb-6 max-w-2xl">
              Use the map below to explore the park boundaries, main gates, rest camps and surrounding private reserves.
            </p>
          </Reveal>
          <Reveal>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <iframe
                title="Kruger National Park map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1847020.0!2d30.5!3d-23.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ec549e5bade0b7f%3A0x0!2sKruger+National+Park!5e0!3m2!1sen!2sza!4v1699000000000!5m2!1sen!2sza"
                width="100%"
                height="480"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Private reserves grid */}
      <section className="py-20 bg-gray-50" aria-label="Private game reserves">
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
                  <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
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

      {/* Helper panel */}
      <section className="py-16 bg-white">
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

      <CTASection />
    </>
  );
}
