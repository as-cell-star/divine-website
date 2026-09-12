import { CLINIC } from "@/lib/cms/defaults";

export function SiteFooter() {
  return (
    <footer className="bg-plum-deep text-white/70">
      <div className="site-wrap grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <img
            src="/images/logo-lockup-light.png"
            alt={CLINIC.name}
            width={180}
            height={167}
            className="mb-5 w-36 object-contain"
          />
          <p className="font-display text-xl text-white">Divine Birth</p>
          <p className="mt-1 text-sm text-gold">{CLINIC.tagline}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            A midwifery-led birthing centre in Kahawa Wendani, Nairobi — compassionate, personalised, family-centred care, open every hour of the year.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-white/50 uppercase">Services</h4>
          <ul className="space-y-2 text-sm">
            {["Birthing Services", "Antenatal Care", "Postnatal Clinic", "Doula & Wellness", "Family Planning", "Lab & Ultrasound", "Child Welfare"].map((s) => (
              <li key={s}>
                <a href="/#services" className="hover:text-gold">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-white/50 uppercase">Information</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#about" className="hover:text-gold">About us</a></li>
            <li><a href="/#booking" className="hover:text-gold">Book appointment</a></li>
            <li><a href="/#testimonials" className="hover:text-gold">Patient reviews</a></li>
            <li><a href="/#gallery" className="hover:text-gold">Gallery</a></li>
            <li><a href="/#downloads" className="hover:text-gold">Downloads</a></li>
            <li><a href="/admin" className="hover:text-gold">Staff login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-white/50 uppercase">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={`tel:${CLINIC.phonePrimary}`} className="hover:text-gold">{CLINIC.phonePrimaryDisplay}</a></li>
            <li><a href={`tel:${CLINIC.phoneSecondary}`} className="hover:text-gold">{CLINIC.phoneSecondaryDisplay}</a></li>
            <li><a href={`mailto:${CLINIC.emailPrimary}`} className="hover:text-gold">{CLINIC.emailPrimary}</a></li>
            <li><a href="/#contact" className="hover:text-gold">Kahawa Wendani, Nairobi</a></li>
            <li>Open 24 / 7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-wrap flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Divine Birth Midwifery Centre · All rights reserved</span>
          <span>5.0 Google rating · Licensed KMHFR facility</span>
        </div>
      </div>
    </footer>
  );
}
