// app/shop/[slug]/page.tsx
import { notFound } from "next/navigation";
import ShopDetails from "@/components/ShopDetails";
import { getProductBySlug } from "@/sanity/groq";
import { client } from "@/sanity/client";

// Revalidate every 60 seconds - ensures prices and product data stay fresh
export const revalidate = 60;

// Generate static params for all products
export async function generateStaticParams() {
  const products = await client.fetch<{ slug: string }[]>(
    `*[_type == "product"]{ "slug": slug.current }`
  );

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Vetabelle",
    };
  }

  // Extract plain text from block content description
  let description =
    "Empower your natural beauty with Vetabelle's high-quality wellness supplements";
  if (product.description && Array.isArray(product.description)) {
    const textBlocks = product.description
      .filter((block: any) => block._type === "block")
      .map(
        (block: any) =>
          block.children?.map((child: any) => child.text).join("") || ""
      )
      .join(" ");
    description = textBlocks.slice(0, 160) || description;
  }

  return {
    title: `${product.title} | Vetabelle - Beauty from Within`,
    description,
    keywords: [
      "wellness supplements",
      "beauty supplements",
      "hair growth",
      "skin health",
      "nail strength",
      "women's health",
      "natural beauty",
      "Vetabelle",
    ],
    openGraph: {
      title: `${product.title} | Vetabelle`,
      description,
      images: product.image ? [product.image] : [],
      type: "website",
      siteName: "Vetabelle",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Vetabelle`,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ShopDetails product={product} />;
}
