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

    // Generate a new TOTP secret
    const secret = authenticator.generateSecret();

    // Generate the otpauth URL for QR code
    const otpauthUrl = authenticator.keyuri(
      session.user.email,
      "Solinth Suite",
      secret
    );

    // Generate backup codes (8 codes, 8 characters each)
    const backupCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Store the secret temporarily in session metadata
    // In production, you'd want to store this in the database
    // until the user verifies the code

    return NextResponse.json({
      secret,
      otpauthUrl,
      backupCodes,
    });
  } catch (error) {
    console.error("MFA generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate MFA secret" },
      { status: 500 }
    );
  }
}
