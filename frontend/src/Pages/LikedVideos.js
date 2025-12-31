// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FiThumbsUp, FiPlay } from "react-icons/fi";

// export default function LikedVideos() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLikedVideos = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/videos/liked-videos", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setVideos(res.data);
//       } catch (err) {
//         console.error("Error loading liked videos", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLikedVideos();
//   }, []);

//   if (loading) return <div style={{color: '#fff', padding: 20}}>Loading Liked Videos...</div>;

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <div style={styles.iconCircle}><FiThumbsUp size={30} /></div>
//         <h2 style={styles.title}>Liked Videos ({videos.length})</h2>
//       </div>
      
//       <div style={styles.videoList}>
//         {videos.length === 0 ? (
//           <p style={styles.empty}>You haven't liked any videos yet.</p>
//         ) : (
//           videos.map((v, index) => (
//             <div key={v._id} style={styles.videoRow} onClick={() => navigate(`/watch/${v.filename}`)}>
//               <span style={styles.index}>{index + 1}</span>
//               <div style={styles.thumbnailWrapper}>
//                 <img src={`http://localhost:5000/uploads/${v.thumbnail}`} alt={v.title} style={styles.thumb} />
//                 <div style={styles.overlay}><FiPlay /></div>
//               </div>
//               <div style={styles.info}>
//                 <h3 style={styles.videoTitle}>{v.title}</h3>
//                 <p style={styles.channelName}>{v.uploadedBy?.name} • {v.views || 0} views</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { padding: "40px", background: "#0f0f0f", minHeight: "100vh", color: "#fff" },
//   header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" },
//   iconCircle: { background: "#272727", padding: "20px", borderRadius: "50%", color: "#3ea6ff" },
//   title: { fontSize: "28px", fontWeight: "800" },
//   videoList: { display: "flex", flexDirection: "column", gap: "10px" },
//   videoRow: { display: "flex", alignItems: "center", gap: "20px", padding: "12px", borderRadius: "12px", cursor: "pointer", transition: "0.2s" },
//   index: { color: "#aaa", width: "30px", fontSize: "14px" },
//   thumbnailWrapper: { position: "relative", width: "160px", height: "90px", borderRadius: "8px", overflow: "hidden" },
//   thumb: { width: "100%", height: "100%", objectFit: "cover" },
//   overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0 },
//   info: { display: "flex", flexDirection: "column", gap: "5px" },
//   videoTitle: { fontSize: "16px", fontWeight: "600", color: "#fff" },
//   channelName: { fontSize: "13px", color: "#aaa" },
//   empty: { textAlign: "center", marginTop: "50px", color: "#aaa" }
// };

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiThumbsUp, FiPlay, FiClock } from "react-icons/fi";

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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        {/* Left Sidebar Section */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarContent}>
            <div style={styles.playlistIcon}>
              <FiThumbsUp size={48} color="#fff" />
            </div>
            <h1 style={styles.playlistTitle}>Liked videos</h1>
            <div style={styles.playlistMeta}>
              <p style={styles.metaText}>{videos[0]?.uploadedBy?.name || "Your channel"}</p>
              <p style={styles.metaText}>{videos.length} videos</p>
            </div>
          </div>
        </div>

        {/* Right Video List Section */}
        <div style={styles.videoListContainer}>
          {videos.length === 0 ? (
            <div style={styles.emptyState}>
              <FiThumbsUp size={80} color="#606060" />
              <h2 style={styles.emptyTitle}>No liked videos yet</h2>
              <p style={styles.emptyText}>Videos that you have liked will show up here</p>
            </div>
          ) : (
            videos.map((video, index) => (
              <div 
                key={video._id} 
                style={styles.videoItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#272727';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => navigate(`/watch/${video.filename}`)}
              >
                {/* Video Number */}
                <div style={styles.videoNumber}>{index + 1}</div>

                {/* Thumbnail */}
                <div style={styles.thumbnailContainer}>
                  <img 
                    src={`http://localhost:5000/uploads/${video.thumbnail}`} 
                    alt={video.title} 
                    style={styles.thumbnail}
                  />
                  <div style={styles.playIconOverlay}>
                    <FiPlay size={24} color="#fff" />
                  </div>
                  <div style={styles.durationBadge}>
                    <FiClock size={12} style={{ marginRight: 4 }} />
                    {video.duration || "0:00"}
                  </div>
                </div>

                {/* Video Info */}
                <div style={styles.videoInfo}>
                  <h3 style={styles.videoTitle}>{video.title}</h3>
                  <div style={styles.videoMeta}>
                    <span style={styles.channelName}>{video.uploadedBy?.name}</span>
                    <span style={styles.separator}>•</span>
                    <span style={styles.views}>{formatViews(video.views || 0)} views</span>
                  </div>
                  {video.description && (
                    <p style={styles.description}>{video.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to format view count
function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  return views.toString();
}

const styles = {
  pageContainer: {
    backgroundColor: "#0f0f0f",
    minHeight: "100vh",
    color: "#fff",
    paddingTop: "24px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #272727",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  contentWrapper: {
    display: "flex",
    maxWidth: "1920px",
    margin: "0 auto",
    gap: "24px",
    padding: "0 24px",
  },
  sidebar: {
    width: "400px",
    flexShrink: 0,
    position: "sticky",
    top: "24px",
    height: "fit-content",
  },
  sidebarContent: {
    backgroundColor: "#0f0f0f",
    borderRadius: "12px",
    padding: "24px",
  },
  playlistIcon: {
    width: "100%",
    aspectRatio: "16/9",
    backgroundColor: "#3ea6ff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    background: "linear-gradient(135deg, #3ea6ff 0%, #1a8fff 100%)",
  },
  playlistTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#fff",
  },
  playlistMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metaText: {
    fontSize: "14px",
    color: "#aaa",
    margin: 0,
  },
  videoListContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: "500",
    marginTop: "24px",
    marginBottom: "8px",
    color: "#fff",
  },
  emptyText: {
    fontSize: "14px",
    color: "#aaa",
  },
  videoItem: {
    display: "flex",
    gap: "16px",
    padding: "12px 0",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.2s",
    alignItems: "flex-start",
  },
  videoNumber: {
    minWidth: "40px",
    fontSize: "18px",
    color: "#aaa",
    textAlign: "center",
    paddingTop: "8px",
  },
  thumbnailContainer: {
    position: "relative",
    width: "246px",
    height: "138px",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#272727",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  playIconOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s",
    pointerEvents: "none",
  },
  durationBadge: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  videoInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    paddingTop: "4px",
    minWidth: 0,
  },
  videoTitle: {
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "1.4",
    margin: 0,
    color: "#fff",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  videoMeta: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#aaa",
    marginTop: "4px",
  },
  channelName: {
    color: "#aaa",
  },
  separator: {
    color: "#aaa",
  },
  views: {
    color: "#aaa",
  },
  description: {
    fontSize: "14px",
    color: "#aaa",
    lineHeight: "1.4",
    marginTop: "8px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    margin: 0,
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .video-item:hover .play-icon-overlay {
    opacity: 1 !important;
  }
`;
document.head.appendChild(styleSheet);