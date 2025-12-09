
// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [subscribed, setSubscribed] = useState(false);
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [recommended, setRecommended] = useState([]);
//   const [comment, setComment] = useState("");

//   /* =======================
//       📌 Fetch Video
//   ======================== */
//   const fetchVideo = async () => {
//     const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
//     setVideo(res.data);
//     setLikes(res.data.likes?.length || 0);
//     setDislikes(res.data.dislikes?.length || 0);

//     if (res.data.uploadedBy?._id) {
//       fetchChannel(res.data.uploadedBy._id);
//       fetchComments(res.data._id);
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
//     fetchRecommended();
//     updateViews();
//   }, [filename]);

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
//       ⏳ Loading UI
//   ======================== */
//   if (!video) return <h2 style={{ padding: 20 }}>⏳ Loading video...</h2>;

//   return (
//     <div style={{ display: "flex", gap: 24, padding: 20, color: "#fff", background: "#0f0f0f" }}>
//       {/* 🎬 MAIN VIDEO SECTION */}
//       <div style={{ flex: 1, maxWidth: "1000px" }}>
//         <video
//           src={`http://localhost:5000/api/stream/${video.filename}`}
//           controls
//           autoPlay
//           style={{ width: "100%", borderRadius: "12px", background: "#000" }}
//         />

//         <h2 style={{ marginTop: "12px" }}>{video.title}</h2>

//         {/* 🎯 Tags */}
//         {video.tags && video.tags.length > 0 && (
//           <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
//             {video.tags.map((t, i) => (
//               <span
//                 key={i}
//                 style={{
//                   background: "#272727",
//                   padding: "5px 12px",
//                   borderRadius: "20px",
//                   fontSize: "12px",
//                   color: "#ccc",
//                 }}
//               >
//                 #{t}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Views Date */}
//         <div style={{ marginTop: 6, color: "#ccc" }}>
//           👁 {video.views} views • {new Date(video.createdAt).toDateString()}
//         </div>

//         {/* 👍👎 */}
//         <div style={{ marginTop: 14 }}>
//           <button onClick={likeVideo} style={btn}>👍 Like ({likes})</button>
//           <button onClick={dislikeVideo} style={btn}>👎 Dislike ({dislikes})</button>
//         </div>

//         {/* 📺 Channel Card */}
//         {channel && (
//           <div
//             style={channelCard}
//             onClick={() => navigate(`/profile/${channel._id}`)}
//           >
//             <b>📺 {channel.name}</b>
//             <button
//               style={subscribed ? subBtnSub : subBtn}
//               onClick={toggleSubscribe}
//             >
//               {subscribed ? "Subscribed ✔" : "Subscribe"}
//             </button>
//           </div>
//         )}

//         {/* 💬 Comments */}
//         <div style={{ marginTop: 20 }}>
//           <h3>💬 Comments ({video.comments?.length || 0})</h3>

//           {user && (
//             <div style={{ marginBottom: 10 }}>
//               <input
//                 type="text"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Write a comment..."
//                 style={input}
//                 onKeyPress={(e) => e.key === "Enter" && postComment()}
//               />
//               <button onClick={postComment} style={postBtn}>Post</button>
//             </div>
//           )}

//           {video.comments?.map((c) => (
//             <div key={c._id} style={{ padding: 10, borderBottom: "1px solid #333" }}>
//               <b>{c.user}</b> • <span style={{ color: "#777" }}>{new Date(c.createdAt).toLocaleDateString()}</span>
//               <p>{c.text}</p>
//               {user?.isAdmin && (
//                 <button onClick={() => deleteComment(c._id)} style={delBtn}>Delete</button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 📌 Recommended */}
//       <div style={{ width: 400 }}>
//         <h3>🔔 Recommended</h3>
//         {recommended.slice(0, 12).map((v) => (
//           <a
//             key={v._id}
//             href={`/watch/${v.filename}`}
//             onClick={(e) => { e.preventDefault(); navigate(`/watch/${v.filename}`); }}
//             style={recCard}
//           >
//             <img src={`http://localhost:5000/uploads/${v.thumbnail}`} style={thumb} alt="" />
//             <div>
//               <p style={{ fontSize: 14, fontWeight: 600 }}>{v.title}</p>
//               <span style={{ fontSize: 12, color: "#ccc" }}>{v.views} views</span>
//             </div>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* =======================
//    🎨 Styles
// ======================= */
// const btn = { marginRight: 10, padding: "6px 12px", borderRadius: 6, background: "#333", border: "none", color: "#fff" };
// const channelCard = { marginTop: 15, display: "flex", justifyContent: "space-between", background: "#1f1f1f", padding: "10px 15px", borderRadius: 10 };
// const subBtn = { padding: "8px 16px", borderRadius: 8, background: "#cc0000", color: "#fff", border: "none", cursor: "pointer" };
// const subBtnSub = { padding: "8px 16px", borderRadius: 8, background: "#555", color: "#eee", border: "none", cursor: "pointer" };
// const input = { width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", background: "#111", color: "#fff" };
// const postBtn = { marginTop: 6, padding: "6px 12px", borderRadius: 6, background: "#ff0000", color: "#fff", border: "none" };
// const delBtn = { padding: "3px 8px", background: "#900", color: "#fff", borderRadius: 4, border: "none" };
// const recCard = { display: "flex", gap: 10, textDecoration: "none", color: "#fff", padding: 5, borderRadius: 10, background: "#111", marginBottom: 12 };
// const thumb = { width: 120, height: 70, borderRadius: 8, objectFit: "cover" };

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

//   const addToHistory = async () => {
//     if (user && video) {
//       try {
//         const token = localStorage.getItem("token");
//         await axios.post(
//           `http://localhost:5000/api/user/watch-history/add/${video._id}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } catch (err) {
//         console.error("Failed to add to history:", err);
//       }
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
//     addToHistory(); 
//   }, [filename]);

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

import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Watch() {
  const { filename } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [comment, setComment] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  /* =======================
      📌 Fetch Video
  ======================== */
  const fetchVideo = async () => {
    const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
    setVideo(res.data);
    setLikes(res.data.likes?.length || 0);
    setDislikes(res.data.dislikes?.length || 0);
    
    if (user) {
      setUserLiked(res.data.likes?.includes(user._id));
      setUserDisliked(res.data.dislikes?.includes(user._id));
    }

    if (res.data.uploadedBy?._id) {
      fetchChannel(res.data.uploadedBy._id);
      fetchComments(res.data._id);
    }

    // ✅ Add to history after video is loaded
    if (user && res.data._id) {
      addToHistory(res.data._id);
    }
  };

  /* =======================
      📌 Fetch Channel
  ======================== */
  const fetchChannel = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
    setChannel(res.data);
    if (user) setSubscribed(res.data.subscribers?.includes(user._id));
  };

  /* =======================
      📌 Fetch Comments
  ======================== */
  const fetchComments = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
    setVideo((p) => ({ ...p, comments: res.data }));
  };

  /* =======================
      📺 Add to Watch History
  ======================== */
  const addToHistory = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/user/watch-history/add/${videoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Added to watch history");
    } catch (err) {
      console.error("❌ Failed to add to history:", err);
    }
  };

  /* =======================
      📌 Smart Recommendations
  ======================== */
  const fetchRecommended = async () => {
    const res = await axios.get("http://localhost:5000/api/videos/all");

    if (video?.tags?.length > 0) {
      const related = res.data.filter(
        (v) =>
          v.filename !== filename &&
          v.tags?.some((tag) => video.tags.includes(tag))
      );

      const extra = res.data.filter((v) => v.filename !== filename);
      const merged = [...related, ...extra];

      const unique = merged.filter(
        (v, i, arr) => arr.findIndex((x) => x._id === v._id) === i
      );

      setRecommended(unique.slice(0, 15));
    } else {
      setRecommended(res.data.filter((v) => v.filename !== filename));
    }
  };

  /* =======================
      📌 Update Views
  ======================== */
  const updateViews = async () => {
    await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
  };

  useEffect(() => {
    fetchVideo();
    updateViews();
  }, [filename, user]);

  useEffect(() => {
    if (video) fetchRecommended();
  }, [video]);

  /* =======================
      👍 Like + 👎 Dislike
  ======================== */
  const likeVideo = async () => {
    if (!user) return alert("Login to like");
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
    if (!user) return alert("Login to dislike");
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
      🔔 Subscribe / Unsubscribe
  ======================== */
  const toggleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Login to subscribe");
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/user/subscribe/${channel._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubscribed(res.data.subscribed);
  };

  /* =======================
      💬 Comments System
  ======================== */
  const postComment = async () => {
    if (!comment.trim()) return;
    if (!user) return alert("Login to comment");
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/comments/add",
      { videoId: video._id, text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComment("");
    fetchComments(video._id);
  };

  const deleteComment = async (cid) => {
    if (!user?.isAdmin) return alert("Admin only");
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchComments(video._id);
  };

  /* =======================
      🎬 Video Controls
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

  /* =======================
      📋 Share Video
  ======================== */
  const shareVideo = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard! 📋");
  };

  /* =======================
      ⏳ Loading UI
  ======================== */
  if (!video) return <h2 style={{ padding: 20, color: "#fff" }}>⏳ Loading video...</h2>;

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ 
        display: "flex", 
        gap: 24, 
        padding: 20,
        maxWidth: isTheaterMode ? "100%" : "1800px",
        margin: "0 auto"
      }}>
        {/* 🎬 MAIN VIDEO SECTION */}
        <div style={{ flex: 1, maxWidth: isTheaterMode ? "100%" : "1200px" }}>
          {/* Video Player */}
          <div style={{ position: "relative" }}>
            <video
              ref={videoRef}
              src={`http://localhost:5000/api/stream/${video.filename}`}
              controls
              autoPlay
              style={{ 
                width: "100%", 
                borderRadius: "12px", 
                background: "#000",
                maxHeight: isTheaterMode ? "80vh" : "650px"
              }}
            />
            
            {/* Custom Controls Overlay */}
            <div style={controlsOverlay}>
              <button onClick={toggleTheaterMode} style={controlBtn} title="Theater mode">
                {isTheaterMode ? "📺 Exit Theater" : "🖥️ Theater Mode"}
              </button>
              
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
                  style={controlBtn}
                  title="Playback speed"
                >
                  ⚡ {playbackSpeed}x
                </button>
                
                {showSpeedMenu && (
                  <div style={speedMenu}>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                      <div 
                        key={speed}
                        onClick={() => changePlaybackSpeed(speed)}
                        style={{
                          ...speedMenuItem,
                          background: playbackSpeed === speed ? "#ff0000" : "transparent"
                        }}
                      >
                        {speed}x {playbackSpeed === speed && "✓"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Video Title */}
          <h2 style={{ marginTop: "16px", fontSize: "20px", fontWeight: 600 }}>{video.title}</h2>

          {/* Video Info Bar */}
          <div style={infoBar}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#aaa", fontSize: "14px" }}>
                👁 {video.views?.toLocaleString() || 0} views
              </span>
              <span style={{ color: "#666" }}>•</span>
              <span style={{ color: "#aaa", fontSize: "14px" }}>
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {/* Like/Dislike */}
              <div style={actionButtonGroup}>
                <button 
                  onClick={likeVideo} 
                  style={{
                    ...actionButton,
                    background: userLiked ? "#ff0000" : "#272727"
                  }}
                >
                  👍 {likes.toLocaleString()}
                </button>
                <div style={{ width: 1, height: 24, background: "#555" }}></div>
                <button 
                  onClick={dislikeVideo} 
                  style={{
                    ...actionButton,
                    background: userDisliked ? "#ff0000" : "#272727"
                  }}
                >
                  👎 {dislikes.toLocaleString()}
                </button>
              </div>

              {/* Share */}
              <button onClick={shareVideo} style={actionButtonSingle}>
                🔗 Share
              </button>
            </div>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div style={tagsContainer}>
              {video.tags.map((t, i) => (
                <span key={i} style={tag}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Channel Card */}
          {channel && (
            <div style={channelCard}>
              <div 
                style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1 }}
                onClick={() => navigate(`/profile/${channel._id}`)}
              >
                <div style={channelAvatar}>
                  {channel.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "16px" }}>{channel.name}</div>
                  <div style={{ color: "#aaa", fontSize: "12px" }}>
                    {channel.subscribers?.length || 0} subscribers
                  </div>
                </div>
              </div>
              <button
                style={subscribed ? subscribedBtn : subscribeBtn}
                onClick={toggleSubscribe}
              >
                {subscribed ? (
                  <>🔔 Subscribed</>
                ) : (
                  <>Subscribe</>
                )}
              </button>
            </div>
          )}

          {/* Description */}
          <div style={descriptionBox}>
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
            <button 
              onClick={() => setShowDescription(!showDescription)}
              style={showMoreBtn}
            >
              {showDescription ? "Show less" : "Show more"}
            </button>
          </div>

          {/* 💬 Comments Section */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: "20px", marginBottom: 16 }}>
              {video.comments?.length || 0} Comments
            </h3>

            {user ? (
              <div style={{ marginBottom: 24 }}>
                <div style={commentInputContainer}>
                  <div style={commentAvatar}>
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={commentInput}
                    onKeyPress={(e) => e.key === "Enter" && postComment()}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                  <button onClick={() => setComment("")} style={cancelBtn}>Cancel</button>
                  <button 
                    onClick={postComment} 
                    style={comment.trim() ? commentPostBtn : commentPostBtnDisabled}
                    disabled={!comment.trim()}
                  >
                    Comment
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: 16, background: "#272727", borderRadius: 8, marginBottom: 24 }}>
                Sign in to leave a comment
              </div>
            )}

            {/* Comments List */}
            <div>
              {video.comments?.map((c) => (
                <div key={c._id} style={commentCard}>
                  <div style={commentAvatar}>
                    {c.user?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>{c.user}</span>
                      <span style={{ color: "#aaa", fontSize: "12px" }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: 0, lineHeight: "1.5", fontSize: "14px" }}>{c.text}</p>
                    {user?.isAdmin && (
                      <button onClick={() => deleteComment(c._id)} style={deleteCommentBtn}>
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📌 Recommended Videos Sidebar */}
        {!isTheaterMode && (
          <div style={{ width: 400, flexShrink: 0 }}>
            <h3 style={{ fontSize: "18px", marginBottom: 16 }}>Recommended</h3>
            <div>
              {recommended.slice(0, 15).map((v) => (
                <div
                  key={v._id}
                  onClick={() => navigate(`/watch/${v.filename}`)}
                  style={recommendedCard}
                >
                  <img 
                    src={`http://localhost:5000/uploads/${v.thumbnail}`} 
                    style={recommendedThumb} 
                    alt={v.title}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={recommendedTitle}>{v.title}</p>
                    <p style={recommendedMeta}>
                      {v.uploadedBy?.name || "Unknown"}
                    </p>
                    <p style={recommendedMeta}>
                      {v.views?.toLocaleString() || 0} views • {new Date(v.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =======================
   🎨 Styles
======================= */
const controlsOverlay = {
  position: "absolute",
  top: 12,
  right: 12,
  display: "flex",
  gap: 8,
  zIndex: 10
};

const controlBtn = {
  padding: "8px 12px",
  background: "rgba(0,0,0,0.8)",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600
};

const speedMenu = {
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: 4,
  background: "rgba(28,28,28,0.98)",
  backdropFilter: "blur(10px)",
  borderRadius: 8,
  overflow: "hidden",
  minWidth: 100,
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
};

const speedMenuItem = {
  padding: "10px 16px",
  cursor: "pointer",
  fontSize: "13px",
  transition: "background 0.2s"
};

const infoBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 12,
  paddingBottom: 12,
  borderBottom: "1px solid #333"
};

const actionButtonGroup = {
  display: "flex",
  alignItems: "center",
  background: "#272727",
  borderRadius: 24,
  overflow: "hidden"
};

const actionButton = {
  padding: "10px 20px",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  transition: "background 0.2s"
};

const actionButtonSingle = {
  ...actionButton,
  background: "#272727",
  borderRadius: 24
};

const tagsContainer = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 12
};

const tag = {
  background: "#272727",
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: "12px",
  color: "#aaa",
  fontWeight: 500
};

const channelCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#0f0f0f",
  padding: "16px 0",
  marginTop: 16,
  borderRadius: 12
};

const channelAvatar = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: "bold"
};

const subscribeBtn = {
  padding: "10px 24px",
  background: "#ff0000",
  border: "none",
  borderRadius: 24,
  color: "#fff",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.2s"
};

const subscribedBtn = {
  ...subscribeBtn,
  background: "#272727"
};

const descriptionBox = {
  background: "#272727",
  padding: 16,
  borderRadius: 12,
  marginTop: 16
};

const showMoreBtn = {
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  marginTop: 8,
  fontWeight: 600,
  fontSize: "14px"
};

const commentInputContainer = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start"
};

const commentAvatar = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #666, #999)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  fontWeight: "bold",
  flexShrink: 0
};

const commentInput = {
  flex: 1,
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #555",
  color: "#fff",
  padding: "8px 0",
  fontSize: "14px",
  outline: "none"
};

const cancelBtn = {
  padding: "8px 16px",
  background: "transparent",
  border: "none",
  borderRadius: 20,
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600
};

const commentPostBtn = {
  padding: "8px 16px",
  background: "#ff0000",
  border: "none",
  borderRadius: 20,
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600
};

const commentPostBtnDisabled = {
  ...commentPostBtn,
  background: "#272727",
  cursor: "not-allowed"
};

const commentCard = {
  display: "flex",
  gap: 12,
  padding: "16px 0",
  borderBottom: "1px solid #272727"
};

const deleteCommentBtn = {
  marginTop: 8,
  padding: "4px 12px",
  background: "#900",
  border: "none",
  borderRadius: 16,
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px"
};

const recommendedCard = {
  display: "flex",
  gap: 12,
  marginBottom: 12,
  cursor: "pointer",
  padding: 8,
  borderRadius: 8,
  transition: "background 0.2s"
};

const recommendedThumb = {
  width: 168,
  height: 94,
  borderRadius: 8,
  objectFit: "cover",
  flexShrink: 0
};

const recommendedTitle = {
  margin: 0,
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "1.4",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden"
};

const recommendedMeta = {
  margin: "4px 0 0 0",
  fontSize: "12px",
  color: "#aaa"
};