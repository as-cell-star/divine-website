import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || "Staff" });
        if (res.error) throw new Error(res.error.message || "Could not create account.");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in.");
      }
      window.location.assign("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-plum-deep px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/images/logo-emblem.png" alt="" className="mx-auto size-16 rounded-full object-cover ring-1 ring-white/20" />
          <h1 className="font-display mt-4 text-3xl text-white">Staff sign in</h1>
          <p className="mt-1 text-sm text-white/55">Divine Birth Midwifery Centre</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/6 p-5">
          {authEnabled ? (
            <div className="space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full border-white/20 bg-white/8 text-white hover:bg-white/14"
                  onClick={() => signIn(p.providerId, { callbackURL: "/admin" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/50">Sign-in is disabled.</p>
          )}

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-white/40">
            <span className="h-px flex-1 bg-white/15" />
            or email
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <form onSubmit={onEmail} className="space-y-3">
            {mode === "up" ? (
              <div className="space-y-1.5">
                <Label htmlFor="staff-name" className="text-white/70">
                  Name
                </Label>
                <Input
                  id="staff-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Diana"
                  required
                  className="border-white/15 bg-white/8 text-white placeholder:text-white/35"
                />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="staff-email" className="text-white/70">
                Email
              </Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border-white/15 bg-white/8 text-white placeholder:text-white/35"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-password" className="text-white/70">
                Password
              </Label>
              <Input
                id="staff-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                className="border-white/15 bg-white/8 text-white placeholder:text-white/35"
              />
            </div>
            {error ? <p className="text-xs text-red-300">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={pending || !authEnabled}>
              {pending ? "Please wait…" : mode === "up" ? "Create staff account" : "Sign in with email"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-xs text-white/55 hover:text-white"
            onClick={() => setMode(mode === "up" ? "in" : "up")}
          >
            {mode === "up" ? "Already have an account? Sign in" : "New staff member? Create an account"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          <Link to="/" className="hover:text-white">
            Back to the public site
          </Link>
        </p>
      </div>
    </main>
  );
}
