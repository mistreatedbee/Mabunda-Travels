export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ImageRef {
  url: string;
  alt: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'editor';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  attractions: string[];
  images: ImageRef[];
  tag: string | null;
  stat_label: string | null;
  stat_value: string | null;
  featured: boolean;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  destination_id: string | null;
  destination?: Pick<Destination, 'id' | 'name'> | null;
  duration: string | null;
  starting_location: string | null;
  highlights: string[];
  activities: string[];
  included: string[];
  excluded: string[];
  price_from: number | null;
  price_note: string | null;
  max_travellers: number | null;
  images: ImageRef[];
  tag: string | null;
  featured: boolean;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transfer {
  id: string;
  name: string;
  slug: string;
  type: 'airport' | 'private' | 'destination' | 'custom';
  pickup_location: string | null;
  dropoff_location: string | null;
  description: string;
  vehicle_type: string | null;
  passenger_capacity: number | null;
  luggage_capacity: string | null;
  pricing_type: 'fixed' | 'quote';
  price: number | null;
  images: ImageRef[];
  availability_note: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking';
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';

export interface Enquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string | null;
  destination: string | null;
  travel_date: string | null;
  num_travellers: number | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  message: string | null;
  status: EnquiryStatus;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnquiryNote {
  id: string;
  booking_id: string;
  admin_id: string | null;
  admin?: Pick<AdminProfile, 'id' | 'full_name' | 'email'> | null;
  note: string;
  created_at: string;
}

export interface BusinessHours {
  days: string;
  time: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
}

export interface Settings {
  id: 1;
  phone: string;
  phone_intl: string;
  email: string;
  whatsapp_number: string;
  address: string;
  hours: BusinessHours[];
  social_links: SocialLinks;
  booking_notification_email: string | null;
  auto_response_enabled: boolean;
  auto_response_message: string | null;
  tripadvisor_url: string | null;
  tripadvisor_review_url: string | null;
  maintenance_mode: boolean;
  maintenance_message: string | null;
  updated_at: string;
}

export type AuditAction = 'insert' | 'update' | 'delete' | 'login';

export interface AuditLogEntry {
  id: string;
  admin_id: string | null;
  admin?: Pick<AdminProfile, 'email' | 'full_name'> | null;
  action: AuditAction;
  resource_type: string;
  resource_id: string | null;
  resource_label: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  resource_type: string | null;
  resource_id: string | null;
  read: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  storage_path: string;
  url: string;
  alt_text: string;
  description: string | null;
  file_size: number | null;
  mime_type: string | null;
  folder: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface SeoPageOverride {
  path: string;
  title: string | null;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  robots_index: boolean;
  canonical_url: string | null;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  review: string;
  rating: number;
  customer_location: string | null;
  photo_url: string | null;
  source: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}
