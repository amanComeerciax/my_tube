const express = require("express");
const router = express.Router();
const Video = require("../models/Video");
const Fuse = require("fuse.js");
const User = require("../models/User");


// /api/search?query=
router.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "")
    return res.json([]);

  const videos = await Video.find(); // all videos

  const fuse = new Fuse(videos, {
    keys: ["title"],
    threshold: 0.4, // fuzzy power (0 = strict, 1 = loose)
  });

  const result = fuse.search(query);

  res.json(result.map(r => r.item));
});


// routes/searchRoutes.js
router.get("/suggestions", async (req, res) => {
  const q = req.query.query;
  if (!q) return res.json([]);

  const regex = new RegExp(q, "i");

  const videos = await Video.find({
    title: regex
  })
  .select("title")
  .limit(6);

  const channels = await User.find({
    name: regex
  })
  .select("name")
  .limit(4);

  const suggestions = [
    ...videos.map(v => ({ type: "video", text: v.title })),
    ...channels.map(c => ({ type: "channel", text: c.name }))
  ];

  res.json(suggestions);
});


module.exports = router;
