const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");
const auth = require("../middleware/auth");
const { Worker } = require("worker_threads");
const path = require("path");

// ==================== MULTER MEMORY STORAGE ====================
// Use memory storage to get file buffers, then upload to Cloudinary manually

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    }
});

// ==================== CAPTION WORKER FUNCTION ====================
function startCaptionWorker(video) {
    // Using Groq AI Whisper for cloud-based caption generation
    // Works in production (Vercel + Render) - no Python needed!
    const worker = new Worker(
        path.join(__dirname, "../workers/groqCaptionWorker.js"),
        {
            workerData: {
                videoId: video._id.toString(),
                filename: video.filename,
                videoUrl: video.videoUrl || video.url
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

// ==================== AI SUMMARY WORKER FUNCTION ====================
function startSummaryWorker(video) {
    const worker = new Worker(
        path.join(__dirname, "../workers/summaryWorker.js"),
        {
            workerData: {
                videoId: video._id.toString(),
                mongoUri: process.env.MONGO_URI
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

// ==================== CLOUDINARY VIDEO UPLOAD ROUTE ====================

router.post(
    "/cloudinary-upload",
    auth,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            console.log("🚀 Cloudinary upload started...");

            // Validate files
            if (!req.files || !req.files.video || !req.files.thumbnail) {
                return res.status(400).json({
                    message: "Both video and thumbnail files are required"
                });
            }

            const { title, description, category, tags } = req.body;

            // Validate required fields
            if (!title || !category) {
                return res.status(400).json({
                    message: "Title and category are required"
                });
            }

            const videoFile = req.files.video[0];
            const thumbnailFile = req.files.thumbnail[0];

            console.log("📤 Uploading video to Cloudinary...");
            console.log("   Video size:", (videoFile.size / (1024 * 1024)).toFixed(2), "MB");
            console.log("   Thumbnail size:", (thumbnailFile.size / 1024).toFixed(2), "KB");

            // Upload video to Cloudinary
            const videoUploadPromise = new Promise((resolve, reject) => {
                const videoId = `video_${Date.now()}_${videoFile.originalname.split('.')[0].replace(/\s+/g, '_')}`;
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "mytube/videos",
                        public_id: videoId,
                        chunk_size: 6000000, // 6MB chunks
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(videoFile.buffer);
            });

            // Upload thumbnail to Cloudinary
            const thumbnailUploadPromise = new Promise((resolve, reject) => {
                const thumbId = `thumb_${Date.now()}_${thumbnailFile.originalname.split('.')[0].replace(/\s+/g, '_')}`;
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: "mytube/thumbnails",
                        public_id: thumbId
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(thumbnailFile.buffer);
            });

            // Wait for both uploads to complete
            const [videoResult, thumbnailResult] = await Promise.all([
                videoUploadPromise,
                thumbnailUploadPromise
            ]);

            const videoUrl = videoResult.secure_url;
            const thumbnailUrl = thumbnailResult.secure_url;

            console.log("✅ Files uploaded to Cloudinary:");
            console.log("   Video:", videoUrl);
            console.log("   Thumbnail:", thumbnailUrl);

            // Create video document
            const video = await Video.create({
                title,
                description: description || "",
                category,
                tags: tags ? tags.split(",").map(t => t.trim()) : [],
                filename: videoResult.public_id.split('/').pop(), // Just the video ID without folder path
                videoUrl: videoUrl, // Cloudinary video URL
                thumbnail: thumbnailResult.public_id.split('/').pop(), // Just the thumbnail ID
                thumbnailUrl: thumbnailUrl, // Cloudinary thumbnail URL
                cloudinaryPublicId: videoResult.public_id, // Full Cloudinary public_id for operations
                cloudinaryThumbnailId: thumbnailResult.public_id, // Full thumbnail public_id
                url: videoUrl, // For backward compatibility
                uploadedBy: req.user.id,
                size: videoFile.size || 0,
                duration: videoResult.duration || 0,
                processing: false,
                processedAt: new Date(),
                captionsStatus: "pending",
                summaryStatus: "pending"
            });

            console.log("✅ Video saved to database:", video._id);

            // 🔥 START CAPTION WORKER
            console.log("🚀 Starting Caption Worker...");
            startCaptionWorker(video);

            res.json({
                success: true,
                message: "Video uploaded successfully to Cloudinary!",
                video: {
                    id: video._id,
                    title: video.title,
                    filename: video.filename,
                    videoUrl: video.videoUrl,
                    thumbnailUrl: video.thumbnailUrl,
                    category: video.category
                }
            });

        } catch (err) {
            console.error("❌ Cloudinary upload error:", err);
            res.status(500).json({
                message: "Upload failed",
                error: err.message
            });
        }
    }
);

module.exports = router;
