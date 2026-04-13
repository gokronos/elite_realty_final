import { defineField, defineType } from "sanity";

const neighborhoodOptions = [
  { title: "Condado (PR)", value: "Condado" },
  { title: "Dorado (PR)", value: "Dorado" },
  { title: "Guaynabo (PR)", value: "Guaynabo" },
  { title: "Miramar (PR)", value: "Miramar" },
  { title: "Santurce (PR)", value: "Santurce" },
  { title: "Hato Rey (PR)", value: "Hato Rey" },
  { title: "Ocean Park (PR)", value: "Ocean Park" },
  { title: "Coral Gables (FL)", value: "Coral Gables" },
  { title: "Brickell (FL)", value: "Brickell" },
  { title: "Miami Beach (FL)", value: "Miami Beach" },
  { title: "Key Biscayne (FL)", value: "Key Biscayne" },
  { title: "Coconut Grove (FL)", value: "Coconut Grove" },
];

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
          { title: "For Sale", value: "active-sale" },
          { title: "For Rent", value: "active-rental" },
          { title: "Sold", value: "sold" },
          { title: "Rented", value: "rented" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error("Status is required"),
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
          { title: "Sale Price", value: "sale" },
          { title: "Monthly Rent", value: "rent" },
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
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: "bathrooms",
      title: "Bathrooms",
      type: "number",
      group: "details",
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: "sqft",
      title: "Square Feet",
      type: "number",
      group: "details",
      validation: (Rule) => Rule.positive(),
    }),

    defineField({
      name: "yearTransacted",
      title: "Year Sold/Rented",
      type: "number",
      description: "For past transactions only",
      group: "details",
      hidden: ({ document }) =>
        document?.status === "active-sale" ||
        document?.status === "active-rental",
      validation: (Rule) => Rule.min(2000).max(2030),
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
      name: "location",
      title: "Location",
      type: "object",
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
          validation: (Rule) => Rule.required().error("City is required"),
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
          validation: (Rule) => Rule.required().error("State is required"),
        },
        {
          name: "neighborhood",
          title: "Neighborhood",
          type: "string",
          description: "e.g., Condado, Dorado, Coral Gables",
          options: {
            list: neighborhoodOptions,
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
      title: "External Listing URL",
      type: "url",
      description: "Zillow, Realtor.com, or Clasificados link",
      group: "settings",
    }),

    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      description: "Show this property on the homepage",
      group: "settings",
      initialValue: false,
    }),

    defineField({
      name: "featuredOrder",
      title: "Featured Order",
      type: "number",
      description: "1 = first position, 2 = second, etc.",
      group: "settings",
      hidden: ({ document }) => !document?.featured,
      validation: (Rule) => Rule.min(1).max(10),
    }),
  ],

  preview: {
    select: {
      title: "title",
      status: "status",
      city: "location.city",
      media: "featuredImage",
    },
    prepare({ title, status, city, media }) {
      const statusLabels: Record<string, string> = {
        "active-sale": "🟢 For Sale",
        "active-rental": "🟡 For Rent",
        sold: "⚪ Sold",
        rented: "⚪ Rented",
      };
      return {
        title: title,
        subtitle: `${statusLabels[status] || status} • ${city || "No location"}`,
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
        { field: "featuredOrder", direction: "asc" },
      ],
    },
  ],
});
