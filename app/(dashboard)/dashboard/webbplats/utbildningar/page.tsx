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
	{ value: "CheckSquare", label: "Checkbox" },
	{ value: "HeartPlus", label: "Heart" },
	{ value: "GraduationCap", label: "Education" },
	{ value: "Award", label: "Award" },
	{ value: "Users", label: "Users" },
	{ value: "Shield", label: "Shield" },
	{ value: "Star", label: "Star" },
];

// Local Zod schema
const formSchema = z.object({
	sectionVisibility: z.object({
		hero: z.boolean(),
		mainContent: z.boolean(),
		benefits: z.boolean(),
		process: z.boolean(),
		support: z.boolean(),
		inquiryForm: z.boolean(),
		resources: z.boolean(),
	}).optional(),
	hero: z.object({
		title: z.string().max(200).optional(),
		titleHighlight: z.string().max(200).optional(),
		subtitle: z.string().max(1000).optional(),
	}).optional(),
	mainContent: z.object({
		title: z.string().max(200).optional(),
		paragraphs: z.array(z.string().max(2000)).optional(),
	}).optional(),
	benefits: z.array(z.object({
		icon: z.string().max(50).optional(),
		title: z.string().max(200).optional(),
		description: z.string().max(500).optional(),
	})).optional(),
	processSection: z.object({
		title: z.string().max(200).optional(),
		subtitle: z.string().max(500).optional(),
		steps: z.array(z.object({
			number: z.string().max(10).optional(),
			title: z.string().max(200).optional(),
			description: z.string().max(500).optional(),
		})).optional(),
	}).optional(),
	supportSection: z.object({
		title: z.string().max(200).optional(),
		paragraphs: z.array(z.string().max(1000)).optional(),
		phone: z.string().max(50).optional(),
		email: z.string().email().max(200).optional().or(z.literal("")),
	}).optional(),
	inquirySection: z.object({
		badge: z.string().max(100).optional(),
		title: z.string().max(200).optional(),
		subtitle: z.string().max(500).optional(),
	}).optional(),
	resourcesSection: z.object({
		title: z.string().max(200).optional(),
		subtitle: z.string().max(300).optional(),
		resources: z.array(z.object({
			title: z.string().max(200).optional(),
			description: z.string().max(500).optional(),
			href: z.string().max(500).optional(),
			buttonText: z.string().max(100).optional(),
		})).optional(),
	}).optional(),
	seo: z.object({
		title: z.string().max(100).optional(),
		description: z.string().max(300).optional(),
		ogImage: z.string().max(500).optional(),
	}).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TrainingPageAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true, mainContent: true, benefits: true, process: true,
				support: true, inquiryForm: true, resources: true,
			},
			hero: {},
			mainContent: { paragraphs: [] },
			benefits: [],
			processSection: { steps: [] },
			supportSection: { paragraphs: [] },
			inquirySection: {},
			resourcesSection: { resources: [] },
			seo: {},
		},
	});

	const benefitsFieldArray = useFieldArray({ control: form.control, name: "benefits" });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const paragraphsFieldArray = useFieldArray({ control: form.control, name: "mainContent.paragraphs" as any });
	const stepsFieldArray = useFieldArray({ control: form.control, name: "processSection.steps" });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const supportParagraphsFieldArray = useFieldArray({ control: form.control, name: "supportSection.paragraphs" as any });
	const resourcesFieldArray = useFieldArray({ control: form.control, name: "resourcesSection.resources" });

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/training-page");
				if (response.ok) {
					const data = await response.json();
					form.reset({
						sectionVisibility: data.sectionVisibility || {
							hero: true, mainContent: true, benefits: true, process: true,
							support: true, inquiryForm: true, resources: true,
						},
						hero: data.hero || {},
						mainContent: data.mainContent || { paragraphs: [] },
						benefits: data.benefits || [],
						processSection: data.processSection || { steps: [] },
						supportSection: data.supportSection || { paragraphs: [] },
						inquirySection: data.inquirySection || {},
						resourcesSection: data.resourcesSection || { resources: [] },
						seo: data.seo || {},
					});
				}
			} catch (error) {
				console.error("Error fetching training page data:", error);
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
			const response = await fetch("/api/training-page", {
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

			toast.success("Training page saved successfully");
		} catch (error) {
			console.error("Error saving training page:", error);
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
					<h1 className="text-3xl font-bold tracking-tight">Training Page</h1>
					<p className="text-muted-foreground">
						Manage the content of the Training page.
					</p>
				</div>
				<a
					href="/utbildningar"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form id="training-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="main">Main Content</TabsTrigger>
							<TabsTrigger value="benefits">Benefits</TabsTrigger>
							<TabsTrigger value="process">Process</TabsTrigger>
							<TabsTrigger value="support">Support</TabsTrigger>
							<TabsTrigger value="inquiry">Inquiry</TabsTrigger>
							<TabsTrigger value="resources">Resources</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Visibility Tab */}
						<TabsContent value="visibility" className="space-y-4">
							<Card>
								<CardHeader><CardTitle>Section Visibility</CardTitle></CardHeader>
								<CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{["hero", "mainContent", "benefits", "process", "support", "inquiryForm", "resources"].map((key) => (
										<FormField key={key} control={form.control} name={`sectionVisibility.${key}` as `sectionVisibility.hero`}
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-3">
													<FormLabel className="cursor-pointer capitalize">{key === "inquiryForm" ? "Inquiry Form" : key === "mainContent" ? "Main Content" : key}</FormLabel>
													<FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
												</FormItem>
											)}
										/>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Hero Tab */}
						<TabsContent value="hero" className="space-y-4">
							<Card>
								<CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField control={form.control} name="hero.title" render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl><Input placeholder="Vi ser till att du kan använda vår utrustning" {...field} value={field.value || ""} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="hero.titleHighlight" render={({ field }) => (
											<FormItem>
												<FormLabel>Highlighted Text</FormLabel>
												<FormControl><Input placeholder="på rätt sätt" {...field} value={field.value || ""} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
									<FormField control={form.control} name="hero.subtitle" render={({ field }) => (
										<FormItem>
											<FormLabel>Subtitle</FormLabel>
											<FormControl><Textarea placeholder="Vi på Synos Medical erbjuder..." rows={3} {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
								</CardContent>
							</Card>
						</TabsContent>

						{/* Main Content Tab */}
						<TabsContent value="main" className="space-y-4">
							<Card>
								<CardHeader><CardTitle>Main Content</CardTitle></CardHeader>
								<CardContent className="space-y-4">
									<FormField control={form.control} name="mainContent.title" render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl><Input placeholder="Alltid anpassad utbildning" {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Paragraphs</FormLabel>
											<Button type="button" variant="outline" size="sm" onClick={() => paragraphsFieldArray.append("" as never)}>
												<Plus className="mr-2 h-4 w-4" />Add Paragraph
											</Button>
										</div>
										{paragraphsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<FormField control={form.control} name={`mainContent.paragraphs.${index}`} render={({ field }) => (
													<FormItem className="flex-1">
														<FormControl><Textarea placeholder="Skriv ett stycke här..." rows={3} {...field} value={field.value || ""} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Paragraph",
														description: "Are you sure you want to remove this paragraph?",
														confirmText: "Remove",
													});
													if (confirmed) paragraphsFieldArray.remove(index);
												}}>
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
								<CardHeader><CardTitle>Benefits</CardTitle></CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<FormLabel>Benefit Cards</FormLabel>
										<Button type="button" variant="outline" size="sm" onClick={() => benefitsFieldArray.append({ icon: "", title: "", description: "" })}>
											<Plus className="mr-2 h-4 w-4" />Add Benefit
										</Button>
									</div>
									{benefitsFieldArray.fields.map((field, index) => (
										<div key={field.id} className="flex gap-4 rounded-lg border p-4">
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 sm:grid-cols-2">
													<FormField control={form.control} name={`benefits.${index}.icon`} render={({ field }) => (
														<FormItem>
															<FormLabel>Icon</FormLabel>
															<Select onValueChange={field.onChange} value={field.value || ""}>
																<FormControl><SelectTrigger><SelectValue placeholder="Select icon" /></SelectTrigger></FormControl>
																<SelectContent>{ICONS.map((icon) => (<SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>))}</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)} />
													<FormField control={form.control} name={`benefits.${index}.title`} render={({ field }) => (
														<FormItem>
															<FormLabel>Title</FormLabel>
															<FormControl><Input placeholder="Teoretisk & Praktisk Utbildning" {...field} value={field.value || ""} /></FormControl>
															<FormMessage />
														</FormItem>
													)} />
												</div>
												<FormField control={form.control} name={`benefits.${index}.description`} render={({ field }) => (
													<FormItem>
														<FormLabel>Description</FormLabel>
														<FormControl><Textarea placeholder="Omfattande utbildning..." rows={2} {...field} value={field.value || ""} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
											</div>
											<Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={async () => {
												const confirmed = await confirm({
													title: "Remove Benefit",
													description: "Are you sure you want to remove this benefit?",
													confirmText: "Remove",
												});
												if (confirmed) benefitsFieldArray.remove(index);
											}}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Process Tab */}
						<TabsContent value="process" className="space-y-4">
							<Card>
								<CardHeader><CardTitle>Training Process</CardTitle></CardHeader>
								<CardContent className="space-y-4">
									<FormField control={form.control} name="processSection.title" render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl><Input placeholder="Utbildningsprocessen" {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="processSection.subtitle" render={({ field }) => (
										<FormItem>
											<FormLabel>Subtitle</FormLabel>
											<FormControl><Textarea placeholder="Vår utbildning är uppbyggd..." rows={2} {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Steps</FormLabel>
											<Button type="button" variant="outline" size="sm" onClick={() => stepsFieldArray.append({ number: "", title: "", description: "" })}>
												<Plus className="mr-2 h-4 w-4" />Add Step
											</Button>
										</div>
										{stepsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4 rounded-lg border p-4">
												<div className="flex-1 space-y-4">
													<div className="grid gap-4 sm:grid-cols-3">
														<FormField control={form.control} name={`processSection.steps.${index}.number`} render={({ field }) => (
															<FormItem>
																<FormLabel>Number</FormLabel>
																<FormControl><Input placeholder="1" {...field} value={field.value || ""} /></FormControl>
																<FormMessage />
															</FormItem>
														)} />
														<FormField control={form.control} name={`processSection.steps.${index}.title`} render={({ field }) => (
															<FormItem className="sm:col-span-2">
																<FormLabel>Title</FormLabel>
																<FormControl><Input placeholder="Initial Utbildning" {...field} value={field.value || ""} /></FormControl>
																<FormMessage />
															</FormItem>
														)} />
													</div>
													<FormField control={form.control} name={`processSection.steps.${index}.description`} render={({ field }) => (
														<FormItem>
															<FormLabel>Description</FormLabel>
															<FormControl><Textarea placeholder="2-5 dagars intensiv utbildning..." rows={2} {...field} value={field.value || ""} /></FormControl>
															<FormMessage />
														</FormItem>
													)} />
												</div>
												<Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Step",
														description: "Are you sure you want to remove this step?",
														confirmText: "Remove",
													});
													if (confirmed) stepsFieldArray.remove(index);
												}}>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Support Tab */}
						<TabsContent value="support" className="space-y-4">
							<Card>
								<CardHeader><CardTitle>Support Section</CardTitle></CardHeader>
								<CardContent className="space-y-4">
									<FormField control={form.control} name="supportSection.title" render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl><Input placeholder="Support när du behöver det" {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Paragraphs</FormLabel>
											<Button type="button" variant="outline" size="sm" onClick={() => supportParagraphsFieldArray.append("" as never)}>
												<Plus className="mr-2 h-4 w-4" />Add Paragraph
											</Button>
										</div>
										{supportParagraphsFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<FormField control={form.control} name={`supportSection.paragraphs.${index}`} render={({ field }) => (
													<FormItem className="flex-1">
														<FormControl><Textarea placeholder="Skriv ett stycke här..." rows={2} {...field} value={field.value || ""} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Paragraph",
														description: "Are you sure you want to remove this paragraph?",
														confirmText: "Remove",
													});
													if (confirmed) supportParagraphsFieldArray.remove(index);
												}}>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField control={form.control} name="supportSection.phone" render={({ field }) => (
											<FormItem>
												<FormLabel>Phone</FormLabel>
												<FormControl><Input placeholder="010-205 15 01" {...field} value={field.value || ""} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="supportSection.email" render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl><Input placeholder="info@synos.se" {...field} value={field.value || ""} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Inquiry Tab */}
						<TabsContent value="inquiry" className="space-y-4">
							<Card>
								<CardHeader><CardTitle>Inquiry Form Section</CardTitle></CardHeader>
								<CardContent className="space-y-4">
									<FormField control={form.control} name="inquirySection.badge" render={({ field }) => (
										<FormItem>
											<FormLabel>Badge</FormLabel>
											<FormControl><Input placeholder="Utbildningsförfrågan" {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="inquirySection.title" render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl><Input placeholder="Intresserad av våra utbildningar?" {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="inquirySection.subtitle" render={({ field }) => (
										<FormItem>
											<FormLabel>Subtitle</FormLabel>
											<FormControl><Textarea placeholder="Fyll i formuläret så kontaktar vi dig..." rows={2} {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
								</CardContent>
							</Card>
						</TabsContent>

						{/* Resources Tab */}
						<TabsContent value="resources" className="space-y-4">
							<Card>
								<CardHeader><CardTitle>Resources Section</CardTitle></CardHeader>
								<CardContent className="space-y-4">
									<FormField control={form.control} name="resourcesSection.title" render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl><Input placeholder="Relaterade resurser" {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="resourcesSection.subtitle" render={({ field }) => (
										<FormItem>
											<FormLabel>Subtitle</FormLabel>
											<FormControl><Input placeholder="Utforska mer om hur vi kan hjälpa dig" {...field} value={field.value || ""} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Resource Cards</FormLabel>
											<Button type="button" variant="outline" size="sm" onClick={() => resourcesFieldArray.append({ title: "", description: "", href: "", buttonText: "" })}>
												<Plus className="mr-2 h-4 w-4" />Add Resource
											</Button>
										</div>
										{resourcesFieldArray.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4 rounded-lg border p-4">
												<div className="flex-1 space-y-4">
													<FormField control={form.control} name={`resourcesSection.resources.${index}.title`} render={({ field }) => (
														<FormItem>
															<FormLabel>Title</FormLabel>
															<FormControl><Input placeholder="Miniutbildning" {...field} value={field.value || ""} /></FormControl>
															<FormMessage />
														</FormItem>
													)} />
													<FormField control={form.control} name={`resourcesSection.resources.${index}.description`} render={({ field }) => (
														<FormItem>
															<FormLabel>Description</FormLabel>
															<FormControl><Textarea placeholder="Få kunskapen att välja rätt laser..." rows={2} {...field} value={field.value || ""} /></FormControl>
															<FormMessage />
														</FormItem>
													)} />
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField control={form.control} name={`resourcesSection.resources.${index}.href`} render={({ field }) => (
															<FormItem>
																<FormLabel>Link</FormLabel>
																<FormControl><Input placeholder="/starta-eget/miniutbildning" {...field} value={field.value || ""} /></FormControl>
																<FormMessage />
															</FormItem>
														)} />
														<FormField control={form.control} name={`resourcesSection.resources.${index}.buttonText`} render={({ field }) => (
															<FormItem>
																<FormLabel>Button Text</FormLabel>
																<FormControl><Input placeholder="Läs mer" {...field} value={field.value || ""} /></FormControl>
																<FormMessage />
															</FormItem>
														)} />
													</div>
												</div>
												<Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Resource",
														description: "Are you sure you want to remove this resource?",
														confirmText: "Remove",
													});
													if (confirmed) resourcesFieldArray.remove(index);
												}}>
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
									<CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
									<CardContent className="space-y-4">
										<FormField control={form.control} name="seo.title" render={({ field }) => (
											<FormItem>
												<FormLabel>Meta Title</FormLabel>
												<FormControl><Input placeholder="Utbildningar | Synos Medical" {...field} value={field.value || ""} /></FormControl>
												<FormDescription>Recommended length: 50-60 characters</FormDescription>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="seo.description" render={({ field }) => (
											<FormItem>
												<FormLabel>Meta Description</FormLabel>
												<FormControl><Textarea placeholder="När du köper maskin hos oss ingår även flera dagar utbildning..." rows={3} {...field} value={field.value || ""} /></FormControl>
												<FormDescription>Recommended length: 150-160 characters</FormDescription>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="seo.ogImage" render={({ field }) => (
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
												<FormDescription>Image displayed when the page is shared on social media</FormDescription>
												<FormMessage />
											</FormItem>
										)} />
									</CardContent>
								</Card>
								<Card>
									<CardHeader><CardTitle>Preview</CardTitle></CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title: form.watch("seo.title") || "Utbildningar - Synos Medical",
												description: form.watch("seo.description") || "Add a description",
												ogImage: form.watch("seo.ogImage") || null,
												slug: "utbildningar",
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
