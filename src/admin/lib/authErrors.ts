/** Maps raw Supabase Auth error messages to friendly, non-leaky copy. */
export function friendlyAuthError(message: string | undefined): string {
  const m = (message || '').toLowerCase();

  if (m.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (m.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.';
  }
  if (m.includes('rate limit') || m.includes('too many requests')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (m.includes('user not found')) {
    // Deliberately vague — don't confirm/deny whether an email is registered.
    return 'If an account exists for that email, a reset link has been sent.';
  }
  if (m.includes('password')) {
    return 'Password must be at least 8 characters.';
  }
  if (m.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}
