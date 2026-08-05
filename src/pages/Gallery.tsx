import { Camera, MessageCircle } from 'lucide-react';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { COMPANY, whatsappLink } from '../lib/company';

const GALLERY_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Photo Gallery | Mabunda Travel & Tours',
  url: `${COMPANY.siteUrl}/gallery`,
  description: 'A collection of travel and safari photography from Mabunda Travel & Tours in Mpumalanga, South Africa. Coming soon.',
};

const PLACEHOLDER_IMAGES = [
  { label: 'Safari Game Drives',      bg: 'from-amber-900/60 to-amber-700/40' },
  { label: 'Panorama Route Views',    bg: 'from-sky-900/60 to-sky-700/40' },
  { label: 'Wildlife Encounters',     bg: 'from-green-900/60 to-green-700/40' },
  { label: 'Conservation Experiences', bg: 'from-stone-900/60 to-stone-700/40' },
  { label: 'Airport Transfers',       bg: 'from-slate-900/60 to-slate-700/40' },
  { label: 'Group Adventures',        bg: 'from-zinc-900/60 to-zinc-700/40' },
];

const shareUrl = whatsappLink('Hi Mabunda Travel & Tours! I would love to share my travel photos with you for your gallery.');

export default function Gallery() {
  return (
    <>
      <Seo
        title="Photo Gallery | Mabunda Travel & Tours"
        description="Safari and travel photography from Mabunda Travel & Tours — Mpumalanga's trusted transfer and tour specialists. Gallery coming soon."
        path="/gallery"
        jsonLd={GALLERY_JSONLD}
      />
      <PageHeader
        eyebrow="Gallery"
        title="Moments from the wild"
        subtitle="A visual journey through Mpumalanga's most extraordinary landscapes and wildlife encounters."
      />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          {/* Coming soon panel */}
          <Reveal>
            <div className="bg-forest-900 rounded-3xl p-10 sm:p-14 text-center text-white mb-14 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #E8943C 0%, transparent 60%)' }} aria-hidden="true" />
              <div className="relative">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera size={32} className="text-gold" aria-hidden="true" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                  Coming Soon
                </h2>
                <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
                  We're just getting started! Our gallery will soon showcase stunning imagery from Kruger safaris, Panorama Route adventures, wildlife encounters and memorable moments with our guests across Mpumalanga.
                </p>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-forest-900 font-semibold px-7 py-3 rounded-full transition-all hover:shadow-lg"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Share your photos with us
                </a>
              </div>
            </div>
          </Reveal>

          {/* Placeholder cards */}
          <p className="text-center text-forest-500 text-sm mb-8">A preview of the categories we'll be featuring:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLACEHOLDER_IMAGES.map((item) => (
              <Reveal key={item.label}>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} blur-sm`} aria-hidden="true" />
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Camera size={24} className="text-white/60 mx-auto mb-2" aria-hidden="true" />
                      <span className="text-white font-medium text-sm">{item.label}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
