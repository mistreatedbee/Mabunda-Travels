import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, KeyRound, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { friendlyAuthError } from '../lib/authErrors';
import { Field, TextInput } from '../components/FormFields';

/**
 * Landing page for the Supabase "recovery" email link. Supabase exchanges
 * the link's token for a temporary session automatically (detectSessionInUrl),
 * so this page just needs to capture the new password.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(friendlyAuthError(updateError.message));
      return;
    }

    navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="Mabunda Travel & Tours" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 shadow-lg" />
          <h1 className="font-display text-white text-xl font-bold">Set a new password</h1>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-xl">
          {!ready ? (
            <p className="text-sm text-forest-600 text-center py-6">
              This link is invalid or has expired. Please request a new password reset link.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field label="New password" htmlFor="new-password" required hint="At least 8 characters.">
                <TextInput
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field label="Confirm new password" htmlFor="confirm-password" required>
                <TextInput
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </Field>

              {error && (
                <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-red-700 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold py-3 rounded-xl transition-all"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <KeyRound size={18} aria-hidden="true" />}
                Update password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
