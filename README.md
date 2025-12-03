<p align="center">
  <img src="https://via.placeholder.com/120x120/ff3b30/ffffff?text=MyTube" alt="MyTube Logo" width="120"/>
</p>

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

### Features

| Feature                        | Status | Description |
|-------------------------------|--------|-----------|
| Video Upload & Streaming       | Done    | Range requests, smooth playback |
| Admin Panel (Full CRUD)        | Done    | Upload, edit title, replace video/thumbnail, delete |
| Fuzzy Search (Fuse.js)         | Done    | Smart typo-tolerant search |
| Bloom Filter (Duplicate Check) | Done    | Ultra-fast probable duplicate detection |
| JWT Authentication             | Done    | Protected admin routes |
| Responsive UI                  | Done    | Mobile-friendly React frontend |

---

### Tech Stack

```text
Frontend   → React.js + Axios + Tailwind/CSS
Backend    → Node.js + Express.js
Database   → MongoDB (Mongoose)
Auth       → JWT (httpOnly cookies)
Search     → Fuse.js (fuzzy matching)
Performance→ Custom Bloom Filter (bit array + MurmurHash)
File Storage → Local (uploads folder) — ready for Cloudinary/S3
