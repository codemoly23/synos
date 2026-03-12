"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	Loader2,
	Plus,
	Trash2,
	ExternalLink,
	Clock,
	ShieldCheck,
	Truck,
	HeadphonesIcon,
	Search,
	FileText,
	CheckCircle,
	Star,
	Award,
	Zap,
	Heart,
	Users,
	Building,
	Phone,
	Mail,
	Globe,
	type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import {
	SeoAnalysis,
	CharacterCount,
	ReadabilityAnalysis,
} from "@/components/admin/seo";
import { Switch } from "@/components/ui/switch";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import dynamic from "next/dynamic";

// Dynamically import TextEditor to avoid SSR issues
const TextEditor = dynamic(() => import("@/components/common/TextEditor"), {
	ssr: false,
	loading: () => (
		<div className="h-[300px] border rounded-md flex items-center justify-center text-muted-foreground">
			Loading editor...
		</div>
	),
});

// Icon name to component mapping
const ICON_MAP: Record<string, LucideIcon> = {
	Clock,
	ShieldCheck,
	Truck,
	HeadphonesIcon,
	Search,
	FileText,
	CheckCircle,
	Star,
	Award,
	Zap,
	Heart,
	Users,
	Building,
	Phone,
	Mail,
	Globe,
};

// Available Lucide icons for selection
const AVAILABLE_ICONS = Object.keys(ICON_MAP);

// Helper component to render icon by name
function IconPreview({
	name,
	className,
}: {
	name: string;
	className?: string;
}) {
	const IconComponent = ICON_MAP[name];
	if (!IconComponent) return null;
	return <IconComponent className={className} />;
}

// CTA Button schema - all optional since buttons may not be set
const ctaButtonSchema = z.object({
	text: z.string().optional(),
	href: z.string().optional(),
	variant: z.enum(["primary", "outline", "secondary"]).optional(),
});

// Trust Indicator schema - optional fields
const trustIndicatorSchema = z.object({
	icon: z.string().optional(),
	text: z.string().optional(),
});

// Feature schema - optional fields
const featureSchema = z.object({
	icon: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
});

// Process Step schema - optional fields
const processStepSchema = z.object({
	stepNumber: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	icon: z.string().optional(),
	link: z.string().optional(),
});

// Process Steps Section schema - all optional
const processStepsSectionSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	steps: z.array(processStepSchema).optional(),
});

// Hero Floating Card schema
const heroFloatingCardSchema = z.object({
	image: z.string().optional(),
	label: z.string().optional(),
});

// Hero Certification Card schema
const heroCertificationCardSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	progressLabel: z.string().optional(),
	progressValue: z.string().optional(),
	progressPercentage: z.number().min(0).max(100).optional(),
});

// Hero Slide schema - each slide contains all hero content
const heroSlideSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	titleHighlight: z.string().optional(),
	subtitle: z.string().optional(),
	primaryCta: ctaButtonSchema.optional(),
	secondaryCta: ctaButtonSchema.optional(),
	backgroundImage: z.string().optional(),
	mainImage: z.string().optional(),
	mobileImage: z.string().optional(),
	trustIndicators: z.array(trustIndicatorSchema).optional(),
	floatingCard: heroFloatingCardSchema.optional(),
	certificationCard: heroCertificationCardSchema.optional(),
});

// Product Showcase Item schema - optional fields
const productShowcaseItemSchema = z.object({
	name: z.string().optional(),
	category: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	image: z.string().optional(),
	mobileImage: z.string().optional(),
	href: z.string().optional(),
});

// Product Showcase Section schema
const productShowcaseSectionSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	ctaText: z.string().optional(),
	ctaHref: z.string().optional(),
	products: z.array(productShowcaseItemSchema).optional(),
});

// Gallery Image schema - optional fields
const galleryImageSchema = z.object({
	src: z.string().optional(),
	mobileSrc: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
});

// Image Gallery Section schema
const imageGallerySectionSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	images: z.array(galleryImageSchema).optional(),
	ctaTitle: z.string().optional(),
	ctaSubtitle: z.string().optional(),
	ctaButtonText: z.string().optional(),
});

// About Certification Badge schema
const aboutCertificationBadgeSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
});

// Testimonial Item schema - optional fields
const testimonialItemSchema = z.object({
	quote: z.string().optional(),
	author: z.string().optional(),
	role: z.string().optional(),
	company: z.string().optional(),
});

// Testimonials Section schema
const testimonialsSectionSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	testimonials: z.array(testimonialItemSchema).optional(),
});

// Section Visibility schema
const sectionVisibilitySchema = z.object({
	hero: z.boolean(),
	features: z.boolean(),
	productShowcase: z.boolean(),
	imageGallery: z.boolean(),
	processSteps: z.boolean(),
	about: z.boolean(),
	testimonials: z.boolean(),
	cta: z.boolean(),
	richContent: z.boolean(),
});

// Form schema - all section fields optional to allow saving empty content
const homePageFormSchema = z.object({
	// Section Visibility
	sectionVisibility: sectionVisibilitySchema,

	// Hero Section - slides array
	hero: z
		.object({
			slides: z.array(heroSlideSchema).optional(),
		})
		.optional(),

	// Features
	features: z.array(featureSchema).optional(),

	// Process Steps Section
	processStepsSection: processStepsSectionSchema.optional(),

	// Product Showcase
	productShowcase: productShowcaseSectionSchema.optional(),

	// Image Gallery
	imageGallery: imageGallerySectionSchema.optional(),

	// About Section - all fields optional
	aboutSection: z
		.object({
			badge: z.string().optional(),
			title: z.string().optional(),
			titleHighlight: z.string().optional(),
			content: z.string().optional(),
			image: z.string().optional(),
			mobileImage: z.string().optional(),
			benefits: z.array(z.string()).optional(),
			primaryCta: ctaButtonSchema.optional(),
			secondaryCta: ctaButtonSchema.optional(),
			certificationBadge: aboutCertificationBadgeSchema.optional(),
		})
		.optional(),

	// Testimonials Section
	testimonialsSection: testimonialsSectionSchema.optional(),

	// CTA Section - all fields optional
	ctaSection: z
		.object({
			title: z.string().optional(),
			subtitle: z.string().optional(),
			phoneTitle: z.string().optional(),
			phoneSubtitle: z.string().optional(),
			emailTitle: z.string().optional(),
			emailSubtitle: z.string().optional(),
			formTitle: z.string().optional(),
			formSubtitle: z.string().optional(),
			formCtaText: z.string().optional(),
		})
		.optional(),

	// Rich Content (HTML from text editor)
	richContent: z.string().optional(),

	// SEO
	seo: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			ogImage: z.string().optional(),
			focusKeyphrase: z.string().optional(),
		})
		.optional(),
});

type HomePageFormValues = z.infer<typeof homePageFormSchema>;

export default function StartsidaPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<HomePageFormValues>({
		resolver: zodResolver(homePageFormSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				features: true,
				productShowcase: true,
				imageGallery: true,
				processSteps: true,
				about: true,
				testimonials: true,
				cta: true,
				richContent: false,
			},
			hero: {
				slides: [],
			},
			features: [],
			processStepsSection: {
				badge: "",
				title: "",
				subtitle: "",
				steps: [],
			},
			productShowcase: {
				title: "",
				subtitle: "",
				ctaText: "",
				ctaHref: "",
				products: [],
			},
			imageGallery: {
				badge: "",
				title: "",
				subtitle: "",
				images: [],
				ctaTitle: "",
				ctaSubtitle: "",
				ctaButtonText: "",
			},
			aboutSection: {
				badge: "",
				title: "",
				titleHighlight: "",
				content: "",
				image: "",
				mobileImage: "",
				benefits: [],
				primaryCta: { text: "", href: "", variant: "secondary" },
				secondaryCta: { text: "", href: "", variant: "outline" },
				certificationBadge: { title: "", description: "" },
			},
			testimonialsSection: {
				title: "",
				subtitle: "",
				testimonials: [],
			},
			ctaSection: {
				title: "",
				subtitle: "",
				phoneTitle: "",
				phoneSubtitle: "",
				emailTitle: "",
				emailSubtitle: "",
				formTitle: "",
				formSubtitle: "",
				formCtaText: "",
			},
			richContent: "",
			seo: {
				title: "",
				description: "",
				ogImage: "",
				focusKeyphrase: "",
			},
		},
	});

	// Collect all page text content for SEO/Readability analysis
	const allFormValues = form.watch();
	const aggregatedPageContent = useMemo(() => {
		const parts: string[] = [];

		// Hero slides
		const slides = allFormValues.hero?.slides || [];
		for (const slide of slides) {
			if (slide.badge) parts.push(`<p>${slide.badge}</p>`);
			if (slide.title) parts.push(`<h1>${slide.title}${slide.titleHighlight ? " " + slide.titleHighlight : ""}</h1>`);
			if (slide.subtitle) parts.push(`<p>${slide.subtitle}</p>`);
			if (slide.trustIndicators) {
				for (const ti of slide.trustIndicators) {
					if (ti.text) parts.push(`<p>${ti.text}</p>`);
				}
			}
		}

		// Features
		const features = allFormValues.features || [];
		for (const f of features) {
			if (f.title) parts.push(`<h3>${f.title}</h3>`);
			if (f.description) parts.push(`<p>${f.description}</p>`);
		}

		// Product Showcase
		const ps = allFormValues.productShowcase;
		if (ps?.title) parts.push(`<h2>${ps.title}</h2>`);
		if (ps?.subtitle) parts.push(`<p>${ps.subtitle}</p>`);
		for (const p of ps?.products || []) {
			if (p.name) parts.push(`<h3>${p.name}</h3>`);
			if (p.description) parts.push(`<p>${p.description}</p>`);
			if (p.category) parts.push(`<p>${p.category}</p>`);
		}

		// Process Steps
		const pss = allFormValues.processStepsSection;
		if (pss?.title) parts.push(`<h2>${pss.title}</h2>`);
		if (pss?.subtitle) parts.push(`<p>${pss.subtitle}</p>`);
		for (const step of pss?.steps || []) {
			if (step.title) parts.push(`<h3>${step.title}</h3>`);
			if (step.description) parts.push(`<p>${step.description}</p>`);
		}

		// About Section
		const about = allFormValues.aboutSection;
		if (about?.title) parts.push(`<h2>${about.title}${about.titleHighlight ? " " + about.titleHighlight : ""}</h2>`);
		if (about?.content) parts.push(`<p>${about.content}</p>`);
		for (const b of about?.benefits || []) {
			if (b) parts.push(`<p>${b}</p>`);
		}

		// Testimonials
		const ts = allFormValues.testimonialsSection;
		if (ts?.title) parts.push(`<h2>${ts.title}</h2>`);
		if (ts?.subtitle) parts.push(`<p>${ts.subtitle}</p>`);
		for (const t of ts?.testimonials || []) {
			if (t.quote) parts.push(`<p>${t.quote}</p>`);
		}

		// Image Gallery
		const ig = allFormValues.imageGallery;
		if (ig?.title) parts.push(`<h2>${ig.title}</h2>`);
		if (ig?.subtitle) parts.push(`<p>${ig.subtitle}</p>`);

		// CTA Section
		const cta = allFormValues.ctaSection;
		if (cta?.title) parts.push(`<h2>${cta.title}</h2>`);
		if (cta?.subtitle) parts.push(`<p>${cta.subtitle}</p>`);

		// Rich Content
		if (allFormValues.richContent) parts.push(allFormValues.richContent);

		return parts.join("\n");
	}, [allFormValues]);

	// Field arrays for dynamic lists
	const {
		fields: featureFields,
		append: appendFeature,
		remove: removeFeature,
	} = useFieldArray({ control: form.control, name: "features" });

	const {
		fields: processStepFields,
		append: appendProcessStep,
		remove: removeProcessStep,
	} = useFieldArray({
		control: form.control,
		name: "processStepsSection.steps",
	});

	const {
		fields: heroSlideFields,
		append: appendHeroSlide,
		remove: removeHeroSlide,
	} = useFieldArray({ control: form.control, name: "hero.slides" });

	const {
		fields: productFields,
		append: appendProduct,
		remove: removeProduct,
	} = useFieldArray({
		control: form.control,
		name: "productShowcase.products",
	});

	const {
		fields: galleryImageFields,
		append: appendGalleryImage,
		remove: removeGalleryImage,
	} = useFieldArray({ control: form.control, name: "imageGallery.images" });

	const {
		fields: testimonialFields,
		append: appendTestimonial,
		remove: removeTestimonial,
	} = useFieldArray({
		control: form.control,
		name: "testimonialsSection.testimonials",
	});

	// Benefits are simple strings, so we manage them manually
	const benefits = form.watch("aboutSection.benefits") || [];
	const addBenefit = () => {
		form.setValue("aboutSection.benefits", [...benefits, ""]);
	};
	const removeBenefit = (index: number) => {
		const newBenefits = benefits.filter((_, i) => i !== index);
		form.setValue("aboutSection.benefits", newBenefits);
	};
	const updateBenefit = (index: number, value: string) => {
		const newBenefits = [...benefits];
		newBenefits[index] = value;
		form.setValue("aboutSection.benefits", newBenefits);
	};

	// Fetch home page content on mount
	useEffect(() => {
		const fetchContent = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/home-page");
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch content");
				}

				const content = data.data;

				// Reset form with fetched data
				// Ensure section visibility has proper defaults for each field
				const defaultVisibility = {
					hero: true,
					features: true,
					productShowcase: true,
					imageGallery: true,
					processSteps: true,
					about: true,
					testimonials: true,
					cta: true,
					richContent: false,
				};
				const sectionVisibility = {
					hero: content.sectionVisibility?.hero ?? defaultVisibility.hero,
					features:
						content.sectionVisibility?.features ??
						defaultVisibility.features,
					productShowcase:
						content.sectionVisibility?.productShowcase ??
						defaultVisibility.productShowcase,
					imageGallery:
						content.sectionVisibility?.imageGallery ??
						defaultVisibility.imageGallery,
					processSteps:
						content.sectionVisibility?.processSteps ??
						defaultVisibility.processSteps,
					about:
						content.sectionVisibility?.about ?? defaultVisibility.about,
					testimonials:
						content.sectionVisibility?.testimonials ??
						defaultVisibility.testimonials,
					cta: content.sectionVisibility?.cta ?? defaultVisibility.cta,
					richContent:
						content.sectionVisibility?.richContent ??
						defaultVisibility.richContent,
				};

				form.reset({
					sectionVisibility,
					hero: {
						slides: content.hero?.slides || [],
					},
					features: content.features || [],
					processStepsSection: {
						badge: content.processStepsSection?.badge || "",
						title: content.processStepsSection?.title || "",
						subtitle: content.processStepsSection?.subtitle || "",
						steps: content.processStepsSection?.steps || [],
					},
					productShowcase: {
						title: content.productShowcase?.title || "",
						subtitle: content.productShowcase?.subtitle || "",
						ctaText: content.productShowcase?.ctaText || "",
						ctaHref: content.productShowcase?.ctaHref || "",
						products: content.productShowcase?.products || [],
					},
					imageGallery: {
						badge: content.imageGallery?.badge || "",
						title: content.imageGallery?.title || "",
						subtitle: content.imageGallery?.subtitle || "",
						images: content.imageGallery?.images || [],
						ctaTitle: content.imageGallery?.ctaTitle || "",
						ctaSubtitle: content.imageGallery?.ctaSubtitle || "",
						ctaButtonText: content.imageGallery?.ctaButtonText || "",
					},
					aboutSection: {
						badge: content.aboutSection?.badge || "",
						title: content.aboutSection?.title || "",
						titleHighlight: content.aboutSection?.titleHighlight || "",
						content: content.aboutSection?.content || "",
						image: content.aboutSection?.image || "",
						mobileImage: content.aboutSection?.mobileImage || "",
						benefits: content.aboutSection?.benefits || [],
						primaryCta: content.aboutSection?.primaryCta || {
							text: "",
							href: "",
							variant: "secondary",
						},
						secondaryCta: content.aboutSection?.secondaryCta || {
							text: "",
							href: "",
							variant: "outline",
						},
						certificationBadge: content.aboutSection
							?.certificationBadge || {
							title: "",
							description: "",
						},
					},
					testimonialsSection: {
						title: content.testimonialsSection?.title ?? "",
						subtitle: content.testimonialsSection?.subtitle ?? "",
						testimonials: Array.isArray(
							content.testimonialsSection?.testimonials
						)
							? content.testimonialsSection.testimonials
							: [],
					},
					ctaSection: {
						title: content.ctaSection?.title || "",
						subtitle: content.ctaSection?.subtitle || "",
						phoneTitle: content.ctaSection?.phoneTitle || "",
						phoneSubtitle: content.ctaSection?.phoneSubtitle || "",
						emailTitle: content.ctaSection?.emailTitle || "",
						emailSubtitle: content.ctaSection?.emailSubtitle || "",
						formTitle: content.ctaSection?.formTitle || "",
						formSubtitle: content.ctaSection?.formSubtitle || "",
						formCtaText: content.ctaSection?.formCtaText || "",
					},
					richContent: content.richContent || "",
					seo: {
						title: content.seo?.title || "",
						description: content.seo?.description || "",
						ogImage: content.seo?.ogImage || "",
						focusKeyphrase: content.seo?.focusKeyphrase || "",
					},
				});
			} catch (error) {
				console.error("Error fetching content:", error);
				toast.error("Failed to load content");
			} finally {
				setLoading(false);
			}
		};

		fetchContent();
	}, [form]);

	const onSubmit = async (values: HomePageFormValues) => {
		try {
			setSaving(true);

			const response = await fetch("/api/home-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to save content");
			}

			toast.success("Home page content saved successfully");
		} catch (error) {
			console.error("Error saving content:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save content"
			);
		} finally {
			setSaving(false);
		}
	};

	// Friendly field name mapping
	const fieldNameMap: Record<string, string> = {
		hero: "Hero Section",
		features: "Features",
		productShowcase: "Product Showcase",
		imageGallery: "Image Gallery",
		processStepsSection: "Process Steps",
		aboutSection: "About Section",
		testimonialsSection: "Testimonials",
		ctaSection: "CTA Section",
		seo: "SEO",
		sectionVisibility: "Section Visibility",
		title: "Title",
		subtitle: "Subtitle",
		content: "Content",
		badge: "Badge",
		quote: "Quote",
		author: "Author",
		role: "Role",
		company: "Company",
		testimonials: "Testimonials list",
		text: "Button text",
		href: "Link URL",
	};

	const getFriendlyFieldName = (path: string): string => {
		const parts = path.split(".");
		const friendlyParts = parts.map((part) => {
			// Handle array indices like "testimonials.0.quote"
			if (/^\d+$/.test(part)) {
				return `#${parseInt(part) + 1}`;
			}
			return fieldNameMap[part] || part;
		});
		return friendlyParts.join(" > ");
	};

	// Handle form validation errors
	const onFormError = (errors: typeof form.formState.errors) => {
		console.error("Form validation errors:", errors);

		// Collect all error messages
		const errorMessages: { path: string; message: string }[] = [];

		const collectErrors = (obj: Record<string, unknown>, prefix = "") => {
			for (const key in obj) {
				const value = obj[key] as Record<string, unknown>;
				if (value?.message && typeof value.message === "string") {
					errorMessages.push({
						path: `${prefix}${key}`,
						message: value.message,
					});
				} else if (typeof value === "object" && value !== null) {
					collectErrors(
						value as Record<string, unknown>,
						`${prefix}${key}.`
					);
				}
			}
		};

		collectErrors(errors as Record<string, unknown>);

		if (errorMessages.length > 0) {
			// Show first few errors
			const displayErrors = errorMessages.slice(0, 3);
			const remaining = errorMessages.length - 3;

			toast.error(
				<div className="space-y-1">
					<p className="font-semibold">Please fix the following errors:</p>
					{displayErrors.map((err, i) => (
						<p key={i} className="text-sm">
							<span className="font-medium">
								{getFriendlyFieldName(err.path)}:
							</span>{" "}
							{err.message}
						</p>
					))}
					{remaining > 0 && (
						<p className="text-xs opacity-70">
							...and {remaining} more error{remaining > 1 ? "s" : ""}
						</p>
					)}
				</div>,
				{ duration: 5000 }
			);
		} else {
			toast.error("Please fix the validation errors before saving");
		}
	};

	if (loading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Home Page</h1>
					<p className="text-muted-foreground">
						Manage the content on the home page.
					</p>
				</div>
				<a
					href="/"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onFormError)}
					className="space-y-6"
				>
					<Tabs defaultValue="settings" className="space-y-6">
						<TabsList className="flex flex-wrap h-auto gap-1 p-1 justify-start">
							<TabsTrigger value="settings">Settings</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="features">Features</TabsTrigger>
							<TabsTrigger value="products">Products</TabsTrigger>
							<TabsTrigger value="gallery">Gallery</TabsTrigger>
							<TabsTrigger value="process">Process</TabsTrigger>
							<TabsTrigger value="about">About</TabsTrigger>
							<TabsTrigger value="testimonials">Testimonials</TabsTrigger>
							<TabsTrigger value="cta">CTA</TabsTrigger>
							<TabsTrigger value="rich-content">Rich Content</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Settings Tab - Section Visibility */}
						<TabsContent value="settings" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Section Visibility</CardTitle>
									<CardDescription>
										Control which sections are displayed on the home
										page. Toggle off to hide a section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="sectionVisibility.hero"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Hero Section
														</FormLabel>
														<FormDescription>
															Main banner at the top of the page.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.features"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Features
														</FormLabel>
														<FormDescription>
															Feature highlight cards.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.productShowcase"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Product Showcase
														</FormLabel>
														<FormDescription>
															Featured products grid.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.imageGallery"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Image Gallery
														</FormLabel>
														<FormDescription>
															Facilities image gallery.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.processSteps"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Process Steps
														</FormLabel>
														<FormDescription>
															How it works section.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.about"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															About Section
														</FormLabel>
														<FormDescription>
															Why choose us section.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.testimonials"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Testimonials
														</FormLabel>
														<FormDescription>
															Customer testimonials carousel.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.cta"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															CTA Section
														</FormLabel>
														<FormDescription>
															Bottom call-to-action section.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.richContent"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Rich Content
														</FormLabel>
														<FormDescription>
															Flexible HTML content from text editor.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Hero Tab */}
						<TabsContent value="hero" className="space-y-6">
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Hero Slides</CardTitle>
											<CardDescription>
												Each slide contains its own content (text, images, buttons). The hero auto-slides between them.
											</CardDescription>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendHeroSlide({
													badge: "",
													title: "",
													titleHighlight: "",
													subtitle: "",
													primaryCta: { text: "", href: "", variant: "primary" },
													secondaryCta: { text: "", href: "", variant: "outline" },
													backgroundImage: "",
													mainImage: "",
													mobileImage: "",
													trustIndicators: [],
													floatingCard: { image: "", label: "" },
													certificationCard: { title: "", subtitle: "", progressLabel: "", progressValue: "", progressPercentage: 0 },
												})
											}
										>
											<Plus className="mr-2 h-4 w-4" />
											Add Slide
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									{heroSlideFields.length === 0 && (
										<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
											No slides added yet. Click &quot;Add Slide&quot; to create your first hero slide.
										</div>
									)}

									{heroSlideFields.map((slideField, slideIndex) => (
										<Card key={slideField.id} className="border-2">
											<CardHeader>
												<div className="flex items-center justify-between">
													<CardTitle className="text-base">Slide {slideIndex + 1}</CardTitle>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={async () => {
															const confirmed = await confirm({
																title: "Remove Slide",
																description: `Are you sure you want to remove Slide ${slideIndex + 1}?`,
																confirmText: "Remove",
															});
															if (confirmed) removeHeroSlide(slideIndex);
														}}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</CardHeader>
											<CardContent className="space-y-6">
												{/* Badge */}
												<FormField
													control={form.control}
													name={`hero.slides.${slideIndex}.badge`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Badge Text</FormLabel>
															<FormControl>
																<Input {...field} value={field.value || ""} placeholder="Sweden's leading supplier..." />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												{/* Title */}
												<div className="grid gap-4 sm:grid-cols-2">
													<FormField
														control={form.control}
														name={`hero.slides.${slideIndex}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input {...field} value={field.value || ""} placeholder="Advanced medical" />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`hero.slides.${slideIndex}.titleHighlight`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title (highlight)</FormLabel>
																<FormControl>
																	<Input {...field} value={field.value || ""} placeholder="equipment for your clinic" />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												{/* Subtitle */}
												<FormField
													control={form.control}
													name={`hero.slides.${slideIndex}.subtitle`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Subtitle</FormLabel>
															<FormControl>
																<Textarea {...field} value={field.value || ""} placeholder="Describe your offering..." rows={3} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												{/* Primary CTA */}
												<div className="border rounded-lg p-4 space-y-4">
													<h4 className="font-medium text-sm">Primary Button</h4>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.primaryCta.text`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Text</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="View our catalog" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.primaryCta.href`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Link</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="/products" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>

												{/* Secondary CTA */}
												<div className="border rounded-lg p-4 space-y-4">
													<h4 className="font-medium text-sm">Secondary Button (optional)</h4>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.secondaryCta.text`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Text</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="Contact us" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.secondaryCta.href`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Link</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="/contact" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>

												{/* Background Image */}
												<FormField
													control={form.control}
													name={`hero.slides.${slideIndex}.backgroundImage`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Background Image</FormLabel>
															<FormControl>
																<MediaPicker
																	type="image"
																	value={field.value || null}
																	onChange={(url) => field.onChange(url || "")}
																	placeholder="Select background image"
																	galleryTitle={`Slide ${slideIndex + 1} - Background`}
																/>
															</FormControl>
															<FormDescription>Full-screen background image behind the content</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>

												{/* Main Image */}
												<FormField
													control={form.control}
													name={`hero.slides.${slideIndex}.mainImage`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Main Image (Desktop)</FormLabel>
															<FormControl>
																<MediaPicker
																	type="image"
																	value={field.value || null}
																	onChange={(url) => field.onChange(url || "")}
																	placeholder="Select main image"
																	galleryTitle={`Slide ${slideIndex + 1} - Main Image`}
																/>
															</FormControl>
															<FormDescription>Right-side hero image on desktop</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>

												{/* Mobile Image */}
												<FormField
													control={form.control}
													name={`hero.slides.${slideIndex}.mobileImage`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Mobile Image</FormLabel>
															<FormControl>
																<MediaPicker
																	type="image"
																	value={field.value || null}
																	onChange={(url) => field.onChange(url || "")}
																	placeholder="Select mobile image"
																	galleryTitle={`Slide ${slideIndex + 1} - Mobile Image`}
																/>
															</FormControl>
															<FormDescription>Shown on mobile screens</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>

												{/* Trust Indicators */}
												<div className="border rounded-lg p-4 space-y-3">
													<div className="flex items-center justify-between">
														<h4 className="font-medium text-sm">Trust Indicators</h4>
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => {
																const current = form.getValues(`hero.slides.${slideIndex}.trustIndicators`) || [];
																form.setValue(`hero.slides.${slideIndex}.trustIndicators`, [...current, { icon: "ShieldCheck", text: "" }]);
															}}
														>
															<Plus className="h-4 w-4 mr-1" />
															Add
														</Button>
													</div>
													{(form.watch(`hero.slides.${slideIndex}.trustIndicators`) || []).map((_: unknown, tiIndex: number) => (
														<div key={tiIndex} className="flex gap-3 items-end">
															<FormField
																control={form.control}
																name={`hero.slides.${slideIndex}.trustIndicators.${tiIndex}.icon`}
																render={({ field }) => (
																	<FormItem className="flex-1">
																		<FormLabel>Icon</FormLabel>
																		<Select onValueChange={field.onChange} defaultValue={field.value}>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder="Select icon">
																						{field.value && (
																							<span className="flex items-center gap-2">
																								<IconPreview name={field.value} className="h-4 w-4" />
																								<span>{field.value}</span>
																							</span>
																						)}
																					</SelectValue>
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				{AVAILABLE_ICONS.map((icon) => (
																					<SelectItem key={icon} value={icon}>
																						<span className="flex items-center gap-2">
																							<IconPreview name={icon} className="h-4 w-4" />
																							<span>{icon}</span>
																						</span>
																					</SelectItem>
																				))}
																			</SelectContent>
																		</Select>
																	</FormItem>
																)}
															/>
															<FormField
																control={form.control}
																name={`hero.slides.${slideIndex}.trustIndicators.${tiIndex}.text`}
																render={({ field }) => (
																	<FormItem className="flex-1">
																		<FormLabel>Text</FormLabel>
																		<FormControl>
																			<Input {...field} value={field.value || ""} placeholder="MDR certified" />
																		</FormControl>
																	</FormItem>
																)}
															/>
															<Button
																type="button"
																variant="ghost"
																size="sm"
																onClick={() => {
																	const current = form.getValues(`hero.slides.${slideIndex}.trustIndicators`) || [];
																	form.setValue(`hero.slides.${slideIndex}.trustIndicators`, current.filter((_: unknown, i: number) => i !== tiIndex));
																}}
															>
																<Trash2 className="h-4 w-4 text-destructive" />
															</Button>
														</div>
													))}
												</div>

												{/* Floating Card */}
												<div className="border rounded-lg p-4 space-y-4">
													<h4 className="font-medium text-sm">Floating Card (Top Right)</h4>
													<FormField
														control={form.control}
														name={`hero.slides.${slideIndex}.floatingCard.image`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={field.value || null}
																		onChange={(url) => field.onChange(url || "")}
																		placeholder="Select floating card image"
																		galleryTitle={`Slide ${slideIndex + 1} - Floating Card`}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`hero.slides.${slideIndex}.floatingCard.label`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Label</FormLabel>
																<FormControl>
																	<Input {...field} value={field.value || ""} placeholder="Precision Optics" />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												{/* Certification Card */}
												<div className="border rounded-lg p-4 space-y-4">
													<h4 className="font-medium text-sm">Certification Card (Bottom Left)</h4>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.certificationCard.title`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="Certified Excellence" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.certificationCard.subtitle`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Subtitle</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="ISO 13485 Compliant" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<div className="grid gap-4 sm:grid-cols-3">
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.certificationCard.progressLabel`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Progress Label</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="Performance Score" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.certificationCard.progressValue`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Progress Value</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="99.8%" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${slideIndex}.certificationCard.progressPercentage`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Progress %</FormLabel>
																	<FormControl>
																		<Input
																			type="number"
																			min={0}
																			max={100}
																			placeholder="99.8"
																			{...field}
																			onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Features Tab */}
						<TabsContent value="features" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Features</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendFeature({
													icon: "Star",
													title: "",
													description: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add
										</Button>
									</CardTitle>
									<CardDescription>
										Feature cards displayed below the hero section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{featureFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No features added. Click &quot;Add&quot; to add
											a feature.
										</div>
									) : (
										featureFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Feature {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Feature",
																	description: "Are you sure you want to remove this feature?",
																	confirmText: "Remove",
																});
																if (confirmed) removeFeature(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<FormField
														control={form.control}
														name={`features.${index}.icon`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Icon</FormLabel>
																<Select
																	onValueChange={
																		field.onChange
																	}
																	defaultValue={field.value}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select icon">
																				{field.value && (
																					<span className="flex items-center gap-2">
																						<IconPreview
																							name={
																								field.value
																							}
																							className="h-4 w-4"
																						/>
																						<span>
																							{
																								field.value
																							}
																						</span>
																					</span>
																				)}
																			</SelectValue>
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{AVAILABLE_ICONS.map(
																			(icon) => (
																				<SelectItem
																					key={icon}
																					value={icon}
																				>
																					<span className="flex items-center gap-2">
																						<IconPreview
																							name={icon}
																							className="h-4 w-4"
																						/>
																						<span>
																							{icon}
																						</span>
																					</span>
																				</SelectItem>
																			)
																		)}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`features.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="24/7 Support"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`features.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Description
																</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Expert technical assistance..."
																		rows={2}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Products Tab */}
						<TabsContent value="products" className="space-y-6">
							{/* Section Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Title and CTA for the product showcase section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="productShowcase.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Premium Medical Equipment"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="productShowcase.ctaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CTA Button Text</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="View Full Catalog"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="productShowcase.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Explore our catalog of certified, high-performance medical devices..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="productShowcase.ctaHref"
										render={({ field }) => (
											<FormItem>
												<FormLabel>CTA Button Link</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="/produkter"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Products List */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Featured Products</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendProduct({
													name: "",
													category: "",
													description: "",
													status: "In Stock",
													image: "",
													href: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Product
										</Button>
									</CardTitle>
									<CardDescription>
										Products displayed in the showcase section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{productFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No products added. Click &quot;Add
											Product&quot; to add one.
										</div>
									) : (
										productFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Product {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Product",
																	description: "Are you sure you want to remove this product?",
																	confirmText: "Remove",
																});
																if (confirmed) removeProduct(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.name`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Name</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Advanced MRI Scanner X1"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.category`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Category
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Imaging"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={`productShowcase.products.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Description
																</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Professional grade equipment..."
																		rows={2}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.status`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Status</FormLabel>
																	<Select
																		onValueChange={
																			field.onChange
																		}
																		defaultValue={field.value}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select status" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="In Stock">
																				In Stock
																			</SelectItem>
																			<SelectItem value="Low Stock">
																				Low Stock
																			</SelectItem>
																			<SelectItem value="Pre-order">
																				Pre-order
																			</SelectItem>
																			<SelectItem value="Out of Stock">
																				Out of Stock
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.href`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Link (optional)
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="/produkter/product-slug"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={`productShowcase.products.${index}.image`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image (Desktop)</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={
																			field.value || null
																		}
																		onChange={(url) =>
																			field.onChange(
																				url || ""
																			)
																		}
																		placeholder="Select product image for desktop"
																		galleryTitle="Select Product Image (Desktop)"
																	/>
																</FormControl>
																<FormDescription>
																	This image will be shown on desktop/tablet
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`productShowcase.products.${index}.mobileImage`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image (Mobile)</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={
																			field.value || null
																		}
																		onChange={(url) =>
																			field.onChange(
																				url || ""
																			)
																		}
																		placeholder="Select product image for mobile"
																		galleryTitle="Select Product Image (Mobile)"
																	/>
																</FormControl>
																<FormDescription>
																	This image will be shown on mobile (portrait recommended)
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Gallery Tab */}
						<TabsContent value="gallery" className="space-y-6">
							{/* Section Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Title and CTA for the image gallery section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="imageGallery.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Our Facilities"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="imageGallery.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Excellence in Action"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="imageGallery.subtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="See how our equipment transforms..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">Bottom CTA Card</h4>
										<div className="grid gap-4 sm:grid-cols-2">
											<FormField
												control={form.control}
												name="imageGallery.ctaTitle"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CTA Title</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Want to see more?"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="imageGallery.ctaButtonText"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Book Tour"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<FormField
											control={form.control}
											name="imageGallery.ctaSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CTA Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Book a virtual tour of our facilities..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Gallery Images */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Gallery Images</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendGalleryImage({
													src: "",
													title: "",
													subtitle: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Image
										</Button>
									</CardTitle>
									<CardDescription>
										Images displayed in the gallery grid. First image
										is larger.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{galleryImageFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No images added. Click &quot;Add Image&quot; to
											add one.
										</div>
									) : (
										galleryImageFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															{index === 0
																? "Featured Image"
																: `Image ${index + 1}`}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Gallery Image",
																	description: "Are you sure you want to remove this image?",
																	confirmText: "Remove",
																});
																if (confirmed) removeGalleryImage(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<FormField
														control={form.control}
														name={`imageGallery.images.${index}.src`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image (Desktop)</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={
																			field.value || null
																		}
																		onChange={(url) =>
																			field.onChange(
																				url || ""
																			)
																		}
																		placeholder="Select gallery image for desktop"
																		galleryTitle="Select Gallery Image (Desktop)"
																	/>
																</FormControl>
																<FormDescription>
																	This image will be shown on desktop/tablet
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`imageGallery.images.${index}.mobileSrc`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image (Mobile)</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={
																			field.value || null
																		}
																		onChange={(url) =>
																			field.onChange(
																				url || ""
																			)
																		}
																		placeholder="Select gallery image for mobile"
																		galleryTitle="Select Gallery Image (Mobile)"
																	/>
																</FormControl>
																<FormDescription>
																	This image will be shown on mobile (portrait recommended)
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.title`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Modern Operating Theaters"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.subtitle`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Subtitle
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Equipped with precision robotics"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Process Steps Tab */}
						<TabsContent value="process" className="space-y-6">
							{/* Section Header */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Title and description for the process steps
										section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="processStepsSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="How it works"
													/>
												</FormControl>
												<FormDescription>
													Small text displayed above the title.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="processStepsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Seamless purchasing process"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="processStepsSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Description</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="We make it simple, transparent and efficient..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Steps */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Process Steps</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendProcessStep({
													stepNumber: String(
														processStepFields.length + 1
													).padStart(2, "0"),
													icon: "Search",
													title: "",
													description: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add
										</Button>
									</CardTitle>
									<CardDescription>
										Step-by-step process for how customers can
										purchase.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{processStepFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No process steps added.
										</div>
									) : (
										processStepFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Step {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Process Step",
																	description: "Are you sure you want to remove this step?",
																	confirmText: "Remove",
																});
																if (confirmed) removeProcessStep(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`processStepsSection.steps.${index}.stepNumber`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Step Number
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="01"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`processStepsSection.steps.${index}.icon`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Icon</FormLabel>
																	<Select
																		onValueChange={
																			field.onChange
																		}
																		defaultValue={field.value}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select icon">
																					{field.value && (
																						<span className="flex items-center gap-2">
																							<IconPreview
																								name={
																									field.value
																								}
																								className="h-4 w-4"
																							/>
																							<span>
																								{
																									field.value
																								}
																							</span>
																						</span>
																					)}
																				</SelectValue>
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			{AVAILABLE_ICONS.map(
																				(icon) => (
																					<SelectItem
																						key={icon}
																						value={icon}
																					>
																						<span className="flex items-center gap-2">
																							<IconPreview
																								name={
																									icon
																								}
																								className="h-4 w-4"
																							/>
																							<span>
																								{icon}
																							</span>
																						</span>
																					</SelectItem>
																				)
																			)}
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={`processStepsSection.steps.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="Browse & Select"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`processStepsSection.steps.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Description
																</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Explore our comprehensive catalog..."
																		rows={2}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`processStepsSection.steps.${index}.link`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Link URL</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="/kontakt"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* About Section Tab */}
						<TabsContent value="about" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>About Section</CardTitle>
									<CardDescription>
										Section describing the company and its benefits.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="aboutSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Why choose Synos"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="aboutSection.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Empowering healthcare with"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="aboutSection.titleHighlight"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (highlight)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="precision technology"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="aboutSection.content"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Content</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="At Synos Medical we bridge..."
														rows={4}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="aboutSection.image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Image (Desktop)</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) =>
															field.onChange(url || "")
														}
														placeholder="Select image for desktop view"
														galleryTitle="Select About Image (Desktop)"
													/>
												</FormControl>
												<FormDescription>
													This image will be shown on desktop/tablet screens
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="aboutSection.mobileImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Image (Mobile)</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) =>
															field.onChange(url || "")
														}
														placeholder="Select image for mobile view"
														galleryTitle="Select About Image (Mobile)"
													/>
												</FormControl>
												<FormDescription>
													This image will be shown on mobile screens (portrait recommended)
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Benefits */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">Benefits</h4>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addBenefit}
											>
												<Plus className="h-4 w-4 mr-1" />
												Add
											</Button>
										</div>
										{benefits.map((benefit, index) => (
											<div
												key={index}
												className="flex gap-2 items-center"
											>
												<Input
													className="flex-1"
													placeholder="MDR certified equipment"
													value={benefit}
													onChange={(e) =>
														updateBenefit(index, e.target.value)
													}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Benefit",
															description: "Are you sure you want to remove this benefit?",
															confirmText: "Remove",
														});
														if (confirmed) removeBenefit(index);
													}}
													className="text-destructive hover:text-destructive"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>

									{/* About Section CTAs */}
									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">Primary Button</h4>
										<div className="grid gap-4 sm:grid-cols-3">
											<FormField
												control={form.control}
												name="aboutSection.primaryCta.text"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Learn more about us"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="aboutSection.primaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="/about"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="aboutSection.primaryCta.variant"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Style</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select style" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="primary">
																	Primary
																</SelectItem>
																<SelectItem value="secondary">
																	Secondary
																</SelectItem>
																<SelectItem value="outline">
																	Outline
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Certification Badge */}
									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">
											Certification Badge (on image)
										</h4>
										<FormField
											control={form.control}
											name="aboutSection.certificationBadge.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="ISO 13485 Certified"
														/>
													</FormControl>
													<FormDescription>
														Title displayed on the certification
														badge overlay.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="aboutSection.certificationBadge.description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Description</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Setting the gold standard in medical technology distribution."
															rows={2}
														/>
													</FormControl>
													<FormDescription>
														Short text displayed below the badge
														title.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Testimonials Tab */}
						<TabsContent value="testimonials" className="space-y-6">
							{/* Section Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Title and description for the testimonials
										section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="testimonialsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Trusted by Leading Healthcare Providers"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="testimonialsSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Hear from healthcare professionals who have transformed their practices..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Testimonials List */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Testimonials</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendTestimonial({
													quote: "",
													author: "",
													role: "",
													company: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Testimonial
										</Button>
									</CardTitle>
									<CardDescription>
										Customer testimonials displayed in a carousel.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{testimonialFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No testimonials added. Click &quot;Add
											Testimonial&quot; to add one.
										</div>
									) : (
										testimonialFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Testimonial {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Testimonial",
																	description: "Are you sure you want to remove this testimonial?",
																	confirmText: "Remove",
																});
																if (confirmed) removeTestimonial(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<FormField
														control={form.control}
														name={`testimonialsSection.testimonials.${index}.quote`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Quote</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Enter the testimonial quote..."
																		rows={3}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.author`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Author Name
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Dr. Sarah Chen"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.role`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Role</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Chief of Radiology"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={`testimonialsSection.testimonials.${index}.company`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Company/Hospital
																</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="St. Mary's General Hospital"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* CTA Section Tab */}
						<TabsContent value="cta" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>CTA Section</CardTitle>
									<CardDescription>
										Call-to-action section at the bottom of the home
										page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="ctaSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Ready to upgrade your business?"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="ctaSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Contact us today..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="ctaSection.phoneTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Call us directly"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.phoneSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="We are available..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="ctaSection.emailTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Email"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.emailSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Send us a message"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">Contact Form Card</h4>
										<FormField
											control={form.control}
											name="ctaSection.formTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Have questions?"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.formSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Fill out our contact form..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.formCtaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Text</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Go to contact form"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Rich Content Tab */}
						<TabsContent value="rich-content" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Rich Content Editor</CardTitle>
									<CardDescription>
										Use the text editor to create flexible HTML content. This content will be rendered as-is on the page.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="richContent"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Content</FormLabel>
												<FormControl>
													<TextEditor
														defaultValue={field.value || ""}
														onChange={field.onChange}
														variant="advanceFull"
														height="500px"
														placeholder="Enter your content here..."
													/>
												</FormControl>
												<FormDescription>
													Use the toolbar to format text, add images, tables, links, and more.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								{/* Left Column - SEO Settings + Analysis */}
								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>SEO Settings</CardTitle>
											<CardDescription>
												Search engine optimization for the home page.
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-6">
											{/* Focus Keyphrase */}
											<FormField
												control={form.control}
												name="seo.focusKeyphrase"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Focus Keyphrase</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Enter focus keyphrase e.g. medical equipment"
															/>
														</FormControl>
														<FormDescription>
															The keyword or phrase you want this page to rank for.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											{/* Page Title */}
											<FormField
												control={form.control}
												name="seo.title"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Page Title</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Synos Medical - Medical Equipment"
																maxLength={70}
															/>
														</FormControl>
														<CharacterCount
															value={field.value || ""}
															min={30}
															max={70}
															optimal={{ min: 50, max: 60 }}
															label="Title length"
														/>
														<FormMessage />
													</FormItem>
												)}
											/>

											{/* Meta Description */}
											<FormField
												control={form.control}
												name="seo.description"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Meta Description</FormLabel>
														<FormControl>
															<Textarea
																{...field}
																value={field.value || ""}
																placeholder="Sweden's leading supplier of medical equipment..."
																rows={3}
																maxLength={200}
															/>
														</FormControl>
														<CharacterCount
															value={field.value || ""}
															min={80}
															max={200}
															optimal={{ min: 120, max: 160 }}
															label="Description length"
														/>
														<FormMessage />
													</FormItem>
												)}
											/>

											{/* OG Image */}
											<FormField
												control={form.control}
												name="seo.ogImage"
												render={({ field }) => (
													<FormItem>
														<FormLabel>OG Image</FormLabel>
														<FormControl>
															<MediaPicker
																type="image"
																value={field.value || null}
																onChange={(url) =>
																	field.onChange(url || "")
																}
																placeholder="Select OG image (1200x630px recommended)"
																galleryTitle="Select OG Image"
															/>
														</FormControl>
														<FormDescription>
															Image shown when sharing on social
															media.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</CardContent>
									</Card>

									{/* SEO Analysis */}
									<SeoAnalysis
										data={{
											title: form.watch("seo.title") || "",
											description: form.watch("seo.description") || "",
											slug: "",
											focusKeyphrase: form.watch("seo.focusKeyphrase") || "",
											hasOgImage: !!form.watch("seo.ogImage"),
											pageContent: aggregatedPageContent,
										}}
									/>

									{/* Readability Analysis */}
									<ReadabilityAnalysis
										data={{
											content: aggregatedPageContent,
											title: form.watch("seo.title") || "",
										}}
									/>
								</div>

								{/* Right Column - Preview */}
								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Preview</CardTitle>
											<CardDescription>
												See how the home page appears in search results
												and social media.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<SeoPreview
												data={{
													title:
														form.watch("seo.title") ||
														"Synos Medical - Medical Equipment",
													description:
														form.watch("seo.description") ||
														"Add a description",
													slug: "",
													ogImage: form.watch("seo.ogImage") || null,
													siteName: "Synos Medical",
													siteUrl: "www.synos.se",
												}}
											/>
										</CardContent>
									</Card>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					{/* Save Button */}
					<div className="flex justify-end">
						<Button type="submit" disabled={saving} size="lg">
							{saving ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
					</div>
				</form>
			</Form>
			<ConfirmModal />
		</div>
	);
}
