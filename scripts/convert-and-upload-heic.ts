/**
 * Convert HEIC files to JPEG and upload to Sanity
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import path from "path";
import convert from "heic-convert";

const client = createClient({
  projectId: "6ostes35",
  dataset: "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Failed HEIC files from the manifest
const failedHeicFiles = [
  { new_filename: "2022_rented_bahia-plaza-903.heic", title: "Bahia Plaza unit 903", status: "rented", year: "2022" },
  { new_filename: "2022_rented_dbe-180.heic", title: "DBE #180", status: "rented", year: "2022" },
  { new_filename: "2022_rented_metro-plaza-502.heic", title: "Metro Plaza unit 502", status: "rented", year: "2022" },
  { new_filename: "2023_rented_aquablue-2902.heic", title: "Aquablue Unit 2902", status: "rented", year: "2023" },
  { new_filename: "2023_rented_ciudadela-torre-1000-1055.heic", title: "Ciudadela Torre 1000 Unit 1055", status: "rented", year: "2023" },
  { new_filename: "2023_rented_metro-plaza-502.heic", title: "Metro Plaza Unit 502", status: "rented", year: "2023" },
  { new_filename: "2024_rented_ciudadela-torre-1000-1055.heic", title: "Ciudadela Torre 1000 Unit 1055", status: "rented", year: "2024" },
  { new_filename: "2024_rented_metro-plaza-502.heic", title: "Metro Plaza unit 502", status: "rented", year: "2024" },
  { new_filename: "2025_rented_cervantes-i-3rd-floor.heic", title: "Cervantes I - 3rd Floor", status: "rented", year: "2025" },
  { new_filename: "2025_rented_acquamarina-1205.heic", title: "Cond. Acquamarina Unit 1205", status: "rented", year: "2025" },
  { new_filename: "2025_rented_metro-plaza-502.heic", title: "Metro Plaza - Unit 502", status: "rented", year: "2025" },
];

// City mapping
interface LocationInfo {
  city: string;
  neighborhood?: string;
}

const cityMapping: Record<string, LocationInfo> = {
  "bahia plaza": { city: "San Juan", neighborhood: "Condado" },
  "dbe": { city: "Dorado", neighborhood: "Dorado Beach East" },
  "metro plaza": { city: "San Juan", neighborhood: "Hato Rey" },
  "aquablue": { city: "San Juan", neighborhood: "Condado" },
  "ciudadela": { city: "San Juan", neighborhood: "Ciudadela" },
  "cervantes": { city: "San Juan", neighborhood: "Miramar" },
  "acquamarina": { city: "San Juan", neighborhood: "Condado" },
};

function inferLocation(title: string): LocationInfo {
  const lowerTitle = title.toLowerCase();
  for (const [key, location] of Object.entries(cityMapping)) {
    if (lowerTitle.includes(key)) {
      return location;
    }
  }
  return { city: "San Juan" };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ñ/g, "n")
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 96);
}

async function convertHeicToJpeg(heicPath: string): Promise<Buffer> {
  const inputBuffer = readFileSync(heicPath);
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: "JPEG",
    quality: 0.9,
  });
  return Buffer.from(outputBuffer);
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ SANITY_API_TOKEN required");
    process.exit(1);
  }

  console.log("🔄 Converting HEIC files and uploading to Sanity\n");

  let successful = 0;
  let failed = 0;

  for (const file of failedHeicFiles) {
    const heicPath = path.join(process.cwd(), "_staging/organized", file.new_filename);
    console.log(`[${successful + failed + 1}/${failedHeicFiles.length}] ${file.title}`);

    try {
      // Convert HEIC to JPEG
      console.log("  🔄 Converting HEIC to JPEG...");
      const jpegBuffer = await convertHeicToJpeg(heicPath);

      // Upload to Sanity
      console.log("  📸 Uploading image...");
      const asset = await client.assets.upload("image", jpegBuffer, {
        filename: file.new_filename.replace(".heic", ".jpg"),
        contentType: "image/jpeg",
      });

      // Create document
      console.log("  📝 Creating document...");
      const location = inferLocation(file.title);
      const doc = await client.create({
        _type: "property",
        title: file.title,
        slug: { _type: "slug", current: generateSlug(file.title) },
        status: file.status,
        yearTransacted: parseInt(file.year, 10),
        propertyType: "condo",
        location: {
          city: location.city,
          state: "PR",
          neighborhood: location.neighborhood,
        },
        featuredImage: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: file.title,
        },
        featured: false,
      });

      console.log(`  ✅ Created: ${doc._id}`);
      successful++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ Failed: ${msg}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\n================================");
  console.log("📊 HEIC CONVERSION REPORT");
  console.log("================================");
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
}

main().catch(console.error);
