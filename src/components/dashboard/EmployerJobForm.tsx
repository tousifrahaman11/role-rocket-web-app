"use client";

import { useState } from "react";

export function EmployerJobForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") || "");
    const location = String(formData.get("location") || "");
    const jobType = String(formData.get("jobType") || "");
    const salaryMinRaw = formData.get("salaryMin");
    const salaryMaxRaw = formData.get("salaryMax");
    const skillsRaw = String(formData.get("skills") || "");
    const description = String(formData.get("description") || "");

    const salaryMin =
      typeof salaryMinRaw === "string" && salaryMinRaw
        ? Number(salaryMinRaw)
        : undefined;
    const salaryMax =
      typeof salaryMaxRaw === "string" && salaryMaxRaw
        ? Number(salaryMaxRaw)
        : undefined;

    const skills = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          jobType,
          salaryMin,
          salaryMax,
          skills,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Failed to create job.");
        return;
      }

      e.currentTarget.reset();
      setMessage("Mission published successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-[11px]">
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="title">
          Job title
        </label>
        <input
          id="title"
          name="title"
          required
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
          required
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="jobType">
          Job type
        </label>
        <input
          id="jobType"
          name="jobType"
          placeholder="Full-time, Contract..."
          required
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="salaryMin">
          Salary range (min)
        </label>
        <input
          id="salaryMin"
          name="salaryMin"
          type="number"
          min={0}
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="salaryMax">
          Salary range (max)
        </label>
        <input
          id="salaryMax"
          name="salaryMax"
          type="number"
          min={0}
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="skills">
          Required skills (comma-separated)
        </label>
        <input
          id="skills"
          name="skills"
          placeholder="React, TypeScript, Product thinking..."
          required
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <div className="space-y-1">
        <label className="text-slate-300" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-[11px] font-medium text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 disabled:opacity-60"
      >
        {loading ? "Publishing..." : "Publish mission"}
      </button>
      {message && (
        <p className="text-[10px] text-slate-400">
          {message}
        </p>
      )}
    </form>
  );
}

