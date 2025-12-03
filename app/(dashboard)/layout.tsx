"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard");
		}
	}, [session, isPending, router]);

	// Show loading state while checking authentication
	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center padding-top">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// Don't render if not authenticated
	if (!session) {
		return null;
	}

	return (
		<div className="padding-top bg-primary/10">
			{/* Main Content */}
			<div className="_container py-8">{children}</div>
		</div>
	);
}
