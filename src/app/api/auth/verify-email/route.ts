import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify the email using Better Auth
    // Note: Better Auth handles email verification through its own routes
    // This is a custom endpoint for additional verification logic
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) {
      throw new Error("Verification failed");
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. The link may be invalid or expired." },
      { status: 400 }
    );
  }
}
