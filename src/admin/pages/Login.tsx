import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Seo from '../../components/Seo';
import { useAuth } from '../AuthContext';
import { friendlyAuthError } from '../lib/authErrors';
import { Field, TextInput } from '../components/FormFields';

const MAX_ATTEMPTS_BEFORE_HINT = 3;

export default function Login() {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  if (!loading && session) {
    const from = (location.state as { from?: string } | null)?.from || '/admin';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setSubmitting(false);
    if (signInError) {
      setAttempts((a) => a + 1);
      setError(friendlyAuthError(signInError.message));
    }
  }

  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center px-5">
      <Seo title="Admin Sign In | Mabunda Travel & Tours" description="Admin dashboard sign in." path="/admin/login" noindex />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="Mabunda Travel & Tours" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 shadow-lg" />
          <h1 className="font-display text-white text-xl font-bold">Admin Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">Mabunda Travel &amp; Tours</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-7 shadow-xl space-y-5" noValidate>
          <Field label="Email address" htmlFor="login-email" required>
            <TextInput
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="login-password" required>
            <TextInput
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {error && (
            <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-red-700 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {attempts >= MAX_ATTEMPTS_BEFORE_HINT && (
            <p className="text-xs text-forest-500 text-center">
              Trouble signing in? <Link to="/admin/forgot-password" className="text-forest-800 font-medium underline">Reset your password</Link>.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold py-3 rounded-xl transition-all"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
            Sign in
          </button>

          <div className="text-center">
            <Link to="/admin/forgot-password" className="text-xs text-forest-500 hover:text-forest-800">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
