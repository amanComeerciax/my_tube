// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";

// export default function History() {
//   const { user } = useContext(AuthContext);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // 🧲 Fetch Watch History
//   const fetchHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/user/watch-history", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Load History Error:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user) return navigate("/login");
//     fetchHistory();
//   }, [user]);

//   // ❌ Remove Single
//   const removeHistory = async (id) => {
//     const token = localStorage.getItem("token");
//     await axios.delete(`http://localhost:5000/api/user/watch-history/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchHistory();
//   };

//   // 🧹 Clear All
//   const clearAll = async () => {
//     const confirmDelete = window.confirm("Clear all watch history?");
//     if (!confirmDelete) return;

//     const token = localStorage.getItem("token");
//     await axios.delete("http://localhost:5000/api/user/watch-history", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchHistory();
//   };

//   if (loading) return <div style={styles.loader}>Loading...</div>;

//   if (history.length === 0)
//     return (
//       <div style={styles.empty}>
//         <h2>No Watch History</h2>
//         <p>Start watching videos 👀</p>
//       </div>
//     );

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h2>Watch History</h2>
//         <button style={styles.clearBtn} onClick={clearAll}>
//           Clear All
//         </button>
//       </div>

//       <div style={styles.list}>
//         {history.map((item) => (
//           <div key={item._id} style={styles.card}>
//             {/* Thumbnail Click → Open video */}
//             <Link to={`/watch/${item.video.filename}`}>
//               <img
//                 src={item.video.thumbnail}
//                 alt={item.video.title}
//                 style={styles.thumbnail}
//               />
//             </Link>

//             <div style={styles.details}>
//               <h3 style={styles.title}>{item.video.title}</h3>

//               <p style={styles.channel}>
//                 {item.video.uploadedBy?.name || "Unknown Channel"}
//               </p>

//               <p style={styles.date}>
//                 Watched: {new Date(item.watchedAt).toLocaleString()}
//               </p>

//               <button
//                 style={styles.removeBtn}
//                 onClick={() => removeHistory(item.video._id)}
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* 🎨 CSS in JS */
// const styles = {
//   container: { padding: "20px", color: "#fff", minHeight: "100vh", background: "#0f0f0f" },
//   header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
//   clearBtn: {
//     background: "red",
//     border: "none",
//     padding: "8px 16px",
//     borderRadius: 6,
//     cursor: "pointer",
//     color: "#fff",
//     fontWeight: 600,
//   },
//   list: { display: "flex", flexDirection: "column", gap: 20 },
//   card: { display: "flex", gap: 15, background: "#1a1a1a", borderRadius: 10, padding: 10 },
//   thumbnail: { width: 200, height: 120, borderRadius: 8, objectFit: "cover" },
//   details: { flex: 1 },
//   title: { margin: 0, fontSize: 17 },
//   channel: { color: "#aaa", fontSize: 13 },
//   date: { fontSize: 12, color: "#777" },
//   removeBtn: {
//     marginTop: 10,
//     background: "#333",
//     padding: "6px 12px",
//     borderRadius: 6,
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontSize: 13,
//   },
//   loader: { color: "#fff", padding: 40, textAlign: "center" },
//   empty: { color: "#fff", padding: 40, textAlign: "center" },
// };
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function History() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧲 Fetch Watch History
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user/watch-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Load History Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchHistory();
  }, [user]);

  // ❌ Remove Single Entry
  const removeHistory = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/user/watch-history/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHistory();
    } catch (error) {
      console.log("Remove error:", error);
    }
  };

  // 🧹 Clear All
  const clearAll = async () => {
    const confirmDelete = window.confirm("Clear all watch history?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    await axios.delete("http://localhost:5000/api/user/watch-history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHistory();
  };

  if (loading) return <div style={styles.loader}>Loading...</div>;

  if (history.length === 0)
    return (
      <div style={styles.empty}>
        <h2>No Watch History</h2>
        <p>Start watching videos 👀</p>
      </div>
    );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>Watch History</h2>
        <button style={styles.clearBtn} onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* History List */}
      <div style={styles.list}>
        {history.map((item) => (
          <div key={item._id} style={styles.card}>
            {/* Thumbnail Click → Open video */}
            <Link to={`/watch/${item.video.filename}`}>
              <img
                src={`http://localhost:5000/uploads/${item.video.thumbnail}`}
                alt={item.video.title}
                style={styles.thumbnail}
              />
            </Link>

            <div style={styles.details}>
              <h3 style={styles.title}>{item.video.title}</h3>

              <p style={styles.channel}>
                {item.video.uploadedBy?.name || "Unknown Channel"}
              </p>

              <p style={styles.date}>
                Watched: {new Date(item.watchedAt).toLocaleString()}
              </p>

              <button
                style={styles.removeBtn}
                onClick={() => removeHistory(item.video._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🎨 CSS in JS */
const styles = {
  container: {
    padding: "20px",
    color: "#fff",
    minHeight: "100vh",
    background: "#0f0f0f",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  clearBtn: {
    background: "red",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    color: "#fff",
    fontWeight: 600,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  card: {
    display: "flex",
    gap: 15,
    background: "#1a1a1a",
    borderRadius: 10,
    padding: 10,
  },

  thumbnail: {
    width: 200,
    height: 120,
    borderRadius: 8,
    objectFit: "cover",
  },

  details: { flex: 1 },

  title: {
    margin: 0,
    fontSize: 17,
  },

  channel: {
    color: "#aaa",
    fontSize: 13,
  },

  date: {
    fontSize: 12,
    color: "#777",
  },

  removeBtn: {
    marginTop: 10,
    background: "#333",
    padding: "6px 12px",
    borderRadius: 6,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
  },

  loader: {
    color: "#fff",
    padding: 40,
    textAlign: "center",
  },

  empty: {
    color: "#fff",
    padding: 40,
    textAlign: "center",
  },
};
