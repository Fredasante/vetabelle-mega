import { client } from "@/sanity/client";

export type Product = {
  _id: string;
  title: string;
  slug: { current: string };
  image: string;
  price: number;
  discountPrice?: number;
  description: any[];
  status: "in-stock" | "out-of-stock";
  createdAt: string;
};

interface FetchProductsParams {
  page: number;
  perPage: number;
  sortBy?: string;
}

export const fetchPaginatedProducts = async ({
  page,
  perPage,
  sortBy = "latest",
}: FetchProductsParams) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;

  // Determine the order clause based on sortBy (always push out-of-stock to bottom)
  let orderClause = 'order(select(status == "out-of-stock" => 1, 0) asc, createdAt desc)';

  switch (sortBy) {
    case "price-asc":
      orderClause = 'order(select(status == "out-of-stock" => 1, 0) asc, price asc)';
      break;
    case "price-desc":
      orderClause = 'order(select(status == "out-of-stock" => 1, 0) asc, price desc)';
      break;
    case "latest":
    default:
      orderClause = 'order(select(status == "out-of-stock" => 1, 0) asc, createdAt desc)';
      break;
  }

  const productsQuery = `
    *[_type == "product" && status == "in-stock"]
      | ${orderClause}
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

// ✅ Fetch all products (in-stock first, out-of-stock last)
export const fetchAllProducts = async () => {
  const query = `
    *[_type == "product" && status == "in-stock"]
      | order(select(status == "out-of-stock" => 1, 0) asc, createdAt desc) {
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

  try {
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};
