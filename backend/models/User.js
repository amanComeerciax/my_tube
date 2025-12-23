


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


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },

//     avatar: { type: String, default: "" },

//     subscribers: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       default: [],
//     },

//     subscribedTo: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       default: [],
//     },

    

//     // 📺 Watch History (FIXED with default = [])
//     watchHistory: {
//       type: [
//         {
//           video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
//           watchedAt: { type: Date, default: Date.now }
//         }
//       ],
//       default: []
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

    subscribers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    subscribedTo: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    aiSummary: { type: String, default: "" },
    sentiment: { type: String, default: "" },

    // 📺 Watch History
    watchHistory: {
      type: [
        {
          video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
          watchedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    banner: {
      type: String,
      default: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
    },

    // ⭐ PREMIUM FIELDS (NEW)
    isPremium: {
      type: Boolean,
      default: false,
    },

    premiumUntil: {
      type: Date,
      default: null,
      },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
