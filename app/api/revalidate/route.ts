import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Type for Sanity webhook payload
interface SanityWebhookBody {
  _type: string;
  _id: string;
  slug?: { current: string };
}

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const secret = request.headers.get("x-sanity-webhook-secret");

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    const body: SanityWebhookBody = await request.json();

    // Revalidate based on content type
    switch (body._type) {
      case "property":
        revalidatePath("/portfolio");
        revalidatePath("/");
        break;

      case "blogPost":
        revalidatePath("/journal");
        if (body.slug?.current) {
          revalidatePath(`/journal/${body.slug.current}`);
        }
        break;

      case "author":
        revalidatePath("/journal");
        break;

      case "siteSettings":
        // Revalidate all pages when site settings change
        revalidatePath("/", "layout");
        break;

      default:
        // Revalidate homepage for unknown types
        revalidatePath("/");
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: body._type,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Error revalidating" },
      { status: 500 }
    );
  }
}
