

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

| Feature                                           | Status         | Description                                                   |
| ------------------------------------------------- | -------------- | ------------------------------------------------------------- |
| 📥 **Video Upload & Streaming**                   | ✔️ Complete    | Range requests, smooth video playback with thumbnails         |
| ⚙️ **Admin Panel (Full CRUD)**                    | ✔️ Complete    | Upload videos, edit title, replace video/thumbnail, delete    |
| 🔎 **Fuzzy Search (Fuse.js)**                     | ✔️ Complete    | Typo-tolerant search on Home page                             |
| 🔐 **JWT Authentication**                         | ✔️ Complete    | Login, secure routes, token-based protection                  |
| 📱 **Responsive UI**                              | ✔️ Complete    | Modern YouTube-style layout (dark UI + animations)            |
| ⭐ **Subscribe System (Dynamic)**                 | ✔️ Added Today | Subscribe button updates instantly + backend relational store |
| 💬 **Comments System (Full)**                     | ✔️ Added Today | Post/Delete comments, admin delete, live refresh              |
| 🙋‍♂️ **User Profile Page (Dynamic)**                | ✔️ Added Today | Shows uploaded videos & subscriber count                      |
| 🎥 **User Video Upload (Not Admin)**              | ✔️ Added Today | Normal users can upload from their own page                   |
| 🧠 **Bloom Filter Optimization**                  | ✔️ Complete    | Prevent duplicate titles instantly                            |
| 🎙 **Voice Search (Mic Input)**                   | ✔️ Added Today | YouTube-style mic search on Home page                         |
| 🏷 **Recommended Algorithm (Basic)**              | ✔️ Added Today | Shows related videos after watching                           |
| 🧲 **Auto-Update Views, Likes, Dislikes**         | ✔️ Complete    | Counts update live without reload                             |
| 🧾 **Channel Card UI (Subscribe + Profile Link)** | ✔️ Added Today | Live count, clickable profile, styled UI                      |
| ⚡ **Live Counters**                               | ✔️ Added Today | Subscribers, likes, dislikes, views all update live           |
🎬 Video Category System                            | ⭐ Added Today | Category stored & searchable                                  |
---

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

