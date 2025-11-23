import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-12">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-primary/70">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-primary">
            TriVantage Learning Institute
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Virtual Training Certificate Courses</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="#" className="hover:text-accent">
            Instagram
          </a>
          <a href="#" className="hover:text-accent">
            Facebook
          </a>
          <a href="#" className="hover:text-accent">
            LinkedIn
          </a>
          <a href="#" className="hover:text-accent">
            YouTube
          </a>
          <a href="#" className="hover:text-accent">
            TikTok
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-3 text-[11px] text-primary/70">
          <Link href="#" className="hover:text-accent">
            Accessibility Statement
          </Link>
          <Link href="#" className="hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-accent">
            Terms &amp; Conditions
          </Link>
          <Link href="#" className="hover:text-accent">
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}