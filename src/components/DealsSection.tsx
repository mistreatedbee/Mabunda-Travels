import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Smartphone } from 'lucide-react';
import { ACTIVITIES, type Activity } from '../lib/data';
import Reveal from './Reveal';

function ActivityCard({ activity }: { activity: Activity }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Reveal>
      <article
        className="activity-card h-80 rounded-2xl overflow-hidden cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f); }}
        tabIndex={0}
        aria-label={`${activity.title} — tap to learn more`}
        role="button"
        aria-pressed={flipped}
      >
        <div className={`activity-card-inner w-full h-full${flipped ? ' flipped' : ''}`}>

          {/* Front face */}
          <div className="activity-card-face activity-card-front rounded-2xl">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
              loading="lazy"
              width="400"
              height="320"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <span className="absolute top-4 right-4 bg-gold text-forest-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
              {activity.tag}
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5">
                <MapPin size={12} aria-hidden="true" />
                <span>{activity.location}</span>
              </div>
              <h3 className="font-display text-white font-semibold text-lg leading-snug mb-2">
                {activity.title}
              </h3>
              <p className="text-white/75 text-xs line-clamp-2">{activity.desc}</p>

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
              <span className="inline-block bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3">
                {activity.tag}
              </span>
              <h3 className="font-display text-white font-bold text-lg leading-snug mb-3">
                {activity.title}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed line-clamp-5">
                {activity.longDesc}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <MapPin size={13} className="text-gold flex-shrink-0" aria-hidden="true" />
              <span className="text-white/60 text-xs">{activity.location}</span>
            </div>
          </div>

        </div>
      </article>
    </Reveal>
  );
}

export default function DealsSection() {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ACTIVITIES.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </div>

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
