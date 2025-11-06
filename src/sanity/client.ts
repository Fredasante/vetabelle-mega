import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "f9rxg371",
  dataset: "production",
  apiVersion: "2023-10-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

export const fetcher = async ([query, params = {}]) =>
  await client.fetch(query, params);
