#!/usr/bin/env node
// One-off script: creates the first Super Admin account.
//
// Usage:
//   node scripts/seed-admin.mjs --email you@example.com --name "Full Name"
//
// Requires SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SECRET_KEY in
// the environment (already present in .env for this project). Never commit
// real output from this script — it prints a one-time password-set link.

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
    // .env is optional if the caller already exported the vars
  }
}

function parseArgs(argv) {
  const args = { role: 'super_admin' };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--email') args.email = argv[++i];
    else if (arg === '--name') args.name = argv[++i];
    else if (arg === '--role') args.role = argv[++i];
  }
  return args;
}

async function main() {
  loadDotEnv();

  const { email, name, role } = parseArgs(process.argv.slice(2));
  if (!email) {
    console.error('Usage: node scripts/seed-admin.mjs --email you@example.com --name "Full Name" [--role super_admin|admin|editor]');
    process.exit(1);
  }
  if (!['super_admin', 'admin', 'editor'].includes(role)) {
    console.error(`Invalid role "${role}". Must be super_admin, admin, or editor.`);
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in the environment.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Creating admin user for ${email} (role: ${role})...`);

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: name || '' },
  });

  if (createError) {
    console.error('Failed to create auth user:', createError.message);
    process.exit(1);
  }

  const userId = created.user.id;

  const { error: profileError } = await supabase.from('admins').upsert({
    id: userId,
    email,
    full_name: name || '',
    role,
    is_active: true,
  });

  if (profileError) {
    console.error('Auth user created, but failed to write the admins row:', profileError.message);
    console.error(`You can retry by manually upserting: id=${userId}, email=${email}, role=${role}`);
    process.exit(1);
  }

  const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  if (linkError) {
    console.warn('Admin created, but could not generate a password-set link:', linkError.message);
    console.warn('Use "Forgot password" on the /admin/login page instead.');
  } else {
    console.log('\nAdmin account created. Send this one-time link to set a password:');
    console.log(link.properties.action_link);
  }
}

main();
