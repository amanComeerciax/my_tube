import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ShortUpload() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);
  const thumbRef = useRef(null);

  if (!user) {
    return (
      <div style={styles.center}>
        <h2>⚠ Login Required</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  // 🎥 select short video
  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      alert("Short must be under 150MB");
      return;
    }

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // 🖼 thumbnail
  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  // 🚀 upload short (NO CHUNKS)
  const handleUpload = async () => {
    if (!title || !video || !thumbnail) {
      alert("Title, video & thumbnail required");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("video", video);
      formData.append("thumbnail", thumbnail);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("category", "Shorts");

      // 🔥 SHORT FLAG
      formData.append("isShort", true);

      await axios.post(
        "http://localhost:5000/api/videos/upload-short",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      alert("🎉 Short uploaded successfully!");
      navigate("/shorts");
    } catch (err) {
      console.error(err);
      alert("❌ Short upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div style={styles.container}>
      <h1>📱 Upload Short</h1>

      {/* VIDEO */}
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        hidden
        onChange={handleVideo}
      />

      {!videoPreview ? (
        <div style={styles.box} onClick={() => videoRef.current.click()}>
          <p>Select vertical short video (≤60s)</p>
        </div>
      ) : (
        <video
          src={videoPreview}
          controls
          style={{ width: 240, borderRadius: 12 }}
        />
      )}

      {/* TITLE */}
      <input
        style={styles.input}
        placeholder="Short title"
        maxLength={80}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <textarea
        style={styles.textarea}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* TAGS */}
      <input
        style={styles.input}
        placeholder="tags: funny, tech"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* THUMBNAIL */}
      <input
        ref={thumbRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleThumb}
      />

      {!thumbPreview ? (
        <button onClick={() => thumbRef.current.click()}>
          Upload Thumbnail
        </button>
      ) : (
        <img
          src={thumbPreview}
          alt="thumbnail"
          style={{ width: 200, borderRadius: 8 }}
        />
      )}

      {/* PROGRESS */}
      {loading && <p>Uploading… {progress}%</p>}

      <button
        style={styles.upload}
        disabled={loading}
        onClick={handleUpload}
      >
        🚀 Publish Short
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "white",
    padding: 30,
  },
  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    height: 200,
    border: "2px dashed #444",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 12,
    background: "#222",
    color: "white",
    border: "1px solid #333",
    borderRadius: 8,
  },
  textarea: {
    width: "100%",
    padding: 12,
    marginTop: 12,
    background: "#222",
    color: "white",
    border: "1px solid #333",
    borderRadius: 8,
  },
  upload: {
    marginTop: 20,
    padding: "12px 30px",
    background: "#ff0000",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
};
