// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     filename: { type: String, required: true },
//     url: { type: String, required: true },
//     size: Number,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Video", videoSchema);


const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filename: { type: String, required: true },
    thumbnail: { type: String, required: true },  // <-- FIX
    url: { type: String, required: true },
    size: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
