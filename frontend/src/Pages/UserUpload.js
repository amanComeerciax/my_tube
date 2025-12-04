import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserUpload() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>⚠ Login Required</h2>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !video || !thumbnail) return alert("All fields required!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/videos/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🎉 Video Uploaded Successfully!");
      navigate("/profile");
    } catch (err) {
      alert("Upload Failed ❌");
    }
    setLoading(false);
  };

  // UI Style
  const box = {
    width: "450px",
    margin: "40px auto",
    padding: "25px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  };
  const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  };
  const btn = {
    width: "100%",
    padding: "12px",
    background: "#ff0000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  return (
    <div style={box}>
      <h2>📤 Upload Your Video</h2>

      <form onSubmit={handleUpload}>
        <input
          style={input}
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>🎬 Select Video:</label>
        <input
          style={input}
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />

        <label>🖼 Select Thumbnail:</label>
        <input
          style={input}
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <button style={btn} type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
