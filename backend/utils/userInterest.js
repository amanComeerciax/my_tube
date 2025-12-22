// backend/utils/userInterest.js
const Video = require("../models/Video");

async function getUserTopInterest(user) {
  if (!user || !user.watchHistory || user.watchHistory.length === 0) {
    return null;
  }

  // recent 20 videos
  const recent = user.watchHistory
    .slice(-20)
    .map(v => v.video);

  const videos = await Video.find({ _id: { $in: recent } })
    .select("category tags");

  const categoryCount = {};

  videos.forEach(v => {
    categoryCount[v.category] = (categoryCount[v.category] || 0) + 1;
  });

  // find top category
  let topCategory = null;
  let max = 0;

  for (const cat in categoryCount) {
    if (categoryCount[cat] > max) {
      max = categoryCount[cat];
      topCategory = cat;
    }
  }

  return topCategory;
}

module.exports = { getUserTopInterest };
