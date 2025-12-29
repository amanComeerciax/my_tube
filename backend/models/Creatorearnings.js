const mongoose = require("mongoose");

const CreatorEarningsSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Monetization Status
  isMonetized: {
    type: Boolean,
    default: false
  },
  monetizationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "suspended"],
    default: "pending"
  },
  
  // Eligibility Criteria
  eligibilityMet: {
    subscribers: { type: Boolean, default: false },
    watchHours: { type: Boolean, default: false },
    videosPublished: { type: Boolean, default: false },
    accountAge: { type: Boolean, default: false }
  },
  
  // Current Stats
  currentStats: {
    totalSubscribers: { type: Number, default: 0 },
    totalWatchHours: { type: Number, default: 0 },
    totalVideos: { type: Number, default: 0 },
    accountAgeDays: { type: Number, default: 0 }
  },
  
  // Required Thresholds
  requiredThresholds: {
    subscribers: { type: Number, default: 1 },
    watchHours: { type: Number, default: 0 },
    videosPublished: { type: Number, default: 1 },
    accountAgeDays: { type: Number, default: 1 }
  },
  
  // Earnings Breakdown
  earnings: {
    // Total earnings
    totalEarnings: { type: Number, default: 0 },
    
    // By month
    thisMonth: { type: Number, default: 0 },
    lastMonth: { type: Number, default: 0 },
    
    // By type
    fromCPM: { type: Number, default: 0 },
    fromCPC: { type: Number, default: 0 },
    
    // Pending payment
    pendingBalance: { type: Number, default: 0 },
    
    // Paid out
    totalPaidOut: { type: Number, default: 0 }
  },
  
  // Ad Performance
  adPerformance: {
    totalAdViews: { type: Number, default: 0 },
    totalAdClicks: { type: Number, default: 0 },
    averageCTR: { type: Number, default: 0 },
    averageRPM: { type: Number, default: 0 } // Revenue Per Mille (1000 views)
  },
  
  // Payment Info
  paymentInfo: {
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,
    panNumber: String, // Required in India
    verified: { type: Boolean, default: false }
  },
  
  // Payment History
  paymentHistory: [{
    amount: Number,
    month: String, // e.g., "2025-01"
    paidAt: Date,
    transactionId: String,
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    }
  }],
  
  // Minimum payout threshold
  minPayoutThreshold: {
    type: Number,
    default: 2 // ₹1000 minimum
  },
  
  // Applied date
  appliedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  
}, {
  timestamps: true
});

// Virtual for checking if eligible for payout
CreatorEarningsSchema.virtual("eligibleForPayout").get(function() {
  return this.earnings.pendingBalance >= this.minPayoutThreshold;
});

// Method to check if all eligibility criteria are met
CreatorEarningsSchema.methods.checkEligibility = function() {
  const { subscribers, watchHours, videosPublished, accountAge } = this.eligibilityMet;
  return subscribers && watchHours && videosPublished && accountAge;
};

// Method to calculate RPM (Revenue Per Mille)
CreatorEarningsSchema.methods.calculateRPM = function() {
  if (this.adPerformance.totalAdViews === 0) return 0;
  return (this.earnings.totalEarnings / this.adPerformance.totalAdViews) * 1000;
};

CreatorEarningsSchema.set("toJSON", { virtuals: true });
CreatorEarningsSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("CreatorEarnings", CreatorEarningsSchema);