import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { calculateRocketScore } from "@/lib/resume";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(req: Request, { params }: Params) {
  const user = await requireUser([Role.CANDIDATE]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const resume = await prisma.resume.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  let rocketScore: number | undefined;
  if (resume) {
    rocketScore = calculateRocketScore({
      resumeSkills: resume.skills,
      jobSkills: job.skills,
    });
  }

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      jobId: job.id,
      rocketScore,
    },
  });

  await prisma.jobAnalytics.upsert({
    where: { jobId: job.id },
    update: { applications: { increment: 1 } },
    create: { jobId: job.id, applications: 1 },
  });

  return NextResponse.json({ application }, { status: 201 });
}

