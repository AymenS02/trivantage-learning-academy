"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    publishedCourses: 0,
    pendingEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      router.push("/programs");
      return;
    }

    setUser(userData);
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const [coursesRes, usersRes, enrollmentsRes] = await Promise.all([
        fetch("/api/courses?limit=1000"),
        fetch("/api/users?limit=1000"),
        fetch("/api/enrollment-requests?status=pending&limit=1000"),
      ]);

      const coursesData = await coursesRes.json();
      const usersData = await usersRes.json();
      const enrollmentsData = await enrollmentsRes.json();

      if (coursesData.success && usersData.success) {
        const publishedCount = coursesData.data.filter(
          (c) => c.status === "published"
        ).length;

        setStats({
          totalCourses: coursesData.data.length,
          totalUsers: usersData.data.length,
          publishedCourses: publishedCount,
          pendingEnrollments: enrollmentsData.success ? enrollmentsData.data.length : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary/70">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm text-primary/70">
              Welcome back, {user?.firstName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-primary hover:bg-secondary-light/60 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm text-primary/70 mb-1">Total Courses</p>
            <p className="text-3xl font-semibold text-primary">
              {stats.totalCourses}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm text-primary/70 mb-1">Published Courses</p>
            <p className="text-3xl font-semibold text-primary">
              {stats.publishedCourses}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm text-primary/70 mb-1">Total Users</p>
            <p className="text-3xl font-semibold text-primary">
              {stats.totalUsers}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm text-primary/70 mb-1">Pending Enrollments</p>
            <p className="text-3xl font-semibold text-primary">
              {stats.pendingEnrollments || 0}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/courses"
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-secondary-light/60 transition-colors"
            >
              <span className="text-sm font-medium text-primary">
                Manage Courses
              </span>
              <span className="text-accent">→</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-secondary-light/60 transition-colors"
            >
              <span className="text-sm font-medium text-primary">
                Manage Categories
              </span>
              <span className="text-accent">→</span>
            </Link>
            <Link
              href="/admin/enrollments"
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-secondary-light/60 transition-colors"
            >
              <span className="text-sm font-medium text-primary">
                Review Enrollments
              </span>
              <span className="text-accent">→</span>
            </Link>
            <Link
              href="/programs"
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-secondary-light/60 transition-colors"
            >
              <span className="text-sm font-medium text-primary">
                View Programs Page
              </span>
              <span className="text-accent">→</span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-secondary-light/60 transition-colors"
            >
              <span className="text-sm font-medium text-primary">
                Back to Home
              </span>
              <span className="text-accent">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
