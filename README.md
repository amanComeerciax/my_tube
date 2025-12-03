🎬 MyTube – MERN YouTube Clone

A full-featured YouTube-style video platform built using MongoDB, Express, React, Node.js (MERN) with video streaming, admin upload panel, thumbnails, fuzzy search, Bloom filter, JWT login, and full CRUD.

🚀 Features
🎥 Video Features

Upload videos (Admin Only)

Upload thumbnails

Auto streaming with byte-range support

Watch videos in a dedicated player

Search videos (Fuzzy Search supported)

Trending layout grid (YouTube style)

🛠 Admin Panel

Upload video + thumbnail + title

Edit video title (CRUD)

Delete video (CRUD)

Manage all uploaded videos

Duplicate title detection using Bloom Filter (super fast)

🔐 Authentication

JWT-based login

Admin-only protected upload routes

Secure API access

🔎 Search

Instant search

Fuzzy search support

Search UI in navbar (YouTube style)

⚡ Tech Stack

Frontend: React.js, Axios
Backend: Node.js, Express.js
Database: MongoDB + Mongoose
Auth: JWT Authentication
Extras:

Multer (file uploads)

Bloom Filter (duplicate detection)

Range streaming (video player)

📂 Project Structure
my_tube/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/   ← videos + thumbnails stored here
│   └── server.js
│
└── frontend/
    ├── src/
    ├── components/
    ├── Pages/
    └── App.js

⚙️ Installation Guide
🔧 1. Clone Repository
git clone https://github.com/amanComeerciax/my_tube.git
cd my_tube

🖥 Backend Setup
cd backend
npm install

Create .env file
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000

Start backend:
npm run dev

🌐 Frontend Setup
cd frontend
npm install
npm start
