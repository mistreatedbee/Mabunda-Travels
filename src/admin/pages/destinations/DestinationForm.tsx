import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { slugify } from '../../../lib/slug';
import type { ContentStatus, ImageRef } from '../../../lib/types';
import AdminPageHeader from '../../components/AdminPageHeader';
import { Field, TextInput, TextArea, Select, Toggle, TagListInput } from '../../components/FormFields';
import ImageUpload from '../../components/ImageUpload';
import { LoadingState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

interface DestinationFormState {
  name: string;
  slug: string;
  description: string;
  attractions: string[];
  images: ImageRef[];
  tag: string;
  stat_label: string;
  stat_value: string;
  featured: boolean;
  status: ContentStatus;
  seo_title: string;
  seo_description: string;
}

const EMPTY: DestinationFormState = {
  name: '', slug: '', description: '', attractions: [], images: [], tag: '',
  stat_label: '', stat_value: '', featured: false, status: 'draft', seo_title: '', seo_description: '',
};

export default function DestinationForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState<DestinationFormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    supabase.from('destinations').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        setLoadError(true);
      } else {
        setForm({
          name: data.name, slug: data.slug, description: data.description,
          attractions: data.attractions || [], images: data.images || [], tag: data.tag || '',
          stat_label: data.stat_label || '', stat_value: data.stat_value || '',
          featured: data.featured, status: data.status,
          seo_title: data.seo_title || '', seo_description: data.seo_description || '',
        });
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof DestinationFormState>(key: K, value: DestinationFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    update('name', name);
    if (!slugTouched) update('slug', slugify(name));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Destination name is required.';
    if (!form.slug.trim()) next.slug = 'Slug is required.';
    else if (!/^[a-z0-9-]+$/.test(form.slug)) next.slug = 'Slug can only contain lowercase letters, numbers and hyphens.';
    if (!form.description.trim()) next.description = 'A description is required.';
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
      description: form.description.trim(),
      attractions: form.attractions,
      images: form.images,
      tag: form.tag.trim() || null,
      stat_label: form.stat_label.trim() || null,
      stat_value: form.stat_value.trim() || null,
      featured: form.featured,
      status: form.status,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
    };

    const result = isNew
      ? await supabase.from('destinations').insert(payload)
      : await supabase.from('destinations').update(payload).eq('id', id);

    setSaving(false);

    if (result.error) {
      if (result.error.message.includes('duplicate') || result.error.message.includes('unique')) {
        setErrors({ slug: 'This slug is already in use — please choose another.' });
      }
      showError('Something went wrong while saving this destination. Please try again.');
      return;
    }

    showSuccess(isNew ? 'Destination created.' : 'Destination updated.');
    navigate('/admin/destinations');
  }

  if (loading) return <LoadingState label="Loading destination..." />;
  if (loadError) return <ErrorState message="Couldn't find this destination." />;

  return (
    <div>
      <Link to="/admin/destinations" className="inline-flex items-center gap-1.5 text-sm text-forest-500 hover:text-forest-800 mb-4">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to destinations
      </Link>
      <AdminPageHeader title={isNew ? 'New destination' : `Edit ${form.name || 'destination'}`} />

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name" htmlFor="dest-name" required error={errors.name}>
              <TextInput id="dest-name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
            </Field>
            <Field label="Slug" htmlFor="dest-slug" required error={errors.slug}>
              <TextInput id="dest-slug" value={form.slug} onChange={(e) => { setSlugTouched(true); update('slug', e.target.value); }} />
            </Field>
          </div>
          <Field label="Description" htmlFor="dest-desc" required error={errors.description}>
            <TextArea id="dest-desc" rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </Field>
          <Field label="Attractions" htmlFor="dest-attractions" hint="Press Enter or comma to add each attraction.">
            <TagListInput id="dest-attractions" value={form.attractions} onChange={(v) => update('attractions', v)} placeholder="Add an attraction..." />
          </Field>
          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Tag" htmlFor="dest-tag" hint="e.g. Big Five, Luxury, Hidden Gem">
              <TextInput id="dest-tag" value={form.tag} onChange={(e) => update('tag', e.target.value)} />
            </Field>
            <Field label="Stat label" htmlFor="dest-stat-label" hint="e.g. Total Area">
              <TextInput id="dest-stat-label" value={form.stat_label} onChange={(e) => update('stat_label', e.target.value)} />
            </Field>
            <Field label="Stat value" htmlFor="dest-stat-value" hint="e.g. 53 000 ha">
              <TextInput id="dest-stat-value" value={form.stat_value} onChange={(e) => update('stat_value', e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Images</h2>
          <ImageUpload value={form.images} onChange={(v) => update('images', v)} folder="destinations" />
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">SEO</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="SEO title" htmlFor="dest-seo-title">
              <TextInput id="dest-seo-title" value={form.seo_title} onChange={(e) => update('seo_title', e.target.value)} maxLength={70} />
            </Field>
            <Field label="SEO description" htmlFor="dest-seo-desc">
              <TextInput id="dest-seo-desc" value={form.seo_description} onChange={(e) => update('seo_description', e.target.value)} maxLength={160} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Publishing</h2>
          <div className="grid sm:grid-cols-2 gap-5 items-center">
            <Field label="Status" htmlFor="dest-status">
              <Select id="dest-status" value={form.status} onChange={(e) => update('status', e.target.value as ContentStatus)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Toggle id="dest-featured" checked={form.featured} onChange={(v) => update('featured', v)} label="Feature this destination" />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/destinations" className="px-4 py-2.5 rounded-xl text-sm font-medium text-forest-700 hover:bg-gray-100">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-6 py-2.5 rounded-xl transition-all">
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            {isNew ? 'Create destination' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
