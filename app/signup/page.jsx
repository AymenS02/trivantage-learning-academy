"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.data));
      
      // Redirect to programs page
      router.push("/programs");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-primary mb-2">
            Create Account
          </h1>
          <p className="text-sm text-primary/70">
            Join TriVantage Learning Institute
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary mb-1"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="mt-1 text-xs text-primary/60">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-primary mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary text-secondary-light px-6 py-2.5 text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-primary/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:text-accent-light"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
