-- Optional meta keywords for per-page SEO overrides.
alter table seo_pages add column if not exists meta_keywords text;
