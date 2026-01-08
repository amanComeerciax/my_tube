const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const https = require("https");

// Helper function to download file from URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => { });
      reject(err);
    });
  });
}

(async () => {
  let tempVideoPath = null;

  try {
    if (!workerData) {
      parentPort.postMessage({
        success: false,
        error: "workerData missing"
      });
      return;
    }

    const { videoId, filename, videoUrl } = workerData;

    if (!videoId) {
      parentPort.postMessage({
        success: false,
        error: "videoId missing"
      });
      return;
    }

    const uploadsDir = path.join(__dirname, "../uploads");
    const captionsDir = path.join(__dirname, "../captions");

    if (!fs.existsSync(captionsDir)) {
      fs.mkdirSync(captionsDir, { recursive: true });
    }

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let videoPath;

    // Check if we have a Cloudinary URL or local file
    if (videoUrl && videoUrl.includes('cloudinary.com')) {
      // Download from Cloudinary to temporary location
      console.log("☁️ Downloading video from Cloudinary for processing...");
      tempVideoPath = path.join(uploadsDir, `temp_${videoId}.mp4`);

      try {
        await downloadFile(videoUrl, tempVideoPath);
        videoPath = tempVideoPath;
        console.log("✅ Video downloaded successfully");
      } catch (downloadErr) {
        console.error("❌ Failed to download from Cloudinary:", downloadErr);
        parentPort.postMessage({
          success: false,
          error: "Failed to download video from Cloudinary: " + downloadErr.message
        });
        return;
      }
    } else if (filename) {
      // Use local file
      videoPath = path.join(uploadsDir, filename);
      if (!fs.existsSync(videoPath)) {
        parentPort.postMessage({
          success: false,
          error: "Video file not found"
        });
        return;
      }
    } else {
      parentPort.postMessage({
        success: false,
        error: "No video source provided (neither videoUrl nor filename)"
      });
      return;
    }

    const audioPath = path.join(captionsDir, `${videoId}.wav`);

    console.log("🔊 Caption worker started for:", videoId);

    /* =========================
       1️⃣ CHECK AUDIO STREAM
    ========================== */
    const hasAudio = await new Promise((resolve) => {
      exec(`ffmpeg -i "${videoPath}" 2>&1`, (_, out) => {
        resolve(out.includes("Audio:"));
      });
    });

    if (!hasAudio) {
      parentPort.postMessage({
        success: false,
        reason: "no-audio"
      });
      return;
    }

    /* =========================
       2️⃣ EXTRACT AUDIO
    ========================== */
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${videoPath}" -map 0:a:0 -ac 1 -ar 16000 "${audioPath}"`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    console.log("🎧 Audio extracted");

    /* =========================
       3️⃣ WHISPER AUTO LANGUAGE
       (Hindi / English / Gujarati / Urdu etc)
    ========================== */
    await new Promise((resolve, reject) => {
      exec(
        `python3 -m whisper "${audioPath}" --model small --task transcribe --output_format vtt --output_dir "${captionsDir}"`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    console.log("📝 Captions generated (auto language)");

    // Clean up temporary files
    if (tempVideoPath && fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
      console.log("🧹 Temporary video file deleted");
    }

    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
      console.log("🧹 Audio file deleted");
    }

    /* =========================
       4️⃣ DONE
    ========================== */
    parentPort.postMessage({
      success: true,
      captionFile: `${videoId}.vtt`
    });

  } catch (err) {
    console.error("❌ Caption worker error:", err);

    // Clean up on error
    if (tempVideoPath && fs.existsSync(tempVideoPath)) {
      try {
        fs.unlinkSync(tempVideoPath);
        console.log("🧹 Cleaned up temporary video file after error");
      } catch (cleanupErr) {
        console.error("Failed to clean up temp file:", cleanupErr);
      }
    }

    parentPort.postMessage({
      success: false,
      reason: "error",
      error: err.message
    });
  }
})();
