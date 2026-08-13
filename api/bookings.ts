import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: { persistSession: false },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

// Best-effort rate limiting per serverless instance: 5 requests/min per IP.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  // Prevent unbounded memory growth on long-lived instances
  if (requestLog.size > 10_000) requestLog.clear();
  return recent.length > RATE_LIMIT;
}

function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export default async function handler(req: any, res: any) {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Bookings API misconfigured: missing Supabase environment variables.');
    return res.status(500).json({ error: 'The booking service is temporarily unavailable. Please contact us on WhatsApp.' });
  }

  const ip =
    (typeof req.headers['x-forwarded-for'] === 'string' && req.headers['x-forwarded-for'].split(',')[0].trim()) ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  const body = req.body || {};

  // Honeypot: real users never fill this hidden field. Pretend success so
  // bots don't learn they were caught.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return res.status(201).json({ status: 'success' });
  }

  const full_name = cleanString(body.full_name, 120);
  const email = cleanString(body.email, 254);
  const phone = cleanString(body.phone, 20);
  const message = cleanString(body.message, 2000);
  const destination = cleanString(body.destination, 120);
  const service = cleanString(body.service, 120);

  if (!full_name || full_name.length < 2) {
    return res.status(400).json({ error: 'Please provide your full name.' });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!phone || !PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'Please provide a valid phone number.' });
  }

  let travel_date: string | null = null;
  if (body.travel_date) {
    if (typeof body.travel_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.travel_date)) {
      return res.status(400).json({ error: 'Travel date must be in YYYY-MM-DD format.' });
    }
    travel_date = body.travel_date;
  }

  let num_travellers: number | null = null;
  if (body.num_travellers !== null && body.num_travellers !== undefined && body.num_travellers !== '') {
    const n = Number(body.num_travellers);
    if (!Number.isInteger(n) || n < 1 || n > 99) {
      return res.status(400).json({ error: 'Number of travellers must be between 1 and 99.' });
    }
    num_travellers = n;
  }

  const { error } = await supabase.from('bookings').insert({
    full_name,
    email,
    phone,
    travel_date,
    num_travellers,
    destination,
    message,
    service,
  });

  if (error) {
    console.error('Failed to save booking:', error.message);
    return res.status(500).json({ error: 'Unable to save your enquiry right now. Please try again or contact us on WhatsApp.' });
  }

  return res.status(201).json({ status: 'success' });
}
