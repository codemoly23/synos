"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

export function MobileFilterDrawer({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex justify-end">
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="primary" size="sm" className="block sm:hidden">
						<ListFilter className="h-4 w-4" />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="p-0! rounded-t-sm">
					<DrawerTitle className="sr-only">Filter</DrawerTitle>
					<div className="max-h-[90vh] p-3 overflow-y-auto">
						{children}
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
