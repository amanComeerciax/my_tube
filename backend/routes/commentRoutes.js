// const express = require("express");
// const router = express.Router();
// const Comment = require("../models/Comment");
// const auth = require("../middleware/auth");
// const Video = require("../models/Video");
// const User = require("../models/User");
// const Notification = require("../models/Notification");


// // Add Comment
// // router.post("/add", auth, async (req, res) => {
// //   try {
// //     const { videoId, text } = req.body;

// //     if (!text || !text.trim()) {
// //       return res.status(400).json({ message: "Comment text required" });
// //     }

// //     const video = await Video.findById(videoId).populate("uploadedBy", "name _id");
// //     if (!video) {
// //       return res.status(404).json({ message: "Video not found" });
// //     }

// //     const commenter = await User.findById(req.user.id).select("name");

// //     // Add comment to video
// //     const comment = {
// //       user: req.user.id,
// //       text: text.trim(),
// //       createdAt: new Date()
// //     };

// //     if (!video.comments) {
// //       video.comments = [];
// //     }
// //     video.comments.push(comment);
// //     await video.save();

// //     // 🔔 CREATE NOTIFICATION FOR VIDEO OWNER
// //     if (video.uploadedBy._id.toString() !== req.user.id) {
// //       try {
// //         await Notification.create({
// //           user: video.uploadedBy._id,
// //           sender: req.user.id,
// //           type: "comment",
// //           video: video._id,
// //           message: `${commenter.name} commented on your video`,
// //           isRead: false
// //         });
// //         console.log("✅ Comment notification sent");
// //       } catch (notifErr) {
// //         console.error("⚠️ Comment notification failed:", notifErr);
// //       }
// //     }

// //     res.json({ 
// //       message: "Comment added successfully",
// //       comment
// //     });
// //   } catch (err) {
// //     console.error("Comment error:", err);
// //     res.status(500).json({ message: "Failed to add comment" });
// //   }
// // });

// router.post("/add", auth, async (req, res) => {
//   try {
//     const { videoId, text } = req.body;
//     if (!text || !text.trim()) {
//       return res.status(400).json({ message: "Comment text required" });
//     }

//     const video = await Video.findById(videoId).populate("uploadedBy", "name");
//     if (!video) return res.status(404).json({ message: "Video not found" });

//     const commenter = await User.findById(req.user.id).select("name");

//     const comment = await Comment.create({
//       videoId,
//       user: req.user.id,
//       text: text.trim()
//     });

//     // 🔔 Notification
//     if (video.uploadedBy._id.toString() !== req.user.id) {
//       await Notification.create({
//         user: video.uploadedBy._id,
//         sender: req.user.id,
//         type: "comment",
//         video: video._id,
//         message: `${commenter.name} commented on your video`
//       });
//     }

//     res.json(comment);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to add comment" });
//   }
// });

// // 🔔 COMMENT ROUTE WITH NOTIFICATION


// // Get Comments for a video
// // router.get("/video/:id", async (req, res) => {
// //   try {
// //     const comments = await Comment.find({ videoId: req.params.id }).sort({ createdAt: -1 });
// //     res.json(comments);
// //   } catch (err) {
// //     res.status(500).json({ message: "Failed to load comments" });
// //   }
// // });

// router.get("/video/:id", async (req, res) => {
//   const comments = await Comment.find({ videoId: req.params.id })
//     .populate("user", "name avatar")
//     .sort({ createdAt: -1 });

//   res.json(comments);
// });


// // Delete Comment (Admin only)
// router.delete("/delete/:id", auth, async (req, res) => {
//   if (!req.user.isAdmin) return res.status(403).json({ message: "Not allowed" });

//   await Comment.findByIdAndDelete(req.params.id);
//   res.json({ message: "Comment deleted" });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Video = require("../models/Video");
const User = require("../models/User");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

/* ===========================
   ➕ ADD COMMENT (POPULATED)
=========================== */
router.post("/add", auth, async (req, res) => {
  try {
    const { videoId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    // 🔍 Find video & owner
    const video = await Video.findById(videoId).populate("uploadedBy", "name");
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // 🔍 Commenter
    const commenter = await User.findById(req.user.id).select("name");

    // 💬 Create comment
    let comment = await Comment.create({
      videoId,
      user: req.user.id,
      text: text.trim()
    });

    // ✅ POPULATE user before sending response
    comment = await comment.populate("user", "name avatar");

    // 🔔 Create notification for video owner
    if (
      video.uploadedBy &&
      video.uploadedBy._id.toString() !== req.user.id
    ) {
      try {
        await Notification.create({
          user: video.uploadedBy._id,   // receiver
          sender: req.user.id,          // who commented
          type: "comment",
          video: video._id,
          message: `${commenter.name} commented on your video`,
          isRead: false
        });
      } catch (notifErr) {
        console.error("⚠️ Notification error:", notifErr);
      }
    }

    // 🎉 FINAL RESPONSE
    res.json(comment);

  } catch (err) {
    console.error("❌ Add comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

/* ===========================
   📥 GET COMMENTS (POPULATED)
=========================== */
router.get("/video/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("❌ Load comments error:", err);
    res.status(500).json({ message: "Failed to load comments" });
  }
});

/* ===========================
   🗑️ DELETE COMMENT (ADMIN)
=========================== */
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });

  } catch (err) {
    console.error("❌ Delete comment error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

module.exports = router;
