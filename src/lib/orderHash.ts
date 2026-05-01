type OrderHashItem = {
  _id?: string;
  product?: { _ref?: string };
  quantity: number;
};

type OrderHashInput = {
  items: ReadonlyArray<OrderHashItem>;
  email?: string;
  fulfillmentMethod?: string;
  deliveryInfo?: {
    region?: string;
    city?: string;
    address?: string;
  };
};

function getId(item: OrderHashItem): string {
  return item._id ?? item.product?._ref ?? "";
}

// Stable fingerprint of every client-influenced field that's written into
// an order document. Committed to Paystack metadata at payment-init time so
// the order-create endpoint can reject any drift between the cart, email,
// or delivery target the customer paid for and what the request body claims.
export async function computeOrderHash(
  input: OrderHashInput,
): Promise<string> {
  const itemsLine = [...input.items]
    .map((item) => `${getId(item)}:${item.quantity}`)
    .sort()
    .join(",");
  const delivery = input.deliveryInfo;
  const deliveryLine = delivery
    ? `${delivery.region ?? ""}|${delivery.city ?? ""}|${delivery.address ?? ""}`
    : "";
  const normalized = [
    `items=${itemsLine}`,
    `email=${(input.email ?? "").trim().toLowerCase()}`,
    `fulfillment=${input.fulfillmentMethod ?? ""}`,
    `delivery=${deliveryLine}`,
  ].join("\n");

  const data = new TextEncoder().encode(normalized);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
