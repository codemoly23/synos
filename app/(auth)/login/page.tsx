"use client";

import { useState, Suspense } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

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
	email: z.string().email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Get callback URL from query params
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			setError(null);
			setIsLoading(true);

			// Call Better Auth sign in
			const res = await authClient.signIn.email({
				email: values.email,
				password: values.password,
			});

			if (res.data === null) {
				throw new Error(res?.error?.message);
			}

			console.log("Login successful:", res);

			// Redirect to callback URL or dashboard on success
			router.push(callbackUrl);
		} catch (err: any) {
			console.error("Login error:", err);
			setError(
				err?.message || "Login failed. Please check your credentials."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="_container padding-top">
			<div className="max-w-sm mx-auto">
				<h1 className="text-3xl font-bold mb-6">Sign In</h1>

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
							{isLoading ? "Signing In..." : "Sign In"}
						</Button>
					</form>
				</Form>

				<p className="mt-6 text-center text-sm text-gray-600">
					{`Don't have an account?`}
					<a href="/register" className="text-blue-600 hover:underline">
						Register
					</a>
				</p>
			</div>
		</div>
	);
}

export default function Login() {
	return (
		<Suspense
			fallback={
				<div className="_container padding-top">
					<div className="max-w-sm mx-auto text-center">Loading...</div>
				</div>
			}
		>
			<LoginForm />
		</Suspense>
	);
}
