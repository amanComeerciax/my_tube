// require ('dotenv').config();
// const express = require('express');
// const { default: mongoose } = require('mongoose');
// const videosRoutes = require('./routes/VideoRoutes');
// const streamRoutes = require('./routes/streamRoutes');
// const authRoutes  = require('./routes/authRoutes');
// const searchRoutes = require("./routes/searchRoutes");
// const cors = require('cors');
// const BloomFilter = require("./utils/bloomFilter");
// const Video = require("./models/Video");
// const commentRoutes  = require('./routes/commentRoutes');
// const userRoutes = require('./routes/UserRoutes');
// const subscriptionRoute = require('./routes/subscriptionRoutes');
// const path = require("path");

// const bloom = new BloomFilter(8000); // bigger size = less false positive



// const app = express();
// app.use(cors());
// app.use(express.json());
// // app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// app.get('/',(req,res) => res.send('My_tube Running '));
// app.use('/api/videos',videosRoutes);
// app.use('/api/stream',streamRoutes);
// app.use('/api/auth',authRoutes);
// app.use("/api/search", searchRoutes);
// app.use('/api/comments',commentRoutes);
// app.use('/api/user',userRoutes);
// app.use('api/subscribe',subscriptionRoute);
// app.use("/captions", express.static(path.join(__dirname, "captions")));


// const PORT  = process.env.PORT || 5000;



// // mongoose.connect(process.env.MONGO_URI)
// //   .then(async() => {
// //     console.log('MongoDB connected');
// //     const allVideos = await Video.find();
// //     allVideos.forEach(v = bloom.add(v.title.toLowerCase()));
// //     global.videoBloom = bloom;
// //     console.log("Bloom Is Loded")
// //     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //   })
// //   .catch(err => console.error(err));

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log("MongoDB connected");

//     // Load existing titles into bloom filter
//     const allVideos = await Video.find();
//     allVideos.forEach((video) => bloom.add(video.title.toLowerCase()));

//     console.log("🌸 Bloom filter loaded");

//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.error(err));



// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");
// const http = require("http");
// const { Server } = require("socket.io");

// const videosRoutes = require("./routes/VideoRoutes");
// const streamRoutes = require("./routes/streamRoutes");
// const authRoutes = require("./routes/authRoutes");
// const searchRoutes = require("./routes/searchRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const userRoutes = require("./routes/UserRoutes");
// const subscriptionRoute = require("./routes/subscriptionRoutes");
// const premiumRoutes = require("./routes/premiumRoutes");


// const BloomFilter = require("./utils/bloomFilter");
// const Video = require("./models/Video");


// const bloom = new BloomFilter(8000);

// const app = express();

// /* ================= MIDDLEWARES ================= */
// app.use(cors());
// app.use(express.json());

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // app.use("/captions", express.static(path.join(__dirname, "captions")));

// /* ================= ROUTES ================= */
// app.get("/", (req, res) => res.send("My_tube Running"));

// app.get("/captions/:file", (req, res) => {
//   const filePath = path.join(__dirname, "captions", req.params.file);

//   if (!require("fs").existsSync(filePath)) {
//     return res.status(404).send("Caption file not found");
//   }

//   res.setHeader("Content-Type", "text/vtt; charset=utf-8");
//   res.setHeader("Cache-Control", "no-cache");
//   res.sendFile(filePath);
// });


// app.use("/api/videos", videosRoutes);
// app.use("/api/stream", streamRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/search", searchRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/subscribe", subscriptionRoute);
// app.use("/api/premium", premiumRoutes);
// app.use("/api/ads", require("./routes/adRoutes"));








// /* ================= HTTP + SOCKET SERVER ================= */
// const server = http.createServer(app);

// // const io = new Server(server, {
// //   cors: {
// //     origin: "http://localhost:3000",
// //     methods: ["GET", "POST"]
// //   }
// // });
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// io.on("connection", (socket) => {
//   console.log("🟢 WebSocket connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("🔴 WebSocket disconnected:", socket.id);
//   });
// });

// /* 🔥 GLOBAL ACCESS (workers ke liye) */
// global.io = io;

// /* ================= DB + START ================= */
// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log("MongoDB connected");

//     const allVideos = await Video.find();
//     allVideos.forEach(v => bloom.add(v.title.toLowerCase()));

//     global.videoBloom = bloom;
//     console.log("🌸 Bloom filter loaded");

//     // server.listen(PORT, () =>
//     //   console.log(`🚀 Server running on port ${PORT}`)
//     // );
//     server.listen(PORT, "0.0.0.0", () =>
//       console.log(`🚀 Server running on port ${PORT}`)
//     );
    
//   })
//   .catch(err => console.error(err));

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");
// const http = require("http");
// const { Server } = require("socket.io");

// const videosRoutes = require("./routes/VideoRoutes");
// const streamRoutes = require("./routes/streamRoutes");
// const authRoutes = require("./routes/authRoutes");
// const searchRoutes = require("./routes/searchRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const userRoutes = require("./routes/UserRoutes");
// const subscriptionRoute = require("./routes/subscriptionRoutes");
// const premiumRoutes = require("./routes/premiumRoutes");
// const monetizationRoutes = require("./routes/monetizationRoutes");
// const walletRoutes = require("./routes/walletRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");

// const BloomFilter = require("./utils/bloomFilter");
// const Video = require("./models/Video");

// const bloom = new BloomFilter(8000);
// const app = express();

// app.use(cors());
// app.use(express.json());


// /* ================= ROUTES ================= */
// app.use("/api/videos", videosRoutes);
// app.use("/api/stream", streamRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/search", searchRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/subscribe", subscriptionRoute);
// app.use("/api/premium", premiumRoutes);
// app.use("/api/wallet",walletRoutes);
// app.use("/api/ads", require("./routes/adRoutes"));
// app.use("/api/monetization", monetizationRoutes);
// app.use("/api/notifications", notificationRoutes);

// app.use("/captions", express.static(path.join(__dirname, "captions")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));





// const server = http.createServer(app);

// /* ================= SOCKET.IO LIVE ENGINE ================= */
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   },
//   pingTimeout: 60000,
//   pingInterval: 25000
// });

// // Store active rooms and their participants
// const liveRooms = new Map();

// // Helper function to get room info
// function getRoomInfo(roomId) {
//   if (!liveRooms.has(roomId)) {
//     liveRooms.set(roomId, {
//       broadcaster: null,
//       viewers: new Set(),
//       messages: []
//     });
//   }
//   return liveRooms.get(roomId);
// }

// // Helper function to emit viewer count
// function emitViewerCount(roomId) {
//   const room = getRoomInfo(roomId);
//   const count = room.viewers.size + (room.broadcaster ? 1 : 0);
//   io.to(roomId).emit("viewer-count", count);
//   console.log(`👥 Room ${roomId}: ${count} participants`);
// }

// io.on("connection", (socket) => {
//   console.log("🟢 WebSocket connected:", socket.id);
  
//   let currentRoom = null;
//   let isBroadcaster = false;

//   // Join Live Room
//   socket.on("join-live", ({ roomId, userId, userName }) => {
//     try {
//       currentRoom = roomId;
//       socket.join(roomId);
      
//       const room = getRoomInfo(roomId);
      
//       // Check if this user is the broadcaster (userId matches roomId)
//       if (String(userId) === String(roomId)) {
//         // This is the broadcaster
//         if (room.broadcaster && room.broadcaster !== socket.id) {
//           // Another broadcaster is already active
//           socket.emit("error", { message: "A broadcaster is already active in this room" });
//           return;
//         }
//         room.broadcaster = socket.id;
//         isBroadcaster = true;
//         console.log(`🎥 Broadcaster ${socket.id} joined Room: ${roomId}`);
        
//         // Notify all viewers that broadcaster is here
//         socket.to(roomId).emit("broadcaster", socket.id);
//       } else {
//         // This is a viewer
//         room.viewers.add(socket.id);
//         console.log(`👁️ Viewer ${socket.id} joined Room: ${roomId}`);
        
//         // If broadcaster exists, notify the new viewer
//         if (room.broadcaster) {
//           socket.emit("broadcaster", room.broadcaster);
//         }
//       }
      
//       // Send existing messages to the new user
//       if (room.messages.length > 0) {
//         socket.emit("chat-history", room.messages);
//       }
      
//       // Update viewer count for everyone
//       emitViewerCount(roomId);
      
//     } catch (err) {
//       console.error("❌ Error joining room:", err);
//       socket.emit("error", { message: "Failed to join room" });
//     }
//   });

//   // Broadcaster is ready to stream
//   socket.on("broadcaster-ready", (roomId) => {
//     console.log("📡 Broadcaster ready:", socket.id);
//     const room = getRoomInfo(roomId);
    
//     if (room.broadcaster === socket.id) {
//       // Notify all viewers
//       socket.to(roomId).emit("broadcaster", socket.id);
//       console.log(`✅ Notified ${room.viewers.size} viewers about broadcaster`);
//     }
//   });

//   // Viewer is ready to receive stream
//   socket.on("viewer-ready", ({ roomId, viewerId }) => {
//     console.log(`📺 Viewer ${viewerId} ready to receive stream`);
//     const room = getRoomInfo(roomId);
    
//     if (room.broadcaster) {
//       // Tell broadcaster to send offer to this viewer
//       io.to(room.broadcaster).emit("new-viewer", { viewerId: socket.id });
//     }
//   });

//   // WebRTC Signaling - Offer (from broadcaster to viewer)
//   socket.on("offer", ({ offer, roomId, to }) => {
//     console.log(`📤 Relaying offer from ${socket.id} to ${to}`);
//     io.to(to).emit("offer", {
//       offer,
//       broadcasterId: socket.id
//     });
//   });

//   // WebRTC Signaling - Answer (from viewer to broadcaster)
//   // socket.on("answer", ({ answer, roomId, to }) => {


//   //   console.log(`📤 Relaying answer from ${socket.id} to ${to}`);
//   //   io.to(to).emit("answer", answer);
//   // });

//   socket.on("answer", ({ answer, roomId, to }) => {
//     console.log(`📤 Relaying answer from ${socket.id} to ${to}`);
//     io.to(to).emit("answer", {
//       answer,
//       from: socket.id // CRITICAL: Tell broadcaster who sent this
//     });
//   });

  
// // 🔴 NEW VIEWER JOINED → BROADCASTER SEND OFFER
// // socket.on("new-viewer", async ({ viewerId }) => {
// //   if (!localStreamRef.current) return;

// //   console.log("📤 New viewer joined, creating offer for:", viewerId);

// //   const pc = new RTCPeerConnection(ICE_SERVERS);
// //   peerConnectionRef.current = pc;

// //   // add tracks
// //   localStreamRef.current.getTracks().forEach(track => {
// //     pc.addTrack(track, localStreamRef.current);
// //   });

// //   pc.onicecandidate = (event) => {
// //     if (event.candidate) {
// //       socket.emit("ice-candidate", {
// //         candidate: event.candidate,
// //         roomId,
// //         to: viewerId
// //       });
// //     }
// //   };

// //   const offer = await pc.createOffer();
// //   await pc.setLocalDescription(offer);

// //   socket.emit("offer", {
// //     offer,
// //     roomId,
// //     to: viewerId
// //   });
// // });

// socket.on("new-viewer", async ({ viewerId }) => {
//   try {
//     console.log("📤 New viewer joined:", viewerId);

//     const pc = new RTCPeerConnection(ICE_SERVERS);
//     peerConnectionsRef.current[viewerId] = pc;

//     // Add tracks
//     localStreamRef.current.getTracks().forEach(track => {
//       pc.addTrack(track, localStreamRef.current);
//     });

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           candidate: event.candidate,
//           roomId,
//           to: viewerId
//         });
//       }
//     };

//     pc.onconnectionstatechange = () => {
//       console.log("🔗 Broadcaster connection:", pc.connectionState);
//     };

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     socket.emit("offer", {
//       offer,
//       roomId,
//       to: viewerId
//     });

//     console.log("✅ Offer sent to viewer:", viewerId);
//   } catch (err) {
//     console.error("❌ Error creating offer:", err);
//   }
// });

//   // WebRTC Signaling - ICE Candidates
//   // socket.on("ice-candidate", ({ candidate, roomId, to }) => {
//   //   if (to) {
//   //     console.log(`🧊 Relaying ICE candidate from ${socket.id} to ${to}`);
//   //     io.to(to).emit("ice-candidate", candidate);
//   //   } else {
//   //     // Broadcast to room if no specific target
//   //     socket.to(roomId).emit("ice-candidate", candidate);
//   //   }
//   // });

//   socket.on("ice-candidate", ({ candidate, roomId, to }) => {
//     if (to) {
//       io.to(to).emit("ice-candidate", {
//         candidate,
//         from: socket.id // CRITICAL: Tell recipient who sent this
//       });
//     }
//   });

//   // Real-time Chat & Super-Chat
//   socket.on("send-message", (data) => {
//     try {
//       const message = {
//         text: data.text,
//         user: data.user,
//         userId: data.userId,
//         isSuperChat: data.isSuperChat || false,
//         amount: data.amount || 0,
//         timestamp: new Date()
//       };
      
//       // Store message in room history
//       const room = getRoomInfo(data.roomId);
//       room.messages.push(message);
      
//       // Keep only last 100 messages
//       if (room.messages.length > 100) {
//         room.messages.shift();
//       }
      
//       // Broadcast to all users in room
//       io.to(data.roomId).emit("receive-message", message);
      
//       if (message.isSuperChat) {
//         console.log(`💰 Super Chat in Room ${data.roomId}: ${message.user} - ₹${message.amount}`);
//       }
//     } catch (err) {
//       console.error("❌ Error sending message:", err);
//     }
//   });

//   // Leave Live Room
//   socket.on("leave-live", (roomId) => {
//     handleDisconnect();
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     handleDisconnect();
//   });

//   function handleDisconnect() {
//     console.log("🔴 WebSocket disconnected:", socket.id);
    
//     if (currentRoom) {
//       const room = getRoomInfo(currentRoom);
      
//       if (room.broadcaster === socket.id) {
//         // Broadcaster left
//         console.log(`📴 Broadcaster left Room ${currentRoom}`);
//         room.broadcaster = null;
        
//         // Notify all viewers
//         socket.to(currentRoom).emit("broadcaster-left");
        
//         // Clean up room if no one is left
//         if (room.viewers.size === 0) {
//           liveRooms.delete(currentRoom);
//           console.log(`🗑️ Room ${currentRoom} deleted (empty)`);
//         }
//       } else {
//         // Viewer left
//         room.viewers.delete(socket.id);
//         console.log(`👋 Viewer left Room ${currentRoom}`);
        
//         // Clean up room if empty
//         if (!room.broadcaster && room.viewers.size === 0) {
//           liveRooms.delete(currentRoom);
//           console.log(`🗑️ Room ${currentRoom} deleted (empty)`);
//         }
//       }
      
//       // Update viewer count
//       if (liveRooms.has(currentRoom)) {
//         emitViewerCount(currentRoom);
//       }
//     }
//   }
// });

// // Periodic cleanup of inactive rooms (every 5 minutes)
// setInterval(() => {
//   const now = Date.now();
//   for (const [roomId, room] of liveRooms.entries()) {
//     if (!room.broadcaster && room.viewers.size === 0) {
//       liveRooms.delete(roomId);
//       console.log(`🗑️ Cleaned up inactive room: ${roomId}`);
//     }
//   }
// }, 5 * 60 * 1000);

// global.io = io;

// /* ================= HEALTH CHECK ================= */
// app.get("/health", (req, res) => {
//   res.json({
//     status: "ok",
//     activeRooms: liveRooms.size,
//     timestamp: new Date()
//   });
// });

// app.get("/api/live/rooms", (req, res) => {
//   const rooms = Array.from(liveRooms.entries()).map(([roomId, room]) => ({
//     roomId,
//     hasBroadcaster: !!room.broadcaster,
//     viewerCount: room.viewers.size,
//     messageCount: room.messages.length
//   }));
//   res.json(rooms);
// });

// /* ================= DB + START ================= */
// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log("✅ MongoDB connected");
    
//     // Initialize Bloom Filter
//     const allVideos = await Video.find();
//     allVideos.forEach(v => bloom.add(v.title.toLowerCase()));
//     global.videoBloom = bloom;
//     console.log(`📊 Bloom filter initialized with ${allVideos.length} videos`);
    
//     // Start server
//     server.listen(PORT, "0.0.0.0", () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🔌 Socket.IO ready for live streaming`);
//       console.log(`📡 WebRTC signaling server active`);
//     });
//   })
//   .catch(err => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// // Graceful shutdown
// process.on("SIGINT", () => {
//   console.log("\n🛑 Shutting down gracefully...");
//   server.close(() => {
//     mongoose.connection.close(false, () => {
//       console.log("✅ Server closed");
//       process.exit(0);
//     });
//   });
// });


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

/* ================= UTILS ================= */
const BloomFilter = require("./utils/bloomFilter");
const Video = require("./models/Video");

/* ================= APP ================= */
const app = express();
const bloom = new BloomFilter(8000);

app.use(cors());
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
app.use("/api/ads", require("./routes/adRoutes"));

/* ================= SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

/* ================= LIVE ROOMS ================= */
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

/* ================= SOCKET EVENTS ================= */
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

/* ================= HEALTH ================= */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    activeRooms: liveRooms.size,
    time: new Date()
  });
});

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
