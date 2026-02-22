"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/candidate";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to sign in.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel px-6 py-7"
      >
        <div className="mb-6 space-y-2 text-center">
          <p className="tag-pill mx-auto w-fit">Welcome back</p>
          <h1 className="text-xl font-semibold text-slate-50">
            Sign in to RoleRocket
          </h1>
          <p className="text-xs text-slate-400">
            Access your dashboard, RocketScore, and saved missions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5 text-xs">
            <label className="text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 outline-none ring-0 transition focus:border-sky-400 focus:bg-slate-900/90"
            />
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 outline-none ring-0 transition focus:border-sky-400 focus:bg-slate-900/90"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full justify-center"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          No account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-sky-300 underline-offset-4 hover:underline"
          >
            Launch your free profile
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

