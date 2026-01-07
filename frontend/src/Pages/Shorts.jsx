



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
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [showVolumeSlider, setShowVolumeSlider] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [showShareMenu, setShowShareMenu] = useState(false);
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);

//   const videoRefs = useRef([]);
//   const containerRef = useRef(null);

//   // Minimum swipe distance
//   const minSwipeDistance = 50;

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

//   // Auto-play current video and pause others
//   useEffect(() => {
//     if (shorts.length > 0) {
//       videoRefs.current.forEach((video, idx) => {
//         if (video) {
//           if (idx === currentIndex) {
//             // Play current video
//             video.currentTime = 0;
//             video.volume = volume;
//             video.muted = muted;
//             video.play()
//               .then(() => setIsPlaying(true))
//               .catch(err => {
//                 console.log("Autoplay prevented:", err);
//                 setIsPlaying(false);
//               });
//           } else {
//             // Pause all other videos
//             video.pause();
//             video.currentTime = 0;
//           }
//         }
//       });
//     }
//   }, [currentIndex, shorts]);

//   // Handle volume and mute changes without restarting video
//   useEffect(() => {
//     const currentVideo = videoRefs.current[currentIndex];
//     if (currentVideo) {
//       currentVideo.volume = volume;
//       currentVideo.muted = muted;
//     }
//   }, [volume, muted, currentIndex]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "ArrowUp" && currentIndex > 0) {
//         setCurrentIndex(prev => prev - 1);
//       } else if (e.key === "ArrowDown" && currentIndex < shorts.length - 1) {
//         setCurrentIndex(prev => prev + 1);
//       } else if (e.key === " ") {
//         e.preventDefault();
//         togglePlayPause();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, shorts.length]);

//   // Scroll detection - update currentIndex based on scroll position
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     let scrollTimeout;
//     const handleScroll = () => {
//       clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(() => {
//         const scrollTop = container.scrollTop;
//         const newIndex = Math.round(scrollTop / window.innerHeight);
//         if (newIndex !== currentIndex && newIndex >= 0 && newIndex < shorts.length) {
//           setCurrentIndex(newIndex);
//         }
//       }, 100);
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => {
//       container.removeEventListener('scroll', handleScroll);
//       clearTimeout(scrollTimeout);
//     };
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

//   // Touch handlers for swipe
//   const onTouchStart = (e) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientY);
//   };

//   const onTouchMove = (e) => {
//     setTouchEnd(e.targetTouches[0].clientY);
//   };

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;

//     const distance = touchStart - touchEnd;
//     const isSwipeUp = distance > minSwipeDistance;
//     const isSwipeDown = distance < -minSwipeDistance;

//     if (isSwipeUp && currentIndex < shorts.length - 1) {
//       setCurrentIndex(prev => prev + 1);
//     }
//     if (isSwipeDown && currentIndex > 0) {
//       setCurrentIndex(prev => prev - 1);
//     }
//   };

//   // Toggle play/pause
//   const togglePlayPause = () => {
//     const currentVideo = videoRefs.current[currentIndex];
//     if (currentVideo) {
//       if (currentVideo.paused) {
//         currentVideo.play();
//         setIsPlaying(true);
//       } else {
//         currentVideo.pause();
//         setIsPlaying(false);
//       }
//     }
//   };

//   // Handle Like
//   const handleLike = async (shortId) => {
//     if (!user) {
//       alert("Please login to like");
//       return;
//     }

//     try {
//       const res = await api.post(
//         `/api/videos/like/${shortId}`,
//         {},
//         {}
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
//       const res = await api.post(
//         `/api/videos/dislike/${shortId}`,
//         {},
//         {}
//       );

//       setShorts(prev =>
//         prev.map(s => s._id === shortId ? res.data : s)
//       );
//     } catch (err) {
//       console.error("Dislike failed:", err);
//     }
//   };

//   // Handle volume change
//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     setVolume(newVolume);
//     const currentVideo = videoRefs.current[currentIndex];
//     if (currentVideo) {
//       currentVideo.volume = newVolume;
//     }
//     if (newVolume === 0) {
//       setMuted(true);
//     } else if (muted) {
//       setMuted(false);
//     }
//   };

//   // Toggle mute
//   const toggleMute = () => {
//     setMuted(!muted);
//     if (!muted) {
//       setVolume(0);
//     } else {
//       setVolume(1);
//     }
//   };

//   // Share functionality
//   const handleShare = () => {
//     setShowShareMenu(!showShareMenu);
//   };

//   const copyLink = () => {
//     const link = `${window.location.origin}/shorts/${shorts[currentIndex]._id}`;
//     navigator.clipboard.writeText(link);
//     alert("Link copied to clipboard!");
//     setShowShareMenu(false);
//   };

//   // Navigate to channel
//   const goToChannel = (uploaderId) => {
//     navigate(`/channel/${uploaderId}`);
//   };

//   if (loading) {
//     return (
//       <div style={styles.loading}>
//         <div style={styles.spinner}></div>
//         <p style={styles.loadingText}>Loading Shorts...</p>
//       </div>
//     );
//   }

//   if (shorts.length === 0) {
//     return (
//       <div style={styles.empty}>
//         <div style={styles.emptyIcon}>📱</div>
//         <h2 style={styles.emptyTitle}>No Shorts Yet</h2>
//         <p style={styles.emptyText}>
//           Be the first to upload a Short!
//         </p>
//         <button style={styles.uploadBtn} onClick={() => navigate("/upload")}>
//           📤 Upload Short
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
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M19 12H5M12 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <h2 style={styles.headerTitle}>Shorts</h2>
//         <button style={styles.searchBtn} onClick={() => navigate("/search")}>
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.35-4.35" />
//           </svg>
//         </button>
//         <button style={styles.uploadHeaderBtn} onClick={() => navigate("/upload")}>
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <rect x="3" y="3" width="18" height="18" rx="2" />
//             <circle cx="8.5" cy="8.5" r="1.5" />
//             <path d="m21 15-5-5L5 21" />
//           </svg>
//         </button>
//       </div>

//       {/* SHORTS FEED */}
//       <div
//         style={styles.feed}
//         ref={containerRef}
//         onTouchStart={onTouchStart}
//         onTouchMove={onTouchMove}
//         onTouchEnd={onTouchEnd}
//       >
//         {shorts.map((short, index) => (
//           <div key={short._id} style={styles.shortContainer}>
//             {/* VIDEO WRAPPER */}
//             <div style={styles.videoWrapper}>
//               <video
//                 ref={el => videoRefs.current[index] = el}
//                 src={`/api/videos/stream/${short.filename}`}
//                 style={styles.video}
//                 loop
//                 muted={muted}
//                 playsInline
//                 onClick={togglePlayPause}
//                 onPause={() => {
//                   if (index === currentIndex) {
//                     setIsPlaying(false);
//                   }
//                 }}
//                 onPlay={() => {
//                   if (index === currentIndex) {
//                     setIsPlaying(true);
//                   }
//                 }}
//               />

//               {/* Play/Pause Overlay */}
//               {!isPlaying && index === currentIndex && (
//                 <div style={styles.playOverlay}>
//                   <div style={styles.playButton}>
//                     <svg width="60" height="60" viewBox="0 0 60 60" fill="white">
//                       <path d="M20 15 L45 30 L20 45 Z" />
//                     </svg>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* GRADIENT OVERLAYS */}
//             <div style={styles.topGradient} />
//             <div style={styles.bottomGradient} />

//             {/* BOTTOM INFO */}
//             <div style={styles.info}>
//               <div style={styles.channelInfo} onClick={() => goToChannel(short.uploadedBy._id)}>
//                 <div style={styles.avatar}>
//                   {short.uploadedBy?.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <p style={styles.channelName}>@{short.uploadedBy?.name}</p>
//                 <button style={styles.subscribeBtn}>Subscribe</button>
//               </div>

//               <h3 style={styles.title}>{short.title}</h3>

//               {short.description && (
//                 <p style={styles.description}>{short.description}</p>
//               )}

//               {short.tags && short.tags.length > 0 && (
//                 <div style={styles.tags}>
//                   {short.tags.slice(0, 3).map((tag, i) => (
//                     <span key={i} style={styles.tag}>#{tag}</span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* RIGHT SIDE ACTIONS */}
//             <div style={styles.actions}>
//               {/* Like Button */}
//               <div style={styles.actionItem}>
//                 <button
//                   style={{
//                     ...styles.actionBtn,
//                     background: isLiked ? "rgba(255, 0, 0, 0.2)" : "rgba(255,255,255,0.1)"
//                   }}
//                   onClick={() => handleLike(short._id)}
//                 >
//                   <svg
//                     width="28"
//                     height="28"
//                     viewBox="0 0 24 24"
//                     fill={isLiked ? "#ff0000" : "none"}
//                     stroke={isLiked ? "#ff0000" : "white"}
//                     strokeWidth="2"
//                   >
//                     <path d="M7 22V11M2 13v6a2 2 0 0 0 2 2h1M16.5 8.5v-1a4 4 0 0 0-4-4 2 2 0 0 0-2 2v1m0 0H6m4.5 0H16a2 2 0 0 1 2 2v3" />
//                     <path d="M16 11v8a2 2 0 0 1-2 2H7" />
//                   </svg>
//                 </button>
//                 <span style={styles.actionCount}>
//                   {short.likes?.length || 0}
//                 </span>
//               </div>

//               {/* Dislike Button */}
//               <div style={styles.actionItem}>
//                 <button
//                   style={{
//                     ...styles.actionBtn,
//                     background: isDisliked ? "rgba(62, 166, 255, 0.2)" : "rgba(255,255,255,0.1)"
//                   }}
//                   onClick={() => handleDislike(short._id)}
//                 >
//                   <svg
//                     width="28"
//                     height="28"
//                     viewBox="0 0 24 24"
//                     fill={isDisliked ? "#3ea6ff" : "none"}
//                     stroke={isDisliked ? "#3ea6ff" : "white"}
//                     strokeWidth="2"
//                   >
//                     <path d="M17 2v11M22 11V5a2 2 0 0 0-2-2h-1M7.5 15.5v1a4 4 0 0 0 4 4 2 2 0 0 0 2-2v-1m0 0H18m-4.5 0H8a2 2 0 0 1-2-2v-3" />
//                     <path d="M8 13V5a2 2 0 0 1 2-2h7" />
//                   </svg>
//                 </button>
//                 <span style={styles.actionCount}>
//                   {short.dislikes?.length || 0}
//                 </span>
//               </div>

//               {/* Comments Button */}
//               <div style={styles.actionItem}>
//                 <button style={styles.actionBtn}>
//                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
//                     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                   </svg>
//                 </button>
//                 <span style={styles.actionCount}>
//                   {short.commentsCount || 0}
//                 </span>
//               </div>

//               {/* Share Button */}
//               <div style={styles.actionItem}>
//                 <button
//                   style={{
//                     ...styles.actionBtn,
//                     background: showShareMenu ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"
//                   }}
//                   onClick={handleShare}
//                 >
//                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
//                     <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
//                     <polyline points="16 6 12 2 8 6" />
//                     <line x1="12" y1="2" x2="12" y2="15" />
//                   </svg>
//                 </button>
//                 <span style={styles.actionCount}>Share</span>
//               </div>

//               {/* Sound Button */}
//               <div style={styles.actionItem}>
//                 <button
//                   style={styles.actionBtn}
//                   onClick={toggleMute}
//                   onMouseEnter={() => setShowVolumeSlider(true)}
//                   onMouseLeave={() => setShowVolumeSlider(false)}
//                 >
//                   {muted || volume === 0 ? (
//                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
//                       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//                       <line x1="23" y1="9" x2="17" y2="15" />
//                       <line x1="17" y1="9" x2="23" y2="15" />
//                     </svg>
//                   ) : (
//                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
//                       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//                       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//                       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//                     </svg>
//                   )}
//                 </button>

//                 {/* Volume Slider */}
//                 {showVolumeSlider && (
//                   <div
//                     style={styles.volumeSlider}
//                     onMouseEnter={() => setShowVolumeSlider(true)}
//                     onMouseLeave={() => setShowVolumeSlider(false)}
//                   >
//                     <input
//                       type="range"
//                       min="0"
//                       max="1"
//                       step="0.1"
//                       value={volume}
//                       onChange={handleVolumeChange}
//                       style={styles.volumeInput}
//                       orient="vertical"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* More Options */}
//               <div style={styles.actionItem}>
//                 <button style={styles.actionBtn}>
//                   <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white">
//                     <circle cx="12" cy="5" r="1" />
//                     <circle cx="12" cy="12" r="1" />
//                     <circle cx="12" cy="19" r="1" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Share Menu */}
//             {showShareMenu && index === currentIndex && (
//               <div style={styles.shareMenu}>
//                 <button style={styles.shareOption} onClick={copyLink}>
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
//                     <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
//                   </svg>
//                   <span>Copy Link</span>
//                 </button>
//                 <button style={styles.shareOption}>
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <rect x="2" y="2" width="20" height="20" rx="5" />
//                     <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//                     <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//                   </svg>
//                   <span>WhatsApp</span>
//                 </button>
//                 <button style={styles.shareOption}>
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//                   </svg>
//                   <span>Facebook</span>
//                 </button>
//                 <button style={styles.shareOption}>
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
//                   </svg>
//                   <span>Twitter</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* PROGRESS INDICATOR */}
//       <div style={styles.progressContainer}>
//         <div style={styles.progressBar}>
//           {shorts.map((_, idx) => (
//             <div
//               key={idx}
//               style={{
//                 ...styles.progressDot,
//                 width: idx === currentIndex ? 24 : 6,
//                 background: idx === currentIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
//                 opacity: idx === currentIndex ? 1 : 0.6
//               }}
//             />
//           ))}
//         </div>
//         <div style={styles.progressText}>
//           {currentIndex + 1} / {shorts.length}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* 🎨 ENHANCED STYLES - YouTube Shorts Style */
// const styles = {
//   container: {
//     position: "relative",
//     width: "100vw",
//     height: "100vh",
//     background: "#000",
//     overflow: "hidden",
//     fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
//   },

//   header: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 56,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 16px",
//     background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
//     zIndex: 100,
//     backdropFilter: "blur(10px)"
//   },

//   backBtn: {
//     background: "transparent",
//     border: "none",
//     color: "white",
//     cursor: "pointer",
//     padding: "8px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "50%",
//     transition: "background 0.2s",
//     width: 40,
//     height: 40
//   },

//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 600,
//     color: "white",
//     letterSpacing: "0.5px",
//     margin: 0,
//     flex: 1,
//     textAlign: "center"
//   },

//   searchBtn: {
//     background: "transparent",
//     border: "none",
//     color: "white",
//     cursor: "pointer",
//     padding: "8px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "50%",
//     transition: "background 0.2s",
//     width: 40,
//     height: 40
//   },

//   uploadHeaderBtn: {
//     background: "transparent",
//     border: "none",
//     color: "white",
//     cursor: "pointer",
//     padding: "8px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "50%",
//     transition: "background 0.2s",
//     width: 40,
//     height: 40
//   },

//   feed: {
//     width: "100%",
//     height: "100%",
//     overflowY: "scroll",
//     scrollSnapType: "y mandatory",
//     scrollBehavior: "smooth",
//     scrollbarWidth: "none",
//     msOverflowStyle: "none"
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
//     height: "100%",
//     objectFit: "contain",
//     cursor: "pointer"
//   },

//   playOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "rgba(0,0,0,0.3)",
//     zIndex: 5,
//     pointerEvents: "none"
//   },

//   playButton: {
//     width: 80,
//     height: 80,
//     borderRadius: "50%",
//     background: "rgba(255,255,255,0.9)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     animation: "pulse 1.5s infinite"
//   },

//   topGradient: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: "30%",
//     background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
//     pointerEvents: "none",
//     zIndex: 1
//   },

//   bottomGradient: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: "50%",
//     background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 30%, transparent 100%)",
//     pointerEvents: "none",
//     zIndex: 1
//   },

//   info: {
//     position: "absolute",
//     bottom: 80,
//     left: 16,
//     right: 100,
//     color: "white",
//     zIndex: 10,
//     maxWidth: "calc(100% - 116px)"
//   },

//   channelInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     marginBottom: 12,
//     cursor: "pointer"
//   },

//   avatar: {
//     width: 38,
//     height: 38,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 16,
//     fontWeight: 700,
//     color: "white",
//     flexShrink: 0,
//     border: "2px solid rgba(255,255,255,0.3)"
//   },

//   channelName: {
//     fontSize: 14,
//     fontWeight: 600,
//     margin: 0,
//     color: "white",
//     flex: 1
//   },

//   subscribeBtn: {
//     background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
//     border: "none",
//     borderRadius: 20,
//     padding: "8px 20px",
//     color: "white",
//     fontSize: 13,
//     fontWeight: 700,
//     cursor: "pointer",
//     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//     textTransform: "uppercase",
//     letterSpacing: "1px",
//     boxShadow: "0 4px 12px rgba(255,0,0,0.4), 0 0 20px rgba(255,0,0,0.2)",
//     position: "relative",
//     overflow: "hidden"
//   },

//   title: {
//     fontSize: 16,
//     fontWeight: 600,
//     margin: "10px 0",
//     lineHeight: 1.5,
//     color: "white",
//     textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.4)",
//     letterSpacing: "0.3px"
//   },

//   description: {
//     fontSize: 14,
//     color: "rgba(255,255,255,0.9)",
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
//     fontWeight: 600,
//     cursor: "pointer"
//   },

//   actions: {
//     position: "absolute",
//     right: 12,
//     bottom: 80,
//     display: "flex",
//     flexDirection: "column",
//     gap: 20,
//     zIndex: 10
//   },

//   actionItem: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 4
//   },

//   actionBtn: {
//     background: "rgba(255,255,255,0.1)",
//     backdropFilter: "blur(15px)",
//     webkitBackdropFilter: "blur(15px)",
//     border: "1px solid rgba(255,255,255,0.15)",
//     borderRadius: "50%",
//     width: 52,
//     height: 52,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//     color: "white",
//     padding: 0,
//     boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
//     position: "relative",
//     overflow: "hidden"
//   },

//   actionCount: {
//     fontSize: 11,
//     fontWeight: 600,
//     color: "white",
//     textAlign: "center",
//     minWidth: 48
//   },

//   volumeSlider: {
//     position: "absolute",
//     right: 60,
//     top: "50%",
//     transform: "translateY(-50%)",
//     background: "rgba(0,0,0,0.8)",
//     backdropFilter: "blur(10px)",
//     borderRadius: 20,
//     padding: "12px 8px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   volumeInput: {
//     width: 100,
//     height: 4,
//     cursor: "pointer",
//     appearance: "none",
//     background: "rgba(255,255,255,0.3)",
//     borderRadius: 2,
//     outline: "none"
//   },

//   shareMenu: {
//     position: "absolute",
//     bottom: 280,
//     right: 12,
//     background: "rgba(0,0,0,0.9)",
//     backdropFilter: "blur(20px)",
//     borderRadius: 12,
//     padding: 12,
//     minWidth: 160,
//     zIndex: 20,
//     boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
//   },

//   shareOption: {
//     width: "100%",
//     background: "transparent",
//     border: "none",
//     color: "white",
//     padding: "12px 16px",
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: 500,
//     borderRadius: 8,
//     transition: "background 0.2s"
//   },

//   progressContainer: {
//     position: "absolute",
//     bottom: 16,
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 8,
//     zIndex: 100,
//     pointerEvents: "none"
//   },

//   progressBar: {
//     display: "flex",
//     gap: 6,
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   progressDot: {
//     height: 3,
//     borderRadius: 2,
//     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//     boxShadow: "0 0 8px rgba(255,255,255,0.3)"
//   },

//   progressText: {
//     fontSize: 11,
//     color: "rgba(255,255,255,0.7)",
//     fontWeight: 600,
//     background: "rgba(0,0,0,0.5)",
//     padding: "4px 12px",
//     borderRadius: 12,
//     backdropFilter: "blur(10px)"
//   },

//   loading: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     background: "#000",
//     color: "white"
//   },

//   spinner: {
//     width: 48,
//     height: 48,
//     border: "4px solid rgba(255,255,255,0.1)",
//     borderTop: "4px solid #ff0000",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//     marginBottom: 20
//   },

//   loadingText: {
//     fontSize: 14,
//     color: "rgba(255,255,255,0.7)",
//     fontWeight: 500
//   },

//   empty: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     background: "#000",
//     color: "white",
//     textAlign: "center",
//     padding: "0 32px"
//   },

//   emptyIcon: {
//     fontSize: 64,
//     marginBottom: 16
//   },

//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 600,
//     margin: "0 0 12px 0"
//   },

//   emptyText: {
//     color: "rgba(255,255,255,0.6)",
//     fontSize: 15,
//     margin: 0
//   },

//   uploadBtn: {
//     marginTop: 24,
//     padding: "12px 32px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 24,
//     color: "white",
//     fontSize: 15,
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "all 0.3s",
//     display: "flex",
//     alignItems: "center",
//     gap: 8
//   }
// };

// // Add CSS animations
// if (typeof document !== 'undefined') {
//   const style = document.createElement('style');
//   style.textContent = `
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }

//     @keyframes pulse {
//       0%, 100% { 
//         transform: scale(1);
//         opacity: 0.9;
//       }
//       50% { 
//         transform: scale(1.05);
//         opacity: 1;
//       }
//     }

//     /* Hide scrollbar */
//     *::-webkit-scrollbar {
//       display: none;
//     }

//     /* Button hover effects */
//     button:hover {
//       transform: scale(1.05);
//     }

//     button:active {
//       transform: scale(0.95);
//     }

//     /* Volume slider styling */
//     input[type="range"]::-webkit-slider-thumb {
//       appearance: none;
//       width: 14px;
//       height: 14px;
//       border-radius: 50%;
//       background: white;
//       cursor: pointer;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//     }

//     input[type="range"]::-moz-range-thumb {
//       width: 14px;
//       height: 14px;
//       border-radius: 50%;
//       background: white;
//       cursor: pointer;
//       border: none;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//     }

//     /* Share menu hover */
//     .share-option:hover {
//       background: rgba(255,255,255,0.1) !important;
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
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const videoRefs = useRef([]);
  const containerRef = useRef(null);

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
            video.currentTime = 0;
            video.volume = volume;
            video.muted = muted;
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch((err) => {
                console.log("Autoplay prevented:", err);
                setIsPlaying(false);
              });
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    }
  }, [currentIndex, shorts]);

  // Handle volume and mute changes
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
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === "ArrowDown" && currentIndex < shorts.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, shorts.length]);

  // Scroll detection
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

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, shorts.length]);

  // Scroll snap
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        top: currentIndex * window.innerHeight,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  // Touch handlers
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
      setCurrentIndex((prev) => prev + 1);
    }
    if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
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
      const res = await api.post(`/api/videos/like/${shortId}`, {}, {});
      setShorts((prev) => prev.map((s) => (s._id === shortId ? res.data : s)));
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
      const res = await api.post(`/api/videos/dislike/${shortId}`, {}, {});
      setShorts((prev) => prev.map((s) => (s._id === shortId ? res.data : s)));
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
        <div style={styles.loadingText}>Loading Shorts...</div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📱</div>
        <h2 style={styles.emptyTitle}>No Shorts Yet</h2>
        <p style={styles.emptyText}>Be the first to upload a Short!</p>
        <button style={styles.uploadBtn} onClick={() => navigate("/upload")}>
          <span>📤</span> Upload Short
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
      <header style={styles.header}>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 style={styles.headerTitle}>
          <span style={styles.shortsIcon}>▶️</span> Shorts
        </h1>
        <div style={styles.headerActions}>
          <button
            style={styles.searchBtn}
            onClick={() => navigate("/search")}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button
            style={styles.uploadHeaderBtn}
            onClick={() => navigate("/upload")}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </header>

      {/* SHORTS FEED */}
      <div
        ref={containerRef}
        style={styles.feed}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {shorts.map((short, index) => (
          <div key={short._id} style={styles.shortContainer}>
            {/* VIDEO WRAPPER */}
            <div style={styles.videoWrapper}>
              <video
                ref={(el) => (videoRefs.current[index] = el)}
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
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#000" opacity="0.8">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* GRADIENT OVERLAYS */}
            <div style={styles.topGradient}></div>
            <div style={styles.bottomGradient}></div>

            {/* BOTTOM INFO */}
            <div style={styles.info}>
              <div style={styles.channelInfo} onClick={() => goToChannel(short.uploadedBy._id)}>
                <div style={styles.avatar}>{short.uploadedBy?.name?.charAt(0).toUpperCase()}</div>
                <span style={styles.channelName}>@{short.uploadedBy?.name}</span>
                <button
                  style={styles.subscribeBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,0,0,0.5), 0 0 30px rgba(255,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,0,0,0.4), 0 0 20px rgba(255,0,0,0.2)";
                  }}
                >
                  Subscribe
                </button>
              </div>

              <h3 style={styles.title}>{short.title}</h3>

              {short.description && <p style={styles.description}>{short.description}</p>}

              {short.tags && short.tags.length > 0 && (
                <div style={styles.tags}>
                  {short.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} style={styles.tag}>
                      #{tag}
                    </span>
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
                    background: isLiked
                      ? "rgba(255, 0, 0, 0.25)"
                      : "rgba(255,255,255,0.1)",
                    borderColor: isLiked ? "rgba(255, 0, 0, 0.4)" : "rgba(255,255,255,0.15)",
                  }}
                  onClick={() => handleLike(short._id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                    e.currentTarget.style.background = isLiked ? "rgba(255, 0, 0, 0.25)" : "rgba(255,255,255,0.1)";
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "#ff0000" : "none"}
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </button>
                <span style={styles.actionCount}>{short.likes?.length || 0}</span>
              </div>

              {/* Dislike Button */}
              <div style={styles.actionItem}>
                <button
                  style={{
                    ...styles.actionBtn,
                    background: isDisliked ? "rgba(255, 0, 0, 0.25)" : "rgba(255,255,255,0.1)",
                    borderColor: isDisliked ? "rgba(255, 0, 0, 0.4)" : "rgba(255,255,255,0.15)",
                  }}
                  onClick={() => handleDislike(short._id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1) rotate(-5deg)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                    e.currentTarget.style.background = isDisliked ? "rgba(255, 0, 0, 0.25)" : "rgba(255,255,255,0.1)";
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill={isDisliked ? "#ff0000" : "none"}
                    stroke="white"
                    strokeWidth="2"
                    style={{ transform: "rotate(180deg)" }}
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </button>
                <span style={styles.actionCount}>{short.dislikes?.length || 0}</span>
              </div>

              {/* Comments Button */}
              <div style={styles.actionItem}>
                <button
                  style={styles.actionBtn}
                  onClick={() => setShowComments(!showComments)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
                <span style={styles.actionCount}>{short.commentsCount || 0}</span>
              </div>

              {/* Share Button */}
              <div style={styles.actionItem}>
                <button
                  style={styles.actionBtn}
                  onClick={handleShare}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>
                <span style={styles.actionCount}>Share</span>
              </div>

              {/* Sound Button */}
              <div
                style={styles.actionItem}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button
                  style={styles.actionBtn}
                  onClick={toggleMute}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                >
                  {muted || volume === 0 ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
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
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      style={styles.volumeInput}
                    />
                  </div>
                )}
              </div>

              {/* More Options */}
              <div style={styles.actionItem}>
                <button
                  style={styles.actionBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Share Menu */}
            {showShareMenu && index === currentIndex && (
              <div style={styles.shareMenu}>
                <button
                  style={styles.shareOption}
                  onClick={copyLink}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Copy Link
                </button>
                <button
                  style={styles.shareOption}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </button>
                <button
                  style={styles.shareOption}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
                <button
                  style={styles.shareOption}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
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
                width: idx === currentIndex ? 24 : 12,
                background: idx === currentIndex
                  ? "linear-gradient(135deg, #ff0000 0%, #ff4444 100%)"
                  : "rgba(255,255,255,0.4)",
              }}
            ></div>
          ))}
        </div>
        <div style={styles.progressText}>
          {currentIndex + 1} / {shorts.length}
        </div>
      </div>
    </div>
  );
}

/* 🎨 ENHANCED STYLES */
const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    background: "#000",
    overflow: "hidden",
    fontFamily: "'YouTube Sans', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
    zIndex: 100,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "white",
    letterSpacing: "-0.5px",
    margin: 0,
    flex: 1,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shortsIcon: {
    fontSize: 24,
    filter: "drop-shadow(0 2px 8px rgba(255,0,0,0.5))",
  },
  headerActions: {
    display: "flex",
    gap: 8,
  },
  searchBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    width: 44,
    height: 44,
  },
  uploadHeaderBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    width: 44,
    height: 44,
  },
  feed: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  shortContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    scrollSnapAlign: "start",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000",
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
    background: "#000",
  },
  video: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "100%",
    objectFit: "contain",
    cursor: "pointer",
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
    background: "rgba(0,0,0,0.4)",
    zIndex: 5,
    pointerEvents: "none",
    animation: "fadeIn 0.3s ease-out",
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 8px rgba(255,255,255,0.1)",
    animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
    background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.4) 50%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1,
  },
  info: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 110,
    color: "white",
    zIndex: 10,
    maxWidth: "calc(100% - 126px)",
  },
  channelInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    cursor: "pointer",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    fontWeight: 700,
    color: "white",
    flexShrink: 0,
    border: "2.5px solid rgba(255,255,255,0.3)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  channelName: {
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
    color: "white",
    flex: 1,
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  subscribeBtn: {
    background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
    border: "none",
    borderRadius: 24,
    padding: "9px 22px",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    boxShadow: "0 4px 12px rgba(255,0,0,0.4), 0 0 20px rgba(255,0,0,0.2)",
  },
  title: {
    fontSize: 17,
    fontWeight: 600,
    margin: "12px 0",
    lineHeight: 1.4,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
    letterSpacing: "0.2px",
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.92)",
    margin: "10px 0",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
  },
  tags: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  tag: {
    fontSize: 14,
    color: "#3ea6ff",
    fontWeight: 600,
    cursor: "pointer",
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
    transition: "color 0.2s",
  },
  actions: {
    position: "absolute",
    right: 14,
    bottom: 90,
    display: "flex",
    flexDirection: "column",
    gap: 22,
    zIndex: 10,
  },
  actionItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1.5px solid rgba(255,255,255,0.18)",
    borderRadius: "50%",
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    color: "white",
    padding: 0,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
    position: "relative",
    overflow: "hidden",
  },
  actionCount: {
    fontSize: 12,
    fontWeight: 700,
    color: "white",
    textAlign: "center",
    minWidth: 52,
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
  },
  volumeSlider: {
    position: "absolute",
    right: 68,
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(15px)",
    borderRadius: 24,
    padding: "14px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  volumeInput: {
    width: 110,
    height: 5,
    cursor: "pointer",
    appearance: "none",
    background: "rgba(255,255,255,0.25)",
    borderRadius: 3,
    outline: "none",
  },
  shareMenu: {
    position: "absolute",
    bottom: 300,
    right: 14,
    background: "rgba(0,0,0,0.92)",
    backdropFilter: "blur(25px)",
    borderRadius: 16,
    padding: 14,
    minWidth: 180,
    zIndex: 20,
    boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  shareOption: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "white",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    borderRadius: 10,
    transition: "background 0.2s",
  },
  progressContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    zIndex: 100,
    pointerEvents: "none",
  },
  progressBar: {
    display: "flex",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  progressDot: {
    height: 4,
    borderRadius: 3,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 12px rgba(255,255,255,0.4)",
  },
  progressText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: 700,
    background: "rgba(0,0,0,0.6)",
    padding: "5px 14px",
    borderRadius: 14,
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    color: "white",
  },
  spinner: {
    width: 56,
    height: 56,
    border: "5px solid rgba(255,255,255,0.1)",
    borderTop: "5px solid #ff0000",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginBottom: 24,
    boxShadow: "0 0 20px rgba(255,0,0,0.3)",
  },
  loadingText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    color: "white",
    textAlign: "center",
    padding: "0 40px",
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
    filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.2))",
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 700,
    margin: "0 0 14px 0",
    letterSpacing: "-0.5px",
  },
  emptyText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    margin: 0,
    lineHeight: 1.5,
  },
  uploadBtn: {
    marginTop: 32,
    padding: "14px 36px",
    background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
    border: "none",
    borderRadius: 28,
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 8px 24px rgba(255,0,0,0.4)",
  },
};

// Add CSS animations
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1); 
        opacity: 0.95; 
      }
      50% { 
        transform: scale(1.08); 
        opacity: 1; 
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(10px); 
      }
      to { 
        opacity: 1;
        transform: translateY(0); 
      }
    }
    
    /* Hide scrollbar */
    *::-webkit-scrollbar {
      display: none;
    }
    
    /* Volume slider styling */
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    }
    
    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(style);
}