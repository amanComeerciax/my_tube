const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 💰 MONEY FIELDS
    totalEarnings: {
      type: Number,
      default: 0,
    },

    availableBalance: {
      type: Number,
      default: 0,
    },

    pendingBalance: {
      type: Number,
      default: 0,
    },

    withdrawnAmount: {
      type: Number,
      default: 0,
    },

    // 📊 AD STATS
    totalAdViews: {
      type: Number,
      default: 0,
    },

    totalAdClicks: {
      type: Number,
      default: 0,
    },

    // 🧾 TRANSACTIONS HISTORY
    transactions: [
      {
        type: {
          type: String,
          enum: ["credit", "debit"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 💸 WITHDRAW REQUESTS
    withdrawRequests: [
      {
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        method: {
          type: String,
          enum: ["upi", "bank"],
          required: true,
        },
        details: {
          type: Object, // { upiId } or { bankName, accountNo, ifsc }
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
