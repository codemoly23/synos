export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  categories: string[];
  treatments: string[];
  features: Feature[];
  specifications: Specification[];
  images: ProductImage[];
  brochureUrl?: string;
  videoUrl?: string;
  price?: {
    amount: number;
    currency: string;
    displayPrice: boolean;
  };
  seo: SEOMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  parentCategory?: string;
  order: number;
}

export interface Treatment {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

