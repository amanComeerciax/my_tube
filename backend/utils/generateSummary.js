const axios = require("axios");

module.exports = async function generateSummary(text) {
  const prompt = `
Summarize this video transcript in simple bullet points.

Rules:
- Max 5 bullet points
- Clear & short
- No repetition

Transcript:
${text}

Summary:
`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "dolphin-llama3",
    prompt,
    stream: false
  });

  return res.data.response;
};
