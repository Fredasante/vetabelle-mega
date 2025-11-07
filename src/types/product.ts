export type Product = {
  _id: string;
  title: string;
  slug: { current: string };
  image: string; // URL from Sanity image
  price: number;
  discountPrice?: number;
  description: any[]; // rich text blocks from Sanity
  status: "in-stock" | "out-of-stock";
  createdAt: string;
};
