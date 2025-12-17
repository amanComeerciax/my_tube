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



require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const videosRoutes = require("./routes/VideoRoutes");
const streamRoutes = require("./routes/streamRoutes");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/UserRoutes");
const subscriptionRoute = require("./routes/subscriptionRoutes");

const BloomFilter = require("./utils/bloomFilter");
const Video = require("./models/Video");


const bloom = new BloomFilter(8000);

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/captions", express.static(path.join(__dirname, "captions")));

/* ================= ROUTES ================= */
app.get("/", (req, res) => res.send("My_tube Running"));

app.get("/captions/:file", (req, res) => {
  const filePath = path.join(__dirname, "captions", req.params.file);

  if (!require("fs").existsSync(filePath)) {
    return res.status(404).send("Caption file not found");
  }

  res.setHeader("Content-Type", "text/vtt; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(filePath);
});


app.use("/api/videos", videosRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscribe", subscriptionRoute);




/* ================= HTTP + SOCKET SERVER ================= */
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 WebSocket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket disconnected:", socket.id);
  });
});

/* 🔥 GLOBAL ACCESS (workers ke liye) */
global.io = io;

/* ================= DB + START ================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    const allVideos = await Video.find();
    allVideos.forEach(v => bloom.add(v.title.toLowerCase()));

    global.videoBloom = bloom;
    console.log("🌸 Bloom filter loaded");

    // server.listen(PORT, () =>
    //   console.log(`🚀 Server running on port ${PORT}`)
    // );
    server.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
    
  })
  .catch(err => console.error(err));

