import { useEffect, useState } from "react";
import type { HomepageContent, MediaItem } from "@/lib/cms/types";
import { CLINIC } from "@/lib/cms/defaults";

export function Hero({ content, slides }: { content: HomepageContent; slides: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const photos = slides.length
    ? slides
    : [
        {
          id: "f",
          url: "/images/photo-midwife-newborn.jpg",
          alt: "A Divine Birth midwife holding a newborn",
          title: "",
          caption: "",
          category: "",
          kind: "hero" as const,
          sortOrder: 0,
          createdAt: "",
        },
      ];

  useEffect(() => {
    if (photos.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % photos.length), 7000);
    return () => window.clearInterval(t);
  }, [photos.length]);

  return (
    <section className="relative" aria-labelledby="heroHeading">
      <div className="relative h-[62svh] min-h-[340px] overflow-hidden bg-plum-deep md:h-[72svh]">
        {photos.map((s, i) => (
          <div key={s.id} className={i === index ? "hero-slide is-active" : "hero-slide"}>
            <img src={s.url} alt={s.alt || ""} width={1600} height={2000} fetchPriority={i === 0 ? "high" : "low"} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/55 via-transparent to-plum-deep/15" />
        <div className="absolute right-5 bottom-5 z-10 flex gap-1.5" role="tablist" aria-label="Photos">
          {photos.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Photo ${i + 1}`}
              className={i === index ? "h-1.5 w-6 rounded-full bg-gold" : "h-1.5 w-2.5 rounded-full bg-white/60"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      <div className="site-wrap relative -mt-16 mb-4 md:-mt-24">
        <div className="max-w-xl rounded-2xl border border-border bg-paper p-6 shadow-soft sm:p-8">
          <p className="text-sm font-medium text-teal">{content.heroTag}</p>
          <h1 id="heroHeading" className="font-display mt-2 text-[clamp(1.85rem,4.6vw,3.1rem)] leading-[1.15] text-ink">
            {content.heroTitleLine1} {content.heroTitleEm}
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-mid">{content.heroSub}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/#booking"
              className="inline-flex h-11 items-center rounded-full bg-teal px-5 text-sm font-semibold text-white hover:bg-teal-dark"
            >
              Book a clinic visit
            </a>
            <a
              href={`tel:${CLINIC.phonePrimary}`}
              className="inline-flex h-11 items-center rounded-full border border-ink/20 bg-cream px-5 text-sm font-semibold text-ink hover:bg-warm"
            >
              Call {CLINIC.phonePrimaryDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
