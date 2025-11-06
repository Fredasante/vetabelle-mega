// @ts-ignore - Suppress TypeScript errors for this library

import PaystackPop from "@paystack/inline-js";

interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in GHS
  reference: string;
  metadata: {
    orderId: string;
    customerName: string;
    phone: string;
    items: any[];
  };
  onSuccess: (transaction: any) => void;
  onCancel: () => void;
}

export const initializePaystackPayment = ({
  email,
  amount,
  reference,
  metadata,
  onSuccess,
  onCancel,
}: PaystackPaymentData) => {
  // ✅ FIX: Create instance without 'new' keyword
  const paystack = PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    email,
    amount: Math.round(amount * 100), // Convert GHS to pesewas
    ref: reference,
    currency: "GHS",
    channels: ["card", "mobile_money"],
    metadata: {
      custom_fields: [
        {
          display_name: "Order ID",
          variable_name: "order_id",
          value: metadata.orderId,
        },
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: metadata.customerName,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: metadata.phone,
        },
      ],
    },
    onSuccess: (transaction: any) => {
      console.log("Payment successful!", transaction);
      onSuccess(transaction);
    },
    onCancel: () => {
      console.log("Payment cancelled by user");
      onCancel();
    },
  });

  // Open the payment modal
  paystack.openIframe();
};

// Generate unique payment reference
export const generatePaymentReference = (orderId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${orderId}-${timestamp}-${random}`;
};

// Verify payment on backend
export const verifyPaystackPayment = async (reference: string) => {
  try {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reference }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Payment verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};
