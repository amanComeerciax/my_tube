const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Video = require("../models/Video");
const auth = require("../middleware/auth");

// ==================== CLOUDINARY STORAGE CONFIGURATION ====================

// Video Storage
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "mytube/videos",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "avi", "mkv", "webm"],
        public_id: (req, file) => `video_${Date.now()}_${file.originalname.split('.')[0].replace(/\s+/g, '_')}`
    }
});

// Thumbnail Storage
const thumbnailStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "mytube/thumbnails",
        resource_type: "image",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id: (req, file) => `thumb_${Date.now()}_${file.originalname.split('.')[0].replace(/\s+/g, '_')}`
    }
});

// Multer Upload Configuration
const upload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    }
});

const uploadThumbnail = multer({
    storage: thumbnailStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

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

            // Get Cloudinary URLs
            const videoFile = req.files.video[0];
            const thumbnailFile = req.files.thumbnail[0];

            const videoUrl = videoFile.path; // Cloudinary URL
            const thumbnailUrl = thumbnailFile.path; // Cloudinary URL

            console.log("✅ Files uploaded to Cloudinary:");
            console.log("   Video:", videoUrl);
            console.log("   Thumbnail:", thumbnailUrl);

            // Create video document
            const video = await Video.create({
                title,
                description: description || "",
                category,
                tags: tags ? tags.split(",").map(t => t.trim()) : [],
                filename: videoFile.filename, // Cloudinary public_id
                videoUrl: videoUrl, // Cloudinary video URL
                thumbnail: thumbnailFile.filename, // Cloudinary thumbnail public_id
                thumbnailUrl: thumbnailUrl, // Cloudinary thumbnail URL
                url: videoUrl, // For backward compatibility
                uploadedBy: req.user.id,
                size: videoFile.size || 0,
                duration: videoFile.duration || 0,
                processing: false,
                processedAt: new Date()
            });

            console.log("✅ Video saved to database:", video._id);

            res.json({
                success: true,
                message: "Video uploaded successfully to Cloudinary!",
                video: {
                    id: video._id,
                    title: video.title,
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
