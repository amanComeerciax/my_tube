const { parentPort, workerData } = require("worker_threads");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const { videoId, inputPath } = workerData;

const outputDir = path.join(__dirname, "../uploads", videoId);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const qualities = [
  { name: "1080p", scale: "1920:1080", bitrate: "5M" },
  { name: "720p",  scale: "1280:720",  bitrate: "3M" },
  { name: "480p",  scale: "854:480",   bitrate: "1.2M" },
  { name: "360p",  scale: "640:360",   bitrate: "800k" },
];

(async () => {
  try {
    for (const q of qualities) {
      const outFile = path.join(outputDir, `${q.name}.mp4`);

      await new Promise((res, rej) => {
        exec(
          `ffmpeg -y -i "${inputPath}" -vf scale=${q.scale} -c:v libx264 -preset fast -b:v ${q.bitrate} -c:a aac -b:a 128k "${outFile}"`,
          err => err ? rej(err) : res()
        );
      });
    }

    parentPort.postMessage({ success: true });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();
