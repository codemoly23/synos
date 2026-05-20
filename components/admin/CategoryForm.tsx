"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
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
import { TreeSelect } from "./TreeSelect";
import { MediaPicker } from "@/components/storage";
import { SeoPreview, SeoAnalysis, CharacterCount } from "./seo";
import TextEditor from "@/components/common/TextEditor";
import {
	createCategorySchema,
	updateCategorySchema,
} from "@/lib/validations/category.validation";
import { generateSlug } from "@/lib/utils/product-helpers";
import type { ICategory, ICategoryTreeNode } from "@/models/category.model";

/**
 * Form data type that works for both create and update
 */
type CategoryFormData = {
	name?: string;
	slug?: string;
	description?: string;
	parent?: string | null;
	image?: string | null;
	order?: number;
	faqTitle?: string;
	faqs?: Array<{
		_id?: string;
		question: string;
		answer: string;
		visible: boolean;
	}>;
	inquiryBgMobile?: string;
	inquiryBgDesktop?: string;
	heroTitle?: string;
	heroSubtitle?: string;
	heroBulletPoints?: string[];
	heroBgMobile?: string;
	heroBgDesktop?: string;
	seo?: {
		title?: string;
		description?: string;
		ogImage?: string | null;
		noindex?: boolean;
	};
};

interface CategoryFormProps {
	category?: ICategory | null;
	categoryTree: ICategoryTreeNode[];
	onSubmit: (data: CategoryFormData) => Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * CategoryForm Component
 * Form for creating and editing categories
 */
export function CategoryForm({
	category,
	categoryTree,
	onSubmit,
	onCancel,
	isLoading = false,
	className,
}: CategoryFormProps) {
	const isEditing = !!category;

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		control,
		formState: { errors, isDirty },
	} = useForm<CategoryFormData>({
		resolver: zodResolver(
			isEditing ? updateCategorySchema : createCategorySchema
		) as never,
		defaultValues: {
			name: category?.name || "",
			slug: category?.slug || "",
			description: category?.description || "",
			parent: category?.parent?.toString() || null,
			image: category?.image || "",
			order: category?.order ?? 0,
			faqTitle: category?.faqTitle || "",
			faqs:
				category?.faqs?.map((faq) => ({
					_id: faq._id?.toString(),
					question: faq.question,
					answer: faq.answer,
					visible: faq.visible ?? true,
				})) || [],
			inquiryBgMobile: (category as unknown as { inquiryBgMobile?: string })?.inquiryBgMobile || "",
			inquiryBgDesktop: (category as unknown as { inquiryBgDesktop?: string })?.inquiryBgDesktop || "",
			heroTitle: (category as unknown as { heroTitle?: string })?.heroTitle || "",
			heroSubtitle: (category as unknown as { heroSubtitle?: string })?.heroSubtitle || "",
			heroBulletPoints: (category as unknown as { heroBulletPoints?: string[] })?.heroBulletPoints || [],
			heroBgMobile: (category as unknown as { heroBgMobile?: string })?.heroBgMobile || "",
			heroBgDesktop: (category as unknown as { heroBgDesktop?: string })?.heroBgDesktop || "",
			seo: {
				title: category?.seo?.title || "",
				description: category?.seo?.description || "",
				ogImage: category?.seo?.ogImage || "",
				noindex: category?.seo?.noindex || false,
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
		name: "heroBulletPoints" as never,
	});

	const name = watch("name");
	const slug = watch("slug");
	const parent = watch("parent");
	const description = watch("description");
	const image = watch("image");
	const seoTitle = watch("seo.title");
	const seoDescription = watch("seo.description");
	const seoOgImage = watch("seo.ogImage");

	// Auto-generate slug from name
	const handleNameBlur = () => {
		if (!slug && name) {
			setValue("slug", generateSlug(name), { shouldDirty: true });
		}
	};

	// Handle parent selection
	const handleParentChange = (selected: string[]) => {
		setValue("parent", selected[0] || null, { shouldDirty: true });
	};

	const onFormSubmit = async (data: CategoryFormData) => {
		await onSubmit(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className={cn("space-y-6", className)}
		>
			{/* Name */}
			<div className="space-y-2">
				<Label htmlFor="name">
					Category Name <span className="text-red-500">*</span>
				</Label>
				<Input
					id="name"
					{...register("name")}
					onBlur={handleNameBlur}
					placeholder="Enter category name"
					disabled={isLoading}
					className={errors.name ? "border-red-500" : ""}
				/>
				{errors.name && (
					<p className="text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>

			{/* Slug */}
			<div className="space-y-2">
				<Label htmlFor="slug">
					Slug <span className="text-red-500">*</span>
				</Label>
				<Input
					id="slug"
					{...register("slug")}
					placeholder="category-slug"
					disabled={isLoading}
					className={errors.slug ? "border-red-500" : ""}
				/>
				<p className="text-xs text-slate-500">
					URL-friendly identifier. Auto-generated from name if left empty.
				</p>
				{errors.slug && (
					<p className="text-sm text-red-500">{errors.slug.message}</p>
				)}
			</div>

			{/* Order */}
			<div className="space-y-2">
				<Label htmlFor="order">Display Order</Label>
				<Input
					id="order"
					type="number"
					min={0}
					{...register("order")}
					placeholder="0"
					disabled={isLoading}
					className={cn("w-32", errors.order ? "border-red-500" : "")}
				/>
				<p className="text-xs text-slate-500">
					Lower numbers appear first. Categories with the same order are
					sorted by creation date.
				</p>
				{errors.order && (
					<p className="text-sm text-red-500">{errors.order.message}</p>
				)}
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
					placeholder="Enter category description (supports rich text, images, etc.)"
					variant="detailedAdvance"
					height="400px"
					disable={isLoading}
				/>
				<p className="text-xs text-slate-500">
					Rich content that will be displayed on the category page after the
					products list.
				</p>
				{errors.description && (
					<p className="text-sm text-red-500">{errors.description.message}</p>
				)}
			</div>

			{/* Parent Category */}
			<div className="space-y-2">
				<Label>Parent Category</Label>
				<TreeSelect
					value={parent ? [parent] : []}
					onChange={handleParentChange}
					tree={categoryTree}
					placeholder="Select parent category (optional)"
					multiple={false}
					disabled={isLoading}
					excludeId={category?._id?.toString()}
				/>
				<p className="text-xs text-slate-500">
					Leave empty for a root-level category
				</p>
			</div>

			{/* ── HERO SECTION ── */}
			<div className="space-y-6 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
				<div>
					<h3 className="text-sm font-semibold text-slate-700">Hero Section</h3>
					<p className="text-xs text-slate-500 mt-1">
						Controls the category hero section. Falls back to the built-in config if not set.
					</p>
				</div>

				{/* Hero Title */}
				<div className="space-y-2">
					<Label htmlFor="heroTitle">Hero Title</Label>
					<Input
						id="heroTitle"
						{...register("heroTitle")}
						placeholder="e.g. Tatueringsborttagning"
						disabled={isLoading}
						maxLength={200}
					/>
				</div>

				{/* Hero Subtitle */}
				<div className="space-y-2">
					<Label htmlFor="heroSubtitle">Hero Subtitle</Label>
					<Input
						id="heroSubtitle"
						{...register("heroSubtitle")}
						placeholder="e.g. Precis och effektiv borttagning av tatueringar med Pico-teknik"
						disabled={isLoading}
						maxLength={300}
					/>
				</div>

				{/* Hero Bullet Points */}
				<div className="space-y-2">
					<Label>Hero Bullet Points <span className="text-muted-foreground font-normal">(max 6)</span></Label>
					<div className="space-y-2">
						{bulletFields.map((field, index) => (
							<div key={field.id} className="flex gap-2">
								<Input
									{...register(`heroBulletPoints.${index}` as const)}
									placeholder="e.g. Effektiv på alla färger och hudtyper"
									disabled={isLoading}
									maxLength={100}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeBullet(index)}
									disabled={isLoading}
									className="text-red-500"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
						{bulletFields.length < 6 && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendBullet("")}
								disabled={isLoading}
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Bullet Point
							</Button>
						)}
					</div>
				</div>

				{/* Hero Background — Mobile */}
				<div className="space-y-2">
					<Label>Hero Background — Mobile</Label>
					<p className="text-xs text-slate-500">Falls back to the default if not set.</p>
					<MediaPicker
						type="image"
						value={watch("heroBgMobile") || null}
						onChange={(url) => setValue("heroBgMobile", url || "", { shouldDirty: true })}
						placeholder="Select mobile hero background"
						disabled={isLoading}
						galleryTitle="Select Mobile Hero Background"
					/>
				</div>

				{/* Hero Background — Desktop */}
				<div className="space-y-2">
					<Label>Hero Background — Desktop</Label>
					<p className="text-xs text-slate-500">Falls back to the default if not set.</p>
					<MediaPicker
						type="image"
						value={watch("heroBgDesktop") || null}
						onChange={(url) => setValue("heroBgDesktop", url || "", { shouldDirty: true })}
						placeholder="Select desktop hero background"
						disabled={isLoading}
						galleryTitle="Select Desktop Hero Background"
					/>
				</div>
			</div>

			<Separator className="my-8" />

			{/* Category Image */}
			<div className="space-y-2">
				<Label>Category Image</Label>
				<p className="text-xs text-slate-500">
					Select an image from the media library or upload a new one.
				</p>
				<MediaPicker
					type="image"
					value={watch("image") || null}
					onChange={(url) =>
						setValue("image", url || "", { shouldDirty: true })
					}
					placeholder="Select category image"
					disabled={isLoading}
					galleryTitle="Select Category Image"
				/>
				{errors.image && (
					<p className="text-sm text-red-500">{errors.image.message}</p>
				)}
			</div>

			<Separator className="my-8" />

			{/* FAQ Section */}
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">Category FAQ</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Add frequently asked questions for this category. Shown at the
						bottom of the category page. Leave empty to use the default
						fallback FAQ.
					</p>
				</div>

				{/* FAQ Section Title */}
				<div className="space-y-2">
					<Label htmlFor="faqTitle">FAQ Section Title</Label>
					<Input
						id="faqTitle"
						{...register("faqTitle")}
						placeholder={`e.g. Vanliga frågor om ${
							watch("name")?.toLowerCase() || "kategori"
						}`}
						disabled={isLoading}
					/>
					<p className="text-xs text-slate-500">
						Optional. If left empty, an auto-generated title will be used
						on the category page.
					</p>
					{errors.faqTitle && (
						<p className="text-sm text-red-500">
							{errors.faqTitle.message}
						</p>
					)}
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
								{errors.faqs?.[index]?.question && (
									<p className="text-sm text-red-500">
										{errors.faqs[index]?.question?.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label>Answer</Label>
								<TextEditor
									name={`faqs.${index}.answer`}
									defaultValue={watch(`faqs.${index}.answer`) || ""}
									onChange={(val) =>
										setValue(`faqs.${index}.answer`, val, {
											shouldDirty: true,
										})
									}
									placeholder="Enter the answer (supports rich text)"
									variant="detailedSimple"
									height="150px"
									disable={isLoading}
								/>
								{errors.faqs?.[index]?.answer && (
									<p className="text-sm text-red-500">
										{errors.faqs[index]?.answer?.message}
									</p>
								)}
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

			{/* Contact Section Background — Mobile */}
			<div className="space-y-2">
				<Label>Contact Section Background — Mobile</Label>
				<p className="text-xs text-slate-500">
					Background image shown in the contact/form section on mobile devices.
					Falls back to the default dark background if not set.
				</p>
				<MediaPicker
					type="image"
					value={watch("inquiryBgMobile") || null}
					onChange={(url) =>
						setValue("inquiryBgMobile", url || "", { shouldDirty: true })
					}
					placeholder="Select mobile contact background"
					disabled={isLoading}
					galleryTitle="Select Mobile Contact Background"
				/>
			</div>

			<Separator className="my-8" />

			{/* Contact Section Background — Desktop */}
			<div className="space-y-2">
				<Label>Contact Section Background — Desktop</Label>
				<p className="text-xs text-slate-500">
					Background image shown in the contact/form section on desktop.
					Falls back to the default dark background if not set.
				</p>
				<MediaPicker
					type="image"
					value={watch("inquiryBgDesktop") || null}
					onChange={(url) =>
						setValue("inquiryBgDesktop", url || "", { shouldDirty: true })
					}
					placeholder="Select desktop contact background"
					disabled={isLoading}
					galleryTitle="Select Desktop Contact Background"
				/>
			</div>

			<Separator className="my-8" />

			{/* SEO Section */}
			<div className="space-y-6">
				<h3 className="text-lg font-semibold">SEO Settings</h3>
				<p className="text-sm text-muted-foreground">
					Optimize how this category appears in search engines and social
					media.
				</p>

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					{/* Left Column - SEO Settings */}
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
								{/* SEO Title */}
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

								{/* SEO Description */}
								<div className="space-y-2">
									<Label htmlFor="seo.description">
										Meta Description
									</Label>
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

								{/* OG Image */}
								<div className="space-y-2">
									<Label>Open Graph Image</Label>
									<p className="text-sm text-muted-foreground">
										Image shown when sharing on social media
										(recommended 1200x630px)
									</p>
									<MediaPicker
										type="image"
										value={seoOgImage || null}
										onChange={(url) =>
											setValue("seo.ogImage", url || "", {
												shouldDirty: true,
											})
										}
										placeholder="Select OG image"
										disabled={isLoading}
										galleryTitle="Select Open Graph Image"
									/>
								</div>

								<Separator />

								{/* Noindex */}
								<div className="flex items-center gap-3">
									<input
										type="checkbox"
										id="seo.noindex"
										{...register("seo.noindex")}
										disabled={isLoading}
										className="h-4 w-4"
									/>
									<Label
										htmlFor="seo.noindex"
										className="cursor-pointer"
									>
										No Index
									</Label>
									<p className="text-xs text-slate-500">
										Prevent search engines from indexing this
										category
									</p>
								</div>
							</CardContent>
						</Card>

						{/* SEO Analysis */}
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

					{/* Right Column - Preview */}
					<div>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Preview</CardTitle>
								<CardDescription>
									See how your category will appear in search results
									and social media
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
					{isEditing ? "Update Category" : "Create Category"}
				</Button>
			</div>
		</form>
	);
}
