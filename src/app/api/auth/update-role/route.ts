import { NextResponse } from "next/server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

const VALID_ROLES = ["CUSTOMER", "PROVIDER"] as const;
type ValidRole = (typeof VALID_ROLES)[number];

interface UpdateRoleBody {
  role?: string;
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as UpdateRoleBody;
    const { role } = body;

    if (!role || !VALID_ROLES.includes(role as ValidRole)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 },
      );
    }

    // Update user role
    await db.user.update({
      where: { id: session.user.id },
      data: { role: role as ValidRole },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
