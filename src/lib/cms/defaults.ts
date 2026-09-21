import type { FaqItem, HomepageContent, MediaItem, SitePayload, Testimonial } from "./types";

export const DEFAULT_CONTENT: HomepageContent = {
  heroTag: "Divine Birth Midwifery Centre",
  heroTitleLine1: "Maternity care in",
  heroTitleEm: "Kahawa Wendani",
  heroSub:
    "Antenatal clinic, labour and delivery, postnatal care and child welfare. The centre is open 24 hours a day, including public holidays.",
  introEyebrow: "The centre",
  introTitle: "A licensed midwifery facility in Nairobi",
  introBody1:
    "Divine Birth Midwifery Centre is beside Alvo House, opposite PlayWay Academy in Kahawa Wendani. We look after women from the first antenatal visit through labour, the days after birth, and the child’s immunisation schedule.",
  introBody2:
    "Straightforward births are managed at the centre. If a woman needs theatre or specialist obstetric care, she is stabilised and referred to a partner hospital. Midwives are on duty on site at all hours — not on call from home.",
  introPull: "KMHFR licensed · Open 24 hours · Kahawa Wendani, Nairobi",
  aboutTitle: "About Divine Birth",
  aboutBody1:
    "The centre was established by midwife Diana to serve families in Kahawa Wendani and nearby estates: skilled maternity care without the cost of a large private hospital, and without the delays of an overcrowded public ward.",
  aboutBody2:
    "We provide antenatal care, antenatal classes, labour and delivery, postnatal clinic, child welfare and immunisation, ultrasound, laboratory services, family planning and doula support. SHA, SHIF and selected private insurance covers are accepted. Telephone 0794 444 141 to confirm what your cover includes before admission.",
  statementLine1: "In labour?",
  statementLine2: "Come to the centre. Call on the way.",
};

export const CLINIC = {
  name: "Divine Birth Midwifery Centre",
  shortName: "Divine Birth",
  tagline: "Maternity centre, Kahawa Wendani",
  phonePrimary: "+254794444141",
  phonePrimaryDisplay: "+254 794 444141",
  phoneSecondary: "+254794444121",
  phoneSecondaryDisplay: "+254 794 444121",
  whatsapp: "https://wa.me/254794444141",
  whatsappText:
    "https://wa.me/254794444141?text=Hello%2C%20I%20would%20like%20to%20ask%20about%20your%20services.",
  emailPrimary: "info@divinebirthmidwifery.org",
  emailSecondary: "divinebirthmidwiferycenter@gmail.com",
  addressLine1: "Besides Alvo House, opposite PlayWay Academy",
  addressLine2: "Kahawa Wendani, Nairobi, Kenya",
  hours: "Open 24 hours, including public holidays",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7194870!2d36.9281535!3d-1.1998878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3f001b66566d%3A0x94f239b341ae6498!2sDivine%20Birth%20Midwifery%20Centre!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske",
  rating: "5.0",
  reviewCount: "4",
};

export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "Evening",
  "Night / in labour",
];

function media(
  id: string,
  kind: MediaItem["kind"],
  url: string,
  alt: string,
  title: string,
  sortOrder: number,
): MediaItem {
  return { id, kind, url, alt, title, caption: "", category: "", sortOrder, createdAt: "" };
}

export const DEFAULT_HERO: MediaItem[] = [
  media("seed-hero-1", "hero", "/images/photo-midwife-newborn.jpg", "A Divine Birth midwife holding a newborn", "Hero", 1),
  media("seed-hero-2", "hero", "/images/hero4.jpg", "Midwife holding a newborn", "Hero 2", 2),
  media("seed-hero-3", "hero", "/images/hero2.jpg", "Care at Divine Birth", "Hero 3", 3),
];

export const DEFAULT_GALLERY: MediaItem[] = [
  media("seed-gallery-1", "gallery", "/images/photo-midwife-newborn.jpg", "A Divine Birth midwife holding a newborn", "Newborn care", 1),
  media("seed-gallery-2", "gallery", "/images/photo-mother-baby.jpg", "A new mother and her midwife with her newborn", "Mother and baby", 2),
  media("seed-gallery-3", "gallery", "/images/photo-handover.jpg", "A midwife placing a newborn into her mother's arms", "First hold", 3),
  media("seed-gallery-4", "gallery", "/images/photo-twins.jpg", "Two midwives each holding a newborn twin", "Twins", 4),
  media("seed-gallery-5", "gallery", "/images/photo-swaddled.jpg", "A midwife holding a swaddled newborn", "Swaddled", 5),
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "seed-rev-1",
    quote: "Best hospital for normal delivery with high quality services at a very affordable price. I couldn't have asked for a better experience.",
    author: "Google review",
    rating: 5,
    sortOrder: 1,
    published: true,
  },
  {
    id: "seed-rev-2",
    quote: "I had a wonderful experience — the midwives were kind, professional and made me feel completely supported throughout the entire process.",
    author: "Google review",
    rating: 5,
    sortOrder: 2,
    published: true,
  },
  {
    id: "seed-rev-3",
    quote: "The team, led by Diana, is truly exceptional. Full attention is given to every client. I highly recommend Divine Birth to every expectant family.",
    author: "Google review",
    rating: 5,
    sortOrder: 3,
    published: true,
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "seed-faq-1",
    question: "Do I need an appointment to visit?",
    answer:
      "Clinic visits (antenatal, postnatal, scans, child welfare) are best booked so that you are seen with less waiting. If you are in labour, come directly to the centre or call 0794 444 141 on the way. The centre does not close at night.",
    sortOrder: 1,
    published: true,
  },
  {
    id: "seed-faq-2",
    question: "What should I bring for delivery?",
    answer:
      "Bring your national ID, antenatal booklet, SHA or insurance details, clothes for yourself and the baby, sanitary pads and toiletries. If something is forgotten, the staff will help. Arriving safely is more important than a complete bag.",
    sortOrder: 2,
    published: true,
  },
  {
    id: "seed-faq-3",
    question: "May my husband or a relative stay during labour?",
    answer: "Yes. One birth companion may stay with you. Tell the midwife on admission.",
    sortOrder: 3,
    published: true,
  },
  {
    id: "seed-faq-4",
    question: "Do you accept SHA, SHIF or private insurance?",
    answer:
      "SHA, SHIF and selected private covers are accepted. Telephone 0794 444 141 before admission so we can confirm what your policy pays and what you will settle yourself.",
    sortOrder: 4,
    published: true,
  },
  {
    id: "seed-faq-5",
    question: "What happens if I need a caesarean section?",
    answer:
      "Emergency caesarean section is not performed at this centre. If labour requires theatre or specialist obstetric care, the woman is stabilised and referred to a partner hospital. A midwife remains with her so that this decision is made early.",
    sortOrder: 5,
    published: true,
  },
  {
    id: "seed-faq-6",
    question: "How long will I stay after the birth?",
    answer:
      "After an uncomplicated delivery, most mothers are discharged within 24 to 48 hours, once feeding is established and both mother and baby have been examined. A postnatal clinic visit is then booked.",
    sortOrder: 6,
    published: true,
  },
];

export const DEFAULT_SITE: SitePayload = {
  content: DEFAULT_CONTENT,
  hero: DEFAULT_HERO,
  gallery: DEFAULT_GALLERY,
  testimonials: DEFAULT_TESTIMONIALS,
  faqs: DEFAULT_FAQS,
};
