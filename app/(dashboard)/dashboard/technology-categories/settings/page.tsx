"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	ArrowLeft,
	ExternalLink,
	Loader2,
	Plus,
	Trash2,
	GripVertical,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";

const faqItemSchema = z.object({
	_id: z.string().optional(),
	question: z.string().min(1, "Question is required").max(500),
	answer: z.string().min(1, "Answer is required").max(10000),
	visible: z.boolean().default(true),
	order: z.number().int().min(0).default(0),
});

const formSchema = z.object({
	faqSection: z.object({
		title: z.string().max(200).optional(),
		faqs: z.array(faqItemSchema),
	}),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	faqSection: {
		title: "",
		faqs: [],
	},
};

export default function TechnologyCategoriesSettingsPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [isLoading, setIsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);

	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const faqs = useFieldArray({
		control: form.control,
		name: "faqSection.faqs",
	});

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/technology-categories/settings");
		}
	}, [session, isPending, router]);

	// Fetch data
	React.useEffect(() => {
		if (!session) return;

		async function fetchData() {
			try {
				const res = await fetch("/api/produkter-page");
				if (res.ok) {
					const json = await res.json();
					const data = json?.data ?? json;
					form.reset({
						faqSection: {
							title: data?.faqSection?.title ?? "Vanliga frågor",
							faqs: Array.isArray(data?.faqSection?.faqs)
								? data.faqSection.faqs.map(
										(f: {
											_id?: string;
											question?: string;
											answer?: string;
											visible?: boolean;
											order?: number;
										}) => ({
											_id: f._id?.toString(),
											question: f.question ?? "",
											answer: f.answer ?? "",
											visible: f.visible ?? true,
											order: f.order ?? 0,
										})
									)
								: [],
						},
					});
				} else {
					toast.error("Failed to fetch FAQ settings");
				}
			} catch (error) {
				console.error("Error fetching settings:", error);
				toast.error("Failed to fetch FAQ settings");
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, [session, form]);

	function formatValidationErrors(details: unknown): string {
		if (!details || typeof details !== "object") return "";
		const flat = details as {
			fieldErrors?: Record<string, string[]>;
			formErrors?: string[];
		};
		const errors: string[] = [];
		if (flat.formErrors?.length) errors.push(...flat.formErrors);
		if (flat.fieldErrors) {
			for (const [field, messages] of Object.entries(flat.fieldErrors)) {
				if (messages?.length) errors.push(`${field}: ${messages.join(", ")}`);
			}
		}
		return errors.length > 0 ? errors.join("; ") : "";
	}

	const onSubmit = async (data: FormData) => {
		setIsSaving(true);
		try {
			const normalized: FormData = {
				faqSection: {
					title: data.faqSection.title,
					faqs: data.faqSection.faqs.map((f, idx) => ({
						...f,
						order: idx,
					})),
				},
			};

			const res = await fetch("/api/produkter-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(normalized),
			});

			const responseData = await res.json();

			if (res.ok) {
				toast.success("FAQ settings saved successfully");
				const updated = responseData?.data ?? responseData;
				if (updated?.faqSection) {
					form.reset({
						faqSection: {
							title: updated.faqSection.title ?? "",
							faqs: (updated.faqSection.faqs ?? []).map(
								(f: {
									_id?: string;
									question?: string;
									answer?: string;
									visible?: boolean;
									order?: number;
								}) => ({
									_id: f._id?.toString(),
									question: f.question ?? "",
									answer: f.answer ?? "",
									visible: f.visible ?? true,
									order: f.order ?? 0,
								})
							),
						},
					});
				}
			} else {
				const errorMessage =
					responseData.error ||
					responseData.message ||
					"Failed to save changes";
				const details = responseData.details
					? `: ${formatValidationErrors(responseData.details)}`
					: "";
				throw new Error(`${errorMessage}${details}`);
			}
		} catch (error) {
			console.error("Error saving:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save changes"
			);
		} finally {
			setIsSaving(false);
		}
	};

	if (isPending || isLoading) {
		return <CMSPageSkeleton />;
	}

	if (!session) {
		return null;
	}

	return (
		<>
			<ConfirmModal />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between gap-4 flex-wrap">
					<div className="flex items-center gap-3">
						<Link href="/dashboard/technology-categories">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Produkter Page Settings
							</h1>
							<p className="text-muted-foreground">
								Manage the FAQ section shown on the Produkter page.
							</p>
						</div>
					</div>
					<a
						href="/produkter"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						<ExternalLink className="h-4 w-4" />
						<span>View page</span>
					</a>
				</div>

				<form
					id="produkter-settings-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					{/* Section title */}
					<Card>
						<CardHeader>
							<CardTitle>FAQ Section</CardTitle>
							<CardDescription>
								Title displayed above the FAQ list on the Produkter page.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="faqSection.title">Section Title</Label>
								<Input
									id="faqSection.title"
									{...form.register("faqSection.title")}
									placeholder="Vanliga frågor"
								/>
							</div>
						</CardContent>
					</Card>

					{/* FAQ items */}
					<Card>
						<CardHeader>
							<CardTitle>FAQ Items</CardTitle>
							<CardDescription>
								Questions and answers displayed in the accordion. Answers
								support HTML (e.g. <code>&lt;p&gt;...&lt;/p&gt;</code>).
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{faqs.fields.length === 0 && (
								<div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
									No FAQ items yet. Add your first question below.
								</div>
							)}

							{faqs.fields.map((field, index) => (
								<div
									key={field.id}
									className="flex items-start gap-3 p-4 border rounded-lg bg-card"
								>
									<div className="flex flex-col items-center gap-2 pt-2">
										<GripVertical className="h-4 w-4 text-muted-foreground" />
										<span className="text-xs font-mono text-muted-foreground">
											#{index + 1}
										</span>
									</div>

									<div className="flex-1 space-y-4">
										<div className="space-y-2">
											<Label>Question</Label>
											<Input
												{...form.register(
													`faqSection.faqs.${index}.question`
												)}
												placeholder="Är alla era produkter MDR-certifierade?"
											/>
										</div>
										<div className="space-y-2">
											<Label>Answer (HTML allowed)</Label>
											<Textarea
												{...form.register(`faqSection.faqs.${index}.answer`)}
												placeholder="<p>Svar på frågan...</p>"
												rows={5}
											/>
										</div>
										<div className="flex items-center justify-between gap-4 flex-wrap">
											<div className="flex items-center gap-3">
												<Switch
													checked={form.watch(
														`faqSection.faqs.${index}.visible`
													)}
													onCheckedChange={(v) =>
														form.setValue(
															`faqSection.faqs.${index}.visible`,
															v,
															{ shouldDirty: true }
														)
													}
												/>
												<Label className="cursor-pointer">
													{form.watch(`faqSection.faqs.${index}.visible`)
														? "Visible on site"
														: "Hidden"}
												</Label>
											</div>

											<div className="flex items-center gap-2">
												<Button
													type="button"
													variant="outline"
													size="sm"
													disabled={index === 0}
													onClick={() => faqs.move(index, index - 1)}
												>
													Up
												</Button>
												<Button
													type="button"
													variant="outline"
													size="sm"
													disabled={index === faqs.fields.length - 1}
													onClick={() => faqs.move(index, index + 1)}
												>
													Down
												</Button>
											</div>
										</div>
									</div>

									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={async () => {
											const confirmed = await confirm({
												title: "Remove FAQ",
												description:
													"Are you sure you want to remove this FAQ item? This cannot be undone after saving.",
												confirmText: "Remove",
											});
											if (confirmed) faqs.remove(index);
										}}
									>
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								</div>
							))}

							<Button
								type="button"
								variant="outline"
								onClick={() =>
									faqs.append({
										question: "",
										answer: "",
										visible: true,
										order: faqs.fields.length,
									})
								}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add FAQ Item
							</Button>
						</CardContent>
					</Card>

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
			</div>
		</>
	);
}
