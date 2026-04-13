/**
 * Upload Properties to Sanity
 *
 * This script reads the manifest CSV and uploads all property images
 * and creates documents in Sanity CMS.
 *
 * Usage:
 *   npx tsx scripts/upload-properties.ts          # Upload all
 *   npx tsx scripts/upload-properties.ts --test 5 # Test with first 5
 */

import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";

// ============================================================================
// Configuration
// ============================================================================

const client = createClient({
  projectId: "6ostes35",
  dataset: "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ============================================================================
// City Mapping
// ============================================================================

interface LocationInfo {
  city: string;
  neighborhood?: string;
}

const cityMapping: Record<string, LocationInfo> = {
  // San Juan - Condado
  condado: { city: "San Juan", neighborhood: "Condado" },
  atlantis: { city: "San Juan", neighborhood: "Condado" },
  aquablue: { city: "San Juan", neighborhood: "Condado" },
  "the alexander": { city: "San Juan", neighborhood: "Condado" },
  seaview: { city: "San Juan", neighborhood: "Condado" },
  "sea view": { city: "San Juan", neighborhood: "Condado" },
  quantum: { city: "San Juan", neighborhood: "Condado" },
  "the terrace": { city: "San Juan", neighborhood: "Condado" },
  "condado key": { city: "San Juan", neighborhood: "Condado" },
  "condado plaza": { city: "San Juan", neighborhood: "Condado" },
  "condado terrace": { city: "San Juan", neighborhood: "Condado" },
  "condado blu": { city: "San Juan", neighborhood: "Condado" },
  "condado blú": { city: "San Juan", neighborhood: "Condado" },
  "paseo caribe": { city: "San Juan", neighborhood: "Condado" },
  "bahia plaza": { city: "San Juan", neighborhood: "Condado" },
  acquamarina: { city: "San Juan", neighborhood: "Condado" },

  // San Juan - Ciudadela (Santurce)
  ciudadela: { city: "San Juan", neighborhood: "Ciudadela" },

  // San Juan - Hato Rey
  "metro plaza": { city: "San Juan", neighborhood: "Hato Rey" },
  "gallery plaza": { city: "San Juan", neighborhood: "Hato Rey" },
  "mirador del parque": { city: "San Juan", neighborhood: "Hato Rey" },
  "first bank": { city: "San Juan", neighborhood: "Hato Rey" },

  // San Juan - Miramar
  cervantes: { city: "San Juan", neighborhood: "Miramar" },

  // San Juan - Other
  murano: { city: "San Juan" },
  "plaza del prado": { city: "San Juan" },
  waterview: { city: "San Juan" },
  kennedy: { city: "San Juan" },
  "edificio kennedy": { city: "San Juan" },

  // Guaynabo
  torrimar: { city: "Guaynabo", neighborhood: "Torrimar" },
  "la cima": { city: "Guaynabo", neighborhood: "Torrimar" },
  "la cima de torrimar": { city: "Guaynabo", neighborhood: "Torrimar" },
  "garden hills": { city: "Guaynabo", neighborhood: "Garden Hills" },
  "chalets del parque": { city: "Guaynabo" },
  "san patricio": { city: "Guaynabo", neighborhood: "San Patricio" },
  "casa guaynabo": { city: "Guaynabo" },
  "muñoz rivera": { city: "Guaynabo" },
  "casa muñoz rivera": { city: "Guaynabo" },

  // Dorado
  dorado: { city: "Dorado", neighborhood: "Dorado Beach" },
  dbe: { city: "Dorado", neighborhood: "Dorado Beach East" },
  plantation: { city: "Dorado", neighborhood: "Plantation Village" },
  "plantation village": { city: "Dorado", neighborhood: "Plantation Village" },
  riviera: { city: "Dorado" },
  "riviera court": { city: "Dorado" },
  "riviera village": { city: "Dorado" },
  "villas de golf": { city: "Dorado" },
  "sierra del rio": { city: "Dorado", neighborhood: "Sierra del Río" },
  "sierra del río": { city: "Dorado", neighborhood: "Sierra del Río" },
  "the cottages": { city: "Dorado" },

  // Carolina
  sabanera: { city: "Carolina", neighborhood: "Sabanera" },

  // Corozal
  "finca corozal": { city: "Corozal" },
  corozal: { city: "Corozal" },

  // Caguas
  "torre de la reina": { city: "Caguas" },
};

function inferLocation(title: string): LocationInfo {
  const lowerTitle = title.toLowerCase();

  // Check each mapping key
  for (const [key, location] of Object.entries(cityMapping)) {
    if (lowerTitle.includes(key)) {
      return location;
    }
  }

  // Default fallback
  console.warn(`  ⚠ Could not infer city for: "${title}" - defaulting to San Juan`);
  return { city: "San Juan" };
}

// ============================================================================
// Slug Generation
// ============================================================================

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

// ============================================================================
// Manifest Types
// ============================================================================

interface ManifestRow {
  original_path: string;
  new_filename: string;
  title: string;
  status: string;
  year: string;
}

// ============================================================================
// Upload Functions
// ============================================================================

async function uploadImage(imagePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), imagePath);
  const asset = await client.assets.upload("image", createReadStream(fullPath), {
    filename: path.basename(imagePath),
  });
  return asset._id;
}

async function createPropertyDocument(
  row: ManifestRow,
  imageAssetId: string
): Promise<{ _id: string; title: string }> {
  const location = inferLocation(row.title);
  const slug = generateSlug(row.title);

  const doc = await client.create({
    _type: "property",
    title: row.title,
    slug: { _type: "slug", current: slug },
    status: row.status, // "sold" or "rented"
    yearTransacted: parseInt(row.year, 10),
    propertyType: "condo", // Default, can be updated later
    location: {
      city: location.city,
      state: "PR",
      neighborhood: location.neighborhood,
    },
    featuredImage: {
      _type: "image",
      asset: { _type: "reference", _ref: imageAssetId },
      alt: row.title,
    },
    featured: false,
  });

  return { _id: doc._id, title: row.title };
}

async function publishDocument(documentId: string): Promise<void> {
  // Remove "drafts." prefix if present to get the published ID
  const publishedId = documentId.replace(/^drafts\./, "");
  const draftId = `drafts.${publishedId}`;

  // Use the correct publish transaction
  await client
    .transaction()
    .createIfNotExists({ _id: publishedId, _type: "property" })
    .patch(draftId, (p) => p.unset(["_id"])) // Remove draft
    .commit();
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  // Check for API token
  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ Error: SANITY_API_TOKEN environment variable is required");
    console.error("   Get a token from: https://www.sanity.io/manage/project/6ostes35/api");
    console.error("   Then run: SANITY_API_TOKEN=sk... npx tsx scripts/upload-properties.ts");
    process.exit(1);
  }

  // Parse CLI args
  const args = process.argv.slice(2);
  const testIndex = args.indexOf("--test");
  const testLimit = testIndex !== -1 ? parseInt(args[testIndex + 1], 10) : null;

  console.log("📦 Sanity Property Upload Script");
  console.log("================================\n");

  // Read manifest
  const manifestPath = path.join(process.cwd(), "_staging/organized/_manifest.csv");
  const csvContent = readFileSync(manifestPath, "utf-8");
  let rows: ManifestRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Filter for test mode
  if (testLimit) {
    console.log(`🧪 TEST MODE: Processing only first ${testLimit} properties\n`);
    rows = rows.slice(0, testLimit);
  }

  console.log(`📋 Found ${rows.length} properties to upload\n`);

  // Stats
  let successful = 0;
  let failed = 0;
  const errors: { title: string; error: string }[] = [];

  // Process each property
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const progress = `[${i + 1}/${rows.length}]`;

    try {
      console.log(`${progress} Processing: ${row.title}`);

      // 1. Upload image
      const imagePath = `_staging/organized/${row.new_filename}`;
      console.log(`  📸 Uploading image: ${row.new_filename}`);
      const imageAssetId = await uploadImage(imagePath);

      // 2. Create document
      console.log(`  📝 Creating document...`);
      const doc = await createPropertyDocument(row, imageAssetId);

      // 3. Note: Documents are created as drafts by default
      // They can be published via Sanity Studio or we can publish them here
      console.log(`  ✅ Created: ${doc._id}`);

      successful++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ Failed: ${errorMessage}`);
      errors.push({ title: row.title, error: errorMessage });
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Final Report
  console.log("\n================================");
  console.log("📊 UPLOAD REPORT");
  console.log("================================");
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${rows.length}`);

  if (errors.length > 0) {
    console.log("\n❌ ERRORS:");
    errors.forEach(({ title, error }) => {
      console.log(`  - ${title}: ${error}`);
    });
  }

  console.log("\n🔗 View in Sanity Studio:");
  console.log("   https://elite-realty.sanity.studio/structure/property");
  console.log("\n⚠️  Note: Documents are created as drafts.");
  console.log("   Publish them via Studio or use the Sanity dashboard.");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
