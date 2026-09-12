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
    <section className="relative h-[min(92svh,900px)] overflow-hidden bg-plum-deep" aria-labelledby="heroHeading">
      {photos.map((s, i) => (
        <div key={s.id} className={i === index ? "hero-slide is-active" : "hero-slide"}>
          <img src={s.url} alt={s.alt || ""} width={1600} height={1100} fetchPriority={i === 0 ? "high" : "low"} />
        </div>
      ))}
      <div className="hero-veil pointer-events-none absolute inset-0" />
      <div className="absolute inset-0 flex items-end">
        <div className="site-wrap w-full pb-16 pt-28 md:pb-20">
          <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">{content.heroTag}</p>
          <h1
            id="heroHeading"
            className="font-display mt-4 max-w-3xl text-5xl leading-[1.02] font-medium tracking-[-0.03em] text-balance text-white sm:text-6xl lg:text-7xl"
          >
            {content.heroTitleLine1}{" "}
            <em className="italic text-gold">{content.heroTitleEm}</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-white/80 md:text-lg">{content.heroSub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/#booking"
              className="inline-flex h-12 items-center rounded-md bg-teal px-6 text-sm font-semibold text-white hover:bg-teal-dark"
            >
              Book a consultation
            </a>
            <a
              href={`tel:${CLINIC.phonePrimary}`}
              className="inline-flex h-12 items-center rounded-md border border-white/35 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              Call {CLINIC.phonePrimaryDisplay}
            </a>
          </div>
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Slides">
            {photos.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                className={i === index ? "h-0.5 w-8 bg-gold" : "h-0.5 w-4 bg-white/40"}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
