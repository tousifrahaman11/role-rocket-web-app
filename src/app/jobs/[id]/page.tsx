import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { JobActions } from "@/components/jobs/JobActions";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage({ params }: Params) {
  const { id } = await params;
  const [job, user] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        analytics: true,
      },
    }),
    requireUser(),
  ]);

  if (!job) {
    return (
      <div className="py-6 text-sm text-slate-300">
        Job not found or no longer available.
      </div>
    );
  }

  const isCandidate = user?.role === "CANDIDATE";

  return (
    <div className="flex w-full flex-col gap-5 py-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="tag-pill mb-2">Mission details</p>
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            {job.title}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {job.company?.name ?? "Unknown company"} · {job.location}
          </p>
        </div>
        {job.analytics && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-300">
            <p className="font-medium text-slate-200">Signal</p>
            <p className="mt-1 flex gap-3">
              <span>{job.analytics.views} views</span>
              <span>{job.analytics.applications} applicants</span>
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Description
          </h2>
          <p className="whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </article>

        <aside className="space-y-4 text-xs">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Company
            </h2>
            {job.company ? (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-100">
                  <Link
                    href={`/companies/${job.company.id}`}
                    className="hover:underline"
                  >
                    {job.company.name}
                  </Link>
                </p>
                {job.company.location && (
                  <p className="text-[11px] text-slate-400">
                    {job.company.location}
                  </p>
                )}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-300 underline-offset-4 hover:underline"
                  >
                    Visit website
                  </a>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Company information not available.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Role specifics
            </h2>
            <dl className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Type</dt>
                <dd>{job.jobType}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Salary</dt>
                <dd>
                  {job.salaryMin && job.salaryMax
                    ? `$${job.salaryMin.toLocaleString()}–$${job.salaryMax.toLocaleString()}`
                    : "Undisclosed"}
                </dd>
              </div>
            </dl>

            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] font-medium text-slate-300">
                Required skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <JobActions jobId={job.id} isCandidate={isCandidate} />
        </aside>
      </div>
    </div>
  );
}

