import { Mail, Phone, MapPin, MessageCircle, Star } from 'lucide-react';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import BookingForm from '../components/BookingForm';
import FAQ from '../components/FAQ';
import Reveal from '../components/Reveal';
import { COMPANY } from '../lib/company';
import { useSettings } from '../lib/SettingsContext';

const CONTACT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Mabunda Travel & Tours',
  url: `${COMPANY.siteUrl}/contact`,
  mainEntity: {
    '@type': 'TravelAgency',
    name: COMPANY.name,
    telephone: COMPANY.phoneIntl,
    email: COMPANY.email,
  },
};

export default function Contact() {
  const { email, phone, phoneIntl, address, hours, whatsappLink, tripadvisorReviewUrl } = useSettings();
  return (
    <>
      <Seo
        title="Contact & Booking | Mabunda Travel & Tours"
        description="Book your safari or transfer with Mabunda Travel & Tours. Request a personalised quote via our enquiry form, WhatsApp or email — based in Acornhoek, Mpumalanga."
        path="/contact"
        jsonLd={CONTACT_JSONLD}
      />
      <PageHeader
        eyebrow="Contact & Booking"
        title="Plan your journey with us"
        subtitle="Fill in the form below and we will get back to you with a personalised quote. Prefer to chat? Reach us on WhatsApp or email."
      />

      <section className="py-20 sm:py-24 bg-white" id="enquire">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal>
                <div className="bg-forest-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" aria-hidden="true" />
                  <h2 className="font-display text-2xl font-bold mb-6 relative">Get in Touch</h2>
                  <div className="space-y-5 relative">
                    <a href={`mailto:${email}`} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                        <Mail size={20} className="group-hover:text-forest-900 transition-colors" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-xs text-white/50 uppercase tracking-wide">Email</div>
                        <div className="text-white font-medium break-all">{email}</div>
                      </div>
                    </a>
                    <a href={`tel:${phoneIntl}`} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                        <Phone size={20} className="group-hover:text-forest-900 transition-colors" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-xs text-white/50 uppercase tracking-wide">Phone</div>
                        <div className="text-white font-medium">{phone}</div>
                      </div>
                    </a>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-xs text-white/50 uppercase tracking-wide">Address</div>
                        <div className="text-white font-medium leading-snug">{address}</div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={whatsappLink("Hello Mabunda Travel & Tours, I'd like to enquire about a trip.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold py-3 rounded-xl transition-all relative"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Chat on WhatsApp
                  </a>

                  {tripadvisorReviewUrl && (
                    <a
                      href={tripadvisorReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 border border-white/25 hover:border-gold text-white hover:text-gold font-semibold py-3 rounded-xl transition-colors relative"
                    >
                      <Star size={18} aria-hidden="true" />
                      Leave us a Review
                    </a>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h2 className="font-display text-lg font-semibold text-forest-900 mb-3">Business Hours</h2>
                  <dl className="space-y-2 text-sm text-forest-600/80">
                    {hours.map((h) => (
                      <div key={h.days} className="flex justify-between">
                        <dt>{h.days}</dt>
                        <dd className="font-medium">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal delay={0.05}>
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <BookingForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Booking-related FAQs */}
      <section className="py-20 sm:py-24 bg-gray-50" aria-labelledby="contact-faq-heading">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Good to Know</span>
              <h2 id="contact-faq-heading" className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">
                Booking questions, answered
              </h2>
            </div>
          </Reveal>
          <FAQ showAbout={false} category="booking" />
        </div>
      </section>
    </>
  );
}
