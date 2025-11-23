"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ContactPage() {
  const heroRef = useRef(null);
  const infoRef = useRef(null);

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
    if (!infoRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(infoRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.2,
      });
    }, infoRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-background text-primary-dark min-h-screen">
      {/* Page header */}
      <section className="border-b border-border bg-surface">
        <div
          ref={heroRef}
          className="max-w-6xl mx-auto px-6 pt-10 pb-8 lg:pt-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 mb-2">
            Contact
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3">
            Contact TriVantage Learning Institute
          </h1>
          <p className="max-w-2xl text-sm text-primary/80">
            Connect with our Registrar&apos;s Office or General Information
            team for questions about admissions, registration, programs, or
            learner support.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-6 py-10 lg:py-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
        {/* Contact form */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary mb-2">
            Send Us a Message
          </h2>
          <p className="text-xs sm:text-sm text-primary/80 mb-5">
            Share a few details and our team will follow up by email or phone.
            Please allow 1–2 business days for a response.
          </p>

          <form className="space-y-4 text-xs sm:text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-primary/90">
                  First name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block mb-1 text-primary/90">
                  Last name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-primary/90">
                Email<span className="text-error">*</span>
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-primary/90">Phone</label>
              <input
                type="tel"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="(XXX) XXX-XXXX"
              />
            </div>

            <div>
              <label className="block mb-1 text-primary/90">
                Program (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="If inquiring about a specific program"
              />
            </div>

            <div>
              <label className="block mb-1 text-primary/90">
                Message<span className="text-error">*</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
                rows={4}
                placeholder="How can we help?"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary text-secondary-light px-6 py-2.5 text-xs sm:text-sm font-semibold hover:bg-primary-light transition"
            >
              Submit
            </button>

            <p className="text-[11px] text-primary/60 mt-2">
              By submitting this form, you consent to TriVantage Learning
              Institute contacting you regarding programs and services. You may
              withdraw your consent at any time.
            </p>
          </form>
        </div>

        {/* Contact info cards */}
        <div ref={infoRef} className="space-y-5 text-xs sm:text-sm">
          {/* Registrar's Office */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-primary mb-1">
              General Information &amp; Registrar&apos;s Office
            </h2>
            <p className="text-[11px] text-primary/70 mb-3">
              Primary contact for admissions, registration, and academic records.
            </p>

            <div className="space-y-2 text-primary/85">
              <p>
                <span className="font-semibold">Registrar&apos;s Office:</span>{" "}
                Waleed Shaikh
              </p>
              <p>
                <span className="font-semibold">Mobile:</span>{" "}
                <a
                  href="tel:+12898161223"
                  className="text-accent hover:text-accent-light"
                >
                  (289) 816-1223
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:admin@trivantagelearningacademy.ca"
                  className="text-accent hover:text-accent-light break-all"
                >
                  admin@trivantagelearningacademy.ca
                </a>
              </p>
              <p>
                <span className="font-semibold">Website:</span>{" "}
                <a
                  href="https://www.trivantagelearningacademy.ca"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:text-accent-light break-all"
                >
                  www.trivantagelearningacademy.ca
                </a>
              </p>
            </div>
          </div>

          {/* General Information */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-primary mb-1">
              General Information
            </h2>
            <p className="text-[11px] text-primary/70 mb-3">
              For general inquiries about programs, partnerships, or services.
            </p>

            <div className="space-y-2 text-primary/85">
              <p>
                <span className="font-semibold">Contact:</span> Ali Zahid
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:info@trivantagelearningacademy.ca"
                  className="text-accent hover:text-accent-light break-all"
                >
                  info@trivantagelearningacademy.ca
                </a>
              </p>
              <p>
                <span className="font-semibold">Website:</span>{" "}
                <a
                  href="https://www.trivantagelearningacademy.ca"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:text-accent-light break-all"
                >
                  www.trivantagelearningacademy.ca
                </a>
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-[11px] text-primary/70">
            For urgent enrollment or deadline-related questions, we recommend
            contacting the Registrar&apos;s Office by phone. For detailed
            program questions, please use the form and include the program name
            in your message.
          </div>
        </div>
      </section>
    </main>
  );
}