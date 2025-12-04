// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     email: { type: String, required: true, unique: true },
// //     password: { type: String, required: true },
// //     isAdmin: { type: Boolean, default: false },

// //     // ⭐ Channel / Profile Feature
// //     subscribers: { type: Number, default: 0 },
// //     subscribedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("User", userSchema);


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: String,
//     password: String,
//     avatar: { type: String, default: "" },

//     // 🔔 Subscribers will store User IDs
//     subscribers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     // 🫂 Who this user has subscribed to (optional)
//     subscribedTo: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     isAdmin: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },

//     avatar: { type: String, default: "" },

//     // 🔔 All subscribers (must always be an array)
//     subscribers: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       default: []       // IMPORTANT FIX
//     },

//     // 🫂 Who this user subscribed to
//     subscribedTo: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       default: []       // IMPORTANT FIX
//     },

//     isAdmin: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    avatar: { type: String, default: "" },

    // 🔔 All subscribers (User IDs)
    subscribers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    // 🫂 Who this user subscribed to
    subscribedTo: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
