import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { CLINIC } from "@/lib/cms/defaults";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#journey", label: "Journey" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200",
          scrolled ? "border-border bg-cream/95" : "border-transparent bg-cream/80",
        )}
      >
        <div className="site-wrap flex h-[4.25rem] items-center justify-between gap-4 md:h-[4.75rem]">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src="/images/logo-emblem.png"
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover ring-1 ring-gold/40"
            />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="font-display text-lg font-medium tracking-tight text-plum">Divine Birth</span>
              <span className="text-[11px] tracking-[0.16em] text-ink-soft uppercase">Midwifery Centre</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-ink-mid transition-colors hover:text-plum">
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${CLINIC.phonePrimary}`}
              className="hidden text-sm text-ink-mid xl:inline hover:text-plum"
            >
              {CLINIC.phonePrimaryDisplay}
            </a>
            <a
              href="/#booking"
              className="inline-flex h-10 items-center rounded-md bg-plum px-4 text-sm font-semibold text-white hover:bg-plum-deep"
            >
              Book
            </a>
          </nav>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center text-plum lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-x-0 top-[4.25rem] bottom-0 z-50 overflow-y-auto bg-cream lg:hidden">
          <nav className="site-wrap flex flex-col py-8" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-display text-2xl text-plum"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/#booking"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-plum text-sm font-semibold text-white"
            >
              Book an appointment
            </a>
            <a href={`tel:${CLINIC.phonePrimary}`} className="mt-3 text-center text-sm text-ink-mid">
              {CLINIC.phonePrimaryDisplay} · Open 24 / 7
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
