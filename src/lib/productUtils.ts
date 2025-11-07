import { client } from "@/sanity/client";

interface FetchProductsParams {
  page: number;
  perPage: number;
}

export const fetchPaginatedProducts = async ({
  page,
  perPage,
}: FetchProductsParams) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;

  // Only fetch in-stock products
  const productsQuery = `
    *[_type == "product" && status == "in-stock"] 
      | order(createdAt desc) 
      [${start}...${end}] {
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

  const countQuery = `
    count(*[_type == "product" && status == "in-stock"])
  `;

  try {
    const [products, totalCount] = await Promise.all([
      client.fetch(productsQuery),
      client.fetch(countQuery),
    ]);

    return { products, totalCount };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
};

// ✅ Fetch all "in-stock" products (without pagination)
export const fetchAllProducts = async () => {
  const query = `
    *[_type == "product" && status == "in-stock"] 
      | order(createdAt desc) {
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

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

// ✅ Fetch single product by slug
export const fetchProductBySlug = async (slug: string) => {
  const query = `
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

  try {
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};
