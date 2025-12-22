// Example Navigation/Header component with Shorts button
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <button style={styles.logo} onClick={() => navigate("/")}>
          🎥 YourTube
        </button>
      </div>

      <div style={styles.center}>
        <input 
          type="text" 
          placeholder="Search..." 
          style={styles.searchInput}
        />
      </div>

      <div style={styles.right}>
        {/* 🎬 SHORTS BUTTON */}
        <button 
          style={styles.shortsBtn}
          onClick={() => navigate("/shorts")}
        >
          <span style={styles.shortsIcon}>📱</span>
          <span>Shorts</span>
        </button>

        <button 
          style={styles.uploadBtn}
          onClick={() => navigate("/upload")}
        >
          <span>➕</span>
          <span>Upload</span>
        </button>

        <button style={styles.avatarBtn}>
          <span>👤</span>
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#0f0f0f",
    borderBottom: "1px solid #333",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  left: {
    flex: 1
  },
  logo: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer"
  },
  center: {
    flex: 2,
    display: "flex",
    justifyContent: "center"
  },
  searchInput: {
    width: "100%",
    maxWidth: 500,
    padding: "10px 16px",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 20,
    color: "white",
    fontSize: 14
  },
  right: {
    flex: 1,
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  shortsBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "transparent",
    border: "1px solid #333",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.2s"
  },
  shortsIcon: {
    fontSize: 18
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "#3ea6ff",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#ff0000",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 18
  }
};