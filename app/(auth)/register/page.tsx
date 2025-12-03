"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			setError(null);
			setIsLoading(true);

			// Step 1: Call Better Auth sign up
			const res = await authClient.signUp.email({
				email: values.email,
				password: values.password,
				name: values.name,
			});

			if (res.data === null) {
				throw new Error(res.error.message);
			}

			console.log("Signup successful:", res);

			// Step 2: Create user profile
			try {
				const syncResponse = await fetch("/api/auth/sync-user", {
					method: "POST",
					credentials: "include", // Include session cookies
				});

				if (!syncResponse.ok) {
					console.error("Failed to create user profile");
					// Don't block registration, but log the error
				} else {
					console.log("User profile created successfully");
				}
			} catch (syncError) {
				console.error("Error creating user profile:", syncError);
				// Don't block registration - profile can be created later
			}

			// Step 3: Redirect to dashboard on success
			router.push("/dashboard");
		} catch (err: any) {
			console.error("Signup error:", err);
			setError(err?.message || "Registration failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="_container padding-top">
			<div className="max-w-sm mx-auto">
				<h1 className="text-3xl font-bold mb-6">Create Account</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
						{error}
					</div>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Name */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="John Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="email@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating Account..." : "Register"}
						</Button>
					</form>
				</Form>

				<p className="mt-6 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<a href="/login" className="text-blue-600 hover:underline">
						Sign in
					</a>
				</p>
			</div>
		</div>
	);
}
