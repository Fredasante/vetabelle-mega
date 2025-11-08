import { Product } from "@/types/product";

const shopData: Product[] = [
  {
    _id: "12222",
    title: "Havit HV-G69 USB Gamepad",
    slug: { current: "havit-hv-g69-usb-gamepad" },
    price: 59.0,
    discountPrice: 29.0,
    status: "in-stock",
    image: "/images/products/product-1-sm-1.png",
    description: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "High-quality USB gamepad for PC and console gaming.",
            marks: [],
          },
        ],
      },
    ],
    createdAt: "2025-10-14T00:00:00Z",
  },
];

export default shopData;
