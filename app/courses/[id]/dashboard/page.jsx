"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CourseDashboard() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    fetchCourseAndEnrollment(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, router]);

  const fetchCourseAndEnrollment = async (userData) => {
    try {
      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      const courseData = await courseResponse.json();

      if (!courseData.success) {
        setError("Course not found");
        setLoading(false);
        return;
      }

      setCourse(courseData.data);

      // Fetch user's enrollments to verify access
      const enrollmentResponse = await fetch(
        `/api/enrollment-requests?userId=${userData._id}&status=accepted`
      );
      const enrollmentData = await enrollmentResponse.json();

      if (enrollmentData.success) {
        const userEnrollment = enrollmentData.data.find(
          (e) => {
            const enrollmentCourseId = e.selectedCourse?._id || e.selectedCourse;
            return enrollmentCourseId?.toString() === courseId;
          }
        );

        if (userEnrollment) {
          setEnrollment(userEnrollment);
        } else {
          setError("You are not enrolled in this course");
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      setError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary/70">Loading...</p>
      </main>
    );
  }

  if (error || !enrollment) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-primary mb-4">
              Access Denied
            </h1>
            <p className="text-primary/80 mb-4">
              {error || "You don't have access to this course dashboard."}
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center rounded-full bg-primary text-secondary-light px-4 py-2 text-sm font-semibold hover:bg-primary-light"
            >
              Back to Programs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/programs"
            className="inline-flex items-center text-sm text-primary/70 hover:text-primary mb-4"
          >
            ← Back to Programs
          </Link>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            {course.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-primary">
              {course.category}
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-primary">
              {course.duration}
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-primary">
              {course.format}
            </span>
          </div>
        </div>

        {/* Course Information */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-primary mb-3">
                Course Overview
              </h2>
              <p className="text-sm text-primary/80 mb-4">
                {course.description}
              </p>
              {course.prerequisites && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-primary mb-1">
                    Prerequisites
                  </h3>
                  <p className="text-sm text-primary/80">
                    {course.prerequisites}
                  </p>
                </div>
              )}
              {course.instructor && (
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-1">
                    Instructor
                  </h3>
                  <p className="text-sm text-primary/80">{course.instructor}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-primary mb-3">
                Course Materials
              </h2>
              <p className="text-sm text-primary/80">
                Course materials and resources will be available here once the
                course starts.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary mb-3">
                Enrollment Details
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-primary/70 mb-1">Status</p>
                  <span className="inline-flex items-center rounded-full bg-accent/20 text-accent px-2.5 py-0.5 text-xs font-semibold">
                    Enrolled
                  </span>
                </div>
                {course.startDate && (
                  <div>
                    <p className="text-primary/70 mb-1">Start Date</p>
                    <p className="text-primary">
                      {new Date(course.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {course.endDate && (
                  <div>
                    <p className="text-primary/70 mb-1">End Date</p>
                    <p className="text-primary">
                      {new Date(course.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-primary/70 mb-1">Enrolled On</p>
                  <p className="text-primary">
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary mb-3">
                Quick Links
              </h2>
              <div className="space-y-2">
                <Link
                  href="/contact"
                  className="block rounded-lg border border-border bg-background p-3 text-sm text-primary hover:bg-secondary-light/60 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href="/programs"
                  className="block rounded-lg border border-border bg-background p-3 text-sm text-primary hover:bg-secondary-light/60 transition-colors"
                >
                  Browse More Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
