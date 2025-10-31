import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Check if the token exists and is not expired
    const verification = await prisma.authVerification.findFirst({
      where: {
        value: token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
