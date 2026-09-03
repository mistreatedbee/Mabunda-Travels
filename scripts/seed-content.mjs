#!/usr/bin/env node
/**
 * Seeds initial CMS content: settings, tours (activities), FAQs, and destinations.
 * Safe to re-run — uses upserts / skips existing slugs.
 *
 * Usage: node scripts/seed-content.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

function loadDotEnv(path = '.env') {
  try {
    const text = readFileSync(path, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

const TOURS = [
  {
    name: 'Moholoholo Wildlife Rehabilitation Centre',
    slug: 'moholoholo-rehab',
    short_description: 'Meet rescued raptors, wild cats and other rehabilitated wildlife up close with passionate local guides.',
    full_description:
      'Moholoholo is one of the Lowveld\'s best-loved conservation centres. Guided tours introduce you to vultures, eagles, leopards and hyenas on the road to recovery — a moving, educational experience ideal for families and wildlife lovers.',
    tag: 'Conservation',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/36766391/pexels-photo-36766391.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Vulture at a wildlife rehabilitation centre' }],
  },
  {
    name: 'Hoedspruit Endangered Species Centre',
    slug: 'hoedspruit-endangered-species-centre',
    short_description: 'See cheetah, wild dog and rhino conservation in action at this world-renowned breeding and research centre.',
    full_description:
      'HESC is dedicated to the conservation of rare, vulnerable and endangered species. Interactive tours reveal the stories behind cheetah breeding programmes, rhino protection and the daily care that keeps these animals thriving.',
    tag: 'Conservation',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/25858622/pexels-photo-25858622.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Cheetah in a conservation centre' }],
  },
  {
    name: 'Blyde Dam Boat Cruise',
    slug: 'blyde-dam-boat-cruise',
    short_description: 'Glide across the Blyde Dam with panoramic views of the Drakensberg escarpment and Blyde River Canyon.',
    full_description:
      'A relaxed boat cruise on the Blyde Dam offers some of Mpumalanga\'s most spectacular scenery — towering cliffs, lush vegetation and birdlife against the backdrop of the third-largest canyon in the world.',
    tag: 'Panorama Route',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/33740305/pexels-photo-33740305.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Boat on a scenic dam surrounded by cliffs' }],
  },
  {
    name: 'Hot Air Ballooning',
    slug: 'hot-air-ballooning',
    short_description: 'Drift silently over the Lowveld bush at sunrise — an unforgettable perspective on the African landscape.',
    full_description:
      'Watch the sun rise over the Lowveld as your balloon lifts gently above the treeline. On clear mornings you may spot wildlife from above and enjoy champagne after landing — one of the region\'s most magical experiences.',
    tag: 'Adventure',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/20179673/pexels-photo-20179673.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Hot air balloon over African savanna at sunrise' }],
  },
  {
    name: 'Elephant Moments Interaction',
    slug: 'elephant-moments-interaction',
    short_description: 'Walk alongside gentle giants and learn about elephant behaviour from experienced handlers.',
    full_description:
      'Spend unhurried time with habituated elephants — touching, feeding and walking with them while learning about their social bonds and conservation. A respectful, hands-on encounter you will remember forever.',
    tag: 'Wildlife',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/6818990/pexels-photo-6818990.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Close-up of an African elephant' }],
  },
];

const DESTINATIONS = [
  {
    name: 'Timbavati Private Nature Reserve',
    slug: 'timbavati',
    description: 'Shares an unfenced border with Kruger\'s Orpen region. Known for excellent leopard and lion sightings in a quieter setting.',
    tag: 'Private Reserve',
    stat_label: 'Border',
    stat_value: 'Unfenced with Kruger',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/3384447/pexels-photo-3384447.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Safari vehicle in the bush' }],
  },
  {
    name: 'Klaserie Private Nature Reserve',
    slug: 'klaserie',
    description: 'One of the largest private reserves in the Greater Kruger, offering intimate game drives and excellent predator viewing.',
    tag: 'Private Reserve',
    stat_label: 'Area',
    stat_value: '±60 000 ha',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/32798124/pexels-photo-32798124.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Elephants crossing a dirt road' }],
  },
  {
    name: 'Sabi Sand North',
    slug: 'sabi-sand-north',
    description: 'The northern section of the famous Sabi Sand — legendary leopard territory with ultra-luxury lodge options.',
    tag: 'Private Reserve',
    stat_label: 'Famous for',
    stat_value: 'Leopard sightings',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/6404786/pexels-photo-6404786.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Leopard resting on a tree branch' }],
  },
  {
    name: 'Sabi Sand South',
    slug: 'sabi-sand-south',
    description: 'The southern Sabi Sand abuts Kruger\'s Crocodile Bridge area — Big Five country with world-class guiding.',
    tag: 'Private Reserve',
    stat_label: 'Border',
    stat_value: 'Crocodile Bridge',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/32798117/pexels-photo-32798117.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Lion on the savanna' }],
  },
  {
    name: 'Manyeleti Game Reserve',
    slug: 'manyeleti',
    description: 'Sandwiched between Sabi Sand, Timbavati and Kruger — a community-owned reserve with authentic safari experiences.',
    tag: 'Private Reserve',
    stat_label: 'Ownership',
    stat_value: 'Community-owned',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/27832453/pexels-photo-27832453.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Buffalo herd in golden light' }],
  },
  {
    name: 'Thornybush Game Reserve',
    slug: 'thornybush',
    description: 'Adjacent to Kruger\'s central region — well-managed reserve with strong rhino conservation and family-friendly lodges.',
    tag: 'Private Reserve',
    stat_label: 'Location',
    stat_value: 'Central Kruger',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/38597696/pexels-photo-38597696.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Rhino in the bushveld' }],
  },
  {
    name: 'Kapama Private Game Reserve',
    slug: 'kapama',
    description: 'A fully fenced reserve near Hoedspruit offering Big Five safaris, elephant interactions and ballooning nearby.',
    tag: 'Private Reserve',
    stat_label: 'Near',
    stat_value: 'Hoedspruit',
    featured: true,
    images: [{ url: 'https://images.pexels.com/photos/30894541/pexels-photo-30894541.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Giraffes at a waterhole' }],
  },
];

const FAQS = [
  {
    category: 'booking',
    display_order: 0,
    question: 'How do I book a trip?',
    answer:
      'Send us an enquiry via the contact form on this website, email us at bookings@mabundatravel.co.za, or message us on WhatsApp with your travel dates, group size and what you have in mind. We will reply with a personalised quote and itinerary options.',
  },
  {
    category: 'booking',
    display_order: 1,
    question: 'Do you cater for group travel?',
    answer:
      'Absolutely. We specialise in group travel for schools, churches, stokvels, corporate teams, social clubs and wedding groups. We coordinate transport, timing and logistics so your group travels together smoothly — without arranging accommodation on your behalf unless specifically requested.',
  },
  {
    category: 'general',
    display_order: 2,
    question: 'What areas do you cover?',
    answer:
      'Mpumalanga is our home base. Our safari tours and game drives operate exclusively in Kruger National Park. We provide transfers from Hoedspruit Eastgate Airport, KMIA (Nelspruit), Skukuza Airport, and OR Tambo International Airport in Johannesburg to Kruger gates, rest camps and nearby towns. If your pickup or drop-off point is not listed here, please enquire — we will gladly provide a quote.',
  },
  {
    category: 'general',
    display_order: 3,
    question: 'When is the best time to visit Kruger National Park?',
    answer:
      'The dry winter months (May to September) are generally best for wildlife viewing — vegetation is thinner and animals gather at water sources. Summer (October to March) is lush and green with excellent birding, though it can be hot and humid. Both seasons offer rewarding safaris; we can advise based on your priorities.',
  },
  {
    category: 'general',
    display_order: 4,
    question: 'Is Kruger National Park a malaria risk area?',
    answer:
      'Yes, the Lowveld including Kruger is a malaria area. We strongly recommend consulting your doctor or travel clinic about prophylaxis before your trip. The risk is highest during the wet season from October to May, peaking between February and May.',
  },
  {
    category: 'general',
    display_order: 5,
    question: 'What animals can I see in Kruger National Park?',
    answer:
      'Kruger is home to the Big Five — lion, leopard, elephant, buffalo and rhino — along with cheetah, wild dog, hippo, crocodile and over 500 bird species. Remember that Kruger is a vast wilderness, not a zoo; sightings depend on season, area and luck, which is part of the adventure.',
  },
  {
    category: 'general',
    display_order: 6,
    question: 'What are the park rules in Kruger National Park?',
    answer:
      'Speed limits are strictly enforced (50 km/h on tar, 40 km/h on gravel). You must remain inside your vehicle except in designated picnic and rest areas. Do not feed or disturb animals. Gate opening and closing times must be adhered to — late arrival at gates can result in fines.',
  },
  {
    category: 'general',
    display_order: 7,
    question: 'What should I bring on a Kruger safari?',
    answer:
      'Pack comfortable neutral-coloured clothing, closed shoes, sunscreen, a hat, binoculars and a warm layer for early-morning game drives in winter. Keep cameras charged and bring any prescribed medication including malaria prophylaxis if advised by your doctor.',
  },
  {
    category: 'general',
    display_order: 8,
    question: 'What currency is used in South Africa?',
    answer:
      'The South African Rand (ZAR), symbolised as R. Banknotes range from R10 to R200. Credit and debit cards are widely accepted at lodges and shops, though carrying some cash is useful for tips and small purchases.',
  },
  {
    category: 'general',
    display_order: 9,
    question: 'Do I need a visa to visit South Africa?',
    answer:
      'Visa requirements depend on your nationality. Many countries enjoy visa-free entry for tourism stays of up to 90 days. Check the South African Department of Home Affairs website or your local embassy for the latest requirements before you travel.',
  },
  {
    category: 'general',
    display_order: 10,
    question: 'Tipping & gratuities',
    answer:
      'Tipping is customary in South Africa as a thank-you for good service. As a guide: 10–15% at restaurants; R50–R100 per person for safari guides depending on the experience; 10% for private transfers. Tipping is always at your discretion.',
  },
];

const SETTINGS = {
  phone: '+27 70 589 3439',
  phone_intl: '+27705893439',
  whatsapp_number: '+27705893439',
  hours: [
    { days: 'Mon – Fri', time: '08:00 – 17:00' },
    { days: 'Sat & Sun', time: '08:00 – 13:00' },
  ],
};

async function upsertBySlug(supabase, table, rows, extra = {}) {
  let inserted = 0;
  let skipped = 0;
  for (const row of rows) {
    const { data: existing } = await supabase.from(table).select('id').eq('slug', row.slug).maybeSingle();
    if (existing) {
      skipped++;
      continue;
    }
    const { error } = await supabase.from(table).insert({ ...row, ...extra, status: 'published' });
    if (error) {
      console.error(`  ✗ ${table}/${row.slug}:`, error.message);
    } else {
      inserted++;
    }
  }
  return { inserted, skipped };
}

async function seedFaqs(supabase) {
  const { count } = await supabase.from('faqs').select('*', { count: 'exact', head: true });
  if (count && count > 0) {
    console.log(`  FAQs: ${count} already exist — skipping (edit via admin)`);
    return;
  }
  for (const faq of FAQS) {
    const { error } = await supabase.from('faqs').insert({ ...faq, published: true });
    if (error) console.error('  ✗ faq:', error.message);
  }
  console.log(`  FAQs: inserted ${FAQS.length}`);
}

async function main() {
  loadDotEnv();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('Updating settings...');
  const { error: settingsError } = await supabase.from('settings').update(SETTINGS).eq('id', 1);
  if (settingsError) console.error('  ✗ settings:', settingsError.message);
  else console.log('  ✓ settings updated (phone, hours)');

  console.log('Seeding tours (activities)...');
  const tours = await upsertBySlug(supabase, 'tours', TOURS);
  console.log(`  ✓ tours: ${tours.inserted} inserted, ${tours.skipped} skipped`);

  console.log('Seeding destinations...');
  const dests = await upsertBySlug(supabase, 'destinations', DESTINATIONS);
  console.log(`  ✓ destinations: ${dests.inserted} inserted, ${dests.skipped} skipped`);

  console.log('Seeding FAQs...');
  await seedFaqs(supabase);

  console.log('\nDone. Content is live and editable via /admin.');
}

main();
