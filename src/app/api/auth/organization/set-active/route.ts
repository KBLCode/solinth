import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

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
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Set the active organization using Better Auth
    await auth.api.setActiveOrganization({
      body: {
        organizationId,
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "Active organization updated successfully",
    });
  } catch (error) {
    console.error("Set active organization error:", error);
    return NextResponse.json(
      { error: "Failed to set active organization" },
      { status: 500 }
    );
  }
}
