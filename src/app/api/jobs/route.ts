import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { z } from "zod";
import { sendJobAlertEmail } from "@/lib/email";

const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  location: z.string().min(2),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  jobType: z.string().min(2),
  skills: z.array(z.string().min(1)).min(1),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "";
  const jobType = searchParams.get("jobType") ?? "";
  const company = searchParams.get("company") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
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
    where.jobType = { equals: jobType, mode: "insensitive" };
  }

  if (company) {
    where.company = {
      name: { contains: company, mode: "insensitive" },
    };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: true, analytics: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({
    jobs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: Request) {
  const user = await requireUser([Role.EMPLOYER]);
  if (!user || !user.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, description, location, salaryMin, salaryMax, jobType, skills } =
    parsed.data;

  const job = await prisma.job.create({
    data: {
      title,
      description,
      location,
      salaryMin,
      salaryMax,
      jobType,
      skills,
      companyId: user.companyId,
      analytics: {
        create: {},
      },
    },
    include: { company: true },
  });

  const alerts = await prisma.jobAlertSubscription.findMany({
    where: {
      OR: [
        {
          keywords: {
            not: null,
          },
        },
        {
          location: {
            not: null,
          },
        },
      ],
    },
    include: {
      user: true,
    },
  });

  for (const alert of alerts) {
    const keywordMatch =
      !alert.keywords ||
      job.title.toLowerCase().includes(alert.keywords.toLowerCase());
    const locationMatch =
      !alert.location ||
      job.location.toLowerCase().includes(alert.location.toLowerCase());

    if (keywordMatch && locationMatch) {
      if (alert.user?.email) {
        // Fire and forget; failures are logged but do not block job creation.
        void sendJobAlertEmail({
          to: alert.user.email,
          jobTitle: job.title,
          companyName: job.company?.name ?? "Unknown company",
          jobId: job.id,
        });
      }
    }
  }

  return NextResponse.json({ job }, { status: 201 });
}

