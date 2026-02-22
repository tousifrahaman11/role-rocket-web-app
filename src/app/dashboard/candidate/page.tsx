import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { BASELINE_SKILLS, matchJobsToResume } from "@/lib/resume";
import { ResumeUploader } from "@/components/dashboard/ResumeUploader";
import { AlertsForm } from "@/components/dashboard/AlertsForm";

export default async function CandidateDashboardPage() {
  const user = await requireUser();
  if (!user) {
    return null;
  }

  const [resume, savedJobs, applications, jobs] = await Promise.all([
    prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.savedJob.findMany({
      where: { userId: user.id },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.application.findMany({
      where: { userId: user.id },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.job.findMany({
      include: { company: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const matches = resume ? matchJobsToResume({ jobs, resume }) : [];
  const topMatches = matches.slice(0, 5);

  const matchedSkills = resume?.skills.length ?? 0;
  const totalSkills = BASELINE_SKILLS.length;

  return (
    <div className="flex w-full flex-col gap-6 py-2">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="tag-pill mb-2">Candidate · Mission Overview</p>
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Hey {user.name || "there"}, here&apos;s your current orbit.
          </h1>
          <p className="mt-1 max-w-xl text-xs text-slate-400">
            Track your RocketScore, saved jobs, and live RoleMatch AI
            suggestions — all in one mission control view.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <ResumeUploader initialScore={resume?.rocketScore} />

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
              <p className="text-[11px] font-medium text-slate-300">
                Matching skills
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-300">
                {matchedSkills}
                <span className="text-[11px] text-slate-500">
                  {" "}
                  / {totalSkills}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Skills detected in your latest resume.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
              <p className="text-[11px] font-medium text-sky-200">
                Saved jobs
              </p>
              <p className="mt-1 text-lg font-semibold text-sky-100">
                {savedJobs.length || "—"}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Use LaunchPad to keep promising roles close.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
              <p className="text-[11px] font-medium text-orange-200">
                Applications
              </p>
              <p className="mt-1 text-lg font-semibold text-orange-100">
                {applications.length || "—"}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Track where you&apos;ve launched applications.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                RoleMatch AI · Top tracks
              </p>
            </div>
            {topMatches.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                Upload a resume to see high-signal matches for your current
                skills.
              </p>
            ) : (
              <div className="space-y-2">
                {topMatches.map(({ job, match }) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-100">
                        {job.title}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {job.company?.name ?? "Unknown company"} ·{" "}
                        {job.location}
                      </p>
                    </div>
                    <div className="text-right text-[11px]">
                      <p className="font-semibold text-emerald-300">
                        {match}%
                      </p>
                      <p className="text-slate-500">match</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              LaunchPad · Saved jobs
            </p>
            {savedJobs.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                Save jobs from the Jobs page to keep them in your LaunchPad.
              </p>
            ) : (
              <ul className="space-y-2">
                {savedJobs.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2"
                  >
                    <p className="truncate text-xs font-medium text-slate-100">
                      {s.job.title}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {s.job.company?.name ?? "Unknown company"} ·{" "}
                      {s.job.location}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Applications · Status
            </p>
            {applications.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                No applications yet. Apply to roles to see them tracked here.
              </p>
            ) : (
              <ul className="space-y-2">
                {applications.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-100">
                        {a.job.title}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {a.job.company?.name ?? "Unknown company"}
                      </p>
                    </div>
                    <div className="text-right text-[11px]">
                      <p className="font-semibold text-sky-300">
                        {a.status || "PENDING"}
                      </p>
                      {a.rocketScore != null && (
                        <p className="text-[10px] text-slate-500">
                          Match {a.rocketScore}%
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Rocket Alerts
            </p>
            <p className="mb-3 text-[11px] text-slate-400">
              Get email alerts when new missions match your orbit. Fully
              configurable, powered by your skills and interests.
            </p>
            <AlertsForm />
          </div>
        </div>
      </div>
    </div>
  );
}

