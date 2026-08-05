import { Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home, FileText, PhoneCall } from 'lucide-react';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { COMPANY } from '../lib/company';

const NEXT_STEPS = [
  {
    icon: FileText,
    title: 'We review your enquiry',
    text: 'One of our travel planners reads every detail you sent — dates, group size, interests and budget.',
  },
  {
    icon: PhoneCall,
    title: 'We contact you with a quote',
    text: 'Usually within one business day you will receive a personalised itinerary and an obligation-free quote.',
  },
  {
    icon: CheckCircle,
    title: 'You confirm, we arrange',
    text: 'Happy with the plan? Confirm with a deposit and we handle every booking, ticket and reservation.',
  },
];

export default function BookingSuccess() {
  return (
    <>
      <Seo
        title="Enquiry Received | Mabunda Travel & Tours"
        description="Thank you for your enquiry. Mabunda Travel & Tours will contact you shortly with a personalised quote."
        path="/booking-success"
        noindex
      />
      <section className="relative bg-forest-900 pt-40 pb-24 sm:pt-48 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <Reveal>
            <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-7 shadow-xl">
              <CheckCircle className="text-forest-900" size={40} aria-hidden="true" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white font-bold leading-tight mb-4">
              Enquiry submitted!
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Thank you for choosing {COMPANY.name}. Your journey has officially begun —
              here is what happens next.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-14">
            {NEXT_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-forest-900 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="text-gold" size={22} aria-hidden="true" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-forest-900 mb-2">{step.title}</h2>
                  <p className="text-sm text-forest-600/70 leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center">
              <p className="text-forest-600/80 mb-7">
                In a hurry? Chat with us directly — we're happy to help right away.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={COMPANY.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-lg"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Chat on WhatsApp
                </a>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 border border-forest-200 hover:border-gold text-forest-800 hover:text-gold-dark font-semibold px-7 py-3.5 rounded-full transition-colors"
                >
                  <Home size={18} aria-hidden="true" />
                  Back to Home
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
