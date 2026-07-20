export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductTranslation {
  title?: string;
  brand?: string;
  short_description?: string;
  description?: string;
  characteristics?: Record<string, string>;
  options?: ProductOption[];
  badges?: string[];
  hashtags?: string[];
  delivery?: string;
}

export interface Product {
  id: string;
  seller_ref: string;
  channel: string;
  status: string;
  sku?: string;
  brand?: string;
  title: string;
  short_description?: string;
  description: string;
  characteristics: Record<string, string>;
  options?: ProductOption[];
  category: string;
  price: number;
  old_price?: number | null;
  discount_percent?: number | null;
  currency: string;
  price_range: { low: number; high: number };
  price_note: string;
  availability?: string;
  stock?: number | null;
  weight_grams?: number | null;
  dimensions?: string;
  delivery?: string;
  hashtags: string[];
  keywords?: string[];
  badges?: string[];
  rating?: number;
  reviews_count?: number;
  photos: string[];
  views: number;
  leads: number;
  sales: number;
  published_at?: number;
  created_at?: number;
  translations?: { kk?: ProductTranslation };
}

export type Categories = Record<string, string>;

export interface LeadResponse {
  contact_url: string | null;
}

export interface Stats {
  products: number;
  sellers: number;
  views: number;
  leads: number;
  sales: number;
}
