import { client } from "@/sanity/client";

// Get all unique categories from products
export const GET_CATEGORIES_QUERY = `
  *[_type == "product"] | order(category asc) {
    category
  }
`;

// Function to fetch unique categories
export async function getCategories(): Promise<string[]> {
  try {
    const products = await client.fetch<{ category: string }[]>(
      GET_CATEGORIES_QUERY
    );

    // Get unique categories
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    ).filter((c): c is string => !!c); // Remove any null/undefined

    return uniqueCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Get categories with counts
export const GET_CATEGORIES_WITH_COUNT_QUERY = `
  {
    "categories": *[_type == "product"] {
      category
    }
  }
`;

export async function getCategoriesWithCount(): Promise<
  { label: string; value: string; count: number }[]
> {
  try {
    const result = await client.fetch<{ categories: { category: string }[] }>(
      GET_CATEGORIES_WITH_COUNT_QUERY
    );

    // Count occurrences
    const categoryCount: Record<string, number> = {};
    result.categories.forEach((item) => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
    });

    // Convert to array format
    const categoriesArray = Object.entries(categoryCount).map(
      ([category, count]) => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: category,
        count,
      })
    );

    return categoriesArray;
  } catch (error) {
    console.error("Error fetching categories with count:", error);
    return [];
  }
}
