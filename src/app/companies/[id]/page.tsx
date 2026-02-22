import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export default async function CompanyProfilePage({ params }: Params) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
      },
      users: true,
    },
  });

  if (!company) {
    return (
      <div className="py-6 text-sm text-slate-300">
        Company not found or no longer available.
      </div>
    );
  }

  const totalApplicantsPromise = prisma.application.count({
    where: { job: { companyId: company.id } },
  });

  const totalApplicants = await totalApplicantsPromise;

  return (
    <div className="flex w-full flex-col gap-5 py-2">
      <div>
        <p className="tag-pill mb-2">Company profile</p>
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
          {company.name}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          {company.location || "Global · Remote-friendly"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            About
          </h2>
          <p className="leading-relaxed">
            {company.description ||
              "This company has not added a full description yet, but is actively hiring on RoleRocket."}
          </p>
        </section>

        <aside className="space-y-4 text-xs">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Mission stats
            </h2>
            <dl className="space-y-1.5">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Posted roles</dt>
                <dd className="text-slate-100">{company.jobs.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Total applicants</dt>
                <dd className="text-slate-100">{totalApplicants}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Hiring managers</dt>
                <dd className="text-slate-100">{company.users.length}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Open roles
            </h2>
            {company.jobs.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                No active roles at the moment.
              </p>
            ) : (
              <ul className="space-y-2">
                {company.jobs.map((job) => (
                  <li
                    key={job.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2"
                  >
                    <p className="text-xs font-medium text-slate-100">
                      {job.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {job.location} · {job.jobType}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

