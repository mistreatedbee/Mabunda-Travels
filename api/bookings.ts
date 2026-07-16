import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: { persistSession: false },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase configuration is missing.' });
  }

  const {
    full_name,
    email,
    phone,
    travel_date,
    num_travellers,
    destination,
    message,
  } = req.body || {};

  if (!full_name || !email || !phone) {
    return res.status(400).json({ error: 'Full name, email, and phone are required.' });
  }

  const payload = {
    full_name: String(full_name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    travel_date: travel_date || null,
    num_travellers: num_travellers ? Number(num_travellers) : null,
    destination: destination || null,
    message: message ? String(message).trim() : null,
  };

  const { error } = await supabase.from('bookings').insert(payload);

  if (error) {
    return res.status(500).json({ error: error.message || 'Unable to save booking.' });
  }

  return res.status(201).json({ status: 'success' });
}
