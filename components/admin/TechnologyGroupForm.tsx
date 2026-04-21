"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
import { MediaPicker } from "@/components/storage";
import { SeoPreview, SeoAnalysis, CharacterCount } from "./seo";
import TextEditor from "@/components/common/TextEditor";
import { generateSlug } from "@/lib/utils/product-helpers";

export interface TechnologyGroupFormData {
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	order?: number;
	isActive?: boolean;
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
	order?: number;
	isActive?: boolean;
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
		formState: { errors, isDirty },
	} = useForm<TechnologyGroupFormData>({
		defaultValues: {
			name: group?.name || "",
			slug: group?.slug || "",
			description: group?.description || "",
			image: group?.image || "",
			order: group?.order ?? 0,
			isActive: group?.isActive ?? true,
			seo: {
				title: group?.seo?.title || "",
				description: group?.seo?.description || "",
				ogImage: group?.seo?.ogImage || "",
				noindex: group?.seo?.noindex || false,
			},
		},
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

	const onFormSubmit = async (data: TechnologyGroupFormData) => {
		if (!data.slug && data.name) {
			data.slug = generateSlug(data.name);
		}
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
					{...register("order", { valueAsNumber: true })}
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
			<div className="space-y-2">
				<Label>Group Image</Label>
				<p className="text-xs text-slate-500">
					Shown in the hero area on /produkter when this technology is selected.
				</p>
				<MediaPicker
					type="image"
					value={watch("image") || null}
					onChange={(url) =>
						setValue("image", url || "", { shouldDirty: true })
					}
					placeholder="Select group image"
					disabled={isLoading}
					galleryTitle="Select Technology Group Image"
				/>
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
