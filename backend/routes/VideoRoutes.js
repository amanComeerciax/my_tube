// const express = require("express");
// const router = express.Router();
// const { Worker } = require("worker_threads");

// // fs को promises API के साथ import करें (Async/Await के लिए)
// const fs = require("fs").promises; 
// const fsSync = require("fs"); // Synchronous version for simple checks (e.g., directory existence)
// const path = require("path");

// const multer = require("multer");
// const Video = require("../models/Video");
// const User = require("../models/User");
// const auth = require("../middleware/auth");
// const Ad = require("../models/Ad");


// // =======================
// // PRE-BUILT SIMILARITY MATRIX (SUPER FAST)
// // =======================
// let similarityMatrix = {};
// try {
//   similarityMatrix = require("../similarity-matrix.json");
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
// // MULTER SETUP (Unified for Chunks and Single Uploads) 🚀
// // =======================
// const chunkStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       // सभी फाइलें (चाहे चंक हो या सिंगल थंबनेल) temp_chunks में सहेजी जाएंगी
//       cb(null, 'temp_chunks/');
//     }, 
//     filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname), 
// });
// const chunkUpload = multer({ storage: chunkStorage });


// // सुनिश्चित करें कि temp_chunks और uploads फ़ोल्डर मौजूद हैं
// if (!fsSync.existsSync('temp_chunks')) {
//     fsSync.mkdirSync('temp_chunks');
// }
// if (!fsSync.existsSync('uploads')) {
//     fsSync.mkdirSync('uploads');
// }

// // 🎯 GET AD FOR VIDEO
// router.get("/ad/:videoId", async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.videoId);
//     if (!video) return res.json(null);

//     const ad = await Ad.findOne({
//       active: true,
//       $or: [
//         { target: "all" },
//         { target: "category", targetValue: video.category },
//         { target: "video", targetValue: video._id.toString() }
//       ]
//     }).sort({ createdAt: -1 });

//     if (!ad) return res.json(null);

//     res.json({
//       videoUrl: `http://localhost:5000/uploads/ads/${ad.videoFile}`,
//       skipAfter: ad.skipAfter,
//       adId: ad._id
//     });

//   } catch {
//     res.json(null);
//   }
// });


// // चंक्स को जोड़ने वाला मुख्य फ़ंक्शन
// const reassembleChunks = async (uploadId, finalFilename, totalChunks, title, description, category, tags, thumbnailFilename, uploadedBy) => {
//     const tempDir = path.join('temp_chunks', uploadId);
//     const finalVideoPath = path.join('uploads', finalFilename);

//     try {
//         // 1. चंक्स को जोड़ें (Append) 
//         for (let i = 0; i < totalChunks; i++) {
//             const chunkPath = path.join(tempDir, `${i}`);
//             const chunkBuffer = await fs.readFile(chunkPath); 
//             await fs.appendFile(finalVideoPath, chunkBuffer);
//             await fs.unlink(chunkPath); // चंक को जोड़ने के बाद हटा दें
//         }

//         // 2. अस्थायी अपलोड फ़ोल्डर को हटा दें
//         // ❌ FIX: fs.rmdir({ recursive: true }) के बजाय fs.rm का उपयोग करें 
//         await fs.rm(tempDir, { recursive: true, force: true });

//         // 3. डेटाबेस में वीडियो एंट्री बनाएं
//         const tagArray = tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

//         // const video = await Video.create({
//         //     title,
//         //     description: description || "",
//         //     category: category || "Other",
//         //     filename: finalFilename, 
//         //     thumbnail: thumbnailFilename, 
//         //     url: `/uploads/${finalFilename}`,
//         //     uploadedBy: uploadedBy,
//         //     tags: tagArray,
//         // });

//         // ⏱️ duration & 📐 aspect ratio frontend se nahi aa rahe
// // abhi simple logic use karte hain (safe start)

// const isShort = true; // 👈 TEMP (next step me auto banayenge)

// const video = await Video.create({
//   title,
//   description: description || "",
//   category: category || "Other",
//   filename: finalFilename,
//   thumbnail: thumbnailFilename,
//   url: `/uploads/${finalFilename}`,
//   uploadedBy,
//   tags: tagArray,

//   // 🔥 SHORTS FIELDS
//   isShort,
//   aspectRatio: "9:16",
//   duration: 60 // abhi dummy, next step me real
// });

//         console.log(`Video assembled and saved: ${finalFilename}`);
//         return video;

//     } catch (error) {
//         console.error("Error during chunk reassembly:", error);
//         throw new Error("Failed to reassemble video file.");
//     }
// };

// // Video Processing With Multithreding 

// // function startVideoProcessingWorker(video) {
// //   const worker = new Worker(
// //     path.join(__dirname, "../workers/videoWorker.js")
// //   );

// //   worker.postMessage({
// //     videoId: video._id.toString(),
// //     filename: video.filename,
// //     thumbnail: video.thumbnail
// //   });

// //   worker.on("message", async (msg) => {
// //     console.log("✅ Worker finished:", msg);

// //     // Optional: processing done flag
// //     if (msg.success) {
// //       await Video.findByIdAndUpdate(video._id, {
// //         processing: false,
// //         processedAt: new Date()
// //       });
// //     }
// //   });

// //   worker.on("error", (err) => {
// //     console.error("❌ Worker error:", err);
// //   });
// // }



// function startVideoProcessingWorker(video) {
//   const worker = new Worker(
//     path.join(__dirname, "../workers/videoWorker.js"),
//     {
//       workerData: {
//         videoId: video._id.toString(),
//         filename: video.filename,
//         thumbnail: video.thumbnail
//       }
//     }
//   );

//   worker.on("message", async (msg) => {
//     console.log("🎬 Video Worker:", msg);

//     if (msg.success) {
//       await Video.findByIdAndUpdate(video._id, {
//         processing: false,
//         processedAt: new Date()
//       });
//     }
//   });

//   worker.on("error", (err) => {
//     console.error("❌ Video worker error:", err);
//   });
// }



// // function startCaptionWorker(video) {

// function startCaptionWorker(video) {
//   const worker = new Worker(
//     path.join(__dirname, "../workers/captionWorker.js"),
//     {
//       workerData: {
//         videoId: video._id.toString(),
//         filename: video.filename
//       }
//     }
//   );

//   worker.on("message", async (msg) => {
//     console.log("📝 Caption Worker:", msg);



//     if (msg.success && msg.captionFile) {
//       await Video.findByIdAndUpdate(video._id, {
//         captions: msg.captionFile,
//         captionsStatus: "ready"
//       });
//     }

//     if (msg.reason === "no-audio") {
//       await Video.findByIdAndUpdate(video._id, {
//         captionsStatus: "no-audio"
//       });
//     }
//   });

//   worker.on("error", (err) => {
//     console.error("❌ Caption worker error:", err);
//   });
// }


// // Thumbnail Upload Route
// router.post("/upload/thumbnail", auth, chunkUpload.single("thumbnail"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "File required" });

//     // 🔹 filename logic
//     const thumbFilename = "thumb_" + Date.now() + "_" + req.file.originalname;

//     // 🔹 Move from temp to uploads
//     const destinationPath = path.join(process.cwd(), "uploads", thumbFilename);
//     await fs.rename(req.file.path, destinationPath);

//     res.json({ 
//       message: "✅ Thumbnail Uploaded", 
//       filename: thumbFilename // Yahi filename 'UserUpload' ke step 2 mein jayega
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Upload failed" });
//   }
// });


// // 📌 मुख्य चंक अपलोड हैंडलर
// router.post("/upload/chunk", auth, chunkUpload.single('chunk'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No chunk file received." });
//         }

//         const { 
//             chunkIndex, totalChunks, uploadId,
//             title, description, category, tags, thumbnailFilename
//         } = req.body;

//         // if (!chunkIndex || !totalChunks || !uploadId || !title || !thumbnailFilename) {
//         //     return res.status(400).json({ message: "Missing required metadata." });
//         // }
//         if (
//           chunkIndex === undefined ||
//           totalChunks === undefined ||
//           !uploadId ||
//           !title ||
//           !thumbnailFilename
//         ) {
//           return res.status(400).json({ message: "Missing required metadata." });
//         }

//         const chunkIndexInt = parseInt(chunkIndex);
//         const totalChunksInt = parseInt(totalChunks);
//         const tempDir = path.join('temp_chunks', uploadId);

//         // अंतिम filename (वीडियो के लिए) uploadId से सुनिश्चित करें
//         const finalFilename = `${uploadId}_${path.parse(req.file.originalname).name}${path.extname(req.file.originalname)}`;

//         // अस्थायी फ़ोल्डर बनाएं
//         if (!fsSync.existsSync(tempDir)) {
//             await fs.mkdir(tempDir, { recursive: true });
//         }

//         // प्राप्त चंक को उसके इंडेक्स नाम से सहेजें
//         const chunkSavePath = path.join(tempDir, `${chunkIndexInt}`);
//         await fs.rename(req.file.path, chunkSavePath); 

//         // यदि यह अंतिम चंक है, तो फ़ाइल को जोड़ें और डेटाबेस अपडेट करें
//         // if (chunkIndexInt === totalChunksInt - 1) {
//         //     const video = await reassembleChunks(
//         //         uploadId, finalFilename, totalChunksInt, 
//         //         title, description, category, tags, thumbnailFilename, req.user.id
//         //     );

//         //     return res.json({ message: "Upload complete and file assembled.", video });
//         // }
//         if (chunkIndexInt === totalChunksInt - 1) {
//           const video = await reassembleChunks(
//             uploadId,
//             finalFilename,
//             totalChunksInt,
//             title,
//             description,
//             category,
//             tags,
//             thumbnailFilename,
//             req.user.id
//           );

//           // 🧠 START MULTITHREADING HERE
//           startVideoProcessingWorker(video);

//           startCaptionWorker(video);
// //           if (msg.success && msg.captionFile) {
// //   await Video.findByIdAndUpdate(video._id, {
// //     captions: msg.captionFile,
// //     captionsStatus: "ready",
// //     summaryStatus: "pending"
// //   });

// //   // 🔥 START AI SUMMARY WORKER
// //   new Worker(
// //     path.join(__dirname, "../workers/summaryWorker.js"),
// //     {
// //       workerData: { videoId: video._id.toString() }
// //     }
// //   );
// // }


//           return res.json({
//             message: "Upload complete. Video processing started in background.",
//             video
//           });
//         }


//         res.json({ message: `Chunk ${chunkIndexInt}/${totalChunksInt} received.`, uploadId, filename: finalFilename });

//     } catch (err) {
//         console.error("Chunk upload error:", err);
//         // ❌ FIX: त्रुटि होने पर अस्थायी फ़ाइल हटा दें (ENOENT को नज़रअंदाज़ करें)
//         if (req.file && req.file.path) {
//             try {
//                 await fs.unlink(req.file.path);
//             } catch (e) {
//                 if (e.code !== 'ENOENT') {
//                     console.error("Failed to delete Multer temp file:", e);
//                 }
//             }
//         }
//         res.status(500).json({ message: "Server error processing chunk.", error: err.message });
//     }
// });


// // =======================
// // 2. GET ALL VIDEOS (No Change)
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
// // 3. GET BY CATEGORY (No Change)
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
// // 4. PERSONALIZED RECOMMENDED (HOME PAGE) (No Change)
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
// // 🔥 GET SHORTS FEED
// // =======================
// router.get("/shorts", async (req, res) => {
//   try {
//     const shorts = await Video.find({ isShort: true })
//       .populate("uploadedBy", "name")
//       .sort({ createdAt: -1 })
//       .limit(50);

//     res.json(shorts);
//   } catch (err) {
//     console.error("Shorts fetch error:", err);
//     res.status(500).json({ message: "Failed to fetch shorts" });
//   }
// });


// // =======================
// // 5. SIMILAR VIDEOS – MATRIX POWERED (0.02 sec!) (No Change)
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



// router.post(
//   "/upload-short",
//   auth,
//   chunkUpload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const videoFile = req.files?.video?.[0];
//       const thumbFile = req.files?.thumbnail?.[0];

//       if (!videoFile || !thumbFile) {
//         return res.status(400).json({
//           message: "Video and thumbnail are required",
//         });
//       }

//       // 🔹 filenames
//       const videoFilename = Date.now() + "_" + videoFile.originalname;
//       const thumbFilename = Date.now() + "_" + thumbFile.originalname;

//       // 🔹 move files to uploads
//       await fs.rename(videoFile.path, path.join("uploads", videoFilename));
//       await fs.rename(thumbFile.path, path.join("uploads", thumbFilename));

//       // 🔹 tags parsing
//       const tags = req.body.tags
//         ? req.body.tags
//             .split(",")
//             .map((t) => t.trim().toLowerCase())
//             .filter(Boolean)
//         : [];

//       // 🔥 CREATE SHORT VIDEO
//       const video = await Video.create({
//         title: req.body.title,
//         description: req.body.description || "",

//         filename: videoFilename,
//         thumbnail: thumbFilename,
//         url: `/uploads/${videoFilename}`,
//         size: videoFile.size,

//         uploadedBy: req.user.id,

//         // ✅ IMPORTANT FIX
//         category: "Other", // enum-safe

//         tags,

//         // 🔥 SHORT FLAGS
//         isShort: true,
//         aspectRatio: "9:16",
//         duration: 0, // later auto-detect
//       });

//       // optional background workers
//       startVideoProcessingWorker(video);
//       startCaptionWorker(video);

//       res.json({
//         message: "✅ Short uploaded successfully",
//         video,
//       });
//     } catch (err) {
//       console.error("❌ upload-short error:", err);
//       res.status(500).json({
//         message: "Short upload failed",
//       });
//     }
//   }
// );


// router.get("/stream/:filename", async (req, res) => {
//   const { filename } = req.params;
//   const { q } = req.query;

//   console.log(`\n--- Quality Request ---`);
//   console.log(`Original: ${filename} | Q: ${q}`);

//   try {
//     // process.cwd() hamesha project ke root (backend/) folder ko point karta hai
//     const uploadsDir = path.join(process.cwd(), "uploads");
//     let finalPath = path.join(uploadsDir, filename);

//     if (q && q !== 'auto' && q !== 'original') {
//       const parsed = path.parse(filename);
//       // Exact same logic as your worker
//       const cleanName = parsed.name.replace(/[^a-z0-9]/gi, '_');
//       const qualityFileName = `${q}_${cleanName}.mp4`;
//       const qualityPath = path.join(uploadsDir, qualityFileName);

//       console.log(`🔍 Searching for: ${qualityFileName}`);

//       if (fsSync.existsSync(qualityPath)) {
//         finalPath = qualityPath;
//         console.log(`✅ MATCH FOUND: Serving ${q}`);
//       } else {
//         console.log(`❌ NOT FOUND: File missing in folder. Serving original.`);
//       }
//     }

//     const stat = await fs.stat(finalPath);
//     const fileSize = stat.size;
//     const range = req.headers.range;

//     if (range) {
//       const parts = range.replace(/bytes=/, "").split("-");
//       const start = parseInt(parts[0], 10);
//       const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//       const chunksize = (end - start) + 1;
//       const file = fsSync.createReadStream(finalPath, { start, end });

//       res.writeHead(206, {
//         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//         'Accept-Ranges': 'bytes',
//         'Content-Length': chunksize,
//         'Content-Type': 'video/mp4',
//       });
//       file.pipe(res);
//     } else {
//       res.writeHead(200, {
//         'Content-Length': fileSize,
//         'Content-Type': 'video/mp4',
//       });
//       fsSync.createReadStream(finalPath).pipe(res);
//     }
//   } catch (err) {
//     console.error("🔥 Stream Error:", err.message);
//     res.status(500).send("Streaming error");
//   }
// });

// // =======================
// // 6. LIKE (No Change)
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
// // 7. DISLIKE (No Change)
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


// // 📑 Get all videos liked by the current user
// router.get("/liked-videos", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Aise videos dhoondo jahan likes array mein userId ho
//     const likedVideos = await Video.find({
//       likes: userId 
//     }).populate("uploadedBy", "name avatar"); // Creator details bhi le aao

//     res.json(likedVideos);
//   } catch (err) {
//     console.error("❌ Fetch Liked Videos Error:", err);
//     res.status(500).json({ message: "Error fetching liked videos" });
//   }
// });

// // =======================
// // 8. VIEW COUNT (No Change)
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
// // 9. GET VIDEO BY FILENAME (No Change)
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




// // 📌 थंबनेल अपडेट रूट (अब chunkUpload का उपयोग करता है)
// router.put("/:id", auth, chunkUpload.single("thumbnail"), async (req, res) => {
//   try {
//     const { title, category, description } = req.body;
//     const update = { title, category, description };

//     if (req.file) {
//         // फाइल 'temp_chunks' में है, उसे 'uploads' में ले जाएँ
//         const newFilename = Date.now() + "_" + req.file.originalname;
//         await fs.rename(req.file.path, path.join("uploads", newFilename));
//         update.thumbnail = newFilename;
//     }

//     await Video.findByIdAndUpdate(req.params.id, update);
//     res.json({ message: "✅ Updated" });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const video = await Video.findByIdAndDelete(req.params.id);
//     if (video) {
//         // पुरानी वीडियो फ़ाइल और थंबनेल को हटा दें
//         await fs.unlink(path.join("uploads", video.filename)).catch(() => {});
//         await fs.unlink(path.join("uploads", video.thumbnail)).catch(() => {});
//     }
//     res.json({ message: "🗑️ Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });



// // 📌 वीडियो फाइल अपडेट करने वाला रूट (अब chunkUpload का उपयोग करता है)
// router.put("/update-video/:id", auth, chunkUpload.single("video"), async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: "Not found" });
//     if (!req.file) return res.status(400).json({ message: "File required" });

//     // पुरानी फ़ाइल हटाएँ
//     try {
//       const oldPath = path.join("uploads", video.filename);
//       await fs.unlink(oldPath);
//     } catch {}

//     // नई फ़ाइल को 'uploads' में ले जाएँ
//     const newFilename = Date.now() + "_" + req.file.originalname;
//     await fs.rename(req.file.path, path.join("uploads", newFilename));

//     video.filename = newFilename;
//     video.url = `${req.protocol}://${req.get("host")}/uploads/${newFilename}`;
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
const { Worker } = require("worker_threads");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const multer = require("multer");
const Video = require("../models/Video");
const User = require("../models/User");
const auth = require("../middleware/auth");
const Ad = require("../models/Ad");
const Notification = require("../models/Notification");

const BASE_URL = require("../utils/baseUrl");



// PRE-BUILT SIMILARITY MATRIX
let similarityMatrix = {};
try {
  similarityMatrix = require("../similarity-matrix.json");
  console.log(`Similarity Matrix loaded with ${Object.keys(similarityMatrix).length} videos`);
} catch (err) {
  console.log("Warning: similarity-matrix.json not found → using fallback similarity");
}

// OLD SIMILARITY FUNCTION (fallback)
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

// MULTER SETUP
const chunkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp_chunks/');
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
// const chunkUpload = multer({ storage: chunkStorage });
const chunkUpload = multer({
  storage: chunkStorage,
  limits: { fileSize: 1024 * 1024 * 100 } // 100MB per chunk
});


// Ensure directories exist
if (!fsSync.existsSync('temp_chunks')) {
  fsSync.mkdirSync('temp_chunks');
}
if (!fsSync.existsSync('uploads')) {
  fsSync.mkdirSync('uploads');
}

// 🎯 GET AD FOR VIDEO
router.get("/ad/:videoId", async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.json(null);

    const ad = await Ad.findOne({
      active: true,
      $or: [
        { target: "all" },
        { target: "category", targetValue: video.category },
        { target: "video", targetValue: video._id.toString() }
      ]
    }).sort({ createdAt: -1 });

    if (!ad) return res.json(null);

    res.json({
      // videoUrl: `http://localhost:5000/uploads/ads/${ad.videoFile}`,
      videoUrl: `${BASE_URL}/uploads/ads/${ad.videoFile}`,

      skipAfter: ad.skipAfter,
      adId: ad._id
    });

  } catch {
    res.json(null);
  }
});

// Reassemble chunks function
const reassembleChunks = async (uploadId, finalFilename, totalChunks, title, description, category, tags, thumbnailFilename, uploadedBy) => {
  const tempDir = path.join('temp_chunks', uploadId);
  const finalVideoPath = path.join('uploads', finalFilename);

  try {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(tempDir, `${i}`);
      const chunkBuffer = await fs.readFile(chunkPath);
      await fs.appendFile(finalVideoPath, chunkBuffer);
      await fs.unlink(chunkPath);
    }

    await fs.rm(tempDir, { recursive: true, force: true });

    const tagArray = tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

    const isShort = false;

    const video = await Video.create({
      title,
      description: description || "",
      category: category || "Other",
      filename: finalFilename,
      thumbnail: thumbnailFilename,
      url: `/uploads/${finalFilename}`,
      uploadedBy,
      tags: tagArray,
      isShort,
      aspectRatio: "9:16",
      duration: 60,
      captionsStatus: "pending",
      summaryStatus: "pending"
    });




    // 🔔 NOTIFY SUBSCRIBERS ABOUT NEW VIDEO
    const uploader = await User.findById(uploadedBy).select("subscribers name");

    if (uploader?.subscribers?.length > 0) {
      const notifications = uploader.subscribers
        .filter(subId => subId.toString() !== uploadedBy.toString()) // self notify avoid
        .map(subscriberId => ({
          user: subscriberId,          // receiver (subscriber)
          sender: uploadedBy,           // channel owner
          type: "new_video",
          video: video._id,
          message: `${uploader.name} uploaded a new video`
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }


    console.log(`Video assembled and saved: ${finalFilename}`);
    return video;

  } catch (error) {
    console.error("Error during chunk reassembly:", error);
    throw new Error("Failed to reassemble video file.");
  }
};

// VIDEO PROCESSING WORKER
function startVideoProcessingWorker(video) {
  const worker = new Worker(
    path.join(__dirname, "../workers/videoWorker.js"),
    {
      workerData: {
        videoId: video._id.toString(),
        filename: video.filename,
        thumbnail: video.thumbnail
      }
    }
  );

  worker.on("message", async (msg) => {
    console.log("🎬 Video Worker:", msg);

    if (msg.success) {
      await Video.findByIdAndUpdate(video._id, {
        processing: false,
        processedAt: new Date()
      });
    }
  });

  worker.on("error", (err) => {
    console.error("❌ Video worker error:", err);
  });
}

// CAPTION WORKER (with AI summary trigger)
function startCaptionWorker(video) {
  const worker = new Worker(
    path.join(__dirname, "../workers/captionWorker.js"),
    {
      workerData: {
        videoId: video._id.toString(),
        filename: video.filename
      }
    }
  );

  worker.on("message", async (msg) => {
    console.log("📝 Caption Worker:", msg);

    if (msg.success && msg.captionFile) {
      await Video.findByIdAndUpdate(video._id, {
        captions: msg.captionFile,
        captionsStatus: "ready",
        summaryStatus: "pending"
      });

      // 🔥 START AI SUMMARY WORKER
      console.log("🚀 Starting AI Summary Worker...");
      startSummaryWorker(video);
    }

    if (msg.reason === "no-audio") {
      await Video.findByIdAndUpdate(video._id, {
        captionsStatus: "no-audio",
        summaryStatus: "not-available"
      });
    }
  });

  worker.on("error", (err) => {
    console.error("❌ Caption worker error:", err);
  });
}

// 🤖 AI SUMMARY WORKER - FIXED VERSION
function startSummaryWorker(video) {
  // 🔥 Get MongoDB URI from environment or use default
  const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mytube";

  const worker = new Worker(
    path.join(__dirname, "../workers/summaryWorker.js"),
    {
      workerData: {
        videoId: video._id.toString(),
        mongoUri: process.env.MONGO_URI  // 🔥 Pass MongoDB URI to worker
      }
    }
  );

  worker.on("message", async (msg) => {
    console.log("🤖 AI Summary Worker:", msg);

    if (msg.success) {
      console.log(`✅ AI Summary generated for video: ${video._id}`);
    } else {
      console.log(`⚠️ AI Summary failed: ${msg.reason || msg.error}`);
      await Video.findByIdAndUpdate(video._id, {
        summaryStatus: "failed"
      });
    }
  });

  worker.on("error", (err) => {
    console.error("❌ AI Summary worker error:", err);
  });
}

// Thumbnail Upload Route
router.post("/upload/thumbnail", auth, chunkUpload.single("thumbnail"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File required" });

    const thumbFilename = "thumb_" + Date.now() + "_" + req.file.originalname;
    const destinationPath = path.join(process.cwd(), "uploads", thumbFilename);
    await fs.rename(req.file.path, destinationPath);

    res.json({
      message: "✅ Thumbnail Uploaded",
      filename: thumbFilename
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// Chunk Upload Handler
router.post("/upload/chunk", auth, chunkUpload.single('chunk'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No chunk file received." });
    }

    const {
      chunkIndex, totalChunks, uploadId,
      title, description, category, tags, thumbnailFilename
    } = req.body;

    if (
      chunkIndex === undefined ||
      totalChunks === undefined ||
      !uploadId ||
      !title ||
      !thumbnailFilename
    ) {
      return res.status(400).json({ message: "Missing required metadata." });
    }

    const chunkIndexInt = parseInt(chunkIndex);
    const totalChunksInt = parseInt(totalChunks);
    const tempDir = path.join('temp_chunks', uploadId);

    const finalFilename = `${uploadId}_${path.parse(req.file.originalname).name}${path.extname(req.file.originalname)}`;

    if (!fsSync.existsSync(tempDir)) {
      await fs.mkdir(tempDir, { recursive: true });
    }

    const chunkSavePath = path.join(tempDir, `${chunkIndexInt}`);
    await fs.rename(req.file.path, chunkSavePath);

    if (chunkIndexInt === totalChunksInt - 1) {
      const video = await reassembleChunks(
        uploadId,
        finalFilename,
        totalChunksInt,
        title,
        description,
        category,
        tags,
        thumbnailFilename,
        req.user.id
      );

      // 🧠 START MULTITHREADING
      startVideoProcessingWorker(video);
      startCaptionWorker(video);

      return res.json({
        message: "Upload complete. Video processing started in background.",
        video
      });
    }

    res.json({
      message: `Chunk ${chunkIndexInt}/${totalChunksInt} received.`,
      uploadId,
      filename: finalFilename
    });

  } catch (err) {
    console.error("Chunk upload error:", err);
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

// GET ALL VIDEOS
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Default 20 videos
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .populate("uploadedBy", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments();

    res.json({
      videos,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + videos.length < total,
      total
    });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// GET BY CATEGORY
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

// PERSONALIZED RECOMMENDED
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

// GET SHORTS FEED
router.get("/shorts", async (req, res) => {
  try {
    const shorts = await Video.find({ isShort: true })
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(shorts);
  } catch (err) {
    console.error("Shorts fetch error:", err);
    res.status(500).json({ message: "Failed to fetch shorts" });
  }
});

// SIMILAR VIDEOS – MATRIX POWERED
router.get("/similar/:filename", async (req, res) => {
  try {
    const current = await Video.findOne({ filename: req.params.filename }).lean();
    if (!current) return res.status(404).json({ message: "Video not found" });

    const matrixKey = current._id.toString();
    const similarFromMatrix = similarityMatrix[matrixKey];

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

// UPLOAD SHORT
router.post(
  "/upload-short",
  auth,
  chunkUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const videoFile = req.files?.video?.[0];
      const thumbFile = req.files?.thumbnail?.[0];

      if (!videoFile || !thumbFile) {
        return res.status(400).json({
          message: "Video and thumbnail are required",
        });
      }

      const videoFilename = Date.now() + "_" + videoFile.originalname;
      const thumbFilename = Date.now() + "_" + thumbFile.originalname;

      await fs.rename(videoFile.path, path.join("uploads", videoFilename));
      await fs.rename(thumbFile.path, path.join("uploads", thumbFilename));

      const tags = req.body.tags
        ? req.body.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
        : [];

      const video = await Video.create({
        title: req.body.title,
        description: req.body.description || "",
        filename: videoFilename,
        thumbnail: thumbFilename,
        url: `/uploads/${videoFilename}`,
        size: videoFile.size,
        uploadedBy: req.user.id,
        category: "Other",
        tags,
        isShort: true,
        aspectRatio: "9:16",
        duration: 0,
        captionsStatus: "pending",
        summaryStatus: "pending"
      });

      startVideoProcessingWorker(video);
      startCaptionWorker(video);

      res.json({
        message: "✅ Short uploaded successfully",
        video,
      });
    } catch (err) {
      console.error("❌ upload-short error:", err);
      res.status(500).json({
        message: "Short upload failed",
      });
    }
  }
);



// STREAM VIDEO
router.get("/stream/:filename", async (req, res) => {
  const { filename } = req.params;
  const { q } = req.query;

  console.log(`\n--- Quality Request ---`);
  console.log(`Original: ${filename} | Q: ${q}`);

  try {
    const uploadsDir = path.join(process.cwd(), "uploads");
    let finalPath = path.join(uploadsDir, filename);

    if (q && q !== 'auto' && q !== 'original') {
      const parsed = path.parse(filename);
      const cleanName = parsed.name.replace(/[^a-z0-9]/gi, '_');
      const qualityFileName = `${q}_${cleanName}.mp4`;
      const qualityPath = path.join(uploadsDir, qualityFileName);

      console.log(`🔍 Searching for: ${qualityFileName}`);

      if (fsSync.existsSync(qualityPath)) {
        finalPath = qualityPath;
        console.log(`✅ MATCH FOUND: Serving ${q}`);
      } else {
        console.log(`❌ NOT FOUND: File missing in folder. Serving original.`);
      }
    }

    const stat = await fs.stat(finalPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fsSync.createReadStream(finalPath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      fsSync.createReadStream(finalPath).pipe(res);
    }
  } catch (err) {
    console.error("🔥 Stream Error:", err.message);
    res.status(500).send("Streaming error");
  }
});

// LIKE
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


router.post("/like/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("uploadedBy", "name _id");
    if (!video) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    video.dislikes = video.dislikes?.filter(d => d.toString() !== userId) || [];
    const liked = video.likes.includes(userId);

    if (liked) {
      // Unlike
      video.likes.pull(userId);
    } else {
      // Like
      video.likes.push(userId);

      // 🔔 CREATE NOTIFICATION FOR VIDEO OWNER
      if (video.uploadedBy._id.toString() !== userId) {
        try {
          const liker = await User.findById(userId).select("name");
          await Notification.create({
            user: video.uploadedBy._id,
            sender: userId,
            type: "like",
            video: video._id,
            message: `${liker.name} liked your video`,
            isRead: false
          });
          console.log("✅ Like notification sent");
        } catch (notifErr) {
          console.error("⚠️ Like notification failed:", notifErr);
        }
      }
    }

    await video.save();
    res.json(video);
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Like failed" });
  }
});



// DISLIKE
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

// GET LIKED VIDEOS
router.get("/liked-videos", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const likedVideos = await Video.find({
      likes: userId
    }).populate("uploadedBy", "name avatar");

    res.json(likedVideos);
  } catch (err) {
    console.error("❌ Fetch Liked Videos Error:", err);
    res.status(500).json({ message: "Error fetching liked videos" });
  }
});

// VIEW COUNT
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

// GET VIDEO BY FILENAME
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

// UPDATE & DELETE ROUTES
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

router.put("/:id", auth, chunkUpload.single("thumbnail"), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const update = { title, category, description };

    if (req.file) {
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
      await fs.unlink(path.join("uploads", video.filename)).catch(() => { });
      await fs.unlink(path.join("uploads", video.thumbnail)).catch(() => { });
    }
    res.json({ message: "🗑️ Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

router.put("/update-video/:id", auth, chunkUpload.single("video"), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });
    if (!req.file) return res.status(400).json({ message: "File required" });

    try {
      const oldPath = path.join("uploads", video.filename);
      await fs.unlink(oldPath);
    } catch { }

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