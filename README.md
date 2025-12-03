<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>MyTube — MERN YouTube Clone (README)</title>
  <style>
    :root{
      --bg:#f6f8fb;
      --card:#ffffff;
      --accent:#ff3b30;
      --muted:#6b7280;
      --mono: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body{
      margin:0;
      font-family: var(--mono);
      background:var(--bg);
      color:#111827;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
      line-height:1.6;
    }
    .wrap{max-width:1000px;margin:36px auto;padding:24px;}
    header{display:flex;align-items:center;gap:14px;margin-bottom:18px;}
    .logo{
      width:68px;height:68px;border-radius:12px;background:linear-gradient(135deg,#fff 0,#fee);
      display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--accent);font-size:20px;
      box-shadow:0 6px 18px rgba(0,0,0,0.06);
    }
    h1{margin:0;font-size:26px;}
    .meta{color:var(--muted);margin-top:6px;}
    section.card{background:var(--card);border-radius:12px;padding:18px;margin-top:18px;box-shadow:0 8px 30px rgba(12,20,40,0.05);}
    h2{margin:0 0 12px 0;font-size:18px;color:#0f172a;}
    ul{margin:10px 0 12px 20px;}
    pre{background:#0f172a;color:#f8fafc;padding:12px;border-radius:8px;overflow:auto;font-size:13px;}
    code{background:#f3f4f6;padding:2px 6px;border-radius:6px;font-family:monospace;font-size:13px;}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .badge{display:inline-block;padding:6px 10px;border-radius:999px;background:#f3f4f6;color:#111827;font-weight:600;font-size:13px;margin-right:8px;}
    footer{margin-top:20px;color:var(--muted);font-size:14px;}
    .mono{font-family:monospace;font-size:13px;}
    @media (max-width:760px){
      .grid{grid-template-columns:1fr;}
      .logo{width:56px;height:56px;font-size:18px;}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="logo">MyTube</div>
      <div>
        <h1>MyTube — MERN YouTube Clone</h1>
        <div class="meta">Full-featured YouTube-style app · MERN stack · Video streaming · Admin panel · Fuzzy search · Bloom filter</div>
      </div>
    </header>

    <section class="card">
      <h2>🎬 Project Overview</h2>
      <p>
        A full-featured YouTube-style video platform built using <strong>MongoDB, Express, React, Node.js (MERN)</strong>.
        Features include video streaming, admin upload panel, thumbnails, fuzzy search (Fuse.js), Bloom filter duplicate detection,
        JWT login, and full CRUD for videos.
      </p>

      <div style="margin-top:12px;">
        <span class="badge">React</span>
        <span class="badge">Node.js</span>
        <span class="badge">Express</span>
        <span class="badge">MongoDB</span>
        <span class="badge">JWT</span>
        <span class="badge">Fuse.js</span>
      </div>
    </section>

    <section class="card">
      <h2>🚀 Features</h2>

      <ul>
        <li><strong>Video features:</strong> Upload videos (admin), thumbnails, streaming with range support, watch page.</li>
        <li><strong>Admin panel:</strong> Upload, edit title, replace thumbnail/video, delete — full CRUD.</li>
        <li><strong>Search:</strong> Fuzzy search powered by Fuse.js (backend API).</li>
        <li><strong>Duplicate detection:</strong> Bloom filter for fast title duplicate checks.</li>
        <li><strong>Auth:</strong> JWT-based login protecting admin routes.</li>
      </ul>
    </section>

    <section class="card">
      <h2>📂 Project Structure</h2>
      <pre class="mono">
my_tube/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/        ← bloomFilter.js, other helpers
│   ├── uploads/      ← stored videos & thumbnails
│   └── server.js
└── frontend/
    ├── src/
    ├── components/
    ├── Pages/
    └── App.js
      </pre>
    </section>

    <section class="card">
      <h2>⚙️ Installation</h2>

      <h3>1. Clone</h3>
      <pre class="mono">git clone https://github.com/amanComeerciax/my_tube.git
cd my_tube</pre>

      <div class="grid" style="margin-top:12px">
        <div>
          <h3>Backend</h3>
          <pre class="mono">cd backend
npm install</pre>

          <p>Create a <code>.env</code> file with:</p>
          <pre class="mono">MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000</pre>

          <p>Run backend (dev):</p>
          <pre class="mono">npm run dev</pre>
        </div>

        <div>
          <h3>Frontend</h3>
          <pre class="mono">cd frontend
npm install
npm start</pre>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>🔗 API Endpoints (Key)</h2>
      <ul>
        <li><code>POST /api/videos/upload</code> — Upload video & thumbnail (admin)</li>
        <li><code>GET /api/videos/all</code> — Get all videos</li>
        <li><code>DELETE /api/videos/delete/:id</code> — Delete video</li>
        <li><code>PUT /api/videos/update/:id</code> — Update title</li>
        <li><code>PUT /api/videos/update-thumbnail/:id</code> — Replace thumbnail</li>
        <li><code>PUT /api/videos/update-video/:id</code> — Replace video file</li>
        <li><code>GET /api/search?query=...</code> — Fuzzy search (Fuse.js)</li>
        <li><code>POST /api/auth/login</code> — Admin login (returns JWT)</li>
      </ul>
    </section>

    <section class="card">
      <h2>🧠 Bloom Filter (Duplicate Title Detection)</h2>
      <p>
        The server uses a lightweight Bloom Filter (bit-array + multiple hash functions) to quickly check if a title
        <em>probably</em> exists. If Bloom reports "maybe exists", backend can refuse or check DB for confirmation.
        Bloom reduces DB load and speeds up duplicate detection.
      </p>
      <pre class="mono">// example usage (server-side)
const BloomFilter = require('./utils/bloomFilter');
const bloom = new BloomFilter(5000);
// load existing titles on server start
allVideos.forEach(v => bloom.add(v.title.toLowerCase()));
// on upload:
if (bloom.contains(title.toLowerCase())) {
  return res.status(400).json({ message: 'Duplicate Title (maybe)' });
}
bloom.add(title.toLowerCase());
</pre>
    </section>

    <section class="card">
      <h2>🔎 Fuzzy Search (Fuse.js)</h2>
      <p>
        Fuzzy matching is implemented via <code>fuse.js</code> on the backend:
      </p>
      <pre class="mono">npm install fuse.js

// routes/searchRoutes.js
const Fuse = require('fuse.js');
const videos = await Video.find();
const fuse = new Fuse(videos, { keys: ['title'], threshold: 0.4 });
const results = fuse.search(query).map(r => r.item);
res.json(results);
</pre>
    </section>

    <section class="card">
      <h2>✅ Completed Features</h2>
      <ul>
        <li>Video upload, thumbnail upload, streaming</li>
        <li>Admin CRUD (edit, delete, replace files)</li>
        <li>Fuzzy search API (Fuse.js)</li>
        <li>Bloom Filter integrated for fast duplicate detection</li>
        <li>JWT authentication for protected endpoints</li>
      </ul>
    </section>

    <section class="card">
      <h2>📌 Next Suggestions</h2>
      <ul>
        <li>Watch page with recommended videos and view counter</li>
        <li>Comments & replies system</li>
        <li>Likes / Dislikes and view analytics</li>
        <li>Deploy backend (Render/Heroku) and frontend (Vercel)</li>
        <li>Use Redis + Bloom filter for extremely large-scale performance</li>
      </ul>
    </section>

    <footer>
      <p><strong>Author:</strong> Mohammad Aman Memon · Ahmedabad</p>
      <p>Like this project? Star the repo on GitHub ⭐ — and tell me if you want deployment instructions or a README upgrade with screenshots.</p>
    </footer>
  </div>
</body>
</html>
