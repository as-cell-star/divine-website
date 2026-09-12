export const SERVICE_OPTIONS = [
  "Antenatal Care",
  "Antenatal Classes & Exercises",
  "Birthing Services",
  "Doula Services",
  "Postnatal Clinic",
  "Maternal Wellness Programme",
  "Mental Health & Wellness",
  "Laboratory Services",
  "Ultrasound Services",
  "Family Planning",
  "Child Welfare Clinic",
  "General Consultation",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export type MediaKind = "gallery" | "hero" | "other";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  url: string;
  alt: string;
  title: string;
  caption: string;
  category: string;
  sortOrder: number;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  rating: number;
  sortOrder: number;
  published: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
};

export type Appointment = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  cloudinaryUrl: string | null;
  emailStatus: "queued" | "sent" | "failed";
};

export type Inquiry = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  service: string;
  message: string;
  status: "new" | "replied" | "archived";
  createdAt: string;
  cloudinaryUrl: string | null;
  emailStatus: "queued" | "sent" | "failed";
};

export type HomepageContent = {
  heroTag: string;
  heroTitleLine1: string;
  heroTitleEm: string;
  heroSub: string;
  introEyebrow: string;
  introTitle: string;
  introBody1: string;
  introBody2: string;
  introPull: string;
  aboutTitle: string;
  aboutBody1: string;
  aboutBody2: string;
  statementLine1: string;
  statementLine2: string;
};

export type SitePayload = {
  content: HomepageContent;
  hero: MediaItem[];
  gallery: MediaItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
};

export type AdminStats = {
  pendingAppointments: number;
  newInquiries: number;
  galleryCount: number;
  heroCount: number;
};
