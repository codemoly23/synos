"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";

// Available icons
const ICONS = [
	{ value: "BookOpen", label: "Book" },
	{ value: "Shield", label: "Shield" },
	{ value: "Settings", label: "Settings" },
	{ value: "Users", label: "Users" },
	{ value: "Heart", label: "Heart" },
	{ value: "Star", label: "Star" },
	{ value: "Zap", label: "Zap" },
	{ value: "Award", label: "Award" },
	{ value: "FileText", label: "Document" },
	{ value: "GraduationCap", label: "Education" },
	{ value: "Building2", label: "Building" },
];

// Local Zod schema for the form
const formSchema = z.object({
	sectionVisibility: z
		.object({
			hero: z.boolean(),
			mainContent: z.boolean(),
			benefits: z.boolean(),
			features: z.boolean(),
			contactForm: z.boolean(),
			resources: z.boolean(),
		})
		.optional(),
	hero: z
		.object({
			title: z.string().max(200).optional(),
			titleHighlight: z.string().max(200).optional(),
			subtitle: z.string().max(1000).optional(),
			callout: z.string().max(300).optional(),
		})
		.optional(),
	mainContent: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(300).optional(),
			paragraphs: z.array(z.string().max(2000)).optional(),
		})
		.optional(),
	benefits: z
		.array(
			z.object({
				title: z.string().max(200).optional(),
				description: z.string().max(500).optional(),
				icon: z.string().max(50).optional(),
			})
		)
		.optional(),
	featuresSection: z
		.object({
			title: z.string().max(200).optional(),
			intro: z.string().max(500).optional(),
			features: z
				.array(
					z.object({
						title: z.string().max(200).optional(),
						description: z.string().max(500).optional(),
					})
				)
				.optional(),
		})
		.optional(),
	resourcesSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(300).optional(),
			resources: z
				.array(
					z.object({
						title: z.string().max(200).optional(),
						description: z.string().max(500).optional(),
						href: z.string().max(500).optional(),
						buttonText: z.string().max(100).optional(),
					})
				)
				.optional(),
		})
		.optional(),
	seo: z
		.object({
			title: z.string().max(100).optional(),
			description: z.string().max(300).optional(),
			ogImage: z.string().max(500).optional(),
		})
		.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function StartaEgetPageAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				mainContent: true,
				benefits: true,
				features: true,
				contactForm: true,
				resources: true,
			},
			hero: {},
			mainContent: { paragraphs: [] },
			benefits: [],
			featuresSection: { features: [] },
			resourcesSection: { resources: [] },
			seo: {},
		},
	});

	const benefitsFieldArray = useFieldArray({
		control: form.control,
		name: "benefits",
	});

	const paragraphsFieldArray = useFieldArray({
		control: form.control,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name: "mainContent.paragraphs" as any,
	});

	const featuresFieldArray = useFieldArray({
		control: form.control,
		name: "featuresSection.features",
	});

	const resourcesFieldArray = useFieldArray({
		control: form.control,
		name: "resourcesSection.resources",
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/starta-eget-page");
				if (response.ok) {
					const data = await response.json();
					form.reset({
						sectionVisibility: data.sectionVisibility || {
							hero: true,
							mainContent: true,
							benefits: true,
							features: true,
							contactForm: true,
							resources: true,
						},
						hero: data.hero || {},
						mainContent: data.mainContent || { paragraphs: [] },
						benefits: data.benefits || [],
						featuresSection: data.featuresSection || { features: [] },
						resourcesSection: data.resourcesSection || { resources: [] },
						seo: data.seo || {},
					});
				}
			} catch (error) {
				console.error("Error fetching starta eget page data:", error);
				toast.error("Failed to fetch data");
			} finally {
				setIsLoading(false);
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
		if (flattenedError.formErrors?.length) {
			errors.push(...flattenedError.formErrors);
		}
		if (flattenedError.fieldErrors) {
			for (const [field, messages] of Object.entries(flattenedError.fieldErrors)) {
				if (messages?.length) {
					errors.push(`${field}: ${messages.join(", ")}`);
				}
			}
		}
		return errors.length > 0 ? errors.join("; ") : "";
	}

	async function onSubmit(values: FormValues) {
		setIsSaving(true);
		try {
			const response = await fetch("/api/starta-eget-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				const errorMessage = data.error || data.message || "Failed to save changes";
				const details = data.details ? `: ${formatValidationErrors(data.details)}` : "";
				throw new Error(`${errorMessage}${details}`);
			}

			toast.success("Start Business page saved successfully");
		} catch (error) {
			console.error("Error saving starta eget page:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save changes");
		} finally {
			setIsSaving(false);
		}
	}

	if (isLoading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Start Business Page</h1>
					<p className="text-muted-foreground">
						Manage the content of the Start Business page.
					</p>
				</div>
				<a
					href="/starta-eget"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form id="starta-eget-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="main">Main Content</TabsTrigger>
							<TabsTrigger value="benefits">Benefits</TabsTrigger>
							<TabsTrigger value="features">Features</TabsTrigger>
							<TabsTrigger value="resources">Resources</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Visibility Tab */}
						<TabsContent value="visibility" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Section Visibility</CardTitle>
								</CardHeader>
								<CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<FormField
										control={form.control}
										name="sectionVisibility.hero"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Hero Section
												</FormLabel>
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
										name="sectionVisibility.mainContent"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Main Content
												</FormLabel>
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
										name="sectionVisibility.benefits"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Benefits
												</FormLabel>
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
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Features
												</FormLabel>
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
										name="sectionVisibility.contactForm"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Contact Form
												</FormLabel>
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
										name="sectionVisibility.resources"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Resources
												</FormLabel>
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
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="hero.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															placeholder="Drömmer du om frihet och framgång?"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>
														Text before the highlighted part
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="hero.titleHighlight"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Highlighted Text</FormLabel>
													<FormControl>
														<Input
															placeholder="Starta klinik med Synos!"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>
														Displayed with a different color
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="hero.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Är du hudterapeut och funderar på att starta eget?..."
														rows={3}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hero.callout"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Callout Text</FormLabel>
												<FormControl>
													<Input
														placeholder="I så fall är Synos Medical rätt samarbetspartner för dig!"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormDescription>
													Highlighted text below the subtitle
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Main Content Tab */}
						<TabsContent value="main" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Main Content</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="mainContent.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Vi hjälper dig att starta eget"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="mainContent.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Input
														placeholder="Drömmer du om att driva en egen hudvårdsklinik?"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Paragraphs */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Paragraphs</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													paragraphsFieldArray.append("" as never)
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Paragraph
											</Button>
										</div>
										{paragraphsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<FormField
													control={form.control}
													name={`mainContent.paragraphs.${index}`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Textarea
																	placeholder="Skriv ett stycke här..."
																	rows={3}
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="shrink-0 text-destructive hover:text-destructive"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Paragraph",
															description: "Are you sure you want to remove this paragraph?",
															confirmText: "Remove",
														});
														if (confirmed) paragraphsFieldArray.remove(index);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Benefits Tab */}
						<TabsContent value="benefits" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Benefits</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<FormLabel>Benefit Cards</FormLabel>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												benefitsFieldArray.append({
													icon: "",
													title: "",
													description: "",
												})
											}
										>
											<Plus className="mr-2 h-4 w-4" />
											Add Benefit
										</Button>
									</div>
									{benefitsFieldArray.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex gap-4 rounded-lg border p-4"
										>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 sm:grid-cols-2">
													<FormField
														control={form.control}
														name={`benefits.${index}.icon`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Icon</FormLabel>
																<Select
																	onValueChange={field.onChange}
																	value={field.value || ""}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select icon" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{ICONS.map((icon) => (
																			<SelectItem
																				key={icon.value}
																				value={icon.value}
																			>
																				{icon.label}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`benefits.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Personlig utbildning"
																		{...field}
																		value={field.value || ""}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<FormField
													control={form.control}
													name={`benefits.${index}.description`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Description</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="En av våra erfarna experter lär dig allt..."
																	rows={2}
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="shrink-0 text-destructive hover:text-destructive"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Benefit",
														description: "Are you sure you want to remove this benefit?",
														confirmText: "Remove",
													});
													if (confirmed) benefitsFieldArray.remove(index);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Features Tab */}
						<TabsContent value="features" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Features Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="featuresSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Utbildning, finansiering och försäkring"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="featuresSection.intro"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Introduction</FormLabel>
												<FormControl>
													<Textarea
														placeholder="När du väljer en maskin från Synos Medical får du mer än bara utrustning..."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Features list */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Features</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													featuresFieldArray.append({
														title: "",
														description: "",
													})
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Feature
											</Button>
										</div>
										{featuresFieldArray.fields.map((field, index) => (
											<div
												key={field.id}
												className="flex gap-4 rounded-lg border p-4"
											>
												<div className="flex-1 space-y-4">
													<FormField
														control={form.control}
														name={`featuresSection.features.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Personlig utbildning"
																		{...field}
																		value={field.value || ""}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`featuresSection.features.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="En av våra erfarna experter lär dig allt..."
																		rows={2}
																		{...field}
																		value={field.value || ""}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="shrink-0 text-destructive hover:text-destructive"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Feature",
															description: "Are you sure you want to remove this feature?",
															confirmText: "Remove",
														});
														if (confirmed) featuresFieldArray.remove(index);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Resources Tab */}
						<TabsContent value="resources" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Resources Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="resourcesSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Resurser för dig"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="resourcesSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Input
														placeholder="Utforska våra guider och utbildningar..."
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Resources list */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Resource Cards</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													resourcesFieldArray.append({
														title: "",
														description: "",
														href: "",
														buttonText: "",
													})
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Resource
											</Button>
										</div>
										{resourcesFieldArray.fields.map((field, index) => (
											<div
												key={field.id}
												className="flex gap-4 rounded-lg border p-4"
											>
												<div className="flex-1 space-y-4">
													<FormField
														control={form.control}
														name={`resourcesSection.resources.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Köpguide för privatkunder"
																		{...field}
																		value={field.value || ""}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`resourcesSection.resources.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Ladda ner vår köpguide..."
																		rows={2}
																		{...field}
																		value={field.value || ""}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`resourcesSection.resources.${index}.href`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Link</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="/starta-eget/kopguide"
																			{...field}
																			value={field.value || ""}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`resourcesSection.resources.${index}.buttonText`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Button Text</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Läs mer"
																			{...field}
																			value={field.value || ""}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="shrink-0 text-destructive hover:text-destructive"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Resource",
															description: "Are you sure you want to remove this resource?",
															confirmText: "Remove",
														});
														if (confirmed) resourcesFieldArray.remove(index);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-4">
							<div className="grid gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>SEO Settings</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="seo.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Meta Title</FormLabel>
													<FormControl>
														<Input
															placeholder="Starta eget | Synos Medical"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>
														Recommended length: 50-60 characters
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
															placeholder="Drömmer du om frihet och framgång? Starta klinik med Synos!"
															rows={3}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>
														Recommended length: 150-160 characters
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
														Image displayed when the page is shared on social media
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
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title: form.watch("seo.title") || "Starta Eget - Synos Medical",
												description: form.watch("seo.description") || "Add a description",
												ogImage: form.watch("seo.ogImage") || null,
												slug: "starta-eget",
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
						<Button type="submit" disabled={isSaving} size="lg">
							{isSaving ? (
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
