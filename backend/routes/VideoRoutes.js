


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");

// // 🌸 Bloom filter
// const bloom = global.videoBloom;

// /* ===========================
//  📌 MULTER STORAGE
// =========================== */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// /* ===========================
//  📌 1. UPLOAD + THUMBNAIL + TAGS + DESCRIPTION ✅
// =========================== */
// router.post(
//   "/upload",
//   auth,
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     const { title, description, tags } = req.body; // ✅ ADDED description

//     if (!title) return res.status(400).json({ message: "Title is required" });
//     if (!req.files.video) return res.status(400).json({ message: "Video is required" });
//     if (!req.files.thumbnail)
//       return res.status(400).json({ message: "Thumbnail is required" });

//     // ⚠ Duplicate Title Check
//     if (bloom && bloom.contains(title.toLowerCase())) {
//       return res.status(400).json({ message: "⚠️ Duplicate title detected" });
//     }

//     const videoFile = req.files.video[0];
//     const thumbFile = req.files.thumbnail[0];

//     const tagArray = tags ? tags.split(",").map((t) => t.trim().toLowerCase()) : [];

//     const video = await Video.create({
//       title,
//       description: description || "", // ✅ ADDED description
//       filename: videoFile.filename,
//       thumbnail: thumbFile.filename,
//       url: `http://localhost:5000/uploads/${videoFile.filename}`,
//       size: videoFile.size,
//       uploadedBy: req.user.id,
//       tags: tagArray,
//     });

//     if (bloom) bloom.add(title.toLowerCase());

//     res.json({ message: "Video uploaded successfully ✔", video });
//   }
// );

// /* ===========================
//  📌 2. GET ALL VIDEOS
// =========================== */
// router.get("/all", async (req, res) => {
//   try {
//     const videos = await Video.find().sort({ createdAt: -1 }).populate("uploadedBy", "name");
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load videos" });
//   }
// });

// /* ===========================
//  📌 3. LIKE VIDEO
// =========================== */
// router.post("/like/:id", auth, async (req, res) => {
//   const video = await Video.findById(req.params.id);
//   const userId = req.user.id;

//   video.dislikes = video.dislikes.filter((d) => d.toString() !== userId);

//   if (video.likes.includes(userId)) {
//     video.likes = video.likes.filter((l) => l.toString() !== userId);
//   } else {
//     video.likes.push(userId);
//   }

//   await video.save();
//   res.json(video);
// });

// /* ===========================
//  📌 4. DISLIKE VIDEO
// =========================== */
// router.post("/dislike/:id", auth, async (req, res) => {
//   const video = await Video.findById(req.params.id);
//   const userId = req.user.id;

//   video.likes = video.likes.filter((l) => l.toString() !== userId);

//   if (video.dislikes.includes(userId)) {
//     video.dislikes = video.dislikes.filter((d) => d.toString() !== userId);
//   } else {
//     video.dislikes.push(userId);
//   }

//   await video.save();
//   res.json(video);
// });

// /* ===========================
//  📌 5. INCREMENT VIEW COUNT
// =========================== */
// router.post("/view/:filename", async (req, res) => {
//   const video = await Video.findOne({ filename: req.params.filename });
//   if (!video) return res.status(404).json({ message: "Video not found" });

//   video.views += 1;
//   await video.save();

//   res.json({ message: "View Count Updated", views: video.views });
// });

// /* ===========================
//  📌 6. GET VIDEO BY FILENAME
// =========================== */
// router.get("/by-filename/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOne({ filename: req.params.filename })
//       .populate("uploadedBy", "name");
//     if (!video) return res.status(404).json({ message: "Video not found" });
//     res.json(video);
//   } catch {
//     res.status(500).json({ message: "Error fetching video" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Video = require("../models/Video");
const auth = require("../middleware/auth");

// 🌸 Bloom filter (optional)
const bloom = global.videoBloom || null;

/* ===========================
 📌 MULTER STORAGE
=========================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ===========================
 📌 1. UPLOAD (VIDEO + THUMBNAIL + DESCRIPTION + TAGS + CATEGORY)
=========================== */
router.post(
  "/upload",
  auth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, tags, category } = req.body;

      console.log("📥 Upload request:");
      console.log("Title:", title);
      console.log("Category:", category);
      console.log("Description:", description);
      console.log("Tags:", tags);
      console.log("Files:", req.files);

      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
      if (!req.files || !req.files.video) {
        return res.status(400).json({ message: "Video is required" });
      }
      if (!req.files.thumbnail) {
        return res
          .status(400)
          .json({ message: "Thumbnail is required" });
      }

      // Duplicate title check (if bloom filter enabled)
      if (bloom && bloom.contains(title.toLowerCase())) {
        return res
          .status(400)
          .json({ message: "⚠️ Duplicate title detected" });
      }

      const videoFile = req.files.video[0];
      const thumbFile = req.files.thumbnail[0];

      const tagArray = tags
        ? tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : [];

      const video = await Video.create({
        title,
        description: description || "",
        category: category || "Other",
        filename: videoFile.filename,
        thumbnail: thumbFile.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${videoFile.filename}`,
        size: videoFile.size,
        uploadedBy: req.user.id,
        tags: tagArray,
      });

      if (bloom) bloom.add(title.toLowerCase());

      res.json({ message: "Video uploaded successfully ✔", video });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ message: "Upload failed", error: error.message });
    }
  }
);

/* ===========================
 📌 2. GET ALL VIDEOS
=========================== */
router.get("/all", async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("Get all videos error:", err);
    res.status(500).json({ message: "Failed to load videos" });
  }
});

/* ===========================
 📌 3. GET VIDEOS BY CATEGORY
=========================== */
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const videos = await Video.find({ category })
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(videos);
  } catch (err) {
    console.error("Get by category error:", err);
    res
      .status(500)
      .json({ message: "Failed to load videos by category" });
  }
});

/* ===========================
 📌 4. GET RECOMMENDED (Top views)
=========================== */
router.get("/recommended", async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploadedBy", "name")
      .sort({ views: -1, createdAt: -1 })
      .limit(20);
    res.json(videos);
  } catch (err) {
    console.error("Get recommended error:", err);
    res.status(500).json({ message: "Failed to load recommended videos" });
  }
});

/* ===========================
 📌 5. LIKE VIDEO
=========================== */
router.post("/like/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    video.likes = video.likes || [];
    video.dislikes = video.dislikes || [];

    // remove dislike if present
    video.dislikes = video.dislikes.filter(
      (d) => d.toString() !== userId
    );

    if (video.likes.some((l) => l.toString() === userId)) {
      // already liked -> unlike
      video.likes = video.likes.filter(
        (l) => l.toString() !== userId
      );
    } else {
      video.likes.push(userId);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Error liking video" });
  }
});

/* ===========================
 📌 6. DISLIKE VIDEO
=========================== */
router.post("/dislike/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    video.likes = video.likes || [];
    video.dislikes = video.dislikes || [];

    // remove like if present
    video.likes = video.likes.filter(
      (l) => l.toString() !== userId
    );

    if (video.dislikes.some((d) => d.toString() === userId)) {
      // already disliked -> undo
      video.dislikes = video.dislikes.filter(
        (d) => d.toString() !== userId
      );
    } else {
      video.dislikes.push(userId);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    console.error("Dislike error:", err);
    res.status(500).json({ message: "Error disliking video" });
  }
});

/* ===========================
 📌 7. INCREMENT VIEW COUNT
=========================== */
router.post("/view/:filename", async (req, res) => {
  try {
    const video = await Video.findOne({ filename: req.params.filename });
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    video.views = (video.views || 0) + 1;
    await video.save();

    res.json({ message: "View Count Updated", views: video.views });
  } catch (err) {
    console.error("View increment error:", err);
    res.status(500).json({ message: "Error increasing views" });
  }
});

/* ===========================
 📌 8. GET VIDEO BY FILENAME
=========================== */
router.get("/by-filename/:filename", async (req, res) => {
  try {
    const video = await Video.findOne({
      filename: req.params.filename,
    }).populate("uploadedBy", "name");
    if (!video)
      return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    console.error("Get by filename error:", err);
    res.status(500).json({ message: "Error fetching video" });
  }
});

/* ===========================
 📌 9. DELETE VIDEO (ADMIN / AUTH USER)
=========================== */
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    // optionally: check if req.user.id === video.uploadedBy OR isAdmin
    // (agar strict permission chahiye ho तो yaha check kar sakte ho)

    // delete files from disk (optional but useful)
    try {
      const videoPath = path.join("uploads", video.filename);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

      const thumbPath = path.join("uploads", video.thumbnail);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    } catch (fileErr) {
      console.warn("File delete error:", fileErr.message);
    }

    await video.deleteOne();
    res.json({ message: "Video deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting video" });
  }
});

/* ===========================
 📌 10. UPDATE TITLE
=========================== */
router.put("/update/:id", auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title)
      return res.status(400).json({ message: "Title is required" });

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    res.json({ message: "Title updated", video });
  } catch (err) {
    console.error("Update title error:", err);
    res.status(500).json({ message: "Error updating title" });
  }
});

/* ===========================
 📌 11. UPDATE THUMBNAIL
=========================== */
router.put(
  "/update-thumbnail/:id",
  auth,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video)
        return res
          .status(404)
          .json({ message: "Video not found" });

      if (!req.file)
        return res
          .status(400)
          .json({ message: "Thumbnail file is required" });

      // delete old thumbnail
      try {
        const oldPath = path.join("uploads", video.thumbnail);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (fileErr) {
        console.warn("Old thumb delete error:", fileErr.message);
      }

      video.thumbnail = req.file.filename;
      await video.save();

      res.json({ message: "Thumbnail updated", video });
    } catch (err) {
      console.error("Update thumbnail error:", err);
      res
        .status(500)
        .json({ message: "Error updating thumbnail" });
    }
  }
);

/* ===========================
 📌 12. UPDATE VIDEO FILE
=========================== */
router.put(
  "/update-video/:id",
  auth,
  upload.single("video"),
  async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video)
        return res
          .status(404)
          .json({ message: "Video not found" });

      if (!req.file)
        return res
          .status(400)
          .json({ message: "Video file is required" });

      // delete old video file
      try {
        const oldPath = path.join("uploads", video.filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (fileErr) {
        console.warn("Old video delete error:", fileErr.message);
      }

      video.filename = req.file.filename;
      video.url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      video.size = req.file.size;

      await video.save();

      res.json({ message: "Video file updated", video });
    } catch (err) {
      console.error("Update video file error:", err);
      res.status(500).json({ message: "Error updating video file" });
    }
  }
);

module.exports = router;
