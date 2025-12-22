// import React, { useState, useEffect, useRef, useContext } from "react";
// import axios from "axios";
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
//       const res = await axios.get("http://localhost:5000/api/videos/shorts");
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
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/like/${shortId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
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
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/dislike/${shortId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
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
//               src={`http://localhost:5000/api/videos/stream/${short.filename}`}
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

import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Shorts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // Fetch Shorts
  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos/shorts");
      setShorts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch shorts:", err);
      setLoading(false);
    }
  };

  // Auto-play current video
  useEffect(() => {
    if (shorts.length > 0 && videoRefs.current[currentIndex]) {
      // Pause all videos
      videoRefs.current.forEach((video, idx) => {
        if (video && idx !== currentIndex) {
          video.pause();
        }
      });

      // Play current video
      const currentVideo = videoRefs.current[currentIndex];
      if (currentVideo) {
        currentVideo.currentTime = 0;
        currentVideo.play().catch(err => console.log("Autoplay prevented:", err));
      }
    }
  }, [currentIndex, shorts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === "ArrowDown" && currentIndex < shorts.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  // Handle Like
  const handleLike = async (shortId) => {
    if (!user) {
      alert("Please login to like");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/videos/like/${shortId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/videos/dislike/${shortId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShorts(prev =>
        prev.map(s => s._id === shortId ? res.data : s)
      );
    } catch (err) {
      console.error("Dislike failed:", err);
    }
  };

  // Navigate to channel
  const goToChannel = (uploaderId) => {
    navigate(`/channel/${uploaderId}`);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading Shorts...</p>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>📱 No Shorts Yet</h2>
        <p style={{ color: "#aaa", marginTop: 10 }}>
          Be the first to upload a Short!
        </p>
        <button style={styles.uploadBtn} onClick={() => navigate("/upload")}>
          Upload Short
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
          ←
        </button>
        <h2 style={styles.headerTitle}>Shorts</h2>
        <button style={styles.uploadHeaderBtn} onClick={() => navigate("/upload")}>
          📷
        </button>
      </div>

      {/* SHORTS FEED */}
      <div style={styles.feed} ref={containerRef}>
        {shorts.map((short, index) => (
          <div key={short._id} style={styles.shortContainer}>
            {/* VIDEO WRAPPER FOR PROPER SIZING */}
            <div style={styles.videoWrapper}>
              <video
                ref={el => videoRefs.current[index] = el}
                src={`http://localhost:5000/api/videos/stream/${short.filename}`}
                style={styles.video}
                loop
                muted={muted}
                playsInline
                onClick={() => {
                  const video = videoRefs.current[index];
                  if (video.paused) video.play();
                  else video.pause();
                }}
              />
            </div>

            {/* GRADIENT OVERLAY */}
            <div style={styles.overlay} />

            {/* BOTTOM INFO */}
            <div style={styles.info}>
              <div style={styles.channelInfo} onClick={() => goToChannel(short.uploadedBy._id)}>
                <div style={styles.avatar}>
                  {short.uploadedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <p style={styles.channelName}>@{short.uploadedBy?.name}</p>
              </div>

              <h3 style={styles.title}>{short.title}</h3>
              
              {short.description && (
                <p style={styles.description}>{short.description}</p>
              )}

              <div style={styles.tags}>
                {short.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} style={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div style={styles.actions}>
              <button
                style={{
                  ...styles.actionBtn,
                  color: isLiked ? "#ff0000" : "white"
                }}
                onClick={() => handleLike(short._id)}
              >
                <span style={styles.actionIcon}>
                  {isLiked ? "❤️" : "🤍"}
                </span>
                <span style={styles.actionText}>
                  {short.likes?.length || 0}
                </span>
              </button>

              <button
                style={{
                  ...styles.actionBtn,
                  color: isDisliked ? "#3ea6ff" : "white"
                }}
                onClick={() => handleDislike(short._id)}
              >
                <span style={styles.actionIcon}>👎</span>
                <span style={styles.actionText}>
                  {short.dislikes?.length || 0}
                </span>
              </button>

              <button style={styles.actionBtn}>
                <span style={styles.actionIcon}>💬</span>
                <span style={styles.actionText}>
                  {short.commentsCount || 0}
                </span>
              </button>

              <button style={styles.actionBtn}>
                <span style={styles.actionIcon}>📤</span>
                <span style={styles.actionText}>Share</span>
              </button>

              <button
                style={styles.actionBtn}
                onClick={() => setMuted(!muted)}
              >
                <span style={styles.actionIcon}>
                  {muted ? "🔇" : "🔊"}
                </span>
              </button>
            </div>

            {/* NAVIGATION HINTS */}
            {index > 0 && (
              <div style={styles.navHintTop}>
                <span>▲</span>
              </div>
            )}
            {index < shorts.length - 1 && (
              <div style={styles.navHintBottom}>
                <span>▼</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PROGRESS INDICATOR */}
      <div style={styles.progressBar}>
        {shorts.map((_, idx) => (
          <div
            key={idx}
            style={{
              ...styles.progressDot,
              background: idx === currentIndex ? "#ff0000" : "#555"
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* 🎨 STYLES - TikTok-Inspired with Proper Sizing */
const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    background: "#000",
    overflow: "hidden"
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
    padding: "0 20px",
    background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
    zIndex: 100
  },

  backBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 24,
    cursor: "pointer",
    padding: 8
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "white",
    letterSpacing: "0.5px",
    margin: 0
  },

  uploadHeaderBtn: {
    background: "transparent",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    padding: 8
  },

  feed: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    scrollBehavior: "smooth",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none" // IE/Edge
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

  // 🎯 NEW: Video wrapper for proper aspect ratio
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
    height: "auto",
    objectFit: "contain", // Changed from "cover" to "contain"
    cursor: "pointer"
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1
  },

  info: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 100,
    color: "white",
    zIndex: 10,
    maxWidth: "calc(100% - 120px)"
  },

  channelInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    cursor: "pointer"
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "white",
    flexShrink: 0
  },

  channelName: {
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
    color: "white"
  },

  title: {
    fontSize: 16,
    fontWeight: 600,
    margin: "8px 0",
    lineHeight: 1.4,
    color: "white"
  },

  description: {
    fontSize: 14,
    color: "#ddd",
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
    fontWeight: 600
  },

  actions: {
    position: "absolute",
    right: 12,
    bottom: 100,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    zIndex: 10
  },

  actionBtn: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    border: "none",
    borderRadius: "50%",
    width: 52,
    height: 52,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "white",
    padding: 0
  },

  actionIcon: {
    fontSize: 22,
    marginBottom: 2
  },

  actionText: {
    fontSize: 10,
    fontWeight: 600
  },

  navHintTop: {
    position: "absolute",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    fontSize: 20,
    opacity: 0.5,
    animation: "bounce 1.5s infinite",
    zIndex: 5,
    pointerEvents: "none"
  },

  navHintBottom: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    fontSize: 20,
    opacity: 0.5,
    animation: "bounce 1.5s infinite",
    zIndex: 5,
    pointerEvents: "none"
  },

  progressBar: {
    position: "absolute",
    top: 70,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 4,
    zIndex: 100,
    pointerEvents: "none"
  },

  progressDot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    transition: "background 0.3s"
  },

  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0f0f0f",
    color: "white"
  },

  spinner: {
    width: 50,
    height: 50,
    border: "4px solid #333",
    borderTop: "4px solid #ff0000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 20
  },

  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0f0f0f",
    color: "white",
    textAlign: "center"
  },

  uploadBtn: {
    marginTop: 20,
    padding: "12px 32px",
    background: "#ff0000",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  }
};

// Add keyframe animations and hide scrollbar via style tag
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-10px); }
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .shorts-feed::-webkit-scrollbar {
      display: none;
    }
  `;
  document.head.appendChild(style);
}