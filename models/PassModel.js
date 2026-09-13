import mongoose from "mongoose";

const PassSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 0 = Free, 1 = Paid
    plan: {
      type: Number,
      enum: [0, 1],
      default: 0,
      required: true,
    },

    // Usage limits
    blogLimit: {
      type: Number,
      default: 10,
      required: true,
    },

    blogUsed: {
      type: Number,
      default: 0,
    },

    resumeLimit: {
      type: Number,
      default: 10,
      required: true,
    },
    Idempotency_Key:{
      type:String,
      default:null
    },

    resumeUsed: {
      type: Number,
      default: 0,
    },

    // Payment details - only needed for paid plan
    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: Number,
      enum: [0, 1],
      default: 0,
      // 0 = Pending
      // 1 = Paid
    },

    amount: {
      type: Number,
      default: 0,
    },

    // Paid pass expiry
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PassModel =
  mongoose.models.Pass || mongoose.model("Pass", PassSchema);

export default PassModel;