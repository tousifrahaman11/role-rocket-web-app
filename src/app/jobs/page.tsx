import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/jobs/JobCard";
import { seedJobsIfEmpty } from "@/lib/seed";
import { getCurrentUser } from "@/lib/auth";
import { calculateRocketScore } from "@/lib/resume";

interface JobsPageProps {
  searchParams: {
    q?: string;
    location?: string;
    jobType?: string;
    company?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function JobsPage({ searchParams }: JobsPageProps) {
  // Seed jobs if none exist
  await seedJobsIfEmpty();

  const q = searchParams.q ?? "";
  const location = searchParams.location ?? "";
  const jobType = searchParams.jobType ?? "";
  const company = searchParams.company ?? "";
  const page = Number(searchParams.page ?? "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { skills: { hasSome: q.split(",").map((s) => s.trim()) } },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (jobType) {
    where.jobType = { contains: jobType, mode: "insensitive" };
  }

  if (company) {
    where.company = {
      name: { contains: company, mode: "insensitive" },
    };
  }

  // Fetch jobs (we might need to fetch all if we need to sort by RocketScore across all pages,
  // but for simplicity and performance with existing pagination, we grab the page and then score.)
  // Note: True global sorting by rocket score would require fetching all matching jobs, scoring them,
  // and then paginating. Let's do that if user has a resume.

  const user = await getCurrentUser();
  const resume = user
    ? await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })
    : null;

  let jobs = [];
  let total = 0;
  let totalPages = 1;

  if (resume) {
    // If we have a resume, we need to fetch all matching the filter, score them, sort them, and paginate
    const allMatchingJobs = await prisma.job.findMany({
      where,
      include: { company: true },
    });

    const scoredJobs = allMatchingJobs
      .map((job) => {
        const score = calculateRocketScore({
          resumeSkills: resume.skills,
          jobSkills: job.skills,
        });
        return { ...job, rocketScore: score };
      })
      .filter((job) => job.rocketScore > 0)
      .sort((a, b) => b.rocketScore - a.rocketScore);

    total = scoredJobs.length;
    totalPages = Math.max(1, Math.ceil(total / pageSize));
    jobs = scoredJobs.slice(skip, skip + pageSize);
  } else {
    // Standard pagination
    const [fetchedJobs, fetchedTotal] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.job.count({ where }),
    ]);
    jobs = fetchedJobs;
    total = fetchedTotal;
    totalPages = Math.max(1, Math.ceil(total / pageSize));
  }

  return (
    <div className="flex w-full flex-col gap-5 py-2">
      <div>
        <p className="tag-pill mb-2">Mission board</p>
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
          Explore live roles on RoleRocket.
        </h1>
        <p className="mt-1 max-w-xl text-xs text-slate-400">
          Search by title, skills, or location. Each role is scored against
          your resume for a fast RocketScore match.
        </p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs sm:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-slate-300" htmlFor="q">
            Title or skills
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="e.g. Product designer, React, Data"
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-slate-300" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            defaultValue={location}
            placeholder="Remote, London, Berlin..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-slate-300" htmlFor="jobType">
            Job type
          </label>
          <input
            id="jobType"
            name="jobType"
            defaultValue={jobType}
            placeholder="Full-time, Contract..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-slate-300" htmlFor="company">
            Company
          </label>
          <input
            id="company"
            name="company"
            defaultValue={company}
            placeholder="RoleRocket Labs"
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-50 outline-none ring-0 transition focus:border-sky-400"
          />
        </div>
        <input type="hidden" name="page" value="1" />
      </form>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400">
            No missions found. Try adjusting your filters.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} rocketScore={job.rocketScore} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/jobs?${new URLSearchParams({
                    ...searchParams,
                    page: String(page - 1),
                  }).toString()}`}
                  className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
                >
                  Previous
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/jobs?${new URLSearchParams({
                    ...searchParams,
                    page: String(page + 1),
                  }).toString()}`}
                  className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

