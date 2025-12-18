


// const mongoose = require("mongoose");

// const adSchema = new mongoose.Schema({
//   // Ad title for identification
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   // Video file name stored in uploads/ads/
//   videoFile: {
//     type: String,
//     required: true
//   },

//   // Targeting options
//   target: {
//     type: String,
//     enum: ["all", "category", "video"],
//     default: "all"
//   },

//   // Target value (category name OR specific videoId)
//   targetValue: {
//     type: String,
//     default: null
//   },

//   // Skip after X seconds
//   skipAfter: {
//     type: Number,
//     default: 5,
//     min: 0
//   },

//   // Active status
//   active: {
//     type: Boolean,
//     default: true
//   },

//   // Analytics
//   views: {
//     type: Number,
//     default: 0
//   },

//   clicks: {
//     type: Number,
//     default: 0
//   },

//   // Who created this ad
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   }
// }, { 
//   timestamps: true 
// });

// // Index for faster queries
// adSchema.index({ active: 1, target: 1, targetValue: 1 });

// module.exports = mongoose.model("Ad", adSchema);

const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  // Ad title for identification
  title: {
    type: String,
    required: true,
    trim: true
  },

  // Video file name stored in uploads/ads/
  videoFile: {
    type: String,
    required: true
  },

  // Targeting options
  target: {
    type: String,
    enum: ["all", "category", "video"],
    default: "all"
  },

  // Target value (category name OR specific videoId)
  targetValue: {
    type: String,
    default: null
  },

  // Skip after X seconds
  skipAfter: {
    type: Number,
    default: 5,
    min: 0
  },

  // Active status
  active: {
    type: Boolean,
    default: true
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },

  clicks: {
    type: Number,
    default: 0
  },

  // 🔥 REVENUE FIELDS
  cpm: {
    type: Number,
    default: 50, // ₹50 per 1000 views (default)
    min: 0
  },

  cpc: {
    type: Number,
    default: 2, // ₹2 per click (default)
    min: 0
  },

  // Who created this ad
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { 
  timestamps: true 
});

// 🔥 VIRTUAL FIELD: Calculate revenue on the fly
adSchema.virtual('revenue').get(function() {
  const cpmRevenue = (this.views / 1000) * this.cpm;
  const cpcRevenue = this.clicks * this.cpc;
  return parseFloat((cpmRevenue + cpcRevenue).toFixed(2));
});

// 🔥 VIRTUAL FIELD: Calculate CTR
adSchema.virtual('ctr').get(function() {
  if (this.views === 0) return 0;
  return parseFloat(((this.clicks / this.views) * 100).toFixed(2));
});

// Ensure virtual fields are serialized
adSchema.set('toJSON', { virtuals: true });
adSchema.set('toObject', { virtuals: true });

// Index for faster queries
adSchema.index({ active: 1, target: 1, targetValue: 1 });
adSchema.index({ createdBy: 1 });
adSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Ad", adSchema);