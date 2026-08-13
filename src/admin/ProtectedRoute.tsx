import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LoadingState } from './components/States';
import type { AdminProfile } from '../lib/types';

/** Gates every /admin/* route except login/forgot/reset-password. */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  /** Restrict to specific roles (e.g. ['super_admin'] or ['super_admin', 'admin']). Omit to allow any active admin. */
  allowedRoles?: AdminProfile['role'][];
}) {
  const { session, admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50">
        <LoadingState label="Checking your session..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!admin || !admin.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50 px-6">
        <div className="text-center max-w-sm">
          <h1 className="font-display text-xl font-bold text-forest-900 mb-2">No dashboard access</h1>
          <p className="text-sm text-forest-600">
            Your account isn't set up as an admin, or has been deactivated. Contact a Super Admin if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
