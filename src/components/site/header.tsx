import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { CLINIC } from "@/lib/cms/defaults";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#journey", label: "Care" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "The centre" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Visit" },
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
          "sticky top-0 z-50 border-b bg-paper",
          scrolled ? "border-border" : "border-transparent",
        )}
      >
        <div className="site-wrap flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/images/logo-emblem.png" alt="" width={36} height={36} className="size-9 object-contain" />
            <span className="font-display text-[1.15rem] text-ink">Divine Birth</span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-[13px] text-ink-mid hover:text-teal">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={`tel:${CLINIC.phonePrimary}`} className="hidden text-[13px] text-ink-mid xl:inline">
              {CLINIC.phonePrimaryDisplay}
            </a>
            <a href="/#booking" className="inline-flex h-10 items-center bg-teal px-4 text-[13px] font-semibold text-white hover:bg-teal-dark">
              Book
            </a>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-paper lg:hidden">
          <nav className="site-wrap flex flex-col py-6">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-border py-4 font-display text-3xl">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
