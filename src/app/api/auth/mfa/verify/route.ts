import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { authenticator } from "otplib";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, secret } = body;

    if (!code || !secret) {
      return NextResponse.json(
        { error: "Code and secret are required" },
        { status: 400 }
      );
    }

    // Verify the TOTP code
    const isValid = authenticator.verify({
      token: code,
      secret,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Enable two-factor authentication for the user
    await auth.api.enableTwoFactor({
      body: {
        password: "", // Not needed for TOTP
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication enabled successfully",
    });
  } catch (error) {
    console.error("MFA verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify MFA code" },
      { status: 500 }
    );
  }
}
