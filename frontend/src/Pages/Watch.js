

// import React, { useEffect, useState, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const videoRef = useRef(null);

//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [subscribed, setSubscribed] = useState(false);
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [userDisliked, setUserDisliked] = useState(false);
//   const [recommended, setRecommended] = useState([]);
//   const [comment, setComment] = useState("");
//   const [showDescription, setShowDescription] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [isTheaterMode, setIsTheaterMode] = useState(false);

//   /* =======================
//       📌 Fetch Video
//   ======================== */
//   const fetchVideo = async () => {
//     const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
//     setVideo(res.data);
//     setLikes(res.data.likes?.length || 0);
//     setDislikes(res.data.dislikes?.length || 0);
    
//     if (user) {
//       setUserLiked(res.data.likes?.includes(user._id));
//       setUserDisliked(res.data.dislikes?.includes(user._id));
//     }

//     if (res.data.uploadedBy?._id) {
//       fetchChannel(res.data.uploadedBy._id);
//       fetchComments(res.data._id);
//     }

//     // ✅ Add to history after video is loaded
//     if (user && res.data._id) {
//       addToHistory(res.data._id);
//     }
//   };

//   /* =======================
//       📌 Fetch Channel
//   ======================== */
//   const fetchChannel = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
//     setChannel(res.data);
//     if (user) setSubscribed(res.data.subscribers?.includes(user._id));
//   };

//   /* =======================
//       📌 Fetch Comments
//   ======================== */
//   const fetchComments = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
//     setVideo((p) => ({ ...p, comments: res.data }));
//   };

//   /* =======================
//       📺 Add to Watch History
//   ======================== */
//   const addToHistory = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/user/watch-history/add/${videoId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("✅ Added to watch history");
//     } catch (err) {
//       console.error("❌ Failed to add to history:", err);
//     }
//   };

//   /* =======================
//       📌 Smart Recommendations
//   ======================== */
//   const fetchRecommended = async () => {
//     const res = await axios.get("http://localhost:5000/api/videos/all");

//     if (video?.tags?.length > 0) {
//       const related = res.data.filter(
//         (v) =>
//           v.filename !== filename &&
//           v.tags?.some((tag) => video.tags.includes(tag))
//       );

//       const extra = res.data.filter((v) => v.filename !== filename);
//       const merged = [...related, ...extra];

//       const unique = merged.filter(
//         (v, i, arr) => arr.findIndex((x) => x._id === v._id) === i
//       );

//       setRecommended(unique.slice(0, 15));
//     } else {
//       setRecommended(res.data.filter((v) => v.filename !== filename));
//     }
//   };

//   /* =======================
//       📌 Update Views
//   ======================== */
//   const updateViews = async () => {
//     await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
//   };

//   useEffect(() => {
//     fetchVideo();
//     updateViews();
//   }, [filename, user]);

//   useEffect(() => {
//     if (video) fetchRecommended();
//   }, [video]);

//   /* =======================
//       👍 Like + 👎 Dislike
//   ======================== */
//   const likeVideo = async () => {
//     if (!user) return alert("Login to like");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/like/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const dislikeVideo = async () => {
//     if (!user) return alert("Login to dislike");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/dislike/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   /* =======================
//       🔔 Subscribe / Unsubscribe
//   ======================== */
//   const toggleSubscribe = async (e) => {
//     e.stopPropagation();
//     if (!user) return alert("Login to subscribe");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/user/subscribe/${channel._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setSubscribed(res.data.subscribed);
//   };

//   /* =======================
//       💬 Comments System
//   ======================== */
//   const postComment = async () => {
//     if (!comment.trim()) return;
//     if (!user) return alert("Login to comment");
//     const token = localStorage.getItem("token");
//     await axios.post(
//       "http://localhost:5000/api/comments/add",
//       { videoId: video._id, text: comment },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setComment("");
//     fetchComments(video._id);
//   };

//   const deleteComment = async (cid) => {
//     if (!user?.isAdmin) return alert("Admin only");
//     const token = localStorage.getItem("token");
//     await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchComments(video._id);
//   };

//   /* =======================
//       🎬 Video Controls
//   ======================== */
//   const changePlaybackSpeed = (speed) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = speed;
//       setPlaybackSpeed(speed);
//       setShowSpeedMenu(false);
//     }
//   };

//   const toggleTheaterMode = () => {
//     setIsTheaterMode(!isTheaterMode);
//   };

//   /* =======================
//       📋 Share Video
//   ======================== */
//   const shareVideo = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url);
//     alert("Link copied to clipboard! 📋");
//   };

//   /* =======================
//       ⏳ Loading UI
//   ======================== */
//   if (!video) return <h2 style={{ padding: 20, color: "#fff" }}>⏳ Loading video...</h2>;

//   return (
//     <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
//       <div style={{ 
//         display: "flex", 
//         gap: 24, 
//         padding: 20,
//         maxWidth: isTheaterMode ? "100%" : "1800px",
//         margin: "0 auto"
//       }}>
//         {/* 🎬 MAIN VIDEO SECTION */}
//         <div style={{ flex: 1, maxWidth: isTheaterMode ? "100%" : "1200px" }}>
//           {/* Video Player */}
//           <div style={{ position: "relative" }}>
//             <video
//               ref={videoRef}
//               src={`http://localhost:5000/api/stream/${video.filename}`}
//               controls
//               autoPlay
//               style={{ 
//                 width: "100%", 
//                 borderRadius: "12px", 
//                 background: "#000",
//                 maxHeight: isTheaterMode ? "80vh" : "650px"
//               }}
//             />
            
//             {/* Custom Controls Overlay */}
//             <div style={controlsOverlay}>
//               <button onClick={toggleTheaterMode} style={controlBtn} title="Theater mode">
//                 {isTheaterMode ? "📺 Exit Theater" : "🖥️ Theater Mode"}
//               </button>
              
//               <div style={{ position: "relative" }}>
//                 <button 
//                   onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
//                   style={controlBtn}
//                   title="Playback speed"
//                 >
//                   ⚡ {playbackSpeed}x
//                 </button>
                
//                 {showSpeedMenu && (
//                   <div style={speedMenu}>
//                     {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
//                       <div 
//                         key={speed}
//                         onClick={() => changePlaybackSpeed(speed)}
//                         style={{
//                           ...speedMenuItem,
//                           background: playbackSpeed === speed ? "#ff0000" : "transparent"
//                         }}
//                       >
//                         {speed}x {playbackSpeed === speed && "✓"}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Video Title */}
//           <h2 style={{ marginTop: "16px", fontSize: "20px", fontWeight: 600 }}>{video.title}</h2>

//           {/* Video Info Bar */}
//           <div style={infoBar}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <span style={{ color: "#aaa", fontSize: "14px" }}>
//                 👁 {video.views?.toLocaleString() || 0} views
//               </span>
//               <span style={{ color: "#666" }}>•</span>
//               <span style={{ color: "#aaa", fontSize: "14px" }}>
//                 {new Date(video.createdAt).toLocaleDateString()}
//               </span>
//             </div>

//             <div style={{ display: "flex", gap: 8 }}>
//               {/* Like/Dislike */}
//               <div style={actionButtonGroup}>
//                 <button 
//                   onClick={likeVideo} 
//                   style={{
//                     ...actionButton,
//                     background: userLiked ? "#ff0000" : "#272727"
//                   }}
//                 >
//                   👍 {likes.toLocaleString()}
//                 </button>
//                 <div style={{ width: 1, height: 24, background: "#555" }}></div>
//                 <button 
//                   onClick={dislikeVideo} 
//                   style={{
//                     ...actionButton,
//                     background: userDisliked ? "#ff0000" : "#272727"
//                   }}
//                 >
//                   👎 {dislikes.toLocaleString()}
//                 </button>
//               </div>

//               {/* Share */}
//               <button onClick={shareVideo} style={actionButtonSingle}>
//                 🔗 Share
//               </button>
//             </div>
//           </div>

//           {/* Tags */}
//           {video.tags && video.tags.length > 0 && (
//             <div style={tagsContainer}>
//               {video.tags.map((t, i) => (
//                 <span key={i} style={tag}>
//                   #{t}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Channel Card */}
//           {channel && (
//             <div style={channelCard}>
//               <div 
//                 style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1 }}
//                 onClick={() => navigate(`/profile/${channel._id}`)}
//               >
//                 <div style={channelAvatar}>
//                   {channel.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <div style={{ fontWeight: 600, fontSize: "16px" }}>{channel.name}</div>
//                   <div style={{ color: "#aaa", fontSize: "12px" }}>
//                     {channel.subscribers?.length || 0} subscribers
//                   </div>
//                 </div>
//               </div>
//               <button
//                 style={subscribed ? subscribedBtn : subscribeBtn}
//                 onClick={toggleSubscribe}
//               >
//                 {subscribed ? (
//                   <>🔔 Subscribed</>
//                 ) : (
//                   <>Subscribe</>
//                 )}
//               </button>
//             </div>
//           )}

//           {/* Description */}
//           <div style={descriptionBox}>
//             <div 
//               style={{ 
//                 maxHeight: showDescription ? "none" : "80px", 
//                 overflow: "hidden",
//                 whiteSpace: "pre-wrap",
//                 lineHeight: "1.6"
//               }}
//             >
//               {video.description || "No description available."}
//             </div>
//             <button 
//               onClick={() => setShowDescription(!showDescription)}
//               style={showMoreBtn}
//             >
//               {showDescription ? "Show less" : "Show more"}
//             </button>
//           </div>

//           {/* 💬 Comments Section */}
//           <div style={{ marginTop: 24 }}>
//             <h3 style={{ fontSize: "20px", marginBottom: 16 }}>
//               {video.comments?.length || 0} Comments
//             </h3>

//             {user ? (
//               <div style={{ marginBottom: 24 }}>
//                 <div style={commentInputContainer}>
//                   <div style={commentAvatar}>
//                     {user.username?.charAt(0).toUpperCase()}
//                   </div>
//                   <input
//                     type="text"
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     placeholder="Add a comment..."
//                     style={commentInput}
//                     onKeyPress={(e) => e.key === "Enter" && postComment()}
//                   />
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
//                   <button onClick={() => setComment("")} style={cancelBtn}>Cancel</button>
//                   <button 
//                     onClick={postComment} 
//                     style={comment.trim() ? commentPostBtn : commentPostBtnDisabled}
//                     disabled={!comment.trim()}
//                   >
//                     Comment
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ padding: 16, background: "#272727", borderRadius: 8, marginBottom: 24 }}>
//                 Sign in to leave a comment
//               </div>
//             )}

//             {/* Comments List */}
//             <div>
//               {video.comments?.map((c) => (
//                 <div key={c._id} style={commentCard}>
//                   <div style={commentAvatar}>
//                     {c.user?.charAt(0).toUpperCase()}
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                       <span style={{ fontWeight: 600, fontSize: "13px" }}>{c.user}</span>
//                       <span style={{ color: "#aaa", fontSize: "12px" }}>
//                         {new Date(c.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <p style={{ margin: 0, lineHeight: "1.5", fontSize: "14px" }}>{c.text}</p>
//                     {user?.isAdmin && (
//                       <button onClick={() => deleteComment(c._id)} style={deleteCommentBtn}>
//                         🗑️ Delete
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* 📌 Recommended Videos Sidebar */}
//         {!isTheaterMode && (
//           <div style={{ width: 400, flexShrink: 0 }}>
//             <h3 style={{ fontSize: "18px", marginBottom: 16 }}>Recommended</h3>
//             <div>
//               {recommended.slice(0, 15).map((v) => (
//                 <div
//                   key={v._id}
//                   onClick={() => navigate(`/watch/${v.filename}`)}
//                   style={recommendedCard}
//                 >
//                   <img 
//                     src={`http://localhost:5000/uploads/${v.thumbnail}`} 
//                     style={recommendedThumb} 
//                     alt={v.title}
//                   />
//                   <div style={{ flex: 1 }}>
//                     <p style={recommendedTitle}>{v.title}</p>
//                     <p style={recommendedMeta}>
//                       {v.uploadedBy?.name || "Unknown"}
//                     </p>
//                     <p style={recommendedMeta}>
//                       {v.views?.toLocaleString() || 0} views • {new Date(v.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* =======================
//    🎨 Styles
// ======================= */
// const controlsOverlay = {
//   position: "absolute",
//   top: 12,
//   right: 12,
//   display: "flex",
//   gap: 8,
//   zIndex: 10
// };

// const controlBtn = {
//   padding: "8px 12px",
//   background: "rgba(0,0,0,0.8)",
//   border: "none",
//   borderRadius: 8,
//   color: "#fff",
//   cursor: "pointer",
//   fontSize: "13px",
//   fontWeight: 600
// };

// const speedMenu = {
//   position: "absolute",
//   top: "100%",
//   right: 0,
//   marginTop: 4,
//   background: "rgba(28,28,28,0.98)",
//   backdropFilter: "blur(10px)",
//   borderRadius: 8,
//   overflow: "hidden",
//   minWidth: 100,
//   boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
// };

// const speedMenuItem = {
//   padding: "10px 16px",
//   cursor: "pointer",
//   fontSize: "13px",
//   transition: "background 0.2s"
// };

// const infoBar = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginTop: 12,
//   paddingBottom: 12,
//   borderBottom: "1px solid #333"
// };

// const actionButtonGroup = {
//   display: "flex",
//   alignItems: "center",
//   background: "#272727",
//   borderRadius: 24,
//   overflow: "hidden"
// };

// const actionButton = {
//   padding: "10px 20px",
//   border: "none",
//   color: "#fff",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: 600,
//   transition: "background 0.2s"
// };

// const actionButtonSingle = {
//   ...actionButton,
//   background: "#272727",
//   borderRadius: 24
// };

// const tagsContainer = {
//   display: "flex",
//   gap: 8,
//   flexWrap: "wrap",
//   marginTop: 12
// };

// const tag = {
//   background: "#272727",
//   padding: "6px 14px",
//   borderRadius: 20,
//   fontSize: "12px",
//   color: "#aaa",
//   fontWeight: 500
// };

// const channelCard = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   background: "#0f0f0f",
//   padding: "16px 0",
//   marginTop: 16,
//   borderRadius: 12
// };

// const channelAvatar = {
//   width: 48,
//   height: 48,
//   borderRadius: "50%",
//   background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "20px",
//   fontWeight: "bold"
// };

// const subscribeBtn = {
//   padding: "10px 24px",
//   background: "#ff0000",
//   border: "none",
//   borderRadius: 24,
//   color: "#fff",
//   fontSize: "14px",
//   fontWeight: 600,
//   cursor: "pointer",
//   transition: "background 0.2s"
// };

// const subscribedBtn = {
//   ...subscribeBtn,
//   background: "#272727"
// };

// const descriptionBox = {
//   background: "#272727",
//   padding: 16,
//   borderRadius: 12,
//   marginTop: 16
// };

// const showMoreBtn = {
//   background: "none",
//   border: "none",
//   color: "#fff",
//   cursor: "pointer",
//   marginTop: 8,
//   fontWeight: 600,
//   fontSize: "14px"
// };

// const commentInputContainer = {
//   display: "flex",
//   gap: 12,
//   alignItems: "flex-start"
// };

// const commentAvatar = {
//   width: 40,
//   height: 40,
//   borderRadius: "50%",
//   background: "linear-gradient(135deg, #666, #999)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "16px",
//   fontWeight: "bold",
//   flexShrink: 0
// };

// const commentInput = {
//   flex: 1,
//   background: "transparent",
//   border: "none",
//   borderBottom: "1px solid #555",
//   color: "#fff",
//   padding: "8px 0",
//   fontSize: "14px",
//   outline: "none"
// };

// const cancelBtn = {
//   padding: "8px 16px",
//   background: "transparent",
//   border: "none",
//   borderRadius: 20,
//   color: "#fff",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: 600
// };

// const commentPostBtn = {
//   padding: "8px 16px",
//   background: "#ff0000",
//   border: "none",
//   borderRadius: 20,
//   color: "#fff",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: 600
// };

// const commentPostBtnDisabled = {
//   ...commentPostBtn,
//   background: "#272727",
//   cursor: "not-allowed"
// };

// const commentCard = {
//   display: "flex",
//   gap: 12,
//   padding: "16px 0",
//   borderBottom: "1px solid #272727"
// };

// const deleteCommentBtn = {
//   marginTop: 8,
//   padding: "4px 12px",
//   background: "#900",
//   border: "none",
//   borderRadius: 16,
//   color: "#fff",
//   cursor: "pointer",
//   fontSize: "12px"
// };

// const recommendedCard = {
//   display: "flex",
//   gap: 12,
//   marginBottom: 12,
//   cursor: "pointer",
//   padding: 8,
//   borderRadius: 8,
//   transition: "background 0.2s"
// };

// const recommendedThumb = {
//   width: 168,
//   height: 94,
//   borderRadius: 8,
//   objectFit: "cover",
//   flexShrink: 0
// };

// const recommendedTitle = {
//   margin: 0,
//   fontSize: "14px",
//   fontWeight: 600,
//   lineHeight: "1.4",
//   display: "-webkit-box",
//   WebkitLineClamp: 2,
//   WebkitBoxOrient: "vertical",
//   overflow: "hidden"
// };

// const recommendedMeta = {
//   margin: "4px 0 0 0",
//   fontSize: "12px",
//   color: "#aaa"
// };

// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
  
//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [comment, setComment] = useState("");
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [userDisliked, setUserDisliked] = useState(false);
//   const [subscribed, setSubscribed] = useState(false);
//   const [showDescription, setShowDescription] = useState(false);
//   const [isTheaterMode, setIsTheaterMode] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
//   const videoRef = useRef(null);

//   /* =======================
//       📌 Fetch Video
//   ======================== */
//   const fetchVideo = async () => {
//     const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
//     setVideo(res.data);
//     setLikes(res.data.likes?.length || 0);
//     setDislikes(res.data.dislikes?.length || 0);
    
//     if (user) {
//       setUserLiked(res.data.likes?.includes(user._id));
//       setUserDisliked(res.data.dislikes?.includes(user._id));
//     }

//     if (res.data.uploadedBy?._id) {
//       fetchChannel(res.data.uploadedBy._id);
//       fetchComments(res.data._id);
//     }

//     // ✅ Add to history after video is loaded
//     if (user && res.data._id) {
//       addToHistory(res.data._id);
//     }
//   };

//   /* =======================
//       📌 Fetch Channel
//   ======================== */
//   const fetchChannel = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
//     setChannel(res.data);
//     if (user) setSubscribed(res.data.subscribers?.includes(user._id));
//   };

//   /* =======================
//       📌 Fetch Comments
//   ======================== */
//   const fetchComments = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
//     setVideo((p) => ({ ...p, comments: res.data }));
//   };

//   /* =======================
//       📺 Add to Watch History
//   ======================== */
//   const addToHistory = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/user/watch-history/add/${videoId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("✅ Added to watch history");
//     } catch (err) {
//       console.error("❌ Failed to add to history:", err);
//     }
//   };

//   /* =======================
//       📌 Smart Recommendations
//   ======================== */
//   // const fetchRecommended = async () => {
//   //   const res = await axios.get("http://localhost:5000/api/videos/all");

//   //   if (video?.tags?.length > 0) {
//   //     const related = res.data.filter(
//   //       (v) =>
//   //         v.filename !== filename &&
//   //         v.tags?.some((tag) => video.tags.includes(tag))
//   //     );

//   //     const extra = res.data.filter((v) => v.filename !== filename);
//   //     const merged = [...related, ...extra];

//   //     const unique = merged.filter(
//   //       (v, i, arr) => arr.findIndex((x) => x._id === v._id) === i
//   //     );

//   //     setRecommended(unique.slice(0, 15));
//   //   } else {
//   //     setRecommended(res.data.filter((v) => v.filename !== filename));
//   //   }
//   // };
// // Watch.js mein sirf yeh function replace kar dena

// const fetchRecommended = async () => {
//   try {
//     // SUPER FAST: Ab matrix se seedha similar videos milega
//     const res = await axios.get(`http://localhost:5000/api/videos/similar/${filename}`);
//     setRecommended(res.data.slice(0, 15));
//   } catch (err) {
//     console.log("Matrix se nahi mila, fallback chal raha hai...");
//     try {
//       // Agar matrix file na ho to purana method chalega (safe backup)
//       const allRes = await axios.get("http://localhost:5000/api/videos/all");
//       const filtered = allRes.data
//         .filter(v => v.filename !== filename)
//         .slice(0, 15);
//       setRecommended(filtered);
//     } catch (fallbackErr) {
//       setRecommended([]);
//     }
//   }
// };
//   /* =======================
//       📌 Update Views
//   ======================== */
//   const updateViews = async () => {
//     await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
//   };

//   useEffect(() => {
//     fetchVideo();
//     updateViews();
//   }, [filename, user]);

//   useEffect(() => {
//     if (video) fetchRecommended();
//   }, [video]);

//   /* =======================
//       👍 Like + 👎 Dislike
//   ======================== */
//   const likeVideo = async () => {
//     if (!user) return alert("Login to like");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/like/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const dislikeVideo = async () => {
//     if (!user) return alert("Login to dislike");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/dislike/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   /* =======================
//       🔔 Subscribe / Unsubscribe
//   ======================== */
//   const toggleSubscribe = async (e) => {
//     e.stopPropagation();
//     if (!user) return alert("Login to subscribe");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/user/subscribe/${channel._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setSubscribed(res.data.subscribed);
//   };

//   /* =======================
//       💬 Comments System
//   ======================== */
//   const postComment = async () => {
//     if (!comment.trim()) return;
//     if (!user) return alert("Login to comment");
//     const token = localStorage.getItem("token");
//     await axios.post(
//       "http://localhost:5000/api/comments/add",
//       { videoId: video._id, text: comment },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setComment("");
//     fetchComments(video._id);
//   };

//   const deleteComment = async (cid) => {
//     if (!user?.isAdmin) return alert("Admin only");
//     const token = localStorage.getItem("token");
//     await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchComments(video._id);
//   };

//   /* =======================
//       🎬 Video Controls
//   ======================== */
//   const changePlaybackSpeed = (speed) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = speed;
//       setPlaybackSpeed(speed);
//       setShowSpeedMenu(false);
//     }
//   };

//   const toggleTheaterMode = () => {
//     setIsTheaterMode(!isTheaterMode);
//   };

//   /* =======================
//       📋 Share Video
//   ======================== */
//   const shareVideo = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url);
//     alert("Link copied to clipboard! 📋");
//   };

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

//   /* =======================
//       ⏳ Loading UI
//   ======================== */
//   if (!video) {
//     return (
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ textAlign: "center" }}>
//           <div className="spinner"></div>
//           <h2 style={{ color: "#fff", marginTop: 20 }}>Loading video...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
//         <div style={{ 
//           display: "flex", 
//           gap: 24, 
//           padding: 20,
//           maxWidth: isTheaterMode ? "100%" : "1800px",
//           margin: "0 auto"
//         }}>
//           {/* 🎬 MAIN VIDEO SECTION */}
//           <div style={{ flex: 1, maxWidth: isTheaterMode ? "100%" : "1200px" }}>
//             {/* Video Player */}
//             <div style={{ position: "relative" }}>
//               <video
//                 ref={videoRef}
//                 src={`http://localhost:5000/api/stream/${video.filename}`}
//                 controls
//                 autoPlay
//                 style={{ 
//                   width: "100%", 
//                   borderRadius: "12px", 
//                   background: "#000",
//                   maxHeight: isTheaterMode ? "80vh" : "650px"
//                 }}
//               />
              
//               {/* Custom Controls Overlay */}
//               <div style={styles.controlsOverlay}>
//                 <button onClick={toggleTheaterMode} style={styles.controlBtn} title="Theater mode">
//                   {isTheaterMode ? "📺 Exit Theater" : "🖥️ Theater Mode"}
//                 </button>
                
//                 <div style={{ position: "relative" }}>
//                   <button 
//                     onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
//                     style={styles.controlBtn}
//                     title="Playback speed"
//                   >
//                     ⚡ {playbackSpeed}x
//                   </button>
                  
//                   {showSpeedMenu && (
//                     <div style={styles.speedMenu}>
//                       {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
//                         <div 
//                           key={speed}
//                           onClick={() => changePlaybackSpeed(speed)}
//                           style={{
//                             padding: "10px 16px",
//                             cursor: "pointer",
//                             fontSize: "13px",
//                             transition: "background 0.2s",
//                             background: playbackSpeed === speed ? "#ff0000" : "transparent"
//                           }}
//                           onMouseEnter={(e) => {
//                             if (playbackSpeed !== speed) e.target.style.background = "rgba(255,255,255,0.1)";
//                           }}
//                           onMouseLeave={(e) => {
//                             if (playbackSpeed !== speed) e.target.style.background = "transparent";
//                           }}
//                         >
//                           {speed}x {playbackSpeed === speed && "✓"}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Video Title */}
//             <h2 style={{ marginTop: "16px", fontSize: "20px", fontWeight: 600 }}>{video.title}</h2>

//             {/* Video Info Bar */}
//             <div style={styles.infoBar}>
//               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <span style={{ color: "#aaa", fontSize: "14px" }}>
//                   👁 {formatViews(video.views)} views
//                 </span>
//                 <span style={{ color: "#666" }}>•</span>
//                 <span style={{ color: "#aaa", fontSize: "14px" }}>
//                   {getTimeAgo(video.createdAt)}
//                 </span>
//               </div>

//               <div style={{ display: "flex", gap: 8 }}>
//                 {/* Like/Dislike */}
//                 <div style={styles.actionButtonGroup}>
//                   <button 
//                     onClick={likeVideo} 
//                     style={{
//                       ...styles.actionButton,
//                       background: userLiked ? "#ff0000" : "#272727"
//                     }}
//                   >
//                     👍 {formatViews(likes)}
//                   </button>
//                   <div style={{ width: 1, height: 24, background: "#555" }}></div>
//                   <button 
//                     onClick={dislikeVideo} 
//                     style={{
//                       ...styles.actionButton,
//                       background: userDisliked ? "#ff0000" : "#272727"
//                     }}
//                   >
//                     👎 {formatViews(dislikes)}
//                   </button>
//                 </div>

//                 {/* Share */}
//                 <button onClick={shareVideo} style={styles.actionButtonSingle}>
//                   🔗 Share
//                 </button>
//               </div>
//             </div>

//             {/* Tags */}
//             {video.tags && video.tags.length > 0 && (
//               <div style={styles.tagsContainer}>
//                 {video.tags.map((t, i) => (
//                   <span key={i} style={styles.tag}>
//                     #{t}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {/* Channel Card */}
//             {channel && (
//               <div style={styles.channelCard}>
//                 <div 
//                   style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1 }}
//                   onClick={() => navigate(`/profile/${channel._id}`)}
//                 >
//                   <div style={styles.channelAvatar}>
//                     {channel.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: "16px" }}>{channel.name}</div>
//                     <div style={{ color: "#aaa", fontSize: "12px" }}>
//                       {formatViews(channel.subscribers?.length || 0)} subscribers
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   style={subscribed ? styles.subscribedBtn : styles.subscribeBtn}
//                   onClick={toggleSubscribe}
//                 >
//                   {subscribed ? (
//                     <>🔔 Subscribed</>
//                   ) : (
//                     <>Subscribe</>
//                   )}
//                 </button>
//               </div>
//             )}

//             {/* Description */}
//             <div style={styles.descriptionBox}>
//               <div 
//                 style={{ 
//                   maxHeight: showDescription ? "none" : "80px", 
//                   overflow: "hidden",
//                   whiteSpace: "pre-wrap",
//                   lineHeight: "1.6"
//                 }}
//               >
//                 {video.description || "No description available."}
//               </div>
//               {video.description && video.description.length > 150 && (
//                 <button 
//                   onClick={() => setShowDescription(!showDescription)}
//                   style={styles.showMoreBtn}
//                 >
//                   {showDescription ? "Show less" : "Show more"}
//                 </button>
//               )}
//             </div>

//             {/* 💬 Comments Section */}
//             <div style={{ marginTop: 24 }}>
//               <h3 style={{ fontSize: "20px", marginBottom: 16, fontWeight: 600 }}>
//                 {video.comments?.length || 0} Comments
//               </h3>

//               {user ? (
//                 <div style={{ marginBottom: 24 }}>
//                   <div style={styles.commentInputContainer}>
//                     <div style={styles.commentAvatar}>
//                       {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
//                     </div>
//                     <input
//                       type="text"
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                       placeholder="Add a comment..."
//                       style={styles.commentInput}
//                       onKeyPress={(e) => e.key === "Enter" && postComment()}
//                     />
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
//                     <button onClick={() => setComment("")} style={styles.cancelBtn}>Cancel</button>
//                     <button 
//                       onClick={postComment} 
//                       style={comment.trim() ? styles.commentPostBtn : styles.commentPostBtnDisabled}
//                       disabled={!comment.trim()}
//                     >
//                       Comment
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div style={{ padding: 16, background: "#272727", borderRadius: 8, marginBottom: 24, textAlign: "center" }}>
//                   <button 
//                     onClick={() => navigate("/login")} 
//                     style={{ 
//                       background: "#3ea6ff", 
//                       border: "none", 
//                       padding: "10px 20px", 
//                       borderRadius: 20, 
//                       color: "#fff", 
//                       cursor: "pointer", 
//                       fontWeight: 600 
//                     }}
//                   >
//                     Sign in to comment
//                   </button>
//                 </div>
//               )}

//               {/* Comments List */}
//               <div>
//                 {video.comments?.map((c) => (
//                   <div key={c._id} style={styles.commentCard}>
//                     <div style={styles.commentAvatar}>
//                       {c.user?.charAt(0).toUpperCase() || "U"}
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                         <span style={{ fontWeight: 600, fontSize: "13px" }}>{c.user}</span>
//                         <span style={{ color: "#aaa", fontSize: "12px" }}>
//                           {getTimeAgo(c.createdAt)}
//                         </span>
//                       </div>
//                       <p style={{ margin: 0, lineHeight: "1.5", fontSize: "14px" }}>{c.text}</p>
//                       {user?.isAdmin && (
//                         <button onClick={() => deleteComment(c._id)} style={styles.deleteCommentBtn}>
//                           🗑️ Delete
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 📌 Recommended Videos Sidebar */}
//           {!isTheaterMode && (
//             <div style={{ width: 400, flexShrink: 0 }}>
//               <h3 style={{ fontSize: "18px", marginBottom: 16, fontWeight: 600 }}>Recommended</h3>
//               <div>
//                 {recommended.slice(0, 15).map((v) => (
//                   <div
//                     key={v._id}
//                     onClick={() => navigate(`/watch/${v.filename}`)}
//                     style={styles.recommendedCard}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.05)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = "transparent";
//                     }}
//                   >
//                     <img 
//                       src={`http://localhost:5000/uploads/${v.thumbnail}`} 
//                       style={styles.recommendedThumb} 
//                       alt={v.title}
//                       onError={(e) => {
//                         e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="168" height="94"><rect fill="%23333" width="168" height="94"/></svg>';
//                       }}
//                     />
//                     <div style={{ flex: 1 }}>
//                       <p style={styles.recommendedTitle}>{v.title}</p>
//                       <p style={styles.recommendedMeta}>
//                         {v.uploadedBy?.name || "Unknown"}
//                       </p>
//                       <p style={styles.recommendedMeta}>
//                         {formatViews(v.views)} views • {getTimeAgo(v.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         .spinner {
//           width: 48px;
//           height: 48px;
//           border: 4px solid #303030;
//           border-top-color: #ff0000;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </>
//   );
// }

// /* =======================
//    🎨 Styles
// ======================= */
// const styles = {
//   controlsOverlay: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     display: "flex",
//     gap: 8,
//     zIndex: 10
//   },
//   controlBtn: {
//     padding: "8px 12px",
//     background: "rgba(0,0,0,0.8)",
//     backdropFilter: "blur(4px)",
//     border: "none",
//     borderRadius: 8,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 600,
//     transition: "background 0.2s"
//   },
//   speedMenu: {
//     position: "absolute",
//     top: "100%",
//     right: 0,
//     marginTop: 4,
//     background: "rgba(28,28,28,0.98)",
//     backdropFilter: "blur(10px)",
//     borderRadius: 8,
//     overflow: "hidden",
//     minWidth: 100,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
//   },
//   infoBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 12,
//     paddingBottom: 12,
//     borderBottom: "1px solid #333"
//   },
//   actionButtonGroup: {
//     display: "flex",
//     alignItems: "center",
//     background: "#272727",
//     borderRadius: 24,
//     overflow: "hidden"
//   },
//   actionButton: {
//     padding: "10px 20px",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     transition: "background 0.2s"
//   },
//   actionButtonSingle: {
//     padding: "10px 20px",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     background: "#272727",
//     borderRadius: 24,
//     transition: "background 0.2s"
//   },
//   tagsContainer: {
//     display: "flex",
//     gap: 8,
//     flexWrap: "wrap",
//     marginTop: 12
//   },
//   tag: {
//     background: "#272727",
//     padding: "6px 14px",
//     borderRadius: 20,
//     fontSize: "12px",
//     color: "#aaa",
//     fontWeight: 500
//   },
//   channelCard: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#0f0f0f",
//     padding: "16px 0",
//     marginTop: 16,
//     borderRadius: 12
//   },
//   channelAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "20px",
//     fontWeight: "bold",
//     color: "#fff"
//   },
//   subscribeBtn: {
//     padding: "10px 24px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 24,
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s"
//   },
//   subscribedBtn: {
//     padding: "10px 24px",
//     background: "#272727",
//     border: "none",
//     borderRadius: 24,
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s"
//   },
//   descriptionBox: {
//     background: "#272727",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 16
//   },
//   showMoreBtn: {
//     background: "none",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     marginTop: 8,
//     fontWeight: 600,
//     fontSize: "14px"
//   },
//   commentInputContainer: {
//     display: "flex",
//     gap: 12,
//     alignItems: "flex-start"
//   },
//   commentAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #666, #999)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "16px",
//     fontWeight: "bold",
//     flexShrink: 0,
//     color: "#fff"
//   },
//   commentInput: {
//     flex: 1,
//     background: "transparent",
//     border: "none",
//     borderBottom: "1px solid #555",
//     color: "#fff",
//     padding: "8px 0",
//     fontSize: "14px",
//     outline: "none"
//   },
//   cancelBtn: {
//     padding: "8px 16px",
//     background: "transparent",
//     border: "none",
//     borderRadius: 20,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentPostBtn: {
//     padding: "8px 16px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 20,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentPostBtnDisabled: {
//     padding: "8px 16px",
//     background: "#272727",
//     border: "none",
//     borderRadius: 20,
//     color: "#fff",
//     cursor: "not-allowed",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentCard: {
//     display: "flex",
//     gap: 12,
//     padding: "16px 0",
//     borderBottom: "1px solid #272727"
//   },
//   deleteCommentBtn: {
//     marginTop: 8,
//     padding: "4px 12px",
//     background: "#900",
//     border: "none",
//     borderRadius: 16,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "12px"
//   },
//   recommendedCard: {
//     display: "flex",
//     gap: 12,
//     marginBottom: 12,
//     cursor: "pointer",
//     padding: 8,
//     borderRadius: 8,
//     transition: "background 0.2s"
//   },
//   recommendedThumb: {
//     width: 168,
//     height: 94,
//     borderRadius: 8,
//     objectFit: "cover",
//     flexShrink: 0
//   },
//   recommendedTitle: {
//     margin: 0,
//     fontSize: "14px",
//     fontWeight: 600,
//     lineHeight: "1.4",
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden"
//   },
//   recommendedMeta: {
//     margin: "4px 0 0 0",
//     fontSize: "12px",
//     color: "#aaa"
//   }
// };

// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";
// // Using React Icons for a polished look (assuming it's installed)
// import { 
//   FiThumbsUp, FiThumbsDown, FiShare2, FiBell, FiCheck, 
//   FiPlay, FiLayers, FiZap, FiMessageSquare, FiUser
// } from "react-icons/fi";
// import { MdOutlineScreenShare, MdOutlineFullscreenExit, MdOutlineSpeed } from 'react-icons/md';


// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
  
//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [comment, setComment] = useState("");
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [userDisliked, setUserDisliked] = useState(false);
//   const [subscribed, setSubscribed] = useState(false);
//   const [showDescription, setShowDescription] = useState(false);
//   const [isTheaterMode, setIsTheaterMode] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
//   const videoRef = useRef(null);

//   /* =======================
//       📌 Fetch Video
//   ======================== */
//   const fetchVideo = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
//       setVideo(res.data);
//       setLikes(res.data.likes?.length || 0);
//       setDislikes(res.data.dislikes?.length || 0);
      
//       if (user) {
//         setUserLiked(res.data.likes?.includes(user._id));
//         setUserDisliked(res.data.dislikes?.includes(user._id));
//       }

//       if (res.data.uploadedBy?._id) {
//         fetchChannel(res.data.uploadedBy._id);
//         fetchComments(res.data._id);
//       }

//       // ✅ Add to history after video is loaded
//       if (user && res.data._id) {
//         addToHistory(res.data._id);
//       }
//     } catch (error) {
//         console.error("Error fetching video:", error);
//         // Handle 404 or other errors (e.g., navigate to a 404 page)
//         // navigate("/404"); 
//     }
//   };

//   /* =======================
//       📌 Fetch Channel
//   ======================== */
//   const fetchChannel = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
//     setChannel(res.data);
//     if (user) setSubscribed(res.data.subscribers?.includes(user._id));
//   };

//   /* =======================
//       📌 Fetch Comments
//   ======================== */
//   const fetchComments = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
//     // Assuming comment objects contain the username or name of the commenter
//     setVideo((p) => ({ ...p, comments: res.data })); 
//   };

//   /* =======================
//       📺 Add to Watch History
//   ======================== */
//   const addToHistory = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/user/watch-history/add/${videoId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("✅ Added to watch history");
//     } catch (err) {
//       console.error("❌ Failed to add to history:", err);
//     }
//   };

//   /* =====================================================================
//       📌 Smart Recommendations (Refined Logic for New/Existing Users)
      
//       New User Experience (No history): Show trending/popular videos.
//       Existing User: Prioritize matrix-based similarity.
//   ===================================================================== */
//   const fetchRecommended = async () => {
//     try {
//       // 1. Try Matrix Recommendation (for existing users with history)
//       console.log("Attempting matrix recommendation...");
//       const matrixRes = await axios.get(`http://localhost:5000/api/videos/similar/${filename}`);
      
//       if (matrixRes.data && matrixRes.data.length > 0) {
//         console.log("✅ Matrix recommendations successful.");
//         setRecommended(matrixRes.data.slice(0, 15));
//       } else {
//         throw new Error("Matrix returned empty or failed, falling back.");
//       }

//     } catch (err) {
//       // 2. Fallback for new users or matrix failure: Load Trending/Popular
//       console.log("❌ Matrix failed or returned empty. Falling back to trending/popular...");
//       try {
//         // Assuming you have a trending or popular endpoint
//         // If not, sorting all videos by views is a good substitute.
//         const allRes = await axios.get("http://localhost:5000/api/videos/all");
        
//         // Filter out current video, sort by views, and take the top 15
//         const popular = allRes.data
//           .filter(v => v.filename !== filename)
//           .sort((a, b) => (b.views || 0) - (a.views || 0)) // Sort by views (Popular/Trending)
//           .slice(0, 15);
        
//         setRecommended(popular);
//       } catch (fallbackErr) {
//         console.error("Fallback failed:", fallbackErr);
//         setRecommended([]);
//       }
//     }
//   };

//   /* =======================
//       📌 Update Views
//   ======================== */
//   const updateViews = async () => {
//     // This is simple POST request, can run immediately
//     await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
//   };

//   useEffect(() => {
//     fetchVideo();
//     updateViews();
//     // Dependency on filename ensures data refetches when navigating between videos
//   }, [filename, user?._id]); 

//   useEffect(() => {
//     // Only fetch recommendations once the video data is available
//     if (video) fetchRecommended();
//   }, [video]); 

//   /* =======================
//       👍 Like + 👎 Dislike
//   ======================== */
//   const likeVideo = async () => {
//     if (!user) return navigate("/login", { state: { message: "Login to like this video." } });
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/like/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const dislikeVideo = async () => {
//     if (!user) return navigate("/login", { state: { message: "Login to dislike this video." } });
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/dislike/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   /* =======================
//       🔔 Subscribe / Unsubscribe
//   ======================== */
//   const toggleSubscribe = async (e) => {
//     e.stopPropagation();
//     if (!user) return navigate("/login", { state: { message: "Login to subscribe to this channel." } });
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/user/subscribe/${channel._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     // Assuming backend returns { subscribed: boolean, subscribersCount: number }
//     setSubscribed(res.data.subscribed);
//     // Update channel state to reflect new subscriber count
//     setChannel(p => ({ ...p, subscribers: res.data.subscribers || p.subscribers }));
//   };

//   /* =======================
//       💬 Comments System
//   ======================== */
//   const postComment = async () => {
//     if (!comment.trim()) return;
//     if (!user) return navigate("/login", { state: { message: "Login to post a comment." } });
//     const token = localStorage.getItem("token");
    
//     // Add temporary comment immediately for better UX
//     const tempComment = {
//         _id: Date.now(), // Temp ID
//         user: user.name || user.username, 
//         text: comment,
//         createdAt: new Date().toISOString(),
//         isPending: true // Flag to show it's being sent
//     };
//     setVideo(p => ({ 
//         ...p, 
//         comments: [tempComment, ...(p.comments || [])] 
//     }));
//     setComment("");

//     try {
//         await axios.post(
//           "http://localhost:5000/api/comments/add",
//           { videoId: video._id, text: tempComment.text },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         // Refresh comments to get the official ID and remove the pending flag
//         fetchComments(video._id); 
//     } catch (error) {
//         alert("Failed to post comment.");
//         // Remove the temporary comment on failure
//         setVideo(p => ({ 
//             ...p, 
//             comments: p.comments.filter(c => c._id !== tempComment._id)
//         }));
//     }
//   };

//   const deleteComment = async (cid) => {
//     if (!user?.isAdmin && video.uploadedBy._id !== user._id) return alert("You can only delete your own comments or must be an Admin.");
    
//     const token = localStorage.getItem("token");
//     try {
//         await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchComments(video._id);
//     } catch (error) {
//         alert("Failed to delete comment.");
//     }
//   };

//   /* =======================
//       🎬 Video Controls & Utils
//   ======================== */
//   const changePlaybackSpeed = (speed) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = speed;
//       setPlaybackSpeed(speed);
//       setShowSpeedMenu(false);
//     }
//   };

//   const toggleTheaterMode = () => {
//     setIsTheaterMode(!isTheaterMode);
//   };

//   const shareVideo = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url);
//     alert("Video link copied to clipboard! 📋");
//   };

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
//       year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60,
//     };

//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
//     }
//     return "Just now";
//   };

//   /* =======================
//       ⏳ Loading UI
//   ======================== */
//   if (!video) {
//     return (
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ textAlign: "center" }}>
//           <div className="spinner"></div>
//           <h2 style={{ color: "#fff", marginTop: 20 }}>Loading content from the server...</h2>
//         </div>
//       </div>
//     );
//   }

//   /* =======================
//       ✅ Render
//   ======================== */
//   return (
//     <>
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
//         <div style={{ 
//           display: "flex", 
//           gap: 24, 
//           padding: 20,
//           // Conditional styling for theater mode
//           maxWidth: isTheaterMode ? "100%" : "1800px",
//           margin: "0 auto"
//         }}>
//           {/* 🎬 MAIN VIDEO SECTION */}
//           <div style={{ flex: 1, maxWidth: isTheaterMode ? "100%" : "calc(100% - 424px)" }}>
//             {/* Video Player */}
//             <div style={{ position: "relative" }}>
//               <video
//                 ref={videoRef}
//                 src={`http://localhost:5000/api/stream/${video.filename}`}
//                 controls
//                 autoPlay
//                 style={{ 
//                   width: "100%", 
//                   borderRadius: isTheaterMode ? "0" : "12px", 
//                   background: "#000",
//                   maxHeight: isTheaterMode ? "90vh" : "750px"
//                 }}
//                 title={video.title}
//                 preload="auto"
//               />
              
//               {/* Custom Controls Overlay - YouTube like appearance */}
//               <div style={styles.controlsOverlay}>
//                 <button onClick={toggleTheaterMode} style={styles.controlBtn} title="Theater mode">
//                   {isTheaterMode ? <MdOutlineFullscreenExit size={18} /> : <MdOutlineScreenShare size={18} />}
//                   <span style={{ marginLeft: 6 }}>{isTheaterMode ? "Exit" : "Theater"}</span>
//                 </button>
                
//                 <div style={{ position: "relative" }}>
//                   <button 
//                     onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
//                     style={styles.controlBtn}
//                     title="Playback speed"
//                   >
//                     <MdOutlineSpeed size={18} />
//                     <span style={{ marginLeft: 6 }}>{playbackSpeed}x</span>
//                   </button>
                  
//                   {showSpeedMenu && (
//                     <div style={styles.speedMenu}>
//                       {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
//                         <div 
//                           key={speed}
//                           onClick={() => changePlaybackSpeed(speed)}
//                           style={{
//                             ...styles.speedMenuItem,
//                             background: playbackSpeed === speed ? "#ff0000" : "transparent"
//                           }}
//                         >
//                           {speed}x {playbackSpeed === speed && <FiCheck size={14} style={{ marginLeft: 5 }} />}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Video Title */}
//             <h2 style={{ marginTop: "16px", fontSize: "24px", fontWeight: 700 }}>{video.title}</h2>

//             {/* Video Info Bar */}
//             <div style={styles.infoBar}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ color: "#aaa", fontSize: "14px", fontWeight: 500 }}>
//                   <FiPlay size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> 
//                   {formatViews(video.views)} views
//                 </span>
//                 <span style={{ color: "#666" }}>•</span>
//                 <span style={{ color: "#aaa", fontSize: "14px", fontWeight: 500 }}>
//                   {getTimeAgo(video.createdAt)}
//                 </span>
//               </div>

//               <div style={{ display: "flex", gap: 12 }}>
//                 {/* Like/Dislike */}
//                 <div style={styles.actionButtonGroup}>
//                   <button 
//                     onClick={likeVideo} 
//                     style={{
//                       ...styles.actionButton,
//                       borderRight: "1px solid #555",
//                       background: userLiked ? "#ff0000" : "transparent",
//                     }}
//                   >
//                     <FiThumbsUp size={16} /> <span style={{ marginLeft: 6 }}>{formatViews(likes)}</span>
//                   </button>
//                   <button 
//                     onClick={dislikeVideo} 
//                     style={{
//                       ...styles.actionButton,
//                       background: userDisliked ? "#ff0000" : "transparent"
//                     }}
//                   >
//                     <FiThumbsDown size={16} />
//                   </button>
//                 </div>

//                 {/* Share */}
//                 <button onClick={shareVideo} style={styles.actionButtonSingle}>
//                   <FiShare2 size={16} style={{ marginRight: 6 }} /> Share
//                 </button>
//               </div>
//             </div>

//             {/* Tags */}
//             {video.tags && video.tags.length > 0 && (
//               <div style={styles.tagsContainer}>
//                 {video.tags.map((t, i) => (
//                   <span key={i} style={styles.tag}>
//                     #{t}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {/* Channel Card */}
//             {channel && (
//               <div style={styles.channelCard}>
//                 <div 
//                   style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", flex: 1 }}
//                   onClick={() => navigate(`/profile/${channel._id}`)}
//                 >
//                   <div style={styles.channelAvatar}>
//                     {channel.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: 700, fontSize: "18px" }}>{channel.name}</div>
//                     <div style={{ color: "#aaa", fontSize: "13px" }}>
//                       {formatViews(channel.subscribers?.length || 0)} subscribers
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   style={subscribed ? styles.subscribedBtn : styles.subscribeBtn}
//                   onClick={toggleSubscribe}
//                 >
//                   {subscribed ? (
//                     <><FiCheck size={18} style={{ marginRight: 4 }}/> Subscribed</>
//                   ) : (
//                     <>Subscribe</>
//                   )}
//                 </button>
//               </div>
//             )}

//             {/* Description */}
//             <div style={styles.descriptionBox}>
//               <div 
//                 style={{ 
//                   maxHeight: showDescription ? "none" : "80px", 
//                   overflow: "hidden",
//                   whiteSpace: "pre-wrap",
//                   lineHeight: "1.6"
//                 }}
//               >
//                 {video.description || "No description available."}
//               </div>
//               {/* Only show 'Show more' button if description is long */}
//               {video.description && video.description.length > 150 && (
//                 <button 
//                   onClick={() => setShowDescription(!showDescription)}
//                   style={styles.showMoreBtn}
//                 >
//                   {showDescription ? "Show less" : "Show more"}
//                 </button>
//               )}
//             </div>

//             {/* 💬 Comments Section */}
//             <div style={{ marginTop: 28 }}>
//               <h3 style={{ fontSize: "20px", marginBottom: 20, fontWeight: 700 }}>
//                 <FiMessageSquare size={20} style={{ verticalAlign: 'middle', marginRight: 8 }}/>
//                 {video.comments?.length || 0} Comments
//               </h3>

//               {user ? (
//                 <div style={{ marginBottom: 24 }}>
//                   <div style={styles.commentInputContainer}>
//                     <div style={styles.commentAvatar}>
//                       {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
//                     </div>
//                     <input
//                       type="text"
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                       placeholder="Add a public comment..."
//                       style={styles.commentInput}
//                       onKeyPress={(e) => e.key === "Enter" && postComment()}
//                     />
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
//                     <button onClick={() => setComment("")} style={styles.cancelBtn}>Cancel</button>
//                     <button 
//                       onClick={postComment} 
//                       style={comment.trim() ? styles.commentPostBtn : styles.commentPostBtnDisabled}
//                       disabled={!comment.trim()}
//                     >
//                       Comment
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div style={{ padding: 16, background: "#272727", borderRadius: 12, marginBottom: 24, textAlign: "left" }}>
//                   <p style={{ margin: 0, fontSize: 14, color: "#ccc" }}>
//                     Want to comment? 
//                     <button 
//                       onClick={() => navigate("/login")} 
//                       style={styles.signInToCommentBtn}
//                     >
//                       Sign in
//                     </button>
//                   </p>
//                 </div>
//               )}

//               {/* Comments List */}
//               <div>
//                 {video.comments?.map((c) => (
//                   <div key={c._id} style={styles.commentCard}>
//                     <div style={styles.commentAvatar}>
//                       {c.user?.charAt(0).toUpperCase() || "U"}
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                         <span style={{ fontWeight: 600, fontSize: "14px" }}>
//                             {c.user} 
//                             {(user?.isAdmin || video.uploadedBy?._id === c.userId) && (
//                                 <span style={styles.adminBadge}>Admin</span>
//                             )}
//                         </span>
//                         <span style={{ color: "#aaa", fontSize: "12px" }}>
//                           {getTimeAgo(c.createdAt)}
//                         </span>
//                       </div>
//                       <p style={{ margin: 0, lineHeight: "1.5", fontSize: "15px", color: c.isPending ? "#999" : "#fff" }}>
//                           {c.text} {c.isPending && " (Sending...)"}
//                       </p>
                      
//                       {/* Deletion logic: Admin or Video Uploader */}
//                       {(user?.isAdmin || user?._id === video.uploadedBy?._id) && (
//                         <button onClick={() => deleteComment(c._id)} style={styles.deleteCommentBtn}>
//                           🗑️ Delete
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 📌 Recommended Videos Sidebar */}
//           {!isTheaterMode && (
//             <div style={{ width: 400, flexShrink: 0 }}>
//               <h3 style={{ fontSize: "18px", marginBottom: 16, fontWeight: 700 }}>
//                 <FiLayers size={18} style={{ verticalAlign: 'middle', marginRight: 8 }}/>
//                 {recommended.length > 0 && recommended.some(v => v.views > 1000) ? "Trending Videos" : "Recommended for You"}
//               </h3>
//               <div>
//                 {recommended.slice(0, 15).map((v) => (
//                   <div
//                     key={v._id}
//                     // Use a full page reload for proper state reset
//                     onClick={() => navigate(`/watch/${v.filename}`)} 
//                     style={styles.recommendedCard}
//                   >
//                     <img 
//                       src={`http://localhost:5000/uploads/${v.thumbnail}`} 
//                       style={styles.recommendedThumb} 
//                       alt={v.title}
//                       // Fallback for missing thumbnail
//                       onError={(e) => {
//                         e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="168" height="94"><rect fill="%23303030" width="168" height="94"/></svg>';
//                       }}
//                     />
//                     <div style={{ flex: 1 }}>
//                       <p style={styles.recommendedTitle}>{v.title}</p>
//                       <p style={styles.recommendedMeta}>
//                         {v.uploadedBy?.name || "Channel"}
//                       </p>
//                       <p style={styles.recommendedMeta}>
//                         {formatViews(v.views)} views • {getTimeAgo(v.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 {recommended.length === 0 && (
//                     <p style={{ color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 30 }}>
//                         No recommendations available yet. Start watching!
//                     </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         /* Global Spinner for loading state */
//         .spinner {
//           width: 48px;
//           height: 48px;
//           border: 4px solid #303030;
//           border-top-color: #ff0000;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         /* Hover effects for buttons/cards */
//         .recommended-card:hover {
//             background: rgba(255,255,255,0.05);
//         }
//         .action-button:hover, .action-button-single:hover {
//             background: #3a3a3a !important; /* Lighter shade for hover */
//         }
//       `}</style>
//     </>
//   );
// }

// /* =======================
//    🎨 Styles
// ======================= */
// const styles = {
//   // ... (Keeping most existing styles and refining a few)

//   // Player Controls
//   controlsOverlay: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     display: "flex",
//     gap: 8,
//     zIndex: 10
//   },
//   controlBtn: {
//     padding: "8px 12px",
//     background: "rgba(0,0,0,0.6)",
//     backdropFilter: "blur(8px)",
//     border: "none",
//     borderRadius: 8,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },
//   speedMenu: {
//     position: "absolute",
//     top: "100%",
//     right: 0,
//     marginTop: 8,
//     background: "rgba(28,28,28,0.98)",
//     backdropFilter: "blur(10px)",
//     borderRadius: 8,
//     overflow: "hidden",
//     minWidth: 120,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//     textAlign: "left",
//   },
//   speedMenuItem: {
//     padding: "10px 16px",
//     cursor: "pointer",
//     fontSize: "15px",
//     fontWeight: 500,
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   // Info Bar & Actions
//   infoBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 18,
//     paddingBottom: 16,
//     borderBottom: "1px solid #272727"
//   },
//   actionButtonGroup: {
//     display: "flex",
//     alignItems: "center",
//     background: "#272727",
//     borderRadius: 24,
//     overflow: "hidden",
//     transition: "box-shadow 0.2s"
//   },
//   actionButton: {
//     padding: "10px 16px",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     background: "transparent",
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },
//   actionButtonSingle: {
//     padding: "10px 20px",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     background: "#272727",
//     borderRadius: 24,
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },

//   // Tags
//   tagsContainer: {
//     display: "flex",
//     gap: 8,
//     flexWrap: "wrap",
//     marginTop: 12,
//     paddingBottom: 16,
//     borderBottom: "1px solid #272727"
//   },
//   tag: {
//     background: "#1f1f1f",
//     padding: "6px 14px",
//     borderRadius: 20,
//     fontSize: "13px",
//     color: "#3ea6ff", // Brighter link color for tags
//     fontWeight: 500,
//     cursor: 'pointer',
//     transition: 'background 0.2s'
//   },

//   // Channel
//   channelCard: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "20px 0",
//     borderBottom: "1px solid #272727"
//   },
//   channelAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "20px",
//     fontWeight: "bold",
//     color: "#fff",
//     flexShrink: 0
//   },
//   subscribeBtn: {
//     padding: "10px 24px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 24,
//     color: "#fff",
//     fontSize: "15px",
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s",
//   },
//   subscribedBtn: {
//     padding: "10px 24px",
//     background: "#404040",
//     border: "none",
//     borderRadius: 24,
//     color: "#fff",
//     fontSize: "15px",
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: 'center',
//   },

//   // Description
//   descriptionBox: {
//     background: "#1f1f1f",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 20,
//     marginBottom: 20
//   },
//   showMoreBtn: {
//     background: "none",
//     border: "none",
//     color: "#aaa",
//     cursor: "pointer",
//     marginTop: 8,
//     fontWeight: 600,
//     fontSize: "14px",
//     padding: 0
//   },

//   // Comments
//   commentInputContainer: {
//     display: "flex",
//     gap: 12,
//     alignItems: "flex-start"
//   },
//   commentAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "#555",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "16px",
//     fontWeight: "bold",
//     flexShrink: 0,
//     color: "#fff"
//   },
//   commentInput: {
//     flex: 1,
//     background: "transparent",
//     border: "none",
//     borderBottom: "2px solid #555",
//     color: "#fff",
//     padding: "8px 0",
//     fontSize: "15px",
//     outline: "none",
//     transition: "border-color 0.2s"
//   },
//   signInToCommentBtn: {
//       background: "none",
//       border: "none",
//       color: "#ff0000",
//       cursor: "pointer",
//       fontWeight: 600,
//       fontSize: "14px",
//       marginLeft: 5,
//       padding: 0
//   },
//   commentPostBtn: {
//     padding: "8px 18px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 20,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentPostBtnDisabled: {
//     padding: "8px 18px",
//     background: "#303030",
//     border: "none",
//     borderRadius: 20,
//     color: "#999",
//     cursor: "not-allowed",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentCard: {
//     display: "flex",
//     gap: 16,
//     padding: "16px 0",
//     borderBottom: "1px solid #1f1f1f"
//   },
//   adminBadge: {
//     background: '#ff0000',
//     color: '#fff',
//     fontSize: '10px',
//     padding: '2px 6px',
//     borderRadius: '4px',
//     marginLeft: '8px',
//     fontWeight: 'normal',
//     verticalAlign: 'middle',
//   },
//   deleteCommentBtn: {
//     marginTop: 8,
//     padding: "4px 12px",
//     background: "#500",
//     border: "none",
//     borderRadius: 16,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "12px"
//   },

//   // Recommended Sidebar
//   recommendedCard: {
//     display: "flex",
//     gap: 12,
//     marginBottom: 10,
//     cursor: "pointer",
//     padding: 8,
//     borderRadius: 8,
//     transition: "background 0.2s",
//   },
//   recommendedThumb: {
//     width: 168,
//     height: 94,
//     borderRadius: 8,
//     objectFit: "cover",
//     flexShrink: 0
//   },
//   recommendedTitle: {
//     margin: 0,
//     fontSize: "15px",
//     fontWeight: 600,
//     lineHeight: "1.3",
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden"
//   },
//   recommendedMeta: {
//     margin: "4px 0 0 0",
//     fontSize: "13px",
//     color: "#aaa"
//   }
// };

// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { 
//   FiThumbsUp, FiThumbsDown, FiShare2, FiBell, FiCheck, 
//   FiPlay, FiLayers, FiZap, FiMessageSquare, FiUser,
//   FiMoreVertical, FiFlag, FiDownload, FiList, FiClock,
//   FiBookmark, FiSend
// } from "react-icons/fi";
// import { MdOutlineScreenShare, MdOutlineFullscreenExit, MdOutlineSpeed, MdPlaylistAdd, MdOutlineWatchLater } from 'react-icons/md';

// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
  
//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [comment, setComment] = useState("");
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [userDisliked, setUserDisliked] = useState(false);
//   const [subscribed, setSubscribed] = useState(false);
//   const [showDescription, setShowDescription] = useState(false);
//   const [isTheaterMode, setIsTheaterMode] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [showMoreMenu, setShowMoreMenu] = useState(false);
//   const [videoQuality, setVideoQuality] = useState('auto');
//   const [showQualityMenu, setShowQualityMenu] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [isWatchLater, setIsWatchLater] = useState(false);
//   const [sortComments, setSortComments] = useState('top'); // 'top' or 'newest'
//   const [showTranscript, setShowTranscript] = useState(false);
//   const [videoProgress, setVideoProgress] = useState(0);
//   const [showChapters, setShowChapters] = useState(false);
//   const [chapters, setChapters] = useState([]);
//   const [currentChapter, setCurrentChapter] = useState(0);
//   const [autoplay, setAutoplay] = useState(true);
//   const [notifications, setNotifications] = useState('all'); // 'all', 'personalized', 'none'
//   const [showShareMenu, setShowShareMenu] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showSubtitles, setShowSubtitles] = useState(false);
//   const [commentFilter, setCommentFilter] = useState('all'); // 'all', 'creator'
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [showReplies, setShowReplies] = useState({});
  
//   const videoRef = useRef(null);
//   const playerContainerRef = useRef(null);

//   /* =======================
//       📌 Fetch Video
//   ======================== */
//   const fetchVideo = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
//       setVideo(res.data);
//       setLikes(res.data.likes?.length || 0);
//       setDislikes(res.data.dislikes?.length || 0);
      
//       if (user) {
//         setUserLiked(res.data.likes?.includes(user._id));
//         setUserDisliked(res.data.dislikes?.includes(user._id));
//         checkIfSaved(res.data._id);
//         checkIfWatchLater(res.data._id);
//       }

//       if (res.data.uploadedBy?._id) {
//         fetchChannel(res.data.uploadedBy._id);
//         fetchComments(res.data._id);
//       }

//       // Parse chapters from description
//       parseChapters(res.data.description);

//       if (user && res.data._id) {
//         addToHistory(res.data._id);
//       }
//     } catch (error) {
//         console.error("Error fetching video:", error);
//     }
//   };

//   /* =======================
//       📌 Parse Chapters
//   ======================== */
//   const parseChapters = (description) => {
//     if (!description) return;
    
//     const timestampRegex = /(\d{1,2}):(\d{2})\s+(.+)/g;
//     const foundChapters = [];
//     let match;
    
//     while ((match = timestampRegex.exec(description)) !== null) {
//       const minutes = parseInt(match[1]);
//       const seconds = parseInt(match[2]);
//       const title = match[3].trim();
//       foundChapters.push({
//         time: minutes * 60 + seconds,
//         title: title
//       });
//     }
    
//     if (foundChapters.length > 0) {
//       setChapters(foundChapters);
//     }
//   };

//   /* =======================
//       📌 Save/Watch Later
//   ======================== */
//   const checkIfSaved = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5000/api/user/saved/${videoId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setIsSaved(res.data.isSaved);
//     } catch (err) {
//       console.error("Error checking saved status:", err);
//     }
//   };

//   const checkIfWatchLater = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5000/api/user/watch-later/${videoId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setIsWatchLater(res.data.isWatchLater);
//     } catch (err) {
//       console.error("Error checking watch later status:", err);
//     }
//   };

//   const toggleSave = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     try {
//       await axios.post(`http://localhost:5000/api/user/save/${video._id}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setIsSaved(!isSaved);
//     } catch (err) {
//       console.error("Error toggling save:", err);
//     }
//   };

//   const toggleWatchLater = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     try {
//       await axios.post(`http://localhost:5000/api/user/watch-later/${video._id}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setIsWatchLater(!isWatchLater);
//     } catch (err) {
//       console.error("Error toggling watch later:", err);
//     }
//   };

//   /* =======================
//       📌 Fetch Channel
//   ======================== */
//   const fetchChannel = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
//     setChannel(res.data);
//     if (user) setSubscribed(res.data.subscribers?.includes(user._id));
//   };

//   /* =======================
//       📌 Fetch Comments
//   ======================== */
//   const fetchComments = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
//     setVideo((p) => ({ ...p, comments: res.data })); 
//   };

//   /* =======================
//       📺 Add to Watch History
//   ======================== */
//   const addToHistory = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/user/watch-history/add/${videoId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (err) {
//       console.error("Failed to add to history:", err);
//     }
//   };

//   /* =======================
//       📌 Recommendations
//   ======================== */
//   const fetchRecommended = async () => {
//     try {
//       const matrixRes = await axios.get(`http://localhost:5000/api/videos/similar/${filename}`);
      
//       if (matrixRes.data && matrixRes.data.length > 0) {
//         setRecommended(matrixRes.data.slice(0, 15));
//       } else {
//         throw new Error("Matrix returned empty");
//       }
//     } catch (err) {
//       try {
//         const allRes = await axios.get("http://localhost:5000/api/videos/all");
//         const popular = allRes.data
//           .filter(v => v.filename !== filename)
//           .sort((a, b) => (b.views || 0) - (a.views || 0))
//           .slice(0, 15);
//         setRecommended(popular);
//       } catch (fallbackErr) {
//         setRecommended([]);
//       }
//     }
//   };

//   /* =======================
//       📌 Update Views
//   ======================== */
//   const updateViews = async () => {
//     await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
//   };

//   useEffect(() => {
//     fetchVideo();
//     updateViews();
//   }, [filename, user?._id]); 

//   useEffect(() => {
//     if (video) fetchRecommended();
//   }, [video]); 

//   /* =======================
//       👍 Like + 👎 Dislike
//   ======================== */
//   const likeVideo = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/like/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const dislikeVideo = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/videos/dislike/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   /* =======================
//       🔔 Subscribe
//   ======================== */
//   const toggleSubscribe = async (e) => {
//     e.stopPropagation();
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `http://localhost:5000/api/user/subscribe/${channel._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setSubscribed(res.data.subscribed);
//     setChannel(p => ({ ...p, subscribers: res.data.subscribers || p.subscribers }));
//   };

//   /* =======================
//       💬 Comments
//   ======================== */
//   const postComment = async () => {
//     if (!comment.trim()) return;
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
    
//     const tempComment = {
//         _id: Date.now(),
//         user: user.name || user.username, 
//         text: comment,
//         createdAt: new Date().toISOString(),
//         isPending: true,
//         replies: []
//     };
//     setVideo(p => ({ 
//         ...p, 
//         comments: [tempComment, ...(p.comments || [])] 
//     }));
//     setComment("");

//     try {
//         await axios.post(
//           "http://localhost:5000/api/comments/add",
//           { videoId: video._id, text: tempComment.text },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         fetchComments(video._id); 
//     } catch (error) {
//         alert("Failed to post comment.");
//         setVideo(p => ({ 
//             ...p, 
//             comments: p.comments.filter(c => c._id !== tempComment._id)
//         }));
//     }
//   };

//   const postReply = async (commentId, replyText) => {
//     if (!replyText.trim()) return;
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
    
//     try {
//         await axios.post(
//           `http://localhost:5000/api/comments/reply/${commentId}`,
//           { text: replyText },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         fetchComments(video._id);
//         setReplyingTo(null);
//     } catch (error) {
//         alert("Failed to post reply.");
//     }
//   };

//   const deleteComment = async (cid) => {
//     if (!user?.isAdmin && video.uploadedBy._id !== user._id) return;
//     const token = localStorage.getItem("token");
//     try {
//         await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchComments(video._id);
//     } catch (error) {
//         alert("Failed to delete comment.");
//     }
//   };

//   /* =======================
//       🎬 Video Controls
//   ======================== */
//   const changePlaybackSpeed = (speed) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = speed;
//       setPlaybackSpeed(speed);
//       setShowSpeedMenu(false);
//     }
//   };

//   const toggleTheaterMode = () => {
//     setIsTheaterMode(!isTheaterMode);
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       playerContainerRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     setVolume(newVolume);
//     if (videoRef.current) {
//       videoRef.current.volume = newVolume;
//       setIsMuted(newVolume === 0);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const skipToChapter = (time) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = time;
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
//       setVideoProgress(progress);
      
//       // Update current chapter
//       const currentTime = videoRef.current.currentTime;
//       const chapterIndex = chapters.findIndex((ch, idx) => {
//         const nextChapter = chapters[idx + 1];
//         return currentTime >= ch.time && (!nextChapter || currentTime < nextChapter.time);
//       });
//       if (chapterIndex !== -1) setCurrentChapter(chapterIndex);
//     }
//   };

//   /* =======================
//       🔗 Share Options
//   ======================== */
//   const shareVideo = () => {
//     setShowShareMenu(!showShareMenu);
//   };

//   const copyVideoLink = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url);
//     alert("Video link copied! 📋");
//     setShowShareMenu(false);
//   };

//   const shareToTwitter = () => {
//     const url = window.location.href;
//     const text = `Check out: ${video.title}`;
//     window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
//     setShowShareMenu(false);
//   };

//   const shareToFacebook = () => {
//     const url = window.location.href;
//     window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
//     setShowShareMenu(false);
//   };

//   const shareToWhatsApp = () => {
//     const url = window.location.href;
//     const text = `Check out: ${video.title} ${url}`;
//     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
//     setShowShareMenu(false);
//   };

//   const embedCode = () => {
//     const embedUrl = `<iframe width="560" height="315" src="${window.location.origin}/embed/${video.filename}" frameborder="0" allowfullscreen></iframe>`;
//     navigator.clipboard.writeText(embedUrl);
//     alert("Embed code copied! 📋");
//     setShowShareMenu(false);
//   };

//   /* =======================
//       📊 Report Video
//   ======================== */
//   const reportVideo = () => {
//     if (!user) return navigate("/login");
//     alert("Report functionality will be implemented. This will open a report dialog.");
//     setShowMoreMenu(false);
//   };

//   /* =======================
//       🎨 Utility Functions
//   ======================== */
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
//       year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60,
//     };

//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
//     }
//     return "Just now";
//   };

//   const getSortedComments = () => {
//     if (!video?.comments) return [];
//     let filtered = [...video.comments];
    
//     if (commentFilter === 'creator') {
//       filtered = filtered.filter(c => c.userId === video.uploadedBy._id);
//     }
    
//     if (sortComments === 'newest') {
//       return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     }
//     return filtered; // 'top' sorting (default)
//   };

//   /* =======================
//       ⏳ Loading UI
//   ======================== */
//   if (!video) {
//     return (
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ textAlign: "center" }}>
//           <div className="spinner"></div>
//           <h2 style={{ color: "#fff", marginTop: 20 }}>Loading video...</h2>
//         </div>
//       </div>
//     );
//   }

//   /* =======================
//       ✅ Render
//   ======================== */
//   return (
//     <>
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
//         <div style={{ 
//           display: "flex", 
//           gap: 24, 
//           padding: 20,
//           maxWidth: isTheaterMode ? "100%" : "1800px",
//           margin: "0 auto"
//         }}>
//           {/* 🎬 MAIN VIDEO SECTION */}
//           <div style={{ flex: 1, maxWidth: isTheaterMode ? "100%" : "calc(100% - 424px)" }}>
//             {/* Video Player */}
//             <div ref={playerContainerRef} style={{ position: "relative", background: "#000" }}>
//               <video
//                 ref={videoRef}
//                 src={`http://localhost:5000/api/stream/${video.filename}`}
//                 controls
//                 autoPlay
//                 onTimeUpdate={handleTimeUpdate}
//                 style={{ 
//                   width: "100%", 
//                   borderRadius: isTheaterMode ? "0" : "12px", 
//                   background: "#000",
//                   maxHeight: isTheaterMode ? "90vh" : "750px"
//                 }}
//                 title={video.title}
//                 preload="auto"
//               />
              
//               {/* Chapters Overlay */}
//               {chapters.length > 0 && (
//                 <div style={styles.chaptersOverlay}>
//                   <button 
//                     onClick={() => setShowChapters(!showChapters)}
//                     style={styles.chaptersBtn}
//                   >
//                     <FiList size={16} />
//                     <span style={{ marginLeft: 6 }}>
//                       {chapters[currentChapter]?.title || 'Chapters'}
//                     </span>
//                   </button>
                  
//                   {showChapters && (
//                     <div style={styles.chaptersMenu}>
//                       {chapters.map((ch, idx) => (
//                         <div
//                           key={idx}
//                           onClick={() => {
//                             skipToChapter(ch.time);
//                             setShowChapters(false);
//                           }}
//                           style={{
//                             ...styles.chapterItem,
//                             background: currentChapter === idx ? '#ff0000' : 'transparent'
//                           }}
//                         >
//                           <span style={{ color: '#aaa', fontSize: 12 }}>
//                             {Math.floor(ch.time / 60)}:{String(ch.time % 60).padStart(2, '0')}
//                           </span>
//                           <span style={{ marginLeft: 8 }}>{ch.title}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
              
//               {/* Custom Controls Overlay */}
//               <div style={styles.controlsOverlay}>
//                 <button onClick={toggleTheaterMode} style={styles.controlBtn} title="Theater mode">
//                   {isTheaterMode ? <MdOutlineFullscreenExit size={18} /> : <MdOutlineScreenShare size={18} />}
//                 </button>
                
//                 <div style={{ position: "relative" }}>
//                   <button 
//                     onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
//                     style={styles.controlBtn}
//                     title="Playback speed"
//                   >
//                     <MdOutlineSpeed size={18} />
//                     <span style={{ marginLeft: 6 }}>{playbackSpeed}x</span>
//                   </button>
                  
//                   {showSpeedMenu && (
//                     <div style={styles.speedMenu}>
//                       {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
//                         <div 
//                           key={speed}
//                           onClick={() => changePlaybackSpeed(speed)}
//                           style={{
//                             ...styles.speedMenuItem,
//                             background: playbackSpeed === speed ? "#ff0000" : "transparent"
//                           }}
//                         >
//                           {speed}x {playbackSpeed === speed && <FiCheck size={14} />}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ position: "relative" }}>
//                   <button 
//                     onClick={() => setShowQualityMenu(!showQualityMenu)} 
//                     style={styles.controlBtn}
//                     title="Quality"
//                   >
//                     <FiZap size={18} />
//                     <span style={{ marginLeft: 6 }}>{videoQuality}</span>
//                   </button>
                  
//                   {showQualityMenu && (
//                     <div style={styles.speedMenu}>
//                       {['auto', '1080p', '720p', '480p', '360p'].map(quality => (
//                         <div 
//                           key={quality}
//                           onClick={() => {
//                             setVideoQuality(quality);
//                             setShowQualityMenu(false);
//                           }}
//                           style={{
//                             ...styles.speedMenuItem,
//                             background: videoQuality === quality ? "#ff0000" : "transparent"
//                           }}
//                         >
//                           {quality} {videoQuality === quality && <FiCheck size={14} />}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Video Title */}
//             <h2 style={{ marginTop: "16px", fontSize: "24px", fontWeight: 700 }}>{video.title}</h2>

//             {/* Video Info Bar */}
//             <div style={styles.infoBar}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ color: "#aaa", fontSize: "14px", fontWeight: 500 }}>
//                   <FiPlay size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> 
//                   {formatViews(video.views)} views
//                 </span>
//                 <span style={{ color: "#666" }}>•</span>
//                 <span style={{ color: "#aaa", fontSize: "14px", fontWeight: 500 }}>
//                   {getTimeAgo(video.createdAt)}
//                 </span>
//               </div>

//               <div style={{ display: "flex", gap: 12, flexWrap: 'wrap' }}>
//                 {/* Like/Dislike */}
//                 <div style={styles.actionButtonGroup}>
//                   <button 
//                     onClick={likeVideo} 
//                     style={{
//                       ...styles.actionButton,
//                       borderRight: "1px solid #555",
//                       background: userLiked ? "#ff0000" : "transparent",
//                     }}
//                   >
//                     <FiThumbsUp size={16} /> <span style={{ marginLeft: 6 }}>{formatViews(likes)}</span>
//                   </button>
//                   <button 
//                     onClick={dislikeVideo} 
//                     style={{
//                       ...styles.actionButton,
//                       background: userDisliked ? "#ff0000" : "transparent"
//                     }}
//                   >
//                     <FiThumbsDown size={16} />
//                   </button>
//                 </div>

//                 {/* Share */}
//                 <div style={{ position: 'relative' }}>
//                   <button onClick={shareVideo} style={styles.actionButtonSingle}>
//                     <FiShare2 size={16} style={{ marginRight: 6 }} /> Share
//                   </button>
                  
//                   {showShareMenu && (
//                     <div style={styles.shareMenu}>
//                       <div onClick={copyVideoLink} style={styles.shareMenuItem}>
//                         <FiShare2 size={16} /> Copy link
//                       </div>
//                       <div onClick={shareToTwitter} style={styles.shareMenuItem}>
//                         <FiSend size={16} /> Twitter
//                       </div>
//                       <div onClick={shareToFacebook} style={styles.shareMenuItem}>
//                         <FiSend size={16} /> Facebook
//                       </div>
//                       <div onClick={shareToWhatsApp} style={styles.shareMenuItem}>
//                         <FiSend size={16} /> WhatsApp
//                       </div>
//                       <div onClick={embedCode} style={styles.shareMenuItem}>
//                         <FiShare2 size={16} /> Embed
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Save */}
//                 <button onClick={toggleSave} style={{
//                   ...styles.actionButtonSingle,
//                   background: isSaved ? "#ff0000" : "#272727"
//                 }}>
//                   <FiBookmark size={16} style={{ marginRight: 6 }} /> 
//                   {isSaved ? 'Saved' : 'Save'}
//                 </button>

//                 {/* Watch Later */}
//                 <button onClick={toggleWatchLater} style={{
//                   ...styles.actionButtonSingle,
//                   background: isWatchLater ? "#ff0000" : "#272727"
//                 }}>
//                   <MdOutlineWatchLater size={16} style={{ marginRight: 6 }} /> 
//                   {isWatchLater ? 'Added' : 'Watch later'}
//                 </button>

//                 {/* More Menu */}
//                 <div style={{ position: 'relative' }}>
//                   <button 
//                     onClick={() => setShowMoreMenu(!showMoreMenu)}
//                     style={styles.actionButtonSingle}
//                   >
//                     <FiMoreVertical size={16} />
//                   </button>
                  
//                   {showMoreMenu && (
//                     <div style={styles.moreMenu}>
//                       <div onClick={reportVideo} style={styles.moreMenuItem}>
//                         <FiFlag size={16} /> Report
//                       </div>
//                       <div onClick={() => {
//                         setShowTranscript(!showTranscript);
//                         setShowMoreMenu(false);
//                       }} style={styles.moreMenuItem}>
//                         <FiMessageSquare size={16} /> Show transcript
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div style={styles.progressBarContainer}>
//               <div style={{ ...styles.progressBar, width: `${videoProgress}%` }} />
//             </div>

//             {/* Tags */}
//             {video.tags && video.tags.length > 0 && (
//               <div style={styles.tagsContainer}>
//                 {video.tags.map((t, i) => (
//                   <span key={i} style={styles.tag}>
//                     #{t}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {/* Channel Card */}
//             {channel && (
//               <div style={styles.channelCard}>
//                 <div 
//                   style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", flex: 1 }}
//                   onClick={() => navigate(`/profile/${channel._id}`)}
//                 >
//                   <div style={styles.channelAvatar}>
//                     {channel.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: 700, fontSize: "18px" }}>{channel.name}</div>
//                     <div style={{ color: "#aaa", fontSize: "13px" }}>
//                       {formatViews(channel.subscribers?.length || 0)} subscribers
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//                   {subscribed && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setNotifications(notifications === 'all' ? 'personalized' : 'all');
//                       }}
//                       style={styles.notificationBtn}
//                       title="Notification preferences"
//                     >
//                       <FiBell size={18} />
//                     </button>
//                   )}
//                   <button
//                     style={subscribed ? styles.subscribedBtn : styles.subscribeBtn}
//                     onClick={toggleSubscribe}
//                   >
//                     {subscribed ? (
//                       <><FiCheck size={18} style={{ marginRight: 4 }}/> Subscribed</>
//                     ) : (
//                       <>Subscribe</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Description */}
//             <div style={styles.descriptionBox}>
//               <div 
//                 style={{ 
//                   maxHeight: showDescription ? "none" : "80px", 
//                   overflow: "hidden",
//                   whiteSpace: "pre-wrap",
//                   lineHeight: "1.6"
//                 }}
//               >
//                 {video.description || "No description available."}
//               </div>
//               {video.description && video.description.length > 150 && (
//                 <button 
//                   onClick={() => setShowDescription(!showDescription)}
//                   style={styles.showMoreBtn}
//                 >
//                   {showDescription ? "Show less" : "Show more"}
//                 </button>
//               )}
//             </div>

//             {/* Transcript */}
//             {showTranscript && (
//               <div style={styles.transcriptBox}>
//                 <h4 style={{ marginBottom: 12 }}>Transcript</h4>
//                 <p style={{ color: '#aaa', fontSize: 14 }}>
//                   Transcript feature coming soon. This will show the video transcript with timestamps.
//                 </p>
//               </div>
//             )}

//             {/* 💬 Comments Section */}
//             <div style={{ marginTop: 28 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//                 <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
//                   <FiMessageSquare size={20} style={{ verticalAlign: 'middle', marginRight: 8 }}/>
//                   {video.comments?.length || 0} Comments
//                 </h3>
                
//                 <div style={{ display: 'flex', gap: 12 }}>
//                   <select 
//                     value={sortComments}
//                     onChange={(e) => setSortComments(e.target.value)}
//                     style={styles.sortSelect}
//                   >
//                     <option value="top">Top comments</option>
//                     <option value="newest">Newest first</option>
//                   </select>
                  
//                   <select
//                     value={commentFilter}
//                     onChange={(e) => setCommentFilter(e.target.value)}
//                     style={styles.sortSelect}
//                   >
//                     <option value="all">All comments</option>
//                     <option value="creator">From creator</option>
//                   </select>
//                 </div>
//               </div>

//               {user ? (
//                 <div style={{ marginBottom: 24 }}>
//                   <div style={styles.commentInputContainer}>
//                     <div style={styles.commentAvatar}>
//                       {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
//                     </div>
//                     <input
//                       type="text"
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                       placeholder="Add a public comment..."
//                       style={styles.commentInput}
//                       onKeyPress={(e) => e.key === "Enter" && postComment()}
//                     />
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
//                     <button onClick={() => setComment("")} style={styles.cancelBtn}>Cancel</button>
//                     <button 
//                       onClick={postComment} 
//                       style={comment.trim() ? styles.commentPostBtn : styles.commentPostBtnDisabled}
//                       disabled={!comment.trim()}
//                     >
//                       Comment
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div style={{ padding: 16, background: "#272727", borderRadius: 12, marginBottom: 24, textAlign: "left" }}>
//                   <p style={{ margin: 0, fontSize: 14, color: "#ccc" }}>
//                     Want to comment? 
//                     <button 
//                       onClick={() => navigate("/login")} 
//                       style={styles.signInToCommentBtn}
//                     >
//                       Sign in
//                     </button>
//                   </p>
//                 </div>
//               )}

//               {/* Comments List */}
//               <div>
//                 {getSortedComments().map((c) => (
//                   <div key={c._id}>
//                     <div style={styles.commentCard}>
//                       <div style={styles.commentAvatar}>
//                         {c.user?.charAt(0).toUpperCase() || "U"}
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                           <span style={{ fontWeight: 600, fontSize: "14px" }}>
//                               {c.user} 
//                               {(user?.isAdmin || video.uploadedBy?._id === c.userId) && (
//                                   <span style={styles.adminBadge}>
//                                     {video.uploadedBy?._id === c.userId ? 'Creator' : 'Admin'}
//                                   </span>
//                               )}
//                           </span>
//                           <span style={{ color: "#aaa", fontSize: "12px" }}>
//                             {getTimeAgo(c.createdAt)}
//                           </span>
//                         </div>
//                         <p style={{ margin: 0, lineHeight: "1.5", fontSize: "15px", color: c.isPending ? "#999" : "#fff" }}>
//                             {c.text} {c.isPending && " (Sending...)"}
//                         </p>
                        
//                         <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
//                           <button style={styles.commentActionBtn}>
//                             <FiThumbsUp size={14} /> <span style={{ marginLeft: 4 }}>{c.likes || 0}</span>
//                           </button>
//                           <button style={styles.commentActionBtn}>
//                             <FiThumbsDown size={14} />
//                           </button>
//                           <button 
//                             onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
//                             style={styles.commentActionBtn}
//                           >
//                             Reply
//                           </button>
//                           {(user?.isAdmin || user?._id === video.uploadedBy?._id) && (
//                             <button onClick={() => deleteComment(c._id)} style={styles.deleteCommentBtn}>
//                               Delete
//                             </button>
//                           )}
//                         </div>

//                         {/* Reply Input */}
//                         {replyingTo === c._id && (
//                           <div style={{ marginTop: 12 }}>
//                             <div style={styles.commentInputContainer}>
//                               <div style={styles.commentAvatarSmall}>
//                                 {user?.name?.charAt(0).toUpperCase() || "U"}
//                               </div>
//                               <input
//                                 type="text"
//                                 placeholder={`Reply to ${c.user}...`}
//                                 style={styles.commentInput}
//                                 onKeyPress={(e) => {
//                                   if (e.key === "Enter" && e.target.value.trim()) {
//                                     postReply(c._id, e.target.value);
//                                     e.target.value = "";
//                                   }
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         )}

//                         {/* Show Replies */}
//                         {c.replies && c.replies.length > 0 && (
//                           <div style={{ marginTop: 12 }}>
//                             <button
//                               onClick={() => setShowReplies(prev => ({
//                                 ...prev,
//                                 [c._id]: !prev[c._id]
//                               }))}
//                               style={styles.showRepliesBtn}
//                             >
//                               {showReplies[c._id] ? '▼' : '▶'} {c.replies.length} {c.replies.length === 1 ? 'reply' : 'replies'}
//                             </button>
                            
//                             {showReplies[c._id] && (
//                               <div style={{ marginLeft: 40, marginTop: 12 }}>
//                                 {c.replies.map((reply) => (
//                                   <div key={reply._id} style={styles.replyCard}>
//                                     <div style={styles.commentAvatarSmall}>
//                                       {reply.user?.charAt(0).toUpperCase() || "U"}
//                                     </div>
//                                     <div style={{ flex: 1 }}>
//                                       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                                         <span style={{ fontWeight: 600, fontSize: "13px" }}>
//                                           {reply.user}
//                                         </span>
//                                         <span style={{ color: "#aaa", fontSize: "11px" }}>
//                                           {getTimeAgo(reply.createdAt)}
//                                         </span>
//                                       </div>
//                                       <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
//                                         {reply.text}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 📌 Recommended Videos Sidebar */}
//           {!isTheaterMode && (
//             <div style={{ width: 400, flexShrink: 0 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                 <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
//                   <FiLayers size={18} style={{ verticalAlign: 'middle', marginRight: 8 }}/>
//                   Up next
//                 </h3>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
//                   <input
//                     type="checkbox"
//                     checked={autoplay}
//                     onChange={(e) => setAutoplay(e.target.checked)}
//                     style={{ width: 16, height: 16, cursor: 'pointer' }}
//                   />
//                   Autoplay
//                 </label>
//               </div>
//               <div>
//                 {recommended.slice(0, 15).map((v, idx) => (
//                   <div
//                     key={v._id}
//                     onClick={() => navigate(`/watch/${v.filename}`)} 
//                     style={{
//                       ...styles.recommendedCard,
//                       borderLeft: idx === 0 && autoplay ? '3px solid #ff0000' : 'none',
//                       paddingLeft: idx === 0 && autoplay ? 5 : 8
//                     }}
//                   >
//                     <div style={{ position: 'relative' }}>
//                       <img 
//                         src={`http://localhost:5000/uploads/${v.thumbnail}`} 
//                         style={styles.recommendedThumb} 
//                         alt={v.title}
//                         onError={(e) => {
//                           e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="168" height="94"><rect fill="%23303030" width="168" height="94"/></svg>';
//                         }}
//                       />
//                       {idx === 0 && autoplay && (
//                         <div style={styles.autoplayBadge}>
//                           <FiPlay size={12} /> UP NEXT
//                         </div>
//                       )}
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <p style={styles.recommendedTitle}>{v.title}</p>
//                       <p style={styles.recommendedMeta}>
//                         {v.uploadedBy?.name || "Channel"}
//                       </p>
//                       <p style={styles.recommendedMeta}>
//                         {formatViews(v.views)} views • {getTimeAgo(v.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 {recommended.length === 0 && (
//                     <p style={{ color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 30 }}>
//                         No recommendations available yet.
//                     </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         .spinner {
//           width: 48px;
//           height: 48px;
//           border: 4px solid #303030;
//           border-top-color: #ff0000;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </>
//   );
// }

// /* =======================
//    🎨 Styles
// ======================= */
// const styles = {
//   controlsOverlay: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     display: "flex",
//     gap: 8,
//     zIndex: 10
//   },
//   controlBtn: {
//     padding: "8px 12px",
//     background: "rgba(0,0,0,0.8)",
//     backdropFilter: "blur(8px)",
//     border: "none",
//     borderRadius: 8,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     transition: "all 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },
//   speedMenu: {
//     position: "absolute",
//     top: "100%",
//     right: 0,
//     marginTop: 8,
//     background: "rgba(28,28,28,0.98)",
//     backdropFilter: "blur(10px)",
//     borderRadius: 8,
//     overflow: "hidden",
//     minWidth: 120,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//     textAlign: "left",
//     zIndex: 100
//   },
//   speedMenuItem: {
//     padding: "10px 16px",
//     cursor: "pointer",
//     fontSize: "15px",
//     fontWeight: 500,
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   chaptersOverlay: {
//     position: "absolute",
//     bottom: 60,
//     left: 12,
//     zIndex: 10
//   },
//   chaptersBtn: {
//     padding: "8px 12px",
//     background: "rgba(0,0,0,0.8)",
//     backdropFilter: "blur(8px)",
//     border: "none",
//     borderRadius: 8,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//   },
//   chaptersMenu: {
//     position: "absolute",
//     bottom: "100%",
//     left: 0,
//     marginBottom: 8,
//     background: "rgba(28,28,28,0.98)",
//     backdropFilter: "blur(10px)",
//     borderRadius: 8,
//     overflow: "auto",
//     maxHeight: 300,
//     minWidth: 250,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//   },
//   chapterItem: {
//     padding: "10px 16px",
//     cursor: "pointer",
//     fontSize: "14px",
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },
//   infoBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 18,
//     paddingBottom: 16,
//     borderBottom: "1px solid #272727",
//     flexWrap: 'wrap',
//     gap: 12
//   },
//   actionButtonGroup: {
//     display: "flex",
//     alignItems: "center",
//     background: "#272727",
//     borderRadius: 24,
//     overflow: "hidden",
//   },
//   actionButton: {
//     padding: "10px 16px",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     background: "transparent",
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },
//   actionButtonSingle: {
//     padding: "10px 20px",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     background: "#272727",
//     borderRadius: 24,
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },
//   shareMenu: {
//     position: "absolute",
//     top: "100%",
//     right: 0,
//     marginTop: 8,
//     background: "rgba(28,28,28,0.98)",
//     borderRadius: 8,
//     overflow: "hidden",
//     minWidth: 200,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//     zIndex: 100
//   },
//   shareMenuItem: {
//     padding: "12px 16px",
//     cursor: "pointer",
//     fontSize: "14px",
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     transition: "background 0.2s",
//     borderBottom: "1px solid #333"
//   },
//   moreMenu: {
//     position: "absolute",
//     top: "100%",
//     right: 0,
//     marginTop: 8,
//     background: "rgba(28,28,28,0.98)",
//     borderRadius: 8,
//     overflow: "hidden",
//     minWidth: 180,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//     zIndex: 100
//   },
//   moreMenuItem: {
//     padding: "12px 16px",
//     cursor: "pointer",
//     fontSize: "14px",
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     transition: "background 0.2s",
//     borderBottom: "1px solid #333"
//   },
//   progressBarContainer: {
//     width: '100%',
//     height: 4,
//     background: '#404040',
//     borderRadius: 2,
//     marginTop: 8,
//     overflow: 'hidden'
//   },
//   progressBar: {
//     height: '100%',
//     background: '#ff0000',
//     transition: 'width 0.1s'
//   },
//   tagsContainer: {
//     display: "flex",
//     gap: 8,
//     flexWrap: "wrap",
//     marginTop: 12,
//     paddingBottom: 16,
//     borderBottom: "1px solid #272727"
//   },
//   tag: {
//     background: "#1f1f1f",
//     padding: "6px 14px",
//     borderRadius: 20,
//     fontSize: "13px",
//     color: "#3ea6ff",
//     fontWeight: 500,
//     cursor: 'pointer',
//     transition: 'background 0.2s'
//   },
//   channelCard: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "20px 0",
//     borderBottom: "1px solid #272727"
//   },
//   channelAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "20px",
//     fontWeight: "bold",
//     color: "#fff",
//     flexShrink: 0
//   },
//   subscribeBtn: {
//     padding: "10px 24px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 24,
//     color: "#fff",
//     fontSize: "15px",
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s",
//   },
//   subscribedBtn: {
//     padding: "10px 24px",
//     background: "#404040",
//     border: "none",
//     borderRadius: 24,
//     color: "#fff",
//     fontSize: "15px",
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s",
//     display: "flex",
//     alignItems: 'center',
//   },
//   notificationBtn: {
//     padding: "10px",
//     background: "#272727",
//     border: "none",
//     borderRadius: "50%",
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "background 0.2s"
//   },
//   descriptionBox: {
//     background: "#1f1f1f",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 20
//   },
//   showMoreBtn: {
//     background: "none",
//     border: "none",
//     color: "#aaa",
//     cursor: "pointer",
//     marginTop: 8,
//     fontWeight: 600,
//     fontSize: "14px",
//     padding: 0
//   },
//   transcriptBox: {
//     background: "#1f1f1f",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 12,
//     marginBottom: 20
//   },
//   commentInputContainer: {
//     display: "flex",
//     gap: 12,
//     alignItems: "flex-start"
//   },
//   commentAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "#555",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "16px",
//     fontWeight: "bold",
//     flexShrink: 0,
//     color: "#fff"
//   },
//   commentAvatarSmall: {
//     width: 32,
//     height: 32,
//     borderRadius: "50%",
//     background: "#555",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "14px",
//     fontWeight: "bold",
//     flexShrink: 0,
//     color: "#fff"
//   },
//   commentInput: {
//     flex: 1,
//     background: "transparent",
//     border: "none",
//     borderBottom: "2px solid #555",
//     color: "#fff",
//     padding: "8px 0",
//     fontSize: "15px",
//     outline: "none",
//     transition: "border-color 0.2s"
//   },
//   sortSelect: {
//     background: "#272727",
//     border: "none",
//     color: "#fff",
//     padding: "8px 12px",
//     borderRadius: 8,
//     fontSize: 14,
//     cursor: "pointer",
//     outline: "none"
//   },
//   signInToCommentBtn: {
//       background: "none",
//       border: "none",
//       color: "#ff0000",
//       cursor: "pointer",
//       fontWeight: 600,
//       fontSize: "14px",
//       marginLeft: 5,
//       padding: 0
//   },
//   cancelBtn: {
//     padding: "8px 18px",
//     background: "transparent",
//     border: "none",
//     borderRadius: 20,
//     color: "#aaa",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentPostBtn: {
//     padding: "8px 18px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 20,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentPostBtnDisabled: {
//     padding: "8px 18px",
//     background: "#303030",
//     border: "none",
//     borderRadius: 20,
//     color: "#999",
//     cursor: "not-allowed",
//     fontSize: "14px",
//     fontWeight: 600
//   },
//   commentCard: {
//     display: "flex",
//     gap: 16,
//     padding: "16px 0",
//     borderBottom: "1px solid #1f1f1f"
//   },
//   replyCard: {
//     display: "flex",
//     gap: 12,
//     padding: "12px 0",
//     borderBottom: "1px solid #1f1f1f"
//   },
//   adminBadge: {
//     background: '#ff0000',
//     color: '#fff',
//     fontSize: '10px',
//     padding: '2px 6px',
//     borderRadius: '4px',
//     marginLeft: '8px',
//     fontWeight: 'normal',
//     verticalAlign: 'middle',
//   },
//   commentActionBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#aaa",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     padding: "4px 8px",
//     borderRadius: 16,
//     transition: "background 0.2s"
//   },
//   deleteCommentBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#ff4444",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 600,
//     padding: "4px 8px"
//   },
//   showRepliesBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#3ea6ff",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     gap: 6
//   },
//   recommendedCard: {
//     display: "flex",
//     gap: 12,
//     marginBottom: 10,
//     cursor: "pointer",
//     padding: 8,
//     borderRadius: 8,
//     transition: "background 0.2s",
//   },
//   recommendedThumb: {
//     width: 168,
//     height: 94,
//     borderRadius: 8,
//     objectFit: "cover",
//     flexShrink: 0
//   },
//   recommendedTitle: {
//     margin: 0,
//     fontSize: "15px",
//     fontWeight: 600,
//     lineHeight: "1.3",
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden"
//   },
//   recommendedMeta: {
//     margin: "4px 0 0 0",
//     fontSize: "13px",
//     color: "#aaa"
//   },
//   autoplayBadge: {
//     position: 'absolute',
//     bottom: 4,
//     right: 4,
//     background: 'rgba(0,0,0,0.8)',
//     color: '#fff',
//     padding: '2px 6px',
//     fontSize: 10,
//     fontWeight: 600,
//     borderRadius: 4,
//     display: 'flex',
//     alignItems: 'center',
//     gap: 4
//   }
// };

import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiThumbsUp, FiThumbsDown, FiShare2, FiBell, FiCheck, 
  FiPlay, FiLayers, FiZap, FiMessageSquare, FiUser,
  FiMoreVertical, FiFlag, FiDownload, FiList, FiClock,
  FiBookmark, FiSend
} from "react-icons/fi";
import { MdOutlineScreenShare, MdOutlineFullscreenExit, MdOutlineSpeed, MdPlaylistAdd, MdOutlineWatchLater } from 'react-icons/md';

export default function Watch() {
  const { filename } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [sortComments, setSortComments] = useState('top'); // 'top' or 'newest'
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showChapters, setShowChapters] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [autoplay, setAutoplay] = useState(true); // Default state is ON
  const [notifications, setNotifications] = useState('all'); // 'all', 'personalized', 'none'
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [commentFilter, setCommentFilter] = useState('all'); // 'all', 'creator'
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  /* =======================
      📌 Core Fetches (Unchanged)
  ======================== */
  const fetchVideo = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
      setVideo(res.data);
      setLikes(res.data.likes?.length || 0);
      setDislikes(res.data.dislikes?.length || 0);
      
      if (user) {
        setUserLiked(res.data.likes?.includes(user._id));
        setUserDisliked(res.data.dislikes?.includes(user._id));
        checkIfSaved(res.data._id);
        checkIfWatchLater(res.data._id);
      }

      if (res.data.uploadedBy?._id) {
        fetchChannel(res.data.uploadedBy._id);
        fetchComments(res.data._id);
      }

      parseChapters(res.data.description);

      if (user && res.data._id) {
        addToHistory(res.data._id);
      }
    } catch (error) {
        console.error("Error fetching video:", error);
    }
  };

  const parseChapters = (description) => {
    if (!description) return setChapters([]);
    
    const timestampRegex = /(\d{1,2}):(\d{2})\s+(.+)/g;
    const foundChapters = [];
    let match;
    
    while ((match = timestampRegex.exec(description)) !== null) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const title = match[3].trim();
      foundChapters.push({
        time: minutes * 60 + seconds,
        title: title
      });
    }
    
    setChapters(foundChapters);
  };

  const checkIfSaved = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/saved/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error("Error checking saved status:", err);
    }
  };

  const checkIfWatchLater = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/watch-later/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsWatchLater(res.data.isWatchLater);
    } catch (err) {
      console.error("Error checking watch later status:", err);
    }
  };

  const toggleSave = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:5000/api/user/save/${video._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const toggleWatchLater = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:5000/api/user/watch-later/${video._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsWatchLater(!isWatchLater);
    } catch (err) {
      console.error("Error toggling watch later:", err);
    }
  };

  const fetchChannel = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
    setChannel(res.data);
    if (user) setSubscribed(res.data.subscribers?.includes(user._id));
  };

  const fetchComments = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
    setVideo((p) => ({ ...p, comments: res.data })); 
  };

  const addToHistory = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `http://localhost:5000/api/user/watch-history/add/${videoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to add to history:", err);
    }
  };

  const fetchRecommended = async () => {
    try {
      const matrixRes = await axios.get(`http://localhost:5000/api/videos/similar/${filename}`);
      
      if (matrixRes.data && matrixRes.data.length > 0) {
        setRecommended(matrixRes.data.slice(0, 15));
      } else {
        throw new Error("Matrix returned empty");
      }
    } catch (err) {
      try {
        const allRes = await axios.get("http://localhost:5000/api/videos/all");
        const popular = allRes.data
          .filter(v => v.filename !== filename)
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 15);
        setRecommended(popular);
      } catch (fallbackErr) {
        setRecommended([]);
      }
    }
  };

  const updateViews = async () => {
    await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
  };

  useEffect(() => {
    fetchVideo();
    updateViews();
  }, [filename, user?._id]); 

  useEffect(() => {
    if (video) fetchRecommended();
  }, [video]); 

  /* =======================
      📌 Autoplay Logic (FIX)
  ======================== */
  const handleVideoEnd = () => {
    if (autoplay && recommended.length > 0) {
      // Get the next video in the recommended list (which is the first one)
      const nextVideo = recommended[0];
      if (nextVideo && nextVideo.filename) {
        // Navigate to the next video's watch page
        navigate(`/watch/${nextVideo.filename}`);
      }
    }
  };
  
  /* =======================
      👍 Like + 👎 Dislike (Unchanged)
  ======================== */
  const likeVideo = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/videos/like/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
    setUserLiked(res.data.likes.includes(user._id));
    setUserDisliked(res.data.dislikes.includes(user._id));
  };

  const dislikeVideo = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/videos/dislike/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
    setUserLiked(res.data.likes.includes(user._id));
    setUserDisliked(res.data.dislikes.includes(user._id));
  };

  /* =======================
      🔔 Subscribe (Unchanged)
  ======================== */
  const toggleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/user/subscribe/${channel._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubscribed(res.data.subscribed);
    setChannel(p => ({ ...p, subscribers: res.data.subscribers || p.subscribers }));
  };

  /* =======================
      💬 Comments (Unchanged)
  ======================== */
  const postComment = async () => {
    if (!comment.trim()) return;
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    
    const tempComment = {
        _id: Date.now(),
        user: user.name || user.username, 
        text: comment,
        createdAt: new Date().toISOString(),
        isPending: true,
        replies: []
    };
    setVideo(p => ({ 
        ...p, 
        comments: [tempComment, ...(p.comments || [])] 
    }));
    setComment("");

    try {
        await axios.post(
          "http://localhost:5000/api/comments/add",
          { videoId: video._id, text: tempComment.text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchComments(video._id); 
    } catch (error) {
        alert("Failed to post comment.");
        setVideo(p => ({ 
            ...p, 
            comments: p.comments.filter(c => c._id !== tempComment._id)
        }));
    }
  };

  const postReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    
    try {
        await axios.post(
          `http://localhost:5000/api/comments/reply/${commentId}`,
          { text: replyText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchComments(video._id);
        setReplyingTo(null);
    } catch (error) {
        alert("Failed to post reply.");
    }
  };

  const deleteComment = async (cid) => {
    if (!user?.isAdmin && video.uploadedBy._id !== user._id) return;
    const token = localStorage.getItem("token");
    try {
        await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchComments(video._id);
    } catch (error) {
        alert("Failed to delete comment.");
    }
  };

  /* =======================
      🎬 Video Controls (Unchanged)
  ======================== */
  const changePlaybackSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipToChapter = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
      
      // Update current chapter
      const currentTime = videoRef.current.currentTime;
      const chapterIndex = chapters.findIndex((ch, idx) => {
        const nextChapter = chapters[idx + 1];
        return currentTime >= ch.time && (!nextChapter || currentTime < nextChapter.time);
      });
      if (chapterIndex !== -1) setCurrentChapter(chapterIndex);
    }
  };

  /* =======================
      🔗 Share Options (Unchanged)
  ======================== */
  const shareVideo = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyVideoLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Video link copied! 📋");
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const url = window.location.href;
    const text = `Check out: ${video.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out: ${video.title} ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const embedCode = () => {
    const embedUrl = `<iframe width="560" height="315" src="${window.location.origin}/embed/${video.filename}" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedUrl);
    alert("Embed code copied! 📋");
    setShowShareMenu(false);
  };

  /* =======================
      📊 Report Video (Unchanged)
  ======================== */
  const reportVideo = () => {
    if (!user) return navigate("/login");
    alert("Report functionality will be implemented. This will open a report dialog.");
    setShowMoreMenu(false);
  };

  /* =======================
      🎨 Utility Functions (Unchanged)
  ======================== */
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
      year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const getSortedComments = () => {
    if (!video?.comments) return [];
    let filtered = [...video.comments];
    
    if (commentFilter === 'creator') {
      filtered = filtered.filter(c => c.userId === video.uploadedBy._id);
    }
    
    // Simple top sorting: assume 'top' means most recent when no complex metric is available
    if (sortComments === 'top') {
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortComments === 'newest') {
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered;
  };

  /* =======================
      ⏳ Loading UI (Unchanged)
  ======================== */
  if (!video) {
    return (
      <div style={{ background: "#0f0f0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner"></div>
          <h2 style={{ color: "#fff", marginTop: 20 }}>Loading video...</h2>
        </div>
      </div>
    );
  }

  /* =======================
      ✅ Render
  ======================== */
  return (
    <>
      <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
        <div style={{ 
          display: "flex", 
          gap: 24, 
          padding: 20,
          maxWidth: isTheaterMode ? "100%" : "1800px",
          margin: "0 auto"
        }}>
          {/* 🎬 MAIN VIDEO SECTION */}
          <div style={{ flex: 1, maxWidth: isTheaterMode ? "100%" : "calc(100% - 424px)" }}>
            {/* Video Player */}
            <div ref={playerContainerRef} style={{ position: "relative", background: "#000" }}>
              <video
                ref={videoRef}
                src={`http://localhost:5000/api/stream/${video.filename}`}
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                // *** FIX APPLIED HERE ***
                onEnded={handleVideoEnd} 
                // ************************
                style={{ 
                  width: "100%", 
                  borderRadius: isTheaterMode ? "0" : "12px", 
                  background: "#000",
                  maxHeight: isTheaterMode ? "90vh" : "750px"
                }}
                title={video.title}
                preload="auto"
              />
              
              {/* Chapters Overlay */}
              {chapters.length > 0 && (
                <div style={styles.chaptersOverlay}>
                  <button 
                    onClick={() => setShowChapters(!showChapters)}
                    style={styles.chaptersBtn}
                  >
                    <FiList size={16} />
                    <span style={{ marginLeft: 6 }}>
                      {chapters[currentChapter]?.title || 'Chapters'}
                    </span>
                  </button>
                  
                  {showChapters && (
                    <div style={styles.chaptersMenu}>
                      {chapters.map((ch, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            skipToChapter(ch.time);
                            setShowChapters(false);
                          }}
                          style={{
                            ...styles.chapterItem,
                            background: currentChapter === idx ? '#ff0000' : 'transparent'
                          }}
                          // Simple hover effect
                          onMouseEnter={(e) => {
                            if (currentChapter !== idx) e.target.style.background = 'rgba(255,255,255,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            if (currentChapter !== idx) e.target.style.background = 'transparent';
                          }}
                        >
                          <span style={{ color: '#aaa', fontSize: 12 }}>
                            {Math.floor(ch.time / 60)}:{String(ch.time % 60).padStart(2, '0')}
                          </span>
                          <span style={{ marginLeft: 8 }}>{ch.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Custom Controls Overlay */}
              <div style={styles.controlsOverlay}>
                <button onClick={toggleTheaterMode} style={styles.controlBtn} title="Theater mode">
                  {isTheaterMode ? <MdOutlineFullscreenExit size={18} /> : <MdOutlineScreenShare size={18} />}
                </button>
                
                <div style={{ position: "relative" }}>
                  <button 
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
                    style={styles.controlBtn}
                    title="Playback speed"
                  >
                    <MdOutlineSpeed size={18} />
                    <span style={{ marginLeft: 6 }}>{playbackSpeed}x</span>
                  </button>
                  
                  {showSpeedMenu && (
                    <div style={styles.speedMenu}>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                        <div 
                          key={speed}
                          onClick={() => changePlaybackSpeed(speed)}
                          style={{
                            ...styles.speedMenuItem,
                            background: playbackSpeed === speed ? "#ff0000" : "transparent"
                          }}
                          onMouseEnter={(e) => {
                            if (playbackSpeed !== speed) e.target.style.background = 'rgba(255,255,255,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            if (playbackSpeed !== speed) e.target.style.background = 'transparent';
                          }}
                        >
                          {speed}x {playbackSpeed === speed && <FiCheck size={14} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ position: "relative" }}>
                  <button 
                    onClick={() => setShowQualityMenu(!showQualityMenu)} 
                    style={styles.controlBtn}
                    title="Quality"
                  >
                    <FiZap size={18} />
                    <span style={{ marginLeft: 6 }}>{videoQuality}</span>
                  </button>
                  
                  {showQualityMenu && (
                    <div style={styles.speedMenu}>
                      {['auto', '1080p', '720p', '480p', '360p'].map(quality => (
                        <div 
                          key={quality}
                          onClick={() => {
                            setVideoQuality(quality);
                            setShowQualityMenu(false);
                          }}
                          style={{
                            ...styles.speedMenuItem,
                            background: videoQuality === quality ? "#ff0000" : "transparent"
                          }}
                          onMouseEnter={(e) => {
                            if (videoQuality !== quality) e.target.style.background = 'rgba(255,255,255,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            if (videoQuality !== quality) e.target.style.background = 'transparent';
                          }}
                        >
                          {quality} {videoQuality === quality && <FiCheck size={14} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Title */}
            <h2 style={{ marginTop: "16px", fontSize: "24px", fontWeight: 700 }}>{video.title}</h2>

            {/* Video Info Bar */}
            <div style={styles.infoBar}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#aaa", fontSize: "14px", fontWeight: 500 }}>
                  <FiPlay size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> 
                  {formatViews(video.views)} views
                </span>
                <span style={{ color: "#666" }}>•</span>
                <span style={{ color: "#aaa", fontSize: "14px", fontWeight: 500 }}>
                  {getTimeAgo(video.createdAt)}
                </span>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: 'wrap' }}>
                {/* Like/Dislike */}
                <div style={styles.actionButtonGroup}>
                  <button 
                    onClick={likeVideo} 
                    style={{
                      ...styles.actionButton,
                      borderRight: "1px solid #555",
                      background: userLiked ? "#ff0000" : "transparent",
                    }}
                  >
                    <FiThumbsUp size={16} /> <span style={{ marginLeft: 6 }}>{formatViews(likes)}</span>
                  </button>
                  <button 
                    onClick={dislikeVideo} 
                    style={{
                      ...styles.actionButton,
                      background: userDisliked ? "#ff0000" : "transparent"
                    }}
                  >
                    <FiThumbsDown size={16} />
                  </button>
                </div>

                {/* Share */}
                <div style={{ position: 'relative' }}>
                  <button onClick={shareVideo} style={styles.actionButtonSingle}>
                    <FiShare2 size={16} style={{ marginRight: 6 }} /> Share
                  </button>
                  
                  {showShareMenu && (
                    <div style={styles.shareMenu}>
                      <div onClick={copyVideoLink} style={styles.shareMenuItem}>
                        <FiShare2 size={16} /> Copy link
                      </div>
                      <div onClick={shareToTwitter} style={styles.shareMenuItem}>
                        <FiSend size={16} /> Twitter
                      </div>
                      <div onClick={shareToFacebook} style={styles.shareMenuItem}>
                        <FiSend size={16} /> Facebook
                      </div>
                      <div onClick={shareToWhatsApp} style={styles.shareMenuItem}>
                        <FiSend size={16} /> WhatsApp
                      </div>
                      <div onClick={embedCode} style={styles.shareMenuItem}>
                        <FiShare2 size={16} /> Embed
                      </div>
                    </div>
                  )}
                </div>

                {/* Save */}
                <button onClick={toggleSave} style={{
                  ...styles.actionButtonSingle,
                  background: isSaved ? "#ff0000" : "#272727"
                }}>
                  <FiBookmark size={16} style={{ marginRight: 6 }} /> 
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                {/* Watch Later */}
                <button onClick={toggleWatchLater} style={{
                  ...styles.actionButtonSingle,
                  background: isWatchLater ? "#ff0000" : "#272727"
                }}>
                  <MdOutlineWatchLater size={16} style={{ marginRight: 6 }} /> 
                  {isWatchLater ? 'Added' : 'Watch later'}
                </button>

                {/* More Menu */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    style={styles.actionButtonSingle}
                  >
                    <FiMoreVertical size={16} />
                  </button>
                  
                  {showMoreMenu && (
                    <div style={styles.moreMenu}>
                      <div onClick={reportVideo} style={styles.moreMenuItem}>
                        <FiFlag size={16} /> Report
                      </div>
                      <div onClick={() => {
                        setShowTranscript(!showTranscript);
                        setShowMoreMenu(false);
                      }} style={styles.moreMenuItem}>
                        <FiMessageSquare size={16} /> Show transcript
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={styles.progressBarContainer}>
              <div style={{ ...styles.progressBar, width: `${videoProgress}%` }} />
            </div>

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div style={styles.tagsContainer}>
                {video.tags.map((t, i) => (
                  <span key={i} style={styles.tag}>
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Channel Card */}
            {channel && (
              <div style={styles.channelCard}>
                <div 
                  style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", flex: 1 }}
                  onClick={() => navigate(`/profile/${channel._id}`)}
                >
                  <div style={styles.channelAvatar}>
                    {channel.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "18px" }}>{channel.name}</div>
                    <div style={{ color: "#aaa", fontSize: "13px" }}>
                      {formatViews(channel.subscribers?.length || 0)} subscribers
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {subscribed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(notifications === 'all' ? 'personalized' : 'all');
                      }}
                      style={styles.notificationBtn}
                      title="Notification preferences"
                    >
                      <FiBell size={18} />
                    </button>
                  )}
                  <button
                    style={subscribed ? styles.subscribedBtn : styles.subscribeBtn}
                    onClick={toggleSubscribe}
                  >
                    {subscribed ? (
                      <><FiCheck size={18} style={{ marginRight: 4 }}/> Subscribed</>
                    ) : (
                      <>Subscribe</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div style={styles.descriptionBox}>
              <div 
                style={{ 
                  maxHeight: showDescription ? "none" : "80px", 
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6"
                }}
              >
                {video.description || "No description available."}
              </div>
              {video.description && video.description.length > 150 && (
                <button 
                  onClick={() => setShowDescription(!showDescription)}
                  style={styles.showMoreBtn}
                >
                  {showDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Transcript */}
            {showTranscript && (
              <div style={styles.transcriptBox}>
                <h4 style={{ marginBottom: 12 }}>Transcript</h4>
                <p style={{ color: '#aaa', fontSize: 14 }}>
                  Transcript feature coming soon. This will show the video transcript with timestamps.
                </p>
              </div>
            )}

            {/* 💬 Comments Section */}
            <div style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                  <FiMessageSquare size={20} style={{ verticalAlign: 'middle', marginRight: 8 }}/>
                  {video.comments?.length || 0} Comments
                </h3>
                
                <div style={{ display: 'flex', gap: 12 }}>
                  <select 
                    value={sortComments}
                    onChange={(e) => setSortComments(e.target.value)}
                    style={styles.sortSelect}
                  >
                    <option value="top">Top comments</option>
                    <option value="newest">Newest first</option>
                  </select>
                  
                  <select
                    value={commentFilter}
                    onChange={(e) => setCommentFilter(e.target.value)}
                    style={styles.sortSelect}
                  >
                    <option value="all">All comments</option>
                    <option value="creator">From creator</option>
                  </select>
                </div>
              </div>

              {user ? (
                <div style={{ marginBottom: 24 }}>
                  <div style={styles.commentInputContainer}>
                    <div style={styles.commentAvatar}>
                      {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a public comment..."
                      style={styles.commentInput}
                      onKeyPress={(e) => e.key === "Enter" && postComment()}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                    <button onClick={() => setComment("")} style={styles.cancelBtn}>Cancel</button>
                    <button 
                      onClick={postComment} 
                      style={comment.trim() ? styles.commentPostBtn : styles.commentPostBtnDisabled}
                      disabled={!comment.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 16, background: "#272727", borderRadius: 12, marginBottom: 24, textAlign: "left" }}>
                  <p style={{ margin: 0, fontSize: 14, color: "#ccc" }}>
                    Want to comment? 
                    <button 
                      onClick={() => navigate("/login")} 
                      style={styles.signInToCommentBtn}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div>
                {getSortedComments().map((c) => (
                  <div key={c._id}>
                    <div style={styles.commentCard}>
                      <div style={styles.commentAvatar}>
                        {c.user?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: "14px" }}>
                              {c.user} 
                              {(user?.isAdmin || video.uploadedBy?._id === c.userId) && (
                                  <span style={styles.adminBadge}>
                                    {video.uploadedBy?._id === c.userId ? 'Creator' : 'Admin'}
                                  </span>
                              )}
                          </span>
                          <span style={{ color: "#aaa", fontSize: "12px" }}>
                            {getTimeAgo(c.createdAt)}
                          </span>
                        </div>
                        <p style={{ margin: 0, lineHeight: "1.5", fontSize: "15px", color: c.isPending ? "#999" : "#fff" }}>
                            {c.text} {c.isPending && " (Sending...)"}
                        </p>
                        
                        <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
                          <button style={styles.commentActionBtn}>
                            <FiThumbsUp size={14} /> <span style={{ marginLeft: 4 }}>{c.likes || 0}</span>
                          </button>
                          <button style={styles.commentActionBtn}>
                            <FiThumbsDown size={14} />
                          </button>
                          <button 
                            onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                            style={styles.commentActionBtn}
                          >
                            Reply
                          </button>
                          {(user?.isAdmin || user?._id === video.uploadedBy?._id) && (
                            <button onClick={() => deleteComment(c._id)} style={styles.deleteCommentBtn}>
                              Delete
                            </button>
                          )}
                        </div>

                        {/* Reply Input */}
                        {replyingTo === c._id && (
                          <div style={{ marginTop: 12 }}>
                            <div style={styles.commentInputContainer}>
                              <div style={styles.commentAvatarSmall}>
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <input
                                type="text"
                                placeholder={`Reply to ${c.user}...`}
                                style={styles.commentInput}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter" && e.target.value.trim()) {
                                    postReply(c._id, e.target.value);
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Show Replies */}
                        {c.replies && c.replies.length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <button
                              onClick={() => setShowReplies(prev => ({
                                ...prev,
                                [c._id]: !prev[c._id]
                              }))}
                              style={styles.showRepliesBtn}
                            >
                              {showReplies[c._id] ? '▼' : '▶'} {c.replies.length} {c.replies.length === 1 ? 'reply' : 'replies'}
                            </button>
                            
                            {showReplies[c._id] && (
                              <div style={{ marginLeft: 40, marginTop: 12 }}>
                                {c.replies.map((reply) => (
                                  <div key={reply._id} style={styles.replyCard}>
                                    <div style={styles.commentAvatarSmall}>
                                      {reply.user?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontWeight: 600, fontSize: "13px" }}>
                                          {reply.user}
                                        </span>
                                        <span style={{ color: "#aaa", fontSize: "11px" }}>
                                          {getTimeAgo(reply.createdAt)}
                                        </span>
                                      </div>
                                      <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                                        {reply.text}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 📌 Recommended Videos Sidebar */}
          {!isTheaterMode && (
            <div style={{ width: 400, flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  <FiLayers size={18} style={{ verticalAlign: 'middle', marginRight: 8 }}/>
                  Up next
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  Autoplay
                </label>
              </div>
              <div>
                {recommended.slice(0, 15).map((v, idx) => (
                  <div
                    key={v._id}
                    onClick={() => navigate(`/watch/${v.filename}`)} 
                    style={{
                      ...styles.recommendedCard,
                      // Highlight the next video when autoplay is on
                      borderLeft: idx === 0 && autoplay ? '3px solid #ff0000' : 'none',
                      paddingLeft: idx === 0 && autoplay ? 5 : 8
                    }}
                    // Simple hover effect
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={`http://localhost:5000/uploads/${v.thumbnail}`} 
                        style={styles.recommendedThumb} 
                        alt={v.title}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="168" height="94"><rect fill="%23303030" width="168" height="94"/></svg>';
                        }}
                      />
                      {idx === 0 && autoplay && (
                        <div style={styles.autoplayBadge}>
                          <FiPlay size={12} /> UP NEXT
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={styles.recommendedTitle}>{v.title}</p>
                      <p style={styles.recommendedMeta}>
                        {v.uploadedBy?.name || "Channel"}
                      </p>
                      <p style={styles.recommendedMeta}>
                        {formatViews(v.views)} views • {getTimeAgo(v.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {recommended.length === 0 && (
                    <p style={{ color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 30 }}>
                        No recommendations available yet.
                    </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #303030;
          border-top-color: #ff0000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

/* =======================
   🎨 Styles (Unchanged)
======================= */
const styles = {
    controlsOverlay: {
      position: "absolute",
      top: 12,
      right: 12,
      display: "flex",
      gap: 8,
      zIndex: 10
    },
    controlBtn: {
      padding: "8px 12px",
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)",
      border: "none",
      borderRadius: 8,
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600,
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
    },
    speedMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      marginTop: 8,
      background: "rgba(28,28,28,0.98)",
      backdropFilter: "blur(10px)",
      borderRadius: 8,
      overflow: "hidden",
      minWidth: 120,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      textAlign: "left",
      zIndex: 100
    },
    speedMenuItem: {
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: 500,
      transition: "background 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    chaptersOverlay: {
      position: "absolute",
      bottom: 60,
      left: 12,
      zIndex: 10
    },
    chaptersBtn: {
      padding: "8px 12px",
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)",
      border: "none",
      borderRadius: 8,
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
    },
    chaptersMenu: {
      position: "absolute",
      bottom: "100%",
      left: 0,
      marginBottom: 8,
      background: "rgba(28,28,28,0.98)",
      backdropFilter: "blur(10px)",
      borderRadius: 8,
      overflow: "auto",
      maxHeight: 300,
      minWidth: 250,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    },
    chapterItem: {
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background 0.2s",
      display: "flex",
      alignItems: "center",
    },
    infoBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 18,
      paddingBottom: 16,
      borderBottom: "1px solid #272727",
      flexWrap: 'wrap',
      gap: 12
    },
    actionButtonGroup: {
      display: "flex",
      alignItems: "center",
      background: "#272727",
      borderRadius: 24,
      overflow: "hidden",
    },
    actionButton: {
      padding: "10px 16px",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600,
      background: "transparent",
      transition: "background 0.2s",
      display: "flex",
      alignItems: "center",
    },
    actionButtonSingle: {
      padding: "10px 20px",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600,
      background: "#272727",
      borderRadius: 24,
      transition: "background 0.2s",
      display: "flex",
      alignItems: "center",
    },
    shareMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      marginTop: 8,
      background: "rgba(28,28,28,0.98)",
      borderRadius: 8,
      overflow: "hidden",
      minWidth: 200,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      zIndex: 100
    },
    shareMenuItem: {
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      transition: "background 0.2s",
      borderBottom: "1px solid #333"
    },
    moreMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      marginTop: 8,
      background: "rgba(28,28,28,0.98)",
      borderRadius: 8,
      overflow: "hidden",
      minWidth: 180,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      zIndex: 100
    },
    moreMenuItem: {
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      transition: "background 0.2s",
      borderBottom: "1px solid #333"
    },
    progressBarContainer: {
      width: '100%',
      height: 4,
      background: '#404040',
      borderRadius: 2,
      marginTop: 8,
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      background: '#ff0000',
      transition: 'width 0.1s'
    },
    tagsContainer: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginTop: 12,
      paddingBottom: 16,
      borderBottom: "1px solid #272727"
    },
    tag: {
      background: "#1f1f1f",
      padding: "6px 14px",
      borderRadius: 20,
      fontSize: "13px",
      color: "#3ea6ff",
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    channelCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 0",
      borderBottom: "1px solid #272727"
    },
    channelAvatar: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#fff",
      flexShrink: 0
    },
    subscribeBtn: {
      padding: "10px 24px",
      background: "#ff0000",
      border: "none",
      borderRadius: 24,
      color: "#fff",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.2s",
    },
    subscribedBtn: {
      padding: "10px 24px",
      background: "#404040",
      border: "none",
      borderRadius: 24,
      color: "#fff",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.2s",
      display: "flex",
      alignItems: 'center',
    },
    notificationBtn: {
      padding: "10px",
      background: "#272727",
      border: "none",
      borderRadius: "50%",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s"
    },
    descriptionBox: {
      background: "#1f1f1f",
      padding: 16,
      borderRadius: 12,
      marginTop: 20
    },
    showMoreBtn: {
      background: "none",
      border: "none",
      color: "#aaa",
      cursor: "pointer",
      marginTop: 8,
      fontWeight: 600,
      fontSize: "14px",
      padding: 0
    },
    transcriptBox: {
      background: "#1f1f1f",
      padding: 16,
      borderRadius: 12,
      marginTop: 12,
      marginBottom: 20
    },
    commentInputContainer: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    },
    commentAvatar: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "#555",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      fontWeight: "bold",
      flexShrink: 0,
      color: "#fff"
    },
    commentAvatarSmall: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "#555",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "bold",
      flexShrink: 0,
      color: "#fff"
    },
    commentInput: {
      flex: 1,
      background: "transparent",
      border: "none",
      borderBottom: "2px solid #555",
      color: "#fff",
      padding: "8px 0",
      fontSize: "15px",
      outline: "none",
      transition: "border-color 0.2s"
    },
    sortSelect: {
      background: "#272727",
      border: "none",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: 8,
      fontSize: 14,
      cursor: "pointer",
      outline: "none"
    },
    signInToCommentBtn: {
        background: "none",
        border: "none",
        color: "#ff0000",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "14px",
        marginLeft: 5,
        padding: 0
    },
    cancelBtn: {
      padding: "8px 18px",
      background: "transparent",
      border: "none",
      borderRadius: 20,
      color: "#aaa",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600
    },
    commentPostBtn: {
      padding: "8px 18px",
      background: "#ff0000",
      border: "none",
      borderRadius: 20,
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600
    },
    commentPostBtnDisabled: {
      padding: "8px 18px",
      background: "#303030",
      border: "none",
      borderRadius: 20,
      color: "#999",
      cursor: "not-allowed",
      fontSize: "14px",
      fontWeight: 600
    },
    commentCard: {
      display: "flex",
      gap: 16,
      padding: "16px 0",
      borderBottom: "1px solid #1f1f1f"
    },
    replyCard: {
      display: "flex",
      gap: 12,
      padding: "12px 0",
      borderBottom: "1px solid #1f1f1f"
    },
    adminBadge: {
      background: '#ff0000',
      color: '#fff',
      fontSize: '10px',
      padding: '2px 6px',
      borderRadius: '4px',
      marginLeft: '8px',
      fontWeight: 'normal',
      verticalAlign: 'middle',
    },
    commentActionBtn: {
      background: "transparent",
      border: "none",
      color: "#aaa",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      padding: "4px 8px",
      borderRadius: 16,
      transition: "background 0.2s"
    },
    deleteCommentBtn: {
      background: "transparent",
      border: "none",
      color: "#ff4444",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 600,
      padding: "4px 8px"
    },
    showRepliesBtn: {
      background: "transparent",
      border: "none",
      color: "#3ea6ff",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 6
    },
    recommendedCard: {
      display: "flex",
      gap: 12,
      marginBottom: 10,
      cursor: "pointer",
      padding: 8,
      borderRadius: 8,
      transition: "background 0.2s",
    },
    recommendedThumb: {
      width: 168,
      height: 94,
      borderRadius: 8,
      objectFit: "cover",
      flexShrink: 0
    },
    recommendedTitle: {
      margin: 0,
      fontSize: "15px",
      fontWeight: 600,
      lineHeight: "1.3",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    },
    recommendedMeta: {
      margin: "4px 0 0 0",
      fontSize: "13px",
      color: "#aaa"
    },
    autoplayBadge: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      background: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '2px 6px',
      fontSize: 10,
      fontWeight: 600,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  };