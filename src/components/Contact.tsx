import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { COMPANY } from '../lib/company';

const DESTINATION_OPTIONS = [
  'Kruger National Park',
  'Blyde River Canyon',
  "God's Window",
  'Mpumalanga Panorama Route',
  'Sabie',
  'Hazyview',
  'Other / Not sure yet',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    travel_date: '',
    num_travellers: '',
    destination: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      travel_date: form.travel_date || null,
      num_travellers: form.num_travellers ? parseInt(form.num_travellers, 10) : null,
      destination: form.destination || null,
      message: form.message.trim() || null,
    };

    const { error } = await supabase.from('bookings').insert(payload);

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong submitting your enquiry. Please try again or contact us on WhatsApp.');
      return;
    }

    setStatus('success');
    setForm({ full_name: '', email: '', phone: '', travel_date: '', num_travellers: '', destination: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Contact &amp; Booking</span>
          <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 mb-4 leading-tight">
            Plan your journey with us
          </h2>
          <p className="text-forest-600/70 text-base leading-relaxed">
            Fill in the form below and we will get back to you with a personalised
            quote. Prefer to chat? Reach us on WhatsApp or phone.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-forest-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
              <h3 className="font-display text-2xl font-bold mb-6 relative">Get in Touch</h3>
              <div className="space-y-5 relative">
                <a href={`tel:${COMPANY.phone}`} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                    <Phone size={20} className="group-hover:text-forest-900 transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wide">Phone</div>
                    <div className="text-white font-medium">{COMPANY.phone}</div>
                  </div>
                </a>
                <a href={`mailto:${COMPANY.email}`} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                    <Mail size={20} className="group-hover:text-forest-900 transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wide">Email</div>
                    <div className="text-white font-medium break-all">{COMPANY.email}</div>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wide">Address</div>
                    <div className="text-white font-medium leading-snug">{COMPANY.address}</div>
                  </div>
                </div>
              </div>

              <a
                href={COMPANY.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold py-3 rounded-xl transition-all relative"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h4 className="font-display text-lg font-semibold text-forest-900 mb-3">Business Hours</h4>
              <div className="space-y-2 text-sm text-forest-600/80">
                <div className="flex justify-between"><span>Mon – Fri</span><span className="font-medium">08:00 – 17:00</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-medium">08:00 – 13:00</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="font-medium">By appointment</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mb-6">
                    <CheckCircle className="text-forest-700" size={40} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-forest-900 mb-3">Enquiry Submitted!</h3>
                  <p className="text-forest-600/70 max-w-md mb-8">
                    Thank you for choosing Mabunda Travel & Tours. We will get back
                    to you shortly with your personalised quote.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="bg-forest-800 hover:bg-forest-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-forest-800 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        required
                        value={form.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900 placeholder-forest-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-800 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900 placeholder-forest-300"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-forest-800 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900 placeholder-forest-300"
                        placeholder="070 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-800 mb-2">Travel Date</label>
                      <input
                        type="date"
                        name="travel_date"
                        value={form.travel_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-forest-800 mb-2">Number of Travellers</label>
                      <input
                        type="number"
                        name="num_travellers"
                        min="1"
                        value={form.num_travellers}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900 placeholder-forest-300"
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-800 mb-2">Destination Preference</label>
                      <select
                        name="destination"
                        value={form.destination}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900"
                      >
                        <option value="">Select a destination</option>
                        {DESTINATION_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-800 mb-2">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900 placeholder-forest-300 resize-none"
                      placeholder="Tell us about your ideal trip — interests, budget, special requests..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                      <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{errorMsg}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-forest-900 font-semibold py-4 rounded-xl text-base transition-all hover:shadow-lg"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Request a Quote
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
