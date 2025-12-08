


// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     filename: { type: String, required: true },
//     thumbnail: { type: String, required: true },
//     url: { type: String, required: true },
//     size: Number,

//     // 📌 Uploaded By (User/Channel)
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // 👍 Likes & 👎 Dislikes store user IDs
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//     // 👁 Views
//     views: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Video", videoSchema);


// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, default: "" },
//     filename: { type: String, required: true },
//     thumbnail: { type: String, required: true },
//     url: { type: String, required: true },
//     size: Number,

//     // 📌 Uploaded By (User/Channel)
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // 🏷️ Tags for recommendations (AI-like)
//     // Example: ["react", "tutorial", "coding"]
//     tags: {
//       type: [String],
//       default: [],
//     },

//     // 👍 Likes & 👎 Dislikes store user IDs
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//     // 👁 Views
//     views: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Video", videoSchema);


const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    // 📌 Video File
    filename: { type: String, required: true },
    thumbnail: { type: String, required: true },
    url: { type: String, required: true },
    size: Number,

    // 👤 Uploaded By (User/Channel)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🏷️ Category (IMPORTANT for filtering)
    category: {
      type: String,
      required: true,
      enum: [
        "Gaming",
        "Music",
        "Education",
        "Entertainment",
        "Sports",
        "Technology",
        "Cooking",
        "Travel",
        "Vlogs",
        "News",
        "Comedy",
        "Animation",
        "Science",
        "Fashion",
        "Fitness",
        "Other",
      ],
    },

    // 🏷️ Tags for recommendations (AI-like)
    tags: {
      type: [String],
      default: [],
    },

    // 👍 Likes & 👎 Dislikes
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 👁 Views
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
