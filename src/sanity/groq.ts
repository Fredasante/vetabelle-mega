import { Product } from "@/types/product";
import { client } from "./client";

// 🛍️ All products (in-stock first, then out-of-stock, newest first)
export const allProductsQuery = `
  *[_type == "product"] | order(select(status == "out-of-stock" => 1, 0) asc, createdAt desc) {
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

// (New Arrivals)
export const newArrivalsQuery = `
  *[_type == "product"]
  | order(select(status == "out-of-stock" => 1, 0) asc, coalesce(createdAt, _createdAt) desc) {
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

// 🔍 Search by name (in-stock first, out-of-stock last)
export const searchProductsQuery = `
  *[_type == "product" && title match $search + "*"] | order(select(status == "out-of-stock" => 1, 0) asc, createdAt desc) {
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

// 🧭 Paginated products (in-stock first, out-of-stock last)
export const paginatedProductsQuery = `
  *[_type == "product"] | order(select(status == "out-of-stock" => 1, 0) asc, createdAt desc) [$start...$end] {
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

// 📊 Count total products
export const productCountQuery = `
  count(*[_type == "product"])
`;

// 🧾 Single product by slug
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
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
  *[_type == "product"]{ "slug": slug.current }
`;
