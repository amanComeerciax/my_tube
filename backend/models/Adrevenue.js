// const mongoose = require("mongoose");

// const AdRevenueSchema = new mongoose.Schema({
//   // Ad reference
//   ad: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Ad",
//     required: true
//   },
  
//   // Video reference
//   video: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Video",
//     required: true
//   },
  
//   // Creator (video owner)
//   creator: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
  
//   // Viewer (optional - for click tracking)
//   viewer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
  
//   // Event type
//   eventType: {
//     type: String,
//     enum: ["view", "click"],
//     required: true
//   },
  
//   // Revenue details
//   revenue: {
//     amount: { type: Number, default: 0 }, // Amount earned from this event
//     type: String, // "CPM" or "CPC"
//     rate: Number // The rate at which it was calculated
//   },
  
//   // Revenue split
//   revenueShare: {
//     creatorShare: { type: Number, default: 0 }, // 55% of revenue
//     platformShare: { type: Number, default: 0 }, // 45% of revenue
//     creatorPercentage: { type: Number, default: 55 },
//     platformPercentage: { type: Number, default: 45 }
//   },
  
//   // Metadata
//   metadata: {
//     adTitle: String,
//     videoTitle: String,
//     category: String,
//     sessionId: String, // Track unique viewing sessions
//     userAgent: String,
//     ipAddress: String
//   },
  
//   // Tracking
//   timestamp: {
//     type: Date,
//     default: Date.now
//   },
  
//   // Payment status
//   paymentStatus: {
//     type: String,
//     enum: ["pending", "processed", "paid"],
//     default: "pending"
//   },
  
//   processedAt: Date,
//   paidAt: Date

// }, {
//   timestamps: true
// });

// // Index for faster queries
// AdRevenueSchema.index({ creator: 1, timestamp: -1 });
// AdRevenueSchema.index({ video: 1, eventType: 1 });
// AdRevenueSchema.index({ ad: 1, timestamp: -1 });
// AdRevenueSchema.index({ paymentStatus: 1 });

// module.exports = mongoose.model("AdRevenue", AdRevenueSchema);



const mongoose = require("mongoose");

const AdRevenueSchema = new mongoose.Schema(
  {
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
      required: true
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    eventType: {
      type: String,
      enum: ["view", "click"],
      required: true
    },

    // ✅ FIXED HERE
    revenue: {
      amount: { type: Number, required: true },
      type: { type: String, enum: ["CPM", "CPC"], required: true },
      rate: { type: Number, required: true }
    },

    revenueShare: {
      creatorShare: { type: Number, required: true },
      platformShare: { type: Number, required: true },
      creatorPercentage: Number,
      platformPercentage: Number
    },

    metadata: {
      adTitle: String,
      videoTitle: String,
      category: String
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdRevenue", AdRevenueSchema);
