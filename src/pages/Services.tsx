import { Link } from 'react-router-dom';
import { Check, MessageSquareText, FileText, Plane } from 'lucide-react';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import Reveal from '../components/Reveal';
import { SERVICES } from '../lib/data';

const STEPS = [
  {
    icon: MessageSquareText,
    title: '1. Tell us your dream',
    text: 'Send an enquiry through our form, WhatsApp or email. Share your dates, group size, interests and budget.',
  },
  {
    icon: FileText,
    title: '2. Get your quote',
    text: 'We craft a personalised itinerary with a detailed, obligation-free quote — usually within one business day.',
  },
  {
    icon: Plane,
    title: '3. Travel with confidence',
    text: 'Confirm with a deposit and we handle the rest. You get one contact person from booking to home-coming.',
  },
];

export default function Services() {
  return (
    <>
      <Seo
        title="Our Services | Mabunda Travel & Tours"
        description="Safari experiences, group tours, corporate transfers and custom trips — travel services from Mabunda Travel & Tours, Acornhoek, Mpumalanga."
        path="/services"
      />
      <PageHeader
        eyebrow="Our Services"
        title="Travel experiences for every journey"
        subtitle="From thrilling safari adventures to seamless transfers — we handle every detail so you can focus on the experience."
      />

      {/* Service details */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-16">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title}>
              <article
                id={service.title.toLowerCase().replace(/[^a-z]+/g, '-')}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
              >
                <div className="md:[direction:ltr]">
                  <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center mb-5">
                    <service.icon className="text-forest-700" size={26} aria-hidden="true" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl text-forest-900 font-bold mb-4 leading-tight">
                    {service.title}
                  </h2>
                  <p className="text-forest-600/80 leading-relaxed mb-6">{service.detail}</p>
                  <Link
                    to={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all hover:shadow-lg"
                  >
                    Enquire about {service.title}
                  </Link>
                </div>
                <ul className="md:[direction:ltr] bg-gray-50 rounded-3xl border border-gray-100 p-7 space-y-4">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={14} className="text-gold-dark" aria-hidden="true" />
                      </span>
                      <span className="text-sm text-forest-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">How It Works</span>
              <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">
                From enquiry to adventure in three steps
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-forest-900 flex items-center justify-center mx-auto mb-5">
                    <step.icon className="text-gold" size={24} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-forest-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-forest-600/70 leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
