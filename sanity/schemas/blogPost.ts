import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required().error("Author is required"),
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) =>
        Rule.required().error("Publication date is required"),
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Short summary for listing pages (max 200 characters)",
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().error("Body content is required"),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "publishedAt",
      media: "featuredImage",
    },
    prepare({ title, author, date, media }) {
      return {
        title: title,
        subtitle: `${author || "No author"} • ${date ? new Date(date).toLocaleDateString() : "No date"}`,
        media: media,
      };
    },
  },

  orderings: [
    {
      title: "Newest First",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
