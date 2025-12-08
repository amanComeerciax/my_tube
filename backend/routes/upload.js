// import React, { useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useContext } from "react";



// export default function Upload() {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       alert("Please select a video file");
//       return;
//     }

//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("video", file);

//       const res = await axios.post(
//         "http://localhost:5000/api/videos/upload",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       setUploadedFile(res.data.file);
//       setUploading(false);

//       alert("Video uploaded successfully");

//     } catch (error) {
//       setUploading(false);
//       console.error(error);
//       alert("Upload failed");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Upload Video</h2>

//       <form onSubmit={handleUpload}>
//         <input
//           type="file"
//           accept="video/*"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <br /><br />

//         <button type="submit" disabled={uploading}>
//           {uploading ? "Uploading..." : "Upload"}
//         </button>
//       </form>

//       {uploadedFile && (
//         <div style={{ marginTop: 20 }}>
//           <h3>Uploaded File:</h3>
//           <p>{uploadedFile.filename}</p>

//           <a
//             href={`http://localhost:5000/uploads/${uploadedFile.filename}`}
//             target="_blank"
//             rel="noreferrer"
//           >
//             Open File
//           </a>

//           <br /><br />

//           <a
//             href={`http://localhost:3000/watch/${uploadedFile.filename}`}
//             target="_blank"
//             rel="noreferrer"
//           >
//             Watch in Player
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

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
//     return <h2 style={{ padding: 20 }}>❌ Only Admin can upload videos</h2>;
//   }

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!title || !video || !thumbnail) {
//       alert("Please add title, video & thumbnail");
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

//       alert("Video uploaded successfully!");
//       console.log(res.data);
//       setUploading(false);
//     } catch (error) {
//       setUploading(false);
//       console.error(error);
//       alert("Upload failed!");
//     }
//   };

//   // STYLE
//   const box = {
//     width: "400px",
//     margin: "40px auto",
//     padding: "25px",
//     background: "#fff",
//     borderRadius: "10px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//   };
//   const input = {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "15px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//   };
//   const btn = {
//     width: "100%",
//     padding: "12px",
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
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

//         <label>Video File:</label>
//         <input
//           style={input}
//           type="file"
//           accept="video/*"
//           onChange={(e) => setVideo(e.target.files[0])}
//         />

//         <label>Thumbnail:</label>
//         <input
//           style={input}
//           type="file"
//           accept="image/*"
//           onChange={(e) => setThumbnail(e.target.files[0])}
//         />

//         <button style={btn} disabled={uploading}>
//           {uploading ? "Uploading..." : "Upload"}
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Upload() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // 📝 Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 📌 Category Options
  const categories = [
    "Gaming","Music","Education","Entertainment","Sports","Technology",
    "Cooking","Travel","Vlogs","News","Comedy","Animation",
    "Science","Fashion","Fitness","Other"
  ];

  // 🛑 Restrict if not admin
  if (!user || !user.isAdmin) {
    return <h2 style={{ padding: 20, color: "red" }}>❌ Access Denied (Admin Only)</h2>;
  }

  // 📤 Upload Handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !category || !video || !thumbnail) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("tags", tags);
    fd.append("category", category);
    fd.append("video", video);
    fd.append("thumbnail", thumbnail);

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/api/videos/upload", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🎉 Video uploaded successfully!");
      
      // Reset form
      setTitle(""); setCategory(""); setDescription(""); setTags("");
      setVideo(null); setThumbnail(null);
      document.getElementById("video-input").value = "";
      document.getElementById("thumb-input").value = "";
    } catch (err) {
      alert("Upload failed ❌");
      console.error(err.response?.data || err);
    }
    setUploading(false);
  };

  // 🎨 Styles
  const box = {
    width: "450px",
    margin: "40px auto",
    padding: "25px",
    background: "#1b1b1b",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  };
  const input = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #555",
    borderRadius: "8px",
    background: "#111",
    color: "#eee",
  };
  const select = { ...input, cursor: "pointer" };
  const btn = {
    width: "100%",
    padding: "12px",
    background: uploading ? "#777" : "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: uploading ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  };

  return (
    <div style={box}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>📤 Upload Video</h2>

      <form onSubmit={handleUpload}>
        <input
          style={input}
          type="text"
          placeholder="Enter video title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          style={{ ...input, height: "80px" }}
          placeholder="Enter description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          style={input}
          type="text"
          placeholder="Tags (comma separated: funny, tech, tutorial)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <select
          style={select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">-- Select Category * --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>🎬 Video File *</label>
        <input
          id="video-input"
          style={input}
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />

        <label>🖼 Thumbnail Image *</label>
        <input
          id="thumb-input"
          style={input}
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <button style={btn} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Now 🚀"}
        </button>
      </form>
    </div>
  );
}
