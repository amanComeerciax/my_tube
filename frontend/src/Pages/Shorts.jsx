// import React, { useState, useEffect, useRef, useContext } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Shorts() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [shorts, setShorts] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [muted, setMuted] = useState(false);
  
//   const videoRefs = useRef([]);
//   const containerRef = useRef(null);

//   // Fetch Shorts
//   useEffect(() => {
//     fetchShorts();
//   }, []);

//   const fetchShorts = async () => {
//     try {
//       const res = await api.get("/api/videos/shorts");
//       setShorts(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch shorts:", err);
//       setLoading(false);
//     }
//   };

//   // Auto-play current video
//   useEffect(() => {
//     if (shorts.length > 0 && videoRefs.current[currentIndex]) {
//       // Pause all videos
//       videoRefs.current.forEach((video, idx) => {
//         if (video && idx !== currentIndex) {
//           video.pause();
//         }
//       });

//       // Play current video
//       const currentVideo = videoRefs.current[currentIndex];
//       if (currentVideo) {
//         currentVideo.currentTime = 0;
//         currentVideo.play().catch(err => console.log("Autoplay prevented:", err));
//       }
//     }
//   }, [currentIndex, shorts]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "ArrowUp" && currentIndex > 0) {
//         setCurrentIndex(prev => prev - 1);
//       } else if (e.key === "ArrowDown" && currentIndex < shorts.length - 1) {
//         setCurrentIndex(prev => prev + 1);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, shorts.length]);

//   // Scroll snap
//   useEffect(() => {
//     if (containerRef.current) {
//       const container = containerRef.current;
//       container.scrollTo({
//         top: currentIndex * window.innerHeight,
//         behavior: "smooth"
//       });
//     }
//   }, [currentIndex]);

//   // Handle Like
//   const handleLike = async (shortId) => {
//     if (!user) {
//       alert("Please login to like");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.post(
//         `/api/videos/like/${shortId}`,
//         {},
//         {  }
//       );

//       setShorts(prev =>
//         prev.map(s => s._id === shortId ? res.data : s)
//       );
//     } catch (err) {
//       console.error("Like failed:", err);
//     }
//   };

//   // Handle Dislike
//   const handleDislike = async (shortId) => {
//     if (!user) {
//       alert("Please login to dislike");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.post(
//         `/api/videos/dislike/${shortId}`,
//         {},
//         {  }
//       );

//       setShorts(prev =>
//         prev.map(s => s._id === shortId ? res.data : s)
//       );
//     } catch (err) {
//       console.error("Dislike failed:", err);
//     }
//   };

//   // Navigate to channel
//   const goToChannel = (uploaderId) => {
//     navigate(`/channel/${uploaderId}`);
//   };

//   if (loading) {
//     return (
//       <div style={styles.loading}>
//         <div style={styles.spinner}></div>
//         <p>Loading Shorts...</p>
//       </div>
//     );
//   }

//   if (shorts.length === 0) {
//     return (
//       <div style={styles.empty}>
//         <h2>📱 No Shorts Yet</h2>
//         <p style={{ color: "#aaa", marginTop: 10 }}>
//           Be the first to upload a Short!
//         </p>
//         <button style={styles.uploadBtn} onClick={() => navigate("/upload")}>
//           Upload Short
//         </button>
//       </div>
//     );
//   }

//   const currentShort = shorts[currentIndex];
//   const isLiked = user && currentShort?.likes?.includes(user.id);
//   const isDisliked = user && currentShort?.dislikes?.includes(user.id);

//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button style={styles.backBtn} onClick={() => navigate("/")}>
//           ←
//         </button>
//         <h2 style={styles.headerTitle}>Shorts</h2>
//         <button style={styles.uploadHeaderBtn} onClick={() => navigate("/upload")}>
//           📷
//         </button>
//       </div>

//       {/* SHORTS FEED */}
//       <div style={styles.feed} ref={containerRef}>
//         {shorts.map((short, index) => (
//           <div key={short._id} style={styles.shortContainer}>
//             <video
//               ref={el => videoRefs.current[index] = el}
//               src={`/api/videos/stream/${short.filename}`}
//               style={styles.video}
//               loop
//               muted={muted}
//               playsInline
//               onClick={() => {
//                 const video = videoRefs.current[index];
//                 if (video.paused) video.play();
//                 else video.pause();
//               }}
//             />

//             {/* GRADIENT OVERLAY */}
//             <div style={styles.overlay} />

//             {/* BOTTOM INFO */}
//             <div style={styles.info}>
//               <div style={styles.channelInfo} onClick={() => goToChannel(short.uploadedBy._id)}>
//                 <div style={styles.avatar}>
//                   {short.uploadedBy?.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <p style={styles.channelName}>@{short.uploadedBy?.name}</p>
//               </div>

//               <h3 style={styles.title}>{short.title}</h3>
              
//               {short.description && (
//                 <p style={styles.description}>{short.description}</p>
//               )}

//               <div style={styles.tags}>
//                 {short.tags?.slice(0, 3).map((tag, i) => (
//                   <span key={i} style={styles.tag}>#{tag}</span>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT SIDE ACTIONS */}
//             <div style={styles.actions}>
//               <button
//                 style={{
//                   ...styles.actionBtn,
//                   color: isLiked ? "#ff0000" : "white"
//                 }}
//                 onClick={() => handleLike(short._id)}
//               >
//                 <span style={styles.actionIcon}>
//                   {isLiked ? "❤️" : "🤍"}
//                 </span>
//                 <span style={styles.actionText}>
//                   {short.likes?.length || 0}
//                 </span>
//               </button>

//               <button
//                 style={{
//                   ...styles.actionBtn,
//                   color: isDisliked ? "#3ea6ff" : "white"
//                 }}
//                 onClick={() => handleDislike(short._id)}
//               >
//                 <span style={styles.actionIcon}>👎</span>
//                 <span style={styles.actionText}>
//                   {short.dislikes?.length || 0}
//                 </span>
//               </button>

//               <button style={styles.actionBtn}>
//                 <span style={styles.actionIcon}>💬</span>
//                 <span style={styles.actionText}>
//                   {short.comments?.length || 0}
//                 </span>
//               </button>

//               <button style={styles.actionBtn}>
//                 <span style={styles.actionIcon}>📤</span>
//                 <span style={styles.actionText}>Share</span>
//               </button>

//               <button
//                 style={styles.actionBtn}
//                 onClick={() => setMuted(!muted)}
//               >
//                 <span style={styles.actionIcon}>
//                   {muted ? "🔇" : "🔊"}
//                 </span>
//               </button>
//             </div>

//             {/* NAVIGATION HINTS */}
//             {index > 0 && (
//               <div style={styles.navHintTop}>
//                 <span>▲</span>
//               </div>
//             )}
//             {index < shorts.length - 1 && (
//               <div style={styles.navHintBottom}>
//                 <span>▼</span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* PROGRESS INDICATOR */}
//       <div style={styles.progressBar}>
//         {shorts.map((_, idx) => (
//           <div
//             key={idx}
//             style={{
//               ...styles.progressDot,
//               background: idx === currentIndex ? "#ff0000" : "#555"
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// /* 🎨 STYLES - TikTok-Inspired */
// const styles = {
//   container: {
//     position: "relative",
//     width: "100vw",
//     height: "100vh",
//     background: "#000",
//     overflow: "hidden"
//   },

//   header: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 20px",
//     background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
//     zIndex: 100
//   },

//   backBtn: {
//     background: "transparent",
//     border: "none",
//     color: "white",
//     fontSize: 24,
//     cursor: "pointer"
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     color: "white",
//     letterSpacing: "0.5px"
//   },

//   uploadHeaderBtn: {
//     background: "transparent",
//     border: "none",
//     fontSize: 24,
//     cursor: "pointer"
//   },

//   feed: {
//     width: "100%",
//     height: "100%",
//     overflowY: "scroll",
//     scrollSnapType: "y mandatory",
//     scrollBehavior: "smooth"
//   },

//   shortContainer: {
//     position: "relative",
//     width: "100%",
//     height: "100vh",
//     scrollSnapAlign: "start",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#000"
//   },

//   video: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     cursor: "pointer"
//   },

//   overlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: "40%",
//     background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
//     pointerEvents: "none"
//   },

//   info: {
//     position: "absolute",
//     bottom: 80,
//     left: 20,
//     right: 100,
//     color: "white",
//     zIndex: 10
//   },

//   channelInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 12,
//     cursor: "pointer"
//   },

//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 18,
//     fontWeight: 700,
//     color: "white"
//   },

//   channelName: {
//     fontSize: 16,
//     fontWeight: 600,
//     margin: 0
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: 600,
//     margin: "8px 0",
//     lineHeight: 1.4
//   },

//   description: {
//     fontSize: 14,
//     color: "#ddd",
//     margin: "8px 0",
//     lineHeight: 1.5,
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden"
//   },

//   tags: {
//     display: "flex",
//     gap: 8,
//     marginTop: 8,
//     flexWrap: "wrap"
//   },

//   tag: {
//     fontSize: 14,
//     color: "#3ea6ff",
//     fontWeight: 600
//   },

//   actions: {
//     position: "absolute",
//     right: 20,
//     bottom: 80,
//     display: "flex",
//     flexDirection: "column",
//     gap: 20,
//     zIndex: 10
//   },

//   actionBtn: {
//     background: "rgba(255,255,255,0.2)",
//     backdropFilter: "blur(10px)",
//     border: "none",
//     borderRadius: "50%",
//     width: 56,
//     height: 56,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     color: "white"
//   },

//   actionIcon: {
//     fontSize: 24,
//     marginBottom: 2
//   },

//   actionText: {
//     fontSize: 11,
//     fontWeight: 600
//   },

//   navHintTop: {
//     position: "absolute",
//     top: 80,
//     left: "50%",
//     transform: "translateX(-50%)",
//     color: "white",
//     fontSize: 24,
//     opacity: 0.5,
//     animation: "bounce 1.5s infinite"
//   },

//   navHintBottom: {
//     position: "absolute",
//     bottom: 40,
//     left: "50%",
//     transform: "translateX(-50%)",
//     color: "white",
//     fontSize: 24,
//     opacity: 0.5,
//     animation: "bounce 1.5s infinite"
//   },

//   progressBar: {
//     position: "absolute",
//     top: 70,
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     gap: 4,
//     zIndex: 100
//   },

//   progressDot: {
//     width: 4,
//     height: 4,
//     borderRadius: "50%",
//     transition: "background 0.3s"
//   },

//   loading: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     background: "#0f0f0f",
//     color: "white"
//   },

//   spinner: {
//     width: 50,
//     height: 50,
//     border: "4px solid #333",
//     borderTop: "4px solid #ff0000",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//     marginBottom: 20
//   },

//   empty: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     background: "#0f0f0f",
//     color: "white",
//     textAlign: "center"
//   },

//   uploadBtn: {
//     marginTop: 20,
//     padding: "12px 32px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 8,
//     color: "white",
//     fontSize: 16,
//     fontWeight: 600,
//     cursor: "pointer"
//   }
// };

// // Add keyframe animations via style tag
// if (typeof document !== 'undefined') {
//   const style = document.createElement('style');
//   style.textContent = `
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//     @keyframes bounce {
//       0%, 100% { transform: translateX(-50%) translateY(0); }
//       50% { transform: translateX(-50%) translateY(-10px); }
//     }
//   `;
//   document.head.appendChild(style);
// }

// import React, { useState, useEffect, useRef, useContext } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Shorts() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [shorts, setShorts] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [muted, setMuted] = useState(false);
  
//   const videoRefs = useRef([]);
//   const containerRef = useRef(null);

//   // Fetch Shorts
//   useEffect(() => {
//     fetchShorts();
//   }, []);

//   const fetchShorts = async () => {
//     try {
//       const res = await api.get("/api/videos/shorts");
//       setShorts(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch shorts:", err);
//       setLoading(false);
//     }
//   };

//   // Auto-play current video
//   useEffect(() => {
//     if (shorts.length > 0 && videoRefs.current[currentIndex]) {
//       // Pause all videos
//       videoRefs.current.forEach((video, idx) => {
//         if (video && idx !== currentIndex) {
//           video.pause();
//         }
//       });

//       // Play current video
//       const currentVideo = videoRefs.current[currentIndex];
//       if (currentVideo) {
//         currentVideo.currentTime = 0;
//         currentVideo.play().catch(err => console.log("Autoplay prevented:", err));
//       }
//     }
//   }, [currentIndex, shorts]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "ArrowUp" && currentIndex > 0) {
//         setCurrentIndex(prev => prev - 1);
//       } else if (e.key === "ArrowDown" && currentIndex < shorts.length - 1) {
//         setCurrentIndex(prev => prev + 1);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, shorts.length]);

//   // Scroll snap
//   useEffect(() => {
//     if (containerRef.current) {
//       const container = containerRef.current;
//       container.scrollTo({
//         top: currentIndex * window.innerHeight,
//         behavior: "smooth"
//       });
//     }
//   }, [currentIndex]);

//   // Handle Like
//   const handleLike = async (shortId) => {
//     if (!user) {
//       alert("Please login to like");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.post(
//         `/api/videos/like/${shortId}`,
//         {},
//         {  }
//       );

//       setShorts(prev =>
//         prev.map(s => s._id === shortId ? res.data : s)
//       );
//     } catch (err) {
//       console.error("Like failed:", err);
//     }
//   };

//   // Handle Dislike
//   const handleDislike = async (shortId) => {
//     if (!user) {
//       alert("Please login to dislike");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.post(
//         `/api/videos/dislike/${shortId}`,
//         {},
//         {  }
//       );

//       setShorts(prev =>
//         prev.map(s => s._id === shortId ? res.data : s)
//       );
//     } catch (err) {
//       console.error("Dislike failed:", err);
//     }
//   };

//   // Navigate to channel
//   const goToChannel = (uploaderId) => {
//     navigate(`/channel/${uploaderId}`);
//   };

//   if (loading) {
//     return (
//       <div style={styles.loading}>
//         <div style={styles.spinner}></div>
//         <p>Loading Shorts...</p>
//       </div>
//     );
//   }

//   if (shorts.length === 0) {
//     return (
//       <div style={styles.empty}>
//         <h2>📱 No Shorts Yet</h2>
//         <p style={{ color: "#aaa", marginTop: 10 }}>
//           Be the first to upload a Short!
//         </p>
//         <button style={styles.uploadBtn} onClick={() => navigate("/upload")}>
//           Upload Short
//         </button>
//       </div>
//     );
//   }

//   const currentShort = shorts[currentIndex];
//   const isLiked = user && currentShort?.likes?.includes(user.id);
//   const isDisliked = user && currentShort?.dislikes?.includes(user.id);

//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button style={styles.backBtn} onClick={() => navigate("/")}>
//           ←
//         </button>
//         <h2 style={styles.headerTitle}>Shorts</h2>
//         <button style={styles.uploadHeaderBtn} onClick={() => navigate("/upload")}>
//           📷
//         </button>
//       </div>

//       {/* SHORTS FEED */}
//       <div style={styles.feed} ref={containerRef}>
//         {shorts.map((short, index) => (
//           <div key={short._id} style={styles.shortContainer}>
//             {/* VIDEO WRAPPER FOR PROPER SIZING */}
//             <div style={styles.videoWrapper}>
//               <video
//                 ref={el => videoRefs.current[index] = el}
//                 src={`/api/videos/stream/${short.filename}`}
//                 style={styles.video}
//                 loop
//                 muted={muted}
//                 playsInline
//                 onClick={() => {
//                   const video = videoRefs.current[index];
//                   if (video.paused) video.play();
//                   else video.pause();
//                 }}
//               />
//             </div>

//             {/* GRADIENT OVERLAY */}
//             <div style={styles.overlay} />

//             {/* BOTTOM INFO */}
//             <div style={styles.info}>
//               <div style={styles.channelInfo} onClick={() => goToChannel(short.uploadedBy._id)}>
//                 <div style={styles.avatar}>
//                   {short.uploadedBy?.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <p style={styles.channelName}>@{short.uploadedBy?.name}</p>
//               </div>

//               <h3 style={styles.title}>{short.title}</h3>
              
//               {short.description && (
//                 <p style={styles.description}>{short.description}</p>
//               )}

//               <div style={styles.tags}>
//                 {short.tags?.slice(0, 3).map((tag, i) => (
//                   <span key={i} style={styles.tag}>#{tag}</span>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT SIDE ACTIONS */}
//             <div style={styles.actions}>
//               <button
//                 style={{
//                   ...styles.actionBtn,
//                   color: isLiked ? "#ff0000" : "white"
//                 }}
//                 onClick={() => handleLike(short._id)}
//               >
//                 <span style={styles.actionIcon}>
//                   {isLiked ? "❤️" : "🤍"}
//                 </span>
//                 <span style={styles.actionText}>
//                   {short.likes?.length || 0}
//                 </span>
//               </button>

//               <button
//                 style={{
//                   ...styles.actionBtn,
//                   color: isDisliked ? "#3ea6ff" : "white"
//                 }}
//                 onClick={() => handleDislike(short._id)}
//               >
//                 <span style={styles.actionIcon}>👎</span>
//                 <span style={styles.actionText}>
//                   {short.dislikes?.length || 0}
//                 </span>
//               </button>

//               <button style={styles.actionBtn}>
//                 <span style={styles.actionIcon}>💬</span>
//                 <span style={styles.actionText}>
//                   {short.commentsCount || 0}
//                 </span>
//               </button>

//               <button style={styles.actionBtn}>
//                 <span style={styles.actionIcon}>📤</span>
//                 <span style={styles.actionText}>Share</span>
//               </button>

//               <button
//                 style={styles.actionBtn}
//                 onClick={() => setMuted(!muted)}
//               >
//                 <span style={styles.actionIcon}>
//                   {muted ? "🔇" : "🔊"}
//                 </span>
//               </button>
//             </div>

//             {/* NAVIGATION HINTS */}
//             {index > 0 && (
//               <div style={styles.navHintTop}>
//                 <span>▲</span>
//               </div>
//             )}
//             {index < shorts.length - 1 && (
//               <div style={styles.navHintBottom}>
//                 <span>▼</span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* PROGRESS INDICATOR */}
//       <div style={styles.progressBar}>
//         {shorts.map((_, idx) => (
//           <div
//             key={idx}
//             style={{
//               ...styles.progressDot,
//               background: idx === currentIndex ? "#ff0000" : "#555"
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// /* 🎨 STYLES - TikTok-Inspired with Proper Sizing */
// const styles = {
//   container: {
//     position: "relative",
//     width: "100vw",
//     height: "100vh",
//     background: "#000",
//     overflow: "hidden"
//   },

//   header: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 20px",
//     background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
//     zIndex: 100
//   },

//   backBtn: {
//     background: "transparent",
//     border: "none",
//     color: "white",
//     fontSize: 24,
//     cursor: "pointer",
//     padding: 8
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     color: "white",
//     letterSpacing: "0.5px",
//     margin: 0
//   },

//   uploadHeaderBtn: {
//     background: "transparent",
//     border: "none",
//     fontSize: 24,
//     cursor: "pointer",
//     padding: 8
//   },

//   feed: {
//     width: "100%",
//     height: "100%",
//     overflowY: "scroll",
//     scrollSnapType: "y mandatory",
//     scrollBehavior: "smooth",
//     scrollbarWidth: "none", // Firefox
//     msOverflowStyle: "none" // IE/Edge
//   },

//   shortContainer: {
//     position: "relative",
//     width: "100%",
//     height: "100vh",
//     scrollSnapAlign: "start",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#000"
//   },

//   // 🎯 NEW: Video wrapper for proper aspect ratio
//   videoWrapper: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#000"
//   },

//   video: {
//     maxWidth: "100%",
//     maxHeight: "100%",
//     width: "auto",
//     height: "auto",
//     objectFit: "contain", // Changed from "cover" to "contain"
//     cursor: "pointer"
//   },

//   overlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: "50%",
//     background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 100%)",
//     pointerEvents: "none",
//     zIndex: 1
//   },

//   info: {
//     position: "absolute",
//     bottom: 100,
//     left: 20,
//     right: 100,
//     color: "white",
//     zIndex: 10,
//     maxWidth: "calc(100% - 120px)"
//   },

//   channelInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 12,
//     cursor: "pointer"
//   },

//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 18,
//     fontWeight: 700,
//     color: "white",
//     flexShrink: 0
//   },

//   channelName: {
//     fontSize: 15,
//     fontWeight: 600,
//     margin: 0,
//     color: "white"
//   },

//   title: {
//     fontSize: 16,
//     fontWeight: 600,
//     margin: "8px 0",
//     lineHeight: 1.4,
//     color: "white"
//   },

//   description: {
//     fontSize: 14,
//     color: "#ddd",
//     margin: "8px 0",
//     lineHeight: 1.5,
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden",
//     textOverflow: "ellipsis"
//   },

//   tags: {
//     display: "flex",
//     gap: 8,
//     marginTop: 8,
//     flexWrap: "wrap"
//   },

//   tag: {
//     fontSize: 13,
//     color: "#3ea6ff",
//     fontWeight: 600
//   },

//   actions: {
//     position: "absolute",
//     right: 12,
//     bottom: 100,
//     display: "flex",
//     flexDirection: "column",
//     gap: 16,
//     zIndex: 10
//   },

//   actionBtn: {
//     background: "rgba(255,255,255,0.15)",
//     backdropFilter: "blur(10px)",
//     border: "none",
//     borderRadius: "50%",
//     width: 52,
//     height: 52,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     color: "white",
//     padding: 0
//   },

//   actionIcon: {
//     fontSize: 22,
//     marginBottom: 2
//   },

//   actionText: {
//     fontSize: 10,
//     fontWeight: 600
//   },

//   navHintTop: {
//     position: "absolute",
//     top: 80,
//     left: "50%",
//     transform: "translateX(-50%)",
//     color: "white",
//     fontSize: 20,
//     opacity: 0.5,
//     animation: "bounce 1.5s infinite",
//     zIndex: 5,
//     pointerEvents: "none"
//   },

//   navHintBottom: {
//     position: "absolute",
//     bottom: 50,
//     left: "50%",
//     transform: "translateX(-50%)",
//     color: "white",
//     fontSize: 20,
//     opacity: 0.5,
//     animation: "bounce 1.5s infinite",
//     zIndex: 5,
//     pointerEvents: "none"
//   },

//   progressBar: {
//     position: "absolute",
//     top: 70,
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     gap: 4,
//     zIndex: 100,
//     pointerEvents: "none"
//   },

//   progressDot: {
//     width: 4,
//     height: 4,
//     borderRadius: "50%",
//     transition: "background 0.3s"
//   },

//   loading: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     background: "#0f0f0f",
//     color: "white"
//   },

//   spinner: {
//     width: 50,
//     height: 50,
//     border: "4px solid #333",
//     borderTop: "4px solid #ff0000",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//     marginBottom: 20
//   },

//   empty: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     background: "#0f0f0f",
//     color: "white",
//     textAlign: "center"
//   },

//   uploadBtn: {
//     marginTop: 20,
//     padding: "12px 32px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 8,
//     color: "white",
//     fontSize: 16,
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "all 0.2s"
//   }
// };

// // Add keyframe animations and hide scrollbar via style tag
// if (typeof document !== 'undefined') {
//   const style = document.createElement('style');
//   style.textContent = `
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//     @keyframes bounce {
//       0%, 100% { transform: translateX(-50%) translateY(0); }
//       50% { transform: translateX(-50%) translateY(-10px); }
//     }
//     /* Hide scrollbar for Chrome, Safari and Opera */
//     .shorts-feed::-webkit-scrollbar {
//       display: none;
//     }
//   `;
//   document.head.appendChild(style);
// }



import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Shorts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Fetch Shorts
  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      const res = await api.get("/api/videos/shorts");
      setShorts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch shorts:", err);
      setLoading(false);
    }
  };

  // Auto-play current video and pause others
  useEffect(() => {
    if (shorts.length > 0) {
      videoRefs.current.forEach((video, idx) => {
        if (video) {
          if (idx === currentIndex) {
            // Play current video
            video.currentTime = 0;
            video.volume = volume;
            video.muted = muted;
            video.play()
              .then(() => setIsPlaying(true))
              .catch(err => {
                console.log("Autoplay prevented:", err);
                setIsPlaying(false);
              });
          } else {
            // Pause all other videos
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    }
  }, [currentIndex, shorts]);

  // Handle volume and mute changes without restarting video
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.volume = volume;
      currentVideo.muted = muted;
    }
  }, [volume, muted, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === "ArrowDown" && currentIndex < shorts.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, shorts.length]);

  // Scroll detection - update currentIndex based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const newIndex = Math.round(scrollTop / window.innerHeight);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < shorts.length) {
          setCurrentIndex(newIndex);
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, shorts.length]);

  // Scroll snap
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        top: currentIndex * window.innerHeight,
        behavior: "smooth"
      });
    }
  }, [currentIndex]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > minSwipeDistance;
    const isSwipeDown = distance < -minSwipeDistance;

    if (isSwipeUp && currentIndex < shorts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play();
        setIsPlaying(true);
      } else {
        currentVideo.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle Like
  const handleLike = async (shortId) => {
    if (!user) {
      alert("Please login to like");
      return;
    }

    try {
      const res = await api.post(
        `/api/videos/like/${shortId}`,
        {},
        {  }
      );

      setShorts(prev =>
        prev.map(s => s._id === shortId ? res.data : s)
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Handle Dislike
  const handleDislike = async (shortId) => {
    if (!user) {
      alert("Please login to dislike");
      return;
    }

    try {
      const res = await api.post(
        `/api/videos/dislike/${shortId}`,
        {},
        {  }
      );

      setShorts(prev =>
        prev.map(s => s._id === shortId ? res.data : s)
      );
    } catch (err) {
      console.error("Dislike failed:", err);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.volume = newVolume;
    }
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
    if (!muted) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  // Share functionality
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/shorts/${shorts[currentIndex]._id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  // Navigate to channel
  const goToChannel = (uploaderId) => {
    navigate(`/channel/${uploaderId}`);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Shorts...</p>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📱</div>
        <h2 style={styles.emptyTitle}>No Shorts Yet</h2>
        <p style={styles.emptyText}>
          Be the first to upload a Short!
        </p>
        <button style={styles.uploadBtn} onClick={() => navigate("/upload")}>
          📤 Upload Short
        </button>
      </div>
    );
  }

  const currentShort = shorts[currentIndex];
  const isLiked = user && currentShort?.likes?.includes(user.id);
  const isDisliked = user && currentShort?.dislikes?.includes(user.id);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 style={styles.headerTitle}>Shorts</h2>
        <button style={styles.searchBtn} onClick={() => navigate("/search")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button style={styles.uploadHeaderBtn} onClick={() => navigate("/upload")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
        </button>
      </div>

      {/* SHORTS FEED */}
      <div 
        style={styles.feed} 
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {shorts.map((short, index) => (
          <div key={short._id} style={styles.shortContainer}>
            {/* VIDEO WRAPPER */}
            <div style={styles.videoWrapper}>
              <video
                ref={el => videoRefs.current[index] = el}
                src={`/api/videos/stream/${short.filename}`}
                style={styles.video}
                loop
                muted={muted}
                playsInline
                onClick={togglePlayPause}
                onPause={() => {
                  if (index === currentIndex) {
                    setIsPlaying(false);
                  }
                }}
                onPlay={() => {
                  if (index === currentIndex) {
                    setIsPlaying(true);
                  }
                }}
              />
              
              {/* Play/Pause Overlay */}
              {!isPlaying && index === currentIndex && (
                <div style={styles.playOverlay}>
                  <div style={styles.playButton}>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="white">
                      <path d="M20 15 L45 30 L20 45 Z"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* GRADIENT OVERLAYS */}
            <div style={styles.topGradient} />
            <div style={styles.bottomGradient} />

            {/* BOTTOM INFO */}
            <div style={styles.info}>
              <div style={styles.channelInfo} onClick={() => goToChannel(short.uploadedBy._id)}>
                <div style={styles.avatar}>
                  {short.uploadedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <p style={styles.channelName}>@{short.uploadedBy?.name}</p>
                <button style={styles.subscribeBtn}>Subscribe</button>
              </div>

              <h3 style={styles.title}>{short.title}</h3>
              
              {short.description && (
                <p style={styles.description}>{short.description}</p>
              )}

              {short.tags && short.tags.length > 0 && (
                <div style={styles.tags}>
                  {short.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} style={styles.tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div style={styles.actions}>
              {/* Like Button */}
              <div style={styles.actionItem}>
                <button
                  style={{
                    ...styles.actionBtn,
                    background: isLiked ? "rgba(255, 0, 0, 0.2)" : "rgba(255,255,255,0.1)"
                  }}
                  onClick={() => handleLike(short._id)}
                >
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill={isLiked ? "#ff0000" : "none"} 
                    stroke={isLiked ? "#ff0000" : "white"} 
                    strokeWidth="2"
                  >
                    <path d="M7 22V11M2 13v6a2 2 0 0 0 2 2h1M16.5 8.5v-1a4 4 0 0 0-4-4 2 2 0 0 0-2 2v1m0 0H6m4.5 0H16a2 2 0 0 1 2 2v3"/>
                    <path d="M16 11v8a2 2 0 0 1-2 2H7"/>
                  </svg>
                </button>
                <span style={styles.actionCount}>
                  {short.likes?.length || 0}
                </span>
              </div>

              {/* Dislike Button */}
              <div style={styles.actionItem}>
                <button
                  style={{
                    ...styles.actionBtn,
                    background: isDisliked ? "rgba(62, 166, 255, 0.2)" : "rgba(255,255,255,0.1)"
                  }}
                  onClick={() => handleDislike(short._id)}
                >
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill={isDisliked ? "#3ea6ff" : "none"} 
                    stroke={isDisliked ? "#3ea6ff" : "white"} 
                    strokeWidth="2"
                  >
                    <path d="M17 2v11M22 11V5a2 2 0 0 0-2-2h-1M7.5 15.5v1a4 4 0 0 0 4 4 2 2 0 0 0 2-2v-1m0 0H18m-4.5 0H8a2 2 0 0 1-2-2v-3"/>
                    <path d="M8 13V5a2 2 0 0 1 2-2h7"/>
                  </svg>
                </button>
                <span style={styles.actionCount}>
                  {short.dislikes?.length || 0}
                </span>
              </div>

              {/* Comments Button */}
              <div style={styles.actionItem}>
                <button style={styles.actionBtn}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <span style={styles.actionCount}>
                  {short.commentsCount || 0}
                </span>
              </div>

              {/* Share Button */}
              <div style={styles.actionItem}>
                <button 
                  style={{
                    ...styles.actionBtn,
                    background: showShareMenu ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"
                  }}
                  onClick={handleShare}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </button>
                <span style={styles.actionCount}>Share</span>
              </div>

              {/* Sound Button */}
              <div style={styles.actionItem}>
                <button
                  style={styles.actionBtn}
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  {muted || volume === 0 ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <line x1="23" y1="9" x2="17" y2="15"/>
                      <line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                  )}
                </button>
                
                {/* Volume Slider */}
                {showVolumeSlider && (
                  <div 
                    style={styles.volumeSlider}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      style={styles.volumeInput}
                      orient="vertical"
                    />
                  </div>
                )}
              </div>

              {/* More Options */}
              <div style={styles.actionItem}>
                <button style={styles.actionBtn}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white">
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Share Menu */}
            {showShareMenu && index === currentIndex && (
              <div style={styles.shareMenu}>
                <button style={styles.shareOption} onClick={copyLink}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  <span>Copy Link</span>
                </button>
                <button style={styles.shareOption}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
                <button style={styles.shareOption}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
                <button style={styles.shareOption}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                  <span>Twitter</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PROGRESS INDICATOR */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          {shorts.map((_, idx) => (
            <div
              key={idx}
              style={{
                ...styles.progressDot,
                width: idx === currentIndex ? 24 : 6,
                background: idx === currentIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
                opacity: idx === currentIndex ? 1 : 0.6
              }}
            />
          ))}
        </div>
        <div style={styles.progressText}>
          {currentIndex + 1} / {shorts.length}
        </div>
      </div>
    </div>
  );
}

/* 🎨 ENHANCED STYLES - YouTube Shorts Style */
const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    background: "#000",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
    zIndex: 100,
    backdropFilter: "blur(10px)"
  },

  backBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background 0.2s",
    width: 40,
    height: 40
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "white",
    letterSpacing: "0.5px",
    margin: 0,
    flex: 1,
    textAlign: "center"
  },

  searchBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background 0.2s",
    width: 40,
    height: 40
  },

  uploadHeaderBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background 0.2s",
    width: 40,
    height: 40
  },

  feed: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    msOverflowStyle: "none"
  },

  shortContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    scrollSnapAlign: "start",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000"
  },

  videoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000"
  },

  video: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "100%",
    objectFit: "contain",
    cursor: "pointer"
  },

  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.3)",
    zIndex: 5,
    pointerEvents: "none"
  },

  playButton: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulse 1.5s infinite"
  },

  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1
  },

  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 30%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1
  },

  info: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 100,
    color: "white",
    zIndex: 10,
    maxWidth: "calc(100% - 116px)"
  },

  channelInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    cursor: "pointer"
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "white",
    flexShrink: 0,
    border: "2px solid rgba(255,255,255,0.3)"
  },

  channelName: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
    color: "white",
    flex: 1
  },

  subscribeBtn: {
    background: "#ff0000",
    border: "none",
    borderRadius: 18,
    padding: "6px 16px",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  title: {
    fontSize: 15,
    fontWeight: 500,
    margin: "8px 0",
    lineHeight: 1.4,
    color: "white"
  },

  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    margin: "8px 0",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  tags: {
    display: "flex",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap"
  },

  tag: {
    fontSize: 13,
    color: "#3ea6ff",
    fontWeight: 600,
    cursor: "pointer"
  },

  actions: {
    position: "absolute",
    right: 12,
    bottom: 80,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    zIndex: 10
  },

  actionItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4
  },

  actionBtn: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "none",
    borderRadius: "50%",
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "white",
    padding: 0
  },

  actionCount: {
    fontSize: 11,
    fontWeight: 600,
    color: "white",
    textAlign: "center",
    minWidth: 48
  },

  volumeSlider: {
    position: "absolute",
    right: 60,
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: 20,
    padding: "12px 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  volumeInput: {
    width: 100,
    height: 4,
    cursor: "pointer",
    appearance: "none",
    background: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    outline: "none"
  },

  shareMenu: {
    position: "absolute",
    bottom: 280,
    right: 12,
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(20px)",
    borderRadius: 12,
    padding: 12,
    minWidth: 160,
    zIndex: 20,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
  },

  shareOption: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "white",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 8,
    transition: "background 0.2s"
  },

  progressContainer: {
    position: "absolute",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    zIndex: 100,
    pointerEvents: "none"
  },

  progressBar: {
    display: "flex",
    gap: 6,
    alignItems: "center",
    justifyContent: "center"
  },

  progressDot: {
    height: 6,
    borderRadius: 3,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  },

  progressText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: 600,
    background: "rgba(0,0,0,0.5)",
    padding: "4px 12px",
    borderRadius: 12,
    backdropFilter: "blur(10px)"
  },

  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#000",
    color: "white"
  },

  spinner: {
    width: 48,
    height: 48,
    border: "4px solid rgba(255,255,255,0.1)",
    borderTop: "4px solid #ff0000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 20
  },

  loadingText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: 500
  },

  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#000",
    color: "white",
    textAlign: "center",
    padding: "0 32px"
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: 600,
    margin: "0 0 12px 0"
  },

  emptyText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    margin: 0
  },

  uploadBtn: {
    marginTop: 24,
    padding: "12px 32px",
    background: "#ff0000",
    border: "none",
    borderRadius: 24,
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    gap: 8
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1);
        opacity: 0.9;
      }
      50% { 
        transform: scale(1.05);
        opacity: 1;
      }
    }

    /* Hide scrollbar */
    *::-webkit-scrollbar {
      display: none;
    }

    /* Button hover effects */
    button:hover {
      transform: scale(1.05);
    }

    button:active {
      transform: scale(0.95);
    }

    /* Volume slider styling */
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    input[type="range"]::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    /* Share menu hover */
    .share-option:hover {
      background: rgba(255,255,255,0.1) !important;
    }
  `;
  document.head.appendChild(style);
}