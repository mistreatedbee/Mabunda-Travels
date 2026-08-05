import { useEffect } from 'react';
import { COMPANY } from '../lib/company';

interface SeoProps {
  title: string;
  description: string;
  /** Route path beginning with '/', used for the canonical URL. */
  path: string;
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

/**
 * Manages the document head for each page: title, description, canonical
 * URL, Open Graph tags, robots directives and JSON-LD structured data.
 */
export default function Seo({ title, description, path, jsonLd, noindex = false }: SeoProps) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const url = `${COMPANY.siteUrl}${path === '/' ? '' : path}`;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

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
  }, [title, description, path, jsonLdString, noindex]);

  return null;
}
