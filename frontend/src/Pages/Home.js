
// import React, { useEffect, useState, useContext, useRef } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Notifications from "../components/Notifications";
// import { io } from "socket.io-client";

// import socket from "../socket";

// const TRENDING_DAYS_WINDOW = 7;
// const RECENCY_WEIGHT = 1000;
// const TOP_N = 50;

// const AdBanner = ({ user }) => (
//   <div className="ad-banner-wrapper">
//     <div className="ad-banner">
//       <div className="ad-content">
//         <div className="ad-icon">⭐</div>
//         <div className="ad-text">
//           <h3>Try MyTube Premium</h3>
//           <p>Enjoy ad-free viewing, background play, and downloads</p>
//         </div>
//       </div>
//       <button
//         onClick={() => window.location.href = user ? "/profile" : "/login"}
//         className="ad-cta"
//       >
//         Get Premium
//       </button>
//     </div>
//   </div>
// );

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [isListening, setIsListening] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [hoveredVideo, setHoveredVideo] = useState(null);
//   const [hoverTimeout, setHoverTimeout] = useState(null);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const recognitionRef = useRef(null);
//   const userMenuRef = useRef(null);
//   const searchRef = useRef(null);
//   const videoRefs = useRef({});
//   const socketRef = useRef(null);



//   useEffect(() => {
//     if (!user?._id) return;

//     socketRef.current = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
//       transports: ["websocket"],
//     });

//     // 🔔 join personal notification room
//     socketRef.current.emit("join-user", user._id);

//     // console.log("🔔 Joined notification room:", user._id);

//     socketRef.current.on("connect", () => {
//       // console.log("🟢 Socket connected:", socketRef.current.id);
//     });

//     socketRef.current.on("disconnect", () => {
//       console.log("🔴 Socket disconnected");
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [user]);


//   useEffect(() => {
//     const categoryParam = searchParams.get("category");
//     if (categoryParam) setSelectedCategory(categoryParam);
//   }, [searchParams]);




//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setShowUserMenu(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!search.trim()) {
//       setSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }

//     const timeout = setTimeout(async () => {
//       try {
//         const res = await api.get(
//           `/api/search/suggestions?query=${search}`
//         );
//         setSuggestions(res.data);
//         setShowSuggestions(true);
//       } catch (err) {
//         console.error("Suggestion error:", err);
//       }
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [search]);

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
//     { name: "News", icon: "📰" },
//     { name: "Comedy", icon: "😂" },
//   ];

//   const sidebarSections = [
//     {
//       items: [
//         { name: "Home", icon: "home", path: "/", category: "All" },
//         { name: "Shorts", icon: "shorts", path: "/shorts" },
//         { name: "Subscriptions", icon: "subscriptions", path: "/Subscription" }
//       ]
//     },
//     {
//       title: "You",
//       items: user ? [
//         { name: "Your Channel", icon: "user", path: "/profile" },
//         { name: "History", icon: "history", path: "/history" },
//         { name: "Your Videos", icon: "video", path: "/profile" },
//         { name: "Watch Later", icon: "clock", path: "/watch-later" },
//         { name: "Liked Videos", icon: "like", path: "/Likedvideos" },
//         { name: "Go Live", icon: "live", path: `/live/${user._id}?role=broadcaster` },
//       ] : [
//         { name: "Sign in to see your videos", icon: "info", type: "info" }
//       ]
//     },
//     {
//       title: "Explore",
//       items: [
//         { name: "Trending", icon: "trending", category: "Trending" },
//         { name: "Music", icon: "music", category: "Music" },
//         { name: "Gaming", icon: "gaming", category: "Gaming" },
//         { name: "News", icon: "news", category: "News" },
//         { name: "Sports", icon: "sports", category: "Sports" },
//       ]
//     }
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
//         const res = await api.get(
//           "/api/videos/recommended",
//           {}
//         );
//         setVideos(res.data);
//         setFiltered(res.data);
//         setLoading(false);
//         return;
//       }

//       if (selectedCategory === "Trending") {
//         const res = await api.get("/api/videos/all");
//         const videoList = Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []);
//         const scored = videoList
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
//         res = await api.get("/api/videos/all?limit=20");
//         const videoList = Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []);
//         setVideos(videoList);
//         setFiltered(videoList);
//         setLoading(false);
//         return;
//       } else {
//         try {
//           res = await api.get(`/api/videos/category/${selectedCategory}`);
//         } catch (err) {
//           res = await api.get("/api/videos/all");
//           const allVideos = Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []);
//           res.data = allVideos.filter(v => v.category === selectedCategory);
//         }
//       }

//       const finalVideos = Array.isArray(res.data) ? res.data : (res.data.videos || []);
//       setVideos(finalVideos);
//       setFiltered(finalVideos);
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
//         const res = await api.get(`/api/search?query=${encodeURIComponent(search)}`);
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
//     if (!views) return "0 views";
//     if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
//     if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
//     return `${views} views`;
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
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);

//     if (hrs > 0) {
//       return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//     }
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleSidebarItemClick = (item) => {
//     if (!user && item.path === "/Subscription") {
//       navigate("/Login");
//       return;
//     }

//     if (item.category) {
//       setSelectedCategory(item.category);
//     } else if (item.path && item.path !== "#") {
//       navigate(item.path);
//     }
//   };

//   const getIconSVG = (iconName) => {
//     const icons = {
//       home: <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />,
//       shorts: <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z" />,
//       subscriptions: <path d="M18 7H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 10H6V9h12v8zm-6-1l5-3-5-3v6zM5 6h14V4H5c-1.1 0-2 .9-2 2v11h2V6z" />,
//       user: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
//       history: <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />,
//       video: <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />,
//       clock: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />,
//       like: <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />,
//       trending: <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />,
//       music: <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />,
//       gaming: <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />,
//       news: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />,
//       sports: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13.66 6.3 13 5.3zm-3.35-.95L11 5.3l-.66 1-3.33 3.18-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.5 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />,
//       live: <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />,
//       info: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
//     };
//     return icons[iconName] || icons.home;
//   };

//   // Handle video hover with delay
//   const handleVideoHover = (videoId, filename) => {
//     // Clear any existing timeout
//     if (hoverTimeout) {
//       clearTimeout(hoverTimeout);
//     }

//     // Set new timeout for 1 second hover delay
//     const timeout = setTimeout(() => {
//       setHoveredVideo(videoId);

//       // Start playing video after a short delay
//       setTimeout(() => {
//         const videoElement = videoRefs.current[videoId];
//         if (videoElement) {
//           videoElement.currentTime = 0;
//           videoElement.play().catch(err => console.log("Autoplay prevented:", err));
//         }
//       }, 100);
//     }, 1000);

//     setHoverTimeout(timeout);
//   };

//   const handleVideoLeave = (videoId) => {
//     // Clear timeout if user leaves before 1 second
//     if (hoverTimeout) {
//       clearTimeout(hoverTimeout);
//       setHoverTimeout(null);
//     }

//     // Stop and hide video
//     setHoveredVideo(null);
//     const videoElement = videoRefs.current[videoId];
//     if (videoElement) {
//       videoElement.pause();
//       videoElement.currentTime = 0;
//     }
//   };

//   return (
//     <div className="youtube-home">
//       {/* NAVBAR */}
//       <nav className="yt-navbar">
//         <div className="yt-nav-start">
//           <button className="yt-icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
//             <svg viewBox="0 0 24 24" width="24" height="24">
//               <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
//             </svg>
//           </button>

//           <div className="yt-logo" onClick={() => navigate("/")}>
//             <svg viewBox="0 0 90 20" className="yt-logo-icon">
//               <g>
//                 <path fill="#FF0000" d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" />
//                 <path fill="#FFFFFF" d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" />
//               </g>
//             </svg>
//             <span className="yt-logo-text">MyTube</span>
//           </div>
//         </div>

//         <div className={`yt-nav-center ${showMobileSearch ? 'mobile-search-active' : ''}`} ref={searchRef}>
//           <div className="yt-search-container">
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="yt-search-input"
//             />
//             <button className="yt-search-btn">
//               <svg viewBox="0 0 24 24" width="24" height="24">
//                 <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//               </svg>
//             </button>
//           </div>

//           {showSuggestions && suggestions.length > 0 && (
//             <div className="yt-suggestions">
//               {suggestions.map((s, i) => (
//                 <div
//                   key={i}
//                   className="yt-suggestion-item"
//                   onClick={() => {
//                     setSearch(s.text);
//                     setShowSuggestions(false);
//                   }}
//                 >
//                   <svg viewBox="0 0 24 24" width="20" height="20">
//                     <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//                   </svg>
//                   <span>{s.text}</span>
//                   <span className="yt-suggestion-type">{s.type}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <button
//             className={`yt-icon-btn yt-voice-btn ${isListening ? "listening" : ""}`}
//             onClick={startVoiceSearch}
//           >
//             <svg viewBox="0 0 24 24" width="24" height="24">
//               <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
//               <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
//             </svg>
//           </button>
//         </div>

//         <div className="yt-nav-end">
//           {/* Mobile Search Button */}
//           <button
//             className="yt-icon-btn mobile-search-btn"
//             onClick={() => setShowMobileSearch(!showMobileSearch)}
//           >
//             <svg viewBox="0 0 24 24" width="24" height="24">
//               <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//             </svg>
//           </button>

//           {user ? (
//             <>
//               <button className="yt-icon-btn" onClick={() => navigate("/UserUpload")}>
//                 <svg viewBox="0 0 24 24" width="24" height="24">
//                   <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
//                 </svg>
//               </button>
//               <Notifications />

//               <div className="yt-user-menu-wrapper" ref={userMenuRef}>
//                 <button
//                   className="yt-user-avatar"
//                   onClick={() => setShowUserMenu(!showUserMenu)}
//                 >
//                   {user.name?.charAt(0).toUpperCase() || "U"}
//                 </button>

//                 {showUserMenu && (
//                   <div className="yt-user-dropdown">
//                     <div className="yt-dropdown-header">
//                       <div className="yt-dropdown-avatar">
//                         {user.name?.charAt(0).toUpperCase() || "U"}
//                       </div>
//                       <div>
//                         <div className="yt-dropdown-name">{user.name}</div>
//                         <div className="yt-dropdown-email">{user.email}</div>
//                       </div>
//                     </div>
//                     <div className="yt-dropdown-divider" />
//                     <button className="yt-dropdown-item" onClick={() => navigate("/profile")}>
//                       <svg viewBox="0 0 24 24" width="20" height="20">
//                         <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                       </svg>
//                       Your channel
//                     </button>
//                     <button className="yt-dropdown-item" onClick={() => logout()}>
//                       <svg viewBox="0 0 24 24" width="20" height="20">
//                         <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
//                       </svg>
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <button className="yt-signin-btn" onClick={() => navigate("/login")}>
//               <svg viewBox="0 0 24 24" width="20" height="20">
//                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//               </svg>
//               Sign in
//             </button>
//           )}
//         </div>
//       </nav>

//       <div className="yt-container">
//         {/* SIDEBAR */}
//         <aside className={`yt-sidebar ${sidebarOpen ? "open" : "closed"}`}>
//           {sidebarSections.map((section, sIdx) => (
//             <div key={sIdx} className="yt-sidebar-section">
//               {section.title && <div className="yt-sidebar-title">{section.title}</div>}
//               {section.items.map((item, iIdx) => (
//                 item.type === "info" ? (
//                   <div key={iIdx} className="yt-sidebar-info">
//                     <span>{item.name}</span>
//                   </div>
//                 ) : (
//                   <button
//                     key={iIdx}
//                     className={`yt-sidebar-item ${(item.category && selectedCategory === item.category) ||
//                       (item.path === "/" && selectedCategory === "All")
//                       ? "active"
//                       : ""
//                       }`}
//                     onClick={() => handleSidebarItemClick(item)}
//                   >
//                     <svg viewBox="0 0 24 24" width="24" height="24">
//                       {getIconSVG(item.icon)}
//                     </svg>
//                     <span>{item.name}</span>
//                   </button>
//                 )
//               ))}
//               {sIdx < sidebarSections.length - 1 && <div className="yt-sidebar-divider" />}
//             </div>
//           ))}
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className={`yt-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
//           {/* CATEGORY CHIPS */}
//           <div className="yt-chips-container">
//             <div className="yt-chips-wrapper">
//               {categories.map((cat) => (
//                 <button
//                   key={cat.name}
//                   className={`yt-chip ${selectedCategory === cat.name ? "active" : ""}`}
//                   onClick={() => setSelectedCategory(cat.name)}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* VIDEOS GRID */}
//           {loading ? (
//             <div className="yt-loading">
//               <div className="yt-spinner" />
//               <p>Loading videos...</p>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="yt-empty">
//               <svg width="120" height="120" viewBox="0 0 24 24" fill="#606060">
//                 <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z" />
//               </svg>
//               <h2>No videos found</h2>
//               <p>{search ? `No results for "${search}"` : "No videos in this category"}</p>
//             </div>
//           ) : (
//             <div className="yt-video-grid">
//               {(!user || !user.isPremium) && <AdBanner user={user} />}

//               {filtered.map((v, index) => (
//                 <div
//                   key={v._id}
//                   className="yt-video-card"
//                   onClick={() => navigate(`/watch/${v.filename}`)}
//                   onMouseEnter={() => handleVideoHover(v._id, v.filename)}
//                   onMouseLeave={() => handleVideoLeave(v._id)}
//                   style={{ animationDelay: `${index * 0.05}s` }}
//                 >
//                   <div className="yt-thumbnail">
//                     {/* Thumbnail Image */}
//                     <img
//                       src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                       alt={v.title}
//                       className={`yt-thumbnail-img ${hoveredVideo === v._id ? "hidden" : ""}`}
//                       onError={(e) => {
//                         e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect fill="%23282828" width="320" height="180"/><text x="50%" y="50%" text-anchor="middle" fill="%23606060" font-size="16" font-family="Arial">No thumbnail</text></svg>';
//                       }}
//                     />

//                     {/* Video Preview Player */}
//                     <video
//                       ref={el => videoRefs.current[v._id] = el}
//                       src={`/api/videos/stream/${v.filename}`}
//                       className={`yt-video-preview ${hoveredVideo === v._id ? "visible" : ""}`}
//                       muted
//                       loop
//                       playsInline
//                     />

//                     <div className="yt-duration">{formatDuration(v.duration)}</div>
//                   </div>

//                   <div className="yt-video-info">
//                     <div
//                       className="yt-channel-icon"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (v.uploadedBy?._id) navigate(`/profile/${v.uploadedBy._id}`);
//                       }}
//                     >
//                       {v.uploadedBy?.name?.charAt(0).toUpperCase() || "U"}
//                     </div>



//                     <div className="yt-video-details">
//                       <h3 className="yt-video-title">{v.title}</h3>
//                       <div className="yt-video-meta">
//                         <div className="yt-channel-name">{v.uploadedBy?.name}</div>
//                         <div className="yt-video-stats">
//                           {formatViews(v.views)} • {getTimeAgo(v.createdAt)}
//                         </div>
//                       </div>
//                     </div>

//                     <button className="yt-more-btn" onClick={(e) => e.stopPropagation()}>
//                       <svg viewBox="0 0 24 24" width="24" height="24">
//                         <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>

//       <style jsx>{`
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         .youtube-home {
//           min-height: 100vh;
//           background: #0f0f0f;
//           color: #f1f1f1;
//           font-family: "Roboto", "Arial", sans-serif;
//         }

//         /* ========== NAVBAR ========== */
//         .yt-navbar {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 56px;
//           background: #0f0f0f;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0 16px;
//           z-index: 2000;
//           border-bottom: 1px solid #3f3f3f;
//         }

//         .yt-nav-start {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           flex: 0 0 auto;
//         }

//         .yt-icon-btn {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: transparent;
//           border: none;
//           color: #f1f1f1;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: background 0.15s;
//         }

//         .yt-icon-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         .yt-icon-btn svg {
//           fill: currentColor;
//         }

//         .yt-logo {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           cursor: pointer;
//         }

//         .yt-logo-icon {
//           width: 90px;
//           height: 20px;
//         }

//         .yt-logo-text {
//           font-size: 20px;
//           font-weight: 600;
//           letter-spacing: -0.5px;
//         }

//         .yt-nav-center {
//           flex: 1;
//           max-width: 640px;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           position: relative;
//         }

//         .yt-search-container {
//           flex: 1;
//           display: flex;
//           height: 40px;
//           border: 1px solid #303030;
//           border-radius: 40px;
//           overflow: hidden;
//           background: #121212;
//         }

//         .yt-search-container:focus-within {
//           border-color: #1c62b9;
//         }

//         .yt-search-input {
//           flex: 1;
//           padding: 0 16px;
//           background: transparent;
//           border: none;
//           color: #f1f1f1;
//           font-size: 16px;
//           outline: none;
//         }

//         .yt-search-input::placeholder {
//           color: #888;
//         }

//         .yt-search-btn {
//           width: 64px;
//           background: #222;
//           border: none;
//           border-left: 1px solid #303030;
//           color: #f1f1f1;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .yt-search-btn:hover {
//           background: #2a2a2a;
//         }

//         .yt-search-btn svg {
//           fill: currentColor;
//         }

//         .yt-suggestions {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 76px;
//           background: #212121;
//           border: 1px solid #303030;
//           border-radius: 12px;
//           margin-top: 8px;
//           max-height: 400px;
//           overflow-y: auto;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
//         }

//         .yt-suggestion-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 8px 16px;
//           cursor: pointer;
//           color: #f1f1f1;
//           font-size: 14px;
//         }

//         .yt-suggestion-item:hover {
//           background: #3f3f3f;
//         }

//         .yt-suggestion-item svg {
//           fill: #aaa;
//         }

//         .yt-suggestion-type {
//           margin-left: auto;
//           font-size: 11px;
//           color: #aaa;
//           text-transform: uppercase;
//         }

//         .yt-voice-btn.listening {
//           color: #f00;
//           animation: pulse 1.5s infinite;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }

//         .yt-nav-end {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           flex: 0 0 auto;
//         }

//         .yt-user-menu-wrapper {
//           position: relative;
//         }

//         .yt-user-avatar {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           background: #ff0000;
//           border: none;
//           color: #fff;
//           font-weight: 600;
//           font-size: 14px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .yt-user-dropdown {
//           position: absolute;
//           top: calc(100% + 8px);
//           right: 0;
//           width: 300px;
//           background: #282828;
//           border: 1px solid #3f3f3f;
//           border-radius: 12px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
//           z-index: 3000;
//         }

//         .yt-dropdown-header {
//           padding: 16px;
//           display: flex;
//           gap: 12px;
//         }

//         .yt-dropdown-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: #ff0000;
//           color: #fff;
//           font-weight: 600;
//           font-size: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .yt-dropdown-name {
//           font-weight: 500;
//           font-size: 16px;
//           margin-bottom: 4px;
//         }

//         .yt-dropdown-email {
//           font-size: 14px;
//           color: #aaa;
//         }

//         .yt-dropdown-divider {
//           height: 1px;
//           background: #3f3f3f;
//           margin: 8px 0;
//         }

//         .yt-dropdown-item {
//           width: 100%;
//           padding: 10px 16px;
//           background: transparent;
//           border: none;
//           color: #f1f1f1;
//           font-size: 14px;
//           text-align: left;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         .yt-dropdown-item:hover {
//           background: #3f3f3f;
//         }

//         .yt-dropdown-item svg {
//           fill: currentColor;
//         }

//         .yt-signin-btn {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 9px 15px;
//           background: transparent;
//           border: 1px solid #3ea6ff;
//           border-radius: 40px;
//           color: #3ea6ff;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//         }

//         .yt-signin-btn:hover {
//           background: rgba(62, 166, 255, 0.1);
//         }

//         .yt-signin-btn svg {
//           fill: currentColor;
//         }

//         /* Mobile search button - hidden by default, shown on mobile */
//         .mobile-search-btn {
//           display: none;
//         }

//         /* ========== CONTAINER ========== */
//         .yt-container {
//           display: flex;
//           padding-top: 56px;
//           min-height: 100vh;
//         }

//         /* ========== SIDEBAR ========== */
//         .yt-sidebar {
//           position: fixed;
//           top: 56px;
//           left: 0;
//           bottom: 0;
//           width: 240px;
//           background: #0f0f0f;
//           overflow-y: auto;
//           transition: transform 0.2s, width 0.2s;
//           z-index: 1000;
//           padding: 12px 0;
//         }

//         .yt-sidebar::-webkit-scrollbar {
//           width: 8px;
//         }

//         .yt-sidebar::-webkit-scrollbar-thumb {
//           background: #3f3f3f;
//           border-radius: 4px;
//         }

//         .yt-sidebar.closed {
//           width: 72px;
//         }

//         .yt-sidebar-section {
//           padding-bottom: 12px;
//           margin-bottom: 12px;
//         }

//         .yt-sidebar-title {
//           padding: 8px 24px;
//           font-size: 14px;
//           font-weight: 500;
//           color: #aaa;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .yt-sidebar.closed .yt-sidebar-title {
//           display: none;
//         }

//         .yt-sidebar-item {
//           display: flex;
//           align-items: center;
//           gap: 24px;
//           padding: 10px 24px;
//           background: transparent;
//           border: none;
//           color: #f1f1f1;
//           font-size: 14px;
//           text-align: left;
//           cursor: pointer;
//           width: 100%;
//           transition: background 0.15s;
//           position: relative;
//         }

//         .yt-sidebar-item:hover {
//           background: #272727;
//         }

//         .yt-sidebar-item.active {
//           background: #272727;
//           font-weight: 500;
//         }

//         .yt-sidebar-item.active::before {
//           content: '';
//           position: absolute;
//           left: 0;
//           top: 0;
//           bottom: 0;
//           width: 3px;
//           background: #f1f1f1;
//         }

//         .yt-sidebar-item svg {
//           fill: currentColor;
//           flex-shrink: 0;
//         }

//         .yt-sidebar.closed .yt-sidebar-item {
//           justify-content: center;
//           padding: 16px;
//         }

//         .yt-sidebar.closed .yt-sidebar-item span {
//           display: none;
//         }

//         .yt-sidebar-info {
//           padding: 12px 24px;
//           font-size: 13px;
//           color: #aaa;
//           line-height: 1.5;
//         }

//         .yt-sidebar.closed .yt-sidebar-info {
//           display: none;
//         }

//         .yt-sidebar-divider {
//           height: 1px;
//           background: #3f3f3f;
//           margin: 12px 0;
//         }

//         /* ========== MAIN CONTENT ========== */
//         .yt-main {
//           flex: 1;
//           margin-left: 240px;
//           transition: margin-left 0.2s;
//         }

//         .yt-main.sidebar-closed {
//           margin-left: 72px;
//         }

//         .yt-chips-container {
//           position: sticky;
//           top: 56px;
//           background: #0f0f0f;
//           border-bottom: 1px solid #3f3f3f;
//           padding: 12px 0;
//           z-index: 900;
//         }

//         .yt-chips-wrapper {
//           display: flex;
//           gap: 12px;
//           padding: 0 24px;
//           overflow-x: auto;
//         }

//         .yt-chips-wrapper::-webkit-scrollbar {
//           display: none;
//         }

//         .yt-chip {
//           padding: 8px 12px;
//           background: #272727;
//           border: none;
//           border-radius: 8px;
//           color: #f1f1f1;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           white-space: nowrap;
//           transition: background 0.15s;
//         }

//         .yt-chip:hover {
//           background: #3f3f3f;
//         }

//         .yt-chip.active {
//           background: #f1f1f1;
//           color: #0f0f0f;
//         }

//         .yt-loading, .yt-empty {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 80px 20px;
//           text-align: center;
//         }

//         .yt-spinner {
//           width: 48px;
//           height: 48px;
//           border: 3px solid #3f3f3f;
//           border-top-color: #f00;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 20px;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .yt-loading p {
//           color: #aaa;
//           font-size: 14px;
//         }

//         .yt-empty h2 {
//           margin: 20px 0 8px;
//           font-size: 20px;
//           font-weight: 500;
//         }

//         .yt-empty p {
//           color: #aaa;
//           font-size: 14px;
//         }

//         /* ========== VIDEO GRID ========== */
//         .yt-video-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//           gap: 40px 16px;
//           padding: 24px;
//         }

//         .ad-banner-wrapper {
//           grid-column: 1 / -1;
//           margin-bottom: 8px;
//         }

//         .ad-banner {
//           background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
//           border: 1px solid #3f3f3f;
//           border-radius: 12px;
//           padding: 20px 24px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .ad-content {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         .ad-icon {
//           font-size: 32px;
//         }

//         .ad-text h3 {
//           font-size: 16px;
//           font-weight: 500;
//           margin-bottom: 4px;
//         }

//         .ad-text p {
//           font-size: 14px;
//           color: #aaa;
//         }

//         .ad-cta {
//           padding: 10px 16px;
//           background: linear-gradient(135deg, #facc15, #f97316);
//           border: none;
//           border-radius: 20px;
//           color: #000;
//           font-weight: 700;
//           font-size: 14px;
//           cursor: pointer;
//         }

//         .yt-video-card {
//           cursor: pointer;
//           animation: fadeInCard 0.4s ease forwards;
//           opacity: 0;
//         }

//         @keyframes fadeInCard {
//           to { opacity: 1; }
//         }

//         .yt-thumbnail {
//           position: relative;
//           width: 100%;
//           aspect-ratio: 16/9;
//           border-radius: 12px;
//           overflow: hidden;
//           background: #181818;
//         }

//         .yt-thumbnail-img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: transform 0.2s, opacity 0.3s;
//           position: absolute;
//           top: 0;
//           left: 0;
//         }

//         .yt-thumbnail-img.hidden {
//           opacity: 0;
//           pointer-events: none;
//         }

//         .yt-video-preview {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           opacity: 0;
//           transition: opacity 0.3s ease;
//           pointer-events: none;
//         }

//         .yt-video-preview.visible {
//           opacity: 1;
//           z-index: 1;
//         }

//         .yt-video-card:hover .yt-thumbnail-img {
//           transform: scale(1.05);
//         }

//         .yt-duration {
//           position: absolute;
//           bottom: 4px;
//           right: 4px;
//           background: rgba(0, 0, 0, 0.8);
//           color: #fff;
//           padding: 3px 4px;
//           border-radius: 2px;
//           font-size: 12px;
//           font-weight: 500;
//         }

//         .yt-video-info {
//           display: flex;
//           gap: 12px;
//           margin-top: 12px;
//         }

//         .yt-channel-icon {
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           background: #f00;
//           color: #fff;
//           font-weight: 600;
//           font-size: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//           cursor: pointer;
//         }

//         .yt-video-details {
//           flex: 1;
//           min-width: 0;
//         }

//         .yt-video-title {
//           font-size: 14px;
//           font-weight: 500;
//           line-height: 1.4;
//           margin-bottom: 4px;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//           color: #f1f1f1;
//         }

//         .yt-video-meta {
//           font-size: 14px;
//           color: #aaa;
//         }

//         .yt-channel-name {
//           font-size: 14px;
//           color: #aaa;
//           margin-bottom: 2px;
//         }

//         .yt-video-stats {
//           font-size: 14px;
//           color: #aaa;
//         }

//         .yt-more-btn {
//           background: transparent;
//           border: none;
//           color: #aaa;
//           cursor: pointer;
//           padding: 0;
//           width: 24px;
//           height: 24px;
//           display: none;
//         }

//         .yt-video-card:hover .yt-more-btn {
//           display: block;
//         }

//         .yt-more-btn svg {
//           fill: currentColor;
//         }

//         /* ========== RESPONSIVE ========== */

//         /* Tablet and below */
//         @media (max-width: 1024px) {
//           .yt-sidebar.closed {
//             transform: translateX(-100%);
//           }

//           .yt-main {
//             margin-left: 0;
//           }

//           .yt-main.sidebar-open {
//             margin-left: 0;
//           }

//           .yt-video-grid {
//             grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//             gap: 32px 12px;
//           }
//         }

//         /* Mobile */
//         @media (max-width: 768px) {
//           /* Navbar adjustments */
//           .yt-navbar {
//             padding: 0 12px;
//           }

//           .yt-nav-start {
//             gap: 8px;
//           }

//           /* Mobile search button - only visible on mobile */
//           .mobile-search-btn {
//             display: flex;
//           }

//           .yt-nav-center {
//             position: fixed;
//             top: 56px;
//             left: 0;
//             right: 0;
//             background: #0f0f0f;
//             padding: 12px;
//             border-bottom: 1px solid #3f3f3f;
//             display: none;
//             z-index: 1500;
//             max-width: none;
//           }

//           .yt-nav-center.mobile-search-active {
//             display: flex;
//           }

//           .yt-logo-text {
//             display: none;
//           }

//           .yt-logo-icon {
//             width: 70px;
//           }

//           .yt-nav-end {
//             gap: 4px;
//           }

//           .yt-icon-btn {
//             width: 40px;
//             height: 40px;
//             min-width: 40px;
//             min-height: 40px;
//           }

//           .yt-signin-btn {
//             padding: 8px 12px;
//             font-size: 13px;
//           }

//           .yt-signin-btn svg {
//             width: 20px;
//             height: 20px;
//           }

//           /* Sidebar mobile behavior */
//           .yt-sidebar {
//             transform: translateX(-100%);
//             box-shadow: 2px 0 8px rgba(0, 0, 0, 0.5);
//           }

//           .yt-sidebar.open {
//             transform: translateX(0);
//           }

//           .yt-sidebar.closed {
//             transform: translateX(-100%);
//           }

//           /* Sidebar overlay */
//           .yt-sidebar.open::before {
//             content: '';
//             position: fixed;
//             top: 56px;
//             left: 240px;
//             right: 0;
//             bottom: 0;
//             background: rgba(0, 0, 0, 0.7);
//             z-index: 999;
//           }

//           /* Main content */
//           .yt-main {
//             margin-left: 0;
//           }

//           /* Chips container */
//           .yt-chips-container {
//             top: 56px;
//           }

//           .yt-chips-wrapper {
//             padding: 0 12px;
//             gap: 8px;
//           }

//           .yt-chip {
//             padding: 6px 10px;
//             font-size: 13px;
//           }

//           /* Video grid - single column on mobile */
//           .yt-video-grid {
//             grid-template-columns: 1fr;
//             gap: 20px;
//             padding: 16px 12px;
//           }

//           /* Ad banner mobile */
//           .ad-banner {
//             flex-direction: column;
//             text-align: center;
//             padding: 16px;
//           }

//           .ad-content {
//             flex-direction: column;
//             text-align: center;
//           }

//           .ad-cta {
//             width: 100%;
//             margin-top: 12px;
//           }

//           /* Video card mobile optimizations */
//           .yt-video-info {
//             gap: 8px;
//           }

//           .yt-channel-icon {
//             width: 32px;
//             height: 32px;
//             font-size: 12px;
//           }

//           .yt-video-title {
//             font-size: 13px;
//           }

//           .yt-channel-name,
//           .yt-video-stats {
//             font-size: 12px;
//           }

//           /* User dropdown mobile */
//           .yt-user-dropdown {
//             width: 260px;
//             right: -12px;
//           }

//           /* Suggestions mobile */
//           .yt-suggestions {
//             left: 12px;
//             right: 12px;
//           }
//         }

//         /* Small mobile devices */
//         @media (max-width: 480px) {
//           .yt-video-grid {
//             padding: 12px 8px;
//             gap: 16px;
//           }

//           .yt-chips-wrapper {
//             padding: 0 8px;
//           }

//           .ad-text h3 {
//             font-size: 14px;
//           }

//           .ad-text p {
//             font-size: 12px;
//           }
//         }

//         /* Large desktop */
//         @media (min-width: 1440px) {
//           .yt-video-grid {
//             grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
//             gap: 40px 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useEffect, useState, useContext, useRef } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notifications from "../components/Notifications";
import { io } from "socket.io-client";

import socket from "../socket";

const TRENDING_DAYS_WINDOW = 7;
const RECENCY_WEIGHT = 1000;
const TOP_N = 50;

const AdBanner = ({ user }) => (
  <div className="ad-banner-wrapper">
    <div className="ad-banner">
      <div className="ad-content">
        <div className="ad-icon">⭐</div>
        <div className="ad-text">
          <h3>Try MyTube Premium</h3>
          <p>Enjoy ad-free viewing, background play, and downloads</p>
        </div>
      </div>
      <button
        onClick={() => window.location.href = user ? "/profile" : "/login"}
        className="ad-cta"
      >
        Get Premium
      </button>
    </div>
  </div>
);

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recognitionRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const videoRefs = useRef({});
  const socketRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
      // Close mobile search on resize
      if (window.innerWidth > 768) {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current.emit("join-user", user._id);

    socketRef.current.on("connect", () => { });
    socketRef.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(
          `/api/search/suggestions?query=${search}`
        );
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

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
    { name: "News", icon: "📰" },
    { name: "Comedy", icon: "😂" },
  ];

  const sidebarSections = [
    {
      items: [
        { name: "Home", icon: "home", path: "/", category: "All" },
        { name: "Shorts", icon: "shorts", path: "/shorts" },
        { name: "Subscriptions", icon: "subscriptions", path: "/Subscription" }
      ]
    },
    {
      title: "You",
      items: user ? [
        { name: "Your Channel", icon: "user", path: "/profile" },
        { name: "History", icon: "history", path: "/history" },
        { name: "Your Videos", icon: "video", path: "/profile" },
        { name: "Watch Later", icon: "clock", path: "/watch-later" },
        { name: "Liked Videos", icon: "like", path: "/Likedvideos" },
        { name: "Go Live", icon: "live", path: `/live/${user._id}?role=broadcaster` },
      ] : [
        { name: "Sign in to see your videos", icon: "info", type: "info" }
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
        const res = await api.get(
          "/api/videos/recommended",
          {}
        );
        setVideos(res.data);
        setFiltered(res.data);
        setLoading(false);
        return;
      }

      if (selectedCategory === "Trending") {
        const res = await api.get("/api/videos/all");
        const videoList = Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []);
        const scored = videoList
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
        res = await api.get("/api/videos/all?limit=20");
        const videoList = Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []);
        setVideos(videoList);
        setFiltered(videoList);
        setLoading(false);
        return;
      } else {
        try {
          res = await api.get(`/api/videos/category/${selectedCategory}`);
        } catch (err) {
          res = await api.get("/api/videos/all");
          const allVideos = Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []);
          res.data = allVideos.filter(v => v.category === selectedCategory);
        }
      }

      const finalVideos = Array.isArray(res.data) ? res.data : (res.data.videos || []);
      setVideos(finalVideos);
      setFiltered(finalVideos);
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
        const res = await api.get(`/api/search?query=${encodeURIComponent(search)}`);
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
    if (!views) return "0 views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
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
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSidebarItemClick = (item) => {
    if (!user && item.path === "/Subscription") {
      navigate("/Login");
      return;
    }

    if (item.category) {
      setSelectedCategory(item.category);
      // Close sidebar on mobile after selection
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      }
    } else if (item.path && item.path !== "#") {
      navigate(item.path);
    }
  };

  const getIconSVG = (iconName) => {
    const icons = {
      home: <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />,
      shorts: <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z" />,
      subscriptions: <path d="M18 7H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 10H6V9h12v8zm-6-1l5-3-5-3v6zM5 6h14V4H5c-1.1 0-2 .9-2 2v11h2V6z" />,
      user: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
      history: <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />,
      video: <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />,
      clock: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />,
      like: <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />,
      trending: <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />,
      music: <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />,
      gaming: <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />,
      news: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />,
      sports: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13.66 6.3 13 5.3zm-3.35-.95L11 5.3l-.66 1-3.33 3.18-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.5 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />,
      live: <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />,
      info: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    };
    return icons[iconName] || icons.home;
  };

  const handleVideoHover = (videoId, filename) => {
    // Only enable hover preview on desktop
    if (window.innerWidth <= 768) return;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const timeout = setTimeout(() => {
      setHoveredVideo(videoId);

      setTimeout(() => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
          videoElement.currentTime = 0;
          videoElement.play().catch(err => console.log("Autoplay prevented:", err));
        }
      }, 100);
    }, 1000);

    setHoverTimeout(timeout);
  };

  const handleVideoLeave = (videoId) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    setHoveredVideo(null);
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="youtube-home">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && window.innerWidth <= 1024 && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* NAVBAR */}
      <nav className="yt-navbar">
        <div className="yt-nav-start">
          <button className="yt-icon-btn" onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>

          <div className="yt-logo" onClick={() => navigate("/")}>
            <svg viewBox="0 0 90 20" className="yt-logo-icon">
              <g>
                <path fill="#FF0000" d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" />
                <path fill="#FFFFFF" d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" />
              </g>
            </svg>
            <span className="yt-logo-text">MyTube</span>
          </div>
        </div>

        <div className={`yt-nav-center ${showMobileSearch ? 'mobile-search-active' : ''}`} ref={searchRef}>
          <div className="yt-search-container">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="yt-search-input"
            />
            <button className="yt-search-btn">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="yt-suggestions">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="yt-suggestion-item"
                  onClick={() => {
                    setSearch(s.text);
                    setShowSuggestions(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                  <span>{s.text}</span>
                  <span className="yt-suggestion-type">{s.type}</span>
                </div>
              ))}
            </div>
          )}

          <button
            className={`yt-icon-btn yt-voice-btn ${isListening ? "listening" : ""}`}
            onClick={startVoiceSearch}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </div>

        <div className="yt-nav-end">
          <button
            className="yt-icon-btn mobile-search-btn"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>

          {user ? (
            <>
              <button className="yt-icon-btn hide-on-small-mobile" onClick={() => navigate("/UserUpload")}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </button>
              <div className="hide-on-small-mobile">
                <Notifications />
              </div>

              <div className="yt-user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="yt-user-avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </button>

                {showUserMenu && (
                  <div className="yt-user-dropdown">
                    <div className="yt-dropdown-header">
                      <div className="yt-dropdown-avatar">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="yt-dropdown-name">{user.name}</div>
                        <div className="yt-dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="yt-dropdown-divider" />
                    <button className="yt-dropdown-item" onClick={() => navigate("/profile")}>
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      Your channel
                    </button>
                    <button className="yt-dropdown-item" onClick={() => logout()}>
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="yt-signin-btn" onClick={() => navigate("/login")}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="signin-text">Sign in</span>
            </button>
          )}
        </div>
      </nav>

      <div className="yt-container">
        <aside className={`yt-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          {sidebarSections.map((section, sIdx) => (
            <div key={sIdx} className="yt-sidebar-section">
              {section.title && <div className="yt-sidebar-title">{section.title}</div>}
              {section.items.map((item, iIdx) => (
                item.type === "info" ? (
                  <div key={iIdx} className="yt-sidebar-info">
                    <span>{item.name}</span>
                  </div>
                ) : (
                  <button
                    key={iIdx}
                    className={`yt-sidebar-item ${(item.category && selectedCategory === item.category) ||
                      (item.path === "/" && selectedCategory === "All")
                      ? "active"
                      : ""
                      }`}
                    onClick={() => handleSidebarItemClick(item)}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      {getIconSVG(item.icon)}
                    </svg>
                    <span>{item.name}</span>
                  </button>
                )
              ))}
              {sIdx < sidebarSections.length - 1 && <div className="yt-sidebar-divider" />}
            </div>
          ))}
        </aside>

        <main className={`yt-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <div className="yt-chips-container">
            <div className="yt-chips-wrapper">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`yt-chip ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="yt-loading">
              <div className="yt-spinner" />
              <p>Loading videos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="yt-empty">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="#606060">
                <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z" />
              </svg>
              <h2>No videos found</h2>
              <p>{search ? `No results for "${search}"` : "No videos in this category"}</p>
            </div>
          ) : (
            <div className="yt-video-grid">
              {(!user || !user.isPremium) && <AdBanner user={user} />}

              {filtered.map((v, index) => (
                <div
                  key={v._id}
                  className="yt-video-card"
                  onClick={() => navigate(`/watch/${v.filename}`)}
                  onMouseEnter={() => handleVideoHover(v._id, v.filename)}
                  onMouseLeave={() => handleVideoLeave(v._id)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="yt-thumbnail">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                      alt={v.title}
                      className={`yt-thumbnail-img ${hoveredVideo === v._id ? "hidden" : ""}`}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect fill="%23282828" width="320" height="180"/><text x="50%" y="50%" text-anchor="middle" fill="%23606060" font-size="16" font-family="Arial">No thumbnail</text></svg>';
                      }}
                    />

                    <video
                      ref={el => videoRefs.current[v._id] = el}
                      src={`/api/videos/stream/${v.filename}`}
                      className={`yt-video-preview ${hoveredVideo === v._id ? "visible" : ""}`}
                      muted
                      loop
                      playsInline
                    />

                    <div className="yt-duration">{formatDuration(v.duration)}</div>
                  </div>

                  <div className="yt-video-info">
                    <div
                      className="yt-channel-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (v.uploadedBy?._id) navigate(`/profile/${v.uploadedBy._id}`);
                      }}
                    >
                      {v.uploadedBy?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="yt-video-details">
                      <h3 className="yt-video-title">{v.title}</h3>
                      <div className="yt-video-meta">
                        <div className="yt-channel-name">{v.uploadedBy?.name}</div>
                        <div className="yt-video-stats">
                          {formatViews(v.views)} • {getTimeAgo(v.createdAt)}
                        </div>
                      </div>
                    </div>

                    <button className="yt-more-btn" onClick={(e) => e.stopPropagation()}>
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .youtube-home {
          min-height: 100vh;
          background: #0f0f0f;
          color: #f1f1f1;
          font-family: "Roboto", "Arial", sans-serif;
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1500;
          display: none;
        }

        @media (max-width: 1024px) {
          .sidebar-overlay {
            display: block;
          }
        }

        /* ========== NAVBAR ========== */
        .yt-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 2000;
          border-bottom: 1px solid #3f3f3f;
        }

        .yt-nav-start {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 0 0 auto;
          min-width: 0;
        }

        .yt-icon-btn {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: #f1f1f1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          flex-shrink: 0;
        }

        .yt-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .yt-icon-btn svg {
          fill: currentColor;
        }

        .yt-logo {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          min-width: 0;
        }

        .yt-logo-icon {
          width: 90px;
          height: 20px;
          flex-shrink: 0;
        }

        .yt-logo-text {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .yt-nav-center {
          flex: 1;
          max-width: 640px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          margin: 0 40px;
        }

        .yt-search-container {
          flex: 1;
          display: flex;
          height: 40px;
          border: 1px solid #303030;
          border-radius: 40px;
          overflow: hidden;
          background: #121212;
          min-width: 0;
        }

        .yt-search-container:focus-within {
          border-color: #1c62b9;
        }

        .yt-search-input {
          flex: 1;
          padding: 0 16px;
          background: transparent;
          border: none;
          color: #f1f1f1;
          font-size: 16px;
          outline: none;
          min-width: 0;
        }

        .yt-search-input::placeholder {
          color: #888;
        }

        .yt-search-btn {
          width: 64px;
          min-width: 64px;
          background: #222;
          border: none;
          border-left: 1px solid #303030;
          color: #f1f1f1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .yt-search-btn:hover {
          background: #2a2a2a;
        }

        .yt-search-btn svg {
          fill: currentColor;
        }

        .yt-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 76px;
          background: #212121;
          border: 1px solid #303030;
          border-radius: 12px;
          margin-top: 8px;
          max-height: 400px;
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          z-index: 3000;
        }

        .yt-suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          cursor: pointer;
          color: #f1f1f1;
          font-size: 14px;
        }

        .yt-suggestion-item:hover {
          background: #3f3f3f;
        }

        .yt-suggestion-item svg {
          fill: #aaa;
          flex-shrink: 0;
        }

        .yt-suggestion-type {
          margin-left: auto;
          font-size: 11px;
          color: #aaa;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .yt-voice-btn.listening {
          color: #f00;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .yt-nav-end {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }

        .mobile-search-btn {
          display: none;
        }

        .hide-on-small-mobile {
          display: flex;
        }

        .yt-user-menu-wrapper {
          position: relative;
        }

        .yt-user-avatar {
          width: 32px;
          height: 32px;
          min-width: 32px;
          min-height: 32px;
          border-radius: 50%;
          background: #ff0000;
          border: none;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .yt-user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 300px;
          background: #282828;
          border: 1px solid #3f3f3f;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          z-index: 3000;
        }

        .yt-dropdown-header {
          padding: 16px;
          display: flex;
          gap: 12px;
        }

        .yt-dropdown-avatar {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 50%;
          background: #ff0000;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .yt-dropdown-name {
          font-weight: 500;
          font-size: 16px;
          margin-bottom: 4px;
          word-break: break-word;
        }

        .yt-dropdown-email {
          font-size: 14px;
          color: #aaa;
          word-break: break-word;
        }

        .yt-dropdown-divider {
          height: 1px;
          background: #3f3f3f;
          margin: 8px 0;
        }

        .yt-dropdown-item {
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: #f1f1f1;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .yt-dropdown-item:hover {
          background: #3f3f3f;
        }

        .yt-dropdown-item svg {
          fill: currentColor;
          flex-shrink: 0;
        }

        .yt-signin-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 15px;
          background: transparent;
          border: 1px solid #3ea6ff;
          border-radius: 40px;
          color: #3ea6ff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }

        .yt-signin-btn:hover {
          background: rgba(62, 166, 255, 0.1);
        }

        .yt-signin-btn svg {
          fill: currentColor;
          flex-shrink: 0;
        }

        /* ========== CONTAINER ========== */
        .yt-container {
          display: flex;
          padding-top: 56px;
          min-height: 100vh;
        }

        /* ========== SIDEBAR ========== */
        .yt-sidebar {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          width: 240px;
          background: #0f0f0f;
          overflow-y: auto;
          overflow-x: hidden;
          transition: transform 0.3s ease;
          z-index: 1600;
          padding: 12px 0;
        }

        .yt-sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .yt-sidebar::-webkit-scrollbar-thumb {
          background: #3f3f3f;
          border-radius: 4px;
        }

        .yt-sidebar-section {
          padding-bottom: 12px;
          margin-bottom: 12px;
        }

        .yt-sidebar-title {
          padding: 8px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .yt-sidebar-item {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 10px 24px;
          background: transparent;
          border: none;
          color: #f1f1f1;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          width: 100%;
          transition: background 0.15s;
          position: relative;
        }

        .yt-sidebar-item:hover {
          background: #272727;
        }

        .yt-sidebar-item.active {
          background: #272727;
          font-weight: 500;
        }

        .yt-sidebar-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #f1f1f1;
        }

        .yt-sidebar-item svg {
          fill: currentColor;
          flex-shrink: 0;
        }

        .yt-sidebar-info {
          padding: 12px 24px;
          font-size: 13px;
          color: #aaa;
          line-height: 1.5;
        }

        .yt-sidebar-divider {
          height: 1px;
          background: #3f3f3f;
          margin: 12px 0;
        }

        /* ========== MAIN CONTENT ========== */
        .yt-main {
          flex: 1;
          margin-left: 240px;
          transition: margin-left 0.3s ease;
          min-width: 0;
        }

        .yt-chips-container {
          position: sticky;
          top: 56px;
          background: #0f0f0f;
          border-bottom: 1px solid #3f3f3f;
          padding: 12px 0;
          z-index: 900;
        }

        .yt-chips-wrapper {
          display: flex;
          gap: 12px;
          padding: 0 24px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .yt-chips-wrapper::-webkit-scrollbar {
          display: none;
        }

        .yt-chip {
          padding: 8px 12px;
          background: #272727;
          border: none;
          border-radius: 8px;
          color: #f1f1f1;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
          flex-shrink: 0;
        }

        .yt-chip:hover {
          background: #3f3f3f;
        }

        .yt-chip.active {
          background: #f1f1f1;
          color: #0f0f0f;
        }

        .yt-loading, .yt-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }

        .yt-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #3f3f3f;
          border-top-color: #f00;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .yt-loading p {
          color: #aaa;
          font-size: 14px;
        }

        .yt-empty h2 {
          margin: 20px 0 8px;
          font-size: 20px;
          font-weight: 500;
        }

        .yt-empty p {
          color: #aaa;
          font-size: 14px;
        }

        /* ========== VIDEO GRID ========== */
        .yt-video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 40px 16px;
          padding: 24px;
        }

        .ad-banner-wrapper {
          grid-column: 1 / -1;
          margin-bottom: 8px;
        }

        .ad-banner {
          background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
          border: 1px solid #3f3f3f;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ad-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 200px;
        }

        .ad-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .ad-text h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .ad-text p {
          font-size: 14px;
          color: #aaa;
        }

        .ad-cta {
          padding: 10px 16px;
          background: linear-gradient(135deg, #facc15, #f97316);
          border: none;
          border-radius: 20px;
          color: #000;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .yt-video-card {
          cursor: pointer;
          animation: fadeInCard 0.4s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInCard {
          to { opacity: 1; }
        }

        .yt-thumbnail {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          background: #181818;
        }

        .yt-thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s, opacity 0.3s;
          position: absolute;
          top: 0;
          left: 0;
        }

        .yt-thumbnail-img.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .yt-video-preview {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .yt-video-preview.visible {
          opacity: 1;
          z-index: 1;
        }

        .yt-video-card:hover .yt-thumbnail-img {
          transform: scale(1.05);
        }

        .yt-duration {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 3px 4px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 500;
          z-index: 2;
        }

        .yt-video-info {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .yt-channel-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          min-height: 36px;
          border-radius: 50%;
          background: #f00;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
        }

        .yt-video-details {
          flex: 1;
          min-width: 0;
        }

        .yt-video-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #f1f1f1;
          word-break: break-word;
        }

        .yt-video-meta {
          font-size: 14px;
          color: #aaa;
        }

        .yt-channel-name {
          font-size: 14px;
          color: #aaa;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .yt-video-stats {
          font-size: 14px;
          color: #aaa;
        }

        .yt-more-btn {
          background: transparent;
          border: none;
          color: #aaa;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          min-width: 24px;
          min-height: 24px;
          display: none;
          flex-shrink: 0;
        }

        .yt-video-card:hover .yt-more-btn {
          display: block;
        }

        .yt-more-btn svg {
          fill: currentColor;
        }

        /* ========== RESPONSIVE - TABLET ========== */
        @media (max-width: 1024px) {
          .yt-sidebar {
            transform: translateX(-100%);
          }

          .yt-sidebar.open {
            transform: translateX(0);
            box-shadow: 2px 0 12px rgba(0, 0, 0, 0.5);
          }

          .yt-main {
            margin-left: 0;
          }

          .yt-video-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 32px 12px;
            padding: 20px;
          }

          .yt-nav-center {
            margin: 0 24px;
          }
        }

        /* ========== RESPONSIVE - MOBILE ========== */
        @media (max-width: 768px) {
          .yt-navbar {
            padding: 0 8px;
            height: 56px;
          }

          .yt-nav-start {
            gap: 4px;
            flex: 1;
            min-width: 0;
          }

          .yt-logo {
            gap: 2px;
          }

          .yt-logo-icon {
            width: 70px;
            height: 18px;
          }

          .yt-logo-text {
            font-size: 18px;
            display: none;
          }

          .mobile-search-btn {
            display: flex;
          }

          .yt-nav-center {
            position: fixed;
            top: 56px;
            left: 0;
            right: 0;
            background: #0f0f0f;
            padding: 12px;
            border-bottom: 1px solid #3f3f3f;
            display: none;
            z-index: 1900;
            max-width: none;
            margin: 0;
          }

          .yt-nav-center.mobile-search-active {
            display: flex;
          }

          .yt-nav-end {
            gap: 4px;
            flex: 0 0 auto;
          }

          .signin-text {
            display: none;
          }

          .yt-signin-btn {
            padding: 8px;
            min-width: 40px;
          }

          .yt-chips-container {
            top: 56px;
          }

          .yt-nav-center.mobile-search-active ~ .yt-container .yt-chips-container {
            top: calc(56px + 64px);
          }

          .yt-chips-wrapper {
            padding: 0 12px;
            gap: 8px;
          }

          .yt-chip {
            padding: 6px 10px;
            font-size: 13px;
          }

          .yt-video-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 16px 12px;
          }

          .ad-banner {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
          }

          .ad-content {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }

          .ad-text h3 {
            font-size: 15px;
          }

          .ad-text p {
            font-size: 13px;
          }

          .ad-cta {
            width: 100%;
            margin-top: 12px;
          }

          .yt-video-info {
            gap: 8px;
          }

          .yt-channel-icon {
            width: 32px;
            height: 32px;
            min-width: 32px;
            min-height: 32px;
            font-size: 12px;
          }

          .yt-video-title {
            font-size: 14px;
          }

          .yt-channel-name,
          .yt-video-stats {
            font-size: 12px;
          }

          .yt-user-dropdown {
            width: 280px;
            right: -8px;
          }

          .yt-suggestions {
            left: 12px;
            right: 12px;
          }

          .yt-more-btn {
            display: block;
          }
        }

        /* ========== RESPONSIVE - SMALL MOBILE ========== */
        @media (max-width: 480px) {
          .hide-on-small-mobile {
            display: none;
          }

          .yt-navbar {
            padding: 0 6px;
          }

          .yt-nav-start {
            gap: 2px;
          }

          .yt-icon-btn {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
          }

          .yt-logo-icon {
            width: 60px;
            height: 16px;
          }

          .yt-user-avatar {
            width: 28px;
            height: 28px;
            min-width: 28px;
            min-height: 28px;
            font-size: 12px;
          }

          .yt-video-grid {
            padding: 12px 8px;
            gap: 20px;
          }

          .yt-chips-wrapper {
            padding: 0 8px;
            gap: 6px;
          }

          .yt-chip {
            padding: 6px 8px;
            font-size: 12px;
          }

          .ad-text h3 {
            font-size: 14px;
          }

          .ad-text p {
            font-size: 12px;
          }

          .yt-user-dropdown {
            width: 260px;
            right: -6px;
          }

          .yt-dropdown-header {
            padding: 12px;
          }

          .yt-dropdown-avatar {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
            font-size: 14px;
          }

          .yt-dropdown-name {
            font-size: 14px;
          }

          .yt-dropdown-email {
            font-size: 12px;
          }

          .yt-video-title {
            font-size: 13px;
          }

          .yt-channel-name,
          .yt-video-stats {
            font-size: 11px;
          }

          .yt-empty h2 {
            font-size: 18px;
          }

          .yt-empty p {
            font-size: 13px;
          }
        }

        /* ========== RESPONSIVE - LARGE DESKTOP ========== */
        @media (min-width: 1440px) {
          .yt-video-grid {
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 40px 20px;
            padding: 32px;
          }
        }

        /* ========== RESPONSIVE - EXTRA LARGE DESKTOP ========== */
        @media (min-width: 1920px) {
          .yt-video-grid {
            grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
            gap: 48px 24px;
            padding: 40px;
          }
        }
      `}</style>
    </div>
  );
}