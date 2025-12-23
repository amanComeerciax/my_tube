import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiThumbsUp, FiPlay } from "react-icons/fi";

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/videos/liked-videos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(res.data);
      } catch (err) {
        console.error("Error loading liked videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

  if (loading) return <div style={{color: '#fff', padding: 20}}>Loading Liked Videos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconCircle}><FiThumbsUp size={30} /></div>
        <h2 style={styles.title}>Liked Videos ({videos.length})</h2>
      </div>
      
      <div style={styles.videoList}>
        {videos.length === 0 ? (
          <p style={styles.empty}>You haven't liked any videos yet.</p>
        ) : (
          videos.map((v, index) => (
            <div key={v._id} style={styles.videoRow} onClick={() => navigate(`/watch/${v.filename}`)}>
              <span style={styles.index}>{index + 1}</span>
              <div style={styles.thumbnailWrapper}>
                <img src={`http://localhost:5000/uploads/${v.thumbnail}`} alt={v.title} style={styles.thumb} />
                <div style={styles.overlay}><FiPlay /></div>
              </div>
              <div style={styles.info}>
                <h3 style={styles.videoTitle}>{v.title}</h3>
                <p style={styles.channelName}>{v.uploadedBy?.name} • {v.views || 0} views</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px", background: "#0f0f0f", minHeight: "100vh", color: "#fff" },
  header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" },
  iconCircle: { background: "#272727", padding: "20px", borderRadius: "50%", color: "#3ea6ff" },
  title: { fontSize: "28px", fontWeight: "800" },
  videoList: { display: "flex", flexDirection: "column", gap: "10px" },
  videoRow: { display: "flex", alignItems: "center", gap: "20px", padding: "12px", borderRadius: "12px", cursor: "pointer", transition: "0.2s" },
  index: { color: "#aaa", width: "30px", fontSize: "14px" },
  thumbnailWrapper: { position: "relative", width: "160px", height: "90px", borderRadius: "8px", overflow: "hidden" },
  thumb: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0 },
  info: { display: "flex", flexDirection: "column", gap: "5px" },
  videoTitle: { fontSize: "16px", fontWeight: "600", color: "#fff" },
  channelName: { fontSize: "13px", color: "#aaa" },
  empty: { textAlign: "center", marginTop: "50px", color: "#aaa" }
};