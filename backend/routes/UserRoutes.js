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

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Video = require("../models/Video");
const User = require("../models/User");

// 📌 1) GET LOGGED USER PROFILE (My Channel)
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    subscribers: user.subscribers || [],
    videos,
  });
});

// 📌 2) GET OTHER USER PROFILE (Public Channel)
router.get("/profile/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const videos = await Video.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    subscribers: user.subscribers || [],
    videos,
  });
});

// 📌 3) SUBSCRIBE / UNSUBSCRIBE
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
      } else {
        // 🔔 Subscribe
        target.subscribers.push(currentUser._id);
        currentUser.subscribedTo.push(target._id);
  
        await target.save();
        await currentUser.save();
        return res.json({ subscribed: true, message: "Subscribed" });
      }
    } catch (err) {
      console.error("Subscribe Error:", err);
      res.status(500).json({
        message: "Server error subscribing",
        error: err.message
      });
    }
  });
  

module.exports = router;
