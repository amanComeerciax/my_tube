const { parentPort, workerData } = require("worker_threads");
const fs = require("fs").promises;
const Video = require("../models/Video");
const { ollama } = require("ollama");

async function generateAdvancedAIInsights() {
  const { videoId, captionPath } = workerData;

  try {
    const data = await fs.readFile(captionPath, "utf-8");
    const transcript = data
      .replace(/WEBVTT/g, "")
      .replace(/\d{2}:\d{2}:\d{2}\.\d{3}.*/g, "")
      .replace(/<[^>]*>/g, "")
      .split("\n")
      .filter(line => line.trim() !== "")
      .join(" ");

    // 🤖 Ollama request with Sentiment Analysis logic
    const response = await ollama.chat({
      model: 'dolphin-llama3:8b',
      messages: [
        { 
          role: 'system', 
          content: 'Analyze the transcript. Provide: 1) A 3-bullet point summary. 2) Sentiment (Positive, Neutral, or Negative) with an emoji. Format: Summary: [points] | Sentiment: [sentiment]' 
        },
        { role: 'user', content: transcript },
      ],
    });

    const aiOutput = response.message.content;
    
    // Summary aur Sentiment ko split karein
    const [summary, sentiment] = aiOutput.split('|').map(s => s.trim());

    // 3. DB Update with both fields
    await Video.findByIdAndUpdate(videoId, { 
      aiSummary: summary,
      sentiment: sentiment || "Neutral 😐" 
    });

    parentPort.postMessage({ success: true });
  } catch (err) {
    console.error("❌ Ollama Insight Error:", err);
    parentPort.postMessage({ success: false, error: err.message });
  }
}

generateAdvancedAIInsights();