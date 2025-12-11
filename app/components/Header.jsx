"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/programs", label: "Programs" },
    { href: "/admissions", label: "Admissions" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-24 w-24 rounded-full text-secondary-light flex items-center justify-center text-xs font-bold tracking-tight">
            <Image src="/logo.jpg" alt="Logo" width={64} height={64} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-primary">
              TriVantage Learning Institute
            </p>
            <p className="text-[11px] text-primary/70">
              Empowering Learners. Building Careers.
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="hover:text-accent transition-colors"
                >
                  Admin
                </Link>
              )}
              <span className="text-primary/70">
                {user.firstName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium hover:bg-secondary-light/60 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-accent transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary text-secondary-light px-4 py-1.5 text-xs font-semibold hover:bg-primary-light transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary"
        >
          Menu
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-2 text-sm text-primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1 hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="py-1 hover:text-accent transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="py-1 text-primary/70">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="mt-2 inline-flex w-max rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium hover:bg-secondary-light/60 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="py-1 hover:text-accent transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex w-max rounded-full bg-primary text-secondary-light px-4 py-1.5 text-xs font-semibold hover:bg-primary-light transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}