"use server";

import { stripe } from "@/lib/stripe";
import { formatAmountForStripe } from "@/lib/stripe-helpers";
import { getCourseDetails } from "@/queries/courses";

// Currency setting
const CURRENCY = "GBP";

// ✅ Use environment variable for consistent domain
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export default async function CreateCheckoutSession(data) {
  const ui_mode = "hosted";
  const courseId = data.get("courseId");

  const course = await getCourseDetails(courseId);

  if (!course) return new Error(`course not found`);

  const courseName = course?.title;
  const coursePrice = course?.price;
  // Defensive check
  if (!BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL in environment variables.");
  }

  // Create the Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "auto",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: courseName,
          },
          unit_amount: formatAmountForStripe(coursePrice, CURRENCY),
        },
      },
    ],

    // ✅ Use env-based absolute URLs
    success_url: `${BASE_URL}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
    cancel_url: `${BASE_URL}/courses/${courseId}`,

    ui_mode,
  });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

// Optional: Payment intent helper if you need it
export async function createPaymentIntent(data) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(coursePrice, CURRENCY),
    automatic_payment_methods: { enabled: true },
    currency: CURRENCY,
  });

  return { client_secret: paymentIntent.client_secret };
}
