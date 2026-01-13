<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/542c4b6b-0044-4121-b976-edfc0db2856d" /><h1 align="center"> MyTube — Full-Featured YouTube Clone (MERN Stack)</h1>

<p align="center">
  <strong>A modern, scalable video streaming platform</strong><br/>
  inspired by YouTube — built with MERN stack, AI features, ads, monetization & premium system.
</p>

<p align="center">
  <a href="https://github.com/amanComeerciax/my_tube">
    <img src="https://img.shields.io/badge/GitHub-View%20Code-181717?style=for-the-badge&logo=github" />
  </a>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
</p>

---

## 🚀 Project Overview

**MyTube** is a complete YouTube-like video platform featuring:

- High-performance video streaming
- Multi-quality transcoding
- AI-powered summaries
- Voice control & voice search
- Live subscriptions & watch history
- Ads, monetization & premium system

Designed with **real-world scalability** and **production-style architecture**.

---

## 🎞 Video Streaming & Playback

| Feature | Status | Description |
|------|------|------|
| 📥 Video Upload & Streaming | ✔️ Complete | HTTP range requests for smooth playback |
| ⚡ Chunked Upload | ✔️ Complete | Large file uploads with chunk strategy |
| 🎞 Multi-Quality Transcoding | ⭐ Added | FFmpeg auto-generates 720p & 480p |
| ⚙️ Smart Streaming Route | ⭐ Added | `/stream` serves correct quality |
| 📶 Adaptive Auto Quality | ⭐ Added | Network-based quality (4G / 3G) |
| 🔄 Seamless Quality Switch | ⭐ Added | Switch quality without restart |
| ⏳ Quality Switch Loader | ⭐ Added | Loader during quality change |
| ⏭ Auto-Play Next Video | ✔️ Complete | Plays next recommended video |
| 🎬 Hover Video Preview | ✔️ Complete | YouTube-style hover autoplay |
| 🔴 Go Live (WebRTC) | ✔️ Complete | User live streaming |

---

## 👤 User & Channel System

| Feature | Status | Description |
|------|------|------|
| 🔐 JWT Authentication | ✔️ Complete | Secure login/signup |
| 🔑 Google OAuth | ✔️ Complete | Login & signup via Google |
| 🙋 Dynamic User Profile | ✔️ Complete | Channel info & videos |
| ⭐ Subscribe System | ✔️ Complete | Live subscribe/unsubscribe |
| 👤 Channel Card UI | ✔️ Complete | Clickable channel cards |
| 👀 Watch History | ⭐ Added | View, delete, clear history |

---

## 🔎 Search, AI & Intelligence

| Feature | Status | Description |
|------|------|------|
| 🔎 Fuzzy Search (Fuse.js) | ✔️ Complete | Typo-tolerant search |
| 🏷 Tags & Categories | ⭐ Added | Filterable & searchable |
| 🧠 Bloom Filter | ✔️ Complete | Duplicate title prevention |
| 🧩 Smart Recommendations | ⭐ Added | Personalized feed logic |
| 🎙 Voice Search | ⭐ Added | Web Speech API |
| 🎙 Voice Controls | ⭐ Added | Play / pause / next video |
| 🤖 AI Summary | ⭐ Added | Generated using VTT + Ollama (Dolphin Mixtral) |

---

## 📺 Ads, Monetization & Revenue

| Feature | Status | Description |
|------|------|------|
| 📺 Pre-Roll Video Ads | ⭐ Added | Ads before video |
| 👁 Ad View Tracking | ⭐ Added | Counted after min watch time |
| 👆 Ad Click Tracking | ⭐ Added | CTA click tracking |
| 💰 Revenue Calculation | ⭐ Added | Per-ad earnings |
| 📊 Ad Analytics | ⭐ Added | Views, clicks, CTR |
| 💸 Revenue Dashboard | ⭐ Added | Admin earnings overview |
| ⭐ Premium Purchase | ⭐ Added | Razorpay (test mode) |

---

## 🛠 Tech Stack

```text
Frontend    → React.js + Axios + CSS / Tailwind
Backend     → Node.js + Express.js
Database    → MongoDB + Mongoose
Auth        → JWT (httpOnly)
Search      → Fuse.js
AI          → Ollama (Dolphin Mixtral)
Streaming   → FFmpeg + HTTP Range Requests
Payments    → Razorpay
Storage     → Local (uploads) — S3/Cloudinary ready
📁 Project Structure
bash
Copy code
my_tube/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── workers/          # FFmpeg, captions, AI summary
│   ├── utils/
│   │   └── bloomFilter.js
│   ├── uploads/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.js
    └── public/
⚙️ Installation & Setup
1️⃣ Clone Repository
bash
Copy code
git clone https://github.com/amanComeerciax/my_tube.git
cd my_tube
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create .env file:

env
Copy code
MONGO_URI=mongodb://127.0.0.1:27017/mytube
JWT_SECRET=your_secret_key
PORT=5000
Run backend:

bash
Copy code
npm run dev
3️⃣ Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm start
App runs at 👉 http://localhost:3000

🧠 Key Highlights
Production-style backend architecture

Worker threads for video processing

AI-powered summaries

Real ad & monetization logic

Scalable recommendation system

👨‍💻 Author
Mohammad Aman Memon
📍 Ahmedabad, India
💻 MERN Stack Developer

🔗 GitHub: https://github.com/amanComeerciax

live Link:https://mytube-gold-delta.vercel.app/
