"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type RoleOption = "CANDIDATE" | "EMPLOYER";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleOption>("CANDIDATE");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          companyName: role === "EMPLOYER" ? companyName : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      const destination =
        role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/candidate";
      router.push(destination);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel px-6 py-7"
      >
        <div className="mb-6 space-y-2 text-center">
          <p className="tag-pill mx-auto w-fit">Launch Your Career 🚀</p>
          <h1 className="text-xl font-semibold text-slate-50">
            Create your RoleRocket account
          </h1>
          <p className="text-xs text-slate-400">
            Choose whether you&apos;re searching for roles or hiring talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              {error}
            </div>
          )}

          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-slate-200" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 outline-none ring-0 transition focus:border-sky-400 focus:bg-slate-900/90"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-200" htmlFor="email">
                Work email
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

          <div className="space-y-2 text-xs">
            <span className="text-slate-200">I&apos;m here as</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("CANDIDATE")}
                className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  role === "CANDIDATE"
                    ? "border-sky-400 bg-sky-500/10 text-sky-100"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                }`}
              >
                <span className="block text-xs font-semibold">
                  Candidate / Talent
                </span>
                <span className="mt-1 block text-[10px] text-slate-400">
                  Search roles, track applications, get AI feedback.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("EMPLOYER")}
                className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  role === "EMPLOYER"
                    ? "border-orange-400 bg-orange-500/10 text-orange-50"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                }`}
              >
                <span className="block text-xs font-semibold">
                  Employer / Team
                </span>
                <span className="mt-1 block text-[10px] text-slate-400">
                  Post roles, view analytics, manage applicants.
                </span>
              </button>
            </div>
          </div>

          {role === "EMPLOYER" && (
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-200" htmlFor="company">
                Company name
              </label>
              <input
                id="company"
                required={role === "EMPLOYER"}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 outline-none ring-0 transition focus:border-sky-400 focus:bg-slate-900/90"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full justify-center"
          >
            {loading ? "Creating account..." : "Launch your account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Already on board?{" "}
          <Link
            href="/login"
            className="font-medium text-sky-300 underline-offset-4 hover:underline"
          >
            Sign in to your cockpit
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}

