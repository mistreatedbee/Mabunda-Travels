import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../AuthContext';
import type { BusinessHours, Settings as SettingsRow, SocialLinks } from '../../lib/types';
import AdminPageHeader from '../components/AdminPageHeader';
import { Field, TextInput, TextArea, Toggle } from '../components/FormFields';
import { LoadingState, ErrorState } from '../components/States';
import { useToast } from '../components/Toast';

interface SettingsFormState {
  phone: string;
  phone_intl: string;
  email: string;
  whatsapp_number: string;
  address: string;
  hours: BusinessHours[];
  social_links: SocialLinks;
  booking_notification_email: string;
  auto_response_enabled: boolean;
  auto_response_message: string;
  tripadvisor_url: string;
  tripadvisor_review_url: string;
  maintenance_mode: boolean;
  maintenance_message: string;
}

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'twitter', label: 'X / Twitter' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
];

export default function Settings() {
  const { admin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState<SettingsFormState | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        setLoadError(true);
        return;
      }
      const row = data as SettingsRow;
      setForm({
        phone: row.phone,
        phone_intl: row.phone_intl,
        email: row.email,
        whatsapp_number: row.whatsapp_number,
        address: row.address,
        hours: row.hours?.length ? row.hours : [],
        social_links: row.social_links || {},
        booking_notification_email: row.booking_notification_email || '',
        auto_response_enabled: row.auto_response_enabled,
        auto_response_message: row.auto_response_message || '',
        tripadvisor_url: row.tripadvisor_url || '',
        tripadvisor_review_url: row.tripadvisor_review_url || '',
        maintenance_mode: row.maintenance_mode,
        maintenance_message: row.maintenance_message || '',
      });
    });
  }, []);

  function update<K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateHour(index: number, field: keyof BusinessHours, value: string) {
    if (!form) return;
    const next = form.hours.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    update('hours', next);
  }

  function addHourRow() {
    if (!form) return;
    update('hours', [...form.hours, { days: '', time: '' }]);
  }

  function removeHourRow(index: number) {
    if (!form) return;
    update('hours', form.hours.filter((_, i) => i !== index));
  }

  function updateSocial(key: keyof SocialLinks, value: string) {
    if (!form) return;
    update('social_links', { ...form.social_links, [key]: value || undefined });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    const { error } = await supabase
      .from('settings')
      .update({
        phone: form.phone.trim(),
        phone_intl: form.phone_intl.trim(),
        email: form.email.trim(),
        whatsapp_number: form.whatsapp_number.trim(),
        address: form.address.trim(),
        hours: form.hours.filter((h) => h.days.trim() || h.time.trim()),
        social_links: form.social_links,
        booking_notification_email: form.booking_notification_email.trim() || null,
        auto_response_enabled: form.auto_response_enabled,
        auto_response_message: form.auto_response_message.trim() || null,
        tripadvisor_url: form.tripadvisor_url.trim() || null,
        tripadvisor_review_url: form.tripadvisor_review_url.trim() || null,
        maintenance_mode: form.maintenance_mode,
        maintenance_message: form.maintenance_message.trim() || null,
        updated_by: admin?.id,
      })
      .eq('id', 1);

    setSaving(false);

    if (error) {
      showError('Something went wrong while saving settings. Please try again.');
      return;
    }

    showSuccess('Settings saved — the public website will reflect these changes immediately.');
  }

  if (loadError) return <ErrorState message="Couldn't load business settings." />;
  if (!form) return <LoadingState label="Loading settings..." />;

  return (
    <div>
      <AdminPageHeader
        title="Business Settings"
        subtitle="Contact details, hours and social links used across the whole website."
      />

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Contact details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Phone (display)" htmlFor="s-phone" hint="e.g. 076 812 3456">
              <TextInput id="s-phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </Field>
            <Field label="Phone (international)" htmlFor="s-phone-intl" hint="e.g. +27768123456 — used for tel: links">
              <TextInput id="s-phone-intl" value={form.phone_intl} onChange={(e) => update('phone_intl', e.target.value)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Email" htmlFor="s-email">
              <TextInput id="s-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </Field>
            <Field label="WhatsApp number" htmlFor="s-whatsapp" hint="International format, e.g. +27768123456">
              <TextInput id="s-whatsapp" value={form.whatsapp_number} onChange={(e) => update('whatsapp_number', e.target.value)} />
            </Field>
          </div>
          <Field label="Address" htmlFor="s-address">
            <TextArea id="s-address" rows={2} value={form.address} onChange={(e) => update('address', e.target.value)} />
          </Field>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-forest-900">Business hours</h2>
            <button type="button" onClick={addHourRow} className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-gold-dark">
              <Plus size={14} aria-hidden="true" /> Add row
            </button>
          </div>
          {form.hours.length === 0 && <p className="text-sm text-forest-400">No hours added yet.</p>}
          <div className="space-y-3">
            {form.hours.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <TextInput
                  value={h.days}
                  onChange={(e) => updateHour(i, 'days', e.target.value)}
                  placeholder="e.g. Mon – Fri"
                  aria-label={`Days for row ${i + 1}`}
                  className="flex-1"
                />
                <TextInput
                  value={h.time}
                  onChange={(e) => updateHour(i, 'time', e.target.value)}
                  placeholder="e.g. 07:00 – 18:00"
                  aria-label={`Time for row ${i + 1}`}
                  className="flex-1"
                />
                <button type="button" onClick={() => removeHourRow(i)} className="p-2 text-forest-400 hover:text-red-600" aria-label={`Remove row ${i + 1}`}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Social links</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {SOCIAL_FIELDS.map((s) => (
              <Field key={s.key} label={s.label} htmlFor={`social-${s.key}`}>
                <TextInput
                  id={`social-${s.key}`}
                  type="url"
                  placeholder="https://..."
                  value={form.social_links[s.key] || ''}
                  onChange={(e) => updateSocial(s.key, e.target.value)}
                />
              </Field>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">TripAdvisor</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Profile URL" htmlFor="s-ta-profile" hint="Your TripAdvisor business listing.">
              <TextInput id="s-ta-profile" type="url" placeholder="https://www.tripadvisor.com/..." value={form.tripadvisor_url} onChange={(e) => update('tripadvisor_url', e.target.value)} />
            </Field>
            <Field label="Review URL" htmlFor="s-ta-review" hint='Direct link customers use to leave a review — powers the "Leave us a Review" link on the website.'>
              <TextInput id="s-ta-review" type="url" placeholder="https://www.tripadvisor.com/UserReview..." value={form.tripadvisor_review_url} onChange={(e) => update('tripadvisor_review_url', e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Enquiry preferences</h2>
          <Field label="Notification email" htmlFor="s-notify-email" hint="Where new-enquiry notifications should be sent, once email is set up.">
            <TextInput id="s-notify-email" type="email" value={form.booking_notification_email} onChange={(e) => update('booking_notification_email', e.target.value)} />
          </Field>
          <Toggle
            id="s-auto-response"
            checked={form.auto_response_enabled}
            onChange={(v) => update('auto_response_enabled', v)}
            label="Send an auto-response to customers"
          />
          <Field label="Auto-response message" htmlFor="s-auto-message" hint="Stored for when email sending is connected — not sent automatically yet.">
            <TextArea id="s-auto-message" rows={3} value={form.auto_response_message} onChange={(e) => update('auto_response_message', e.target.value)} />
          </Field>
          <p className="text-xs text-forest-400 bg-forest-50 rounded-xl p-3">
            These preferences are saved for later — actual email sending requires connecting an email provider (Resend, SendGrid, etc.), which is a future phase.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Website</h2>
          <Toggle
            id="s-maintenance"
            checked={form.maintenance_mode}
            onChange={(v) => update('maintenance_mode', v)}
            label="Maintenance mode"
          />
          {form.maintenance_mode && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-800">
                The public website will show a maintenance screen to every visitor. You'll still be able to sign in and manage the dashboard as normal.
              </p>
            </div>
          )}
          <Field label="Maintenance message" htmlFor="s-maintenance-message" hint="Shown to visitors while maintenance mode is on.">
            <TextArea id="s-maintenance-message" rows={2} value={form.maintenance_message} onChange={(e) => update('maintenance_message', e.target.value)} placeholder="We're making some updates and will be back online shortly." />
          </Field>
        </section>

        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-6 py-2.5 rounded-xl transition-all"
          >
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}
