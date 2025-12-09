


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// export default function Profile() {
//   const { user } = useContext(AuthContext);
//   const [profileUser, setProfileUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [subscribed, setSubscribed] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams(); // channel id

//   useEffect(() => {
//     loadProfile();
//   }, [id]);

//   const loadProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const route = id
//         ? `http://localhost:5000/api/user/profile/${id}`
//         : `http://localhost:5000/api/user/profile`;

//       const res = await axios.get(route, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setProfileUser(res.data);
//       setVideos(res.data.videos);
//       setSubscribed(res.data.subscribers?.includes(user?._id) || false);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ⭐ Subscribe To Channel
//   const toggleSubscribe = async () => {
//     if (!user) return alert("Login first");
//     const token = localStorage.getItem("token");

//     await axios.post(
//       `http://localhost:5000/api/user/subscribe/${profileUser._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setSubscribed(!subscribed);
//   };

//   if (!profileUser) return <h2 style={{ padding: 20 }}>Loading...</h2>;

//   // 🎨 STYLES
//   const s = {
//     box: { padding: "30px", background: "#fafafa", minHeight: "100vh" },

//     profileCard: {
//       display: "flex",
//       alignItems: "center",
//       gap: "20px",
//       padding: "20px",
//       background: "#fff",
//       borderRadius: "14px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       marginBottom: "30px",
//     },

//     avatar: {
//       width: "80px",
//       height: "80px",
//       borderRadius: "50%",
//       objectFit: "cover",
//       border: "2px solid #ff0000",
//     },

//     subscribeBtn: {
//       padding: "10px 22px",
//       background: subscribed ? "#222" : "#ff0000",
//       color: "#fff",
//       borderRadius: "25px",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: 700,
//       fontSize: "15px",
//       marginTop: "12px",
//     },

//     uploadBtn: {
//       padding: "10px 22px",
//       background: "#007bff",
//       color: "#fff",
//       borderRadius: "25px",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: 600,
//       marginTop: "12px",
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//       gap: "25px",
//     },

//     card: {
//       background: "#fff",
//       padding: "12px",
//       borderRadius: "12px",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//       cursor: "pointer",
//       transition: ".25s",
//     },

//     cardHover: {
//       transform: "scale(1.03)",
//       boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
//     },

//     thumb: {
//       width: "100%",
//       height: "170px",
//       borderRadius: "10px",
//       objectFit: "cover",
//       marginBottom: "10px",
//     },
//   };

//   return (
//     <div style={s.box}>
//       {/* 👤 CHANNEL HEADER */}
//       <div style={s.profileCard}>
//         <img
//           src={
//             profileUser.avatar?.trim()
//               ? profileUser.avatar
//               : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//           }
//           alt="avatar"
//           style={s.avatar}
//         />

//         <div>
//           <h2 style={{ margin: 0 }}>{profileUser.name}</h2>
//           <p style={{ margin: "3px 0", color: "#555" }}>{profileUser.email}</p>
//           <p style={{ margin: "3px 0", fontWeight: 600 }}>
//             🔔 Subscribers: {profileUser.subscribers?.length || 0}
//           </p>

//           {user && user._id === profileUser._id ? (
//             <button style={s.uploadBtn} onClick={() => navigate("/UserUpload")}>
//               ⬆ Upload Video
//             </button>
//           ) : (
//             <button style={s.subscribeBtn} onClick={toggleSubscribe}>
//               {subscribed ? "✓ Subscribed" : "🔔 Subscribe"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* 🎥 VIDEO GRID */}
//       <h3 style={{ marginBottom: "10px" }}>📦 Videos by {profileUser.name}</h3>

//       <div style={s.grid}>
//         {videos.map((v) => (
//           <div
//             key={v._id}
//             style={s.card}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = s.cardHover.transform;
//               e.currentTarget.style.boxShadow = s.cardHover.boxShadow;
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
//             }}
//             onClick={() => navigate(`/watch/${v.filename}`)}
//           >
//             <img
//               src={`http://localhost:5000/uploads/${v.thumbnail}`}
//               style={s.thumb}
//               alt="thumb"
//             />
//             <p style={{ fontWeight: 600 }}>{v.title}</p>
//             <p style={{ color: "#777", fontSize: 13 }}>👁 {v.views} views</p>
//           </div>
//         ))}

//         {videos.length === 0 && <p>No uploads yet.</p>}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// export default function Profile() {
//   const { user } = useContext(AuthContext);
//   const [profileUser, setProfileUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [subscribed, setSubscribed] = useState(false);
//   const [activeTab, setActiveTab] = useState("videos");
//   const [subscribersCount, setSubscribersCount] = useState(0);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     loadProfile();
//   }, [id]);

//   const loadProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const route = id
//         ? `http://localhost:5000/api/user/profile/${id}`
//         : `http://localhost:5000/api/user/profile`;

//       const res = await axios.get(route, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setProfileUser(res.data);
//       setVideos(res.data.videos);
//       setSubscribed(res.data.subscribers?.includes(user?._id) || false);
//       setSubscribersCount(res.data.subscribers?.length || 0);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const toggleSubscribe = async () => {
//     if (!user) return alert("Login first");
//     const token = localStorage.getItem("token");

//     const res = await axios.post(
//       `http://localhost:5000/api/user/subscribe/${profileUser._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setSubscribed(res.data.subscribed);
//     setSubscribersCount(prev => res.data.subscribed ? prev + 1 : prev - 1);
//   };

//   if (!profileUser) {
//     return (
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", padding: 20 }}>
//         <h2 style={{ color: "#fff" }}>⏳ Loading...</h2>
//       </div>
//     );
//   }

//   const formatSubscribers = (count) => {
//     if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
//     if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
//     return count;
//   };

//   return (
//     <div style={styles.container}>
//       {/* 🎨 CHANNEL BANNER */}
//       <div style={styles.banner}>
//         <div style={styles.bannerGradient}></div>
//       </div>

//       {/* 👤 CHANNEL HEADER */}
//       <div style={styles.headerSection}>
//         <div style={styles.headerContent}>
//           <div style={styles.avatarSection}>
//             <div style={styles.avatarWrapper}>
//               <img
//                 src={
//                   profileUser.avatar?.trim()
//                     ? profileUser.avatar
//                     : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                 }
//                 alt="avatar"
//                 style={styles.avatar}
//               />
//             </div>

//             <div style={styles.channelInfo}>
//               <h1 style={styles.channelName}>{profileUser.name}</h1>
//               <div style={styles.channelStats}>
//                 <span>@{profileUser.name?.toLowerCase().replace(/\s+/g, '')}</span>
//                 <span style={styles.dot}>•</span>
//                 <span>{formatSubscribers(subscribersCount)} subscribers</span>
//                 <span style={styles.dot}>•</span>
//                 <span>{videos.length} videos</span>
//               </div>
//               <div style={styles.channelDescription}>
//                 {profileUser.email}
//               </div>
//             </div>
//           </div>

//           <div style={styles.actionButtons}>
//             {user && user._id === profileUser._id ? (
//               <>
//                 <button 
//                   style={styles.uploadButton} 
//                   onClick={() => navigate("/UserUpload")}
//                 >
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M14 13h-4v4H8v-4H4v-2h4V7h2v4h4v2zm-2-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm6 16H6V6h12v14z"/>
//                   </svg>
//                   Upload Video
//                 </button>
//                 <button style={styles.iconButton} title="Manage channel">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
//                   </svg>
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button 
//                   style={subscribed ? styles.subscribedButton : styles.subscribeButton}
//                   onClick={toggleSubscribe}
//                 >
//                   {subscribed ? (
//                     <>
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
//                       </svg>
//                       Subscribed
//                     </>
//                   ) : (
//                     <>Subscribe</>
//                   )}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 📑 TABS NAVIGATION */}
//       <div style={styles.tabsContainer}>
//         <div style={styles.tabs}>
//           <button
//             style={activeTab === "videos" ? styles.tabActive : styles.tab}
//             onClick={() => setActiveTab("videos")}
//           >
//             Videos
//           </button>
//           <button
//             style={activeTab === "about" ? styles.tabActive : styles.tab}
//             onClick={() => setActiveTab("about")}
//           >
//             About
//           </button>
//         </div>
//       </div>

//       {/* 📺 CONTENT SECTION */}
//       <div style={styles.contentSection}>
//         {activeTab === "videos" && (
//           <div style={styles.videosGrid}>
//             {videos.length === 0 ? (
//               <div style={styles.emptyState}>
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
//                   <path d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2zM4 7h16v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7zm8 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
//                 </svg>
//                 <h3 style={{ marginTop: 16, color: "#fff" }}>No videos yet</h3>
//                 <p style={{ color: "#aaa", marginTop: 8 }}>
//                   {user?._id === profileUser._id 
//                     ? "Upload your first video to get started" 
//                     : "This channel hasn't uploaded any videos yet"}
//                 </p>
//               </div>
//             ) : (
//               videos.map((v) => (
//                 <div
//                   key={v._id}
//                   style={styles.videoCard}
//                   onClick={() => navigate(`/watch/${v.filename}`)}
//                 >
//                   <div style={styles.thumbnailWrapper}>
//                     <img
//                       src={`http://localhost:5000/uploads/${v.thumbnail}`}
//                       style={styles.thumbnail}
//                       alt={v.title}
//                     />
//                     <div style={styles.playOverlay}>
//                       <svg viewBox="0 0 72 72" width="48" height="48">
//                         <circle cx="36" cy="36" r="34" fill="rgba(0,0,0,0.6)" />
//                         <path fill="#fff" d="M28 24l24 12-24 12z" />
//                       </svg>
//                     </div>
//                   </div>

//                   <div style={styles.videoInfo}>
//                     <h3 style={styles.videoTitle}>{v.title}</h3>
//                     <div style={styles.videoMeta}>
//                       <span>{v.views?.toLocaleString() || 0} views</span>
//                       <span style={styles.dot}>•</span>
//                       <span>{new Date(v.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {activeTab === "about" && (
//           <div style={styles.aboutSection}>
//             <div style={styles.aboutCard}>
//               <h3 style={{ marginBottom: 16 }}>Channel Details</h3>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Email:</span>
//                 <span>{profileUser.email}</span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Subscribers:</span>
//                 <span>{subscribersCount.toLocaleString()}</span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Total Videos:</span>
//                 <span>{videos.length}</span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Total Views:</span>
//                 <span>
//                   {videos.reduce((sum, v) => sum + (v.views || 0), 0).toLocaleString()}
//                 </span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Joined:</span>
//                 <span>{new Date(profileUser.createdAt).toLocaleDateString()}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* =======================
//    🎨 STYLES
// ======================= */
// const styles = {
//   container: {
//     background: "#0f0f0f",
//     minHeight: "100vh",
//     color: "#fff"
//   },

//   banner: {
//     height: "200px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     position: "relative",
//     overflow: "hidden"
//   },

//   bannerGradient: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(to bottom, transparent 0%, rgba(15,15,15,0.8) 100%)"
//   },

//   headerSection: {
//     padding: "24px 40px",
//     borderBottom: "1px solid #333"
//   },

//   headerContent: {
//     maxWidth: "1280px",
//     margin: "0 auto",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: 24
//   },

//   avatarSection: {
//     display: "flex",
//     gap: 24,
//     alignItems: "center",
//     flex: 1
//   },

//   avatarWrapper: {
//     position: "relative",
//     marginTop: "-60px"
//   },

//   avatar: {
//     width: "160px",
//     height: "160px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "4px solid #0f0f0f",
//     background: "#1f1f1f"
//   },

//   channelInfo: {
//     flex: 1
//   },

//   channelName: {
//     fontSize: "36px",
//     fontWeight: 700,
//     margin: "0 0 8px 0",
//     letterSpacing: "-0.5px"
//   },

//   channelStats: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     color: "#aaa",
//     fontSize: "14px",
//     marginBottom: 12
//   },

//   channelDescription: {
//     color: "#ccc",
//     fontSize: "14px",
//     lineHeight: 1.6
//   },

//   dot: {
//     color: "#606060"
//   },

//   actionButtons: {
//     display: "flex",
//     gap: 12,
//     alignItems: "center"
//   },

//   subscribeButton: {
//     padding: "12px 24px",
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     borderRadius: 24,
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     transition: "background 0.2s"
//   },

//   subscribedButton: {
//     padding: "12px 24px",
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: 24,
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     transition: "background 0.2s"
//   },

//   uploadButton: {
//     padding: "12px 24px",
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: 24,
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     transition: "background 0.2s"
//   },

//   iconButton: {
//     width: 40,
//     height: 40,
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50%",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "background 0.2s"
//   },

//   tabsContainer: {
//     borderBottom: "1px solid #333",
//     padding: "0 40px"
//   },

//   tabs: {
//     maxWidth: "1280px",
//     margin: "0 auto",
//     display: "flex",
//     gap: 32
//   },

//   tab: {
//     padding: "16px 0",
//     background: "none",
//     border: "none",
//     color: "#aaa",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     borderBottom: "2px solid transparent",
//     transition: "color 0.2s"
//   },

//   tabActive: {
//     padding: "16px 0",
//     background: "none",
//     border: "none",
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     borderBottom: "2px solid #fff"
//   },

//   contentSection: {
//     maxWidth: "1280px",
//     margin: "0 auto",
//     padding: "40px"
//   },

//   videosGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
//     gap: 24
//   },

//   videoCard: {
//     cursor: "pointer",
//     transition: "transform 0.2s",
//     background: "#1a1a1a",
//     borderRadius: 12,
//     overflow: "hidden"
//   },

//   thumbnailWrapper: {
//     position: "relative",
//     width: "100%",
//     paddingBottom: "56.25%",
//     background: "#000",
//     overflow: "hidden"
//   },

//   thumbnail: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     transition: "transform 0.3s"
//   },

//   playOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.3)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     opacity: 0,
//     transition: "opacity 0.3s"
//   },

//   videoInfo: {
//     padding: 12
//   },

//   videoTitle: {
//     fontSize: "16px",
//     fontWeight: 600,
//     margin: "0 0 8px 0",
//     lineHeight: 1.4,
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden"
//   },

//   videoMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#aaa",
//     fontSize: "13px"
//   },

//   emptyState: {
//     gridColumn: "1 / -1",
//     textAlign: "center",
//     padding: "80px 20px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center"
//   },

//   aboutSection: {
//     maxWidth: "800px"
//   },

//   aboutCard: {
//     background: "#1a1a1a",
//     padding: 24,
//     borderRadius: 12
//   },

//   aboutItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "12px 0",
//     borderBottom: "1px solid #272727",
//     fontSize: "14px"
//   },

//   aboutLabel: {
//     color: "#aaa",
//     fontWeight: 600
//   }
// };


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// export default function Profile() {
//   const { user } = useContext(AuthContext);
//   const [profileUser, setProfileUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [subscribed, setSubscribed] = useState(false);
//   const [activeTab, setActiveTab] = useState("videos");
//   const [subscribersCount, setSubscribersCount] = useState(0);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     loadProfile();
//   }, [id]);

//   useEffect(() => {
//     if (activeTab === "history" && user && !id) {
//       loadHistory();
//     }
//   }, [activeTab]);

//   const loadProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const route = id
//         ? `http://localhost:5000/api/user/profile/${id}`
//         : `http://localhost:5000/api/user/profile`;

//       const res = await axios.get(route, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setProfileUser(res.data);
//       setVideos(res.data.videos);
//       setSubscribed(res.data.subscribers?.includes(user?._id) || false);
//       setSubscribersCount(res.data.subscribers?.length || 0);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const loadHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/user/watch-history", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setHistory(res.data);
//     } catch (err) {
//       console.error("Failed to load history:", err);
//     }
//   };

//   const removeFromHistory = async (videoId, e) => {
//     e.stopPropagation();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/user/watch-history/${videoId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setHistory(history.filter(item => item.video._id !== videoId));
//     } catch (err) {
//       console.error("Failed to remove from history:", err);
//     }
//   };

//   const clearAllHistory = async () => {
//     if (!window.confirm("Clear all watch history?")) return;
    
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete("http://localhost:5000/api/user/watch-history", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setHistory([]);
//       alert("History cleared!");
//     } catch (err) {
//       console.error("Failed to clear history:", err);
//     }
//   };

//   const toggleSubscribe = async () => {
//     if (!user) return alert("Login first");
//     const token = localStorage.getItem("token");

//     const res = await axios.post(
//       `http://localhost:5000/api/user/subscribe/${profileUser._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setSubscribed(res.data.subscribed);
//     setSubscribersCount(prev => res.data.subscribed ? prev + 1 : prev - 1);
//   };

//   if (!profileUser) {
//     return (
//       <div style={{ background: "#0f0f0f", minHeight: "100vh", padding: 20 }}>
//         <h2 style={{ color: "#fff" }}>⏳ Loading...</h2>
//       </div>
//     );
//   }

//   const formatSubscribers = (count) => {
//     if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
//     if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
//     return count;
//   };

//   const isOwnProfile = user && user._id === profileUser._id;

//   return (
//     <div style={styles.container}>
//       {/* 🎨 CHANNEL BANNER */}
//       <div style={styles.banner}>
//         <div style={styles.bannerGradient}></div>
//       </div>

//       {/* 👤 CHANNEL HEADER */}
//       <div style={styles.headerSection}>
//         <div style={styles.headerContent}>
//           <div style={styles.avatarSection}>
//             <div style={styles.avatarWrapper}>
//               <img
//                 src={
//                   profileUser.avatar?.trim()
//                     ? profileUser.avatar
//                     : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                 }
//                 alt="avatar"
//                 style={styles.avatar}
//               />
//             </div>

//             <div style={styles.channelInfo}>
//               <h1 style={styles.channelName}>{profileUser.name}</h1>
//               <div style={styles.channelStats}>
//                 <span>@{profileUser.name?.toLowerCase().replace(/\s+/g, '')}</span>
//                 <span style={styles.dot}>•</span>
//                 <span>{formatSubscribers(subscribersCount)} subscribers</span>
//                 <span style={styles.dot}>•</span>
//                 <span>{videos.length} videos</span>
//               </div>
//               <div style={styles.channelDescription}>
//                 {profileUser.email}
//               </div>
//             </div>
//           </div>

//           <div style={styles.actionButtons}>
//             {isOwnProfile ? (
//               <>
//                 <button 
//                   style={styles.uploadButton} 
//                   onClick={() => navigate("/UserUpload")}
//                 >
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M14 13h-4v4H8v-4H4v-2h4V7h2v4h4v2zm-2-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm6 16H6V6h12v14z"/>
//                   </svg>
//                   Upload Video
//                 </button>
//                 <button style={styles.iconButton} title="Manage channel">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
//                   </svg>
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button 
//                   style={subscribed ? styles.subscribedButton : styles.subscribeButton}
//                   onClick={toggleSubscribe}
//                 >
//                   {subscribed ? (
//                     <>
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
//                       </svg>
//                       Subscribed
//                     </>
//                   ) : (
//                     <>Subscribe</>
//                   )}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 📑 TABS NAVIGATION */}
//       <div style={styles.tabsContainer}>
//         <div style={styles.tabs}>
//           <button
//             style={activeTab === "videos" ? styles.tabActive : styles.tab}
//             onClick={() => setActiveTab("videos")}
//           >
//             Videos
//           </button>
//           {isOwnProfile && (
//             <button
//               style={activeTab === "history" ? styles.tabActive : styles.tab}
//               onClick={() => setActiveTab("history")}
//             >
//               History
//             </button>
//           )}
//           <button
//             style={activeTab === "about" ? styles.tabActive : styles.tab}
//             onClick={() => setActiveTab("about")}
//           >
//             About
//           </button>
//         </div>
//       </div>

//       {/* 📺 CONTENT SECTION */}
//       <div style={styles.contentSection}>
//         {/* VIDEOS TAB */}
//         {activeTab === "videos" && (
//           <div style={styles.videosGrid}>
//             {videos.length === 0 ? (
//               <div style={styles.emptyState}>
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
//                   <path d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2zM4 7h16v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7zm8 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
//                 </svg>
//                 <h3 style={{ marginTop: 16, color: "#fff" }}>No videos yet</h3>
//                 <p style={{ color: "#aaa", marginTop: 8 }}>
//                   {isOwnProfile 
//                     ? "Upload your first video to get started" 
//                     : "This channel hasn't uploaded any videos yet"}
//                 </p>
//               </div>
//             ) : (
//               videos.map((v) => (
//                 <div
//                   key={v._id}
//                   style={styles.videoCard}
//                   onClick={() => navigate(`/watch/${v.filename}`)}
//                 >
//                   <div style={styles.thumbnailWrapper}>
//                     <img
//                       src={`http://localhost:5000/uploads/${v.thumbnail}`}
//                       style={styles.thumbnail}
//                       alt={v.title}
//                     />
//                     <div style={styles.playOverlay}>
//                       <svg viewBox="0 0 72 72" width="48" height="48">
//                         <circle cx="36" cy="36" r="34" fill="rgba(0,0,0,0.6)" />
//                         <path fill="#fff" d="M28 24l24 12-24 12z" />
//                       </svg>
//                     </div>
//                   </div>

//                   <div style={styles.videoInfo}>
//                     <h3 style={styles.videoTitle}>{v.title}</h3>
//                     <div style={styles.videoMeta}>
//                       <span>{v.views?.toLocaleString() || 0} views</span>
//                       <span style={styles.dot}>•</span>
//                       <span>{new Date(v.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* HISTORY TAB */}
//         {activeTab === "history" && isOwnProfile && (
//           <div>
//             <div style={styles.historyHeader}>
//               <h3 style={{ fontSize: "20px", fontWeight: 600 }}>
//                 Watch History ({history.length})
//               </h3>
//               {history.length > 0 && (
//                 <button style={styles.clearHistoryBtn} onClick={clearAllHistory}>
//                   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
//                   </svg>
//                   Clear All
//                 </button>
//               )}
//             </div>

//             {history.length === 0 ? (
//               <div style={styles.emptyState}>
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
//                   <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
//                 </svg>
//                 <h3 style={{ marginTop: 16, color: "#fff" }}>No watch history</h3>
//                 <p style={{ color: "#aaa", marginTop: 8 }}>
//                   Videos you watch will appear here
//                 </p>
//               </div>
//             ) : (
//               <div style={styles.historyList}>
//                 {history.map((item) => (
//                   <div
//                     key={item._id}
//                     style={styles.historyItem}
//                     onClick={() => navigate(`/watch/${item.video.filename}`)}
//                   >
//                     <div style={styles.historyThumbnail}>
//                       <img
//                         src={`http://localhost:5000/uploads/${item.video.thumbnail}`}
//                         alt={item.video.title}
//                         style={styles.historyThumbImg}
//                       />
//                       <div style={styles.playOverlay}>
//                         <svg viewBox="0 0 72 72" width="36" height="36">
//                           <circle cx="36" cy="36" r="34" fill="rgba(0,0,0,0.6)" />
//                           <path fill="#fff" d="M28 24l24 12-24 12z" />
//                         </svg>
//                       </div>
//                     </div>

//                     <div style={styles.historyDetails}>
//                       <h4 style={styles.historyTitle}>{item.video.title}</h4>
//                       <div style={styles.historyMeta}>
//                         <span style={{ color: "#aaa" }}>
//                           {item.video.uploadedBy?.name || "Unknown"}
//                         </span>
//                         <span style={styles.dot}>•</span>
//                         <span style={{ color: "#666" }}>
//                           {item.video.views?.toLocaleString() || 0} views
//                         </span>
//                         <span style={styles.dot}>•</span>
//                         <span style={{ color: "#666" }}>
//                           Watched {new Date(item.watchedAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>

//                     <button
//                       style={styles.removeBtn}
//                       onClick={(e) => removeFromHistory(item.video._id, e)}
//                       title="Remove from history"
//                     >
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ABOUT TAB */}
//         {activeTab === "about" && (
//           <div style={styles.aboutSection}>
//             <div style={styles.aboutCard}>
//               <h3 style={{ marginBottom: 16 }}>Channel Details</h3>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Email:</span>
//                 <span>{profileUser.email}</span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Subscribers:</span>
//                 <span>{subscribersCount.toLocaleString()}</span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Total Videos:</span>
//                 <span>{videos.length}</span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Total Views:</span>
//                 <span>
//                   {videos.reduce((sum, v) => sum + (v.views || 0), 0).toLocaleString()}
//                 </span>
//               </div>
//               <div style={styles.aboutItem}>
//                 <span style={styles.aboutLabel}>Joined:</span>
//                 <span>{new Date(profileUser.createdAt).toLocaleDateString()}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* =======================
//    🎨 STYLES
// ======================= */
// const styles = {
//   container: {
//     background: "#0f0f0f",
//     minHeight: "100vh",
//     color: "#fff"
//   },

//   banner: {
//     height: "200px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     position: "relative",
//     overflow: "hidden"
//   },

//   bannerGradient: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(to bottom, transparent 0%, rgba(15,15,15,0.8) 100%)"
//   },

//   headerSection: {
//     padding: "24px 40px",
//     borderBottom: "1px solid #333"
//   },

//   headerContent: {
//     maxWidth: "1280px",
//     margin: "0 auto",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: 24
//   },

//   avatarSection: {
//     display: "flex",
//     gap: 24,
//     alignItems: "center",
//     flex: 1
//   },

//   avatarWrapper: {
//     position: "relative",
//     marginTop: "-60px"
//   },

//   avatar: {
//     width: "160px",
//     height: "160px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "4px solid #0f0f0f",
//     background: "#1f1f1f"
//   },

//   channelInfo: {
//     flex: 1
//   },

//   channelName: {
//     fontSize: "36px",
//     fontWeight: 700,
//     margin: "0 0 8px 0",
//     letterSpacing: "-0.5px"
//   },

//   channelStats: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     color: "#aaa",
//     fontSize: "14px",
//     marginBottom: 12
//   },

//   channelDescription: {
//     color: "#ccc",
//     fontSize: "14px",
//     lineHeight: 1.6
//   },

//   dot: {
//     color: "#606060"
//   },

//   actionButtons: {
//     display: "flex",
//     gap: 12,
//     alignItems: "center"
//   },

//   subscribeButton: {
//     padding: "12px 24px",
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     borderRadius: 24,
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     transition: "background 0.2s"
//   },

//   subscribedButton: {
//     padding: "12px 24px",
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: 24,
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     transition: "background 0.2s"
//   },

//   uploadButton: {
//     padding: "12px 24px",
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: 24,
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     transition: "background 0.2s"
//   },

//   iconButton: {
//     width: 40,
//     height: 40,
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50%",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "background 0.2s"
//   },

//   tabsContainer: {
//     borderBottom: "1px solid #333",
//     padding: "0 40px"
//   },

//   tabs: {
//     maxWidth: "1280px",
//     margin: "0 auto",
//     display: "flex",
//     gap: 32
//   },

//   tab: {
//     padding: "16px 0",
//     background: "none",
//     border: "none",
//     color: "#aaa",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     borderBottom: "2px solid transparent",
//     transition: "color 0.2s"
//   },

//   tabActive: {
//     padding: "16px 0",
//     background: "none",
//     border: "none",
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     borderBottom: "2px solid #fff"
//   },

//   contentSection: {
//     maxWidth: "1280px",
//     margin: "0 auto",
//     padding: "40px"
//   },

//   videosGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
//     gap: 24
//   },

//   videoCard: {
//     cursor: "pointer",
//     transition: "transform 0.2s",
//     background: "#1a1a1a",
//     borderRadius: 12,
//     overflow: "hidden"
//   },

//   thumbnailWrapper: {
//     position: "relative",
//     width: "100%",
//     paddingBottom: "56.25%",
//     background: "#000",
//     overflow: "hidden"
//   },

//   thumbnail: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     transition: "transform 0.3s"
//   },

//   playOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.3)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     opacity: 0,
//     transition: "opacity 0.3s"
//   },

//   videoInfo: {
//     padding: 12
//   },

//   videoTitle: {
//     fontSize: "16px",
//     fontWeight: 600,
//     margin: "0 0 8px 0",
//     lineHeight: 1.4,
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden"
//   },

//   videoMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#aaa",
//     fontSize: "13px"
//   },

//   emptyState: {
//     gridColumn: "1 / -1",
//     textAlign: "center",
//     padding: "80px 20px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center"
//   },

//   historyHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 24
//   },

//   clearHistoryBtn: {
//     padding: "10px 20px",
//     background: "#272727",
//     border: "1px solid #3f3f3f",
//     borderRadius: 8,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     transition: "background 0.2s"
//   },

//   historyList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 16
//   },

//   historyItem: {
//     display: "flex",
//     gap: 16,
//     padding: 12,
//     background: "#1a1a1a",
//     borderRadius: 12,
//     cursor: "pointer",
//     transition: "background 0.2s",
//     position: "relative"
//   },

//   historyThumbnail: {
//     position: "relative",
//     width: 240,
//     height: 135,
//     flexShrink: 0,
//     borderRadius: 8,
//     overflow: "hidden"
//   },

//   historyThumbImg: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover"
//   },

//   historyDetails: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: 8
//   },

//   historyTitle: {
//     fontSize: "16px",
//     fontWeight: 600,
//     margin: 0,
//     lineHeight: 1.4,
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden"
//   },

//   historyMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: "13px"
//   },

//   removeBtn: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     width: 36,
//     height: 36,
//     background: "rgba(0,0,0,0.8)",
//     border: "none",
//     borderRadius: "50%",
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     opacity: 0,
//     transition: "opacity 0.2s"
//   },

//   aboutSection: {
//     maxWidth: "800px"
//   },

//   aboutCard: {
//     background: "#1a1a1a",
//     padding: 24,
//     borderRadius: 12
//   },

//   aboutItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "12px 0",
//     borderBottom: "1px solid #272727",
//     fontSize: "14px"
//   },

//   aboutLabel: {
//     color: "#aaa",
//     fontWeight: 600
//   }
// };
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [subscribersCount, setSubscribersCount] = useState(0);
  
  // Edit modal states
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnail, setEditThumbnail] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const categories = [
    "Gaming", "Music", "Education", "Entertainment", "Sports",
    "Technology", "Cooking", "Travel", "Vlogs", "News",
    "Comedy", "Animation", "Science", "Fashion", "Fitness", "Other"
  ];

  useEffect(() => {
    loadProfile();
  }, [id]);

  useEffect(() => {
    if (activeTab === "history" && user && !id) {
      loadHistory();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const route = id
        ? `http://localhost:5000/api/user/profile/${id}`
        : `http://localhost:5000/api/user/profile`;

      const res = await axios.get(route, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileUser(res.data);
      setVideos(res.data.videos);
      setSubscribed(res.data.subscribers?.includes(user?._id) || false);
      setSubscribersCount(res.data.subscribers?.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user/watch-history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const removeFromHistory = async (videoId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/user/watch-history/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(history.filter(item => item.video._id !== videoId));
    } catch (err) {
      console.error("Failed to remove from history:", err);
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm("Clear all watch history?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/user/watch-history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory([]);
      alert("History cleared!");
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const toggleSubscribe = async () => {
    if (!user) return alert("Login first");
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `http://localhost:5000/api/user/subscribe/${profileUser._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSubscribed(res.data.subscribed);
    setSubscribersCount(prev => res.data.subscribed ? prev + 1 : prev - 1);
  };

  // Open edit modal
  const openEditModal = (video, e) => {
    e.stopPropagation();
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditCategory(video.category || "");
    setEditDescription(video.description || "");
    setEditThumbnail(null);
  };

  // Update video
  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("category", editCategory);
      formData.append("description", editDescription);
      if (editThumbnail) {
        formData.append("thumbnail", editThumbnail);
      }

      await axios.put(
        `http://localhost:5000/api/videos/${editingVideo._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Video updated successfully!");
      setEditingVideo(null);
      loadProfile();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update video");
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🗑️ Video deleted successfully!");
      setShowDeleteConfirm(null);
      loadProfile();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete video");
    }
  };

  if (!profileUser) {
    return (
      <div style={{ background: "#0f0f0f", minHeight: "100vh", padding: 20 }}>
        <h2 style={{ color: "#fff" }}>⏳ Loading...</h2>
      </div>
    );
  }

  const formatSubscribers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const isOwnProfile = user && user._id === profileUser._id;

  return (
    <div style={styles.container}>
      {/* 🎨 CHANNEL BANNER */}
      <div style={styles.banner}>
        <div style={styles.bannerGradient}></div>
      </div>

      {/* 👤 CHANNEL HEADER */}
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              <img
                src={
                  profileUser.avatar?.trim()
                    ? profileUser.avatar
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                style={styles.avatar}
              />
            </div>

            <div style={styles.channelInfo}>
              <h1 style={styles.channelName}>{profileUser.name}</h1>
              <div style={styles.channelStats}>
                <span>@{profileUser.name?.toLowerCase().replace(/\s+/g, '')}</span>
                <span style={styles.dot}>•</span>
                <span>{formatSubscribers(subscribersCount)} subscribers</span>
                <span style={styles.dot}>•</span>
                <span>{videos.length} videos</span>
              </div>
              <div style={styles.channelDescription}>
                {profileUser.email}
              </div>
            </div>
          </div>

          <div style={styles.actionButtons}>
            {isOwnProfile ? (
              <>
                <button 
                  style={styles.uploadButton} 
                  onClick={() => navigate("/UserUpload")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 13h-4v4H8v-4H4v-2h4V7h2v4h4v2zm-2-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm6 16H6V6h12v14z"/>
                  </svg>
                  Upload Video
                </button>
                <button style={styles.iconButton} title="Manage channel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                  </svg>
                </button>
              </>
            ) : (
              <button 
                style={subscribed ? styles.subscribedButton : styles.subscribeButton}
                onClick={toggleSubscribe}
              >
                {subscribed ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                    </svg>
                    Subscribed
                  </>
                ) : (
                  <>Subscribe</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📑 TABS NAVIGATION */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button
            style={activeTab === "videos" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          {isOwnProfile && (
            <button
              style={activeTab === "history" ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          )}
          <button
            style={activeTab === "about" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>
      </div>

      {/* 📺 CONTENT SECTION */}
      <div style={styles.contentSection}>
        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div style={styles.videosGrid}>
            {videos.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
                  <path d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2zM4 7h16v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7zm8 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                <h3 style={{ marginTop: 16, color: "#fff" }}>No videos yet</h3>
                <p style={{ color: "#aaa", marginTop: 8 }}>
                  {isOwnProfile 
                    ? "Upload your first video to get started" 
                    : "This channel hasn't uploaded any videos yet"}
                </p>
              </div>
            ) : (
              videos.map((v) => (
                <div key={v._id} style={styles.videoCard}>
                  <div
                    style={styles.thumbnailWrapper}
                    onClick={() => navigate(`/watch/${v.filename}`)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${v.thumbnail}`}
                      style={styles.thumbnail}
                      alt={v.title}
                    />
                    <div style={styles.playOverlay}>
                      <svg viewBox="0 0 72 72" width="48" height="48">
                        <circle cx="36" cy="36" r="34" fill="rgba(0,0,0,0.6)" />
                        <path fill="#fff" d="M28 24l24 12-24 12z" />
                      </svg>
                    </div>
                    {v.category && <div style={styles.categoryBadge}>{v.category}</div>}
                  </div>

                  <div style={styles.videoInfo}>
                    <h3 
                      style={styles.videoTitle}
                      onClick={() => navigate(`/watch/${v.filename}`)}
                    >
                      {v.title}
                    </h3>
                    <div style={styles.videoMeta}>
                      <span>{v.views?.toLocaleString() || 0} views</span>
                      <span style={styles.dot}>•</span>
                      <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* CRUD Buttons - Only show for own videos */}
                    {isOwnProfile && (
                      <div style={styles.actionButtonsInline}>
                        <button 
                          style={styles.editBtn} 
                          onClick={(e) => openEditModal(v, e)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          style={styles.deleteBtn} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(v._id);
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && isOwnProfile && (
          <div>
            <div style={styles.historyHeader}>
              <h3 style={{ fontSize: "20px", fontWeight: 600 }}>
                Watch History ({history.length})
              </h3>
              {history.length > 0 && (
                <button style={styles.clearHistoryBtn} onClick={clearAllHistory}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
                <h3 style={{ marginTop: 16, color: "#fff" }}>No watch history</h3>
                <p style={{ color: "#aaa", marginTop: 8 }}>
                  Videos you watch will appear here
                </p>
              </div>
            ) : (
              <div style={styles.historyList}>
                {history.map((item) => (
                  <div
                    key={item._id}
                    style={styles.historyItem}
                    onClick={() => navigate(`/watch/${item.video.filename}`)}
                    onMouseEnter={(e) => {
                      const btn = e.currentTarget.querySelector('[data-remove-btn]');
                      if (btn) btn.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const btn = e.currentTarget.querySelector('[data-remove-btn]');
                      if (btn) btn.style.opacity = '0';
                    }}
                  >
                    <div style={styles.historyThumbnail}>
                      <img
                        src={`http://localhost:5000/uploads/${item.video.thumbnail}`}
                        alt={item.video.title}
                        style={styles.historyThumbImg}
                      />
                      <div style={styles.playOverlay}>
                        <svg viewBox="0 0 72 72" width="36" height="36">
                          <circle cx="36" cy="36" r="34" fill="rgba(0,0,0,0.6)" />
                          <path fill="#fff" d="M28 24l24 12-24 12z" />
                        </svg>
                      </div>
                    </div>

                    <div style={styles.historyDetails}>
                      <h4 style={styles.historyTitle}>{item.video.title}</h4>
                      <div style={styles.historyMeta}>
                        <span style={{ color: "#aaa" }}>
                          {item.video.uploadedBy?.name || "Unknown"}
                        </span>
                        <span style={styles.dot}>•</span>
                        <span style={{ color: "#666" }}>
                          {item.video.views?.toLocaleString() || 0} views
                        </span>
                        <span style={styles.dot}>•</span>
                        <span style={{ color: "#666" }}>
                          Watched {new Date(item.watchedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      data-remove-btn
                      style={styles.removeBtn}
                      onClick={(e) => removeFromHistory(item.video._id, e)}
                      title="Remove from history"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div style={styles.aboutSection}>
            <div style={styles.aboutCard}>
              <h3 style={{ marginBottom: 16 }}>Channel Details</h3>
              <div style={styles.aboutItem}>
                <span style={styles.aboutLabel}>Email:</span>
                <span>{profileUser.email}</span>
              </div>
              <div style={styles.aboutItem}>
                <span style={styles.aboutLabel}>Subscribers:</span>
                <span>{subscribersCount.toLocaleString()}</span>
              </div>
              <div style={styles.aboutItem}>
                <span style={styles.aboutLabel}>Total Videos:</span>
                <span>{videos.length}</span>
              </div>
              <div style={styles.aboutItem}>
                <span style={styles.aboutLabel}>Total Views:</span>
                <span>
                  {videos.reduce((sum, v) => sum + (v.views || 0), 0).toLocaleString()}
                </span>
              </div>
              <div style={styles.aboutItem}>
                <span style={styles.aboutLabel}>Joined:</span>
                <span>{new Date(profileUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingVideo && (
        <div style={styles.modalOverlay} onClick={() => setEditingVideo(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>✏️ Edit Video</h2>

            <form onSubmit={handleUpdateVideo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Choose category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={styles.textarea}
                  rows="4"
                  placeholder="Add a description..."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Update Thumbnail (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditThumbnail(e.target.files[0])}
                  style={styles.fileInput}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setEditingVideo(null)}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay} onClick={() => setShowDeleteConfirm(null)}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.confirmTitle}>🗑️ Delete Video?</h2>
            <p style={styles.confirmText}>
              Are you sure you want to delete this video? This action cannot be undone.
            </p>
            <div style={styles.modalActions}>
              <button 
                style={styles.cancelBtn} 
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmDeleteBtn} 
                onClick={() => handleDeleteVideo(showDeleteConfirm)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   🎨 STYLES
======================= */
const styles = {
  container: {
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "#fff"
  },
  banner: {
    height: "200px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    overflow: "hidden"
  },
  bannerGradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, transparent 0%, rgba(15,15,15,0.8) 100%)"
  },
  headerSection: {
    padding: "24px 40px",
    borderBottom: "1px solid #333"
  },
  headerContent: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24
  },
  avatarSection: {
    display: "flex",
    gap: 24,
    alignItems: "center",
    flex: 1
  },
  avatarWrapper: {
    position: "relative",
    marginTop: "-60px"
  },
  avatar: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #0f0f0f",
    background: "#1f1f1f"
  },
  channelInfo: {
    flex: 1
  },
  channelName: {
    fontSize: "36px",
    fontWeight: 700,
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px"
  },
  channelStats: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#aaa",
    fontSize: "14px",
    marginBottom: 12
  },
  channelDescription: {
    color: "#ccc",
    fontSize: "14px",
    lineHeight: 1.6
  },
  dot: {
    color: "#606060"
  },
  actionButtons: {
    display: "flex",
    gap: 12,
    alignItems: "center"
  },
  subscribeButton: {
    padding: "12px 24px",
    background: "#ff0000",
    color: "#fff",
    border: "none",
    borderRadius: 24,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "background 0.2s"
  },
  subscribedButton: {
    padding: "12px 24px",
    background: "#272727",
    color: "#fff",
    border: "none",
    borderRadius: 24,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "background 0.2s"
  },
  uploadButton: {
    padding: "12px 24px",
    background: "#272727",
    color: "#fff",
    border: "none",
    borderRadius: 24,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "background 0.2s"
  },
  iconButton: {
    width: 40,
    height: 40,
    background: "#272727",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s"
  },
  tabsContainer: {
    borderBottom: "1px solid #333",
    padding: "0 40px"
  },
  tabs: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    gap: 32
  },
  tab: {
    padding: "16px 0",
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    transition: "color 0.2s"
  },
  tabActive: {
    padding: "16px 0",
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "2px solid #fff"
  },
  contentSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "40px"
  },
  videosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24
  },
  videoCard: {
    cursor: "pointer",
    transition: "transform 0.2s",
    background: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden"
  },
  thumbnailWrapper: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%",
    background: "#000",
    overflow: "hidden"
  },
  thumbnail: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s"
  },
  playOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s"
  },
  categoryBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(255, 0, 51, 0.95)",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600"
  },
  videoInfo: {
    padding: 12
  },
  videoTitle: {
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 8px 0",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    cursor: "pointer"
  },
  videoMeta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#aaa",
    fontSize: "13px"
  },
  actionButtonsInline: {
    display: "flex",
    gap: 10,
    marginTop: 12
  },
  editBtn: {
    flex: 1,
    padding: "8px 16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s"
  },
  deleteBtn: {
    flex: 1,
    padding: "8px 16px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s"
  },
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "80px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },
  clearHistoryBtn: {
    padding: "10px 20px",
    background: "#272727",
    border: "1px solid #3f3f3f",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "background 0.2s"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  historyItem: {
    display: "flex",
    gap: 16,
    padding: 12,
    background: "#1a1a1a",
    borderRadius: 12,
    cursor: "pointer",
    transition: "background 0.2s",
    position: "relative"
  },
  historyThumbnail: {
    position: "relative",
    width: 240,
    height: 135,
    flexShrink: 0,
    borderRadius: 8,
    overflow: "hidden"
  },
  historyThumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  historyDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  historyTitle: {
    fontSize: "16px",
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  historyMeta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "13px"
  },
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    background: "rgba(0,0,0,0.8)",
    border: "none",
    borderRadius: "50%",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s"
  },
  aboutSection: {
    maxWidth: "800px"
  },
  aboutCard: {
    background: "#1a1a1a",
    padding: 24,
    borderRadius: 12
  },
  aboutItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #272727",
    fontSize: "14px"
  },
  aboutLabel: {
    color: "#aaa",
    fontWeight: 600
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#1a1a1a",
    borderRadius: "16px",
    padding: "30px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid #333"
  },
  confirmModal: {
    background: "#1a1a1a",
    borderRadius: "16px",
    padding: "30px",
    maxWidth: "400px",
    width: "90%",
    border: "1px solid #333"
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "24px"
  },
  confirmTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px"
  },
  confirmText: {
    color: "#aaa",
    fontSize: "15px",
    marginBottom: "24px",
    lineHeight: "1.5"
  },
  formGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  },
  select: {
    width: "100%",
    padding: "12px",
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px"
  },
  cancelBtn: {
    padding: "10px 24px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  },
  saveBtn: {
    padding: "10px 24px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  },
  confirmDeleteBtn: {
    padding: "10px 24px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  }
};