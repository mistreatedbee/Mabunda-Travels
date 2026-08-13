import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (guests) params.set('guests', guests);
    const query = params.toString();
    navigate(`/contact${query ? `?${query}` : ''}#enquire`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="home" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/30878973/pexels-photo-30878973.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="African savanna at golden sunset with acacia trees"
          className="w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent z-[1]" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center pt-32 pb-24">

        {/* Logo — shown in full (not cropped into a circle) so the emblem and wordmark both stay legible */}
        <div className="mx-auto mb-6 w-36 sm:w-44 bg-white rounded-3xl shadow-2xl ring-4 ring-white/10 p-2.5 animate-fade-in">
          <img
            src="/logo.jpeg"
            alt="Mabunda Travel & Tours logo"
            width="746"
            height="741"
            className="w-full h-auto rounded-2xl"
          />
        </div>

        {/* Location chip */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <Sparkles size={13} className="text-gold" aria-hidden="true" />
          <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
            Mpumalanga, South Africa
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white font-bold leading-[1.08] mb-5 animate-fade-in-up">
          Explore the wild heart of
          <br />
          <span className="text-gold">South Africa</span>
        </h1>

        <p
          className="text-white/85 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.12s' }}
        >
          Safari tours, personalised adventures and seamless transfers with
          Mabunda Travel &amp; Tours — your trusted travel partner in Mpumalanga.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-2xl p-2 sm:p-3 max-w-xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.24s' }}
          aria-label="Plan your trip"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            {/* Date */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-50 transition-colors text-left">
              <Calendar size={18} className="text-forest-600 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <label htmlFor="hero-date" className="block text-[11px] font-semibold text-forest-800 uppercase tracking-wide">When</label>
                <input
                  id="hero-date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm text-forest-900 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="hidden sm:block w-px bg-gray-200 my-2" aria-hidden="true" />

            {/* Guests */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-50 transition-colors text-left">
              <Users size={18} className="text-forest-600 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <label htmlFor="hero-guests" className="block text-[11px] font-semibold text-forest-800 uppercase tracking-wide">Travellers</label>
                <input
                  id="hero-guests"
                  type="number"
                  min="1"
                  max="99"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="How many?"
                  className="w-full text-sm text-forest-900 placeholder-forest-300 outline-none bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg"
              aria-label="Start planning this trip"
            >
              <ArrowRight size={18} aria-hidden="true" />
              <span>Plan Trip</span>
            </button>
          </div>
        </form>

        {/* Quick stats */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/70 text-sm animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
            Personalised Service
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
            Local Expertise
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
            Verified &amp; Registered
          </span>
        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-2 mt-10 text-white/80 hover:text-gold text-sm font-medium transition-colors animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          Discover our services
          <ArrowRight size={16} className="animate-bounce" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
