import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";
import { DEFAULT_CONTENT } from "./defaults";
import { dispatchClinicPipeline } from "@/lib/notify/pipeline";
import type {
  AdminStats,
  Appointment,
  FaqItem,
  HomepageContent,
  Inquiry,
  MediaItem,
  MediaKind,
  SitePayload,
  Testimonial,
} from "./types";

const mediaKindSchema = z.enum(["gallery", "hero", "other"]);

function asBool(v: unknown) {
  return v === true || v === "t" || v === "true" || v === 1 || v === "1";
}

function mapMedia(row: {
  id: string;
  kind: string;
  url: string;
  alt: string;
  title: string;
  caption: string;
  category: string;
  sort_order: number;
  created_at: string;
}): MediaItem {
  return {
    id: row.id,
    kind: (row.kind as MediaKind) || "other",
    url: row.url,
    alt: row.alt,
    title: row.title,
    caption: row.caption,
    category: row.category,
    sortOrder: Number(row.sort_order) || 0,
    createdAt: row.created_at,
  };
}

async function loadContent(): Promise<HomepageContent> {
  const sql = await getSql();
  const rows = await sql<{ value: string }>`select value from site_content where key = ${"homepage"}`;
  if (!rows[0]?.value) return DEFAULT_CONTENT;
  try {
    return { ...DEFAULT_CONTENT, ...(JSON.parse(rows[0].value) as Partial<HomepageContent>) };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export const getSitePayload = createServerFn({ method: "GET" }).handler(
  async (): Promise<SitePayload> => {
    const sql = await getSql();
    const [content, media, testimonials, faqs] = await Promise.all([
      loadContent(),
      sql<{
        id: string;
        kind: string;
        url: string;
        alt: string;
        title: string;
        caption: string;
        category: string;
        sort_order: number;
        created_at: string;
      }>`select id, kind, url, alt, title, caption, category, sort_order, created_at::text as created_at from media order by sort_order asc, created_at desc`,
      sql<{
        id: string;
        quote: string;
        author: string;
        rating: number;
        sort_order: number;
        published: boolean;
      }>`select id, quote, author, rating, sort_order, published from testimonials where published = true order by sort_order asc`,
      sql<{
        id: string;
        question: string;
        answer: string;
        sort_order: number;
        published: boolean;
      }>`select id, question, answer, sort_order, published from faqs where published = true order by sort_order asc`,
    ]);

    const items = media.map(mapMedia);
    return {
      content,
      hero: items.filter((m) => m.kind === "hero"),
      gallery: items.filter((m) => m.kind === "gallery"),
      testimonials: testimonials.map((t) => ({
        id: t.id,
        quote: t.quote,
        author: t.author,
        rating: Number(t.rating) || 5,
        sortOrder: Number(t.sort_order) || 0,
        published: asBool(t.published),
      })),
      faqs: faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sortOrder: Number(f.sort_order) || 0,
        published: asBool(f.published),
      })),
    };
  },
);

const appointmentInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(8).max(24),
  service: z.string().trim().min(1).max(80),
  date: z.string().trim().min(8).max(20),
  time: z.string().trim().min(1).max(40),
  notes: z.string().trim().max(800).optional().default(""),
  website: z.string().max(200).optional().default(""),
});

export const submitAppointment = createServerFn({ method: "POST" })
  .validator((data: unknown) => appointmentInput.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, id: "ok", emailStatus: "queued" as const, detail: "Received." };
    }
    const sql = await getSql();
    const id = uid();
    await sql`insert into appointments (id, first_name, last_name, phone, service, date, time, notes, status)
      values (${id}, ${data.firstName}, ${data.lastName}, ${data.phone}, ${data.service}, ${data.date}, ${data.time}, ${data.notes ?? ""}, ${"pending"})`;
    const pipeline = await dispatchClinicPipeline({
      kind: "appointment",
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      service: data.service,
      date: data.date,
      time: data.time,
      notes: data.notes,
    });
    await sql`update appointments set cloudinary_url = ${pipeline.cloudinaryUrl}, email_status = ${pipeline.emailStatus} where id = ${id}`;
    return { ok: true as const, id, emailStatus: pipeline.emailStatus, detail: pipeline.detail };
  });

const inquiryInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(8).max(24),
  service: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(1200).optional().default(""),
  website: z.string().max(200).optional().default(""),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => inquiryInput.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, id: "ok", emailStatus: "queued" as const, detail: "Received." };
    }
    const sql = await getSql();
    const id = uid();
    await sql`insert into inquiries (id, first_name, last_name, phone, service, message, status)
      values (${id}, ${data.firstName}, ${data.lastName}, ${data.phone}, ${data.service ?? ""}, ${data.message ?? ""}, ${"new"})`;
    const pipeline = await dispatchClinicPipeline({
      kind: "inquiry",
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      service: data.service || "General",
      message: data.message,
    });
    await sql`update inquiries set cloudinary_url = ${pipeline.cloudinaryUrl}, email_status = ${pipeline.emailStatus} where id = ${id}`;
    return { ok: true as const, id, emailStatus: pipeline.emailStatus, detail: pipeline.detail };
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<AdminStats> => {
    const sql = await getSql();
    const [a, i, g, h] = await Promise.all([
      sql<{ n: number }>`select count(*)::int as n from appointments where status = ${"pending"}`,
      sql<{ n: number }>`select count(*)::int as n from inquiries where status = ${"new"}`,
      sql<{ n: number }>`select count(*)::int as n from media where kind = ${"gallery"}`,
      sql<{ n: number }>`select count(*)::int as n from media where kind = ${"hero"}`,
    ]);
    return {
      pendingAppointments: Number(a[0]?.n ?? 0),
      newInquiries: Number(i[0]?.n ?? 0),
      galleryCount: Number(g[0]?.n ?? 0),
      heroCount: Number(h[0]?.n ?? 0),
    };
  });

export const listAppointments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<Appointment[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      first_name: string;
      last_name: string;
      phone: string;
      service: string;
      date: string;
      time: string;
      notes: string;
      status: string;
      created_at: string;
      cloudinary_url: string | null;
      email_status: string;
    }>`select id, first_name, last_name, phone, service, date, time, notes, status, created_at::text as created_at, cloudinary_url, email_status from appointments order by created_at desc limit 200`;
    return rows.map((r) => ({
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      phone: r.phone,
      service: r.service,
      date: r.date,
      time: r.time,
      notes: r.notes,
      status: (r.status as Appointment["status"]) || "pending",
      createdAt: r.created_at,
      cloudinaryUrl: r.cloudinary_url,
      emailStatus: (r.email_status as Appointment["emailStatus"]) || "queued",
    }));
  });

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z.object({ id: z.string(), status: z.enum(["pending", "confirmed", "cancelled"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update appointments set status = ${data.status} where id = ${data.id}`;
    return { ok: true as const };
  });

export const listInquiries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<Inquiry[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      first_name: string;
      last_name: string;
      phone: string;
      service: string;
      message: string;
      status: string;
      created_at: string;
      cloudinary_url: string | null;
      email_status: string;
    }>`select id, first_name, last_name, phone, service, message, status, created_at::text as created_at, cloudinary_url, email_status from inquiries order by created_at desc limit 200`;
    return rows.map((r) => ({
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      phone: r.phone,
      service: r.service,
      message: r.message,
      status: (r.status as Inquiry["status"]) || "new",
      createdAt: r.created_at,
      cloudinaryUrl: r.cloudinary_url,
      emailStatus: (r.email_status as Inquiry["emailStatus"]) || "queued",
    }));
  });

export const updateInquiryStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z.object({ id: z.string(), status: z.enum(["new", "replied", "archived"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update inquiries set status = ${data.status} where id = ${data.id}`;
    return { ok: true as const };
  });

export const listAllMedia = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<MediaItem[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      kind: string;
      url: string;
      alt: string;
      title: string;
      caption: string;
      category: string;
      sort_order: number;
      created_at: string;
    }>`select id, kind, url, alt, title, caption, category, sort_order, created_at::text as created_at from media order by kind, sort_order, created_at desc`;
    return rows.map(mapMedia);
  });

const uploadInput = z.object({
  kind: mediaKindSchema,
  url: z.string().min(8).max(1_200_000),
  alt: z.string().max(200).optional().default(""),
  title: z.string().max(120).optional().default(""),
  caption: z.string().max(400).optional().default(""),
  category: z.string().max(80).optional().default(""),
  sortOrder: z.number().int().min(0).max(999).optional().default(0),
});

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => uploadInput.parse(data))
  .handler(async ({ data, context }) => {
    if (data.url.startsWith("data:") && data.url.length > 1_100_000) {
      throw new Error("Image is too large. Compress it or use a smaller photo.");
    }
    if (!data.url.startsWith("data:image/") && !data.url.startsWith("http") && !data.url.startsWith("/")) {
      throw new Error("Provide an image file or a valid image URL.");
    }
    const sql = await getSql();
    const id = uid();
    await sql`insert into media (id, kind, url, alt, title, caption, category, sort_order, created_by)
      values (${id}, ${data.kind}, ${data.url}, ${data.alt ?? ""}, ${data.title ?? ""}, ${data.caption ?? ""}, ${data.category ?? ""}, ${data.sortOrder ?? 0}, ${context.userId})`;
    return { ok: true as const, id };
  });

export const updateMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        alt: z.string().max(200).optional(),
        title: z.string().max(120).optional(),
        caption: z.string().max(400).optional(),
        category: z.string().max(80).optional(),
        sortOrder: z.number().int().min(0).max(999).optional(),
        kind: mediaKindSchema.optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      kind: string;
      alt: string;
      title: string;
      caption: string;
      category: string;
      sort_order: number;
    }>`select id, kind, alt, title, caption, category, sort_order from media where id = ${data.id}`;
    const cur = rows[0];
    if (!cur) throw new Error("Media not found.");
    const kind = data.kind ?? cur.kind;
    const alt = data.alt ?? cur.alt;
    const title = data.title ?? cur.title;
    const caption = data.caption ?? cur.caption;
    const category = data.category ?? cur.category;
    const sortOrder = data.sortOrder ?? cur.sort_order;
    await sql`update media set kind = ${kind}, alt = ${alt}, title = ${title}, caption = ${caption}, category = ${category}, sort_order = ${sortOrder} where id = ${data.id}`;
    return { ok: true as const };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from media where id = ${data.id}`;
    return { ok: true as const };
  });

export const saveHomepageContent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z
      .object({
        heroTag: z.string().max(120),
        heroTitleLine1: z.string().max(80),
        heroTitleEm: z.string().max(80),
        heroSub: z.string().max(500),
        introEyebrow: z.string().max(80),
        introTitle: z.string().max(160),
        introBody1: z.string().max(1200),
        introBody2: z.string().max(1200),
        introPull: z.string().max(400),
        aboutTitle: z.string().max(200),
        aboutBody1: z.string().max(1200),
        aboutBody2: z.string().max(1200),
        statementLine1: z.string().max(80),
        statementLine2: z.string().max(80),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const value = JSON.stringify(data);
    await sql`insert into site_content (key, value, updated_by) values (${"homepage"}, ${value}, ${context.userId})
      on conflict (key) do update set value = ${value}, updated_at = now(), updated_by = ${context.userId}`;
    return { ok: true as const };
  });

export const listAllTestimonials = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<Testimonial[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      quote: string;
      author: string;
      rating: number;
      sort_order: number;
      published: boolean;
    }>`select id, quote, author, rating, sort_order, published from testimonials order by sort_order asc`;
    return rows.map((t) => ({
      id: t.id,
      quote: t.quote,
      author: t.author,
      rating: Number(t.rating) || 5,
      sortOrder: Number(t.sort_order) || 0,
      published: asBool(t.published),
    }));
  });

export const upsertTestimonial = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z
      .object({
        id: z.string().optional(),
        quote: z.string().trim().min(8).max(800),
        author: z.string().trim().min(2).max(120),
        rating: z.number().int().min(1).max(5).optional().default(5),
        sortOrder: z.number().int().min(0).max(999).optional().default(0),
        published: z.boolean().optional().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.id || uid();
    await sql`insert into testimonials (id, quote, author, rating, sort_order, published)
      values (${id}, ${data.quote}, ${data.author}, ${data.rating ?? 5}, ${data.sortOrder ?? 0}, ${data.published ?? true})
      on conflict (id) do update set quote = ${data.quote}, author = ${data.author}, rating = ${data.rating ?? 5}, sort_order = ${data.sortOrder ?? 0}, published = ${data.published ?? true}`;
    return { ok: true as const, id };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from testimonials where id = ${data.id}`;
    return { ok: true as const };
  });

export const listAllFaqs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<FaqItem[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      question: string;
      answer: string;
      sort_order: number;
      published: boolean;
    }>`select id, question, answer, sort_order, published from faqs order by sort_order asc`;
    return rows.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sortOrder: Number(f.sort_order) || 0,
      published: asBool(f.published),
    }));
  });

export const upsertFaq = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z
      .object({
        id: z.string().optional(),
        question: z.string().trim().min(6).max(240),
        answer: z.string().trim().min(8).max(2000),
        sortOrder: z.number().int().min(0).max(999).optional().default(0),
        published: z.boolean().optional().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.id || uid();
    await sql`insert into faqs (id, question, answer, sort_order, published)
      values (${id}, ${data.question}, ${data.answer}, ${data.sortOrder ?? 0}, ${data.published ?? true})
      on conflict (id) do update set question = ${data.question}, answer = ${data.answer}, sort_order = ${data.sortOrder ?? 0}, published = ${data.published ?? true}`;
    return { ok: true as const, id };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from faqs where id = ${data.id}`;
    return { ok: true as const };
  });
