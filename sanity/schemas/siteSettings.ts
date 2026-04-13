import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),

    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "phone",
      title: "Contact Phone",
      type: "string",
    }),

    defineField({
      name: "address",
      title: "Office Address",
      type: "text",
    }),

    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Twitter", value: "twitter" },
                ],
              },
            },
            {
              name: "url",
              title: "URL",
              type: "url",
            },
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
        },
      ],
    }),

    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      description: "Copyright or additional footer text",
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
