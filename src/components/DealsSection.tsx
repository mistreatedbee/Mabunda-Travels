import { ArrowRight, Clock, MapPin } from 'lucide-react';

const DEALS = [
  {
    title:       'Kruger Safari Adventure',
    location:     'Kruger National Park',
    duration:    '3 Days / 2 Nights',
    image:        'https://images.pexels.com/photos/13142739/pexels-photo-13142739.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge:       'Best Seller',
    desc:        'Game drives, bush walks & sunset safaris in the heart of Big Five country.',
  },
  {
    title:       'Panorama Route Explorer',
    location:    "Blyde River Canyon & God's Window",
    duration:    '2 Days / 1 Night',
    image:        'https://images.pexels.com/photos/36168137/pexels-photo-36168137.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge:       'Scenic',
    desc:        'Dramatic canyon views, waterfall visits & historic towns along the route.',
  },
  {
    title:       'Weekend Escape Package',
    location:    'Hazyview & Surrounds',
    duration:    '2 Days / 1 Night',
    image:        'https://images.pexels.com/photos/17831034/pexels-photo-17831034.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge:       'Relaxing',
    desc:        'Nature trails, river activities & local cuisine for a perfect quick getaway.',
  },
  {
    title:       'Group Wildlife Tour',
    location:    'Kruger & Mpumalanga',
    duration:    '4 Days / 3 Nights',
    image:        'https://images.pexels.com/photos/25754110/pexels-photo-25754110.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge:       'Groups',
    desc:        'Group game drives, cultural village visits & team activities for schools & churches.',
  },
];

export default function DealsSection() {
  return (
    <section id="deals" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Travel Deals</span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">
              Featured packages &amp; experiences
            </h2>
          </div>
          <a href="#contact" className="group flex items-center gap-2 text-forest-700 hover:text-gold text-sm font-medium transition-colors">
            View all packages
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEALS.map((deal) => (
            <div
              key={deal.title}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute top-3 left-3 bg-gold text-forest-900 text-xs font-bold px-3 py-1.5 rounded-full">
                  {deal.badge}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-forest-900 mb-2 leading-snug">
                  {deal.title}
                </h3>
                <div className="flex items-center gap-3 mb-3 text-xs text-forest-600">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-olive" />
                    {deal.location}
                  </span>
                </div>
                <p className="text-sm text-forest-600/70 leading-relaxed mb-4 line-clamp-2">
                  {deal.desc}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-xs text-forest-700 font-medium">
                    <Clock size={13} className="text-olive" />
                    {deal.duration}
                  </span>
                  <a
                    href="#contact"
                    className="text-gold hover:text-gold-dark text-sm font-semibold transition-colors"
                  >
                    Enquire →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
