import { Clock, MapPin, Phone } from "lucide-react";
import { ActionBar } from "@/components/site/action-bar";
import { BookingForm } from "@/components/site/booking-form";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { InquiryForm } from "@/components/site/inquiry-form";
import { CLINIC } from "@/lib/cms/defaults";
import type { SitePayload } from "@/lib/cms/types";

const SERVICES = [
  {
    img: "/images/photo-handover.jpg",
    alt: "A midwife placing a newborn into the mother’s arms",
    t: "Labour and delivery",
    p: "Private birthing rooms with a midwife on duty throughout labour. Referral to hospital if theatre is needed.",
  },
  {
    img: "/images/photo-mother-baby.jpg",
    alt: "A mother with her newborn and a midwife",
    t: "Antenatal clinic",
    p: "Check-ups, screening and a birth plan through each trimester, with the same team where possible.",
  },
  {
    img: "/images/photo-swaddled.jpg",
    alt: "A midwife holding a swaddled newborn",
    t: "Postnatal care",
    p: "Recovery, breastfeeding support, newborn weight and a booked return visit after discharge.",
  },
  {
    img: "/images/photo-twins.jpg",
    alt: "Two midwives each holding a newborn",
    t: "Child welfare clinic",
    p: "Immunisation, growth monitoring and developmental checks, with doses recorded on the child’s card.",
  },
  {
    img: "/images/hero2.jpg",
    alt: "Care at Divine Birth Midwifery Centre",
    t: "Ultrasound and laboratory",
    p: "Dating, anomaly and growth scans, plus maternal blood and urine tests on the same premises.",
  },
  {
    img: "/images/photo-midwife-blue.jpg",
    alt: "A midwife at the clinic",
    t: "Family planning",
    p: "Counselling and contraception after birth, in a private consultation.",
  },
];

const STAGES = [
  { t: "Pregnancy", p: "Antenatal visits, classes and scans. Your file stays at this centre." },
  { t: "Labour", p: "A midwife remains with you. Hospital transfer is arranged if the birth needs theatre." },
  { t: "After birth", p: "Feeding, examination of mother and baby, and a postnatal appointment." },
  { t: "First year", p: "Immunisation and growth clinic. The next date is written on the card." },
];

const FACTS = [
  ["Hours", CLINIC.hours],
  ["Location", "Alvo House, Kahawa Wendani"],
  ["Telephone", CLINIC.phonePrimaryDisplay],
  ["Licence", "KMHFR registered maternity centre"],
];

export function HomePage({ data }: { data: SitePayload }) {
  const { content, hero, gallery, testimonials, faqs } = data;

  return (
    <div className="bg-cream pb-16 md:pb-0">
      <SiteHeader />
      <Hero content={content} slides={hero} />

      <section className="site-wrap grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map(([k, v]) => (
          <div key={k} className="bg-paper px-5 py-4">
            <p className="text-[11px] font-semibold tracking-wide text-ink-soft uppercase">{k}</p>
            <p className="mt-1 text-sm font-medium text-ink">{v}</p>
          </div>
        ))}
      </section>

      <section className="site-wrap grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-sm font-medium text-teal">{content.introEyebrow}</p>
          <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-ink">{content.introTitle}</h2>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-mid">{content.introBody1}</p>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-mid">{content.introBody2}</p>
        </div>
        <img
          src="/images/team-main.jpg"
          alt="Divine Birth midwives with newborns"
          className="h-[min(52vw,420px)] w-full rounded-2xl object-cover"
        />
      </section>

      <section id="services" className="scroll-mt-24 bg-paper py-16 md:py-24">
        <div className="site-wrap">
          <p className="text-sm font-medium text-teal">Services</p>
          <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">What the centre provides</h2>
          <p className="mt-3 max-w-2xl text-[16px] text-ink-mid">
            All of the following are offered on site. Book a clinic appointment below, or telephone if you are already in labour.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <article key={s.t} className="overflow-hidden rounded-2xl border border-border bg-cream">
                <img src={s.img} alt={s.alt} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-xl text-ink">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-mid">{s.p}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="scroll-mt-24 py-16 md:py-24">
        <div className="site-wrap">
          <p className="text-sm font-medium text-teal">From pregnancy to the first year</p>
          <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">How care is organised</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-border bg-paper p-5">
                <span className="text-sm font-semibold text-teal">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-xl text-ink">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mid">{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="booking" className="scroll-mt-24 bg-plum py-16 text-cream md:py-24">
        <div className="site-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-gold">Appointments</p>
            <h2 className="font-display mt-2 text-[clamp(1.9rem,3.5vw,2.7rem)] leading-tight">Book a clinic visit</h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-cream/80">
              Use this form for antenatal, postnatal, scans and child clinic. The request is saved for the midwives and a copy is emailed to the centre.
            </p>
            <p className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed">
              <strong className="font-semibold text-gold">If you are in labour, do not use this form.</strong> Call {CLINIC.phonePrimaryDisplay} and come to the centre.
            </p>
            <p className="mt-6 text-sm text-cream/60">{CLINIC.hours}</p>
          </div>
          <div className="rounded-2xl bg-paper p-1 text-ink shadow-soft">
            <BookingForm />
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 py-16 md:py-24">
        <div className="site-wrap grid items-center gap-10 lg:grid-cols-2">
          <img
            src="/images/hero4.jpg"
            alt="A Divine Birth midwife holding a newborn"
            className="h-[360px] w-full rounded-2xl object-cover object-[center_18%] lg:h-[480px]"
          />
          <div>
            <p className="text-sm font-medium text-teal">About</p>
            <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-ink">{content.aboutTitle}</h2>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-mid">{content.aboutBody1}</p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-mid">{content.aboutBody2}</p>
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 bg-paper py-16 md:py-24">
        <div className="site-wrap">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">At the centre</h2>
          <p className="mt-2 max-w-xl text-[16px] text-ink-mid">Photographs from Divine Birth Midwifery Centre, Kahawa Wendani.</p>
          <div className="mosaic mt-8">
            {(gallery.length ? gallery : []).slice(0, 5).map((g) => (
              <figure key={g.id}>
                <img src={g.url} alt={g.alt || g.title} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-24 py-16 md:py-24">
        <div className="site-wrap">
          <p className="text-sm font-medium text-teal">Google reviews · {CLINIC.rating}</p>
          <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">What families have written</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="rounded-2xl border border-border bg-paper p-6">
                <p className="text-[15px] leading-relaxed text-ink">“{t.quote}”</p>
                <footer className="mt-4 text-sm text-ink-soft">{t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal py-12 text-white md:py-16">
        <div className="site-wrap flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight">
              {content.statementLine1} {content.statementLine2}
            </h2>
            <p className="mt-2 text-sm text-white/85">Telephone {CLINIC.phonePrimaryDisplay}. The centre does not close.</p>
          </div>
          <a
            href={`tel:${CLINIC.phonePrimary}`}
            className="inline-flex h-12 items-center rounded-full bg-plum px-6 text-sm font-semibold text-white"
          >
            Call the centre
          </a>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 py-16 md:py-24">
        <div className="site-wrap grid gap-10 lg:grid-cols-[18rem_1fr]">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">Common questions</h2>
            <p className="mt-3 text-sm text-ink-mid">If your question is not listed, call or send a message below.</p>
          </div>
          <div className="divide-y divide-border rounded-2xl border border-border bg-paper px-5">
            {faqs.map((f) => (
              <details key={f.id} className="faq-item group py-5">
                <summary className="flex cursor-pointer list-none justify-between gap-4 font-medium">
                  {f.question}
                  <span className="text-teal">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-mid">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-paper py-16 md:py-24">
        <div className="site-wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">Visit the centre</h2>
            <ul className="mt-6 space-y-3 text-[15px] text-ink-mid">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal" />
                {CLINIC.addressLine1}, {CLINIC.addressLine2}
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-teal" />
                {CLINIC.hours}
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-teal" />
                <a href={`tel:${CLINIC.phonePrimary}`}>{CLINIC.phonePrimaryDisplay}</a>
                <span aria-hidden="true"> · </span>
                <a href={`tel:${CLINIC.phoneSecondary}`}>{CLINIC.phoneSecondaryDisplay}</a>
              </li>
            </ul>
            <p className="mt-4 text-sm">
              <a className="text-teal hover:underline" href={`mailto:${CLINIC.emailPrimary}`}>
                {CLINIC.emailPrimary}
              </a>
            </p>
            <iframe
              title="Map of Divine Birth Midwifery Centre"
              src={CLINIC.mapsEmbed}
              className="mt-8 h-64 w-full rounded-2xl border border-border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div>
            <h3 className="font-display text-2xl text-ink">Send a message</h3>
            <p className="mt-2 mb-6 text-sm text-ink-mid">For clinic questions only. Labour cases should telephone.</p>
            <InquiryForm />
          </div>
        </div>
      </section>

      <section id="downloads" className="site-wrap flex flex-wrap items-center justify-between gap-4 py-12">
        <h2 className="font-display text-2xl text-ink">Brochures</h2>
        <div className="flex gap-3">
          <a href="/docs/Divine_Birth_Brochure.pdf" download className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold">
            Brochure (PDF)
          </a>
          <a href="/docs/Divine_Birth_Pullup_Banner.pdf" download className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold">
            Banner (PDF)
          </a>
        </div>
      </section>

      <SiteFooter />
      <ActionBar />
    </div>
  );
}
