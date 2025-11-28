import { Printer } from "lucide-react";

export function PrintOrderAction(props) {
  const { type, draft, published } = props;

  if (type !== "order") return null;

  const order = draft || published;

  const handlePrint = () => {
    if (!order) return;

    const win = window.open("", "_blank");

    const html = `
    <h1 style="font-size:16px;text-align:center;margin-bottom:12px;">DELIVERY DETAILS</h1>

    <div style="margin-bottom:10px;">
      <strong>Name:</strong><br/>
      ${order.customerInfo?.fullName || ""}
    </div>

    <div style="margin-bottom:10px;">
      <strong>Phone:</strong><br/>
      ${order.customerInfo?.phone || ""}
    </div>

    <div style="margin-bottom:10px;">
      <strong>Location:</strong><br/>
      ${order.deliveryInfo?.region || ""}<br/>
      ${order.deliveryInfo?.city || ""}<br/>
      ${order.deliveryInfo?.address || ""}
    </div>

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
    label: "Print Delivery",
    icon: Printer,
    onHandle: handlePrint,
  };
}
