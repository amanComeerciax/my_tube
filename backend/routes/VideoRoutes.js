// const express = require("express");
// const router = express.Router();   // <- IMPORTANT (ye missing tha)
// const multer = require("multer");
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");

// // Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Upload Route
// router.post("/upload", auth ,upload.single("video"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const file = req.file;

//   const video = await Video.create({
//     title: file.originalname,
//     filename: file.filename,
//     url: `http://localhost:5000/uploads/${file.filename}`,
//     size: file.size,
//   });

//   res.json({
//     message: "Video uploaded successfully",
//     file,
//     video,
//   });
// });

// // Fetch All Videos
// router.get("/all", async (req, res) => {
//   const videos = await Video.find().sort({ createdAt: -1 });
//   res.json(videos);
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");

// // Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // New upload route → video + thumbnail + title
// router.post(
//   "/upload",
//   auth,
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     const { title } = req.body;

//     if (!title) return res.status(400).json({ message: "Title is required" });
//     if (!req.files.video) return res.status(400).json({ message: "Video is required" });
//     if (!req.files.thumbnail) return res.status(400).json({ message: "Thumbnail is required" });

//     const videoFile = req.files.video[0];
//     const thumbnailFile = req.files.thumbnail[0];

//     const video = await Video.create({
//       title,
//       filename: videoFile.filename,
//       thumbnail: thumbnailFile.filename,
//       url: `http://localhost:5000/uploads/${videoFile.filename}`,
//       size: videoFile.size,
//     });

//     res.json({
//       message: "Video uploaded successfully",
//       video,
//     });
//   }
// );

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");

// // Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Upload route → video + thumbnail + title
// router.post(
//   "/upload",
//   auth,
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     const { title } = req.body;

//     if (!title) return res.status(400).json({ message: "Title is required" });
//     if (!req.files.video) return res.status(400).json({ message: "Video is required" });
//     if (!req.files.thumbnail) return res.status(400).json({ message: "Thumbnail is required" });

//     const videoFile = req.files.video[0];
//     const thumbnailFile = req.files.thumbnail[0];

//     const video = await Video.create({
//       title,
//       filename: videoFile.filename,
//       thumbnail: thumbnailFile.filename,
//       url: `http://localhost:5000/uploads/${videoFile.filename}`,
//       size: videoFile.size,
//     });

//     res.json({
//       message: "Video uploaded successfully",
//       video,
//     });
//   }
// );

// // ⭐ NEW — List all videos (required for Home page)
// router.get("/all", async (req, res) => {
//   try {
//     const videos = await Video.find().sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load videos" });
//   }
// });

// // DELETE VIDEO
// router.delete("/delete/:id", async (req, res) => {
//   await Video.findByIdAndDelete(req.params.id);
//   res.json({ message: "Video deleted" });
// });

// // UPDATE VIDEO TITLE
// router.put("/update/:id", async (req, res) => {
//   const { title } = req.body;
//   await Video.findByIdAndUpdate(req.params.id, { title });
//   res.json({ message: "Updated" });
// });


// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const Video = require("../models/Video");
const auth = require("../middleware/auth");
const BloomFilter = require("../utils/bloomFilter");
const bloom = new BloomFilter(5000);  // bigger = less false positive


// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =============================
// 📌 1. UPLOAD (video + thumbnail + title)
// =============================
router.post(
  "/upload",
  auth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!req.files.video) return res.status(400).json({ message: "Video is required" });
    if (!req.files.thumbnail)
      return res.status(400).json({ message: "Thumbnail is required" });

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    const video = await Video.create({
      title,
      filename: videoFile.filename,
      thumbnail: thumbnailFile.filename,
      url: `http://localhost:5000/uploads/${videoFile.filename}`,
      size: videoFile.size,
    });

    res.json({ message: "Video uploaded successfully", video });
  }
);

// =============================
// 📌 2. GET ALL VIDEOS
// =============================
router.get("/all", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to load videos" });
  }
});

// =============================
// 📌 3. DELETE VIDEO
// =============================
router.delete("/delete/:id", auth, async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ message: "Video deleted" });
});

// =============================
// 📌 4. UPDATE TITLE
// =============================
router.put("/update/:id", auth, async (req, res) => {
  const { title } = req.body;
  await Video.findByIdAndUpdate(req.params.id, { title });
  res.json({ message: "Title updated" });
});

// =============================
// 📌 5. UPDATE THUMBNAIL
// =============================
router.put(
  "/update-thumbnail/:id",
  auth,
  upload.single("thumbnail"),
  async (req, res) => {
    await Video.findByIdAndUpdate(req.params.id, {
      thumbnail: req.file.filename,
    });
    res.json({ message: "Thumbnail updated" });
  }
);

// =============================
// 📌 6. UPDATE VIDEO FILE
// =============================
router.put(
  "/update-video/:id",
  auth,
  upload.single("video"),
  async (req, res) => {
    const file = req.file;
    await Video.findByIdAndUpdate(req.params.id, {
      filename: file.filename,
      url: `http://localhost:5000/uploads/${file.filename}`,
      size: file.size,
    });

    res.json({ message: "Video file updated" });
  }
);

module.exports = router;
