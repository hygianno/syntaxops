import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing x-paystack-signature header." }, { status: 400 });
    }

    // Cryptographic HMAC SHA-512 verification
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid HMAC signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const { reference, customer, amount, currency, metadata } = event.data;
      const userEmail = customer?.email || metadata?.userEmail;
      const courseSlug = metadata?.courseSlug;

      try {
        const db = await connectToDatabase();
        if (db) {
          // Idempotency check: verify if transaction reference already exists
          const existingOrder = await Order.findOne({ reference });
          if (existingOrder) {
            return NextResponse.json({ message: "Transaction already processed." }, { status: 200 });
          }

          // Register new successful order
          await Order.create({
            reference,
            userEmail,
            courseSlug,
            amount: amount / 100,
            currency: currency || "NGN",
            status: "success",
            metadata,
          });

          // Add course to user enrolledCourses
          if (userEmail) {
            await User.findOneAndUpdate(
              { email: userEmail.toLowerCase() },
              { $addToSet: { enrolledCourses: courseSlug } },
              { upsert: true }
            );
          }
        }
      } catch (dbErr) {
        console.warn("Webhook DB update deferred:", dbErr.message);
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Paystack webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
