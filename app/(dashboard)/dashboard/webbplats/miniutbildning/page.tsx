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
	{ value: "Clock", label: "Clock" },
	{ value: "GraduationCap", label: "Graduation Cap" },
	{ value: "Users", label: "Users" },
	{ value: "Play", label: "Play" },
	{ value: "Award", label: "Award" },
	{ value: "Zap", label: "Zap" },
	{ value: "CheckCircle", label: "Check Circle" },
	{ value: "BookOpen", label: "Book" },
	{ value: "Heart", label: "Heart" },
	{ value: "Star", label: "Star" },
];

// Local Zod schema for the form
const formSchema = z.object({
	sectionVisibility: z
		.object({
			hero: z.boolean(),
			benefits: z.boolean(),
			learnings: z.boolean(),
			process: z.boolean(),
			contactForm: z.boolean(),
			richContent: z.boolean(),
		})
		.optional(),
	hero: z
		.object({
			badge: z.string().max(100).optional(),
			title: z.string().max(200).optional(),
			titleHighlight: z.string().max(200).optional(),
			subtitle: z.string().max(1000).optional(),
			buttonText: z.string().max(100).optional(),
			buttonHref: z.string().max(500).optional(),
		})
		.optional(),
	benefits: z
		.array(
			z.object({
				icon: z.string().max(50).optional(),
				title: z.string().max(200).optional(),
				description: z.string().max(500).optional(),
			})
		)
		.optional(),
	learningsSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			items: z.array(z.string().max(300)).optional(),
		})
		.optional(),
	processSection: z
		.object({
			badge: z.string().max(100).optional(),
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			steps: z
				.array(
					z.object({
						number: z.string().max(10).optional(),
						title: z.string().max(200).optional(),
						description: z.string().max(500).optional(),
					})
				)
				.optional(),
			highlightTitle: z.string().max(200).optional(),
			highlightSubtitle: z.string().max(500).optional(),
			highlightButtonText: z.string().max(100).optional(),
			highlightButtonHref: z.string().max(500).optional(),
		})
		.optional(),
	richContent: z.string().optional(),
	seo: z
		.object({
			title: z.string().max(100).optional(),
			description: z.string().max(300).optional(),
			ogImage: z.string().max(500).optional(),
		})
		.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MiniutbildningPageAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				benefits: true,
				learnings: true,
				process: true,
				contactForm: true,
				richContent: false,
			},
			hero: {},
			benefits: [],
			learningsSection: { items: [] },
			processSection: { steps: [] },
			richContent: "",
			seo: {},
		},
	});

	const benefitsFieldArray = useFieldArray({
		control: form.control,
		name: "benefits",
	});

	const learningsItemsFieldArray = useFieldArray({
		control: form.control,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name: "learningsSection.items" as any,
	});

	const processStepsFieldArray = useFieldArray({
		control: form.control,
		name: "processSection.steps",
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/miniutbildning-page");
				if (response.ok) {
					const data = await response.json();
					form.reset({
						sectionVisibility: data.sectionVisibility || {
							hero: true,
							benefits: true,
							learnings: true,
							process: true,
							contactForm: true,
							richContent: false,
						},
						hero: data.hero || {},
						benefits: data.benefits || [],
						learningsSection: data.learningsSection || { items: [] },
						processSection: data.processSection || { steps: [] },
						richContent: data.richContent || "",
						seo: data.seo || {},
					});
				}
			} catch (error) {
				console.error("Error fetching miniutbildning page data:", error);
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
			const response = await fetch("/api/miniutbildning-page", {
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

			toast.success("Miniutbildning page saved successfully");
		} catch (error) {
			console.error("Error saving miniutbildning page:", error);
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
					<h1 className="text-3xl font-bold tracking-tight">Miniutbildning</h1>
					<p className="text-muted-foreground">
						Manage the content of the Mini Training page.
					</p>
				</div>
				<a
					href="/starta-eget/miniutbildning"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form id="miniutbildning-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="benefits">Benefits</TabsTrigger>
							<TabsTrigger value="learnings">Learnings</TabsTrigger>
							<TabsTrigger value="process">Process</TabsTrigger>
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
												<FormLabel className="cursor-pointer">Hero Section</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.benefits"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">Benefits</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.learnings"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">Learnings</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.process"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">Process</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.contactForm"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">Contact Form</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.richContent"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">Rich Content</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
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
									<FormField
										control={form.control}
										name="hero.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														placeholder="Kostnadsfri utbildning"
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
											name="hero.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															placeholder="Kostnadsfri"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>Text before the highlighted part</FormDescription>
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
															placeholder="miniutbildning"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>Displayed with accent color</FormDescription>
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
														placeholder="Få kunskapen att välja rätt laser..."
														rows={3}
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
											name="hero.buttonText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Text</FormLabel>
													<FormControl>
														<Input
															placeholder="Boka miniutbildning"
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
											name="hero.buttonHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Link</FormLabel>
													<FormControl>
														<Input placeholder="#kontakt" {...field} value={field.value || ""} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Benefits Tab */}
						<TabsContent value="benefits" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Benefit Cards</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<FormLabel>Benefits</FormLabel>
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
										<div key={field.id} className="flex gap-4 rounded-lg border p-4">
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 sm:grid-cols-2">
													<FormField
														control={form.control}
														name={`benefits.${index}.icon`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Icon</FormLabel>
																<Select onValueChange={field.onChange} value={field.value || ""}>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select icon" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{ICONS.map((icon) => (
																			<SelectItem key={icon.value} value={icon.value}>
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
																		placeholder="Flexibelt format"
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
																	placeholder="Utbildningen anpassas efter dina behov..."
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

						{/* Learnings Tab */}
						<TabsContent value="learnings" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>What You Will Learn</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="learningsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Vad du kommer lära dig"
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
										name="learningsSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Miniutbildningen täcker de viktigaste grunderna..."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Learning Items */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Learning Items</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => learningsItemsFieldArray.append("" as never)}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Item
											</Button>
										</div>
										{learningsItemsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<FormField
													control={form.control}
													name={`learningsSection.items.${index}`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Input
																	placeholder="Grundläggande laserfysik..."
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
															title: "Remove Item",
															description: "Are you sure you want to remove this item?",
															confirmText: "Remove",
														});
														if (confirmed) learningsItemsFieldArray.remove(index);
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

						{/* Process Tab */}
						<TabsContent value="process" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Process Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="processSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input placeholder="Snabb start" {...field} value={field.value || ""} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="processSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Så här går det till"
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
										name="processSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Miniutbildningen är helt kostnadsfri..."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Process Steps */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Process Steps</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													processStepsFieldArray.append({
														number: "",
														title: "",
														description: "",
													})
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Step
											</Button>
										</div>
										{processStepsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4 rounded-lg border p-4">
												<div className="flex-1 space-y-4">
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`processSection.steps.${index}.number`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Number</FormLabel>
																	<FormControl>
																		<Input placeholder="1" {...field} value={field.value || ""} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`processSection.steps.${index}.title`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Boka tid"
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
														name={`processSection.steps.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Fyll i formuläret så kontaktar vi dig..."
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
															title: "Remove Step",
															description: "Are you sure you want to remove this step?",
															confirmText: "Remove",
														});
														if (confirmed) processStepsFieldArray.remove(index);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>

									{/* Highlight Section */}
									<div className="pt-4 border-t space-y-4">
										<FormLabel className="text-base font-semibold">Highlight Box</FormLabel>
										<FormField
											control={form.control}
											name="processSection.highlightTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Highlight Title</FormLabel>
													<FormControl>
														<Input
															placeholder="100% kostnadsfritt"
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
											name="processSection.highlightSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Highlight Subtitle</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Ingen förpliktelse att köpa..."
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
												name="processSection.highlightButtonText"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text</FormLabel>
														<FormControl>
															<Input
																placeholder="Boka din plats"
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
												name="processSection.highlightButtonHref"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Link</FormLabel>
														<FormControl>
															<Input placeholder="#kontakt" {...field} value={field.value || ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
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
															placeholder="Miniutbildning | Synos Medical"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>Recommended length: 50-60 characters</FormDescription>
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
															placeholder="Kostnadsfri miniutbildning om laserteknik och klinikutrustning..."
															rows={3}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>Recommended length: 150-160 characters</FormDescription>
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
												title: form.watch("seo.title") || "Miniutbildning - Synos Medical",
												description: form.watch("seo.description") || "Add a description",
												ogImage: form.watch("seo.ogImage") || null,
												slug: "starta-eget/miniutbildning",
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
