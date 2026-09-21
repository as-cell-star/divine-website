import { CLINIC } from "@/lib/cms/defaults";

export function SiteFooter() {
  return (
    <footer className="bg-plum-deep text-cream/70">
      <div className="site-wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img
            src="/images/logo-lockup-light.png"
            alt={CLINIC.name}
            width={140}
            height={130}
            className="mb-4 w-28 object-contain"
          />
          <p className="font-display text-xl text-cream">Divine Birth Midwifery Centre</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            Licensed maternity facility in Kahawa Wendani, Nairobi. Antenatal care, labour and delivery, postnatal and child clinic. Open 24 hours.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-cream/40 uppercase">The centre</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/#services" className="hover:text-cream">
                Services
              </a>
            </li>
            <li>
              <a href="/#booking" className="hover:text-cream">
                Book an appointment
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-cream">
                About
              </a>
            </li>
            <li>
              <a href="/admin" className="hover:text-cream">
                Staff login
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-cream/40 uppercase">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`tel:${CLINIC.phonePrimary}`} className="hover:text-cream">
                {CLINIC.phonePrimaryDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CLINIC.emailPrimary}`} className="hover:text-cream">
                {CLINIC.emailPrimary}
              </a>
            </li>
            <li>
              {CLINIC.addressLine1}
              <br />
              {CLINIC.addressLine2}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-wrap flex flex-col gap-2 py-4 text-[11px] text-cream/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Divine Birth Midwifery Centre</span>
          <span>KMHFR licensed · Google {CLINIC.rating}</span>
        </div>
      </div>
    </footer>
  );
}
