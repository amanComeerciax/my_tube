const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

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

    const uploadsDir = path.join(__dirname, "../uploads");
    const captionsDir = path.join(__dirname, "../captions");

    if (!fs.existsSync(captionsDir)) {
      fs.mkdirSync(captionsDir);
    }

    const videoPath = path.join(uploadsDir, filename);
    const audioPath = path.join(captionsDir, `${videoId}.wav`);

    if (!fs.existsSync(videoPath)) {
      parentPort.postMessage({ success: false, error: "Video file not found" });
      return;
    }

    console.log("🔊 Caption worker started for:", videoId);

    // ======================
    // 1️⃣ CHECK AUDIO STREAM
    // ======================
    const hasAudio = await new Promise(resolve => {
      exec(`ffmpeg -i "${videoPath}" 2>&1`, (_, out) =>
        resolve(out.includes("Audio:"))
      );
    });

    if (!hasAudio) {
      parentPort.postMessage({ success: false, reason: "no-audio" });
      return;
    }

    // ======================
    // 2️⃣ EXTRACT AUDIO
    // ======================
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${videoPath}" -map 0:a:0 -ac 1 -ar 16000 "${audioPath}"`,
        err => (err ? reject(err) : resolve())
      );
    });

    // ======================
    // 3️⃣ WHISPER (FIXED)
    // ======================
    await new Promise((resolve, reject) => {
      exec(
        `python3 -m whisper "${audioPath}" --model small --language en --output_format vtt --output_dir "${captionsDir}"`,
        err => (err ? reject(err) : resolve())
      );
    });

    parentPort.postMessage({
      success: true,
      captionFile: `${videoId}.vtt`
    });

  } catch (err) {
    parentPort.postMessage({
      success: false,
      reason: "error",
      error: err.message
    });
  }
})();
