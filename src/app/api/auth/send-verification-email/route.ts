import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Send verification email using Better Auth
    await auth.api.sendVerificationEmail({
      body: {
        email,
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Send verification email error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
