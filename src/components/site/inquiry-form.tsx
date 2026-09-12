import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLINIC } from "@/lib/cms/defaults";
import { submitInquiry } from "@/lib/cms/functions";
import { SERVICE_OPTIONS } from "@/lib/cms/types";

export function InquiryForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      const res = await submitInquiry({
        data: {
          firstName: String(fd.get("firstname") || ""),
          lastName: String(fd.get("lastname") || ""),
          phone: String(fd.get("phone") || ""),
          service: String(fd.get("service") || ""),
          message: String(fd.get("message") || ""),
          website: String(fd.get("website") || ""),
        },
      });
      setDone(res.detail);
      toast.success("Inquiry sent. We will reply within a few hours.");
    } catch {
      toast.error("Could not send the inquiry. Please call us instead.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-paper p-7">
        <p className="font-display text-2xl text-plum">Message received.</p>
        <p className="mt-3 text-sm text-ink-mid">
          {done} If this is urgent, call {CLINIC.phonePrimaryDisplay}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-paper p-5 sm:p-7">
      <p className="font-display text-xl text-plum">Send an inquiry</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ifname">First name</Label>
          <Input id="ifname" name="firstname" required autoComplete="given-name" placeholder="Grace" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ilname">Last name</Label>
          <Input id="ilname" name="lastname" required autoComplete="family-name" placeholder="Wanjiru" />
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <Label htmlFor="iphone">Phone number</Label>
        <Input id="iphone" name="phone" required autoComplete="tel" placeholder="+254 7XX XXX XXX" />
      </div>
      <div className="mt-4 space-y-1.5">
        <Label htmlFor="iservice">Service of interest</Label>
        <select id="iservice" name="service" className="flex h-11 w-full rounded-md border border-input bg-paper px-3.5 text-sm" defaultValue="">
          <option value="">Select a service…</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 space-y-1.5">
        <Label htmlFor="imessage">Message (optional)</Label>
        <Textarea id="imessage" name="message" placeholder="Estimated due date, questions…" />
      </div>
      <Button type="submit" className="mt-6 w-full" disabled={pending}>
        {pending ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
