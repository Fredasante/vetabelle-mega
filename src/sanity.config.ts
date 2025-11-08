import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./sanity/schemas";

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
});
