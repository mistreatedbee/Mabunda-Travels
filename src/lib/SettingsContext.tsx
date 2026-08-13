import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSettings } from './queries';
import { COMPANY } from './company';
import type { BusinessHours, SocialLinks } from './types';

interface EffectiveSettings {
  phone: string;
  phoneIntl: string;
  email: string;
  whatsappNumber: string;
  address: string;
  hours: BusinessHours[];
  socialLinks: SocialLinks;
  /** Undefined (not a fake default) until an admin sets one in Settings. */
  tripadvisorReviewUrl?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

interface SettingsContextValue extends EffectiveSettings {
  /** Builds a wa.me link to the business's live WhatsApp number with a pre-filled message. */
  whatsappLink: (message: string) => string;
}

// Real current values — used until the DB row loads (and if it ever fails
// to load), so there is no visible flicker on first paint.
const FALLBACK: EffectiveSettings = {
  phone: COMPANY.phone,
  phoneIntl: COMPANY.phoneIntl,
  email: COMPANY.email,
  whatsappNumber: COMPANY.phoneIntl,
  address: COMPANY.address,
  hours: COMPANY.hours,
  socialLinks: {},
  maintenanceMode: false,
};

const SettingsContext = createContext<SettingsContextValue>({
  ...FALLBACK,
  whatsappLink: (message) => buildWhatsappLink(FALLBACK.whatsappNumber, message),
});

function buildWhatsappLink(whatsappNumber: string, message: string): string {
  const digits = whatsappNumber.replace(/[^\d+]/g, '');
  return `https://wa.me/${digits.replace(/^\+/, '')}?text=${encodeURIComponent(message)}`;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<EffectiveSettings>(FALLBACK);

  useEffect(() => {
    let mounted = true;
    getSettings().then((data) => {
      if (!mounted || !data) return;
      setSettings({
        phone: data.phone || FALLBACK.phone,
        phoneIntl: data.phone_intl || FALLBACK.phoneIntl,
        email: data.email || FALLBACK.email,
        whatsappNumber: data.whatsapp_number || FALLBACK.whatsappNumber,
        address: data.address || FALLBACK.address,
        hours: data.hours?.length ? data.hours : FALLBACK.hours,
        socialLinks: data.social_links || {},
        tripadvisorReviewUrl: data.tripadvisor_review_url || undefined,
        maintenanceMode: data.maintenance_mode,
        maintenanceMessage: data.maintenance_message || undefined,
      });
    });
    return () => { mounted = false; };
  }, []);

  const value: SettingsContextValue = {
    ...settings,
    whatsappLink: (message) => buildWhatsappLink(settings.whatsappNumber, message),
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
