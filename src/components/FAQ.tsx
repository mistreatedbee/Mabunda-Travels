import { useState } from 'react';
import { Plus, Minus, Target, Eye, Heart } from 'lucide-react';

const FAQS = [
  {
    q: 'What types of tours do you offer?',
    a: 'We offer safari experiences, holiday packages, accommodation bookings, group tours, corporate travel, and fully custom trips — all tailored to your preferences and budget.',
  },
  {
    q: 'Can I customise a travel package?',
    a: 'Absolutely. Every package we offer is fully customisable. Tell us your interests, dates, and group size, and we will craft a personalised itinerary just for you.',
  },
  {
    q: 'How do I book a trip?',
    a: 'Simply fill out the enquiry form on this page or contact us via WhatsApp or phone. We will get back to you with a personalised quote and help you plan every detail.',
  },
  {
    q: 'Do you cater for group travel?',
    a: 'Yes — we organise travel for schools, churches, companies, and social groups. Group packages include coordinated transport, accommodation, and activities.',
  },
  {
    q: 'What areas do you cover?',
    a: 'We are based in Acornhoek, Mpumalanga and specialise in destinations across the region including Kruger National Park, the Panorama Route, Blyde River Canyon, Sabie, and Hazyview.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 2–4 weeks in advance for the best availability, especially during peak season. However, we will always do our best to accommodate last-minute requests.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: About + values */}
          <div className="lg:col-span-2">
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">About Us</span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 mb-5 leading-tight">
              Connecting travellers with extraordinary destinations
            </h2>
            <p className="text-forest-600/80 text-base leading-relaxed mb-4">
              Mabunda Travel & Tours creates memorable travel experiences by
              connecting travellers with beautiful destinations, cultural
              experiences, and personalised adventures across South Africa.
            </p>
            <p className="text-forest-600/70 text-sm leading-relaxed mb-8">
              Founded by Marvin Mabunda in May 2025, we are a registered private
              company based in Acornhoek, Mpumalanga — proudly serving holiday
              travellers, groups, and corporate clients.
            </p>

            <div className="space-y-4">
              {[
                { icon: Target, title: 'Our Mission', text: 'To provide reliable, memorable, and personalised travel experiences.' },
                { icon: Eye,    title: 'Our Vision',  text: 'To become a trusted travel partner connecting people with extraordinary destinations.' },
                { icon: Heart,  title: 'Our Values',  text: 'Customer satisfaction, trust, adventure, professionalism & authenticity.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-forest-700" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-forest-900 text-sm">{item.title}</h4>
                    <p className="text-sm text-forest-600/70 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ accordion */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-2xl sm:text-3xl text-forest-900 font-bold mb-6">
              Frequently asked questions
            </h3>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    open === i ? 'border-forest-200 shadow-md' : 'border-gray-100'
                  }`}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex items-center justify-between w-full p-5 text-left"
                  >
                    <span className="font-medium text-forest-900 text-sm sm:text-base">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-colors ${
                      open === i ? 'bg-gold text-forest-900' : 'bg-forest-50 text-forest-700'
                    }`}>
                      {open === i ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48' : 'max-h-0'}`}>
                    <p className="px-5 pb-5 text-sm text-forest-600/70 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
