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
      .sort({ createdAt: -1 })
      .limit(50);

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
   ✅ MARK SINGLE AS READ
========================= */
router.put("/read/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true, notification });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

/* =========================
   ✅ MARK ALL AS READ
========================= */
router.put("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark all read error:", err);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
});

/* =========================
   🗑️ DELETE NOTIFICATION
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

/* =========================
   🗑️ DELETE ALL NOTIFICATIONS
========================= */
router.delete("/", auth, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ success: true, message: "All notifications deleted" });
  } catch (err) {
    console.error("Delete all error:", err);
    res.status(500).json({ message: "Failed to delete all notifications" });
  }
});

/* =========================
   📝 CREATE NOTIFICATION (Helper)
========================= */
// async function createNotification({ userId, senderId, type, videoId, message }) {
//   try {
//     // Don't create notification if user is notifying themselves
//     if (userId.toString() === senderId.toString()) {
//       return null;
//     }

//     const notification = new Notification({
//       user: userId,
//       sender: senderId,
//       type,
//       video: videoId,
//       message,
//       isRead: false
//     });

//     await notification.save();
//     return notification;
//   } catch (err) {
//     console.error("Create notification error:", err);
//     return null;
//   }
// }

async function createNotification({ userId, senderId, type, videoId, message }) {
  try {
    if (userId.toString() === senderId.toString()) return null;

    const notification = new Notification({
      user: userId,
      sender: senderId,
      type,
      video: videoId,
      message,
      isRead: false
    });

    await notification.save();

    // 🔥 REAL-TIME SOCKET PUSH
    if (global.io) {
      global.io.to(`user_${userId}`).emit("new-notification", notification);
    }

    return notification;
  } catch (err) {
    console.error("Create notification error:", err);
    return null;
  }
}


module.exports = router;
module.exports.createNotification = createNotification;