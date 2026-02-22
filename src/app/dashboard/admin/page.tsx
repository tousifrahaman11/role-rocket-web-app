import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { AdminDeleteButton } from "@/components/dashboard/AdminDeleteButton";

export default async function AdminDashboardPage() {
  const user = await requireUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const [users, companies, jobs, applications] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { company: true },
    }),
    prisma.application.count(),
  ]);

  return (
    <div className="flex w-full flex-col gap-6 py-2">
      <div>
        <p className="tag-pill mb-2">Admin · Control Tower</p>
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
          Platform health & moderation.
        </h1>
        <p className="mt-1 max-w-xl text-xs text-slate-400">
          Monitor users, companies, and jobs across the platform. Remove fake
          listings and keep the orbit clean.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Overview
          </h2>
          <dl className="space-y-1.5">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-400">Users</dt>
              <dd className="text-slate-100">{users.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-400">Companies</dt>
              <dd className="text-slate-100">{companies.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-400">Jobs</dt>
              <dd className="text-slate-100">{jobs.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-400">Applications</dt>
              <dd className="text-slate-100">{applications}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Recent jobs
          </h2>
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-100">
                    {job.title}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {job.company?.name ?? "Unknown company"}
                  </p>
                </div>
                <AdminDeleteButton type="job" id={job.id} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Recent users
          </h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-100">
                    {u.name || u.email}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {u.role}
                  </p>
                </div>
                <AdminDeleteButton type="user" id={u.id} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

