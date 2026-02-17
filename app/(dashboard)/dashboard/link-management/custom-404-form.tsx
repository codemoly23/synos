"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/storage/media-picker";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";

// ============================================================================
// FORM SCHEMA
// ============================================================================
const suggestedPageSchema = z.object({
	label: z.string().optional(),
	href: z.string().optional(),
	description: z.string().optional(),
	icon: z.string().optional(),
});

const formSchema = z.object({
	sectionVisibility: z.object({
		hero: z.boolean(),
		suggestedPages: z.boolean(),
		cta: z.boolean(),
	}),
	hero: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		description: z.string().optional(),
		backgroundImage: z.string().optional(),
		backgroundStyle: z.enum(["gradient", "solid", "image"]).optional(),
		backgroundColor: z.string().optional(),
	}),
	suggestedPages: z.array(suggestedPageSchema),
	cta: z.object({
		primaryButtonText: z.string().optional(),
		primaryButtonHref: z.string().optional(),
		secondaryButtonText: z.string().optional(),
		secondaryButtonHref: z.string().optional(),
	}),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
	sectionVisibility: {
		hero: true,
		suggestedPages: true,
		cta: true,
	},
	hero: {
		title: "404",
		subtitle: "Sidan kunde inte hittas",
		description: "Tyvärr kunde vi inte hitta sidan du letar efter.",
		backgroundImage: "",
		backgroundStyle: "gradient",
		backgroundColor: "",
	},
	suggestedPages: [],
	cta: {
		primaryButtonText: "Tillbaka till startsidan",
		primaryButtonHref: "/",
		secondaryButtonText: "Kontakta oss",
		secondaryButtonHref: "/kontakt",
	},
};

export function Custom404Form() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const {
		fields: suggestedPageFields,
		append: appendSuggestedPage,
		remove: removeSuggestedPage,
	} = useFieldArray({
		control: form.control,
		name: "suggestedPages",
	});

	const backgroundStyle = form.watch("hero.backgroundStyle");

	// Fetch data on mount
	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/custom-404-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						sectionVisibility: {
							hero: data.sectionVisibility?.hero ?? true,
							suggestedPages:
								data.sectionVisibility?.suggestedPages ?? true,
							cta: data.sectionVisibility?.cta ?? true,
						},
						hero: {
							title: data.hero?.title || "404",
							subtitle:
								data.hero?.subtitle ||
								"Sidan kunde inte hittas",
							description: data.hero?.description || "",
							backgroundImage:
								data.hero?.backgroundImage || "",
							backgroundStyle:
								data.hero?.backgroundStyle || "gradient",
							backgroundColor:
								data.hero?.backgroundColor || "",
						},
						suggestedPages: data.suggestedPages || [],
						cta: {
							primaryButtonText:
								data.cta?.primaryButtonText ||
								"Tillbaka till startsidan",
							primaryButtonHref:
								data.cta?.primaryButtonHref || "/",
							secondaryButtonText:
								data.cta?.secondaryButtonText ||
								"Kontakta oss",
							secondaryButtonHref:
								data.cta?.secondaryButtonHref || "/kontakt",
						},
					});
				}
			} catch {
				toast.error("Failed to load 404 page content");
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [form]);

	// Save handler
	async function onSubmit(values: FormValues) {
		setSaving(true);
		try {
			const res = await fetch("/api/custom-404-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				throw new Error("Failed to save");
			}

			toast.success("404 page updated successfully");
		} catch {
			toast.error("Failed to save 404 page content");
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return <CMSPageSkeleton />;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Save Button */}
				<div className="flex justify-end">
					<Button type="submit" disabled={saving}>
						{saving && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{saving ? "Saving..." : "Save Changes"}
					</Button>
				</div>

				{/* Section Visibility */}
				<Card>
					<CardHeader>
						<CardTitle>Section Visibility</CardTitle>
						<CardDescription>
							Toggle sections on or off for the 404 page.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="sectionVisibility.hero"
							render={({ field }) => (
								<div className="flex items-center justify-between">
									<Label>Hero Section</Label>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="sectionVisibility.suggestedPages"
							render={({ field }) => (
								<div className="flex items-center justify-between">
									<Label>Suggested Pages</Label>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="sectionVisibility.cta"
							render={({ field }) => (
								<div className="flex items-center justify-between">
									<Label>CTA Buttons</Label>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</div>
							)}
						/>
					</CardContent>
				</Card>

				{/* Hero Section */}
				<Card>
					<CardHeader>
						<CardTitle>Hero Section</CardTitle>
						<CardDescription>
							The main heading and text visitors see on the 404
							page.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="hero.title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input
												placeholder="404"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											The large heading text (e.g.
											&quot;404&quot;)
										</FormDescription>
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
											<Input
												placeholder="Sidan kunde inte hittas"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="hero.description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="A helpful message for lost visitors..."
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="hero.backgroundStyle"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Background Style</FormLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select style" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="gradient">
													Gradient (Default)
												</SelectItem>
												<SelectItem value="solid">
													Solid Color
												</SelectItem>
												<SelectItem value="image">
													Background Image
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{backgroundStyle === "solid" && (
								<FormField
									control={form.control}
									name="hero.backgroundColor"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Background Color
											</FormLabel>
											<FormControl>
												<Input
													type="color"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						{backgroundStyle === "image" && (
							<FormField
								control={form.control}
								name="hero.backgroundImage"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Background Image</FormLabel>
										<FormControl>
											<MediaPicker
												type="image"
												value={field.value}
												onChange={(url) =>
													field.onChange(url || "")
												}
												placeholder="Select background image"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</CardContent>
				</Card>

				{/* Suggested Pages */}
				<Card>
					<CardHeader>
						<CardTitle>Suggested Pages</CardTitle>
						<CardDescription>
							Links to suggest when visitors land on the 404 page.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{suggestedPageFields.map((field, index) => (
							<div
								key={field.id}
								className="border rounded-lg p-4 space-y-3"
							>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">
										Page {index + 1}
									</span>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() =>
											removeSuggestedPage(index)
										}
									>
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<FormField
										control={form.control}
										name={`suggestedPages.${index}.label`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Label</FormLabel>
												<FormControl>
													<Input
														placeholder="Startsidan"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`suggestedPages.${index}.href`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>URL</FormLabel>
												<FormControl>
													<Input
														placeholder="/"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name={`suggestedPages.${index}.description`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Description (optional)
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Short description..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								appendSuggestedPage({
									label: "",
									href: "",
									description: "",
									icon: "",
								})
							}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Suggested Page
						</Button>
					</CardContent>
				</Card>

				{/* CTA Buttons */}
				<Card>
					<CardHeader>
						<CardTitle>CTA Buttons</CardTitle>
						<CardDescription>
							Call-to-action buttons displayed on the 404 page.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<h4 className="text-sm font-medium mb-3">
								Primary Button
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="cta.primaryButtonText"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Button Text</FormLabel>
											<FormControl>
												<Input
													placeholder="Tillbaka till startsidan"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="cta.primaryButtonHref"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Button URL</FormLabel>
											<FormControl>
												<Input
													placeholder="/"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div>
							<h4 className="text-sm font-medium mb-3">
								Secondary Button
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="cta.secondaryButtonText"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Button Text</FormLabel>
											<FormControl>
												<Input
													placeholder="Kontakta oss"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="cta.secondaryButtonHref"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Button URL</FormLabel>
											<FormControl>
												<Input
													placeholder="/kontakt"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
}
