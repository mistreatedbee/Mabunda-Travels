import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, MapPin, Heart, Award, Phone, Pencil,
  Plus, Monitor, Smartphone, ExternalLink,
} from 'lucide-react';
import type { HomepageContentData, HomepageHero, HomepageFaqIntro } from '../../../lib/homepage';
import type { Faq, Testimonial, Tour } from '../../../lib/types';
import type { SitePageDef } from '../../../lib/sitePages';
import { COMPANY } from '../../../lib/company';
import { Field, TextInput, TextArea, TagListInput, Toggle } from '../../components/FormFields';
import ImageUpload from '../../components/ImageUpload';
import SectionEditDrawer from '../../components/SectionEditDrawer';
import { CharCount, ContentPreviewCard, SearchPreview, SocialPreview } from '../../components/PageEditorParts';

const TRUSTED_ICONS = [Shield, MapPin, Heart, Award] as const;

export interface SeoFormSlice {
  title: string;
  description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  robots_index: boolean;
  canonical_url: string;
}

type SectionId = 'seo' | 'hero' | 'trusted' | 'activities' | 'services' | 'testimonials' | 'faq' | 'cta' | 'contact';

interface HomepageVisualManagerProps {
  form: HomepageContentData;
  seoForm: SeoFormSlice;
  selected: SitePageDef;
  tours: Tour[];
  faqs: Faq[];
  testimonials: Testimonial[];
  previewTitle: string;
  previewDescription: string;
  previewUrl: string;
  previewOgTitle: string;
  previewOgDescription: string;
  siteHost: string;
  onPatch: <K extends keyof HomepageContentData>(
    key: K,
    value: Partial<HomepageContentData[K]> | HomepageContentData[K]
  ) => void;
  onUpdateSeo: <K extends keyof SeoFormSlice>(key: K, value: SeoFormSlice[K]) => void;
}

function SectionCard({
  step,
  label,
  placement,
  preview,
  onEdit,
  editLabel = 'Edit section',
}: {
  step: number;
  label: string;
  placement: string;
  preview: React.ReactNode;
  onEdit: () => void;
  editLabel?: string;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-50 bg-gray-50/60">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-7 h-7 rounded-full bg-forest-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {step}
          </span>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-forest-900 text-sm">{label}</h3>
            <p className="text-[11px] text-forest-400 truncate">{placement}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-gold-dark bg-white border border-gray-200 px-3 py-2 rounded-xl hover:shadow-sm transition-all"
        >
          <Pencil size={13} aria-hidden="true" />
          {editLabel}
        </button>
      </div>
      <div className="p-5">{preview}</div>
    </section>
  );
}

export default function HomepageVisualManager({
  form,
  seoForm,
  selected,
  tours,
  faqs,
  testimonials,
  previewTitle,
  previewDescription,
  previewUrl,
  previewOgTitle,
  previewOgDescription,
  siteHost,
  onPatch,
  onUpdateSeo,
}: HomepageVisualManagerProps) {
  const [editing, setEditing] = useState<SectionId | null>(null);
  const [previewFrame, setPreviewFrame] = useState<'desktop' | 'mobile' | null>(null);

  const [draftHero, setDraftHero] = useState<HomepageHero>(form.hero);
  const [draftTrusted, setDraftTrusted] = useState<string[]>(form.trusted_bar);
  const [draftExperiences, setDraftExperiences] = useState(form.experiences);
  const [draftServices, setDraftServices] = useState(form.services);
  const [draftTestimonials, setDraftTestimonials] = useState(form.testimonials);
  const [draftFaq, setDraftFaq] = useState<HomepageFaqIntro>(form.faq);
  const [draftCta, setDraftCta] = useState(form.cta);
  const [draftSeo, setDraftSeo] = useState(seoForm);

  const publishedTours = tours.filter((t) => t.status === 'published');
  const publishedFaqs = faqs.filter((f) => f.published);
  const featuredTestimonials = testimonials.filter((t) => t.published && t.featured);

  function openSection(id: SectionId) {
    if (id === 'hero') setDraftHero({ ...form.hero });
    if (id === 'trusted') setDraftTrusted([...form.trusted_bar]);
    if (id === 'activities') setDraftExperiences({ ...form.experiences });
    if (id === 'services') setDraftServices({ ...form.services });
    if (id === 'testimonials') setDraftTestimonials({ ...form.testimonials });
    if (id === 'faq') setDraftFaq({ ...form.faq });
    if (id === 'cta') setDraftCta({ ...form.cta });
    if (id === 'seo') setDraftSeo({ ...seoForm });
    setEditing(id);
  }

  function applySection(id: SectionId) {
    if (id === 'hero') onPatch('hero', draftHero);
    if (id === 'trusted') onPatch('trusted_bar', draftTrusted);
    if (id === 'activities') onPatch('experiences', draftExperiences);
    if (id === 'services') onPatch('services', draftServices);
    if (id === 'testimonials') onPatch('testimonials', draftTestimonials);
    if (id === 'faq') onPatch('faq', draftFaq);
    if (id === 'cta') onPatch('cta', draftCta);
    if (id === 'seo') {
      (Object.keys(draftSeo) as (keyof SeoFormSlice)[]).forEach((k) => onUpdateSeo(k, draftSeo[k]));
    }
    setEditing(null);
  }

  const heroBg = form.hero.background_images[0]?.url;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-forest-900 rounded-2xl text-white">
        <div>
          <p className="font-semibold text-sm">Your homepage at a glance</p>
          <p className="text-white/70 text-xs mt-0.5 leading-relaxed">
            Scroll through each section. Click <strong className="text-white/90">Edit section</strong>, change the text or photos, click <strong className="text-white/90">Done</strong>, then <strong className="text-white/90">Save Homepage</strong> at the bottom.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreviewFrame('desktop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
          >
            <Monitor size={14} aria-hidden="true" />
            Preview
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gold text-forest-900 hover:bg-gold-dark px-3 py-2 rounded-xl transition-colors"
          >
            <ExternalLink size={14} aria-hidden="true" />
            Open live site
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {/* SEO */}
        <SectionCard
          step={1}
          label="Google & WhatsApp"
          placement="How your site looks when someone searches or shares your link"
          onEdit={() => openSection('seo')}
          editLabel="Edit"
          preview={
            <div className="space-y-4">
              <SearchPreview title={previewTitle} url={previewUrl} description={previewDescription} />
              <SocialPreview
                siteHost={siteHost}
                title={previewOgTitle}
                description={previewOgDescription}
                imageUrl={seoForm.og_image_url || undefined}
              />
            </div>
          }
        />

        {/* Hero */}
        <SectionCard
          step={2}
          label="Main banner"
          placement="The big photo and welcome message at the top of your homepage"
          onEdit={() => openSection('hero')}
          preview={
            <div className="relative rounded-xl overflow-hidden min-h-[220px] bg-forest-900">
              {heroBg && (
                <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
              <div className="relative px-6 py-8 text-center">
                <img src="/logo.jpeg" alt="" className="w-24 mx-auto mb-4 drop-shadow-lg rounded-lg" />
                <span className="inline-block text-[10px] bg-white/15 text-white/90 px-3 py-1 rounded-full mb-3">
                  {form.hero.location_chip}
                </span>
                <h4 className="font-display text-xl sm:text-2xl text-white font-bold leading-tight">
                  {form.hero.headline_line1}{' '}
                  <span className="text-gold">{form.hero.headline_highlight}</span>
                </h4>
                <p className="text-white/80 text-sm mt-2 max-w-md mx-auto line-clamp-2">{form.hero.subtitle}</p>
                <p className="text-white/60 text-xs mt-4">{form.hero.discover_link_text} → {form.hero.discover_link_url || '/services'}</p>
              </div>
            </div>
          }
        />

        {/* Trust bar */}
        <SectionCard
          step={3}
          label="Trust badges"
          placement='The four labels under the banner (e.g. "Verified & Registered")'
          onEdit={() => openSection('trusted')}
          preview={
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 py-2">
              {form.trusted_bar.map((label, i) => {
                const Icon = TRUSTED_ICONS[i % TRUSTED_ICONS.length];
                return (
                  <div key={label} className="flex items-center gap-2 text-forest-700">
                    <Icon size={18} className="text-olive" aria-hidden="true" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
          }
        />

        {/* Activities */}
        <SectionCard
          step={4}
          label="Activity cards"
          placement="The flip cards for tours and experiences — edit each card under Activities & Tours"
          onEdit={() => openSection('activities')}
          preview={
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-wider">{form.experiences.eyebrow}</span>
              <h4 className="font-display text-lg font-bold text-forest-900 mt-1">{form.experiences.title}</h4>
              <p className="text-sm text-forest-600/80 mt-1 line-clamp-2">{form.experiences.description}</p>
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {publishedTours.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex-shrink-0 w-28">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-forest-100">
                      {t.images[0]?.url ? (
                        <img src={t.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <p className="text-[11px] font-medium text-forest-800 mt-1 line-clamp-2">{t.name}</p>
                  </div>
                ))}
                {publishedTours.length === 0 && (
                  <p className="text-sm text-forest-400 italic">No published activity cards yet.</p>
                )}
              </div>
              <Link to="/admin/tours" className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 mt-3 hover:text-gold-dark">
                Manage all tours <Plus size={12} aria-hidden="true" />
              </Link>
            </div>
          }
        />

        {/* Services */}
        <SectionCard
          step={5}
          label="Services heading"
          placement="The title above your four service boxes (Safari, Group Tours, etc.)"
          onEdit={() => openSection('services')}
          preview={
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-wider">{form.services.eyebrow}</span>
              <h4 className="font-display text-lg font-bold text-forest-900 mt-1">{form.services.title}</h4>
              <p className="text-sm text-forest-600/80 mt-1">{form.services.description}</p>
              <p className="text-xs text-forest-400 mt-3">Safari Experiences · Group Tours · Corporate Transfers · Custom Trips</p>
            </div>
          }
        />

        {/* Testimonials */}
        <SectionCard
          step={6}
          label="Customer reviews"
          placement="What travellers say about you — add reviews under Customer Reviews in the menu"
          onEdit={() => openSection('testimonials')}
          preview={
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-wider">{form.testimonials.eyebrow}</span>
              <h4 className="font-display text-lg font-bold text-forest-900 mt-1">{form.testimonials.title}</h4>
              <div className="grid sm:grid-cols-2 gap-2 mt-3">
                {featuredTestimonials.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                    <p className="font-medium text-forest-900">{t.customer_name}</p>
                    <p className="text-forest-600/80 text-xs line-clamp-2 mt-1">&ldquo;{t.review}&rdquo;</p>
                  </div>
                ))}
                {featuredTestimonials.length === 0 && (
                  <p className="text-sm text-forest-400 italic col-span-2">No featured reviews — mark testimonials as featured in admin.</p>
                )}
              </div>
              <Link to="/admin/testimonials" className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 mt-3 hover:text-gold-dark">
                Manage testimonials <Plus size={12} aria-hidden="true" />
              </Link>
            </div>
          }
        />

        {/* FAQ */}
        <SectionCard
          step={7}
          label="About us & questions"
          placement="The about text and FAQ list on the homepage"
          onEdit={() => openSection('faq')}
          preview={
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="text-gold text-xs font-semibold uppercase tracking-wider">{form.faq.eyebrow}</span>
                <h4 className="font-display text-base font-bold text-forest-900 mt-1">{form.faq.title}</h4>
                <p className="text-sm text-forest-600/80 mt-2 line-clamp-3">{form.faq.description}</p>
                <p className="text-xs text-forest-500 mt-2 line-clamp-2">{form.faq.about_paragraph_2}</p>
              </div>
              <div className="space-y-1.5">
                {publishedFaqs.slice(0, 3).map((f) => (
                  <div key={f.id} className="text-xs px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-forest-800 font-medium truncate">
                    {f.question}
                  </div>
                ))}
                <p className="text-[11px] text-forest-400">{publishedFaqs.length} questions live</p>
              </div>
            </div>
          }
        />

        {/* CTA */}
        <SectionCard
          step={8}
          label="Book now banner"
          placement='The dark section near the bottom with "Request a Quote"'
          onEdit={() => openSection('cta')}
          preview={
            <div className="rounded-xl bg-forest-900 px-6 py-8 text-center">
              <h4 className="font-display text-xl text-white font-bold">{form.cta.title}</h4>
              <p className="text-white/75 text-sm mt-2 max-w-lg mx-auto line-clamp-2">{form.cta.text}</p>
              <div className="flex justify-center gap-3 mt-4">
                <span className="text-xs font-semibold bg-gold text-forest-900 px-4 py-2 rounded-full">Request a Quote</span>
                <span className="text-xs font-semibold border border-white/30 text-white px-4 py-2 rounded-full">Chat on WhatsApp</span>
              </div>
            </div>
          }
        />

        {/* Contact / footer */}
        <SectionCard
          step={9}
          label="Phone, email & hours"
          placement="Shown in the footer and contact page — edit under Business Details"
          onEdit={() => { window.location.href = '/admin/settings'; }}
          editLabel="Open Business Details"
          preview={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-sm text-forest-700">
                <p className="flex items-center gap-2"><Phone size={14} className="text-olive" aria-hidden="true" />{COMPANY.phone}</p>
                <p>{COMPANY.email}</p>
                <p className="text-xs text-forest-500">{COMPANY.address}</p>
              </div>
              <Link
                to="/admin/settings"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100 border border-forest-100 px-4 py-2.5 rounded-xl transition-colors"
              >
                <Pencil size={13} aria-hidden="true" />
                Open Settings
              </Link>
            </div>
          }
        />
      </div>

      {/* Drawers */}
      <SectionEditDrawer
        open={editing === 'seo'}
        title="Google & WhatsApp settings"
        subtitle="Optional — leave blank to use the default text. Only change if you know what you are doing."
        onClose={() => setEditing(null)}
        onSave={() => applySection('seo')}
      >
        <Field label="Google page title" htmlFor="drawer-seo-title" hint="Shows in Google search results and the browser tab.">
          <TextInput
            id="drawer-seo-title"
            value={draftSeo.title}
            onChange={(e) => setDraftSeo((p) => ({ ...p, title: e.target.value }))}
            placeholder={selected.title}
          />
          <CharCount current={draftSeo.title.length || selected.title.length} max={60} />
        </Field>
        <Field label="Google description" htmlFor="drawer-seo-desc" hint="The short paragraph under your site name in Google.">
          <TextArea
            id="drawer-seo-desc"
            rows={3}
            value={draftSeo.description}
            onChange={(e) => setDraftSeo((p) => ({ ...p, description: e.target.value }))}
            placeholder={selected.description}
          />
          <CharCount current={draftSeo.description.length || selected.description.length} max={160} />
        </Field>
        <Field label="Search keywords" htmlFor="drawer-seo-keywords" hint="Optional. Separate with commas, e.g. safari tours, Kruger, Mpumalanga.">
          <TextInput
            id="drawer-seo-keywords"
            value={draftSeo.meta_keywords}
            onChange={(e) => setDraftSeo((p) => ({ ...p, meta_keywords: e.target.value }))}
            placeholder="safari tours Mpumalanga, Kruger transfers, …"
          />
        </Field>
        <Field label="Canonical URL" htmlFor="drawer-seo-canonical" hint="Leave blank to use the real homepage URL.">
          <TextInput
            id="drawer-seo-canonical"
            type="url"
            value={draftSeo.canonical_url}
            onChange={(e) => setDraftSeo((p) => ({ ...p, canonical_url: e.target.value }))}
            placeholder={previewUrl}
          />
        </Field>
        <Toggle
          id="drawer-seo-robots"
          checked={draftSeo.robots_index}
          onChange={(v) => setDraftSeo((p) => ({ ...p, robots_index: v }))}
          label="Allow search engines to index the homepage"
        />
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-semibold text-forest-900 mb-3">Social sharing</p>
          <Field label="Social title" htmlFor="drawer-og-title">
            <TextInput id="drawer-og-title" value={draftSeo.og_title} onChange={(e) => setDraftSeo((p) => ({ ...p, og_title: e.target.value }))} />
          </Field>
          <Field label="Social description" htmlFor="drawer-og-desc">
            <TextInput id="drawer-og-desc" value={draftSeo.og_description} onChange={(e) => setDraftSeo((p) => ({ ...p, og_description: e.target.value }))} />
          </Field>
        <Field label="Sharing image" hint="Photo shown when someone shares your link on WhatsApp or Facebook. Recommended size: 1200×630 pixels.">
            <ImageUpload
              value={draftSeo.og_image_url ? [{ url: draftSeo.og_image_url, alt: previewOgTitle }] : []}
              onChange={(v) => setDraftSeo((p) => ({ ...p, og_image_url: v[0]?.url || '' }))}
              folder="seo"
              maxImages={1}
            />
          </Field>
        </div>
      </SectionEditDrawer>

      <SectionEditDrawer
        open={editing === 'hero'}
        title="Hero banner"
        subtitle="First screen visitors see"
        onClose={() => setEditing(null)}
        onSave={() => applySection('hero')}
      >
        <Field label="Location chip" htmlFor="drawer-hp-location">
          <TextInput id="drawer-hp-location" value={draftHero.location_chip} onChange={(e) => setDraftHero((p) => ({ ...p, location_chip: e.target.value }))} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Headline (line 1)" htmlFor="drawer-hp-h1">
            <TextInput id="drawer-hp-h1" value={draftHero.headline_line1} onChange={(e) => setDraftHero((p) => ({ ...p, headline_line1: e.target.value }))} />
          </Field>
          <Field label="Headline highlight (gold)" htmlFor="drawer-hp-h2">
            <TextInput id="drawer-hp-h2" value={draftHero.headline_highlight} onChange={(e) => setDraftHero((p) => ({ ...p, headline_highlight: e.target.value }))} />
          </Field>
        </div>
        <Field label="Subtitle" htmlFor="drawer-hp-sub">
          <TextArea id="drawer-hp-sub" rows={3} value={draftHero.subtitle} onChange={(e) => setDraftHero((p) => ({ ...p, subtitle: e.target.value }))} />
        </Field>
        <Field label="Background slideshow" hint="Images rotate behind the hero. Upload replaces only when you save the page.">
          <ImageUpload
            value={draftHero.background_images}
            onChange={(v) => setDraftHero((p) => ({ ...p, background_images: v }))}
            folder="homepage"
            maxImages={5}
          />
        </Field>
        <Field label="Trust badges (below form)">
          <TagListInput value={draftHero.trust_badges} onChange={(v) => setDraftHero((p) => ({ ...p, trust_badges: v }))} placeholder="Add a badge" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Discover link text" htmlFor="drawer-discover-text">
            <TextInput id="drawer-discover-text" value={draftHero.discover_link_text} onChange={(e) => setDraftHero((p) => ({ ...p, discover_link_text: e.target.value }))} />
          </Field>
          <Field label="Discover link URL" htmlFor="drawer-discover-url">
            <TextInput id="drawer-discover-url" value={draftHero.discover_link_url || '/services'} onChange={(e) => setDraftHero((p) => ({ ...p, discover_link_url: e.target.value }))} placeholder="/services" />
          </Field>
        </div>
      </SectionEditDrawer>

      <SectionEditDrawer
        open={editing === 'trusted'}
        title="Trust bar"
        subtitle="Credibility strip below the hero"
        onClose={() => setEditing(null)}
        onSave={() => applySection('trusted')}
      >
        <Field label="Trust labels" hint="Four items work best — icons are assigned automatically.">
          <TagListInput value={draftTrusted} onChange={setDraftTrusted} placeholder="Add a trust label" />
        </Field>
      </SectionEditDrawer>

      <SectionEditDrawer
        open={editing === 'activities'}
        title="Experiences section"
        subtitle="Section heading — cards come from Tours"
        onClose={() => setEditing(null)}
        onSave={() => applySection('activities')}
      >
        <Field label="Eyebrow" htmlFor="drawer-exp-eyebrow">
          <TextInput id="drawer-exp-eyebrow" value={draftExperiences.eyebrow} onChange={(e) => setDraftExperiences((p) => ({ ...p, eyebrow: e.target.value }))} />
        </Field>
        <Field label="Section title" htmlFor="drawer-exp-title">
          <TextInput id="drawer-exp-title" value={draftExperiences.title} onChange={(e) => setDraftExperiences((p) => ({ ...p, title: e.target.value }))} />
        </Field>
        <Field label="Description" htmlFor="drawer-exp-desc">
          <TextArea id="drawer-exp-desc" rows={2} value={draftExperiences.description} onChange={(e) => setDraftExperiences((p) => ({ ...p, description: e.target.value }))} />
        </Field>
        <Field label="Button text" htmlFor="drawer-exp-cta">
          <TextInput id="drawer-exp-cta" value={draftExperiences.cta_text} onChange={(e) => setDraftExperiences((p) => ({ ...p, cta_text: e.target.value }))} />
        </Field>
        <div className="pt-2">
          <p className="text-sm font-semibold text-forest-900 mb-2">Activity cards ({publishedTours.length} live)</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tours.map((tour) => (
              <ContentPreviewCard
                key={tour.id}
                image={tour.images[0]?.url}
                title={tour.name}
                subtitle={tour.short_description}
                editHref={`/admin/tours/${tour.id}/edit`}
                status={tour.status}
              />
            ))}
          </div>
          <Link to="/admin/tours/new" className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 mt-2 hover:text-gold-dark">
            <Plus size={14} aria-hidden="true" /> Add new tour
          </Link>
        </div>
      </SectionEditDrawer>

      <SectionEditDrawer
        open={editing === 'services'}
        title="Services section"
        subtitle="Heading above the four service cards"
        onClose={() => setEditing(null)}
        onSave={() => applySection('services')}
      >
        <Field label="Eyebrow" htmlFor="drawer-svc-eyebrow">
          <TextInput id="drawer-svc-eyebrow" value={draftServices.eyebrow} onChange={(e) => setDraftServices((p) => ({ ...p, eyebrow: e.target.value }))} />
        </Field>
        <Field label="Section title" htmlFor="drawer-svc-title">
          <TextInput id="drawer-svc-title" value={draftServices.title} onChange={(e) => setDraftServices((p) => ({ ...p, title: e.target.value }))} />
        </Field>
        <Field label="Description" htmlFor="drawer-svc-desc">
          <TextArea id="drawer-svc-desc" rows={2} value={draftServices.description} onChange={(e) => setDraftServices((p) => ({ ...p, description: e.target.value }))} />
        </Field>
      </SectionEditDrawer>

      <SectionEditDrawer
        open={editing === 'testimonials'}
        title="Testimonials section"
        subtitle="Section heading — reviews from Testimonials admin"
        onClose={() => setEditing(null)}
        onSave={() => applySection('testimonials')}
      >
        <Field label="Eyebrow" htmlFor="drawer-test-eyebrow">
          <TextInput id="drawer-test-eyebrow" value={draftTestimonials.eyebrow} onChange={(e) => setDraftTestimonials((p) => ({ ...p, eyebrow: e.target.value }))} />
        </Field>
        <Field label="Section title" htmlFor="drawer-test-title">
          <TextInput id="drawer-test-title" value={draftTestimonials.title} onChange={(e) => setDraftTestimonials((p) => ({ ...p, title: e.target.value }))} />
        </Field>
        <div className="pt-2">
          <p className="text-sm font-semibold text-forest-900 mb-2">Reviews ({featuredTestimonials.length} featured on homepage)</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {testimonials.map((t) => (
              <ContentPreviewCard
                key={t.id}
                image={t.photo_url ?? undefined}
                title={t.customer_name}
                subtitle={t.review}
                editHref={`/admin/testimonials/${t.id}/edit`}
                status={t.published && t.featured ? 'published' : t.published ? 'draft' : 'archived'}
              />
            ))}
          </div>
        </div>
      </SectionEditDrawer>

      <SectionEditDrawer
        open={editing === 'faq'}
        title="About & FAQ intro"
        subtitle="Left column text — questions managed in FAQs admin"
        onClose={() => setEditing(null)}
        onSave={() => applySection('faq')}
      >
        <Field label="Eyebrow" htmlFor="drawer-faq-eyebrow">
          <TextInput id="drawer-faq-eyebrow" value={draftFaq.eyebrow} onChange={(e) => setDraftFaq((p) => ({ ...p, eyebrow: e.target.value }))} />
        </Field>
        <Field label="Section title" htmlFor="drawer-faq-title">
          <TextInput id="drawer-faq-title" value={draftFaq.title} onChange={(e) => setDraftFaq((p) => ({ ...p, title: e.target.value }))} />
        </Field>
        <Field label="Intro paragraph" htmlFor="drawer-faq-desc">
          <TextArea id="drawer-faq-desc" rows={3} value={draftFaq.description} onChange={(e) => setDraftFaq((p) => ({ ...p, description: e.target.value }))} />
        </Field>
        <Field label="Second paragraph" htmlFor="drawer-faq-about2">
          <TextArea id="drawer-faq-about2" rows={3} value={draftFaq.about_paragraph_2} onChange={(e) => setDraftFaq((p) => ({ ...p, about_paragraph_2: e.target.value }))} />
        </Field>
        <div className="pt-2">
          <p className="text-sm font-semibold text-forest-900 mb-2">FAQ questions ({publishedFaqs.length} live)</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {faqs.map((faq) => (
              <ContentPreviewCard
                key={faq.id}
                title={faq.question}
                subtitle={faq.answer}
                editHref={`/admin/faqs/${faq.id}/edit`}
                status={faq.published ? 'published' : 'draft'}
              />
            ))}
          </div>
          <Link to="/admin/faqs/new" className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 mt-2 hover:text-gold-dark">
            <Plus size={14} aria-hidden="true" /> Add FAQ
          </Link>
        </div>
      </SectionEditDrawer>

      <SectionEditDrawer
        open={editing === 'cta'}
        title="Call to action banner"
        subtitle="Bottom conversion section"
        onClose={() => setEditing(null)}
        onSave={() => applySection('cta')}
      >
        <Field label="Title" htmlFor="drawer-cta-title">
          <TextInput id="drawer-cta-title" value={draftCta.title} onChange={(e) => setDraftCta((p) => ({ ...p, title: e.target.value }))} />
        </Field>
        <Field label="Text" htmlFor="drawer-cta-text">
          <TextArea id="drawer-cta-text" rows={3} value={draftCta.text} onChange={(e) => setDraftCta((p) => ({ ...p, text: e.target.value }))} />
        </Field>
        <p className="text-xs text-forest-500">Button labels and links are fixed (Request a Quote · WhatsApp).</p>
      </SectionEditDrawer>

      {/* Live preview modal */}
      {previewFrame && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm" role="dialog" aria-label="Homepage preview">
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreviewFrame('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${previewFrame === 'desktop' ? 'bg-forest-800 text-white' : 'text-forest-600 hover:bg-gray-100'}`}
              >
                <Monitor size={14} aria-hidden="true" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewFrame('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${previewFrame === 'mobile' ? 'bg-forest-800 text-white' : 'text-forest-600 hover:bg-gray-100'}`}
              >
                <Smartphone size={14} aria-hidden="true" /> Mobile
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPreviewFrame(null)}
              className="text-sm font-semibold text-forest-700 hover:text-gold-dark px-3 py-1.5"
            >
              Close preview
            </button>
          </div>
          <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
            <iframe
              title="Homepage preview"
              src="/"
              className={`bg-white rounded-xl shadow-2xl border border-gray-200 transition-all ${
                previewFrame === 'mobile' ? 'w-[390px] h-[80vh]' : 'w-full max-w-6xl h-[85vh]'
              }`}
            />
          </div>
        </div>
      )}
    </>
  );
}
