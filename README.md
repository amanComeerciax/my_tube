<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>MyTube — MERN YouTube Clone</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <style>
    :root {
      --bg: #f8fafc;
      --card: #ffffff;
      --accent: #ff3b30;
      --text: #1e293b;
      --muted: #64748b;
      --border: #e2e8f0;
      --radius: 16px;
      --shadow: 0 10px 30px rgba(0,0,0,0.06);
    }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
    }
    .container {
      max-width: 1100px;
      margin: 40px auto;
      padding: 0 20px;
    }
    header {
      text-align: center;
      margin-bottom: 50px;
    }
    .logo {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #ff3b30, #ff6b6b);
      border-radius: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      font-weight: 900;
      color: white;
      box-shadow: 0 15px 35px rgba(255,59,48,0.3);
      margin-bottom: 20px;
    }
    h1 {
      font-size: 42px;
      margin: 10px 0;
      background: linear-gradient(90deg, #ff3b30, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 20px;
      color: var(--muted);
      max-width: 700px;
      margin: 0 auto;
    }
    .badges {
      margin: 30px 0;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 10px 18px;
      margin: 6px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 50px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .card {
      background: var(--card);
      border-radius: var(--radius);
      padding: 32px;
      margin: 24px 0;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }
    h2 {
      font-size: 26px;
      margin: 0 0 20px 0;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    h2 i { color: var(--accent); }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 20px;
      border-radius: 12px;
      overflow-x: auto;
      font-size: 14px;
      margin: 16px 0;
      border: 1px solid #1e293b;
    }
    code {
      background: #fee;
      color: var(--accent);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 14px;
    }
    ul {
      padding-left: 24px;
    }
    li {
      margin: 10px 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin: 20px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: var(--accent);
      color: white;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      margin: 10px;
      box-shadow: 0 8px 20px rgba(255,59,48,0.3);
      transition: all 0.3s;
    }
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(255,59,48,0.4);
    }
    footer {
      text-align: center;
      padding: 50px 20px;
      color: var(--muted);
      font-size: 15px;
    }
    @media (max-width: 768px) {
      h1 { font-size: 32px; }
      .logo { width: 90px; height: 90px; font-size: 32px; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">MyT</div>
      <h1>MyTube</h1>
      <p class="subtitle">
        Full-Featured YouTube Clone built with MERN Stack<br>
        Video Streaming • Admin Panel • Fuzzy Search • Bloom Filter • JWT Auth
      </p>
      <div class="badges">
        <span class="badge">React</span>
        <span class="badge">Node.js</span>
        <span class="badge">Express</span>
        <span class="badge">MongoDB</span>
        <span class="badge">JWT</span>
        <span class="badge">Fuse.js</span>
        <span class="badge">Bloom Filter</span>
      </div>
      <div>
        <a href="https://github.com/amanComeerciax/my_tube" class="btn" target="_blank">
          View on GitHub
        </a>
        <a href="https://github.com/amanComeerciax/my_tube/stargazers" class="btn" style="background:#333" target="_blank">
          Star Project
        </a>
      </div>
    </header>

    <div class="card">
      <h2>Project Overview</h2>
      <p>A powerful, modern video platform with real-time streaming, full admin control, intelligent search, and performance optimizations using advanced data structures.</p>
    </div>

    <div class="card">
      <h2>Key Features</h2>
      <ul>
        <li>Full video upload with thumbnail generation & range-based streaming</li>
        <li>Complete Admin Panel — Upload, Edit, Replace, Delete videos</li>
        <li>Fuzzy Search powered by <strong>Fuse.js</strong> (handles typos!)</li>
        <li>Fast duplicate title detection using custom <strong>Bloom Filter</strong></li>
        <li>Secure JWT authentication for admin routes</li>
        <li>Responsive, mobile-first React frontend</li>
      </ul>
    </div>

    <div class="card">
      <h2>Tech Stack</h2>
      <pre>Frontend  → React.js + Axios + Modern CSS
Backend   → Node.js + Express.js
Database  → MongoDB + Mongoose
Auth      → JWT (httpOnly cookies)
Search    → Fuse.js (fuzzy matching)
Optimization → Custom Bloom Filter (bit array + MurmurHash)
Storage   → Local disk (easy to switch to Cloudinary/S3)</pre>
    </div>

    <div class="card">
      <h2>Project Structure</h2>
      <pre>my_tube/
├── backend/
│   ├── routes/           # API endpoints
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # auth, multer
│   ├── utils/
│   │   └── bloomFilter.js # Custom Bloom Filter
│   ├── uploads/          # videos & thumbnails
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.js
    └── public/</pre>
    </div>

    <div class="grid">
      <div class="card">
        <h2>Backend Setup</h2>
        <pre>cd backend
npm install

# Create .env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_strong_secret
PORT=5000

npm run dev</pre>
      </div>
      <div class="card">
        <h2>Frontend Setup</h2>
        <pre>cd frontend
npm install
npm start

# Opens at http://localhost:3000</pre>
      </div>
    </div>

    <div class="card">
      <h2>Bloom Filter – Duplicate Detection</h2>
      <pre>const bloom = new BloomFilter(5000, 3);

// Load existing titles
videos.forEach(v => bloom.add(v.title.toLowerCase()));

// On upload
if (bloom.mightContain(newTitle.toLowerCase())) {
  return res.status(400).json({ msg: "Title already exists!" });
}
bloom.add(newTitle.toLowerCase());</pre>
      <p>Lightning-fast probabilistic duplicate check — zero database hits!</p>
    </div>

    <div class="card">
      <h2>Fuzzy Search with Fuse.js</h2>
      <pre>const fuse = new Fuse(videos, {
  keys: ['title'],
  threshold: 0.4
});
const results = fuse.search(query).map(r => r.item);</pre>
      <p>Search "jaavasript" → finds "JavaScript Tutorial"</p>
    </div>

    <div class="card">
      <h2>Completed Features</h2>
      <ul>
        <li>Video streaming with range support</li>
        <li>Full admin CRUD operations</li>
        <li>Fuzzy search API</li>
        <li>Bloom filter duplicate prevention</li>
        <li>JWT-protected routes</li>
      </ul>
    </div>

    <footer>
      <p><strong>Made with passion by Mohammad Aman Memon</strong> • Ahmedabad, India</p>
      <p>Like this project? <strong>Star it on GitHub</strong> — it really helps!</p>
      <p>Want a live demo, deployment guide, or screenshots? Just ask!</p>
    </footer>
  </div>
</body>
</html>
