


// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, default: "" },

//     // 📌 Video File
//     filename: { type: String, required: true },
//     thumbnail: { type: String, required: true },
//     url: { type: String, required: true },
//     size: Number,

//     // 👤 Uploaded By (User/Channel)
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // 🏷️ Category (IMPORTANT for filtering)
//     category: {
//       type: String,
//       required: true,
//       enum: [
//         "Gaming",
//         "Music",
//         "Education",
//         "Entertainment",
//         "Sports",
//         "Technology",
//         "Cooking",
//         "Travel",
//         "Vlogs",
//         "News",
//         "Comedy",
//         "Animation",
//         "Science",
//         "Fashion",
//         "Fitness",
//         "Other",
//       ],
//     },

//     // 🏷️ Tags for recommendations (AI-like)
//     tags: {
//       type: [String],
//       default: [],
//     },

//     // 👍 Likes & 👎 Dislikes
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//     // 👁 Views
//     views: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Video", videoSchema);

// models/Video.js  ← TERA PURANA MODEL, AB PERFECT BAN GAYA!

const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      maxlength: 5000,
    },

    // Video File
    filename: {
      type: String,
      required: true,
      unique: true,           // ← Bahut zaroori! /similar/:filename ke liye
    },
    thumbnail: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,           // bytes mein
    },

    // Uploaded By
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,            // ← Channel ke videos fast load
    },

    // Category
    category: {
      type: String,
      required: true,
      enum: [
        "Gaming", "Music", "Education", "Entertainment", "Sports",
        "Technology", "Cooking", "Travel", "Vlogs", "News",
        "Comedy", "Animation", "Science", "Fashion", "Fitness", "Other"
      ],
      default: "Other",
      index: true,            // ← Category page fast
    },

    // Tags – AI Recommendation ke liye
    tags: {
      type: [String],
      default: [],
      lowercase: true,        // ← Similarity matrix ke liye best
      index: true,            // ← Super important for fast search
    },

    // Likes & Dislikes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Views
    views: {
      type: Number,
      default: 0,
      min: 0,
      index: true,            // ← Trending ke liye
    },

    // Future ke liye (optional but recommended)
    watchTime: {
      type: Number,
      default: 0,
    },
    avgWatchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// =======================
// BEST INDEXES FOR SPEED & RECOMMENDATION
// =======================
videoSchema.index({ filename: 1 });                    // for /by-filename & /similar
videoSchema.index({ uploadedBy: 1, createdAt: -1 });   // channel videos
videoSchema.index({ category: 1, views: -1 });         // category pages
videoSchema.index({ tags: 1 });                        // similarity matrix ke liye
videoSchema.index({ views: -1, createdAt: -1 });       // trending
videoSchema.index({ createdAt: -1 });                  // newest first

module.exports = mongoose.model("Video", videoSchema);