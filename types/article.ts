import { SEOMetadata } from "./product";

export interface ArticleImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

export interface ArticleHeaderImage {
  url: string;
  alt: string;
  showTitleOverlay?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: ArticleImage;
  headerImage?: ArticleHeaderImage;
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

