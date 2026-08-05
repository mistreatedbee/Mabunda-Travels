import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '../lib/data';
import Reveal from './Reveal';

export default function LodgesSection() {
  return (
    <section id="services-overview" aria-label="Our services" className="py-20 bg-forest-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block bg-forest-100 text-forest-700 text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4">
              Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mb-3">
              How we can help you
            </h2>
            <p className="text-forest-500 max-w-xl mx-auto text-base">
              Whether you need a seamless airport transfer or a fully crafted safari adventure, we handle everything from first enquiry to final drop-off.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title}>
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center mb-4 group-hover:bg-gold transition-colors duration-300">
                    <Icon size={22} className="text-white" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-forest-900 font-semibold text-lg mb-2">
                    {service.title}
                  </h3>
                  <p className="text-forest-500 text-sm leading-relaxed flex-1">
                    {service.text}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 mt-4 text-forest-700 hover:text-gold text-sm font-medium transition-colors"
                  >
                    Learn more
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border-2 border-forest-800 text-forest-800 hover:bg-forest-800 hover:text-white font-semibold px-7 py-3 rounded-full transition-all"
            >
              View all services
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
