

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

import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const TRENDING_DAYS_WINDOW = 7;
const RECENCY_WEIGHT = 1000;
const TOP_N = 50;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recognitionRef = useRef(null);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [searchParams]);

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

      // 🎯 PERSONALIZED FEED (if logged in + "All" category)
      // if (selectedCategory === "All" && user) {
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

      // 🔥 TRENDING FEED
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

      // 📂 CATEGORY OR ALL (guest users)
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

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo" onClick={() => navigate("/")}>
            <span className="logo-icon">▶</span>MyTube
          </h1>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            <button className={`voice-btn ${isListening ? "listening" : ""}`} onClick={startVoiceSearch}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
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
              <button className="icon-btn" onClick={() => navigate("/UserUpload")} title="Upload">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </button>
              <button className="profile-btn" onClick={() => navigate("/profile")}>
                <div className="avatar">{user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}</div>
              </button>
            </>
          )}

          {user ? (
            <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: 6 }}>
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Sign in
            </button>
          )}
        </div>
      </nav>

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
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading amazing videos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="#606060">
              <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
            </svg>
            <h2>No videos found</h2>
            <p>{search ? `Try different keywords for "${search}"` : "No videos available in this category"}</p>
          </div>
        ) : (
          <div className="video-grid">
            {filtered.map((v) => (
              <div key={v._id} className="video-card" onClick={() => navigate(`/watch/${v.filename}`)}>
                <div className="thumbnail-container">
                  <img 
                    src={`http://localhost:5000/uploads/${v.thumbnail}`} 
                    alt={v.title} 
                    className="thumbnail"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect fill="%23333" width="320" height="180"/></svg>';
                    }}
                  />
                  
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
                      <span>{formatViews(v.views)} views</span>
                      <span className="dot">•</span>
                      <span>{getTimeAgo(v.createdAt)}</span>
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

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Roboto', 'Arial', sans-serif; background: #0f0f0f; color: #fff; }

        .navbar {
          position: sticky; top: 0; z-index: 1000; background: #0f0f0f;
          padding: 0 16px; height: 56px; display: flex; align-items: center;
          justify-content: space-between; border-bottom: 1px solid #272727;
        }

        .nav-left { display: flex; align-items: center; gap: 16px; }

        .logo {
          font-size: 20px; font-weight: 700; color: #fff; cursor: pointer;
          display: flex; align-items: center; gap: 4px; letter-spacing: -0.5px;
        }
        .logo-icon { color: #ff0000; font-size: 24px; font-weight: 900; }

        .nav-center { flex: 1; max-width: 640px; margin: 0 40px; }
        .search-container {
          display: flex; height: 40px; border: 1px solid #303030; border-radius: 40px;
          overflow: hidden; background: #121212;
        }
        .search-input {
          flex: 1; padding: 0 16px; background: transparent; border: none;
          color: #fff; font-size: 16px; outline: none;
        }
        .search-btn, .voice-btn {
          width: 64px; background: transparent; border: none; color: #fff;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .search-btn { border-left: 1px solid #303030; }
        .voice-btn { border-left: 1px solid #303030; }
        .search-btn:hover, .voice-btn:hover { background: rgba(255,255,255,0.1); }
        .voice-btn.listening { color: #ff0000; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .nav-right { display: flex; align-items: center; gap: 8px; }
        .icon-btn, .profile-btn {
          background: transparent; border: none; color: #fff; cursor: pointer;
          padding: 8px; border-radius: 50%; transition: background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .icon-btn:hover, .profile-btn:hover { background: rgba(255,255,255,0.1); }

        .avatar {
          width: 32px; height: 32px; background: linear-gradient(135deg, #065fd4, #0b7dda);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 14px; color: white;
        }

        .login-btn, .logout-btn {
          padding: 8px 16px; border-radius: 24px; font-weight: 500; font-size: 14px;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center;
        }
        .login-btn { background: transparent; color: #3ea6ff; border: 1px solid #3ea6ff; }
        .logout-btn { background: transparent; color: #fff; border: 1px solid #303030; }
        .login-btn:hover { background: rgba(62, 166, 255, 0.1); }
        .logout-btn:hover { background: rgba(255,255,255,0.1); }

        .category-bar {
          position: sticky; top: 56px; z-index: 999; background: #0f0f0f;
          padding: 12px 0; border-bottom: 1px solid #272727;
        }
        .category-scroll {
          display: flex; gap: 12px; overflow-x: auto; padding: 0 24px;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .category-scroll::-webkit-scrollbar { display: none; }

        .category-chip {
          padding: 8px 16px; background: rgba(255,255,255,0.1); color: #fff;
          border: none; border-radius: 8px; font-size: 14px; font-weight: 500;
          cursor: pointer; white-space: nowrap; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .category-chip:hover { background: rgba(255,255,255,0.2); }
        .category-chip.active { background: #fff; color: #0f0f0f; }
        .chip-icon { font-size: 16px; }

        .main-content { max-width: 2560px; margin: 0 auto; padding: 24px; }

        .loading-state, .empty-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 80px 20px; text-align: center;
        }
        .spinner {
          width: 48px; height: 48px; border: 4px solid #303030;
          border-top-color: #ff0000; border-radius: 50%;
          animation: spin 0.8s linear infinite; margin-bottom: 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state h2 { margin: 16px 0 8px; font-size: 20px; }
        .empty-state p { color: #aaa; font-size: 14px; }

        .video-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;
        }

        .video-card { cursor: pointer; transition: transform 0.2s; }
        .video-card:hover { transform: scale(1.02); }

        .thumbnail-container {
          position: relative; width: 100%; aspect-ratio: 16/9;
          border-radius: 12px; overflow: hidden; background: #000;
        }
        .thumbnail { width: 100%; height: 100%; object-fit: cover; }

        .duration-badge {
          position: absolute; bottom: 8px; right: 8px;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          color: white; padding: 3px 6px; border-radius: 4px;
          font-size: 12px; font-weight: 600;
        }

        .category-badge {
          position: absolute; top: 8px; right: 8px;
          background: rgba(255,0,0,0.9); backdrop-filter: blur(4px);
          color: white; padding: 4px 8px; border-radius: 4px;
          font-size: 11px; font-weight: 600;
        }

        .video-details {
          display: flex; gap: 12px; margin-top: 12px; position: relative;
        }

        .channel-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #065fd4, #0b7dda);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; flex-shrink: 0; cursor: pointer;
        }

        .video-meta { flex: 1; min-width: 0; }
        .video-title {
          font-size: 14px; font-weight: 500; line-height: 1.4;
          margin-bottom: 4px; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .video-channel { font-size: 12px; color: #aaa; margin-bottom: 2px; font-weight: 400; }
        .video-stats {
          font-size: 12px; color: #aaa; display: flex; align-items: center; gap: 4px;
        }
        .dot { font-size: 10px; }

        .more-btn {
          background: transparent; border: none; color: #aaa; cursor: pointer;
          padding: 0; width: 24px; height: 24px; border-radius: 50%;
          transition: background 0.2s; display: flex; align-items: center;
          justify-content: center; opacity: 0;
        }
        .video-card:hover .more-btn { opacity: 1; }
        .more-btn:hover { background: rgba(255,255,255,0.1); }

        @media (max-width: 1024px) {
          .video-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        }

        @media (max-width: 768px) {
          .nav-center { display: none; }
          .video-grid { grid-template-columns: 1fr; }
          .category-scroll { padding: 0 12px; }
          .main-content { padding: 16px 12px; }
        }
      `}</style>
    </>
  );
}