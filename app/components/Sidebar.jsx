"use client";

import Link from "next/link";

export default function Sidebar({ categories = [], activeFilter = "all", onFilterChange = () => {} }) {
  return (
    <aside className="w-full md:w-64 border border-border bg-surface rounded-2xl p-4 text-sm text-primary">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70 mb-3">
        Programs Overview
      </h2>
      <nav className="flex flex-col gap-1">
        {/* All Programs filter */}
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={[
            "rounded-lg px-3 py-2 text-sm transition-colors text-left",
            activeFilter === "all"
              ? "bg-primary text-secondary-light"
              : "hover:bg-secondary-light/60 hover:text-primary",
          ].join(" ")}
        >
          All Programs
        </button>
        
        {/* Dynamic category filters */}
        {categories.map((category) => {
          const active = activeFilter === category._id;
          return (
            <button
              key={category._id}
              type="button"
              onClick={() => onFilterChange(category._id)}
              className={[
                "rounded-lg px-3 py-2 text-sm transition-colors text-left",
                active
                  ? "bg-primary text-secondary-light"
                  : "hover:bg-secondary-light/60 hover:text-primary",
              ].join(" ")}
            >
              {category.name}
            </button>
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