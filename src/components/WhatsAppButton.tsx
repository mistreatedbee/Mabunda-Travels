import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY } from '../lib/company';

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    const labelTimer = setTimeout(() => setShowLabel(true), 3500);
    const hideLabelTimer = setTimeout(() => setShowLabel(false), 10000);
    return () => {
      clearTimeout(timer);
      clearTimeout(labelTimer);
      clearTimeout(hideLabelTimer);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      {showLabel && (
        <div className="bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-2 relative animate-slide-in-right">
          <button
            onClick={() => setShowLabel(false)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-forest-800 text-white flex items-center justify-center hover:bg-forest-700"
          >
            <X size={12} />
          </button>
          <span className="text-sm text-forest-800 font-medium whitespace-nowrap">
            Need help planning your trip? Chat with us!
          </span>
        </div>
      )}
      <a
        href={COMPANY.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebd5d] shadow-2xl flex items-center justify-center transition-all hover:scale-110 relative"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <MessageCircle size={28} className="text-white relative" />
      </a>
    </div>
  );
}
