import { NextResponse } from "next/server";
import { getPropertyById, getPropertyBySlug } from "@/lib/sanity/queries";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const decodedSlug = decodeURIComponent(slug);

    let property = await getPropertyBySlug(decodedSlug);

    // Backward-compatible fallback for links that still carry Sanity _id values.
    if (!property) {
      property = await getPropertyById(decodedSlug);
    }

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("[api/property] fetch failed", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
