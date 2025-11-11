"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex lg:gap-6">
      {mainNav.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => item.items && setActiveMenu(item.title)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
              activeMenu === item.title && "text-primary"
            )}
          >
            {item.title}
            {item.items && (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </Link>

          {/* Mega Menu Dropdown */}
          {item.items && activeMenu === item.title && (
            <div className="absolute left-0 top-full z-50 mt-2 w-screen max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
              <div className="grid gap-4">
                {item.items.map((subItem) => (
                  <div key={subItem.href}>
                    <Link
                      href={subItem.href}
                      className="block font-medium hover:text-primary"
                    >
                      {subItem.title}
                    </Link>
                    {subItem.items && (
                      <div className="ml-4 mt-2 grid gap-2">
                        {subItem.items.map((subSubItem) => (
                          <Link
                            key={subSubItem.href}
                            href={subSubItem.href}
                            className="block text-sm text-muted-foreground hover:text-primary"
                          >
                            {subSubItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

