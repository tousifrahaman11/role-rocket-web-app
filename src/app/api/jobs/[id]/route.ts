import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      analytics: true,
      applications: { include: { user: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  await prisma.jobAnalytics.upsert({
    where: { jobId: job.id },
    update: { views: { increment: 1 } },
    create: {
      jobId: job.id,
      views: 1,
    },
  });

  return NextResponse.json({ job });
}

