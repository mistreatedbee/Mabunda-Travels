import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Field, TextInput } from '../components/FormFields';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Always show the same success state regardless of whether the email is
    // registered — avoids leaking which addresses have dashboard access.
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    setSubmitting(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="Mabunda Travel & Tours" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 shadow-lg" />
          <h1 className="font-display text-white text-xl font-bold">Reset your password</h1>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-xl">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={36} className="text-forest-700 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-forest-700 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field label="Email address" htmlFor="forgot-email" required hint="We'll send a link to reset your password.">
                <TextInput
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold py-3 rounded-xl transition-all"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Mail size={18} aria-hidden="true" />}
                Send reset link
              </button>
            </form>
          )}

          <Link to="/admin/login" className="flex items-center justify-center gap-1.5 text-xs text-forest-500 hover:text-forest-800 mt-6">
            <ArrowLeft size={14} aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
