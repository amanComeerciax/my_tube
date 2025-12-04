

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");
// const BloomFilter = require("../utils/bloomFilter");
//   // bigger = less false positive
// const bloom = global.videoBloom;

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

// // =============================
// // 📌 1. UPLOAD (video + thumbnail + title)
// // =============================
// // router.post(
// //   "/upload",
// //   auth,
// //   upload.fields([
// //     { name: "video", maxCount: 1 },
// //     { name: "thumbnail", maxCount: 1 },
// //   ]),
// //   async (req, res) => {
// //     const { title } = req.body;

// //     if (!title) return res.status(400).json({ message: "Title is required" });
// //     if (!req.files.video) return res.status(400).json({ message: "Video is required" });
// //     if (!req.files.thumbnail)
// //       return res.status(400).json({ message: "Thumbnail is required" });

// //     const videoFile = req.files.video[0];
// //     const thumbnailFile = req.files.thumbnail[0];

// //     const video = await Video.create({
// //       title,
// //       filename: videoFile.filename,
// //       thumbnail: thumbnailFile.filename,
// //       url: `http://localhost:5000/uploads/${videoFile.filename}`,
// //       size: videoFile.size,
// //     });

// //     res.json({ message: "Video uploaded successfully", video });
// //   }
// // );
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
//     if (!req.files.thumbnail)
//       return res.status(400).json({ message: "Thumbnail is required" });

//     // 🌸 BLOOM FILTER DUPLICATE CHECK
//     const bloom = global.videoBloom;
//     if (bloom && bloom.contains(title.toLowerCase())) {
//       return res.status(400).json({ message: "⚠️ Duplicate title detected (maybe)" });
//     }

//     const videoFile = req.files.video[0];
//     const thumbnailFile = req.files.thumbnail[0];

//     const video = await Video.create({
//       title,
//       filename: videoFile.filename,
//       thumbnail: thumbnailFile.filename,
//       url: `http://localhost:5000/uploads/${videoFile.filename}`,
//       size: videoFile.size,
//       uploadedBy:req.user.id,
//     });

//     // 💾 ADD NEW TITLE TO BLOOM
//     if (bloom) bloom.add(title.toLowerCase());

//     res.json({ message: "Video uploaded successfully ✔", video });
//   }
// );


// // =============================
// // 📌 2. GET ALL VIDEOS
// // =============================
// router.get("/all", async (req, res) => {
//   try {
//     const videos = await Video.find().sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load videos" });
//   }
// });

// // =============================
// // 📌 3. DELETE VIDEO
// // =============================
// router.delete("/delete/:id", auth, async (req, res) => {
//   await Video.findByIdAndDelete(req.params.id);
//   res.json({ message: "Video deleted" });
// });

// // =============================
// // 📌 4. UPDATE TITLE
// // =============================
// router.put("/update/:id", auth, async (req, res) => {
//   const { title } = req.body;
//   await Video.findByIdAndUpdate(req.params.id, { title });
//   res.json({ message: "Title updated" });
// });

// // =============================
// // 📌 5. UPDATE THUMBNAIL
// // =============================
// router.put(
//   "/update-thumbnail/:id",
//   auth,
//   upload.single("thumbnail"),
//   async (req, res) => {
//     await Video.findByIdAndUpdate(req.params.id, {
//       thumbnail: req.file.filename,
//     });
//     res.json({ message: "Thumbnail updated" });
//   }
// );

// // =============================
// // 📌 6. UPDATE VIDEO FILE
// // =============================
// router.put(
//   "/update-video/:id",
//   auth,
//   upload.single("video"),
//   async (req, res) => {
//     const file = req.file;
//     await Video.findByIdAndUpdate(req.params.id, {
//       filename: file.filename,
//       url: `http://localhost:5000/uploads/${file.filename}`,
//       size: file.size,
//     });

//     res.json({ message: "Video file updated" });
//   }
// );

// // Get single video by filename
// router.get("/by-filename/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOne({ filename: req.params.filename });
//     if (!video) return res.status(404).json({ message: "Video not found" });
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching video" });
//   }
// });

// // LIKE a video
// router.post("/like/:id", auth, async (req, res) => {
//   const video = await Video.findById(req.params.id);
//   const userId = req.user.id;

//   // remove dislike if previously disliked
//   video.dislikes = video.dislikes.filter((d) => d !== userId);

//   // toggle like
//   if (video.likes.includes(userId)) {
//     video.likes = video.likes.filter((l) => l !== userId);
//   } else {
//     video.likes.push(userId);
//   }

//   await video.save();
//   res.json(video);
// });

// // DISLIKE a video
// router.post("/dislike/:id", auth, async (req, res) => {
//   const video = await Video.findById(req.params.id);
//   const userId = req.user.id;

//   // remove like if previously liked
//   video.likes = video.likes.filter((l) => l !== userId);

//   // toggle dislike
//   if (video.dislikes.includes(userId)) {
//     video.dislikes = video.dislikes.filter((d) => d !== userId);
//   } else {
//     video.dislikes.push(userId);
//   }

//   await video.save();
//   res.json(video);
// });

// // 📌 Increment Views when user watches a video
// router.post("/view/:filename", async (req, res) => {
//   const filename = req.params.filename;

//   const video = await Video.findOne({ filename });
//   if (!video) return res.status(404).json({ message: "Video not found" });

//   video.views += 1;
//   await video.save();

//   res.json({ message: "View Count Updated", views: video.views });
// });





// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const Video = require("../models/Video");
const auth = require("../middleware/auth");

// 🌸 Bloom filter
const bloom = global.videoBloom;

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ===========================
 📌 1. UPLOAD VIDEO + THUMBNAIL
=========================== */
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

    // ⚠ Check bloom duplicate
    if (bloom && bloom.contains(title.toLowerCase())) {
      return res.status(400).json({ message: "⚠️ Duplicate title detected" });
    }

    const videoFile = req.files.video[0];
    const thumbFile = req.files.thumbnail[0];

    const video = await Video.create({
      title,
      filename: videoFile.filename,
      thumbnail: thumbFile.filename,
      url: `http://localhost:5000/uploads/${videoFile.filename}`,
      size: videoFile.size,
      uploadedBy: req.user.id, // 📌 user who uploaded
    });

    // Add to bloom filter
    if (bloom) bloom.add(title.toLowerCase());

    res.json({ message: "Video uploaded successfully ✔", video });
  }
);

/* ===========================
 📌 2. GET ALL VIDEOS
=========================== */
router.get("/all", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to load videos" });
  }
});

/* ===========================
 📌 3. LIKE VIDEO
=========================== */
router.post("/like/:id", auth, async (req, res) => {
  const video = await Video.findById(req.params.id);
  const userId = req.user.id;

  video.dislikes = video.dislikes.filter((d) => d.toString() !== userId);

  if (video.likes.includes(userId)) {
    video.likes = video.likes.filter((l) => l.toString() !== userId);
  } else {
    video.likes.push(userId);
  }

  await video.save();
  res.json(video);
});

/* ===========================
 📌 4. DISLIKE VIDEO
=========================== */
router.post("/dislike/:id", auth, async (req, res) => {
  const video = await Video.findById(req.params.id);
  const userId = req.user.id;

  video.likes = video.likes.filter((l) => l.toString() !== userId);

  if (video.dislikes.includes(userId)) {
    video.dislikes = video.dislikes.filter((d) => d.toString() !== userId);
  } else {
    video.dislikes.push(userId);
  }

  await video.save();
  res.json(video);
});

/* ===========================
 📌 5. INCREMENT VIEW COUNT
=========================== */
router.post("/view/:filename", async (req, res) => {
  const video = await Video.findOne({ filename: req.params.filename });
  if (!video) return res.status(404).json({ message: "Video not found" });

  video.views += 1;
  await video.save();

  res.json({ message: "View Count Updated", views: video.views });
});

/* ===========================
 📌 6. GET VIDEO BY FILENAME
=========================== */
router.get("/by-filename/:filename", async (req, res) => {
  try {
    const video = await Video.findOne({ filename: req.params.filename }).populate("uploadedBy", "name");
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch {
    res.status(500).json({ message: "Error fetching video" });
  }
});

module.exports = router;
