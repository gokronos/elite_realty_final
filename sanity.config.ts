/**
 * Sanity Studio configuration
 * Defines the studio structure and plugins
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { projectId, dataset } from "./sanity/env";

export default defineConfig({
  name: "elite-realty",
  title: "Elite Realty",
  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Properties section
            S.listItem()
              .title("Properties")
              .schemaType("property")
              .child(S.documentTypeList("property").title("Properties")),

            // Blog section
            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.listItem()
                      .title("Posts")
                      .schemaType("blogPost")
                      .child(S.documentTypeList("blogPost").title("Posts")),
                    S.listItem()
                      .title("Authors")
                      .schemaType("author")
                      .child(S.documentTypeList("author").title("Authors")),
                  ])
              ),

            S.divider(),

            // Site Settings (singleton)
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema: {
    types: schemaTypes,
  },
});
