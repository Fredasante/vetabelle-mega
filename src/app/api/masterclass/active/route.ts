import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { activeMasterclassQuery } from "@/sanity/groq";
import type { Masterclass } from "@/types/masterclass";

export async function GET() {
  try {
    const masterclass: Masterclass | null = await client.fetch(
      activeMasterclassQuery,
    );
    return NextResponse.json({ masterclass });
  } catch (error) {
    console.error("Active masterclass fetch error:", error);
    return NextResponse.json({ masterclass: null }, { status: 500 });
  }
}
