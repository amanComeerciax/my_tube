

<h1 align="center">MyTube — Full-Featured YouTube Clone (MERN Stack)</h1>

<p align="center">
  <strong>A modern video streaming platform</strong> with admin panel, fuzzy search, Bloom filter duplicate detection, JWT auth, and video streaming with range support.
</p>

<p align="center">
  <a href="https://github.com/amanComeerciax/my_tube"><img src="https://img.shields.io/badge/GitHub-View%20Code-181727?style=for-the-badge&logo=github" alt="GitHub"></a>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
</p>

---

| Feature                                            | Status        | Description                                                                     |
| -------------------------------------------------- | ------------- | ------------------------------------------------------------------------------- |
| 📥 **Video Upload & Streaming**                    | ✔️ Complete   | Range requests for smooth streaming + thumbnail previews                        |
| ⚙️ **Admin Panel (Full CRUD)**                     | ✔️ Complete   | Upload videos, edit title/category/description, replace video/thumbnail, delete |
| 🔎 **Fuzzy Search (Fuse.js)**                      | ✔️ Complete   | Smart typo-tolerant search across titles & tags                                 |
| 🔐 **JWT Authentication**                          | ✔️ Complete   | Secure login/signup, protected upload & CRUD                                    |
| 📱 **Responsive UI (YouTube Style)**               | ✔️ Complete   | Modern dark UI, sidebar, animations, hover effects                              |
| ⭐ **Subscribe System (Dynamic)**                   | ✔️ Complete   | Real-time subscribe/unsubscribe, live counter update                           |
| 💬 **Comments System (Full)**                      | ✔️ Complete   | Comment, delete comment, admin delete, auto-refresh                             |
| 🙋‍♂️ **User Profile Page (Dynamic)**                  | ✔️ Complete   | Shows uploaded videos, subscribers, channel info                               |
| 🎥 **User Video Upload (Normal User)**             | ✔️ Complete   | Users can upload videos from their profile                                      |
| 🏷️ **Category & Tags System**                     | ⭐ Added Today | Video Category + Tags stored, filtered, searchable                              |
| 🧠 **Bloom Filter Optimization**                   | ✔️ Complete   | Prevent duplicate titles instantly before DB hit                                |
| 🎙 **Mic Voice Search Input**                      | ⭐ Added Today | YouTube-style voice search using Web Speech API                                |
| 🧩 **Recommended Algorithm (Smart) Similarity  Matrix             | ⭐ Added Today | History + Tags + Category based personalized feed          |
| 🎞️ **Hover Video Preview (Upcoming)**             |  Complete    | Auto-play preview on Home hover (YouTube style)                                   |
| 🧲 **Auto Likes/Dislikes/Views Counter**           | ✔️ Complete   | Live count update without reload                                                |
| 👀 **Watch History (Add/Delete/Clear)**            | ⭐ Added Today | View, remove single video, clear all history                                   |
| 👤 **Channel Card UI (Clickable + Live Counters)** | ✔️ Complete   | Clickable profile, real-time subscriber updates                                 |
| ⚡ **Live UI Counters Everywhere**                  | ✔️ Complete   | Views, Likes, Dislikes, Subscribers auto-update                                 |
|⚡️ Video Upload (Chunking)** | **✔ Complete** |
| Video AutoPlay Next |   **✔ Complete** |
Multi-Quality Transcoding	⭐ Added Today	FFmpeg worker auto-generates 720p & 480p MP4 versions on upload.
⚙️ Smart Streaming Route	⭐ Added Today	Backend /stream route now matches requests to specific quality files using underscore logic.
📶 Adaptive Auto-Quality	⭐ Added Today	Speed-sensing logic detects 4G/3G and auto-switches to the best resolution.
🔄 Seamless Quality Switch	⭐ Added Today	Quality changes without restarting the video by syncing currentTime.
⏳ Quality Loading State	⭐ Added Today	Added isQualitySwitching state to show a spinner during resolution changes.


### Tech Stack

```text
Frontend   → React.js + Axios + Tailwind/CSS
Backend    → Node.js + Express.js
Database   → MongoDB (Mongoose)
Auth       → JWT (httpOnly cookies)
Search     → Fuse.js (fuzzy matching)
File Storage → Local (uploads folder) — ready for Cloudinary/S3

Project Structure
Bashmy_tube/
├── backend/
│   ├── routes/           # API routes
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # auth, multer, etc.
│   ├── utils/
│   │   └── bloomFilter.js  # Custom Bloom Filter implementation
│   ├── uploads/          # Videos & thumbnails
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.js
    └── public/

Installation & Setup
1. Clone the repository
Bashgit clone https://github.com/amanComeerciax/my_tube.git
cd my_tube
2. Backend Setup
Bashcd backend
npm install
Create .env file:
envMONGO_URI=mongodb://127.0.0.1:27017/mytube
JWT_SECRET=your_super_secret_key_here
PORT=5000
Start backend:
Bashnpm run dev
3. Frontend Setup
Bashcd ../frontend
npm install
npm start
App will run at: http://localhost:3000

