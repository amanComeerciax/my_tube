// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Wallet = require("../models/Wallet");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

// /**
//  * 📌 APPLY FOR MONETIZATION
//  * POST /api/monetization/apply
//  */
// router.post("/apply", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.monetization?.status === "approved") {
//       return res.status(400).json({ message: "Channel already monetized" });
//     }

//     if (user.monetization?.status === "pending") {
//       return res.status(400).json({ message: "Monetization request already pending" });
//     }

//     const MIN_SUBSCRIBERS = 100;

//     if (user.subscribers.length < MIN_SUBSCRIBERS) {
//       return res.status(400).json({
//         message: `You need at least ${MIN_SUBSCRIBERS} subscribers to apply`,
//       });
//     }

//     user.monetization = {
//       status: "pending",
//       appliedAt: new Date(),
//       approvedAt: null,
//       rejectedReason: "",
//     };

//     await user.save();

//     res.json({
//       message: "✅ Monetization request submitted successfully",
//       monetization: user.monetization,
//     });
//   } catch (err) {
//     console.error("❌ Monetization apply error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * 📋 GET PENDING CHANNELS (ADMIN)
//  * GET /api/monetization/pending
//  */
// router.get("/pending", auth, admin, async (req, res) => {
//   try {
//     const pendingChannels = await User.find({
//       "monetization.status": "pending",
//     }).select("name email subscribers monetization createdAt");

//     res.json(pendingChannels);
//   } catch (err) {
//     console.error("❌ Fetch pending monetization error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ✅ APPROVE MONETIZATION (ADMIN)
//  * POST /api/monetization/:userId/approve
//  */
// router.post("/:userId/approve", auth, admin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);

//     if (!user) {
//       return res.status(404).json({ message: "Channel not found" });
//     }

//     if (user.monetization.status !== "pending") {
//       return res.status(400).json({
//         message: "Channel is not pending for monetization",
//       });
//     }

//     user.monetization.status = "approved";
//     user.monetization.approvedAt = new Date();
//     user.monetization.rejectedReason = "";

//     await user.save();

//     // 🔥 CREATE WALLET IF NOT EXISTS
//     const existingWallet = await Wallet.findOne({ user: user._id });

//     if (!existingWallet) {
//       await Wallet.create({
//         user: user._id,
//         totalEarnings: 0,
//         availableBalance: 0,
//         pendingBalance: 0,
//         withdrawnAmount: 0,
//       });
//     }

//     res.json({
//       message: "✅ Channel monetization approved & wallet created",
//       monetization: user.monetization,
//     });
//   } catch (err) {
//     console.error("❌ Approve monetization error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ❌ REJECT MONETIZATION (ADMIN)
//  * POST /api/monetization/:userId/reject
//  */
// router.post("/:userId/reject", auth, admin, async (req, res) => {
//   try {
//     const { reason } = req.body;

//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: "Channel not found" });
//     }

//     if (user.monetization.status !== "pending") {
//       return res.status(400).json({
//         message: "Channel is not pending for monetization",
//       });
//     }

//     user.monetization.status = "rejected";
//     user.monetization.rejectedReason = reason || "Policy violation";
//     user.monetization.approvedAt = null;

//     await user.save();

//     res.json({
//       message: "❌ Channel monetization rejected",
//       monetization: user.monetization,
//     });
//   } catch (err) {
//     console.error("❌ Reject monetization error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const CreatorEarnings = require("../models/Creatorearnings");
const AdRevenue = require("../models/Adrevenue");
const User = require("../models/User");
const Video = require("../models/Video");

/* =========================
   📊 ELIGIBILITY THRESHOLDS
========================= */
const ELIGIBILITY = {
  SUBSCRIBERS: 1,
  WATCH_HOURS: 0,
  VIDEOS_PUBLISHED: 1,
  ACCOUNT_AGE_DAYS: 0,
};

const REVENUE_SHARE = {
  CREATOR: 0.55, // 55% to creator
  PLATFORM: 0.45  // 45% to platform
};

/* =========================
   ✅ APPLY FOR MONETIZATION
========================= */
router.post("/apply", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if already applied
    let earnings = await CreatorEarnings.findOne({ creator: userId });
    
    if (earnings && earnings.isMonetized) {
      return res.status(400).json({ message: "Already monetized" });
    }
    
    if (earnings && earnings.monetizationStatus === "pending") {
      return res.status(400).json({ message: "Application already pending" });
    }
    
    // Get creator stats
    const user = await User.findById(userId);
    const videos = await Video.find({ uploadedBy: userId });
    
    // Calculate account age
    const accountAgeDays = Math.floor(
      (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );
    
    // Calculate total watch hours from all videos
    const totalWatchMinutes = user.totalWatchMinutes || 0;
    const totalWatchHours = Math.floor(totalWatchMinutes / 60);
    
    // Calculate stats
    const stats = {
      totalSubscribers: user.subscribers?.length || 0,
      totalWatchHours: totalWatchHours,
      totalVideos: videos.length,
      accountAgeDays: accountAgeDays
    };
    
    // Check eligibility
    const eligibility = {
      subscribers: stats.totalSubscribers >= ELIGIBILITY.SUBSCRIBERS,
      watchHours: stats.totalWatchHours >= ELIGIBILITY.WATCH_HOURS,
      videosPublished: stats.totalVideos >= ELIGIBILITY.VIDEOS_PUBLISHED,
      accountAge: stats.accountAgeDays >= ELIGIBILITY.ACCOUNT_AGE_DAYS
    };
    
    // Auto-approve if all criteria met
    const allEligible = Object.values(eligibility).every(v => v);
    const status = allEligible ? "approved" : "pending";
    
    // Create or update earnings record
    if (!earnings) {
      earnings = new CreatorEarnings({
        creator: userId,
        currentStats: stats,
        eligibilityMet: eligibility,
        monetizationStatus: status,
        isMonetized: allEligible,
        appliedAt: new Date(),
        approvedAt: allEligible ? new Date() : null
      });
    } else {
      earnings.currentStats = stats;
      earnings.eligibilityMet = eligibility;
      earnings.monetizationStatus = status;
      earnings.isMonetized = allEligible;
      earnings.appliedAt = new Date();
      earnings.approvedAt = allEligible ? new Date() : null;
    }
    
    await earnings.save();
    
    // Update user
    await User.findByIdAndUpdate(userId, {
      isMonetized: allEligible,
      monetizationAppliedAt: new Date(),
      creatorEarnings: earnings._id
    });
    
    res.json({
      message: allEligible 
        ? "✅ Congratulations! You're now monetized!" 
        : "📝 Application submitted. You'll be reviewed soon.",
      earnings,
      status,
      eligibilityMet: allEligible
    });
    
  } catch (err) {
    console.error("Monetization application error:", err);
    res.status(500).json({ message: "Application failed", error: err.message });
  }
});

/* =========================
   📊 GET MONETIZATION STATUS
========================= */
router.get("/status", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    let earnings = await CreatorEarnings.findOne({ creator: userId });
    
    if (!earnings) {
      // Calculate current stats for display
      const user = await User.findById(userId);
      const videos = await Video.find({ uploadedBy: userId });
      
      const accountAgeDays = Math.floor(
        (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
      );
      
      const totalWatchMinutes = user.totalWatchMinutes || 0;
      const totalWatchHours = Math.floor(totalWatchMinutes / 60);
      
      return res.json({
        applied: false,
        currentStats: {
          totalSubscribers: user.subscribers?.length || 0,
          totalWatchHours: totalWatchHours,
          totalVideos: videos.length,
          accountAgeDays: accountAgeDays
        },
        requiredThresholds: ELIGIBILITY
      });
    }
    
    res.json({
      applied: true,
      earnings,
      eligibleForPayout: earnings.eligibleForPayout
    });
    
  } catch (err) {
    console.error("Status fetch error:", err);
    res.status(500).json({ message: "Failed to fetch status" });
  }
});

/* =========================
   💰 GET EARNINGS DASHBOARD
========================= */
router.get("/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const earnings = await CreatorEarnings.findOne({ creator: userId });
    
    if (!earnings || !earnings.isMonetized) {
      return res.status(403).json({ message: "Not monetized" });
    }
    
    // Get recent ad revenue records
    const recentRevenue = await AdRevenue.find({ creator: userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .populate("video", "title")
      .populate("ad", "title");
    
    // Calculate this month's earnings
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthRevenue = await AdRevenue.aggregate([
      {
        $match: {
          creator: userId,
          timestamp: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenueShare.creatorShare" },
          totalViews: {
            $sum: { $cond: [{ $eq: ["$eventType", "view"] }, 1, 0] }
          },
          totalClicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Get top earning videos
    const topVideos = await AdRevenue.aggregate([
      {
        $match: {
          creator: userId
        }
      },
      {
        $group: {
          _id: "$video",
          totalRevenue: { $sum: "$revenueShare.creatorShare" },
          adViews: {
            $sum: { $cond: [{ $eq: ["$eventType", "view"] }, 1, 0] }
          },
          adClicks: {
            $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Populate video details
    const populatedTopVideos = await Video.populate(topVideos, {
      path: "_id",
      select: "title thumbnail views"
    });
    
    // Revenue by date (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const revenueByDate = await AdRevenue.aggregate([
      {
        $match: {
          creator: userId,
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          revenue: { $sum: "$revenueShare.creatorShare" },
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
    
    res.json({
      earnings,
      thisMonth: thisMonthRevenue[0] || {
        totalRevenue: 0,
        totalViews: 0,
        totalClicks: 0
      },
      topVideos: populatedTopVideos,
      recentRevenue: recentRevenue.slice(0, 20),
      chartData: revenueByDate
    });
    
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
});

/* =========================
   🏦 UPDATE PAYMENT INFO
========================= */
router.post("/payment-info", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { accountHolderName, bankName, accountNumber, ifscCode, upiId, panNumber } = req.body;
    
    const earnings = await CreatorEarnings.findOne({ creator: userId });
    
    if (!earnings || !earnings.isMonetized) {
      return res.status(403).json({ message: "Not monetized" });
    }
    
    // Validate required fields for India
    if (!panNumber || panNumber.length !== 10) {
      return res.status(400).json({ message: "Valid PAN number required" });
    }
    
    earnings.paymentInfo = {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
      panNumber,
      verified: true // Admin will verify
    };
    
    await earnings.save();
    
    res.json({
      message: "✅ Payment information saved",
      paymentInfo: earnings.paymentInfo
    });
    
  } catch (err) {
    console.error("Payment info error:", err);
    res.status(500).json({ message: "Failed to save payment info" });
  }
});

/* =========================
   💸 REQUEST PAYOUT
========================= */
router.post("/request-payout", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const earnings = await CreatorEarnings.findOne({ creator: userId });
    
    if (!earnings || !earnings.isMonetized) {
      return res.status(403).json({ message: "Not monetized" });
    }
    
    // Check minimum threshold
    if (earnings.earnings.pendingBalance < earnings.minPayoutThreshold) {
      return res.status(400).json({
        message: `Minimum payout is ₹${earnings.minPayoutThreshold}. Current balance: ₹${earnings.earnings.pendingBalance.toFixed(2)}`
      });
    }
    
    // Check payment info
    if (!earnings.paymentInfo.verified) {
      return res.status(400).json({
        message: "Please add and verify payment information first"
      });
    }
    
    // Create payout request
    const currentMonth = new Date().toISOString().slice(0, 7); // "2025-01"
    
    earnings.paymentHistory.push({
      amount: earnings.earnings.pendingBalance,
      month: currentMonth,
      status: "pending"
    });
    
    await earnings.save();
    
    res.json({
      message: "✅ Payout requested successfully",
      amount: earnings.earnings.pendingBalance,
      note: "Payment will be processed within 7-10 business days"
    });
    
  } catch (err) {
    console.error("Payout request error:", err);
    res.status(500).json({ message: "Failed to request payout" });
  }
});

/* =========================
   📜 GET PAYMENT HISTORY
========================= */
router.get("/payment-history", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const earnings = await CreatorEarnings.findOne({ creator: userId });
    
    if (!earnings) {
      return res.json({ paymentHistory: [] });
    }
    
    res.json({
      paymentHistory: earnings.paymentHistory.sort((a, b) => 
        new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt)
      )
    });
    
  } catch (err) {
    console.error("Payment history error:", err);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
});

/* =========================
   📊 ADMIN: GET ALL CREATORS
========================= */
router.get("/admin/creators", auth, async (req, res) => {
  try {
    // TODO: Add admin check middleware
    
    const creators = await CreatorEarnings.find()
      .populate("creator", "name email username")
      .sort({ "earnings.totalEarnings": -1 });
    
    res.json(creators);
    
  } catch (err) {
    console.error("Admin creators error:", err);
    res.status(500).json({ message: "Failed to fetch creators" });
  }
});

/* =========================
   ✅ ADMIN: APPROVE/REJECT
========================= */
router.post("/admin/review/:id", auth, async (req, res) => {
  try {
    // TODO: Add admin check middleware
    
    const { status } = req.body; // "approved" or "rejected"
    
    const earnings = await CreatorEarnings.findById(req.params.id);
    
    if (!earnings) {
      return res.status(404).json({ message: "Creator not found" });
    }
    
    earnings.monetizationStatus = status;
    earnings.isMonetized = status === "approved";
    
    if (status === "approved") {
      earnings.approvedAt = new Date();
      await User.findByIdAndUpdate(earnings.creator, { isMonetized: true });
    } else {
      earnings.rejectedAt = new Date();
      await User.findByIdAndUpdate(earnings.creator, { isMonetized: false });
    }
    
    await earnings.save();
    
    res.json({
      message: `Creator ${status}`,
      earnings
    });
    
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Failed to review application" });
  }
});

/* =========================
   💳 ADMIN: PROCESS PAYOUT
========================= */
router.post("/admin/process-payout/:earningsId/:paymentId", auth, async (req, res) => {
  try {
    // TODO: Add admin check middleware
    
    const { transactionId } = req.body;
    
    const earnings = await CreatorEarnings.findById(req.params.earningsId);
    
    if (!earnings) {
      return res.status(404).json({ message: "Creator not found" });
    }
    
    const payment = earnings.paymentHistory.id(req.params.paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Update payment status
    payment.status = "completed";
    payment.paidAt = new Date();
    payment.transactionId = transactionId;
    
    // Update earnings
    earnings.earnings.totalPaidOut += payment.amount;
    earnings.earnings.pendingBalance -= payment.amount;
    
    await earnings.save();
    
    res.json({
      message: "✅ Payout processed",
      payment
    });
    
  } catch (err) {
    console.error("Process payout error:", err);
    res.status(500).json({ message: "Failed to process payout" });
  }
});

module.exports = router;