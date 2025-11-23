"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AdmissionsPage() {
  const heroRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current || !formRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.15,
      });
    });

    return () => ctx.revert();
  }, []);

  // TODO: replace with real onSubmit handler / API route
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just log:
    console.log("Admissions form submitted");
  };

  return (
    <main className="bg-background text-primary-dark min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface">
        <div
          ref={heroRef}
          className="max-w-6xl mx-auto px-6 pt-10 pb-8 lg:pt-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 mb-2">
            Admissions
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3">
            Intake & Admissions Form
          </h1>
          <p className="max-w-2xl text-sm text-primary/80">
            Please complete this intake form to begin your admissions process
            with TriVantage Learning Institute. Fields marked with{" "}
            <span className="text-error">*</span> are required.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-6xl mx-auto px-6 py-10 lg:py-12">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-6 lg:p-8 shadow-sm space-y-8 text-xs sm:text-sm"
        >
          {/* Personal Information */}
          <section>
            <h2 className="text-sm sm:text-base font-semibold text-primary mb-4">
              General Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-primary/90">
                  First name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">
                  Last name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label className="block mb-1 text-primary/90">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </section>

          {/* Address & Demographics */}
          <section className="border-t border-border pt-6">
            <h2 className="text-sm sm:text-base font-semibold text-primary mb-4">
              Address & Demographics
            </h2>

            <div className="mb-3">
              <label className="block mb-1 text-primary/90">
                Multi-line address
              </label>
              <textarea
                name="addressMultiline"
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Street address, unit, etc."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-primary/90">
                  Country/Region
                </label>
                <input
                  type="text"
                  name="country"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Country or region"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">City</label>
                <input
                  type="text"
                  name="city"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="City"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label className="block mb-1 text-primary/90">Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">
                  Zip / Postal code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-primary/90">
                Gender <span className="text-error">*</span>
              </p>
              <div className="flex flex-wrap gap-4">
                {["Male", "Female", "X"].map((label) => (
                  <label key={label} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={label}
                      required
                      className="h-3 w-3 text-primary"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Immigration & Background */}
          <section className="border-t border-border pt-6">
            <h2 className="text-sm sm:text-base font-semibold text-primary mb-4">
              Immigration Status & Background
            </h2>

            <div className="mb-4">
              <p className="mb-2 text-primary/90">
                Immigration status (please check one)
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Canadian Citizen",
                  "Permanent Resident",
                  "Conventional Refugee",
                  "Refugee Claimant",
                  "Student Visa",
                  "Work Permit",
                  "Visitor Visa",
               ].map((status) => (
                  <label
                    key={status}
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="immigrationStatus"
                      value={status}
                      className="h-3 w-3 text-primary"
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="block mb-1 text-primary/90">
                  (Newcomers only) Country of origin
                </label>
                <input
                  type="text"
                  name="countryOfOrigin"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Country of origin"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">
                  (Newcomers only) Date of arrival in Canada (MM/DD/YYYY)
                </label>
                <input
                  type="text"
                  name="arrivalDate"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="MM/DD/YYYY"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-primary/90">
                  Previous work experience
                </label>
                <textarea
                  name="workExperience"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Briefly describe your previous work experience"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">
                  Education background
                </label>
                <textarea
                  name="educationBackground"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Highest level of education, field of study, etc."
                />
              </div>
            </div>

            {/* LINC / newcomer-specific questions */}
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-1 text-primary/90">
                  Have you attended other LINC classes? (Newcomers only)
                </p>
                <div className="flex gap-4">
                  {["Yes", "No"].map((label) => (
                    <label
                      key={label}
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="attendedLinc"
                        value={label}
                        className="h-3 w-3 text-primary"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  name="attendedLincDetails"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="If yes, please specify"
                />
              </div>

              <div>
                <p className="mb-1 text-primary/90">
                  Do you have a Language Companion? (Newcomers only)
                </p>
                <div className="flex gap-4">
                  {["Yes", "No"].map((label) => (
                    <label
                      key={label}
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="languageCompanion"
                        value={label}
                        className="h-3 w-3 text-primary"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-primary/90">
                    Date intake (Newcomers only) – MM/DD/YYYY
                  </label>
                  <input
                    type="text"
                    name="dateIntake"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="MM/DD/YYYY"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-primary/90">
                    Assessment date (Newcomers only) – MM/DD/YYYY
                  </label>
                  <input
                    type="text"
                    name="assessmentDate"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="MM/DD/YYYY"
                  />
                </div>
              </div>

              <div>
                <p className="mb-1 text-primary/90">
                  CLB (Listening, Speaking, Reading, Writing) – Newcomers only
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {["Listening", "Speaking", "Reading", "Writing"].map(
                    (skill) => (
                      <div key={skill}>
                        <label className="block mb-1 text-primary/90">
                          {skill}
                        </label>
                        <input
                          type="text"
                          name={`clb${skill}`}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="CLB level"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Program Selection */}
          <section className="border-t border-border pt-6">
            <h2 className="text-sm sm:text-base font-semibold text-primary mb-4">
              Program Selection
            </h2>

            {/* Newcomers / Settlement */}
            <div className="mb-4">
              <p className="font-semibold text-primary text-xs mb-2">
                Newcomers / Settlement &amp; Integration
              </p>
              <div className="space-y-2">
                {[
                  "Computer Literacy - $299 + HST",
                  "Career Pathway/Job-Readiness Workshops - $299 + HST",
                  "English as a Second Language $250 + HST monthly for 3 months / $225 + HST monthly for 6 months",
                  "Financial Literacy for Newcomers - $299 + HST",
                  "Civic Engagement Pathway to Citizenship Courses - $299 + HST",
                  "IELTS - International English Language Testing System (TBD)",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-start gap-2 text-xs sm:text-sm"
                  >
                    <input
                      type="checkbox"
                      name="programNewcomers"
                      value={label}
                      className="mt-1 h-3 w-3 text-primary"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Healthcare & Community */}
            <div className="mb-4">
              <p className="font-semibold text-primary text-xs mb-2">
                Healthcare &amp; Community Courses
              </p>
              <div className="space-y-2">
                {[
                  "Gentle Persuasive Approach (GPA) - $150 + HST each ($1299 for 10+ group + HST)",
                  "Palliative Care - PSW - $299 + HST",
                  "Analytical Testing Laboratory Equipment Training (TBD)",
                  "IENs - Internationally Educated Nurses (TBD)",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-start gap-2 text-xs sm:text-sm"
                  >
                    <input
                      type="checkbox"
                      name="programHealthcare"
                      value={label}
                      className="mt-1 h-3 w-3 text-primary"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Business Programs */}
            <div className="mb-4">
              <p className="font-semibold text-primary text-xs mb-2">
                Business Programs
              </p>
              <div className="space-y-2">
                {[
                  "Accounting & Bookkeeping Level 1 & 2 - $375 each level + HST",
                  "QuickBooks Online Basics Level 1 & Level 2 - $375 each level + HST",
                  "Payroll Administration - $575 + HST",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-start gap-2 text-xs sm:text-sm"
                  >
                    <input
                      type="checkbox"
                      name="programBusiness"
                      value={label}
                      className="mt-1 h-3 w-3 text-primary"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Micro-credentials */}
            <div>
              <p className="font-semibold text-primary text-xs mb-2">
                Micro-credentials &amp; Professional Development
              </p>
              <div className="space-y-2">
                {[
                  "Lean Six Sigma - $250 each level + HST",
                  "Emotional Intelligence - $350 + HST",
                  "Certified Coach - $2100 + HST",
                  "Project Management - $2100 + HST",
                  "Adult Education Certification - $2100 + HST",
                  "WHMIS - $375 + HST",
                  "Food Handlers Course - $150 + HST",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-start gap-2 text-xs sm:text-sm"
                  >
                    <input
                      type="checkbox"
                      name="programMicro"
                      value={label}
                      className="mt-1 h-3 w-3 text-primary"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Special Needs & Consent */}
          <section className="border-t border-border pt-6 space-y-4">
            <div>
              <label className="block mb-1 text-primary/90">
                Do you have any special needs we should be aware of?
              </label>
              <textarea
                name="specialNeeds"
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Accessibility, learning accommodations, medical considerations, etc."
              />
            </div>

            <div className="text-[11px] sm:text-xs text-primary/80 space-y-2">
              <p>
                I hereby give permission to be photographed and/or videotaped,
                and for these media to be published or displayed along with my
                name, nationality, and the organization I am attending. These
                may be used for promotional and informational purposes by
                TriVantage Learning Academy (e.g., newspapers, brochures,
                online media).
              </p>
              <p>
                <span className="font-semibold">
                  By typing my name and date,
                </span>{" "}
                I acknowledge that I have read, understood, and agree to the
                terms outlined in the above statement.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-primary/90">
                  Please type your full name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="consentName"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Full legal name"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">
                  Date <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="consentDate"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="MM/DD/YYYY"
                />
              </div>
            </div>
          </section>

          {/* Payment Info & Submit */}
          <section className="border-t border-border pt-6 space-y-4">
            <div className="rounded-xl border border-dashed border-border bg-background px-4 py-3 text-[11px] sm:text-xs text-primary/80">
              <p className="font-semibold text-primary mb-1">Payment</p>
              <p>
                E-transfer to:{" "}
                <span className="font-semibold">
                  admin@trivantagelearningacademy.ca
                </span>
              </p>
              <p>A receipt will be provided after payment is received.</p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary text-secondary-light px-6 py-2.5 text-xs sm:text-sm font-semibold hover:bg-primary-light transition"
            >
              Submit
            </button>
          </section>
        </form>
      </section>
    </main>
  );
}