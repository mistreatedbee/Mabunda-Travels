import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { slugify } from '../../../lib/slug';
import type { ContentStatus, ImageRef, Transfer } from '../../../lib/types';
import AdminPageHeader from '../../components/AdminPageHeader';
import { Field, TextInput, TextArea, NumberInput, Select } from '../../components/FormFields';
import ImageUpload from '../../components/ImageUpload';
import { LoadingState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

interface TransferFormState {
  name: string;
  slug: string;
  type: Transfer['type'];
  pickup_location: string;
  dropoff_location: string;
  description: string;
  vehicle_type: string;
  passenger_capacity: string;
  luggage_capacity: string;
  pricing_type: Transfer['pricing_type'];
  price: string;
  images: ImageRef[];
  availability_note: string;
  seo_title: string;
  seo_description: string;
  status: ContentStatus;
}

const EMPTY: TransferFormState = {
  name: '', slug: '', type: 'private', pickup_location: '', dropoff_location: '', description: '',
  vehicle_type: '', passenger_capacity: '', luggage_capacity: '', pricing_type: 'quote', price: '',
  images: [], availability_note: '', seo_title: '', seo_description: '', status: 'draft',
};

export default function TransferForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState<TransferFormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    supabase.from('transfers').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        setLoadError(true);
      } else {
        setForm({
          name: data.name, slug: data.slug, type: data.type,
          pickup_location: data.pickup_location || '', dropoff_location: data.dropoff_location || '',
          description: data.description, vehicle_type: data.vehicle_type || '',
          passenger_capacity: data.passenger_capacity?.toString() || '',
          luggage_capacity: data.luggage_capacity || '', pricing_type: data.pricing_type,
          price: data.price?.toString() || '', images: data.images || [],
          availability_note: data.availability_note || '', seo_title: data.seo_title || '',
          seo_description: data.seo_description || '', status: data.status,
        });
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof TransferFormState>(key: K, value: TransferFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    update('name', name);
    if (!slugTouched) update('slug', slugify(name));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Transfer name is required.';
    if (!form.slug.trim()) next.slug = 'Slug is required.';
    else if (!/^[a-z0-9-]+$/.test(form.slug)) next.slug = 'Slug can only contain lowercase letters, numbers and hyphens.';
    if (!form.description.trim()) next.description = 'A description is required.';
    if (form.pricing_type === 'fixed' && (!form.price || Number.isNaN(Number(form.price)))) {
      next.price = 'Enter a fixed price, or switch pricing to "Request a Quote".';
    }
    if (form.passenger_capacity && (!Number.isInteger(Number(form.passenger_capacity)) || Number(form.passenger_capacity) < 1)) {
      next.passenger_capacity = 'Must be a whole number of at least 1.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      type: form.type,
      pickup_location: form.pickup_location.trim() || null,
      dropoff_location: form.dropoff_location.trim() || null,
      description: form.description.trim(),
      vehicle_type: form.vehicle_type.trim() || null,
      passenger_capacity: form.passenger_capacity ? Number(form.passenger_capacity) : null,
      luggage_capacity: form.luggage_capacity.trim() || null,
      pricing_type: form.pricing_type,
      price: form.pricing_type === 'fixed' && form.price ? Number(form.price) : null,
      images: form.images,
      availability_note: form.availability_note.trim() || null,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      status: form.status,
    };

    const result = isNew
      ? await supabase.from('transfers').insert(payload)
      : await supabase.from('transfers').update(payload).eq('id', id);

    setSaving(false);

    if (result.error) {
      if (result.error.message.includes('duplicate') || result.error.message.includes('unique')) {
        setErrors({ slug: 'This slug is already in use — please choose another.' });
      }
      showError('Something went wrong while saving this transfer. Please try again.');
      return;
    }

    showSuccess(isNew ? 'Transfer created.' : 'Transfer updated.');
    navigate('/admin/transfers');
  }

  if (loading) return <LoadingState label="Loading transfer..." />;
  if (loadError) return <ErrorState message="Couldn't find this transfer." />;

  return (
    <div>
      <Link to="/admin/transfers" className="inline-flex items-center gap-1.5 text-sm text-forest-500 hover:text-forest-800 mb-4">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to transfers
      </Link>
      <AdminPageHeader title={isNew ? 'New transfer' : `Edit ${form.name || 'transfer'}`} />

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Transfer name" htmlFor="tr-name" required error={errors.name}>
              <TextInput id="tr-name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
            </Field>
            <Field label="Slug" htmlFor="tr-slug" required error={errors.slug}>
              <TextInput id="tr-slug" value={form.slug} onChange={(e) => { setSlugTouched(true); update('slug', e.target.value); }} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Type" htmlFor="tr-type" required>
              <Select id="tr-type" value={form.type} onChange={(e) => update('type', e.target.value as Transfer['type'])}>
                <option value="airport">Airport</option>
                <option value="private">Private</option>
                <option value="destination">Destination</option>
                <option value="custom">Custom</option>
              </Select>
            </Field>
            <Field label="Vehicle type" htmlFor="tr-vehicle" hint="e.g. Sedan, SUV, Minibus">
              <TextInput id="tr-vehicle" value={form.vehicle_type} onChange={(e) => update('vehicle_type', e.target.value)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Pickup location" htmlFor="tr-pickup">
              <TextInput id="tr-pickup" value={form.pickup_location} onChange={(e) => update('pickup_location', e.target.value)} />
            </Field>
            <Field label="Drop-off location" htmlFor="tr-dropoff">
              <TextInput id="tr-dropoff" value={form.dropoff_location} onChange={(e) => update('dropoff_location', e.target.value)} />
            </Field>
          </div>
          <Field label="Description" htmlFor="tr-desc" required error={errors.description}>
            <TextArea id="tr-desc" rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </Field>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Capacity &amp; pricing</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Passenger capacity" htmlFor="tr-pax" error={errors.passenger_capacity}>
              <NumberInput id="tr-pax" min="1" value={form.passenger_capacity} onChange={(e) => update('passenger_capacity', e.target.value)} />
            </Field>
            <Field label="Luggage capacity" htmlFor="tr-luggage" hint="e.g. 4 large bags">
              <TextInput id="tr-luggage" value={form.luggage_capacity} onChange={(e) => update('luggage_capacity', e.target.value)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Pricing" htmlFor="tr-pricing-type">
              <Select id="tr-pricing-type" value={form.pricing_type} onChange={(e) => update('pricing_type', e.target.value as Transfer['pricing_type'])}>
                <option value="quote">Request a Quote</option>
                <option value="fixed">Fixed price</option>
              </Select>
            </Field>
            {form.pricing_type === 'fixed' && (
              <Field label="Price (ZAR)" htmlFor="tr-price" error={errors.price}>
                <NumberInput id="tr-price" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} />
              </Field>
            )}
          </div>
          <Field label="Availability note" htmlFor="tr-availability" hint="e.g. Subject to flight schedule confirmation">
            <TextInput id="tr-availability" value={form.availability_note} onChange={(e) => update('availability_note', e.target.value)} />
          </Field>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Images</h2>
          <ImageUpload value={form.images} onChange={(v) => update('images', v)} folder="transfers" />
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">SEO</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="SEO title" htmlFor="tr-seo-title">
              <TextInput id="tr-seo-title" value={form.seo_title} onChange={(e) => update('seo_title', e.target.value)} maxLength={70} />
            </Field>
            <Field label="SEO description" htmlFor="tr-seo-desc">
              <TextInput id="tr-seo-desc" value={form.seo_description} onChange={(e) => update('seo_description', e.target.value)} maxLength={160} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <h2 className="font-display font-semibold text-forest-900 mb-5">Publishing</h2>
          <Field label="Status" htmlFor="tr-status">
            <Select id="tr-status" value={form.status} onChange={(e) => update('status', e.target.value as ContentStatus)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
        </section>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/transfers" className="px-4 py-2.5 rounded-xl text-sm font-medium text-forest-700 hover:bg-gray-100">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-6 py-2.5 rounded-xl transition-all">
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            {isNew ? 'Create transfer' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
