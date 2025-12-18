"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	Loader2,
	Plus,
	Trash2,
	Home,
	Phone,
	Mail,
	MessageCircle,
	Send,
	MapPin,
	HelpCircle,
	Search,
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

// Available Lucide icons for selection
const AVAILABLE_ICONS = [
	"Phone",
	"Mail",
	"MessageCircle",
	"Clock",
	"CheckCircle",
	"CheckCircle2",
	"MapPin",
	"Building",
	"Send",
	"Users",
	"Globe",
	"Star",
	"Heart",
];

// Contact Card schema
const contactCardSchema = z.object({
	icon: z.string().min(1, "Icon is required"),
	title: z.string().min(1, "Title is required"),
	subtitle: z.string().optional(),
});

// FAQ Item schema
const faqItemSchema = z.object({
	question: z.string().min(1, "Question is required"),
	answer: z.string().min(1, "Answer is required"),
});

// Form schema
const kontaktPageFormSchema = z.object({
	// Hero Section
	hero: z.object({
		badge: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().min(1, "Subtitle is required"),
		responseTime: z.string().optional(),
		officeLocationsText: z.string().optional(),
	}),

	// Contact Cards
	phoneCard: contactCardSchema,
	emailCard: contactCardSchema,
	socialCard: contactCardSchema,

	// Form Section
	formSection: z.object({
		badge: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().min(1, "Subtitle is required"),
	}),

	// Office Section
	officeSection: z.object({
		badge: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().min(1, "Subtitle is required"),
		openingHours: z.string().optional(),
		closedText: z.string().optional(),
	}),

	// FAQ Section
	faqSection: z.object({
		badge: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().min(1, "Subtitle is required"),
		faqs: z.array(faqItemSchema),
	}),

	// SEO
	seo: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		ogImage: z.string().optional(),
	}),
});

type KontaktPageFormValues = z.infer<typeof kontaktPageFormSchema>;

export default function KontaktPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const form = useForm<KontaktPageFormValues>({
		resolver: zodResolver(kontaktPageFormSchema),
		defaultValues: {
			hero: {
				badge: "",
				title: "",
				subtitle: "",
				responseTime: "",
				officeLocationsText: "",
			},
			phoneCard: { icon: "Phone", title: "", subtitle: "" },
			emailCard: { icon: "Mail", title: "", subtitle: "" },
			socialCard: { icon: "MessageCircle", title: "", subtitle: "" },
			formSection: { badge: "", title: "", subtitle: "" },
			officeSection: {
				badge: "",
				title: "",
				subtitle: "",
				openingHours: "",
				closedText: "",
			},
			faqSection: { badge: "", title: "", subtitle: "", faqs: [] },
			seo: { title: "", description: "", ogImage: "" },
		},
	});

	// Field array for FAQs
	const {
		fields: faqFields,
		append: appendFaq,
		remove: removeFaq,
	} = useFieldArray({ control: form.control, name: "faqSection.faqs" });

	// Fetch kontakt page content on mount
	useEffect(() => {
		const fetchContent = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/kontakt-page");
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch content");
				}

				const content = data.data;

				// Reset form with fetched data
				form.reset({
					hero: {
						badge: content.hero?.badge || "",
						title: content.hero?.title || "",
						subtitle: content.hero?.subtitle || "",
						responseTime: content.hero?.responseTime || "",
						officeLocationsText: content.hero?.officeLocationsText || "",
					},
					phoneCard: {
						icon: content.phoneCard?.icon || "Phone",
						title: content.phoneCard?.title || "",
						subtitle: content.phoneCard?.subtitle || "",
					},
					emailCard: {
						icon: content.emailCard?.icon || "Mail",
						title: content.emailCard?.title || "",
						subtitle: content.emailCard?.subtitle || "",
					},
					socialCard: {
						icon: content.socialCard?.icon || "MessageCircle",
						title: content.socialCard?.title || "",
						subtitle: content.socialCard?.subtitle || "",
					},
					formSection: {
						badge: content.formSection?.badge || "",
						title: content.formSection?.title || "",
						subtitle: content.formSection?.subtitle || "",
					},
					officeSection: {
						badge: content.officeSection?.badge || "",
						title: content.officeSection?.title || "",
						subtitle: content.officeSection?.subtitle || "",
						openingHours: content.officeSection?.openingHours || "",
						closedText: content.officeSection?.closedText || "",
					},
					faqSection: {
						badge: content.faqSection?.badge || "",
						title: content.faqSection?.title || "",
						subtitle: content.faqSection?.subtitle || "",
						faqs: content.faqSection?.faqs || [],
					},
					seo: {
						title: content.seo?.title || "",
						description: content.seo?.description || "",
						ogImage: content.seo?.ogImage || "",
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

	const onSubmit = async (values: KontaktPageFormValues) => {
		try {
			setSaving(true);

			const response = await fetch("/api/kontakt-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to save content");
			}

			toast.success("Kontakt page content saved successfully");
		} catch (error) {
			console.error("Error saving content:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save content"
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
					<p className="mt-4 text-muted-foreground">Loading content...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Contact Page</h1>
				<p className="text-muted-foreground">
					Manage the content on the contact page.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Tabs defaultValue="hero" className="space-y-6">
						<TabsList className="grid w-full grid-cols-6">
							<TabsTrigger value="hero" className="flex items-center gap-2">
								<Home className="h-4 w-4" />
								<span className="hidden sm:inline">Hero</span>
							</TabsTrigger>
							<TabsTrigger value="cards" className="flex items-center gap-2">
								<Phone className="h-4 w-4" />
								<span className="hidden sm:inline">Cards</span>
							</TabsTrigger>
							<TabsTrigger value="form" className="flex items-center gap-2">
								<Send className="h-4 w-4" />
								<span className="hidden sm:inline">Form</span>
							</TabsTrigger>
							<TabsTrigger value="offices" className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								<span className="hidden sm:inline">Offices</span>
							</TabsTrigger>
							<TabsTrigger value="faq" className="flex items-center gap-2">
								<HelpCircle className="h-4 w-4" />
								<span className="hidden sm:inline">FAQ</span>
							</TabsTrigger>
							<TabsTrigger value="seo" className="flex items-center gap-2">
								<Search className="h-4 w-4" />
								<span className="hidden sm:inline">SEO</span>
							</TabsTrigger>
						</TabsList>

						{/* Hero Tab */}
						<TabsContent value="hero" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
									<CardDescription>
										The main section displayed at the top of the contact page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="hero.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														placeholder="We're here for you"
														{...field}
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
										name="hero.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Let's talk about your project"
														{...field}
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
														placeholder="Do you have questions about our products..."
														rows={3}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="hero.responseTime"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Response Time Text</FormLabel>
													<FormControl>
														<Input
															placeholder="Response within 24 hours"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Displayed as an informational text.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="hero.officeLocationsText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Office Locations Text</FormLabel>
													<FormControl>
														<Input
															placeholder="Offices in Stockholm & Linköping"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Information about office locations.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Contact Cards Tab */}
						<TabsContent value="cards" className="space-y-6">
							{/* Phone Card */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Phone className="h-5 w-5" />
										Phone Card
									</CardTitle>
									<CardDescription>
										Card for phone contact. The actual phone number is fetched from
										site settings.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-3">
										<FormField
											control={form.control}
											name="phoneCard.icon"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Icon</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select icon" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{AVAILABLE_ICONS.map((icon) => (
																<SelectItem key={icon} value={icon}>
																	{icon}
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
											name="phoneCard.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input placeholder="Phone" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="phoneCard.subtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle</FormLabel>
													<FormControl>
														<Input
															placeholder="Mon-Fri 09:00-17:00"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Email Card */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Mail className="h-5 w-5" />
										Email Card
									</CardTitle>
									<CardDescription>
										Card for email contact. The actual email address is fetched from
										site settings.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-3">
										<FormField
											control={form.control}
											name="emailCard.icon"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Icon</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select icon" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{AVAILABLE_ICONS.map((icon) => (
																<SelectItem key={icon} value={icon}>
																	{icon}
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
											name="emailCard.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input placeholder="Email" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="emailCard.subtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle</FormLabel>
													<FormControl>
														<Input
															placeholder="Response within 24 hours"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Social Media Card */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<MessageCircle className="h-5 w-5" />
										Social Media Card
									</CardTitle>
									<CardDescription>
										Card for social media. The actual links are fetched from
										site settings.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-3">
										<FormField
											control={form.control}
											name="socialCard.icon"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Icon</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select icon" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{AVAILABLE_ICONS.map((icon) => (
																<SelectItem key={icon} value={icon}>
																	{icon}
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
											name="socialCard.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input placeholder="Social Media" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="socialCard.subtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle</FormLabel>
													<FormControl>
														<Input
															placeholder="Follow us for updates"
															{...field}
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

						{/* Form Section Tab */}
						<TabsContent value="form" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Form Section</CardTitle>
									<CardDescription>
										Text displayed above the contact form.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="formSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input placeholder="Send Message" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="formSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Tell us about your project"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="formSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Fill out the form and we'll get back to you..."
														rows={2}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Office Section Tab */}
						<TabsContent value="offices" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Office Section</CardTitle>
									<CardDescription>
										Text displayed above the office locations. Actual addresses
										are fetched from site settings.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="officeSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input placeholder="Our Offices" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="officeSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input placeholder="Visit Us" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="officeSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="We have offices in Stockholm and Linköping..."
														rows={2}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="officeSection.openingHours"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Opening Hours</FormLabel>
													<FormControl>
														<Input
															placeholder="Mon-Fri 09:00-17:00"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="officeSection.closedText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Closed Text</FormLabel>
													<FormControl>
														<Input placeholder="Weekends closed" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* FAQ Tab */}
						<TabsContent value="faq" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>FAQ Section</CardTitle>
									<CardDescription>
										Frequently asked questions displayed at the bottom of the contact page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="faqSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input placeholder="FAQ" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="faqSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input placeholder="Have Questions?" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="faqSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Here you'll find answers to the most common questions..."
														rows={2}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* FAQ Items */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Questions & Answers</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendFaq({ question: "", answer: "" })}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add
										</Button>
									</CardTitle>
									<CardDescription>
										Add frequently asked questions and answers.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{faqFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No questions added. Click &quot;Add&quot; to
											add a question.
										</div>
									) : (
										faqFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Question {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => removeFaq(index)}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<FormField
														control={form.control}
														name={`faqSection.faqs.${index}.question`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Question</FormLabel>
																<FormControl>
																	<Input
																		placeholder="How quickly will I get a response?"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`faqSection.faqs.${index}.answer`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Answer</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="We strive to respond..."
																		rows={2}
																		{...field}
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

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>SEO Settings</CardTitle>
										<CardDescription>
											Search engine optimization for the contact page.
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
															placeholder="Contact Us - Synos Medical"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Displayed in the browser tab and search results.
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
															placeholder="Contact Synos Medical for questions..."
															rows={3}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Short description displayed in search results.
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
														Image displayed when sharing on social media.
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
											See how the contact page appears in search results and social
											media.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title:
													form.watch("seo.title") ||
													"Contact Us - Synos Medical",
												description:
													form.watch("seo.description") ||
													"Add a description",
												slug: "kontakt",
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
		</div>
	);
}
