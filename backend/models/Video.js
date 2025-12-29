


// // const mongoose = require("mongoose");

// // const videoSchema = new mongoose.Schema(
// //   {
// //     title: { type: String, required: true },
// //     description: { type: String, default: "" },

// //     // 📌 Video File
// //     filename: { type: String, required: true },
// //     thumbnail: { type: String, required: true },
// //     url: { type: String, required: true },
// //     size: Number,

// //     // 👤 Uploaded By (User/Channel)
// //     uploadedBy: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },

// //     // 🏷️ Category (IMPORTANT for filtering)
// //     category: {
// //       type: String,
// //       required: true,
// //       enum: [
// //         "Gaming",
// //         "Music",
// //         "Education",
// //         "Entertainment",
// //         "Sports",
// //         "Technology",
// //         "Cooking",
// //         "Travel",
// //         "Vlogs",
// //         "News",
// //         "Comedy",
// //         "Animation",
// //         "Science",
// //         "Fashion",
// //         "Fitness",
// //         "Other",
// //       ],
// //     },

// //     // 🏷️ Tags for recommendations (AI-like)
// //     tags: {
// //       type: [String],
// //       default: [],
// //     },

// //     // 👍 Likes & 👎 Dislikes
// //     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// //     dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

// //     // 👁 Views
// //     views: { type: Number, default: 0 },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Video", videoSchema);

// // models/Video.js  ← TERA PURANA MODEL, AB PERFECT BAN GAYA!

// // const mongoose = require("mongoose");

// // const videoSchema = new mongoose.Schema(
// //   {
// //     title: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //       maxlength: 200,
// //     },
// //     description: {
// //       type: String,
// //       default: "",
// //       maxlength: 5000,
// //     },

// //     // Video File
// //     filename: {
// //       type: String,
// //       required: true,
// //       unique: true,           // ← Bahut zaroori! /similar/:filename ke liye
// //     },
// //     thumbnail: {
// //       type: String,
// //       required: true,
// //     },
// //     url: {
// //       type: String,
// //       required: true,
// //     },
// //     size: {
// //       type: Number,           // bytes mein
// //     },

// //     // Uploaded By
// //     uploadedBy: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //       index: true,            // ← Channel ke videos fast load
// //     },

// //     // Category
// //     category: {
// //       type: String,
// //       required: true,
// //       enum: [
// //         "Gaming", "Music", "Education", "Entertainment", "Sports",
// //         "Technology", "Cooking", "Travel", "Vlogs", "News",
// //         "Comedy", "Animation", "Science", "Fashion", "Fitness", "Other"
// //       ],
// //       default: "Other",
// //       index: true,            // ← Category page fast
// //     },

// //     // Tags – AI Recommendation ke liye
// //     tags: {
// //       type: [String],
// //       default: [],
// //       lowercase: true,        // ← Similarity matrix ke liye best
// //       index: true,            // ← Super important for fast search
// //     },

// //     // Likes & Dislikes
// //     likes: [
// //       {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "User",
// //       },
// //     ],
// //     dislikes: [
// //       {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "User",
// //       },
// //     ],

// //     // Views
// //     views: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //       index: true,            // ← Trending ke liye
// //     },

// //     processing: {
// //       type: Boolean,
// //       default: true
// //     },
// //     processedAt: Date,
// //     captions: {
// //       type: String, // example: 64af...e12.vtt
// //     },
    
// //     captionsStatus: {
// //       type: String,
// //       enum: ["pending", "ready", "no-audio", "error"],
// //       default: "pending"
// //     },

// //     // Future ke liye (optional but recommended)
// //     watchTime: {
// //       type: Number,
// //       default: 0,
// //     },
// //     avgWatchPercentage: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //       max: 100,
// //     },
// //   },
// //   {
// //     timestamps: true, // createdAt, updatedAt
// //   }
// // );

// // // =======================
// // // BEST INDEXES FOR SPEED & RECOMMENDATION
// // // =======================
// // videoSchema.index({ filename: 1 });                    // for /by-filename & /similar
// // videoSchema.index({ uploadedBy: 1, createdAt: -1 });   // channel videos
// // videoSchema.index({ category: 1, views: -1 });         // category pages
// // videoSchema.index({ tags: 1 });                        // similarity matrix ke liye
// // videoSchema.index({ views: -1, createdAt: -1 });       // trending
// // videoSchema.index({ createdAt: -1 });                  // newest first

// // module.exports = mongoose.model("Video", videoSchema);

// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 200,
//     },

//     description: {
//       type: String,
//       default: "",
//       maxlength: 5000,
//     },

//     // Video File
//     filename: {
//       type: String,
//       required: true,
//       unique: true, // ✅ unique index ONLY here
//     },

//     thumbnail: {
//       type: String,
//       required: true,
//     },

//     url: {
//       type: String,
//       required: true,
//     },

//     size: Number,

//     // Uploaded By
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Category
//     category: {
//       type: String,
//       required: true,
//       enum: [
//         "Gaming", "Music", "Education", "Entertainment", "Sports",
//         "Technology", "Cooking", "Travel", "Vlogs", "News",
//         "Comedy", "Animation", "Science", "Fashion", "Fitness", "Other"
//       ],
//       default: "Other",
//     },

//     // Tags (AI / Recommendation)
//     tags: {
//       type: [String],
//       default: [],
//       lowercase: true,
//     },

//     // Likes & Dislikes
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//     // Views
//     views: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // 🔥 SHORTS SUPPORT
// isShort: {
//   type: Boolean,
//   default: false,
// },

// aspectRatio: {
//   type: String,
//   enum: ["16:9", "9:16"],
//   default: "16:9",
// },

// duration: {
//   type: Number, // seconds
//   default: 0,
// },
// summary: { type: String },
// summaryStatus: {
//   type: String,
//   enum: ["pending", "ready", "failed"],
//   default: "pending"
// },
// summaryGeneratedAt: Date,


//     // Processing & Captions
//     processing: {
//       type: Boolean,
//       default: true,
//     },

//     processedAt: Date,

//     // captions: {
//     //   type: String, // example: 66f1c9a9c2.vtt
//     // },
    
//     captions: {
//       base: { type: String },           // 693fd.vtt
//       languages: {
//         hi: { type: String },           // 693fd.hi.vtt
//         gu: { type: String },           // 693fd.gu.vtt
//         mr: { type: String }            // future ready
//       }
//     },
//     captionsStatus: {
//       type: String,
//       enum: ["pending", "ready", "no-audio", "error"],
//       default: "pending",
//     },

//     // Analytics (future)
//     watchTime: {
//       type: Number,
//       default: 0,
//     },

//     avgWatchPercentage: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 100,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // =======================
// // 🔥 INDEXES (ONE PLACE ONLY)
// // =======================
// videoSchema.index({ filename: 1 });                     // by-filename, similar
// videoSchema.index({ uploadedBy: 1, createdAt: -1 });    // channel videos
// videoSchema.index({ category: 1, views: -1 });          // category pages
// videoSchema.index({ tags: 1 });                         // recommendation
// videoSchema.index({ views: -1, createdAt: -1 });        // trending
// videoSchema.index({ createdAt: -1 });                   // latest videos

// module.exports = mongoose.model("Video", videoSchema);



const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Music",
        "Gaming",
        "Education",
        "Entertainment",
        "News",
        "Sports",
        "Technology",
        "Cooking",
        "Travel",
        "Fashion",
        "Comedy",
        "Science",
        "Health",
        "Business",
        "Politics",
        "Art",
        "Documentary",
        "Lifestyle",
        "DIY",
        "Animation",
        "Film",
        "Automotive",
        "Pets",
        "Nature",
        "History",
        "Other",
      ],
      default: "Other",
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
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
    size: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    
    // 🔥 SHORTS FIELDS
    isShort: {
      type: Boolean,
      default: false,
    },
    aspectRatio: {
      type: String,
      enum: ["16:9", "9:16", "4:3", "1:1"],
      default: "16:9",
    },

    // 📝 CAPTIONS FIELDS
    captions: {
      type: String,
      default: null,
    },
    captionsStatus: {
      type: String,
      enum: ["pending", "processing", "ready", "failed", "no-audio"],
      default: "pending",
    },

    // 🤖 AI SUMMARY FIELDS
    aiSummary: {
      type: String,
      default: null,
    },
    sentiment: {
      type: String,
      enum: [
        "Positive",
        "Negative",
        "Neutral",
        "Educational",
        "Entertaining",
        "Informative",
        "Inspirational",
        "Critical",
      ],
      default: "Neutral",
    },
    summaryStatus: {
      type: String,
      enum: ["pending", "processing", "ready", "failed", "not-available"],
      default: "pending",
    },
    summaryGeneratedAt: {
      type: Date,
      default: null,
    },

    earnings: {
      type: Number,
      default: 0,
    },

    // 🎬 PROCESSING FIELDS
    processing: {
      type: Boolean,
      default: false,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
videoSchema.index({ uploadedBy: 1 });
videoSchema.index({ category: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ views: -1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ isShort: 1 });
videoSchema.index({ summaryStatus: 1 });

module.exports = mongoose.model("Video", videoSchema);