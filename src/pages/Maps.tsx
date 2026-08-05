import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, TreePine } from 'lucide-react';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import Reveal from '../components/Reveal';
import { COMPANY } from '../lib/company';

const MAPS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Safari Maps — Kruger & Private Reserves | Mabunda Travel & Tours',
  url: `${COMPANY.siteUrl}/maps`,
  description: 'Interactive maps of Kruger National Park and the surrounding private game reserves in Mpumalanga and Limpopo.',
};

interface Reserve {
  name: string;
  tag: string;
  size: string;
  image: string;
  desc: string;
}

const RESERVES: Reserve[] = [
  {
    name: 'Timbavati Private Nature Reserve',
    tag: 'Big Five',
    size: '53 000 ha',
    image: 'https://images.pexels.com/photos/13142739/pexels-photo-13142739.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Famous for rare white lions, Timbavati shares an unfenced border with Kruger giving wildlife total freedom to roam across the ecosystem.',
  },
  {
    name: 'Klaserie Private Nature Reserve',
    tag: 'Big Five',
    size: '60 000 ha',
    image: 'https://images.pexels.com/photos/2739611/pexels-photo-2739611.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'One of the largest private reserves in South Africa, Klaserie offers an exclusive and authentic African bush experience with excellent predator sightings.',
  },
  {
    name: 'Sabi Sands Game Reserve (North)',
    tag: 'Luxury',
    size: 'Part of 65 000 ha',
    image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Home to some of the world\'s most celebrated game lodges, Sabi Sands North is known for reliable leopard sightings and world-class guiding.',
  },
  {
    name: 'Sabi Sands Game Reserve (South)',
    tag: 'Luxury',
    size: 'Part of 65 000 ha',
    image: 'https://images.pexels.com/photos/36168137/pexels-photo-36168137.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'The southern sector of Sabi Sands borders the Sabie River and delivers extraordinary lion and leopard encounters in magnificent riverine bush.',
  },
  {
    name: 'Manyeleti Game Reserve',
    tag: 'Hidden Gem',
    size: '23 000 ha',
    image: 'https://images.pexels.com/photos/3669639/pexels-photo-3669639.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'A quieter, more affordable alternative that adjoins Kruger and Sabi Sands — Manyeleti offers intimate Big Five game drives without the crowds.',
  },
  {
    name: 'Thornybush Game Reserve',
    tag: 'Big Five',
    size: '14 000 ha',
    image: 'https://images.pexels.com/photos/2133935/pexels-photo-2133935.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Nestled between Timbavati and the Blyde River, Thornybush is a malaria-free alternative offering Big Five sightings and luxurious accommodation.',
  },
  {
    name: 'Kapama Private Game Reserve',
    tag: 'Big Five',
    size: '13 000 ha',
    image: 'https://images.pexels.com/photos/20001418/pexels-photo-20001418.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Situated near Hoedspruit, Kapama is home to Buffalo Camp and river lodges, offering superb wildlife viewing with the added convenience of KMIA access.',
  },
];

const STATS = [
  { label: 'Main Gates', value: '9' },
  { label: 'Total Area', value: '±19 633 km²' },
  { label: 'Animal Species', value: '147+' },
  { label: 'Private Reserves', value: '20+' },
];

export default function Maps() {
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESERVES.map((reserve) => (
              <Reveal key={reserve.name}>
                <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={reserve.image}
                      alt={reserve.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 right-3 bg-gold text-forest-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                      {reserve.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-forest-500 text-xs mb-2">
                      <TreePine size={12} aria-hidden="true" />
                      <span>{reserve.size}</span>
                    </div>
                    <h3 className="font-display text-forest-900 font-semibold text-base mb-2 leading-snug">
                      {reserve.name}
                    </h3>
                    <p className="text-forest-500 text-sm leading-relaxed flex-1">
                      {reserve.desc}
                    </p>
                    <Link
                      to={`/contact?service=${encodeURIComponent(reserve.name)}`}
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
