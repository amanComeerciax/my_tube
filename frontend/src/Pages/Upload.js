

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


import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Upload() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // State
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Fetch videos
  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos/all");
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (!user || !user.isAdmin) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>❌ Only Admin Allowed</h2>;
  }

  // Upload video
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !video || !thumbnail) {
      alert("Missing fields!");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("video", video);
    fd.append("thumbnail", thumbnail);

    try {
      setUploading(true);

      await axios.post("http://localhost:5000/api/videos/upload", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Uploaded ✔");
      setTitle("");
      setVideo(null);
      setThumbnail(null);
      fetchVideos();
    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const deleteVideo = async (id) => {
    if (!window.confirm("Delete permanently?")) return;

    await axios.delete(`http://localhost:5000/api/videos/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchVideos();
  };

  // Update Title
  const updateTitle = async () => {
    await axios.put(
      `http://localhost:5000/api/videos/update/${editId}`,
      { title: editTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditId(null);
    fetchVideos();
  };

  // Replace Thumbnail
  const replaceThumb = async (id, file) => {
    if (!file) return;

    const fd = new FormData();
    fd.append("thumbnail", file);

    await axios.put(
      `http://localhost:5000/api/videos/update-thumbnail/${id}`,
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchVideos();
  };

  // Replace Video File
  const replaceVideoFile = async (id, file) => {
    if (!file) return;

    const fd = new FormData();
    fd.append("video", file);

    await axios.put(
      `http://localhost:5000/api/videos/update-video/${id}`,
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchVideos();
  };

  // Styling
  const box = {
    width: "420px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  };

  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "12px",
  };

  const btn = {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#ff0000",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={{ padding: 20 }}>
      {/* UPLOAD FORM */}
      <div style={box}>
        <h2>Upload Video</h2>

        <form onSubmit={handleUpload}>
          <input
            style={input}
            type="text"
            placeholder="Video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Choose Video</label>
          <input
            style={input}
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />

          <label>Choose Thumbnail</label>
          <input
            style={input}
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <button style={btn} type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* LIST VIDEOS */}
      <h2 style={{ textAlign: "center", marginTop: 30 }}>Manage Videos</h2>

      {videos.map((v) => (
        <div
          key={v._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            background: "#fff",
            padding: 15,
            margin: "15px auto",
            width: "90%",
            borderRadius: "10px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Thumbnail */}
          <img
            src={`http://localhost:5000/uploads/${v.thumbnail}`}
            width="130"
            height="80"
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />

          {/* Title */}
          <div style={{ flex: 1 }}>
            {editId === v._id ? (
              <>
                <input
                  style={input}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button style={btn} onClick={updateTitle}>Save</button>
              </>
            ) : (
              <h3>{v.title}</h3>
            )}
          </div>

          {/* CRUD Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              style={{ ...btn, background: "#007bff" }}
              onClick={() => {
                setEditId(v._id);
                setEditTitle(v.title);
              }}
            >
              Edit Title
            </button>

            {/* Replace Thumbnail */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => replaceThumb(v._id, e.target.files[0])}
            />

            {/* Replace Video */}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => replaceVideoFile(v._id, e.target.files[0])}
            />

            <button
              style={{ ...btn, background: "#ff0000" }}
              onClick={() => deleteVideo(v._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
