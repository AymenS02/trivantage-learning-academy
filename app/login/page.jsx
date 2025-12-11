"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.data));

      // Redirect based on role
      if (data.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/programs");
      }
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
            Welcome Back
          </h1>
          <p className="text-sm text-primary/70">
            Log in to your account
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-1"
              >
                Email
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
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary text-secondary-light px-6 py-2.5 text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-primary/70">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-accent hover:text-accent-light"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
