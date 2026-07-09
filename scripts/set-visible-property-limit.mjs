const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gn3kobnn";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_TOKEN;

const visibleLimit = Number(process.env.VISIBLE_PROPERTY_LIMIT || 30);

const activeStatuses = new Set(["forSale", "forRent", "active-sale", "active-rental"]);

const query = `*[_type == "property" && !(_id in path("drafts.**"))] | order(status asc, yearTransacted desc, _createdAt desc){
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  status,
  featured,
  featuredOnHomepage,
  featuredOrder,
  price,
  yearTransacted
}`;

function scoreHistoricalProperty(property) {
  let score = 0;

  if (property.featured || property.featuredOnHomepage) score += 1000;
  if (typeof property.featuredOrder === "number") score += 100 - property.featuredOrder;
  if (typeof property.yearTransacted === "number") score += property.yearTransacted;
  if (typeof property.price === "number") score += Math.min(property.price / 100000, 50);

  return score;
}

function newestFirst(a, b) {
  return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
}

function chooseVisibleProperties(properties) {
  const active = properties
    .filter((property) => activeStatuses.has(property.status))
    .sort((a, b) => {
      const featuredDelta =
        Number(Boolean(b.featured || b.featuredOnHomepage)) -
        Number(Boolean(a.featured || a.featuredOnHomepage));
      if (featuredDelta !== 0) return featuredDelta;
      return newestFirst(a, b);
    });

  const remainingSlots = Math.max(visibleLimit - active.length, 0);
  const soldSlots = Math.floor(remainingSlots / 2);
  const rentedSlots = remainingSlots - soldSlots;

  const sold = properties
    .filter((property) => property.status === "sold")
    .sort((a, b) => scoreHistoricalProperty(b) - scoreHistoricalProperty(a) || newestFirst(a, b))
    .slice(0, soldSlots);

  const rented = properties
    .filter((property) => property.status === "rented")
    .sort((a, b) => scoreHistoricalProperty(b) - scoreHistoricalProperty(a) || newestFirst(a, b))
    .slice(0, rentedSlots);

  return [...active, ...sold, ...rented].slice(0, visibleLimit);
}

async function sanityRequest(path, options = {}) {
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    }
  );

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${body}`);
  }

  return body ? JSON.parse(body) : null;
}

async function main() {
  const data = await sanityRequest(
    `query/${dataset}?query=${encodeURIComponent(query)}`
  );
  const properties = data.result || [];
  const visible = chooseVisibleProperties(properties);
  const visibleIds = new Set(visible.map((property) => property._id));

  const mutations = properties.map((property) => ({
    patch: {
      id: property._id,
      set: {
        hiddenFromWebsite: !visibleIds.has(property._id),
      },
    },
  }));

  console.log(`Total properties: ${properties.length}`);
  console.log(`Visible properties: ${visible.length}`);
  console.log(`Hidden properties: ${properties.length - visible.length}`);
  console.log("\nVisible selection:");
  visible.forEach((property, index) => {
    console.log(
      `${String(index + 1).padStart(2, "0")} | ${property.status} | ${property.title} | ${property.slug}`
    );
  });

  if (!token || process.argv.includes("--dry-run")) {
    console.log("\nDry run only. Set SANITY_API_TOKEN and run without --dry-run to apply.");
    return;
  }

  for (let index = 0; index < mutations.length; index += 25) {
    const batch = mutations.slice(index, index + 25);
    await sanityRequest(`mutate/${dataset}`, {
      method: "POST",
      body: JSON.stringify({ mutations: batch }),
    });
  }

  console.log("\nDone. Sanity visibility flags updated.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
