// One-off script: creates the active Vetabelle Mentorship & Masterclass document in Sanity.
// Run once with:   node scripts/seed-masterclass.mjs
// Safe to re-run — it skips creation if a document with the same slug already exists.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// Load env from .env.local (no dotenv dependency).
const envPath = join(projectRoot, ".env.local");
if (!existsSync(envPath)) {
  console.error("Could not find .env.local at", envPath);
  process.exit(1);
}
const envText = readFileSync(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let value = m[2];
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  if (!process.env[m[1]]) process.env[m[1]] = value;
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lomuktof";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("SANITY_API_TOKEN missing from .env.local — cannot write to Sanity.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2023-10-01",
  useCdn: false,
  token,
});

const SLUG = "vetabelle-mentorship-masterclass-may-2026";
const BANNER_IMAGE_PATH = join(projectRoot, "public", "popup-event-1.jpeg");

const description = [
  {
    _type: "block",
    _key: "intro",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "intro-1",
        text:
          "This Premium Masterclass is designed to help you build your Confidence, become Financially Stable, and Heal Into your Highest self. Join the Vetabelle Mentorship & Masterclass and become the best version of yourself.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "what",
    style: "h3",
    markDefs: [],
    children: [
      { _type: "span", _key: "what-1", text: "What this Masterclass covers", marks: [] },
    ],
  },
  {
    _type: "block",
    _key: "covers",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "covers-1",
        text:
          "An in-person session led by Betty Winifred Sackey, packed with practical lessons on starting and growing a business, leadership, financial management, marketing, networking, and self-care. Every topic is designed for women who want to step into their highest, most confident self — equipped with the skills to build, sustain, and protect their dreams.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "who",
    style: "h3",
    markDefs: [],
    children: [
      { _type: "span", _key: "who-1", text: "Who it's for", marks: [] },
    ],
  },
  {
    _type: "block",
    _key: "audience",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "audience-1",
        text:
          "Market traders, small business owners, entrepreneurs, students, employed professionals, freelancers, job seekers, and content creators — anyone ready to invest in themselves.",
        marks: [],
      },
    ],
  },
];

async function main() {
  console.log("Connecting to Sanity:", projectId, "/", dataset);

  // Skip if already seeded.
  const existing = await client.fetch(
    `*[_type == "masterclass" && slug.current == $slug][0]{ _id, title }`,
    { slug: SLUG },
  );
  if (existing) {
    console.log("Masterclass already exists:", existing.title, "(", existing._id, ")");
    console.log("Nothing to do. Edit it in Sanity Studio at /admin if you want changes.");
    return;
  }

  // Upload the banner image as a Sanity asset.
  if (!existsSync(BANNER_IMAGE_PATH)) {
    console.error("Banner image not found at", BANNER_IMAGE_PATH);
    process.exit(1);
  }
  console.log("Uploading banner image…");
  const imageBuffer = readFileSync(BANNER_IMAGE_PATH);
  const imageAsset = await client.assets.upload("image", imageBuffer, {
    filename: "vetabelle-masterclass-banner.jpeg",
  });
  console.log("Image asset uploaded:", imageAsset._id);

  // Create the masterclass document.
  console.log("Creating masterclass document…");
  const doc = await client.create({
    _type: "masterclass",
    title: "Vetabelle Mentorship & Masterclass",
    slug: { _type: "slug", current: SLUG },
    eventDate: "2026-05-30T10:00:00.000Z",
    location: "Accra, Ghana",
    bannerImage: {
      _type: "image",
      asset: { _type: "reference", _ref: imageAsset._id },
    },
    description,
    learningTopics: [
      "Starting a business",
      "Growing my business",
      "Confidence building",
      "Leadership",
      "Self-care and well-being",
      "Financial management",
      "Marketing",
      "Networking",
    ],
    audienceTypes: [
      "Market Trader",
      "Small Business Owner",
      "Entrepreneur",
      "Student",
      "Employed",
      "Freelancer",
      "Job Seeker",
      "Social Media Influencer/Content Creator",
    ],
    referralSources: [
      "Tiktok",
      "Instagram",
      "Facebook",
      "Whatsapp",
      "Friends/Family",
      "LinkedIn",
    ],
    regularPrice: 1500,
    earlyBirdPrice: 1000,
    earlyBirdDeadline: "2026-04-30T23:59:59.000Z",
    registrationOpen: true,
    registrationDeadline: "2026-05-29T23:59:59.000Z",
    isActive: true,
  });

  console.log("\n✅ Masterclass created");
  console.log("   _id:        ", doc._id);
  console.log("   slug:       ", SLUG);
  console.log("   eventDate:  ", doc.eventDate);
  console.log("   isActive:   ", doc.isActive);
  console.log(
    "\nVisit http://localhost:3000/masterclass to see it. Swap the banner image in Studio (/admin) when you have the final pink banner.",
  );
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
