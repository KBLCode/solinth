import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Reset password using Better Auth
    await auth.api.resetPassword({
      body: {
        token,
        newPassword: password,
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        error: "Failed to reset password. The link may be invalid or expired.",
      },
      { status: 400 }
    );
  }
}
