

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

| Feature                                | Status        | Description                                                                     |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------- |
| 📥 **Video Upload & Streaming**        | ✔️ Complete   | Range requests for smooth streaming + thumbnail previews                        |
| ⚙️ **Admin Panel (Full CRUD)**         | ✔️ Complete   | Upload videos, edit title/category/description, replace video/thumbnail, delete |
| 🔎 **Fuzzy Search (Fuse.js)**          | ✔️ Complete   | Smart typo-tolerant search across titles & tags                                 |
| 🔐 **JWT Authentication**              | ✔️ Complete   | Secure login/signup, protected upload & CRUD routes                             |
| 📱 **Responsive UI (YouTube Style)**   | ✔️ Complete   | Modern dark UI, sidebar, animations, hover effects                              |
| ⭐ **Subscribe System (Dynamic)**       | ✔️ Complete   | Real-time subscribe/unsubscribe with live counter update                        |
| 💬 **Comments System (Full)**          | ✔️ Complete   | Add/delete comments, admin moderation, auto-refresh                             |
| 🙋‍♂️ **User Profile Page (Dynamic)**  | ✔️ Complete   | Uploaded videos, subscriber count, channel info                                 |
| 🎥 **User Video Upload (Normal User)** | ✔️ Complete   | Users can upload videos directly from profile                                   |
| 🏷️ **Category & Tags System**         | ⭐ Added Today | Categories & tags stored, filtered & searchable                                 |
| 🧠 **Bloom Filter Optimization**       | ✔️ Complete   | Prevents duplicate titles instantly before DB hit                               |
| 🎙 **Voice Search (Mic Input)**        | ⭐ Added Today | YouTube-style voice search using Web Speech API                                 |
| 🧩 **Smart Recommendation Algorithm**  | ⭐ Added Today | Personalized feed using history + tags + category                               |
| 🎞️ **Hover Video Preview**            | ✔️ Complete   | Auto-play preview on hover (YouTube-style UX)                                   |
| 🧲 **Auto Likes / Dislikes / Views**   | ✔️ Complete   | Live counters update without page reload                                        |
| 👀 **Watch History Management**        | ⭐ Added Today | View, remove single video, or clear all history                                 |
| 👤 **Channel Card UI**                 | ✔️ Complete   | Clickable channel cards with live subscriber count                              |
| ⚡ **Live UI Counters Everywhere**      | ✔️ Complete   | Views, likes, dislikes & subscribers update in real-time                        |
| ⚡ **Chunked Video Upload**             | ✔️ Complete   | Large file upload using chunking for stability                                  |
| ⏭ **Video Auto-Play Next**             | ✔️ Complete   | Automatically plays next recommended video                                      |
| Feature                          | Status        | Description                                                 |
| -------------------------------- | ------------- | ----------------------------------------------------------- |
| 🎞 **Multi-Quality Transcoding** | ⭐ Added Today | FFmpeg worker auto-generates **720p & 480p MP4** versions   |
| ⚙️ **Smart Streaming Route**     | ⭐ Added Today | `/stream` route maps correct quality using underscore logic |
| 📶 **Adaptive Auto-Quality**     | ⭐ Added Today | Detects network speed (4G / 3G) & selects best resolution   |
| 🔄 **Seamless Quality Switch**   | ⭐ Added Today | Quality changes without restart using `currentTime` sync    |
| ⏳ **Quality Switching Loader**   | ⭐ Added Today | `isQualitySwitching` state shows spinner during switch      |   
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

