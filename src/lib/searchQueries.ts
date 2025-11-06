// lib/sanity/searchQueries.ts

import { client } from "@/sanity/client";
import { Product } from "@/types/product";

// Search products by name or description
export const SEARCH_PRODUCTS_QUERY = `
  *[_type == "product" && (
    name match $searchTerm + "*" ||
    pt::text(description) match $searchTerm + "*"
  )] | order(_createdAt desc) {
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

// Search with filters
export const SEARCH_PRODUCTS_WITH_FILTERS_QUERY = `
  *[_type == "product" && 
    (name match $searchTerm + "*" || pt::text(description) match $searchTerm + "*") &&
    ($category == "" || category == $category) &&
    ($gender == "" || gender == $gender) &&
    ($size == "" || $size in sizes) &&
    ($color == "" || $color in colors)
  ] | order(_createdAt desc) [$start...$end] {
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

// Get total count for pagination
export const SEARCH_COUNT_QUERY = `
  count(*[_type == "product" && 
    (name match $searchTerm + "*" || pt::text(description) match $searchTerm + "*") &&
    ($category == "" || category == $category) &&
    ($gender == "" || gender == $gender) &&
    ($size == "" || $size in sizes) &&
    ($color == "" || $color in colors)
  ])
`;

// Function to search products
export async function searchProducts(
  searchTerm: string,
  filters?: {
    category?: string;
    gender?: string;
    size?: string;
    color?: string;
    page?: number;
    perPage?: number;
  }
): Promise<{ products: Product[]; totalCount: number }> {
  const {
    category = "",
    gender = "",
    size = "",
    color = "",
    page = 1,
    perPage = 9,
  } = filters || {};

  const start = (page - 1) * perPage;
  const end = start + perPage;

  try {
    const [products, totalCount] = await Promise.all([
      client.fetch<Product[]>(SEARCH_PRODUCTS_WITH_FILTERS_QUERY, {
        searchTerm,
        category,
        gender,
        size,
        color,
        start,
        end,
      }),
      client.fetch<number>(SEARCH_COUNT_QUERY, {
        searchTerm,
        category,
        gender,
        size,
        color,
      }),
    ]);

    return { products, totalCount };
  } catch (error) {
    console.error("Error searching products:", error);
    return { products: [], totalCount: 0 };
  }
}
