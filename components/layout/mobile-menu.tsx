"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold text-primary">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-2 overflow-y-auto">
              {mainNav.map((item) => (
                <div key={item.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className="flex-1 py-2 font-medium hover:text-primary"
                      onClick={() => !item.items && setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.items && (
                      <button
                        onClick={() => toggleExpanded(item.title)}
                        className="p-2"
                      >
                        <svg
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.title) && "rotate-180"
                          )}
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
                      </button>
                    )}
                  </div>

                  {item.items && expandedItems.includes(item.title) && (
                    <div className="ml-4 flex flex-col gap-2 border-l-2 border-border pl-4">
                      {item.items.map((subItem) => (
                        <div key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className="block py-1 text-sm hover:text-primary"
                            onClick={() => !subItem.items && setIsOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                          {subItem.items && (
                            <div className="ml-4 mt-1 flex flex-col gap-1">
                              {subItem.items.map((subSubItem) => (
                                <Link
                                  key={subSubItem.href}
                                  href={subSubItem.href}
                                  className="block py-1 text-xs text-muted-foreground hover:text-primary"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subSubItem.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

