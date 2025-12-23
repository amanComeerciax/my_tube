const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Video = require("../models/Video");
const auth = require("../middleware/auth");

// 📌 Multer (simple upload, no chunking for shorts)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/shorts"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* =========================
   📤 UPLOAD SHORT (ONLY)
========================= */
router.post("/upload", auth, upload.single("video"), async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      if (!req.file) return res.status(400).json({ message: "Video required" });
  
      const video = await Video.create({
        title,
        description: description || "",
        filename: req.file.filename,
        // Path ko consistency ke liye shorts prefix ke saath rakhein
        url: `/uploads/shorts/${req.file.filename}`, 
        thumbnail: "", // Shorts ke liye hum video element hi use karenge CSS mein
        uploadedBy: req.user.id,
        tags: tags ? tags.split(",").map(t => t.trim().toLowerCase()) : [],
        isShort: true,
        aspectRatio: "9:16",
        category: "Shorts",
      });
  
      res.json({ message: "✅ Short uploaded successfully", video });
    } catch (err) {
      res.status(500).json({ message: "Short upload failed" });
    }
  });

/* =========================
   🎬 SHORTS FEED
========================= */
router.get("/feed", async (req, res) => {
  try {
    const shorts = await Video.find({ isShort: true })
      .populate("uploadedBy", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(shorts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load shorts" });
  }
});

module.exports = router;
