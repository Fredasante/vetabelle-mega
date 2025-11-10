const BULK_PRICING_PRODUCTS = [
  "Rapid Hair Growth Oil",
  "Carrot Oil: Skin Nourishment (Youthful Skin)",
];

export const calculateItemPrice = (item: any, quantity: number) => {
  const basePrice = item.discountPrice || item.price;

  // Check if product has bulk pricing (3 for ₵200)
  if (BULK_PRICING_PRODUCTS.includes(item.title) && quantity >= 3) {
    const bulkSets = Math.floor(quantity / 3);
    const remainingItems = quantity % 3;

    return bulkSets * 200 + remainingItems * basePrice;
  }

  return basePrice * quantity;
};

export const hasBulkPricing = (title: string) => {
  return BULK_PRICING_PRODUCTS.includes(title);
};

export const getBulkPricingSavings = (item: any, quantity: number) => {
  const regularPrice = (item.discountPrice || item.price) * quantity;
  const bulkPrice = calculateItemPrice(item, quantity);
  return regularPrice - bulkPrice;
};
