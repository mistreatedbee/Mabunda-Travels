import { Shield, MapPin, Heart, Award } from 'lucide-react';

const ITEMS = [
  { icon: Shield,  label: 'Verified & Registered' },
  { icon: MapPin, label: 'Local Mpumalanga Expertise' },
  { icon: Heart,  label: 'Personalised Service' },
  { icon: Award,  label: 'Trusted Travel Partner' },
];

export default function TrustedBy() {
  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-forest-700">
              <item.icon size={20} className="text-olive" />
              <span className="text-sm font-medium tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
