import {
  Compass, Users, Briefcase, Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  icon: LucideIcon;
  title: string;
  text: string;
  detail: string;
  points: string[];
}

export const SERVICES: Service[] = [
  {
    icon: Compass,
    title: 'Safari Experiences',
    text: 'Expert-guided game drives and wildlife encounters in Kruger and the private reserves.',
    detail: "Step into Africa's wild heart with guides who know the Lowveld intimately. Whether it's your first elephant sighting or you're chasing your hundredth leopard, we match you with the right vehicle, the right reserve, and the right time of day for the most rewarding wildlife moments.",
    points: [
      'Morning, sunset & full-day game drives',
      'Private vehicle for intimate group experiences',
      'Kruger National Park & surrounding private reserves',
      'Photography safaris & Big Five tracking',
    ],
  },
  {
    icon: Users,
    title: 'Group Tours',
    text: 'Organised travel for schools, churches, companies, social groups and weddings.',
    detail: 'Moving a group takes planning — permits, coaches, meals, rooming lists and timing. We have it down to a fine art. From school educational tours to church conferences, stokvel year-end trips, and wedding party transfers, we coordinate every moving part and stay reachable throughout.',
    points: [
      'School & educational tours',
      'Church groups & conferences',
      'Stokvel and social club trips',
      'Wedding transfers & event transport',
      'Dedicated coordinator for the whole tour',
    ],
  },
  {
    icon: Briefcase,
    title: 'Corporate Travel',
    text: 'Business transfers, airport pickups and event transport for professionals.',
    detail: 'Reliable, punctual and invoiced correctly. We arrange transfers, airport pickups, and event transport for businesses across Mpumalanga and beyond, with a single point of contact and transparent billing that keeps your finance team satisfied.',
    points: [
      'Business transfers & airport pickups',
      'Conference & event transport',
      'Team-building retreat transfers',
      'Consolidated invoicing for companies',
    ],
  },
  {
    icon: Sparkles,
    title: 'Custom Trips',
    text: 'Bespoke itineraries crafted around your interests, timeline & budget.',
    detail: "No two travellers are the same. Birding at dawn, hot-air ballooning over the Lowveld, elephant interactions, or a slow road trip along the Panorama Route — bring us the dream and we will build the itinerary, with real prices and honest advice about what is worth your time.",
    points: [
      'Built from scratch around you',
      'Special occasions & milestone trips',
      'Photography, birding & adventure focus',
      'Honest local advice from people who know',
    ],
  },
];

export interface KrugerGateTime {
  name: string;
  location: string;
  opens: string;
  closeSummer: string;
  closeWinter: string;
  note?: string;
}

/** Monthly gate times — matches SANParks / industry standard format. */
export const KRUGER_GATE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export interface KrugerMonthlyGateRow {
  label: string;
  times: readonly string[];
  note?: string;
}

export const KRUGER_MONTHLY_GATES: KrugerMonthlyGateRow[] = [
  {
    label: 'Entrance Gates Open',
    times: ['05:30', '05:30', '05:30', '06:00', '06:00', '06:00', '06:00', '06:00', '06:00', '05:30', '05:30', '05:30'],
  },
  {
    label: 'Camp Gates Open',
    times: ['04:30', '05:30', '05:30', '06:00', '06:00', '06:00', '06:00', '06:00', '06:00', '05:30', '04:30', '04:30'],
  },
  {
    label: 'All Gates Close',
    times: ['18:30', '18:30', '18:30', '18:30', '17:30', '17:30', '17:30', '17:30', '18:00', '18:00', '18:30', '18:30'],
  },
];

export const KRUGER_GATES: KrugerGateTime[] = [
  { name: 'Paul Kruger Gate',       location: 'Central',        opens: '05:30', closeSummer: '18:30', closeWinter: '17:30' },
  { name: 'Numbi Gate',             location: 'South-West',     opens: '05:30', closeSummer: '18:30', closeWinter: '17:30' },
  { name: 'Malelane Gate',          location: 'South',          opens: '05:30', closeSummer: '18:30', closeWinter: '17:30' },
  { name: 'Crocodile Bridge Gate',  location: 'South-East',     opens: '05:30', closeSummer: '18:30', closeWinter: '17:30' },
  { name: 'Orpen Gate',             location: 'Central-West',   opens: '06:00', closeSummer: '18:30', closeWinter: '17:30' },
  { name: 'Phalaborwa Gate',        location: 'North',          opens: '05:30', closeSummer: '18:30', closeWinter: '17:30' },
  { name: 'Punda Maria Gate',       location: 'Far North',      opens: '06:00', closeSummer: '18:00', closeWinter: '17:00' },
  { name: 'Giriyondo Gate',         location: 'North (border)', opens: '08:00', closeSummer: '15:00', closeWinter: '15:00', note: 'Border gate — passport required' },
];
