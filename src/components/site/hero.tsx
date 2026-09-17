import { useEffect, useState } from "react";
import type { HomepageContent, MediaItem } from "@/lib/cms/types";
import { CLINIC } from "@/lib/cms/defaults";

export function Hero({ content, slides }: { content: HomepageContent; slides: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const photos = slides.length
    ? slides
    : [{ id: "f", url: "/images/photo-midwife-newborn.jpg", alt: "A Divine Birth midwife holding a newborn", title: "", caption: "", category: "", kind: "hero" as const, sortOrder: 0, createdAt: "" }];

  useEffect(() => {
    if (photos.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % photos.length), 6500);
    return () => window.clearInterval(t);
  }, [photos.length]);

  return (
    <section className="bg-paper lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2" aria-labelledby="heroHeading">
      <div className="relative h-[54svh] overflow-hidden bg-plum-deep lg:h-auto">
        {photos.map((s, i) => (
          <div key={s.id} className={i === index ? "hero-slide is-active" : "hero-slide"}>
            <img src={s.url} alt={s.alt || ""} width={1600} height={2000} fetchPriority={i === 0 ? "high" : "low"} />
          </div>
        ))}
        <div className="absolute right-5 bottom-5 flex gap-1.5" role="tablist" aria-label="Slides">
          {photos.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={i === index ? "h-1 w-7 bg-gold" : "h-1 w-3 bg-white/50"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-teal uppercase">{content.heroTag}</p>
        <h1 id="heroHeading" className="font-display mt-5 text-[clamp(3.2rem,7.5vw,5.8rem)] leading-[0.9] text-ink">
          {content.heroTitleLine1}
          <br />
          <em className="italic text-teal">{content.heroTitleEm}</em>
        </h1>
        <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-mid">{content.heroSub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/#booking" className="inline-flex h-12 items-center bg-teal px-6 text-sm font-semibold text-white hover:bg-teal-dark">
            Book a consultation
          </a>
          <a href={`tel:${CLINIC.phonePrimary}`} className="inline-flex h-12 items-center border border-ink px-6 text-sm font-semibold text-ink hover:bg-cream">
            Call {CLINIC.phonePrimaryDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
