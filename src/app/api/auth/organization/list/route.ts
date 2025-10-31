import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organizations using Better Auth
    const organizations = await auth.api.listOrganizations({
      headers: request.headers,
    });

    return NextResponse.json({
      organizations: organizations || [],
    });
  } catch (error) {
    console.error("Organization list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
