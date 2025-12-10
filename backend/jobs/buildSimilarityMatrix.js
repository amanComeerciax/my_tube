// backend/jobs/buildSimilarityMatrix.js

// 💡 FIXED: Correct .env path (absolute)
require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
const Video = require("../models/Video");
const fs = require("fs");
const path = require("path");

// 🧠 Extract text fingerprint for semantic comparison
function getVideoFingerprint(video) {
  return [
    video.title || "",
    video.description || "",
    video.category || "",
    ...(video.tags || [])
  ].join(" ").toLowerCase();
}

// 📌 Cosine similarity for word frequency vectors (simple TF)
function cosineSimilarity(vecA, vecB) {
  let dot = 0,
    normA = 0,
    normB = 0;

  for (const key in vecA) {
    if (vecB[key]) dot += vecA[key] * vecB[key];
    normA += vecA[key] * vecA[key];
  }

  for (const key in vecB) normB += vecB[key] * vecB[key];

  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

// ⚠ Check if Mongo URI loaded
console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND!");

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI not found in backend/.env file!");
  console.error("👉 Create backend/.env and add: MONGO_URI=your_mongo_url");
  process.exit(1);
}

// 🚀 Build Similarity Matrix
async function build() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("💚 MongoDB Connected Successfully!");

    const videos = await Video.find().lean();
    console.log(`📌 Found ${videos.length} videos. Building similarity matrix...`);

    if (videos.length === 0) {
      console.log("⚠ No videos found in database.");
      process.exit(0);
    }

    const matrix = {};

    for (let i = 0; i < videos.length; i++) {
      const current = videos[i];
      const currentText = getVideoFingerprint(current);

      const similar = [];

      for (let j = 0; j < videos.length; j++) {
        if (i === j) continue;

        const other = videos[j];
        const otherText = getVideoFingerprint(other);

        // 🧠 Build frequency vectors
        const wordsA = currentText.split(/\s+/).filter(w => w.length > 2);
        const wordsB = otherText.split(/\s+/).filter(w => w.length > 2);

        const freqA = {};
        const freqB = {};

        wordsA.forEach(w => (freqA[w] = (freqA[w] || 0) + 1));
        wordsB.forEach(w => (freqB[w] = (freqB[w] || 0) + 1));

        const sim = cosineSimilarity(freqA, freqB);

        if (sim > 0.25) {
          similar.push({
            videoId: other._id.toString(),
            filename: other.filename,
            title: other.title,
            thumbnail: other.thumbnail,
            similarity: Number(sim.toFixed(4))
          });
        }
      }

      similar.sort((a, b) => b.similarity - a.similarity);
      matrix[current._id.toString()] = similar.slice(0, 30);

      if (i % 20 === 0 || i === videos.length - 1) {
        console.log(`⚙ Processing: ${i + 1}/${videos.length}`);
      }
    }

    // 💾 SAVE MATRIX (absolute path)
    const outputPath = path.join(__dirname, "..", "..", "similarity-matrix.json");
    fs.writeFileSync(outputPath, JSON.stringify(matrix, null, 2));

    console.log("🎉 Similarity Matrix Built & Saved Successfully!");
    console.log(`📍 File: ${outputPath} (${Object.keys(matrix).length} videos)`);

    process.exit(0);

  } catch (error) {
    console.error("🔥 Error building matrix:", error.message);
    process.exit(1);
  }
}

build();
