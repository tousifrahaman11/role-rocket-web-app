import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { prisma } from "@/lib/prisma";
import {
  BASELINE_SKILLS,
  calculateRocketScore,
  extractSkillsFromText,
} from "@/lib/resume";
import { requireUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { uploadResumeToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await requireUser([Role.CANDIDATE]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF resumes are supported" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfResult = await pdf(buffer);
    const text = pdfResult.text;

    const skills = extractSkillsFromText(text);
    const rocketScore = calculateRocketScore({
      resumeSkills: skills,
      jobSkills: BASELINE_SKILLS,
    });

    let cloudUrl: string | null = null;
    try {
      cloudUrl = await uploadResumeToCloudinary(buffer, user.id);
    } catch (err) {
      console.error("Cloudinary upload failed, storing without URL", err);
    }

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        text,
        skills,
        rocketScore,
        url: cloudUrl ?? "",
      },
    });

    return NextResponse.json(
      {
        resume,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Resume upload error", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}

