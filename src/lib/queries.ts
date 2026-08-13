import { supabase } from './supabase';
import type { Destination, Faq, Settings, Testimonial, Tour, Transfer } from './types';

/**
 * Public-site read helpers. RLS already restricts anon reads to
 * status='published' (or published=true), so these never need a service
 * key — but we still filter explicitly for clarity and defence in depth.
 */

export async function getPublishedTours(): Promise<Tour[]> {
  const { data, error } = await supabase
    .from('tours')
    .select('*, destination:destinations(id, name)')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to load tours:', error.message);
    return [];
  }
  return (data ?? []) as unknown as Tour[];
}

export async function getPublishedTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to load transfers:', error.message);
    return [];
  }
  return (data ?? []) as Transfer[];
}

export async function getPublishedDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to load destinations:', error.message);
    return [];
  }
  return (data ?? []) as Destination[];
}

export async function getPublishedFaqs(category?: 'general' | 'booking'): Promise<Faq[]> {
  let query = supabase
    .from('faqs')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });

  if (category) query = query.eq('category', category);

  const { data, error } = await query;

  if (error) {
    console.error('Failed to load FAQs:', error.message);
    return [];
  }
  return (data ?? []) as Faq[];
}

export async function getSettings(): Promise<Settings | null> {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();

  if (error) {
    console.error('Failed to load settings:', error.message);
    return null;
  }
  return (data as Settings) ?? null;
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to load testimonials:', error.message);
    return [];
  }
  return (data ?? []) as Testimonial[];
}
