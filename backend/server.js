require ('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const videosRoutes = require('./routes/VideoRoutes');
const streamRoutes = require('./routes/streamRoutes');
const authRoutes  = require('./routes/authRoutes');
const searchRoutes = require("./routes/searchRoutes");
const cors = require('cors');
const BloomFilter = require("./utils/bloomFilter");
const Video = require("./models/Video");
const commentRoutes  = require('./routes/commentRoutes');
const userRoutes = require('./routes/UserRoutes');
const subscriptionRoute = require('./routes/subscriptionRoutes');

const bloom = new BloomFilter(8000); // bigger size = less false positive



const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get('/',(req,res) => res.send('My_tube Running '));
app.use('/api/videos',videosRoutes);
app.use('/api/stream',streamRoutes);
app.use('/api/auth',authRoutes);
app.use("/api/search", searchRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/user',userRoutes);
app.use('api/subscribe',subscriptionRoute);
const PORT  = process.env.PORT || 5000;



// mongoose.connect(process.env.MONGO_URI)
//   .then(async() => {
//     console.log('MongoDB connected');
//     const allVideos = await Video.find();
//     allVideos.forEach(v = bloom.add(v.title.toLowerCase()));
//     global.videoBloom = bloom;
//     console.log("Bloom Is Loded")
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.error(err));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // Load existing titles into bloom filter
    const allVideos = await Video.find();
    allVideos.forEach((video) => bloom.add(video.title.toLowerCase()));

    console.log("🌸 Bloom filter loaded");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));


