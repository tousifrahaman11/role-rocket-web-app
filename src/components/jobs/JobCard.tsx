"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Job, Company } from "@prisma/client";

interface Props {
  job: Job & { company: Company | null };
  rocketScore?: number;
}

export function JobCard({ job, rocketScore }: Props) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs shadow-md shadow-slate-950/50"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-50">
            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <p className="truncate text-[11px] text-slate-400">
            {job.company?.name ?? "Unknown company"} · {job.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {rocketScore !== undefined && (
            <span className="badge-soft bg-indigo-900/50 text-[10px] text-indigo-300 border border-indigo-700/50 font-medium">
              🚀 {rocketScore} RocketScore
            </span>
          )}
          <span className="badge-soft bg-slate-800/80 text-[10px] text-sky-200">
            {job.jobType}
          </span>
        </div>
      </div>

      <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-400">
        {job.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] text-slate-300"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>
          {job.salaryMin && job.salaryMax
            ? `$${job.salaryMin.toLocaleString()}–$${job.salaryMax.toLocaleString()}`
            : "Salary undisclosed"}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-[11px] font-medium text-sky-300 underline-offset-4 hover:underline"
        >
          View mission →
        </Link>
      </div>
    </motion.article>
  );
}

