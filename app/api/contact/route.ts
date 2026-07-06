import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";

// --- Rate Limiter (in-memory, resets per serverless instance) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;       // max submissions
const RATE_LIMIT_WINDOW = 60_000; // per 1 minute
const resendApiKey = process.env.RESEND_API_KEY;
const contactEmailTo = process.env.CONTACT_EMAIL_TO || "info@eliterealtypr.com";
const contactEmailFrom = process.env.CONTACT_EMAIL_FROM || "Elite Realty <onboarding@resend.dev>";

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// --- HTML Sanitizer (prevents XSS in email body) ---
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendContactEmail({
  safeName,
  safeEmail,
  safePhone,
  safeMessage,
}: {
  safeName: string;
  safeEmail: string;
  safePhone: string;
  safeMessage: string;
}) {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not configured; contact form email was not sent.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactEmailFrom,
      to: contactEmailTo,
      reply_to: safeEmail,
      subject: `New Contact: ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, "<br />")}</p>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${details}`);
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting — get IP from Vercel/Next.js headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check for spam
    if (body.website) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    // Validate form data
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = result.data;

    // Escape user input before embedding in HTML email
    const safeName    = escapeHtml(name);
    const safeEmail   = escapeHtml(email);
    const safePhone   = escapeHtml(phone ?? "Not provided");
    const safeMessage = escapeHtml(message);

    await sendContactEmail({ safeName, safeEmail, safePhone, safeMessage });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
