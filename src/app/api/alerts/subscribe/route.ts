import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keywords, location, minSalary } = await req.json();

  const subscription = await prisma.jobAlertSubscription.findFirst({
    where: { userId: user.id }
  });

  let resultSubscription;
  if (subscription) {
    resultSubscription = await prisma.jobAlertSubscription.update({
      where: { id: subscription.id },
      data: {
        keywords: keywords || null,
        location: location || null,
        minSalary: typeof minSalary === "number" ? minSalary : null,
      },
    });
  } else {
    resultSubscription = await prisma.jobAlertSubscription.create({
      data: {
        userId: user.id,
        keywords: keywords || null,
        location: location || null,
        minSalary: typeof minSalary === "number" ? minSalary : null,
      },
    });
  }

  return NextResponse.json({ subscription: resultSubscription });
}
