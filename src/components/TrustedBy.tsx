import { Shield, MapPin, Heart, Award } from 'lucide-react';

const ICONS = [Shield, MapPin, Heart, Award] as const;

interface TrustedByProps {
  labels?: string[];
}

const DEFAULT_LABELS = [
  'Verified & Registered',
  'Local Mpumalanga Expertise',
  'Personalised Service',
  'Trusted Travel Partner',
];

export default function TrustedBy({ labels = DEFAULT_LABELS }: TrustedByProps) {
  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {labels.map((label, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={`${label}-${i}`} className="flex items-center gap-2.5 text-forest-700">
                <Icon size={20} className="text-olive" aria-hidden="true" />
                <span className="text-sm font-medium tracking-wide">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
