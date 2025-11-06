import { client } from "@/sanity/client";

interface FetchProductsParams {
  page: number;
  perPage: number;
  category?: string;
  gender?: string;
  size?: string;
  color?: string;
}

export const fetchPaginatedProducts = async ({
  page,
  perPage,
  category,
  gender,
  size,
  color,
}: FetchProductsParams) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;

  // Build filter for available products
  const filters: string[] = ['status == "available"'];

  if (category) filters.push(`category == "${category}"`);
  if (gender) filters.push(`gender == "${gender}"`);
  if (size) filters.push(`"${size}" in sizes`);
  if (color) filters.push(`"${color}" in colors`);

  const filterString = filters.length > 0 ? `&& ${filters.join(" && ")}` : "";

  // products query
  const productsQuery = `
    *[_type == "product" ${filterString}] | order(_createdAt desc) [$start...$end] {
      _id,
      name,
      slug,
      price,
      discountPrice,
      description,
      category,
      gender,
      sizes,
      status,
      isFeatured,
      "mainImageUrl": mainImage.asset->url
    }
  `;

  const countQuery = `count(*[_type == "product" ${filterString}])`;

  try {
    const [products, totalCount] = await Promise.all([
      client.fetch(productsQuery, { start, end }),
      client.fetch(countQuery),
    ]);

    return { products, totalCount };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
};

// categories - only count available products
export const fetchCategories = async () => {
  const query = `
    *[_type == "product" && status == "available"] {
      category
    } | {
      "name": category,
      "products": count(*[_type == "product" && category == ^.category && status == "available"])
    }
  `;

  try {
    const data = await client.fetch(query);
    // Remove duplicates
    const unique = Array.from(
      new Map(data.map((c: any) => [c.name, c])).values()
    );
    return unique;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// genders - only count available products
export const fetchGenders = async () => {
  const query = `
    *[_type == "product" && status == "available"] {
      gender
    } | {
      "name": gender,
      "products": count(*[_type == "product" && gender == ^.gender && status == "available"])
    }
  `;

  try {
    const data = await client.fetch(query);
    // Remove duplicates and capitalize names
    const unique = Array.from(
      new Map(data.map((g: any) => [g.name, g])).values()
    ).map((item: any) => ({
      ...item,
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    }));
    return unique;
  } catch (error) {
    console.error("Error fetching genders:", error);
    return [];
  }
};

// sizes - only count available products
export const fetchSizes = async () => {
  const query = `
    *[_type == "product" && defined(sizes) && status == "available"] {
      sizes
    }
  `;

  try {
    const data = await client.fetch(query);
    // Flatten and get unique sizes
    const allSizes = data.flatMap((item: any) => item.sizes || []);
    const uniqueSizes = Array.from(new Set(allSizes)).sort(
      (a, b) => Number(a) - Number(b)
    );

    // Return with counts
    return uniqueSizes.map((size: string) => ({
      name: size,
      products: data.filter((item: any) => item.sizes?.includes(size)).length,
    }));
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return [];
  }
};

// colors - only count available products
export const fetchColors = async () => {
  const query = `
    *[_type == "product" && defined(colors) && status == "available"] {
      colors
    }
  `;

  try {
    const data = await client.fetch(query);
    // Flatten and get unique colors
    const allColors = data.flatMap((item: any) => item.colors || []);
    const uniqueColors = Array.from(new Set(allColors)).sort();

    // Return with counts
    return uniqueColors.map((color: string) => ({
      name: color,
      products: data.filter((item: any) => item.colors?.includes(color)).length,
    }));
  } catch (error) {
    console.error("Error fetching colors:", error);
    return [];
  }
};
