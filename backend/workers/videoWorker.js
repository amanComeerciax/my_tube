// const { parentPort, workerData } = require("worker_threads");
// const path = require("path");
// const fs = require("fs");

// (async () => {
//   try {
//     if (!workerData) {
//       parentPort.postMessage({ success: false, error: "workerData missing" });
//       return;
//     }

//     const { videoId, filename } = workerData;

//     if (!videoId || !filename) {
//       parentPort.postMessage({ success: false, error: "videoId or filename missing" });
//       return;
//     }

//     const videoPath = path.join(__dirname, "../uploads", filename);

//     if (!fs.existsSync(videoPath)) {
//       parentPort.postMessage({ success: false, error: "Video file not found" });
//       return;
//     }

//     console.log("🎬 Processing video in background:", videoId);

//     // (future: compress, transcode, thumbnails, etc.)
//     await new Promise(r => setTimeout(r, 500));

//     parentPort.postMessage({ success: true, videoId });

//   } catch (err) {
//     parentPort.postMessage({ success: false, error: err.message });
//   }
// })();


const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

(async () => {
  try {
    const { videoId, filename } = workerData;
    const videoPath = path.join(__dirname, "../uploads", filename);
    const outputDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(videoPath)) {
      parentPort.postMessage({ success: false, error: "Video file not found" });
      return;
    }

    // Fix: Filename se extension alag karein taaki output file sahi bane
    // Agar filename "video_blob" hai toh hum use ".mp4" force karenge
    const parsedPath = path.parse(filename);
    const cleanFileName = parsedPath.name.replace(/[^a-z0-9]/gi, '_'); // Special chars hataye
    const extension = ".mp4"; // FFmpeg ke liye extension zaroori hai

    console.log(`🎬 Processing: ${filename}`);

    const configurations = [
      { name: "720p", height: 720, bitrate: "2500k" },
      { name: "480p", height: 480, bitrate: "1000k" }
    ];

    for (const config of configurations) {
      // Naya file path: 720p_filename.mp4
      const outputName = `${config.name}_${cleanFileName}${extension}`;
      const outputPath = path.join(outputDir, outputName);

      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .videoCodec("libx264")
          .audioCodec("aac") // Audio copy ya encode karein
          .size(`?x${config.height}`)
          .videoBitrate(config.bitrate)
          .output(outputPath)
          .on("start", (cmd) => console.log("Running FFmpeg:", cmd))
          .on("end", () => {
            console.log(`✅ Generated: ${config.name}`);
            resolve();
          })
          .on("error", (err) => {
            console.error(`❌ FFmpeg Error ${config.name}:`, err);
            reject(err);
          })
          .run();
      });
    }

    parentPort.postMessage({ success: true, videoId });

  } catch (err) {
    console.error("Worker Catch Error:", err);
    parentPort.postMessage({ success: false, error: err.message });
  }
})();