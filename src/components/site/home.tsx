import { ArrowRight, Check, Clock, FlaskConical, HeartHandshake, MapPin, Scan, ShieldCheck, Users } from "lucide-react";
import { ActionBar } from "@/components/site/action-bar";
import { BookingForm } from "@/components/site/booking-form";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { InquiryForm } from "@/components/site/inquiry-form";
import { CLINIC } from "@/lib/cms/defaults";
import type { SitePayload } from "@/lib/cms/types";

const JOURNEY = [
  { n: "01", t: "Booking & antenatal care", p: "We open your file, confirm dates, and begin scheduled check-ups — monitoring you and your baby through every trimester." },
  { n: "02", t: "Preparing for the day", p: "Antenatal classes, birth planning, and honest conversations about what you want — and what happens if plans need to change." },
  { n: "03", t: "Labour & birth", p: "A qualified midwife stays with you throughout. If your birth needs care beyond this centre, we stabilise and refer immediately." },
  { n: "04", t: "The first days at home", p: "Recovery checks, feeding and latch support, newborn weight, and your emotional wellbeing — at the clinic or at your home." },
  { n: "05", t: "Your child’s first year", p: "Immunisations, growth monitoring and developmental checks, so you always know what comes next and when to return." },
];

const FEATURED = [
  { img: "/images/photo-handover.jpg", chip: "Flagship", title: "Birthing Services", body: "Midwife-led deliveries in a calm, private suite. You are attended continuously by the same team, day or night.", href: "/#booking", cta: "Book a birth consultation" },
  { img: "/images/photo-mother-baby.jpg", chip: "Postnatal", title: "Postnatal Clinic", body: "Follow-up for you and your baby after birth — recovery, breastfeeding, newborn weight, and your emotional wellbeing.", href: "/#booking", cta: "Book a postnatal visit" },
  { img: "/images/photo-swaddled.jpg", chip: "Paediatric", title: "Child Welfare Clinic", body: "Immunisations, growth monitoring and developmental checks — every dose and milestone, clearly tracked.", href: "/#booking", cta: "Book a welfare check" },
  { img: "/images/photo-twins.jpg", chip: "Always open", title: "24 / 7 Emergency Care", body: "Babies do not keep office hours. A qualified midwife is on site around the clock, including public holidays.", href: `tel:${CLINIC.phonePrimary}`, cta: "Call the centre now" },
];

const ALSO = [
  { icon: HeartHandshake, t: "Antenatal Care", p: "Scheduled check-ups, monitoring and screening through every trimester." },
  { icon: Users, t: "Antenatal Classes & Exercise", p: "Preparation for labour — breathing, positions, and what to expect on the day." },
  { icon: Scan, t: "Ultrasound Scans", p: "Dating, anomaly and growth scans, reported on site." },
  { icon: FlaskConical, t: "Laboratory Services", p: "Routine bloods, urinalysis and maternal screening, processed in-house." },
  { icon: HeartHandshake, t: "Doula & Wellness Support", p: "Continuous companionship in labour, plus maternal mental-health support." },
  { icon: ShieldCheck, t: "Family Planning", p: "Confidential counselling and the full range of contraceptive options." },
];

const CHECKS = [
  "Highly qualified, experienced professional midwives",
  "Immaculately hygienic, calm and private birthing rooms",
  "Standby medical referral protocols for your safety",
  "On-site laboratory and ultrasound diagnostics",
  "Affordable, high-quality services for every family",
  "Mental health and maternal wellness support",
];

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="block text-xs font-semibold tracking-[0.22em] text-teal uppercase">{children}</span>
  );
}

export function HomePage({ data }: { data: SitePayload }) {
  const { content, hero, gallery, testimonials, faqs } = data;

  return (
    <div className="bg-cream pb-16 md:pb-0">
      <SiteHeader />
      <Hero content={content} slides={hero} />

      <section className="border-b border-border bg-cream" aria-label="Key facts">
        <div className="site-wrap grid grid-cols-2 md:grid-cols-4">
          {[
            { v: "5.0", l: "Google rating", s: "from verified reviews" },
            { v: "24/7", l: "Open every hour", s: "including public holidays" },
            { v: "1 team", l: "Start to finish", s: "no handovers between strangers" },
            { v: "KMHFR", l: "Licensed facility", s: "Ministry of Health register" },
          ].map((m, i) => (
            <div key={m.l} className={i === 0 ? "py-8 md:py-10" : "border-border py-8 md:border-l md:py-10 md:pl-8"}>
              <p className="font-display text-3xl tracking-tight text-plum md:text-4xl">{m.v}</p>
              <p className="mt-2 text-sm text-ink">{m.l}</p>
              <p className="text-sm text-ink-soft">{m.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="site-wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{content.introEyebrow}</Eyebrow>
            <span className="gold-rule mt-4" />
            <h2 className="font-display mt-5 max-w-lg text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] text-balance text-plum">
              {content.introTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-ink-mid">{content.introBody1}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-ink-mid">{content.introBody2}</p>
            <blockquote className="mt-8 border-l-2 border-gold pl-5 font-display text-xl leading-snug text-plum">
              “{content.introPull}”
            </blockquote>
            <a href="/#services" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal">
              Explore all services <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <img
                src="/images/team-main.jpg"
                alt="Divine Birth midwifery team with newborns"
                className="aspect-4/5 w-full object-cover"
                width={900}
                height={1125}
              />
            </div>
            <div className="absolute -bottom-5 left-5 border border-border bg-paper px-4 py-3 shadow-soft">
              <p className="text-sm font-semibold text-plum">5.0 Google rating</p>
              <p className="text-xs text-ink-soft">Kahawa Wendani, Nairobi</p>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="scroll-mt-24 border-y border-border bg-warm py-20 md:py-28">
        <div className="site-wrap">
          <Eyebrow>The Divine Birth pathway</Eyebrow>
          <span className="gold-rule mt-4" />
          <h2 className="font-display mt-5 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-balance text-plum">
            One team, from your first scan to your child’s first year.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ink-mid">
            You are not handed between strangers. The same midwifery team carries your care through every stage below.
          </p>
          <ol className="mt-14 divide-y divide-border border-y border-border">
            {JOURNEY.map((s) => (
              <li key={s.n} className="grid gap-3 py-8 md:grid-cols-[5rem_1fr_1.4fr] md:items-baseline md:gap-10">
                <span className="font-display text-3xl text-gold">{s.n}</span>
                <h3 className="font-display text-2xl text-plum">{s.t}</h3>
                <p className="text-sm leading-relaxed text-ink-mid md:text-base">{s.p}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-ink-mid">
            Every stage is available on its own — you do not have to start at 01.{" "}
            <a href="/#booking" className="font-semibold text-teal">
              Book any stage
            </a>
          </p>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 py-20 md:py-28">
        <div className="site-wrap">
          <Eyebrow>Midwifery & services</Eyebrow>
          <span className="gold-rule mt-4" />
          <h2 className="font-display mt-5 max-w-xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-balance text-plum">
            Comprehensive care, every step of the way.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {FEATURED.map((s) => (
              <article key={s.title} className="group relative min-h-[22rem] overflow-hidden rounded-lg md:min-h-[26rem]">
                <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="service-veil absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{s.chip}</p>
                  <h3 className="font-display mt-2 text-3xl text-white">{s.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">{s.body}</p>
                  <a href={s.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold">
                    {s.cta} <ArrowRight className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 border border-border bg-paper p-6 md:p-8">
            <h3 className="font-display text-2xl text-plum">Also available at the centre</h3>
            <p className="mt-2 max-w-xl text-sm text-ink-mid">
              Clinical and support services, available to mothers registered with Divine Birth — and to walk-in patients.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ALSO.map((s) => (
                <li key={s.t} className="flex gap-3">
                  <s.icon className="mt-0.5 size-5 shrink-0 text-teal" />
                  <div>
                    <h4 className="text-sm font-semibold text-plum">{s.t}</h4>
                    <p className="mt-1 text-sm text-ink-mid">{s.p}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a href="/#booking" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-teal">
              Book any of these services <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="booking" className="scroll-mt-24 bg-plum-deep py-20 text-white md:py-28">
        <div className="site-wrap grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Schedule a visit</p>
            <span className="gold-rule mt-4" />
            <h2 className="font-display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.08] text-balance">Book an appointment.</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
              Choose a date and time. Your request is saved, archived, and sent straight to the midwives. We confirm by SMS.
              For labour or anything urgent, call — we are open now.
            </p>
            <p className="mt-6 text-sm text-white/60">
              Open 24 / 7 · {CLINIC.phonePrimaryDisplay}
            </p>
          </div>
          <BookingForm />
        </div>
      </section>

      <section className="bg-plum py-20 text-white md:py-24">
        <div className="site-wrap">
          <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">How decisions get made</p>
          <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-balance">
            Nothing about your birth is decided without you.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="border border-white/15 bg-white/5 p-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">You and your family</p>
              <h3 className="font-display mt-2 text-2xl">What matters to you</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/72">
                Your birth plan, your fears, your faith, your family. You know your body and your circumstances better than anyone.
              </p>
            </div>
            <div className="border border-white/15 bg-white/5 p-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Your midwifery team</p>
              <h3 className="font-display mt-2 text-2xl">What the evidence shows</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/72">
                Clinical training, experience across hundreds of births, and clear referral protocols for the moment a birth needs more than we can safely give.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 py-20 md:py-28">
        <div className="site-wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-lg">
              <img src="/images/hero4.jpg" alt="Midwife holding newborn" className="aspect-4/5 w-full object-cover" />
            </div>
            <p className="mt-3 text-sm italic text-ink-mid">Every birth a sacred, irreplaceable moment.</p>
          </div>
          <div>
            <Eyebrow>About Divine Birth</Eyebrow>
            <span className="gold-rule mt-4" />
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,2.8rem)] leading-[1.1] text-balance text-plum">{content.aboutTitle}</h2>
            <p className="mt-5 text-base leading-relaxed text-pretty text-ink-mid">{content.aboutBody1}</p>
            <p className="mt-4 text-base leading-relaxed text-pretty text-ink-mid">{content.aboutBody2}</p>
            <ul className="mt-6 space-y-2.5">
              {CHECKS.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                  {c}
                </li>
              ))}
            </ul>
            <a
              href="/#booking"
              className="mt-8 inline-flex h-11 items-center rounded-md bg-teal px-5 text-sm font-semibold text-white hover:bg-teal-dark"
            >
              Book a consultation
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 bg-warm py-20 md:py-28">
        <div className="site-wrap">
          <Eyebrow>Our centre</Eyebrow>
          <span className="gold-rule mt-4" />
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.2rem)] text-plum">Real moments. Real care.</h2>
          <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {gallery.map((g, i) => (
              <figure key={g.id} className={i === 0 ? "col-span-2 row-span-2 overflow-hidden rounded-lg" : "overflow-hidden rounded-lg"}>
                <img
                  src={g.url}
                  alt={g.alt || g.title}
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: "4 / 5", minHeight: i === 0 ? 280 : 160 }}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-24 py-20 md:py-28">
        <div className="site-wrap">
          <Eyebrow>Patient reviews</Eyebrow>
          <span className="gold-rule mt-4" />
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.2rem)] text-plum">Mothers trust us.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {testimonials.map((t) => (
              <article key={t.id} className="border-t border-gold pt-6">
                <p className="font-display text-2xl leading-snug text-plum">“{t.quote}”</p>
                <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">{t.author}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 inline-flex items-center gap-2 text-sm text-ink-mid">
            <Clock className="size-3.5 text-teal" />
            5.0 on Google · {CLINIC.reviewCount} verified reviews · Alvo House, Kahawa Wendani
          </p>
        </div>
      </section>

      <section id="assurance" className="scroll-mt-24 border-y border-border bg-warm py-20 md:py-28">
        <div className="site-wrap">
          <Eyebrow>Safety & standards</Eyebrow>
          <span className="gold-rule mt-4" />
          <h2 className="font-display mt-5 max-w-xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-balance text-plum">
            Built on the things that must not fail.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="bg-plum p-6 text-white md:col-span-2 lg:col-span-1 lg:row-span-2">
              <span className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Always staffed</span>
              <h3 className="font-display mt-4 text-2xl">A qualified midwife on site, 24 hours a day</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/72">
                Labour does not keep office hours. Someone trained is here every hour of every day, including public holidays — not on call from home.
              </p>
            </article>
            {[
              ["Referral", "Clear escalation protocols", "If a birth needs care beyond a midwifery centre, we stabilise and transfer to a partner hospital immediately."],
              ["Registration", "A licensed Kenyan facility", "Listed on the Ministry of Health master facility register (KMHFR). You can verify us independently before you ever walk in."],
              ["Privacy", "Your records stay yours", "Clinical notes are kept confidential and shared only with the people involved in your care, or with your written consent."],
              ["Continuity", "The same team, start to finish", "You are not handed between strangers. The midwives who see you antenatally are the ones who attend your birth."],
            ].map(([k, t, p]) => (
              <article key={k} className="border border-border bg-paper p-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-teal uppercase">{k}</p>
                <h4 className="mt-2 text-base font-semibold text-plum">{t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-mid">{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-plum-deep py-20 text-center text-white md:py-24">
        <div className="site-wrap">
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.05] text-balance">
            {content.statementLine1}
            <br />
            <span className="italic text-gold">{content.statementLine2}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/72">Book a visit, ask a question, or simply come in. We are open right now.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/#booking" className="inline-flex h-12 items-center rounded-md bg-teal px-6 text-sm font-semibold text-white hover:bg-teal-dark">
              Book an appointment
            </a>
            <a href={`tel:${CLINIC.phonePrimary}`} className="inline-flex h-12 items-center rounded-md border border-white/35 px-6 text-sm font-semibold text-white">
              Call {CLINIC.phonePrimaryDisplay}
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 py-20 md:py-28">
        <div className="site-wrap max-w-3xl">
          <Eyebrow>Common questions</Eyebrow>
          <span className="gold-rule mt-4" />
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.2rem)] text-plum">Answers, before you ask.</h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <details key={f.id} className="faq-item group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-semibold text-plum">
                  {f.question}
                  <span className="mt-1 text-ink-soft group-open:hidden">+</span>
                  <span className="mt-1 hidden text-ink-soft group-open:inline">−</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-mid">{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-mid">
            Still unsure? Call{" "}
            <a className="font-semibold text-teal" href={`tel:${CLINIC.phonePrimary}`}>
              0794 444 141
            </a>{" "}
            or{" "}
            <a className="font-semibold text-teal" href={CLINIC.whatsapp} target="_blank" rel="noopener noreferrer">
              message us on WhatsApp
            </a>
            .
          </p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-warm py-20 md:py-28">
        <div className="site-wrap grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Find us</Eyebrow>
            <span className="gold-rule mt-4" />
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] text-plum">Get in touch.</h2>
            <ul className="mt-8 space-y-5">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 text-teal" />
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Address</p>
                  <p className="text-sm text-ink">
                    {CLINIC.addressLine1}
                    <br />
                    {CLINIC.addressLine2}
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 text-teal" />
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Hours</p>
                  <p className="text-sm text-ink">{CLINIC.hours}</p>
                </div>
              </li>
            </ul>
            <p className="mt-4 text-sm">
              <a className="font-semibold text-teal" href={`tel:${CLINIC.phonePrimary}`}>
                {CLINIC.phonePrimaryDisplay}
              </a>
              {" / "}
              <a className="font-semibold text-teal" href={`tel:${CLINIC.phoneSecondary}`}>
                {CLINIC.phoneSecondaryDisplay}
              </a>
            </p>
            <p className="mt-1 text-sm">
              <a className="text-teal" href={`mailto:${CLINIC.emailPrimary}`}>
                {CLINIC.emailPrimary}
              </a>
            </p>
            <div className="mt-8 overflow-hidden rounded-lg border border-border">
              <iframe
                title="Divine Birth Midwifery Centre"
                src={CLINIC.mapsEmbed}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>

      <section id="downloads" className="scroll-mt-24 py-20">
        <div className="site-wrap">
          <Eyebrow>Resources</Eyebrow>
          <span className="gold-rule mt-4" />
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.2rem)] text-plum">Download our materials.</h2>
          <p className="mt-3 text-sm text-ink-mid">Our brochure and pull-up banner — ready to share or print.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <a href="/docs/Divine_Birth_Brochure.pdf" download className="border border-border bg-paper p-6 hover:border-teal">
              <h3 className="font-display text-xl text-plum">Centre Brochure</h3>
              <p className="mt-2 text-sm text-ink-mid">Full service listing, vision, mission and core values. Ideal for expectant families.</p>
              <p className="mt-4 text-sm font-semibold text-teal">Download PDF</p>
            </a>
            <a href="/docs/Divine_Birth_Pullup_Banner.pdf" download className="border border-border bg-paper p-6 hover:border-teal">
              <h3 className="font-display text-xl text-plum">Pull-Up Banner</h3>
              <p className="mt-2 text-sm text-ink-mid">High-quality banner artwork with our full services list and contact details. Print-ready.</p>
              <p className="mt-4 text-sm font-semibold text-teal">Download PDF</p>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
      <ActionBar />
    </div>
  );
}
