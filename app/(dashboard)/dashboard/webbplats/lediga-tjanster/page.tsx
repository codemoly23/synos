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
import {
	Loader2,
	Plus,
	Trash2,
	ExternalLink,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

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

// Work type options
const WORK_TYPES = [
	{ value: "On-site", label: "On-site" },
	{ value: "Remote", label: "Remote" },
	{ value: "Hybrid", label: "Hybrid" },
	{ value: "Home-based", label: "Home-based" },
];

// Employment type options
const EMPLOYMENT_TYPES = [
	{ value: "Full Time", label: "Full Time" },
	{ value: "Part Time", label: "Part Time" },
	{ value: "Contract", label: "Contract" },
	{ value: "Freelance", label: "Freelance" },
	{ value: "Internship", label: "Internship" },
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
						_id: z.string().optional(),
						slug: z.string().max(200).optional(),
						title: z.string().max(200).optional(),
						location: z.string().max(200).optional(),
						workType: z.string().max(100).optional(),
						employmentType: z.string().max(100).optional(),
						shortDescription: z.string().max(500).optional(),
						featuredImage: z.string().max(500).optional(),
						description: z.string().max(10000).optional(),
						requirements: z.array(z.string().max(500)).optional(),
						responsibilities: z.array(z.string().max(500)).optional(),
						applyLink: z.string().max(500).optional(),
						isActive: z.boolean().optional(),
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
	contactSidebar: z
		.object({
			title: z.string().max(100).optional(),
			address: z.string().max(500).optional(),
			email: z.string().max(200).optional(),
			phone: z.string().max(50).optional(),
			secondaryPhone: z.string().max(50).optional(),
			formTitle: z.string().max(100).optional(),
		})
		.optional(),
	expertCta: z
		.object({
			badge: z.string().max(100).optional(),
			title: z.string().max(200).optional(),
			subtitle: z.string().max(500).optional(),
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

// Helper to generate slug from title
function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[åä]/g, "a")
		.replace(/ö/g, "o")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export default function CareersPageAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({});
	// Track which job slugs were manually edited by the user
	const [manuallyEditedSlugs, setManuallyEditedSlugs] = useState<
		Record<number, boolean>
	>({});
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
			contactSidebar: {},
			expertCta: {},
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
						contactSidebar: data.contactSidebar || {},
						expertCta: data.expertCta || {},
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
				const errorMessage =
					data.error || data.message || "Failed to save changes";
				const details = data.details
					? `: ${formatValidationErrors(data.details)}`
					: "";
				throw new Error(`${errorMessage}${details}`);
			}

			toast.success("Careers page saved successfully");
		} catch (error) {
			console.error("Error saving careers page:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save changes"
			);
		} finally {
			setIsSaving(false);
		}
	}

	const toggleJobExpanded = (index: number) => {
		setExpandedJobs((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	if (isLoading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Careers Page</h1>
					<p className="text-muted-foreground">
						Manage job listings and careers page content.
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
				<form
					id="careers-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<Tabs defaultValue="jobs" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="jobs">Job Listings</TabsTrigger>
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="contact">Contact Sidebar</TabsTrigger>
							<TabsTrigger value="cta">Expert CTA</TabsTrigger>
							<TabsTrigger value="benefits">Benefits</TabsTrigger>
							<TabsTrigger value="values">Values</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Jobs Tab */}
						<TabsContent value="jobs" className="space-y-4">
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Job Listings</CardTitle>
										<Button
											type="button"
											onClick={() => {
												jobOpeningsFieldArray.append({
													slug: "",
													title: "",
													location: "",
													workType: "",
													employmentType: "",
													shortDescription: "",
													featuredImage: "",
													description: "",
													requirements: [],
													responsibilities: [],
													applyLink: "",
													isActive: true,
												});
												// Expand the new job
												setExpandedJobs((prev) => ({
													...prev,
													[jobOpeningsFieldArray.fields.length]: true,
												}));
											}}
										>
											<Plus className="mr-2 h-4 w-4" />
											Add Job
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Section Settings */}
									<div className="grid gap-4 sm:grid-cols-2 mb-6">
										<FormField
											control={form.control}
											name="jobOpeningsSection.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Section Badge</FormLabel>
													<FormControl>
														<Input
															placeholder="Success Journey"
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
														<Input
															placeholder="Inga lediga tjänster just nu..."
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Job Listings */}
									<div className="space-y-3">
										{jobOpeningsFieldArray.fields.map((field, index) => (
											<div
												key={field.id}
												className="rounded-lg border bg-slate-50/50"
											>
												{/* Job Header - Collapsible */}
												<div
													className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-100/50 transition-colors"
													onClick={() => toggleJobExpanded(index)}
												>
													<div className="flex-1 min-w-0">
														<p className="font-medium text-secondary truncate">
															{form.watch(
																`jobOpeningsSection.jobOpenings.${index}.title`
															) || "Untitled Job"}
														</p>
														<p className="text-xs text-muted-foreground">
															{form.watch(
																`jobOpeningsSection.jobOpenings.${index}.location`
															) || "No location"}{" "}
															&bull;{" "}
															{form.watch(
																`jobOpeningsSection.jobOpenings.${index}.employmentType`
															) || "No type"}
														</p>
													</div>
													<FormField
														control={form.control}
														name={`jobOpeningsSection.jobOpenings.${index}.isActive`}
														render={({ field: activeField }) => (
															<div
																className="flex items-center gap-2"
																onClick={(e) => e.stopPropagation()}
															>
																<span className="text-xs text-muted-foreground">
																	{activeField.value ? "Active" : "Inactive"}
																</span>
																<Switch
																	checked={activeField.value}
																	onCheckedChange={activeField.onChange}
																/>
															</div>
														)}
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-destructive hover:text-destructive"
														onClick={async (e) => {
															e.stopPropagation();
															const confirmed = await confirm({
																title: "Remove Job",
																description:
																	"Are you sure you want to remove this job listing?",
																confirmText: "Remove",
															});
															if (confirmed)
																jobOpeningsFieldArray.remove(index);
														}}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
													{expandedJobs[index] ? (
														<ChevronUp className="h-4 w-4 text-muted-foreground" />
													) : (
														<ChevronDown className="h-4 w-4 text-muted-foreground" />
													)}
												</div>

												{/* Job Content - Expanded */}
												{expandedJobs[index] && (
													<div className="p-4 pt-0 space-y-4 border-t">
														{/* Basic Info */}
														<div className="grid gap-4 sm:grid-cols-2">
															<FormField
																control={form.control}
																name={`jobOpeningsSection.jobOpenings.${index}.title`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Job Title*</FormLabel>
																		<FormControl>
																			<Input
																				placeholder="Säljare / Account Manager"
																				{...field}
																				value={field.value || ""}
																				onChange={(e) => {
																					field.onChange(e);
																					// Auto-generate slug unless user manually edited it
																					if (!manuallyEditedSlugs[index]) {
																						form.setValue(
																							`jobOpeningsSection.jobOpenings.${index}.slug`,
																							generateSlug(e.target.value)
																						);
																					}
																				}}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
															<FormField
																control={form.control}
																name={`jobOpeningsSection.jobOpenings.${index}.slug`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>URL Slug*</FormLabel>
																		<FormControl>
																			<Input
																				placeholder="saljare-account-manager"
																				{...field}
																				value={field.value || ""}
																				onChange={(e) => {
																					field.onChange(e);
																					// Mark as manually edited when user types in slug field
																					setManuallyEditedSlugs((prev) => ({
																						...prev,
																						[index]: true,
																					}));
																				}}
																			/>
																		</FormControl>
																		<FormDescription>
																			Used in the URL: /om-oss/lediga-tjanster/
																			{field.value || "slug"}
																		</FormDescription>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>

														{/* Location & Types */}
														<div className="grid gap-4 sm:grid-cols-3">
															<FormField
																control={form.control}
																name={`jobOpeningsSection.jobOpenings.${index}.location`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Location</FormLabel>
																		<FormControl>
																			<Input
																				placeholder="Stockholm, Sweden"
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
																name={`jobOpeningsSection.jobOpenings.${index}.workType`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Work Type</FormLabel>
																		<Select
																			onValueChange={field.onChange}
																			value={field.value || ""}
																		>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder="Select type" />
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				{WORK_TYPES.map((type) => (
																					<SelectItem
																						key={type.value}
																						value={type.value}
																					>
																						{type.label}
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
																name={`jobOpeningsSection.jobOpenings.${index}.employmentType`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Employment Type</FormLabel>
																		<Select
																			onValueChange={field.onChange}
																			value={field.value || ""}
																		>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder="Select type" />
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				{EMPLOYMENT_TYPES.map((type) => (
																					<SelectItem
																						key={type.value}
																						value={type.value}
																					>
																						{type.label}
																					</SelectItem>
																				))}
																			</SelectContent>
																		</Select>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>

														{/* Short Description */}
														<FormField
															control={form.control}
															name={`jobOpeningsSection.jobOpenings.${index}.shortDescription`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Short Description</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Brief description shown on job card..."
																			rows={2}
																			{...field}
																			value={field.value || ""}
																		/>
																	</FormControl>
																	<FormDescription>
																		Shown on the job listing card (max 500
																		chars)
																	</FormDescription>
																	<FormMessage />
																</FormItem>
															)}
														/>

														{/* Featured Image */}
														<FormField
															control={form.control}
															name={`jobOpeningsSection.jobOpenings.${index}.featuredImage`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Featured Image</FormLabel>
																	<FormControl>
																		<MediaPicker
																			type="image"
																			value={field.value || null}
																			onChange={(url) =>
																				field.onChange(url || "")
																			}
																			placeholder="Select featured image for job detail page"
																			galleryTitle="Select Job Image"
																		/>
																	</FormControl>
																	<FormDescription>
																		Displayed at top of job detail page (16:9
																		recommended)
																	</FormDescription>
																	<FormMessage />
																</FormItem>
															)}
														/>

														{/* Full Description */}
														<FormField
															control={form.control}
															name={`jobOpeningsSection.jobOpenings.${index}.description`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Full Description</FormLabel>
																	<FormControl>
																		<RichTextEditor
																			value={field.value || ""}
																			onChange={field.onChange}
																			placeholder="Full job description with formatting..."
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														{/* Requirements */}
														<div className="space-y-2">
															<div className="flex items-center justify-between">
																<FormLabel>Requirements</FormLabel>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => {
																		const current =
																			form.getValues(
																				`jobOpeningsSection.jobOpenings.${index}.requirements`
																			) || [];
																		form.setValue(
																			`jobOpeningsSection.jobOpenings.${index}.requirements`,
																			[...current, ""]
																		);
																	}}
																>
																	<Plus className="mr-1 h-3 w-3" />
																	Add
																</Button>
															</div>
															{(
																form.watch(
																	`jobOpeningsSection.jobOpenings.${index}.requirements`
																) || []
															).map((_, reqIndex) => (
																<div
																	key={reqIndex}
																	className="flex items-center gap-2"
																>
																	<FormField
																		control={form.control}
																		name={`jobOpeningsSection.jobOpenings.${index}.requirements.${reqIndex}`}
																		render={({ field }) => (
																			<FormItem className="flex-1">
																				<FormControl>
																					<Input
																						placeholder="Requirement..."
																						{...field}
																						value={field.value || ""}
																					/>
																				</FormControl>
																			</FormItem>
																		)}
																	/>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="text-destructive hover:text-destructive shrink-0"
																		onClick={() => {
																			const current =
																				form.getValues(
																					`jobOpeningsSection.jobOpenings.${index}.requirements`
																				) || [];
																			form.setValue(
																				`jobOpeningsSection.jobOpenings.${index}.requirements`,
																				current.filter(
																					(_, i) => i !== reqIndex
																				)
																			);
																		}}
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																</div>
															))}
														</div>

														{/* Responsibilities */}
														<div className="space-y-2">
															<div className="flex items-center justify-between">
																<FormLabel>Responsibilities</FormLabel>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => {
																		const current =
																			form.getValues(
																				`jobOpeningsSection.jobOpenings.${index}.responsibilities`
																			) || [];
																		form.setValue(
																			`jobOpeningsSection.jobOpenings.${index}.responsibilities`,
																			[...current, ""]
																		);
																	}}
																>
																	<Plus className="mr-1 h-3 w-3" />
																	Add
																</Button>
															</div>
															{(
																form.watch(
																	`jobOpeningsSection.jobOpenings.${index}.responsibilities`
																) || []
															).map((_, respIndex) => (
																<div
																	key={respIndex}
																	className="flex items-center gap-2"
																>
																	<FormField
																		control={form.control}
																		name={`jobOpeningsSection.jobOpenings.${index}.responsibilities.${respIndex}`}
																		render={({ field }) => (
																			<FormItem className="flex-1">
																				<FormControl>
																					<Input
																						placeholder="Responsibility..."
																						{...field}
																						value={field.value || ""}
																					/>
																				</FormControl>
																			</FormItem>
																		)}
																	/>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="text-destructive hover:text-destructive shrink-0"
																		onClick={() => {
																			const current =
																				form.getValues(
																					`jobOpeningsSection.jobOpenings.${index}.responsibilities`
																				) || [];
																			form.setValue(
																				`jobOpeningsSection.jobOpenings.${index}.responsibilities`,
																				current.filter(
																					(_, i) => i !== respIndex
																				)
																			);
																		}}
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																</div>
															))}
														</div>

														{/* Apply Link */}
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
																		External link for applications. If empty,
																		the page contact form is used.
																	</FormDescription>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												)}
											</div>
										))}

										{jobOpeningsFieldArray.fields.length === 0 && (
											<div className="text-center py-8 text-muted-foreground">
												No job listings yet. Click &quot;Add Job&quot; to
												create your first job posting.
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

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
												<FormLabel className="cursor-pointer">Values</FormLabel>
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
															placeholder="Driving Traders Toward"
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
															placeholder="Daily Wins"
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

						{/* Contact Sidebar Tab */}
						<TabsContent value="contact" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Contact Sidebar (Always Nearby)</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="contactSidebar.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Always Nearby"
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
										name="contactSidebar.address"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Address</FormLabel>
												<FormControl>
													<Textarea
														placeholder="1563 Hewes Avenue Linthicum&#10;Heights, MD 98230"
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
										name="contactSidebar.email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														placeholder="info@example.com"
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
											name="contactSidebar.phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone</FormLabel>
													<FormControl>
														<Input
															placeholder="+46 10 123 45 67"
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
											name="contactSidebar.secondaryPhone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Secondary Phone</FormLabel>
													<FormControl>
														<Input
															placeholder="+46 10 987 65 43"
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
										name="contactSidebar.formTitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Form Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Wave Hi!"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormDescription>
													Title above the quick contact form
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Expert CTA Tab */}
						<TabsContent value="cta" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Expert CTA Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="expertCta.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge</FormLabel>
												<FormControl>
													<Input
														placeholder="We Support You"
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
										name="expertCta.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Talk To An Expert"
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
										name="expertCta.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Get expert advice on starting your career with us..."
														rows={2}
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
															description:
																"Are you sure you want to remove this benefit?",
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
															description:
																"Are you sure you want to remove this value?",
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
														Image displayed when the page is shared on social
														media
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
												title:
													form.watch("seo.title") ||
													"Lediga Tjänster - Synos Medical",
												description:
													form.watch("seo.description") || "Add a description",
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
