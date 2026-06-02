// One-off test for the payment-amount guard.
// Run: node --experimental-strip-types src/lib/pricing.test.ts
// (No test framework is installed; this is a standalone runnable check.)

import assert from "node:assert/strict";
// The .ts extension is required by Node's --experimental-strip-types runner.
// This file is excluded from the app's tsconfig (it is not part of the build).
import {
  isPaidAmountSufficient,
  isOverpaymentWithinFeeBand,
} from "./pricing.ts";

let passed = 0;
function check(name: string, cond: boolean) {
  assert.ok(cond, name);
  passed += 1;
  console.log("ok -", name);
}

// --- isPaidAmountSufficient: the load-bearing fix ---------------------------
// The incident: a GHS 300 ticket was charged GHS 305.97 (base + ~1.99% Paystack
// mobile-money fee passed to the customer). It MUST be accepted as paid in full.
check("accepts price + MoMo fee (305.97 vs 300)", isPaidAmountSufficient(305.97, 300));
check("accepts exact amount (300 vs 300)", isPaidAmountSufficient(300, 300));
check("accepts within epsilon under (299.995 vs 300)", isPaidAmountSufficient(299.995, 300));
check("accepts large overpayment (400 vs 300)", isPaidAmountSufficient(400, 300));
// Genuine underpayment is the only thing that should block recording a payment.
check("rejects underpayment (250 vs 300)", !isPaidAmountSufficient(250, 300));
check("rejects 1 cedi short (299 vs 300)", !isPaidAmountSufficient(299, 300));
// Order subtotal example (arbitrary total + fee).
check("accepts order subtotal + fee (1019.9 vs 1000)", isPaidAmountSufficient(1019.9, 1000));

// --- isOverpaymentWithinFeeBand: observability only (never blocks) ----------
check("MoMo fee is within band (305.97 vs 300)", isOverpaymentWithinFeeBand(305.97, 300));
check("local card fee is within band (311.85 vs 300)", isOverpaymentWithinFeeBand(311.85, 300));
check("flags implausible overcharge (400 vs 300)", !isOverpaymentWithinFeeBand(400, 300));

console.log(`\n${passed} checks passed`);
