import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../AuthContext';
import { slugify } from '../../../lib/slug';
import type { ContentStatus, Destination, ImageRef } from '../../../lib/types';
import AdminPageHeader from '../../components/AdminPageHeader';
import { Field, TextInput, TextArea, NumberInput, Select, Toggle, TagListInput } from '../../components/FormFields';
import ImageUpload from '../../components/ImageUpload';
import { LoadingState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

interface TourFormState {
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  destination_id: string;
  duration: string;
  starting_location: string;
  highlights: string[];
  activities: string[];
  included: string[];
  excluded: string[];
  price_from: string;
  price_note: string;
  max_travellers: string;
  images: ImageRef[];
  tag: string;
  featured: boolean;
  status: ContentStatus;
  seo_title: string;
  seo_description: string;
}

const EMPTY: TourFormState = {
  name: '', slug: '', short_description: '', full_description: '', destination_id: '',
  duration: '', starting_location: '', highlights: [], activities: [], included: [], excluded: [],
  price_from: '', price_note: '', max_travellers: '', images: [], tag: '', featured: false,
  status: 'draft', seo_title: '', seo_description: '',
};

export default function TourForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { admin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState<TourFormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [destinations, setDestinations] = useState<Pick<Destination, 'id' | 'name'>[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from('destinations').select('id, name').order('name').then(({ data }) => {
      setDestinations(data ?? []);
    });
  }, []);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    supabase.from('tours').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        setLoadError(true);
      } else {
        setForm({
          name: data.name, slug: data.slug, short_description: data.short_description,
          full_description: data.full_description, destination_id: data.destination_id || '',
          duration: data.duration || '', starting_location: data.starting_location || '',
          highlights: data.highlights || [], activities: data.activities || [],
          included: data.included || [], excluded: data.excluded || [],
          price_from: data.price_from?.toString() || '', price_note: data.price_note || '',
          max_travellers: data.max_travellers?.toString() || '', images: data.images || [],
          tag: data.tag || '', featured: data.featured, status: data.status,
          seo_title: data.seo_title || '', seo_description: data.seo_description || '',
        });
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof TourFormState>(key: K, value: TourFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    update('name', name);
    if (!slugTouched) update('slug', slugify(name));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Tour name is required.';
    if (!form.slug.trim()) next.slug = 'Slug is required.';
    else if (!/^[a-z0-9-]+$/.test(form.slug)) next.slug = 'Slug can only contain lowercase letters, numbers and hyphens.';
    if (!form.short_description.trim()) next.short_description = 'A short description is required.';
    if (form.price_from && Number.isNaN(Number(form.price_from))) next.price_from = 'Must be a number.';
    if (form.max_travellers && (!Number.isInteger(Number(form.max_travellers)) || Number(form.max_travellers) < 1)) {
      next.max_travellers = 'Must be a whole number of at least 1.';
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
      short_description: form.short_description.trim(),
      full_description: form.full_description.trim(),
      destination_id: form.destination_id || null,
      duration: form.duration.trim() || null,
      starting_location: form.starting_location.trim() || null,
      highlights: form.highlights,
      activities: form.activities,
      included: form.included,
      excluded: form.excluded,
      price_from: form.price_from ? Number(form.price_from) : null,
      price_note: form.price_note.trim() || null,
      max_travellers: form.max_travellers ? Number(form.max_travellers) : null,
      images: form.images,
      tag: form.tag.trim() || null,
      featured: form.featured,
      status: form.status,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      updated_by: admin?.id,
    };

    const result = isNew
      ? await supabase.from('tours').insert({ ...payload, created_by: admin?.id })
      : await supabase.from('tours').update(payload).eq('id', id);

    setSaving(false);

    if (result.error) {
      if (result.error.message.includes('duplicate') || result.error.message.includes('unique')) {
        setErrors({ slug: 'This slug is already in use — please choose another.' });
        showError('Something went wrong while saving this tour. Please check the highlighted field.');
      } else {
        showError('Something went wrong while saving this tour. Please try again.');
      }
      return;
    }

    showSuccess(isNew ? 'Tour created.' : 'Tour updated.');
    navigate('/admin/tours');
  }

  if (loading) return <LoadingState label="Loading tour..." />;
  if (loadError) return <ErrorState message="Couldn't find this tour." />;

  return (
    <div>
      <Link to="/admin/tours" className="inline-flex items-center gap-1.5 text-sm text-forest-500 hover:text-forest-800 mb-4">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to tours
      </Link>
      <AdminPageHeader title={isNew ? 'New tour' : `Edit ${form.name || 'tour'}`} />

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Tour name" htmlFor="tour-name" required error={errors.name}>
              <TextInput id="tour-name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
            </Field>
            <Field label="Slug" htmlFor="tour-slug" required error={errors.slug} hint="Used in the page URL.">
              <TextInput
                id="tour-slug"
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); update('slug', e.target.value); }}
              />
            </Field>
          </div>
          <Field label="Short description" htmlFor="tour-short" required error={errors.short_description} hint="Shown on the tour card (front side).">
            <TextArea id="tour-short" rows={2} value={form.short_description} onChange={(e) => update('short_description', e.target.value)} />
          </Field>
          <Field label="Full description" htmlFor="tour-full" hint="Shown when the card is flipped / on the detail view.">
            <TextArea id="tour-full" rows={4} value={form.full_description} onChange={(e) => update('full_description', e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Destination" htmlFor="tour-destination">
              <Select id="tour-destination" value={form.destination_id} onChange={(e) => update('destination_id', e.target.value)}>
                <option value="">— None —</option>
                {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </Field>
            <Field label="Tag" htmlFor="tour-tag" hint="e.g. Wildlife, Scenic, Adventure, Conservation">
              <TextInput id="tour-tag" value={form.tag} onChange={(e) => update('tag', e.target.value)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Duration" htmlFor="tour-duration" hint="e.g. Half day, Full day, 3 hours">
              <TextInput id="tour-duration" value={form.duration} onChange={(e) => update('duration', e.target.value)} />
            </Field>
            <Field label="Starting location" htmlFor="tour-start">
              <TextInput id="tour-start" value={form.starting_location} onChange={(e) => update('starting_location', e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Details</h2>
          <Field label="Highlights" htmlFor="tour-highlights" hint="Press Enter or comma to add each highlight.">
            <TagListInput id="tour-highlights" value={form.highlights} onChange={(v) => update('highlights', v)} placeholder="Add a highlight..." />
          </Field>
          <Field label="Activities" htmlFor="tour-activities">
            <TagListInput id="tour-activities" value={form.activities} onChange={(v) => update('activities', v)} placeholder="Add an activity..." />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="What's included" htmlFor="tour-included">
              <TagListInput id="tour-included" value={form.included} onChange={(v) => update('included', v)} placeholder="Add an inclusion..." />
            </Field>
            <Field label="What's excluded" htmlFor="tour-excluded">
              <TagListInput id="tour-excluded" value={form.excluded} onChange={(v) => update('excluded', v)} placeholder="Add an exclusion..." />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Pricing &amp; capacity</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Price from (ZAR)" htmlFor="tour-price" error={errors.price_from}>
              <NumberInput id="tour-price" min="0" value={form.price_from} onChange={(e) => update('price_from', e.target.value)} />
            </Field>
            <Field label="Price note" htmlFor="tour-price-note" hint="e.g. per person, sharing">
              <TextInput id="tour-price-note" value={form.price_note} onChange={(e) => update('price_note', e.target.value)} />
            </Field>
            <Field label="Max travellers" htmlFor="tour-max" error={errors.max_travellers}>
              <NumberInput id="tour-max" min="1" value={form.max_travellers} onChange={(e) => update('max_travellers', e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Images</h2>
          <ImageUpload value={form.images} onChange={(v) => update('images', v)} folder="tours" />
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">SEO</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="SEO title" htmlFor="tour-seo-title" hint="Defaults to the tour name if left blank.">
              <TextInput id="tour-seo-title" value={form.seo_title} onChange={(e) => update('seo_title', e.target.value)} maxLength={70} />
            </Field>
            <Field label="SEO description" htmlFor="tour-seo-desc">
              <TextInput id="tour-seo-desc" value={form.seo_description} onChange={(e) => update('seo_description', e.target.value)} maxLength={160} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Publishing</h2>
          <div className="grid sm:grid-cols-2 gap-5 items-center">
            <Field label="Status" htmlFor="tour-status">
              <Select id="tour-status" value={form.status} onChange={(e) => update('status', e.target.value as ContentStatus)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Toggle id="tour-featured" checked={form.featured} onChange={(v) => update('featured', v)} label="Feature this tour" />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/tours" className="px-4 py-2.5 rounded-xl text-sm font-medium text-forest-700 hover:bg-gray-100">Cancel</Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-6 py-2.5 rounded-xl transition-all"
          >
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            {isNew ? 'Create tour' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
