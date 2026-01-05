"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ResumeCareerPage() {
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);

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

  useEffect(() => {
    if (!categoriesRef.current) return;
    const ctx = gsap.context(() => {
      const cards = categoriesRef.current.querySelectorAll("[data-category-card]");
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
      });
    }, categoriesRef);
    return () => ctx.revert();
  }, []);

  const categories = [
    {
      title: "Resume Preparation",
      description: "Learn how to create a professional, compelling resume that stands out to employers. Our expert guidance helps you highlight your skills, experience, and achievements effectively.",
      features: [
        "Professional resume templates",
        "ATS-optimized formatting",
        "Industry-specific customization",
        "Cover letter writing tips",
        "Portfolio development",
      ],
    },
    {
      title: "Job Search",
      description: "Master the art of finding and applying for jobs that match your skills and career goals. We'll guide you through modern job search strategies and networking techniques.",
      features: [
        "Job search strategies",
        "Networking techniques",
        "Online presence optimization",
        "Application tracking systems",
        "Salary negotiation guidance",
      ],
    },
    {
      title: "Interview Coaching",
      description: "Build confidence and master interview techniques with our comprehensive coaching program. Practice common questions, learn effective communication strategies, and present yourself professionally.",
      features: [
        "Mock interview sessions",
        "Common interview questions practice",
        "Behavioral interview techniques",
        "Body language and presentation",
        "Follow-up strategies",
      ],
    },
  ];

  return (
    <main className="bg-background text-primary-dark min-h-screen">
      {/* Page header */}
      <section className="border-b border-border bg-surface">
        <div
          ref={heroRef}
          className="max-w-6xl mx-auto px-6 pt-10 pb-8 lg:pt-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 mb-2">
            Career Services
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3">
            Resume & Career Development
          </h1>
          <p className="max-w-2xl text-sm text-primary/80">
            Take your career to the next level with our comprehensive resume
            and career development services. Whether you&apos;re starting your job
            search, refining your resume, or preparing for interviews, we&apos;re here
            to help you succeed.
          </p>
        </div>
      </section>

      {/* Main content - Categories */}
      <section className="max-w-6xl mx-auto px-6 py-10 lg:py-12">
        <div ref={categoriesRef} className="grid gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <article
              key={category.title}
              data-category-card
              className="bg-surface border border-border rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-secondary-light font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-2">
                    {category.title}
                  </h2>
                  <p className="text-sm sm:text-base text-primary/80">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pl-16">
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
                  What You&apos;ll Learn
                </h3>
                <ul className="space-y-2">
                  {category.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-primary/80"
                    >
                      <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-primary-dark">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-10 lg:mt-12 bg-primary-dark text-secondary-light rounded-2xl p-6 lg:p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-secondary mb-3">
              Ready to Advance Your Career?
            </h2>
            <p className="text-sm sm:text-base text-secondary-light/90 mb-6">
              Contact us today to learn more about our resume and career
              development services. Our expert team is here to support your
              professional growth and help you achieve your career goals.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-secondary text-primary px-6 py-2.5 text-sm font-semibold hover:bg-secondary-light transition"
              >
                Contact Us
              </a>
              <a
                href="/programs"
                className="inline-flex items-center justify-center rounded-full border border-secondary/70 bg-primary-dark/40 px-6 py-2.5 text-sm font-semibold text-secondary-light hover:bg-primary-light/60 transition"
              >
                View All Programs
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
