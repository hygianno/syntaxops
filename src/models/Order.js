import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    userEmail: { type: String, required: true },
    courseSlug: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    status: { type: String, enum: ["success", "pending", "failed"], default: "success" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
