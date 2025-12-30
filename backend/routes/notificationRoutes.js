const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

/* =========================
   🔔 GET ALL NOTIFICATIONS
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    })
      .populate("sender", "name")
      .populate("video", "title filename")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Notification fetch error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

/* =========================
   🔴 UNREAD COUNT
========================= */
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.json({ count });
  } catch (err) {
    console.error("Unread count error:", err);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

/* =========================
   ✅ MARK AS READ
========================= */
router.put("/read/:id", auth, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

module.exports = router;
