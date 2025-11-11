const BULK_PRICING_PRODUCTS = [
  "Rapid Hair Growth Oil",
  "Carrot Oil: Skin Nourishment (Youthful Skin)",
];

export const calculateItemPrice = (item: any, quantity: number) => {
  const basePrice = item.discountPrice || item.price;

  // Special pricing for Eau De Cologne: 2 for ₵500 (single price: ₵300)
  if (item.title === "Eau De Cologne") {
    const pairs = Math.floor(quantity / 2);
    const remainder = quantity % 2;

    return pairs * 500 + remainder * 300;
  }

  // Check if product has bulk pricing (3 for ₵200)
  if (BULK_PRICING_PRODUCTS.includes(item.title) && quantity >= 3) {
    const bulkSets = Math.floor(quantity / 3);
    const remainingItems = quantity % 3;

    return bulkSets * 200 + remainingItems * basePrice;
  }

  return basePrice * quantity;
};

export const hasBulkPricing = (title: string) => {
  return BULK_PRICING_PRODUCTS.includes(title) || title === "Eau De Cologne";
};

export const getBulkPricingSavings = (item: any, quantity: number) => {
  const regularPrice = (item.discountPrice || item.price) * quantity;
  const bulkPrice = calculateItemPrice(item, quantity);
  return regularPrice - bulkPrice;
};
