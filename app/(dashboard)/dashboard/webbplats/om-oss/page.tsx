"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import {
	Loader2,
	Plus,
	Trash2,
	Info,
	Search,
	Settings,
	Zap,
	BookOpen,
	CheckCircle,
	ExternalLink,
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
import { Switch } from "@/components/ui/switch";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
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

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
	CheckCircle,
	Search,
	Zap,
	BookOpen,
	Info,
	Settings,
};

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

// CTA Button schema
const ctaButtonSchema = z.object({
	text: z.string().optional(),
	href: z.string().optional(),
	variant: z.enum(["primary", "outline", "secondary", "ghost"]).optional(),
});

// Content Section schema
const contentSectionSchema = z.object({
	title: z.string().optional(),
	content: z.string().optional(),
	highlighted: z.boolean().optional(),
});

// Feature Card schema
const featureCardSchema = z.object({
	icon: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	ctaText: z.string().optional(),
	ctaHref: z.string().optional(),
});

// Section Visibility schema
const sectionVisibilitySchema = z.object({
	hero: z.boolean(),
	contentSections: z.boolean(),
	contactSection: z.boolean(),
	featureCards: z.boolean(),
	companyInfo: z.boolean(),
	richContent: z.boolean(),
});

// Form schema
const aboutPageFormSchema = z.object({
	sectionVisibility: sectionVisibilitySchema,

	hero: z
		.object({
			title: z.string().optional(),
			subtitle: z.string().optional(),
		})
		.optional(),

	richContent: z.string().optional(), // HTML content from text editor

	contentSections: z.array(contentSectionSchema).optional(),

	contactSection: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			primaryCta: ctaButtonSchema.optional(),
			secondaryCta: ctaButtonSchema.optional(),
		})
		.optional(),

	featureCards: z.array(featureCardSchema).optional(),

	companyInfo: z
		.object({
			companyName: z.string().optional(),
			organizationNumber: z.string().optional(),
			addresses: z.array(z.string()).optional(),
		})
		.optional(),

	seo: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			ogImage: z.string().optional(),
		})
		.optional(),
});

type AboutPageFormValues = z.infer<typeof aboutPageFormSchema>;

export default function AboutPageAdmin() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	const form = useForm<AboutPageFormValues>({
		resolver: zodResolver(aboutPageFormSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				contentSections: true,
				contactSection: true,
				featureCards: true,
				companyInfo: true,
				richContent: true,
			},
			hero: { title: "", subtitle: "" },
			richContent: "",
			contentSections: [],
			contactSection: {
				title: "",
				description: "",
				primaryCta: { text: "", href: "", variant: "primary" },
				secondaryCta: { text: "", href: "", variant: "outline" },
			},
			featureCards: [],
			companyInfo: {
				companyName: "",
				organizationNumber: "",
				addresses: [],
			},
			seo: { title: "", description: "", ogImage: "" },
		},
	});

	const {
		fields: contentSectionFields,
		append: appendContentSection,
		remove: removeContentSection,
	} = useFieldArray({
		control: form.control,
		name: "contentSections",
	});

	const {
		fields: featureCardFields,
		append: appendFeatureCard,
		remove: removeFeatureCard,
	} = useFieldArray({
		control: form.control,
		name: "featureCards",
	});

	const {
		fields: addressFields,
		append: appendAddress,
		remove: removeAddress,
	} = useFieldArray({
		control: form.control,
		name: "companyInfo.addresses" as never,
	});

	// Fetch data
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/about-page");
				if (!response.ok) throw new Error("Failed to fetch");
				const data = await response.json();

				form.reset({
					sectionVisibility: data.sectionVisibility || {
						hero: true,
						contentSections: true,
						contactSection: true,
						featureCards: true,
						companyInfo: true,
						richContent: true,
					},
					hero: data.hero || { title: "", subtitle: "" },
					richContent: data.richContent || "",
					contentSections: data.contentSections || [],
					contactSection: data.contactSection || {},
					featureCards: data.featureCards || [],
					companyInfo: {
						...data.companyInfo,
						addresses: data.companyInfo?.addresses || [],
					},
					seo: data.seo || {},
				});
			} catch (error) {
				console.error("Error fetching about page:", error);
				toast.error("Failed to fetch data");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [form]);

	// Helper to format validation errors
	function formatValidationErrors(details: unknown): string {
		if (!details || typeof details !== "object") return "";

		const flattenedError = details as {
			fieldErrors?: Record<string, string[]>;
			formErrors?: string[];
		};

		const errors: string[] = [];

		// Add form-level errors
		if (flattenedError.formErrors?.length) {
			errors.push(...flattenedError.formErrors);
		}

		// Add field-level errors
		if (flattenedError.fieldErrors) {
			for (const [field, messages] of Object.entries(
				flattenedError.fieldErrors
			)) {
				if (messages?.length) {
					errors.push(`${field}: ${messages.join(", ")}`);
				}
			}
		}

		return errors.length > 0 ? errors.join("; ") : "";
	}

	// Submit handler
	async function onSubmit(values: AboutPageFormValues) {
		setSaving(true);
		try {
			const response = await fetch("/api/about-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				const errorMessage =
					data.error || data.message || "Failed to save changes";
				const details = data.details
					? `: ${formatValidationErrors(data.details)}`
					: "";
				throw new Error(`${errorMessage}${details}`);
			}

			toast.success("About page saved successfully");
		} catch (error) {
			console.error("Error saving:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save changes"
			);
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">About Page</h1>
					<p className="text-muted-foreground">
						Manage the content of the about page.
					</p>
				</div>
				<a
					href="/om-oss"
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
					id="about-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="rich-content">Rich Content</TabsTrigger>
							<TabsTrigger value="content">Content</TabsTrigger>
							<TabsTrigger value="features">Features</TabsTrigger>
							<TabsTrigger value="company">Company</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Visibility Tab */}
						<TabsContent value="visibility" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Section Visibility</CardTitle>
									<CardDescription>
										Choose which sections to display on the page
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="sectionVisibility.hero"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Hero Section</FormLabel>
													<FormDescription>
														Title and subtitle
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
										name="sectionVisibility.contentSections"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Content Sections</FormLabel>
													<FormDescription>
														Text sections with descriptions
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
										name="sectionVisibility.contactSection"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Contact Section</FormLabel>
													<FormDescription>
														CTA with contact buttons
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
										name="sectionVisibility.featureCards"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Feature Cards</FormLabel>
													<FormDescription>
														Cards with icons and descriptions
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
										name="sectionVisibility.companyInfo"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>
														Company Information
													</FormLabel>
													<FormDescription>
														Organization number and addresses
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
												<div>
													<FormLabel>
														Rich Content (Text Editor)
													</FormLabel>
													<FormDescription>
														Flexible HTML content from text editor
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
								</CardContent>
							</Card>
						</TabsContent>

						{/* Hero Tab */}
						<TabsContent value="hero" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
									<CardDescription>
										Title and subtitle at the top of the page
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="hero.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Om Synos Medical"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hero.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Sveriges främsta leverantör..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Rich Content Tab */}
						<TabsContent value="rich-content" className="space-y-4">
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

						{/* Content Sections Tab */}
						<TabsContent value="content" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Content Sections</CardTitle>
									<CardDescription>
										Text sections with titles and content
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{contentSectionFields.map((field, index) => (
										<Card key={field.id} className="p-4">
											<div className="flex items-start gap-4">
												<div className="flex-1 space-y-4">
													<FormField
														control={form.control}
														name={`contentSections.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="Sektionsrubrik"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`contentSections.${index}.content`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Content</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Sektionsinnehåll..."
																		rows={5}
																	/>
																</FormControl>
																<FormDescription>
																	Use line breaks to separate
																	paragraphs
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`contentSections.${index}.highlighted`}
														render={({ field }) => (
															<FormItem className="flex items-center gap-2">
																<FormControl>
																	<Switch
																		checked={field.value}
																		onCheckedChange={
																			field.onChange
																		}
																	/>
																</FormControl>
																<FormLabel className="!mt-0">
																	Highlighted Background
																</FormLabel>
															</FormItem>
														)}
													/>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Content Section",
															description:
																"Are you sure you want to remove this content section?",
															confirmText: "Remove",
														});
														if (confirmed)
															removeContentSection(index);
													}}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										</Card>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											appendContentSection({
												title: "",
												content: "",
												highlighted: false,
											})
										}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Section
									</Button>
								</CardContent>
							</Card>

							{/* Contact Section */}
							<Card>
								<CardHeader>
									<CardTitle>Contact Section</CardTitle>
									<CardDescription>
										CTA section with contact buttons
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="contactSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Kontakta oss"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="contactSection.description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Vill du veta mer om vår verksamhet?"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="contactSection.primaryCta.text"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Primary Button Text
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Kontakta oss"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contactSection.primaryCta.href"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Primary Button Link
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="/kontakt"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="contactSection.secondaryCta.text"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Secondary Button Text
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="010-205 15 01"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contactSection.secondaryCta.href"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Secondary Button Link
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="tel:010-205 15 01"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Feature Cards Tab */}
						<TabsContent value="features" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Feature Cards</CardTitle>
									<CardDescription>
										Cards with icons and descriptions
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{featureCardFields.map((field, index) => (
										<Card key={field.id} className="p-4">
											<div className="flex items-start gap-4">
												<div className="flex-1 space-y-4">
													<div className="grid grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`featureCards.${index}.icon`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Icon</FormLabel>
																	<Select
																		onValueChange={
																			field.onChange
																		}
																		value={field.value}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select icon" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			{AVAILABLE_ICONS.map(
																				(iconName) => (
																					<SelectItem
																						key={iconName}
																						value={
																							iconName
																						}
																					>
																						<div className="flex items-center gap-2">
																							<IconPreview
																								name={
																									iconName
																								}
																								className="h-4 w-4"
																							/>
																							<span>
																								{
																									iconName
																								}
																							</span>
																						</div>
																					</SelectItem>
																				)
																			)}
																		</SelectContent>
																	</Select>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`featureCards.${index}.title`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={
																				field.value || ""
																			}
																			placeholder="Kortrubrik"
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={`featureCards.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Description
																</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Kortbeskrivning..."
																	/>
																</FormControl>
															</FormItem>
														)}
													/>
													<div className="grid grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`featureCards.${index}.ctaText`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Link Text
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={
																				field.value || ""
																			}
																			placeholder="Läs mer"
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`featureCards.${index}.ctaHref`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Link</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={
																				field.value || ""
																			}
																			placeholder="/starta-eget"
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Feature Card",
															description:
																"Are you sure you want to remove this feature card?",
															confirmText: "Remove",
														});
														if (confirmed)
															removeFeatureCard(index);
													}}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										</Card>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											appendFeatureCard({
												icon: "",
												title: "",
												description: "",
												ctaText: "",
												ctaHref: "",
											})
										}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Card
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Company Info Tab */}
						<TabsContent value="company" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Company Information</CardTitle>
									<CardDescription>
										Organization number and addresses
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="companyInfo.companyName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Company Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Synos Medical AB"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="companyInfo.organizationNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Organization Number</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="556871-8075"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="space-y-2">
										<FormLabel>Addresses</FormLabel>
										{addressFields.map((field, index) => (
											<div
												key={field.id}
												className="flex items-center gap-2"
											>
												<FormField
													control={form.control}
													name={`companyInfo.addresses.${index}`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="Stockholm: Adress..."
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Address",
															description:
																"Are you sure you want to remove this address?",
															confirmText: "Remove",
														});
														if (confirmed) removeAddress(index);
													}}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendAddress("" as never)}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add Address
										</Button>
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
											Search engine optimization for the about page.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
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
															placeholder="Om oss - Synos Medical"
														/>
													</FormControl>
													<FormDescription>
														Displayed in browser tab and search results.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
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
															placeholder="Professionell leverantör av medicinsk laserutrustning..."
															rows={3}
														/>
													</FormControl>
													<FormDescription>
														Short description shown in search results.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
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
															onChange={(url) => field.onChange(url || "")}
															placeholder="Select OG image (1200x630px recommended)"
															galleryTitle="Select OG Image"
														/>
													</FormControl>
													<FormDescription>
														Image shown when sharing on social media.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
										<CardDescription>
											See how the about page appears in search results and social media.
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
