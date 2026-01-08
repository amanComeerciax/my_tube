

// import React, { useEffect, useState, useContext } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// export default function Profile() {
//   // const { user } = useContext(AuthContext);
//   const { user, updateUser } = useContext(AuthContext);
//   const [profileUser, setProfileUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [subscribed, setSubscribed] = useState(false);
//   const [activeTab, setActiveTab] = useState("videos");
//   const [subscribersCount, setSubscribersCount] = useState(0);

//   // Edit modal states
//   const [editingVideo, setEditingVideo] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editCategory, setEditCategory] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [editThumbnail, setEditThumbnail] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   const categories = [
//     "Gaming", "Music", "Education", "Entertainment", "Sports",
//     "Technology", "Cooking", "Travel", "Vlogs", "News",
//     "Comedy", "Animation", "Science", "Fashion", "Fitness", "Other"
//   ];

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
//       const route = id
//         ? `/api/user/profile/${id}`
//         : `/api/user/profile`;

//       const res = await api.get(route, {

//       });

//       setProfileUser(res.data);
//       setVideos(res.data.videos);
//       setSubscribed(res.data.subscribers?.includes(user?._id) || false);
//       setSubscribersCount(res.data.subscribers?.length || 0);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("avatar", file);

//     try {
//       const res = await api.put("/api/user/update-avatar", formData);

//       // Update Local States
//       setProfileUser({ ...profileUser, avatar: res.data.avatar });
//       updateUser({ ...user, avatar: res.data.avatar }); // Context update
//       alert("✅ Profile photo updated!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to upload photo");
//     }
//   };

//   const loadHistory = async () => {
//     try {
//       const res = await api.get("/api/user/watch-history", {

//       });
//       setHistory(res.data);
//     } catch (err) {
//       console.error("Failed to load history:", err);
//     }
//   };

//   const removeFromHistory = async (videoId, e) => {
//     e.stopPropagation();
//     try {
//       await api.delete(`/api/user/watch-history/${videoId}`, {

//       });
//       setHistory(history.filter(item => item.video._id !== videoId));
//     } catch (err) {
//       console.error("Failed to remove from history:", err);
//     }
//   };

//   const clearAllHistory = async () => {
//     if (!window.confirm("Clear all watch history?")) return;

//     try {
//       await api.delete("/api/user/watch-history", {

//       });
//       setHistory([]);
//       alert("History cleared!");
//     } catch (err) {
//       console.error("Failed to clear history:", err);
//     }
//   };

//   const toggleSubscribe = async () => {


//     if (!user) return alert("Login first");

//     const res = await api.post(
//       `/api/user/subscribe/${profileUser._id}`,
//       {},
//       {}
//     );

//     setSubscribed(res.data.subscribed);
//     setSubscribersCount(prev => res.data.subscribed ? prev + 1 : prev - 1);
//   };

//   // 💰 APPLY FOR MONETIZATION
//   const applyForMonetization = async () => {
//     try {

//       const res = await api.post(
//         "/api/monetization/apply",
//         {},
//         {

//         }
//       );

//       alert(res.data.message);

//       // 🔄 Reload profile to get updated monetization status
//       loadProfile();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to apply for monetization");
//     }
//   };


//   // Open edit modal
//   const openEditModal = (video, e) => {
//     e.stopPropagation();
//     setEditingVideo(video);
//     setEditTitle(video.title);
//     setEditCategory(video.category || "");
//     setEditDescription(video.description || "");
//     setEditThumbnail(null);
//   };
//   //razorpay 

//   const loadRazorpay = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };
//   // premium subscribe

//   const buyPremium = async () => {
//     const res = await loadRazorpay();
//     if (!res) {
//       alert("Razorpay SDK failed to load");
//       return;
//     }

//     try {

//       // 1️⃣ Create order
//       const orderRes = await api.post(
//         "/api/premium/create-order",
//         {},
//         {}
//       );

//       const options = {
//         key: "rzp_test_Rsy2Mkp6CDaqGs", // test key
//         amount: orderRes.data.amount,
//         currency: "INR",
//         name: "MyTube Premium",
//         description: "1 Month Premium Subscription",
//         order_id: orderRes.data.id,

//         handler: async function (response) {
//           // 2️⃣ Verify payment
//           const verifyRes = await api.post(
//             "/api/premium/verify",
//             response,
//             {}
//           );

//           // 3️⃣ Update user globally
//           updateUser({
//             ...user,
//             isPremium: true,
//             premiumUntil: verifyRes.data.premiumUntil,
//           });

//           alert("⭐ Premium Activated!");
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       alert("Payment failed");
//     }
//   };


//   // Update video
//   const handleUpdateVideo = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("title", editTitle);
//       formData.append("category", editCategory);
//       formData.append("description", editDescription);
//       if (editThumbnail) {
//         formData.append("thumbnail", editThumbnail);
//       }

//       await api.put(
//         `/api/videos/${editingVideo._id}`,
//         formData,
//         {}
//       );

//       alert("✅ Video updated successfully!");
//       setEditingVideo(null);
//       loadProfile();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to update video");
//     }
//   };

//   // Delete video
//   const handleDeleteVideo = async (videoId) => {

//     try {
//       await api.delete(`/api/videos/${videoId}`, {

//       });

//       alert("🗑️ Video deleted successfully!");
//       setShowDeleteConfirm(null);
//       loadProfile();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to delete video");
//     }
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
//             {/* <div style={styles.avatarWrapper}>
//               <img
//                 src={
//                   profileUser.avatar?.trim()
//                     ? profileUser.avatar
//                     : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                 }
//                 alt="avatar"
//                 style={styles.avatar}
//               />
//             </div> */}
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

//               {/* Profile photo change input - Only for own profile */}
//               {isOwnProfile && (
//                 <label style={styles.editAvatarLabel}>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarChange}
//                     style={{ display: "none" }}
//                   />
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
//                     <path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z" />
//                   </svg>
//                 </label>
//               )}
//             </div>

//             <div style={styles.channelInfo}>
//               {/* <h1 style={styles.channelName}>{profileUser.name}</h1> */}
//               <h1 style={styles.channelName}>
//                 {profileUser.name}
//                 {isOwnProfile && user?.isPremium && (
//                   <span style={{ marginLeft: 10, color: "#facc15", fontSize: 18 }}>
//                     ⭐ Premium
//                   </span>
//                 )}
//               </h1>

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

//               {/* 💰 MONETIZATION STATUS (ONLY OWN PROFILE) */}


//             </div>
//           </div>


//           {/* <div style={styles.actionButtons}>
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
//               <button 
//                 style={subscribed ? styles.subscribedButton : styles.subscribeButton}
//                 onClick={toggleSubscribe}
//               >
//                 {subscribed ? (
//                   <>
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
//                     </svg>
//                     Subscribed
//                   </>
//                 ) : (
//                   <>Subscribe</>
//                 )}
//               </button>
//             )}
//           </div> */}
//           <div style={styles.actionButtons}>
//             {isOwnProfile ? (
//               <>
//                 {/* ⬆️ Upload Button */}
//                 <button
//                   style={styles.uploadButton}
//                   onClick={() => navigate("/UserUpload")}
//                 >
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M14 13h-4v4H8v-4H4v-2h4V7h2v4h4v2zm-2-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm6 16H6V6h12v14z" />
//                   </svg>
//                   Upload Video
//                 </button>

//                 {/* ⭐ GO PREMIUM BUTTON (ONLY IF NOT PREMIUM) */}
//                 {!user?.isPremium && (
//                   <button
//                     style={{
//                       padding: "12px 24px",
//                       background: "linear-gradient(135deg,#facc15,#f97316)",
//                       border: "none",
//                       borderRadius: 24,
//                       fontWeight: 700,
//                       cursor: "pointer",
//                       color: "#000",
//                     }}
//                     onClick={buyPremium}
//                   >
//                     ⭐ Go Premium ₹99
//                   </button>
//                 )}

//                 {user && (
//                   <button
//                     style={{
//                       padding: "12px 24px",
//                       background: "linear-gradient(135deg,#22c55e,#16a34a)",
//                       border: "none",
//                       borderRadius: 24,
//                       fontWeight: 700,
//                       cursor: "pointer",
//                       color: "#000",
//                     }}
//                     onClick={() => navigate("/CreatorMonetization")}
//                   >
//                     💰 Creator Monetization
//                   </button>
//                 )}


//                 {/* ⚙️ Manage Channel */}
//                 <button style={styles.iconButton} title="Manage channel">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
//                   </svg>
//                 </button>
//               </>
//             ) : (
//               <button
//                 style={subscribed ? styles.subscribedButton : styles.subscribeButton}
//                 onClick={toggleSubscribe}
//               >
//                 {subscribed ? "Subscribed" : "Subscribe"}
//               </button>
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
//                   <path d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2zM4 7h16v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7zm8 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
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
//                 <div key={v._id} style={styles.videoCard}>
//                   <div
//                     style={styles.thumbnailWrapper}
//                     onClick={() => navigate(`/watch/${v.filename}`)}
//                   >
//                     {/* <img
//                       src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                       style={styles.thumbnail}
//                       alt={v.title}
//                     /> */}
//                     <img
//                       // ✅ Pura path manually jodein agar environment variables nahi hain
//                       src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                       alt={v.title}
//                       style={styles.thumbnail}
//                       onError={(e) => {
//                         console.log("Image failed to load:", e.target.src);
//                         e.target.src = "https://via.placeholder.com/320x180?text=No+Thumbnail";
//                       }}
//                     />
//                     <div style={styles.playOverlay}>
//                       <svg viewBox="0 0 72 72" width="48" height="48">
//                         <circle cx="36" cy="36" r="34" fill="rgba(0,0,0,0.6)" />
//                         <path fill="#fff" d="M28 24l24 12-24 12z" />
//                       </svg>
//                     </div>
//                     {v.category && <div style={styles.categoryBadge}>{v.category}</div>}
//                   </div>

//                   <div style={styles.videoInfo}>
//                     <h3
//                       style={styles.videoTitle}
//                       onClick={() => navigate(`/watch/${v.filename}`)}
//                     >
//                       {v.title}
//                     </h3>
//                     <div style={styles.videoMeta}>
//                       <span>{v.views?.toLocaleString() || 0} views</span>
//                       <span style={styles.dot}>•</span>
//                       <span>{new Date(v.createdAt).toLocaleDateString()}</span>
//                     </div>

//                     {/* CRUD Buttons - Only show for own videos */}
//                     {isOwnProfile && (
//                       <div style={styles.actionButtonsInline}>
//                         <button
//                           style={styles.editBtn}
//                           onClick={(e) => openEditModal(v, e)}
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           style={styles.deleteBtn}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setShowDeleteConfirm(v._id);
//                           }}
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     )}
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
//                     <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
//                   </svg>
//                   Clear All
//                 </button>
//               )}
//             </div>

//             {history.length === 0 ? (
//               <div style={styles.emptyState}>
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
//                   <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
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
//                     onMouseEnter={(e) => {
//                       const btn = e.currentTarget.querySelector('[data-remove-btn]');
//                       if (btn) btn.style.opacity = '1';
//                     }}
//                     onMouseLeave={(e) => {
//                       const btn = e.currentTarget.querySelector('[data-remove-btn]');
//                       if (btn) btn.style.opacity = '0';
//                     }}
//                   >
//                     <div style={styles.historyThumbnail}>
//                       <img
//                         src={`${process.env.REACT_APP_API_URL}/uploads/${item.video.thumbnail}`}
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
//                       data-remove-btn
//                       style={styles.removeBtn}
//                       onClick={(e) => removeFromHistory(item.video._id, e)}
//                       title="Remove from history"
//                     >
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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

//       {/* EDIT MODAL */}
//       {editingVideo && (
//         <div style={styles.modalOverlay} onClick={() => setEditingVideo(null)}>
//           <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <h2 style={styles.modalTitle}>✏️ Edit Video</h2>

//             <form onSubmit={handleUpdateVideo}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Title</label>
//                 <input
//                   type="text"
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Category</label>
//                 <select
//                   value={editCategory}
//                   onChange={(e) => setEditCategory(e.target.value)}
//                   style={styles.select}
//                   required
//                 >
//                   <option value="">Choose category</option>
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Description</label>
//                 <textarea
//                   value={editDescription}
//                   onChange={(e) => setEditDescription(e.target.value)}
//                   style={styles.textarea}
//                   rows="4"
//                   placeholder="Add a description..."
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Update Thumbnail (optional)</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setEditThumbnail(e.target.files[0])}
//                   style={styles.fileInput}
//                 />
//               </div>

//               <div style={styles.modalActions}>
//                 <button type="button" style={styles.cancelBtn} onClick={() => setEditingVideo(null)}>
//                   Cancel
//                 </button>
//                 <button type="submit" style={styles.saveBtn}>
//                   💾 Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {showDeleteConfirm && (
//         <div style={styles.modalOverlay} onClick={() => setShowDeleteConfirm(null)}>
//           <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
//             <h2 style={styles.confirmTitle}>🗑️ Delete Video?</h2>
//             <p style={styles.confirmText}>
//               Are you sure you want to delete this video? This action cannot be undone.
//             </p>
//             <div style={styles.modalActions}>
//               <button
//                 style={styles.cancelBtn}
//                 onClick={() => setShowDeleteConfirm(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 style={styles.confirmDeleteBtn}
//                 onClick={() => handleDeleteVideo(showDeleteConfirm)}
//               >
//                 🗑️ Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Responsive CSS */}
//       <style jsx>{`
//         @media (max-width: 1024px) {
//           /* Tablet - reduce padding and grid columns */
//         }

//         @media (max-width: 768px) {
//           /* Mobile styles */
//           div[style*="padding: 24px 40px"] {
//             padding: 16px 20px !important;
//           }

//           div[style*="padding: 40px"] {
//             padding: 24px 20px !important;
//           }

//           div[style*="padding: 0 40px"] {
//             padding: 0 20px !important;
//           }

//           div[style*="display: flex"][style*="justifyContent: space-between"][style*="alignItems: flex-start"] {
//             flex-direction: column !important;
//             align-items: stretch !important;
//            gap: 16px !important;
//           }

//           div[style*="avatarSection"] {
//            flex-direction: column !important;
//             align-items: center !important;
//             text-align: center !important;
//           }

//           img[alt="avatar"] {
//             width: 120px !important;
//             height: 120px !important;
//           }

//           h1[style*="fontSize: 36px"] {
//             font-size: 24px !important;
//           }

//           div[style*="gridTemplateColumns: repeat(auto-fill, minmax(320px, 1fr))"] {
//             grid-template-columns: 1fr !important;
//             gap: 16px !important;
//           }

//           div[style*="gap: 16"][style*="padding: 12"][style*="cursor: pointer"][style*="position: relative"] {
//             flex-direction: column !important;
//           }

//           div[style*="width: 240"][style*="height: 135"] {
//             width: 100% !important;
//             height: auto !important;
//             padding-bottom: 56.25% !important;
//             position: relative !important;
//           }
//         }

//         @media (max-width: 480px) {
//           /* Small mobile */
//           div[style*="height: 200px"][style*="background: linear-gradient"] {
//             height: 120px !important;
//           }

//           img[alt="avatar"] {
//             width: 80px !important;
//             height: 80px !important;
//           }

//           h1[style*="fontSize: 36px"],
//           h1[style*="fontSize: 24px"] {
//             font-size: 20px !important;
//           }

//           div[style*="fontSize: 14px"][style*="color: #aaa"] {
//             font-size: 12px !important;
//           }
//         }
//       `}</style>
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

//   monetizationCard: {
//     marginTop: 16,
//     padding: 16,
//     background: "#141414",
//     border: "1px solid #333",
//     borderRadius: 12,
//   },

//   applyMonetizationBtn: {
//     marginTop: 10,
//     padding: "10px 20px",
//     background: "#ff0000",
//     border: "none",
//     borderRadius: 20,
//     color: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
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

//   editAvatarLabel: {
//     position: "absolute",
//     bottom: "10px",
//     right: "10px",
//     background: "rgba(0,0,0,0.6)",
//     width: "36px",
//     height: "36px",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     border: "2px solid #fff",
//     transition: "background 0.3s",
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
//   categoryBadge: {
//     position: "absolute",
//     top: "12px",
//     right: "12px",
//     background: "rgba(255, 0, 51, 0.95)",
//     color: "#fff",
//     padding: "4px 10px",
//     borderRadius: "12px",
//     fontSize: "11px",
//     fontWeight: "600"
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
//     overflow: "hidden",
//     cursor: "pointer"
//   },
//   videoMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#aaa",
//     fontSize: "13px"
//   },
//   actionButtonsInline: {
//     display: "flex",
//     gap: 10,
//     marginTop: 12
//   },
//   editBtn: {
//     flex: 1,
//     padding: "8px 16px",
//     background: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "13px",
//     transition: "all 0.3s"
//   },
//   deleteBtn: {
//     flex: 1,
//     padding: "8px 16px",
//     background: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "13px",
//     transition: "all 0.3s"
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
//   },
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0, 0, 0, 0.85)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000
//   },
//   modal: {
//     background: "#1a1a1a",
//     borderRadius: "16px",
//     padding: "30px",
//     maxWidth: "500px",
//     width: "90%",
//     maxHeight: "90vh",
//     overflowY: "auto",
//     border: "1px solid #333"
//   },
//   confirmModal: {
//     background: "#1a1a1a",
//     borderRadius: "16px",
//     padding: "30px",
//     maxWidth: "400px",
//     width: "90%",
//     border: "1px solid #333"
//   },
//   modalTitle: {
//     fontSize: "24px",
//     fontWeight: "700",
//     color: "#fff",
//     marginBottom: "24px"
//   },
//   confirmTitle: {
//     fontSize: "22px",
//     fontWeight: "700",
//     color: "#fff",
//     marginBottom: "16px"
//   },
//   confirmText: {
//     color: "#aaa",
//     fontSize: "15px",
//     marginBottom: "24px",
//     lineHeight: "1.5"
//   },
//   formGroup: {
//     marginBottom: "20px"
//   },
//   label: {
//     display: "block",
//     marginBottom: "8px",
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: "14px"
//   },
//   input: {
//     width: "100%",
//     padding: "12px",
//     background: "#2a2a2a",
//     border: "1px solid #444",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "15px",
//     outline: "none",
//     boxSizing: "border-box"
//   },
//   select: {
//     width: "100%",
//     padding: "12px",
//     background: "#2a2a2a",
//     border: "1px solid #444",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "15px",
//     outline: "none",
//     boxSizing: "border-box"
//   },
//   textarea: {
//     width: "100%",
//     padding: "12px",
//     background: "#2a2a2a",
//     border: "1px solid #444",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "15px",
//     outline: "none",
//     resize: "vertical",
//     fontFamily: "inherit",
//     boxSizing: "border-box"
//   },
//   fileInput: {
//     width: "100%",
//     padding: "10px",
//     background: "#2a2a2a",
//     border: "1px solid #444",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "14px",
//     boxSizing: "border-box"
//   },
//   modalActions: {
//     display: "flex",
//     gap: "12px",
//     justifyContent: "flex-end",
//     marginTop: "24px"
//   },
//   cancelBtn: {
//     padding: "10px 24px",
//     background: "#333",
//     color: "#fff",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "14px"
//   },
//   saveBtn: {
//     padding: "10px 24px",
//     background: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "14px"
//   },
//   confirmDeleteBtn: {
//     padding: "10px 24px",
//     background: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "14px"
//   }
// };

// // Responsive CSS - this will be added to the JSX
// // No extra export needed - already exported at function declaration



import React, { useEffect, useState, useContext } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
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
      const route = id
        ? `/api/user/profile/${id}`
        : `/api/user/profile`;

      const res = await api.get(route, {});

      setProfileUser(res.data);
      setVideos(res.data.videos);
      setSubscribed(res.data.subscribers?.includes(user?._id) || false);
      setSubscribersCount(res.data.subscribers?.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.put("/api/user/update-avatar", formData);
      setProfileUser({ ...profileUser, avatar: res.data.avatar });
      updateUser({ ...user, avatar: res.data.avatar });
      alert("✅ Profile photo updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload photo");
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get("/api/user/watch-history", {});
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const removeFromHistory = async (videoId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/user/watch-history/${videoId}`, {});
      setHistory(history.filter(item => item.video._id !== videoId));
    } catch (err) {
      console.error("Failed to remove from history:", err);
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm("Clear all watch history?")) return;

    try {
      await api.delete("/api/user/watch-history", {});
      setHistory([]);
      alert("History cleared!");
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const toggleSubscribe = async () => {
    if (!user) return alert("Login first");

    const res = await api.post(
      `/api/user/subscribe/${profileUser._id}`,
      {},
      {}
    );

    setSubscribed(res.data.subscribed);
    setSubscribersCount(prev => res.data.subscribed ? prev + 1 : prev - 1);
  };

  const applyForMonetization = async () => {
    try {
      const res = await api.post(
        "/api/monetization/apply",
        {},
        {}
      );

      alert(res.data.message);
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply for monetization");
    }
  };

  const openEditModal = (video, e) => {
    e.stopPropagation();
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditCategory(video.category || "");
    setEditDescription(video.description || "");
    setEditThumbnail(null);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const buyPremium = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const orderRes = await api.post(
        "/api/premium/create-order",
        {},
        {}
      );

      const options = {
        key: "rzp_test_Rsy2Mkp6CDaqGs",
        amount: orderRes.data.amount,
        currency: "INR",
        name: "MyTube Premium",
        description: "1 Month Premium Subscription",
        order_id: orderRes.data.id,

        handler: async function (response) {
          const verifyRes = await api.post(
            "/api/premium/verify",
            response,
            {}
          );

          updateUser({
            ...user,
            isPremium: true,
            premiumUntil: verifyRes.data.premiumUntil,
          });

          alert("⭐ Premium Activated!");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("category", editCategory);
      formData.append("description", editDescription);
      if (editThumbnail) {
        formData.append("thumbnail", editThumbnail);
      }

      await api.put(
        `/api/videos/${editingVideo._id}`,
        formData,
        {}
      );

      alert("✅ Video updated successfully!");
      setEditingVideo(null);
      loadProfile();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update video");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await api.delete(`/api/videos/${videoId}`, {});

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
      {/* Channel Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerGradient}></div>
      </div>

      {/* Channel Header */}
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

              {isOwnProfile && (
                <label style={styles.editAvatarLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                    <path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z" />
                  </svg>
                </label>
              )}
            </div>

            <div style={styles.channelInfo}>
              <h1 style={styles.channelName}>
                {profileUser.name}
                {isOwnProfile && user?.isPremium && (
                  <span style={styles.premiumBadge}>⭐ Premium</span>
                )}
              </h1>

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
                    <path d="M14 13h-4v4H8v-4H4v-2h4V7h2v4h4v2zm-2-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm6 16H6V6h12v14z" />
                  </svg>
                  <span className="btn-text">Upload Video</span>
                </button>

                {!user?.isPremium && (
                  <button
                    style={styles.premiumButton}
                    onClick={buyPremium}
                  >
                    <span>⭐</span>
                    <span className="btn-text">Go Premium ₹99</span>
                  </button>
                )}

                {user && (
                  <button
                    style={styles.monetizationButton}
                    onClick={() => navigate("/CreatorMonetization")}
                  >
                    <span>💰</span>
                    <span className="btn-text">Creator Monetization</span>
                  </button>
                )}

                <button style={styles.iconButton} title="Manage channel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                style={subscribed ? styles.subscribedButton : styles.subscribeButton}
                onClick={toggleSubscribe}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
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

      {/* Content Section */}
      <div style={styles.contentSection}>
        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div style={styles.videosGrid}>
            {videos.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
                  <path d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2zM4 7h16v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7zm8 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
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
                      src={v.thumbnailUrl || `${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                      alt={v.title}
                      style={styles.thumbnail}
                      onError={(e) => {
                        console.log("Image failed to load:", e.target.src);
                        e.target.src = "https://via.placeholder.com/320x180?text=No+Thumbnail";
                      }}
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
              <h3 style={styles.historyTitle}>
                Watch History ({history.length})
              </h3>
              {history.length > 0 && (
                <button style={styles.clearHistoryBtn} onClick={clearAllHistory}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                  <span className="btn-text">Clear All</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
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
                        src={item.video.thumbnailUrl || `${process.env.REACT_APP_API_URL}/uploads/${item.video.thumbnail}`}
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
                      <h4 style={styles.historyItemTitle}>{item.video.title}</h4>
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
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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

      {/* Responsive Styles */}
      <style>{`
        /* Tablet and below */
        @media (max-width: 1024px) {
          .btn-text {
            display: inline;
          }
        }

        /* Mobile landscape and below */
        @media (max-width: 768px) {
          .btn-text {
            display: none;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .btn-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/* Styles */
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
    gap: 24,
    flexWrap: "wrap"
  },
  avatarSection: {
    display: "flex",
    gap: 24,
    alignItems: "center",
    flex: "1 1 auto",
    minWidth: 0
  },
  avatarWrapper: {
    position: "relative",
    marginTop: "-60px",
    flexShrink: 0
  },
  avatar: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #0f0f0f",
    background: "#1f1f1f"
  },
  editAvatarLabel: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.6)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "2px solid #fff",
    transition: "background 0.3s",
  },
  channelInfo: {
    flex: "1 1 auto",
    minWidth: 0
  },
  channelName: {
    fontSize: "36px",
    fontWeight: 700,
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10
  },
  premiumBadge: {
    color: "#facc15",
    fontSize: 18
  },
  channelStats: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#aaa",
    fontSize: "14px",
    marginBottom: 12,
    flexWrap: "wrap"
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
    alignItems: "center",
    flexWrap: "wrap"
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
    transition: "background 0.2s",
    whiteSpace: "nowrap"
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
    transition: "background 0.2s",
    whiteSpace: "nowrap"
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
    transition: "background 0.2s",
    whiteSpace: "nowrap"
  },
  premiumButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg,#facc15,#f97316)",
    border: "none",
    borderRadius: 24,
    fontWeight: 700,
    cursor: "pointer",
    color: "#000",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap"
  },
  monetizationButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    border: "none",
    borderRadius: 24,
    fontWeight: 700,
    cursor: "pointer",
    color: "#000",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap"
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
    transition: "background 0.2s",
    flexShrink: 0
  },
  tabsContainer: {
    borderBottom: "1px solid #333",
    padding: "0 40px",
    overflowX: "auto"
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
    transition: "color 0.2s",
    whiteSpace: "nowrap"
  },
  tabActive: {
    padding: "16px 0",
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "2px solid #fff",
    whiteSpace: "nowrap"
  },
  contentSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "40px"
  },
  videosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
    fontSize: "13px",
    flexWrap: "wrap"
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
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16
  },
  historyTitle: {
    fontSize: "20px",
    fontWeight: 600,
    margin: 0
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
    position: "relative",
    flexWrap: "wrap"
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
    gap: 8,
    minWidth: 0
  },
  historyItemTitle: {
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
    fontSize: "13px",
    flexWrap: "wrap"
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
    fontSize: "14px",
    gap: 16,
    flexWrap: "wrap"
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
    zIndex: 1000,
    padding: 20
  },
  modal: {
    background: "#1a1a1a",
    borderRadius: "16px",
    padding: "30px",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid #333"
  },
  confirmModal: {
    background: "#1a1a1a",
    borderRadius: "16px",
    padding: "30px",
    maxWidth: "400px",
    width: "100%",
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
    marginTop: "24px",
    flexWrap: "wrap"
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