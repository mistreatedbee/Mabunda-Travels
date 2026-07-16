import { Star, MapPin, ArrowRight, Compass, Package, BedDouble, Users, Briefcase, Sparkles } from 'lucide-react';

const LODGES = [
  {
    name:     'Kruger National Park',
    location:  'Mpumalanga',
    rating:    4.9,
    image:     'https://images.pexels.com/photos/25754094/pexels-photo-25754094.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag:      'Wildlife',
  },
  {
    name:     'Blyde River Canyon',
    location:  'Mpumalanga',
    rating:    4.8,
    image:     'https://images.pexels.com/photos/20001418/pexels-photo-20001418.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag:      'Scenic',
  },
  {
    name:     "God's Window",
    location:  'Graskop',
    rating:    4.7,
    image:     'https://images.pexels.com/photos/5078889/pexels-photo-5078889.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag:      'Viewpoint',
  },
  {
    name:     'Sabie',
    location:  'Mpumalanga',
    rating:    4.6,
    image:     'https://images.pexels.com/photos/15201140/pexels-photo-15201140.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag:      'Town',
  },
  {
    name:     'Hazyview',
    location:  'Mpumalanga',
    rating:    4.7,
    image:     'https://images.pexels.com/photos/35447817/pexels-photo-35447817.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag:      'Gateway',
  },
  {
    name:     'Panorama Route',
    location:  'Mpumalanga',
    rating:    4.8,
    image:     'https://images.pexels.com/photos/36168134/pexels-photo-36168134.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag:      'Route',
  },
];

const SERVICES = [
  { icon: Compass,   title: 'Safari Experiences',     text: 'Wildlife tours & nature experiences in Kruger and surrounding reserves.' },
  { icon: Package,   title: 'Holiday Packages',         text: 'Family holidays, couple getaways & weekend escapes tailored to you.' },
  { icon: BedDouble, title: 'Accommodation Bookings',   text: 'Hotels, lodges & guesthouses — we find the perfect stay for every journey.' },
  { icon: Users,     title: 'Group Tours',              text: 'Organised travel for schools, churches, companies & social groups.' },
  { icon: Briefcase, title: 'Corporate Travel',         text: 'Business trips, transport & accommodation coordination for professionals.' },
  { icon: Sparkles,  title: 'Custom Trips',             text: 'Bespoke itineraries crafted around your interests, timeline & budget.' },
];

export default function LodgesSection() {
  return (
    <section id="lodges" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Popular destinations */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Popular Destinations</span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">
              Explore the beauty of Mpumalanga
            </h2>
          </div>
          <a href="#contact" className="group flex items-center gap-2 text-forest-700 hover:text-gold text-sm font-medium transition-colors">
            Explore all
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {LODGES.map((lodge) => (
            <div
              key={lodge.name}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={lodge.image}
                  alt={lodge.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/20 to-transparent" />
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Star size={13} className="text-gold fill-gold" />
                <span className="text-xs font-bold text-forest-900">{lodge.rating}</span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-gold/90 backdrop-blur-sm text-forest-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {lodge.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl font-semibold text-white mb-1">{lodge.name}</h3>
                <div className="flex items-center gap-1 text-white/70 text-sm">
                  <MapPin size={13} className="text-gold" />
                  {lodge.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services grid */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Our Services</span>
          <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">
            Travel experiences for every journey
          </h2>
          <p className="text-forest-600/70 text-base mt-4 leading-relaxed">
            From thrilling safari adventures to seamless corporate travel — we
            handle every detail so you can focus on the experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-forest-200 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-forest-100 group-hover:bg-gold flex items-center justify-center mb-4 transition-colors">
                <s.icon className="text-forest-700 group-hover:text-forest-900 transition-colors" size={22} />
              </div>
              <h3 className="font-display text-lg font-semibold text-forest-900 mb-2">{s.title}</h3>
              <p className="text-sm text-forest-600/70 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
