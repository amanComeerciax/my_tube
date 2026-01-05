require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

/* ================= ROUTES ================= */
const videosRoutes = require("./routes/VideoRoutes");
const streamRoutes = require("./routes/streamRoutes");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/UserRoutes");
const subscriptionRoute = require("./routes/subscriptionRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const monetizationRoutes = require("./routes/monetizationRoutes");
const walletRoutes = require("./routes/walletRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adRoutes = require("./routes/adRoutes");

/* ================= UTILS ================= */
const BloomFilter = require("./utils/bloomFilter");
const Video = require("./models/Video");

/* ================= APP ================= */
const app = express();
const bloom = new BloomFilter(8000);

// Production-ready CORS
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/captions", express.static(path.join(__dirname, "captions")));

/* ================= API ROUTES ================= */
app.use("/api/videos", videosRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscribe", subscriptionRoute);
app.use("/api/premium", premiumRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/monetization", monetizationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ads", adRoutes);
app.use("/hls", express.static(path.join(__dirname, "uploads/hls")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

/* ================= SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store active rooms and their participants
const liveRooms = new Map();

function getRoomInfo(roomId) {
  if (!liveRooms.has(roomId)) {
    liveRooms.set(roomId, {
      broadcaster: null,
      viewers: new Set(),
      messages: []
    });
  }
  return liveRooms.get(roomId);
}

function emitViewerCount(roomId) {
  const room = getRoomInfo(roomId);
  const count = room.viewers.size + (room.broadcaster ? 1 : 0);
  io.to(roomId).emit("viewer-count", count);
}

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  let currentRoom = null;

  /* 🔔 NOTIFICATION ROOM */
  socket.on("join-user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`🔔 User joined notification room: user_${userId}`);
  });

  /* 🎥 JOIN LIVE */
  socket.on("join-live", ({ roomId, userId }) => {
    currentRoom = roomId;
    socket.join(roomId);

    const room = getRoomInfo(roomId);

    if (String(userId) === String(roomId)) {
      room.broadcaster = socket.id;
      socket.to(roomId).emit("broadcaster", socket.id);
      console.log("🎥 Broadcaster joined:", socket.id);
    } else {
      room.viewers.add(socket.id);
      if (room.broadcaster) {
        socket.emit("broadcaster", room.broadcaster);
      }
      console.log("👁️ Viewer joined:", socket.id);
    }

    emitViewerCount(roomId);
  });

  /* 📡 BROADCASTER READY */
  socket.on("broadcaster-ready", (roomId) => {
    socket.to(roomId).emit("broadcaster", socket.id);
  });

  /* 👁️ VIEWER READY */
  socket.on("viewer-ready", ({ roomId }) => {
    const room = getRoomInfo(roomId);
    if (room.broadcaster) {
      io.to(room.broadcaster).emit("new-viewer", {
        viewerId: socket.id
      });
    }
  });

  /* 🔁 WEBRTC SIGNALING */
  socket.on("offer", ({ offer, to }) => {
    io.to(to).emit("offer", {
      offer,
      broadcasterId: socket.id
    });
  });

  socket.on("answer", ({ answer, to }) => {
    io.to(to).emit("answer", {
      answer,
      from: socket.id
    });
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("ice-candidate", {
      candidate,
      from: socket.id
    });
  });

  /* 💬 LIVE CHAT */
  socket.on("send-message", (data) => {
    const room = getRoomInfo(data.roomId);
    const message = {
      text: data.text,
      user: data.user,
      userId: data.userId,
      isSuperChat: data.isSuperChat || false,
      amount: data.amount || 0,
      timestamp: new Date()
    };

    room.messages.push(message);
    if (room.messages.length > 100) room.messages.shift();

    io.to(data.roomId).emit("receive-message", message);
  });

  /* ❌ DISCONNECT */
  socket.on("disconnect", () => {
    if (!currentRoom) return;

    const room = getRoomInfo(currentRoom);

    if (room.broadcaster === socket.id) {
      room.broadcaster = null;
      socket.to(currentRoom).emit("broadcaster-left");
    } else {
      room.viewers.delete(socket.id);
    }

    if (!room.broadcaster && room.viewers.size === 0) {
      liveRooms.delete(currentRoom);
    } else {
      emitViewerCount(currentRoom);
    }

    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* 🔥 GLOBAL ACCESS (workers ke liye) */
global.io = io;

/* ================= DB ================= */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    const allVideos = await Video.find();
    allVideos.forEach(v => bloom.add(v.title.toLowerCase()));
    global.videoBloom = bloom;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  });

/* ================= GRACEFUL SHUTDOWN ================= */
process.on("SIGINT", () => {
  console.log("🛑 Shutting down...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});
