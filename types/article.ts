import { SEOMetadata, ProductImage } from "./product";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: ProductImage;
  categories: string[];
  tags: string[];
  seo: SEOMetadata;
}

export interface Author {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

