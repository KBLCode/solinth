import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Send password reset email using Better Auth
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"}/reset-password`,
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    // Don't reveal if email exists or not for security
    return NextResponse.json({
      success: true,
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  }
}
