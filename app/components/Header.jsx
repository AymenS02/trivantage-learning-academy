"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/admissions", label: "Admissions" },
    { href: "/resume-career", label: "Resume & Career Development" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-24 w-24 rounded-full flex items-center justify-center">
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
            <Link key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ))}

          {hydrated && (
            user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin" className="hover:text-accent">
                    Admin
                  </Link>
                )}
                <span className="text-primary/70">{user.firstName}</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
