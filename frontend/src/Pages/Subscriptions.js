import React, { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

export default function Subscriptions() {
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get("/api/subscribe/my-subscriptions");
      setChannels(res.data);
    } catch (err) {
      console.error("Error loading subscriptions", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Subscriptions ({channels.length})</h2>

      <div style={styles.grid}>
        {channels.length === 0 ? (
          <p style={{ color: "#aaa" }}>You haven't subscribed to any channels yet.</p>
        ) : (
          channels.map((channel) => (
            <div
              key={channel._id}
              style={styles.channelCard}
              onClick={() => navigate(`/profile/${channel._id}`)}
            >
              <img
                src={channel.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={channel.name}
                style={styles.avatar}
              />
              <div style={styles.info}>
                <h3 style={styles.name}>{channel.name}</h3>
                <p style={styles.subCount}>{channel.subscribers?.length || 0} subscribers</p>
                <button style={styles.btnSubscribed}>Subscribed</button>
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
  title: { marginBottom: "30px", fontSize: "24px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" },
  channelCard: {
    background: "#1a1a1a", padding: "20px", borderRadius: "12px",
    textAlign: "center", cursor: "pointer", transition: "0.3s"
  },
  avatar: { width: "100px", height: "100px", borderRadius: "50%", marginBottom: "15px", objectFit: "cover" },
  name: { fontSize: "18px", marginBottom: "5px" },
  subCount: { color: "#aaa", fontSize: "14px", marginBottom: "15px" },
  btnSubscribed: {
    padding: "8px 16px", background: "#333", border: "none",
    color: "#fff", borderRadius: "20px", fontWeight: "600"
  }
};