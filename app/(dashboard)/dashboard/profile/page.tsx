"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_ROUTES } from "@/lib/utils/constants";

const profileSchema = z.object({
	bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
	phoneNumber: z.string().optional(),
	address: z
		.object({
			street: z.string().optional(),
			city: z.string().optional(),
			postalCode: z.string().optional(),
			country: z.string().optional(),
		})
		.optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileData {
	_id: string;
	bio?: string;
	phoneNumber?: string;
	address?: {
		street?: string;
		city?: string;
		postalCode?: string;
		country?: string;
	};
}

export default function ProfilePage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			bio: "",
			phoneNumber: "",
			address: {
				street: "",
				city: "",
				postalCode: "",
				country: "",
			},
		},
	});

	// Fetch profile data
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true);
				const response = await fetch(API_ROUTES.USER.ME);
				console.log("response -> ", response);

				if (!response.ok) {
					throw new Error("Failed to fetch profile");
				}

				const data = await response.json();
				const profile: ProfileData = {
					...data.data.profile,
					...data.data.user,
				};
				console.log("profile -> ", profile);

				// Update form with existing data
				form.reset({
					bio: profile.bio || "",
					phoneNumber: profile.phoneNumber || "",
					address: {
						street: profile.address?.street || "",
						city: profile.address?.city || "",
						postalCode: profile.address?.postalCode || "",
						country: profile.address?.country || "",
					},
				});
			} catch (err: any) {
				console.error("Error fetching profile:", err);
				setError(err.message || "Failed to load profile");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [form]);

	const onSubmit = async (values: ProfileFormValues) => {
		try {
			setSaving(true);
			setError(null);
			setSuccess(null);

			const response = await fetch("/api/user/profile", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Failed to update profile");
			}

			setSuccess("Profile updated successfully!");

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			console.error("Error updating profile:", err);
			setError(err.message || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-6">
					Edit Profile
				</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
						{error}
					</div>
				)}

				{success && (
					<div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
						{success}
					</div>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Bio */}
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<textarea
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											rows={4}
											placeholder="Tell us about yourself..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Phone Number */}
						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input
											type="tel"
											placeholder="+46 70 123 45 67"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Address Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Address
							</h3>

							<FormField
								control={form.control}
								name="address.street"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Street</FormLabel>
										<FormControl>
											<Input placeholder="Storgatan 1" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="address.city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input placeholder="Stockholm" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="address.postalCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Postal Code</FormLabel>
											<FormControl>
												<Input placeholder="111 22" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="address.country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input placeholder="Sweden" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex items-center justify-between pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => form.reset()}
								disabled={saving}
							>
								Reset
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
