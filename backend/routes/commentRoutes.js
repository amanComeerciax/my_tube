const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// Add Comment
router.post("/add", auth, async (req, res) => {
  try {
    const { videoId, text } = req.body;
    if (!text.trim()) return res.status(400).json({ message: "Empty comment not allowed" });

    const comment = await Comment.create({
      videoId,
      text,
      user: req.user.name || "Anonymous",
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Failed to post comment" });
  }
});

// Get Comments for a video
router.get("/video/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load comments" });
  }
});

// Delete Comment (Admin only)
router.delete("/delete/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Not allowed" });

  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted" });
});

module.exports = router;
