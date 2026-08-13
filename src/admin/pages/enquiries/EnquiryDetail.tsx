import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MessageCircle, Archive, ArchiveRestore,
  Calendar, Users2, MapPin, Loader2, Send,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../AuthContext';
import type { Enquiry, EnquiryNote, EnquiryStatus } from '../../../lib/types';
import AdminPageHeader from '../../components/AdminPageHeader';
import EnquiryStatusBadge from '../../components/EnquiryStatusBadge';
import { Field, TextInput, Select } from '../../components/FormFields';
import { LoadingState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

const STATUS_OPTIONS: EnquiryStatus[] = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'];

function waLink(phone: string, message: string): string {
  const digits = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function EnquiryDetail() {
  const { id } = useParams();
  const { admin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState<EnquiryNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [savingLocations, setSavingLocations] = useState(false);

  const [statusSaving, setStatusSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  async function load() {
    setLoading(true);
    setLoadError(false);

    const [{ data: enq, error: enqError }, { data: noteRows }] = await Promise.all([
      supabase.from('bookings').select('*').eq('id', id).maybeSingle(),
      supabase.from('enquiry_notes').select('*, admin:admins(id, full_name, email)').eq('booking_id', id).order('created_at', { ascending: false }),
    ]);

    if (enqError || !enq) {
      setLoadError(true);
    } else {
      setEnquiry(enq as Enquiry);
      setPickup(enq.pickup_location || '');
      setDropoff(enq.dropoff_location || '');
      setNotes((noteRows ?? []) as EnquiryNote[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: EnquiryStatus) {
    if (!enquiry) return;
    setStatusSaving(true);
    const { error } = await supabase.from('bookings').update({ status }).eq('id', enquiry.id);
    setStatusSaving(false);
    if (error) {
      showError('Could not update the status. Please try again.');
    } else {
      setEnquiry({ ...enquiry, status });
      showSuccess('Status updated.');
    }
  }

  async function handleToggleArchive() {
    if (!enquiry) return;
    setArchiving(true);
    const { error } = await supabase.from('bookings').update({ archived: !enquiry.archived }).eq('id', enquiry.id);
    setArchiving(false);
    if (error) {
      showError('Could not update this enquiry. Please try again.');
    } else {
      setEnquiry({ ...enquiry, archived: !enquiry.archived });
      showSuccess(enquiry.archived ? 'Enquiry restored.' : 'Enquiry archived.');
    }
  }

  async function handleSaveLocations(e: FormEvent) {
    e.preventDefault();
    if (!enquiry) return;
    setSavingLocations(true);
    const { error } = await supabase
      .from('bookings')
      .update({ pickup_location: pickup.trim() || null, dropoff_location: dropoff.trim() || null })
      .eq('id', enquiry.id);
    setSavingLocations(false);
    if (error) {
      showError('Could not save pickup/drop-off details. Please try again.');
    } else {
      showSuccess('Pickup/drop-off details saved.');
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!enquiry || !noteDraft.trim()) return;
    setSavingNote(true);
    const { data, error } = await supabase
      .from('enquiry_notes')
      .insert({ booking_id: enquiry.id, admin_id: admin?.id, note: noteDraft.trim() })
      .select('*, admin:admins(id, full_name, email)')
      .single();
    setSavingNote(false);
    if (error) {
      showError('Could not save this note. Please try again.');
    } else {
      setNotes((prev) => [data as EnquiryNote, ...prev]);
      setNoteDraft('');
    }
  }

  if (loading) return <LoadingState label="Loading enquiry..." />;
  if (loadError || !enquiry) return <ErrorState message="Couldn't find this enquiry." />;

  return (
    <div>
      <Link to="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm text-forest-500 hover:text-forest-800 mb-4">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to enquiries
      </Link>

      <AdminPageHeader
        title={enquiry.full_name}
        subtitle={`Submitted ${new Date(enquiry.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}`}
        action={
          <div className="flex items-center gap-3">
            <EnquiryStatusBadge status={enquiry.status} />
            <button
              onClick={handleToggleArchive}
              disabled={archiving}
              className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-forest-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
            >
              {archiving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : enquiry.archived ? <ArchiveRestore size={15} aria-hidden="true" /> : <Archive size={15} aria-hidden="true" />}
              {enquiry.archived ? 'Restore' : 'Archive'}
            </button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
            <h2 className="font-display font-semibold text-forest-900">Enquiry details</h2>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-forest-400 text-xs uppercase tracking-wide mb-1">Email</dt>
                <dd className="text-forest-900 font-medium break-all">{enquiry.email}</dd>
              </div>
              <div>
                <dt className="text-forest-400 text-xs uppercase tracking-wide mb-1">Phone</dt>
                <dd className="text-forest-900 font-medium">{enquiry.phone}</dd>
              </div>
              <div>
                <dt className="text-forest-400 text-xs uppercase tracking-wide mb-1">Service</dt>
                <dd className="text-forest-900 font-medium">{enquiry.service || '—'}</dd>
              </div>
              <div>
                <dt className="text-forest-400 text-xs uppercase tracking-wide mb-1">Destination</dt>
                <dd className="text-forest-900 font-medium">{enquiry.destination || '—'}</dd>
              </div>
              <div>
                <dt className="text-forest-400 text-xs uppercase tracking-wide mb-1 flex items-center gap-1"><Calendar size={11} aria-hidden="true" /> Travel date</dt>
                <dd className="text-forest-900 font-medium">{enquiry.travel_date ? new Date(enquiry.travel_date).toLocaleDateString('en-ZA') : 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-forest-400 text-xs uppercase tracking-wide mb-1 flex items-center gap-1"><Users2 size={11} aria-hidden="true" /> Travellers</dt>
                <dd className="text-forest-900 font-medium">{enquiry.num_travellers ?? 'Not specified'}</dd>
              </div>
            </dl>
            {enquiry.message && (
              <div>
                <dt className="text-forest-400 text-xs uppercase tracking-wide mb-1.5">Message</dt>
                <dd className="text-forest-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{enquiry.message}</dd>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <h2 className="font-display font-semibold text-forest-900 flex items-center gap-2">
              <MapPin size={16} className="text-forest-400" aria-hidden="true" />
              Pickup &amp; drop-off
            </h2>
            <form onSubmit={handleSaveLocations} className="grid sm:grid-cols-2 gap-4 items-end">
              <Field label="Pickup location" htmlFor="pickup">
                <TextInput id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="e.g. KMIA Airport" />
              </Field>
              <Field label="Drop-off location" htmlFor="dropoff">
                <TextInput id="dropoff" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="e.g. Kapama Lodge" />
              </Field>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={savingLocations}
                  className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  {savingLocations && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                  Save
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <h2 className="font-display font-semibold text-forest-900">Internal notes</h2>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={3}
                placeholder="Add a note for the team — call outcomes, quote sent, follow-up reminders..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-sm resize-y"
              />
              <button
                type="submit"
                disabled={savingNote || !noteDraft.trim()}
                className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                {savingNote ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}
                Add note
              </button>
            </form>

            {notes.length > 0 && (
              <ul className="space-y-3 pt-2">
                {notes.map((n) => (
                  <li key={n.id} className="bg-gray-50 rounded-xl p-4 text-sm">
                    <p className="text-forest-800 whitespace-pre-wrap">{n.note}</p>
                    <p className="text-xs text-forest-400 mt-2">
                      {n.admin?.full_name || n.admin?.email || 'Unknown admin'} &middot; {new Date(n.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <h2 className="font-display font-semibold text-forest-900">Status</h2>
            <Field label="Status" htmlFor="enquiry-status">
              <Select
                id="enquiry-status"
                value={enquiry.status}
                disabled={statusSaving}
                onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </Select>
            </Field>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-3">
            <h2 className="font-display font-semibold text-forest-900 mb-1">Quick actions</h2>
            <a href={`mailto:${enquiry.email}`} className="flex items-center gap-3 text-sm text-forest-700 hover:text-gold-dark py-2">
              <Mail size={16} aria-hidden="true" /> Reply by email
            </a>
            <a href={`tel:${enquiry.phone}`} className="flex items-center gap-3 text-sm text-forest-700 hover:text-gold-dark py-2">
              <Phone size={16} aria-hidden="true" /> Call {enquiry.phone}
            </a>
            <a
              href={waLink(enquiry.phone, `Hi ${enquiry.full_name}, thanks for your enquiry with Mabunda Travel & Tours!`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-forest-700 hover:text-gold-dark py-2"
            >
              <MessageCircle size={16} aria-hidden="true" /> Message on WhatsApp
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
