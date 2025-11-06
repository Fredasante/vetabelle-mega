import { Product } from "@/types/product";

const shopData: Product[] = [
  {
    _id: "12222",
    name: "Havit HV-G69 USB Gamepad",
    slug: { current: "havit-hv-g69-usb-gamepad" },
    price: 59.0,
    discountPrice: 29.0,
    category: "gaming-accessories",
    status: "available",
    mainImageUrl: "/images/products/product-1-sm-1.png",
    isFeatured: true,
    description: "High-quality USB gamepad for PC and console gaming.",
    sizes: ["Standard"],
    colors: ["Black"],
    gallery: [
      { imageUrl: "/images/products/product-1-sm-1.png" },
      { imageUrl: "/images/products/product-1-sm-2.png" },
    ],
    createdAt: "2025-10-14T00:00:00Z",
  },
];

export default shopData;
