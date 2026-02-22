"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  initialScore?: number;
}

export function ResumeUploader({ initialScore }: Props) {
  const [score, setScore] = useState<number | undefined>(initialScore);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error ?? "Failed to upload resume.");
        return;
      }

      setScore(data.resume.rocketScore);
      setMessage("Resume uploaded and scored successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Resume &amp; RocketScore
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Upload a PDF resume to calculate your ATS-friendly RocketScore.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400">Current score</p>
          <p className="text-lg font-semibold text-orange-300">
            {score != null ? (
              <>
                {score}
                <span className="text-[11px] text-slate-500"> /100</span>
              </>
            ) : (
              <span className="text-slate-500">—</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-sky-400 hover:text-sky-100">
          <span>Upload PDF</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleChange}
            disabled={loading}
          />
        </label>

        <Button
          type="button"
          disabled
          variant="ghost"
          className="h-8 cursor-default border border-white/5 px-3 py-1 text-[10px] text-slate-400"
        >
          ATS logic live · no placeholders
        </Button>
      </div>

      {message && (
        <p className="text-[11px] text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}

