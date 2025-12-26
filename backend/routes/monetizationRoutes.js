const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * 📌 APPLY FOR MONETIZATION
 * POST /api/monetization/apply
 */
router.post("/apply", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Already approved
    if (user.monetization?.status === "approved") {
      return res.status(400).json({
        message: "Channel already monetized",
      });
    }

    // ❌ Already pending
    if (user.monetization?.status === "pending") {
      return res.status(400).json({
        message: "Monetization request already pending",
      });
    }

    // ✅ ELIGIBILITY CHECK (simple & clean)
    const MIN_SUBSCRIBERS = 100;

    if (user.subscribers.length < MIN_SUBSCRIBERS) {
      return res.status(400).json({
        message: `You need at least ${MIN_SUBSCRIBERS} subscribers to apply`,
      });
    }

    // ✅ APPLY
    user.monetization = {
      status: "pending",
      appliedAt: new Date(),
      approvedAt: null,
      rejectedReason: "",
    };

    await user.save();

    res.json({
      message: "✅ Monetization request submitted successfully",
      monetization: user.monetization,
    });

  } catch (err) {
    console.error("❌ Monetization apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pending", auth, admin, async (req, res) => {
    try {
      const pendingChannels = await User.find({
        "monetization.status": "pending",
      }).select("name email subscribers monetization createdAt");
  
      res.json(pendingChannels);
    } catch (err) {
      console.error("❌ Fetch pending monetization error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
 * ✅ APPROVE MONETIZATION (ADMIN)
 * POST /api/monetization/:userId/approve
 */
router.post("/:userId/approve", auth, admin, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: "Channel not found" });
      }
  
      if (user.monetization.status !== "pending") {
        return res.status(400).json({
          message: "Channel is not pending for monetization",
        });
      }
  
      user.monetization.status = "approved";
      user.monetization.approvedAt = new Date();
      user.monetization.rejectedReason = "";
  
      await user.save();
  
      res.json({
        message: "✅ Channel monetization approved",
        monetization: user.monetization,
      });
    } catch (err) {
      console.error("❌ Approve monetization error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
 * ❌ REJECT MONETIZATION (ADMIN)
 * POST /api/monetization/:userId/reject
 */
router.post("/:userId/reject", auth, admin, async (req, res) => {
    try {
      const { reason } = req.body;
  
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "Channel not found" });
      }
  
      if (user.monetization.status !== "pending") {
        return res.status(400).json({
          message: "Channel is not pending for monetization",
        });
      }
  
      user.monetization.status = "rejected";
      user.monetization.rejectedReason = reason || "Policy violation";
      user.monetization.approvedAt = null;
  
      await user.save();
  
      res.json({
        message: "❌ Channel monetization rejected",
        monetization: user.monetization,
      });
    } catch (err) {
      console.error("❌ Reject monetization error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
