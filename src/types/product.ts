export type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  mainImageUrl?: string;
  gallery?: { imageUrl: string }[];
  category: string;
  gender?: "men" | "women" | "unisex";
  sizes?: string[];
  price: number;
  discountPrice?: number;
  colors?: string[];
  description?: string | any[];
  status?: "available" | "sold";
  isFeatured?: boolean;
  createdAt?: string;
};
