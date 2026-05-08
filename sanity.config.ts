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
              .child(
                S.list()
                  .title("Properties")
                  .items([
                    S.listItem()
                      .title("All Properties")
                      .schemaType("property")
                      .child(S.documentTypeList("property").title("All Properties")),

                    S.divider(),

                    S.listItem()
                      .title("By Status")
                      .child(
                        S.list()
                          .title("By Status")
                          .items([
                            S.listItem()
                              .title("For Sale")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("For Sale")
                                  .filter('_type == "property" && status == "active-sale"')
                              ),
                            S.listItem()
                              .title("For Rent")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("For Rent")
                                  .filter('_type == "property" && status == "active-rental"')
                              ),
                            S.listItem()
                              .title("Sold")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("Sold")
                                  .filter('_type == "property" && status == "sold"')
                              ),
                            S.listItem()
                              .title("Rented")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("Rented")
                                  .filter('_type == "property" && status == "rented"')
                              ),
                          ])
                      ),

                    S.listItem()
                      .title("By Property Type")
                      .child(
                        S.list()
                          .title("By Property Type")
                          .items([
                            S.listItem()
                              .title("Condo")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("Condo")
                                  .filter('_type == "property" && propertyType == "condo"')
                              ),
                            S.listItem()
                              .title("Residential")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("Residential")
                                  .filter('_type == "property" && propertyType == "residential"')
                              ),
                            S.listItem()
                              .title("Commercial")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("Commercial")
                                  .filter('_type == "property" && propertyType == "commercial"')
                              ),
                            S.listItem()
                              .title("Land")
                              .schemaType("property")
                              .child(
                                S.documentTypeList("property")
                                  .title("Land")
                                  .filter('_type == "property" && propertyType == "land"')
                              ),
                          ])
                      ),
                  ])
              ),

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
