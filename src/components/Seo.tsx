import { useEffect, useState } from 'react';
import { COMPANY } from '../lib/company';
import { supabase } from '../lib/supabase';
import type { SeoPageOverride } from '../lib/types';

interface SeoProps {
  title: string;
  description: string;
  /** Route path beginning with '/', used for the canonical URL. */
  path: string;
  /** Optional social sharing image. */
  ogImage?: string;
  /** Optional JSON-LD structured data for this page. */
  jsonLd?: object;
  /** Set true on pages that should not be indexed (e.g. booking success). */
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.remove();
}

/**
 * Manages the document head for each page: title, description, canonical
 * URL, Open Graph tags, robots directives and JSON-LD structured data.
 *
 * Every value here is a sensible hardcoded default. If an admin has set a
 * per-page override in the SEO Manager (`/admin/seo`, `seo_pages` table),
 * that override wins — otherwise these defaults render exactly as before.
 */
export default function Seo({ title, description, path, ogImage, jsonLd, noindex = false }: SeoProps) {
  const [override, setOverride] = useState<SeoPageOverride | null>(null);
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    let mounted = true;
    setOverride(null);
    supabase.from('seo_pages').select('*').eq('path', path).maybeSingle().then(({ data }) => {
      if (mounted) setOverride((data as SeoPageOverride) ?? null);
    });
    return () => { mounted = false; };
  }, [path]);

  const effectiveTitle = override?.title || title;
  const effectiveDescription = override?.description || description;
  const effectiveOgTitle = override?.og_title || effectiveTitle;
  const effectiveOgDescription = override?.og_description || effectiveDescription;
  const effectiveOgImage = override?.og_image_url || ogImage;
  const effectiveNoindex = override ? !override.robots_index : noindex;

  useEffect(() => {
    const url = override?.canonical_url || `${COMPANY.siteUrl}${path === '/' ? '' : path}`;
    document.title = effectiveTitle;
    setMeta('name', 'description', effectiveDescription);
    setMeta('property', 'og:title', effectiveOgTitle);
    setMeta('property', 'og:description', effectiveOgDescription);
    setMeta('property', 'og:url', url);
    setMeta('name', 'robots', effectiveNoindex ? 'noindex, nofollow' : 'index, follow');

    if (effectiveOgImage) {
      setMeta('property', 'og:image', effectiveOgImage);
    } else {
      removeMeta('property', 'og:image');
    }

    if (override?.meta_keywords) {
      setMeta('name', 'keywords', override.meta_keywords);
    } else {
      removeMeta('name', 'keywords');
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]');
    if (jsonLdString) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', '');
        document.head.appendChild(script);
      }
      script.textContent = jsonLdString;
    } else if (script) {
      script.remove();
    }
  }, [effectiveTitle, effectiveDescription, effectiveOgTitle, effectiveOgDescription, effectiveOgImage, effectiveNoindex, path, jsonLdString, override?.canonical_url]);

  return null;
}
