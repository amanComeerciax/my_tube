const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");

(async () => {
  try {
    if (!workerData) {
      parentPort.postMessage({ success: false, error: "workerData missing" });
      return;
    }

    const { videoId, filename } = workerData;

    if (!videoId || !filename) {
      parentPort.postMessage({ success: false, error: "videoId or filename missing" });
      return;
    }

    const videoPath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(videoPath)) {
      parentPort.postMessage({ success: false, error: "Video file not found" });
      return;
    }

    console.log("🎬 Processing video in background:", videoId);

    // (future: compress, transcode, thumbnails, etc.)
    await new Promise(r => setTimeout(r, 500));

    parentPort.postMessage({ success: true, videoId });

  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();
