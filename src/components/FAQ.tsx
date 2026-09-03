import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Target, Eye, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { KRUGER_GATE_MONTHS, KRUGER_MONTHLY_GATES } from '../lib/data';
import { getPublishedFaqs } from '../lib/queries';
import type { HomepageFaqIntro } from '../lib/homepage';
import type { Faq } from '../lib/types';
import FaqAnswer from './FaqAnswer';

interface FAQProps {
  /** Which FAQ category to show — omit for all published FAQs. */
  category?: Faq['category'];
  showAbout?: boolean;
  /** Homepage-managed intro copy for the left column. */
  intro?: HomepageFaqIntro;
}

function KrugerGateTimes() {
  return (
    <div className="mt-10">
      <h3 className="font-display text-xl font-bold text-forest-900 mb-2">
        Kruger National Park — Gate Times
      </h3>
      <p className="text-sm text-forest-600/70 mb-4">
        You must be inside your camp or out of the gate before closing time. Late arrival may result in a fine. Always confirm with SANParks before your visit.
      </p>

      {/* Desktop monthly table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-forest-100 shadow-sm">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-forest-800 text-white">
              <th className="text-left px-3 py-3 font-semibold rounded-tl-2xl sticky left-0 bg-forest-800 min-w-[140px]">
                Gate Times
              </th>
              {KRUGER_GATE_MONTHS.map((month) => (
                <th key={month} className="px-2 py-3 font-semibold text-center min-w-[52px]">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KRUGER_MONTHLY_GATES.map((row, i) => (
              <tr
                key={row.label}
                className={`border-t border-forest-50 ${i % 2 === 0 ? 'bg-white' : 'bg-forest-50/50'}`}
              >
                <td className="px-3 py-3 font-medium text-forest-900 sticky left-0 bg-inherit">
                  {row.label}
                </td>
                {row.times.map((time, j) => (
                  <td key={j} className="px-2 py-3 text-center text-forest-700 font-medium">
                    {time}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — stacked by row */}
      <div className="md:hidden space-y-4">
        {KRUGER_MONTHLY_GATES.map((row) => (
          <div key={row.label} className="bg-white rounded-2xl border border-forest-100 p-4 shadow-sm">
            <p className="font-semibold text-forest-900 text-sm mb-3">{row.label}</p>
            <div className="grid grid-cols-4 gap-2">
              {KRUGER_GATE_MONTHS.map((month, i) => (
                <div key={month} className="text-center">
                  <div className="text-[10px] text-forest-500 uppercase">{month}</div>
                  <div className="text-xs font-semibold text-forest-800">{row.times[i]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQ({ category, showAbout = true, intro }: FAQProps) {
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
            className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-[600px]' : 'max-h-0'}`}
          >
            <FaqAnswer text={faq.answer} />
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
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">{intro?.eyebrow ?? 'About Us'}</span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 mb-5 leading-tight">
              {intro?.title ?? 'Connecting travellers with extraordinary destinations'}
            </h2>
            <p className="text-forest-600/80 text-base leading-relaxed mb-4">
              {intro?.description ?? 'Mabunda Travel & Tours creates memorable travel experiences by connecting travellers with beautiful destinations, cultural experiences, and personalised adventures across South Africa.'}
            </p>
            <p className="text-forest-600/70 text-sm leading-relaxed mb-6">
              {intro?.about_paragraph_2 ??
                'Founded by Marvin Mabunda in May 2025, we are a registered private company based in Acornhoek, Mpumalanga — proudly serving holiday travellers, groups, and corporate clients.'}
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
