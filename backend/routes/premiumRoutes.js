const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 💳 CREATE ORDER
router.post("/create-order", auth, async (req, res) => {
  const order = await razorpay.orders.create({
    amount: 9900, // ₹99
    currency: "INR",
    receipt: `premium_${req.user.id}`,
  });

  res.json(order);
});

// ✅ VERIFY PAYMENT
router.post("/verify", auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const user = await User.findById(req.user.id);
  user.isPremium = true;
  user.premiumUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await user.save();

  res.json({ message: "Premium activated", premiumUntil: user.premiumUntil });
});

module.exports = router;
