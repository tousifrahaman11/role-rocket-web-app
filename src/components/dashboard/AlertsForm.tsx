"use client";

import { useState } from "react";

export function AlertsForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const keywords = String(formData.get("keywords") || "");
    const location = String(formData.get("location") || "");

    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords || null,
          location: location || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Failed to save alerts.");
        return;
      }
      setMessage("Rocket Alerts updated.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-[11px]">
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="keywords">
          Keywords
        </label>
        <input
          id="keywords"
          name="keywords"
          placeholder="Senior frontend, Staff engineer..."
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          placeholder="Remote, NYC, Berlin..."
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-[11px] font-medium text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Rocket Alerts"}
      </button>
      {message && (
        <p className="text-[10px] text-slate-400">
          {message}
        </p>
      )}
    </form>
  );
}

