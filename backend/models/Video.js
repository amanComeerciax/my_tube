


// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     filename: { type: String, required: true },
//     thumbnail: { type: String, required: true },  // <-- FIX
//     url: { type: String, required: true },
//     size: Number,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Video", videoSchema);



// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     filename: { type: String, required: true },
//     thumbnail: { type: String },
//     url: { type: String, required: true },
//     size: Number,
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     // 👍 Likes & 👎 Dislikes arrays storing user IDs
//     likes: [{ type: String }],
//     dislikes: [{ type: String }],
//     views: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Video", videoSchema);


const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filename: { type: String, required: true },
    thumbnail: { type: String, required: true },
    url: { type: String, required: true },
    size: Number,

    // 📌 Uploaded By (User/Channel)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👍 Likes & 👎 Dislikes store user IDs
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 👁 Views
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
