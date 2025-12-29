


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

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const Ad = require("../models/Ad");
// const Video = require("../models/Video");
// const auth = require("../middleware/auth");
// const User = require("../models/User");

// const authOptional = require("../middleware/authOptional");
// const path = require("path");
// const { getUserTopInterest } = require("../utils/userInterest");

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
//     const { title, target, targetValue, skipAfter, cpm, cpc } = req.body;

//     const ad = await Ad.create({
//       title,
//       videoFile: req.file.filename,
//       target,
//       targetValue,
//       skipAfter: Number(skipAfter || 5),
//       cpm: Number(cpm || 50),  // 🔥 NEW
//       cpc: Number(cpc || 2),   // 🔥 NEW
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
// // router.get("/:videoId", async (req, res) => {
//   router.get("/:videoId", authOptional, async (req, res) => {

//   try {
//     console.log("🎯 Fetching ad for video:", req.params.videoId);

//     const video = await Video.findById(req.params.videoId);

//     if (!video) {
//       console.log("⚠️ Video not found");
//       return res.json(null);
//     }

//     console.log("📹 Video found:", video.title, "Category:", video.category);

//     // Try to find an ad for this video's category
//     // let ad = await Ad.findOne({
//     //   active: true,
//     //   target: "category",
//     //   targetValue: video.category
//     // }).sort({ createdAt: -1 });

//     // // If no category-specific ad, try "all" target
//     // if (!ad) {
//     //   console.log("⚠️ No category ad found, checking for 'all' target");
//     //   ad = await Ad.findOne({
//     //     active: true,
//     //     target: "all"
//     //   }).sort({ createdAt: -1 });
//     // }

//     // if (!ad) {
//     //   console.log("⚠️ No ad available");
//     //   return res.json(null);
//     // }

//     let ad = null;

//     // 1️⃣ Premium user → no ads
//     if (req.user) {
//       const user = await User.findById(req.user.id);
    
//       if (user?.isPremium) {
//         return res.json(null);
//       }
    
//       // 2️⃣ User interest based ad
//       const interest = await getUserTopInterest(user);
    
//       if (interest) {
//         ad = await Ad.findOne({
//           active: true,
//           target: "category",
//           targetValue: interest
//         }).sort({ createdAt: -1 });
//       }
//     }
    
//     // 3️⃣ Video category fallback
//     if (!ad) {
//       ad = await Ad.findOne({
//         active: true,
//         target: "category",
//         targetValue: video.category
//       }).sort({ createdAt: -1 });
//     }
    
//     // 4️⃣ All users fallback
//     if (!ad) {
//       ad = await Ad.findOne({
//         active: true,
//         target: "all"
//       }).sort({ createdAt: -1 });
//     }
    
//     if (!ad) return res.json(null);


//     console.log("✅ Ad found:", ad.title);

//     // Increment ad views
//     await Ad.findByIdAndUpdate(ad._id, { $inc: { views: 1 } });

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
//     const ads = await Ad.find()
//       .populate("createdBy", "name email")
//       .sort({ createdAt: -1 });
    
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
//     const { title, target, targetValue, skipAfter, active, cpm, cpc } = req.body;
    
//     const updateData = {
//       title,
//       target,
//       targetValue,
//       skipAfter,
//       active
//     };

//     // 🔥 Add revenue fields if provided
//     if (cpm !== undefined) updateData.cpm = Number(cpm);
//     if (cpc !== undefined) updateData.cpc = Number(cpc);
    
//     const ad = await Ad.findByIdAndUpdate(
//       req.params.id,
//       updateData,
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
//    📈 AD ANALYTICS (Individual)
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
//       ctr: ad.ctr,
//       cpm: ad.cpm,
//       cpc: ad.cpc,
//       revenue: ad.revenue
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch analytics" });
//   }
// });

// /* =========================
//    💰 REVENUE DASHBOARD DATA
// ========================= */
// router.get("/dashboard/revenue", auth, async (req, res) => {
//   try {
//     const ads = await Ad.find().populate("createdBy", "name email");

//     // 🔥 CALCULATE OVERALL STATS
//     const totalAds = ads.length;
//     const activeAds = ads.filter(ad => ad.active).length;
//     const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
//     const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
//     const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0);

//     // Average CTR across all ads
//     const averageCTR = totalViews > 0 
//       ? ((totalClicks / totalViews) * 100).toFixed(2) 
//       : 0;

//     // 🔥 TOP PERFORMING ADS
//     const topRevenueAds = [...ads]
//       .sort((a, b) => b.revenue - a.revenue)
//       .slice(0, 5)
//       .map(ad => ({
//         _id: ad._id,
//         title: ad.title,
//         revenue: ad.revenue,
//         views: ad.views,
//         clicks: ad.clicks,
//         ctr: ad.ctr
//       }));

//     const topClickedAds = [...ads]
//       .sort((a, b) => b.clicks - a.clicks)
//       .slice(0, 5)
//       .map(ad => ({
//         _id: ad._id,
//         title: ad.title,
//         clicks: ad.clicks,
//         views: ad.views,
//         revenue: ad.revenue
//       }));

//     const mostViewedAds = [...ads]
//       .sort((a, b) => b.views - a.views)
//       .slice(0, 5)
//       .map(ad => ({
//         _id: ad._id,
//         title: ad.title,
//         views: ad.views,
//         clicks: ad.clicks,
//         revenue: ad.revenue
//       }));

//     // 🔥 PER-AD BREAKDOWN
//     const adBreakdown = ads.map(ad => ({
//       _id: ad._id,
//       title: ad.title,
//       views: ad.views,
//       clicks: ad.clicks,
//       ctr: ad.ctr,
//       cpm: ad.cpm,
//       cpc: ad.cpc,
//       revenue: ad.revenue,
//       active: ad.active,
//       target: ad.target,
//       targetValue: ad.targetValue,
//       createdAt: ad.createdAt
//     }));

//     // 🔥 REVENUE BY DATE (Last 30 days)
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const recentAds = await Ad.find({
//       createdAt: { $gte: thirtyDaysAgo }
//     }).sort({ createdAt: 1 });

//     // Group by date
//     const revenueByDate = {};
//     recentAds.forEach(ad => {
//       const date = ad.createdAt.toISOString().split('T')[0];
//       if (!revenueByDate[date]) {
//         revenueByDate[date] = {
//           date,
//           revenue: 0,
//           views: 0,
//           clicks: 0
//         };
//       }
//       revenueByDate[date].revenue += ad.revenue;
//       revenueByDate[date].views += ad.views;
//       revenueByDate[date].clicks += ad.clicks;
//     });

//     const chartData = Object.values(revenueByDate);

//     // 🔥 RESPONSE
//     res.json({
//       overview: {
//         totalAds,
//         activeAds,
//         totalViews,
//         totalClicks,
//         totalRevenue: parseFloat(totalRevenue.toFixed(2)),
//         averageCTR: parseFloat(averageCTR)
//       },
//       topPerformers: {
//         topRevenueAds,
//         topClickedAds,
//         mostViewedAds
//       },
//       adBreakdown,
//       chartData
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch dashboard data" });
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

// /* =========================
//    📊 REVENUE BY CATEGORY
// ========================= */
// router.get("/dashboard/category-revenue", auth, async (req, res) => {
//   try {
//     const ads = await Ad.find();

//     const categoryRevenue = {};

//     ads.forEach(ad => {
//       const category = ad.target === "category" ? ad.targetValue : "All";
//       if (!categoryRevenue[category]) {
//         categoryRevenue[category] = {
//           category,
//           revenue: 0,
//           views: 0,
//           clicks: 0,
//           adCount: 0
//         };
//       }
//       categoryRevenue[category].revenue += ad.revenue;
//       categoryRevenue[category].views += ad.views;
//       categoryRevenue[category].clicks += ad.clicks;
//       categoryRevenue[category].adCount += 1;
//     });

//     const result = Object.values(categoryRevenue)
//       .sort((a, b) => b.revenue - a.revenue);

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch category revenue" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const multer = require("multer");
const Ad = require("../models/Ad");
const Video = require("../models/Video");
const AdRevenue = require("../models/Adrevenue");
const CreatorEarnings = require("../models/Creatorearnings");
const auth = require("../middleware/auth");
const User = require("../models/User");
const authOptional = require("../middleware/authOptional");
const path = require("path");
const { getUserTopInterest } = require("../utils/userInterest");

// Revenue share constants
const REVENUE_SHARE = {
  CREATOR: 0.55, // 55% to creator
  PLATFORM: 0.45  // 45% to platform
};

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
      cpm: Number(cpm || 50),
      cpc: Number(cpc || 2),
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
   🎯 FETCH AD FOR VIDEO (WITH REVENUE TRACKING)
========================= */
router.get("/:videoId", authOptional, async (req, res) => {
  try {
    console.log("🎯 Fetching ad for video:", req.params.videoId);

    const video = await Video.findById(req.params.videoId).populate("uploadedBy");

    if (!video) {
      console.log("⚠️ Video not found");
      return res.json(null);
    }

    console.log("📹 Video found:", video.title, "Category:", video.category);

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

    // 🔥 TRACK AD VIEW & REVENUE
    await trackAdView(ad._id, video._id, video.uploadedBy._id, req.user?.id);

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
   🔥 TRACK AD VIEW & CALCULATE REVENUE
========================= */
async function trackAdView(adId, videoId, creatorId, viewerId) {
  try {
    // Get ad details
    const ad = await Ad.findById(adId);
    if (!ad) return;

    // Increment view count
    await Ad.findByIdAndUpdate(adId, { $inc: { views: 1 } });

    // Calculate CPM revenue (per 1000 views)
    const cpmRevenue = ad.cpm / 1000;

    // Calculate revenue share
    const creatorShare = cpmRevenue * REVENUE_SHARE.CREATOR;
    const platformShare = cpmRevenue * REVENUE_SHARE.PLATFORM;

    // Get video and creator details
    const video = await Video.findById(videoId);
    const creator = await User.findById(creatorId);

    // Only track revenue if creator is monetized
    if (creator && creator.isMonetized) {
      // Create revenue record
      await AdRevenue.create({
        ad: adId,
        video: videoId,
        creator: creatorId,
        viewer: viewerId,
        eventType: "view",
        revenue: {
          amount: cpmRevenue,
          type: "CPM",
          rate: ad.cpm
        },
        revenueShare: {
          creatorShare,
          platformShare,
          creatorPercentage: REVENUE_SHARE.CREATOR * 100,
          platformPercentage: REVENUE_SHARE.PLATFORM * 100
        },
        metadata: {
          adTitle: ad.title,
          videoTitle: video.title,
          category: video.category
        }
      });

      // Update creator earnings
      await CreatorEarnings.findOneAndUpdate(
        { creator: creatorId },
        {
          $inc: {
            "earnings.totalEarnings": creatorShare,
            "earnings.thisMonth": creatorShare,
            "earnings.fromCPM": creatorShare,
            "earnings.pendingBalance": creatorShare,
            "adPerformance.totalAdViews": 1
          }
        }
      );

      console.log(`💰 Creator earned ₹${creatorShare.toFixed(4)} from ad view`);
    }

  } catch (err) {
    console.error("❌ Error tracking ad view:", err);
  }
}

/* =========================
   👆 TRACK AD CLICK (WITH REVENUE)
========================= */
router.post("/click/:id", authOptional, async (req, res) => {
  try {
    const { videoId } = req.body; // Pass videoId from frontend

    if (!videoId) {
      return res.status(400).json({ message: "Video ID required" });
    }

    // Get ad and video details
    const ad = await Ad.findById(req.params.id);
    const video = await Video.findById(videoId).populate("uploadedBy");

    if (!ad || !video) {
      return res.status(404).json({ message: "Ad or video not found" });
    }

    // Increment click count
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });

    // Calculate CPC revenue
    const cpcRevenue = ad.cpc;
    const creatorShare = cpcRevenue * REVENUE_SHARE.CREATOR;
    const platformShare = cpcRevenue * REVENUE_SHARE.PLATFORM;

    // Only track revenue if creator is monetized
    if (video.uploadedBy.isMonetized) {
      // Create revenue record
      await AdRevenue.create({
        ad: ad._id,
        video: video._id,
        creator: video.uploadedBy._id,
        viewer: req.user?.id,
        eventType: "click",
        revenue: {
          amount: cpcRevenue,
          type: "CPC",
          rate: ad.cpc
        },
        revenueShare: {
          creatorShare,
          platformShare,
          creatorPercentage: REVENUE_SHARE.CREATOR * 100,
          platformPercentage: REVENUE_SHARE.PLATFORM * 100
        },
        metadata: {
          adTitle: ad.title,
          videoTitle: video.title,
          category: video.category
        }
      });

      // Update creator earnings
      await CreatorEarnings.findOneAndUpdate(
        { creator: video.uploadedBy._id },
        {
          $inc: {
            "earnings.totalEarnings": creatorShare,
            "earnings.thisMonth": creatorShare,
            "earnings.fromCPC": creatorShare,
            "earnings.pendingBalance": creatorShare,
            "adPerformance.totalAdClicks": 1
          }
        }
      );

      // Update CTR
      const earnings = await CreatorEarnings.findOne({ creator: video.uploadedBy._id });
      if (earnings) {
        const ctr = earnings.adPerformance.totalAdViews > 0
          ? (earnings.adPerformance.totalAdClicks / earnings.adPerformance.totalAdViews) * 100
          : 0;
        
        earnings.adPerformance.averageCTR = parseFloat(ctr.toFixed(2));
        await earnings.save();
      }

      console.log(`💰 Creator earned ₹${creatorShare.toFixed(2)} from ad click`);
    }

    res.json({ 
      message: "Click tracked",
      revenue: video.uploadedBy.isMonetized ? creatorShare : 0
    });

  } catch (err) {
    console.error("❌ Click tracking error:", err);
    res.status(500).json({ message: "Failed to track click" });
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

    // Calculate total revenue generated by this ad
    const totalRevenue = await AdRevenue.aggregate([
      { $match: { ad: ad._id } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue.amount" },
          creatorRevenue: { $sum: "$revenueShare.creatorShare" },
          platformRevenue: { $sum: "$revenueShare.platformShare" }
        }
      }
    ]);

    res.json({
      title: ad.title,
      views: ad.views,
      clicks: ad.clicks,
      ctr: ad.ctr,
      cpm: ad.cpm,
      cpc: ad.cpc,
      revenue: ad.revenue,
      revenueBreakdown: totalRevenue[0] || {
        totalRevenue: 0,
        creatorRevenue: 0,
        platformRevenue: 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

/* =========================
   💰 REVENUE DASHBOARD DATA (ADMIN)
========================= */
router.get("/dashboard/revenue", auth, async (req, res) => {
  try {
    const ads = await Ad.find().populate("createdBy", "name email");

    // Calculate overall stats
    const totalAds = ads.length;
    const activeAds = ads.filter(ad => ad.active).length;
    const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
    const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0);

    const averageCTR = totalViews > 0 
      ? ((totalClicks / totalViews) * 100).toFixed(2) 
      : 0;

    // Get platform revenue (45% of total)
    const platformRevenue = await AdRevenue.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$revenueShare.platformShare" }
        }
      }
    ]);

    // Get creator revenue (55% of total)
    const creatorRevenue = await AdRevenue.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$revenueShare.creatorShare" }
        }
      }
    ]);

    // Top performing ads
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

    // Per-ad breakdown
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

    // Revenue by date (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueByDate = await AdRevenue.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          revenue: { $sum: "$revenue.amount" },
          creatorRevenue: { $sum: "$revenueShare.creatorShare" },
          platformRevenue: { $sum: "$revenueShare.platformShare" },
          views: {
            $sum: { $cond: [{ $eq: ["$eventType", "view"] }, 1, 0] }
          },
          clicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const chartData = revenueByDate.map(item => ({
      date: item._id,
      revenue: parseFloat(item.revenue.toFixed(2)),
      creatorRevenue: parseFloat(item.creatorRevenue.toFixed(2)),
      platformRevenue: parseFloat(item.platformRevenue.toFixed(2)),
      views: item.views,
      clicks: item.clicks
    }));

    // Response
    res.json({
      overview: {
        totalAds,
        activeAds,
        totalViews,
        totalClicks,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        platformRevenue: parseFloat((platformRevenue[0]?.total || 0).toFixed(2)),
        creatorRevenue: parseFloat((creatorRevenue[0]?.total || 0).toFixed(2)),
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
   📊 REVENUE BY CATEGORY
========================= */
router.get("/dashboard/category-revenue", auth, async (req, res) => {
  try {
    const categoryRevenue = await AdRevenue.aggregate([
      {
        $group: {
          _id: "$metadata.category",
          revenue: { $sum: "$revenue.amount" },
          creatorRevenue: { $sum: "$revenueShare.creatorShare" },
          platformRevenue: { $sum: "$revenueShare.platformShare" },
          views: {
            $sum: { $cond: [{ $eq: ["$eventType", "view"] }, 1, 0] }
          },
          clicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] }
          },
          adCount: { $sum: 1 }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    const result = categoryRevenue.map(cat => ({
      category: cat._id || "All",
      revenue: parseFloat(cat.revenue.toFixed(2)),
      creatorRevenue: parseFloat(cat.creatorRevenue.toFixed(2)),
      platformRevenue: parseFloat(cat.platformRevenue.toFixed(2)),
      views: cat.views,
      clicks: cat.clicks,
      adCount: cat.adCount
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch category revenue" });
  }
});

module.exports = router;