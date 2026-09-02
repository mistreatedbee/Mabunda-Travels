import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Save, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../AuthContext';
import { COMPANY } from '../../../lib/company';
import AdminPageHeader from '../../components/AdminPageHeader';
import { Field, TextInput, TextArea, Toggle } from '../../components/FormFields';
import ImageUpload from '../../components/ImageUpload';
import { LoadingState } from '../../components/States';
import { useToast } from '../../components/Toast';

interface PageDefault {
  path: string;
  label: string;
  title: string;
  description: string;
}

// Matches exactly what each page's <Seo title=... description=... path=... /> call
// already renders — these are shown as "what visitors see if you leave this blank."
const PAGES: PageDefault[] = [
  { path: '/', label: 'Home', title: 'Mabunda Travel & Tours | Safari Transfers & Tours — Mpumalanga', description: 'Mabunda Travel & Tours — trusted safari transfers & tours in Mpumalanga. Expert-guided Kruger safaris, airport transfers, group tours & custom adventures.' },
  { path: '/about', label: 'About', title: 'About Us | Mabunda Travel & Tours', description: 'Mabunda Travel & Tours (Pty) Ltd is a registered travel agency in Acornhoek, Mpumalanga, founded by Marvin Mabunda. Learn about our mission, vision and values.' },
  { path: '/services', label: 'Services', title: 'Our Services | Mabunda Travel & Tours', description: 'Safari experiences, group tours, corporate transfers and custom trips — travel services from Mabunda Travel & Tours, Acornhoek, Mpumalanga.' },
  { path: '/maps', label: 'Maps', title: 'Safari Maps — Kruger & Private Reserves | Mabunda Travel & Tours', description: 'Interactive maps of Kruger National Park and the surrounding private game reserves. Plan your safari with Mabunda Travel & Tours — Mpumalanga\'s local transfer experts.' },
  { path: '/gallery', label: 'Gallery', title: 'Photo Gallery | Mabunda Travel & Tours', description: 'Safari and travel photography from Mabunda Travel & Tours — Mpumalanga\'s trusted transfer and tour specialists. Gallery coming soon.' },
  { path: '/contact', label: 'Contact', title: 'Contact & Booking | Mabunda Travel & Tours', description: 'Book your safari or transfer with Mabunda Travel & Tours. Request a personalised quote via our enquiry form, WhatsApp or email — based in Acornhoek, Mpumalanga.' },
  { path: '/privacy-policy', label: 'Privacy Policy', title: 'Privacy Policy | Mabunda Travel & Tours', description: "How Mabunda Travel & Tours (Pty) Ltd collects, uses and protects your personal information in accordance with South Africa's POPIA." },
  { path: '/terms', label: 'Terms & Conditions', title: 'Terms & Conditions | Mabunda Travel & Tours', description: 'Booking terms and conditions for travel packages, tours and services provided by Mabunda Travel & Tours (Pty) Ltd.' },
];

interface SeoFormState {
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  robots_index: boolean;
  canonical_url: string;
}

const EMPTY: SeoFormState = { title: '', description: '', og_title: '', og_description: '', og_image_url: '', robots_index: true, canonical_url: '' };

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default function SeoManager() {
  const { admin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [selected, setSelected] = useState<PageDefault>(PAGES[0]);
  const [form, setForm] = useState<SeoFormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase.from('seo_pages').select('*').eq('path', selected.path).maybeSingle().then(({ data, error }) => {
      // Guard against a slower fetch for a tab the admin has since clicked away
      // from resolving after a faster one and clobbering the form with stale data.
      if (!mounted) return;
      if (error) {
        showError("Couldn't load SEO settings for this page. Please try again.");
        setForm(EMPTY);
        setLoading(false);
        return;
      }
      setForm(
        data
          ? {
              title: data.title || '',
              description: data.description || '',
              og_title: data.og_title || '',
              og_description: data.og_description || '',
              og_image_url: data.og_image_url || '',
              robots_index: data.robots_index,
              canonical_url: data.canonical_url || '',
            }
          : EMPTY
      );
      setLoading(false);
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.path]);

  function update<K extends keyof SeoFormState>(key: K, value: SeoFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('seo_pages').upsert(
      {
        path: selected.path,
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        og_title: form.og_title.trim() || null,
        og_description: form.og_description.trim() || null,
        og_image_url: form.og_image_url || null,
        robots_index: form.robots_index,
        canonical_url: form.canonical_url.trim() || null,
        updated_by: admin?.id,
      },
      { onConflict: 'path' }
    );

    setSaving(false);

    if (error) {
      showError('Something went wrong while saving SEO settings. Please try again.');
      return;
    }
    showSuccess(`SEO settings saved for ${selected.label}.`);
  }

  const previewTitle = form.title.trim() || selected.title;
  const previewDescription = form.description.trim() || selected.description;
  const previewUrl = form.canonical_url.trim() || `${COMPANY.siteUrl}${selected.path === '/' ? '' : selected.path}`;
  const previewOgTitle = form.og_title.trim() || previewTitle;
  const previewOgDescription = form.og_description.trim() || previewDescription;

  return (
    <div>
      <AdminPageHeader title="SEO Manager" subtitle="Override page titles, descriptions and social sharing info. Leave a field blank to use the site's default." />

      <div className="grid lg:grid-cols-4 gap-6">
        <nav className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-2 h-fit">
          {PAGES.map((p) => (
            <button
              key={p.path}
              onClick={() => setSelected(p)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selected.path === p.path ? 'bg-forest-800 text-white' : 'text-forest-700 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <LoadingState label="Loading SEO settings..." />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google-style preview */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h2 className="font-display font-semibold text-forest-900 mb-4 flex items-center gap-2">
                  <Search size={16} className="text-forest-400" aria-hidden="true" />
                  Search result preview
                </h2>
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 font-sans">
                  <p className="text-[#1a0dab] text-lg leading-snug truncate">{truncate(previewTitle, 60)}</p>
                  <p className="text-[#006621] text-sm mb-1">{previewUrl}</p>
                  <p className="text-[#545454] text-sm leading-snug">{truncate(previewDescription, 160)}</p>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
                <h2 className="font-display font-semibold text-forest-900">Page metadata</h2>
                <Field label="Page title" htmlFor="seo-title" hint={`Default: "${selected.title}"`}>
                  <TextInput id="seo-title" value={form.title} onChange={(e) => update('title', e.target.value)} maxLength={70} placeholder={selected.title} />
                </Field>
                <Field label="Meta description" htmlFor="seo-desc" hint={`Default: "${selected.description}"`}>
                  <TextArea id="seo-desc" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} maxLength={160} placeholder={selected.description} />
                </Field>
                <Field label="Canonical URL" htmlFor="seo-canonical" hint="Leave blank to use the real page URL.">
                  <TextInput id="seo-canonical" type="url" value={form.canonical_url} onChange={(e) => update('canonical_url', e.target.value)} placeholder={`${COMPANY.siteUrl}${selected.path === '/' ? '' : selected.path}`} />
                </Field>
                <Toggle id="seo-robots" checked={form.robots_index} onChange={(v) => update('robots_index', v)} label="Allow this page to be indexed by search engines" />
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
                <h2 className="font-display font-semibold text-forest-900">Social sharing (Open Graph)</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Social title" htmlFor="seo-og-title" hint="Defaults to the page title above.">
                    <TextInput id="seo-og-title" value={form.og_title} onChange={(e) => update('og_title', e.target.value)} maxLength={70} />
                  </Field>
                  <Field label="Social description" htmlFor="seo-og-desc" hint="Defaults to the meta description above.">
                    <TextInput id="seo-og-desc" value={form.og_description} onChange={(e) => update('og_description', e.target.value)} maxLength={160} />
                  </Field>
                </div>
                <Field label="Social sharing image" htmlFor="seo-og-image">
                  <ImageUpload
                    value={form.og_image_url ? [{ url: form.og_image_url, alt: previewOgTitle }] : []}
                    onChange={(v) => update('og_image_url', v[0]?.url || '')}
                    folder="seo"
                    maxImages={1}
                  />
                </Field>

                {/* OG card preview */}
                <div className="border border-gray-200 rounded-xl overflow-hidden max-w-sm">
                  {form.og_image_url && <img src={form.og_image_url} alt="" className="w-full h-40 object-cover" />}
                  <div className="p-3 bg-gray-50">
                    <p className="text-[11px] text-forest-400 uppercase">{COMPANY.siteUrl.replace('https://', '')}</p>
                    <p className="text-sm font-semibold text-forest-900 truncate">{previewOgTitle}</p>
                    <p className="text-xs text-forest-500 line-clamp-2">{previewOgDescription}</p>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-end pb-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 text-forest-900 font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                  Save SEO settings
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Also export the fixed page list for reuse/typing elsewhere if needed.
export type { PageDefault };
