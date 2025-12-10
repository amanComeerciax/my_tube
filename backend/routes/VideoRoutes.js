

// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");
// // const fs = require("fs");
// // const path = require("path");

// // const Video = require("../models/Video");
// // const auth = require("../middleware/auth");

// // // 🌸 Bloom filter (optional)
// // const bloom = global.videoBloom || null;

// // /* ===========================
// //  📌 MULTER STORAGE
// // =========================== */
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"),
// //   filename: (req, file, cb) =>
// //     cb(null, Date.now() + "-" + file.originalname),
// // });
// // const upload = multer({ storage });

// // /* ===========================
// //  📌 1. UPLOAD (VIDEO + THUMBNAIL + DESCRIPTION + TAGS + CATEGORY)
// // =========================== */
// // router.post(
// //   "/upload",
// //   auth,
// //   upload.fields([
// //     { name: "video", maxCount: 1 },
// //     { name: "thumbnail", maxCount: 1 },
// //   ]),
// //   async (req, res) => {
// //     try {
// //       const { title, description, tags, category } = req.body;

// //       console.log("📥 Upload request:");
// //       console.log("Title:", title);
// //       console.log("Category:", category);
// //       console.log("Description:", description);
// //       console.log("Tags:", tags);
// //       console.log("Files:", req.files);

// //       if (!title) {
// //         return res.status(400).json({ message: "Title is required" });
// //       }
// //       if (!req.files || !req.files.video) {
// //         return res.status(400).json({ message: "Video is required" });
// //       }
// //       if (!req.files.thumbnail) {
// //         return res
// //           .status(400)
// //           .json({ message: "Thumbnail is required" });
// //       }

// //       // Duplicate title check (if bloom filter enabled)
// //       if (bloom && bloom.contains(title.toLowerCase())) {
// //         return res
// //           .status(400)
// //           .json({ message: "⚠️ Duplicate title detected" });
// //       }

// //       const videoFile = req.files.video[0];
// //       const thumbFile = req.files.thumbnail[0];

// //       const tagArray = tags
// //         ? tags
// //             .split(",")
// //             .map((t) => t.trim().toLowerCase())
// //             .filter(Boolean)
// //         : [];

// //       const video = await Video.create({
// //         title,
// //         description: description || "",
// //         category: category || "Other",
// //         filename: videoFile.filename,
// //         thumbnail: thumbFile.filename,
// //         url: `${req.protocol}://${req.get("host")}/uploads/${videoFile.filename}`,
// //         size: videoFile.size,
// //         uploadedBy: req.user.id,
// //         tags: tagArray,
// //       });

// //       if (bloom) bloom.add(title.toLowerCase());

// //       res.json({ message: "Video uploaded successfully ✔", video });
// //     } catch (error) {
// //       console.error("Upload error:", error);
// //       res
// //         .status(500)
// //         .json({ message: "Upload failed", error: error.message });
// //     }
// //   }
// // );

// // /* ===========================
// //  📌 2. GET ALL VIDEOS
// // =========================== */
// // router.get("/all", async (req, res) => {
// //   try {
// //     const videos = await Video.find()
// //       .populate("uploadedBy", "name")
// //       .sort({ createdAt: -1 });
// //     res.json(videos);
// //   } catch (err) {
// //     console.error("Get all videos error:", err);
// //     res.status(500).json({ message: "Failed to load videos" });
// //   }
// // });

// // /* ===========================
// //  📌 3. GET VIDEOS BY CATEGORY
// // =========================== */
// // router.get("/category/:category", async (req, res) => {
// //   try {
// //     const { category } = req.params;
// //     const videos = await Video.find({ category })
// //       .populate("uploadedBy", "name")
// //       .sort({ createdAt: -1 })
// //       .limit(50);
// //     res.json(videos);
// //   } catch (err) {
// //     console.error("Get by category error:", err);
// //     res
// //       .status(500)
// //       .json({ message: "Failed to load videos by category" });
// //   }
// // });

// // /* ===========================
// //  📌 4. GET RECOMMENDED (Top views)
// // =========================== */
// // // router.get("/recommended", async (req, res) => {
// // //   try {
// // //     const videos = await Video.find()
// // //       .populate("uploadedBy", "name")
// // //       .sort({ views: -1, createdAt: -1 })
// // //       .limit(20);
// // //     res.json(videos);
// // //   } catch (err) {
// // //     console.error("Get recommended error:", err);
// // //     res.status(500).json({ message: "Failed to load recommended videos" });
// // //   }
// // // });
// // /* ===========================
// //  📌 4. SMART RECOMMENDED SYSTEM (Like YouTube)
// // =========================== */
// // router.get("/recommended", async (req, res) => {
// //   try {
// //     const userId = req.query.userId || null;

// //     let videos = await Video.find().populate("uploadedBy", "name");

// //     // No user logged in → Show trending first
// //     if (!userId) {
// //       const trending = videos
// //         .sort((a, b) => b.views - a.views)
// //         .slice(0, 30);
// //       return res.json(trending);
// //     }

// //     // If user logged in → Personalized mix
// //     const History = require("../models/WatchHistory");
// //     const historyData = await History.find({ user: userId }).populate("video");

// //     const historyVideos = historyData.map(h => h.video);

// //     // Extract favorite categories & tags from history
// //     const favCategories = new Set(historyVideos.map(v => v?.category));
// //     const favTags = new Set(historyVideos.flatMap(v => v?.tags || []));

// //     const recommended = videos
// //       .filter(v =>
// //         favCategories.has(v.category) ||
// //         v.tags?.some(tag => favTags.has(tag))
// //       )
// //       .sort((a, b) => b.views - a.views);

// //     const trendingBackup = videos.sort((a, b) => b.views - a.views);

// //     // Mix recommended + trending fallback
// //     const finalFeed = [...recommended, ...trendingBackup]
// //       .filter((v, i, arr) => arr.findIndex(x => x._id.equals(v._id)) === i)
// //       .slice(0, 50);

// //     res.json(finalFeed);
// //   } catch (err) {
// //     console.error("Smart recommended error:", err);
// //     res.status(500).json({ message: "Failed to load recommended videos" });
// //   }
// // });

// // /* ===========================
// //  📌 5. LIKE VIDEO
// // =========================== */
// // router.post("/like/:id", auth, async (req, res) => {
// //   try {
// //     const video = await Video.findById(req.params.id);
// //     if (!video)
// //       return res.status(404).json({ message: "Video not found" });

// //     const userId = req.user.id;

// //     video.likes = video.likes || [];
// //     video.dislikes = video.dislikes || [];

// //     // remove dislike if present
// //     video.dislikes = video.dislikes.filter(
// //       (d) => d.toString() !== userId
// //     );

// //     if (video.likes.some((l) => l.toString() === userId)) {
// //       // already liked -> unlike
// //       video.likes = video.likes.filter(
// //         (l) => l.toString() !== userId
// //       );
// //     } else {
// //       video.likes.push(userId);
// //     }

// //     await video.save();
// //     res.json(video);
// //   } catch (err) {
// //     console.error("Like error:", err);
// //     res.status(500).json({ message: "Error liking video" });
// //   }
// // });

// // /* ===========================
// //  📌 6. DISLIKE VIDEO
// // =========================== */
// // router.post("/dislike/:id", auth, async (req, res) => {
// //   try {
// //     const video = await Video.findById(req.params.id);
// //     if (!video)
// //       return res.status(404).json({ message: "Video not found" });

// //     const userId = req.user.id;

// //     video.likes = video.likes || [];
// //     video.dislikes = video.dislikes || [];

// //     // remove like if present
// //     video.likes = video.likes.filter(
// //       (l) => l.toString() !== userId
// //     );

// //     if (video.dislikes.some((d) => d.toString() === userId)) {
// //       // already disliked -> undo
// //       video.dislikes = video.dislikes.filter(
// //         (d) => d.toString() !== userId
// //       );
// //     } else {
// //       video.dislikes.push(userId);
// //     }

// //     await video.save();
// //     res.json(video);
// //   } catch (err) {
// //     console.error("Dislike error:", err);
// //     res.status(500).json({ message: "Error disliking video" });
// //   }
// // });

// // /* ===========================
// //  📌 7. INCREMENT VIEW COUNT
// // =========================== */
// // router.post("/view/:filename", async (req, res) => {
// //   try {
// //     const video = await Video.findOne({ filename: req.params.filename });
// //     if (!video)
// //       return res.status(404).json({ message: "Video not found" });

// //     video.views = (video.views || 0) + 1;
// //     await video.save();

// //     res.json({ message: "View Count Updated", views: video.views });
// //   } catch (err) {
// //     console.error("View increment error:", err);
// //     res.status(500).json({ message: "Error increasing views" });
// //   }
// // });

// // /* ===========================
// //  📌 8. GET VIDEO BY FILENAME
// // =========================== */
// // router.get("/by-filename/:filename", async (req, res) => {
// //   try {
// //     const video = await Video.findOne({
// //       filename: req.params.filename,
// //     }).populate("uploadedBy", "name");
// //     if (!video)
// //       return res.status(404).json({ message: "Video not found" });
// //     res.json(video);
// //   } catch (err) {
// //     console.error("Get by filename error:", err);
// //     res.status(500).json({ message: "Error fetching video" });
// //   }
// // });

// // /* ===========================
// //  📌 9. DELETE VIDEO (ADMIN / AUTH USER)
// // =========================== */
// // router.delete("/delete/:id", auth, async (req, res) => {
// //   try {
// //     const video = await Video.findById(req.params.id);
// //     if (!video)
// //       return res.status(404).json({ message: "Video not found" });

// //     // optionally: check if req.user.id === video.uploadedBy OR isAdmin
// //     // (agar strict permission chahiye ho तो yaha check kar sakte ho)

// //     // delete files from disk (optional but useful)
// //     try {
// //       const videoPath = path.join("uploads", video.filename);
// //       if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

// //       const thumbPath = path.join("uploads", video.thumbnail);
// //       if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
// //     } catch (fileErr) {
// //       console.warn("File delete error:", fileErr.message);
// //     }

// //     await video.deleteOne();
// //     res.json({ message: "Video deleted" });
// //   } catch (err) {
// //     console.error("Delete error:", err);
// //     res.status(500).json({ message: "Error deleting video" });
// //   }
// // });

// // /* ===========================
// //  📌 10. UPDATE TITLE
// // =========================== */
// // router.put("/update/:id", auth, async (req, res) => {
// //   try {
// //     const { title } = req.body;
// //     if (!title)
// //       return res.status(400).json({ message: "Title is required" });

// //     const video = await Video.findByIdAndUpdate(
// //       req.params.id,
// //       { title },
// //       { new: true }
// //     );
// //     if (!video)
// //       return res.status(404).json({ message: "Video not found" });

// //     res.json({ message: "Title updated", video });
// //   } catch (err) {
// //     console.error("Update title error:", err);
// //     res.status(500).json({ message: "Error updating title" });
// //   }
// // });

// // /* ===========================
// //  📌 11. UPDATE THUMBNAIL
// // =========================== */
// // router.put(
// //   "/update-thumbnail/:id",
// //   auth,
// //   upload.single("thumbnail"),
// //   async (req, res) => {
// //     try {
// //       const video = await Video.findById(req.params.id);
// //       if (!video)
// //         return res
// //           .status(404)
// //           .json({ message: "Video not found" });

// //       if (!req.file)
// //         return res
// //           .status(400)
// //           .json({ message: "Thumbnail file is required" });

// //       // delete old thumbnail
// //       try {
// //         const oldPath = path.join("uploads", video.thumbnail);
// //         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
// //       } catch (fileErr) {
// //         console.warn("Old thumb delete error:", fileErr.message);
// //       }

// //       video.thumbnail = req.file.filename;
// //       await video.save();

// //       res.json({ message: "Thumbnail updated", video });
// //     } catch (err) {
// //       console.error("Update thumbnail error:", err);
// //       res
// //         .status(500)
// //         .json({ message: "Error updating thumbnail" });
// //     }
// //   }
// // );
// // router.put("/:id", auth, upload.single("thumbnail"), async (req, res) => {
// //   try {
// //     const { title, category, description } = req.body;
// //     const updateData = { title, category, description };

// //     if (req.file) updateData.thumbnail = req.file.filename;

// //     await Video.findByIdAndUpdate(req.params.id, updateData);

// //     res.json({ message: "Video updated ✔" });
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ message: "Update Failed ❌" });
// //   }
// // });

// // /* ===========================
// //  📌 DELETE VIDEO
// // =========================== */
// // router.delete("/:id", auth, async (req, res) => {
// //   try {
// //     await Video.findByIdAndDelete(req.params.id);
// //     res.json({ message: "Video deleted ❌" });
// //   } catch {
// //     res.status(500).json({ message: "Delete failed" });
// //   }
// // });
// // /* ===========================
// //  📌 12. UPDATE VIDEO FILE
// // =========================== */
// // router.put(
// //   "/update-video/:id",
// //   auth,
// //   upload.single("video"),
// //   async (req, res) => {
// //     try {
// //       const video = await Video.findById(req.params.id);
// //       if (!video)
// //         return res
// //           .status(404)
// //           .json({ message: "Video not found" });

// //       if (!req.file)
// //         return res
// //           .status(400)
// //           .json({ message: "Video file is required" });

// //       // delete old video file
// //       try {
// //         const oldPath = path.join("uploads", video.filename);
// //         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
// //       } catch (fileErr) {
// //         console.warn("Old video delete error:", fileErr.message);
// //       }

// //       video.filename = req.file.filename;
// //       video.url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
// //       video.size = req.file.size;

// //       await video.save();

// //       res.json({ message: "Video file updated", video });
// //     } catch (err) {
// //       console.error("Update video file error:", err);
// //       res.status(500).json({ message: "Error updating video file" });
// //     }
// //   }
// // );

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// const Video = require("../models/Video");
// const User = require("../models/User");
// const auth = require("../middleware/auth");

// const bloom = global.videoBloom || null;

// /* ===========================
//  🧮 SIMILARITY COMPUTATION
// =========================== */
// function computeSimilarity(v1, v2) {
//   let score = 0;

//   // 🏷 Tags (40%)
//   if (v1.tags?.length && v2.tags?.length) {
//     const common = v1.tags.filter(t => v2.tags.includes(t));
//     score += (common.length / Math.max(v1.tags.length, v2.tags.length)) * 40;
//   }

//   // 📂 Category (30%)
//   if (v1.category === v2.category) score += 30;

//   // 🔤 Title (15%)
//   if (v1.title && v2.title) {
//     const t1 = v1.title.toLowerCase().split(" ");
//     const t2 = v2.title.toLowerCase().split(" ");
//     const common = t1.filter(w => t2.includes(w));
//     score += (common.length / Math.max(t1.length, t2.length)) * 15;
//   }

//   // ⭐ Popularity (15%)
//   const pop2 = (v2.views || 0) + (v2.likes?.length || 0) * 10;
//   score += Math.min(pop2 / 100, 15);

//   return score;
// }

// /* ===========================
//  📦 MULTER STORAGE
// =========================== */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// /* ===========================
//  1️⃣ UPLOAD VIDEO
// =========================== */
// router.post(
//   "/upload",
//   auth,
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { title, description, tags, category } = req.body;

//       if (!title) return res.status(400).json({ message: "Title required" });
//       if (!req.files?.video) return res.status(400).json({ message: "Video required" });
//       if (!req.files?.thumbnail) return res.status(400).json({ message: "Thumbnail required" });

//       if (bloom && bloom.contains(title.toLowerCase()))
//         return res.status(400).json({ message: "⚠️ Duplicate title" });

//       const videoFile = req.files.video[0];
//       const thumbFile = req.files.thumbnail[0];
//       const tagArray = tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

//       const video = await Video.create({
//         title,
//         description: description || "",
//         category: category || "Other",
//         filename: videoFile.filename,
//         thumbnail: thumbFile.filename,
//         url: `${req.protocol}://${req.get("host")}/uploads/${videoFile.filename}`,
//         size: videoFile.size,
//         uploadedBy: req.user.id,
//         tags: tagArray,
//       });

//       if (bloom) bloom.add(title.toLowerCase());
//       res.json({ message: "✅ Video uploaded", video });
//     } catch (error) {
//       console.error("Upload error:", error);
//       res.status(500).json({ message: "Upload failed", error: error.message });
//     }
//   }
// );

// /* ===========================
//  2️⃣ GET ALL VIDEOS
// =========================== */
// router.get("/all", async (req, res) => {
//   try {
//     const videos = await Video.find()
//       .populate("uploadedBy", "name")
//       .sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load" });
//   }
// });

// /* ===========================
//  3️⃣ GET BY CATEGORY
// =========================== */
// router.get("/category/:category", async (req, res) => {
//   try {
//     const videos = await Video.find({ category: req.params.category })
//       .populate("uploadedBy", "name")
//       .sort({ createdAt: -1 })
//       .limit(50);
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Category load failed" });
//   }
// });

// /* ===========================
//  4️⃣ SMART RECOMMENDED FEED (Home Page)
// =========================== */
// router.get("/recommended", auth, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const allVideos = await Video.find().populate("uploadedBy", "name");

//     // 🎯 GUEST USERS - Show Trending
//     if (!userId) {
//       const trending = allVideos
//         .sort((a, b) => (b.views || 0) - (a.views || 0))
//         .slice(0, 50);
//       return res.json(trending);
//     }

//     // 🎯 LOGGED IN USERS - Personalized
//     const user = await User.findById(userId)
//       .populate({
//         path: "watchHistory.video",
//         populate: { path: "uploadedBy", select: "name" }
//       });

//     const watchHistory = user?.watchHistory
//       ?.filter(h => h.video)
//       .map(h => h.video) || [];

//     if (watchHistory.length === 0) {
//       // New user - show trending
//       const trending = allVideos
//         .sort((a, b) => (b.views || 0) - (a.views || 0))
//         .slice(0, 50);
//       return res.json(trending);
//     }

//     // 📊 ANALYZE USER PREFERENCES
//     const watchedCategories = new Set();
//     const watchedTags = new Set();
//     const watchedChannels = new Set();

//     watchHistory.forEach(v => {
//       if (v.category) watchedCategories.add(v.category);
//       v.tags?.forEach(t => watchedTags.add(t));
//       if (v.uploadedBy?._id) watchedChannels.add(v.uploadedBy._id.toString());
//     });

//     // 🎯 SCORE EACH VIDEO
//     const scoredVideos = allVideos.map(video => {
//       let score = 0;

//       // 1️⃣ Category Match (30 points)
//       if (watchedCategories.has(video.category)) {
//         score += 30;
//       }

//       // 2️⃣ Tag Similarity (25 points)
//       const matchingTags = video.tags?.filter(t => watchedTags.has(t)).length || 0;
//       score += Math.min(matchingTags * 5, 25);

//       // 3️⃣ Channel Match (20 points)
//       if (watchedChannels.has(video.uploadedBy?._id?.toString())) {
//         score += 20;
//       }

//       // 4️⃣ Popularity (15 points)
//       const popularity = (video.views || 0) / 1000 + (video.likes?.length || 0);
//       score += Math.min(popularity, 15);

//       // 5️⃣ Freshness (10 points)
//       const daysOld = (Date.now() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24);
//       if (daysOld < 7) score += 10;
//       else if (daysOld < 30) score += 5;

//       // 6️⃣ Avoid Recently Watched
//       const recentlyWatched = watchHistory
//         .slice(0, 10)
//         .some(h => h._id.toString() === video._id.toString());
//       if (recentlyWatched) score -= 50;

//       return { ...video._doc, score };
//     });

//     // 🎯 SORT & LIMIT
//     const recommended = scoredVideos
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 50);

//     res.json(recommended);
//   } catch (err) {
//     console.error("Recommendation error:", err);
//     res.status(500).json({ message: "Failed to load recommendations" });
//   }
// });

// /* ===========================
//  5️⃣ SIMILAR VIDEOS (Watch Page Sidebar)
// =========================== */
// router.get("/similar/:filename", async (req, res) => {
//   try {
//     const current = await Video.findOne({ filename: req.params.filename });
//     if (!current) return res.status(404).json({ message: "Not found" });

//     const allVideos = await Video.find({ 
//       filename: { $ne: current.filename } 
//     }).populate("uploadedBy", "name");

//     // 🎯 COMPUTE SIMILARITY SCORES
//     const scored = allVideos.map(v => ({
//       ...v._doc,
//       score: computeSimilarity(current, v._doc)
//     }));

//     // 🎯 SORT BY SCORE + ADD DIVERSITY
//     scored.sort((a, b) => b.score - a.score);

//     // Prevent too many from same channel
//     const results = [];
//     const channelCount = {};

//     for (const item of scored) {
//       const channelId = item.uploadedBy?._id?.toString();
//       channelCount[channelId] = (channelCount[channelId] || 0) + 1;
      
//       if (channelCount[channelId] <= 3) {
//         results.push(item);
//       }
      
//       if (results.length >= 20) break;
//     }

//     res.json(results);
//   } catch (err) {
//     console.error("Similar videos error:", err);
//     res.status(500).json({ message: "Failed to load similar" });
//   }
// });

// /* ===========================
//  6️⃣ LIKE VIDEO
// =========================== */
// router.post("/like/:id", auth, async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });

//     const userId = req.user.id;
//     video.likes = video.likes || [];
//     video.dislikes = video.dislikes || [];

//     video.dislikes = video.dislikes.filter(d => d.toString() !== userId);

//     if (video.likes.some(l => l.toString() === userId)) {
//       video.likes = video.likes.filter(l => l.toString() !== userId);
//     } else {
//       video.likes.push(userId);
//     }

//     await video.save();
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Like failed" });
//   }
// });

// /* ===========================
//  7️⃣ DISLIKE VIDEO
// =========================== */
// router.post("/dislike/:id", auth, async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });

//     const userId = req.user.id;
//     video.likes = video.likes || [];
//     video.dislikes = video.dislikes || [];

//     video.likes = video.likes.filter(l => l.toString() !== userId);

//     if (video.dislikes.some(d => d.toString() === userId)) {
//       video.dislikes = video.dislikes.filter(d => d.toString() !== userId);
//     } else {
//       video.dislikes.push(userId);
//     }

//     await video.save();
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Dislike failed" });
//   }
// });

// /* ===========================
//  8️⃣ INCREMENT VIEWS
// =========================== */
// router.post("/view/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOne({ filename: req.params.filename });
//     if (!video) return res.status(404).json({ message: "Not found" });

//     video.views = (video.views || 0) + 1;
//     await video.save();

//     res.json({ message: "View updated", views: video.views });
//   } catch (err) {
//     res.status(500).json({ message: "View update failed" });
//   }
// });

// /* ===========================
//  9️⃣ GET BY FILENAME
// =========================== */
// router.get("/by-filename/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOne({ filename: req.params.filename })
//       .populate("uploadedBy", "name");
//     if (!video) return res.status(404).json({ message: "Not found" });
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Fetch failed" });
//   }
// });

// /* ===========================
//  🔟 TRACK WATCH TIME (Optional - Advanced)
// =========================== */
// router.post("/track-watch/:id", auth, async (req, res) => {
//   try {
//     const { watchTimeSeconds, percentageWatched } = req.body;
//     const video = await Video.findById(req.params.id);
    
//     if (!video) return res.status(404).json({ message: "Not found" });

//     video.watchTime = (video.watchTime || 0) + (watchTimeSeconds || 0);
    
//     const totalWatches = video.views || 1;
//     video.avgWatchPercentage = 
//       ((video.avgWatchPercentage || 0) * (totalWatches - 1) + (percentageWatched || 0)) / totalWatches;

//     await video.save();
//     res.json({ message: "Watch tracked" });
//   } catch (err) {
//     res.status(500).json({ message: "Track failed" });
//   }
// });

// /* ===========================
//  UPDATE & DELETE ROUTES
// =========================== */
// router.put("/update/:id", auth, async (req, res) => {
//   try {
//     const { title } = req.body;
//     const video = await Video.findByIdAndUpdate(
//       req.params.id, 
//       { title }, 
//       { new: true }
//     );
//     res.json({ message: "Updated", video });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.put("/:id", auth, upload.single("thumbnail"), async (req, res) => {
//   try {
//     const { title, category, description } = req.body;
//     const update = { title, category, description };
//     if (req.file) update.thumbnail = req.file.filename;

//     await Video.findByIdAndUpdate(req.params.id, update);
//     res.json({ message: "✅ Updated" });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.delete("/:id", auth, async (req, res) => {
//   try {
//     await Video.findByIdAndDelete(req.params.id);
//     res.json({ message: "🗑️ Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });

// router.put("/update-video/:id", auth, upload.single("video"), async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });
//     if (!req.file) return res.status(400).json({ message: "File required" });

//     try {
//       const oldPath = path.join("uploads", video.filename);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//     } catch {}

//     video.filename = req.file.filename;
//     video.url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     video.size = req.file.size;
//     await video.save();

//     res.json({ message: "Video updated", video });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// const Video = require("../models/Video");
// const User = require("../models/User");
// const auth = require("../middleware/auth");

// const bloom = global.videoBloom || null;

// /* ===========================
//  🧮 SIMILARITY COMPUTATION
// =========================== */
// function computeSimilarity(v1, v2) {
//   let score = 0;

//   // 🏷 Tags (40%)
//   if (v1.tags?.length && v2.tags?.length) {
//     const common = v1.tags.filter(t => v2.tags.includes(t));
//     score += (common.length / Math.max(v1.tags.length, v2.tags.length)) * 40;
//   }

//   // 📂 Category (30%)
//   if (v1.category === v2.category) score += 30;

//   // 🔤 Title (15%)
//   if (v1.title && v2.title) {
//     const t1 = v1.title.toLowerCase().split(" ");
//     const t2 = v2.title.toLowerCase().split(" ");
//     const common = t1.filter(w => t2.includes(w));
//     score += (common.length / Math.max(t1.length, t2.length)) * 15;
//   }

//   // ⭐ Popularity (15%)
//   const pop2 = (v2.views || 0) + (v2.likes?.length || 0) * 10;
//   score += Math.min(pop2 / 100, 15);

//   return score;
// }


// /* ===========================
//  📦 MULTER STORAGE
// =========================== */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// /* ===========================
//  1️⃣ UPLOAD VIDEO
// =========================== */
// router.post(
//   "/upload",
//   auth,
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { title, description, tags, category } = req.body;

//       if (!title) return res.status(400).json({ message: "Title required" });
//       if (!req.files?.video) return res.status(400).json({ message: "Video required" });
//       if (!req.files?.thumbnail) return res.status(400).json({ message: "Thumbnail required" });

//       if (bloom && bloom.contains(title.toLowerCase()))
//         return res.status(400).json({ message: "⚠️ Duplicate title" });

//       const videoFile = req.files.video[0];
//       const thumbFile = req.files.thumbnail[0];
//       const tagArray = tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

//       const video = await Video.create({
//         title,
//         description: description || "",
//         category: category || "Other",
//         filename: videoFile.filename,
//         thumbnail: thumbFile.filename,
//         url: `${req.protocol}://${req.get("host")}/uploads/${videoFile.filename}`,
//         size: videoFile.size,
//         uploadedBy: req.user.id,
//         tags: tagArray,
//       });

//       if (bloom) bloom.add(title.toLowerCase());
//       res.json({ message: "✅ Video uploaded", video });
//     } catch (error) {
//       console.error("Upload error:", error);
//       res.status(500).json({ message: "Upload failed", error: error.message });
//     }
//   }
// );

// /* ===========================
//  2️⃣ GET ALL VIDEOS
// =========================== */
// router.get("/all", async (req, res) => {
//   try {
//     const videos = await Video.find()
//       .populate("uploadedBy", "name")
//       .sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load" });
//   }
// });

// /* ===========================
//  3️⃣ GET BY CATEGORY
// =========================== */
// router.get("/category/:category", async (req, res) => {
//   try {
//     const videos = await Video.find({ category: req.params.category })
//       .populate("uploadedBy", "name")
//       .sort({ createdAt: -1 })
//       .limit(50);
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Category load failed" });
//   }
// });

// /* ===========================
//  4️⃣ SMART RECOMMENDED FEED (Home Page)
// =========================== */
// router.get("/recommended", auth, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const allVideos = await Video.find().populate("uploadedBy", "name");

//     // 🎯 GUEST USERS - Show Trending
//     if (!userId) {
//       const trending = allVideos
//         .sort((a, b) => (b.views || 0) - (a.views || 0))
//         .slice(0, 50);
//       return res.json(trending);
//     }

//     // 🎯 LOGGED IN USERS - Personalized
//     const user = await User.findById(userId)
//       .populate({
//         path: "watchHistory.video",
//         populate: { path: "uploadedBy", select: "name" }
//       });

//     const watchHistory = user?.watchHistory
//       ?.filter(h => h.video)
//       .map(h => h.video) || [];

//     if (watchHistory.length === 0) {
//       // New user - show trending
//       const trending = allVideos
//         .sort((a, b) => (b.views || 0) - (a.views || 0))
//         .slice(0, 50);
//       return res.json(trending);
//     }

//     // 📊 ANALYZE USER PREFERENCES
//     const watchedCategories = new Set();
//     const watchedTags = new Set();
//     const watchedChannels = new Set();

//     watchHistory.forEach(v => {
//       if (v.category) watchedCategories.add(v.category);
//       v.tags?.forEach(t => watchedTags.add(t));
//       if (v.uploadedBy?._id) watchedChannels.add(v.uploadedBy._id.toString());
//     });

//     // 🎯 SCORE EACH VIDEO
//     const scoredVideos = allVideos.map(video => {
//       let score = 0;

//       // 1️⃣ Category Match (30 points)
//       if (watchedCategories.has(video.category)) {
//         score += 30;
//       }

//       // 2️⃣ Tag Similarity (25 points)
//       const matchingTags = video.tags?.filter(t => watchedTags.has(t)).length || 0;
//       score += Math.min(matchingTags * 5, 25);

//       // 3️⃣ Channel Match (20 points)
//       if (watchedChannels.has(video.uploadedBy?._id?.toString())) {
//         score += 20;
//       }

//       // 4️⃣ Popularity (15 points)
//       const popularity = (video.views || 0) / 1000 + (video.likes?.length || 0);
//       score += Math.min(popularity, 15);

//       // 5️⃣ Freshness (10 points)
//       const daysOld = (Date.now() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24);
//       if (daysOld < 7) score += 10;
//       else if (daysOld < 30) score += 5;

//       // 6️⃣ Avoid Recently Watched
//       const recentlyWatched = watchHistory
//         .slice(0, 10)
//         .some(h => h._id.toString() === video._id.toString());
//       if (recentlyWatched) score -= 50;

//       return { ...video._doc, score };
//     });

//     // 🎯 SORT & LIMIT
//     const recommended = scoredVideos
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 50);

//     res.json(recommended);
//   } catch (err) {
//     console.error("Recommendation error:", err);
//     res.status(500).json({ message: "Failed to load recommendations" });
//   }
// });

// /* ===========================
//  5️⃣ SIMILAR VIDEOS (Watch Page Sidebar)
// =========================== */
// router.get("/similar/:filename", async (req, res) => {
//   try {
//     const current = await Video.findOne({ filename: req.params.filename });
//     if (!current) return res.status(404).json({ message: "Not found" });

//     const allVideos = await Video.find({ 
//       filename: { $ne: current.filename } 
//     }).populate("uploadedBy", "name");

//     // 🎯 COMPUTE SIMILARITY SCORES
//     const scored = allVideos.map(v => ({
//       ...v._doc,
//       score: computeSimilarity(current, v._doc)
//     }));

//     // 🎯 SORT BY SCORE + ADD DIVERSITY
//     scored.sort((a, b) => b.score - a.score);

//     // Prevent too many from same channel
//     const results = [];
//     const channelCount = {};

//     for (const item of scored) {
//       const channelId = item.uploadedBy?._id?.toString();
//       channelCount[channelId] = (channelCount[channelId] || 0) + 1;
      
//       if (channelCount[channelId] <= 3) {
//         results.push(item);
//       }
      
//       if (results.length >= 20) break;
//     }

//     res.json(results);
//   } catch (err) {
//     console.error("Similar videos error:", err);
//     res.status(500).json({ message: "Failed to load similar" });
//   }
// });

// /* ===========================
//  6️⃣ LIKE VIDEO
// =========================== */
// router.post("/like/:id", auth, async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });

//     const userId = req.user.id;
//     video.likes = video.likes || [];
//     video.dislikes = video.dislikes || [];

//     video.dislikes = video.dislikes.filter(d => d.toString() !== userId);

//     if (video.likes.some(l => l.toString() === userId)) {
//       video.likes = video.likes.filter(l => l.toString() !== userId);
//     } else {
//       video.likes.push(userId);
//     }

//     await video.save();
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Like failed" });
//   }
// });

// /* ===========================
//  7️⃣ DISLIKE VIDEO
// =========================== */
// router.post("/dislike/:id", auth, async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });

//     const userId = req.user.id;
//     video.likes = video.likes || [];
//     video.dislikes = video.dislikes || [];

//     video.likes = video.likes.filter(l => l.toString() !== userId);

//     if (video.dislikes.some(d => d.toString() === userId)) {
//       video.dislikes = video.dislikes.filter(d => d.toString() !== userId);
//     } else {
//       video.dislikes.push(userId);
//     }

//     await video.save();
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Dislike failed" });
//   }
// });

// /* ===========================
//  8️⃣ INCREMENT VIEWS
// =========================== */
// router.post("/view/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOne({ filename: req.params.filename });
//     if (!video) return res.status(404).json({ message: "Not found" });

//     video.views = (video.views || 0) + 1;
//     await video.save();

//     res.json({ message: "View updated", views: video.views });
//   } catch (err) {
//     res.status(500).json({ message: "View update failed" });
//   }
// });

// /* ===========================
//  9️⃣ GET BY FILENAME
// =========================== */
// router.get("/by-filename/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOne({ filename: req.params.filename })
//       .populate("uploadedBy", "name");
//     if (!video) return res.status(404).json({ message: "Not found" });
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Fetch failed" });
//   }
// });

// /* ===========================
//  🔟 TRACK WATCH TIME (Optional - Advanced)
// =========================== */
// router.post("/track-watch/:id", auth, async (req, res) => {
//   try {
//     const { watchTimeSeconds, percentageWatched } = req.body;
//     const video = await Video.findById(req.params.id);
    
//     if (!video) return res.status(404).json({ message: "Not found" });

//     video.watchTime = (video.watchTime || 0) + (watchTimeSeconds || 0);
    
//     const totalWatches = video.views || 1;
//     video.avgWatchPercentage = 
//       ((video.avgWatchPercentage || 0) * (totalWatches - 1) + (percentageWatched || 0)) / totalWatches;

//     await video.save();
//     res.json({ message: "Watch tracked" });
//   } catch (err) {
//     res.status(500).json({ message: "Track failed" });
//   }
// });

// /* ===========================
//  UPDATE & DELETE ROUTES
// =========================== */
// router.put("/update/:id", auth, async (req, res) => {
//   try {
//     const { title } = req.body;
//     const video = await Video.findByIdAndUpdate(
//       req.params.id, 
//       { title }, 
//       { new: true }
//     );
//     res.json({ message: "Updated", video });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.put("/:id", auth, upload.single("thumbnail"), async (req, res) => {
//   try {
//     const { title, category, description } = req.body;
//     const update = { title, category, description };
//     if (req.file) update.thumbnail = req.file.filename;

//     await Video.findByIdAndUpdate(req.params.id, update);
//     res.json({ message: "✅ Updated" });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.delete("/:id", auth, async (req, res) => {
//   try {
//     await Video.findByIdAndDelete(req.params.id);
//     res.json({ message: "🗑️ Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });

// router.put("/update-video/:id", auth, upload.single("video"), async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });
//     if (!req.file) return res.status(400).json({ message: "File required" });

//     try {
//       const oldPath = path.join("uploads", video.filename);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//     } catch {}

//     video.filename = req.file.filename;
//     video.url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     video.size = req.file.size;
//     await video.save();

//     res.json({ message: "Video updated", video });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// module.exports = router;
/////////////////////////////////


// routes/videos.js  ← PURA FINAL FILE (COPY-PASTE KAR DE)

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// const Video = require("../models/Video");
// const User = require("../models/User");
// const auth = require("../middleware/auth");

// // =======================
// // PRE-BUILT SIMILARITY MATRIX (SUPER FAST)
// // =======================
// let similarityMatrix = {};
// try {
//   similarityMatrix = require("../similarity-matrix.json"); // ← yeh file root mein rakhna
//   console.log(`Similarity Matrix loaded with ${Object.keys(similarityMatrix).length} videos`);
// } catch (err) {
//   console.log("Warning: similarity-matrix.json not found → using fallback similarity");
// }

// // =======================
// // OLD SIMILARITY FUNCTION (fallback ke liye)
// // =======================
// function computeSimilarity(v1, v2) {
//   let score = 0;
//   if (v1.tags?.length && v2.tags?.length) {
//     const common = v1.tags.filter(t => v2.tags.includes(t));
//     score += (common.length / Math.max(v1.tags.length, v2.tags.length)) * 40;
//   }
//   if (v1.category === v2.category) score += 30;
//   if (v1.title && v2.title) {
//     const t1 = v1.title.toLowerCase().split(" ");
//     const t2 = v2.title.toLowerCase().split(" ");
//     const common = t1.filter(w => t2.includes(w));
//     score += (common.length / Math.max(t1.length, t2.length)) * 15;
//   }
//   const pop = (v2.views || 0) + (v2.likes?.length || 0) * 10;
//   score += Math.min(pop / 100, 15);
//   return score;
// }

// // =======================
// // MULTER STORAGE
// // =======================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // =======================
// // 1. UPLOAD VIDEO
// // =======================
// router.post(
//   "/upload",
//   auth,
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { title, description, tags, category } = req.body;
//       if (!title || !req.files?.video || !req.files?.thumbnail)
//         return res.status(400).json({ message: "Title, video & thumbnail required" });

//       const videoFile = req.files.video[0];
//       const thumbFile = req.files.thumbnail[0];
//       const tagArray = tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

//       const video = await Video.create({
//         title,
//         description: description || "",
//         category: category || "Other",
//         filename: videoFile.filename,
//         thumbnail: thumbFile.filename,
//         url: `${req.protocol}://${req.get("host")}/uploads/${videoFile.filename}`,
//         size: videoFile.size,
//         uploadedBy: req.user.id,
//         tags: tagArray,
//       });

//       res.json({ message: "Video uploaded successfully!", video });
//     } catch (error) {
//       console.error("Upload error:", error);
//       res.status(500).json({ message: "Upload failed" });
//     }
//   }
// );

// // =======================
// // 2. GET ALL VIDEOS
// // =======================
// router.get("/all", async (req, res) => {
//   try {
//     const videos = await Video.find().populate("uploadedBy", "name").sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed" });
//   }
// });

// // =======================
// // 3. GET BY CATEGORY
// // =======================
// router.get("/category/:category", async (req, res) => {
//   try {
//     const videos = await Video.find({ category: req.params.category })
//       .populate("uploadedBy", "name")
//       .sort({ createdAt: -1 })
//       .limit(50);
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed" });
//   }
// });

// // =======================
// // 4. PERSONALIZED RECOMMENDED (HOME PAGE)
// // =======================
// router.get("/recommended", auth, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const allVideos = await Video.find().populate("uploadedBy", "name");

//     if (!userId) {
//       return res.json(allVideos.sort((a, b) => b.views - a.views).slice(0, 50));
//     }

//     const user = await User.findById(userId).populate({
//       path: "watchHistory.video",
//       populate: { path: "uploadedBy", select: "name" },
//     });

//     const watchHistory = user?.watchHistory?.map(h => h.video).filter(Boolean) || [];

//     if (watchHistory.length === 0) {
//       return res.json(allVideos.sort((a, b) => b.views - a.views).slice(0, 50));
//     }

//     const watchedCategories = new Set(watchHistory.map(v => v.category));
//     const watchedTags = new Set();
//     watchHistory.forEach(v => v.tags?.forEach(t => watchedTags.add(t)));
//     const watchedChannels = new Set(watchHistory.map(v => v.uploadedBy?._id?.toString()));

//     const scored = allVideos.map(video => {
//       let score = 0;
//       if (watchedCategories.has(video.category)) score += 30;
//       const tagMatch = video.tags?.filter(t => watchedTags.has(t)).length || 0;
//       score += Math.min(tagMatch * 5, 25);
//       if (watchedChannels.has(video.uploadedBy?._id?.toString())) score += 20;
//       score += Math.min((video.views || 0) / 1000 + (video.likes?.length || 0), 15);
//       const daysOld = (Date.now() - new Date(video.createdAt)) / 86400000;
//       if (daysOld < 7) score += 10;
//       else if (daysOld < 30) score += 5;
//       if (watchHistory.slice(0, 10).some(h => h._id.toString() === video._id.toString())) score -= 50;
//       return { ...video.toObject(), score };
//     });

//     res.json(scored.sort((a, b) => b.score - a.score).slice(0, 50));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Recommendation failed" });
//   }
// });

// // =======================
// // 5. SIMILAR VIDEOS – MATRIX POWERED (0.02 sec!)
// // =======================
// router.get("/similar/:filename", async (req, res) => {
//   try {
//     const current = await Video.findOne({ filename: req.params.filename }).lean();
//     if (!current) return res.status(404).json({ message: "Video not found" });

//     const matrixKey = current._id.toString();
//     const similarFromMatrix = similarityMatrix[matrixKey];

//     // Agar matrix mein hai → super fast
//     if (similarFromMatrix && similarFromMatrix.length > 0) {
//       const ids = similarFromMatrix.map(item => item.videoId);
//       const videos = await Video.find({ _id: { $in: ids } })
//         .populate("uploadedBy", "name")
//         .lean();

//       const ordered = ids
//         .map(id => videos.find(v => v._id.toString() === id.toString()))
//         .filter(Boolean);
//       return res.json(ordered);
//     }

//     // Fallback (pehle wala method)
//     const all = await Video.find({ filename: { $ne: current.filename } })
//       .populate("uploadedBy", "name")
//       .lean();

//     const scored = all
//       .map(v => ({ ...v, score: computeSimilarity(current, v) }))
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 20);

//     res.json(scored);
//   } catch (err) {
//     console.error("Similar error:", err);
//     res.status(500).json({ message: "Failed" });
//   }
// });

// // =======================
// // 6. LIKE
// // =======================
// router.post("/like/:id", auth, async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });

//     const userId = req.user.id;
//     video.dislikes = video.dislikes?.filter(d => d.toString() !== userId) || [];
//     const liked = video.likes.includes(userId);
//     if (liked) video.likes.pull(userId);
//     else video.likes.push(userId);

//     await video.save();
//     await video.populate("uploadedBy", "name");
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Like failed" });
//   }
// });

// // =======================
// // 7. DISLIKE
// // =======================
// router.post("/dislike/:id", auth, async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });

//     const userId = req.user.id;
//     video.likes = video.likes?.filter(l => l.toString() !== userId) || [];
//     const disliked = video.dislikes.includes(userId);
//     if (disliked) video.dislikes.pull(userId);
//     else video.dislikes.push(userId);

//     await video.save();
//     await video.populate("uploadedBy", "name");
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Dislike failed" });
//   }
// });

// // =======================
// // 8. VIEW COUNT
// // =======================
// router.post("/view/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOneAndUpdate(
//       { filename: req.params.filename },
//       { $inc: { views: 1 } },
//       { new: true }
//     );
//     if (!video) return res.status(404).json({ message: "Not found" });
//     res.json({ views: video.views });
//   } catch (err) {
//     res.status(500).json({ message: "View failed" });
//   }
// });

// // =======================
// // 9. GET VIDEO BY FILENAME
// // =======================
// router.get("/by-filename/:filename", async (req, res) => {
//   try {
//     const video = await Video.findOne({ filename: req.params.filename })
//       .populate("uploadedBy", "name");
//     if (!video) return res.status(404).json({ message: "Not found" });
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: "Fetch failed" });
//   }
// });

// /* ===========================
//  UPDATE & DELETE ROUTES
// =========================== */
// router.put("/update/:id", auth, async (req, res) => {
//   try {
//     const { title } = req.body;
//     const video = await Video.findByIdAndUpdate(
//       req.params.id, 
//       { title }, 
//       { new: true }
//     );
//     res.json({ message: "Updated", video });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.put("/:id", auth, upload.single("thumbnail"), async (req, res) => {
//   try {
//     const { title, category, description } = req.body;
//     const update = { title, category, description };
//     if (req.file) update.thumbnail = req.file.filename;

//     await Video.findByIdAndUpdate(req.params.id, update);
//     res.json({ message: "✅ Updated" });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.delete("/:id", auth, async (req, res) => {
//   try {
//     await Video.findByIdAndDelete(req.params.id);
//     res.json({ message: "🗑️ Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });

// router.put("/update-video/:id", auth, upload.single("video"), async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });
//     if (!req.file) return res.status(400).json({ message: "File required" });

//     try {
//       const oldPath = path.join("uploads", video.filename);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//     } catch {}

//     video.filename = req.file.filename;
//     video.url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     video.size = req.file.size;
//     await video.save();

//     res.json({ message: "Video updated", video });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });
// module.exports = router;

const express = require("express");
const router = express.Router();
// fs को promises API के साथ import करें (Async/Await के लिए)
const fs = require("fs").promises; 
const fsSync = require("fs"); // Synchronous version for simple checks (e.g., directory existence)
const path = require("path");

const multer = require("multer");
const Video = require("../models/Video");
const User = require("../models/User");
const auth = require("../middleware/auth");

// =======================
// PRE-BUILT SIMILARITY MATRIX (SUPER FAST)
// =======================
let similarityMatrix = {};
try {
  similarityMatrix = require("../similarity-matrix.json");
  console.log(`Similarity Matrix loaded with ${Object.keys(similarityMatrix).length} videos`);
} catch (err) {
  console.log("Warning: similarity-matrix.json not found → using fallback similarity");
}

// =======================
// OLD SIMILARITY FUNCTION (fallback ke liye)
// =======================
function computeSimilarity(v1, v2) {
  let score = 0;
  if (v1.tags?.length && v2.tags?.length) {
    const common = v1.tags.filter(t => v2.tags.includes(t));
    score += (common.length / Math.max(v1.tags.length, v2.tags.length)) * 40;
  }
  if (v1.category === v2.category) score += 30;
  if (v1.title && v2.title) {
    const t1 = v1.title.toLowerCase().split(" ");
    const t2 = v2.title.toLowerCase().split(" ");
    const common = t1.filter(w => t2.includes(w));
    score += (common.length / Math.max(t1.length, t2.length)) * 15;
  }
  const pop = (v2.views || 0) + (v2.likes?.length || 0) * 10;
  score += Math.min(pop / 100, 15);
  return score;
}

// =======================
// MULTER SETUP (Unified for Chunks and Single Uploads) 🚀
// =======================
const chunkStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      // सभी फाइलें (चाहे चंक हो या सिंगल थंबनेल) temp_chunks में सहेजी जाएंगी
      cb(null, 'temp_chunks/');
    }, 
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname), 
});
const chunkUpload = multer({ storage: chunkStorage });


// सुनिश्चित करें कि temp_chunks और uploads फ़ोल्डर मौजूद हैं
if (!fsSync.existsSync('temp_chunks')) {
    fsSync.mkdirSync('temp_chunks');
}
if (!fsSync.existsSync('uploads')) {
    fsSync.mkdirSync('uploads');
}

// चंक्स को जोड़ने वाला मुख्य फ़ंक्शन
const reassembleChunks = async (uploadId, finalFilename, totalChunks, title, description, category, tags, thumbnailFilename, uploadedBy) => {
    const tempDir = path.join('temp_chunks', uploadId);
    const finalVideoPath = path.join('uploads', finalFilename);
    
    try {
        // 1. चंक्स को जोड़ें (Append) 
        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(tempDir, `${i}`);
            const chunkBuffer = await fs.readFile(chunkPath); 
            await fs.appendFile(finalVideoPath, chunkBuffer);
            await fs.unlink(chunkPath); // चंक को जोड़ने के बाद हटा दें
        }

        // 2. अस्थायी अपलोड फ़ोल्डर को हटा दें
        // ❌ FIX: fs.rmdir({ recursive: true }) के बजाय fs.rm का उपयोग करें 
        await fs.rm(tempDir, { recursive: true, force: true });
        
        // 3. डेटाबेस में वीडियो एंट्री बनाएं
        const tagArray = tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];
        
        const video = await Video.create({
            title,
            description: description || "",
            category: category || "Other",
            filename: finalFilename, 
            thumbnail: thumbnailFilename, 
            url: `/uploads/${finalFilename}`,
            uploadedBy: uploadedBy,
            tags: tagArray,
        });

        console.log(`Video assembled and saved: ${finalFilename}`);
        return video;

    } catch (error) {
        console.error("Error during chunk reassembly:", error);
        throw new Error("Failed to reassemble video file.");
    }
};


// =======================
// 1. UPLOAD VIDEO ROUTES (Replaced old /upload with chunking)
// =======================

// 📌 नया रूट: थंबनेल अपलोड के लिए (यह client को thumbnail filename देता है)
router.post("/upload/thumbnail", auth, chunkUpload.single("thumbnail"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Thumbnail file required" });
    
    const newFilename = Date.now() + "_" + req.file.originalname;
    // Multer ने फाइल को temp_chunks में सहेजा होगा, उसे uploads में ले जाएं
    await fs.rename(req.file.path, path.join("uploads", newFilename));

    res.json({ message: "Thumbnail uploaded successfully", filename: newFilename });
  } catch (error) {
    console.error("Thumbnail upload error:", error);
    res.status(500).json({ message: "Thumbnail upload failed" });
  }
});


// 📌 मुख्य चंक अपलोड हैंडलर
router.post("/upload/chunk", auth, chunkUpload.single('chunk'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No chunk file received." });
        }
        
        const { 
            chunkIndex, totalChunks, uploadId,
            title, description, category, tags, thumbnailFilename
        } = req.body;
        
        if (!chunkIndex || !totalChunks || !uploadId || !title || !thumbnailFilename) {
            return res.status(400).json({ message: "Missing required metadata." });
        }
        
        const chunkIndexInt = parseInt(chunkIndex);
        const totalChunksInt = parseInt(totalChunks);
        const tempDir = path.join('temp_chunks', uploadId);
        
        // अंतिम filename (वीडियो के लिए) uploadId से सुनिश्चित करें
        const finalFilename = `${uploadId}_${path.parse(req.file.originalname).name}${path.extname(req.file.originalname)}`;
        
        // अस्थायी फ़ोल्डर बनाएं
        if (!fsSync.existsSync(tempDir)) {
            await fs.mkdir(tempDir, { recursive: true });
        }

        // प्राप्त चंक को उसके इंडेक्स नाम से सहेजें
        const chunkSavePath = path.join(tempDir, `${chunkIndexInt}`);
        await fs.rename(req.file.path, chunkSavePath); 
        
        // यदि यह अंतिम चंक है, तो फ़ाइल को जोड़ें और डेटाबेस अपडेट करें
        if (chunkIndexInt === totalChunksInt - 1) {
            const video = await reassembleChunks(
                uploadId, finalFilename, totalChunksInt, 
                title, description, category, tags, thumbnailFilename, req.user.id
            );
            
            return res.json({ message: "Upload complete and file assembled.", video });
        }
        
        res.json({ message: `Chunk ${chunkIndexInt}/${totalChunksInt} received.`, uploadId, filename: finalFilename });

    } catch (err) {
        console.error("Chunk upload error:", err);
        // ❌ FIX: त्रुटि होने पर अस्थायी फ़ाइल हटा दें (ENOENT को नज़रअंदाज़ करें)
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (e) {
                if (e.code !== 'ENOENT') {
                    console.error("Failed to delete Multer temp file:", e);
                }
            }
        }
        res.status(500).json({ message: "Server error processing chunk.", error: err.message });
    }
});


// =======================
// 2. GET ALL VIDEOS (No Change)
// =======================
router.get("/all", async (req, res) => {
  try {
    const videos = await Video.find().populate("uploadedBy", "name").sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// =======================
// 3. GET BY CATEGORY (No Change)
// =======================
router.get("/category/:category", async (req, res) => {
  try {
    const videos = await Video.find({ category: req.params.category })
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// =======================
// 4. PERSONALIZED RECOMMENDED (HOME PAGE) (No Change)
// =======================
router.get("/recommended", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const allVideos = await Video.find().populate("uploadedBy", "name");

    if (!userId) {
      return res.json(allVideos.sort((a, b) => b.views - a.views).slice(0, 50));
    }

    const user = await User.findById(userId).populate({
      path: "watchHistory.video",
      populate: { path: "uploadedBy", select: "name" },
    });

    const watchHistory = user?.watchHistory?.map(h => h.video).filter(Boolean) || [];

    if (watchHistory.length === 0) {
      return res.json(allVideos.sort((a, b) => b.views - a.views).slice(0, 50));
    }

    const watchedCategories = new Set(watchHistory.map(v => v.category));
    const watchedTags = new Set();
    watchHistory.forEach(v => v.tags?.forEach(t => watchedTags.add(t)));
    const watchedChannels = new Set(watchHistory.map(v => v.uploadedBy?._id?.toString()));

    const scored = allVideos.map(video => {
      let score = 0;
      if (watchedCategories.has(video.category)) score += 30;
      const tagMatch = video.tags?.filter(t => watchedTags.has(t)).length || 0;
      score += Math.min(tagMatch * 5, 25);
      if (watchedChannels.has(video.uploadedBy?._id?.toString())) score += 20;
      score += Math.min((video.views || 0) / 1000 + (video.likes?.length || 0), 15);
      const daysOld = (Date.now() - new Date(video.createdAt)) / 86400000;
      if (daysOld < 7) score += 10;
      else if (daysOld < 30) score += 5;
      if (watchHistory.slice(0, 10).some(h => h._id.toString() === video._id.toString())) score -= 50;
      return { ...video.toObject(), score };
    });

    res.json(scored.sort((a, b) => b.score - a.score).slice(0, 50));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Recommendation failed" });
  }
});

// =======================
// 5. SIMILAR VIDEOS – MATRIX POWERED (0.02 sec!) (No Change)
// =======================
router.get("/similar/:filename", async (req, res) => {
  try {
    const current = await Video.findOne({ filename: req.params.filename }).lean();
    if (!current) return res.status(404).json({ message: "Video not found" });

    const matrixKey = current._id.toString();
    const similarFromMatrix = similarityMatrix[matrixKey];

    // Agar matrix mein hai → super fast
    if (similarFromMatrix && similarFromMatrix.length > 0) {
      const ids = similarFromMatrix.map(item => item.videoId);
      const videos = await Video.find({ _id: { $in: ids } })
        .populate("uploadedBy", "name")
        .lean();

      const ordered = ids
        .map(id => videos.find(v => v._id.toString() === id.toString()))
        .filter(Boolean);
      return res.json(ordered);
    }

    // Fallback (pehle wala method)
    const all = await Video.find({ filename: { $ne: current.filename } })
      .populate("uploadedBy", "name")
      .lean();

    const scored = all
      .map(v => ({ ...v, score: computeSimilarity(current, v) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json(scored);
  } catch (err) {
    console.error("Similar error:", err);
    res.status(500).json({ message: "Failed" });
  }
});

// =======================
// 6. LIKE (No Change)
// =======================
router.post("/like/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    video.dislikes = video.dislikes?.filter(d => d.toString() !== userId) || [];
    const liked = video.likes.includes(userId);
    if (liked) video.likes.pull(userId);
    else video.likes.push(userId);

    await video.save();
    await video.populate("uploadedBy", "name");
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Like failed" });
  }
});

// =======================
// 7. DISLIKE (No Change)
// =======================
router.post("/dislike/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    video.likes = video.likes?.filter(l => l.toString() !== userId) || [];
    const disliked = video.dislikes.includes(userId);
    if (disliked) video.dislikes.pull(userId);
    else video.dislikes.push(userId);

    await video.save();
    await video.populate("uploadedBy", "name");
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Dislike failed" });
  }
});

// =======================
// 8. VIEW COUNT (No Change)
// =======================
router.post("/view/:filename", async (req, res) => {
  try {
    const video = await Video.findOneAndUpdate(
      { filename: req.params.filename },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: "Not found" });
    res.json({ views: video.views });
  } catch (err) {
    res.status(500).json({ message: "View failed" });
  }
});

// =======================
// 9. GET VIDEO BY FILENAME (No Change)
// =======================
router.get("/by-filename/:filename", async (req, res) => {
  try {
    const video = await Video.findOne({ filename: req.params.filename })
      .populate("uploadedBy", "name");
    if (!video) return res.status(404).json({ message: "Not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ===========================
 UPDATE & DELETE ROUTES 
=========================== */
router.put("/update/:id", auth, async (req, res) => {
  try {
    const { title } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id, 
      { title }, 
      { new: true }
    );
    res.json({ message: "Updated", video });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// 📌 थंबनेल अपडेट रूट (अब chunkUpload का उपयोग करता है)
router.put("/:id", auth, chunkUpload.single("thumbnail"), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const update = { title, category, description };
    
    if (req.file) {
        // फाइल 'temp_chunks' में है, उसे 'uploads' में ले जाएँ
        const newFilename = Date.now() + "_" + req.file.originalname;
        await fs.rename(req.file.path, path.join("uploads", newFilename));
        update.thumbnail = newFilename;
    }

    await Video.findByIdAndUpdate(req.params.id, update);
    res.json({ message: "✅ Updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (video) {
        // पुरानी वीडियो फ़ाइल और थंबनेल को हटा दें
        await fs.unlink(path.join("uploads", video.filename)).catch(() => {});
        await fs.unlink(path.join("uploads", video.thumbnail)).catch(() => {});
    }
    res.json({ message: "🗑️ Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// 📌 वीडियो फाइल अपडेट करने वाला रूट (अब chunkUpload का उपयोग करता है)
router.put("/update-video/:id", auth, chunkUpload.single("video"), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });
    if (!req.file) return res.status(400).json({ message: "File required" });

    // पुरानी फ़ाइल हटाएँ
    try {
      const oldPath = path.join("uploads", video.filename);
      await fs.unlink(oldPath);
    } catch {}

    // नई फ़ाइल को 'uploads' में ले जाएँ
    const newFilename = Date.now() + "_" + req.file.originalname;
    await fs.rename(req.file.path, path.join("uploads", newFilename));
    
    video.filename = newFilename;
    video.url = `${req.protocol}://${req.get("host")}/uploads/${newFilename}`;
    video.size = req.file.size;
    await video.save();

    res.json({ message: "Video updated", video });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});
module.exports = router;