import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Role } from "@prisma/client";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(_req: Request, { params }: Params) {
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

  const saved = await prisma.savedJob.upsert({
    where: {
      userId_jobId: {
        userId: user.id,
        jobId: job.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      jobId: job.id,
    },
  });

  return NextResponse.json({ saved });
}

