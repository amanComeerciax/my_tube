

// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// const TRENDING_DAYS_WINDOW = 7;
// const RECENCY_WEIGHT = 1000;
// const TOP_N = 50;

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [isListening, setIsListening] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const categoryParam = searchParams.get("category");
//     if (categoryParam) setSelectedCategory(categoryParam);
//   }, [searchParams]);

//   const categories = [
//     { name: "All", icon: "🏠" },
//     { name: "Trending", icon: "🔥" },
//     { name: "Gaming", icon: "🎮" },
//     { name: "Music", icon: "🎵" },
//     { name: "Education", icon: "📚" },
//     { name: "Entertainment", icon: "🎬" },
//     { name: "Sports", icon: "⚽" },
//     { name: "Technology", icon: "💻" },
//     { name: "Cooking", icon: "🍳" },
//     { name: "Travel", icon: "✈️" },
//     { name: "Vlogs", icon: "📹" },
//     { name: "News", icon: "📰" },
//     { name: "Comedy", icon: "😂" },
//     { name: "Animation", icon: "🎨" },
//     { name: "Science", icon: "🔬" },
//     { name: "Fashion", icon: "👗" },
//     { name: "Fitness", icon: "💪" },
//     { name: "Other", icon: "📂" }
//   ];

//   const computeTrendingScore = (v) => {
//     const views = Number(v.views || 0);
//     const createdAt = v.createdAt ? new Date(v.createdAt) : new Date();
//     const daysSinceUpload = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
//     const recencyBoost = Math.max(0, TRENDING_DAYS_WINDOW - daysSinceUpload);
//     return views + recencyBoost * RECENCY_WEIGHT;
//   };

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = "en-US";

//       recognitionRef.current.onresult = (e) => {
//         const transcript = e.results[0][0].transcript;
//         setSearch(transcript);
//       };

//       recognitionRef.current.onerror = () => setIsListening(false);
//       recognitionRef.current.onend = () => setIsListening(false);
//     }
//   }, []);

//   const startVoiceSearch = () => {
//     if (!recognitionRef.current) return alert("Your browser does not support voice search.");
//     if (isListening) recognitionRef.current.stop();
//     else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       let res;

//       if (selectedCategory === "All") {
//         res = await axios.get("http://localhost:5000/api/videos/all");
//       } else if (selectedCategory === "Trending") {
//         res = await axios.get("http://localhost:5000/api/videos/all");
//         const scored = res.data
//           .map(v => ({ ...v, score: computeTrendingScore(v) }))
//           .sort((a, b) => b.score - a.score)
//           .slice(0, TOP_N);
//         setVideos(scored);
//         setFiltered(scored);
//         setLoading(false);
//         return;
//       } else {
//         res = await axios.get(`http://localhost:5000/api/videos/category/${selectedCategory}`);
//       }

//       setVideos(res.data);
//       setFiltered(res.data);
//     } catch (err) {
//       console.error("Error fetching videos:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchVideos();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [selectedCategory]);

//   useEffect(() => {
//     if (search.trim() === "") {
//       setFiltered(videos);
//       return;
//     }
//     axios
//       .get(`http://localhost:5000/api/search?query=${encodeURIComponent(search)}`)
//       .then(res => setFiltered(res.data))
//       .catch(() => setFiltered(videos));
//   }, [search, videos]);

//   const formatDuration = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const formatViews = (views) => {
//     if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
//     if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
//     return views;
//   };

//   const getTimeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     const intervals = {
//       year: 31536000,
//       month: 2592000,
//       week: 604800,
//       day: 86400,
//       hour: 3600,
//       minute: 60
//     };

//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) {
//         return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
//       }
//     }
//     return 'Just now';
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className="navbar">
//         <div className="nav-left">
//           <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
//             <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//               <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
//             </svg>
//           </button>
//           <h1 className="logo" onClick={() => navigate("/")}>
//             <span className="logo-icon">▶</span>MyTube
//           </h1>
//         </div>

//         <div className="nav-center">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="search-input"
//             />
//             <button className="search-btn">
//               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                 <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
//               </svg>
//             </button>
//             <button className={`voice-btn ${isListening ? "listening" : ""}`} onClick={startVoiceSearch}>
//               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                 <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
//                 <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="nav-right">
//           {user && (
//             <>
//               <button className="icon-btn" onClick={() => navigate("/history")} title="Watch History">
//                 <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//                   <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
//                 </svg>
//               </button>
//               <button className="icon-btn" onClick={() => navigate("/UserUpload")} title="Upload">
//                 <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//                   <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
//                 </svg>
//               </button>
//               <button className="profile-btn" onClick={() => navigate("/profile")}>
//                 <div className="avatar">{user.username?.charAt(0).toUpperCase() || "U"}</div>
//               </button>
//             </>
//           )}

//           {user ? (
//             <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
//               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: 6 }}>
//                 <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
//               </svg>
//               Logout
//             </button>
//           ) : (
//             <button className="login-btn" onClick={() => navigate("/login")}>
//               Sign in
//             </button>
//           )}
//         </div>
//       </nav>

//       {/* SIDEBAR */}
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

//       {/* CATEGORY CHIPS */}
//       <div className="category-bar">
//         <div className="category-scroll">
//           {categories.map((cat) => (
//             <button
//               key={cat.name}
//               className={`category-chip ${selectedCategory === cat.name ? "active" : ""}`}
//               onClick={() => setSelectedCategory(cat.name)}
//             >
//               <span className="chip-icon">{cat.icon}</span>
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="main-content" style={{ marginLeft: sidebarOpen && window.innerWidth >= 1024 ? "240px" : "0" }}>
//         {loading ? (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading amazing videos...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="empty-state">
//             <svg width="120" height="120" viewBox="0 0 24 24" fill="#606060">
//               <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
//             </svg>
//             <h2>No videos found</h2>
//             <p>{search ? `Try different keywords for "${search}"` : "No videos available in this category"}</p>
//           </div>
//         ) : (
//           <div className="video-grid">
//             {filtered.map((v) => (
//               <div key={v._id} className="video-card" onClick={() => navigate(`/watch/${v.filename}`)}>
//                 <div className="thumbnail-container">
//                   <img src={`http://localhost:5000/uploads/${v.thumbnail}`} alt={v.title} className="thumbnail" />
                  
//                   {/* Duration Badge */}
//                   <div className="duration-badge">
//                     {v.duration ? formatDuration(v.duration) : "0:00"}
//                   </div>
                  
//                   {/* Hover Preview */}
//                   <video
//                     muted
//                     preload="none"
//                     className="preview-video"
//                     onMouseEnter={(e) => e.target.play()}
//                     onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
//                   >
//                     <source src={`http://localhost:5000/api/stream/${v.filename}`} type="video/mp4" />
//                   </video>

//                   {v.category && <div className="category-badge">{v.category}</div>}
                  
//                   {/* Watch Later Button */}
//                   <button className="watch-later-btn" onClick={(e) => { e.stopPropagation(); }}>
//                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                       <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
//                     </svg>
//                   </button>
//                 </div>

//                 <div className="video-details">
//                   <div className="channel-avatar" onClick={(e) => { 
//                     e.stopPropagation(); 
//                     navigate(`/profile/${v.uploadedBy?._id}`); 
//                   }}>
//                     {v.uploadedBy?.name?.charAt(0).toUpperCase() || "U"}
//                   </div>
                  
//                   <div className="video-meta">
//                     <h3 className="video-title">{v.title}</h3>
//                     <div className="video-channel">{v.uploadedBy?.name || "Unknown Channel"}</div>
//                     <div className="video-stats">
//                       <span>{formatViews(v.views || 0)} views</span>
//                       <span className="dot">•</span>
//                       <span>{getTimeAgo(v.createdAt)}</span>
//                     </div>
//                   </div>

//                   <button className="more-btn" onClick={(e) => { e.stopPropagation(); }}>
//                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                       <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       <style jsx>{`
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body { font-family: 'Roboto', 'Arial', sans-serif; background: #0f0f0f; color: #fff; }

//         /* NAVBAR */
//         .navbar {
//           position: sticky; top: 0; z-index: 1000; background: #0f0f0f;
//           padding: 0 16px; height: 56px; display: flex; align-items: center;
//           justify-content: space-between; border-bottom: 1px solid #272727;
//         }

//         .nav-left { display: flex; align-items: center; gap: 16px; }
//         .hamburger {
//           background: transparent; border: none; color: #fff; cursor: pointer;
//           padding: 8px; border-radius: 50%; transition: background 0.2s;
//           display: flex; align-items: center; justify-content: center;
//         }
//         .hamburger:hover { background: rgba(255,255,255,0.1); }

//         .logo {
//           font-size: 20px; font-weight: 700; color: #fff; cursor: pointer;
//           display: flex; align-items: center; gap: 4px; letter-spacing: -0.5px;
//         }
//         .logo-icon {
//           color: #ff0000; font-size: 24px; font-weight: 900;
//         }

//         .nav-center { flex: 1; max-width: 640px; margin: 0 40px; }
//         .search-container {
//           display: flex; height: 40px; border: 1px solid #303030; border-radius: 40px;
//           overflow: hidden; background: #121212;
//         }
//         .search-input {
//           flex: 1; padding: 0 16px; background: transparent; border: none;
//           color: #fff; font-size: 16px; outline: none;
//         }
//         .search-btn, .voice-btn {
//           width: 64px; background: transparent; border: none; color: #fff;
//           cursor: pointer; display: flex; align-items: center; justify-content: center;
//           transition: background 0.2s;
//         }
//         .search-btn { border-left: 1px solid #303030; }
//         .voice-btn { border-left: 1px solid #303030; }
//         .search-btn:hover, .voice-btn:hover { background: rgba(255,255,255,0.1); }
//         .voice-btn.listening { color: #ff0000; animation: pulse 1.5s infinite; }
//         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

//         .nav-right { display: flex; align-items: center; gap: 8px; }
//         .icon-btn, .profile-btn {
//           background: transparent; border: none; color: #fff; cursor: pointer;
//           padding: 8px; border-radius: 50%; transition: background 0.2s;
//           display: flex; align-items: center; justify-content: center;
//         }
//         .icon-btn:hover, .profile-btn:hover { background: rgba(255,255,255,0.1); }

//         .avatar {
//           width: 32px; height: 32px; background: linear-gradient(135deg, #065fd4, #0b7dda);
//           border-radius: 50%; display: flex; align-items: center; justify-content: center;
//           font-weight: 600; font-size: 14px; color: white;
//         }

//         .login-btn, .logout-btn {
//           padding: 8px 16px; border-radius: 24px; font-weight: 500; font-size: 14px;
//           cursor: pointer; transition: all 0.2s; display: flex; align-items: center;
//         }
//         .login-btn {
//           background: transparent; color: #3ea6ff; border: 1px solid #3ea6ff;
//         }
//         .logout-btn {
//           background: transparent; color: #fff; border: 1px solid #303030;
//         }
//         .login-btn:hover { background: rgba(62, 166, 255, 0.1); }
//         .logout-btn:hover { background: rgba(255,255,255,0.1); }

//         /* CATEGORY BAR */
//         .category-bar {
//           position: sticky; top: 56px; z-index: 999; background: #0f0f0f;
//           padding: 12px 0; border-bottom: 1px solid #272727;
//         }
//         .category-scroll {
//           display: flex; gap: 12px; overflow-x: auto; padding: 0 24px;
//           scrollbar-width: none; -ms-overflow-style: none;
//         }
//         .category-scroll::-webkit-scrollbar { display: none; }

//         .category-chip {
//           padding: 8px 16px; background: rgba(255,255,255,0.1); color: #fff;
//           border: none; border-radius: 8px; font-size: 14px; font-weight: 500;
//           cursor: pointer; white-space: nowrap; transition: all 0.2s;
//           display: flex; align-items: center; gap: 6px;
//         }
//         .category-chip:hover { background: rgba(255,255,255,0.2); }
//         .category-chip.active {
//           background: #fff; color: #0f0f0f;
//         }
//         .chip-icon { font-size: 16px; }

//         /* MAIN CONTENT */
//         .main-content {
//           max-width: 2560px; margin: 0 auto; padding: 24px;
//           transition: margin-left 0.3s;
//         }

//         .loading-state, .empty-state {
//           display: flex; flex-direction: column; align-items: center;
//           justify-content: center; padding: 80px 20px; text-align: center;
//         }
//         .spinner {
//           width: 48px; height: 48px; border: 4px solid #303030;
//           border-top-color: #ff0000; border-radius: 50%;
//           animation: spin 0.8s linear infinite; margin-bottom: 16px;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .empty-state h2 { margin: 16px 0 8px; font-size: 20px; }
//         .empty-state p { color: #aaa; font-size: 14px; }

//         /* VIDEO GRID */
//         .video-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//           gap: 16px;
//         }

//         .video-card {
//           cursor: pointer; transition: transform 0.2s;
//         }
//         .video-card:hover { transform: scale(1.02); }

//         .thumbnail-container {
//           position: relative; width: 100%; aspect-ratio: 16/9;
//           border-radius: 12px; overflow: hidden; background: #000;
//         }
//         .thumbnail {
//           width: 100%; height: 100%; object-fit: cover;
//           transition: opacity 0.3s;
//         }

//         .preview-video {
//           position: absolute; inset: 0; width: 100%; height: 100%;
//           object-fit: cover; opacity: 0; pointer-events: none;
//           transition: opacity 0.3s;
//         }
//         .video-card:hover .preview-video { opacity: 1; pointer-events: auto; }
//         .video-card:hover .thumbnail { opacity: 0; }

//         .duration-badge {
//           position: absolute; bottom: 8px; right: 8px;
//           background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
//           color: white; padding: 3px 6px; border-radius: 4px;
//           font-size: 12px; font-weight: 600;
//         }

//         .category-badge {
//           position: absolute; top: 8px; right: 8px;
//           background: rgba(255,0,0,0.9); backdrop-filter: blur(4px);
//           color: white; padding: 4px 8px; border-radius: 4px;
//           font-size: 11px; font-weight: 600;
//         }

//         .watch-later-btn {
//           position: absolute; top: 8px; right: 8px;
//           background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
//           border: none; color: white; width: 36px; height: 36px;
//           border-radius: 50%; cursor: pointer; opacity: 0;
//           transition: opacity 0.2s; display: flex; align-items: center;
//           justify-content: center;
//         }
//         .video-card:hover .watch-later-btn { opacity: 1; }
//         .watch-later-btn:hover { background: rgba(255,255,255,0.2); }

//         .video-details {
//           display: flex; gap: 12px; margin-top: 12px; position: relative;
//         }

//         .channel-avatar {
//           width: 36px; height: 36px; border-radius: 50%;
//           background: linear-gradient(135deg, #065fd4, #0b7dda);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 14px; font-weight: 600; flex-shrink: 0;
//           cursor: pointer;
//         }

//         .video-meta { flex: 1; min-width: 0; }
//         .video-title {
//           font-size: 14px; font-weight: 500; line-height: 1.4;
//           margin-bottom: 4px; display: -webkit-box;
//           -webkit-line-clamp: 2; -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .video-channel {
//           font-size: 12px; color: #aaa; margin-bottom: 2px;
//           font-weight: 400;
//         }
//         .video-stats {
//           font-size: 12px; color: #aaa; display: flex;
//           align-items: center; gap: 4px;
//         }
//         .dot { font-size: 10px; }

//         .more-btn {
//           background: transparent; border: none; color: #aaa;
//           cursor: pointer; padding: 0; width: 24px; height: 24px;
//           border-radius: 50%; transition: background 0.2s;
//           display: flex; align-items: center; justify-content: center;
//           opacity: 0;
//         }
//         .video-card:hover .more-btn { opacity: 1; }
//         .more-btn:hover { background: rgba(255,255,255,0.1); }

//         @media (max-width: 1024px) {
//           .video-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
//         }

//         @media (max-width: 768px) {
//           .nav-center { display: none; }
//           .video-grid { grid-template-columns: 1fr; }
//           .category-scroll { padding: 0 12px; }
//           .main-content { padding: 16px 12px; }
//         }
//       `}</style>
//     </>
//   );
// }

// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const TRENDING_DAYS_WINDOW = 7;
// const RECENCY_WEIGHT = 1000;
// const TOP_N = 50;

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [isListening, setIsListening] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const categoryParam = searchParams.get("category");
//     if (categoryParam) setSelectedCategory(categoryParam);
//   }, [searchParams]);

//   const categories = [
//     { name: "All", icon: "🏠" },
//     { name: "Trending", icon: "🔥" },
//     { name: "Gaming", icon: "🎮" },
//     { name: "Music", icon: "🎵" },
//     { name: "Education", icon: "📚" },
//     { name: "Entertainment", icon: "🎬" },
//     { name: "Sports", icon: "⚽" },
//     { name: "Technology", icon: "💻" },
//     { name: "Cooking", icon: "🍳" },
//     { name: "Travel", icon: "✈️" },
//     { name: "Vlogs", icon: "📹" },
//     { name: "News", icon: "📰" },
//     { name: "Comedy", icon: "😂" },
//     { name: "Animation", icon: "🎨" },
//     { name: "Science", icon: "🔬" },
//     { name: "Fashion", icon: "👗" },
//     { name: "Fitness", icon: "💪" },
//     { name: "Other", icon: "📂" }
//   ];

//   const computeTrendingScore = (v) => {
//     const views = Number(v.views || 0);
//     const createdAt = v.createdAt ? new Date(v.createdAt) : new Date();
//     const daysSinceUpload = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
//     const recencyBoost = Math.max(0, TRENDING_DAYS_WINDOW - daysSinceUpload);
//     return views + recencyBoost * RECENCY_WEIGHT;
//   };

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = "en-US";

//       recognitionRef.current.onresult = (e) => {
//         const transcript = e.results[0][0].transcript;
//         setSearch(transcript);
//       };

//       recognitionRef.current.onerror = () => setIsListening(false);
//       recognitionRef.current.onend = () => setIsListening(false);
//     }
//   }, []);

//   const startVoiceSearch = () => {
//     if (!recognitionRef.current) {
//       alert("❌ Your browser does not support voice search. Try Chrome or Edge.");
//       return;
//     }
//     if (isListening) {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);

//       // 🎯 PERSONALIZED FEED (if logged in + "All" category)
//       // if (selectedCategory === "All" && user) {
//         if (selectedCategory === "All" && user && user.watchCount > 0) {

//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           "http://localhost:5000/api/videos/recommended",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setVideos(res.data);
//         setFiltered(res.data);
//         setLoading(false);
//         return;
//       }

//       // 🔥 TRENDING FEED
//       if (selectedCategory === "Trending") {
//         const res = await axios.get("http://localhost:5000/api/videos/all");
//         const scored = res.data
//           .map((v) => ({ ...v, score: computeTrendingScore(v) }))
//           .sort((a, b) => b.score - a.score)
//           .slice(0, TOP_N);
//         setVideos(scored);
//         setFiltered(scored);
//         setLoading(false);
//         return;
//       }

//       // 📂 CATEGORY OR ALL (guest users)
//       let res;
//       if (selectedCategory === "All") {
//         res = await axios.get("http://localhost:5000/api/videos/all");
//       } else {
//         try {
//           res = await axios.get(`http://localhost:5000/api/videos/category/${selectedCategory}`);
//         } catch (err) {
//           res = await axios.get("http://localhost:5000/api/videos/all");
//           res.data = res.data.filter(v => v.category === selectedCategory);
//         }
//       }

//       setVideos(res.data);
//       setFiltered(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching videos:", err);
//       setVideos([]);
//       setFiltered([]);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [selectedCategory, user]);

//   useEffect(() => {
//     if (search.trim() === "") {
//       setFiltered(videos);
//       return;
//     }
    
//     const searchVideos = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(search)}`);
//         setFiltered(res.data);
//       } catch (err) {
//         console.error("Search error:", err);
//         const searchLower = search.toLowerCase();
//         const results = videos.filter(v => 
//           v.title?.toLowerCase().includes(searchLower) ||
//           v.description?.toLowerCase().includes(searchLower) ||
//           v.uploadedBy?.name?.toLowerCase().includes(searchLower)
//         );
//         setFiltered(results);
//       }
//     };

//     const timeoutId = setTimeout(searchVideos, 300);
//     return () => clearTimeout(timeoutId);
//   }, [search, videos]);

//   const formatViews = (views) => {
//     if (!views) return "0";
//     if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
//     if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
//     return views.toString();
//   };

//   const getTimeAgo = (date) => {
//     if (!date) return "Just now";
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     const intervals = {
//       year: 31536000,
//       month: 2592000,
//       week: 604800,
//       day: 86400,
//       hour: 3600,
//       minute: 60,
//     };

//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
//     }
//     return "Just now";
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds || isNaN(seconds)) return "0:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className="navbar">
//         <div className="nav-left">
//           <h1 className="logo" onClick={() => navigate("/")}>
//             <span className="logo-icon">▶</span>MyTube
//           </h1>
//         </div>

//         <div className="nav-center">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="search-input"
//             />
//             <button className="search-btn">
//               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                 <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
//               </svg>
//             </button>
//             <button className={`voice-btn ${isListening ? "listening" : ""}`} onClick={startVoiceSearch}>
//               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                 <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
//                 <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="nav-right">
//           {user && (
//             <>
//               <button className="icon-btn" onClick={() => navigate("/history")} title="Watch History">
//                 <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//                   <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
//                 </svg>
//               </button>
//               <button className="icon-btn" onClick={() => navigate("/UserUpload")} title="Upload">
//                 <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//                   <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
//                 </svg>
//               </button>
//               <button className="profile-btn" onClick={() => navigate("/profile")}>
//                 <div className="avatar">{user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}</div>
//               </button>
//             </>
//           )}

//           {user ? (
//             <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
//               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: 6 }}>
//                 <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
//               </svg>
//               Logout
//             </button>
//           ) : (
//             <button className="login-btn" onClick={() => navigate("/login")}>
//               Sign in
//             </button>
//           )}
//         </div>
//       </nav>

//       {/* CATEGORY CHIPS */}
//       <div className="category-bar">
//         <div className="category-scroll">
//           {categories.map((cat) => (
//             <button
//               key={cat.name}
//               className={`category-chip ${selectedCategory === cat.name ? "active" : ""}`}
//               onClick={() => setSelectedCategory(cat.name)}
//             >
//               <span className="chip-icon">{cat.icon}</span>
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         {loading ? (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading amazing videos...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="empty-state">
//             <svg width="120" height="120" viewBox="0 0 24 24" fill="#606060">
//               <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
//             </svg>
//             <h2>No videos found</h2>
//             <p>{search ? `Try different keywords for "${search}"` : "No videos available in this category"}</p>
//           </div>
//         ) : (
//           <div className="video-grid">
//             {filtered.map((v) => (
//               <div key={v._id} className="video-card" onClick={() => navigate(`/watch/${v.filename}`)}>
//                 <div className="thumbnail-container">
//                   <img 
//                     src={`http://localhost:5000/uploads/${v.thumbnail}`} 
//                     alt={v.title} 
//                     className="thumbnail"
//                     onError={(e) => {
//                       e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect fill="%23333" width="320" height="180"/></svg>';
//                     }}
//                   />
                  
//                   <div className="duration-badge">
//                     {v.duration ? formatDuration(v.duration) : "0:00"}
//                   </div>

//                   {v.category && <div className="category-badge">{v.category}</div>}
//                 </div>

//                 <div className="video-details">
//                   <div 
//                     className="channel-avatar" 
//                     onClick={(e) => { 
//                       e.stopPropagation(); 
//                       if (v.uploadedBy?._id) navigate(`/profile/${v.uploadedBy._id}`); 
//                     }}
//                   >
//                     {v.uploadedBy?.name?.charAt(0).toUpperCase() || "U"}
//                   </div>
                  
//                   <div className="video-meta">
//                     <h3 className="video-title">{v.title || "Untitled Video"}</h3>
//                     <div className="video-channel">{v.uploadedBy?.name || "Unknown Channel"}</div>
//                     <div className="video-stats">
//                       <span>{formatViews(v.views)} views</span>
//                       <span className="dot">•</span>
//                       <span>{getTimeAgo(v.createdAt)}</span>
//                     </div>
//                   </div>

//                   <button className="more-btn" onClick={(e) => e.stopPropagation()}>
//                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                       <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       <style jsx>{`
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body { font-family: 'Roboto', 'Arial', sans-serif; background: #0f0f0f; color: #fff; }

//         .navbar {
//           position: sticky; top: 0; z-index: 1000; background: #0f0f0f;
//           padding: 0 16px; height: 56px; display: flex; align-items: center;
//           justify-content: space-between; border-bottom: 1px solid #272727;
//         }

//         .nav-left { display: flex; align-items: center; gap: 16px; }

//         .logo {
//           font-size: 20px; font-weight: 700; color: #fff; cursor: pointer;
//           display: flex; align-items: center; gap: 4px; letter-spacing: -0.5px;
//         }
//         .logo-icon { color: #ff0000; font-size: 24px; font-weight: 900; }

//         .nav-center { flex: 1; max-width: 640px; margin: 0 40px; }
//         .search-container {
//           display: flex; height: 40px; border: 1px solid #303030; border-radius: 40px;
//           overflow: hidden; background: #121212;
//         }
//         .search-input {
//           flex: 1; padding: 0 16px; background: transparent; border: none;
//           color: #fff; font-size: 16px; outline: none;
//         }
//         .search-btn, .voice-btn {
//           width: 64px; background: transparent; border: none; color: #fff;
//           cursor: pointer; display: flex; align-items: center; justify-content: center;
//           transition: background 0.2s;
//         }
//         .search-btn { border-left: 1px solid #303030; }
//         .voice-btn { border-left: 1px solid #303030; }
//         .search-btn:hover, .voice-btn:hover { background: rgba(255,255,255,0.1); }
//         .voice-btn.listening { color: #ff0000; animation: pulse 1.5s infinite; }
//         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

//         .nav-right { display: flex; align-items: center; gap: 8px; }
//         .icon-btn, .profile-btn {
//           background: transparent; border: none; color: #fff; cursor: pointer;
//           padding: 8px; border-radius: 50%; transition: background 0.2s;
//           display: flex; align-items: center; justify-content: center;
//         }
//         .icon-btn:hover, .profile-btn:hover { background: rgba(255,255,255,0.1); }

//         .avatar {
//           width: 32px; height: 32px; background: linear-gradient(135deg, #065fd4, #0b7dda);
//           border-radius: 50%; display: flex; align-items: center; justify-content: center;
//           font-weight: 600; font-size: 14px; color: white;
//         }

//         .login-btn, .logout-btn {
//           padding: 8px 16px; border-radius: 24px; font-weight: 500; font-size: 14px;
//           cursor: pointer; transition: all 0.2s; display: flex; align-items: center;
//         }
//         .login-btn { background: transparent; color: #3ea6ff; border: 1px solid #3ea6ff; }
//         .logout-btn { background: transparent; color: #fff; border: 1px solid #303030; }
//         .login-btn:hover { background: rgba(62, 166, 255, 0.1); }
//         .logout-btn:hover { background: rgba(255,255,255,0.1); }

//         .category-bar {
//           position: sticky; top: 56px; z-index: 999; background: #0f0f0f;
//           padding: 12px 0; border-bottom: 1px solid #272727;
//         }
//         .category-scroll {
//           display: flex; gap: 12px; overflow-x: auto; padding: 0 24px;
//           scrollbar-width: none; -ms-overflow-style: none;
//         }
//         .category-scroll::-webkit-scrollbar { display: none; }

//         .category-chip {
//           padding: 8px 16px; background: rgba(255,255,255,0.1); color: #fff;
//           border: none; border-radius: 8px; font-size: 14px; font-weight: 500;
//           cursor: pointer; white-space: nowrap; transition: all 0.2s;
//           display: flex; align-items: center; gap: 6px;
//         }
//         .category-chip:hover { background: rgba(255,255,255,0.2); }
//         .category-chip.active { background: #fff; color: #0f0f0f; }
//         .chip-icon { font-size: 16px; }

//         .main-content { max-width: 2560px; margin: 0 auto; padding: 24px; }

//         .loading-state, .empty-state {
//           display: flex; flex-direction: column; align-items: center;
//           justify-content: center; padding: 80px 20px; text-align: center;
//         }
//         .spinner {
//           width: 48px; height: 48px; border: 4px solid #303030;
//           border-top-color: #ff0000; border-radius: 50%;
//           animation: spin 0.8s linear infinite; margin-bottom: 16px;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .empty-state h2 { margin: 16px 0 8px; font-size: 20px; }
//         .empty-state p { color: #aaa; font-size: 14px; }

//         .video-grid {
//           display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;
//         }

//         .video-card { cursor: pointer; transition: transform 0.2s; }
//         .video-card:hover { transform: scale(1.02); }

//         .thumbnail-container {
//           position: relative; width: 100%; aspect-ratio: 16/9;
//           border-radius: 12px; overflow: hidden; background: #000;
//         }
//         .thumbnail { width: 100%; height: 100%; object-fit: cover; }

//         .duration-badge {
//           position: absolute; bottom: 8px; right: 8px;
//           background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
//           color: white; padding: 3px 6px; border-radius: 4px;
//           font-size: 12px; font-weight: 600;
//         }

//         .category-badge {
//           position: absolute; top: 8px; right: 8px;
//           background: rgba(255,0,0,0.9); backdrop-filter: blur(4px);
//           color: white; padding: 4px 8px; border-radius: 4px;
//           font-size: 11px; font-weight: 600;
//         }

//         .video-details {
//           display: flex; gap: 12px; margin-top: 12px; position: relative;
//         }

//         .channel-avatar {
//           width: 36px; height: 36px; border-radius: 50%;
//           background: linear-gradient(135deg, #065fd4, #0b7dda);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 14px; font-weight: 600; flex-shrink: 0; cursor: pointer;
//         }

//         .video-meta { flex: 1; min-width: 0; }
//         .video-title {
//           font-size: 14px; font-weight: 500; line-height: 1.4;
//           margin-bottom: 4px; display: -webkit-box;
//           -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
//         }
//         .video-channel { font-size: 12px; color: #aaa; margin-bottom: 2px; font-weight: 400; }
//         .video-stats {
//           font-size: 12px; color: #aaa; display: flex; align-items: center; gap: 4px;
//         }
//         .dot { font-size: 10px; }

//         .more-btn {
//           background: transparent; border: none; color: #aaa; cursor: pointer;
//           padding: 0; width: 24px; height: 24px; border-radius: 50%;
//           transition: background 0.2s; display: flex; align-items: center;
//           justify-content: center; opacity: 0;
//         }
//         .video-card:hover .more-btn { opacity: 1; }
//         .more-btn:hover { background: rgba(255,255,255,0.1); }

//         @media (max-width: 1024px) {
//           .video-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
//         }

//         @media (max-width: 768px) {
//           .nav-center { display: none; }
//           .video-grid { grid-template-columns: 1fr; }
//           .category-scroll { padding: 0 12px; }
//           .main-content { padding: 16px 12px; }
//         }
//       `}</style>
//     </>
//   );
// }

// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const TRENDING_DAYS_WINDOW = 7;
// const RECENCY_WEIGHT = 1000;
// const TOP_N = 50;

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [isListening, setIsListening] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const recognitionRef = useRef(null);
//   const userMenuRef = useRef(null);

//   useEffect(() => {
//     const categoryParam = searchParams.get("category");
//     if (categoryParam) setSelectedCategory(categoryParam);
//   }, [searchParams]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setShowUserMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const categories = [
//     { name: "All", icon: "🏠" },
//     { name: "Trending", icon: "🔥" },
//     { name: "Gaming", icon: "🎮" },
//     { name: "Music", icon: "🎵" },
//     { name: "Education", icon: "📚" },
//     { name: "Entertainment", icon: "🎬" },
//     { name: "Sports", icon: "⚽" },
//     { name: "Technology", icon: "💻" },
//     { name: "Cooking", icon: "🍳" },
//     { name: "Travel", icon: "✈️" },
//     { name: "Vlogs", icon: "📹" },
//     { name: "News", icon: "📰" },
//     { name: "Comedy", icon: "😂" },
//     { name: "Animation", icon: "🎨" },
//     { name: "Science", icon: "🔬" },
//     { name: "Fashion", icon: "👗" },
//     { name: "Fitness", icon: "💪" },
//     { name: "Other", icon: "📂" }
//   ];

//   const computeTrendingScore = (v) => {
//     const views = Number(v.views || 0);
//     const createdAt = v.createdAt ? new Date(v.createdAt) : new Date();
//     const daysSinceUpload = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
//     const recencyBoost = Math.max(0, TRENDING_DAYS_WINDOW - daysSinceUpload);
//     return views + recencyBoost * RECENCY_WEIGHT;
//   };

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = "en-US";

//       recognitionRef.current.onresult = (e) => {
//         const transcript = e.results[0][0].transcript;
//         setSearch(transcript);
//       };

//       recognitionRef.current.onerror = () => setIsListening(false);
//       recognitionRef.current.onend = () => setIsListening(false);
//     }
//   }, []);

//   const startVoiceSearch = () => {
//     if (!recognitionRef.current) {
//       alert("❌ Your browser does not support voice search. Try Chrome or Edge.");
//       return;
//     }
//     if (isListening) {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);

//       if (selectedCategory === "All" && user && user.watchCount > 0) {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           "http://localhost:5000/api/videos/recommended",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setVideos(res.data);
//         setFiltered(res.data);
//         setLoading(false);
//         return;
//       }

//       if (selectedCategory === "Trending") {
//         const res = await axios.get("http://localhost:5000/api/videos/all");
//         const scored = res.data
//           .map((v) => ({ ...v, score: computeTrendingScore(v) }))
//           .sort((a, b) => b.score - a.score)
//           .slice(0, TOP_N);
//         setVideos(scored);
//         setFiltered(scored);
//         setLoading(false);
//         return;
//       }

//       let res;
//       if (selectedCategory === "All") {
//         res = await axios.get("http://localhost:5000/api/videos/all");
//       } else {
//         try {
//           res = await axios.get(`http://localhost:5000/api/videos/category/${selectedCategory}`);
//         } catch (err) {
//           res = await axios.get("http://localhost:5000/api/videos/all");
//           res.data = res.data.filter(v => v.category === selectedCategory);
//         }
//       }

//       setVideos(res.data);
//       setFiltered(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching videos:", err);
//       setVideos([]);
//       setFiltered([]);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [selectedCategory, user]);

//   useEffect(() => {
//     if (search.trim() === "") {
//       setFiltered(videos);
//       return;
//     }
    
//     const searchVideos = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(search)}`);
//         setFiltered(res.data);
//       } catch (err) {
//         console.error("Search error:", err);
//         const searchLower = search.toLowerCase();
//         const results = videos.filter(v => 
//           v.title?.toLowerCase().includes(searchLower) ||
//           v.description?.toLowerCase().includes(searchLower) ||
//           v.uploadedBy?.name?.toLowerCase().includes(searchLower)
//         );
//         setFiltered(results);
//       }
//     };

//     const timeoutId = setTimeout(searchVideos, 300);
//     return () => clearTimeout(timeoutId);
//   }, [search, videos]);

//   const formatViews = (views) => {
//     if (!views) return "0";
//     if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
//     if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
//     return views.toString();
//   };

//   const getTimeAgo = (date) => {
//     if (!date) return "Just now";
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     const intervals = {
//       year: 31536000,
//       month: 2592000,
//       week: 604800,
//       day: 86400,
//       hour: 3600,
//       minute: 60,
//     };

//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
//     }
//     return "Just now";
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds || isNaN(seconds)) return "0:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className="navbar">
//         <div className="nav-left">
//           <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
//             <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//               <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
//             </svg>
//           </button>
//           <h1 className="logo" onClick={() => navigate("/")}>
//             <div className="logo-icon">▶</div>
//             <span className="logo-text">MyTube</span>
//           </h1>
//         </div>

//         <div className="nav-center">
//           <div className="search-wrapper">
//             <div className="search-container">
//               <button className="search-icon-btn">
//                 <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                   <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
//                 </svg>
//               </button>
//               <input
//                 type="text"
//                 placeholder="Search videos..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="search-input"
//               />
//               {search && (
//                 <button className="clear-btn" onClick={() => setSearch("")}>
//                   <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                     <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//                   </svg>
//                 </button>
//               )}
//             </div>
//             <button className={`voice-btn ${isListening ? "listening" : ""}`} onClick={startVoiceSearch}>
//               <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
//                 <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
//                 <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="nav-right">
//           {user && (
//             <>
//               <button className="icon-btn" onClick={() => navigate("/history")} title="Watch History">
//                 <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//                   <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
//                 </svg>
//               </button>
//               <button className="icon-btn upload-btn" onClick={() => navigate("/UserUpload")} title="Upload Video">
//                 <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
//                   <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
//                 </svg>
//               </button>
//               <div className="user-menu-container" ref={userMenuRef}>
//                 <button className="profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
//                   <div className="avatar">
//                     {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
//                   </div>
//                 </button>
//                 {showUserMenu && (
//                   <div className="user-menu">
//                     <div className="user-menu-header">
//                       <div className="avatar-large">
//                         {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
//                       </div>
//                       <div className="user-info">
//                         <div className="user-name">{user.name || user.username}</div>
//                         <div className="user-email">{user.email}</div>
//                       </div>
//                     </div>
//                     <div className="menu-divider"></div>
//                     <button className="menu-item" onClick={() => { navigate("/profile"); setShowUserMenu(false); }}>
//                       <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                         <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//                       </svg>
//                       Your Channel
//                     </button>
//                     <button className="menu-item" onClick={() => { navigate("/history"); setShowUserMenu(false); }}>
//                       <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                         <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
//                       </svg>
//                       Watch History
//                     </button>
//                     <div className="menu-divider"></div>
//                     <button className="menu-item logout-item" onClick={() => { logout(); navigate("/"); setShowUserMenu(false); }}>
//                       <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                         <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
//                       </svg>
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {!user && (
//             <button className="login-btn" onClick={() => navigate("/login")}>
//               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: 8 }}>
//                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//               </svg>
//               Sign in
//             </button>
//           )}
//         </div>
//       </nav>

//       {/* CATEGORY CHIPS */}
//       <div className="category-bar">
//         <div className="category-scroll">
//           {categories.map((cat) => (
//             <button
//               key={cat.name}
//               className={`category-chip ${selectedCategory === cat.name ? "active" : ""}`}
//               onClick={() => setSelectedCategory(cat.name)}
//             >
//               <span className="chip-icon">{cat.icon}</span>
//               <span className="chip-text">{cat.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         {loading ? (
//           <div className="loading-state">
//             <div className="loader-wrapper">
//               <div className="loader"></div>
//               <div className="loader-inner"></div>
//             </div>
//             <h3>Loading amazing videos...</h3>
//             <p>Hang tight, we're fetching the best content for you</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">
//               <svg width="120" height="120" viewBox="0 0 24 24" fill="url(#emptyGradient)">
//                 <defs>
//                   <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                     <stop offset="0%" stopColor="#666" />
//                     <stop offset="100%" stopColor="#999" />
//                   </linearGradient>
//                 </defs>
//                 <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
//               </svg>
//             </div>
//             <h2>No videos found</h2>
//             <p>{search ? `We couldn't find any results for "${search}"` : "No videos available in this category yet"}</p>
//             {search && (
//               <button className="clear-search-btn" onClick={() => setSearch("")}>
//                 Clear search
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="video-grid">
//             {filtered.map((v, index) => (
//               <div 
//                 key={v._id} 
//                 className="video-card" 
//                 onClick={() => navigate(`/watch/${v.filename}`)}
//                 style={{ animationDelay: `${index * 0.05}s` }}
//               >
//                 <div className="thumbnail-container">
//                   <img 
//                     src={`http://localhost:5000/uploads/${v.thumbnail}`} 
//                     alt={v.title} 
//                     className="thumbnail"
//                     onError={(e) => {
//                       e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect fill="%23222" width="320" height="180"/><text x="50%" y="50%" text-anchor="middle" fill="%23666" font-size="20" font-family="Arial">No Thumbnail</text></svg>';
//                     }}
//                   />
                  
//                   <div className="thumbnail-overlay">
//                     <button className="play-btn">
//                       <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
//                         <path d="M8 5v14l11-7z"/>
//                       </svg>
//                     </button>
//                   </div>

//                   <div className="duration-badge">
//                     {v.duration ? formatDuration(v.duration) : "0:00"}
//                   </div>

//                   {v.category && <div className="category-badge">{v.category}</div>}
//                 </div>

//                 <div className="video-details">
//                   <div 
//                     className="channel-avatar" 
//                     onClick={(e) => { 
//                       e.stopPropagation(); 
//                       if (v.uploadedBy?._id) navigate(`/profile/${v.uploadedBy._id}`); 
//                     }}
//                   >
//                     {v.uploadedBy?.name?.charAt(0).toUpperCase() || "U"}
//                   </div>
                  
//                   <div className="video-meta">
//                     <h3 className="video-title">{v.title || "Untitled Video"}</h3>
//                     <div className="video-channel">{v.uploadedBy?.name || "Unknown Channel"}</div>
//                     <div className="video-stats">
//                       <span className="stat-item">
//                         <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
//                           <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
//                         </svg>
//                         {formatViews(v.views)}
//                       </span>
//                       <span className="dot">•</span>
//                       <span className="stat-item">{getTimeAgo(v.createdAt)}</span>
//                     </div>
//                   </div>

//                   <button className="more-btn" onClick={(e) => e.stopPropagation()}>
//                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                       <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       <style jsx>{`
//         * { 
//           margin: 0; 
//           padding: 0; 
//           box-sizing: border-box; 
//         }
        
//         body { 
//           font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif; 
//           background: #0f0f0f; 
//           color: #fff;
//           overflow-x: hidden;
//         }

//         /* ========== NAVBAR ========== */
//         .navbar {
//           position: sticky; 
//           top: 0; 
//           z-index: 1000; 
//           background: rgba(15, 15, 15, 0.95);
//           backdrop-filter: blur(20px);
//           padding: 0 16px; 
//           height: 60px; 
//           display: flex; 
//           align-items: center;
//           justify-content: space-between; 
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
//         }

//         .nav-left { 
//           display: flex; 
//           align-items: center; 
//           gap: 16px; 
//           min-width: 200px;
//         }

//         .menu-btn {
//           background: transparent;
//           border: none;
//           color: #fff;
//           cursor: pointer;
//           padding: 8px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s ease;
//         }

//         .menu-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         .logo {
//           font-size: 22px; 
//           font-weight: 700; 
//           color: #fff; 
//           cursor: pointer;
//           display: flex; 
//           align-items: center; 
//           gap: 6px; 
//           letter-spacing: -0.5px;
//           transition: transform 0.3s ease;
//         }

//         .logo:hover {
//           transform: scale(1.05);
//         }

//         .logo-icon { 
//           width: 32px;
//           height: 32px;
//           background: linear-gradient(135deg, #ff0000, #cc0000);
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 18px;
//           color: white;
//           box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
//         }

//         .logo-text {
//           background: linear-gradient(135deg, #fff, #ddd);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .nav-center { 
//           flex: 1; 
//           max-width: 640px; 
//           margin: 0 40px; 
//         }

//         .search-wrapper {
//           display: flex;
//           gap: 12px;
//           align-items: center;
//         }

//         .search-container {
//           flex: 1;
//           display: flex; 
//           height: 42px; 
//           border: 1.5px solid rgba(255, 255, 255, 0.15); 
//           border-radius: 24px;
//           overflow: hidden; 
//           background: rgba(30, 30, 30, 0.6);
//           backdrop-filter: blur(10px);
//           transition: all 0.3s ease;
//         }

//         .search-container:focus-within {
//           border-color: #3ea6ff;
//           background: rgba(30, 30, 30, 0.9);
//           box-shadow: 0 0 0 3px rgba(62, 166, 255, 0.1);
//         }

//         .search-icon-btn {
//           padding: 0 16px;
//           background: transparent;
//           border: none;
//           color: #aaa;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .search-input {
//           flex: 1; 
//           padding: 0 8px 0 0; 
//           background: transparent; 
//           border: none;
//           color: #fff; 
//           font-size: 15px; 
//           outline: none;
//         }

//         .search-input::placeholder {
//           color: #aaa;
//         }

//         .clear-btn {
//           padding: 0 12px;
//           background: transparent;
//           border: none;
//           color: #aaa;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: color 0.2s;
//         }

//         .clear-btn:hover {
//           color: #fff;
//         }

//         .voice-btn {
//           width: 42px;
//           height: 42px;
//           background: rgba(255, 255, 255, 0.1);
//           border: none; 
//           color: #fff;
//           cursor: pointer; 
//           display: flex; 
//           align-items: center; 
//           justify-content: center;
//           border-radius: 50%;
//           transition: all 0.3s ease;
//           flex-shrink: 0;
//         }

//         .voice-btn:hover { 
//           background: rgba(255, 255, 255, 0.15);
//           transform: scale(1.05);
//         }

//         .voice-btn.listening { 
//           color: #ff0000; 
//           background: rgba(255, 0, 0, 0.1);
//           animation: pulse 1.5s infinite; 
//         }

//         @keyframes pulse { 
//           0%, 100% { 
//             opacity: 1; 
//             transform: scale(1);
//           } 
//           50% { 
//             opacity: 0.7;
//             transform: scale(1.1);
//           } 
//         }

//         .nav-right { 
//           display: flex; 
//           align-items: center; 
//           gap: 8px; 
//           min-width: 200px;
//           justify-content: flex-end;
//         }

//         .icon-btn {
//           background: transparent; 
//           border: none; 
//           color: #fff; 
//           cursor: pointer;
//           padding: 10px; 
//           border-radius: 50%; 
//           transition: all 0.2s ease;
//           display: flex; 
//           align-items: center; 
//           justify-content: center;
//         }

//         .icon-btn:hover { 
//           background: rgba(255, 255, 255, 0.1);
//           transform: scale(1.05);
//         }

//         .upload-btn:hover {
//           background: rgba(255, 0, 0, 0.1);
//           color: #ff4444;
//         }

//         .user-menu-container {
//           position: relative;
//         }

//         .profile-btn {
//           background: transparent;
//           border: none;
//           cursor: pointer;
//           padding: 4px;
//           border-radius: 50%;
//           transition: all 0.2s ease;
//         }

//         .profile-btn:hover {
//           transform: scale(1.05);
//         }

//         .avatar {
//           width: 36px; 
//           height: 36px; 
//           background: linear-gradient(135deg, #065fd4, #0b7dda);
//           border-radius: 50%; 
//           display: flex; 
//           align-items: center; 
//           justify-content: center;
//           font-weight: 600; 
//           font-size: 16px; 
//           color: white;
//           box-shadow: 0 2px 8px rgba(6, 95, 212, 0.3);
//         }

//         .user-menu {
//           position: absolute;
//           top: calc(100% + 8px);
//           right: 0;
//           background: rgba(40, 40, 40, 0.98);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           min-width: 280px;
//           box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
//           animation: slideDown 0.2s ease;
//           overflow: hidden;
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .user-menu-header {
//           padding: 16px;
//           display: flex;
//           gap: 12px;
//           align-items: center;
//         }

//         .avatar-large {
//           width: 48px;
//           height: 48px;
//           background: linear-gradient(135deg, #065fd4, #0b7dda);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 600;
//           font-size: 20px;
//           color: white;
//           flex-shrink: 0;
//         }

//         .user-info {
//           flex: 1;
//           min-width: 0;
//         }

//         .user-name {
//           font-weight: 600;
//           font-size: 15px;
//           color: #fff;
//           margin-bottom: 4px;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }

//         .user-email {
//           font-size: 13px;
//           color: #aaa;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }

//         .menu-divider {
//           height: 1px;
//           background: rgba(255, 255, 255, 0.1);
//           margin: 8px 0;
//         }

//         .menu-item {
//           width: 100%;
//           padding: 12px 16px;
//           background: transparent;
//           border: none;
//           color: #fff;
//           font-size: 14px;
//           text-align: left;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           transition: background 0.2s ease;
//         }

//         .menu-item:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         .logout-item {
//           color: #ff4444;
//         }

//         .logout-item:hover {
//           background: rgba(255, 68, 68, 0.1);
//         }

//         .login-btn {
//           padding: 8px 18px; 
//           border-radius: 24px; 
//           font-weight: 500; 
//           font-size: 14px;
//           cursor: pointer; 
//           transition: all 0.3s ease; 
//           display: flex; 
//           align-items: center;
//           background: transparent; 
//           color: #3ea6ff; 
//           border: 1.5px solid #3ea6ff;
//         }

//         .login-btn:hover { 
//           background: rgba(62, 166, 255, 0.15);
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(62, 166, 255, 0.2);
//         }

//         /* ========== CATEGORY BAR ========== */
//         .category-bar {
//           position: sticky; 
//           top: 60px; 
//           z-index: 999; 
//           background: rgba(15, 15, 15, 0.95);
//           backdrop-filter: blur(20px);
//           padding: 16px 0; 
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .category-scroll {
//           display: flex; 
//           gap: 12px; 
//           overflow-x: auto; 
//           padding: 0 24px;
//           scrollbar-width: thin;
//           scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
//         }

//         .category-scroll::-webkit-scrollbar {
//           height: 8px;
//         }

//         .category-scroll::-webkit-scrollbar-track {
//           background: transparent;
//         }

//         .category-scroll::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.2);
//           border-radius: 4px;
//         }

//         .category-chip {
//           padding: 10px 18px; 
//           background: rgba(255, 255, 255, 0.08); 
//           color: #fff;
//           border: 1px solid rgba(255, 255, 255, 0.1); 
//           border-radius: 24px; 
//           font-size: 14px; 
//           font-weight: 500;
//           cursor: pointer; 
//           white-space: nowrap; 
//           transition: all 0.3s ease;
//           display: flex; 
//           align-items: center; 
//           gap: 8px;
//           flex-shrink: 0;
//         }

//         .category-chip:hover { 
//           background: rgba(255, 255, 255, 0.15);
//           transform: translateY(-2px);
//           border-color: rgba(255, 255, 255, 0.2);
//         }

//         .category-chip.active { 
//           background: #fff; 
//           color: #0f0f0f;
//           border-color: #fff;
//           box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
//         }

//         .chip-icon { 
//           font-size: 16px; 
//         }

//         .chip-text {
//           font-weight: 600;
//         }

//         /* ========== MAIN CONTENT ========== */
//         .main-content { 
//           max-width: 2560px; 
//           margin: 0 auto; 
//           padding: 32px 24px; 
//         }

//         .loading-state, .empty-state {
//           display: flex; 
//           flex-direction: column; 
//           align-items: center;
//           justify-content: center; 
//           padding: 100px 20px; 
//           text-align: center;
//         }

//         .loader-wrapper {
//           position: relative;
//           width: 80px;
//           height: 80px;
//           margin-bottom: 24px;
//         }

//         .loader {
//           width: 80px; 
//           height: 80px; 
//           border: 4px solid rgba(255, 255, 255, 0.1);
//           border-top-color: #ff0000; 
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .loader-inner {
//           position: absolute;
//           top: 8px;
//           left: 8px;
//           width: 64px;
//           height: 64px;
//           border: 4px solid rgba(255, 255, 255, 0.1);
//           border-bottom-color: #3ea6ff;
//           border-radius: 50%;
//           animation: spin 0.7s linear infinite reverse;
//         }

//         @keyframes spin { 
//           to { 
//             transform: rotate(360deg); 
//           } 
//         }

//         .loading-state h3 {
//           font-size: 24px;
//           margin-bottom: 8px;
//           color: #fff;
//         }

//         .loading-state p {
//           font-size: 15px;
//           color: #aaa;
//         }

//         .empty-icon {
//           margin-bottom: 24px;
//           opacity: 0.6;
//         }

//         .empty-state h2 { 
//           margin-bottom: 12px; 
//           font-size: 28px;
//           font-weight: 600;
//         }

//         .empty-state p { 
//           color: #aaa; 
//           font-size: 15px;
//           margin-bottom: 24px;
//         }

//         .clear-search-btn {
//           padding: 12px 24px;
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 24px;
//           color: #fff;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .clear-search-btn:hover {
//           background: rgba(255, 255, 255, 0.15);
//           transform: translateY(-2px);
//         }

//         /* ========== VIDEO GRID ========== */
//         .video-grid {
//           display: grid; 
//           grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
//           gap: 24px;
//         }

//         .video-card { 
//           cursor: pointer; 
//           transition: transform 0.3s ease;
//           animation: fadeIn 0.5s ease forwards;
//           opacity: 0;
//         }

//         @keyframes fadeIn {
//           to {
//             opacity: 1;
//           }
//         }

//         .video-card:hover { 
//           transform: translateY(-8px);
//         }

//         .thumbnail-container {
//           position: relative; 
//           width: 100%; 
//           aspect-ratio: 16/9;
//           border-radius: 16px; 
//           overflow: hidden; 
//           background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
//         }

//         .thumbnail { 
//           width: 100%; 
//           height: 100%; 
//           object-fit: cover;
//           transition: transform 0.3s ease;
//         }

//         .video-card:hover .thumbnail {
//           transform: scale(1.05);
//         }

//         .thumbnail-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.6);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           opacity: 0;
//           transition: opacity 0.3s ease;
//         }

//         .video-card:hover .thumbnail-overlay {
//           opacity: 1;
//         }

//         .play-btn {
//           width: 64px;
//           height: 64px;
//           background: rgba(255, 255, 255, 0.95);
//           border: none;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: transform 0.3s ease;
//           box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
//         }

//         .play-btn:hover {
//           transform: scale(1.1);
//         }

//         .duration-badge {
//           position: absolute; 
//           bottom: 10px; 
//           right: 10px;
//           background: rgba(0, 0, 0, 0.85); 
//           backdrop-filter: blur(8px);
//           color: white; 
//           padding: 4px 8px; 
//           border-radius: 6px;
//           font-size: 13px; 
//           font-weight: 600;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
//         }

//         .category-badge {
//           position: absolute; 
//           top: 10px; 
//           right: 10px;
//           background: linear-gradient(135deg, #ff0000, #cc0000);
//           backdrop-filter: blur(8px);
//           color: white; 
//           padding: 5px 10px; 
//           border-radius: 6px;
//           font-size: 11px; 
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
//         }

//         .video-details {
//           display: flex; 
//           gap: 12px; 
//           margin-top: 14px; 
//           position: relative;
//         }

//         .channel-avatar {
//           width: 40px; 
//           height: 40px; 
//           border-radius: 50%;
//           background: linear-gradient(135deg, #065fd4, #0b7dda);
//           display: flex; 
//           align-items: center; 
//           justify-content: center;
//           font-size: 16px; 
//           font-weight: 600; 
//           flex-shrink: 0; 
//           cursor: pointer;
//           transition: all 0.3s ease;
//           box-shadow: 0 2px 8px rgba(6, 95, 212, 0.3);
//         }

//         .channel-avatar:hover {
//           transform: scale(1.1);
//           box-shadow: 0 4px 12px rgba(6, 95, 212, 0.5);
//         }

//         .video-meta { 
//           flex: 1; 
//           min-width: 0; 
//         }

//         .video-title {
//           font-size: 15px; 
//           font-weight: 600; 
//           line-height: 1.4;
//           margin-bottom: 6px; 
//           display: -webkit-box;
//           -webkit-line-clamp: 2; 
//           -webkit-box-orient: vertical; 
//           overflow: hidden;
//           color: #fff;
//         }

//         .video-channel { 
//           font-size: 13px; 
//           color: #aaa; 
//           margin-bottom: 4px; 
//           font-weight: 500;
//         }

//         .video-stats {
//           font-size: 13px; 
//           color: #999; 
//           display: flex; 
//           align-items: center; 
//           gap: 6px;
//         }

//         .stat-item {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .dot { 
//           font-size: 12px;
//           opacity: 0.6;
//         }

//         .more-btn {
//           background: transparent; 
//           border: none; 
//           color: #aaa; 
//           cursor: pointer;
//           padding: 0; 
//           width: 28px; 
//           height: 28px; 
//           border-radius: 50%;
//           transition: all 0.2s ease; 
//           display: flex; 
//           align-items: center;
//           justify-content: center; 
//           opacity: 0;
//           flex-shrink: 0;
//         }

//         .video-card:hover .more-btn { 
//           opacity: 1; 
//         }

//         .more-btn:hover { 
//           background: rgba(255, 255, 255, 0.1);
//           color: #fff;
//         }

//         /* ========== RESPONSIVE ========== */
//         @media (max-width: 1280px) {
//           .video-grid { 
//             grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
//           }
//         }

//         @media (max-width: 768px) {
//           .navbar {
//             padding: 0 12px;
//             height: 56px;
//           }

//           .nav-center { 
//             display: none; 
//           }

//           .logo-text {
//             display: none;
//           }

//           .video-grid { 
//             grid-template-columns: 1fr;
//             gap: 20px;
//           }

//           .category-scroll { 
//             padding: 0 12px; 
//           }

//           .main-content { 
//             padding: 20px 12px; 
//           }

//           .category-bar {
//             top: 56px;
//           }
//         }

//         @media (max-width: 480px) {
//           .nav-left {
//             min-width: auto;
//           }

//           .nav-right {
//             min-width: auto;
//           }

//           .icon-btn {
//             padding: 8px;
//           }

//           .user-menu {
//             right: -12px;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const TRENDING_DAYS_WINDOW = 7;
const RECENCY_WEIGHT = 1000;
const TOP_N = 50;

const AdBanner = () => (
  <div
    style={{
      gridColumn: "1 / -1",
      background: "linear-gradient(135deg,#1f1f1f,#111)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    }}
  >
    <div>
      <h3 style={{ margin: 0, fontSize: 18 }}>🚀 Upgrade to MyTube Premium</h3>
      <p style={{ margin: "6px 0 0", color: "#aaa", fontSize: 14 }}>
        Watch videos ad-free, enjoy premium quality & exclusive features.
      </p>
    </div>
    <button
      onClick={() => window.location.href = "/profile"}
      style={{
        padding: "10px 18px",
        borderRadius: 20,
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
        background: "linear-gradient(135deg,#facc15,#f97316)",
        color: "#000",
      }}
    >
      ⭐ Go Premium
    </button>
  </div>
);


export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recognitionRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "All", icon: "🏠" },
    { name: "Trending", icon: "🔥" },
    { name: "Gaming", icon: "🎮" },
    { name: "Music", icon: "🎵" },
    { name: "Education", icon: "📚" },
    { name: "Entertainment", icon: "🎬" },
    { name: "Sports", icon: "⚽" },
    { name: "Technology", icon: "💻" },
    { name: "Cooking", icon: "🍳" },
    { name: "Travel", icon: "✈️" },
    { name: "Vlogs", icon: "📹" },
    { name: "News", icon: "📰" },
    { name: "Comedy", icon: "😂" },
    { name: "Animation", icon: "🎨" },
    { name: "Science", icon: "🔬" },
    { name: "Fashion", icon: "👗" },
    { name: "Fitness", icon: "💪" },
    { name: "Other", icon: "📂" }
  ];

  // Sidebar menu items
  const sidebarSections = [
    {
      items: [
        { name: "Home", icon: "home", path: "/", category: "All" },
        { name: "Shorts", icon: "shorts", path: "#shorts" },
        { name: "Subscriptions", icon: "subscriptions", path: "#subscriptions" }
      ]
    },
    {
      title: "You",
      items: user ? [
        { name: "Your Channel", icon: "user", path: "/profile" },
        { name: "History", icon: "history", path: "/history" },
        { name: "Your Videos", icon: "video", path: "/profile" },
        { name: "Watch Later", icon: "clock", path: "#watch-later" },
        { name: "Liked Videos", icon: "like", path: "#liked" }
      ] : [
        { name: "Sign in to like videos, comment, and subscribe.", icon: "info", type: "info" }
      ]
    },
    {
      title: "Explore",
      items: [
        { name: "Trending", icon: "trending", category: "Trending" },
        { name: "Music", icon: "music", category: "Music" },
        { name: "Gaming", icon: "gaming", category: "Gaming" },
        { name: "News", icon: "news", category: "News" },
        { name: "Sports", icon: "sports", category: "Sports" },
        { name: "Technology", icon: "tech", category: "Technology" }
      ]
    },
    {
      title: "More from MyTube",
      items: [
        { name: "Settings", icon: "settings", path: "#settings" },
        { name: "Report History", icon: "flag", path: "#report" },
        { name: "Help", icon: "help", path: "#help" },
        { name: "Send Feedback", icon: "feedback", path: "#feedback" }
      ]
    }
  ];

  const computeTrendingScore = (v) => {
    const views = Number(v.views || 0);
    const createdAt = v.createdAt ? new Date(v.createdAt) : new Date();
    const daysSinceUpload = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, TRENDING_DAYS_WINDOW - daysSinceUpload);
    return views + recencyBoost * RECENCY_WEIGHT;
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setSearch(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const startVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert("❌ Your browser does not support voice search. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);

      if (selectedCategory === "All" && user && user.watchCount > 0) {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/videos/recommended",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideos(res.data);
        setFiltered(res.data);
        setLoading(false);
        return;
      }

      if (selectedCategory === "Trending") {
        const res = await axios.get("http://localhost:5000/api/videos/all");
        const scored = res.data
          .map((v) => ({ ...v, score: computeTrendingScore(v) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, TOP_N);
        setVideos(scored);
        setFiltered(scored);
        setLoading(false);
        return;
      }

      let res;
      if (selectedCategory === "All") {
        res = await axios.get("http://localhost:5000/api/videos/all");
      } else {
        try {
          res = await axios.get(`http://localhost:5000/api/videos/category/${selectedCategory}`);
        } catch (err) {
          res = await axios.get("http://localhost:5000/api/videos/all");
          res.data = res.data.filter(v => v.category === selectedCategory);
        }
      }

      setVideos(res.data);
      setFiltered(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideos([]);
      setFiltered([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, user]);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(videos);
      return;
    }
    
    const searchVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(search)}`);
        setFiltered(res.data);
      } catch (err) {
        console.error("Search error:", err);
        const searchLower = search.toLowerCase();
        const results = videos.filter(v => 
          v.title?.toLowerCase().includes(searchLower) ||
          v.description?.toLowerCase().includes(searchLower) ||
          v.uploadedBy?.name?.toLowerCase().includes(searchLower)
        );
        setFiltered(results);
      }
    };

    const timeoutId = setTimeout(searchVideos, 300);
    return () => clearTimeout(timeoutId);
  }, [search, videos]);

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getTimeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSidebarItemClick = (item) => {
    if (item.category) {
      setSelectedCategory(item.category);
    } else if (item.path && item.path !== "#") {
      navigate(item.path);
    }
  };

  const getIconSVG = (iconName) => {
    const icons = {
      home: <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>,
      shorts: <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z"/>,
      subscriptions: <path d="M18 7H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 10H6V9h12v8zm-6-1l5-3-5-3v6zM5 6h14V4H5c-1.1 0-2 .9-2 2v11h2V6z"/>,
      user: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
      history: <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>,
      video: <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>,
      clock: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>,
      like: <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>,
      trending: <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>,
      music: <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>,
      gaming: <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>,
      news: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>,
      sports: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13.66 6.3 13 5.3zm-3.35-.95L11 5.3l-.66 1-3.33 3.18-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.5 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>,
      tech: <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>,
      settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
      flag: <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>,
      help: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>,
      feedback: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>,
      info: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    };
    return icons[iconName] || icons.home;
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <h1 className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">▶</div>
            <span className="logo-text">MyTube</span>
          </h1>
        </div>

        <div className="nav-center">
          <div className="search-wrapper">
            <div className="search-container">
              <button className="search-icon-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              )}
            </div>
            <button className={`voice-btn ${isListening ? "listening" : ""}`} onClick={startVoiceSearch}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="nav-right">
          {user && (
            <>
              <button className="icon-btn" onClick={() => navigate("/history")} title="Watch History">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
              </button>
              <button className="icon-btn upload-btn" onClick={() => navigate("/UserUpload")} title="Upload Video">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </button>
              <div className="user-menu-container" ref={userMenuRef}>
                <button className="profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <div className="avatar">
                    {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>
                {showUserMenu && (
                  <div className="user-menu">
                    <div className="user-menu-header">
                      <div className="avatar-large">
                        {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name || user.username}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="menu-divider"></div>
                    <button className="menu-item" onClick={() => { navigate("/profile"); setShowUserMenu(false); }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Your Channel
                    </button>
                    <button className="menu-item" onClick={() => { navigate("/history"); setShowUserMenu(false); }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                      </svg>
                      Watch History
                    </button>
                    <div className="menu-divider"></div>
                    <button className="menu-item logout-item" onClick={() => { logout(); navigate("/"); setShowUserMenu(false); }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <button className="login-btn" onClick={() => navigate("/login")}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: 8 }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Sign in
            </button>
          )}
        </div>
      </nav>

      <div className="page-container">
        {/* SIDEBAR MENU */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-content">
            {sidebarSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="sidebar-section">
                {section.title && <div className="sidebar-section-title">{section.title}</div>}
                {section.items.map((item, itemIndex) => (
                  item.type === "info" ? (
                    <div key={itemIndex} className="sidebar-info">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        {getIconSVG(item.icon)}
                      </svg>
                      <span>{item.name}</span>
                    </div>
                  ) : (
                    <button
                      key={itemIndex}
                      className={`sidebar-item ${
                        (item.category && selectedCategory === item.category) ||
                        (item.path === "/" && selectedCategory === "All")
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleSidebarItemClick(item)}
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        {getIconSVG(item.icon)}
                      </svg>
                      <span>{item.name}</span>
                    </button>
                  )
                ))}
                {sectionIndex < sidebarSections.length - 1 && <div className="sidebar-divider"></div>}
              </div>
            ))}
            
            <div className="sidebar-footer">
              <div className="footer-links">
                <a href="#about">About</a>
                <a href="#press">Press</a>
                <a href="#copyright">Copyright</a>
                <a href="#contact">Contact us</a>
                <a href="#creators">Creators</a>
                <a href="#advertise">Advertise</a>
                <a href="#developers">Developers</a>
              </div>
              <div className="footer-links">
                <a href="#terms">Terms</a>
                <a href="#privacy">Privacy</a>
                <a href="#policy">Policy & Safety</a>
                <a href="#test">How YouTube works</a>
                <a href="#new">Test new features</a>
              </div>
              <div className="footer-copyright">
                © 2024 MyTube LLC
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className={`content-area ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          {/* CATEGORY CHIPS */}
          <div className="category-bar">
            <div className="category-scroll">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`category-chip ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="chip-icon">{cat.icon}</span>
                  <span className="chip-text">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* VIDEO CONTENT */}
          <main className="main-content">
            {loading ? (
              <div className="loading-state">
                <div className="loader-wrapper">
                  <div className="loader"></div>
                  <div className="loader-inner"></div>
                </div>
                <h3>Loading amazing videos...</h3>
                <p>Hang tight, we're fetching the best content for you</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="url(#emptyGradient)">
                    <defs>
                      <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#666" />
                        <stop offset="100%" stopColor="#999" />
                      </linearGradient>
                    </defs>
                    <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
                  </svg>
                </div>
                <h2>No videos found</h2>
                <p>{search ? `We couldn't find any results for "${search}"` : "No videos available in this category yet"}</p>
                {search && (
                  <button className="clear-search-btn" onClick={() => setSearch("")}>
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="video-grid">
                {(!user || !user.isPremium) && <AdBanner />}
                {filtered.map((v, index) => (
                  <div 
                    key={v._id} 
                    className="video-card" 
                    onClick={() => navigate(`/watch/${v.filename}`)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="thumbnail-container">
                      <img 
                        src={`http://localhost:5000/uploads/${v.thumbnail}`} 
                        alt={v.title} 
                        className="thumbnail"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect fill="%23222" width="320" height="180"/><text x="50%" y="50%" text-anchor="middle" fill="%23666" font-size="20" font-family="Arial">No Thumbnail</text></svg>';
                        }}
                      />
                      
                      <div className="thumbnail-overlay">
                        <button className="play-btn">
                          <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                      </div>

                      <div className="duration-badge">
                        {v.duration ? formatDuration(v.duration) : "0:00"}
                      </div>

                      {v.category && <div className="category-badge">{v.category}</div>}
                    </div>

                    <div className="video-details">
                      <div 
                        className="channel-avatar" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (v.uploadedBy?._id) navigate(`/profile/${v.uploadedBy._id}`); 
                        }}
                      >
                        {v.uploadedBy?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      
                      <div className="video-meta">
                        <h3 className="video-title">{v.title || "Untitled Video"}</h3>
                        <div className="video-channel">{v.uploadedBy?.name || "Unknown Channel"}</div>
                        <div className="video-stats">
                          <span className="stat-item">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            {formatViews(v.views)}
                          </span>
                          <span className="dot">•</span>
                          <span className="stat-item">{getTimeAgo(v.createdAt)}</span>
                        </div>
                      </div>

                      <button className="more-btn" onClick={(e) => e.stopPropagation()}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body { 
          font-family: 'Roboto', 'Arial', sans-serif; 
          background: #0f0f0f; 
          color: #fff;
          overflow-x: hidden;
        }

        /* ========== NAVBAR ========== */
        .navbar {
          position: fixed; 
          top: 0; 
          left: 0;
          right: 0;
          z-index: 2000; 
          background: rgba(15, 15, 15, 0.98);
          backdrop-filter: blur(20px);
          padding: 0 16px; 
          height: 56px; 
          display: flex; 
          align-items: center;
          justify-content: space-between; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-left { 
          display: flex; 
          align-items: center; 
          gap: 16px; 
          min-width: 200px;
        }

        .menu-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .logo {
          font-size: 20px; 
          font-weight: 700; 
          color: #fff; 
          cursor: pointer;
          display: flex; 
          align-items: center; 
          gap: 6px; 
          letter-spacing: -0.5px;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-icon { 
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #ff0000, #cc0000);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
        }

        .logo-text {
          background: linear-gradient(135deg, #fff, #ddd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-center { 
          flex: 1; 
          max-width: 640px; 
          margin: 0 40px; 
        }

        .search-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-container {
          flex: 1;
          display: flex; 
          height: 40px; 
          border: 1px solid rgba(255, 255, 255, 0.2); 
          border-radius: 40px;
          overflow: hidden; 
          background: rgba(18, 18, 18, 0.6);
          transition: all 0.2s ease;
        }

        .search-container:focus-within {
          border-color: #3ea6ff;
          background: rgba(18, 18, 18, 0.9);
        }

        .search-icon-btn {
          padding: 0 14px;
          background: transparent;
          border: none;
          color: #aaa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-input {
          flex: 1; 
          padding: 0 8px 0 0; 
          background: transparent; 
          border: none;
          color: #fff; 
          font-size: 14px; 
          outline: none;
        }

        .search-input::placeholder {
          color: #888;
        }

        .clear-btn {
          padding: 0 12px;
          background: transparent;
          border: none;
          color: #aaa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .clear-btn:hover {
          color: #fff;
        }

        .voice-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.08);
          border: none; 
          color: #fff;
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .voice-btn:hover { 
          background: rgba(255, 255, 255, 0.15);
        }

        .voice-btn.listening { 
          color: #ff0000; 
          background: rgba(255, 0, 0, 0.1);
          animation: pulse 1.5s infinite; 
        }

        @keyframes pulse { 
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          } 
          50% { 
            opacity: 0.7;
            transform: scale(1.1);
          } 
        }

        .nav-right { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          min-width: 200px;
          justify-content: flex-end;
        }

        .icon-btn {
          background: transparent; 
          border: none; 
          color: #fff; 
          cursor: pointer;
          padding: 8px; 
          border-radius: 50%; 
          transition: all 0.2s ease;
          display: flex; 
          align-items: center; 
          justify-content: center;
        }

        .icon-btn:hover { 
          background: rgba(255, 255, 255, 0.1);
        }

        .upload-btn:hover {
          background: rgba(255, 0, 0, 0.1);
          color: #ff4444;
        }

        .user-menu-container {
          position: relative;
        }

        .profile-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .avatar {
          width: 32px; 
          height: 32px; 
          background: linear-gradient(135deg, #065fd4, #0b7dda);
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: 600; 
          font-size: 14px; 
          color: white;
        }

        .user-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: rgba(40, 40, 40, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          min-width: 280px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          animation: slideDown 0.2s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-menu-header {
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .avatar-large {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #065fd4, #0b7dda);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          color: white;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: #fff;
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-email {
          font-size: 12px;
          color: #aaa;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 8px 0;
        }

        .menu-item {
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: background 0.2s ease;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .logout-item {
          color: #ff4444;
        }

        .logout-item:hover {
          background: rgba(255, 68, 68, 0.1);
        }

        .login-btn {
          padding: 8px 16px; 
          border-radius: 40px; 
          font-weight: 500; 
          font-size: 14px;
          cursor: pointer; 
          transition: all 0.2s ease; 
          display: flex; 
          align-items: center;
          background: transparent; 
          color: #3ea6ff; 
          border: 1px solid rgba(62, 166, 255, 0.5);
        }

        .login-btn:hover { 
          background: rgba(62, 166, 255, 0.1);
          border-color: #3ea6ff;
        }

        /* ========== PAGE CONTAINER ========== */
        .page-container {
          display: flex;
          padding-top: 56px;
          min-height: 100vh;
        }

        /* ========== SIDEBAR ========== */
        .sidebar {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          width: 240px;
          background: #0f0f0f;
          overflow-y: auto;
          overflow-x: hidden;
          transition: transform 0.3s ease, width 0.3s ease;
          z-index: 1000;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar.closed {
          width: 72px;
        }

        .sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .sidebar-content {
          padding: 12px 0;
        }

        .sidebar-section {
          margin-bottom: 12px;
        }

        .sidebar-section-title {
          padding: 8px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .sidebar.closed .sidebar-section-title {
          opacity: 0;
          height: 0;
          padding: 0;
          overflow: hidden;
        }

        .sidebar-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 10px 24px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .sidebar.closed .sidebar-item {
          justify-content: center;
          padding: 16px 0;
        }

        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-item.active {
          background: rgba(255, 255, 255, 0.15);
          font-weight: 500;
        }

        .sidebar-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #fff;
        }

        .sidebar-item svg {
          flex-shrink: 0;
        }

        .sidebar-item span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: opacity 0.3s ease;
        }

        .sidebar.closed .sidebar-item span {
          opacity: 0;
          width: 0;
        }

        .sidebar-info {
          padding: 12px 24px;
          font-size: 13px;
          color: #aaa;
          line-height: 1.5;
          display: flex;
          gap: 12px;
        }

        .sidebar.closed .sidebar-info {
          display: none;
        }

        .sidebar-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 12px 0;
        }

        .sidebar-footer {
          padding: 16px 24px;
          font-size: 12px;
          color: #717171;
          line-height: 1.6;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 12px;
        }

        .sidebar.closed .sidebar-footer {
          display: none;
        }

        .footer-links {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #717171;
          text-decoration: none;
          margin-right: 8px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #fff;
        }

        .footer-links a::after {
          content: ' ';
        }

        .footer-copyright {
          color: #717171;
          font-size: 11px;
          margin-top: 16px;
        }

        /* ========== CONTENT AREA ========== */
        .content-area {
          flex: 1;
          margin-left: 240px;
          transition: margin-left 0.3s ease;
          min-height: calc(100vh - 56px);
        }

        .content-area.sidebar-closed {
          margin-left: 72px;
        }

        /* ========== CATEGORY BAR ========== */
        .category-bar {
          position: sticky; 
          top: 56px; 
          z-index: 999; 
          background: rgba(15, 15, 15, 0.98);
          backdrop-filter: blur(20px);
          padding: 12px 0; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .category-scroll {
          display: flex; 
          gap: 12px; 
          overflow-x: auto; 
          padding: 0 24px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .category-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .category-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .category-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .category-chip {
          padding: 8px 16px; 
          background: rgba(255, 255, 255, 0.1); 
          color: #fff;
          border: none; 
          border-radius: 8px; 
          font-size: 14px; 
          font-weight: 500;
          cursor: pointer; 
          white-space: nowrap; 
          transition: all 0.2s ease;
          display: flex; 
          align-items: center; 
          gap: 6px;
          flex-shrink: 0;
        }

        .category-chip:hover { 
          background: rgba(255, 255, 255, 0.2);
        }

        .category-chip.active { 
          background: #fff; 
          color: #0f0f0f;
        }

        .chip-icon { 
          font-size: 16px; 
        }

        .chip-text {
          font-weight: 500;
        }

        /* ========== MAIN CONTENT ========== */
        .main-content { 
          padding: 24px; 
        }

        .loading-state, .empty-state {
          display: flex; 
          flex-direction: column; 
          align-items: center;
          justify-content: center; 
          padding: 80px 20px; 
          text-align: center;
        }

        .loader-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 24px;
        }

        .loader {
          width: 60px; 
          height: 60px; 
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #ff0000; 
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loader-inner {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-bottom-color: #3ea6ff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite reverse;
        }

        @keyframes spin { 
          to { 
            transform: rotate(360deg); 
          } 
        }

        .loading-state h3 {
          font-size: 20px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .loading-state p {
          font-size: 14px;
          color: #aaa;
        }

        .empty-icon {
          margin-bottom: 24px;
          opacity: 0.5;
        }

        .empty-state h2 { 
          margin-bottom: 8px; 
          font-size: 24px;
          font-weight: 500;
        }

        .empty-state p { 
          color: #aaa; 
          font-size: 14px;
          margin-bottom: 20px;
        }

        .clear-search-btn {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-search-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* ========== VIDEO GRID ========== */
        .video-grid {
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
          gap: 16px;
        }

        .video-card { 
          cursor: pointer; 
          transition: transform 0.2s ease;
          animation: fadeIn 0.4s ease forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .thumbnail-container {
          position: relative; 
          width: 100%; 
          aspect-ratio: 16/9;
          border-radius: 12px; 
          overflow: hidden; 
          background: #1a1a1a;
        }

        .thumbnail { 
          width: 100%; 
          height: 100%; 
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .video-card:hover .thumbnail {
          transform: scale(1.05);
        }

        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .video-card:hover .thumbnail-overlay {
          opacity: 1;
        }

        .play-btn {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .play-btn:hover {
          transform: scale(1.1);
        }

        .duration-badge {
          position: absolute; 
          bottom: 8px; 
          right: 8px;
          background: rgba(0, 0, 0, 0.8); 
          color: white; 
          padding: 3px 6px; 
          border-radius: 4px;
          font-size: 12px; 
          font-weight: 600;
        }

        .category-badge {
          position: absolute; 
          top: 8px; 
          right: 8px;
          background: rgba(255, 0, 0, 0.9);
          color: white; 
          padding: 4px 8px; 
          border-radius: 4px;
          font-size: 10px; 
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .video-details {
          display: flex; 
          gap: 12px; 
          margin-top: 12px; 
          position: relative;
        }

        .channel-avatar {
          width: 36px; 
          height: 36px; 
          border-radius: 50%;
          background: linear-gradient(135deg, #065fd4, #0b7dda);
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 14px; 
          font-weight: 600; 
          flex-shrink: 0; 
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .channel-avatar:hover {
          transform: scale(1.1);
        }

        .video-meta { 
          flex: 1; 
          min-width: 0; 
        }

        .video-title {
          font-size: 14px; 
          font-weight: 500; 
          line-height: 1.4;
          margin-bottom: 4px; 
          display: -webkit-box;
          -webkit-line-clamp: 2; 
          -webkit-box-orient: vertical; 
          overflow: hidden;
          color: #fff;
        }

        .video-channel { 
          font-size: 12px; 
          color: #aaa; 
          margin-bottom: 2px; 
        }

        .video-stats {
          font-size: 12px; 
          color: #aaa; 
          display: flex; 
          align-items: center; 
          gap: 4px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dot { 
          font-size: 10px;
        }

        .more-btn {
          background: transparent; 
          border: none; 
          color: #aaa; 
          cursor: pointer;
          padding: 0; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%;
          transition: all 0.2s ease; 
          display: flex; 
          align-items: center;
          justify-content: center; 
          opacity: 0;
          flex-shrink: 0;
        }

        .video-card:hover .more-btn { 
          opacity: 1; 
        }

        .more-btn:hover { 
          background: rgba(255, 255, 255, 0.1);
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 1280px) {
          .video-grid { 
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          }
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .content-area {
            margin-left: 0;
          }

          .content-area.sidebar-open {
            margin-left: 0;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 8px;
          }

          .nav-center { 
            display: none; 
          }

          .logo-text {
            display: none;
          }

          .video-grid { 
            grid-template-columns: 1fr;
          }

          .main-content { 
            padding: 16px; 
          }

          .sidebar {
            width: 240px;
          }

          .sidebar.closed {
            transform: translateX(-100%);
          }
        }

        @media (max-width: 480px) {
          .nav-left {
            min-width: auto;
            gap: 8px;
          }

          .nav-right {
            min-width: auto;
            gap: 4px;
          }

          .icon-btn {
            padding: 6px;
          }

          .user-menu {
            right: -8px;
          }

          .category-scroll {
            padding: 0 16px;
          }
        }
      `}</style>
    </>
  );
}