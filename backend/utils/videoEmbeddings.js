// backend/utils/videoEmbeddings.js
const natural = require('natural');
const TfIdf = natural.TfIdf;

function getVideoFingerprint(video) {
  return [
    video.title || '',
    video.description || '',
    video.category || '',
    ...(video.tags || [])
  ].join(' ').toLowerCase();
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (const key in vecA) {
    if (vecB[key]) dot += vecA[key] * vecB[key];
    normA += vecA[key] * vecA[key];
  }
  for (const key in vecB) normB += vecB[key] * vecB[key];
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

module.exports = { getVideoFingerprint, cosineSimilarity };