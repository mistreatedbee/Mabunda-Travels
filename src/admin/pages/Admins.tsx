import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, UserPlus, ShieldOff, ShieldCheck, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AdminProfile } from '../../lib/types';
import { useAuth } from '../AuthContext';
import AdminPageHeader from '../components/AdminPageHeader';
import { Field, TextInput, Select } from '../components/FormFields';
import { LoadingState, ErrorState } from '../components/States';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

const ROLE_LABEL: Record<AdminProfile['role'], string> = {
  super_admin: 'Super Admin', admin: 'Admin', editor: 'Editor',
};

export default function Admins() {
  const { admin: me, session } = useAuth();
  const { showSuccess, showError } = useToast();

  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminProfile['role']>('editor');
  const [inviting, setInviting] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [toToggle, setToToggle] = useState<AdminProfile | null>(null);
  const [toggling, setToggling] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    const { data, error: queryError } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
    if (queryError) setError(true);
    else setAdmins((data ?? []) as AdminProfile[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setResetLink(null);

    try {
      const response = await fetch('/api/admin-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ email: inviteEmail.trim(), full_name: inviteName.trim(), role: inviteRole }),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok) {
        showError(body?.error || 'Could not add this admin. Please try again.');
        return;
      }

      showSuccess(`${inviteEmail} was added as ${ROLE_LABEL[inviteRole]}.`);
      setResetLink(body?.reset_link || null);
      setInviteEmail('');
      setInviteName('');
      setInviteRole('editor');
      load();
    } catch {
      showError('Network error. Please check your connection and try again.');
    } finally {
      setInviting(false);
    }
  }

  async function handleToggleActive() {
    if (!toToggle) return;
    setToggling(true);
    const { error: updateError } = await supabase.from('admins').update({ is_active: !toToggle.is_active }).eq('id', toToggle.id);
    setToggling(false);
    setToToggle(null);
    if (updateError) {
      showError('Could not update this admin. Please try again.');
    } else {
      showSuccess(`${toToggle.email} was ${toToggle.is_active ? 'deactivated' : 'reactivated'}.`);
      load();
    }
  }

  async function handleRoleChange(admin: AdminProfile, role: AdminProfile['role']) {
    const { error: updateError } = await supabase.from('admins').update({ role }).eq('id', admin.id);
    if (updateError) {
      showError('Could not update this admin\'s role.');
    } else {
      showSuccess(`${admin.email} is now ${ROLE_LABEL[role]}.`);
      load();
    }
  }

  function copyLink() {
    if (!resetLink) return;
    navigator.clipboard.writeText(resetLink).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <AdminPageHeader title="Admin Users" subtitle="Manage who can access this dashboard and what they can do." />

      <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-6">
        <h2 className="font-display font-semibold text-forest-900 mb-4">Add a new admin</h2>
        <form onSubmit={handleInvite} className="grid sm:grid-cols-4 gap-4 items-end">
          <Field label="Email" htmlFor="invite-email" required>
            <TextInput id="invite-email" type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          </Field>
          <Field label="Full name" htmlFor="invite-name">
            <TextInput id="invite-name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
          </Field>
          <Field label="Role" htmlFor="invite-role">
            <Select id="invite-role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as AdminProfile['role'])}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </Field>
          <button
            type="submit"
            disabled={inviting}
            className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors h-[42px]"
          >
            {inviting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <UserPlus size={16} aria-hidden="true" />}
            Add admin
          </button>
        </form>

        {resetLink && (
          <div className="mt-4 flex items-center gap-2 bg-forest-50 border border-forest-100 rounded-xl p-3">
            <p className="text-xs text-forest-700 flex-1 break-all">
              Share this one-time link so they can set their password: <span className="font-medium">{resetLink}</span>
            </p>
            <button onClick={copyLink} className="flex-shrink-0 p-2 text-forest-600 hover:text-forest-900" aria-label="Copy link">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading && <LoadingState label="Loading admins..." />}
        {!loading && error && <ErrorState message="Couldn't load admin users." onRetry={load} />}
        {!loading && !error && (
          <ul className="divide-y divide-gray-100">
            {admins.map((a) => (
              <li key={a.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-forest-900 text-sm">{a.full_name || a.email}</span>
                    {!a.is_active && <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>}
                    {a.id === me?.id && <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark">You</span>}
                  </div>
                  <p className="text-xs text-forest-500">{a.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={a.role}
                    onChange={(e) => handleRoleChange(a, e.target.value as AdminProfile['role'])}
                    disabled={a.id === me?.id}
                    className="!py-1.5 !text-xs w-auto"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </Select>
                  <button
                    onClick={() => setToToggle(a)}
                    disabled={a.id === me?.id}
                    className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                    aria-label={a.is_active ? `Deactivate ${a.email}` : `Reactivate ${a.email}`}
                  >
                    {a.is_active ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={!!toToggle}
        title={toToggle?.is_active ? 'Deactivate this admin?' : 'Reactivate this admin?'}
        message={
          toToggle?.is_active
            ? `${toToggle?.email} will immediately lose access to the dashboard.`
            : `${toToggle?.email} will regain access to the dashboard.`
        }
        confirmLabel={toToggle?.is_active ? 'Deactivate' : 'Reactivate'}
        danger={!!toToggle?.is_active}
        loading={toggling}
        onConfirm={handleToggleActive}
        onCancel={() => setToToggle(null)}
      />
    </div>
  );
}
