// const { parentPort, workerData } = require("worker_threads");
// const path = require("path");
// const fs = require("fs");
// const { exec } = require("child_process");
// const translateVTT = require("../utils/translateVTT");

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

//     const uploadsDir = path.join(__dirname, "../uploads");
//     const captionsDir = path.join(__dirname, "../captions");

//     if (!fs.existsSync(captionsDir)) {
//       fs.mkdirSync(captionsDir);
//     }

//     const videoPath = path.join(uploadsDir, filename);
//     const audioPath = path.join(captionsDir, `${videoId}.wav`);

//     if (!fs.existsSync(videoPath)) {
//       parentPort.postMessage({ success: false, error: "Video file not found" });
//       return;
//     }

//     console.log("🔊 Caption worker started for:", videoId);

//     // ======================
//     // 1️⃣ CHECK AUDIO STREAM
//     // ======================
//     const hasAudio = await new Promise(resolve => {
//       exec(`ffmpeg -i "${videoPath}" 2>&1`, (_, out) =>
//         resolve(out.includes("Audio:"))
//       );
//     });

//     if (!hasAudio) {
//       parentPort.postMessage({ success: false, reason: "no-audio" });
//       return;
//     }

//     // ======================
//     // 2️⃣ EXTRACT AUDIO
//     // ======================
//     await new Promise((resolve, reject) => {
//       exec(
//         `ffmpeg -y -i "${videoPath}" -map 0:a:0 -ac 1 -ar 16000 "${audioPath}"`,
//         err => (err ? reject(err) : resolve())
//       );
//     });

//     await translateVTT(
//       baseVttPath,
//       `${captionsDir}/${videoId}.hi.vtt`,
//       "Hindi"
//     );
    
//     await translateVTT(
//       baseVttPath,
//       `${captionsDir}/${videoId}.gu.vtt`,
//       "Gujarati"
//     );

//     // ======================
//     // 3️⃣ WHISPER (FIXED)
//     // ======================
//     await new Promise((resolve, reject) => {
//       exec(
//         `python3 -m whisper "${audioPath}" --model small --language en --output_format vtt --output_dir "${captionsDir}"`,
//         err => (err ? reject(err) : resolve())
//       );
//     });

//     parentPort.postMessage({
//       success: true,
//       captionFile: `${videoId}.vtt`
//     });

//   } catch (err) {
//     parentPort.postMessage({
//       success: false,
//       reason: "error",
//       error: err.message
//     });
//   }
// })();


// const { parentPort, workerData } = require("worker_threads");
// const path = require("path");
// const fs = require("fs");
// const { exec } = require("child_process");
// const translateVTT = require("../utils/translateVTT");




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

//     const uploadsDir = path.join(__dirname, "../uploads");
//     const captionsDir = path.join(__dirname, "../captions");

//     if (!fs.existsSync(captionsDir)) {
//       fs.mkdirSync(captionsDir);
//     }

//     const videoPath = path.join(uploadsDir, filename);
//     const audioPath = path.join(captionsDir, `${videoId}.wav`);

//     if (!fs.existsSync(videoPath)) {
//       parentPort.postMessage({ success: false, error: "Video file not found" });
//       return;
//     }

//     console.log("🔊 Caption worker started for:", videoId);

//     // ======================
//     // 1️⃣ CHECK AUDIO STREAM
//     // ======================
//     const hasAudio = await new Promise(resolve => {
//       exec(`ffmpeg -i "${videoPath}" 2>&1`, (_, out) =>
//         resolve(out.includes("Audio:"))
//       );
//     });

//     if (!hasAudio) {
//       parentPort.postMessage({ success: false, reason: "no-audio" });
//       return;
//     }

//     // ======================
//     // 2️⃣ EXTRACT AUDIO
//     // ======================
//     await new Promise((resolve, reject) => {
//       exec(
//         `ffmpeg -y -i "${videoPath}" -map 0:a:0 -ac 1 -ar 16000 "${audioPath}"`,
//         err => (err ? reject(err) : resolve())
//       );
//     });

//     // ======================
//     // 3️⃣ WHISPER → BASE VTT
//     // ======================
//     await new Promise((resolve, reject) => {
//       exec(
//         `python3 -m whisper "${audioPath}" --model small --language en --output_format vtt --output_dir "${captionsDir}"`,
//         err => (err ? reject(err) : resolve())
//       );
//     });

//     // ✅ DEFINE BASE VTT PATH (THIS WAS MISSING)
//     const baseVttPath = path.join(captionsDir, `${videoId}.vtt`);
//     const hiVttPath = path.join(captionsDir, `${videoId}.hi.vtt`);
//     const guVttPath = path.join(captionsDir, `${videoId}.gu.vtt`);

//     if (!fs.existsSync(baseVttPath)) {
//       parentPort.postMessage({
//         success: false,
//         error: "Base VTT not generated"
//       });
//       return;
//     }

//     // ======================
//     // 4️⃣ TRANSLATE
//     // ======================
//     await translateVTT(baseVttPath, hiVttPath, "Hindi");
//     await translateVTT(baseVttPath, guVttPath, "Gujarati");

//     console.log("🌍 Translating to Hindi...");
// await translateVTT(baseVttPath, hiVttPath, "Hindi");
// console.log("✅ Hindi caption done");

// console.log("🌍 Translating to Gujarati...");
// await translateVTT(baseVttPath, guVttPath, "Gujarati");
// console.log("✅ Gujarati caption done");


//     // ======================
//     // 5️⃣ DONE
//     // ======================
//     parentPort.postMessage({
//       success: true,
//       captions: {
//         base: `${videoId}.vtt`,
//         languages: {
//           hi: fs.existsSync(hiVttPath) ? `${videoId}.hi.vtt` : null,
//           gu: fs.existsSync(guVttPath) ? `${videoId}.gu.vtt` : null
//         }
//       }
//     });

//   } catch (err) {
//     parentPort.postMessage({
//       success: false,
//       reason: "error",
//       error: err.message
//     });
//   }
// })();

// const { parentPort, workerData } = require("worker_threads");
// const path = require("path");
// const fs = require("fs");
// const { exec } = require("child_process");

// // small helper to use exec with await
// function execPromise(cmd) {
//   return new Promise((resolve, reject) => {
//     exec(cmd, (err, stdout, stderr) => {
//       if (err) return reject(err);
//       resolve({ stdout, stderr });
//     });
//   });
// }

// (async () => {
//   try {
//     if (!workerData) {
//       parentPort.postMessage({ success: false, error: "workerData missing" });
//       return;
//     }

//     const { videoId, filename } = workerData;

//     if (!videoId || !filename) {
//       parentPort.postMessage({
//         success: false,
//         error: "videoId or filename missing"
//       });
//       return;
//     }

//     const uploadsDir = path.join(__dirname, "../uploads");
//     const captionsDir = path.join(__dirname, "../captions");

//     if (!fs.existsSync(captionsDir)) {
//       fs.mkdirSync(captionsDir);
//     }

//     const videoPath = path.join(uploadsDir, filename);
//     const audioPath = path.join(captionsDir, `${videoId}.wav`);

//     if (!fs.existsSync(videoPath)) {
//       parentPort.postMessage({
//         success: false,
//         error: "Video file not found"
//       });
//       return;
//     }

//     console.log("🔊 Caption worker started for:", videoId);

//     /* ======================
//        1️⃣ CHECK AUDIO STREAM
//     ====================== */
//     const hasAudio = await new Promise(resolve => {
//       exec(`ffmpeg -i "${videoPath}" 2>&1`, (_, out) =>
//         resolve(out.includes("Audio:"))
//       );
//     });

//     if (!hasAudio) {
//       parentPort.postMessage({
//         success: false,
//         reason: "no-audio"
//       });
//       return;
//     }

//     /* ======================
//        2️⃣ EXTRACT AUDIO
//     ====================== */
//     await execPromise(
//       `ffmpeg -y -i "${videoPath}" -map 0:a:0 -ac 1 -ar 16000 "${audioPath}"`
//     );

//     /* ======================
//        3️⃣ ENGLISH (BASE)
//        Whisper always creates: videoId.vtt
//     ====================== */
//     console.log("📝 Generating English captions...");
//     await execPromise(
//       `python3 -m whisper "${audioPath}" --model small --language en --output_format vtt --output_dir "${captionsDir}"`
//     );

//     const baseVtt = path.join(captionsDir, `${videoId}.vtt`);

//     if (!fs.existsSync(baseVtt)) {
//       parentPort.postMessage({
//         success: false,
//         error: "English VTT not generated"
//       });
//       return;
//     }

//     console.log("✅ English caption created");

//     /* ======================
//        4️⃣ HINDI
//        Whisper overwrites videoId.vtt → copy
//     ====================== */
//     console.log("🌍 Translating → Hindi");
//     await execPromise(
//       `python3 -m whisper "${audioPath}" --model small --language hi --output_format vtt --output_dir "${captionsDir}"`
//     );

//     const hiVtt = path.join(captionsDir, `${videoId}.hi.vtt`);
//     fs.copyFileSync(baseVtt, hiVtt);
//     console.log("✅ Hindi caption done");

//     /* ======================
//        5️⃣ GUJARATI
//     ====================== */
//     console.log("🌍 Translating → Gujarati");
//     await execPromise(
//       `python3 -m whisper "${audioPath}" --model small --language gu --output_format vtt --output_dir "${captionsDir}"`
//     );

//     const guVtt = path.join(captionsDir, `${videoId}.gu.vtt`);
//     fs.copyFileSync(baseVtt, guVtt);
//     console.log("✅ Gujarati caption done");


    

//     /* ======================
//        6️⃣ DONE
//     ====================== */
//     parentPort.postMessage({
//       success: true,
//       captions: {
//         base: `${videoId}.vtt`,
//         languages: {
//           hi: `${videoId}.hi.vtt`,
//           gu: `${videoId}.gu.vtt`
//         }
//       }
//     });

//   } catch (err) {
//     console.error("❌ Caption worker error:", err);
//     parentPort.postMessage({
//       success: false,
//       reason: "error",
//       error: err.message
//     });
//   }
// })();


// const { parentPort, workerData } = require("worker_threads");
// const path = require("path");
// const fs = require("fs").promises; // fs.promises API
// const fsSync = require("fs"); // Synchronous version for simple checks
// const { exec, execSync } = require("child_process"); 

// // small helper to use exec with await
// function execPromise(cmd) {
//   return new Promise((resolve, reject) => {
//     exec(cmd, (err, stdout, stderr) => {
//       if (err) return reject(err);
//       resolve({ stdout, stderr });
//     });
//   });
// }

// (async () => {
//   try {
//     if (!workerData || !workerData.videoId || !workerData.filename) {
//       parentPort.postMessage({ success: false, error: "videoId or filename missing or incomplete" });
//       return;
//     }

//     const { videoId, filename } = workerData;

//     const uploadsDir = path.join(__dirname, "../uploads");
//     const captionsDir = path.join(__dirname, "../captions");
    
//     // --- Define paths ---
//     const tempVttPath = path.join(captionsDir, `${videoId}.temp.vtt`); 
//     const defaultVtt = path.join(captionsDir, `${videoId}.vtt`); // <-- FIXED: Defining default VTT path
//     const baseVttFinal = path.join(captionsDir, `${videoId}.vtt`); // English VTT (Same as default)
//     const hiVttFinal = path.join(captionsDir, `${videoId}.hi.vtt`);
//     const guVttFinal = path.join(captionsDir, `${videoId}.gu.vtt`);
    
//     if (!fsSync.existsSync(captionsDir)) {
//       fsSync.mkdirSync(captionsDir);
//     }

//     const videoPath = path.join(uploadsDir, filename);
//     const audioPath = path.join(captionsDir, `${videoId}.wav`);

//     if (!fsSync.existsSync(videoPath)) {
//       parentPort.postMessage({
//         success: false,
//         error: "Video file not found"
//       });
//       return;
//     }

//     console.log("🔊 Caption worker started for:", videoId);

//     /* ======================
//        1️⃣ AUDIO EXTRACTION (Assumed to be correct)
//     ====================== */
//     console.log("🎶 Extracting Audio...");
//     await execPromise(
//         `ffmpeg -y -i "${videoPath}" -map 0:a:0 -ac 1 -ar 16000 "${audioPath}"`
//     );

//     /* ======================
//        2️⃣ ENGLISH (BASE) - Output: videoId.vtt
//     ====================== */
//     console.log("📝 Generating English captions...");
//     // ❌ FIX: Removed '--output_basename'
//     await execPromise(
//       `python3 -m whisper "${audioPath}" --model small --language en --output_format vtt --output_dir "${captionsDir}"`
//     );

//     if (!fsSync.existsSync(baseVttFinal)) {
//       parentPort.postMessage({
//         success: false,
//         error: "English VTT not generated"
//       });
//       return;
//     }

//     // ✅ FIX: Reading file content with 'utf8' encoding to avoid 'cb must be function' error
//     const enVttTempContent = await fs.readFile(baseVttFinal, 'utf8'); 
//     console.log("✅ English caption created");

//     /* ======================
//        3️⃣ HINDI - Generate Hindi, then rename it
//     ====================== */
//     console.log("🌍 Translating → Hindi");
//     // Generate Hindi VTT (This overwrites videoId.vtt with Hindi content)
//     await execPromise(
//       `python3 -m whisper "${audioPath}" --model small --language hi --output_format vtt --output_dir "${captionsDir}"`
//     );
    
//     // Rename the current videoId.vtt (which is now Hindi) to videoId.hi.vtt
//     fsSync.renameSync(defaultVtt, hiVttFinal); // Using defaultVtt variable which is now defined
//     console.log("✅ Hindi caption done");

//     /* ======================
//        4️⃣ GUJARATI - Generate Gujarati, then rename it
//     ====================== */
//     console.log("🌍 Translating → Gujarati");
//     // Generate Gujarati VTT (This overwrites videoId.hi.vtt with Gujarati content)
//     await execPromise(
//       `python3 -m whisper "${audioPath}" --model small --language gu --output_format vtt --output_dir "${captionsDir}"`
//     );

//     // Rename the current videoId.vtt (which is now Gujarati) to videoId.gu.vtt
//     fsSync.renameSync(defaultVtt, guVttFinal); // Using defaultVtt variable
//     console.log("✅ Gujarati caption done");

//     // 💡 RE-ESTABLISH ENGLISH: Write the English original content back to the base file
//     await fs.writeFile(baseVttFinal, enVttTempContent, 'utf8');


//     // Cleanup audio file
//     if (fsSync.existsSync(audioPath)) {
//         fsSync.unlinkSync(audioPath);
//     }

//     /* ======================
//        5️⃣ DONE
//     ====================== */
//     parentPort.postMessage({
//       success: true,
//       captions: {
//         base: `${videoId}.vtt`,
//         languages: {
//           hi: `${videoId}.hi.vtt`,
//           gu: `${videoId}.gu.vtt`
//         }
//       }
//     });

//   } catch (err) {
//     console.error("❌ Caption worker error:", err);
//     parentPort.postMessage({
//       success: false,
//       reason: "error",
//       error: err.message
//     });
//   }
// })();

const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

(async () => {
  try {
    if (!workerData) {
      parentPort.postMessage({
        success: false,
        error: "workerData missing"
      });
      return;
    }

    const { videoId, filename } = workerData;

    if (!videoId || !filename) {
      parentPort.postMessage({
        success: false,
        error: "videoId or filename missing"
      });
      return;
    }

    const uploadsDir = path.join(__dirname, "../uploads");
    const captionsDir = path.join(__dirname, "../captions");

    if (!fs.existsSync(captionsDir)) {
      fs.mkdirSync(captionsDir, { recursive: true });
    }

    const videoPath = path.join(uploadsDir, filename);
    const audioPath = path.join(captionsDir, `${videoId}.wav`);

    if (!fs.existsSync(videoPath)) {
      parentPort.postMessage({
        success: false,
        error: "Video file not found"
      });
      return;
    }

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
        `python3 -m whisper "${audioPath}" \
        --model small \
        --task transcribe \
        --output_format vtt \
        --output_dir "${captionsDir}"`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    console.log("📝 Captions generated (auto language)");

    /* =========================
       4️⃣ DONE
    ========================== */
    parentPort.postMessage({
      success: true,
      captionFile: `${videoId}.vtt`
    });

  } catch (err) {
    console.error("❌ Caption worker error:", err);

    parentPort.postMessage({
      success: false,
      reason: "error",
      error: err.message
    });
  }
})();

