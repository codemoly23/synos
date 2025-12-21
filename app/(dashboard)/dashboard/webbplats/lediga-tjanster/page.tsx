"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useConfirmModal } from "@/components/ui/confirm-modal";
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
import { SeoPreview } from "@/components/admin/seo/SeoPreview";

// Available icons for benefits
const BENEFIT_ICONS = [
	{ value: "Heart", label: "Heart" },
	{ value: "GraduationCap", label: "Education" },
	{ value: "Users", label: "Team" },
	{ value: "Building2", label: "Building" },
	{ value: "Briefcase", label: "Briefcase" },
	{ value: "Star", label: "Star" },
	{ value: "Shield", label: "Shield" },
	{ value: "Clock", label: "Clock" },
	{ value: "Coffee", label: "Coffee" },
	{ value: "Zap", label: "Lightning" },
];

// Local Zod schema for the form
const formSchema = z.object({
	sectionVisibility: z
		.object({
			hero: z.boolean(),
			benefits: z.boolean(),
			jobOpenings: z.boolean(),
			values: z.boolean(),
			applicationForm: z.boolean(),
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
	benefitsSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			benefits: z
				.array(
					z.object({
						icon: z.string().max(50).optional(),
						title: z.string().max(200).optional(),
						description: z.string().max(500).optional(),
					})
				)
				.optional(),
		})
		.optional(),
	jobOpeningsSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			noJobsMessage: z.string().max(500).optional(),
			jobOpenings: z
				.array(
					z.object({
						title: z.string().max(200).optional(),
						location: z.string().max(200).optional(),
						type: z.string().max(100).optional(),
						description: z.string().max(1000).optional(),
						applyLink: z.string().max(500).optional(),
					})
				)
				.optional(),
		})
		.optional(),
	valuesSection: z
		.object({
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
			values: z.array(z.string().max(500)).optional(),
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

export default function CareersPageAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				benefits: true,
				jobOpenings: true,
				values: true,
				applicationForm: true,
			},
			hero: {},
			benefitsSection: { benefits: [] },
			jobOpeningsSection: { jobOpenings: [] },
			valuesSection: { values: [] },
			seo: {},
		},
	});

	const benefitsFieldArray = useFieldArray({
		control: form.control,
		name: "benefitsSection.benefits",
	});

	const jobOpeningsFieldArray = useFieldArray({
		control: form.control,
		name: "jobOpeningsSection.jobOpenings",
	});

	const valuesFieldArray = useFieldArray({
		control: form.control,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name: "valuesSection.values" as any,
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/careers-page");
				if (response.ok) {
					const data = await response.json();
					form.reset({
						sectionVisibility: data.sectionVisibility || {
							hero: true,
							benefits: true,
							jobOpenings: true,
							values: true,
							applicationForm: true,
						},
						hero: data.hero || {},
						benefitsSection: data.benefitsSection || { benefits: [] },
						jobOpeningsSection: data.jobOpeningsSection || { jobOpenings: [] },
						valuesSection: data.valuesSection || { values: [] },
						seo: data.seo || {},
					});
				}
			} catch (error) {
				console.error("Error fetching careers page data:", error);
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
			const response = await fetch("/api/careers-page", {
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

			toast.success("Careers page saved successfully");
		} catch (error) {
			console.error("Error saving careers page:", error);
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
					<h1 className="text-3xl font-bold tracking-tight">Careers Page</h1>
					<p className="text-muted-foreground">
						Manage the content of the careers page.
					</p>
				</div>
				<a
					href="/om-oss/lediga-tjanster"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form id="careers-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="benefits">Benefits</TabsTrigger>
							<TabsTrigger value="jobs">Job Openings</TabsTrigger>
							<TabsTrigger value="values">Values</TabsTrigger>
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
										name="sectionVisibility.jobOpenings"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Job Openings
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
										name="sectionVisibility.values"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Values
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
										name="sectionVisibility.applicationForm"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Application Form
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
									<FormField
										control={form.control}
										name="hero.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge</FormLabel>
												<FormControl>
													<Input
														placeholder="Karriär hos Synos"
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
															placeholder="Bli en del av"
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
															placeholder="vårt team"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>
														Displayed with gradient color
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
														placeholder="Vi är alltid på jakt efter talangfulla och engagerade medarbetare..."
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

						{/* Benefits Tab */}
						<TabsContent value="benefits" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Benefits</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="benefitsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Varför jobba hos oss?"
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
										name="benefitsSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Vi erbjuder en stimulerande arbetsmiljö..."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Benefits list */}
									<div className="space-y-4">
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
											<div
												key={field.id}
												className="flex gap-4 rounded-lg border p-4"
											>
												<div className="flex-1 space-y-4">
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`benefitsSection.benefits.${index}.icon`}
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
																			{BENEFIT_ICONS.map((icon) => (
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
															name={`benefitsSection.benefits.${index}.title`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Hälsoförmåner"
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
														name={`benefitsSection.benefits.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Friskvårdsbidrag och hälsoförsäkring..."
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
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Jobs Tab */}
						<TabsContent value="jobs" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Job Openings</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="jobOpeningsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Lediga tjänster"
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
										name="jobOpeningsSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Hittar du inte en tjänst som passar?..."
														rows={2}
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
										name="jobOpeningsSection.noJobsMessage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>No Jobs Message</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Just nu har vi inga öppna tjänster..."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormDescription>
													Displayed when no jobs are listed
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Job openings list */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Job Listings</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													jobOpeningsFieldArray.append({
														title: "",
														location: "",
														type: "",
														description: "",
														applyLink: "",
													})
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Job
											</Button>
										</div>
										{jobOpeningsFieldArray.fields.map((field, index) => (
											<div
												key={field.id}
												className="flex gap-4 rounded-lg border p-4"
											>
												<div className="flex-1 space-y-4">
													<FormField
														control={form.control}
														name={`jobOpeningsSection.jobOpenings.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Säljare / Account Manager"
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
															name={`jobOpeningsSection.jobOpenings.${index}.location`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Location</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Stockholm"
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
															name={`jobOpeningsSection.jobOpenings.${index}.type`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Type</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Heltid"
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
														name={`jobOpeningsSection.jobOpenings.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Vi söker en driven säljare..."
																		rows={2}
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
														name={`jobOpeningsSection.jobOpenings.${index}.applyLink`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Apply Link (optional)</FormLabel>
																<FormControl>
																	<Input
																		placeholder="https://..."
																		{...field}
																		value={field.value || ""}
																	/>
																</FormControl>
																<FormDescription>
																	If empty, the page form is used
																</FormDescription>
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
															title: "Remove Job Opening",
															description: "Are you sure you want to remove this job opening?",
															confirmText: "Remove",
														});
														if (confirmed) jobOpeningsFieldArray.remove(index);
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

						{/* Values Tab */}
						<TabsContent value="values" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Values</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="valuesSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Våra värderingar"
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
										name="valuesSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Det här är vad som driver oss varje dag."
														rows={2}
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Values list */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Values</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => valuesFieldArray.append("" as never)}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Value
											</Button>
										</div>
										{valuesFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
													{index + 1}
												</div>
												<FormField
													control={form.control}
													name={`valuesSection.values.${index}`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Input
																	placeholder="Vi sätter kunden först i allt vi gör"
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
															title: "Remove Value",
															description: "Are you sure you want to remove this value?",
															confirmText: "Remove",
														});
														if (confirmed) valuesFieldArray.remove(index);
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
															placeholder="Lediga Tjänster | Synos Medical"
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
															placeholder="Bli en del av Synos Medical-teamet. Se våra lediga tjänster och ansök idag."
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
												title: form.watch("seo.title") || "Lediga Tjänster - Synos Medical",
												description: form.watch("seo.description") || "Add a description",
												ogImage: form.watch("seo.ogImage") || null,
												slug: "om-oss/lediga-tjanster",
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
