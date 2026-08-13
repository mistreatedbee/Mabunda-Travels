import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Target, Eye, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { KRUGER_GATES } from '../lib/data';
import { getPublishedFaqs } from '../lib/queries';
import type { Faq } from '../lib/types';

interface FAQProps {
  /** Which FAQ category to show — omit for all published FAQs. */
  category?: Faq['category'];
  showAbout?: boolean;
}

function KrugerGateTimes() {
  return (
    <div className="mt-10">
      <h3 className="font-display text-xl font-bold text-forest-900 mb-2">
        Kruger National Park — Gate Opening Times
      </h3>
      <p className="text-sm text-forest-600/70 mb-4">
        All times are approximate. Always confirm with SANParks before your visit as times may change seasonally.
      </p>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-forest-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-forest-800 text-white">
              <th className="text-left px-4 py-3 font-semibold rounded-tl-2xl">Gate</th>
              <th className="text-left px-4 py-3 font-semibold">Location</th>
              <th className="text-left px-4 py-3 font-semibold">Opens</th>
              <th className="text-left px-4 py-3 font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                  Summer Close
                </span>
              </th>
              <th className="text-left px-4 py-3 font-semibold rounded-tr-2xl">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
                  Winter Close
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {KRUGER_GATES.map((gate, i) => (
              <tr
                key={gate.name}
                className={`border-t border-forest-50 ${i % 2 === 0 ? 'bg-white' : 'bg-forest-50/50'}`}
              >
                <td className="px-4 py-3 font-medium text-forest-900">
                  {gate.name}
                  {gate.note && (
                    <span className="block text-[11px] text-forest-500 font-normal mt-0.5">{gate.note}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-forest-600">{gate.location}</td>
                <td className="px-4 py-3 text-forest-700 font-medium">{gate.opens}</td>
                <td className="px-4 py-3">
                  <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {gate.closeSummer}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {gate.closeWinter}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {KRUGER_GATES.map((gate) => (
          <div key={gate.name} className="bg-white rounded-2xl border border-forest-100 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-forest-900 text-sm">{gate.name}</p>
                <p className="text-forest-500 text-xs">{gate.location}</p>
                {gate.note && <p className="text-forest-400 text-[11px] mt-0.5">{gate.note}</p>}
              </div>
              <span className="text-forest-700 text-xs font-medium bg-forest-50 px-2 py-1 rounded-full">
                Opens {gate.opens}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                ☀ Summer closes {gate.closeSummer}
              </span>
              <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                ❄ Winter closes {gate.closeWinter}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-forest-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          Summer: October – March
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400" aria-hidden="true" />
          Winter: April – September
        </span>
      </div>
    </div>
  );
}

export default function FAQ({ category, showAbout = true }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);
  const [items, setItems] = useState<Faq[] | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublishedFaqs(category).then((data) => { if (mounted) setItems(data); });
    return () => { mounted = false; };
  }, [category]);

  const accordion = items === null ? (
    <div className="flex justify-center py-10" role="status" aria-label="Loading FAQs">
      <Loader2 size={24} className="animate-spin text-forest-400" aria-hidden="true" />
    </div>
  ) : items.length === 0 ? null : (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <div
          key={faq.id}
          className={`bg-white rounded-2xl border transition-all duration-300 ${
            open === i ? 'border-forest-200 shadow-md' : 'border-gray-100'
          }`}
        >
          <h3>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex items-center justify-between w-full p-5 text-left"
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
            >
              <span className="font-medium text-forest-900 text-sm sm:text-base">{faq.question}</span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-colors ${
                  open === i ? 'bg-gold text-forest-900' : 'bg-forest-50 text-forest-700'
                }`}
                aria-hidden="true"
              >
                {open === i ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>
          </h3>
          <div
            id={`faq-panel-${i}`}
            role="region"
            aria-labelledby={`faq-button-${i}`}
            className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-56' : 'max-h-0'}`}
          >
            <p className="px-5 pb-5 text-sm text-forest-600/70 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  if (!showAbout) {
    return accordion;
  }

  return (
    <section id="faq" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: About + values + gate times */}
          <div className="lg:col-span-2">
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">About Us</span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 mb-5 leading-tight">
              Connecting travellers with extraordinary destinations
            </h2>
            <p className="text-forest-600/80 text-base leading-relaxed mb-4">
              Mabunda Travel &amp; Tours creates memorable travel experiences by
              connecting travellers with beautiful destinations, cultural
              experiences, and personalised adventures across South Africa.
            </p>
            <p className="text-forest-600/70 text-sm leading-relaxed mb-6">
              Founded by Marvin Mabunda in May 2025, we are a registered private
              company based in Acornhoek, Mpumalanga — proudly serving holiday
              travellers, groups, and corporate clients.
            </p>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-forest-700 hover:text-gold text-sm font-semibold transition-colors mb-8"
            >
              Learn more about us
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>

            <div className="space-y-4 mb-6">
              {[
                { icon: Target, title: 'Our Mission', text: 'To provide reliable, memorable, and personalised travel experiences.' },
                { icon: Eye,    title: 'Our Vision',  text: 'To become a trusted travel partner connecting people with extraordinary destinations.' },
                { icon: Heart,  title: 'Our Values',  text: 'Customer satisfaction, trust, adventure, professionalism & authenticity.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-forest-700" size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-900 text-sm">{item.title}</h3>
                    <p className="text-sm text-forest-600/70 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <KrugerGateTimes />
          </div>

          {/* Right: FAQ accordion */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl sm:text-3xl text-forest-900 font-bold mb-6">
              Frequently asked questions
            </h2>
            {accordion}
          </div>
        </div>
      </div>
    </section>
  );
}
