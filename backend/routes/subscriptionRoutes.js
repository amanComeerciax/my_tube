// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const auth = require("../middleware/auth");

// // 🔔 Subscribe
// router.post("/subscribe/:id", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;       // current user
//     const channelId = req.params.id;  // channel user you subscribe to

//     if (userId === channelId) return res.status(400).json({ message: "Can't subscribe yourself" });

//     const user = await User.findById(userId);
//     const channel = await User.findById(channelId);

//     // Add subscription
//     if (!user.subscriptions.includes(channelId)) {
//       user.subscriptions.push(channelId);
//       channel.subscribers.push(userId);

//       await user.save();
//       await channel.save();
//       return res.json({ message: "Subscribed" });
//     }
//     res.json({ message: "Already Subscribed" });

//   } catch (err) {
//     res.status(500).json({ message: "Error subscribing" });
//   }
// });

// // ❌ Unsubscribe
// router.post("/unsubscribe/:id", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const channelId = req.params.id;

//     const user = await User.findById(userId);
//     const channel = await User.findById(channelId);

//     user.subscriptions = user.subscriptions.filter((id) => id != channelId);
//     channel.subscribers = channel.subscribers.filter((id) => id != userId);

//     await user.save();
//     await channel.save();
//     res.json({ message: "Unsubscribed" });

//   } catch (err) {
//     res.status(500).json({ message: "Error unsubscribing" });
//   }
// });



// // 📑 Get list of channels I subscribed to
// router.get("/my-subscriptions", auth, async (req, res) => {
//   try {
//     // User ko dhoondo aur uski subscriptions array ko "populate" karo
//     const user = await User.findById(req.user.id).populate(
//       "subscriptions", 
//       "name avatar subscribers" // Sirf zaroori fields laao
//     );

//     res.json(user.subscriptions);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching subscriptions" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// 🔔 Subscribe logic
router.post("/subscribe/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    if (userId === channelId) return res.status(400).json({ message: "Can't subscribe yourself" });

    const user = await User.findById(userId);
    const channel = await User.findById(channelId);

    // Sync with your model field: 'subscribedTo'
    if (!user.subscribedTo.includes(channelId)) {
      user.subscribedTo.push(channelId);
      channel.subscribers.push(userId);

      await user.save();
      await channel.save();
      return res.json({ message: "Subscribed", subscribed: true });
    }
    res.json({ message: "Already Subscribed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error subscribing" });
  }
});

// ❌ Unsubscribe logic
router.post("/unsubscribe/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    const user = await User.findById(userId);
    const channel = await User.findById(channelId);

    // Filter using 'subscribedTo'
    user.subscribedTo = user.subscribedTo.filter((id) => id.toString() !== channelId);
    channel.subscribers = channel.subscribers.filter((id) => id.toString() !== userId);

    await user.save();
    await channel.save();
    res.json({ message: "Unsubscribed", subscribed: false });

  } catch (err) {
    res.status(500).json({ message: "Error unsubscribing" });
  }
});

// 📑 Get list of channels I subscribed to (YouTube Style)
router.get("/my-subscriptions", auth, async (req, res) => {
  try {
    // Path must match model field name: 'subscribedTo'
    const user = await User.findById(req.user.id).populate({
      path: "subscribedTo",
      select: "name avatar subscribers" // Fetching specific fields for UI
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.subscribedTo || []);
  } catch (err) {
    console.error("❌ Populate Error:", err);
    res.status(500).json({ message: "Error fetching subscriptions", error: err.message });
  }
});

module.exports = router;