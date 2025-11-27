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
	gallery?: ProductImage[]; // Additional images for gallery/carousel
	brochureUrl?: string;
	videoUrl?: string;
	video360Url?: string; // 360-degree product view video
	faqs?: FAQ[]; // Product-specific FAQs
	reviews?: Review[]; // Customer reviews
	qna?: QnA[]; // Questions and Answers
	benefits?: string[]; // Key benefits list
	certifications?: Certification[]; // FDA, ISO, CE, etc.
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

export interface FAQ {
	id: string;
	question: string;
	answer: string;
	category?: string;
	order: number;
}

export interface Review {
	id: string;
	author: string;
	role?: string; // e.g., "Dermatologist", "Clinic Owner"
	location?: string;
	rating: number; // 1-5
	title: string;
	content: string;
	date: string;
	verified: boolean;
	helpful?: number; // Number of people who found this helpful
}

export interface QnA {
	id: string;
	question: string;
	answer: string;
	askedBy?: string;
	answeredBy?: string;
	date: string;
	helpful?: number;
}

export interface Certification {
	name: string;
	icon?: string;
	description?: string;
}
