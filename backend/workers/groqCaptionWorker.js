const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const https = require("https");
const FormData = require("form-data");

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

// Helper function to format seconds to VTT timestamp (HH:MM:SS.mmm)
function formatVTTTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

(async () => {
    let tempVideoPath = null;
    let audioPath = null;

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

        // Validate Groq API key
        if (!process.env.GROQ_API_KEY) {
            parentPort.postMessage({
                success: false,
                error: "GROQ_API_KEY missing in environment variables"
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

        audioPath = path.join(captionsDir, `${videoId}.wav`);

        console.log("🔊 Groq Caption worker started for:", videoId);

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
           3️⃣ GROQ WHISPER API
        ========================== */
        console.log("🤖 Calling Groq Whisper API...");

        // Use OpenAI SDK with Groq endpoint
        const { OpenAI } = require("openai");

        const client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1"
        });

        // Read audio file
        const audioStream = fs.createReadStream(audioPath);

        // Call Groq Whisper API for transcription
        // Note: Groq doesn't support VTT format, so we use verbose_json
        const transcription = await client.audio.transcriptions.create({
            file: audioStream,
            model: "whisper-large-v3-turbo", // Fast and accurate
            response_format: "verbose_json",  // Get timestamps
            temperature: 0.0
        });

        console.log("✅ Transcription received from Groq");

        // Convert verbose_json to VTT format
        let vttContent = "WEBVTT\n\n";

        if (transcription.segments && transcription.segments.length > 0) {
            transcription.segments.forEach((segment, index) => {
                const startTime = formatVTTTime(segment.start);
                const endTime = formatVTTTime(segment.end);
                vttContent += `${index + 1}\n`;
                vttContent += `${startTime} --> ${endTime}\n`;
                vttContent += `${segment.text.trim()}\n\n`;
            });
        } else {
            // Fallback if no segments - use full text
            vttContent += "1\n";
            vttContent += "00:00:00.000 --> 00:00:10.000\n";
            vttContent += `${transcription.text || "No transcription available"}\n\n`;
        }

        // Save VTT file
        const vttPath = path.join(captionsDir, `${videoId}.vtt`);
        fs.writeFileSync(vttPath, vttContent);

        console.log("📝 Captions saved in VTT format");

        // Clean up temporary files
        if (tempVideoPath && fs.existsSync(tempVideoPath)) {
            fs.unlinkSync(tempVideoPath);
            console.log("🧹 Temporary video file deleted");
        }

        if (audioPath && fs.existsSync(audioPath)) {
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
        console.error("❌ Groq Caption worker error:", err);

        // Clean up on error
        if (tempVideoPath && fs.existsSync(tempVideoPath)) {
            try {
                fs.unlinkSync(tempVideoPath);
                console.log("🧹 Cleaned up temporary video file after error");
            } catch (cleanupErr) {
                console.error("Failed to clean up temp video file:", cleanupErr);
            }
        }

        if (audioPath && fs.existsSync(audioPath)) {
            try {
                fs.unlinkSync(audioPath);
                console.log("🧹 Cleaned up audio file after error");
            } catch (cleanupErr) {
                console.error("Failed to clean up audio file:", cleanupErr);
            }
        }

        parentPort.postMessage({
            success: false,
            reason: "error",
            error: err.message
        });
    }
})();
