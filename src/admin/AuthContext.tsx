import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AdminProfile } from '../lib/types';

interface AuthContextValue {
  /** Supabase auth session, or null if signed out. */
  session: Session | null;
  /** The matching `admins` row, or null if this user has no dashboard access. */
  admin: AdminProfile | null;
  /** True while the initial session/profile check is still in flight. */
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAdminProfile(userId: string) {
    const { data, error } = await supabase.from('admins').select('*').eq('id', userId).maybeSingle();
    if (error) {
      console.error('Failed to load admin profile:', error.message);
      setAdmin(null);
      return;
    }
    setAdmin(data as AdminProfile | null);
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) await loadAdminProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession) {
        await loadAdminProfile(newSession.user.id);
        // SIGNED_IN fires on an actual sign-in action, not on session restore
        // (that's INITIAL_SESSION) — so this only logs real logins.
        if (event === 'SIGNED_IN') {
          const { error } = await supabase.from('audit_logs').insert({
            admin_id: newSession.user.id,
            action: 'login',
            resource_type: 'admin',
            resource_id: newSession.user.id,
            resource_label: newSession.user.email,
          });
          if (error) console.error('Failed to record login audit entry:', error.message);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setAdmin(null);
  }

  async function refreshAdmin() {
    if (session) await loadAdminProfile(session.user.id);
  }

  return (
    <AuthContext.Provider value={{ session, admin, loading, signOut, refreshAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
