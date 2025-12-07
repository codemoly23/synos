"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Loader2,
	Plus,
	Trash2,
	AlertCircle,
	AlertTriangle,
	Save,
	Send,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagInput } from "./TagInput";
import { TreeSelect } from "./TreeSelect";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUrlList } from "./ImageUrlList";
import {
	createProductDraftSchema,
	updateProductSchema,
	type CreateProductDraftInput,
	type UpdateProductInput,
} from "@/lib/validations/product.validation";
import { generateSlug } from "@/lib/utils/product-helpers";
import type { IProduct } from "@/models/product.model";
import type { ICategoryTreeNode } from "@/models/category.model";
import type { PublishValidationError } from "@/lib/services/product.service";
import TextEditor from "../common/TextEditor";

/**
 * Form data type that works for both create and update
 */
type ProductFormData = Record<string, unknown>;

interface ProductFormProps {
	product?: IProduct | null;
	categoryTree: ICategoryTreeNode[];
	treatmentSuggestions?: string[];
	certificationSuggestions?: string[];
	onSaveDraft: (data: ProductFormData) => Promise<void>;
	onPublish?: (id: string) => Promise<{ warnings: PublishValidationError[] }>;
	onValidate?: (id: string) => Promise<{
		canPublish: boolean;
		errors: PublishValidationError[];
		warnings: PublishValidationError[];
	}>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * ProductForm Component
 * Comprehensive form for creating and editing products
 */
export function ProductForm({
	product,
	categoryTree,
	treatmentSuggestions = [],
	certificationSuggestions = [],
	onSaveDraft,
	onPublish,
	onValidate,
	onCancel,
	isLoading = false,
	className,
}: ProductFormProps) {
	const isEditing = !!product;
	const [validationResults, setValidationResults] = React.useState<{
		errors: PublishValidationError[];
		warnings: PublishValidationError[];
	} | null>(null);
	const [isSaving, setIsSaving] = React.useState(false);
	const [isPublishing, setIsPublishing] = React.useState(false);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<CreateProductDraftInput | UpdateProductInput>({
		resolver: zodResolver(
			isEditing ? updateProductSchema : createProductDraftSchema
		),
		defaultValues: {
			title: product?.title || "",
			slug: product?.slug || "",
			description: product?.description || "",
			shortDescription: product?.shortDescription || "",
			productDescription: product?.productDescription || "",
			benefits: product?.benefits || [],
			certifications: product?.certifications || [],
			treatments: product?.treatments || [],
			productImages: product?.productImages || [],
			overviewImage: product?.overviewImage || "",
			techSpecifications:
				product?.techSpecifications?.map((t) => ({
					title: t.title,
					description: t.description,
				})) || [],
			documentation:
				product?.documentation?.map((d) => ({
					title: d.title,
					url: d.url,
				})) || [],
			purchaseInfo: {
				title: product?.purchaseInfo?.title || "",
				description: product?.purchaseInfo?.description || "",
			},
			seo: {
				title: product?.seo?.title || "",
				description: product?.seo?.description || "",
				ogImage: product?.seo?.ogImage || "",
				canonicalUrl: product?.seo?.canonicalUrl || "",
				noindex: product?.seo?.noindex || false,
			},
			categories: product?.categories?.map((c) => c?._id?.toString()) || [],
			qa:
				product?.qa?.map((q) => ({
					question: q.question,
					answer: q.answer,
					visible: q.visible,
				})) || [],
			youtubeUrl: product?.youtubeUrl || "",
			rubric: product?.rubric || "",
			publishType: product?.publishType || "draft",
			visibility: product?.visibility || "public",
		},
	});

	// Field arrays for dynamic lists
	const {
		fields: techSpecFields,
		append: appendTechSpec,
		remove: removeTechSpec,
	} = useFieldArray({
		control,
		name: "techSpecifications",
	});

	const {
		fields: docFields,
		append: appendDoc,
		remove: removeDoc,
	} = useFieldArray({
		control,
		name: "documentation",
	});

	const {
		fields: qaFields,
		append: appendQa,
		remove: removeQa,
	} = useFieldArray({
		control,
		name: "qa",
	});

	const {
		fields: benefitFields,
		append: appendBenefit,
		remove: removeBenefit,
	} = useFieldArray({
		control,
		name: "benefits" as never,
	});

	const title = watch("title");
	const slug = watch("slug");

	// Auto-generate slug from title
	const handleTitleBlur = () => {
		if (!slug && title) {
			setValue("slug", generateSlug(title), { shouldDirty: true });
		}
	};

	// Handle save draft
	const handleSaveDraft = async (
		data: CreateProductDraftInput | UpdateProductInput
	) => {
		setIsSaving(true);
		try {
			await onSaveDraft(data);
		} finally {
			setIsSaving(false);
		}
	};

	// Handle validate
	const handleValidate = async () => {
		if (!product?._id || !onValidate) return;
		const results = await onValidate(product._id.toString());
		setValidationResults({
			errors: results.errors,
			warnings: results.warnings,
		});
	};

	// Handle publish
	const handlePublish = async () => {
		if (!product?._id || !onPublish) return;
		setIsPublishing(true);
		try {
			const result = await onPublish(product._id.toString());
			setValidationResults({
				errors: [],
				warnings: result.warnings,
			});
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<div className={cn("space-y-6", className)}>
			{/* Validation Results Banner */}
			{validationResults &&
				(validationResults.errors.length > 0 ||
					validationResults.warnings.length > 0) && (
					<Card
						className={
							validationResults.errors.length > 0
								? "border-red-300"
								: "border-yellow-300"
						}
					>
						<CardContent className="pt-4">
							{validationResults.errors.length > 0 && (
								<div className="mb-4">
									<div className="flex items-center gap-2 text-red-600 mb-2">
										<AlertCircle className="h-5 w-5" />
										<span className="font-medium">
											Errors ({validationResults.errors.length})
										</span>
									</div>
									<ul className="list-disc list-inside space-y-1 text-sm text-red-600">
										{validationResults.errors.map((error, i) => (
											<li key={i}>
												<strong>{error.field}:</strong>{" "}
												{error.message}
											</li>
										))}
									</ul>
								</div>
							)}
							{validationResults.warnings.length > 0 && (
								<div>
									<div className="flex items-center gap-2 text-yellow-600 mb-2">
										<AlertTriangle className="h-5 w-5" />
										<span className="font-medium">
											Warnings ({validationResults.warnings.length})
										</span>
									</div>
									<ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
										{validationResults.warnings.map((warning, i) => (
											<li key={i}>
												<strong>{warning.field}:</strong>{" "}
												{warning.message}
											</li>
										))}
									</ul>
								</div>
							)}
						</CardContent>
					</Card>
				)}

			<form onSubmit={handleSubmit(handleSaveDraft)}>
				<Tabs defaultValue="basic" className="space-y-6">
					<TabsList className="grid grid-cols-6 w-full">
						<TabsTrigger value="basic">Basic</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="media">Media</TabsTrigger>
						<TabsTrigger value="specs">Specs & Docs</TabsTrigger>
						<TabsTrigger value="qna">Q&A</TabsTrigger>
						<TabsTrigger value="seo">SEO</TabsTrigger>
					</TabsList>

					{/* Basic Info Tab */}
					<TabsContent value="basic">
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
								<CardDescription>
									Essential product details
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Title */}
								<div className="space-y-2">
									<Label htmlFor="title">
										Product Title{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="title"
										{...register("title")}
										onBlur={handleTitleBlur}
										placeholder="Enter product title"
										disabled={isLoading}
										className={errors.title ? "border-red-500" : ""}
									/>
									{errors.title && (
										<p className="text-sm text-red-500">
											{errors.title.message}
										</p>
									)}
								</div>

								{/* Slug */}
								<div className="space-y-2">
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										{...register("slug")}
										placeholder="product-slug"
										disabled={isLoading}
										className={errors.slug ? "border-red-500" : ""}
									/>
									<p className="text-xs text-slate-500">
										URL-friendly identifier. Auto-generated from
										title.
									</p>
									{errors.slug && (
										<p className="text-sm text-red-500">
											{errors.slug.message}
										</p>
									)}
								</div>

								{/* Short Description */}
								<div className="space-y-2">
									<Label htmlFor="shortDescription">
										Short Description
									</Label>
									<Textarea
										id="shortDescription"
										{...register("shortDescription")}
										placeholder="Brief product summary (max 300 characters)"
										disabled={isLoading}
										rows={2}
									/>
								</div>

								{/* Categories */}
								<div className="space-y-2">
									<Label>Categories</Label>
									<TreeSelect
										value={watch("categories") || []}
										onChange={(cats) => {
											setValue("categories", cats, {
												shouldDirty: true,
											});
										}}
										tree={categoryTree}
										placeholder="Select categories"
										disabled={isLoading}
									/>
								</div>

								{/* Treatments / Tags */}
								<div className="space-y-2">
									<Label>Treatments / Tags</Label>
									<TagInput
										value={watch("treatments") || []}
										onChange={(tags) =>
											setValue("treatments", tags, {
												shouldDirty: true,
											})
										}
										suggestions={treatmentSuggestions}
										placeholder="Add treatment tags..."
										disabled={isLoading}
									/>
								</div>

								{/* Certifications */}
								<div className="space-y-2">
									<Label>Certifications</Label>
									<TagInput
										value={watch("certifications") || []}
										onChange={(tags) =>
											setValue("certifications", tags, {
												shouldDirty: true,
											})
										}
										suggestions={certificationSuggestions}
										placeholder="Add certifications..."
										disabled={isLoading}
									/>
								</div>

								{/* Visibility & Publish Type */}
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="publishType">
											Publish Status
										</Label>
										<select
											id="publishType"
											{...register("publishType")}
											disabled={isLoading}
											className="w-full h-11 px-4 rounded-md border border-slate-200 bg-white"
										>
											<option value="draft">Draft</option>
											<option value="publish">Published</option>
											<option value="private">Private</option>
										</select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="visibility">Visibility</Label>
										<select
											id="visibility"
											{...register("visibility")}
											disabled={isLoading}
											className="w-full h-11 px-4 rounded-md border border-slate-200 bg-white"
										>
											<option value="public">Public</option>
											<option value="hidden">Hidden</option>
										</select>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Content Tab */}
					<TabsContent value="content">
						<Card>
							<CardHeader>
								<CardTitle>Product Content</CardTitle>
								<CardDescription>
									Descriptions and benefits
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Main Description */}
								{/* <RichTextEditor
										value={watch("description") || ""}
										onChange={(val) =>
											setValue("description", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter main product description..."
										disabled={isLoading}
									/> */}
								{/* <div className="space-y-2">
									<Label>Short Description</Label>
									<TextEditor
										height="300px"
										defaultValue={watch("description") || ""}
										onChange={(val) =>
											setValue("description", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter main product description..."
										// disabled={isLoading}
									/>
								</div> */}

								{/* Product Description */}
								<div className="space-y-2">
									<Label>Extended Description</Label>
									{/* <RichTextEditor
										value={watch("productDescription") || ""}
										onChange={(val) =>
											setValue("productDescription", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter extended product description..."
										disabled={isLoading}
									/> */}
									<TextEditor
										height="500px"
										defaultValue={watch("productDescription") || ""}
										onChange={(val) =>
											setValue("productDescription", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter extended product description..."
										// disabled={isLoading}
										variant={"advanceFull"}
									/>
								</div>

								{/* Benefits */}
								<div className="space-y-2">
									<Label>Benefits</Label>
									<div className="space-y-2">
										{benefitFields.map((field, index) => (
											<div key={field.id} className="flex gap-2">
												<Input
													{...register(
														`benefits.${index}` as const
													)}
													placeholder="Enter benefit"
													disabled={isLoading}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeBenefit(index)}
													disabled={isLoading}
													className="text-red-500"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendBenefit("")}
											disabled={isLoading}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Benefit
										</Button>
									</div>
								</div>

								{/* Purchase Info */}
								<div className="space-y-4">
									<Label>Purchase Information</Label>
									<Input
										{...register("purchaseInfo.title")}
										placeholder="Purchase info title"
										disabled={isLoading}
									/>
									{/* <RichTextEditor
										value={watch("purchaseInfo.description") || ""}
										onChange={(val) =>
											setValue("purchaseInfo.description", val, {
												shouldDirty: true,
											})
										}
										placeholder="Purchase information details..."
										disabled={isLoading}
										minHeight="100px"
									/> */}
									<TextEditor
										height="200px"
										defaultValue={
											watch("purchaseInfo.description") || ""
										}
										onChange={(val) =>
											setValue("purchaseInfo.description", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter extended product description..."
										// disabled={isLoading}
										// variant={"advanceFull"}
									/>
								</div>

								{/* Rubric */}
								<div className="space-y-2">
									<Label htmlFor="rubric">Rubric / Notes</Label>
									<Textarea
										id="rubric"
										{...register("rubric")}
										placeholder="Internal notes or rubric"
										disabled={isLoading}
										rows={3}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Media Tab */}
					<TabsContent value="media">
						<Card>
							<CardHeader>
								<CardTitle>Media</CardTitle>
								<CardDescription>
									Product images and videos
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Product Images */}
								<div className="space-y-2">
									<Label>
										Product Images{" "}
										<span className="text-red-500">*</span>
									</Label>
									<ImageUrlList
										value={watch("productImages") || []}
										onChange={(urls) =>
											setValue("productImages", urls, {
												shouldDirty: true,
											})
										}
										placeholder="Enter product image URL..."
										disabled={isLoading}
									/>
								</div>

								{/* Overview Image */}
								<div className="space-y-2">
									<Label htmlFor="overviewImage">
										Overview Image URL
									</Label>
									<Input
										id="overviewImage"
										type="url"
										{...register("overviewImage")}
										placeholder="https://example.com/overview.jpg"
										disabled={isLoading}
									/>
								</div>

								{/* YouTube URL */}
								<div className="space-y-2">
									<Label htmlFor="youtubeUrl">YouTube Video URL</Label>
									<Input
										id="youtubeUrl"
										type="url"
										{...register("youtubeUrl")}
										placeholder="https://www.youtube.com/watch?v=..."
										disabled={isLoading}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Specs & Docs Tab */}
					<TabsContent value="specs">
						<div className="space-y-6">
							{/* Tech Specifications */}
							<Card>
								<CardHeader>
									<CardTitle>Technical Specifications</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{techSpecFields.map((field, index) => (
										<div
											key={field.id}
											className="p-4 border rounded-md space-y-3"
										>
											<div className="flex justify-between items-start">
												<span className="text-sm font-medium">
													Spec #{index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeTechSpec(index)}
													disabled={isLoading}
													className="text-red-500 h-8 w-8"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
											<Input
												{...register(
													`techSpecifications.${index}.title`
												)}
												placeholder="Specification title"
												disabled={isLoading}
											/>
											<Textarea
												{...register(
													`techSpecifications.${index}.description`
												)}
												placeholder="Specification description"
												disabled={isLoading}
												rows={2}
											/>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											appendTechSpec({ title: "", description: "" })
										}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add Specification
									</Button>
								</CardContent>
							</Card>

							{/* Documentation */}
							<Card>
								<CardHeader>
									<CardTitle>Documentation</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{docFields.map((field, index) => (
										<div
											key={field.id}
											className="flex gap-2 items-start"
										>
											<Input
												{...register(
													`documentation.${index}.title`
												)}
												placeholder="Document title"
												disabled={isLoading}
												className="flex-1"
											/>
											<Input
												{...register(`documentation.${index}.url`)}
												placeholder="Document URL"
												disabled={isLoading}
												className="flex-1"
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => removeDoc(index)}
												disabled={isLoading}
												className="text-red-500"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() => appendDoc({ title: "", url: "" })}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add Document
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Q&A Tab */}
					<TabsContent value="qna">
						<Card>
							<CardHeader>
								<CardTitle>Questions & Answers</CardTitle>
								<CardDescription>Product FAQ items</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{qaFields.map((field, index) => (
									<div
										key={field.id}
										className="p-4 border rounded-md space-y-3"
									>
										<div className="flex justify-between items-start">
											<span className="text-sm font-medium">
												Q&A #{index + 1}
											</span>
											<div className="flex items-center gap-2">
												<label className="flex items-center gap-2 text-sm">
													<input
														type="checkbox"
														{...register(`qa.${index}.visible`)}
														disabled={isLoading}
														className="h-4 w-4"
													/>
													Visible
												</label>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeQa(index)}
													disabled={isLoading}
													className="text-red-500 h-8 w-8"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
										<Input
											{...register(`qa.${index}.question`)}
											placeholder="Question"
											disabled={isLoading}
										/>
										<Textarea
											{...register(`qa.${index}.answer`)}
											placeholder="Answer"
											disabled={isLoading}
											rows={2}
										/>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										appendQa({
											question: "",
											answer: "",
											visible: true,
										})
									}
									disabled={isLoading}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add Q&A
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* SEO Tab */}
					<TabsContent value="seo">
						<Card>
							<CardHeader>
								<CardTitle>SEO Settings</CardTitle>
								<CardDescription>
									Search engine optimization
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* SEO Title */}
								<div className="space-y-2">
									<Label htmlFor="seo.title">
										SEO Title
										<span className="text-xs text-slate-500 ml-2">
											({(watch("seo.title") || "").length}/70)
										</span>
									</Label>
									<Input
										id="seo.title"
										{...register("seo.title")}
										placeholder="SEO title (recommended 50-60 characters)"
										disabled={isLoading}
										maxLength={70}
									/>
								</div>

								{/* SEO Description */}
								<div className="space-y-2">
									<Label htmlFor="seo.description">
										SEO Description
										<span className="text-xs text-slate-500 ml-2">
											({(watch("seo.description") || "").length}/160)
										</span>
									</Label>
									<Textarea
										id="seo.description"
										{...register("seo.description")}
										placeholder="SEO description (recommended 150-160 characters)"
										disabled={isLoading}
										rows={3}
										maxLength={160}
									/>
								</div>

								{/* OG Image */}
								<div className="space-y-2">
									<Label htmlFor="seo.ogImage">
										Open Graph Image URL
									</Label>
									<Input
										id="seo.ogImage"
										type="url"
										{...register("seo.ogImage")}
										placeholder="https://example.com/og-image.jpg"
										disabled={isLoading}
									/>
								</div>

								{/* Canonical URL */}
								<div className="space-y-2">
									<Label htmlFor="seo.canonicalUrl">
										Canonical URL
									</Label>
									<Input
										id="seo.canonicalUrl"
										type="url"
										{...register("seo.canonicalUrl")}
										placeholder="https://example.com/product"
										disabled={isLoading}
									/>
								</div>

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
										Prevent search engines from indexing this product
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Form Actions */}
				<div className="flex justify-between items-center pt-6 border-t mt-6">
					<div>
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
					</div>

					<div className="flex gap-3">
						{isEditing && onValidate && (
							<Button
								type="button"
								variant="outline"
								onClick={handleValidate}
								disabled={isLoading}
							>
								Validate
							</Button>
						)}

						<Button
							type="submit"
							variant="outline"
							disabled={isLoading || isSaving}
						>
							{isSaving && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							<Save className="h-4 w-4 mr-2" />
							Save Draft
						</Button>

						{isEditing && onPublish && (
							<Button
								type="button"
								onClick={handlePublish}
								disabled={isLoading || isPublishing}
							>
								{isPublishing && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								<Send className="h-4 w-4 mr-2" />
								Publish
							</Button>
						)}
					</div>
				</div>
			</form>
		</div>
	);
}
