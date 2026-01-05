"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";

function AdmissionsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const heroRef = useRef(null);
  const formRef = useRef(null);
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Pre-select course if coming from programs page
    const programParam = searchParams.get('program');
    if (programParam && courses.length > 0) {
      const course = courses.find(c => c.title === programParam);
      if (course) {
        setSelectedCourse(course._id);
      }
    }
  }, [searchParams, courses]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses?status=published&limit=1000");
      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      addressMultiline: formData.get("addressMultiline"),
      country: formData.get("country"),
      city: formData.get("city"),
      address: formData.get("address"),
      postalCode: formData.get("postalCode"),
      gender: formData.get("gender"),
      immigrationStatus: formData.get("immigrationStatus"),
      countryOfOrigin: formData.get("countryOfOrigin"),
      arrivalDate: formData.get("arrivalDate"),
      workExperience: formData.get("workExperience"),
      educationBackground: formData.get("educationBackground"),
      attendedLinc: formData.get("attendedLinc"),
      attendedLincDetails: formData.get("attendedLincDetails"),
      languageCompanion: formData.get("languageCompanion"),
      dateIntake: formData.get("dateIntake"),
      assessmentDate: formData.get("assessmentDate"),
      clbListening: formData.get("clbListening"),
      clbSpeaking: formData.get("clbSpeaking"),
      clbReading: formData.get("clbReading"),
      clbWriting: formData.get("clbWriting"),
      selectedCourse: formData.get("selectedCourse"),
      specialNeeds: formData.get("specialNeeds"),
      consentName: formData.get("consentName"),
      consentDate: formData.get("consentDate"),
    };

    // Add userId if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      data.userId = userData._id;
    }

    try {
      const response = await fetch("/api/enrollment-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert("Enrollment request submitted successfully! You will be notified once your application is reviewed.");
        router.push("/programs");
      } else {
        setError(result.error || "Failed to submit enrollment request");
      }
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      setError("An error occurred while submitting your request");
    } finally {
      setSubmitting(false);
    }
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
              Course Selection <span className="text-error">*</span>
            </h2>

            {error && (
              <div className="mb-4 rounded-lg border border-error bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            {loading ? (
              <p className="text-sm text-primary/70">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-sm text-primary/70">
                No courses available at the moment. Please check back later.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-primary/80 mb-3">
                  Please select the course you wish to enroll in:
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {courses.map((course) => (
                    <label
                      key={course._id}
                      className={[
                        "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                        selectedCourse === course._id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-primary/50",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="selectedCourse"
                        value={course._id}
                        checked={selectedCourse === course._id}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                        className="mt-1 h-4 w-4 text-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-primary">
                            {course.title}
                          </p>
                          <span className="inline-flex items-center rounded-full bg-secondary-light px-2.5 py-0.5 text-xs font-semibold text-primary whitespace-nowrap">
                            ${course.price}
                          </span>
                        </div>
                        <p className="text-xs text-primary/70 mb-1">
                          {course.category?.name || 'Other'} • {course.duration} • {course.format}
                        </p>
                        <p className="text-xs text-primary/80">
                          {course.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
              disabled={submitting || loading}
              className="inline-flex items-center justify-center rounded-full bg-primary text-secondary-light px-6 py-2.5 text-xs sm:text-sm font-semibold hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </section>
        </form>
      </section>
    </main>
  );
}

export default function AdmissionsPage() {
  return (
    <Suspense fallback={
      <main className="bg-background text-primary-dark min-h-screen flex items-center justify-center">
        <p className="text-primary/70">Loading...</p>
      </main>
    }>
      <AdmissionsForm />
    </Suspense>
  );
}