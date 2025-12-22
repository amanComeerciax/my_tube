


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const Ad = require("../models/Ad");
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");
// const path = require("path");

// // ✅ MULTER SETUP FOR AD UPLOADS
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/ads"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname)
// });

// const upload = multer({ storage });

// /* =========================
//    🔥 UPLOAD AD (ADMIN ONLY)
// ========================= */
// router.post("/upload", auth, upload.single("adVideo"), async (req, res) => {
//   try {
//     const { title, target, targetValue, skipAfter } = req.body;

//     // Optional: Check if user is admin
//     // if (!req.user.isAdmin) {
//     //   return res.status(403).json({ message: "Only admins can upload ads" });
//     // }

//     const ad = await Ad.create({
//       title,
//       videoFile: req.file.filename,
//       target,              // "all", "category", or "video"
//       targetValue,         // category name OR videoId
//       skipAfter: Number(skipAfter || 5),
//       active: true,
//       createdBy: req.user.id
//     });

//     console.log("✅ Ad uploaded successfully:", ad);
//     res.json(ad);
//   } catch (err) {
//     console.error("❌ Ad upload error:", err);
//     res.status(500).json({ message: "Ad upload failed", error: err.message });
//   }
// });

// /* =========================
//    🎯 FETCH AD FOR VIDEO
// ========================= */
// router.get("/:videoId", async (req, res) => {
//   try {
//     console.log("🎯 Fetching ad for video:", req.params.videoId);

//     // Find the video to get its category
//     const video = await Video.findById(req.params.videoId);

//     if (!video) {
//       console.log("⚠️ Video not found");
//       return res.json(null);
//     }

//     console.log("📹 Video found:", video.title, "Category:", video.category);

//     // Try to find an ad for this video's category
//     let ad = await Ad.findOne({
//       active: true,
//       target: "category",
//       targetValue: video.category
//     }).sort({ createdAt: -1 });

//     // If no category-specific ad, try "all" target
//     if (!ad) {
//       console.log("⚠️ No category ad found, checking for 'all' target");
//       ad = await Ad.findOne({
//         active: true,
//         target: "all"
//       }).sort({ createdAt: -1 });
//     }

//     // If still no ad found
//     if (!ad) {
//       console.log("⚠️ No ad available");
//       return res.json(null);
//     }

//     console.log("✅ Ad found:", ad.title);

//     // Increment ad views
//     await Ad.findByIdAndUpdate(ad._id, { $inc: { views: 1 } });

//     // Return ad data
//     res.json({
//       _id: ad._id,
//       title: ad.title,
//       videoFile: ad.videoFile,
//       skipAfter: ad.skipAfter
//     });
//   } catch (err) {
//     console.error("❌ Ad fetch error:", err);
//     res.status(500).json({ message: "Ad fetch failed", error: err.message });
//   }
// });

// /* =========================
//    📊 GET ALL ADS (ADMIN)
// ========================= */
// router.get("/", auth, async (req, res) => {
//   try {
//     const ads = await Ad.find().populate("createdBy", "name email").sort({ createdAt: -1 });
//     res.json(ads);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch ads" });
//   }
// });

// /* =========================
//    🗑️ DELETE AD (ADMIN)
// ========================= */
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const ad = await Ad.findByIdAndDelete(req.params.id);
//     if (!ad) {
//       return res.status(404).json({ message: "Ad not found" });
//     }
//     res.json({ message: "Ad deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to delete ad" });
//   }
// });

// /* =========================
//    ✏️ UPDATE AD (ADMIN)
// ========================= */
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const { title, target, targetValue, skipAfter, active } = req.body;
    
//     const ad = await Ad.findByIdAndUpdate(
//       req.params.id,
//       { title, target, targetValue, skipAfter, active },
//       { new: true }
//     );

//     if (!ad) {
//       return res.status(404).json({ message: "Ad not found" });
//     }

//     res.json(ad);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to update ad" });
//   }
// });

// /* =========================
//    📈 AD ANALYTICS
// ========================= */
// router.get("/analytics/:id", auth, async (req, res) => {
//   try {
//     const ad = await Ad.findById(req.params.id);
//     if (!ad) {
//       return res.status(404).json({ message: "Ad not found" });
//     }

//     res.json({
//       title: ad.title,
//       views: ad.views,
//       clicks: ad.clicks,
//       ctr: ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : 0
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch analytics" });
//   }
// });

// /* =========================
//    👆 TRACK AD CLICK
// ========================= */
// router.post("/click/:id", async (req, res) => {
//   try {
//     await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
//     res.json({ message: "Click tracked" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to track click" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const Ad = require("../models/Ad");
const Video = require("../models/Video");
const auth = require("../middleware/auth");
const User = require("../models/User");

const authOptional = require("../middleware/authOptional");
const path = require("path");
const { getUserTopInterest } = require("../utils/userInterest");

// ✅ MULTER SETUP FOR AD UPLOADS
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/ads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

/* =========================
   🔥 UPLOAD AD (ADMIN ONLY)
========================= */
router.post("/upload", auth, upload.single("adVideo"), async (req, res) => {
  try {
    const { title, target, targetValue, skipAfter, cpm, cpc } = req.body;

    const ad = await Ad.create({
      title,
      videoFile: req.file.filename,
      target,
      targetValue,
      skipAfter: Number(skipAfter || 5),
      cpm: Number(cpm || 50),  // 🔥 NEW
      cpc: Number(cpc || 2),   // 🔥 NEW
      active: true,
      createdBy: req.user.id
    });

    console.log("✅ Ad uploaded successfully:", ad);
    res.json(ad);
  } catch (err) {
    console.error("❌ Ad upload error:", err);
    res.status(500).json({ message: "Ad upload failed", error: err.message });
  }
});

/* =========================
   🎯 FETCH AD FOR VIDEO
========================= */
// router.get("/:videoId", async (req, res) => {
  router.get("/:videoId", authOptional, async (req, res) => {

  try {
    console.log("🎯 Fetching ad for video:", req.params.videoId);

    const video = await Video.findById(req.params.videoId);

    if (!video) {
      console.log("⚠️ Video not found");
      return res.json(null);
    }

    console.log("📹 Video found:", video.title, "Category:", video.category);

    // Try to find an ad for this video's category
    // let ad = await Ad.findOne({
    //   active: true,
    //   target: "category",
    //   targetValue: video.category
    // }).sort({ createdAt: -1 });

    // // If no category-specific ad, try "all" target
    // if (!ad) {
    //   console.log("⚠️ No category ad found, checking for 'all' target");
    //   ad = await Ad.findOne({
    //     active: true,
    //     target: "all"
    //   }).sort({ createdAt: -1 });
    // }

    // if (!ad) {
    //   console.log("⚠️ No ad available");
    //   return res.json(null);
    // }

    let ad = null;

    // 1️⃣ Premium user → no ads
    if (req.user) {
      const user = await User.findById(req.user.id);
    
      if (user?.isPremium) {
        return res.json(null);
      }
    
      // 2️⃣ User interest based ad
      const interest = await getUserTopInterest(user);
    
      if (interest) {
        ad = await Ad.findOne({
          active: true,
          target: "category",
          targetValue: interest
        }).sort({ createdAt: -1 });
      }
    }
    
    // 3️⃣ Video category fallback
    if (!ad) {
      ad = await Ad.findOne({
        active: true,
        target: "category",
        targetValue: video.category
      }).sort({ createdAt: -1 });
    }
    
    // 4️⃣ All users fallback
    if (!ad) {
      ad = await Ad.findOne({
        active: true,
        target: "all"
      }).sort({ createdAt: -1 });
    }
    
    if (!ad) return res.json(null);


    console.log("✅ Ad found:", ad.title);

    // Increment ad views
    await Ad.findByIdAndUpdate(ad._id, { $inc: { views: 1 } });

    res.json({
      _id: ad._id,
      title: ad.title,
      videoFile: ad.videoFile,
      skipAfter: ad.skipAfter
    });
  } catch (err) {
    console.error("❌ Ad fetch error:", err);
    res.status(500).json({ message: "Ad fetch failed", error: err.message });
  }
});

/* =========================
   📊 GET ALL ADS (ADMIN)
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch ads" });
  }
});

/* =========================
   🗑️ DELETE AD (ADMIN)
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete ad" });
  }
});

/* =========================
   ✏️ UPDATE AD (ADMIN)
========================= */
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, target, targetValue, skipAfter, active, cpm, cpc } = req.body;
    
    const updateData = {
      title,
      target,
      targetValue,
      skipAfter,
      active
    };

    // 🔥 Add revenue fields if provided
    if (cpm !== undefined) updateData.cpm = Number(cpm);
    if (cpc !== undefined) updateData.cpc = Number(cpc);
    
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ad" });
  }
});

/* =========================
   📈 AD ANALYTICS (Individual)
========================= */
router.get("/analytics/:id", auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({
      title: ad.title,
      views: ad.views,
      clicks: ad.clicks,
      ctr: ad.ctr,
      cpm: ad.cpm,
      cpc: ad.cpc,
      revenue: ad.revenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

/* =========================
   💰 REVENUE DASHBOARD DATA
========================= */
router.get("/dashboard/revenue", auth, async (req, res) => {
  try {
    const ads = await Ad.find().populate("createdBy", "name email");

    // 🔥 CALCULATE OVERALL STATS
    const totalAds = ads.length;
    const activeAds = ads.filter(ad => ad.active).length;
    const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
    const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0);

    // Average CTR across all ads
    const averageCTR = totalViews > 0 
      ? ((totalClicks / totalViews) * 100).toFixed(2) 
      : 0;

    // 🔥 TOP PERFORMING ADS
    const topRevenueAds = [...ads]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(ad => ({
        _id: ad._id,
        title: ad.title,
        revenue: ad.revenue,
        views: ad.views,
        clicks: ad.clicks,
        ctr: ad.ctr
      }));

    const topClickedAds = [...ads]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(ad => ({
        _id: ad._id,
        title: ad.title,
        clicks: ad.clicks,
        views: ad.views,
        revenue: ad.revenue
      }));

    const mostViewedAds = [...ads]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(ad => ({
        _id: ad._id,
        title: ad.title,
        views: ad.views,
        clicks: ad.clicks,
        revenue: ad.revenue
      }));

    // 🔥 PER-AD BREAKDOWN
    const adBreakdown = ads.map(ad => ({
      _id: ad._id,
      title: ad.title,
      views: ad.views,
      clicks: ad.clicks,
      ctr: ad.ctr,
      cpm: ad.cpm,
      cpc: ad.cpc,
      revenue: ad.revenue,
      active: ad.active,
      target: ad.target,
      targetValue: ad.targetValue,
      createdAt: ad.createdAt
    }));

    // 🔥 REVENUE BY DATE (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAds = await Ad.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    // Group by date
    const revenueByDate = {};
    recentAds.forEach(ad => {
      const date = ad.createdAt.toISOString().split('T')[0];
      if (!revenueByDate[date]) {
        revenueByDate[date] = {
          date,
          revenue: 0,
          views: 0,
          clicks: 0
        };
      }
      revenueByDate[date].revenue += ad.revenue;
      revenueByDate[date].views += ad.views;
      revenueByDate[date].clicks += ad.clicks;
    });

    const chartData = Object.values(revenueByDate);

    // 🔥 RESPONSE
    res.json({
      overview: {
        totalAds,
        activeAds,
        totalViews,
        totalClicks,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        averageCTR: parseFloat(averageCTR)
      },
      topPerformers: {
        topRevenueAds,
        topClickedAds,
        mostViewedAds
      },
      adBreakdown,
      chartData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

/* =========================
   👆 TRACK AD CLICK
========================= */
router.post("/click/:id", async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ message: "Click tracked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to track click" });
  }
});

/* =========================
   📊 REVENUE BY CATEGORY
========================= */
router.get("/dashboard/category-revenue", auth, async (req, res) => {
  try {
    const ads = await Ad.find();

    const categoryRevenue = {};

    ads.forEach(ad => {
      const category = ad.target === "category" ? ad.targetValue : "All";
      if (!categoryRevenue[category]) {
        categoryRevenue[category] = {
          category,
          revenue: 0,
          views: 0,
          clicks: 0,
          adCount: 0
        };
      }
      categoryRevenue[category].revenue += ad.revenue;
      categoryRevenue[category].views += ad.views;
      categoryRevenue[category].clicks += ad.clicks;
      categoryRevenue[category].adCount += 1;
    });

    const result = Object.values(categoryRevenue)
      .sort((a, b) => b.revenue - a.revenue);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch category revenue" });
  }
});

module.exports = router;