/** Internal storage key for homepage visible content (not an SEO page). */
export const HOMEPAGE_CONTENT_PATH = '/_homepage';

export interface SitePageDef {
  path: string;
  label: string;
  group: 'main' | 'legal';
  /** Default browser tab title & Google title */
  title: string;
  /** Default meta description */
  description: string;
  /** Short note for admins about editable content on this page */
  contentNote?: string;
  /** Quick links to related admin sections */
  manageLinks?: { label: string; href: string }[];
}

export const SITE_PAGES: SitePageDef[] = [
  {
    path: '/',
    label: 'Home',
    group: 'main',
    title: 'Mabunda Travel & Tours | Safari Transfers & Tours — Mpumalanga',
    description: 'Mabunda Travel & Tours — trusted safari transfers & tours in Mpumalanga. Expert-guided Kruger safaris, airport transfers, group tours & custom adventures.',
    contentNote: 'Visual homepage manager — hero, sections, activities, FAQs and SEO in one place.',
  },
  {
    path: '/about',
    label: 'About',
    group: 'main',
    title: 'About Us | Mabunda Travel & Tours',
    description: 'Mabunda Travel & Tours (Pty) Ltd is a registered travel agency in Acornhoek, Mpumalanga, founded by Marvin Mabunda. Learn about our mission, vision and values.',
    contentNote: 'Mission, vision and team copy is built into the About page layout.',
  },
  {
    path: '/services',
    label: 'Services',
    group: 'main',
    title: 'Our Services | Mabunda Travel & Tours',
    description: 'Safari experiences, group tours, corporate transfers and custom trips — travel services from Mabunda Travel & Tours, Acornhoek, Mpumalanga.',
    contentNote: 'Service detail cards use fixed categories — update SEO here; contact us if service copy needs changing.',
  },
  {
    path: '/maps',
    label: 'Maps',
    group: 'main',
    title: 'Safari Maps — Kruger & Private Reserves | Mabunda Travel & Tours',
    description: 'Maps of Kruger National Park and the surrounding private game reserves. Plan your safari with Mabunda Travel & Tours — Mpumalanga\'s local transfer experts.',
    manageLinks: [
      { label: 'Private reserve cards', href: '/admin/destinations' },
      { label: 'Map images', href: '/admin/media' },
    ],
  },
  {
    path: '/gallery',
    label: 'Gallery',
    group: 'main',
    title: 'Photo Gallery | Mabunda Travel & Tours',
    description: 'Safari and travel photography from Mabunda Travel & Tours — Mpumalanga\'s trusted transfer and tour specialists. Gallery coming soon.',
    manageLinks: [{ label: 'Upload photos', href: '/admin/media' }],
  },
  {
    path: '/contact',
    label: 'Contact',
    group: 'main',
    title: 'Contact & Booking | Mabunda Travel & Tours',
    description: 'Book your safari or transfer with Mabunda Travel & Tours. Request a personalised quote via our enquiry form, WhatsApp or email — based in Acornhoek, Mpumalanga.',
    manageLinks: [
      { label: 'Phone, email & hours', href: '/admin/settings' },
      { label: 'Booking FAQs', href: '/admin/faqs' },
      { label: 'Enquiries inbox', href: '/admin/enquiries' },
    ],
  },
  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
    group: 'legal',
    title: 'Privacy Policy | Mabunda Travel & Tours',
    description: "How Mabunda Travel & Tours (Pty) Ltd collects, uses and protects your personal information in accordance with South Africa's POPIA.",
  },
  {
    path: '/terms',
    label: 'Terms & Conditions',
    group: 'legal',
    title: 'Terms & Conditions | Mabunda Travel & Tours',
    description: 'Booking terms and conditions for travel packages, tours and services provided by Mabunda Travel & Tours (Pty) Ltd.',
  },
];

export function getSitePage(path: string): SitePageDef {
  return SITE_PAGES.find((p) => p.path === path) ?? SITE_PAGES[0];
}
