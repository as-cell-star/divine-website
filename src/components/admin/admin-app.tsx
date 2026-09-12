import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import {
  deleteFaq,
  deleteMedia,
  deleteTestimonial,
  getAdminStats,
  listAllFaqs,
  listAllMedia,
  listAllTestimonials,
  listAppointments,
  listInquiries,
  saveHomepageContent,
  updateAppointmentStatus,
  updateInquiryStatus,
  updateMedia,
  uploadMedia,
  upsertFaq,
  upsertTestimonial,
} from "@/lib/cms/functions";
import { compressImage } from "@/lib/cms/image";
import { DEFAULT_CONTENT } from "@/lib/cms/defaults";
import type {
  AdminStats,
  Appointment,
  FaqItem,
  HomepageContent,
  Inquiry,
  MediaItem,
  Testimonial,
} from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatWhen } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "overview" | "appointments" | "inquiries" | "gallery" | "hero" | "reviews" | "faq" | "content";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "appointments", label: "Appointments" },
  { id: "inquiries", label: "Inquiries" },
  { id: "gallery", label: "Gallery" },
  { id: "hero", label: "Hero" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
  { id: "content", label: "Content" },
];

export function AdminApp({ initialContent }: { initialContent: HomepageContent }) {
  const user = useCurrentUser();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [content, setContent] = useState<HomepageContent>(initialContent);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [s, a, i, m, r, f] = await Promise.all([
      getAdminStats(),
      listAppointments(),
      listInquiries(),
      listAllMedia(),
      listAllTestimonials(),
      listAllFaqs(),
    ]);
    setStats(s);
    setAppointments(a);
    setInquiries(i);
    setMedia(m);
    setReviews(r);
    setFaqs(f);
  }, []);

  useEffect(() => {
    refresh().catch(() => toast.error("Could not load admin data."));
  }, [refresh]);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-border bg-plum text-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo-emblem.png" alt="" className="size-8 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold">Staff console</p>
              <p className="text-[11px] text-white/55">{user?.primaryEmail ?? user?.displayName ?? "Signed in"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-white/70 hover:text-white">
              View site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "h-9 rounded-full px-4 text-xs font-semibold",
                tab === t.id ? "bg-plum text-white" : "bg-paper text-ink-mid ring-1 ring-border hover:bg-warm",
              )}
            >
              {t.label}
              {t.id === "appointments" && stats ? ` (${stats.pendingAppointments})` : ""}
              {t.id === "inquiries" && stats ? ` (${stats.newInquiries})` : ""}
            </button>
          ))}
        </div>

        {tab === "overview" && stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Pending appointments", stats.pendingAppointments],
              ["New inquiries", stats.newInquiries],
              ["Gallery photos", stats.galleryCount],
              ["Hero slides", stats.heroCount],
            ].map(([l, n]) => (
              <div key={String(l)} className="rounded-xl border border-border bg-paper p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">{l}</p>
                <p className="font-display mt-2 text-4xl text-plum">{n}</p>
              </div>
            ))}
            <div className="rounded-xl border border-border bg-paper p-5 sm:col-span-2 lg:col-span-4">
              <p className="text-sm text-ink-mid">
                Upload photographs under Gallery and Hero — they appear on the public site immediately. Edit Reviews,
                FAQ and homepage copy from the other tabs. Appointment and inquiry requests from the website land here
                for the midwives to confirm.
              </p>
            </div>
          </div>
        ) : null}

        {tab === "appointments" ? (
          <div className="overflow-hidden rounded-xl border border-border bg-paper">
            {appointments.length === 0 ? (
              <p className="p-8 text-sm text-ink-soft">No appointment requests yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {appointments.map((a) => (
                  <li key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-plum">
                        {a.firstName} {a.lastName}
                      </p>
                      <p className="text-sm text-ink-mid">
                        {a.service} · {a.date} · {a.time}
                      </p>
                      <p className="text-sm">
                        <a className="text-teal" href={`tel:${a.phone}`}>
                          {a.phone}
                        </a>
                      </p>
                      {a.notes ? <p className="mt-1 text-sm text-ink-soft">{a.notes}</p> : null}
                      <p className="mt-1 text-[11px] text-ink-soft">{formatWhen(a.createdAt)}</p>
                      <p className="mt-1 text-[11px] text-ink-soft">
                        Email {a.emailStatus}
                        {a.cloudinaryUrl ? (
                          <>
                            {" · "}
                            <a className="text-teal" href={a.cloudinaryUrl} target="_blank" rel="noreferrer">
                              Cloudinary card
                            </a>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={a.status === "confirmed" ? "default" : a.status === "cancelled" ? "outline" : "plum"}>
                        {a.status}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus({ data: { id: a.id, status: "confirmed" } }).then(refresh)}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateAppointmentStatus({ data: { id: a.id, status: "cancelled" } }).then(refresh)}>
                        Cancel
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {tab === "inquiries" ? (
          <div className="overflow-hidden rounded-xl border border-border bg-paper">
            {inquiries.length === 0 ? (
              <p className="p-8 text-sm text-ink-soft">No inquiries yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {inquiries.map((q) => (
                  <li key={q.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-plum">
                        {q.firstName} {q.lastName}
                      </p>
                      <p className="text-sm text-ink-mid">{q.service || "General"}</p>
                      <p className="text-sm">
                        <a className="text-teal" href={`tel:${q.phone}`}>
                          {q.phone}
                        </a>
                      </p>
                      {q.message ? <p className="mt-1 text-sm text-ink-soft">{q.message}</p> : null}
                      <p className="mt-1 text-[11px] text-ink-soft">{formatWhen(q.createdAt)}</p>
                      <p className="mt-1 text-[11px] text-ink-soft">
                        Email {q.emailStatus}
                        {q.cloudinaryUrl ? (
                          <>
                            {" · "}
                            <a className="text-teal" href={q.cloudinaryUrl} target="_blank" rel="noreferrer">
                              Cloudinary card
                            </a>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{q.status}</Badge>
                      <Button size="sm" variant="outline" onClick={() => updateInquiryStatus({ data: { id: q.id, status: "replied" } }).then(refresh)}>
                        Mark replied
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateInquiryStatus({ data: { id: q.id, status: "archived" } }).then(refresh)}>
                        Archive
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {tab === "gallery" || tab === "hero" ? (
          <MediaManager
            kind={tab === "hero" ? "hero" : "gallery"}
            items={media.filter((m) => m.kind === (tab === "hero" ? "hero" : "gallery"))}
            busy={busy}
            setBusy={setBusy}
            onChange={refresh}
          />
        ) : null}

        {tab === "reviews" ? <ReviewsManager items={reviews} onChange={refresh} /> : null}
        {tab === "faq" ? <FaqManager items={faqs} onChange={refresh} /> : null}

        {tab === "content" ? (
          <form
            className="grid gap-4 rounded-xl border border-border bg-paper p-5 md:p-8"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await saveHomepageContent({ data: content });
                toast.success("Homepage copy saved.");
              } catch {
                toast.error("Could not save copy.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {(
              [
                ["heroTag", "Hero tag"],
                ["heroTitleLine1", "Hero title"],
                ["heroTitleEm", "Hero italic word"],
                ["heroSub", "Hero subtitle"],
                ["introEyebrow", "Intro eyebrow"],
                ["introTitle", "Intro title"],
                ["introBody1", "Intro paragraph 1"],
                ["introBody2", "Intro paragraph 2"],
                ["introPull", "Pull quote"],
                ["aboutTitle", "About title"],
                ["aboutBody1", "About paragraph 1"],
                ["aboutBody2", "About paragraph 2"],
                ["statementLine1", "Closing line 1"],
                ["statementLine2", "Closing line 2"],
              ] as Array<[keyof HomepageContent, string]>
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                {key.includes("Body") || key === "heroSub" || key === "introPull" ? (
                  <Textarea value={content[key]} onChange={(e) => setContent({ ...content, [key]: e.target.value })} />
                ) : (
                  <Input value={content[key]} onChange={(e) => setContent({ ...content, [key]: e.target.value })} />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save copy"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setContent(DEFAULT_CONTENT)}>
                Reset to original
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function MediaManager({
  kind,
  items,
  busy,
  setBusy,
  onChange,
}: {
  kind: "gallery" | "hero";
  items: MediaItem[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  onChange: () => Promise<void>;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      await uploadMedia({
        data: {
          kind,
          url: dataUrl,
          alt,
          title: title || file.name.replace(/\.[^.]+$/, ""),
          sortOrder: items.length + 1,
        },
      });
      setAlt("");
      setTitle("");
      toast.success("Photo added.");
      await onChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUrl() {
    if (!url.trim()) return;
    setBusy(true);
    try {
      await uploadMedia({
        data: { kind, url: url.trim(), alt, title, sortOrder: items.length + 1 },
      });
      setUrl("");
      setAlt("");
      setTitle("");
      toast.success("Photo added.");
      await onChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add that URL.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-border bg-paper p-5">
        <h2 className="font-display text-xl text-plum">{kind === "hero" ? "Hero slides" : "Gallery"}</h2>
        <p className="mt-1 text-sm text-ink-mid">
          Upload a photograph from your computer, or paste a Cloudinary / image URL. Photos appear on the public
          site under the same domain.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Newborn handover" />
          </div>
          <div className="space-y-1.5">
            <Label>Alt text</Label>
            <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="A midwife with a newborn" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label>Upload file</Label>
            <Input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
          <div className="min-w-56 flex-1 space-y-1.5">
            <Label>Or paste image URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </div>
          <Button type="button" variant="outline" disabled={busy || !url.trim()} onClick={() => void handleUrl()}>
            Add URL
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <article key={m.id} className="overflow-hidden rounded-xl border border-border bg-paper">
            <img src={m.url} alt={m.alt} className="h-44 w-full object-cover" />
            <div className="space-y-2 p-3">
              <Input
                defaultValue={m.title}
                onBlur={(e) => {
                  if (e.target.value !== m.title) {
                    updateMedia({ data: { id: m.id, title: e.target.value } }).then(onChange);
                  }
                }}
              />
              <Input
                defaultValue={m.alt}
                onBlur={(e) => {
                  if (e.target.value !== m.alt) {
                    updateMedia({ data: { id: m.id, alt: e.target.value } }).then(onChange);
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-ink-soft">Order {m.sortOrder}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Remove this photo from the site?")) {
                      deleteMedia({ data: { id: m.id } }).then(onChange);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ReviewsManager({ items, onChange }: { items: Testimonial[]; onChange: () => Promise<void> }) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  return (
    <div className="space-y-4">
      <form
        className="rounded-xl border border-border bg-paper p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await upsertTestimonial({ data: { quote, author, rating: 5, sortOrder: items.length + 1, published: true } });
            setQuote("");
            setAuthor("");
            toast.success("Review added.");
            await onChange();
          } catch {
            toast.error("Could not add review.");
          }
        }}
      >
        <h2 className="font-display text-xl text-plum">Add a review</h2>
        <div className="mt-4 space-y-3">
          <Textarea required value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Quote" />
          <Input required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
          <Button type="submit">Publish</Button>
        </div>
      </form>
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="rounded-xl border border-border bg-paper p-4">
            <p className="text-sm text-ink">“{r.quote}”</p>
            <p className="mt-2 text-xs text-ink-soft">{r.author}</p>
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => deleteTestimonial({ data: { id: r.id } }).then(onChange)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqManager({ items, onChange }: { items: FaqItem[]; onChange: () => Promise<void> }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-4">
      <form
        className="rounded-xl border border-border bg-paper p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await upsertFaq({ data: { question, answer, sortOrder: items.length + 1, published: true } });
            setQuestion("");
            setAnswer("");
            toast.success("Question added.");
            await onChange();
          } catch {
            toast.error("Could not add question.");
          }
        }}
      >
        <h2 className="font-display text-xl text-plum">Add a question</h2>
        <div className="mt-4 space-y-3">
          <Input required value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
          <Textarea required value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" />
          <Button type="submit">Publish</Button>
        </div>
      </form>
      <ul className="space-y-3">
        {items.map((f) => (
          <li key={f.id} className="rounded-xl border border-border bg-paper p-4">
            <p className="font-semibold text-plum">{f.question}</p>
            <p className="mt-1 text-sm text-ink-mid">{f.answer}</p>
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => deleteFaq({ data: { id: f.id } }).then(onChange)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
