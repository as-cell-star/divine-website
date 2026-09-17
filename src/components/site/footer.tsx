import { CLINIC } from "@/lib/cms/defaults";

export function SiteFooter() {
  return (
    <footer className="bg-plum-deep text-white/65">
      <div className="site-wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <img src="/images/logo-lockup-light.png" alt={CLINIC.name} width={160} height={148} className="mb-5 w-32 object-contain" />
          <p className="font-display text-2xl text-cream">Divine Birth</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            Midwifery-led birth in Kahawa Wendani. Open every hour of the year.
          </p>
        </div>
        <div>
          <p className="mb-3 text-[11px] tracking-[0.16em] text-white/40 uppercase">Visit</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/#booking" className="hover:text-cream">Book</a></li>
            <li><a href="/#services" className="hover:text-cream">Services</a></li>
            <li><a href="/#gallery" className="hover:text-cream">Gallery</a></li>
            <li><a href="/admin" className="hover:text-cream">Staff</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[11px] tracking-[0.16em] text-white/40 uppercase">Call</p>
          <ul className="space-y-2 text-sm">
            <li><a href={`tel:${CLINIC.phonePrimary}`} className="hover:text-cream">{CLINIC.phonePrimaryDisplay}</a></li>
            <li><a href={`mailto:${CLINIC.emailPrimary}`} className="hover:text-cream">{CLINIC.emailPrimary}</a></li>
            <li>Kahawa Wendani, Nairobi</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-wrap flex flex-col gap-2 py-4 text-[11px] text-white/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Divine Birth Midwifery Centre</span>
          <span>5.0 Google · KMHFR licensed</span>
        </div>
      </div>
    </footer>
  );
}
