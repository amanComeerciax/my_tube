// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Video = require("../models/Video");

// // Get user profile + uploaded videos
// router.get("/profile", auth, async (req, res) => {
//   try {
//     const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
//     res.json({ user: req.user, videos });
//   } catch {
//     res.status(500).json({ message: "Failed to load profile" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Video = require("../models/Video");
// const User = require("../models/User");

// // 📌 1) GET LOGGED USER PROFILE
// router.get("/profile", auth, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 2) GET OTHER USER PROFILE
// router.get("/profile/:id", async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const videos = await Video.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 3) SUBSCRIBE / UNSUBSCRIBE
// router.post("/subscribe/:id", auth, async (req, res) => {
//   const targetId = req.params.id;
//   if (targetId === req.user.id) return res.status(400).json({ message: "Can't subscribe to yourself" });

//   const user = await User.findById(req.user.id);
//   const target = await User.findById(targetId);

//   if (!target) return res.status(404).json({ message: "User not found" });

//   // toggle subscribe
//   if (target.subscribers.includes(req.user.id)) {
//     target.subscribers = target.subscribers.filter((s) => s !== req.user.id);
//   } else {
//     target.subscribers.push(req.user.id);
//   }

//   await target.save();
//   res.json({ message: "Subscription updated", subscribers: target.subscribers.length });
// });



// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Video = require("../models/Video");
// const User = require("../models/User");

// // 📌 1) GET LOGGED USER PROFILE (My Channel Page)
// router.get("/profile", auth, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 2) GET OTHER USER PROFILE (Public channel)
// router.get("/profile/:id", async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const videos = await Video.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 3) SUBSCRIBE / UNSUBSCRIBE
// router.post("/subscribe/:id", auth, async (req, res) => {
//     try {
//       const target = await User.findById(req.params.id); 
//       const currentUser = await User.findById(req.user.id);

//       if (!target) return res.status(404).json({ message: "User not found" });

//       // ❌ Can't subscribe to yourself
//       if (target._id.toString() === currentUser._id.toString()) {
//         return res.status(400).json({ message: "Can't subscribe to yourself" });
//       }

//       const isAlreadySubscribed = target.subscribers.map(String).includes(currentUser._id.toString());

//       if (isAlreadySubscribed) {
//         // 🔄 Unsubscribe
//         target.subscribers.pull(currentUser._id);
//         currentUser.subscribedTo.pull(target._id);
//         await target.save();
//         await currentUser.save();
//         return res.json({ subscribed: false, message: "Unsubscribed" });
//       } else {
//         // 🔔 Subscribe
//         target.subscribers.push(currentUser._id);
//         currentUser.subscribedTo.push(target._id);
//         await target.save();
//         await currentUser.save();
//         return res.json({ subscribed: true, message: "Subscribed" });
//       }
//     } catch (err) {
//       console.error("Subscribe Error:", err);
//       res.status(500).json({ message: "Server error subscribing", error: err.message });
//     }
//   });


// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Video = require("../models/Video");
// const User = require("../models/User");

// // 📌 1) GET LOGGED USER PROFILE (My Channel)
// router.get("/profile", auth, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 2) GET OTHER USER PROFILE (Public Channel)
// router.get("/profile/:id", async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const videos = await Video.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 3) SUBSCRIBE / UNSUBSCRIBE
// router.post("/subscribe/:id", auth, async (req, res) => {
//     try {
//       const target = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.user.id);

//       if (!target) return res.status(404).json({ message: "User not found" });

//       // ❌ Can't subscribe to yourself
//       if (target._id.toString() === currentUser._id.toString()) {
//         return res.status(400).json({ message: "Can't subscribe to yourself" });
//       }

//       // 💡 Ensure arrays exist (fix for old data)
//       target.subscribers = Array.isArray(target.subscribers) ? target.subscribers : [];
//       currentUser.subscribedTo = Array.isArray(currentUser.subscribedTo) ? currentUser.subscribedTo : [];

//       const isAlreadySubscribed = target.subscribers
//         .map(id => id.toString())
//         .includes(currentUser._id.toString());

//       if (isAlreadySubscribed) {
//         // 🔄 Unsubscribe
//         target.subscribers = target.subscribers.filter(
//           sid => sid.toString() !== currentUser._id.toString()
//         );
//         currentUser.subscribedTo = currentUser.subscribedTo.filter(
//           tid => tid.toString() !== target._id.toString()
//         );

//         await target.save();
//         await currentUser.save();
//         return res.json({ subscribed: false, message: "Unsubscribed" });
//       } else {
//         // 🔔 Subscribe
//         target.subscribers.push(currentUser._id);
//         currentUser.subscribedTo.push(target._id);

//         await target.save();
//         await currentUser.save();
//         return res.json({ subscribed: true, message: "Subscribed" });
//       }
//     } catch (err) {
//       console.error("Subscribe Error:", err);
//       res.status(500).json({
//         message: "Server error subscribing",
//         error: err.message
//       });
//     }
//   });


// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Video = require("../models/Video");
// const User = require("../models/User");

// // 📌 1) GET LOGGED USER PROFILE (My Channel)
// router.get("/profile", auth, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 2) GET OTHER USER PROFILE (Public Channel)
// router.get("/profile/:id", async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const videos = await Video.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     avatar: user.avatar || "",
//     subscribers: user.subscribers || [],
//     videos,
//   });
// });

// // 📌 3) SUBSCRIBE / UNSUBSCRIBE
// router.post("/subscribe/:id", auth, async (req, res) => {
//     try {
//       const target = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.user.id);

//       if (!target) return res.status(404).json({ message: "User not found" });

//       // ❌ Can't subscribe to yourself
//       if (target._id.toString() === currentUser._id.toString()) {
//         return res.status(400).json({ message: "Can't subscribe to yourself" });
//       }

//       // 💡 Ensure arrays exist (fix for old data)
//       target.subscribers = Array.isArray(target.subscribers) ? target.subscribers : [];
//       currentUser.subscribedTo = Array.isArray(currentUser.subscribedTo) ? currentUser.subscribedTo : [];

//       const isAlreadySubscribed = target.subscribers
//         .map(id => id.toString())
//         .includes(currentUser._id.toString());

//       if (isAlreadySubscribed) {
//         // 🔄 Unsubscribe
//         target.subscribers = target.subscribers.filter(
//           sid => sid.toString() !== currentUser._id.toString()
//         );
//         currentUser.subscribedTo = currentUser.subscribedTo.filter(
//           tid => tid.toString() !== target._id.toString()
//         );

//         await target.save();
//         await currentUser.save();
//         return res.json({ subscribed: false, message: "Unsubscribed" });
//       } else {
//         // 🔔 Subscribe
//         target.subscribers.push(currentUser._id);
//         currentUser.subscribedTo.push(target._id);

//         await target.save();
//         await currentUser.save();
//         return res.json({ subscribed: true, message: "Subscribed" });
//       }
//     } catch (err) {
//       console.error("Subscribe Error:", err);
//       res.status(500).json({
//         message: "Server error subscribing",
//         error: err.message
//       });
//     }
// });

// // ===========================
// // 📺 WATCH HISTORY ROUTES ✅
// // ===========================

// // 📌 4) ADD TO WATCH HISTORY
// router.post("/watch-history/add/:videoId", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     const video = await Video.findById(req.params.videoId);

//     if (!video) return res.status(404).json({ message: "Video not found" });

//     // Remove if already exists (to update timestamp)
//     user.watchHistory = user.watchHistory.filter(
//       item => item.video.toString() !== video._id.toString()
//     );

//     // Add to beginning (most recent first)
//     user.watchHistory.unshift({
//       video: video._id,
//       watchedAt: new Date()
//     });

//     // Keep only last 100 videos
//     if (user.watchHistory.length > 100) {
//       user.watchHistory = user.watchHistory.slice(0, 100);
//     }

//     await user.save();
//     res.json({ message: "Added to watch history" });
//   } catch (err) {
//     console.error("Watch history error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 📌 5) GET WATCH HISTORY
// router.get("/watch-history", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .populate({
//         path: "watchHistory.video",
//         populate: { path: "uploadedBy", select: "name" }
//       });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Filter out any null videos (deleted videos)
//     const validHistory = user.watchHistory.filter(item => item.video !== null);

//     res.json(validHistory);
//   } catch (err) {
//     console.error("Get history error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 📌 6) REMOVE SINGLE VIDEO FROM HISTORY
// router.delete("/watch-history/:videoId", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     user.watchHistory = user.watchHistory.filter(
//       item => item.video.toString() !== req.params.videoId
//     );

//     await user.save();
//     res.json({ message: "Removed from watch history" });
//   } catch (err) {
//     console.error("Remove history error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 📌 7) CLEAR ALL WATCH HISTORY
// router.delete("/watch-history", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     user.watchHistory = [];
//     await user.save();
//     res.json({ message: "Watch history cleared" });
//   } catch (err) {
//     console.error("Clear history error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Video = require("../models/Video");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Notification = require("../models/Notification"); // ADD THIS LINE
// ===========================
// 📁 MULTER CONFIG FOR PROFILE IMAGES
// ===========================

// Create uploads directory if it doesn't exist
const profileUploadsDir = "./uploads/profiles";
if (!fs.existsSync(profileUploadsDir)) {
  fs.mkdirSync(profileUploadsDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// ===========================
// 📌 PROFILE ROUTES
// ===========================

// 📌 1) GET LOGGED USER PROFILE (My Channel)
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      banner: user.banner || "",
      bio: user.bio || "",
      subscribers: user.subscribers || [],
      createdAt: user.createdAt,
      videos,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 2) GET OTHER USER PROFILE (Public Channel)
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const videos = await Video.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      banner: user.banner || "",
      bio: user.bio || "",
      subscribers: user.subscribers || [],
      createdAt: user.createdAt,
      videos,
    });
  } catch (err) {
    console.error("Get user profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 3) UPDATE USER PROFILE (Avatar, Banner, Name, Bio) ✨ NEW
router.put(
  "/profile",
  auth,
  profileUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Update text fields
      if (req.body.name) user.name = req.body.name;
      if (req.body.bio !== undefined) user.bio = req.body.bio;

      // Update avatar if uploaded
      if (req.files && req.files.avatar) {
        // Delete old avatar if exists and is not default
        if (user.avatar && !user.avatar.includes("flaticon") && !user.avatar.includes("dicebear")) {
          const oldAvatarPath = path.join(__dirname, "..", user.avatar.replace("http://localhost:5000/", ""));
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }
        user.avatar = `http://localhost:5000/uploads/profiles/${req.files.avatar[0].filename}`;
      }

      // Update banner if uploaded
      if (req.files && req.files.banner) {
        // Delete old banner if exists
        if (user.banner && !user.banner.includes("unsplash")) {
          const oldBannerPath = path.join(__dirname, "..", user.banner.replace("http://localhost:5000/", ""));
          if (fs.existsSync(oldBannerPath)) {
            fs.unlinkSync(oldBannerPath);
          }
        }
        user.banner = `http://localhost:5000/uploads/profiles/${req.files.banner[0].filename}`;
      }

      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          banner: user.banner,
          bio: user.bio,
          isPremium: user.isPremium,
          premiumUntil: user.premiumUntil
        }
      });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "Server error updating profile" });
    }
  }
);

// 📌 4) SUBSCRIBE / UNSUBSCRIBE
router.post("/subscribe/:id", auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!target) return res.status(404).json({ message: "User not found" });

    // ❌ Can't subscribe to yourself
    if (target._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "Can't subscribe to yourself" });
    }

    // 💡 Ensure arrays exist (fix for old data)
    target.subscribers = Array.isArray(target.subscribers) ? target.subscribers : [];
    currentUser.subscribedTo = Array.isArray(currentUser.subscribedTo) ? currentUser.subscribedTo : [];

    const isAlreadySubscribed = target.subscribers
      .map(id => id.toString())
      .includes(currentUser._id.toString());

    if (isAlreadySubscribed) {
      // 🔄 Unsubscribe
      target.subscribers = target.subscribers.filter(
        sid => sid.toString() !== currentUser._id.toString()
      );
      currentUser.subscribedTo = currentUser.subscribedTo.filter(
        tid => tid.toString() !== target._id.toString()
      );

      await target.save();
      await currentUser.save();
      return res.json({ subscribed: false, message: "Unsubscribed" });
      // } else {
      //   // 🔔 Subscribe
      //   target.subscribers.push(currentUser._id);
      //   currentUser.subscribedTo.push(target._id);

      //   await target.save();
      //   await currentUser.save();
      //   return res.json({ subscribed: true, message: "Subscribed" });
      // }
    } else {
      // 🔔 Subscribe
      target.subscribers.push(currentUser._id);
      currentUser.subscribedTo.push(target._id);

      await target.save();
      await currentUser.save();

      // 🔔 CREATE NOTIFICATION FOR CHANNEL OWNER
      try {
        await Notification.create({
          user: target._id,
          sender: currentUser._id,
          type: "subscribe",
          video: null,
          message: `${currentUser.name} subscribed to your channel`,
          isRead: false
        });
        console.log("✅ Subscribe notification sent");
      } catch (notifErr) {
        console.error("⚠️ Subscribe notification failed:", notifErr);
      }

      return res.json({
        subscribed: true,
        message: "Subscribed",
        subscribers: target.subscribers
      });
    }
  } catch (err) {
    console.error("Subscribe Error:", err);
    res.status(500).json({
      message: "Server error subscribing",
      error: err.message
    });
  }
});

// ===========================
// 📺 WATCH HISTORY ROUTES
// ===========================

// 📌 5) ADD TO WATCH HISTORY
router.post("/watch-history/add/:videoId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const video = await Video.findById(req.params.videoId);

    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove if already exists (to update timestamp)
    user.watchHistory = user.watchHistory.filter(
      item => item.video.toString() !== video._id.toString()
    );

    // Add to beginning (most recent first)
    user.watchHistory.unshift({
      video: video._id,
      watchedAt: new Date()
    });

    // Keep only last 100 videos
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(0, 100);
    }

    await user.save();
    res.json({ message: "Added to watch history" });
  } catch (err) {
    console.error("Watch history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 6) GET WATCH HISTORY
router.get("/watch-history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "watchHistory.video",
        populate: { path: "uploadedBy", select: "name" }
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out any null videos (deleted videos)
    const validHistory = user.watchHistory.filter(item => item.video !== null);

    res.json(validHistory);
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 7) REMOVE SINGLE VIDEO FROM HISTORY
router.delete("/watch-history/:videoId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.watchHistory = user.watchHistory.filter(
      item => item.video.toString() !== req.params.videoId
    );

    await user.save();
    res.json({ message: "Removed from watch history" });
  } catch (err) {
    console.error("Remove history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 8) CLEAR ALL WATCH HISTORY
router.delete("/watch-history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.watchHistory = [];
    await user.save();
    res.json({ message: "Watch history cleared" });
  } catch (err) {
    console.error("Clear history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// 💾 SAVED VIDEOS ROUTES
// ===========================

// 📌 9) CHECK IF VIDEO IS SAVED
router.get("/saved/:videoId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSaved = user.savedVideos && user.savedVideos.includes(req.params.videoId);
    res.json({ isSaved });
  } catch (err) {
    console.error("Check saved error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 10) SAVE/UNSAVE VIDEO
router.post("/save/:videoId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const video = await Video.findById(req.params.videoId);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (!user.savedVideos) user.savedVideos = [];

    const isSaved = user.savedVideos.includes(video._id.toString());

    if (isSaved) {
      // Remove from saved
      user.savedVideos = user.savedVideos.filter(id => id.toString() !== video._id.toString());
      await user.save();
      res.json({ saved: false, message: "Removed from saved videos" });
    } else {
      // Add to saved
      user.savedVideos.push(video._id);
      await user.save();
      res.json({ saved: true, message: "Added to saved videos" });
    }
  } catch (err) {
    console.error("Save video error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 11) GET ALL SAVED VIDEOS
router.get("/saved-videos", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "savedVideos",
        populate: { path: "uploadedBy", select: "name avatar" }
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedVideos || []);
  } catch (err) {
    console.error("Get saved videos error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// 👤 AVATAR/PROFILE UPLOAD
// ===========================

const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (req, file, cb) => {
    cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Update Avatar Route
router.put("/update-avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    const avatarUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );
    res.json({ message: "Profile photo updated", avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;