// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // REGISTER (Only 1 admin create)
// router.post("/register", async (req, res) => {
//   const { name, email, password, isAdmin } = req.body;

//   const hashed = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     name,
//     email,
//     password: hashed,
//     isAdmin: isAdmin || false
//   });

//   res.json({ message: "User created", user });
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//   const token = jwt.sign(
//     { id: user._id, isAdmin: user.isAdmin },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   res.json({
//     message: "Login successful",
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       isAdmin: user.isAdmin
//     }
//   });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

// 📝 REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });
  res.json({ message: "Registered Successfully" });
});

// 🔑 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, name: user.name, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

// 👥 SUBSCRIBE / UNSUBSCRIBE
router.post("/subscribe/:id", auth, async (req, res) => {
  const channelId = req.params.id;
  const userId = req.user.id;

  if (channelId === userId) return res.status(400).json({ message: "You can't subscribe to yourself" });

  const channel = await User.findById(channelId);
  const user = await User.findById(userId);

  if (!channel || !user) return res.status(404).json({ message: "User not found" });

  const index = user.subscribedTo.indexOf(channelId);

  if (index > -1) {
    user.subscribedTo.splice(index, 1);
    channel.subscribers--;
  } else {
    user.subscribedTo.push(channelId);
    channel.subscribers++;
  }

  await user.save();
  await channel.save();

  res.json({ message: "Updated subscription", subscribers: channel.subscribers });
});

// 👤 GET PROFILE (CHANNEL PAGE)
router.get("/profile/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

module.exports = router;
