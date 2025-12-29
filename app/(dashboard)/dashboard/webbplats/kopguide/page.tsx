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
	{ value: "Target", label: "Target" },
	{ value: "Lightbulb", label: "Lightbulb" },
	{ value: "Scale", label: "Scale" },
	{ value: "FileText", label: "File Text" },
	{ value: "BookOpen", label: "Book" },
	{ value: "CheckCircle", label: "Check Circle" },
	{ value: "Shield", label: "Shield" },
	{ value: "Award", label: "Award" },
	{ value: "Settings", label: "Settings" },
	{ value: "Users", label: "Users" },
];

// Local Zod schema for the form
const formSchema = z.object({
	sectionVisibility: z
		.object({
			hero: z.boolean(),
			steps: z.boolean(),
			checklist: z.boolean(),
			cta: z.boolean(),
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
		})
		.optional(),
	stepsSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			steps: z
				.array(
					z.object({
						number: z.string().max(10).optional(),
						icon: z.string().max(50).optional(),
						title: z.string().max(200).optional(),
						description: z.string().max(500).optional(),
					})
				)
				.optional(),
		})
		.optional(),
	checklistSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			items: z.array(z.string().max(300)).optional(),
		})
		.optional(),
	ctaSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			primaryButtonText: z.string().max(100).optional(),
			primaryButtonHref: z.string().max(500).optional(),
			secondaryButtonText: z.string().max(100).optional(),
			secondaryButtonHref: z.string().max(500).optional(),
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

export default function KopguidePageAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				steps: true,
				checklist: true,
				cta: true,
				contactForm: true,
				richContent: false,
			},
			hero: {},
			stepsSection: { steps: [] },
			checklistSection: { items: [] },
			ctaSection: {},
			richContent: "",
			seo: {},
		},
	});

	const stepsFieldArray = useFieldArray({
		control: form.control,
		name: "stepsSection.steps",
	});

	const checklistItemsFieldArray = useFieldArray({
		control: form.control,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name: "checklistSection.items" as any,
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/kopguide-page");
				if (response.ok) {
					const data = await response.json();
					form.reset({
						sectionVisibility: data.sectionVisibility || {
							hero: true,
							steps: true,
							checklist: true,
							cta: true,
							contactForm: true,
							richContent: false,
						},
						hero: data.hero || {},
						stepsSection: data.stepsSection || { steps: [] },
						checklistSection: data.checklistSection || { items: [] },
						ctaSection: data.ctaSection || {},
						richContent: data.richContent || "",
						seo: data.seo || {},
					});
				}
			} catch (error) {
				console.error("Error fetching köpguide page data:", error);
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
			const response = await fetch("/api/kopguide-page", {
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

			toast.success("Köpguide page saved successfully");
		} catch (error) {
			console.error("Error saving köpguide page:", error);
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
					<h1 className="text-3xl font-bold tracking-tight">Köpguide</h1>
					<p className="text-muted-foreground">
						Manage the content of the Buying Guide page.
					</p>
				</div>
				<a
					href="/starta-eget/kopguide"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form id="kopguide-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="steps">Steps</TabsTrigger>
							<TabsTrigger value="checklist">Checklist</TabsTrigger>
							<TabsTrigger value="cta">CTA</TabsTrigger>
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
										name="sectionVisibility.steps"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">Steps</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.checklist"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">Checklist</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.cta"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">CTA Section</FormLabel>
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
													<Input placeholder="Köpguide" {...field} value={field.value || ""} />
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
															placeholder="Din guide till rätt"
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
															placeholder="klinikutrustning"
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
														placeholder="Att investera i klinikutrustning är ett stort beslut..."
														rows={3}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Steps Tab */}
						<TabsContent value="steps" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Steps Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="stepsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title</FormLabel>
												<FormControl>
													<Input
														placeholder="4 steg till rätt beslut"
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
										name="stepsSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Följ dessa steg för att säkerställa..."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Steps</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													stepsFieldArray.append({
														number: "",
														icon: "",
														title: "",
														description: "",
													})
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Step
											</Button>
										</div>
										{stepsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4 rounded-lg border p-4">
												<div className="flex-1 space-y-4">
													<div className="grid gap-4 sm:grid-cols-3">
														<FormField
															control={form.control}
															name={`stepsSection.steps.${index}.number`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Number</FormLabel>
																	<FormControl>
																		<Input placeholder="01" {...field} value={field.value || ""} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`stepsSection.steps.${index}.icon`}
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
															name={`stepsSection.steps.${index}.title`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Definiera dina mål"
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
														name={`stepsSection.steps.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Börja med att definiera vilka behandlingar..."
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
														if (confirmed) stepsFieldArray.remove(index);
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

						{/* Checklist Tab */}
						<TabsContent value="checklist" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Checklist Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="checklistSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Checklista vid köp"
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
										name="checklistSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Använd den här checklistan..."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Checklist Items */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Checklist Items</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => checklistItemsFieldArray.append("" as never)}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Item
											</Button>
										</div>
										{checklistItemsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<FormField
													control={form.control}
													name={`checklistSection.items.${index}`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Input
																	placeholder="Är produkten MDR-certifierad?"
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
														if (confirmed) checklistItemsFieldArray.remove(index);
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

						{/* CTA Tab */}
						<TabsContent value="cta" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Call to Action Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="ctaSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Vill du veta mer?"
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
										name="ctaSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Boka en kostnadsfri konsultation..."
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
											name="ctaSection.primaryButtonText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Primary Button Text</FormLabel>
													<FormControl>
														<Input
															placeholder="Boka konsultation"
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
											name="ctaSection.primaryButtonHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Primary Button Link</FormLabel>
													<FormControl>
														<Input placeholder="/kontakt" {...field} value={field.value || ""} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="ctaSection.secondaryButtonText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Secondary Button Text</FormLabel>
													<FormControl>
														<Input
															placeholder="Kostnadsfri miniutbildning"
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
											name="ctaSection.secondaryButtonHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Secondary Button Link</FormLabel>
													<FormControl>
														<Input
															placeholder="/starta-eget/miniutbildning"
															{...field}
															value={field.value || ""}
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
															placeholder="Köpguide | Synos Medical"
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
															placeholder="Din kompletta guide till att köpa rätt klinikutrustning..."
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
												title: form.watch("seo.title") || "Köpguide - Synos Medical",
												description: form.watch("seo.description") || "Add a description",
												ogImage: form.watch("seo.ogImage") || null,
												slug: "starta-eget/kopguide",
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
