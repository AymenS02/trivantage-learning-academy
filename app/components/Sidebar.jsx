"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/programs", label: "All Programs" },
    { href: "/programs/healthcare", label: "Healthcare" },
    { href: "/programs/leadership", label: "Leadership" },
    { href: "/programs/newcomers", label: "Newcomer Pathways" },
    { href: "/programs/short-courses", label: "Short Courses" },
  ];

  return (
    <aside className="w-full md:w-64 border border-border bg-surface rounded-2xl p-4 text-sm text-primary">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70 mb-3">
        Programs Overview
      </h2>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-secondary-light"
                  : "hover:bg-secondary-light/60 hover:text-primary",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-xl border border-border bg-background px-3 py-3 text-xs">
        <p className="font-semibold text-primary mb-1">
          Need guidance choosing a program?
        </p>
        <p className="text-primary/80 mb-2">
          Speak with an advisor about your goals, experience, and next steps.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full bg-primary text-secondary-light px-3 py-1.5 text-[11px] font-semibold hover:bg-primary-light"
        >
          Contact Admissions
        </Link>
      </div>
    </aside>
  );
}