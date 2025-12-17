// const express = require("express");
// const fs = require("fs");
// const path = require("path");

// const router = express.Router();

// // GET /api/stream/:filename
// router.get("/:filename", (req, res) => {
//   const fileName = req.params.filename;
//   const videoPath = path.join(__dirname, "..", "uploads", fileName);

//   // Check if file exists
//   if (!fs.existsSync(videoPath)) {
//     return res.status(404).send("Video not found");
//   }

//   const stat = fs.statSync(videoPath);
//   const fileSize = stat.size;
//   const range = req.headers.range;

//   if (!range) {
//     return res.status(416).send("Requires Range header");
//   }

//   const CHUNK_SIZE = 10 ** 6; // 1MB
//   const start = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

//   const contentLength = end - start + 1;

//   const headers = {
//     "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };

//   res.writeHead(206, headers);

//   const stream = fs.createReadStream(videoPath, { start, end });
//   stream.pipe(res);
// });

// module.exports = router;

const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const router = express.Router();

// GET /api/stream/:filename
router.get("/:filename", async (req, res) => {
  const { filename } = req.params;
  const { q } = req.query; // Quality parameter: 480p, 720p

  console.log(`🚀 Stream Request: ${filename} | Quality: ${q || 'Original'}`);

  try {
    // process.cwd() backend ke root (main) folder ka path deta hai
    const uploadsDir = path.join(process.cwd(), "uploads");
    let videoPath = path.join(uploadsDir, filename);

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

    // Check if final video path exists
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
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers); // 206 Partial Content

    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);

  } catch (err) {
    console.error("🔥 Stream Error:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;