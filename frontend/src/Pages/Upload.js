

// import React, { useState, useContext } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Upload() {
//   const { user } = useContext(AuthContext);

//   const [title, setTitle] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   if (!user || !user.isAdmin) {
//     return <h2>❌ Only Admin Can Upload Videos</h2>;
//   }

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!title || !video || !thumbnail) {
//       alert("Please provide title, video and thumbnail");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("video", video);
//     formData.append("thumbnail", thumbnail);

//     const token = localStorage.getItem("token");

//     try {
//       setUploading(true);

//       const res = await api.post(
//         "/api/videos/upload",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Uploaded successfully!");
//       console.log(res.data);
//       setUploading(false);
//     } catch (err) {
//       setUploading(false);
//       alert("Upload failed");
//     }
//   };

//   // STYLING
//   const box = {
//     width: "400px",
//     margin: "40px auto",
//     padding: "25px",
//     background: "#fff",
//     borderRadius: "10px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//   };
//   const input = {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "15px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//   };
//   const btn = {
//     width: "100%",
//     padding: "12px",
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//   };

//   return (
//     <div style={box}>
//       <h2>Upload Video</h2>

//       <form onSubmit={handleUpload}>
//         <input
//           style={input}
//           type="text"
//           placeholder="Enter video title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <label>Choose Video:</label>
//         <input
//           style={input}
//           type="file"
//           accept="video/*"
//           onChange={(e) => setVideo(e.target.files[0])}
//         />

//         <label>Choose Thumbnail:</label>
//         <input
//           style={input}
//           type="file"
//           accept="image/*"
//           onChange={(e) => setThumbnail(e.target.files[0])}
//         />

//         <button style={btn} type="submit" disabled={uploading}>
//           {uploading ? "Uploading..." : "Upload Video"}
//         </button>
//       </form>
//     </div>
//   );
// }


// import React, { useState, useContext, useEffect } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Upload() {
//   const { user } = useContext(AuthContext);

//   // STATE (hooks ALWAYS at top)
//   const [title, setTitle] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const [videos, setVideos] = useState([]); // LOAD ALL VIDEOS
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   // LOAD VIDEOS (hook placed before any early return)
//   const fetchVideos = async () => {
//     try {
//       const res = await api.get("/api/videos/all");
//       setVideos(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch videos", err);
//       setVideos([]);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // If not admin, show access denied (render only)
//   if (!user || !user.isAdmin) {
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>❌ Only Admin Can Upload Videos</h2>
//       </div>
//     );
//   }

//   // UPLOAD VIDEO
//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!title || !video || !thumbnail) {
//       alert("Please provide title, video and thumbnail");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("video", video);
//     formData.append("thumbnail", thumbnail);

//     const token = localStorage.getItem("token");

//     try {
//       setUploading(true);

//       await api.post("/api/videos/upload", formData, {
//         
//       });

//       alert("Video Uploaded ✔");
//       setTitle("");
//       setVideo(null);
//       setThumbnail(null);
//       await fetchVideos();
//       setUploading(false);
//     } catch (err) {
//       setUploading(false);
//       console.error("Upload failed", err);
//       alert("Upload Failed ❌");
//     }
//   };

//   // DELETE VIDEO
//   const deleteVideo = async (id) => {
//     if (!window.confirm("Delete this video?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await api.delete(`/api/videos/delete/${id}`, {
//         
//       });
//       fetchVideos();
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Delete failed");
//     }
//   };

//   // EDIT VIDEO TITLE
//   const updateVideoTitle = async () => {
//     if (!editTitle) return alert("Title required");
//     try {
//       const token = localStorage.getItem("token");
//       await api.put(
//         `/api/videos/update/${editId}`,
//         { title: editTitle },
//         {  }
//       );
//       setEditId(null);
//       setEditTitle("");
//       fetchVideos();
//     } catch (err) {
//       console.error("Update failed", err);
//       alert("Update failed");
//     }
//   };

//   // STYLING
//   const styles = {
//     box: {
//       width: "420px",
//       margin: "40px auto",
//       padding: "25px",
//       background: "#fff",
//       borderRadius: "10px",
//       boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//     },
//     input: {
//       width: "100%",
//       padding: "10px",
//       marginBottom: "15px",
//       borderRadius: "8px",
//       border: "1px solid #ccc",
//     },
//     btn: {
//       width: "100%",
//       padding: "12px",
//       background: "#ff0000",
//       color: "#fff",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       marginTop: "10px",
//     },
//     listCard: {
//       background: "#fff",
//       padding: "15px",
//       borderRadius: "10px",
//       marginBottom: "15px",
//       display: "flex",
//       alignItems: "center",
//       gap: "15px",
//       boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
//     },
//     thumb: {
//       width: "120px",
//       height: "70px",
//       objectFit: "cover",
//       borderRadius: "10px",
//     },
//     actions: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "10px",
//     },
//     editBox: {
//       marginTop: "10px",
//       padding: "10px",
//       display: "flex",
//       gap: "10px",
//     },
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       {/* UPLOAD SECTION */}
//       <div style={styles.box}>
//         <h2>Upload New Video</h2>

//         <form onSubmit={handleUpload}>
//           <input
//             style={styles.input}
//             type="text"
//             placeholder="Enter video title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <label>Choose Video:</label>
//           <input
//             style={styles.input}
//             type="file"
//             accept="video/*"
//             onChange={(e) => setVideo(e.target.files[0])}
//           />

//           <label>Choose Thumbnail:</label>
//           <input
//             style={styles.input}
//             type="file"
//             accept="image/*"
//             onChange={(e) => setThumbnail(e.target.files[0])}
//           />

//           <button style={styles.btn} type="submit" disabled={uploading}>
//             {uploading ? "Uploading..." : "Upload Video"}
//           </button>
//         </form>
//       </div>

//       {/* CRUD LIST SECTION */}
//       <h2 style={{ marginTop: "30px", textAlign: "center" }}>Manage Videos</h2>

//       {videos.map((v) => (
//         <div key={v._id} style={styles.listCard}>
//           <img
//             src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//             style={styles.thumb}
//             alt=""
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://via.placeholder.com/120x70?text=no+thumb";
//             }}
//           />

//           <div style={{ flex: 1 }}>
//             <b>{v.title}</b>

//             {/* EDIT MODE */}
//             {editId === v._id && (
//               <div style={styles.editBox}>
//                 <input
//                   style={styles.input}
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                 />
//                 <button
//                   style={{ ...styles.btn, width: "90px" }}
//                   onClick={updateVideoTitle}
//                 >
//                   Save
//                 </button>
//               </div>
//             )}
//           </div>

//           <div style={styles.actions}>
//             <button
//               style={{
//                 ...styles.btn,
//                 background: "#007bff",
//                 width: "90px",
//               }}
//               onClick={() => {
//                 setEditId(v._id);
//                 setEditTitle(v.title);
//               }}
//             >
//               Edit
//             </button>

//             <button
//               style={{
//                 ...styles.btn,
//                 background: "#ff0000",
//                 width: "90px",
//               }}
//               onClick={() => deleteVideo(v._id)}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// import React, { useState, useContext, useEffect } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Upload() {
//   const { user } = useContext(AuthContext);
//   const token = localStorage.getItem("token");

//   // State
//   const [title, setTitle] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [videos, setVideos] = useState([]);

//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   // Fetch videos
//   const fetchVideos = async () => {
//     const res = await api.get("/api/videos/all");
//     setVideos(res.data);
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   if (!user || !user.isAdmin) {
//     return <h2 style={{ textAlign: "center", marginTop: "40px" }}>❌ Only Admin Allowed</h2>;
//   }

//   // Upload video
//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!title || !video || !thumbnail) {
//       alert("Missing fields!");
//       return;
//     }

//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("video", video);
//     fd.append("thumbnail", thumbnail);

//     try {
//       setUploading(true);

//       await api.post("/api/videos/upload", fd, {
//         
//       });

//       alert("Uploaded ✔");
//       setTitle("");
//       setVideo(null);
//       setThumbnail(null);
//       fetchVideos();
//     } catch (err) {
//       alert("Upload failed ❌");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Delete
//   const deleteVideo = async (id) => {
//     if (!window.confirm("Delete permanently?")) return;

//     await api.delete(`/api/videos/delete/${id}`, {
//       
//     });

//     fetchVideos();
//   };

//   // Update Title
//   const updateTitle = async () => {
//     await api.put(
//       `/api/videos/update/${editId}`,
//       { title: editTitle },
//       {  }
//     );

//     setEditId(null);
//     fetchVideos();
//   };

//   // Replace Thumbnail
//   const replaceThumb = async (id, file) => {
//     if (!file) return;

//     const fd = new FormData();
//     fd.append("thumbnail", file);

//     await api.put(
//       `/api/videos/update-thumbnail/${id}`,
//       fd,
//       {  }
//     );

//     fetchVideos();
//   };

//   // Replace Video File
//   const replaceVideoFile = async (id, file) => {
//     if (!file) return;

//     const fd = new FormData();
//     fd.append("video", file);

//     await api.put(
//       `/api/videos/update-video/${id}`,
//       fd,
//       {  }
//     );

//     fetchVideos();
//   };

//   // Styling
//   const box = {
//     width: "420px",
//     margin: "20px auto",
//     padding: "20px",
//     background: "#fff",
//     borderRadius: "10px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//   };

//   const input = {
//     width: "100%",
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//     marginBottom: "12px",
//   };

//   const btn = {
//     padding: "10px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#ff0000",
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: "bold",
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       {/* UPLOAD FORM */}
//       <div style={box}>
//         <h2>Upload Video</h2>

//         <form onSubmit={handleUpload}>
//           <input
//             style={input}
//             type="text"
//             placeholder="Video title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <label>Choose Video</label>
//           <input
//             style={input}
//             type="file"
//             accept="video/*"
//             onChange={(e) => setVideo(e.target.files[0])}
//           />

//           <label>Choose Thumbnail</label>
//           <input
//             style={input}
//             type="file"
//             accept="image/*"
//             onChange={(e) => setThumbnail(e.target.files[0])}
//           />

//           <button style={btn} type="submit" disabled={uploading}>
//             {uploading ? "Uploading..." : "Upload"}
//           </button>
//         </form>
//       </div>

//       {/* LIST VIDEOS */}
//       <h2 style={{ textAlign: "center", marginTop: 30 }}>Manage Videos</h2>

//       {videos.map((v) => (
//         <div
//           key={v._id}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 15,
//             background: "#fff",
//             padding: 15,
//             margin: "15px auto",
//             width: "90%",
//             borderRadius: "10px",
//             boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           {/* Thumbnail */}
//           <img
//             src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//             width="130"
//             height="80"
//             style={{ borderRadius: "8px", objectFit: "cover" }}
//           />

//           {/* Title */}
//           <div style={{ flex: 1 }}>
//             {editId === v._id ? (
//               <>
//                 <input
//                   style={input}
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                 />
//                 <button style={btn} onClick={updateTitle}>Save</button>
//               </>
//             ) : (
//               <h3>{v.title}</h3>
//             )}
//           </div>

//           {/* CRUD Buttons */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             <button
//               style={{ ...btn, background: "#007bff" }}
//               onClick={() => {
//                 setEditId(v._id);
//                 setEditTitle(v.title);
//               }}
//             >
//               Edit Title
//             </button>

//             {/* Replace Thumbnail */}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => replaceThumb(v._id, e.target.files[0])}
//             />

//             {/* Replace Video */}
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => replaceVideoFile(v._id, e.target.files[0])}
//             />

//             <button
//               style={{ ...btn, background: "#ff0000" }}
//               onClick={() => deleteVideo(v._id)}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// import React, { useState, useContext, useEffect } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Upload() {
//   const { user } = useContext(AuthContext);
//   const token = localStorage.getItem("token");

//   const [title, setTitle] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [videos, setVideos] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   const fetchVideos = async () => {
//     const res = await api.get("/api/videos/all");
//     setVideos(res.data);
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // Protect route
//   if (!user || !user.isAdmin) {
//     return (
//       <div className="unauthorized">
//         <div className="lock-icon">Locked</div>
//         <h2>Access Denied</h2>
//         <p>Only administrators can access this page.</p>
//       </div>
//     );
//   }

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!title || !video || !thumbnail) return alert("Please fill all fields");

//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("video", video);
//     fd.append("thumbnail", thumbnail);

//     try {
//       setUploading(true);
//       await api.post("/api/videos/upload", fd, {
//         
//       });

//       alert("Video uploaded successfully!");
//       setTitle(""); setVideo(null); setThumbnail(null);
//       document.getElementById("video-input").value = "";
//       document.getElementById("thumb-input").value = "";
//       fetchVideos();
//     } catch (err) {
//       alert("Upload failed: " + (err.response?.data?.message || "Server error"));
//     } finally {
//       setUploading(false);
//     }
//   };

//   const deleteVideo = async (id) => {
//     if (!window.confirm("Delete this video permanently?")) return;
//     await api.delete(`/api/videos/delete/${id}`, {
//       
//     });
//     fetchVideos();
//   };

//   const updateTitle = async () => {
//     if (!editTitle.trim()) return;
//     await api.put(
//       `/api/videos/update/${editId}`,
//       { title: editTitle },
//       {  }
//     );
//     setEditId(null);
//     fetchVideos();
//   };

//   const replaceThumb = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("thumbnail", file);
//     await api.put(
//       `/api/videos/update-thumbnail/${id}`,
//       fd,
//       {  }
//     );
//     fetchVideos();
//   };

//   const replaceVideoFile = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("video", file);
//     await api.put(
//       `/api/videos/update-video/${id}`,
//       fd,
//       {  }
//     );
//     fetchVideos();
//   };

//   return (
//     <div className="admin-dashboard">
//       {/* Upload Card */}
//       <div className="upload-card">
//         <h2>Upload New Video</h2>

//         <form onSubmit={handleUpload} className="upload-form">
//           <div className="input-group">
//             <label>Video Title</label>
//             <input
//               type="text"
//               placeholder="Enter video title..."
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label>Video File (MP4 recommended)</label>
//             <input
//               id="video-input"
//               type="file"
//               accept="video/*"
//               onChange={(e) => setVideo(e.target.files[0])}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label>Thumbnail</label>
//             <input
//               id="thumb-input"
//               type="file"
//               accept="image/*"
//               onChange={(e) => setThumbnail(e.target.files[0])}
//               required
//             />
//           </div>

//           <button type="submit" className="upload-btn" disabled={uploading}>
//             {uploading ? (
//               <>
//                 <span className="spinner"></span> Uploading...
//               </>
//             ) : (
//               "Upload Video"
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Video Management List */}
//       <div className="management-section">
//         <h2>Manage Videos ({videos.length})</h2>

//         <div className="videos-grid">
//           {videos.map((v) => (
//             <div key={v._id} className="video-manage-card">
//               <div className="thumb-container">
//                 <img
//                   src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                   alt="thumb"
//                   className="manage-thumb"
//                 />
//                 <div className="play-icon">Play</div>
//               </div>

//               <div className="video-details">
//                 {editId === v._id ? (
//                   <div className="edit-title">
//                     <input
//                       type="text"
//                       value={editTitle}
//                       onChange={(e) => setEditTitle(e.target.value)}
//                       autoFocus
//                     />
//                     <button onClick={updateTitle} className="save-btn">Save</button>
//                     <button onClick={() => setEditId(null)} className="cancel-btn">Cancel</button>
//                   </div>
//                 ) : (
//                   <h3 className="video-title-manage">{v.title}</h3>
//                 )}

//                 <div className="video-stats">
//                   <span>{v.views || 0} views</span>
//                   <span>•</span>
//                   <span>{new Date(v.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>

//               <div className="action-buttons">
//                 <button
//                   className="edit-btn"
//                   onClick={() => {
//                     setEditId(v._id);
//                     setEditTitle(v.title);
//                   }}
//                 >
//                   Edit Title
//                 </button>

//                 <label className="file-label">
//                   New Thumbnail
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => replaceThumb(v._id, e.target.files[0])}
//                   />
//                 </label>

//                 <label className="file-label danger">
//                   Replace Video
//                   <input
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => replaceVideoFile(v._id, e.target.files[0])}
//                   />
//                 </label>

//                 <button
//                   className="delete-btn"
//                   onClick={() => deleteVideo(v._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Beautiful Dark Theme CSS */}
//       <style jsx>{`
//         .admin-dashboard {
//           min-height: 100vh;
//           background: #0f0f0f;
//           color: #fff;
//           padding: 30px 20px;
//         }

//         .unauthorized {
//           text-align: center;
//           padding: 100px 20px;
//           color: #aaa;
//         }

//         .lock-icon {
//           font-size: 80px;
//           margin-bottom: 20px;
//         }

//         .upload-card {
//           max-width: 600px;
//           margin: 0 auto 60px;
//           background: #1a1a1a;
//           border-radius: 20px;
//           padding: 32px;
//           box-shadow: 0 10px 40px rgba(0,0,0,0.6);
//           border: 1px solid #333;
//         }

//         .upload-card h2 {
//           text-align: center;
//           margin-bottom: 30px;
//           font-size: 28px;
//           background: linear-gradient(90deg, #ff0033, #ff6b6b);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .upload-form {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }

//         .input-group label {
//           display: block;
//           margin-bottom: 8px;
//           font-weight: 600;
//           color: #ff0033;
//         }

//         .input-group input[type="text"] {
//           width: 100%;
//           padding: 14px 16px;
//           background: #111;
//           border: 1px solid #444;
//           border-radius: 12px;
//           color: white;
//           font-size: 16px;
//         }

//         .input-group input[type="file"] {
//           width: 100%;
//           padding: 12px;
//           background: #111;
//           border: 1px dashed #555;
//           border-radius: 12px;
//           color: #ccc;
//         }

//         .upload-btn {
//           margin-top: 20px;
//           padding: 16px;
//           background: linear-gradient(135deg, #ff0033, #cc0029);
//           color: white;
//           border: none;
//           border-radius: 12px;
//           font-size: 18px;
//           font-weight: bold;
//           cursor: pointer;
//           transition: all 0.3s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//         }

//         .upload-btn:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 10px 30px rgba(255,0,51,0.4);
//         }

//         .upload-btn:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid #fff;
//           border-top: 2px solid transparent;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .section {
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         .section h2 {
//           font-size: 26px;
//           margin: 40px 0 30px;
//           text-align: center;
//         }

//         .videos-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
//           gap: 24px;
//         }

//         .video-manage-card {
//           background: #1a1a1a;
//           border-radius: 16px;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           gap: 20px;
//           padding: 20px;
//           border: 1px solid #333;
//           transition: all 0.3s;
//         }

//         .video-manage-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0,0,0,0.5);
//           border-color: #ff0033;
//         }

//         .thumb-container {
//           position: relative;
//           border-radius: 12px;
//           overflow: hidden;
//           flex-shrink: 0;
//         }

//         .manage-thumb {
//           width: 180px;
//           height: 110px;
//           object-fit: cover;
//         }

//         .play-icon {
//           position: absolute;
//           inset: 0;
//           background: rgba(0,0,0,0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 36px;
//           opacity: 0;
//           transition: opacity 0.3s;
//         }

//         .video-manage-card:hover .play-icon {
//           opacity: 1;
//         }

//         .video-details {
//           flex: 1;
//         }

//         .video-title-manage {
//           font-size: 18px;
//           font-weight: 600;
//           margin-bottom: 8px;
//           line-height: 1.4;
//         }

//         .video-stats {
//           color: #aaa;
//           font-size: 14px;
//         }

//         .edit-title input {
//           width: 100%;
//           padding: 10px;
//           background: #000;
//           border: 1px solid #555;
//           border-radius: 8px;
//           color: white;
//           margin-bottom: 8px;
//         }

//         .save-btn, .cancel-btn {
//           padding: 8px 16px;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           margin-right: 8px;
//         }

//         .save-btn {
//           background: #0d6;
//           color: white;
//         }

//         .cancel-btn {
//           background: #444;
//           color: white;
//         }

//         .action-buttons {
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .action-buttons button,
//         .file-label {
//           padding: 10px 16px;
//           border-radius: 10px;
//           font-size: 14px;
//           cursor: pointer;
//           text-align: center;
//           transition: all 0.2s;
//         }

//         .edit-btn {
//           background: #0066cc;
//           color: white;
//           border: none;
//         }

//         .file-label {
//           background: #272727;
//           color: #ccc;
//           border: 1px dashed #555;
//           padding: 12px;
//         }

//         .file-label.danger {
//           background: #330000;
//           color: #ff6666;
//           border-color: #600;
//         }

//         .file-label input {
//           display: none;
//         }

//         .delete-btn {
//           background: #c00;
//           color: white;
//           border: none;
//         }

//         .action-buttons button:hover {
//           transform: scale(1.05);
//         }

//         @media (max-width: 768px) {
//           .videos-grid {
//             grid-template-columns: 1fr;
//           }
//           .video-manage-card {
//             flex-direction: column;
//             text-align: center;
//           }
//           .action-buttons {
//             flex-direction: row;
//             flex-wrap: wrap;
//             justify-content: center;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
// import React, { useState, useContext, useEffect } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Upload() {
//   const { user } = useContext(AuthContext);
//   const token = localStorage.getItem("token");

//   // Upload form states
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // Video management states
//   const [videos, setVideos] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   // Category options
//   const categories = [
//     "Gaming","Music","Education","Entertainment","Sports","Technology",
//     "Cooking","Travel","Vlogs","News","Comedy","Animation","Science",
//     "Fashion","Fitness","Other"
//   ];

//   // Fetch videos for management
//   const fetchVideos = async () => {
//     const res = await api.get("/api/videos/all");
//     setVideos(res.data);
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // 🎯 Only Admin Check
//   if (!user || !user.isAdmin) {
//     return (
//       <div className="unauthorized">
//         <h2 style={{ color: "red" }}>❌ Access Denied</h2>
//         <p>Only Admin can access this page.</p>
//       </div>
//     );
//   }

//   // 📤 Upload Video Handler
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!title || !category || !video || !thumbnail)
//       return alert("⚠ Please fill all required fields.");

//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("category", category);
//     fd.append("description", description);
//     fd.append("tags", tags);
//     fd.append("video", video);
//     fd.append("thumbnail", thumbnail);

//     try {
//       setUploading(true);
//       await api.post("/api/videos/upload", fd, {
//         
//       });

//       alert("🎉 Video Uploaded Successfully!");
//       setTitle(""); setCategory(""); setDescription(""); setTags("");
//       setVideo(null); setThumbnail(null);
//       document.getElementById("video-input").value = "";
//       document.getElementById("thumb-input").value = "";
//       fetchVideos();
//     } catch (err) {
//       alert("Upload Failed ❌");
//       console.log(err.response?.data || err);
//     }
//     setUploading(false);
//   };

//   // 🗑 Delete Video
//   const deleteVideo = async (id) => {
//     if (!window.confirm("⚠ Delete this video permanently?")) return;
//     await api.delete(`/api/videos/delete/${id}`, {
//       
//     });
//     fetchVideos();
//   };

//   // ✏ Update Title
//   const updateTitle = async () => {
//     if (!editTitle.trim()) return;
//     await api.put(
//       `/api/videos/update/${editId}`,
//       { title: editTitle },
//       {  }
//     );
//     setEditId(null);
//     fetchVideos();
//   };

//   // 🖼 Replace Thumbnail
//   const replaceThumb = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("thumbnail", file);
//     await api.put(
//       `/api/videos/update-thumbnail/${id}`,
//       fd,
//       {  }
//     );
//     fetchVideos();
//   };

//   // 🎥 Replace Video
//   const replaceVideoFile = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("video", file);
//     await api.put(
//       `/api/videos/update-video/${id}`,
//       fd,
//       {  }
//     );
//     fetchVideos();
//   };

//   return (
//     <div className="admin-dashboard">
//       {/* 📤 Upload Section */}
//       <div className="upload-card">
//         <h2>📤 Upload New Video</h2>
//         <form onSubmit={handleUpload} className="upload-form">

//           <input
//             type="text"
//             placeholder="Enter video title *"
//             value={title}
//             required
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <textarea
//             placeholder="Enter description (optional)"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />

//           <input
//             type="text"
//             placeholder="Tags (comma separated: music, tech)"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//           />

//           <select required value={category} onChange={(e) => setCategory(e.target.value)}>
//             <option value="">-- Select Category * --</option>
//             {categories.map((c) => <option key={c} value={c}>{c}</option>)}
//           </select>

//           <input id="video-input" type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])}/>
//           <input id="thumb-input" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])}/>

//           <button disabled={uploading}>
//             {uploading ? "Uploading..." : "Upload 🚀"}
//           </button>
//         </form>
//       </div>

//       {/* 🛠 Manage Section */}
//       <div className="management-section">
//         <h2>🎬 Manage Videos ({videos.length})</h2>

//         <div className="videos-grid">
//           {videos.map((v) => (
//             <div key={v._id} className="video-manage-card">
//               <img src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`} alt="thumb"/>

//               {editId === v._id ? (
//                 <div className="edit-title">
//                   <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus/>
//                   <button onClick={updateTitle}>Save</button>
//                   <button onClick={() => setEditId(null)}>Cancel</button>
//                 </div>
//               ) : (
//                 <h3>{v.title}</h3>
//               )}

//               <p>{v.views || 0} views • {new Date(v.createdAt).toLocaleDateString()}</p>

//               <div className="action-buttons">
//                 <button onClick={() => { setEditId(v._id); setEditTitle(v.title); }}>✏ Edit</button>

//                 <label>
//                   🖼 New Thumb
//                   <input type="file" accept="image/*" onChange={(e) => replaceThumb(v._id, e.target.files[0])}/>
//                 </label>

//                 <label style={{ color: "red" }}>
//                   🎥 Replace Video
//                   <input type="file" accept="video/*" onChange={(e) => replaceVideoFile(v._id, e.target.files[0])}/>
//                 </label>

//                 <button style={{ background: "red" }} onClick={() => deleteVideo(v._id)}>🗑 Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✨ CSS (Minimal Theme for Now) */}
//       <style jsx>{`
//         .admin-dashboard { min-height: 100vh; background: #0f0f0f; color: white; padding: 20px; }
//         .upload-card, .video-manage-card { background: #1b1b1b; padding: 20px; border-radius: 10px; margin-bottom: 25px; }
//         .upload-form input, textarea, select { width: 100%; padding: 10px; margin-bottom: 10px; background: #111; border: 1px solid #333; color: white; border-radius: 6px; }
//         button { padding: 10px 16px; border-radius: 6px; background: #e50914; color: white; border: none; cursor: pointer; }
//         .videos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
//         img { width: 100%; border-radius: 10px; }
//         label input { display: none; }
//       `}</style>
//     </div>
//   );
// }


// import React, { useState, useContext, useEffect } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";

// export default function AdminDashboard() {
//   const { user } = useContext(AuthContext);
//   const token = localStorage.getItem("token");

//   // Upload states
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   // Management states
//   const [videos, setVideos] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   const categories = [
//     "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
//     "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
//     "Fashion", "Fitness", "Other"
//   ];

//   // Fetch all videos
//   const fetchVideos = async () => {
//     try {
//       const res = await api.get("/api/videos/all");
//       setVideos(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (user?.isAdmin) fetchVideos();
//   }, [user]);

//   // Admin guard
//   if (!user || !user.isAdmin) {
//     return (
//       <div className="unauthorized">
//         <div className="card">
//           <h2>Access Denied</h2>
//           <p>Only administrators can access this page.</p>
//         </div>
//       </div>
//     );
//   }

//   // Upload handler with progress
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!title || !category || !video || !thumbnail) {
//       alert("Please fill all required fields (Title, Category, Video, Thumbnail)");
//       return;
//     }

//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("category", category);
//     fd.append("description", description);
//     fd.append("tags", tags);
//     fd.append("video", video);
//     fd.append("thumbnail", thumbnail);

//     try {
//       setUploading(true);
//       setProgress(0);

//       await api.post("/api/videos/upload", fd, {
//         
//         onUploadProgress: (e) => {
//           setProgress(Math.round((e.loaded * 100) / e.total));
//         },
//       });

//       alert("Video uploaded successfully!");
//       resetForm();
//       fetchVideos();
//     } catch (err) {
//       alert("Upload failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setUploading(false);
//       setProgress(0);
//     }
//   };

//   const resetForm = () => {
//     setTitle(""); setCategory(""); setDescription(""); setTags("");
//     setVideo(null); setThumbnail(null);
//     document.getElementById("video-input").value = "";
//     document.getElementById("thumb-input").value = "";
//   };

//   // Delete video
//   const deleteVideo = async (id) => {
//     if (!window.confirm("Permanently delete this video? This cannot be undone.")) return;
//     try {
//       await api.delete(`/api/videos/delete/${id}`, {
//         
//       });
//       fetchVideos();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // Update title
//   const updateTitle = async () => {
//     if (!editTitle.trim()) return;
//     try {
//       await api.put(`/api/videos/update/${editId}`, { title: editTitle }, {
//         
//       });
//       setEditId(null);
//       fetchVideos();
//     } catch (err) {
//       alert("Update failed");
//     }
//   };

//   // Replace thumbnail
//   const replaceThumbnail = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("thumbnail", file);
//     await api.put(`/api/videos/update-thumbnail/${id}`, fd, {
//       
//     });
//     fetchVideos();
//   };

//   // Replace video file
//   const replaceVideo = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("video", file);
//     await api.put(`/api/videos/update-video/${id}`, fd, {
//       
//     });
//     fetchVideos();
//   };

//   return (
//     <div className="admin-dashboard">
//       {/* Header */}
//       <div className="header">
//         <h1>Admin Dashboard</h1>
//         <p>Upload and manage all videos</p>
//       </div>

//       {/* Upload Section */}
//       <div className="upload-section">
//         <div className="card">
//           <h2>Upload New Video</h2>
//           <form onSubmit={handleUpload} className="upload-form">
//             <div className="form-grid">
//               <input
//                 type="text"
//                 placeholder="Video Title *"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//               <select value={category} onChange={(e) => setCategory(e.target.value)} required>
//                 <option value="">Select Category *</option>
//                 {categories.map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>

//             <textarea
//               placeholder="Description (optional)"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={4}
//             />

//             <input
//               type="text"
//               placeholder="Tags (comma separated: gaming, tutorial, funny)"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//             />

//             <div className="file-inputs">
//               <label className="file-label">
//                 <input id="video-input" type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
//                 <span>{video ? video.name : "Choose Video File *"}</span>
//               </label>
//               <label className="file-label">
//                 <input id="thumb-input" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} required />
//                 <span>{thumbnail ? thumbnail.name : "Choose Thumbnail *"}</span>
//               </label>
//             </div>

//             <button type="submit" disabled={uploading} className="upload-btn">
//               {uploading ? `Uploading... ${progress}%` : "Upload Video"}
//             </button>

//             {uploading && (
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: `${progress}%` }}></div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>

//       {/* Video Management */}
//       <div className="management-section">
//         <h2>Manage Videos ({videos.length})</h2>
//         <div className="videos-grid">
//           {videos.map((v) => (
//             <div key={v._id} className="video-card">
//               <div className="thumbnail">
//                 <img src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`} alt={v.title} />
//                 <div className="duration">{v.duration || "0:00"}</div>
//               </div>

//               <div className="info">
//                 {editId === v._id ? (
//                   <div className="edit-mode">
//                     <input
//                       value={editTitle}
//                       onChange={(e) => setEditTitle(e.target.value)}
//                       autoFocus
//                     />
//                     <div className="edit-actions">
//                       <button onClick={updateTitle}>Save</button>
//                       <button onClick={() => setEditId(null)}>Cancel</button>
//                     </div>
//                   </div>
//                 ) : (
//                   <h3>{v.title}</h3>
//                 )}
//                 <p className="meta">
//                   {v.views || 0} views • {new Date(v.createdAt).toLocaleDateString()}
//                   <span className="category">{v.category}</span>
//                 </p>
//               </div>

//               <div className="actions">
//                 <button className="edit-btn" onClick={() => { setEditId(v._id); setEditTitle(v.title); }}>
//                   Edit Title
//                 </button>

//                 <label className="replace-btn">
//                   New Thumbnail
//                   <input type="file" accept="image/*" onChange={(e) => replaceThumbnail(v._id, e.target.files[0])} />
//                 </label>

//                 <label className="replace-btn warning">
//                   Replace Video
//                   <input type="file" accept="video/*" onChange={(e) => replaceVideo(v._id, e.target.files[0])} />
//                 </label>

//                 <button className="delete-btn" onClick={() => deleteVideo(v._id)}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Perfect YouTube Studio Style */}
//       <style jsx>{`
//         .admin-dashboard {
//           min-height: 100vh;
//           background: #0f0f0f;
//           color: #fff;
//           font-family: 'Roboto', 'Segoe UI', sans-serif;
//         }

//         .unauthorized {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           height: 100vh;
//           text-align: center;
//           background: #000;
//         }

//         .header {
//           padding: 40px 30px 20px;
//           background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
//           border-bottom: 1px solid #333;
//         }

//         .header h1 {
//           font-size: 32px;
//           font-weight: 700;
//           margin-bottom: 8px;
//         }

//         .header p {
//           color: #aaa;
//           font-size: 16px;
//         }

//         .upload-section, .management-section {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 30px;
//         }

//         .card {
//           background: #1a1a1a;
//           border-radius: 16px;
//           padding: 30px;
//           box-shadow: 0 8px 32px rgba(0,0,0,0.4);
//           border: 1px solid #333;
//         }

//         h2 {
//           font-size: 24px;
//           margin-bottom: 24px;
//           color: #fff;
//         }

//         .form-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 16px;
//           margin-bottom: 16px;
//         }

//         input, textarea, select {
//           width: 100%;
//           padding: 14px 16px;
//           background: #111;
//           border: 1px solid #333;
//           border-radius: 12px;
//           color: #fff;
//           font-size: 15px;
//           transition: all 0.2s;
//         }

//         input:focus, textarea:focus, select:focus {
//           outline: none;
//           border-color: #ff0033;
//           box-shadow: 0 0 0 3px rgba(255,0,51,0.2);
//         }

//         .file-inputs {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 16px;
//           margin: 20px 0;
//         }

//         .file-label {
//           display: block;
//         }

//         .file-label input {
//           display: none;
//         }

//         .file-label span {
//           display: block;
//           padding: 14px 16px;
//           background: #111;
//           border: 1px dashed #555;
//           border-radius: 12px;
//           text-align: center;
//           cursor: pointer;
//           transition: all 0.2s;
//           color: #ccc;
//         }

//         .file-label:hover span {
//           border-color: #ff0033;
//           background: #1a0f0f;
//           color: #ff0033;
//         }

//         .upload-btn {
//           width: 100%;
//           padding: 16px;
//           background: #ff003,0,51;
//           color: white;
//           border: none;
//           border-radius: 12px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//           margin-top: 10px;
//         }

//         .upload-btn:hover {
//           background: #e6002e;
//           transform: translateY(-2px);
//         }

//         .upload-btn:disabled {
//           background: #444;
//           cursor: not-allowed;
//         }

//         .progress-bar {
//           height: 8px;
//           background: #333;
//           border-radius: 4px;
//           overflow: hidden;
//           margin-top: 16px;
//         }

//         .progress-fill {
//           height: 100%;
//           background: linear-gradient(90deg, #ff0033, #ff6b6b);
//           width: 0;
//           transition: width 0.3s;
//         }

//         .videos-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
//           gap: 24px;
//           margin-top: 20px;
//         }

//         .video-card {
//           background: #1a1a1a;
//           border-radius: 16px;
//           overflow: hidden;
//           border: 1px solid #333;
//           transition: all 0.3s;
//         }

//         .video-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0,0,0,0.6);
//           border-color: #ff0033;
//         }

//         .thumbnail {
//           position: relative;
//         }

//         .thumbnail img {
//           width: 100%;
//           height: 200px;
//           object-fit: cover;
//         }

//         .duration {
//           position: absolute;
//           bottom: 8px;
//           right: 8px;
//           background: rgba(0,0,0,0.8);
//           padding: 4px 8px;
//           border-radius: 6px;
//           font-size: 12px;
//           font-weight: 500;
//         }

//         .info {
//           padding: 16px;
//         }

//         .info h3 {
//           font-size: 16px;
//           margin-bottom: 8px;
//           line-height: 1.4;
//         }

//         .meta {
//           font-size: 13px;
//           color: #aaa;
//         }

//         .category {
//           background: #ff0033;
//           color: white;
//           padding: 2px 8px;
//           border-radius: 12px;
//           font-size: 11px;
//           margin-left: 8px;
//         }

//         .actions {
//           padding: 0 16px 20px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//         }

//         .actions button, .actions label {
//           padding: 8px 12px;
//           border-radius: 8px;
//           font-size: 13px;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .edit-btn {
//           background: #272727;
//           color: #fff;
//           border: none;
//         }

//         .replace-btn {
//           background: #272727;
//           color: #3ea6ff;
//           border: none;
//         }

//         .replace-btn.warning {
//           color: #ff6b6b;
//         }

//         .replace-btn input { display: none; }

//         .delete-btn {
//           background: #8b0000;
//           color: white;
//           border: none;
//         }

//         .edit-mode input {
//           width: 100%;
//           padding: 10px;
//           background: #111;
//           border: 1px solid #ff0033;
//           border-radius: 8px;
//           color: white;
//           margin-bottom: 8px;
//         }

//         .edit-actions button {
//           padding: 6px 12px;
//           margin-right: 8px;
//           font-size: 12px;
//         }

//         @media (max-width: 768px) {
//           .form-grid, .file-inputs {
//             grid-template-columns: 1fr;
//           }
//           .videos-grid {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



// import React, { useState, useContext, useEffect } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import {
//   FiUpload, FiVideo, FiSettings, FiLogOut, FiEdit2, FiTrash2,
//   FiImage, FiPlayCircle, FiEye, FiThumbsUp, FiTrendingUp,
//   FiHome, FiMenu, FiX, FiSearch
// } from "react-icons/fi";
// import { MdDashboard, MdVideoLibrary, MdAnalytics } from "react-icons/md";

// export default function AdminDashboard() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Upload states
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   // Management states
//   const [videos, setVideos] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");

//   // UI states
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);

//   const categories = [
//     "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
//     "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
//     "Fashion", "Fitness", "Other"
//   ];

//   // Fetch all videos
//   const fetchVideos = async () => {
//     try {
//       const res = await api.get("/api/videos/all");
//       setVideos(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // Calculate analytics
//   const analytics = {
//     totalVideos: videos.length,
//     totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
//     totalLikes: videos.reduce((sum, v) => sum + (v.likes?.length || 0), 0),
//     avgViews: videos.length > 0 ? Math.round(videos.reduce((sum, v) => sum + (v.views || 0), 0) / videos.length) : 0
//   };

//   // Upload handler
//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       alert("⚠️ Please login first to upload videos");
//       navigate("/login");
//       return;
//     }

//     if (!title || !category || !video || !thumbnail) {
//       alert("Please fill all required fields");
//       return;
//     }

//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("category", category);
//     fd.append("description", description);
//     fd.append("tags", tags);
//     fd.append("video", video);
//     fd.append("thumbnail", thumbnail);

//     try {
//       setUploading(true);
//       setProgress(0);

//       await api.post("/api/ads/upload", fd, {
//         
//         onUploadProgress: (e) => {
//           setProgress(Math.round((e.loaded * 100) / e.total));
//         },
//       });

//       alert("✅ Video uploaded successfully!");
//       resetForm();
//       fetchVideos();
//       setActiveTab("videos");
//     } catch (err) {
//       alert("❌ Upload failed");
//     } finally {
//       setUploading(false);
//       setProgress(0);
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setCategory("");
//     setDescription("");
//     setTags("");
//     setVideo(null);
//     setThumbnail(null);
//     setVideoPreview(null);
//     setThumbnailPreview(null);
//     if (document.getElementById("video-input")) {
//       document.getElementById("video-input").value = "";
//     }
//     if (document.getElementById("thumb-input")) {
//       document.getElementById("thumb-input").value = "";
//     }
//   };

//   // Handle file selections with preview
//   const handleVideoSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setVideo(file);
//       setVideoPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleThumbnailSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnail(file);
//       setThumbnailPreview(URL.createObjectURL(file));
//     }
//   };

//   // Delete video
//   const deleteVideo = async (id) => {
//     if (!user) {
//       alert("⚠️ Please login first");
//       return;
//     }

//     if (!window.confirm("🗑️ Delete this video permanently?")) return;

//     try {
//       await api.delete(`/api/videos/delete/${id}`, {
//         
//       });
//       fetchVideos();
//       alert("✅ Video deleted successfully");
//     } catch (err) {
//       alert("❌ Delete failed");
//     }
//   };

//   // Update title
//   const updateTitle = async () => {
//     if (!user) {
//       alert("⚠️ Please login first");
//       return;
//     }

//     if (!editTitle.trim()) return;

//     try {
//       await api.put(
//         `/api/videos/update/${editId}`,
//         { title: editTitle },
//         {  }
//       );
//       setEditId(null);
//       fetchVideos();
//       alert("✅ Title updated");
//     } catch (err) {
//       alert("❌ Update failed");
//     }
//   };

//   // Replace thumbnail
//   const replaceThumbnail = async (id, file) => {
//     if (!user) {
//       alert("⚠️ Please login first");
//       return;
//     }

//     if (!file) return;

//     const fd = new FormData();
//     fd.append("thumbnail", file);

//     try {
//       await api.put(
//         `/api/videos/update-thumbnail/${id}`,
//         fd,
//         {  }
//       );
//       fetchVideos();
//       alert("✅ Thumbnail updated");
//     } catch (err) {
//       alert("❌ Update failed");
//     }
//   };

//   // Replace video
//   const replaceVideo = async (id, file) => {
//     if (!user) {
//       alert("⚠️ Please login first");
//       return;
//     }

//     if (!file) return;

//     const fd = new FormData();
//     fd.append("video", file);

//     try {
//       await api.put(
//         `/api/videos/update-video/${id}`,
//         fd,
//         {  }
//       );
//       fetchVideos();
//       alert("✅ Video updated");
//     } catch (err) {
//       alert("❌ Update failed");
//     }
//   };

//   // Filter videos
//   const filteredVideos = videos.filter(v => {
//     const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = filterCategory === "All" || v.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const formatNumber = (num) => {
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num;
//   };

//   return (
//     <div style={styles.container}>
//       {/* Sidebar */}
//       <aside style={{ ...styles.sidebar, width: sidebarOpen ? '260px' : '80px' }}>
//         <div style={styles.sidebarHeader}>
//           {sidebarOpen && (
//             <div style={styles.logo}>
//               <FiPlayCircle size={32} color="#667eea" />
//               <span style={styles.logoText}>MyTube Admin</span>
//             </div>
//           )}
//           <button 
//             style={styles.toggleBtn} 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//           </button>
//         </div>

//         <nav style={styles.nav}>
//           <button
//             style={{
//               ...styles.navItem,
//               background: activeTab === 'dashboard' ? 'rgba(102, 126, 234, 0.2)' : 'transparent'
//             }}
//             onClick={() => setActiveTab('dashboard')}
//           >
//             <MdDashboard size={22} />
//             {sidebarOpen && <span>Dashboard</span>}
//           </button>

//           {/* <button
//             style={{
//               ...styles.navItem,
//               background: activeTab === 'upload' ? 'rgba(102, 126, 234, 0.2)' : 'transparent'
//             }}
//             onClick={() => setActiveTab('upload')}
//           >
//             <FiUpload size={22} />
//             {sidebarOpen && <span>Upload</span>}
//           </button> */}

//           <button
//             style={{
//               ...styles.navItem,
//               background: activeTab === 'videos' ? 'rgba(102, 126, 234, 0.2)' : 'transparent'
//             }}
//             onClick={() => setActiveTab('videos')}
//           >
//             <MdVideoLibrary size={22} />
//             {sidebarOpen && <span>All Videos</span>}
//           </button>

//           <button style={styles.navItem} onClick={() => navigate("/admin/upload-ad")}>

//                 <FiSettings size={22} />
//                 {sidebarOpen && <span>Upload-Ad</span>}
//               </button>
//               <button style={styles.navItem} onClick={() => navigate("/revenue-dashboard")}>
//                 <FiSettings size={22} />
//                 {sidebarOpen && <span>revenue-dashboard</span>}
//               </button>
//               <button style={styles.navItem} onClick={() => navigate("/AdminMonetizationPanel")}>
//                 <FiSettings size={22} />
//                 {sidebarOpen && <span>AdminMonetizationPanel</span>}
//               </button>
//           <button
//             style={{
//               ...styles.navItem,
//               background: activeTab === 'analytics' ? 'rgba(102, 126, 234, 0.2)' : 'transparent'
//             }}
//             onClick={() => setActiveTab('analytics')}
//           >
//             <MdAnalytics size={22} />
//             {sidebarOpen && <span>Analytics</span>}
//           </button>

//           <div style={styles.divider}></div>

//           <button style={styles.navItem} onClick={() => navigate("/")}>
//             <FiHome size={22} />
//             {sidebarOpen && <span>Back to Home</span>}
//           </button>

//           {user ? (
//             <>
//               <button style={styles.navItem} onClick={() => navigate("/profile")}>
//                 <FiSettings size={22} />
//                 {sidebarOpen && <span>Settings</span>}
//               </button>

//               <button style={styles.navItem} onClick={logout}>
//                 <FiLogOut size={22} />
//                 {sidebarOpen && <span>Logout</span>}
//               </button>
//             </>
//           ) : (
//             <button style={styles.navItem} onClick={() => navigate("/login")}>
//               <FiLogOut size={22} />
//               {sidebarOpen && <span>Login</span>}
//             </button>

//           )}
//         </nav>

//         {sidebarOpen && user && (
//           <div style={styles.sidebarFooter}>
//             <div style={styles.userCard}>
//               <div style={styles.userAvatar}>
//                 {user?.name?.charAt(0).toUpperCase()}
//               </div>
//               <div>
//                 <div style={styles.userName}>{user?.name}</div>
//                 <div style={styles.userRole}>Admin User</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {sidebarOpen && !user && (
//           <div style={styles.sidebarFooter}>
//             <div style={styles.loginPrompt}>
//               <p style={styles.loginText}>Login to upload videos</p>
//               <button style={styles.loginBtn} onClick={() => navigate("/login")}>
//                 Sign In
//               </button>
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Main Content */}
//       <main style={{ ...styles.main, marginLeft: sidebarOpen ? '260px' : '80px' }}>
//         {/* Dashboard View */}
//         {activeTab === 'dashboard' && (
//           <div style={styles.content}>
//             <div style={styles.pageHeader}>
//               <div>
//                 <h1 style={styles.pageTitle}>Dashboard Overview</h1>
//                 <p style={styles.pageSubtitle}>
//                   {user ? `Welcome back, ${user.name}!` : "Public Dashboard - Login to manage content"}
//                 </p>
//               </div>
//             </div>

//             {/* Stats Cards */}
//             <div style={styles.statsGrid}>
//               <div style={styles.statCard}>
//                 <div style={styles.statIcon}>
//                   <FiVideo size={24} color="#667eea" />
//                 </div>
//                 <div>
//                   <div style={styles.statValue}>{analytics.totalVideos}</div>
//                   <div style={styles.statLabel}>Total Videos</div>
//                 </div>
//               </div>

//               <div style={styles.statCard}>
//                 <div style={styles.statIcon}>
//                   <FiEye size={24} color="#f093fb" />
//                 </div>
//                 <div>
//                   <div style={styles.statValue}>{formatNumber(analytics.totalViews)}</div>
//                   <div style={styles.statLabel}>Total Views</div>
//                 </div>
//               </div>

//               <div style={styles.statCard}>
//                 <div style={styles.statIcon}>
//                   <FiThumbsUp size={24} color="#4facfe" />
//                 </div>
//                 <div>
//                   <div style={styles.statValue}>{formatNumber(analytics.totalLikes)}</div>
//                   <div style={styles.statLabel}>Total Likes</div>
//                 </div>
//               </div>

//               <div style={styles.statCard}>
//                 <div style={styles.statIcon}>
//                   <FiTrendingUp size={24} color="#43e97b" />
//                 </div>
//                 <div>
//                   <div style={styles.statValue}>{formatNumber(analytics.avgViews)}</div>
//                   <div style={styles.statLabel}>Avg Views</div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Videos */}
//             <div style={styles.section}>
//               <h2 style={styles.sectionTitle}>Recent Uploads</h2>
//               <div style={styles.recentVideos}>
//                 {videos.slice(0, 5).map((v) => (
//                   <div key={v._id} style={styles.recentVideoCard}>
//                     <img 
//                       src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`} 
//                       alt={v.title}
//                       style={styles.recentVideoThumb}
//                     />
//                     <div style={styles.recentVideoInfo}>
//                       <h4 style={styles.recentVideoTitle}>{v.title}</h4>
//                       <div style={styles.recentVideoStats}>
//                         <span><FiEye size={14} /> {formatNumber(v.views || 0)} views</span>
//                         <span><FiThumbsUp size={14} /> {v.likes?.length || 0} likes</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Upload View */}
//         {activeTab === 'upload' && (
//           <div style={styles.content}>
//             <div style={styles.pageHeader}>
//               <h1 style={styles.pageTitle}>Upload New Video</h1>
//               <p style={styles.pageSubtitle}>
//                 {user ? "Share your content with the world" : "Login required to upload"}
//               </p>
//             </div>

//             {!user && (
//               <div style={styles.loginWarning}>
//                 <FiSettings size={32} color="#ffa500" />
//                 <h3>Login Required</h3>
//                 <p>You need to be logged in to upload videos</p>
//                 <button style={styles.warningBtn} onClick={() => navigate("/login")}>
//                   Go to Login
//                 </button>
//               </div>
//             )}

//             {user && (
//               <div style={styles.uploadCard}>
//                 <form onSubmit={handleUpload}>
//                   <div style={styles.formGrid}>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Video Title *</label>
//                       <input
//                         style={styles.input}
//                         placeholder="Enter video title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Category *</label>
//                       <select 
//                         style={styles.select}
//                         value={category} 
//                         onChange={(e) => setCategory(e.target.value)} 
//                         required
//                       >
//                         <option value="">Select Category</option>
//                         {categories.map((c) => (
//                           <option key={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Description</label>
//                     <textarea
//                       style={styles.textarea}
//                       placeholder="Describe your video"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       rows={4}
//                     />
//                   </div>

//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Tags</label>
//                     <input
//                       style={styles.input}
//                       placeholder="gaming, tutorial, funny (comma separated)"
//                       value={tags}
//                       onChange={(e) => setTags(e.target.value)}
//                     />
//                   </div>

//                   <div style={styles.uploadGrid}>
//                     <div style={styles.uploadBox}>
//                       <label style={styles.uploadLabel}>
//                         <input
//                           id="video-input"
//                           type="file"
//                           accept="video/*"
//                           onChange={handleVideoSelect}
//                           style={{ display: 'none' }}
//                         />
//                         <div style={styles.uploadContent}>
//                           {videoPreview ? (
//                             <video src={videoPreview} style={styles.preview} controls />
//                           ) : (
//                             <>
//                               <FiVideo size={48} color="#667eea" />
//                               <p style={styles.uploadText}>Upload Video</p>
//                               <p style={styles.uploadHint}>MP4, WebM, or OGG</p>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>

//                     <div style={styles.uploadBox}>
//                       <label style={styles.uploadLabel}>
//                         <input
//                           id="thumb-input"
//                           type="file"
//                           accept="image/*"
//                           onChange={handleThumbnailSelect}
//                           style={{ display: 'none' }}
//                         />
//                         <div style={styles.uploadContent}>
//                           {thumbnailPreview ? (
//                             <img src={thumbnailPreview} alt="Thumbnail" style={styles.preview} />
//                           ) : (
//                             <>
//                               <FiImage size={48} color="#667eea" />
//                               <p style={styles.uploadText}>Upload Thumbnail</p>
//                               <p style={styles.uploadHint}>JPG, PNG, or GIF</p>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>
//                   </div>

//                   {uploading && (
//                     <div style={styles.progressContainer}>
//                       <div style={styles.progressBar}>
//                         <div style={{ ...styles.progressFill, width: `${progress}%` }} />
//                       </div>
//                       <p style={styles.progressText}>Uploading... {progress}%</p>
//                     </div>
//                   )}

//                   <div style={styles.formActions}>
//                     <button type="button" style={styles.cancelBtn} onClick={resetForm}>
//                       Reset
//                     </button>
//                     <button type="submit" style={styles.submitBtn} disabled={uploading}>
//                       <FiUpload size={20} />
//                       {uploading ? 'Uploading...' : 'Upload Video'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Videos View */}
//         {activeTab === 'videos' && (
//           <div style={styles.content}>
//             <div style={styles.pageHeader}>
//               <div>
//                 <h1 style={styles.pageTitle}>All Videos</h1>
//                 <p style={styles.pageSubtitle}>{filteredVideos.length} videos found</p>
//               </div>
//             </div>

//             {/* Filters */}
//             <div style={styles.filters}>
//               <div style={styles.searchBox}>
//                 <FiSearch size={20} color="#888" />
//                 <input
//                   style={styles.searchInput}
//                   placeholder="Search videos..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>

//               <select 
//                 style={styles.filterSelect}
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//               >
//                 <option value="All">All Categories</option>
//                 {categories.map((c) => (
//                   <option key={c}>{c}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Videos Grid */}
//             <div style={styles.videosGrid}>
//               {filteredVideos.map((v) => (
//                 <div key={v._id} style={styles.videoCard}>
//                   <div style={styles.videoThumbContainer}>
//                     <img
//                       src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                       alt={v.title}
//                       style={styles.videoThumb}
//                     />
//                     <div style={styles.videoOverlay}>
//                       <button
//                         style={styles.overlayBtn}
//                         onClick={() => window.open(`/watch/${v.filename}`, '_blank')}
//                       >
//                         <FiPlayCircle size={20} />
//                       </button>
//                     </div>
//                   </div>

//                   <div style={styles.videoCardContent}>
//                     {editId === v._id ? (
//                       <div style={styles.editMode}>
//                         <input
//                           style={styles.editInput}
//                           value={editTitle}
//                           onChange={(e) => setEditTitle(e.target.value)}
//                         />
//                         <div style={styles.editActions}>
//                           <button style={styles.saveBtn} onClick={updateTitle}>
//                             Save
//                           </button>
//                           <button style={styles.cancelEditBtn} onClick={() => setEditId(null)}>
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <h3 style={styles.videoCardTitle}>{v.title}</h3>
//                     )}

//                     <div style={styles.videoMeta}>
//                       <span style={styles.videoBadge}>{v.category}</span>
//                       <span style={styles.videoStats}>
//                         <FiEye size={14} /> {formatNumber(v.views || 0)}
//                       </span>
//                       <span style={styles.videoStats}>
//                         <FiThumbsUp size={14} /> {v.likes?.length || 0}
//                       </span>
//                     </div>

//                     {user && (
//                       <div style={styles.videoActions}>
//                         <button
//                           style={styles.actionBtn}
//                           onClick={() => { setEditId(v._id); setEditTitle(v.title); }}
//                         >
//                           <FiEdit2 size={16} /> Edit
//                         </button>

//                         <label style={styles.actionBtn}>
//                           <FiImage size={16} /> Thumbnail
//                           <input
//                             type="file"
//                             hidden
//                             accept="image/*"
//                             onChange={(e) => replaceThumbnail(v._id, e.target.files[0])}
//                           />
//                         </label>

//                         <label style={styles.actionBtn}>
//                           <FiVideo size={16} /> Replace
//                           <input
//                             type="file"
//                             hidden
//                             accept="video/*"
//                             onChange={(e) => replaceVideo(v._id, e.target.files[0])}
//                           />
//                         </label>

//                         <button
//                           style={styles.deleteBtn}
//                           onClick={() => deleteVideo(v._id)}
//                         >
//                           <FiTrash2 size={16} /> Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredVideos.length === 0 && (
//               <div style={styles.emptyState}>
//                 <FiVideo size={64} color="#666" />
//                 <h3 style={styles.emptyTitle}>No videos found</h3>
//                 <p style={styles.emptyText}>
//                   {searchQuery || filterCategory !== "All"
//                     ? "Try adjusting your filters"
//                     : "No videos uploaded yet"}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Analytics View */}
//         {activeTab === 'analytics' && (
//           <div style={styles.content}>
//             <div style={styles.pageHeader}>
//               <h1 style={styles.pageTitle}>Analytics</h1>
//               <p style={styles.pageSubtitle}>Platform performance overview</p>
//             </div>

//             <div style={styles.analyticsGrid}>
//               <div style={styles.analyticsCard}>
//                 <h3 style={styles.analyticsTitle}>Top Performing Videos</h3>
//                 <div style={styles.topVideos}>
//                   {videos
//                     .sort((a, b) => (b.views || 0) - (a.views || 0))
//                     .slice(0, 5)
//                     .map((v, i) => (
//                       <div key={v._id} style={styles.topVideoItem}>
//                         <span style={styles.rank}>#{i + 1}</span>
//                         <img
//                           src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                           alt={v.title}
//                           style={styles.topVideoThumb}
//                         />
//                         <div style={styles.topVideoInfo}>
//                           <div style={styles.topVideoTitle}>{v.title}</div>
//                           <div style={styles.topVideoViews}>
//                             {formatNumber(v.views || 0)} views
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>

//               <div style={styles.analyticsCard}>
//                 <h3 style={styles.analyticsTitle}>Category Distribution</h3>
//                 <div style={styles.categoryList}>
//                   {categories.map((cat) => {
//                     const count = videos.filter(v => v.category === cat).length;
//                     if (count === 0) return null;
//                     return (
//                       <div key={cat} style={styles.categoryItem}>
//                         <span style={styles.categoryName}>{cat}</span>
//                         <div style={styles.categoryBar}>
//                           <div
//                             style={{
//                               ...styles.categoryBarFill,
//                               width: `${(count / videos.length) * 100}%`
//                             }}
//                           />
//                         </div>
//                         <span style={styles.categoryCount}>{count}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: 'flex',
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
//     color: '#fff',
//     fontFamily: "'Inter', sans-serif",
//   },
//   sidebar: {
//     position: 'fixed',
//     left: 0,
//     top: 0,
//     height: '100vh',
//     background: 'rgba(20, 20, 40, 0.95)',
//     backdropFilter: 'blur(20px)',
//     borderRight: '1px solid rgba(255, 255, 255, 0.1)',
//     display: 'flex',
//     flexDirection: 'column',
//     transition: 'width 0.3s ease',
//     zIndex: 1000,
//   },
//   sidebarHeader: {
//     padding: '24px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
//   },
//   logo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//   },
//   logoText: {
//     fontSize: '20px',
//     fontWeight: '700',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//   },
//   toggleBtn: {
//     background: 'rgba(255, 255, 255, 0.1)',
//     border: 'none',
//     borderRadius: '8px',
//     padding: '8px',
//     color: '#fff',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'all 0.3s',
//   },
//   nav: {
//     flex: 1,
//     padding: '24px 12px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     overflowY: 'auto',
//   },
//   navItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '14px 16px',
//     background: 'transparent',
//     border: 'none',
//     borderRadius: '12px',
//     color: 'rgba(255, 255, 255, 0.8)',
//     cursor: 'pointer',
//     fontSize: '15px',
//     fontWeight: '500',
//     transition: 'all 0.3s',
//     textAlign: 'left',
//   },
//   divider: {
//     height: '1px',
//     background: 'rgba(255, 255, 255, 0.1)',
//     margin: '16px 0',
//   },
//   sidebarFooter: {
//     padding: '24px',
//     borderTop: '1px solid rgba(255, 255, 255, 0.1)',
//   },
//   userCard: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//   },
//   userAvatar: {
//     width: '40px',
//     height: '40px',
//     borderRadius: '50%',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '18px',
//     fontWeight: '700',
//   },
//   userName: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#fff',
//   },
//   userRole: {
//     fontSize: '12px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   loginPrompt: {
//     textAlign: 'center',
//   },
//   loginText: {
//     fontSize: '14px',
//     color: 'rgba(255, 255, 255, 0.7)',
//     marginBottom: '12px',
//   },
//   loginBtn: {
//     width: '100%',
//     padding: '12px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '8px',
//     color: '#fff',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//   },
//   main: {
//     flex: 1,
//     transition: 'margin-left 0.3s ease',
//   },
//   content: {
//     padding: '40px',
//     maxWidth: '1400px',
//     margin: '0 auto',
//     animation: 'fadeIn 0.5s ease',
//   },
//   pageHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '40px',
//   },
//   pageTitle: {
//     fontSize: '32px',
//     fontWeight: '800',
//     background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     marginBottom: '8px',
//   },
//   pageSubtitle: {
//     fontSize: '16px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   loginWarning: {
//     textAlign: 'center',
//     padding: '60px 20px',
//     background: 'rgba(255, 165, 0, 0.1)',
//     borderRadius: '16px',
//     border: '1px solid rgba(255, 165, 0, 0.3)',
//   },
//   warningBtn: {
//     marginTop: '20px',
//     padding: '14px 32px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '16px',
//     fontWeight: '700',
//     cursor: 'pointer',
//   },
//   statsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//     gap: '24px',
//     marginBottom: '40px',
//   },
//   statCard: {
//     background: 'rgba(255, 255, 255, 0.05)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '16px',
//     padding: '24px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     transition: 'all 0.3s',
//   },
//   statIcon: {
//     width: '56px',
//     height: '56px',
//     borderRadius: '12px',
//     background: 'rgba(255, 255, 255, 0.1)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   statValue: {
//     fontSize: '28px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '4px',
//   },
//   statLabel: {
//     fontSize: '14px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   section: {
//     marginBottom: '40px',
//   },
//   sectionTitle: {
//     fontSize: '22px',
//     fontWeight: '700',
//     marginBottom: '24px',
//     color: '#fff',
//   },
//   recentVideos: {
//     display: 'grid',
//     gap: '16px',
//   },
//   recentVideoCard: {
//     display: 'flex',
//     gap: '16px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: '12px',
//     padding: '16px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     transition: 'all 0.3s',
//   },
//   recentVideoThumb: {
//     width: '120px',
//     height: '68px',
//     borderRadius: '8px',
//     objectFit: 'cover',
//   },
//   recentVideoInfo: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   recentVideoTitle: {
//     fontSize: '15px',
//     fontWeight: '600',
//     color: '#fff',
//     marginBottom: '8px',
//   },
//   recentVideoStats: {
//     display: 'flex',
//     gap: '16px',
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   uploadCard: {
//     background: 'rgba(255, 255, 255, 0.05)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '20px',
//     padding: '40px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//   },
//   formGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '24px',
//     marginBottom: '24px',
//   },
//   formGroup: {
//     marginBottom: '24px',
//   },
//   label: {
//     display: 'block',
//     fontSize: '14px',
//     fontWeight: '600',
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginBottom: '8px',
//   },
//   input: {
//     width: '100%',
//     padding: '14px 16px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     outline: 'none',
//     transition: 'all 0.3s',
//   },
//   select: {
//     width: '100%',
//     padding: '14px 16px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     outline: 'none',
//     cursor: 'pointer',
//   },
//   textarea: {
//     width: '100%',
//     padding: '14px 16px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     outline: 'none',
//     resize: 'vertical',
//     fontFamily: 'inherit',
//   },
//   uploadGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '24px',
//     marginBottom: '24px',
//   },
//   uploadBox: {
//     aspectRatio: '16/9',
//     borderRadius: '12px',
//     border: '2px dashed rgba(102, 126, 234, 0.5)',
//     background: 'rgba(102, 126, 234, 0.05)',
//     overflow: 'hidden',
//   },
//   uploadLabel: {
//     display: 'block',
//     width: '100%',
//     height: '100%',
//     cursor: 'pointer',
//   },
//   uploadContent: {
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '12px',
//   },
//   uploadText: {
//     fontSize: '16px',
//     fontWeight: '600',
//     color: '#fff',
//   },
//   uploadHint: {
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   preview: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
//   progressContainer: {
//     marginBottom: '24px',
//   },
//   progressBar: {
//     width: '100%',
//     height: '8px',
//     background: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: '4px',
//     overflow: 'hidden',
//     marginBottom: '8px',
//   },
//   progressFill: {
//     height: '100%',
//     background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//     transition: 'width 0.3s ease',
//   },
//   progressText: {
//     fontSize: '14px',
//     color: 'rgba(255, 255, 255, 0.8)',
//     textAlign: 'center',
//   },
//   formActions: {
//     display: 'flex',
//     gap: '16px',
//     justifyContent: 'flex-end',
//   },
//   cancelBtn: {
//     padding: '14px 32px',
//     background: 'rgba(255, 255, 255, 0.1)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s',
//   },
//   submitBtn: {
//     padding: '14px 32px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: '700',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     transition: 'all 0.3s',
//   },
//   filters: {
//     display: 'flex',
//     gap: '16px',
//     marginBottom: '32px',
//   },
//   searchBox: {
//     flex: 1,
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '12px 20px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     borderRadius: '12px',
//   },
//   searchInput: {
//     flex: 1,
//     background: 'transparent',
//     border: 'none',
//     color: '#fff',
//     fontSize: '15px',
//     outline: 'none',
//   },
//   filterSelect: {
//     padding: '12px 20px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     cursor: 'pointer',
//     outline: 'none',
//   },
//   videosGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
//     gap: '24px',
//   },
//   videoCard: {
//     background: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: '16px',
//     overflow: 'hidden',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     transition: 'all 0.3s',
//   },
//   videoThumbContainer: {
//     position: 'relative',
//     aspectRatio: '16/9',
//     overflow: 'hidden',
//   },
//   videoThumb: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
//   videoOverlay: {
//     position: 'absolute',
//     inset: 0,
//     background: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     opacity: 0,
//     transition: 'opacity 0.3s',
//   },
//   overlayBtn: {
//     padding: '12px',
//     background: 'rgba(255, 255, 255, 0.2)',
//     border: 'none',
//     borderRadius: '50%',
//     color: '#fff',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   videoCardContent: {
//     padding: '16px',
//   },
//   videoCardTitle: {
//     fontSize: '16px',
//     fontWeight: '600',
//     color: '#fff',
//     marginBottom: '12px',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     display: '-webkit-box',
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: 'vertical',
//   },
//   videoMeta: {
//     display: 'flex',
//     gap: '12px',
//     alignItems: 'center',
//     marginBottom: '16px',
//     fontSize: '13px',
//   },
//   videoBadge: {
//     padding: '4px 10px',
//     background: 'rgba(102, 126, 234, 0.2)',
//     borderRadius: '6px',
//     color: '#667eea',
//     fontSize: '12px',
//     fontWeight: '600',
//   },
//   videoStats: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   videoActions: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '8px',
//   },
//   actionBtn: {
//     padding: '8px 14px',
//     background: 'rgba(255, 255, 255, 0.1)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     borderRadius: '8px',
//     color: '#fff',
//     fontSize: '13px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     transition: 'all 0.3s',
//   },
//   deleteBtn: {
//     padding: '8px 14px',
//     background: 'rgba(255, 0, 0, 0.1)',
//     border: '1px solid rgba(255, 0, 0, 0.3)',
//     borderRadius: '8px',
//     color: '#ff4444',
//     fontSize: '13px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     transition: 'all 0.3s',
//   },
//   editMode: {
//     marginBottom: '12px',
//   },
//   editInput: {
//     width: '100%',
//     padding: '10px 12px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     borderRadius: '8px',
//     color: '#fff',
//     fontSize: '15px',
//     marginBottom: '8px',
//     outline: 'none',
//   },
//   editActions: {
//     display: 'flex',
//     gap: '8px',
//   },
//   saveBtn: {
//     padding: '8px 16px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '8px',
//     color: '#fff',
//     fontSize: '13px',
//     fontWeight: '600',
//     cursor: 'pointer',
//   },
//   cancelEditBtn: {
//     padding: '8px 16px',
//     background: 'rgba(255, 255, 255, 0.1)',
//     border: 'none',
//     borderRadius: '8px',
//     color: '#fff',
//     fontSize: '13px',
//     fontWeight: '600',
//     cursor: 'pointer',
//   },
//   emptyState: {
//     padding: '80px 20px',
//     textAlign: 'center',
//   },
//   emptyTitle: {
//     fontSize: '24px',
//     fontWeight: '700',
//     color: '#fff',
//     marginTop: '24px',
//     marginBottom: '8px',
//   },
//   emptyText: {
//     fontSize: '16px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   analyticsGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '24px',
//   },
//   analyticsCard: {
//     background: 'rgba(255, 255, 255, 0.05)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '16px',
//     padding: '24px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//   },
//   analyticsTitle: {
//     fontSize: '18px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '24px',
//   },
//   topVideos: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   topVideoItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//     padding: '12px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: '12px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//   },
//   rank: {
//     fontSize: '18px',
//     fontWeight: '700',
//     color: '#667eea',
//     minWidth: '32px',
//   },
//   topVideoThumb: {
//     width: '80px',
//     height: '45px',
//     borderRadius: '8px',
//     objectFit: 'cover',
//   },
//   topVideoInfo: {
//     flex: 1,
//     minWidth: 0,
//   },
//   topVideoTitle: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#fff',
//     marginBottom: '4px',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     whiteSpace: 'nowrap',
//   },
//   topVideoViews: {
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
//   categoryList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   categoryItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//   },
//   categoryName: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#fff',
//     minWidth: '100px',
//   },
//   categoryBar: {
//     flex: 1,
//     height: '8px',
//     background: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: '4px',
//     overflow: 'hidden',
//   },
//   categoryBarFill: {
//     height: '100%',
//     background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//     transition: 'width 0.3s ease',
//   },
//   categoryCount: {
//     fontSize: '14px',
//     fontWeight: '700',
//     color: '#667eea',
//     minWidth: '32px',
//     textAlign: 'right',
//   },
// };

import React, { useState, useContext, useEffect } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiUpload, FiVideo, FiSettings, FiLogOut, FiEdit2, FiTrash2,
  FiPlayCircle, FiEye, FiThumbsUp, FiTrendingUp,
  FiHome, FiMenu, FiX, FiSearch, FiDownload,
  FiDollarSign, FiMousePointer, FiBarChart2, FiActivity,
  FiUsers, FiCheckCircle, FiClock, FiRefreshCw,
  FiPieChart, FiTarget, FiAlertCircle, FiZap, FiPercent
} from "react-icons/fi";
import { MdDashboard, MdVideoLibrary, MdAnalytics } from "react-icons/md";

export default function AdvancedAdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ==================== STATE MANAGEMENT ====================

  // UI States
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Data States
  const [videos, setVideos] = useState([]);
  const [ads, setAds] = useState([]);
  const [creators, setCreators] = useState([]);
  const [revenueData, setRevenueData] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateRange, setDateRange] = useState("all"); // all, today, week, month
  const [sortBy, setSortBy] = useState("recent"); // recent, views, revenue, engagement

  // Upload States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Edit States
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const categories = [
    "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
    "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
    "Fashion", "Fitness", "Other"
  ];

  // ==================== DATA FETCHING ====================

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchVideos(),
      fetchAds(),
      fetchCreators(),
      fetchRevenueData()
    ]);
    setLoading(false);
  };

  const fetchVideos = async () => {
    try {
      const res = await api.get("/api/videos/all");
      // res.data now contains { videos, total, page ... } due to pagination
      setVideos(Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setVideos([]);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await api.get("/api/ads");
      setAds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      setAds([]);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await api.get("/api/monetization/admin/creators");
      setCreators(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch creators:", err);
      setCreators([]);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const res = await api.get("/api/ads/dashboard/revenue", {

      });
      setRevenueData(res.data);
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  // ==================== ANALYTICS CALCULATIONS ====================

  const calculateMetrics = () => {
    const videoList = Array.isArray(videos) ? videos : [];
    const totalVideos = videoList.length;
    const totalViews = videoList.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalLikes = videoList.reduce((sum, v) => sum + (v.likes?.length || 0), 0);
    const avgViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;

    const adList = Array.isArray(ads) ? ads : [];
    const creatorList = Array.isArray(creators) ? creators : [];

    const totalAds = adList.length;
    const activeAds = adList.filter(a => a.active).length;
    const totalAdViews = adList.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalAdClicks = adList.reduce((sum, a) => sum + (a.clicks || 0), 0);
    const avgCTR = totalAdViews > 0 ? ((totalAdClicks / totalAdViews) * 100).toFixed(2) : 0;

    const totalRevenue = revenueData?.overview?.totalRevenue || 0;
    const pendingPayouts = creatorList.reduce((sum, c) => sum + (c.earnings?.pendingBalance || 0), 0);

    const approvedCreators = creatorList.filter(c => c.monetizationStatus === "approved").length;
    const pendingCreators = creatorList.filter(c => c.monetizationStatus === "pending").length;

    // Growth calculations (mock - in production, compare with previous period)
    const viewsGrowth = 12.5;
    const revenueGrowth = 8.3;
    const creatorsGrowth = 15.7;

    return {
      videos: { total: totalVideos, views: totalViews, likes: totalLikes, avgViews, growth: viewsGrowth },
      ads: { total: totalAds, active: activeAds, views: totalAdViews, clicks: totalAdClicks, ctr: avgCTR },
      revenue: { total: totalRevenue, pending: pendingPayouts, growth: revenueGrowth },
      creators: { total: creatorList.length, approved: approvedCreators, pending: pendingCreators, growth: creatorsGrowth },
      engagement: {
        rate: totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : 0,
        avgWatchTime: "8:32", // Mock - get from backend
        retention: "68%" // Mock - get from backend
      }
    };
  };

  const metrics = calculateMetrics();

  // ==================== VIDEO MANAGEMENT ====================

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("⚠️ Please login first to upload videos");
      navigate("/login");
      return;
    }

    if (!title || !category || !video || !thumbnail) {
      alert("Please fill all required fields");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("description", description);
    fd.append("tags", tags);
    fd.append("video", video);
    fd.append("thumbnail", thumbnail);

    try {
      setUploading(true);
      setProgress(0);

      await api.post("/api/ads/upload", fd, {

        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      alert("✅ Video uploaded successfully!");
      resetForm();
      fetchVideos();
      setActiveTab("videos");
    } catch (err) {
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setTags("");
    setVideo(null);
    setThumbnail(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    if (document.getElementById("video-input")) {
      document.getElementById("video-input").value = "";
    }
    if (document.getElementById("thumb-input")) {
      document.getElementById("thumb-input").value = "";
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const deleteVideo = async (id) => {
    if (!user) {
      alert("⚠️ Please login first");
      return;
    }

    if (!window.confirm("🗑️ Delete this video permanently?")) return;

    try {
      await api.delete(`/api/videos/delete/${id}`, {

      });
      fetchVideos();
      alert("✅ Video deleted successfully");
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  const updateTitle = async () => {
    if (!user) {
      alert("⚠️ Please login first");
      return;
    }

    if (!editTitle.trim()) return;

    try {
      await api.put(
        `/api/videos/update/${editId}`,
        { title: editTitle },
        {}
      );
      setEditId(null);
      fetchVideos();
      alert("✅ Title updated");
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  // ==================== FILTERING & SORTING ====================

  const filteredVideos = videos
    .filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || v.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return (b.views || 0) - (a.views || 0);
        case "revenue":
          return 0; // Implement revenue sorting
        case "engagement":
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // ==================== HELPERS ====================

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  const formatCurrency = (amount) => {
    return "₹" + (amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? "#10b981" : "#ef4444";
  };

  // ==================== RENDER ====================

  if (loading && videos.length === 0) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingSpinner}>
          <div className="spinner"></div>
          <p style={styles.loadingText}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarOpen ? '280px' : '80px',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(0)'
      }}>
        <div style={styles.sidebarHeader}>
          {sidebarOpen && (
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <FiZap size={28} />
              </div>
              <div>
                <div style={styles.logoText}>AdminHub</div>
                <div style={styles.logoSubtext}>Pro Analytics</div>
              </div>
            </div>
          )}
          <button
            style={styles.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navSection}>
            {sidebarOpen && <div style={styles.navSectionTitle}>Main</div>}

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'overview' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'overview' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('overview')}
            >
              <MdDashboard size={22} />
              {sidebarOpen && <span>Overview</span>}
              {activeTab === 'overview' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'analytics' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'analytics' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('analytics')}
            >
              <MdAnalytics size={22} />
              {sidebarOpen && <span>Analytics</span>}
              {activeTab === 'analytics' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'videos' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'videos' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('videos')}
            >
              <MdVideoLibrary size={22} />
              {sidebarOpen && <span>Videos</span>}
              {activeTab === 'videos' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'ads' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'ads' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('ads')}
            >
              <FiTarget size={22} />
              {sidebarOpen && <span>Advertisements</span>}
              {activeTab === 'ads' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'revenue' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'revenue' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('revenue')}
            >
              <FiDollarSign size={22} />
              {sidebarOpen && <span>Revenue</span>}
              {activeTab === 'revenue' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'creators' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'creators' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('creators')}
            >
              <FiUsers size={22} />
              {sidebarOpen && <span>Creators</span>}
              {activeTab === 'creators' && <div style={styles.activeIndicator}></div>}
            </button>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.navSection}>
            {sidebarOpen && <div style={styles.navSectionTitle}>System</div>}

            <button style={styles.navItem} onClick={() => navigate("/")}>
              <FiHome size={22} />
              {sidebarOpen && <span>Home</span>}
            </button>

            {user ? (
              <>
                <button style={styles.navItem} onClick={() => navigate("/profile")}>
                  <FiSettings size={22} />
                  {sidebarOpen && <span>Settings</span>}
                </button>
                <button style={styles.navItem} onClick={logout}>
                  <FiLogOut size={22} />
                  {sidebarOpen && <span>Logout</span>}
                </button>
              </>
            ) : (
              <button style={styles.navItem} onClick={() => navigate("/login")}>
                <FiLogOut size={22} />
                {sidebarOpen && <span>Login</span>}
              </button>
            )}
          </div>
        </nav>

        {sidebarOpen && user && (
          <div style={styles.sidebarFooter}>
            <div style={styles.userCard}>
              <div style={styles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user?.name}</div>
                <div style={styles.userRole}>Administrator</div>
              </div>
              <div style={styles.userStatus}></div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        marginLeft: sidebarOpen ? '280px' : '80px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <h1 style={styles.pageTitle}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'analytics' && 'Advanced Analytics'}
              {activeTab === 'videos' && 'Video Management'}
              {activeTab === 'ads' && 'Ad Management'}
              {activeTab === 'revenue' && 'Revenue Dashboard'}
              {activeTab === 'creators' && 'Creator Management'}
            </h1>
            <div style={styles.breadcrumb}>
              <span>Admin</span>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span style={styles.breadcrumbActive}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </div>
          </div>

          <div style={styles.topBarRight}>
            <button
              style={styles.refreshButton}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw size={18} className={refreshing ? 'spinning' : ''} />
              {!refreshing && <span>Refresh</span>}
            </button>

            <button style={styles.exportButton}>
              <FiDownload size={18} />
              <span>Export</span>
            </button>

            <div style={styles.notificationBadge}>
              <FiAlertCircle size={20} />
              {metrics.creators.pending > 0 && (
                <span style={styles.badge}>{metrics.creators.pending}</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.content}>
          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === 'overview' && (
            <>
              {/* Key Metrics Grid */}
              <div style={styles.metricsGrid}>
                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-purple">
                      <FiVideo size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <FiTrendingUp size={16} color={getGrowthColor(metrics.videos.growth)} />
                      <span style={{ color: getGrowthColor(metrics.videos.growth) }}>
                        {metrics.videos.growth}%
                      </span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{formatNumber(metrics.videos.total)}</div>
                  <div style={styles.metricLabel}>Total Videos</div>
                  <div style={styles.metricFooter}>
                    <span>{formatNumber(metrics.videos.views)} views</span>
                    <span>•</span>
                    <span>{formatNumber(metrics.videos.likes)} likes</span>
                  </div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-green">
                      <FiDollarSign size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <FiTrendingUp size={16} color={getGrowthColor(metrics.revenue.growth)} />
                      <span style={{ color: getGrowthColor(metrics.revenue.growth) }}>
                        {metrics.revenue.growth}%
                      </span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{formatCurrency(metrics.revenue.total)}</div>
                  <div style={styles.metricLabel}>Total Revenue</div>
                  <div style={styles.metricFooter}>
                    <span>{formatCurrency(metrics.revenue.pending)} pending</span>
                  </div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-blue">
                      <FiTarget size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <span style={{ color: '#667eea' }}>{metrics.ads.ctr}%</span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{metrics.ads.active}/{metrics.ads.total}</div>
                  <div style={styles.metricLabel}>Active Ads</div>
                  <div style={styles.metricFooter}>
                    <span>{formatNumber(metrics.ads.views)} views</span>
                    <span>•</span>
                    <span>{formatNumber(metrics.ads.clicks)} clicks</span>
                  </div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-orange">
                      <FiUsers size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <FiTrendingUp size={16} color={getGrowthColor(metrics.creators.growth)} />
                      <span style={{ color: getGrowthColor(metrics.creators.growth) }}>
                        {metrics.creators.growth}%
                      </span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{metrics.creators.total}</div>
                  <div style={styles.metricLabel}>Total Creators</div>
                  <div style={styles.metricFooter}>
                    <span>{metrics.creators.approved} approved</span>
                    <span>•</span>
                    <span>{metrics.creators.pending} pending</span>
                  </div>
                </div>
              </div>

              {/* Performance Overview */}
              <div style={styles.performanceSection}>
                <div style={styles.performanceCard}>
                  <h3 style={styles.sectionTitle}>
                    <FiBarChart2 size={20} />
                    Performance Metrics
                  </h3>
                  <div style={styles.performanceGrid}>
                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiEye size={18} />
                        <span>Avg Views/Video</span>
                      </div>
                      <div style={styles.performanceValue}>{formatNumber(metrics.videos.avgViews)}</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: '75%', background: '#667eea' }}></div>
                      </div>
                    </div>

                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiMousePointer size={18} />
                        <span>Ad CTR</span>
                      </div>
                      <div style={styles.performanceValue}>{metrics.ads.ctr}%</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: `${metrics.ads.ctr * 10}%`, background: '#10b981' }}></div>
                      </div>
                    </div>

                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiThumbsUp size={18} />
                        <span>Engagement Rate</span>
                      </div>
                      <div style={styles.performanceValue}>{metrics.engagement.rate}%</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: `${metrics.engagement.rate * 2}%`, background: '#f59e0b' }}></div>
                      </div>
                    </div>

                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiActivity size={18} />
                        <span>Avg Watch Time</span>
                      </div>
                      <div style={styles.performanceValue}>{metrics.engagement.avgWatchTime}</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: '68%', background: '#8b5cf6' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.alertsCard}>
                  <h3 style={styles.sectionTitle}>
                    <FiAlertCircle size={20} />
                    System Alerts
                  </h3>
                  <div style={styles.alertsList}>
                    {metrics.creators.pending > 0 && (
                      <div style={styles.alertItem}>
                        <div style={styles.alertIcon} className="alert-warning">
                          <FiClock size={18} />
                        </div>
                        <div style={styles.alertContent}>
                          <div style={styles.alertTitle}>Pending Creator Applications</div>
                          <div style={styles.alertText}>
                            {metrics.creators.pending} creators waiting for approval
                          </div>
                        </div>
                        <button
                          style={styles.alertButton}
                          onClick={() => setActiveTab('creators')}
                        >
                          Review
                        </button>
                      </div>
                    )}

                    {metrics.revenue.pending > 1000 && (
                      <div style={styles.alertItem}>
                        <div style={styles.alertIcon} className="alert-info">
                          <FiDollarSign size={18} />
                        </div>
                        <div style={styles.alertContent}>
                          <div style={styles.alertTitle}>Pending Payouts</div>
                          <div style={styles.alertText}>
                            {formatCurrency(metrics.revenue.pending)} awaiting payout
                          </div>
                        </div>
                        <button
                          style={styles.alertButton}
                          onClick={() => setActiveTab('revenue')}
                        >
                          Process
                        </button>
                      </div>
                    )}

                    <div style={styles.alertItem}>
                      <div style={styles.alertIcon} className="alert-success">
                        <FiCheckCircle size={18} />
                      </div>
                      <div style={styles.alertContent}>
                        <div style={styles.alertTitle}>All Systems Operational</div>
                        <div style={styles.alertText}>
                          Platform running smoothly
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={styles.activitySection}>
                <h3 style={styles.sectionTitle}>
                  <FiActivity size={20} />
                  Recent Activity
                </h3>
                <div style={styles.activityGrid}>
                  {videos.slice(0, 5).map((v) => (
                    <div key={v._id} style={styles.activityCard}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                        alt={v.title}
                        style={styles.activityThumb}
                      />
                      <div style={styles.activityInfo}>
                        <div style={styles.activityTitle}>{v.title}</div>
                        <div style={styles.activityMeta}>
                          <span style={styles.activityBadge}>{v.category}</span>
                          <span style={styles.activityStats}>
                            <FiEye size={14} /> {formatNumber(v.views || 0)}
                          </span>
                          <span style={styles.activityStats}>
                            <FiThumbsUp size={14} /> {v.likes?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ==================== ANALYTICS TAB ==================== */}
          {activeTab === 'analytics' && (
            <>
              <div style={styles.analyticsHeader}>
                <div style={styles.dateRangeSelector}>
                  {['today', 'week', 'month', 'all'].map(range => (
                    <button
                      key={range}
                      style={{
                        ...styles.dateRangeButton,
                        ...(dateRange === range ? styles.dateRangeButtonActive : {})
                      }}
                      onClick={() => setDateRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analytics Grid */}
              <div style={styles.analyticsGrid}>
                {/* Top Performing Videos */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiTrendingUp size={20} />
                    Top Performing Videos
                  </h3>
                  <div style={styles.topList}>
                    {videos
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((v, i) => (
                        <div key={v._id} style={styles.topItem}>
                          <div style={styles.topRank}>#{i + 1}</div>
                          <img
                            src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                            alt={v.title}
                            style={styles.topThumb}
                          />
                          <div style={styles.topInfo}>
                            <div style={styles.topTitle}>{v.title}</div>
                            <div style={styles.topStats}>
                              {formatNumber(v.views || 0)} views
                            </div>
                          </div>
                          <div style={styles.topValue}>
                            {((v.views || 0) / metrics.videos.views * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Category Distribution */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiPieChart size={20} />
                    Category Distribution
                  </h3>
                  <div style={styles.categoryList}>
                    {categories.map((cat) => {
                      const count = videos.filter(v => v.category === cat).length;
                      const percentage = metrics.videos.total > 0
                        ? (count / metrics.videos.total * 100).toFixed(1)
                        : 0;
                      if (count === 0) return null;
                      return (
                        <div key={cat} style={styles.categoryItem}>
                          <div style={styles.categoryInfo}>
                            <span style={styles.categoryName}>{cat}</span>
                            <span style={styles.categoryCount}>{count} videos</span>
                          </div>
                          <div style={styles.categoryProgress}>
                            <div
                              style={{
                                ...styles.categoryProgressFill,
                                width: `${percentage}%`
                              }}
                            />
                          </div>
                          <span style={styles.categoryPercentage}>{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiActivity size={20} />
                    Engagement Metrics
                  </h3>
                  <div style={styles.engagementGrid}>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-purple">
                        <FiThumbsUp size={24} />
                      </div>
                      <div style={styles.engagementValue}>{formatNumber(metrics.videos.likes)}</div>
                      <div style={styles.engagementLabel}>Total Likes</div>
                    </div>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-blue">
                        <FiPercent size={24} />
                      </div>
                      <div style={styles.engagementValue}>{metrics.engagement.rate}%</div>
                      <div style={styles.engagementLabel}>Engagement Rate</div>
                    </div>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-green">
                        <FiClock size={24} />
                      </div>
                      <div style={styles.engagementValue}>{metrics.engagement.avgWatchTime}</div>
                      <div style={styles.engagementLabel}>Avg Watch Time</div>
                    </div>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-orange">
                        <FiTarget size={24} />
                      </div>
                      <div style={styles.engagementValue}>{metrics.engagement.retention}</div>
                      <div style={styles.engagementLabel}>Retention Rate</div>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiDollarSign size={20} />
                    Revenue Breakdown
                  </h3>
                  <div style={styles.revenueBreakdown}>
                    <div style={styles.revenueItem}>
                      <div style={styles.revenueLabel}>
                        <FiTarget size={16} />
                        <span>Ad Revenue</span>
                      </div>
                      <div style={styles.revenueAmount}>
                        {formatCurrency(metrics.revenue.total * 0.7)}
                      </div>
                      <div style={styles.revenuePercentage}>70%</div>
                    </div>
                    <div style={styles.revenueItem}>
                      <div style={styles.revenueLabel}>
                        <FiUsers size={16} />
                        <span>Creator Payouts</span>
                      </div>
                      <div style={styles.revenueAmount}>
                        {formatCurrency(metrics.revenue.total * 0.2)}
                      </div>
                      <div style={styles.revenuePercentage}>20%</div>
                    </div>
                    <div style={styles.revenueItem}>
                      <div style={styles.revenueLabel}>
                        <FiPieChart size={16} />
                        <span>Platform Fees</span>
                      </div>
                      <div style={styles.revenueAmount}>
                        {formatCurrency(metrics.revenue.total * 0.1)}
                      </div>
                      <div style={styles.revenuePercentage}>10%</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==================== VIDEOS TAB ==================== */}
          {activeTab === 'videos' && (
            <>
              {/* Filters */}
              <div style={styles.filterBar}>
                <div style={styles.searchBox}>
                  <FiSearch size={20} color="#888" />
                  <input
                    style={styles.searchInput}
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  style={styles.filterSelect}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <select
                  style={styles.filterSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="views">Most Viewed</option>
                  <option value="engagement">Most Engaging</option>
                </select>

                <button
                  style={styles.uploadButton}
                  onClick={() => setActiveTab('upload')}
                >
                  <FiUpload size={18} />
                  <span>Upload Video</span>
                </button>
              </div>

              {/* Videos Grid */}
              <div style={styles.videosGrid}>
                {filteredVideos.map((v) => (
                  <div key={v._id} style={styles.videoCard}>
                    <div style={styles.videoThumbContainer}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                        alt={v.title}
                        style={styles.videoThumb}
                      />
                      <div style={styles.videoOverlay}>
                        <button
                          style={styles.playButton}
                          onClick={() => window.open(`/watch/${v.filename}`, '_blank')}
                        >
                          <FiPlayCircle size={32} />
                        </button>
                      </div>
                      <div style={styles.videoStats}>
                        <span><FiEye size={14} /> {formatNumber(v.views || 0)}</span>
                        <span><FiThumbsUp size={14} /> {v.likes?.length || 0}</span>
                      </div>
                    </div>

                    <div style={styles.videoCardContent}>
                      {editId === v._id ? (
                        <div style={styles.editMode}>
                          <input
                            style={styles.editInput}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <div style={styles.editActions}>
                            <button style={styles.saveBtn} onClick={updateTitle}>
                              <FiCheckCircle size={16} /> Save
                            </button>
                            <button style={styles.cancelBtn} onClick={() => setEditId(null)}>
                              <FiX size={16} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 style={styles.videoCardTitle}>{v.title}</h3>
                          <div style={styles.videoMeta}>
                            <span style={styles.videoBadge}>{v.category}</span>
                            <span style={styles.videoDate}>{formatDate(v.createdAt)}</span>
                          </div>
                        </>
                      )}

                      {user && (
                        <div style={styles.videoActions}>
                          <button
                            style={styles.videoActionBtn}
                            onClick={() => { setEditId(v._id); setEditTitle(v.title); }}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            style={{ ...styles.videoActionBtn, color: '#ef4444' }}
                            onClick={() => deleteVideo(v._id)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div style={styles.emptyState}>
                  <FiVideo size={64} color="#555" />
                  <h3 style={styles.emptyTitle}>No videos found</h3>
                  <p style={styles.emptyText}>
                    {searchQuery || filterCategory !== "All"
                      ? "Try adjusting your filters"
                      : "Upload your first video to get started"}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ==================== ADS TAB ==================== */}
          {activeTab === 'ads' && (
            <div style={styles.comingSoon}>
              <FiTarget size={64} color="#667eea" />
              <h2>Ad Management</h2>
              <p>Manage your advertisements from the dedicated Ad Management panel</p>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/admin/upload-ad")}
              >
                Go to Ad Management
              </button>
            </div>
          )}

          {/* ==================== REVENUE TAB ==================== */}
          {activeTab === 'revenue' && (
            <div style={styles.comingSoon}>
              <FiDollarSign size={64} color="#10b981" />
              <h2>Revenue Dashboard</h2>
              <p>View detailed revenue analytics and reports</p>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/revenue-dashboard")}
              >
                Go to Revenue Dashboard
              </button>
            </div>
          )}

          {/* ==================== CREATORS TAB ==================== */}
          {activeTab === 'creators' && (
            <div style={styles.comingSoon}>
              <FiUsers size={64} color="#f59e0b" />
              <h2>Creator Management</h2>
              <p>Manage creator applications and monetization</p>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/AdminMonetizationPanel")}
              >
                Go to Creator Management
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Outfit', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          width: 56px;
          height: 56px;
          border: 4px solid rgba(102, 126, 234, 0.1);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spinning {
          animation: spin 0.8s linear infinite;
        }

        .gradient-purple {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .gradient-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .gradient-orange {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .alert-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .alert-info {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .alert-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#fff',
  },

  // Loading Screen
  loadingScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
  },
  loadingSpinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  loadingText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },

  // Sidebar
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: 'rgba(10, 10, 15, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(102, 126, 234, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
  },
  sidebarHeader: {
    padding: '28px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
    minHeight: '88px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  logoSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  toggleBtn: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '10px',
    padding: '10px',
    color: '#667eea',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  nav: {
    flex: 1,
    padding: '24px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
  },
  navSection: {
    marginBottom: '16px',
  },
  navSectionTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '8px 16px',
    marginBottom: '8px',
  },
  navItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    right: '8px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.8)',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
    margin: '16px 24px',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid rgba(102, 126, 234, 0.1)',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  userAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userRole: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  userStatus: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
    flexShrink: 0,
  },

  // Main Content
  main: {
    flex: 1,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100vh',
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(10, 10, 15, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  },
  topBarLeft: {
    flex: 1,
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    margin: 0,
    marginBottom: '6px',
    background: 'linear-gradient(135deg, #fff 0%, #667eea 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  breadcrumbActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '10px',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
  },
  notificationBadge: {
    position: 'relative',
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '10px',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ef4444',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
  },
  content: {
    padding: '40px',
    animation: 'fadeIn 0.5s ease',
  },

  // Metrics Grid
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  metricCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideIn 0.5s ease',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  metricIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  metricGrowth: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
    letterSpacing: '-1px',
  },
  metricLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },

  // Performance Section
  performanceSection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  performanceCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '28px',
  },
  performanceGrid: {
    display: 'grid',
    gap: '24px',
  },
  performanceItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  performanceLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    marginBottom: '12px',
  },
  performanceValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '12px',
  },
  performanceBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 0 12px rgba(102, 126, 234, 0.5)',
  },

  // Alerts Card
  alertsCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  alertIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
  },
  alertText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  alertButton: {
    padding: '8px 16px',
    background: 'rgba(102, 126, 234, 0.2)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '8px',
    color: '#667eea',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  // Activity Section
  activitySection: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  activityGrid: {
    display: 'grid',
    gap: '16px',
  },
  activityCard: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  activityThumb: {
    width: '120px',
    height: '68px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  activityInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
  },
  activityTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#fff',
  },
  activityMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
  },
  activityBadge: {
    padding: '4px 10px',
    background: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '6px',
    color: '#667eea',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  activityStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },

  // Analytics
  analyticsHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
  },
  dateRangeSelector: {
    display: 'flex',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '6px',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  dateRangeButton: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dateRangeButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  analyticsCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '24px',
  },
  topList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  topItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  topRank: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '800',
    color: '#fff',
    flexShrink: 0,
  },
  topThumb: {
    width: '80px',
    height: '45px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  topInfo: {
    flex: 1,
    minWidth: 0,
  },
  topTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  topStats: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
  topValue: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#10b981',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  categoryInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '120px',
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
  },
  categoryCount: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  categoryProgress: {
    flex: 1,
    height: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  categoryPercentage: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#667eea',
    minWidth: '48px',
    textAlign: 'right',
  },
  engagementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  engagementItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    textAlign: 'center',
  },
  engagementIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    marginBottom: '16px',
  },
  engagementValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
  },
  engagementLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  revenueBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  revenueItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  revenueLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  revenueAmount: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#10b981',
  },
  revenuePercentage: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Filter Bar
  filterBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    borderRadius: '12px',
    minWidth: '280px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    outline: 'none',
  },
  filterSelect: {
    padding: '14px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
  },

  // Videos Grid
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  videoCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  videoThumbContainer: {
    position: 'relative',
    aspectRatio: '16/9',
    overflow: 'hidden',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  playButton: {
    background: 'rgba(102, 126, 234, 0.9)',
    border: 'none',
    borderRadius: '50%',
    padding: '16px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoStats: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
  },
  videoCardContent: {
    padding: '20px',
  },
  videoCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  videoMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  videoBadge: {
    padding: '6px 12px',
    background: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    color: '#667eea',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  videoDate: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
  videoActions: {
    display: 'flex',
    gap: '8px',
  },
  videoActionBtn: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    color: '#667eea',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editMode: {
    marginBottom: '12px',
  },
  editInput: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '8px',
    outline: 'none',
  },
  editActions: {
    display: 'flex',
    gap: '8px',
  },
  saveBtn: {
    flex: 1,
    padding: '10px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },

  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginTop: '24px',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },

  // Coming Soon
  comingSoon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  primaryButton: {
    marginTop: '24px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
  },
};