import { useMemo, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TIME_SLOTS, CLINIC } from "@/lib/cms/defaults";
import { submitAppointment } from "@/lib/cms/functions";
import { SERVICE_OPTIONS } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingForm() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState(ymd(today));
  const [time, setTime] = useState("09:00");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ detail: string; emailStatus: string } | null>(null);

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = first.getDay();
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: Array<{ label: string; value: string | null; disabled: boolean }> = [];
    for (let i = 0; i < start; i++) cells.push({ label: "", value: null, disabled: true });
    for (let d = 1; d <= count; d++) {
      const dt = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      const value = ymd(dt);
      cells.push({ label: String(d), value, disabled: dt < today });
    }
    return cells;
  }, [cursor, today]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      const res = await submitAppointment({
        data: {
          firstName: String(fd.get("firstname") || ""),
          lastName: String(fd.get("lastname") || ""),
          phone: String(fd.get("phone") || ""),
          service: String(fd.get("service") || ""),
          date,
          time,
          notes: String(fd.get("notes") || ""),
          website: String(fd.get("website") || ""),
        },
      });
      setDone({ detail: res.detail, emailStatus: res.emailStatus });
      toast.success(res.emailStatus === "sent" ? "Sent to the midwives." : "Request saved. We will confirm shortly.");
    } catch {
      toast.error("Could not send the request. Please call us instead.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    const wa = `https://wa.me/254794444141?text=${encodeURIComponent(`Hello Divine Birth, I booked ${date} at ${time}. ${done.detail}`)}`;
    return (
      <div className="rounded-lg border border-border bg-paper p-8 text-ink">
        <p className="font-display text-2xl text-plum">We have your request.</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-mid">
          {done.detail} We will confirm {date} at {time}. For labour or anything urgent, call {CLINIC.phonePrimaryDisplay} — we are open now.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setDone(null)}>
            Book another visit
          </Button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-md bg-teal px-5 text-sm font-semibold text-white"
          >
            WhatsApp the midwives
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
      <div className="rounded-lg bg-paper p-5 text-ink sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-xl text-plum">
            {cursor.toLocaleString("en-KE", { month: "long", year: "numeric" })}
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-sm hover:bg-warm"
              aria-label="Previous month"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-sm hover:bg-warm"
              aria-label="Next month"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wider text-ink-soft uppercase">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              disabled={!d.value || d.disabled}
              onClick={() => d.value && setDate(d.value)}
              className={cn(
                "h-10 rounded-sm text-sm",
                !d.value && "invisible",
                d.disabled && "text-ink-soft/50",
                d.value === date && "bg-teal font-semibold text-white",
                d.value && d.value !== date && !d.disabled && "hover:bg-teal-light",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-5 text-[11px] font-semibold tracking-[0.12em] text-ink-soft uppercase">Available times</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setTime(slot)}
              className={cn(
                "h-9 rounded-md border px-3 text-xs font-medium",
                time === slot ? "border-teal bg-teal text-white" : "border-border bg-paper text-ink-mid hover:border-teal",
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-lg bg-paper p-5 text-ink sm:p-6">
        <p className="font-display text-xl text-plum">Your details</p>
        <p className="mt-1 mb-5 text-sm text-ink-mid">
          {date} · {time}
        </p>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="bfname">First name</Label>
            <Input id="bfname" name="firstname" required autoComplete="given-name" placeholder="Grace" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blname">Last name</Label>
            <Input id="blname" name="lastname" required autoComplete="family-name" placeholder="Wanjiru" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="bphone">Phone number</Label>
          <Input id="bphone" name="phone" required autoComplete="tel" placeholder="+254 7XX XXX XXX" />
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="bservice">Service</Label>
          <select
            id="bservice"
            name="service"
            required
            className="flex h-11 w-full rounded-md border border-input bg-paper px-3.5 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Select a service…
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="bnotes">Notes (optional)</Label>
          <Textarea id="bnotes" name="notes" placeholder="Estimated due date, special concerns…" />
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={pending}>
          {pending ? "Sending to the midwives…" : "Confirm appointment"}
        </Button>
        <p className="mt-3 text-xs text-ink-soft">
          Your booking is emailed to Divine Birth. Urgent? Call{" "}
          <a className="text-teal" href={`tel:${CLINIC.phonePrimary}`}>
            {CLINIC.phonePrimaryDisplay}
          </a>
          .
        </p>
      </form>
    </div>
  );
}
