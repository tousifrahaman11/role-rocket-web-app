import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { Role } from "@prisma/client";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.nativeEnum(Role),
  companyName: z.string().min(2).max(120).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, role, companyName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    let companyId: string | undefined;
    if (role === Role.EMPLOYER && companyName) {
      const company = await prisma.company.create({
        data: {
          name: companyName,
        },
      });
      companyId = company.id;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        companyId,
      },
    });

    const token = signToken({ userId: user.id, role: user.role });

    const res = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    res.cookies.set("rr_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Register error", error);

    const isDev = process.env.NODE_ENV === "development";
    const err = error as { code?: string; message?: string };

    if (isDev && err?.code === "P1001") {
      return NextResponse.json(
        {
          error:
            "Cannot reach database. Set DATABASE_URL in .env (use Neon.tech or Supabase for a free PostgreSQL DB).",
        },
        { status: 500 }
      );
    }
    if (isDev && (err?.code === "P1000" || err?.code === "P1017")) {
      return NextResponse.json(
        {
          error:
            "Database auth failed. Check DATABASE_URL in .env has correct user/password.",
        },
        { status: 500 }
      );
    }
    if (isDev && err?.code === "P3009") {
      return NextResponse.json(
        {
          error:
            "Database not migrated. Run: npx prisma migrate dev --name init",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while registering" },
      { status: 500 }
    );
  }
}

