// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function LikedVideos() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchLikedVideos();
//   }, []);

//   const fetchLikedVideos = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         "http://localhost:5000/api/videos/liked-videos",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setVideos(res.data || []);
//     } catch (err) {
//       console.error("❌ Failed to load liked videos", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div style={styles.center}>Loading liked videos...</div>;
//   }

//   if (videos.length === 0) {
//     return <div style={styles.center}>❤️ No liked videos yet</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>❤️ Liked Videos</h2>

//       <div style={styles.grid}>
//         {videos.map((video) => (
//           <div
//             key={video._id}
//             style={styles.card}
//             onClick={() => navigate(`/watch/${video.filename}`)}
//           >
//             <img
//               src={`http://localhost:5000/uploads/${video.thumbnail}`}
//               alt={video.title}
//               style={styles.thumb}
//             />

//             <div style={styles.info}>
//               <h4 style={styles.title}>{video.title}</h4>

//               <div style={styles.meta}>
//                 <span>{video.uploadedBy?.name}</span>
//                 <span>• {video.views || 0} views</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* =====================
//    🎨 INLINE STYLES
// ===================== */
// const styles = {
//   container: {
//     padding: "20px",
//     color: "#fff",
//   },
//   heading: {
//     marginBottom: "20px",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//     gap: "20px",
//   },
//   card: {
//     background: "#181818",
//     borderRadius: "10px",
//     overflow: "hidden",
//     cursor: "pointer",
//     transition: "transform 0.2s ease",
//   },
//   thumb: {
//     width: "100%",
//     height: "160px",
//     objectFit: "cover",
//   },
//   info: {
//     padding: "10px",
//   },
//   title: {
//     fontSize: "15px",
//     marginBottom: "6px",
//   },
//   meta: {
//     fontSize: "12px",
//     color: "#aaa",
//     display: "flex",
//     gap: "6px",
//   },
//   center: {
//     marginTop: "60px",
//     textAlign: "center",
//     fontSize: "18px",
//     color: "#aaa",
//   },
// };
