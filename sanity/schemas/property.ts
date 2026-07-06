import { defineField, defineType } from "sanity";

const activeStatuses = ["active-sale", "active-rental", "forSale", "forRent"];

const marketOptions = [
  { title: "Condado (PR)", value: "Condado" },
  { title: "Dorado (PR)", value: "Dorado" },
  { title: "Guaynabo (PR)", value: "Guaynabo" },
  { title: "Miramar (PR)", value: "Miramar" },
  { title: "Ocean Park (PR)", value: "Ocean Park" },
  { title: "Hato Rey (PR)", value: "Hato Rey" },
  { title: "Santurce (PR)", value: "Santurce" },
  { title: "Vega Alta (PR)", value: "Vega Alta" },
  { title: "Bayamon (PR)", value: "Bayamon" },
  { title: "Coral Gables (FL)", value: "Coral Gables" },
  { title: "Brickell (FL)", value: "Brickell" },
  { title: "Miami Beach (FL)", value: "Miami Beach" },
  { title: "Edgewater (FL)", value: "Edgewater" },
  { title: "Key Biscayne (FL)", value: "Key Biscayne" },
  { title: "Coconut Grove (FL)", value: "Coconut Grove" },
];

const isCommercial = (document?: Record<string, unknown>) =>
  document?.propertyType === "commercial";

const isLand = (document?: Record<string, unknown>) =>
  document?.propertyType === "land";

export const property = defineType({
  name: "property",
  title: "Property",
  type: "document",
  groups: [
    { name: "basic", title: "Basic Info", default: true },
    { name: "details", title: "Details" },
    { name: "location", title: "Location" },
    { name: "media", title: "Media" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // === BASIC INFO ===
    defineField({
      name: "title",
      title: "Property Title",
      type: "string",
      description: 'e.g., "Atlantis #308" or "Luxury Penthouse at Condado"',
      group: "basic",
      validation: (Rule) => Rule.required().error("Property title is required"),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier (auto-generated from title)",
      group: "basic",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "For Sale", value: "forSale" },
          { title: "For Rent", value: "forRent" },
          { title: "Sold", value: "sold" },
          { title: "Rented", value: "rented" },
          { title: "For Sale (legacy)", value: "active-sale" },
          { title: "For Rent (legacy)", value: "active-rental" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error("Status is required"),
    }),

    defineField({
      name: "historicalRecord",
      title: "Historical Record / Partial Data",
      type: "boolean",
      description: "Enable for older sold/rented properties when only partial information is available.",
      group: "basic",
      initialValue: false,
    }),

    defineField({
      name: "propertyType",
      title: "Property Type",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "Condo", value: "condo" },
          { title: "Residential", value: "residential" },
          { title: "Commercial", value: "commercial" },
          { title: "Land", value: "land" },
        ],
      },
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: 'Price in USD. Leave empty for "Contact for Price"',
      group: "basic",
      validation: (Rule) => Rule.positive().error("Price must be positive"),
    }),

    defineField({
      name: "priceType",
      title: "Price Type",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "Sale Price", value: "salePrice" },
          { title: "Monthly Rent", value: "monthlyRent" },
          { title: "Sale Price (legacy)", value: "sale" },
          { title: "Monthly Rent (legacy)", value: "rent" },
        ],
        layout: "radio",
      },
      hidden: ({ document }) => !document?.price,
    }),

    // === DETAILS ===
    defineField({
      name: "bedrooms",
      title: "Bedrooms",
      type: "number",
      group: "details",
      hidden: ({ document }) => isCommercial(document) || isLand(document),
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: "bathrooms",
      title: "Bathrooms",
      type: "number",
      group: "details",
      hidden: ({ document }) => isLand(document),
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: "halfBathrooms",
      title: "Half Bathrooms",
      type: "number",
      group: "details",
      hidden: ({ document }) => isLand(document),
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: "sqft",
      title: "Square Feet",
      type: "number",
      group: "details",
      hidden: ({ document }) => isLand(document),
      validation: (Rule) => Rule.positive(),
    }),

    defineField({
      name: "squareFeet",
      title: "Square Feet (new)",
      type: "number",
      description: "Preferred new field. Legacy sqft remains supported.",
      group: "details",
      hidden: ({ document }) => isLand(document),
      validation: (Rule) => Rule.positive(),
    }),

    defineField({
      name: "lotSize",
      title: "Lot Size",
      type: "string",
      description: 'Examples: "1,200 sqm", "0.5 acres", "800 m2".',
      group: "details",
    }),

    defineField({
      name: "yearBuilt",
      title: "Year Built",
      type: "number",
      group: "details",
      validation: (Rule) => Rule.min(1800).max(2030),
    }),

    defineField({
      name: "yearTransacted",
      title: "Year Sold/Rented",
      type: "number",
      description: "For past transactions only",
      group: "details",
      hidden: ({ document }) =>
        activeStatuses.includes(String(document?.status)),
      validation: (Rule) => Rule.min(2000).max(2030),
    }),

    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "details",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      group: "details",
    }),

    // === LOCATION ===
    defineField({
      name: "market",
      title: "Market / Main Area",
      type: "string",
      description:
        "Primary filter area. Example: Dorado, Condado, Santurce, Brickell.",
      group: "location",
      options: {
        list: marketOptions,
        layout: "dropdown",
      },
    }),

    defineField({
      name: "communityOrBuilding",
      title: "Community or Building",
      type: "string",
      description:
        "Specific community, condo, urbanization, or office building. Example: Dorado del Mar, Condado Blu, FirstBank Building.",
      group: "location",
    }),

    defineField({
      name: "streetAddress",
      title: "Street Address",
      type: "string",
      group: "location",
    }),

    defineField({
      name: "city",
      title: "City",
      type: "string",
      group: "location",
    }),

    defineField({
      name: "state",
      title: "State / Territory",
      type: "string",
      group: "location",
      options: {
        list: [
          { title: "Puerto Rico", value: "PR" },
          { title: "Florida", value: "FL" },
        ],
        layout: "radio",
      },
    }),

    defineField({
      name: "zipCode",
      title: "ZIP Code",
      type: "string",
      group: "location",
    }),

    defineField({
      name: "country",
      title: "Country",
      type: "string",
      group: "location",
      initialValue: "USA",
      options: {
        list: [
          { title: "United States", value: "USA" },
          { title: "Puerto Rico", value: "Puerto Rico" },
        ],
      },
    }),

    defineField({
      name: "location",
      title: "Legacy Location",
      type: "object",
      description:
        "Existing location object kept for backwards compatibility. Prefer the fields above for new entries.",
      group: "location",
      fields: [
        {
          name: "address",
          title: "Street Address",
          type: "string",
        },
        {
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) =>
            Rule.custom((value, context) => {
              if (context.document?.historicalRecord) return true;
              return value ? true : "City is required";
            }),
        },
        {
          name: "state",
          title: "State",
          type: "string",
          options: {
            list: [
              { title: "Puerto Rico", value: "PR" },
              { title: "Florida", value: "FL" },
            ],
            layout: "radio",
          },
          validation: (Rule) =>
            Rule.custom((value, context) => {
              if (context.document?.historicalRecord) return true;
              return value ? true : "State is required";
            }),
        },
        {
          name: "neighborhood",
          title: "Neighborhood",
          type: "string",
          description: "e.g., Condado, Dorado, Coral Gables",
          options: {
            list: marketOptions,
            layout: "dropdown",
          },
        },
      ],
    }),

    // === MEDIA ===
    defineField({
      name: "featuredImage",
      title: "Featured Image (single)",
      type: "image",
      description: "Foto principal de la propiedad (solo una)",
      group: "media",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Opcional (recomendado para accesibilidad)",
        },
      ],
      validation: (Rule) => Rule.required().error("Featured image is required"),
    }),

    defineField({
      name: "gallery",
      title: "Gallery (multiple images)",
      type: "array",
      description: "Sube varias imagenes a la vez: seleccion multiple (Ctrl/Shift) o arrastrar 10-20 juntas",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    // === SETTINGS ===
    defineField({
      name: "externalUrl",
      title: "External Listing URL (legacy)",
      type: "url",
      description:
        "Legacy field kept for existing data. Prefer External Listing URL below.",
      group: "settings",
    }),

    defineField({
      name: "externalListingUrl",
      title: "External Listing URL",
      type: "url",
      description: "Zillow, Realtor.com, Clasificados, MLS, or brokerage link.",
      group: "settings",
    }),

    defineField({
      name: "virtualTourUrl",
      title: "Virtual Tour URL",
      type: "url",
      group: "settings",
    }),

    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "settings",
    }),

    defineField({
      name: "featured",
      title: "Featured on Homepage (legacy)",
      type: "boolean",
      description:
        "Legacy field kept for existing data. Prefer Featured on Homepage below.",
      group: "settings",
      initialValue: false,
    }),

    defineField({
      name: "featuredOnHomepage",
      title: "Featured on Homepage",
      type: "boolean",
      description: "Show this property on the homepage.",
      group: "settings",
      initialValue: false,
    }),

    defineField({
      name: "featuredOrder",
      title: "Featured Order",
      type: "number",
      description: "1 = first position, 2 = second, etc.",
      group: "settings",
      hidden: ({ document }) =>
        !document?.featured && !document?.featuredOnHomepage,
      validation: (Rule) => Rule.min(1).max(10),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(70),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (Rule) => Rule.max(170),
    }),
  ],

  preview: {
    select: {
      title: "title",
      status: "status",
      city: "location.city",
      market: "market",
      communityOrBuilding: "communityOrBuilding",
      media: "featuredImage",
    },
    prepare({ title, status, city, market, communityOrBuilding, media }) {
      const statusLabels: Record<string, string> = {
        forSale: "For Sale",
        "active-sale": "For Sale",
        forRent: "For Rent",
        "active-rental": "For Rent",
        sold: "Sold",
        rented: "Rented",
      };
      const locationLabel =
        communityOrBuilding || market || city || "Location on file";
      return {
        title: title,
        subtitle: `${statusLabels[status] || status} - ${locationLabel}`,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Newest First",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Featured First",
      name: "featuredDesc",
      by: [
        { field: "featured", direction: "desc" },
        { field: "featuredOnHomepage", direction: "desc" },
        { field: "featuredOrder", direction: "asc" },
      ],
    },
  ],
});
