


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

//     aiSummary: { type: String, default: "" },
//     sentiment: { type: String, default: "" },

//     // 📺 Watch History
//     watchHistory: {
//       type: [
//         {
//           video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
//           watchedAt: { type: Date, default: Date.now },
//         },
//       ],
//       default: [],
//     },

//     avatar: {
//       type: String,
//       default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//     },
//     banner: {
//       type: String,
//       default: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
//     },

//     // ⭐ PREMIUM FIELDS (NEW)
//     isPremium: {
//       type: Boolean,
//       default: false,
//     },


//     monetization: {
//       status: {
//         type: String,
//         enum: ["none", "pending", "approved", "rejected"],
//         default: "none",
//       },
//       appliedAt: {
//         type: Date,
//         default: null,
//       },
//       approvedAt: {
//         type: Date,
//         default: null,
//       },
//       rejectedReason: {
//         type: String,
//         default: "",
//       },
//     },

    

//     // 💰 CREATOR EARNINGS (NEW)
// earnings: {
//   total: {
//     type: Number,
//     default: 0, // lifetime earnings
//   },
//   available: {
//     type: Number,
//     default: 0, // withdrawable balance
//   },
//   withdrawn: {
//     type: Number,
//     default: 0, // already paid out
//   },
// },


//     premiumUntil: {
//       type: Date,
//       default: null,
//       },

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

    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    banner: {
      type: String,
      default: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
    },

    // 👥 SUBSCRIBERS & SUBSCRIPTIONS
    subscribers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    subscribedTo: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    // 🤖 AI SUMMARY (for user profiles)
    aiSummary: { type: String, default: "" },
    sentiment: { type: String, default: "" },

    // 📺 WATCH HISTORY
    watchHistory: {
      type: [
        {
          video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
          watchedAt: { type: Date, default: Date.now },
          watchDuration: Number, // in seconds - for calculating watch time
        },
      ],
      default: [],
    },

    // 💾 SAVED VIDEOS
    savedVideos: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
      default: [],
    },

    // ⭐ PREMIUM FIELDS
    isPremium: {
      type: Boolean,
      default: false,
    },

    premiumUntil: {
      type: Date,
      default: null,
    },

    // 🔐 ADMIN
    isAdmin: { 
      type: Boolean, 
      default: false 
    },

    // 💰 MONETIZATION FIELDS (NEW)
    isMonetized: {
      type: Boolean,
      default: false,
    },

    monetizationAppliedAt: {
      type: Date,
      default: null,
    },

    // ⏱️ WATCH TIME TRACKING (for eligibility)
    totalWatchMinutes: {
      type: Number,
      default: 0,
    },

    // 🔗 REFERENCE TO CREATOR EARNINGS
    creatorEarnings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreatorEarnings",
    },

    // 📊 MONETIZATION STATUS (keeping your original structure + new fields)
    monetization: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },
      appliedAt: {
        type: Date,
        default: null,
      },
      approvedAt: {
        type: Date,
        default: null,
      },
      rejectedReason: {
        type: String,
        default: "",
      },
    },

    // 💰 CREATOR EARNINGS (keeping your original structure)
    // NOTE: This is for backward compatibility
    // The main earnings tracking is now in the CreatorEarnings model
    earnings: {
      total: {
        type: Number,
        default: 0, // lifetime earnings
      },
      available: {
        type: Number,
        default: 0, // withdrawable balance
      },
      withdrawn: {
        type: Number,
        default: 0, // already paid out
      },
    },
  },
  { timestamps: true }
);

// 🔥 VIRTUAL: Check if user is eligible for monetization
userSchema.virtual("eligibleForMonetization").get(function () {
  const hasSubscribers = this.subscribers.length >= 1000;
  const hasWatchHours = this.totalWatchMinutes >= 240000; // 4000 hours = 240000 minutes
  const accountAge = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  const hasAccountAge = accountAge >= 90;
  
  return hasSubscribers && hasWatchHours && hasAccountAge;
});

// 🔥 METHOD: Update watch time
userSchema.methods.addWatchTime = async function (minutes) {
  this.totalWatchMinutes += minutes;
  await this.save();
};

// 🔥 METHOD: Sync earnings from CreatorEarnings model to User model
userSchema.methods.syncEarnings = async function () {
  if (!this.creatorEarnings) return;
  
  const CreatorEarnings = mongoose.model("CreatorEarnings");
  const earnings = await CreatorEarnings.findById(this.creatorEarnings);
  
  if (earnings) {
    this.earnings.total = earnings.earnings.totalEarnings;
    this.earnings.available = earnings.earnings.pendingBalance;
    this.earnings.withdrawn = earnings.earnings.totalPaidOut;
    await this.save();
  }
};

module.exports = mongoose.model("User", userSchema);