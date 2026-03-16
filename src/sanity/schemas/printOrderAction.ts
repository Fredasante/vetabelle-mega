import { Printer } from "lucide-react";

const PICKUP_LOCATIONS: Record<string, { name: string; address: string }> = {
  pickup_office: {
    name: "Vetabelle Office",
    address: "Near Entrance Hospital Kokomelemele",
  },
  pickup_ac_mall: {
    name: "A&C Mall",
    address: "A&C Mall",
  },
};

export function PrintOrderAction(props) {
  const { type, draft, published } = props;

  if (type !== "order") return null;

  const order = draft || published;

  const handlePrint = () => {
    if (!order) return;

    const win = window.open("", "_blank");

    const isPickup =
      order.fulfillmentMethod && order.fulfillmentMethod !== "delivery";
    const pickup = isPickup
      ? PICKUP_LOCATIONS[order.fulfillmentMethod] || null
      : null;

    const locationHtml = isPickup
      ? `
    <div style="margin-bottom:10px;">
      <strong>Pickup Location:</strong><br/>
      ${pickup?.name || ""}<br/>
      ${pickup?.address || ""}
    </div>`
      : `
    <div style="margin-bottom:10px;">
      <strong>Delivery Address:</strong><br/>
      ${order.deliveryInfo?.region || ""}<br/>
      ${order.deliveryInfo?.city || ""}<br/>
      ${order.deliveryInfo?.address || ""}
    </div>`;

    const html = `
    <h1 style="font-size:16px;text-align:center;margin-bottom:12px;">${isPickup ? "PICKUP DETAILS" : "DELIVERY DETAILS"}</h1>

    <div style="margin-bottom:10px;">
      <strong>Name:</strong><br/>
      ${order.customerInfo?.fullName || ""}
    </div>

    <div style="margin-bottom:10px;">
      <strong>Phone:</strong><br/>
      ${order.customerInfo?.phone || ""}
    </div>

    ${locationHtml}

    <script>
      window.onload = () => window.print();
    </script>
  `;

    // Instead of document.write, we use DOM APIs
    const doc = win.document;
    doc.open();

    // Build full minimal HTML without document.write
    const base = doc.createElement("html");
    const head = doc.createElement("head");
    const body = doc.createElement("body");

    body.style.fontFamily = "monospace";
    body.style.width = "80mm";
    body.style.padding = "10px";
    body.style.fontSize = "14px";
    body.style.lineHeight = "1.5";

    body.innerHTML = html;

    base.appendChild(head);
    base.appendChild(body);

    doc.appendChild(base);
    doc.close();
  };

  return {
    label: "Print Order",
    icon: Printer,
    onHandle: handlePrint,
  };
}
