"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	Loader2,
	Save,
	Plus,
	Trash2,
	Eye,
	EyeOff,
	LayoutDashboard,
	Target,
	BarChart3,
	Images,
	HelpCircle,
	MessageSquareQuote,
	Building2,
	Megaphone,
	Search,
	Star,
	ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import {
	updateAboutPageSchema,
	aboutSectionVisibilitySchema,
} from "@/lib/validations/about-page.validation";
import type { AboutPageData } from "@/lib/repositories/about-page.repository";

// Form schema combining all sections
const formSchema = z.object({
	sectionVisibility: aboutSectionVisibilitySchema,
	hero: z.object({
		badge: z.string().optional(),
		title: z.string().optional(),
		subtitle: z.string().optional(),
	}),
	mission: z.object({
		badge: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		image: z.string().optional(),
		features: z
			.array(
				z.object({
					icon: z.string().optional(),
					title: z.string().optional(),
					description: z.string().optional(),
				})
			)
			.optional(),
	}),
	stats: z
		.array(
			z.object({
				value: z.string().optional(),
				label: z.string().optional(),
				suffix: z.string().optional(),
			})
		)
		.optional(),
	imageGallery: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		images: z
			.array(
				z.object({
					src: z.string().optional(),
					alt: z.string().optional(),
				})
			)
			.optional(),
	}),
	faq: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		items: z
			.array(
				z.object({
					question: z.string().optional(),
					answer: z.string().optional(),
				})
			)
			.optional(),
	}),
	testimonials: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		testimonials: z
			.array(
				z.object({
					quote: z.string().optional(),
					author: z.string().optional(),
					role: z.string().optional(),
					company: z.string().optional(),
					image: z.string().optional(),
					rating: z.number().min(1).max(5).optional(),
				})
			)
			.optional(),
	}),
	partners: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		partners: z
			.array(
				z.object({
					name: z.string().optional(),
					logo: z.string().optional(),
					url: z.string().optional(),
				})
			)
			.optional(),
	}),
	cta: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		primaryCta: z
			.object({
				text: z.string().optional(),
				href: z.string().optional(),
			})
			.optional(),
		secondaryCta: z
			.object({
				text: z.string().optional(),
				href: z.string().optional(),
			})
			.optional(),
	}),
	seo: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		ogImage: z.string().optional(),
	}),
});

type FormData = z.infer<typeof formSchema>;

const ICON_OPTIONS = [
	{ value: "Target", label: "Target" },
	{ value: "Award", label: "Award" },
	{ value: "Users", label: "Users" },
	{ value: "Sparkles", label: "Sparkles" },
	{ value: "CheckCircle", label: "CheckCircle" },
	{ value: "Star", label: "Star" },
	{ value: "Heart", label: "Heart" },
	{ value: "Shield", label: "Shield" },
	{ value: "Zap", label: "Zap" },
	{ value: "Globe", label: "Globe" },
];

export default function AboutPageCMS() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				mission: true,
				stats: true,
				imageGallery: true,
				faq: true,
				testimonials: true,
				partners: true,
				cta: true,
			},
			hero: {},
			mission: { features: [] },
			stats: [],
			imageGallery: { images: [] },
			faq: { items: [] },
			testimonials: { testimonials: [] },
			partners: { partners: [] },
			cta: {},
			seo: {},
		},
	});

	// Field arrays
	const {
		fields: statFields,
		append: appendStat,
		remove: removeStat,
	} = useFieldArray({ control: form.control, name: "stats" });

	const {
		fields: featureFields,
		append: appendFeature,
		remove: removeFeature,
	} = useFieldArray({ control: form.control, name: "mission.features" });

	const {
		fields: galleryFields,
		append: appendGalleryImage,
		remove: removeGalleryImage,
	} = useFieldArray({ control: form.control, name: "imageGallery.images" });

	const {
		fields: faqFields,
		append: appendFaq,
		remove: removeFaq,
	} = useFieldArray({ control: form.control, name: "faq.items" });

	const {
		fields: testimonialFields,
		append: appendTestimonial,
		remove: removeTestimonial,
	} = useFieldArray({ control: form.control, name: "testimonials.testimonials" });

	const {
		fields: partnerFields,
		append: appendPartner,
		remove: removePartner,
	} = useFieldArray({ control: form.control, name: "partners.partners" });

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/about-page");
				if (!response.ok) throw new Error("Failed to fetch");
				const data: AboutPageData = await response.json();

				form.reset({
					sectionVisibility: data.sectionVisibility || {
						hero: true,
						mission: true,
						stats: true,
						imageGallery: true,
						faq: true,
						testimonials: true,
						partners: true,
						cta: true,
					},
					hero: data.hero || {},
					mission: {
						badge: data.mission?.badge || "",
						title: data.mission?.title || "",
						description: data.mission?.description || "",
						image: data.mission?.image || "",
						features: data.mission?.features || [],
					},
					stats: data.stats || [],
					imageGallery: {
						title: data.imageGallery?.title || "",
						subtitle: data.imageGallery?.subtitle || "",
						images: data.imageGallery?.images || [],
					},
					faq: {
						title: data.faq?.title || "",
						subtitle: data.faq?.subtitle || "",
						items: data.faq?.items || [],
					},
					testimonials: {
						title: data.testimonials?.title || "",
						subtitle: data.testimonials?.subtitle || "",
						testimonials: data.testimonials?.testimonials || [],
					},
					partners: {
						title: data.partners?.title || "",
						subtitle: data.partners?.subtitle || "",
						partners: data.partners?.partners || [],
					},
					cta: data.cta || {},
					seo: data.seo || {},
				});
			} catch (error) {
				console.error("Error fetching about page:", error);
				toast.error("Failed to load page data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [form]);

	const onSubmit = async (data: FormData) => {
		setIsSaving(true);
		try {
			const payload = updateAboutPageSchema.parse(data);

			const response = await fetch("/api/about-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save");
			}

			toast.success("About page updated successfully!");
		} catch (error) {
			console.error("Error saving about page:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save changes"
			);
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Om Oss</h1>
					<p className="text-muted-foreground">
						Manage your About page content
					</p>
				</div>
				<div className="flex items-center gap-3">
					<a
						href="/om-oss"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						<ExternalLink className="h-4 w-4" />
						<span>View page</span>
					</a>
					<Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="visibility" className="space-y-6">
				<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
					<TabsTrigger value="visibility" className="gap-2">
						<Eye className="h-4 w-4" />
						Visibility
					</TabsTrigger>
					<TabsTrigger value="hero" className="gap-2">
						<LayoutDashboard className="h-4 w-4" />
						Hero
					</TabsTrigger>
					<TabsTrigger value="mission" className="gap-2">
						<Target className="h-4 w-4" />
						Mission
					</TabsTrigger>
					<TabsTrigger value="stats" className="gap-2">
						<BarChart3 className="h-4 w-4" />
						Stats
					</TabsTrigger>
					<TabsTrigger value="gallery" className="gap-2">
						<Images className="h-4 w-4" />
						Gallery
					</TabsTrigger>
					<TabsTrigger value="faq" className="gap-2">
						<HelpCircle className="h-4 w-4" />
						FAQ
					</TabsTrigger>
					<TabsTrigger value="testimonials" className="gap-2">
						<MessageSquareQuote className="h-4 w-4" />
						Testimonials
					</TabsTrigger>
					<TabsTrigger value="partners" className="gap-2">
						<Building2 className="h-4 w-4" />
						Partners
					</TabsTrigger>
					<TabsTrigger value="cta" className="gap-2">
						<Megaphone className="h-4 w-4" />
						CTA
					</TabsTrigger>
					<TabsTrigger value="seo" className="gap-2">
						<Search className="h-4 w-4" />
						SEO
					</TabsTrigger>
				</TabsList>

				{/* Visibility Tab */}
				<TabsContent value="visibility">
					<Card>
						<CardHeader>
							<CardTitle>Section Visibility</CardTitle>
							<CardDescription>Choose which sections to display on the page</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							{[
								{ key: "hero", label: "Hero Section" },
								{ key: "mission", label: "Mission Section" },
								{ key: "stats", label: "Stats Bar" },
								{ key: "imageGallery", label: "Image Gallery" },
								{ key: "faq", label: "FAQ Section" },
								{ key: "testimonials", label: "Testimonials" },
								{ key: "partners", label: "Partners" },
								{ key: "cta", label: "CTA Section" },
							].map(({ key, label }) => (
								<div
									key={key}
									className="flex items-center justify-between rounded-lg border p-4"
								>
									<div className="flex items-center gap-3">
										{form.watch(
											`sectionVisibility.${key as keyof FormData["sectionVisibility"]}`
										) ? (
											<Eye className="h-4 w-4 text-primary" />
										) : (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										)}
										<span className="font-medium">{label}</span>
									</div>
									<Switch
										checked={form.watch(
											`sectionVisibility.${key as keyof FormData["sectionVisibility"]}`
										)}
										onCheckedChange={(checked) =>
											form.setValue(
												`sectionVisibility.${key as keyof FormData["sectionVisibility"]}`,
												checked
											)
										}
									/>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Hero Tab */}
				<TabsContent value="hero">
					<Card>
						<CardHeader>
							<CardTitle>Hero Section</CardTitle>
							<CardDescription>Dark hero section with animated background</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Badge Text</Label>
								<Input
									{...form.register("hero.badge")}
									placeholder="e.g., Om Synos Medical"
								/>
							</div>
							<div className="space-y-2">
								<Label>Title</Label>
								<Input
									{...form.register("hero.title")}
									placeholder="e.g., Om Oss"
								/>
							</div>
							<div className="space-y-2">
								<Label>Subtitle</Label>
								<Textarea
									{...form.register("hero.subtitle")}
									placeholder="Brief description..."
									rows={3}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Mission Tab */}
				<TabsContent value="mission">
					<Card>
						<CardHeader>
							<CardTitle>Mission Section</CardTitle>
							<CardDescription>About section with image and feature cards</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Badge</Label>
									<Input
										{...form.register("mission.badge")}
										placeholder="e.g., Var Mission"
									/>
								</div>
								<div className="space-y-2">
									<Label>Title</Label>
									<Input
										{...form.register("mission.title")}
										placeholder="e.g., Vi levererar kvalitet"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Description</Label>
								<Textarea
									{...form.register("mission.description")}
									placeholder="Describe your mission..."
									rows={4}
								/>
							</div>

							<div className="space-y-2">
								<Label>Featured Image</Label>
								<MediaPicker
									type="image"
									value={form.watch("mission.image") || null}
									onChange={(url) => form.setValue("mission.image", url || "")}
									placeholder="Select featured image"
									galleryTitle="Select Image"
								/>
							</div>

							{/* Features */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Features</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendFeature({ icon: "CheckCircle", title: "", description: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Feature
									</Button>
								</div>

								{featureFields.map((field, index) => (
									<div
										key={field.id}
										className="rounded-lg border p-4 space-y-4"
									>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												Feature {index + 1}
											</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeFeature(index)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
										<div className="grid gap-4 md:grid-cols-3">
											<div className="space-y-2">
												<Label>Icon</Label>
												<Select
													value={form.watch(`mission.features.${index}.icon`) || ""}
													onValueChange={(value) =>
														form.setValue(`mission.features.${index}.icon`, value)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select icon" />
													</SelectTrigger>
													<SelectContent>
														{ICON_OPTIONS.map((icon) => (
															<SelectItem key={icon.value} value={icon.value}>
																{icon.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Title</Label>
												<Input
													{...form.register(`mission.features.${index}.title`)}
													placeholder="Feature title"
												/>
											</div>
											<div className="space-y-2">
												<Label>Description</Label>
												<Input
													{...form.register(`mission.features.${index}.description`)}
													placeholder="Short description"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Stats Tab */}
				<TabsContent value="stats">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Stats Bar</CardTitle>
									<CardDescription>Display key statistics in a dark bar section</CardDescription>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => appendStat({ value: "", label: "", suffix: "" })}
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Stat
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{statFields.length === 0 && (
								<p className="text-center text-muted-foreground py-8">
									No stats added yet. Click &quot;Add Stat&quot; to get started.
								</p>
							)}

							{statFields.map((field, index) => (
								<div key={field.id} className="rounded-lg border p-4">
									<div className="flex items-center justify-between mb-4">
										<span className="text-sm font-medium">Stat {index + 1}</span>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => removeStat(index)}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
									<div className="grid gap-4 md:grid-cols-3">
										<div className="space-y-2">
											<Label>Value</Label>
											<Input
												{...form.register(`stats.${index}.value`)}
												placeholder="e.g., 500"
											/>
										</div>
										<div className="space-y-2">
											<Label>Suffix (optional)</Label>
											<Input
												{...form.register(`stats.${index}.suffix`)}
												placeholder="e.g., +"
											/>
										</div>
										<div className="space-y-2">
											<Label>Label</Label>
											<Input
												{...form.register(`stats.${index}.label`)}
												placeholder="e.g., Nojda kunder"
											/>
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Gallery Tab */}
				<TabsContent value="gallery">
					<Card>
						<CardHeader>
							<CardTitle>Image Gallery</CardTitle>
							<CardDescription>Showcase images in a responsive grid layout</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("imageGallery.title")}
										placeholder="e.g., Vara lokaler"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("imageGallery.subtitle")}
										placeholder="Brief description"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Gallery Images</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => appendGalleryImage({ src: "", alt: "" })}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Image
									</Button>
								</div>

								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{galleryFields.map((field, index) => (
										<div key={field.id} className="rounded-lg border p-4 space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													Image {index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeGalleryImage(index)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
											<MediaPicker
												type="image"
												value={form.watch(`imageGallery.images.${index}.src`) || null}
												onChange={(url) =>
													form.setValue(`imageGallery.images.${index}.src`, url || "")
												}
												placeholder="Select image"
												galleryTitle="Select Gallery Image"
											/>
											<Input
												{...form.register(`imageGallery.images.${index}.alt`)}
												placeholder="Alt text"
											/>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* FAQ Tab */}
				<TabsContent value="faq">
					<Card>
						<CardHeader>
							<CardTitle>FAQ Section</CardTitle>
							<CardDescription>Frequently asked questions with accordion</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("faq.title")}
										placeholder="e.g., Vanliga fragor"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("faq.subtitle")}
										placeholder="Brief description"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">FAQ Items</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => appendFaq({ question: "", answer: "" })}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add FAQ
									</Button>
								</div>

								{faqFields.map((field, index) => (
									<div key={field.id} className="rounded-lg border p-4 space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">FAQ {index + 1}</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeFaq(index)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
										<div className="space-y-2">
											<Label>Question</Label>
											<Input
												{...form.register(`faq.items.${index}.question`)}
												placeholder="Enter question"
											/>
										</div>
										<div className="space-y-2">
											<Label>Answer</Label>
											<Textarea
												{...form.register(`faq.items.${index}.answer`)}
												placeholder="Enter answer"
												rows={3}
											/>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Testimonials Tab */}
				<TabsContent value="testimonials">
					<Card>
						<CardHeader>
							<CardTitle>Testimonials Section</CardTitle>
							<CardDescription>Customer testimonials displayed in a dark section</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("testimonials.title")}
										placeholder="e.g., Vad vara kunder sager"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("testimonials.subtitle")}
										placeholder="Brief description"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Testimonials</Label>
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
												image: "",
												rating: 5,
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Testimonial
									</Button>
								</div>

								{testimonialFields.map((field, index) => (
									<div key={field.id} className="rounded-lg border p-4 space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												Testimonial {index + 1}
											</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeTestimonial(index)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>

										<div className="space-y-2">
											<Label>Quote</Label>
											<Textarea
												{...form.register(
													`testimonials.testimonials.${index}.quote`
												)}
												placeholder="Customer testimonial"
												rows={3}
											/>
										</div>

										<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
											<div className="space-y-2">
												<Label>Author</Label>
												<Input
													{...form.register(
														`testimonials.testimonials.${index}.author`
													)}
													placeholder="Name"
												/>
											</div>
											<div className="space-y-2">
												<Label>Role</Label>
												<Input
													{...form.register(
														`testimonials.testimonials.${index}.role`
													)}
													placeholder="Job title"
												/>
											</div>
											<div className="space-y-2">
												<Label>Company</Label>
												<Input
													{...form.register(
														`testimonials.testimonials.${index}.company`
													)}
													placeholder="Company name"
												/>
											</div>
											<div className="space-y-2">
												<Label>Rating</Label>
												<Select
													value={String(
														form.watch(
															`testimonials.testimonials.${index}.rating`
														) || 5
													)}
													onValueChange={(value) =>
														form.setValue(
															`testimonials.testimonials.${index}.rating`,
															parseInt(value)
														)
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{[1, 2, 3, 4, 5].map((rating) => (
															<SelectItem key={rating} value={String(rating)}>
																<div className="flex items-center gap-1">
																	{[...Array(rating)].map((_, i) => (
																		<Star
																			key={i}
																			className="h-3 w-3 fill-yellow-400 text-yellow-400"
																		/>
																	))}
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Author Image (optional)</Label>
											<MediaPicker
												type="image"
												value={
													form.watch(
														`testimonials.testimonials.${index}.image`
													) || null
												}
												onChange={(url) =>
													form.setValue(
														`testimonials.testimonials.${index}.image`,
														url || ""
													)
												}
												placeholder="Select author image"
												galleryTitle="Select Author Image"
											/>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Partners Tab */}
				<TabsContent value="partners">
					<Card>
						<CardHeader>
							<CardTitle>Partners Section</CardTitle>
							<CardDescription>Logo carousel of partner companies</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("partners.title")}
										placeholder="e.g., Vara partners"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("partners.subtitle")}
										placeholder="Brief description"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Partners</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendPartner({ name: "", logo: "", url: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Partner
									</Button>
								</div>

								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{partnerFields.map((field, index) => (
										<div key={field.id} className="rounded-lg border p-4 space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													Partner {index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removePartner(index)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
											<div className="space-y-2">
												<Label>Name</Label>
												<Input
													{...form.register(`partners.partners.${index}.name`)}
													placeholder="Partner name"
												/>
											</div>
											<div className="space-y-2">
												<Label>Logo</Label>
												<MediaPicker
													type="image"
													value={
														form.watch(`partners.partners.${index}.logo`) || null
													}
													onChange={(url) =>
														form.setValue(`partners.partners.${index}.logo`, url || "")
													}
													placeholder="Select logo"
													galleryTitle="Select Partner Logo"
												/>
											</div>
											<div className="space-y-2">
												<Label>URL (optional)</Label>
												<Input
													{...form.register(`partners.partners.${index}.url`)}
													placeholder="https://..."
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* CTA Tab */}
				<TabsContent value="cta">
					<Card>
						<CardHeader>
							<CardTitle>CTA Section</CardTitle>
							<CardDescription>Call-to-action section with gradient background</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label>Title</Label>
								<Input
									{...form.register("cta.title")}
									placeholder="e.g., Redo att komma igang?"
								/>
							</div>

							<div className="space-y-2">
								<Label>Description</Label>
								<Textarea
									{...form.register("cta.description")}
									placeholder="Brief call-to-action text"
									rows={3}
								/>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-4 rounded-lg border p-4">
									<h4 className="font-medium">Primary Button</h4>
									<div className="space-y-2">
										<Label>Text</Label>
										<Input
											{...form.register("cta.primaryCta.text")}
											placeholder="e.g., Kontakta oss"
										/>
									</div>
									<div className="space-y-2">
										<Label>Link</Label>
										<Input
											{...form.register("cta.primaryCta.href")}
											placeholder="/kontakt"
										/>
									</div>
								</div>

								<div className="space-y-4 rounded-lg border p-4">
									<h4 className="font-medium">Secondary Button</h4>
									<div className="space-y-2">
										<Label>Text</Label>
										<Input
											{...form.register("cta.secondaryCta.text")}
											placeholder="e.g., Se produkter"
										/>
									</div>
									<div className="space-y-2">
										<Label>Link</Label>
										<Input
											{...form.register("cta.secondaryCta.href")}
											placeholder="/produkter"
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* SEO Tab */}
				<TabsContent value="seo" className="space-y-6">
					<div className="grid gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>SEO Settings</CardTitle>
								<CardDescription>
									Search engine optimization for the about page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Meta Title</Label>
									<Input
										{...form.register("seo.title")}
										placeholder="Om oss - Synos Medical"
									/>
								</div>

								<div className="space-y-2">
									<Label>Meta Description</Label>
									<Textarea
										{...form.register("seo.description")}
										placeholder="SEO description for search engines..."
										rows={3}
									/>
								</div>

								<div className="space-y-2">
									<Label>Open Graph Image</Label>
									<MediaPicker
										type="image"
										value={form.watch("seo.ogImage") || null}
										onChange={(url) => form.setValue("seo.ogImage", url || "")}
										placeholder="Select OG image (1200x630px recommended)"
										galleryTitle="Select OG Image"
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Preview</CardTitle>
								<CardDescription>
									See how the about page appears in search results
								</CardDescription>
							</CardHeader>
							<CardContent>
								<SeoPreview
									data={{
										title: form.watch("seo.title") || "Om oss - Synos Medical",
										description: form.watch("seo.description") || "Add a description",
										slug: "om-oss",
										ogImage: form.watch("seo.ogImage") || null,
										siteName: "Synos Medical",
										siteUrl: "www.synos.se",
									}}
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Floating Save Button */}
			<div className="flex justify-end sticky bottom-6">
				<Button
					onClick={form.handleSubmit(onSubmit)}
					disabled={isSaving}
					size="lg"
					className="shadow-lg"
				>
					{isSaving ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" />
							Save Changes
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
