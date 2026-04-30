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
  *[_type == "product" && status == "in-stock"]
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

// 🎓 Active, upcoming masterclass (for /masterclass page, homepage promo, nav)
export const activeMasterclassQuery = `
  *[_type == "masterclass" && isActive == true && eventDate > now()]
  | order(_updatedAt desc)[0] {
    _id,
    title,
    slug,
    eventDate,
    location,
    "bannerImage": bannerImage.asset->url,
    description,
    learningTopics,
    audienceTypes,
    referralSources,
    regularPrice,
    earlyBirdPrice,
    earlyBirdDeadline,
    registrationOpen,
    registrationDeadline,
    isActive
  }
`;

// 🎓 Single masterclass by id (for the registration API)
export const masterclassByIdQuery = `
  *[_type == "masterclass" && _id == $id][0] {
    _id,
    title,
    slug,
    eventDate,
    location,
    "bannerImage": bannerImage.asset->url,
    description,
    learningTopics,
    audienceTypes,
    referralSources,
    regularPrice,
    earlyBirdPrice,
    earlyBirdDeadline,
    registrationOpen,
    registrationDeadline,
    isActive
  }
`;

// 🎓 Registration by id (for the success page)
export const masterclassRegistrationByIdQuery = `
  *[_type == "masterclassRegistration" && registrationId == $id][0] {
    _id,
    registrationId,
    masterclass->{
      _id,
      title,
      eventDate,
      location
    },
    registrantInfo,
    preferences,
    payment,
    createdAt
  }
`;
