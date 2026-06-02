const BULK_PRICING_PRODUCTS = [
  "Rapid Hair Growth Oil",
  "Carrot Oil: Skin Nourishment (Youthful Skin)",
];

// Tolerance for floating-point comparisons on GHS amounts (1 pesewa).
const PRICE_EPSILON = 0.01;

// Paystack can add its processing fee on top of the amount we request when the
// account is set to "charge customers the transaction fee". Ghana mobile-money
// and local-card fees are ~2-4%, so a verified amount slightly ABOVE our price
// is normal and must still be recorded. This ceiling only flags an implausible
// over-charge (e.g. a pricing/decimal bug) for observability — it never blocks.
const MAX_GATEWAY_FEE_RATE = 0.1; // 10%

/**
 * Whether a Paystack-verified amount covers the expected price. Returns false
 * ONLY for genuine underpayment. A payment equal to the price, or the price
 * plus the gateway fee (the common mobile-money case, e.g. 305.97 for a 300
 * ticket), is sufficient and must be recorded.
 */
export const isPaidAmountSufficient = (
  paidAmountGhs: number,
  expectedAmountGhs: number,
): boolean => paidAmountGhs >= expectedAmountGhs - PRICE_EPSILON;

/**
 * Whether an (already-sufficient) payment is within the expected gateway-fee
 * band. Used for logging/alerting only — an out-of-band overpayment is still
 * recorded, never rejected, so we never lose a paying customer.
 */
export const isOverpaymentWithinFeeBand = (
  paidAmountGhs: number,
  expectedAmountGhs: number,
): boolean =>
  paidAmountGhs <= expectedAmountGhs * (1 + MAX_GATEWAY_FEE_RATE) + PRICE_EPSILON;

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
