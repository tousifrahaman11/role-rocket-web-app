import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Role } from "@prisma/client";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await requireUser([Role.ADMIN]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.job.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

