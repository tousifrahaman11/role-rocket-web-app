import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { EmployerCharts } from "@/components/dashboard/EmployerCharts";
import { EmployerJobForm } from "@/components/dashboard/EmployerJobForm";

export default async function EmployerDashboardPage() {
  const user = await requireUser();
  if (!user || !user.companyId) {
    return null;
  }

  const [company, jobs, applications] = await Promise.all([
    prisma.company.findUnique({
      where: { id: user.companyId },
    }),
    prisma.job.findMany({
      where: { companyId: user.companyId },
      include: { analytics: true, applications: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where: { job: { companyId: user.companyId } },
      include: { job: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  async function getApplicantsPerJob() {
    const grouped = await prisma.application.groupBy({
      by: ["jobId"],
      _count: { _all: true },
    });
    return grouped;
  }

  const applicantsByJob = await getApplicantsPerJob();

  return (
    <div className="flex w-full flex-col gap-6 py-2">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="tag-pill mb-2">Employer · Mission Control</p>
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            {company?.name || "Your company"} hiring cockpit.
          </h1>
          <p className="mt-1 max-w-xl text-xs text-slate-400">
            Monitor applicants, conversion, and skill coverage across all your
            active missions.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <EmployerCharts jobs={jobs} />

          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Live applicants
              </p>
              <p className="text-[11px] text-slate-400">
                {applications.length} latest applications
              </p>
            </div>

            {applications.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                No applicants yet. Post a role to start receiving candidates.
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
                        {a.user.name || a.user.email}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {a.job.title}
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
          </section>
        </div>

        <aside className="space-y-4 text-xs">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Post new mission
            </h2>
            <EmployerJobForm />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Quick metrics
            </h2>
            <dl className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Active missions</dt>
                <dd>{jobs.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Avg. applicants / job</dt>
                <dd>
                  {jobs.length
                    ? (
                        applicantsByJob.reduce(
                          (sum, j) => sum + j._count._all,
                          0
                        ) / jobs.length
                      ).toFixed(1)
                    : "0.0"}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

