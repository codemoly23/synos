import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PROTECTED_ROUTES = [
	{
		name: "Dashboard",
		route: "/dashboard",
	},
	{
		name: "Profile",
		route: "/dashboard/profile",
	},
];

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
const ProtectedNavbar = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const { data: session } = authClient.useSession();

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			await authClient.signOut();
			// router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
			setIsLoggingOut(false);
		}
	};
	if (!session) return null;

	return (
		<div className="flex flex-row flex-wrap items-center gap-12">
			<Popover>
				<PopoverTrigger asChild className="cursor-pointer">
					<Avatar>
						<AvatarImage
							src={session.user.image!}
							alt={session.user.name}
						/>
						<AvatarFallback>{session.user.name.at(0)}</AvatarFallback>
					</Avatar>
				</PopoverTrigger>
				<PopoverContent className="w-[180px]" align="end">
					<div className="flex items-start flex-col justify-between space-y-5 h-auto">
						<div className="flex items-start flex-col space-y-2">
							{PROTECTED_ROUTES.map((pr) => (
								<Link
									key={pr.route}
									href={pr.route}
									className="hover:underline"
								>
									{pr.name}
								</Link>
							))}
						</div>

						<div className="flex items-center space-x-4">
							<button
								onClick={handleLogout}
								disabled={isLoggingOut}
								className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
							>
								{isLoggingOut ? "Logging out..." : "Logout"}
							</button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
	// return (
	// 	<div className="_container border-b bg-slate-200">
	// 		<div className="flex items-center justify-between h-16">
	// 			<div className="flex items-center space-x-8">
	// 				<Link
	// 					href="/dashboard"
	// 					className="text-xl font-bold text-blue-600"
	// 				>
	// 					Dashboard
	// 				</Link>
	// 			</div>

	// 			<div className="flex items-center space-x-4">
	// 				<span className="text-sm text-gray-600">
	// 					{session.user?.name || session.user?.email}
	// 				</span>
	// 				<button
	// 					onClick={handleLogout}
	// 					disabled={isLoggingOut}
	// 					className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
	// 				>
	// 					{isLoggingOut ? "Logging out..." : "Logout"}
	// 				</button>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
};

export default ProtectedNavbar;
