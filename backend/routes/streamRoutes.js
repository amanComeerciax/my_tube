const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const Video = require("../models/Video");

const router = express.Router();

// GET /api/stream/:filename
router.get("/:filename", async (req, res) => {
  const { filename } = req.params;
  const { q } = req.query; // Quality parameter: 480p, 720p

  console.log(`🚀 Stream Request: ${filename} | Quality: ${q || 'Original'}`);

  try {
    // ✅ CHECK FOR CLOUDINARY VIDEO FIRST
    const video = await Video.findOne({ filename });

    if (video && video.videoUrl) {
      console.log("☁️ Cloudinary video found:", filename);
      console.log("🔗 Redirecting to Cloudinary URL:", video.videoUrl);

      // Use 307 Temporary Redirect to preserve method and body
      // This ensures browser can properly handle the video stream
      return res.status(307).location(video.videoUrl).end();
    }

    console.log("📁 No Cloudinary URL found, falling back to local storage for:", filename);

    // process.cwd() backend ke root (main) folder ka path deta hai
    const uploadsDir = path.join(process.cwd(), "uploads");
    let videoPath = path.join(uploadsDir, filename);

    // 1. Check if exact file exists
    if (!fs.existsSync(videoPath)) {
      // 2. Try adding .mp4 extension
      if (fs.existsSync(videoPath + ".mp4")) {
        videoPath += ".mp4";
      } else {
        return res.status(404).send("Video not found");
      }
    }

    // Quality logic: Agar q parameter hai toh sahi file dhundo
    if (q && q !== 'auto' && q !== 'original') {
      const parsed = path.parse(filename);
      // Worker logic: dash (-) ko underscore (_) banana
      const cleanName = parsed.name.replace(/[^a-z0-9]/gi, '_');
      const qualityFileName = `${q}_${cleanName}.mp4`; // FFmpeg hamesha .mp4 banata hai
      const qualityPath = path.join(uploadsDir, qualityFileName);

      console.log(`🔍 Searching for quality file: ${qualityFileName}`);

      if (fs.existsSync(qualityPath)) {
        videoPath = qualityPath;
        console.log("✅ MATCH FOUND: Serving quality file.");
      } else {
        console.log("❌ NOT FOUND: File missing, playing original.");
      }
    }

    // Check if final video path exists (Double check)
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send("Video not found");
    }

    const stat = await fsPromises.stat(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      // Bina range ke puri file bhej do (Initial load)
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      return fs.createReadStream(videoPath).pipe(res);
    }

    // --- Range Handling for Streaming ---
    const CHUNK_SIZE = 10 ** 6; // 1MB chunk

    // Parse range header properly (handles "bytes=start-end" format)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const requestedEnd = parts[1] ? parseInt(parts[1], 10) : undefined;

    // ✅ VALIDATION: Ensure start is within file bounds
    if (isNaN(start) || start < 0 || start >= fileSize) {
      console.log(`⚠️ Invalid range: start (${start}) out of bounds for fileSize (${fileSize})`);
      return res.status(416).send("Requested range not satisfiable");
    }

    // Calculate end position
    const end = requestedEnd !== undefined
      ? Math.min(requestedEnd, fileSize - 1)
      : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

    // ✅ VALIDATION: Ensure end >= start
    if (end < start) {
      console.log(`⚠️ Invalid range: end (${end}) < start (${start})`);
      return res.status(416).send("Requested range not satisfiable");
    }

    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    console.log(`📦 Streaming range: ${start}-${end}/${fileSize}`);

    res.writeHead(206, headers); // 206 Partial Content

    const stream = fs.createReadStream(videoPath, { start, end });

    // ✅ Handle stream errors to prevent "headers already sent" errors
    stream.on('error', (streamErr) => {
      console.error("📁 Stream read error:", streamErr.message);
      if (!res.headersSent) {
        res.status(500).send("Stream error");
      }
    });

    stream.pipe(res);

  } catch (err) {
    console.error("🔥 Stream Error:", err.message);
    // ✅ Only send error response if headers not already sent
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = router;