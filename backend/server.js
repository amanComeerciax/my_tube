require ('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const videosRoutes = require('./routes/VideoRoutes');
const streamRoutes = require('./routes/streamRoutes');
const authRoutes  = require('./routes/authRoutes');
const searchRoutes = require("./routes/searchRoutes");
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get('/',(req,res) => res.send('My_tube Running '));
app.use('/api/videos',videosRoutes);
app.use('/api/stream',streamRoutes);
app.use('/api/auth',authRoutes);
app.use("/api/search", searchRoutes);
const PORT  = process.env.PORT || 5000;



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));


