import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { masterclassRegistrationByIdQuery } from "@/sanity/groq";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Registration id is required" },
        { status: 400 },
      );
    }

    const registration = await client.fetch(masterclassRegistrationByIdQuery, {
      id,
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error("Registration fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
