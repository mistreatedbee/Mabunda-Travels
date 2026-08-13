import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Faq } from '../../../lib/types';
import AdminPageHeader from '../../components/AdminPageHeader';
import { Field, TextInput, TextArea, Select, Toggle } from '../../components/FormFields';
import { LoadingState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

interface FaqFormState {
  question: string;
  answer: string;
  category: Faq['category'];
  published: boolean;
}

const EMPTY: FaqFormState = { question: '', answer: '', category: 'general', published: true };

export default function FaqForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState<FaqFormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    supabase.from('faqs').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error || !data) setLoadError(true);
      else setForm({ question: data.question, answer: data.answer, category: data.category, published: data.published });
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof FaqFormState>(key: K, value: FaqFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.question.trim()) next.question = 'Question is required.';
    if (!form.answer.trim()) next.answer = 'Answer is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    if (isNew) {
      const { data: maxRow } = await supabase.from('faqs').select('display_order').order('display_order', { ascending: false }).limit(1).maybeSingle();
      const nextOrder = (maxRow?.display_order ?? -1) + 1;
      const { error: insertError } = await supabase.from('faqs').insert({ ...form, question: form.question.trim(), answer: form.answer.trim(), display_order: nextOrder });
      setSaving(false);
      if (insertError) {
        showError('Something went wrong while saving this FAQ. Please try again.');
        return;
      }
    } else {
      const { error: updateError } = await supabase.from('faqs').update({ ...form, question: form.question.trim(), answer: form.answer.trim() }).eq('id', id);
      setSaving(false);
      if (updateError) {
        showError('Something went wrong while saving this FAQ. Please try again.');
        return;
      }
    }

    showSuccess(isNew ? 'FAQ created.' : 'FAQ updated.');
    navigate('/admin/faqs');
  }

  if (loading) return <LoadingState label="Loading FAQ..." />;
  if (loadError) return <ErrorState message="Couldn't find this FAQ." />;

  return (
    <div>
      <Link to="/admin/faqs" className="inline-flex items-center gap-1.5 text-sm text-forest-500 hover:text-forest-800 mb-4">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to FAQs
      </Link>
      <AdminPageHeader title={isNew ? 'New FAQ' : 'Edit FAQ'} />

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <Field label="Question" htmlFor="faq-question" required error={errors.question}>
            <TextInput id="faq-question" value={form.question} onChange={(e) => update('question', e.target.value)} />
          </Field>
          <Field label="Answer" htmlFor="faq-answer" required error={errors.answer}>
            <TextArea id="faq-answer" rows={5} value={form.answer} onChange={(e) => update('answer', e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5 items-center">
            <Field label="Category" htmlFor="faq-category" hint="'Booking' FAQs also appear on the Contact page.">
              <Select id="faq-category" value={form.category} onChange={(e) => update('category', e.target.value as Faq['category'])}>
                <option value="general">General</option>
                <option value="booking">Booking</option>
              </Select>
            </Field>
            <Toggle id="faq-published" checked={form.published} onChange={(v) => update('published', v)} label="Published (visible on the website)" />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/faqs" className="px-4 py-2.5 rounded-xl text-sm font-medium text-forest-700 hover:bg-gray-100">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-6 py-2.5 rounded-xl transition-all">
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            {isNew ? 'Create FAQ' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
