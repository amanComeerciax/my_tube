const express = require("express");
const router = express.Router();
const Video = require("../models/Video");
const Fuse = require("fuse.js");

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

module.exports = router;
