import { client } from "@/sanity/client";

// Function to search products
export const searchProducts = async (
  query: string,
  options: {
    page: number;
    perPage: number;
  }
) => {
  const { page, perPage } = options;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const searchQuery = `
    *[_type == "product" && status == "in-stock" && title match "${query}*"]
      | order(select(status == "out-of-stock" => 1, 0) asc, createdAt desc)
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
    count(*[_type == "product" && status == "in-stock" && title match "${query}*"])
  `;

  try {
    const [products, totalCount] = await Promise.all([
      client.fetch(searchQuery),
      client.fetch(countQuery),
    ]);

    return { products, totalCount };
  } catch (error) {
    console.error("Error searching products:", error);
    return { products: [], totalCount: 0 };
  }
};
