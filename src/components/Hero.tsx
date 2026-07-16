import { useState } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

export default function Hero() {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');

  return (
    <section id="home" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/30878973/pexels-photo-30878973.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="African savanna sunset with acacia trees"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center pt-28 pb-20">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <MapPin size={14} className="text-gold" />
          <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
            Mpumalanga, South Africa
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white font-bold leading-[1.1] mb-5 animate-fade-in-up">
          Explore the beauty of
          <br />
          <span className="text-gold">South Africa</span>
        </h1>

        <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
          Safari tours, holiday packages, and personalised adventures with
          Mabunda Travel & Tours — your trusted travel partner in Mpumalanga.
        </p>

        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-3 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.24s' }}>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            {/* Destination */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-50 transition-colors text-left">
              <MapPin size={18} className="text-forest-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold text-forest-800 uppercase tracking-wide">Where to</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Kruger, Panorama Route..."
                  className="w-full text-sm text-forest-900 placeholder-forest-300 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="hidden sm:block w-px bg-gray-200 my-2" />

            {/* Date */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-50 transition-colors text-left">
              <Calendar size={18} className="text-forest-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold text-forest-800 uppercase tracking-wide">When</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm text-forest-900 placeholder-forest-300 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="hidden sm:block w-px bg-gray-200 my-2" />

            {/* Guests */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-50 transition-colors text-left">
              <Users size={18} className="text-forest-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold text-forest-800 uppercase tracking-wide">Guests</label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="2 travellers"
                  className="w-full text-sm text-forest-900 placeholder-forest-300 outline-none bg-transparent"
                />
              </div>
            </div>

            <a
              href="#deals"
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg sm:px-5"
            >
              <Search size={18} />
              <span className="sm:hidden">Search</span>
            </a>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/70 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold" /> 6+ Destinations</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold" /> Personalised Service</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold" /> Local Expertise</span>
        </div>

        <a href="#deals" className="inline-flex items-center gap-2 mt-10 text-white/80 hover:text-gold text-sm font-medium transition-colors animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Browse deals
          <ArrowRight size={16} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
