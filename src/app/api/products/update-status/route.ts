// app/api/products/update-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
});

export async function POST(request: NextRequest) {
  try {
    const { productId, status } = await request.json();

    // Validation
    if (!productId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID and status are required",
        },
        { status: 400 }
      );
    }

    // Validate status value
    if (!["in-stock", "out-of-stock"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be 'in-stock' or 'out-of-stock'",
        },
        { status: 400 }
      );
    }

    // Update product status in Sanity
    const updatedProduct = await client
      .patch(productId)
      .set({ status: status })
      .commit();

    return NextResponse.json({
      success: true,
      productId: updatedProduct._id,
      status: updatedProduct.status,
    });
  } catch (error) {
    console.error("Product status update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
