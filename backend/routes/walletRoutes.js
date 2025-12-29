const express = require("express");
const router = express.Router();

const Wallet = require("../models/Wallet");
const User = require("../models/User");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* =========================
   👤 GET MY WALLET
========================= */
router.get("/me", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wallet" });
  }
});

/* =========================
   💸 REQUEST WITHDRAW
========================= */
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount, method, details } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (amount > wallet.availableBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Move money to pending
    wallet.availableBalance -= amount;
    wallet.pendingBalance += amount;

    // Create withdraw request
    wallet.withdrawRequests.push({
      amount,
      method,
      details,
    });

    // Transaction log
    wallet.transactions.push({
      type: "debit",
      amount,
      reason: "Withdraw requested",
    });

    await wallet.save();

    res.json({
      message: "✅ Withdraw request submitted",
      wallet,
    });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ message: "Withdraw failed" });
  }
});

/* =========================
   🧑‍💼 ADMIN → APPROVE WITHDRAW
========================= */
router.post("/withdraw/:userId/approve", auth, admin, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const request = wallet.withdrawRequests.find(
      (r) => r.status === "pending"
    );

    if (!request) {
      return res.status(400).json({ message: "No pending request" });
    }

    request.status = "approved";
    wallet.pendingBalance -= request.amount;
    wallet.withdrawnAmount += request.amount;

    wallet.transactions.push({
      type: "debit",
      amount: request.amount,
      reason: "Withdraw approved",
    });

    await wallet.save();

    res.json({
      message: "✅ Withdraw approved",
      wallet,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
});

/* =========================
   🧑‍💼 ADMIN → REJECT WITHDRAW
========================= */
router.post("/withdraw/:userId/reject", auth, admin, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const request = wallet.withdrawRequests.find(
      (r) => r.status === "pending"
    );

    if (!request) {
      return res.status(400).json({ message: "No pending request" });
    }

    request.status = "rejected";

    // Refund money back
    wallet.pendingBalance -= request.amount;
    wallet.availableBalance += request.amount;

    wallet.transactions.push({
      type: "credit",
      amount: request.amount,
      reason: "Withdraw rejected (refund)",
    });

    await wallet.save();

    res.json({
      message: "❌ Withdraw rejected",
      wallet,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rejection failed" });
  }
});

module.exports = router;
