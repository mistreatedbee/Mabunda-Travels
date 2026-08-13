import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import AdminPageHeader from '../../components/AdminPageHeader';
import { Field, TextInput, TextArea, Select, Toggle } from '../../components/FormFields';
import ImageUpload from '../../components/ImageUpload';
import { LoadingState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

interface TestimonialFormState {
  customer_name: string;
  review: string;
  rating: number;
  customer_location: string;
  photo_url: string;
  source: string;
  featured: boolean;
  published: boolean;
}

const EMPTY: TestimonialFormState = {
  customer_name: '', review: '', rating: 5, customer_location: '', photo_url: '', source: '', featured: false, published: true,
};

export default function TestimonialForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState<TestimonialFormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    supabase.from('testimonials').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        setLoadError(true);
      } else {
        setForm({
          customer_name: data.customer_name, review: data.review, rating: data.rating,
          customer_location: data.customer_location || '', photo_url: data.photo_url || '',
          source: data.source || '', featured: data.featured, published: data.published,
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof TestimonialFormState>(key: K, value: TestimonialFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.customer_name.trim()) next.customer_name = 'Customer name is required.';
    if (!form.review.trim()) next.review = 'Review text is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const payload = {
      customer_name: form.customer_name.trim(),
      review: form.review.trim(),
      rating: form.rating,
      customer_location: form.customer_location.trim() || null,
      photo_url: form.photo_url || null,
      source: form.source.trim() || null,
      featured: form.featured,
      published: form.published,
    };

    const result = isNew
      ? await supabase.from('testimonials').insert(payload)
      : await supabase.from('testimonials').update(payload).eq('id', id);

    setSaving(false);

    if (result.error) {
      showError('Something went wrong while saving this testimonial. Please try again.');
      return;
    }

    showSuccess(isNew ? 'Testimonial added.' : 'Testimonial updated.');
    navigate('/admin/testimonials');
  }

  if (loading) return <LoadingState label="Loading testimonial..." />;
  if (loadError) return <ErrorState message="Couldn't find this testimonial." />;

  return (
    <div>
      <Link to="/admin/testimonials" className="inline-flex items-center gap-1.5 text-sm text-forest-500 hover:text-forest-800 mb-4">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to testimonials
      </Link>
      <AdminPageHeader title={isNew ? 'New testimonial' : `Edit testimonial from ${form.customer_name || '...'}`} />

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Customer name" htmlFor="test-name" required error={errors.customer_name}>
              <TextInput id="test-name" value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)} />
            </Field>
            <Field label="Customer location" htmlFor="test-location" hint="e.g. Johannesburg, South Africa">
              <TextInput id="test-location" value={form.customer_location} onChange={(e) => update('customer_location', e.target.value)} />
            </Field>
          </div>
          <Field label="Review" htmlFor="test-review" required error={errors.review}>
            <TextArea id="test-review" rows={4} value={form.review} onChange={(e) => update('review', e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Rating" htmlFor="test-rating">
              <Select id="test-rating" value={form.rating} onChange={(e) => update('rating', Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
              </Select>
            </Field>
            <Field label="Source" htmlFor="test-source" hint="e.g. Google, TripAdvisor, WhatsApp">
              <TextInput id="test-source" value={form.source} onChange={(e) => update('source', e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h2 className="font-display font-semibold text-forest-900">Photo (optional)</h2>
          <ImageUpload
            value={form.photo_url ? [{ url: form.photo_url, alt: form.customer_name }] : []}
            onChange={(v) => update('photo_url', v[0]?.url || '')}
            folder="testimonials"
            maxImages={1}
          />
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
          <h2 className="font-display font-semibold text-forest-900 mb-1">Publishing</h2>
          <Toggle id="test-featured" checked={form.featured} onChange={(v) => update('featured', v)} label="Feature on the Home page" />
          <Toggle id="test-published" checked={form.published} onChange={(v) => update('published', v)} label="Published (visible on the website)" />
        </section>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/testimonials" className="px-4 py-2.5 rounded-xl text-sm font-medium text-forest-700 hover:bg-gray-100">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-6 py-2.5 rounded-xl transition-all">
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            {isNew ? 'Add testimonial' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
