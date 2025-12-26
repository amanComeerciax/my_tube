

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


| Feature                          | Status        | Description                                                 |
| -------------------------------- | ------------- | ----------------------------------------------------------- |
| 🎞 **Multi-Quality Transcoding** | ⭐ Added Today | FFmpeg worker auto-generates **720p & 480p MP4** versions   |
| ⚙️ **Smart Streaming Route**     | ⭐ Added Today | `/stream` route maps correct quality using underscore logic |
| 📶 **Adaptive Auto-Quality**     | ⭐ Added Today | Detects network speed (4G / 3G) & selects best resolution   |
| 🔄 **Seamless Quality Switch**   | ⭐ Added Today | Quality changes without restart using `currentTime` sync    |
| ⏳ **Quality Switching Loader**   | ⭐ Added Today | `isQualitySwitching` state shows spinner during switch      |   

| Feature                          | Status        | Description                                                   |
| -------------------------------- | ------------- | ------------------------------------------------------------- |
| 📥 **Video Upload & Streaming**  | ✔️ Complete   | HTTP range requests for smooth streaming + thumbnail previews |
| ⚡ **Chunked Video Upload**       | ✔️ Complete   | Stable large file uploads using chunk-based strategy          |
| 🎞 **Multi-Quality Transcoding** | ⭐ Added Today | FFmpeg worker auto-generates **720p & 480p MP4**              |
| ⚙️ **Smart Streaming Route**     | ⭐ Added Today | `/stream` dynamically serves correct quality                  |
| 📶 **Adaptive Auto-Quality**     | ⭐ Added Today | Network-based auto quality (4G → 720p, 3G → 480p)             |
| 🔄 **Seamless Quality Switch**   | ⭐ Added Today | Quality switch without restart using `currentTime` sync       |
| ⏳ **Quality Switch Loader**      | ⭐ Added Today | Loader shown during quality change                            |
| ⏭ **Auto-Play Next Video**       | ✔️ Complete   | Plays next recommended video automatically                    |
| 🎞 **Hover Video Preview**       | ✔️ Complete   | YouTube-style hover autoplay preview                          |
| User Go Live                    |  Complete     | User Go Live                                                  |
| Auto Search Suggetion           | Complete      | User Search Auto Suggestion for video                         |


| Feature                         | Status        | Description                                     |
| ------------------------------- | ------------- | ----------------------------------------------- |
| 🔐 **JWT Authentication**       | ✔️ Complete   | Secure login/signup & protected routes          |
| 🙋‍♂️ **Dynamic User Profile**  | ✔️ Complete   | Channel info, subscribers, uploaded videos      |
| 👤 **Channel Card UI**          | ✔️ Complete   | Clickable channel cards with live counters      |
| ⭐ **Subscribe System (Live)**   | ✔️ Complete   | Real-time subscribe/unsubscribe without reload  |
| 👀 **Watch History Management** | ⭐ Added Today | View, delete single video, or clear all history |
| Login With Google               | Completed     |  User Can Login And Sign-up With Google         |


| Feature                         | Status        | Description                                     |
| ------------------------------- | ------------- | ----------------------------------------------- |
| 🔐 **JWT Authentication**       | ✔️ Complete   | Secure login/signup & protected routes          |
| 🙋‍♂️ **Dynamic User Profile**  | ✔️ Complete   | Channel info, subscribers, uploaded videos      |
| 👤 **Channel Card UI**          | ✔️ Complete   | Clickable channel cards with live counters      |
| ⭐ **Subscribe System (Live)**   | ✔️ Complete   | Real-time subscribe/unsubscribe without reload  |
| 👀 **Watch History Management** | ⭐ Added Today | View, delete single video, or clear all history |


| Feature                               | Status        | Description                                       |
| ------------------------------------- | ------------- | ------------------------------------------------- |
| 🔎 **Fuzzy Search (Fuse.js)**         | ✔️ Complete   | Typo-tolerant smart search                        |
| 🏷 **Category & Tags System**         | ⭐ Added Today | Stored, filtered & searchable                     |
| 🧠 **Bloom Filter Optimization**      | ✔️ Complete   | Prevents duplicate titles before DB hit           |
| 🧩 **Smart Recommendation Algorithm** | ⭐ Added Today | Personalized feed using history + tags + category |
| 🎙 **Voice Search (Mic Input)**       | ⭐ Added Today | YouTube-style voice search (Web Speech API)       |



| Feature                               | Status        | Description                                       |
| ------------------------------------- | ------------- | ------------------------------------------------- |
| 🔎 **Fuzzy Search (Fuse.js)**         | ✔️ Complete   | Typo-tolerant smart search                        |
| 🏷 **Category & Tags System**         | ⭐ Added Today | Stored, filtered & searchable                     |
| 🧠 **Bloom Filter Optimization**      | ✔️ Complete   | Prevents duplicate titles before DB hit           |
| 🧩 **Smart Recommendation Algorithm** | ⭐ Added Today | Personalized feed using history + tags + category |
| 🎙 **Voice Search (Mic Input)**       | ⭐ Added Today | YouTube-style voice search (Web Speech API)       |
| 🎙 **Voice Search (Mic Input)**       | ⭐ Added Today | control watch page play stop next video through voice|
| ⭐ **Ai Summary Generate ** | ⭐ Added Today | using vtt caption file ollama Model dholphin Mixtrel genarate summary |

| Feature                           | Status        | Description                             |
| --------------------------------- | ------------- | --------------------------------------- |
| 📺 **Pre-Roll Video Ads**         | ⭐ Added Today | Ads play before main video              |
| 👁 **Ad View Tracking**           | ⭐ Added Today | View counted after minimum watch time   |
| 👆 **Ad Click Tracking**          | ⭐ Added Today | Clicks tracked on CTA                   |
| 💰 **Ad Revenue Calculation**     | ⭐ Added Today | Earnings generated per ad               |
| 📊 **Ad Analytics Dashboard**     | ⭐ Added Today | Views, clicks, CTR per ad               |
| 💸 **Revenue Dashboard (Admin)**  | ⭐ Added Today | Total revenue, top ads, performance     |
| ⭐ **Premium Purchase (Razorpay)** | ⭐ Added Today | Users can buy Premium (Test mode ready) |

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

