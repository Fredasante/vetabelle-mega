import { Product } from "@/types/product";
import { client } from "./client";

// 🛍️ All products (newest first) - AVAILABLE ONLY
export const allProductsQuery = `
  *[_type == "product" && status == "available"] | order(createdAt desc) {
    _id,
    name,
    slug,
    price,
    discountPrice,
    category,
    description,
    gender,
    status,
    isFeatured,
    "mainImageUrl": mainImage.asset->url
  }
`;

// 👕 Products by Category - AVAILABLE ONLY
export const productsByCategoryQuery = `
  *[_type == "product" && category == $category && status == "available"] | order(createdAt desc) {
    _id,
    name,
    slug,
    price,
    discountPrice,
    category,
    description,
    isFeatured,
    "mainImageUrl": mainImage.asset->url
  }
`;

// ✅ Fetch the 12 most recent available products (New Arrivals)
export const newArrivalsQuery = `
  *[_type == "product" && status == "available"] | order(_createdAt desc)[0...12]{
    _id,
    name,
    slug,
    price,
    sizes,
    colors,
    discountPrice,
    category,
    description,
    "mainImageUrl": mainImage.asset->url
  }
`;

// 🔍 Search by name - AVAILABLE ONLY
export const searchProductsQuery = `
  *[_type == "product" && name match $search + "*" && status == "available"] | order(createdAt desc) {
    _id,
    name,
    slug,
    price,
    discountPrice,
    category,
    sizes,
    colors,
    description,
    "mainImageUrl": mainImage.asset->url
  }
`;

// 🧭 Paginated products - AVAILABLE ONLY
export const paginatedProductsQuery = `
  *[_type == "product" && status == "available"] | order(createdAt desc) [$start...$end] {
    _id,
    name,
    slug,
    price,
    discountPrice,
    sizes,
    colors,
    category,
    gender,
    status,
    isFeatured,
    description,
    "mainImageUrl": mainImage.asset->url
  }
`;

// Count available products with optional category filter
export const productCountQuery = `count(*[_type == "product" && status == "available" $categoryFilter])`;

// Categories with product count - AVAILABLE ONLY
export const categoriesWithCountQuery = `
  *[_type == "product" && status == "available"] {
    category
  } | {
    "name": category,
    "products": count(*[_type == "product" && category == ^.category && status == "available"])
  }
`;

// Genders with product count - AVAILABLE ONLY
export const gendersWithCountQuery = `
  *[_type == "product" && status == "available"] {
    gender
  } | {
    "name": gender,
    "products": count(*[_type == "product" && gender == ^.gender && status == "available"])
  }
`;

// Sizes with count - AVAILABLE ONLY
export const sizesWithCountQuery = `
  *[_type == "product" && defined(sizes) && status == "available"] {
    sizes
  }
`;

// Colors with count - AVAILABLE ONLY
export const colorsWithCountQuery = `
  *[_type == "product" && defined(colors) && status == "available"] {
    colors
  }
`;

// Query to fetch a single product by slug - AVAILABLE ONLY
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug && status == "available"][0]{
    _id,
    name,
    slug,
    "mainImageUrl": mainImage.asset->url,
    "gallery": gallery[]{
      "imageUrl": asset->url
    },
    category,
    gender,
    sizes,
    price,
    discountPrice,
    colors,
    description,
    status,
    isFeatured,
    createdAt
  }
`;

// Function to fetch product by slug
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

// Query to get all AVAILABLE product slugs (for static generation)
export const ALL_PRODUCT_SLUGS_QUERY = `
  *[_type == "product" && status == "available"]{ "slug": slug.current }
`;
