import {
  Compass, Users, Briefcase, Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface Activity {
  slug: string;
  title: string;
  location: string;
  tag: string;
  image: string;
  desc: string;
  longDesc: string;
}

export const ACTIVITIES: Activity[] = [
  {
    slug: 'kruger-safari',
    title: 'Kruger National Park Safari',
    location: 'Kruger National Park',
    tag: 'Wildlife',
    image: 'https://images.pexels.com/photos/13142739/pexels-photo-13142739.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Track the Big Five on expert-guided game drives at sunrise and sunset.',
    longDesc: 'Experience the world-famous Kruger National Park with guides who grew up beside the park. Morning and sunset drives offer the best wildlife sightings — lion prides, leopards in the trees, elephant herds at waterholes, and the unmistakeable sound of the African bush at dusk.',
  },
  {
    slug: 'panorama-route',
    title: 'Panorama Route Explorer',
    location: 'Mpumalanga Escarpment',
    tag: 'Scenic',
    image: 'https://images.pexels.com/photos/36168137/pexels-photo-36168137.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: "Marvel at God's Window, Bourke's Luck Potholes and Africa's third-largest canyon.",
    longDesc: "One of South Africa's most spectacular road trips takes you past thundering waterfalls, the jaw-dropping viewpoints of God's Window, and the ancient carved potholes of Bourke's Luck. The Blyde River Canyon — Africa's largest green canyon — never fails to silence even seasoned travellers.",
  },
  {
    slug: 'moholoholo',
    title: 'Moholoholo Rehabilitation Centre',
    location: 'Hoedspruit',
    tag: 'Conservation',
    image: 'https://images.pexels.com/photos/2133935/pexels-photo-2133935.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Meet rescued big cats, raptors and wildlife at this world-class rehabilitation centre.',
    longDesc: "Moholoholo Wildlife Rehabilitation Centre is one of Africa's most respected sanctuaries for injured and orphaned animals. Walk alongside cheetahs, come face-to-face with lions and owls, and learn how dedicated conservation teams nurse sick and poisoned wildlife back to health before releasing them into the wild.",
  },
  {
    slug: 'hoedspruit-endangered-species',
    title: 'Hoedspruit Endangered Species Centre',
    location: 'Hoedspruit',
    tag: 'Conservation',
    image: 'https://images.pexels.com/photos/3669639/pexels-photo-3669639.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: "Visit Africa's leading captive breeding programme for cheetahs, wild dogs and rhinos.",
    longDesc: "The Hoedspruit Endangered Species Centre (HESC) leads ground-breaking conservation work for Africa's most vulnerable animals. On a guided walk, you'll encounter cheetahs on foot, observe African wild dogs, and learn about the urgent fight to protect the southern white rhino from extinction.",
  },
  {
    slug: 'blyde-dam-boat-cruise',
    title: 'Blyde Dam Boat Cruise',
    location: 'Blyde River Canyon',
    tag: 'Adventure',
    image: 'https://images.pexels.com/photos/20001418/pexels-photo-20001418.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: "Glide across the Blydepoort Dam while hippos and crocs share the water beside you.",
    longDesc: "The Blyde Dam Boat Cruise offers a completely different perspective on the Blyde River Canyon. From the water you'll see the Three Rondavels towering overhead, hippos surfacing just metres away, and the lush canyon walls reflected in the still water — all against the backdrop of one of nature's most dramatic landscapes.",
  },
  {
    slug: 'hot-air-ballooning',
    title: 'Hot Air Ballooning',
    location: 'Mpumalanga Lowveld',
    tag: 'Adventure',
    image: 'https://images.pexels.com/photos/2739611/pexels-photo-2739611.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Drift silently over the Lowveld bushveld at sunrise in a breathtaking hot air balloon.',
    longDesc: "Rise above the Lowveld at first light in a hot air balloon for an utterly silent, breathtaking view of the African wilderness below. Spot game from the air as the sun paints the savanna gold, then celebrate with a champagne toast and a hearty bush breakfast when you return to earth.",
  },
  {
    slug: 'elephant-moments',
    title: 'Elephant Moments Interaction',
    location: 'Hazyview',
    tag: 'Wildlife',
    image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'An intimate, ethical elephant interaction experience that creates memories for a lifetime.',
    longDesc: "Elephant Moments offers one of the most personal wildlife encounters in Mpumalanga. Get up close with magnificent African elephants in a responsible, welfare-focused environment — hand-feed them, walk alongside them, and hear from passionate rangers about elephant behaviour, conservation, and the challenges these gentle giants face.",
  },
];

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

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'How do I make a booking?',
    a: 'Send us an enquiry through our online form, WhatsApp, or email. We respond within one business day with a personalised quote. Once you accept the quote, a deposit confirms your booking and secures your dates.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 2–4 weeks in advance, particularly during peak season (June–September) and over the December holidays. That said, we will always do our best to accommodate last-minute requests.',
  },
  {
    q: 'Do you offer private door-to-door transfers?',
    a: 'Yes. We specialise in private transfers between airports, lodges, game reserves and any other destination you require. Your vehicle is exclusively yours — no shared shuttles with strangers.',
  },
  {
    q: 'Which airports do you service?',
    a: 'We service Kruger Mpumalanga International Airport (KMIA) in Nelspruit, OR Tambo International Airport (JNB) in Johannesburg, and Eastgate Airport in Hoedspruit. Transfers from other airports are available on request.',
  },
  {
    q: 'Are child seats available for young passengers?',
    a: 'Yes. We can provide approved child safety seats for infants and toddlers at no additional charge. Please request this when booking so we can fit the correct seat before your transfer.',
  },
  {
    q: 'Is there a luggage restriction on transfers?',
    a: 'For standard private transfers there is no strict luggage limit, though we ask that you inform us of large or excess luggage when booking so we can ensure the appropriate vehicle is assigned. Open safari vehicle transfers may have weight limits — we will advise you at the time of booking.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Cancellations made more than 14 days before travel receive a full deposit refund. Cancellations within 14 days may be subject to a partial fee depending on the service and any costs already incurred. Full terms are provided with each quote.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept EFT (electronic funds transfer) to our South African bank account. Payment details and a formal pro-forma invoice are provided with every quote. A deposit is required to confirm the booking, with the balance due before travel.',
  },
  {
    q: 'Is it safe to travel in areas with wildlife?',
    a: 'Absolutely — with the right guidance. Our drivers and guides are experienced in navigating wildlife areas safely. All game drives follow established park rules: vehicles remain on designated roads, guests stay inside the vehicle, and guides make safety-first decisions at all times.',
  },
  {
    q: 'What is the best time of year to visit Mpumalanga?',
    a: 'For wildlife viewing, the dry winter months (May–September) are best — vegetation is sparse, animals gather at waterholes, and mornings are crisp and clear. Summer (October–February) brings lush greenery, birding and newborn animals, though afternoon thunderstorms are common.',
  },
  {
    q: 'What should I know about visiting Kruger National Park?',
    a: "Kruger covers nearly 20 000 km² and is one of Africa's finest wildlife destinations. Guests must remain in vehicles on public roads, observe speed limits, and exit before gates close. Accommodation books out well in advance for peak season. Our team can advise on the best areas and camps for your interests.",
  },
  {
    q: 'Can I customise my itinerary?',
    a: 'Every itinerary we build is customised around you — your dates, group size, interests and budget. Tell us what you love and we will design a trip that matches it, with honest local advice about what is worth your time.',
  },
  {
    q: 'Do you cater for group travel?',
    a: 'Yes. We organise travel for schools, churches, companies, stokvels and social groups of all sizes. Group tours include coordinated transport, guided activities, and a dedicated coordinator who manages all logistics on the day.',
  },
  {
    q: 'How much does a trip cost?',
    a: 'Every trip is quoted individually because vehicle type, group size, season and specific activities all affect the price. Submit an enquiry and we will provide a detailed, obligation-free quote — usually within one business day.',
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
