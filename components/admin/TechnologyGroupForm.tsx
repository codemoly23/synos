"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { optionalNumberField } from "@/lib/utils/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MediaPicker } from "@/components/storage";
import { ImagePickerWithDimensions } from "./ImagePickerWithDimensions";
import { SeoPreview, SeoAnalysis, CharacterCount } from "./seo";
import TextEditor from "@/components/common/TextEditor";
import { generateSlug } from "@/lib/utils/product-helpers";

export interface TechnologyGroupFormData {
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	imageWidth?: number;
	imageHeight?: number;
	heroTitle?: string;
	heroSubtitle?: string;
	heroBulletPoints?: string[];
	heroBgMobile?: string | null;
	heroBgDesktop?: string | null;
	heroBgMobileWidth?: number;
	heroBgMobileHeight?: number;
	heroBgDesktopWidth?: number;
	heroBgDesktopHeight?: number;
	inquiryBgMobile?: string | null;
	inquiryBgDesktop?: string | null;
	inquiryBgMobileWidth?: number;
	inquiryBgMobileHeight?: number;
	inquiryBgDesktopWidth?: number;
	inquiryBgDesktopHeight?: number;
	order?: number;
	isActive?: boolean;
	faqTitle?: string;
	faqs?: Array<{
		_id?: string;
		question: string;
		answer: string;
		visible: boolean;
	}>;
	seo?: {
		title?: string;
		description?: string;
		ogImage?: string | null;
		noindex?: boolean;
	};
}

interface TechnologyGroupFormInternal {
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	imageWidth?: number;
	imageHeight?: number;
	heroTitle?: string;
	heroSubtitle?: string;
	heroBulletPoints?: Array<{ value: string }>;
	heroBgMobile?: string | null;
	heroBgDesktop?: string | null;
	heroBgMobileWidth?: number;
	heroBgMobileHeight?: number;
	heroBgDesktopWidth?: number;
	heroBgDesktopHeight?: number;
	inquiryBgMobile?: string | null;
	inquiryBgDesktop?: string | null;
	inquiryBgMobileWidth?: number;
	inquiryBgMobileHeight?: number;
	inquiryBgDesktopWidth?: number;
	inquiryBgDesktopHeight?: number;
	order?: number;
	isActive?: boolean;
	faqTitle?: string;
	faqs?: Array<{
		_id?: string;
		question: string;
		answer: string;
		visible: boolean;
	}>;
	seo?: {
		title?: string;
		description?: string;
		ogImage?: string | null;
		noindex?: boolean;
	};
}

export interface ITechnologyGroupInput {
	_id?: string;
	name?: string;
	slug?: string;
	description?: string;
	image?: string | null;
	imageWidth?: number;
	imageHeight?: number;
	heroTitle?: string;
	heroSubtitle?: string;
	heroBulletPoints?: string[];
	heroBgMobile?: string | null;
	heroBgDesktop?: string | null;
	heroBgMobileWidth?: number;
	heroBgMobileHeight?: number;
	heroBgDesktopWidth?: number;
	heroBgDesktopHeight?: number;
	inquiryBgMobile?: string | null;
	inquiryBgDesktop?: string | null;
	inquiryBgMobileWidth?: number;
	inquiryBgMobileHeight?: number;
	inquiryBgDesktopWidth?: number;
	inquiryBgDesktopHeight?: number;
	order?: number;
	isActive?: boolean;
	faqTitle?: string;
	faqs?: Array<{
		_id?: string;
		question: string;
		answer: string;
		visible: boolean;
	}>;
	seo?: {
		title?: string;
		description?: string;
		ogImage?: string | null;
		noindex?: boolean;
	};
}

interface TechnologyGroupFormProps {
	group?: ITechnologyGroupInput | null;
	onSubmit: (data: TechnologyGroupFormData) => Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

export function TechnologyGroupForm({
	group,
	onSubmit,
	onCancel,
	isLoading = false,
	className,
}: TechnologyGroupFormProps) {
	const isEditing = !!group?._id;

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		control,
		formState: { errors, isDirty },
	} = useForm<TechnologyGroupFormInternal>({
		defaultValues: {
			name: group?.name || "",
			slug: group?.slug || "",
			description: group?.description || "",
			image: group?.image || "",
			heroTitle: group?.heroTitle || "",
			heroSubtitle: group?.heroSubtitle || "",
			heroBulletPoints: (group?.heroBulletPoints || []).map((v) => ({ value: v })),
			heroBgMobile: group?.heroBgMobile || "",
			heroBgDesktop: group?.heroBgDesktop || "",
			heroBgMobileWidth: group?.heroBgMobileWidth,
			heroBgMobileHeight: group?.heroBgMobileHeight,
			heroBgDesktopWidth: group?.heroBgDesktopWidth,
			heroBgDesktopHeight: group?.heroBgDesktopHeight,
			inquiryBgMobile: group?.inquiryBgMobile || "",
			inquiryBgDesktop: group?.inquiryBgDesktop || "",
			inquiryBgMobileWidth: group?.inquiryBgMobileWidth,
			inquiryBgMobileHeight: group?.inquiryBgMobileHeight,
			inquiryBgDesktopWidth: group?.inquiryBgDesktopWidth,
			inquiryBgDesktopHeight: group?.inquiryBgDesktopHeight,
			imageWidth: group?.imageWidth,
			imageHeight: group?.imageHeight,
			order: group?.order ?? 0,
			isActive: group?.isActive ?? true,
			faqTitle: group?.faqTitle || "",
			faqs:
				group?.faqs?.map((faq) => ({
					_id: faq._id,
					question: faq.question,
					answer: faq.answer,
					visible: faq.visible ?? true,
				})) || [],
			seo: {
				title: group?.seo?.title || "",
				description: group?.seo?.description || "",
				ogImage: group?.seo?.ogImage || "",
				noindex: group?.seo?.noindex || false,
			},
		},
	});

	const {
		fields: faqFields,
		append: appendFaq,
		remove: removeFaq,
	} = useFieldArray({
		control,
		name: "faqs",
	});

	const {
		fields: bulletFields,
		append: appendBullet,
		remove: removeBullet,
	} = useFieldArray({
		control,
		name: "heroBulletPoints",
	});

	const name = watch("name");
	const slug = watch("slug");
	const description = watch("description");
	const image = watch("image");
	const seoTitle = watch("seo.title");
	const seoDescription = watch("seo.description");
	const seoOgImage = watch("seo.ogImage");

	const handleNameBlur = () => {
		if (!slug && name) {
			setValue("slug", generateSlug(name), { shouldDirty: true });
		}
	};

	const onFormSubmit = async (data: TechnologyGroupFormInternal) => {
		if (!data.slug && data.name) {
			data.slug = generateSlug(data.name);
		}
		const submitData: TechnologyGroupFormData = {
			...data,
			heroBulletPoints: (data.heroBulletPoints || [])
				.map((item) => item.value.trim())
				.filter(Boolean),
		};
		await onSubmit(submitData);
	};

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className={cn("space-y-6", className)}
		>
			{/* Name */}
			<div className="space-y-2">
				<Label htmlFor="name">
					Group Name <span className="text-red-500">*</span>
				</Label>
				<Input
					id="name"
					{...register("name", { required: "Name is required" })}
					onBlur={handleNameBlur}
					placeholder="e.g. Alexandrit & Nd:YAG, IPL..."
					disabled={isLoading}
					className={errors.name ? "border-red-500" : ""}
				/>
				{errors.name && (
					<p className="text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>

			{/* Slug */}
			<div className="space-y-2">
				<Label htmlFor="slug">Slug</Label>
				<Input
					id="slug"
					{...register("slug")}
					placeholder="group-slug"
					disabled={isLoading}
				/>
				<p className="text-xs text-slate-500">
					URL-friendly identifier. Auto-generated from name if left empty.
				</p>
			</div>

			{/* Order */}
			<div className="space-y-2">
				<Label htmlFor="order">Display Order</Label>
				<Input
					id="order"
					type="number"
					min={0}
					{...register("order", optionalNumberField)}
					placeholder="0"
					disabled={isLoading}
					className="w-32"
				/>
				<p className="text-xs text-slate-500">
					Lower numbers appear first.
				</p>
			</div>

			{/* Active */}
			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					id="isActive"
					{...register("isActive")}
					disabled={isLoading}
					className="h-4 w-4"
				/>
				<Label htmlFor="isActive" className="cursor-pointer">
					Active
				</Label>
				<p className="text-xs text-slate-500">
					Inactive groups are hidden from the /produkter sidebar
				</p>
			</div>

			{/* Description */}
			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<TextEditor
					name="description"
					defaultValue={description || ""}
					onChange={(value) =>
						setValue("description", value, { shouldDirty: true })
					}
					placeholder="Enter description (shown on /produkter when this group is selected)"
					variant="detailedAdvance"
					height="400px"
					disable={isLoading}
				/>
				<p className="text-xs text-slate-500">
					Rich content shown on /produkter when this technology is selected.
				</p>
			</div>

			{/* Image */}
			<ImagePickerWithDimensions
				label="Group Image"
				hint="Recommended: 800×800px • Ratio: 1:1 • Max: 5MB • Format: JPG, PNG, WebP"
				value={watch("image") || null}
				onChange={(url) => setValue("image", url || "", { shouldDirty: true })}
				placeholder="Select group image"
				galleryTitle="Select Technology Group Image"
				disabled={isLoading}
				widthInputProps={register("imageWidth", optionalNumberField)}
				heightInputProps={register("imageHeight", optionalNumberField)}
			/>

			<Separator className="my-8" />

			{/* Hero Section */}
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">Hero Section</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Customize the hero shown on /produkter when this technology is selected. Leave empty to use the global defaults.
					</p>
				</div>

				{/* Hero Title */}
				<div className="space-y-2">
					<Label htmlFor="heroTitle">Hero Title</Label>
					<Input
						id="heroTitle"
						{...register("heroTitle")}
						placeholder={watch("name") || "e.g. Pico & Q-Switched"}
						disabled={isLoading}
					/>
					<p className="text-xs text-slate-500">
						If empty, the group name is used as the title.
					</p>
				</div>

				{/* Hero Subtitle */}
				<div className="space-y-2">
					<Label htmlFor="heroSubtitle">Hero Subtitle</Label>
					<Input
						id="heroSubtitle"
						{...register("heroSubtitle")}
						placeholder="e.g. Avancerad laserplattform för professionella behandlingar"
						disabled={isLoading}
					/>
				</div>

				{/* Hero Bullet Points */}
				<div className="space-y-2">
					<Label>Hero Bullet Points</Label>
					<p className="text-xs text-slate-500">
						Up to 6 bullet points shown in the hero area.
					</p>
					<div className="space-y-2">
						{bulletFields.map((field, index) => (
							<div key={field.id} className="flex items-center gap-2">
								<Input
									{...register(`heroBulletPoints.${index}.value`)}
									placeholder={`Bullet point ${index + 1}`}
									disabled={isLoading}
									className="flex-1"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeBullet(index)}
									disabled={isLoading}
									className="text-red-500 h-8 w-8 shrink-0"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
						{bulletFields.length < 6 && (
							<Button
								type="button"
								variant="outline"
								onClick={() => appendBullet({ value: "" })}
								disabled={isLoading}
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Bullet Point
							</Button>
						)}
					</div>
				</div>

				{/* Hero Background Mobile */}
				<ImagePickerWithDimensions
					label="Hero Background — Mobile"
					hint="Mobile: 768×1024px • Ratio: 3:4 • Max: 15MB • Format: JPG, PNG, WebP"
					value={watch("heroBgMobile") || null}
					onChange={(url) => setValue("heroBgMobile", url || "", { shouldDirty: true })}
					placeholder="Select mobile background"
					galleryTitle="Select Mobile Hero Background"
					disabled={isLoading}
					widthInputProps={register("heroBgMobileWidth", optionalNumberField)}
					heightInputProps={register("heroBgMobileHeight", optionalNumberField)}
				/>

				{/* Hero Background Desktop */}
				<ImagePickerWithDimensions
					label="Hero Background — Desktop"
					hint="Desktop: 1920×800px • Ratio: 21:9 • Max: 15MB • Format: JPG, PNG, WebP"
					value={watch("heroBgDesktop") || null}
					onChange={(url) => setValue("heroBgDesktop", url || "", { shouldDirty: true })}
					placeholder="Select desktop background"
					galleryTitle="Select Desktop Hero Background"
					disabled={isLoading}
					widthInputProps={register("heroBgDesktopWidth", optionalNumberField)}
					heightInputProps={register("heroBgDesktopHeight", optionalNumberField)}
				/>
			</div>

			<Separator className="my-8" />

			{/* Inquiry Form Background */}
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">Inquiry Form Background</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Background images for the inquiry form section on /produkter when this technology is selected. Leave empty to use the global defaults (set under Settings → Branding).
					</p>
				</div>

				<ImagePickerWithDimensions
					label="Inquiry Background — Mobile"
					hint="Mobile: 768×1024px • Ratio: 3:4 • Max: 15MB • Format: JPG, PNG, WebP"
					value={watch("inquiryBgMobile") || null}
					onChange={(url) => setValue("inquiryBgMobile", url || "", { shouldDirty: true })}
					placeholder="Select mobile inquiry background"
					galleryTitle="Select Mobile Inquiry Background"
					disabled={isLoading}
					widthInputProps={register("inquiryBgMobileWidth", optionalNumberField)}
					heightInputProps={register("inquiryBgMobileHeight", optionalNumberField)}
				/>

				<ImagePickerWithDimensions
					label="Inquiry Background — Desktop"
					hint="Desktop: 1920×800px • Ratio: 21:9 • Max: 15MB • Format: JPG, PNG, WebP"
					value={watch("inquiryBgDesktop") || null}
					onChange={(url) => setValue("inquiryBgDesktop", url || "", { shouldDirty: true })}
					placeholder="Select desktop inquiry background"
					galleryTitle="Select Desktop Inquiry Background"
					disabled={isLoading}
					widthInputProps={register("inquiryBgDesktopWidth", optionalNumberField)}
					heightInputProps={register("inquiryBgDesktopHeight", optionalNumberField)}
				/>
			</div>

			<Separator className="my-8" />

			{/* Technology FAQ Section */}
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">Technology FAQ</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Add frequently asked questions for this technology. Shown on
						/produkter when this technology is selected via the sidebar.
						Leave empty to use the default fallback FAQ.
					</p>
				</div>

				{/* FAQ Section Title */}
				<div className="space-y-2">
					<Label htmlFor="faqTitle">FAQ Section Title</Label>
					<Input
						id="faqTitle"
						{...register("faqTitle")}
						placeholder={`e.g. Vanliga frågor om ${
							watch("name") || "denna teknologi"
						}`}
						disabled={isLoading}
					/>
					<p className="text-xs text-slate-500">
						Optional. If left empty, an auto-generated title will be used.
					</p>
				</div>

				{/* FAQ Items */}
				<div className="space-y-4">
					{faqFields.map((field, index) => (
						<div
							key={field.id}
							className="p-4 border rounded-lg space-y-3 bg-slate-50/50"
						>
							<div className="flex justify-between items-start">
								<span className="text-sm font-medium">
									FAQ #{index + 1}
								</span>
								<div className="flex items-center gap-2">
									<label className="flex items-center gap-2 text-sm">
										<input
											type="checkbox"
											{...register(`faqs.${index}.visible`)}
											disabled={isLoading}
											className="h-4 w-4"
										/>
										Visible
									</label>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeFaq(index)}
										disabled={isLoading}
										className="text-red-500 h-8 w-8"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`faqs.${index}.question`}>
									Question
								</Label>
								<Input
									{...register(`faqs.${index}.question`)}
									placeholder="Enter the question"
									disabled={isLoading}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`faqs.${index}.answer`}>
									Answer (HTML allowed)
								</Label>
								<Textarea
									id={`faqs.${index}.answer`}
									{...register(`faqs.${index}.answer`)}
									placeholder="Svar på frågan. Plain text eller HTML (t.ex. <p>...</p>, <strong>...</strong>, <a href='...'>...</a>)."
									rows={5}
									disabled={isLoading}
								/>
							</div>
						</div>
					))}
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							appendFaq({
								question: "",
								answer: "",
								visible: true,
							})
						}
						disabled={isLoading}
					>
						<Plus className="h-4 w-4 mr-1" />
						Add FAQ
					</Button>
				</div>
			</div>

			<Separator className="my-8" />

			{/* SEO Section */}
			<div className="space-y-6">
				<h3 className="text-lg font-semibold">SEO Settings</h3>
				<p className="text-sm text-muted-foreground">
					Optimize how this technology group appears in search engines and
					social media.
				</p>

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Search Engine Optimization
								</CardTitle>
								<CardDescription>
									Configure meta tags for better search visibility
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="seo.title">SEO Title</Label>
									<Input
										id="seo.title"
										{...register("seo.title")}
										placeholder="SEO title (recommended 50-60 characters)"
										disabled={isLoading}
										maxLength={70}
									/>
									<CharacterCount
										value={seoTitle || ""}
										min={30}
										max={70}
										optimal={{ min: 50, max: 60 }}
										label="Title length"
									/>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label htmlFor="seo.description">Meta Description</Label>
									<Textarea
										id="seo.description"
										{...register("seo.description")}
										placeholder="SEO description (recommended 120-160 characters)"
										disabled={isLoading}
										rows={3}
										maxLength={200}
									/>
									<CharacterCount
										value={seoDescription || ""}
										min={80}
										max={200}
										optimal={{ min: 120, max: 160 }}
										label="Description length"
									/>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label>Open Graph Image</Label>
									<p className="text-sm text-muted-foreground">
										Image shown when sharing on social media (recommended 1200x630px)
									</p>
									<MediaPicker
										type="image"
										value={seoOgImage || null}
										onChange={(url) =>
											setValue("seo.ogImage", url || "", { shouldDirty: true })
										}
										placeholder="Select OG image"
										disabled={isLoading}
										galleryTitle="Select Open Graph Image"
									/>
								</div>

								<Separator />

								<div className="flex items-center gap-3">
									<input
										type="checkbox"
										id="seo.noindex"
										{...register("seo.noindex")}
										disabled={isLoading}
										className="h-4 w-4"
									/>
									<Label htmlFor="seo.noindex" className="cursor-pointer">
										No Index
									</Label>
									<p className="text-xs text-slate-500">
										Prevent search engines from indexing this group
									</p>
								</div>
							</CardContent>
						</Card>

						<SeoAnalysis
							data={{
								title: seoTitle || "",
								description: seoDescription || "",
								slug: slug || "",
								productTitle: name || "",
								hasOgImage: !!seoOgImage,
							}}
						/>
					</div>

					<div>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Preview</CardTitle>
								<CardDescription>
									See how this group will appear in search and social media
								</CardDescription>
							</CardHeader>
							<CardContent>
								<SeoPreview
									data={{
										title: seoTitle || "",
										description: seoDescription || "",
										slug: slug || "",
										ogImage: seoOgImage || image || null,
										siteUrl: "synos.se",
										siteName: "Synos",
										productTitle: name || "",
									}}
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-3 pt-4 border-t">
				{onCancel && (
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
					>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={isLoading || (!isDirty && isEditing)}>
					{isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
					{isEditing ? "Update Group" : "Create Group"}
				</Button>
			</div>
		</form>
	);
}
