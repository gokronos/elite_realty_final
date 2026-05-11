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

    defineField({
      name: "historicalPropertiesLayout",
      title: "Historical Properties Layout",
      type: "string",
      description:
        "Controls how sold and rented historical properties are organized on the website.",
      options: {
        list: [
          { title: "Standard Layout", value: "default" },
          { title: "Group Historical Properties by Year", value: "by-year" },
        ],
        layout: "radio",
      },
      initialValue: "default",
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
