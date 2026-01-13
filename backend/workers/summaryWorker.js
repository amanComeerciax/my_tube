// const { parentPort, workerData } = require("worker_threads");
// const path = require("path");
// const mongoose = require("mongoose");

// const Video = require("../models/Video");
// const vttToText = require("../utils/vttToText");
// const generateSummary = require("../utils/generateSummary");

// console.log("🤖 Summary Worker STARTED");

// (async () => {
//   try {
//     // 🔥 CONNECT TO MONGODB (VERY IMPORTANT)
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });

//     console.log("🤖 Summary Worker: DB connected");

//     const video = await Video.findById(workerData.videoId);
//     if (!video || !video.captions) {
//       parentPort.postMessage({ success: false, reason: "no-captions" });
//       return;
//     }

//     console.log("🤖 Summary Worker: generating...");

//     const vttPath = path.join(process.cwd(), video.captions);
//     const text = vttToText(vttPath).slice(0, 8000);

//     const summary = await generateSummary(text);

//     video.summary = summary;
//     video.summaryStatus = "ready";
//     video.summaryGeneratedAt = new Date();
//     await video.save();

//     console.log("✅ Summary saved");

//     parentPort.postMessage({ success: true });

//     await mongoose.disconnect();
//   } catch (err) {
//     console.error("❌ Summary Worker Error:", err);
//     parentPort.postMessage({ success: false, error: err.message });
//   }
// })();


// const { parentPort, workerData } = require("worker_threads");
// const path = require("path");
// const fs = require("fs");
// const mongoose = require("mongoose");
// const axios = require("axios");

// console.log("🤖 Summary Worker STARTED for video:", workerData.videoId);

// // VTT to Text Converter
// function vttToText(vttPath) {
//   try {
//     if (!fs.existsSync(vttPath)) {
//       console.log("⚠️ VTT file not found:", vttPath);
//       return "";
//     }

//     const content = fs.readFileSync(vttPath, "utf-8");
//     const lines = content.split("\n");
//     const textLines = [];

//     for (let line of lines) {
//       line = line.trim();
//       // Skip WEBVTT header, timestamps, and empty lines
//       if (
//         line &&
//         !line.startsWith("WEBVTT") &&
//         !line.includes("-->") &&
//         !line.match(/^\d+$/)
//       ) {
//         // Remove timestamp tags like <00:00:10.500>
//         line = line.replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, "");
//         textLines.push(line);
//       }
//     }

//     return textLines.join(" ").trim();
//   } catch (err) {
//     console.error("❌ VTT to Text Error:", err);
//     return "";
//   }
// }

// // Generate Summary using Ollama
// async function generateSummary(text) {
//   try {
// //     const prompt = `Analyze this video transcript and provide a concise summary with key insights.

// // Rules:
// // - Create 3-5 clear bullet points
// // - Focus on main topics and key takeaways
// // - Keep each point under 25 words
// // - Be specific and actionable
// // - No repetition or fluff

// // Transcript:
// // ${text.slice(0, 8000)}

// // Provide the summary as clear bullet points:`;

// const prompt = `
// You are an expert content summarizer.

// TASK:
// Summarize the following video transcript into 4–5 meaningful bullet points.

// STRICT RULES:
// - Do NOT repeat basic greetings
// - Do NOT mention "this transcript" or "the user"
// - Combine related information
// - Write in professional English
// - Each bullet point must be a complete sentence
// - Focus on education, background, skills, and intent

// FORMAT:
// • Bullet point 1
// • Bullet point 2
// • Bullet point 3
// • Bullet point 4

// TRANSCRIPT:
// ${text.slice(0, 8000)}

// OUTPUT ONLY THE BULLET POINTS.
// `;

//     console.log("🤖 Calling Ollama API...");

//     const res = await axios.post(
//       "http://localhost:11434/api/generate",
//       {
//         model: "dolphin-llama3",
//         prompt,
//         stream: false,
//       },
//       {
//         timeout: 120000, // 2 minute timeout
//       }
//     );

//     console.log("✅ Ollama response received");
//     return res.data.response || "Summary generation failed";
//   } catch (err) {
//     console.error("❌ Ollama API Error:", err.message);
//     throw err;
//   }
// }

// // Analyze Sentiment
// async function analyzeSentiment(text) {
//   try {
//     const prompt = `Analyze the overall sentiment/tone of this video transcript. Reply with ONLY ONE WORD from these options: Positive, Negative, Neutral, Educational, Entertaining, Informative, Inspirational, Critical.

// Transcript:
// ${text.slice(0, 3000)}

// Sentiment (one word):`;

//     const res = await axios.post(
//       "http://localhost:11434/api/generate",
//       {
//         model: "dolphin-llama3",
//         prompt,
//         stream: false,
//       },
//       {
//         timeout: 60000,
//       }
//     );

//     const sentiment = res.data.response.trim().split("\n")[0];
//     return sentiment || "Neutral";
//   } catch (err) {
//     console.error("❌ Sentiment Analysis Error:", err.message);
//     return "Neutral";
//   }
// }

// // Main Worker Function
// (async () => {
//   let Video;

//   try {
//     // Get MongoDB URI from workerData or use default
//     const MONGO_URI = workerData.mongoUri || process.env.MONGO_URI;

//     console.log("🤖 Connecting to MongoDB...");
//     await mongoose.connect(MONGO_URI);
//     console.log("🤖 Summary Worker: DB connected");

//     // 🔥 IMPORTANT: Define Video model in worker context
//     // Don't use require - create fresh schema in worker
//     const videoSchema = new mongoose.Schema({
//       title: String,
//       description: String,
//       filename: String,
//       thumbnail: String,
//       url: String,
//       category: String,
//       tags: [String],
//       uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       views: { type: Number, default: 0 },
//       likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//       size: { type: Number, default: 0 },
//       duration: { type: Number, default: 0 },
//       isShort: { type: Boolean, default: false },
//       aspectRatio: { type: String, default: "16:9" },
//       captions: { type: String, default: null },
//       captionsStatus: {
//         type: String,
//         enum: ["pending", "processing", "ready", "failed", "no-audio"],
//         default: "pending",
//       },
//       aiSummary: { type: String, default: null },
//       sentiment: {
//         type: String,
//         enum: ["Positive", "Negative", "Neutral", "Educational", "Entertaining", "Informative", "Inspirational", "Critical"],
//         default: "Neutral",
//       },
//       summaryStatus: {
//         type: String,
//         enum: ["pending", "processing", "ready", "failed", "not-available"],
//         default: "pending",
//       },
//       summaryGeneratedAt: { type: Date, default: null },
//       processing: { type: Boolean, default: false },
//       processedAt: { type: Date, default: null },
//     }, { timestamps: true });

//     // Create or get Video model
//     Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

//     // 🔥 FIX: Wait a bit for DB sync (sometimes needed after fresh connection)
//     await new Promise(resolve => setTimeout(resolve, 100));

//     // Find video with proper ObjectId handling
//     console.log("🔍 Looking for video with ID:", workerData.videoId);

//     let video;
//     try {
//       video = await Video.findById(workerData.videoId);
//     } catch (findErr) {
//       console.error("❌ Error finding video:", findErr.message);
//       // Try with string query as fallback
//       video = await Video.findOne({ _id: workerData.videoId });
//     }

//     if (!video) {
//       console.log("❌ Video not found in database");
//       console.log("📊 Total videos in DB:", await Video.countDocuments());

//       parentPort.postMessage({
//         success: false,
//         reason: "video-not-found",
//       });
//       await mongoose.disconnect();
//       return;
//     }

//     console.log("✅ Video found:", video.title);

//     if (!video.captions) {
//       console.log("⚠️ Video has no captions yet");
//       parentPort.postMessage({
//         success: false,
//         reason: "no-captions",
//       });
//       await mongoose.disconnect();
//       return;
//     }

//     console.log("🤖 Processing captions:", video.captions);

//     // Convert VTT to text
//     const vttPath = path.join(process.cwd(), video.captions);
//     console.log("📁 VTT Path:", vttPath);

//     const transcriptText = vttToText(vttPath);

//     if (!transcriptText || transcriptText.length < 10) {
//       console.log("⚠️ Insufficient text in transcript:", transcriptText.length, "characters");
//     //   parentPort.postMessage({
//     //     success: false,
//     //     reason: "insufficient-text",
//     //   });

//     video.aiSummary = "This video contains limited spoken content. No detailed transcript was available to generate an AI summary.";
// video.summaryStatus = "not-available";
// await video.save();

// parentPort.postMessage({
//   success: true,
//   summary: video.aiSummary,
// });

//       await mongoose.disconnect();
//       return;
//     }

//     console.log(`🤖 Transcript extracted: ${transcriptText.length} characters`);

//     // Update status to processing
//     video.summaryStatus = "processing";
//     await video.save();

//     // Generate summary
//     const summary = await generateSummary(transcriptText);
//     console.log("📝 Summary generated:", summary.substring(0, 100) + "...");

//     // Analyze sentiment
//     const sentiment = await analyzeSentiment(transcriptText);
//     console.log("😊 Sentiment analyzed:", sentiment);

//     // Update video in database
//     video.aiSummary = summary;
//     video.sentiment = sentiment;
//     video.summaryStatus = "ready";
//     video.summaryGeneratedAt = new Date();
//     await video.save();

//     console.log("✅ AI Summary & Sentiment saved to DB");

//     parentPort.postMessage({
//       success: true,
//       summary,
//       sentiment,
//     });

//     await mongoose.disconnect();
//     console.log("🔌 Disconnected from MongoDB");

//   } catch (err) {
//     console.error("❌ Summary Worker Fatal Error:", err);
//     console.error("Stack trace:", err.stack);

//     parentPort.postMessage({
//       success: false,
//       error: err.message,
//     });

//     try {
//       if (mongoose.connection.readyState !== 0) {
//         await mongoose.disconnect();
//       }
//     } catch (disconnectErr) {
//       console.error("Failed to disconnect:", disconnectErr);
//     }
//   }
// })();

const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const axios = require("axios");

console.log("🤖 Summary Worker STARTED for video:", workerData.videoId);

// VTT to Text Converter
function vttToText(vttPath) {
  try {
    if (!fs.existsSync(vttPath)) {
      console.log("⚠️ VTT file not found:", vttPath);
      return "";
    }

    const content = fs.readFileSync(vttPath, "utf-8");
    const lines = content.split("\n");
    const textLines = [];

    for (let line of lines) {
      line = line.trim();
      // Skip WEBVTT header, timestamps, and empty lines
      if (
        line &&
        !line.startsWith("WEBVTT") &&
        !line.includes("-->") &&
        !line.match(/^\d+$/)
      ) {
        // Remove timestamp tags like <00:00:10.500>
        line = line.replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, "");
        textLines.push(line);
      }
    }

    return textLines.join(" ").trim();
  } catch (err) {
    console.error("❌ VTT to Text Error:", err);
    return "";
  }
}

// Generate Summary using Groq AI
async function generateSummary(text) {
  try {
    const prompt = `
You are an expert content summarizer.

TASK:
Summarize the following video transcript into 4–5 meaningful bullet points.

STRICT RULES:
- Do NOT repeat basic greetings
- Do NOT mention "this transcript" or "the user"
- Combine related information
- Write in professional English
- Each bullet point must be a complete sentence
- Focus on education, background, skills, and intent

FORMAT:
• Bullet point 1
• Bullet point 2
• Bullet point 3
• Bullet point 4

TRANSCRIPT:
${text.slice(0, 8000)}

OUTPUT ONLY THE BULLET POINTS.
`;

    console.log("🤖 Calling Groq API for summary...");

    // Use Groq via OpenAI SDK
    const { OpenAI } = require("openai");

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Fast and smart
      messages: [
        { role: "system", content: "You are an expert content summarizer. Always provide concise, professional bullet points." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const summary = response.choices[0]?.message?.content || "Summary generation failed";
    console.log("✅ Groq summary received");
    return summary;
  } catch (err) {
    console.error("❌ Groq API Error:", err.message);
    throw err;
  }
}

// Analyze Sentiment using Groq AI
async function analyzeSentiment(text) {
  try {
    const prompt = `Analyze the overall sentiment/tone of this video transcript. Reply with ONLY ONE WORD from these options: Positive, Negative, Neutral, Educational, Entertaining, Informative, Inspirational, Critical.

Transcript:
${text.slice(0, 3000)}

Sentiment (one word):`;

    // Use Groq via OpenAI SDK
    const { OpenAI } = require("openai");

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 10
    });

    const sentiment = response.choices[0]?.message?.content?.trim().split("\n")[0] || "Neutral";
    return sentiment;
  } catch (err) {
    console.error("❌ Sentiment Analysis Error:", err.message);
    return "Neutral";
  }
}

// Main Worker Function
(async () => {
  let Video;

  try {
    // Get MongoDB URI from workerData or use default
    const MONGO_URI = workerData.mongoUri || process.env.MONGO_URI;

    console.log("🤖 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("🤖 Summary Worker: DB connected");

    // 🔥 IMPORTANT: Define Video model in worker context
    // Don't use require - create fresh schema in worker
    const videoSchema = new mongoose.Schema({
      title: String,
      description: String,
      filename: String,
      thumbnail: String,
      url: String,
      category: String,
      tags: [String],
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      views: { type: Number, default: 0 },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      size: { type: Number, default: 0 },
      duration: { type: Number, default: 0 },
      isShort: { type: Boolean, default: false },
      aspectRatio: { type: String, default: "16:9" },
      captions: { type: String, default: null },
      captionsStatus: {
        type: String,
        enum: ["pending", "processing", "ready", "failed", "no-audio"],
        default: "pending",
      },
      aiSummary: { type: String, default: null },
      sentiment: {
        type: String,
        enum: ["Positive", "Negative", "Neutral", "Educational", "Entertaining", "Informative", "Inspirational", "Critical"],
        default: "Neutral",
      },
      summaryStatus: {
        type: String,
        enum: ["pending", "processing", "ready", "failed", "not-available"],
        default: "pending",
      },
      summaryGeneratedAt: { type: Date, default: null },
      processing: { type: Boolean, default: false },
      processedAt: { type: Date, default: null },
    }, { timestamps: true });

    // Create or get Video model
    Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

    // 🔥 FIX: Wait a bit for DB sync (sometimes needed after fresh connection)
    await new Promise(resolve => setTimeout(resolve, 100));

    // Find video with proper ObjectId handling
    console.log("🔍 Looking for video with ID:", workerData.videoId);

    let video;
    try {
      video = await Video.findById(workerData.videoId);
    } catch (findErr) {
      console.error("❌ Error finding video:", findErr.message);
      // Try with string query as fallback
      video = await Video.findOne({ _id: workerData.videoId });
    }

    if (!video) {
      console.log("❌ Video not found in database");
      console.log("📊 Total videos in DB:", await Video.countDocuments());

      parentPort.postMessage({
        success: false,
        reason: "video-not-found",
      });
      await mongoose.disconnect();
      return;
    }

    console.log("✅ Video found:", video.title);

    if (!video.captions) {
      console.log("⚠️ Video has no captions yet");
      parentPort.postMessage({
        success: false,
        reason: "no-captions",
      });
      await mongoose.disconnect();
      return;
    }

    console.log("🤖 Processing captions:", video.captions);

    // ✅ FIXED: Changed path to match captionWorker.js
    // Caption Worker saves to: backend/captions/
    // So we read from: backend/captions/
    const vttPath = path.join(
      process.cwd(),
      "captions",  // Changed from "uploads/captions" to just "captions"
      video.captions
    );

    console.log("📁 VTT Path:", vttPath);

    // Debug: Check if file exists
    console.log("📁 File exists?", fs.existsSync(vttPath));

    const transcriptText = vttToText(vttPath);

    if (!transcriptText || transcriptText.length < 10) {
      console.log("⚠️ Insufficient text in transcript:", transcriptText.length, "characters");

      video.aiSummary = "This video contains limited spoken content. No detailed transcript was available to generate an AI summary.";
      video.summaryStatus = "not-available";
      await video.save();

      parentPort.postMessage({
        success: true,
        summary: video.aiSummary,
      });

      await mongoose.disconnect();
      return;
    }

    console.log(`🤖 Transcript extracted: ${transcriptText.length} characters`);

    // Update status to processing
    video.summaryStatus = "processing";
    await video.save();

    // Generate summary
    const summary = await generateSummary(transcriptText);
    console.log("📝 Summary generated:", summary.substring(0, 100) + "...");

    // Analyze sentiment
    const sentiment = await analyzeSentiment(transcriptText);
    console.log("😊 Sentiment analyzed:", sentiment);

    // Update video in database
    video.aiSummary = summary;
    video.sentiment = sentiment;
    video.summaryStatus = "ready";
    video.summaryGeneratedAt = new Date();
    await video.save();

    console.log("✅ AI Summary & Sentiment saved to DB");

    parentPort.postMessage({
      success: true,
      summary,
      sentiment,
    });

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");

  } catch (err) {
    console.error("❌ Summary Worker Fatal Error:", err);
    console.error("Stack trace:", err.stack);

    parentPort.postMessage({
      success: false,
      error: err.message,
    });

    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (disconnectErr) {
      console.error("Failed to disconnect:", disconnectErr);
    }
  }
})();