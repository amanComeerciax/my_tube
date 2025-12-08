


// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     email: { type: String, required: true, unique: true },
// //     password: { type: String, required: true },

// //     avatar: { type: String, default: "" },

// //     // 🔔 All subscribers (User IDs)
// //     subscribers: {
// //       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// //       default: [],
// //     },

// //     // 🫂 Who this user subscribed to
// //     subscribedTo: {
// //       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// //       default: [],
// //     },

// //     isAdmin: { type: Boolean, default: false },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("User", userSchema);


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },

//     avatar: { type: String, default: "" },

//     // 🔔 All subscribers (User IDs)
//     subscribers: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       default: [],
//     },

//     // 🫂 Who this user subscribed to
//     subscribedTo: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       default: [],
//     },

//     // 📺 Watch History ✅ NEW
//     watchHistory: [
//       {
//         video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
//         watchedAt: { type: Date, default: Date.now }
//       }
//     ],

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

    subscribers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    subscribedTo: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    // 📺 Watch History (FIXED with default = [])
    watchHistory: {
      type: [
        {
          video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
          watchedAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
