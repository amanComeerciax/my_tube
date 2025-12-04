const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// 🔔 Subscribe
router.post("/subscribe/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;       // current user
    const channelId = req.params.id;  // channel user you subscribe to

    if (userId === channelId) return res.status(400).json({ message: "Can't subscribe yourself" });

    const user = await User.findById(userId);
    const channel = await User.findById(channelId);

    // Add subscription
    if (!user.subscriptions.includes(channelId)) {
      user.subscriptions.push(channelId);
      channel.subscribers.push(userId);

      await user.save();
      await channel.save();
      return res.json({ message: "Subscribed" });
    }
    res.json({ message: "Already Subscribed" });

  } catch (err) {
    res.status(500).json({ message: "Error subscribing" });
  }
});

// ❌ Unsubscribe
router.post("/unsubscribe/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    const user = await User.findById(userId);
    const channel = await User.findById(channelId);

    user.subscriptions = user.subscriptions.filter((id) => id != channelId);
    channel.subscribers = channel.subscribers.filter((id) => id != userId);

    await user.save();
    await channel.save();
    res.json({ message: "Unsubscribed" });

  } catch (err) {
    res.status(500).json({ message: "Error unsubscribing" });
  }
});

module.exports = router;
