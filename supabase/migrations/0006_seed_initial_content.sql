-- Seed initial CMS content for Mabunda Travel & Tours.
-- Safe to re-run: uses ON CONFLICT or skips when rows already exist.
-- For live projects, prefer: node scripts/seed-content.mjs

-- ---------------------------------------------------------------------------
-- settings — updated contact details & business hours
-- ---------------------------------------------------------------------------

update settings set
  phone           = '+27 70 589 3439',
  phone_intl      = '+27705893439',
  whatsapp_number = '+27705893439',
  hours           = '[
    {"days": "Mon – Fri", "time": "08:00 – 17:00"},
    {"days": "Sat & Sun", "time": "08:00 – 13:00"}
  ]'::jsonb,
  updated_at      = now()
where id = 1;

-- ---------------------------------------------------------------------------
-- tours — homepage activity flip cards
-- ---------------------------------------------------------------------------

insert into tours (name, slug, short_description, full_description, tag, featured, status, images)
select * from (values
  (
    'Moholoholo Wildlife Rehabilitation Centre',
    'moholoholo-rehab',
    'Meet rescued raptors, wild cats and other rehabilitated wildlife up close with passionate local guides.',
    'Moholoholo is one of the Lowveld''s best-loved conservation centres. Guided tours introduce you to vultures, eagles, leopards and hyenas on the road to recovery — a moving, educational experience ideal for families and wildlife lovers.',
    'Conservation',
    true,
    'published',
    '[{"url":"https://images.pexels.com/photos/36766391/pexels-photo-36766391.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Vulture at a wildlife rehabilitation centre"}]'::jsonb
  ),
  (
    'Hoedspruit Endangered Species Centre',
    'hoedspruit-endangered-species-centre',
    'See cheetah, wild dog and rhino conservation in action at this world-renowned breeding and research centre.',
    'HESC is dedicated to the conservation of rare, vulnerable and endangered species. Interactive tours reveal the stories behind cheetah breeding programmes, rhino protection and the daily care that keeps these animals thriving.',
    'Conservation',
    true,
    'published',
    '[{"url":"https://images.pexels.com/photos/25858622/pexels-photo-25858622.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Cheetah in a conservation centre"}]'::jsonb
  ),
  (
    'Blyde Dam Boat Cruise',
    'blyde-dam-boat-cruise',
    'Glide across the Blyde Dam with panoramic views of the Drakensberg escarpment and Blyde River Canyon.',
    'A relaxed boat cruise on the Blyde Dam offers some of Mpumalanga''s most spectacular scenery — towering cliffs, lush vegetation and birdlife against the backdrop of the third-largest canyon in the world.',
    'Panorama Route',
    true,
    'published',
    '[{"url":"https://images.pexels.com/photos/33740305/pexels-photo-33740305.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Boat on a scenic dam surrounded by cliffs"}]'::jsonb
  ),
  (
    'Hot Air Ballooning',
    'hot-air-ballooning',
    'Drift silently over the Lowveld bush at sunrise — an unforgettable perspective on the African landscape.',
    'Watch the sun rise over the Lowveld as your balloon lifts gently above the treeline. On clear mornings you may spot wildlife from above and enjoy champagne after landing — one of the region''s most magical experiences.',
    'Adventure',
    true,
    'published',
    '[{"url":"https://images.pexels.com/photos/20179673/pexels-photo-20179673.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Hot air balloon over African savanna at sunrise"}]'::jsonb
  ),
  (
    'Elephant Moments Interaction',
    'elephant-moments-interaction',
    'Walk alongside gentle giants and learn about elephant behaviour from experienced handlers.',
    'Spend unhurried time with habituated elephants — touching, feeding and walking with them while learning about their social bonds and conservation. A respectful, hands-on encounter you will remember forever.',
    'Wildlife',
    true,
    'published',
    '[{"url":"https://images.pexels.com/photos/6818990/pexels-photo-6818990.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Close-up of an African elephant"}]'::jsonb
  )
) as v(name, slug, short_description, full_description, tag, featured, status, images)
where not exists (select 1 from tours where slug = v.slug);

-- ---------------------------------------------------------------------------
-- destinations — private reserves on Maps page
-- ---------------------------------------------------------------------------

insert into destinations (name, slug, description, tag, stat_label, stat_value, featured, status, images)
select * from (values
  ('Timbavati Private Nature Reserve', 'timbavati', 'Shares an unfenced border with Kruger''s Orpen region. Known for excellent leopard and lion sightings in a quieter setting.', 'Private Reserve', 'Border', 'Unfenced with Kruger', true, 'published', '[{"url":"https://images.pexels.com/photos/3384447/pexels-photo-3384447.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Safari vehicle in the bush"}]'::jsonb),
  ('Klaserie Private Nature Reserve', 'klaserie', 'One of the largest private reserves in the Greater Kruger, offering intimate game drives and excellent predator viewing.', 'Private Reserve', 'Area', '±60 000 ha', true, 'published', '[{"url":"https://images.pexels.com/photos/32798124/pexels-photo-32798124.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Elephants crossing a dirt road"}]'::jsonb),
  ('Sabi Sand North', 'sabi-sand-north', 'The northern section of the famous Sabi Sand — legendary leopard territory with ultra-luxury lodge options.', 'Private Reserve', 'Famous for', 'Leopard sightings', true, 'published', '[{"url":"https://images.pexels.com/photos/6404786/pexels-photo-6404786.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Leopard resting on a tree branch"}]'::jsonb),
  ('Sabi Sand South', 'sabi-sand-south', 'The southern Sabi Sand abuts Kruger''s Crocodile Bridge area — Big Five country with world-class guiding.', 'Private Reserve', 'Border', 'Crocodile Bridge', true, 'published', '[{"url":"https://images.pexels.com/photos/32798117/pexels-photo-32798117.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Lion on the savanna"}]'::jsonb),
  ('Manyeleti Game Reserve', 'manyeleti', 'Sandwiched between Sabi Sand, Timbavati and Kruger — a community-owned reserve with authentic safari experiences.', 'Private Reserve', 'Ownership', 'Community-owned', true, 'published', '[{"url":"https://images.pexels.com/photos/27832453/pexels-photo-27832453.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Buffalo herd in golden light"}]'::jsonb),
  ('Thornybush Game Reserve', 'thornybush', 'Adjacent to Kruger''s central region — well-managed reserve with strong rhino conservation and family-friendly lodges.', 'Private Reserve', 'Location', 'Central Kruger', true, 'published', '[{"url":"https://images.pexels.com/photos/38597696/pexels-photo-38597696.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Rhino in the bushveld"}]'::jsonb),
  ('Kapama Private Game Reserve', 'kapama', 'A fully fenced reserve near Hoedspruit offering Big Five safaris, elephant interactions and ballooning nearby.', 'Private Reserve', 'Near', 'Hoedspruit', true, 'published', '[{"url":"https://images.pexels.com/photos/30894541/pexels-photo-30894541.jpeg?auto=compress&cs=tinysrgb&w=1600","alt":"Giraffes at a waterhole"}]'::jsonb)
) as v(name, slug, description, tag, stat_label, stat_value, featured, status, images)
where not exists (select 1 from destinations where slug = v.slug);

-- ---------------------------------------------------------------------------
-- faqs — only if table is empty
-- ---------------------------------------------------------------------------

insert into faqs (question, answer, category, display_order, published)
select question, answer, category, display_order, true
from (values
  ('How do I book a trip?', 'Send us an enquiry via the contact form on this website, email us at bookings@mabundatravel.co.za, or message us on WhatsApp with your travel dates, group size and what you have in mind. We will reply with a personalised quote and itinerary options.', 'booking', 0),
  ('Do you cater for group travel?', 'Absolutely. We specialise in group travel for schools, churches, stokvels, corporate teams, social clubs and wedding groups. We coordinate transport, timing and logistics so your group travels together smoothly — without arranging accommodation on your behalf unless specifically requested.', 'booking', 1),
  ('What areas do you cover?', 'Mpumalanga is our home base. Our safari tours and game drives operate exclusively in Kruger National Park. We provide transfers from Hoedspruit Eastgate Airport, KMIA (Nelspruit), Skukuza Airport, and OR Tambo International Airport in Johannesburg to Kruger gates, rest camps and nearby towns. If your pickup or drop-off point is not listed here, please enquire — we will gladly provide a quote.', 'general', 2),
  ('When is the best time to visit Kruger National Park?', 'The dry winter months (May to September) are generally best for wildlife viewing — vegetation is thinner and animals gather at water sources. Summer (October to March) is lush and green with excellent birding, though it can be hot and humid. Both seasons offer rewarding safaris; we can advise based on your priorities.', 'general', 3),
  ('Is Kruger National Park a malaria risk area?', 'Yes, the Lowveld including Kruger is a malaria area. We strongly recommend consulting your doctor or travel clinic about prophylaxis before your trip. The risk is highest during the wet season from October to May, peaking between February and May.', 'general', 4),
  ('What animals can I see in Kruger National Park?', 'Kruger is home to the Big Five — lion, leopard, elephant, buffalo and rhino — along with cheetah, wild dog, hippo, crocodile and over 500 bird species. Remember that Kruger is a vast wilderness, not a zoo; sightings depend on season, area and luck, which is part of the adventure.', 'general', 5),
  ('What are the park rules in Kruger National Park?', 'Speed limits are strictly enforced (50 km/h on tar, 40 km/h on gravel). You must remain inside your vehicle except in designated picnic and rest areas. Do not feed or disturb animals. Gate opening and closing times must be adhered to — late arrival at gates can result in fines.', 'general', 6),
  ('What should I bring on a Kruger safari?', 'Pack comfortable neutral-coloured clothing, closed shoes, sunscreen, a hat, binoculars and a warm layer for early-morning game drives in winter. Keep cameras charged and bring any prescribed medication including malaria prophylaxis if advised by your doctor.', 'general', 7),
  ('What currency is used in South Africa?', 'The South African Rand (ZAR), symbolised as R. Banknotes range from R10 to R200. Credit and debit cards are widely accepted at lodges and shops, though carrying some cash is useful for tips and small purchases.', 'general', 8),
  ('Do I need a visa to visit South Africa?', 'Visa requirements depend on your nationality. Many countries enjoy visa-free entry for tourism stays of up to 90 days. Check the South African Department of Home Affairs website or your local embassy for the latest requirements before you travel.', 'general', 9),
  ('Tipping & gratuities', 'Tipping is customary in South Africa as a thank-you for good service. As a guide: 10–15% at restaurants; R50–R100 per person for safari guides depending on the experience; 10% for private transfers. Tipping is always at your discretion.', 'general', 10)
) as v(question, answer, category, display_order)
where not exists (select 1 from faqs limit 1);
