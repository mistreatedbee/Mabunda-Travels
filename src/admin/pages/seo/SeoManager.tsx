import { useEffect, useState, type FormEvent } from 'react';
import { ExternalLink, Loader2, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { COMPANY } from '../../../lib/company';
import { HOMEPAGE_DEFAULTS, HOMEPAGE_CONTENT_PATH, mergeHomepageContent, type HomepageContentData } from '../../../lib/homepage';
import { getSitePage } from '../../../lib/sitePages';
import type { Faq, SeoPageOverride, Testimonial, Tour } from '../../../lib/types';
import { useAuth } from '../../AuthContext';
import AdminPageHeader from '../../components/AdminPageHeader';
import { LoadingState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';
import HomepageVisualManager from './HomepageVisualManager';

interface SeoFormState {
  title: string;
  description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  robots_index: boolean;
  canonical_url: string;
}

const EMPTY_SEO: SeoFormState = {
  title: '', description: '', meta_keywords: '', og_title: '', og_description: '',
  og_image_url: '', robots_index: true, canonical_url: '',
};

/** Homepage content + Google/social settings — one screen, plain English. */
export default function SeoManager() {
  const { admin } = useAuth();
  const { showSuccess, showError } = useToast();
  const selected = getSitePage('/');

  const [seoForm, setSeoForm] = useState<SeoFormState>(EMPTY_SEO);
  const [homeForm, setHomeForm] = useState<HomepageContentData>(HOMEPAGE_DEFAULTS);
  const [tours, setTours] = useState<Tour[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadPageData() {
    setLoading(true);
    setLoadError(false);
    try {
      const [seoResult, hpResult, tourRows, faqRows, testimonialRows] = await Promise.all([
        supabase.from('seo_pages').select('*').eq('path', '/').maybeSingle(),
        supabase.from('seo_pages').select('description').eq('path', HOMEPAGE_CONTENT_PATH).maybeSingle(),
        supabase.from('tours').select('*, destination:destinations(name)').order('featured', { ascending: false }).order('updated_at', { ascending: false }),
        supabase.from('faqs').select('*').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('updated_at', { ascending: false }),
      ]);

      if (seoResult.error) throw seoResult.error;

      const seoData = seoResult.data as SeoPageOverride | null;
      setSeoForm(
        seoData
          ? {
              title: seoData.title || '',
              description: seoData.description || '',
              meta_keywords: seoData.meta_keywords || '',
              og_title: seoData.og_title || '',
              og_description: seoData.og_description || '',
              og_image_url: seoData.og_image_url || '',
              robots_index: seoData.robots_index,
              canonical_url: seoData.canonical_url || '',
            }
          : EMPTY_SEO
      );

      if (hpResult.data?.description) {
        try {
          setHomeForm(mergeHomepageContent(JSON.parse(hpResult.data.description)));
        } catch {
          setHomeForm(HOMEPAGE_DEFAULTS);
        }
      } else {
        setHomeForm(HOMEPAGE_DEFAULTS);
      }

      setTours((tourRows.data ?? []) as unknown as Tour[]);
      setFaqs(faqRows.data ?? []);
      setTestimonials(testimonialRows.data ?? []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  function updateSeo<K extends keyof SeoFormState>(key: K, value: SeoFormState[K]) {
    setSeoForm((prev) => ({ ...prev, [key]: value }));
  }

  function patchHome<K extends keyof HomepageContentData>(
    key: K,
    value: Partial<HomepageContentData[K]> | HomepageContentData[K]
  ) {
    setHomeForm((prev) => {
      const current = prev[key];
      const next =
        typeof current === 'object' && current !== null && !Array.isArray(current) && typeof value === 'object' && value !== null && !Array.isArray(value)
          ? { ...current, ...value }
          : value;
      return { ...prev, [key]: next as HomepageContentData[K] };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const seoPayload: Record<string, unknown> = {
      path: '/',
      title: seoForm.title.trim() || null,
      description: seoForm.description.trim() || null,
      meta_keywords: seoForm.meta_keywords.trim() || null,
      og_title: seoForm.og_title.trim() || null,
      og_description: seoForm.og_description.trim() || null,
      og_image_url: seoForm.og_image_url || null,
      robots_index: seoForm.robots_index,
      canonical_url: seoForm.canonical_url.trim() || null,
      updated_by: admin?.id,
    };

    let seoResult = await supabase.from('seo_pages').upsert(seoPayload, { onConflict: 'path' });
    if (seoResult.error && seoForm.meta_keywords.trim()) {
      const { meta_keywords: _kw, ...withoutKeywords } = seoPayload;
      seoResult = await supabase.from('seo_pages').upsert(withoutKeywords, { onConflict: 'path' });
    }

    const homeResult = await supabase.from('seo_pages').upsert({
      path: HOMEPAGE_CONTENT_PATH,
      title: 'Homepage content',
      description: JSON.stringify(homeForm),
      robots_index: false,
      updated_by: admin?.id ?? null,
    }, { onConflict: 'path' });

    setSaving(false);

    if (seoResult.error || homeResult.error) {
      showError('Could not save your changes. Please try again.');
      return;
    }

    showSuccess('Homepage saved — your changes are now live on the website.');
  }

  const previewTitle = seoForm.title.trim() || selected.title;
  const previewDescription = seoForm.description.trim() || selected.description;
  const previewUrl = seoForm.canonical_url.trim() || COMPANY.siteUrl;
  const previewOgTitle = seoForm.og_title.trim() || previewTitle;
  const previewOgDescription = seoForm.og_description.trim() || previewDescription;
  const siteHost = COMPANY.siteUrl.replace('https://', '');

  if (loadError) return <ErrorState message="Could not load the homepage. Please refresh and try again." onRetry={loadPageData} />;

  return (
    <div>
      <AdminPageHeader
        title="Edit Homepage"
        subtitle="Each section below shows what visitors currently see. Click Edit, make your changes, then click Save Homepage at the bottom."
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-gold-dark border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-white transition-colors"
          >
            <ExternalLink size={16} aria-hidden="true" />
            View live homepage
          </a>
        }
      />

      {loading ? (
        <LoadingState label="Loading homepage…" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <HomepageVisualManager
            form={homeForm}
            seoForm={seoForm}
            selected={selected}
            tours={tours}
            faqs={faqs}
            testimonials={testimonials}
            previewTitle={previewTitle}
            previewDescription={previewDescription}
            previewUrl={previewUrl}
            previewOgTitle={previewOgTitle}
            previewOgDescription={previewOgDescription}
            siteHost={siteHost}
            onPatch={patchHome}
            onUpdateSeo={updateSeo}
          />

          <div className="sticky bottom-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-lg">
            <p className="text-sm text-forest-600">
              <strong>Remember:</strong> click <em>Done</em> inside each section after editing, then save here to publish.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-8 py-3 rounded-xl transition-all flex-shrink-0"
            >
              {saving ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
              Save Homepage
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
