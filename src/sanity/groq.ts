import { Product } from "@/types/product";
import { client } from "./client";

// 🛍️ All products (available only, newest first)
export const allProductsQuery = `
  *[_type == "product" && status == "in-stock"] | order(createdAt desc) {
    _id,
    title,
    slug,
    price,
    discountPrice,
    description,
    status,
    createdAt,
    "image": image.asset->url
  }
`;

// ✅ Fetch 12 most recent in-stock products (New Arrivals)
export const newArrivalsQuery = `
  *[_type == "product" && status == "in-stock"] 
  | order(coalesce(createdAt, _createdAt) desc)[0...12] {
    _id,
    title,
    slug,
    price,
    discountPrice,
    description,
    status,
    createdAt,
    "image": image.asset->url
  }
`;

// 🔍 Search by name (in-stock only)
export const searchProductsQuery = `
  *[_type == "product" && title match $search + "*" && status == "in-stock"] | order(createdAt desc) {
    _id,
    title,
    slug,
    price,
    discountPrice,
    description,
    status,
    createdAt,
    "image": image.asset->url
  }
`;

// 🧭 Paginated products (in-stock only)
export const paginatedProductsQuery = `
  *[_type == "product" && status == "in-stock"] | order(createdAt desc) [$start...$end] {
    _id,
    title,
    slug,
    price,
    discountPrice,
    description,
    status,
    createdAt,
    "image": image.asset->url
  }
`;

// 📊 Count total in-stock products
export const productCountQuery = `
  count(*[_type == "product" && status == "in-stock"])
`;

// 🧾 Single product by slug (in-stock only)
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug && status == "in-stock"][0] {
    _id,
    title,
    slug,
    price,
    discountPrice,
    description,
    status,
    createdAt,
    "image": image.asset->url
  }
`;

// 🚀 Function to fetch product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await client.fetch<Product>(PRODUCT_BY_SLUG_QUERY, {
      slug,
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 🧩 All product slugs (for static generation)
export const ALL_PRODUCT_SLUGS_QUERY = `
  *[_type == "product" && status == "in-stock"]{ "slug": slug.current }
`;
