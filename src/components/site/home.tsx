import { Check, Clock, MapPin } from "lucide-react";
import { ActionBar } from "@/components/site/action-bar";
import { BookingForm } from "@/components/site/booking-form";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { InquiryForm } from "@/components/site/inquiry-form";
import { CLINIC } from "@/lib/cms/defaults";
import type { SitePayload } from "@/lib/cms/types";

const JOURNEY = [
  { n: "01", t: "Antenatal", p: "Your file, your dates, check-ups through every trimester — same midwives." },
  { n: "02", t: "Prepare", p: "Classes, a birth plan, and what happens if the plan has to change." },
  { n: "03", t: "Birth", p: "A midwife stays with you. Hospital referral the moment you need it." },
  { n: "04", t: "Home", p: "Recovery, latch, newborn weight — at the clinic or at your house." },
  { n: "05", t: "Year one", p: "Immunisations, growth, next appointment already booked." },
];

const BANDS = [
  {
    img: "/images/photo-handover.jpg",
    alt: "Midwife placing a newborn into her mother's arms",
    k: "Birth",
    t: "Birthing services",
    p: "A private suite. The same team, day or night. We transfer immediately if a birth needs a hospital.",
    href: "/#booking",
    cta: "Book a birth consultation",
    dark: true,
    flip: false,
  },
  {
    img: "/images/photo-mother-baby.jpg",
    alt: "Mother and midwife with a newborn",
    k: "After birth",
    t: "Postnatal clinic",
    p: "Recovery, breastfeeding, newborn weight, and how you actually feel — for you and the baby.",
    href: "/#booking",
    cta: "Book a postnatal visit",
    dark: false,
    flip: true,
  },
  {
    img: "/images/photo-swaddled.jpg",
    alt: "Midwife holding a swaddled newborn",
    k: "Paediatric",
    t: "Child welfare",
    p: "Immunisations, growth monitoring, developmental checks. Every dose tracked.",
    href: "/#booking",
    cta: "Book a welfare check",
    dark: true,
    flip: false,
  },
];

const ALSO = [
  ["Antenatal care", "Check-ups and screening, every trimester."],
  ["Classes", "Breathing, positions, the day of labour."],
  ["Ultrasound", "Dating, anomaly and growth scans on site."],
  ["Laboratory", "Bloods, urinalysis, maternal screening."],
  ["Doula & wellness", "Companionship in labour. Mental-health support."],
  ["Family planning", "Confidential counselling and options."],
];

const CHECKS = [
  "Midwives on site 24 hours — not on call from home",
  "Private birthing rooms",
  "Hospital referral protocols",
  "Lab and ultrasound in the building",
];

export function HomePage({ data }: { data: SitePayload }) {
  const { content, hero, gallery, testimonials, faqs } = data;
  const lead = testimonials[0];
  const rest = testimonials.slice(1);

  return (
    <div className="bg-paper pb-16 md:pb-0">
      <SiteHeader />
      <Hero content={content} slides={hero} />

      <div className="bg-plum text-[12px] tracking-[0.16em] text-white/80 uppercase">
        <p className="site-wrap flex flex-wrap gap-x-10 gap-y-2 py-3">
          <span className="text-gold">5.0 Google</span>
          <span>Open 24 / 7</span>
          <span>KMHFR licensed</span>
          <span>Kahawa Wendani</span>
        </p>
      </div>

      <section className="py-16 md:py-24">
        <div className="site-wrap max-w-4xl">
          <h2 className="font-display text-[clamp(2.6rem,6vw,4.8rem)] leading-[1.02] text-ink">{content.introTitle}</h2>
          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ink-mid">{content.introBody1}</p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-mid">{content.introBody2}</p>
        </div>
        <img src="/images/team-main.jpg" alt="Divine Birth team with newborns" className="mt-12 h-[min(52vw,480px)] w-full object-cover" />
      </section>

      <section id="journey" className="scroll-mt-20 border-y border-border py-16 md:py-24">
        <div className="site-wrap">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-teal uppercase">Pathway</p>
          <h2 className="font-display mt-2 text-[clamp(2rem,4vw,3.2rem)] text-ink">First scan to first birthday.</h2>
          <ol className="mt-12 divide-y divide-border border-y border-border">
            {JOURNEY.map((s) => (
              <li key={s.n} className="grid gap-2 py-6 md:grid-cols-[4.5rem_12rem_1fr] md:items-baseline">
                <span className="font-display text-2xl text-teal">{s.n}</span>
                <h3 className="font-display text-2xl text-ink">{s.t}</h3>
                <p className="text-[15px] text-ink-mid">{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="services" className="scroll-mt-20">
        {BANDS.map((b) => (
          <article key={b.t} className="grid lg:grid-cols-2">
            <img
              src={b.img}
              alt={b.alt}
              className={`h-[320px] w-full object-cover lg:h-[min(70vh,560px)] ${b.flip ? "lg:order-2" : ""}`}
            />
            <div
              className={`flex flex-col justify-center px-6 py-12 sm:px-12 ${
                b.dark ? "bg-plum text-white" : "bg-cream text-ink"
              } ${b.flip ? "lg:order-1" : ""}`}
            >
              <p className={`text-[11px] font-semibold tracking-[0.22em] uppercase ${b.dark ? "text-gold" : "text-teal"}`}>{b.k}</p>
              <h3 className="font-display mt-3 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">{b.t}</h3>
              <p className={`mt-4 max-w-md text-[15px] leading-relaxed ${b.dark ? "text-white/75" : "text-ink-mid"}`}>{b.p}</p>
              <a href={b.href} className={`mt-6 text-sm font-semibold ${b.dark ? "text-gold" : "text-teal"}`}>
                {b.cta} →
              </a>
            </div>
          </article>
        ))}
        <a href={`tel:${CLINIC.phonePrimary}`} className="flex flex-col gap-1 bg-teal px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <span>
            <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">Always on site</span>
            <span className="font-display text-3xl">24 / 7 emergency care</span>
          </span>
          <span className="text-sm font-semibold">Call {CLINIC.phonePrimaryDisplay} →</span>
        </a>
        <div className="site-wrap py-16">
          <h3 className="font-display text-3xl text-ink">Also in the building</h3>
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3">
            {ALSO.map(([t, p]) => (
              <li key={t} className="border-t border-border py-5 pr-6">
                <h4 className="font-semibold text-ink">{t}</h4>
                <p className="mt-1 text-sm text-ink-mid">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="booking" className="scroll-mt-20 bg-plum py-16 text-white md:py-24">
        <div className="site-wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">Appointments</p>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]">Come in.</h2>
            <p className="mt-4 max-w-sm text-[15px] text-white/70">
              Pick a day. We save it, archive it, and send it to the midwives. In labour? Call. Do not wait on a form.
            </p>
            <p className="mt-8 text-sm text-white/55">{CLINIC.hours}</p>
          </div>
          <div className="bg-paper p-1 text-ink">
            <BookingForm />
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 grid lg:grid-cols-2">
        <img src="/images/hero4.jpg" alt="Midwife holding a newborn" className="h-[360px] w-full object-cover object-[center_18%] lg:h-full lg:min-h-[560px]" />
        <div className="flex flex-col justify-center bg-paper px-6 py-14 sm:px-12">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-teal uppercase">The centre</p>
          <h2 className="font-display mt-3 text-[clamp(1.9rem,3.5vw,2.8rem)] leading-[1.08] text-ink">{content.aboutTitle}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-mid">{content.aboutBody1}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-mid">{content.aboutBody2}</p>
          <ul className="mt-6 space-y-2">
            {CHECKS.map((c) => (
              <li key={c} className="flex gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-20 bg-plum-deep py-16">
        <div className="site-wrap mb-8">
          <h2 className="font-display text-4xl text-white">Inside the rooms.</h2>
        </div>
        <div className="site-wrap mosaic">
          {(gallery.length ? gallery : []).slice(0, 5).map((g) => (
            <figure key={g.id}>
              <img src={g.url} alt={g.alt || g.title} />
            </figure>
          ))}
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-20 py-16 md:py-24">
        <div className="site-wrap">
          {lead ? (
            <blockquote>
              <p className="font-display text-[clamp(1.8rem,4.2vw,3.4rem)] leading-[1.1] text-ink">“{lead.quote}”</p>
              <footer className="mt-6 text-[12px] tracking-[0.16em] text-teal uppercase">{lead.author}</footer>
            </blockquote>
          ) : null}
          {rest.length ? (
            <div className="mt-14 grid gap-10 border-t border-border pt-10 md:grid-cols-2">
              {rest.map((t) => (
                <article key={t.id}>
                  <p className="text-[17px] leading-relaxed text-ink-mid">“{t.quote}”</p>
                  <p className="mt-4 text-[11px] tracking-[0.16em] text-ink-soft uppercase">{t.author}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-teal py-20 text-center text-white md:py-28">
        <div className="site-wrap">
          <h2 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.9]">
            {content.statementLine1}
            <br />
            <em className="italic">{content.statementLine2}</em>
          </h2>
          <a href="/#booking" className="mt-10 inline-flex h-12 items-center bg-plum px-8 text-sm font-semibold text-white">
            Book an appointment
          </a>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 py-16 md:py-24">
        <div className="site-wrap grid gap-10 lg:grid-cols-[16rem_1fr]">
          <h2 className="font-display text-4xl text-ink">Before you ask.</h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <details key={f.id} className="faq-item group py-5">
                <summary className="flex cursor-pointer list-none justify-between gap-4 font-semibold">
                  {f.question}
                  <span className="text-teal">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm text-ink-mid">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 bg-cream py-16 md:py-24">
        <div className="site-wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl text-ink">Find us.</h2>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-2"><MapPin className="size-4 text-teal" />{CLINIC.addressLine1}, {CLINIC.addressLine2}</li>
              <li className="flex gap-2"><Clock className="size-4 text-teal" />{CLINIC.hours}</li>
            </ul>
            <p className="mt-6 font-display text-3xl">
              <a href={`tel:${CLINIC.phonePrimary}`}>{CLINIC.phonePrimaryDisplay}</a>
            </p>
            <p className="mt-2 text-sm">
              <a className="text-teal" href={`mailto:${CLINIC.emailPrimary}`}>{CLINIC.emailPrimary}</a>
            </p>
            <iframe title="Map" src={CLINIC.mapsEmbed} className="mt-8 h-64 w-full border border-border" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <InquiryForm />
        </div>
      </section>

      <section id="downloads" className="site-wrap flex flex-wrap items-center justify-between gap-4 py-12">
        <h2 className="font-display text-2xl">Printable materials</h2>
        <div className="flex gap-3">
          <a href="/docs/Divine_Birth_Brochure.pdf" download className="border border-ink px-4 py-2 text-sm font-semibold">Brochure</a>
          <a href="/docs/Divine_Birth_Pullup_Banner.pdf" download className="border border-ink px-4 py-2 text-sm font-semibold">Banner</a>
        </div>
      </section>

      <SiteFooter />
      <ActionBar />
    </div>
  );
}
