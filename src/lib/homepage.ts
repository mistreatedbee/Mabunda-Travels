import type { ImageRef } from './types';

/** Stored in seo_pages at this path — not a public URL. */
export const HOMEPAGE_CONTENT_PATH = '/_homepage';

export interface HomepageHero {
  location_chip: string;
  headline_line1: string;
  headline_highlight: string;
  subtitle: string;
  background_images: ImageRef[];
  trust_badges: string[];
  discover_link_text: string;
  discover_link_url: string;
}

export interface HomepageFaqIntro extends HomepageSectionHeader {
  about_paragraph_2: string;
}

export interface HomepageSectionHeader {
  eyebrow: string;
  title: string;
  description: string;
}

export interface HomepageExperiences extends HomepageSectionHeader {
  cta_text: string;
}

export interface HomepageContentData {
  hero: HomepageHero;
  trusted_bar: string[];
  experiences: HomepageExperiences;
  services: HomepageSectionHeader;
  testimonials: Pick<HomepageSectionHeader, 'eyebrow' | 'title'>;
  faq: HomepageFaqIntro;
  cta: { title: string; text: string };
}

export interface HomepageRecord {
  id: 1;
  content: HomepageContentData;
  updated_at: string;
}

export const HOMEPAGE_DEFAULTS: HomepageContentData = {
  hero: {
    location_chip: 'Mpumalanga, South Africa',
    headline_line1: 'Explore the wild heart of',
    headline_highlight: 'South Africa',
    subtitle:
      'Safari tours, personalised adventures and seamless transfers with Mabunda Travel & Tours — your trusted travel partner in Mpumalanga.',
    background_images: [
      { url: 'https://images.pexels.com/photos/30878973/pexels-photo-30878973.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'African savanna at golden sunset' },
      { url: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Elephants in the bush' },
      { url: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Lion on the savanna' },
    ],
    trust_badges: ['Personalised Service', 'Local Expertise', 'Verified & Registered'],
    discover_link_text: 'Discover our services',
    discover_link_url: '/services',
  },
  trusted_bar: ['Verified & Registered', 'Local Mpumalanga Expertise', 'Personalised Service', 'Trusted Travel Partner'],
  experiences: {
    eyebrow: 'What we offer',
    title: 'Extraordinary experiences & activities',
    description:
      'From the Big Five to balloon rides and conservation encounters — hover or tap each card to discover the experience.',
    cta_text: 'Plan my experience',
  },
  services: {
    eyebrow: 'Services',
    title: 'How we can help you',
    description:
      'Whether you need a seamless airport transfer or a fully crafted safari adventure, we handle everything from first enquiry to final drop-off.',
  },
  testimonials: {
    eyebrow: 'What travellers say',
    title: 'Trusted by our travellers',
  },
  faq: {
    eyebrow: 'About Us',
    title: 'Connecting travellers with extraordinary destinations',
    description:
      'Mabunda Travel & Tours creates memorable travel experiences by connecting travellers with beautiful destinations, cultural experiences, and personalised adventures across South Africa.',
    about_paragraph_2:
      'Founded by Marvin Mabunda in May 2025, we are a registered private company based in Acornhoek, Mpumalanga — proudly serving holiday travellers, groups, and corporate clients.',
  },
  cta: {
    title: 'Ready to start your journey?',
    text: 'Tell us where you dream of going and we will craft a personalised itinerary with an obligation-free quote — usually within one business day.',
  },
};

/** Deep-merge stored content with defaults so new fields never break the site. */
export function mergeHomepageContent(stored: Partial<HomepageContentData> | null | undefined): HomepageContentData {
  if (!stored) return HOMEPAGE_DEFAULTS;
  return {
    hero: {
      ...HOMEPAGE_DEFAULTS.hero,
      ...stored.hero,
      background_images: stored.hero?.background_images?.length ? stored.hero.background_images : HOMEPAGE_DEFAULTS.hero.background_images,
      trust_badges: stored.hero?.trust_badges?.length ? stored.hero.trust_badges : HOMEPAGE_DEFAULTS.hero.trust_badges,
    },
    trusted_bar: stored.trusted_bar?.length ? stored.trusted_bar : HOMEPAGE_DEFAULTS.trusted_bar,
    experiences: { ...HOMEPAGE_DEFAULTS.experiences, ...stored.experiences },
    services: { ...HOMEPAGE_DEFAULTS.services, ...stored.services },
    testimonials: { ...HOMEPAGE_DEFAULTS.testimonials, ...stored.testimonials },
    faq: { ...HOMEPAGE_DEFAULTS.faq, ...stored.faq },
    cta: { ...HOMEPAGE_DEFAULTS.cta, ...stored.cta },
  };
}
