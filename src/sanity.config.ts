import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./sanity/schemas";
import { PrintOrderAction } from "./sanity/schemas/printOrderAction";

export default defineConfig({
  name: "default",
  title: "Vetabelle",
  projectId: "lomuktof",
  dataset: "production",
  basePath: "/admin",
  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemas,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === "order") {
        return [...prev, PrintOrderAction];
      }
      return prev;
    },
  },
});
