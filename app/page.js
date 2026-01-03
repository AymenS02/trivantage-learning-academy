"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroBadgesRef = useRef(null);
  const whyRef = useRef(null);
  const valuesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // HERO: text + image entrance
    if (heroRef.current && heroImageRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(heroRef.current, {
          opacity: 0,
          y: 40,
          duration: 1,
        })
          .from(
            heroImageRef.current,
            {
              opacity: 0,
              y: 40,
              scale: 0.96,
              duration: 1,
            },
            "-=0.6"
          )
          .from(
            heroBadgesRef.current?. children || [],
            {
              opacity: 0,
              y: 10,
              duration: 0.6,
              stagger: 0.15,
            },
            "-=0.6"
          );
      });

      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    // WHY CHOOSE US cards – scroll reveal
    if (whyRef. current) {
      const ctx = gsap.context(() => {
        const cards = whyRef.current.querySelectorAll("[data-why-card]");
        gsap.from(cards, {
          scrollTrigger: {
            trigger: whyRef.current,
            start: "top 75%",
          },
          opacity: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        });
      }, whyRef);

      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    // VALUES section: professional, noticeable animation
    if (! valuesRef.current) return;

    const ctx = gsap. context(() => {
      const badges = valuesRef.current.querySelectorAll("[data-value-badge]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 75%",
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(valuesRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.7,
      }). from(
        badges,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15,
        },
        "-=0.2"
      );

      // Gentle hover-like pulse after appearing
      badges.forEach((badge, i) => {
        gsap.to(badge, {
          scale: 1.02,
          duration: 2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, valuesRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // ABOUT + CONTACT sections subtle scroll-in
    const setupSectionReveal = (ref) => {
      if (! ref. current) return;
      const ctx = gsap.context(() => {
        gsap.from(ref.current, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "power2.out",
        });
      }, ref);
      return ctx;
    };

    const aboutCtx = setupSectionReveal(aboutRef);
    const contactCtx = setupSectionReveal(contactRef);

    return () => {
      aboutCtx?. revert();
      contactCtx?.revert();
    };
  }, []);

  useEffect(() => {
    // Gentle floating/parallax for hero badges (infinite, very subtle)
    if (! heroBadgesRef.current) return;

    const ctx = gsap.context(() => {
      const badges = heroBadgesRef. current.children;
      gsap.to(badges[0], {
        y: -4,
        repeat: -1,
        yoyo: true,
        duration: 2.4,
        ease: "sine. inOut",
      });
      if (badges[1]) {
        gsap. to(badges[1], {
          y: 4,
          repeat: -1,
          yoyo: true,
          duration: 2.8,
          ease: "sine. inOut",
        });
      }
    }, heroBadgesRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-background text-primary-dark">
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light/80 to-primary-dark/90 opacity-95" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
          <div ref={heroRef} className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-accent/40 bg-accent-dark/40 px-3 py-1 text-sm font-semibold uppercase tracking-[0.15em] text-secondary-light">
              TriVantage Learning Institute
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Empowering Learners.  <br className="hidden sm:block" />
              Building Careers.  <br className="hidden sm:block" />
              <span className="text-secondary-light">Creating Pathways. </span>
            </h1>
            <p className="max-w-xl text-base sm:text-lg text-secondary-light/90">
              TriVantage Learning Institute delivers career-focused education
              with 80+ years of collective expertise in healthcare, education,
              and leadership. 
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-2. 5 text-base font-semibold text-white border border-primary hover:bg-secondary-light transition"
              >
                APPLY NOW
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-full border border-secondary/70 bg-primary-dark/40 px-6 py-2.5 text-base font-semibold text-secondary-light hover:bg-primary-light/60 transition"
              >
                EXPLORE PROGRAMS
              </Link>
            </div>

            <p className="text-sm sm:text-base text-secondary-light/80">
              Virtual training certificate courses for your future.
            </p>
          </div>

          <div className="relative" ref={heroImageRef}>
            <div className="relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-secondary-dark/30 bg-surface shadow-xl shadow-primary-dark/40">
              <Image
                src="/hero.jpg"
                alt="Learners at TriVantage Learning Institute"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 320px, 100vw"
                priority
              />
            </div>

            <div ref={heroBadgesRef} className="pointer-events-none">
              <div className="absolute -bottom-6 -left-4 w-36 sm:w-40 rounded-2xl border border-accent/40 bg-primary-dark/90 p-3 text-sm text-secondary-light shadow-lg shadow-primary-dark/60">
                <p className="font-semibold text-secondary">
                  80+ years collective expertise
                </p>
                <p className="text-xs text-secondary-light/90">
                  Healthcare • Education • Leadership
                </p>
              </div>

              <div className="absolute -top-6 -right-4 w-32 sm:w-36 rounded-2xl border border-secondary/40 bg-secondary-dark/90 p-2. 5 text-xs text-primary-dark shadow-lg shadow-primary-dark/60">
                <p className="font-semibold">Virtual Training</p>
                <p className="text-[11px]">
                  Certificate courses for your future. 
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESS | EMPOWERMENT | OPPORTUNITY */}
      <section
        ref={valuesRef}
        className="relative border-b border-border bg-primary-dark text-secondary-light"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-10 sm:py-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0. 3em] text-secondary-light/80 mb-2">
              Our Promise
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Access.  Empowerment. Opportunity. 
            </h2>
            <p className="mt-2 text-sm sm:text-base text-secondary-light/85">
              Every program is built to expand access to high-quality learning,
              empower diverse learners, and create real pathways to opportunity
              across Canada. 
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            {[
              { label: "Access", sub: "Inclusive & flexible learning" },
              { label: "Empowerment", sub: "Skills with real impact" },
              { label: "Opportunity", sub: "Career-focused pathways" },
            ].map((item) => (
              <div
                key={item.label}
                data-value-badge
                className="min-w-[150px] rounded-2xl border border-secondary/40 bg-primary-dark/60 px-4 py-3 shadow-sm shadow-primary-dark/50"
              >
                <p className="text-base font-semibold">{item.label}</p>
                <p className="mt-1 text-xs text-secondary-light/80">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-surface border-top border-border" ref={whyRef}>
        <div className="max-w-6xl mx-auto px-6 py-14 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-primary">
                Why Choose Us?
              </h2>
              <p className="mt-2 max-w-xl text-base text-primary/80">
                Designed for busy learners, newcomers, and internationally
                educated professionals who want flexible, workforce-ready
                education.
              </p>
            </div>
            <p className="text-base font-medium text-accent">
              Hybrid • In‑Person • Workforce‑Ready
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Experienced faculty team",
              "Employer & community partnerships",
              "Flexible delivery (hybrid, in-person)",
              "Support for newcomers & internationally educated professionals",
              "Flexible learning",
              "Career-focused certificate courses",
            ].map((item) => (
              <div
                key={item}
                data-why-card
                className="relative overflow-hidden rounded-2xl border border-border bg-background/80 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-primary-dark shadow-sm">
                  ✔
                </div>
                <p className="pl-5 text-base font-medium text-primary">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <p className="text-sm sm:text-base text-primary/70">
              Virtual training certificate courses tailored for your future.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center text-base font-semibold text-accent hover:text-accent-light"
            >
              Start Now
              <span className="ml-1">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section
        className="bg-background border-y border-border"
        ref={aboutRef}
      >
        <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary mb-4">
              About Us
            </h2>
            <p className="text-base text-primary/80 mb-4">
              <span className="font-semibold">Our Story:</span> Founded to
              empower learners with practical, inclusive education that leads
              to real career success.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <h3 className="text-base font-semibold text-primary">Mission</h3>
                <p className="mt-1 text-sm text-primary/80">
                  Deliver accessible, workforce-ready programs. 
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <h3 className="text-base font-semibold text-primary">Vision</h3>
                <p className="mt-1 text-sm text-primary/80">
                  To be a leader in innovative education pathways across
                  Canada.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 mb-4">
              <h3 className="text-base font-semibold text-primary">Our Team</h3>
              <p className="mt-1 text-sm text-primary/80">
                Over 80 years of combined expertise in healthcare, compliance,
                cultural competency, and education.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-primary/80">
                Core Values:
              </span>
              <span className="rounded-full bg-secondary-light px-3 py-1 text-primary text-xs">
                Inclusivity
              </span>
              <span className="rounded-full bg-secondary-light px-3 py-1 text-primary text-xs">
                Integrity
              </span>
              <span className="rounded-full bg-secondary-light px-3 py-1 text-primary text-xs">
                Excellence
              </span>
              <span className="rounded-full bg-secondary-light px-3 py-1 text-primary text-xs">
                Empowerment
              </span>
            </div>

            <Link
              href="/about"
              className="mt-5 inline-flex text-base font-semibold text-accent hover:text-accent-light"
            >
              Learn more about TriVantage
            </Link>
          </div>

          <div className="grid gap-4">
            <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden border border-border bg-surface">
              <Image
                src="/serv1.jpg"
                alt="Virtual training environment"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 100vw"
              />
            </div>
            <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden border border-border bg-surface">
              <Image
                src="/serv3.jpg"
                alt="TriVantage Learning Institute"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW */}
      <section
        className="bg-primary-dark text-secondary-light"
        ref={contactRef}
      >
        <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-secondary mb-2">
              Contact Us
            </h2>
            <p className="text-base text-secondary-light/90 mb-4">
              Have questions about our programs, admissions, or corporate
              training?  Reach out and our team will follow up. 
            </p>

            <form className="space-y-4 text-sm sm:text-base">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-secondary-light/90">
                    First name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-secondary-dark/60 bg-primary-dark/40 px-3 py-2 text-secondary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-secondary-light/90">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-secondary-dark/60 bg-primary-dark/40 px-3 py-2 text-secondary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-secondary-light/90">
                  Email*
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-secondary-dark/60 bg-primary-dark/40 px-3 py-2 text-secondary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-secondary-light/90">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-secondary-dark/60 bg-primary-dark/40 px-3 py-2 text-secondary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block mb-1 text-secondary-light/90">
                  Message*
                </label>
                <textarea
                  className="w-full rounded-lg border border-secondary-dark/60 bg-primary-dark/40 px-3 py-2 text-secondary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={4}
                  placeholder="How can we help?"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-2.5 text-base font-semibold text-primary hover:bg-secondary-light transition"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <p className="font-semibold text-secondary">
              Virtual Training Certificate Courses for Your Future
            </p>
            <p className="text-secondary-light/90">
              Our specialized programs equip you with actionable skills for
              enhanced career opportunities and personal growth.
            </p>
            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden border border-secondary-dark/50 bg-primary-light/20">
              <Image
                src="/serv2.jpg"
                alt="learning illustration"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 100vw"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}