// app/shop/[slug]/page.tsx
import { notFound } from "next/navigation";
import ShopDetails from "@/components/ShopDetails";
import { getProductBySlug } from "@/sanity/groq";
import { client } from "@/sanity/client";

// Generate static params for all products (for better performance)
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
      title: "Product Not Found",
    };
  }

  // Handle description - extract plain text if it's block content
  let description = "Shop this amazing product";
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
    title: `${product.name} | Bend the Trendd`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.mainImageUrl ? [product.mainImageUrl] : [],
      type: "website",
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
