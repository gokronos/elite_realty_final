/**
 * Bulk upload minimal property records from status folders.
 *
 * Folder structure (default):
 * _uploads/properties/
 *   sold/
 *   rented/
 *   active-sale/
 *   active-rental/
 *
 * Each image file becomes one property:
 * - title: derived from filename
 * - status: derived from parent folder
 * - featuredImage: uploaded image
 *
 * Usage:
 * SANITY_API_TOKEN=sk... node scripts/upload-properties-from-folders.mjs
 * SANITY_API_TOKEN=sk... node scripts/upload-properties-from-folders.mjs --dry-run
 * SANITY_API_TOKEN=sk... node scripts/upload-properties-from-folders.mjs --replace
 * SANITY_API_TOKEN=sk... node scripts/upload-properties-from-folders.mjs --baseDir _uploads/properties
 */

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const projectId = "6ostes35";
const dataset = "production";
const apiVersion = "2024-01-01";

const token = process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN;

if (!token) {
  console.error("Error: SANITY_API_TOKEN (or SANITY_TOKEN) is required.");
  console.error("Example: SANITY_API_TOKEN=sk... node scripts/upload-properties-from-folders.mjs");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif"]);

const STATUS_ALIASES = {
  sold: "sold",
  vendido: "sold",
  vendidos: "sold",
  rented: "rented",
  alquilado: "rented",
  alquilados: "rented",
  "active-sale": "active-sale",
  "for-sale": "active-sale",
  "en-venta": "active-sale",
  venta: "active-sale",
  "active-rental": "active-rental",
  "for-rent": "active-rental",
  "en-renta": "active-rental",
  renta: "active-rental",
};

function parseArgs(argv) {
  const options = {
    baseDir: "_uploads/properties",
    dryRun: false,
    replace: false,
    state: "PR",
    propertyType: "condo",
    year: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--replace") {
      options.replace = true;
      continue;
    }

    if (arg === "--baseDir") {
      options.baseDir = argv[i + 1] || options.baseDir;
      i += 1;
      continue;
    }

    if (arg === "--state") {
      const state = (argv[i + 1] || "").toUpperCase();
      if (state === "PR" || state === "FL") {
        options.state = state;
      }
      i += 1;
      continue;
    }

    if (arg === "--propertyType") {
      const type = argv[i + 1];
      if (type) {
        options.propertyType = type;
      }
      i += 1;
      continue;
    }

    if (arg === "--year") {
      const parsed = Number.parseInt(argv[i + 1], 10);
      if (!Number.isNaN(parsed)) {
        options.year = parsed;
      }
      i += 1;
    }
  }

  return options;
}

function normalizeStatus(folderName) {
  const key = folderName.trim().toLowerCase();
  return STATUS_ALIASES[key] || null;
}

function toTitleFromFilename(filename) {
  const parsed = path.parse(filename).name;
  return parsed
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function isImageFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

async function collectEntries(baseDir) {
  const absoluteBase = path.resolve(process.cwd(), baseDir);
  const firstLevel = await readdir(absoluteBase, { withFileTypes: true });

  const entries = [];

  for (const dirent of firstLevel) {
    if (!dirent.isDirectory()) {
      continue;
    }

    const status = normalizeStatus(dirent.name);
    if (!status) {
      console.warn(`Skipping folder "${dirent.name}" (unknown status)`);
      continue;
    }

    const folderPath = path.join(absoluteBase, dirent.name);
    const files = await readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile() || !isImageFile(file.name)) {
        continue;
      }

      entries.push({
        status,
        fileName: file.name,
        absolutePath: path.join(folderPath, file.name),
        title: toTitleFromFilename(file.name),
      });
    }
  }

  return entries;
}

async function findBySlug(slug) {
  const query = '*[_type == "property" && slug.current == $slug][0]{_id, title}';
  return client.fetch(query, { slug });
}

async function uploadImage(filePath) {
  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename: path.basename(filePath),
  });

  return asset._id;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log("Bulk property upload from folders");
  console.log("================================");
  console.log(`Base dir : ${options.baseDir}`);
  console.log(`State    : ${options.state}`);
  console.log(`Type     : ${options.propertyType}`);
  console.log(`Dry run  : ${options.dryRun ? "yes" : "no"}`);
  console.log(`Replace  : ${options.replace ? "yes" : "no"}`);
  if (options.year) {
    console.log(`Year     : ${options.year}`);
  }
  console.log("");

  const entries = await collectEntries(options.baseDir);

  if (entries.length === 0) {
    console.log("No image files found.");
    return;
  }

  console.log(`Found ${entries.length} image(s) to process.\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const progress = `[${i + 1}/${entries.length}]`;

    try {
      const slugBase = slugify(entry.title) || `property-${Date.now()}`;
      const existing = await findBySlug(slugBase);

      if (existing && !options.replace) {
        console.log(`${progress} SKIP  ${entry.title} (slug exists: ${slugBase})`);
        skipped += 1;
        continue;
      }

      const docBase = {
        _type: "property",
        title: entry.title,
        slug: { _type: "slug", current: slugBase },
        status: entry.status,
        historicalRecord: true,
        propertyType: options.propertyType,
        featured: false,
        location: {
          state: options.state,
        },
      };

      if ((entry.status === "sold" || entry.status === "rented") && options.year) {
        docBase.yearTransacted = options.year;
      }

      if (options.dryRun) {
        const action = existing ? "UPDATE" : "CREATE";
        console.log(`${progress} ${action} ${entry.title} -> ${entry.status}`);
        if (existing) {
          updated += 1;
        } else {
          created += 1;
        }
        continue;
      }

      const assetId = await uploadImage(entry.absolutePath);

      const payload = {
        ...docBase,
        featuredImage: {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
          alt: entry.title,
        },
      };

      if (existing) {
        await client.patch(existing._id).set(payload).commit();
        console.log(`${progress} UPDATE ${entry.title} -> ${entry.status}`);
        updated += 1;
      } else {
        await client.create(payload);
        console.log(`${progress} CREATE ${entry.title} -> ${entry.status}`);
        created += 1;
      }
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${progress} FAIL  ${entry.title}: ${message}`);
    }
  }

  console.log("\nSummary");
  console.log("=======");
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed : ${failed}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
