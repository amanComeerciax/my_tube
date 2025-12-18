// import axios from "axios";
// import { useState } from "react";

// export default function AdminUploadAd() {
//   const [file, setFile] = useState(null);
//   const [target, setTarget] = useState("all");
//   const [targetValue, setTargetValue] = useState("");

//   const uploadAd = async () => {
//     const form = new FormData();
//     form.append("adVideo", file);
//     form.append("title", "Test Ad");
//     form.append("target", target);
//     form.append("targetValue", targetValue);
//     form.append("skipAfter", 5);

//     await axios.post("http://localhost:5000/api/ads/upload", form, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     });

//     alert("Ad Uploaded");
//   };

//   return (
//     <div>
//       <input type="file" onChange={e => setFile(e.target.files[0])} />
//       <select onChange={e => setTarget(e.target.value)}>
//         <option value="all">All</option>
//         <option value="category">Category</option>
//         <option value="video">Video</option>
//       </select>
//       <input placeholder="Category or VideoId" onChange={e => setTargetValue(e.target.value)} />
//       <button onClick={uploadAd}>Upload Ad</button>
//     </div>
//   );
// }

// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function AdUpload() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [target, setTarget] = useState("all");
//   const [targetValue, setTargetValue] = useState("");
//   const [skipAfter, setSkipAfter] = useState(5);
//   const [adVideo, setAdVideo] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!adVideo) {
//       setMessage("❌ Please select a video file");
//       return;
//     }

//     setUploading(true);
//     setMessage("");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("target", target);
//     formData.append("targetValue", targetValue);
//     formData.append("skipAfter", skipAfter);
//     formData.append("adVideo", adVideo);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post("http://localhost:5000/api/ads/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       setMessage("✅ Ad uploaded successfully!");
//       console.log("Ad uploaded:", res.data);

//       // Reset form
//       setTitle("");
//       setTarget("all");
//       setTargetValue("");
//       setSkipAfter(5);
//       setAdVideo(null);
      
//       // Reset file input
//       document.getElementById("adVideoInput").value = "";
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Upload failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div style={styles.container}>
//         <h2>Please login to upload ads</h2>
//         <button onClick={() => navigate("/login")} style={styles.button}>
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>📢 Upload Advertisement</h1>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
//           {/* Title */}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Ad Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g., Summer Sale 2024"
//               required
//               style={styles.input}
//             />
//           </div>

//           {/* Target Type */}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Target</label>
//             <select
//               value={target}
//               onChange={(e) => setTarget(e.target.value)}
//               style={styles.select}
//             >
//               <option value="all">All Videos</option>
//               <option value="category">Specific Category</option>
//               <option value="video">Specific Video</option>
//             </select>
//           </div>

//           {/* Target Value */}
//           {target !== "all" && (
//             <div style={styles.inputGroup}>
//               <label style={styles.label}>
//                 {target === "category" ? "Category Name" : "Video ID"}
//               </label>
//               <input
//                 type="text"
//                 value={targetValue}
//                 onChange={(e) => setTargetValue(e.target.value)}
//                 placeholder={target === "category" ? "e.g., Gaming, Music, Education" : "Video MongoDB ID"}
//                 required
//                 style={styles.input}
//               />
//               {target === "category" && (
//                 <small style={styles.hint}>
//                   Common categories: Gaming, Music, Education, Entertainment, Technology
//                 </small>
//               )}
//             </div>
//           )}

//           {/* Skip After */}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Skip After (seconds)</label>
//             <input
//               type="number"
//               value={skipAfter}
//               onChange={(e) => setSkipAfter(e.target.value)}
//               min="0"
//               max="30"
//               style={styles.input}
//             />
//             <small style={styles.hint}>Users can skip after this many seconds</small>
//           </div>

//           {/* Video File */}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Ad Video File</label>
//             <input
//               id="adVideoInput"
//               type="file"
//               accept="video/*"
//               onChange={(e) => setAdVideo(e.target.files[0])}
//               required
//               style={styles.fileInput}
//             />
//             {adVideo && (
//               <div style={styles.fileInfo}>
//                 📹 {adVideo.name} ({(adVideo.size / 1024 / 1024).toFixed(2)} MB)
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={uploading}
//             style={{
//               ...styles.submitButton,
//               opacity: uploading ? 0.6 : 1,
//               cursor: uploading ? "not-allowed" : "pointer"
//             }}
//           >
//             {uploading ? "Uploading..." : "Upload Ad"}
//           </button>

//           {/* Message */}
//           {message && (
//             <div style={{
//               ...styles.message,
//               color: message.includes("✅") ? "#4ade80" : "#f87171"
//             }}>
//               {message}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     background: "#0f0f0f",
//     color: "#f1f1f1",
//     padding: "80px 20px 40px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   card: {
//     background: "#1a1a1a",
//     borderRadius: "16px",
//     padding: "40px",
//     maxWidth: "600px",
//     width: "100%",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
//   },
//   title: {
//     fontSize: "28px",
//     fontWeight: "700",
//     marginBottom: "32px",
//     textAlign: "center",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent"
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "24px"
//   },
//   inputGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px"
//   },
//   label: {
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#f1f1f1"
//   },
//   input: {
//     padding: "12px 16px",
//     background: "#272727",
//     border: "1px solid #3a3a3a",
//     borderRadius: "8px",
//     color: "#f1f1f1",
//     fontSize: "14px",
//     outline: "none",
//     transition: "border-color 0.2s"
//   },
//   select: {
//     padding: "12px 16px",
//     background: "#272727",
//     border: "1px solid #3a3a3a",
//     borderRadius: "8px",
//     color: "#f1f1f1",
//     fontSize: "14px",
//     outline: "none",
//     cursor: "pointer"
//   },
//   fileInput: {
//     padding: "12px",
//     background: "#272727",
//     border: "1px solid #3a3a3a",
//     borderRadius: "8px",
//     color: "#f1f1f1",
//     fontSize: "14px",
//     cursor: "pointer"
//   },
//   fileInfo: {
//     padding: "8px 12px",
//     background: "#1e293b",
//     borderRadius: "6px",
//     fontSize: "13px",
//     color: "#94a3b8"
//   },
//   hint: {
//     fontSize: "12px",
//     color: "#888"
//   },
//   submitButton: {
//     padding: "14px 24px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     border: "none",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "16px",
//     transition: "transform 0.2s"
//   },
//   message: {
//     padding: "12px",
//     borderRadius: "8px",
//     textAlign: "center",
//     fontSize: "14px",
//     fontWeight: "500"
//   },
//   button: {
//     padding: "12px 24px",
//     background: "#667eea",
//     border: "none",
//     borderRadius: "8px",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "600"
//   }
// };


// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { 
//   FiUpload, FiList, FiEdit2, FiTrash2, FiEye, FiEyeOff, 
//   FiBarChart2, FiX, FiCheck, FiPlus 
// } from "react-icons/fi";

// export default function AdManagement() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("list"); // list, upload, analytics
  
//   // Upload form state
//   const [title, setTitle] = useState("");
//   const [target, setTarget] = useState("all");
//   const [targetValue, setTargetValue] = useState("");
//   const [skipAfter, setSkipAfter] = useState(5);
//   const [adVideo, setAdVideo] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   // List state
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingAd, setEditingAd] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

//   // Analytics state
//   const [selectedAdAnalytics, setSelectedAdAnalytics] = useState(null);

//   useEffect(() => {
//     if (activeTab === "list") {
//       fetchAds();
//     }
//   }, [activeTab]);

//   /* ================= FETCH ALL ADS ================= */
//   const fetchAds = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/ads", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAds(res.data);
//     } catch (err) {
//       console.error("Failed to fetch ads:", err);
//       setMessage("❌ Failed to fetch ads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= CREATE AD ================= */
//   const handleUpload = async (e) => {
//     e.preventDefault();
    
//     if (!adVideo) {
//       setMessage("❌ Please select a video file");
//       return;
//     }

//     setUploading(true);
//     setMessage("");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("target", target);
//     formData.append("targetValue", targetValue);
//     formData.append("skipAfter", skipAfter);
//     formData.append("adVideo", adVideo);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post("http://localhost:5000/api/ads/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       setMessage("✅ Ad uploaded successfully!");
      
//       // Reset form
//       setTitle("");
//       setTarget("all");
//       setTargetValue("");
//       setSkipAfter(5);
//       setAdVideo(null);
//       document.getElementById("adVideoInput").value = "";
      
//       // Switch to list view
//       setTimeout(() => {
//         setActiveTab("list");
//         setMessage("");
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Upload failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* ================= UPDATE AD ================= */
//   const handleUpdate = async (adId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`http://localhost:5000/api/ads/${adId}`, editingAd, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setMessage("✅ Ad updated successfully!");
//       setEditingAd(null);
//       fetchAds();
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Update failed");
//     }
//   };

//   /* ================= DELETE AD ================= */
//   const handleDelete = async (adId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/ads/${adId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setMessage("✅ Ad deleted successfully!");
//       setShowDeleteConfirm(null);
//       fetchAds();
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Delete failed");
//     }
//   };

//   /* ================= TOGGLE AD STATUS ================= */
//   const toggleAdStatus = async (ad) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:5000/api/ads/${ad._id}`, 
//         { ...ad, active: !ad.active },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchAds();
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Failed to toggle status");
//     }
//   };

//   /* ================= FETCH ANALYTICS ================= */
//   const fetchAnalytics = async (adId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5000/api/ads/analytics/${adId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSelectedAdAnalytics(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= HELPERS ================= */
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric"
//     });
//   };

//   if (!user) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.card}>
//           <h2>Please login to manage ads</h2>
//           <button onClick={() => navigate("/login")} style={styles.button}>
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.fullCard}>
//         {/* Header */}
//         <div style={styles.header}>
//           <h1 style={styles.mainTitle}>📢 Ad Management System</h1>
//           <div style={styles.tabContainer}>
//             <button
//               onClick={() => setActiveTab("list")}
//               style={{
//                 ...styles.tab,
//                 ...(activeTab === "list" ? styles.activeTab : {})
//               }}
//             >
//               <FiList size={18} />
//               <span>All Ads</span>
//             </button>
//             <button
//               onClick={() => setActiveTab("upload")}
//               style={{
//                 ...styles.tab,
//                 ...(activeTab === "upload" ? styles.activeTab : {})
//               }}
//             >
//               <FiUpload size={18} />
//               <span>Upload New</span>
//             </button>
//             <button
//               onClick={() => setActiveTab("analytics")}
//               style={{
//                 ...styles.tab,
//                 ...(activeTab === "analytics" ? styles.activeTab : {})
//               }}
//             >
//               <FiBarChart2 size={18} />
//               <span>Analytics</span>
//             </button>
//           </div>
//         </div>

//         {/* Message Display */}
//         {message && (
//           <div style={{
//             ...styles.message,
//             background: message.includes("✅") ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)",
//             border: message.includes("✅") ? "1px solid #4ade80" : "1px solid #f87171",
//             color: message.includes("✅") ? "#4ade80" : "#f87171"
//           }}>
//             {message}
//           </div>
//         )}

//         {/* Content Area */}
//         <div style={styles.content}>
//           {/* ==================== LIST VIEW ==================== */}
//           {activeTab === "list" && (
//             <div style={styles.listContainer}>
//               {loading ? (
//                 <div style={styles.loadingContainer}>
//                   <div className="spinner"></div>
//                 </div>
//               ) : ads.length === 0 ? (
//                 <div style={styles.emptyState}>
//                   <FiUpload size={48} color="#555" />
//                   <h3 style={{ color: "#888", marginTop: 16 }}>No ads yet</h3>
//                   <p style={{ color: "#666", fontSize: 14 }}>Upload your first ad to get started</p>
//                   <button 
//                     onClick={() => setActiveTab("upload")} 
//                     style={styles.primaryButton}
//                   >
//                     <FiPlus size={18} />
//                     <span>Upload Ad</span>
//                   </button>
//                 </div>
//               ) : (
//                 <div style={styles.adGrid}>
//                   {ads.map((ad) => (
//                     <div key={ad._id} style={styles.adCard}>
//                       {/* Ad Video Preview */}
//                       <div style={styles.adVideoContainer}>
//                         <video
//                           src={`http://localhost:5000/uploads/ads/${ad.videoFile}`}
//                           style={styles.adVideoPreview}
//                           controls={false}
//                           muted
//                         />
//                         <div style={styles.adOverlay}>
//                           <span style={{
//                             ...styles.adBadge,
//                             background: ad.active ? "#22c55e" : "#ef4444"
//                           }}>
//                             {ad.active ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Ad Info */}
//                       <div style={styles.adInfo}>
//                         {editingAd?._id === ad._id ? (
//                           // Edit Mode
//                           <div style={styles.editForm}>
//                             <input
//                               type="text"
//                               value={editingAd.title}
//                               onChange={(e) => setEditingAd({...editingAd, title: e.target.value})}
//                               style={styles.editInput}
//                               placeholder="Ad Title"
//                             />
//                             <select
//                               value={editingAd.target}
//                               onChange={(e) => setEditingAd({...editingAd, target: e.target.value})}
//                               style={styles.editSelect}
//                             >
//                               <option value="all">All Videos</option>
//                               <option value="category">Category</option>
//                               <option value="video">Specific Video</option>
//                             </select>
//                             {editingAd.target !== "all" && (
//                               <input
//                                 type="text"
//                                 value={editingAd.targetValue}
//                                 onChange={(e) => setEditingAd({...editingAd, targetValue: e.target.value})}
//                                 style={styles.editInput}
//                                 placeholder={editingAd.target === "category" ? "Category Name" : "Video ID"}
//                               />
//                             )}
//                             <input
//                               type="number"
//                               value={editingAd.skipAfter}
//                               onChange={(e) => setEditingAd({...editingAd, skipAfter: e.target.value})}
//                               style={styles.editInput}
//                               placeholder="Skip After (seconds)"
//                             />
//                             <div style={styles.editActions}>
//                               <button
//                                 onClick={() => handleUpdate(ad._id)}
//                                 style={{...styles.iconButton, background: "#22c55e"}}
//                               >
//                                 <FiCheck size={16} />
//                               </button>
//                               <button
//                                 onClick={() => setEditingAd(null)}
//                                 style={{...styles.iconButton, background: "#ef4444"}}
//                               >
//                                 <FiX size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           // View Mode
//                           <>
//                             <h3 style={styles.adTitle}>{ad.title}</h3>
//                             <div style={styles.adDetails}>
//                               <div style={styles.adDetailItem}>
//                                 <span style={styles.detailLabel}>Target:</span>
//                                 <span style={styles.detailValue}>
//                                   {ad.target === "all" ? "All Videos" : ad.targetValue}
//                                 </span>
//                               </div>
//                               <div style={styles.adDetailItem}>
//                                 <span style={styles.detailLabel}>Skip After:</span>
//                                 <span style={styles.detailValue}>{ad.skipAfter}s</span>
//                               </div>
//                               <div style={styles.adDetailItem}>
//                                 <span style={styles.detailLabel}>Views:</span>
//                                 <span style={styles.detailValue}>{ad.views || 0}</span>
//                               </div>
//                               <div style={styles.adDetailItem}>
//                                 <span style={styles.detailLabel}>Clicks:</span>
//                                 <span style={styles.detailValue}>{ad.clicks || 0}</span>
//                               </div>
//                               <div style={styles.adDetailItem}>
//                                 <span style={styles.detailLabel}>Created:</span>
//                                 <span style={styles.detailValue}>{formatDate(ad.createdAt)}</span>
//                               </div>
//                             </div>

//                             {/* Actions */}
//                             <div style={styles.adActions}>
//                               <button
//                                 onClick={() => toggleAdStatus(ad)}
//                                 style={styles.actionButton}
//                                 title={ad.active ? "Deactivate" : "Activate"}
//                               >
//                                 {ad.active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//                                 <span>{ad.active ? "Deactivate" : "Activate"}</span>
//                               </button>
//                               <button
//                                 onClick={() => setEditingAd(ad)}
//                                 style={styles.actionButton}
//                                 title="Edit"
//                               >
//                                 <FiEdit2 size={16} />
//                                 <span>Edit</span>
//                               </button>
//                               <button
//                                 onClick={() => setShowDeleteConfirm(ad._id)}
//                                 style={{...styles.actionButton, color: "#ef4444"}}
//                                 title="Delete"
//                               >
//                                 <FiTrash2 size={16} />
//                                 <span>Delete</span>
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setActiveTab("analytics");
//                                   fetchAnalytics(ad._id);
//                                 }}
//                                 style={styles.actionButton}
//                                 title="View Analytics"
//                               >
//                                 <FiBarChart2 size={16} />
//                                 <span>Stats</span>
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </div>

//                       {/* Delete Confirmation */}
//                       {showDeleteConfirm === ad._id && (
//                         <div style={styles.deleteConfirm}>
//                           <p style={styles.deleteText}>Delete this ad?</p>
//                           <div style={styles.deleteActions}>
//                             <button
//                               onClick={() => handleDelete(ad._id)}
//                               style={{...styles.deleteButton, background: "#ef4444"}}
//                             >
//                               Yes, Delete
//                             </button>
//                             <button
//                               onClick={() => setShowDeleteConfirm(null)}
//                               style={{...styles.deleteButton, background: "#555"}}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================== UPLOAD VIEW ==================== */}
//           {activeTab === "upload" && (
//             <div style={styles.uploadContainer}>
//               <h2 style={styles.sectionTitle}>Upload New Advertisement</h2>
//               <form onSubmit={handleUpload} style={styles.form}>
//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>Ad Title *</label>
//                   <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="e.g., Summer Sale 2024"
//                     required
//                     style={styles.input}
//                   />
//                 </div>

//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>Target Audience *</label>
//                   <select
//                     value={target}
//                     onChange={(e) => setTarget(e.target.value)}
//                     style={styles.select}
//                   >
//                     <option value="all">All Videos</option>
//                     <option value="category">Specific Category</option>
//                     <option value="video">Specific Video</option>
//                   </select>
//                 </div>

//                 {target !== "all" && (
//                   <div style={styles.inputGroup}>
//                     <label style={styles.label}>
//                       {target === "category" ? "Category Name *" : "Video ID *"}
//                     </label>
//                     <input
//                       type="text"
//                       value={targetValue}
//                       onChange={(e) => setTargetValue(e.target.value)}
//                       placeholder={target === "category" ? "e.g., Gaming, Music, Education" : "Video MongoDB ID"}
//                       required
//                       style={styles.input}
//                     />
//                     {target === "category" && (
//                       <small style={styles.hint}>
//                         Common categories: Gaming, Music, Education, Entertainment, Technology
//                       </small>
//                     )}
//                   </div>
//                 )}

//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>Skip After (seconds) *</label>
//                   <input
//                     type="number"
//                     value={skipAfter}
//                     onChange={(e) => setSkipAfter(e.target.value)}
//                     min="0"
//                     max="30"
//                     style={styles.input}
//                   />
//                   <small style={styles.hint}>Users can skip after this many seconds (0-30)</small>
//                 </div>

//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>Ad Video File *</label>
//                   <input
//                     id="adVideoInput"
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => setAdVideo(e.target.files[0])}
//                     required
//                     style={styles.fileInput}
//                   />
//                   {adVideo && (
//                     <div style={styles.fileInfo}>
//                       📹 {adVideo.name} ({(adVideo.size / 1024 / 1024).toFixed(2)} MB)
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   style={{
//                     ...styles.submitButton,
//                     opacity: uploading ? 0.6 : 1,
//                     cursor: uploading ? "not-allowed" : "pointer"
//                   }}
//                 >
//                   {uploading ? "Uploading..." : "Upload Ad"}
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* ==================== ANALYTICS VIEW ==================== */}
//           {activeTab === "analytics" && (
//             <div style={styles.analyticsContainer}>
//               <h2 style={styles.sectionTitle}>Ad Analytics Overview</h2>
              
//               {/* Overall Stats */}
//               <div style={styles.statsGrid}>
//                 <div style={styles.statCard}>
//                   <div style={styles.statIcon}>📊</div>
//                   <div style={styles.statContent}>
//                     <div style={styles.statLabel}>Total Ads</div>
//                     <div style={styles.statValue}>{ads.length}</div>
//                   </div>
//                 </div>
//                 <div style={styles.statCard}>
//                   <div style={styles.statIcon}>👁️</div>
//                   <div style={styles.statContent}>
//                     <div style={styles.statLabel}>Total Views</div>
//                     <div style={styles.statValue}>
//                       {ads.reduce((sum, ad) => sum + (ad.views || 0), 0)}
//                     </div>
//                   </div>
//                 </div>
//                 <div style={styles.statCard}>
//                   <div style={styles.statIcon}>👆</div>
//                   <div style={styles.statContent}>
//                     <div style={styles.statLabel}>Total Clicks</div>
//                     <div style={styles.statValue}>
//                       {ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0)}
//                     </div>
//                   </div>
//                 </div>
//                 <div style={styles.statCard}>
//                   <div style={styles.statIcon}>✅</div>
//                   <div style={styles.statContent}>
//                     <div style={styles.statLabel}>Active Ads</div>
//                     <div style={styles.statValue}>
//                       {ads.filter(ad => ad.active).length}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Individual Ad Analytics */}
//               {selectedAdAnalytics && (
//                 <div style={styles.detailedAnalytics}>
//                   <h3 style={styles.analyticsTitle}>{selectedAdAnalytics.title}</h3>
//                   <div style={styles.analyticsDetails}>
//                     <div style={styles.analyticItem}>
//                       <span style={styles.analyticLabel}>Views:</span>
//                       <span style={styles.analyticValue}>{selectedAdAnalytics.views}</span>
//                     </div>
//                     <div style={styles.analyticItem}>
//                       <span style={styles.analyticLabel}>Clicks:</span>
//                       <span style={styles.analyticValue}>{selectedAdAnalytics.clicks}</span>
//                     </div>
//                     <div style={styles.analyticItem}>
//                       <span style={styles.analyticLabel}>CTR:</span>
//                       <span style={styles.analyticValue}>{selectedAdAnalytics.ctr}%</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Top Performing Ads */}
//               <div style={styles.topAdsSection}>
//                 <h3 style={styles.sectionSubtitle}>Top Performing Ads</h3>
//                 <div style={styles.topAdsList}>
//                   {ads
//                     .sort((a, b) => (b.views || 0) - (a.views || 0))
//                     .slice(0, 5)
//                     .map((ad, index) => (
//                       <div key={ad._id} style={styles.topAdItem}>
//                         <div style={styles.topAdRank}>#{index + 1}</div>
//                         <div style={styles.topAdInfo}>
//                           <div style={styles.topAdTitle}>{ad.title}</div>
//                           <div style={styles.topAdStats}>
//                             {ad.views || 0} views • {ad.clicks || 0} clicks
//                           </div>
//                         </div>
//                         <div style={styles.topAdCtr}>
//                           {ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) : 0}% CTR
//                         </div>
//                       </div>
//                     ))}
//                 </div>
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
//           border-top-color: #667eea; 
//           border-radius: 50%; 
//           animation: spin 0.8s linear infinite; 
//         }
//         @keyframes spin { 
//           to { transform: rotate(360deg); } 
//         }
//       `}</style>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     background: "#0f0f0f",
//     color: "#f1f1f1",
//     padding: "80px 20px 40px"
//   },
//   fullCard: {
//     background: "#1a1a1a",
//     borderRadius: "16px",
//     maxWidth: "1400px",
//     margin: "0 auto",
//     overflow: "hidden"
//   },
//   header: {
//     padding: "32px",
//     borderBottom: "1px solid #2a2a2a"
//   },
//   mainTitle: {
//     fontSize: "32px",
//     fontWeight: "700",
//     marginBottom: "24px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent"
//   },
//   tabContainer: {
//     display: "flex",
//     gap: "8px"
//   },
//   tab: {
//     padding: "12px 20px",
//     background: "transparent",
//     border: "1px solid #2a2a2a",
//     borderRadius: "8px",
//     color: "#888",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "14px",
//     fontWeight: "500",
//     transition: "all 0.2s"
//   },
//   activeTab: {
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     color: "#fff",
//     border: "1px solid transparent"
//   },
//   message: {
//     margin: "16px 32px",
//     padding: "16px",
//     borderRadius: "12px",
//     fontSize: "14px",
//     fontWeight: "500",
//     textAlign: "center"
//   },
//   content: {
//     padding: "32px"
//   },
  
//   // List View Styles
//   listContainer: {
//     minHeight: "400px"
//   },
//   loadingContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "400px"
//   },
//   emptyState: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "400px"
//   },
//   adGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
//     gap: "24px"
//   },
//   adCard: {
//     background: "#222",
//     borderRadius: "12px",
//     overflow: "hidden",
//     border: "1px solid #2a2a2a",
//     transition: "transform 0.2s, box-shadow 0.2s",
//     position: "relative"
//   },
//   adVideoContainer: {
//     position: "relative",
//     width: "100%",
//     height: "200px",
//     background: "#000"
//   },
//   adVideoPreview: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover"
//   },
//   adOverlay: {
//     position: "absolute",
//     top: 12,
//     right: 12
//   },
//   adBadge: {
//     padding: "6px 12px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "600",
//     color: "#fff"
//   },
//   adInfo: {
//     padding: "20px"
//   },
//   adTitle: {
//     fontSize: "18px",
//     fontWeight: "600",
//     marginBottom: "12px",
//     color: "#f1f1f1"
//   },
//   adDetails: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//     marginBottom: "16px"
//   },
//   adDetailItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: "13px"
//   },
//   detailLabel: {
//     color: "#888",
//     fontWeight: "500"
//   },
//   detailValue: {
//     color: "#f1f1f1",
//     fontWeight: "600"
//   },
//   adActions: {
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap"
//   },
//   actionButton: {
//     flex: 1,
//     minWidth: "100px",
//     padding: "8px 12px",
//     background: "#2a2a2a",
//     border: "none",
//     borderRadius: "6px",
//     color: "#f1f1f1",
//     fontSize: "13px",
//     fontWeight: "500",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "6px",
//     transition: "background 0.2s"
//   },
//   deleteConfirm: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.95)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "20px",
//     padding: "20px"
//   },
//   deleteText: {
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#f1f1f1"
//   },
//   deleteActions: {
//     display: "flex",
//     gap: "12px"
//   },
//   deleteButton: {
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: "600",
//     cursor: "pointer"
//   },

//   // Edit Form Styles
//   editForm: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px"
//   },
//   editInput: {
//     padding: "10px 12px",
//     background: "#2a2a2a",
//     border: "1px solid #3a3a3a",
//     borderRadius: "6px",
//     color: "#f1f1f1",
//     fontSize: "13px",
//     outline: "none"
//   },
//   editSelect: {
//     padding: "10px 12px",
//     background: "#2a2a2a",
//     border: "1px solid #3a3a3a",
//     borderRadius: "6px",
//     color: "#f1f1f1",
//     fontSize: "13px",
//     cursor: "pointer",
//     outline: "none"
//   },
//   editActions: {
//     display: "flex",
//     gap: "8px"
//   },
//   iconButton: {
//     flex: 1,
//     padding: "10px",
//     border: "none",
//     borderRadius: "6px",
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   // Upload Form Styles
//   uploadContainer: {
//     maxWidth: "600px",
//     margin: "0 auto"
//   },
//   sectionTitle: {
//     fontSize: "24px",
//     fontWeight: "600",
//     marginBottom: "32px",
//     color: "#f1f1f1"
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "24px"
//   },
//   inputGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px"
//   },
//   label: {
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#f1f1f1"
//   },
//   input: {
//     padding: "12px 16px",
//     background: "#272727",
//     border: "1px solid #3a3a3a",
//     borderRadius: "8px",
//     color: "#f1f1f1",
//     fontSize: "14px",
//     outline: "none"
//   },
//   select: {
//     padding: "12px 16px",
//     background: "#272727",
//     border: "1px solid #3a3a3a",
//     borderRadius: "8px",
//     color: "#f1f1f1",
//     fontSize: "14px",
//     cursor: "pointer",
//     outline: "none"
//   },
//   fileInput: {
//     padding: "12px",
//     background: "#272727",
//     border: "1px solid #3a3a3a",
//     borderRadius: "8px",
//     color: "#f1f1f1",
//     fontSize: "14px",
//     cursor: "pointer"
//   },
//   fileInfo: {
//     padding: "8px 12px",
//     background: "#1e293b",
//     borderRadius: "6px",
//     fontSize: "13px",
//     color: "#94a3b8"
//   },
//   hint: {
//     fontSize: "12px",
//     color: "#888"
//   },
//   submitButton: {
//     padding: "14px 24px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     border: "none",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "16px"
//   },
//   primaryButton: {
//     padding: "12px 24px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     border: "none",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: "600",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     marginTop: "16px"
//   },

//   // Analytics Styles
//   analyticsContainer: {},
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "20px",
//     marginBottom: "40px"
//   },
//   statCard: {
//     background: "#222",
//     padding: "24px",
//     borderRadius: "12px",
//     border: "1px solid #2a2a2a",
//     display: "flex",
//     alignItems: "center",
//     gap: "16px"
//   },
//   statIcon: {
//     fontSize: "36px"
//   },
//   statContent: {
//     flex: 1
//   },
//   statLabel: {
//     fontSize: "13px",
//     color: "#888",
//     marginBottom: "4px"
//   },
//   statValue: {
//     fontSize: "28px",
//     fontWeight: "700",
//     color: "#f1f1f1"
//   },
//   detailedAnalytics: {
//     background: "#222",
//     padding: "24px",
//     borderRadius: "12px",
//     border: "1px solid #2a2a2a",
//     marginBottom: "24px"
//   },
//   analyticsTitle: {
//     fontSize: "20px",
//     fontWeight: "600",
//     marginBottom: "16px",
//     color: "#f1f1f1"
//   },
//   analyticsDetails: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: "16px"
//   },
//   analyticItem: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px"
//   },
//   analyticLabel: {
//     fontSize: "12px",
//     color: "#888"
//   },
//   analyticValue: {
//     fontSize: "20px",
//     fontWeight: "600",
//     color: "#f1f1f1"
//   },
//   topAdsSection: {
//     background: "#222",
//     padding: "24px",
//     borderRadius: "12px",
//     border: "1px solid #2a2a2a"
//   },
//   sectionSubtitle: {
//     fontSize: "18px",
//     fontWeight: "600",
//     marginBottom: "20px",
//     color: "#f1f1f1"
//   },
//   topAdsList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px"
//   },
//   topAdItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: "16px",
//     padding: "16px",
//     background: "#2a2a2a",
//     borderRadius: "8px"
//   },
//   topAdRank: {
//     fontSize: "20px",
//     fontWeight: "700",
//     color: "#667eea",
//     minWidth: "40px"
//   },
//   topAdInfo: {
//     flex: 1
//   },
//   topAdTitle: {
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#f1f1f1",
//     marginBottom: "4px"
//   },
//   topAdStats: {
//     fontSize: "12px",
//     color: "#888"
//   },
//   topAdCtr: {
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#22c55e",
//     minWidth: "80px",
//     textAlign: "right"
//   },

//   // Common
//   button: {
//     padding: "12px 24px",
//     background: "#667eea",
//     border: "none",
//     borderRadius: "8px",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "600"
//   },
//   card: {
//     background: "#1a1a1a",
//     borderRadius: "16px",
//     padding: "40px",
//     textAlign: "center"
//   }
// };

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  FiUpload, FiList, FiEdit2, FiTrash2, FiEye, FiEyeOff, 
  FiBarChart2, FiX, FiCheck, FiPlus, FiDollarSign 
} from "react-icons/fi";

export default function AdManagement() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("list");
  
  // Upload form state
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("all");
  const [targetValue, setTargetValue] = useState("");
  const [skipAfter, setSkipAfter] = useState(5);
  const [cpm, setCpm] = useState(50); // 🔥 NEW
  const [cpc, setCpc] = useState(2);  // 🔥 NEW
  const [adVideo, setAdVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // List state
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (activeTab === "list") {
      fetchAds();
    }
  }, [activeTab]);

  /* ================= FETCH ALL ADS ================= */
  const fetchAds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/ads", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(res.data);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      setMessage("❌ Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE AD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!adVideo) {
      setMessage("❌ Please select a video file");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("target", target);
    formData.append("targetValue", targetValue);
    formData.append("skipAfter", skipAfter);
    formData.append("cpm", cpm);  // 🔥 NEW
    formData.append("cpc", cpc);  // 🔥 NEW
    formData.append("adVideo", adVideo);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/ads/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage("✅ Ad uploaded successfully!");
      
      // Reset form
      setTitle("");
      setTarget("all");
      setTargetValue("");
      setSkipAfter(5);
      setCpm(50);
      setCpc(2);
      setAdVideo(null);
      document.getElementById("adVideoInput").value = "";
      
      setTimeout(() => {
        setActiveTab("list");
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  /* ================= UPDATE AD ================= */
  const handleUpdate = async (adId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/ads/${adId}`, editingAd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage("✅ Ad updated successfully!");
      setEditingAd(null);
      fetchAds();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Update failed");
    }
  };

  /* ================= DELETE AD ================= */
  const handleDelete = async (adId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/ads/${adId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage("✅ Ad deleted successfully!");
      setShowDeleteConfirm(null);
      fetchAds();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Delete failed");
    }
  };

  /* ================= TOGGLE AD STATUS ================= */
  const toggleAdStatus = async (ad) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/ads/${ad._id}`, 
        { ...ad, active: !ad.active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAds();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to toggle status");
    }
  };

  /* ================= HELPERS ================= */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    return "₹" + amount.toFixed(2);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Please login to manage ads</h2>
          <button onClick={() => navigate("/login")} style={styles.button}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.fullCard}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>📢 Ad Management System</h1>
          <div style={styles.tabContainer}>
            <button
              onClick={() => setActiveTab("list")}
              style={{
                ...styles.tab,
                ...(activeTab === "list" ? styles.activeTab : {})
              }}
            >
              <FiList size={18} />
              <span>All Ads</span>
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              style={{
                ...styles.tab,
                ...(activeTab === "upload" ? styles.activeTab : {})
              }}
            >
              <FiUpload size={18} />
              <span>Upload New</span>
            </button>
            <button
              onClick={() => navigate("/revenue-dashboard")}
              style={styles.revenueTab}
            >
              <FiDollarSign size={18} />
              <span>Revenue Dashboard</span>
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            ...styles.message,
            background: message.includes("✅") ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)",
            border: message.includes("✅") ? "1px solid #4ade80" : "1px solid #f87171",
            color: message.includes("✅") ? "#4ade80" : "#f87171"
          }}>
            {message}
          </div>
        )}

        {/* Content Area */}
        <div style={styles.content}>
          {/* ==================== LIST VIEW ==================== */}
          {activeTab === "list" && (
            <div style={styles.listContainer}>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div className="spinner"></div>
                </div>
              ) : ads.length === 0 ? (
                <div style={styles.emptyState}>
                  <FiUpload size={48} color="#555" />
                  <h3 style={{ color: "#888", marginTop: 16 }}>No ads yet</h3>
                  <p style={{ color: "#666", fontSize: 14 }}>Upload your first ad to get started</p>
                  <button 
                    onClick={() => setActiveTab("upload")} 
                    style={styles.primaryButton}
                  >
                    <FiPlus size={18} />
                    <span>Upload Ad</span>
                  </button>
                </div>
              ) : (
                <div style={styles.adGrid}>
                  {ads.map((ad) => (
                    <div key={ad._id} style={styles.adCard}>
                      <div style={styles.adVideoContainer}>
                        <video
                          src={`http://localhost:5000/uploads/ads/${ad.videoFile}`}
                          style={styles.adVideoPreview}
                          controls={false}
                          muted
                        />
                        <div style={styles.adOverlay}>
                          <span style={{
                            ...styles.adBadge,
                            background: ad.active ? "#22c55e" : "#ef4444"
                          }}>
                            {ad.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div style={styles.adInfo}>
                        {editingAd?._id === ad._id ? (
                          <div style={styles.editForm}>
                            <input
                              type="text"
                              value={editingAd.title}
                              onChange={(e) => setEditingAd({...editingAd, title: e.target.value})}
                              style={styles.editInput}
                              placeholder="Ad Title"
                            />
                            <select
                              value={editingAd.target}
                              onChange={(e) => setEditingAd({...editingAd, target: e.target.value})}
                              style={styles.editSelect}
                            >
                              <option value="all">All Videos</option>
                              <option value="category">Category</option>
                              <option value="video">Specific Video</option>
                            </select>
                            {editingAd.target !== "all" && (
                              <input
                                type="text"
                                value={editingAd.targetValue}
                                onChange={(e) => setEditingAd({...editingAd, targetValue: e.target.value})}
                                style={styles.editInput}
                                placeholder={editingAd.target === "category" ? "Category Name" : "Video ID"}
                              />
                            )}
                            <input
                              type="number"
                              value={editingAd.skipAfter}
                              onChange={(e) => setEditingAd({...editingAd, skipAfter: e.target.value})}
                              style={styles.editInput}
                              placeholder="Skip After (seconds)"
                            />
                            <input
                              type="number"
                              value={editingAd.cpm}
                              onChange={(e) => setEditingAd({...editingAd, cpm: e.target.value})}
                              style={styles.editInput}
                              placeholder="CPM (₹ per 1000 views)"
                            />
                            <input
                              type="number"
                              value={editingAd.cpc}
                              onChange={(e) => setEditingAd({...editingAd, cpc: e.target.value})}
                              style={styles.editInput}
                              placeholder="CPC (₹ per click)"
                            />
                            <div style={styles.editActions}>
                              <button
                                onClick={() => handleUpdate(ad._id)}
                                style={{...styles.iconButton, background: "#22c55e"}}
                              >
                                <FiCheck size={16} />
                              </button>
                              <button
                                onClick={() => setEditingAd(null)}
                                style={{...styles.iconButton, background: "#ef4444"}}
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 style={styles.adTitle}>{ad.title}</h3>
                            <div style={styles.adDetails}>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>Target:</span>
                                <span style={styles.detailValue}>
                                  {ad.target === "all" ? "All Videos" : ad.targetValue}
                                </span>
                              </div>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>Skip After:</span>
                                <span style={styles.detailValue}>{ad.skipAfter}s</span>
                              </div>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>Views:</span>
                                <span style={styles.detailValue}>{ad.views || 0}</span>
                              </div>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>Clicks:</span>
                                <span style={styles.detailValue}>{ad.clicks || 0}</span>
                              </div>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>CPM:</span>
                                <span style={styles.detailValue}>{formatCurrency(ad.cpm)}</span>
                              </div>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>CPC:</span>
                                <span style={styles.detailValue}>{formatCurrency(ad.cpc)}</span>
                              </div>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>Revenue:</span>
                                <span style={{...styles.detailValue, color: "#22c55e", fontWeight: "700"}}>
                                  {formatCurrency(ad.revenue || 0)}
                                </span>
                              </div>
                              <div style={styles.adDetailItem}>
                                <span style={styles.detailLabel}>Created:</span>
                                <span style={styles.detailValue}>{formatDate(ad.createdAt)}</span>
                              </div>
                            </div>

                            <div style={styles.adActions}>
                              <button
                                onClick={() => toggleAdStatus(ad)}
                                style={styles.actionButton}
                              >
                                {ad.active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                <span>{ad.active ? "Deactivate" : "Activate"}</span>
                              </button>
                              <button
                                onClick={() => setEditingAd(ad)}
                                style={styles.actionButton}
                              >
                                <FiEdit2 size={16} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(ad._id)}
                                style={{...styles.actionButton, color: "#ef4444"}}
                              >
                                <FiTrash2 size={16} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {showDeleteConfirm === ad._id && (
                        <div style={styles.deleteConfirm}>
                          <p style={styles.deleteText}>Delete this ad?</p>
                          <div style={styles.deleteActions}>
                            <button
                              onClick={() => handleDelete(ad._id)}
                              style={{...styles.deleteButton, background: "#ef4444"}}
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              style={{...styles.deleteButton, background: "#555"}}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== UPLOAD VIEW ==================== */}
          {activeTab === "upload" && (
            <div style={styles.uploadContainer}>
              <h2 style={styles.sectionTitle}>Upload New Advertisement</h2>
              <form onSubmit={handleUpload} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ad Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer Sale 2024"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Target Audience *</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    style={styles.select}
                  >
                    <option value="all">All Videos</option>
                    <option value="category">Specific Category</option>
                    <option value="video">Specific Video</option>
                  </select>
                </div>

                {target !== "all" && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>
                      {target === "category" ? "Category Name *" : "Video ID *"}
                    </label>
                    <input
                      type="text"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder={target === "category" ? "e.g., Gaming, Music, Education" : "Video MongoDB ID"}
                      required
                      style={styles.input}
                    />
                  </div>
                )}

                <div style={styles.twoColumnGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Skip After (seconds) *</label>
                    <input
                      type="number"
                      value={skipAfter}
                      onChange={(e) => setSkipAfter(e.target.value)}
                      min="0"
                      max="30"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>CPM (₹ per 1000 views) *</label>
                    <input
                      type="number"
                      value={cpm}
                      onChange={(e) => setCpm(e.target.value)}
                      min="0"
                      step="0.01"
                      style={styles.input}
                      placeholder="50"
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>CPC (₹ per click) *</label>
                  <input
                    type="number"
                    value={cpc}
                    onChange={(e) => setCpc(e.target.value)}
                    min="0"
                    step="0.01"
                    style={styles.input}
                    placeholder="2"
                  />
                  <small style={styles.hint}>
                    💡 Revenue = (Views/1000 × CPM) + (Clicks × CPC)
                  </small>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ad Video File *</label>
                  <input
                    id="adVideoInput"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setAdVideo(e.target.files[0])}
                    required
                    style={styles.fileInput}
                  />
                  {adVideo && (
                    <div style={styles.fileInfo}>
                      📹 {adVideo.name} ({(adVideo.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    ...styles.submitButton,
                    opacity: uploading ? 0.6 : 1,
                    cursor: uploading ? "not-allowed" : "pointer"
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Ad"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .spinner { 
          width: 48px; 
          height: 48px; 
          border: 4px solid #303030; 
          border-top-color: #667eea; 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite; 
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#f1f1f1",
    padding: "80px 20px 40px"
  },
  fullCard: {
    background: "#1a1a1a",
    borderRadius: "16px",
    maxWidth: "1400px",
    margin: "0 auto",
    overflow: "hidden"
  },
  header: {
    padding: "32px",
    borderBottom: "1px solid #2a2a2a"
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  tab: {
    padding: "12px 20px",
    background: "transparent",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#888",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s"
  },
  activeTab: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "1px solid transparent"
  },
  revenueTab: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600"
  },
  message: {
    margin: "16px 32px",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center"
  },
  content: {
    padding: "32px"
  },
  listContainer: {
    minHeight: "400px"
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "400px"
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "400px"
  },
  adGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px"
  },
  adCard: {
    background: "#222",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #2a2a2a",
    position: "relative"
  },
  adVideoContainer: {
    position: "relative",
    width: "100%",
    height: "200px",
    background: "#000"
  },
  adVideoPreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  adOverlay: {
    position: "absolute",
    top: 12,
    right: 12
  },
  adBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff"
  },
  adInfo: {
    padding: "20px"
  },
  adTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#f1f1f1"
  },
  adDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px"
  },
  adDetailItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px"
  },
  detailLabel: {
    color: "#888",
    fontWeight: "500"
  },
  detailValue: {
    color: "#f1f1f1",
    fontWeight: "600"
  },
  adActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  actionButton: {
    flex: 1,
    minWidth: "100px",
    padding: "8px 12px",
    background: "#2a2a2a",
    border: "none",
    borderRadius: "6px",
    color: "#f1f1f1",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px"
  },
  deleteConfirm: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "20px"
  },
  deleteText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f1f1f1"
  },
  deleteActions: {
    display: "flex",
    gap: "12px"
  },
  deleteButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },
  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  editInput: {
    padding: "10px 12px",
    background: "#2a2a2a",
    border: "1px solid #3a3a3a",
    borderRadius: "6px",
    color: "#f1f1f1",
    fontSize: "13px",
    outline: "none"
  },
  editSelect: {
    padding: "10px 12px",
    background: "#2a2a2a",
    border: "1px solid #3a3a3a",
    borderRadius: "6px",
    color: "#f1f1f1",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none"
  },
  editActions: {
    display: "flex",
    gap: "8px"
  },
  iconButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  uploadContainer: {
    maxWidth: "600px",
    margin: "0 auto"
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "32px",
    color: "#f1f1f1"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f1f1"
  },
  input: {
    padding: "12px 16px",
    background: "#272727",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    color: "#f1f1f1",
    fontSize: "14px",
    outline: "none"
  },
  select: {
    padding: "12px 16px",
    background: "#272727",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    color: "#f1f1f1",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none"
  },
  fileInput: {
    padding: "12px",
    background: "#272727",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    color: "#f1f1f1",
    fontSize: "14px",
    cursor: "pointer"
  },
  fileInfo: {
    padding: "8px 12px",
    background: "#1e293b",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#94a3b8"
  },
  hint: {
    fontSize: "12px",
    color: "#888"
  },
  submitButton: {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "16px"
  },
  primaryButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px"
  },
  card: {
    background: "#1a1a1a",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center"
  },
  button: {
    padding: "12px 24px",
    background: "#667eea",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  }
};