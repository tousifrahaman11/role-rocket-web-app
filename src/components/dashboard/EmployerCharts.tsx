"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Job, JobAnalytics, Application } from "@prisma/client";

interface JobWithAnalytics extends Job {
  analytics: JobAnalytics | null;
  applications: Application[];
}

interface Props {
  jobs: JobWithAnalytics[];
}

export function EmployerCharts({ jobs }: Props) {
  const perJobData = jobs.map((job) => ({
    name: job.title.slice(0, 18),
    views: job.analytics?.views ?? 0,
    applications: job.analytics?.applications ?? job.applications.length,
  }));

  const funnelData = [
    {
      stage: "Views",
      value: perJobData.reduce((sum, j) => sum + j.views, 0),
    },
    {
      stage: "Applications",
      value: perJobData.reduce((sum, j) => sum + j.applications, 0),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Applications per job
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perJobData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
                vertical={false}
              />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#1f2937",
                  fontSize: 11,
                }}
              />
              <Bar dataKey="applications" fill="#38bdf8" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Funnel overview
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={funnelData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
                vertical={false}
              />
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#1f2937",
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

