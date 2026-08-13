import { createClient } from '@supabase/supabase-js';

// Minimal structural types for the Vercel Node request/response — avoids
// pulling in @vercel/node just for typing, while keeping `any` out of scope.
interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}
interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

// Service-role client — never exposed to the browser. Used only to (a) look
// up who is calling via their access token and (b) create the new admin.
const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: { persistSession: false },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_ROLES = new Set(['super_admin', 'admin', 'editor']);

function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('admin-invite misconfigured: missing Supabase environment variables.');
    return res.status(500).json({ error: 'The admin service is temporarily unavailable.' });
  }

  // Authenticate the caller and confirm they are an active super_admin.
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(token);
  if (callerError || !callerData?.user) {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }

  const { data: callerAdmin, error: callerAdminError } = await supabaseAdmin
    .from('admins')
    .select('role, is_active')
    .eq('id', callerData.user.id)
    .maybeSingle();

  if (callerAdminError || !callerAdmin || !callerAdmin.is_active || callerAdmin.role !== 'super_admin') {
    return res.status(403).json({ error: 'You do not have permission to add admin users.' });
  }

  const body = (req.body as Record<string, unknown>) || {};
  const email = cleanString(body.email, 254);
  const full_name = cleanString(body.full_name, 120) || '';
  const role = typeof body.role === 'string' ? body.role : 'editor';

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!VALID_ROLES.has(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (createError) {
    if (createError.message.toLowerCase().includes('already registered') || createError.message.toLowerCase().includes('already exists')) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    console.error('Failed to create admin auth user:', createError.message);
    return res.status(500).json({ error: 'Unable to create this admin account. Please try again.' });
  }

  const { error: profileError } = await supabaseAdmin.from('admins').insert({
    id: created.user.id,
    email,
    full_name,
    role,
    is_active: true,
  });

  if (profileError) {
    console.error('Failed to write admins row:', profileError.message);
    return res.status(500).json({ error: 'Account created but the admin profile could not be saved. Please contact support.' });
  }

  const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({ type: 'recovery', email });
  if (linkError) {
    console.error('Failed to generate password-set link:', linkError.message);
  }

  return res.status(201).json({
    status: 'success',
    reset_link: link?.properties?.action_link || null,
  });
}
