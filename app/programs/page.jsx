"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Sidebar from "../components/Sidebar";

gsap.registerPlugin(ScrollTrigger);

export default function ProgramsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const cardsRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchCategories();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses?status=published&limit=1000");
      const data = await response.json();

      if (data.success) {
        setPrograms(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/enrollment-requests?userId=${user._id}`);
      const data = await response.json();

      if (data.success) {
        setEnrollments(data.data);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  // Helper function to get enrollment status for a course
  const getEnrollmentStatus = (courseId) => {
    const enrollment = enrollments.find(
      (e) => {
        const enrollmentCourseId = e.selectedCourse?._id || e.selectedCourse;
        return enrollmentCourseId?.toString() === courseId;
      }
    );
    return enrollment ? enrollment.status : null;
  };

  const filteredPrograms = useMemo(() => {
    if (activeFilter === "all") return programs;
    return programs.filter((p) => p.category?._id === activeFilter);
  }, [activeFilter, programs]);

  // Hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Scroll reveal for cards
  useEffect(() => {
    if (!cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.querySelectorAll("[data-program-card]");
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
      });
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  // Animate when filter changes (subtle fade + slide)
  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll("[data-program-card]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, [filteredPrograms]);

  return (
    <main className="bg-background text-primary-dark">
      <section className="border-b border-border bg-surface">
        <div
          ref={heroRef}
          className="max-w-6xl mx-auto px-6 pt-10 pb-8 lg:pt-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 mb-2">
            Programs
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3">
            Career-Focused Programs & Certificates
          </h1>
          <p className="max-w-2xl text-sm text-primary/80">
            Explore flexible, workforce-ready programs designed for learners,
            newcomers, and working professionals. Select a program to view
            details, or proceed directly to enrollment to get started.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 lg:py-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
        {/* Sidebar */}
        <div className="order-2 lg:order-1">
          <Sidebar 
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Main content */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* All Programs filter */}
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                activeFilter === "all"
                  ? "border-primary bg-primary text-secondary-light"
                  : "border-border bg-background text-primary hover:bg-secondary-light/60",
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
                  onClick={() => setActiveFilter(category._id)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-secondary-light"
                      : "border-border bg-background text-primary hover:bg-secondary-light/60",
                  ].join(" ")}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div
            ref={cardsRef}
            className="grid gap-4 sm:grid-cols-2"
          >
            {loading ? (
              <p className="text-sm text-primary/70">Loading courses...</p>
            ) : filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <article
                  key={program._id}
                  data-program-card
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <h2 className="text-sm font-semibold text-primary">
                          {program.title}
                        </h2>
                        <p className="text-[11px] text-primary/70">
                          {program.category?.name || 'Other'}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-secondary-light px-2.5 py-1 text-[10px] font-semibold text-primary">
                        {program.duration}
                      </span>
                    </div>

                    <p className="text-xs text-primary/80 mb-3">
                      {program.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-primary/80">
                        {program.format}
                      </span>
                      {program.instructor && (
                        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-primary/80">
                          {program.instructor}
                        </span>
                      )}
                      {program.price > 0 && (
                        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-primary/80">
                          ${program.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    {(() => {
                      const enrollmentStatus = getEnrollmentStatus(program._id);
                      
                      if (enrollmentStatus === "accepted") {
                        return (
                          <Link
                            href={`/courses/${program._id}/dashboard`}
                            className="inline-flex items-center rounded-full bg-accent text-secondary-light px-3 py-1.5 text-[11px] font-semibold hover:bg-accent/80"
                          >
                            Dashboard
                          </Link>
                        );
                      } else if (enrollmentStatus === "pending") {
                        return (
                          <span className="inline-flex items-center rounded-full bg-secondary-light border border-border text-primary px-3 py-1.5 text-[11px] font-semibold">
                            Pending
                          </span>
                        );
                      } else {
                        return (
                          <Link
                            href={{
                              pathname: "/admissions",
                              query: { program: program.title },
                            }}
                            className="inline-flex items-center rounded-full bg-primary text-secondary-light px-3 py-1.5 text-[11px] font-semibold hover:bg-primary-light"
                          >
                            Enroll Now
                          </Link>
                        );
                      }
                    })()}
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-primary/70">
                No programs found in this category right now. Please check back
                soon or contact our team for guidance.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}