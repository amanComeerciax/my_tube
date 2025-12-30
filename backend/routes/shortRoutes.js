// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs").promises;
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");

// // 📌 Multer (simple upload, no chunking for shorts)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/shorts"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

// /* =========================
//    📤 UPLOAD SHORT (ONLY)
// ========================= */
// router.post("/upload", auth, upload.single("video"), async (req, res) => {
//     try {
//       const { title, description, tags } = req.body;
//       if (!req.file) return res.status(400).json({ message: "Video required" });
  
//       const video = await Video.create({
//         title,
//         description: description || "",
//         filename: req.file.filename,
//         // Path ko consistency ke liye shorts prefix ke saath rakhein
//         url: `/uploads/shorts/${req.file.filename}`, 
//         thumbnail: "", // Shorts ke liye hum video element hi use karenge CSS mein
//         uploadedBy: req.user.id,
//         tags: tags ? tags.split(",").map(t => t.trim().toLowerCase()) : [],
//         isShort: true,
//         aspectRatio: "9:16",
//         category: "Shorts",
//       });
  
//       res.json({ message: "✅ Short uploaded successfully", video });
//     } catch (err) {
//       res.status(500).json({ message: "Short upload failed" });
//     }
//   });

// /* =========================
//    🎬 SHORTS FEED
// ========================= */
// router.get("/feed", async (req, res) => {
//   try {
//     const shorts = await Video.find({ isShort: true })
//       .populate("uploadedBy", "name avatar")
//       .sort({ createdAt: -1 })
//       .limit(50);

//     res.json(shorts);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load shorts" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Video = require("../models/Video");
const auth = require("../middleware/auth");

// 📌 Multer Storage for Shorts (Separate folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Separate folder for shorts
    cb(null, "uploads/shorts");
  },
  filename: (req, file, cb) => {
    const uniqueName = `short-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for shorts
});

/* =========================
   📤 UPLOAD SHORT (ONLY)
========================= */
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    // Validation
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    if (!title || title.trim() === "") {
      // Delete uploaded file if validation fails
      await fs.unlink(path.join("uploads/shorts", req.file.filename));
      return res.status(400).json({ message: "Title is required" });
    }

    // Create video document with isShort flag
    const video = await Video.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      filename: req.file.filename,
      url: `/uploads/shorts/${req.file.filename}`,
      thumbnail: "", // For shorts, we'll use video preview
      uploadedBy: req.user.id,
      tags: tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(t => t) : [],
      isShort: true, // ✅ Important: Mark as short
      aspectRatio: "9:16",
      category: "Shorts",
      duration: 0, // You can add duration detection if needed
      views: 0,
      likes: [],
      dislikes: [],
    });

    // Populate user data before sending response
    await video.populate("uploadedBy", "name avatar");

    res.status(201).json({ 
      message: "✅ Short uploaded successfully", 
      video 
    });

  } catch (err) {
    console.error("Short upload error:", err);
    
    // Clean up file if database save fails
    if (req.file) {
      try {
        await fs.unlink(path.join("uploads/shorts", req.file.filename));
      } catch (unlinkErr) {
        console.error("Error deleting file:", unlinkErr);
      }
    }
    
    res.status(500).json({ 
      message: "Short upload failed", 
      error: err.message 
    });
  }
});

/* =========================
   🎬 GET ALL SHORTS (FEED)
========================= */
router.get("/feed", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // ✅ Only fetch videos where isShort = true
    const shorts = await Video.find({ isShort: true })
      .populate("uploadedBy", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({ isShort: true });

    res.json({
      shorts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + shorts.length < total
      }
    });

  } catch (err) {
    console.error("Shorts feed error:", err);
    res.status(500).json({ message: "Failed to load shorts" });
  }
});

/* =========================
   🎬 GET SINGLE SHORT
========================= */
router.get("/:id", async (req, res) => {
  try {
    const short = await Video.findOne({ 
      _id: req.params.id, 
      isShort: true // ✅ Ensure it's a short
    }).populate("uploadedBy", "name avatar");

    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    res.json(short);

  } catch (err) {
    console.error("Get short error:", err);
    res.status(500).json({ message: "Failed to fetch short" });
  }
});

/* =========================
   📊 INCREMENT VIEWS
========================= */
router.post("/:id/view", async (req, res) => {
  try {
    const short = await Video.findOneAndUpdate(
      { _id: req.params.id, isShort: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    res.json({ views: short.views });

  } catch (err) {
    console.error("View increment error:", err);
    res.status(500).json({ message: "Failed to update views" });
  }
});

/* =========================
   👍 LIKE SHORT
========================= */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const short = await Video.findOne({ _id: req.params.id, isShort: true });

    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    const userId = req.user.id;

    // Remove from dislikes if present
    if (short.dislikes.includes(userId)) {
      short.dislikes = short.dislikes.filter(id => id.toString() !== userId);
    }

    // Toggle like
    if (short.likes.includes(userId)) {
      short.likes = short.likes.filter(id => id.toString() !== userId);
    } else {
      short.likes.push(userId);
    }

    await short.save();
    await short.populate("uploadedBy", "name avatar");

    res.json(short);

  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Failed to like short" });
  }
});

/* =========================
   👎 DISLIKE SHORT
========================= */
router.post("/:id/dislike", auth, async (req, res) => {
  try {
    const short = await Video.findOne({ _id: req.params.id, isShort: true });

    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    const userId = req.user.id;

    // Remove from likes if present
    if (short.likes.includes(userId)) {
      short.likes = short.likes.filter(id => id.toString() !== userId);
    }

    // Toggle dislike
    if (short.dislikes.includes(userId)) {
      short.dislikes = short.dislikes.filter(id => id.toString() !== userId);
    } else {
      short.dislikes.push(userId);
    }

    await short.save();
    await short.populate("uploadedBy", "name avatar");

    res.json(short);

  } catch (err) {
    console.error("Dislike error:", err);
    res.status(500).json({ message: "Failed to dislike short" });
  }
});

/* =========================
   🗑️ DELETE SHORT
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const short = await Video.findOne({ 
      _id: req.params.id, 
      isShort: true 
    });

    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    // Check if user is the owner
    if (short.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this short" });
    }

    // Delete video file
    try {
      await fs.unlink(path.join("uploads/shorts", short.filename));
    } catch (err) {
      console.error("Error deleting file:", err);
    }

    // Delete from database
    await Video.deleteOne({ _id: req.params.id });

    res.json({ message: "✅ Short deleted successfully" });

  } catch (err) {
    console.error("Delete short error:", err);
    res.status(500).json({ message: "Failed to delete short" });
  }
});

/* =========================
   📊 GET USER'S SHORTS
========================= */
router.get("/user/:userId", async (req, res) => {
  try {
    const shorts = await Video.find({ 
      uploadedBy: req.params.userId, 
      isShort: true 
    })
      .populate("uploadedBy", "name avatar")
      .sort({ createdAt: -1 });

    res.json(shorts);

  } catch (err) {
    console.error("User shorts error:", err);
    res.status(500).json({ message: "Failed to fetch user shorts" });
  }
});

module.exports = router;