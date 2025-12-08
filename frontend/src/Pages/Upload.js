

// import React, { useState, useContext } from "react";
// import axios from "axios";
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

//       const res = await axios.post(
//         "http://localhost:5000/api/videos/upload",
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
// import axios from "axios";
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
//       const res = await axios.get("http://localhost:5000/api/videos/all");
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

//       await axios.post("http://localhost:5000/api/videos/upload", formData, {
//         headers: { Authorization: `Bearer ${token}` },
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
//       await axios.delete(`http://localhost:5000/api/videos/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
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
//       await axios.put(
//         `http://localhost:5000/api/videos/update/${editId}`,
//         { title: editTitle },
//         { headers: { Authorization: `Bearer ${token}` } }
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
//             src={`http://localhost:5000/uploads/${v.thumbnail}`}
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
// import axios from "axios";
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
//     const res = await axios.get("http://localhost:5000/api/videos/all");
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

//       await axios.post("http://localhost:5000/api/videos/upload", fd, {
//         headers: { Authorization: `Bearer ${token}` },
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

//     await axios.delete(`http://localhost:5000/api/videos/delete/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     fetchVideos();
//   };

//   // Update Title
//   const updateTitle = async () => {
//     await axios.put(
//       `http://localhost:5000/api/videos/update/${editId}`,
//       { title: editTitle },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setEditId(null);
//     fetchVideos();
//   };

//   // Replace Thumbnail
//   const replaceThumb = async (id, file) => {
//     if (!file) return;

//     const fd = new FormData();
//     fd.append("thumbnail", file);

//     await axios.put(
//       `http://localhost:5000/api/videos/update-thumbnail/${id}`,
//       fd,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchVideos();
//   };

//   // Replace Video File
//   const replaceVideoFile = async (id, file) => {
//     if (!file) return;

//     const fd = new FormData();
//     fd.append("video", file);

//     await axios.put(
//       `http://localhost:5000/api/videos/update-video/${id}`,
//       fd,
//       { headers: { Authorization: `Bearer ${token}` } }
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
//             src={`http://localhost:5000/uploads/${v.thumbnail}`}
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
// import axios from "axios";
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
//     const res = await axios.get("http://localhost:5000/api/videos/all");
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
//       await axios.post("http://localhost:5000/api/videos/upload", fd, {
//         headers: { Authorization: `Bearer ${token}` },
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
//     await axios.delete(`http://localhost:5000/api/videos/delete/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchVideos();
//   };

//   const updateTitle = async () => {
//     if (!editTitle.trim()) return;
//     await axios.put(
//       `http://localhost:5000/api/videos/update/${editId}`,
//       { title: editTitle },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setEditId(null);
//     fetchVideos();
//   };

//   const replaceThumb = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("thumbnail", file);
//     await axios.put(
//       `http://localhost:5000/api/videos/update-thumbnail/${id}`,
//       fd,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     fetchVideos();
//   };

//   const replaceVideoFile = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("video", file);
//     await axios.put(
//       `http://localhost:5000/api/videos/update-video/${id}`,
//       fd,
//       { headers: { Authorization: `Bearer ${token}` } }
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
//                   src={`http://localhost:5000/uploads/${v.thumbnail}`}
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
// import axios from "axios";
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
//     const res = await axios.get("http://localhost:5000/api/videos/all");
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
//       await axios.post("http://localhost:5000/api/videos/upload", fd, {
//         headers: { Authorization: `Bearer ${token}` },
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
//     await axios.delete(`http://localhost:5000/api/videos/delete/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchVideos();
//   };

//   // ✏ Update Title
//   const updateTitle = async () => {
//     if (!editTitle.trim()) return;
//     await axios.put(
//       `http://localhost:5000/api/videos/update/${editId}`,
//       { title: editTitle },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setEditId(null);
//     fetchVideos();
//   };

//   // 🖼 Replace Thumbnail
//   const replaceThumb = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("thumbnail", file);
//     await axios.put(
//       `http://localhost:5000/api/videos/update-thumbnail/${id}`,
//       fd,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     fetchVideos();
//   };

//   // 🎥 Replace Video
//   const replaceVideoFile = async (id, file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("video", file);
//     await axios.put(
//       `http://localhost:5000/api/videos/update-video/${id}`,
//       fd,
//       { headers: { Authorization: `Bearer ${token}` } }
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
//               <img src={`http://localhost:5000/uploads/${v.thumbnail}`} alt="thumb"/>

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


import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Upload states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Management states
  const [videos, setVideos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const categories = [
    "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
    "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
    "Fashion", "Fitness", "Other"
  ];

  // Fetch all videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos/all");
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchVideos();
  }, [user]);

  // Admin guard
  if (!user || !user.isAdmin) {
    return (
      <div className="unauthorized">
        <div className="card">
          <h2>Access Denied</h2>
          <p>Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  // Upload handler with progress
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !category || !video || !thumbnail) {
      alert("Please fill all required fields (Title, Category, Video, Thumbnail)");
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

      await axios.post("http://localhost:5000/api/videos/upload", fd, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      alert("Video uploaded successfully!");
      resetForm();
      fetchVideos();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setTitle(""); setCategory(""); setDescription(""); setTags("");
    setVideo(null); setThumbnail(null);
    document.getElementById("video-input").value = "";
    document.getElementById("thumb-input").value = "";
  };

  // Delete video
  const deleteVideo = async (id) => {
    if (!window.confirm("Permanently delete this video? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/videos/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVideos();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Update title
  const updateTitle = async () => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(`http://localhost:5000/api/videos/update/${editId}`, { title: editTitle }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditId(null);
      fetchVideos();
    } catch (err) {
      alert("Update failed");
    }
  };

  // Replace thumbnail
  const replaceThumbnail = async (id, file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("thumbnail", file);
    await axios.put(`http://localhost:5000/api/videos/update-thumbnail/${id}`, fd, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchVideos();
  };

  // Replace video file
  const replaceVideo = async (id, file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("video", file);
    await axios.put(`http://localhost:5000/api/videos/update-video/${id}`, fd, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchVideos();
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="header">
        <h1>Admin Dashboard</h1>
        <p>Upload and manage all videos</p>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="card">
          <h2>Upload New Video</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-grid">
              <input
                type="text"
                placeholder="Video Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category *</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <input
              type="text"
              placeholder="Tags (comma separated: gaming, tutorial, funny)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <div className="file-inputs">
              <label className="file-label">
                <input id="video-input" type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
                <span>{video ? video.name : "Choose Video File *"}</span>
              </label>
              <label className="file-label">
                <input id="thumb-input" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} required />
                <span>{thumbnail ? thumbnail.name : "Choose Thumbnail *"}</span>
              </label>
            </div>

            <button type="submit" disabled={uploading} className="upload-btn">
              {uploading ? `Uploading... ${progress}%` : "Upload Video"}
            </button>

            {uploading && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Video Management */}
      <div className="management-section">
        <h2>Manage Videos ({videos.length})</h2>
        <div className="videos-grid">
          {videos.map((v) => (
            <div key={v._id} className="video-card">
              <div className="thumbnail">
                <img src={`http://localhost:5000/uploads/${v.thumbnail}`} alt={v.title} />
                <div className="duration">{v.duration || "0:00"}</div>
              </div>

              <div className="info">
                {editId === v._id ? (
                  <div className="edit-mode">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button onClick={updateTitle}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <h3>{v.title}</h3>
                )}
                <p className="meta">
                  {v.views || 0} views • {new Date(v.createdAt).toLocaleDateString()}
                  <span className="category">{v.category}</span>
                </p>
              </div>

              <div className="actions">
                <button className="edit-btn" onClick={() => { setEditId(v._id); setEditTitle(v.title); }}>
                  Edit Title
                </button>

                <label className="replace-btn">
                  New Thumbnail
                  <input type="file" accept="image/*" onChange={(e) => replaceThumbnail(v._id, e.target.files[0])} />
                </label>

                <label className="replace-btn warning">
                  Replace Video
                  <input type="file" accept="video/*" onChange={(e) => replaceVideo(v._id, e.target.files[0])} />
                </label>

                <button className="delete-btn" onClick={() => deleteVideo(v._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perfect YouTube Studio Style */}
      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Roboto', 'Segoe UI', sans-serif;
        }

        .unauthorized {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          background: #000;
        }

        .header {
          padding: 40px 30px 20px;
          background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
          border-bottom: 1px solid #333;
        }

        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .header p {
          color: #aaa;
          font-size: 16px;
        }

        .upload-section, .management-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px;
        }

        .card {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          border: 1px solid #333;
        }

        h2 {
          font-size: 24px;
          margin-bottom: 24px;
          color: #fff;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        input, textarea, select {
          width: 100%;
          padding: 14px 16px;
          background: #111;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          transition: all 0.2s;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #ff0033;
          box-shadow: 0 0 0 3px rgba(255,0,51,0.2);
        }

        .file-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 20px 0;
        }

        .file-label {
          display: block;
        }

        .file-label input {
          display: none;
        }

        .file-label span {
          display: block;
          padding: 14px 16px;
          background: #111;
          border: 1px dashed #555;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #ccc;
        }

        .file-label:hover span {
          border-color: #ff0033;
          background: #1a0f0f;
          color: #ff0033;
        }

        .upload-btn {
          width: 100%;
          padding: 16px;
          background: #ff003,0,51;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }

        .upload-btn:hover {
          background: #e6002e;
          transform: translateY(-2px);
        }

        .upload-btn:disabled {
          background: #444;
          cursor: not-allowed;
        }

        .progress-bar {
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 16px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff0033, #ff6b6b);
          width: 0;
          transition: width 0.3s;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
          margin-top: 20px;
        }

        .video-card {
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #333;
          transition: all 0.3s;
        }

        .video-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          border-color: #ff0033;
        }

        .thumbnail {
          position: relative;
        }

        .thumbnail img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.8);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .info {
          padding: 16px;
        }

        .info h3 {
          font-size: 16px;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .meta {
          font-size: 13px;
          color: #aaa;
        }

        .category {
          background: #ff0033;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          margin-left: 8px;
        }

        .actions {
          padding: 0 16px 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .actions button, .actions label {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn {
          background: #272727;
          color: #fff;
          border: none;
        }

        .replace-btn {
          background: #272727;
          color: #3ea6ff;
          border: none;
        }

        .replace-btn.warning {
          color: #ff6b6b;
        }

        .replace-btn input { display: none; }

        .delete-btn {
          background: #8b0000;
          color: white;
          border: none;
        }

        .edit-mode input {
          width: 100%;
          padding: 10px;
          background: #111;
          border: 1px solid #ff0033;
          border-radius: 8px;
          color: white;
          margin-bottom: 8px;
        }

        .edit-actions button {
          padding: 6px 12px;
          margin-right: 8px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .form-grid, .file-inputs {
            grid-template-columns: 1fr;
          }
          .videos-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}