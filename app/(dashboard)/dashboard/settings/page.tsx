"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	Building2,
	Phone,
	Mail,
	MapPin,
	Globe,
	Search,
	Plus,
	Trash2,
	Loader2,
	Eye,
	EyeOff,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { TagInput } from "@/components/admin/TagInput";

// Validation schema matching the API
const officeSchema = z.object({
	name: z.string().min(1, "Office name is required"),
	street: z.string().min(1, "Street is required"),
	postalCode: z.string().min(1, "Postal code is required"),
	city: z.string().min(1, "City is required"),
	country: z.string(),
	isHeadquarters: z.boolean(),
	isVisible: z.boolean(),
	mapEmbedUrl: z.string().optional(),
});

const settingsFormSchema = z.object({
	// Company
	companyName: z.string().min(1, "Company name is required"),
	orgNumber: z.string().min(1, "Organization number is required"),
	vatNumber: z.string().optional(),

	// Contact
	phone: z.string().min(1, "Phone is required"),
	email: z.string().email("Invalid email"),
	noreplyEmail: z.string().email("Invalid email").optional().or(z.literal("")),

	// Offices
	offices: z.array(officeSchema),

	// Social
	socialMedia: z.object({
		facebook: z.string().optional(),
		instagram: z.string().optional(),
		linkedin: z.string().optional(),
		twitter: z.string().optional(),
		youtube: z.string().optional(),
	}),

	// SEO
	seo: z.object({
		siteName: z.string().min(1, "Site name is required"),
		siteDescription: z.string().optional(),
		ogImage: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		twitterHandle: z.string().optional(),
	}),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues: {
			companyName: "",
			orgNumber: "",
			vatNumber: "",
			phone: "",
			email: "",
			noreplyEmail: "",
			offices: [],
			socialMedia: {
				facebook: "",
				instagram: "",
				linkedin: "",
				twitter: "",
				youtube: "",
			},
			seo: {
				siteName: "",
				siteDescription: "",
				ogImage: "",
				keywords: [],
				twitterHandle: "",
			},
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "offices",
	});

	// Fetch settings on mount
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/site-settings");
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch settings");
				}

				const settings = data.data;

				// Reset form with fetched data
				form.reset({
					companyName: settings.companyName || "",
					orgNumber: settings.orgNumber || "",
					vatNumber: settings.vatNumber || "",
					phone: settings.phone || "",
					email: settings.email || "",
					noreplyEmail: settings.noreplyEmail || "",
					offices: settings.offices || [],
					socialMedia: {
						facebook: settings.socialMedia?.facebook || "",
						instagram: settings.socialMedia?.instagram || "",
						linkedin: settings.socialMedia?.linkedin || "",
						twitter: settings.socialMedia?.twitter || "",
						youtube: settings.socialMedia?.youtube || "",
					},
					seo: {
						siteName: settings.seo?.siteName || "",
						siteDescription: settings.seo?.siteDescription || "",
						ogImage: settings.seo?.ogImage || "",
						keywords: settings.seo?.keywords || [],
						twitterHandle: settings.seo?.twitterHandle || "",
					},
				});
			} catch (error) {
				console.error("Error fetching settings:", error);
				toast.error("Failed to load settings");
			} finally {
				setLoading(false);
			}
		};

		fetchSettings();
	}, [form]);

	const onSubmit = async (values: SettingsFormValues) => {
		try {
			setSaving(true);

			const response = await fetch("/api/site-settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to save settings");
			}

			toast.success("Settings saved successfully");
		} catch (error) {
			console.error("Error saving settings:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save settings"
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
					<p className="mt-4 text-muted-foreground">Loading settings...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
				<p className="text-muted-foreground">
					Manage your website settings, contact information, and SEO defaults.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Tabs defaultValue="company" className="space-y-6">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="company" className="flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								<span className="hidden sm:inline">Company</span>
							</TabsTrigger>
							<TabsTrigger value="offices" className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								<span className="hidden sm:inline">Offices</span>
							</TabsTrigger>
							<TabsTrigger value="social" className="flex items-center gap-2">
								<Globe className="h-4 w-4" />
								<span className="hidden sm:inline">Social</span>
							</TabsTrigger>
							<TabsTrigger value="seo" className="flex items-center gap-2">
								<Search className="h-4 w-4" />
								<span className="hidden sm:inline">SEO</span>
							</TabsTrigger>
						</TabsList>

						{/* Company Tab */}
						<TabsContent value="company" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Company Information</CardTitle>
									<CardDescription>
										Basic information about your company.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="companyName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Name</FormLabel>
													<FormControl>
														<Input placeholder="Synos Medical AB" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="orgNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Organization Number</FormLabel>
													<FormControl>
														<Input placeholder="556871-8075" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="vatNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>VAT Number (Optional)</FormLabel>
												<FormControl>
													<Input placeholder="SE556871807501" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Phone className="h-5 w-5" />
										Contact Information
									</CardTitle>
									<CardDescription>
										Primary contact details used across the website.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input placeholder="010-205 15 01" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														<Mail className="h-4 w-4 inline mr-1" />
														Contact Email
													</FormLabel>
													<FormControl>
														<Input placeholder="info@synos.se" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="noreplyEmail"
											render={({ field }) => (
												<FormItem>
													<FormLabel>No-Reply Email (Optional)</FormLabel>
													<FormControl>
														<Input placeholder="noreply@synos.se" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Offices Tab */}
						<TabsContent value="offices" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<MapPin className="h-5 w-5" />
											Office Locations
										</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												append({
													name: "",
													street: "",
													postalCode: "",
													city: "",
													country: "Sverige",
													isHeadquarters: false,
													isVisible: true,
													mapEmbedUrl: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Office
										</Button>
									</CardTitle>
									<CardDescription>
										Add and manage your office locations.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{fields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No offices added yet. Click &quot;Add Office&quot; to add
											your first location.
										</div>
									) : (
										fields.map((field, index) => (
											<Card
												key={field.id}
												className={`border-dashed ${
													!form.watch(`offices.${index}.isVisible`)
														? "opacity-60"
														: ""
												}`}
											>
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<CardTitle className="text-base">
																Office {index + 1}
															</CardTitle>
															<FormField
																control={form.control}
																name={`offices.${index}.isVisible`}
																render={({ field }) => (
																	<FormItem className="flex items-center gap-2 space-y-0">
																		<FormControl>
																			<Button
																				type="button"
																				variant={
																					field.value ? "primary" : "outline"
																				}
																				size="sm"
																				onClick={() =>
																					field.onChange(!field.value)
																				}
																				className="h-7 px-2 text-xs"
																			>
																				{field.value ? (
																					<>
																						<Eye className="h-3 w-3 mr-1" />
																						Visible
																					</>
																				) : (
																					<>
																						<EyeOff className="h-3 w-3 mr-1" />
																						Hidden
																					</>
																				)}
																			</Button>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => remove(index)}
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
															name={`offices.${index}.name`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Office Name</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Stockholm"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`offices.${index}.isHeadquarters`}
															render={({ field }) => (
																<FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
																	<FormControl>
																		<Checkbox
																			checked={field.value}
																			onCheckedChange={field.onChange}
																		/>
																	</FormControl>
																	<FormLabel className="font-normal">
																		Headquarters
																	</FormLabel>
																</FormItem>
															)}
														/>
													</div>

													<FormField
														control={form.control}
														name={`offices.${index}.street`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Street Address</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Turebergsvägen 5"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid gap-4 sm:grid-cols-3">
														<FormField
															control={form.control}
															name={`offices.${index}.postalCode`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Postal Code</FormLabel>
																	<FormControl>
																		<Input placeholder="191 47" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`offices.${index}.city`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>City</FormLabel>
																	<FormControl>
																		<Input placeholder="Sollentuna" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`offices.${index}.country`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Country</FormLabel>
																	<FormControl>
																		<Input placeholder="Sverige" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													<FormField
														control={form.control}
														name={`offices.${index}.mapEmbedUrl`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Google Maps Embed URL (Optional)
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="https://www.google.com/maps/embed?pb=..."
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Paste the embed URL from Google Maps to show a
																	map for this location.
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

						{/* Social Tab */}
						<TabsContent value="social" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Globe className="h-5 w-5" />
										Social Media Links
									</CardTitle>
									<CardDescription>
										Connect your social media profiles.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="socialMedia.facebook"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Facebook</FormLabel>
												<FormControl>
													<Input
														placeholder="https://facebook.com/synosmedical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.instagram"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Instagram</FormLabel>
												<FormControl>
													<Input
														placeholder="https://instagram.com/synosmedical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.linkedin"
										render={({ field }) => (
											<FormItem>
												<FormLabel>LinkedIn</FormLabel>
												<FormControl>
													<Input
														placeholder="https://linkedin.com/company/synos-medical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.twitter"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Twitter / X</FormLabel>
												<FormControl>
													<Input
														placeholder="https://twitter.com/synosmedical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.youtube"
										render={({ field }) => (
											<FormItem>
												<FormLabel>YouTube</FormLabel>
												<FormControl>
													<Input
														placeholder="https://youtube.com/@synosmedical"
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

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								{/* SEO Settings Card */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Search className="h-5 w-5" />
											SEO Defaults
										</CardTitle>
										<CardDescription>
											Default SEO settings used when page-specific settings are
											not provided.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="seo.siteName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Site Name</FormLabel>
													<FormControl>
														<Input placeholder="Synos Medical" {...field} />
													</FormControl>
													<FormDescription>
														Used in page titles and meta tags.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.siteDescription"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Site Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Sveriges ledande leverantör av MDR-certifierad klinikutrustning..."
															rows={3}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Default meta description for pages without their
														own.
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
													<FormLabel>Default OG Image</FormLabel>
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
														Default social sharing image. Recommended size:
														1200x630px (1.91:1 aspect ratio).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.twitterHandle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Twitter Handle</FormLabel>
													<FormControl>
														<Input placeholder="@synosmedical" {...field} />
													</FormControl>
													<FormDescription>
														Used for Twitter card attribution.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.keywords"
											render={({ field }) => (
												<FormItem>
													<FormLabel>SEO Keywords</FormLabel>
													<FormControl>
														<TagInput
															value={field.value || []}
															onChange={field.onChange}
															placeholder="Add keyword and press Enter..."
															maxTags={15}
														/>
													</FormControl>
													<FormDescription>
														Default meta keywords for the site. Press Enter or comma to add.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								{/* SEO Preview Card */}
								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
										<CardDescription>
											See how your site will appear in search results and social
											media.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title:
													form.watch("seo.siteName") ||
													"Synos Medical",
												description:
													form.watch("seo.siteDescription") ||
													"Add a site description",
												slug: "",
												ogImage: form.watch("seo.ogImage") || null,
												siteName:
													form.watch("seo.siteName") || "Synos Medical",
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
								"Save Settings"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
