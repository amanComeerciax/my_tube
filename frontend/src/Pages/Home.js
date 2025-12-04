
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       const res = await axios.get("http://localhost:5000/api/videos/all");
//       setVideos(res.data);
//     };
//     fetchVideos();
//   }, []);

//   // SAME FILE STYLES
//   const styles = {
//     page: {
//       padding: "30px",
//       background: "#f7f7f7",
//       minHeight: "100vh",
//     },
//     heading: {
//       fontSize: "26px",
//       fontWeight: "bold",
//       marginBottom: "20px",
//     },
//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//       gap: "20px",
//     },
//     card: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "12px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       transition: "0.2s",
//     },
//     cardHover: {
//       transform: "scale(1.03)",
//       boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
//     },
//     videoThumb: {
//       width: "100%",
//       borderRadius: "10px",
//       marginBottom: "8px",
//     },
//     title: {
//       fontSize: "16px",
//       fontWeight: "600",
//       marginBottom: "5px",
//       color: "#333",
//     },
//     watchLink: {
//       textDecoration: "none",
//       color: "#ff0000",
//       fontWeight: "bold",
//     },
//   };

//   return (
//     <div style={styles.page}>
//       <h2 style={styles.heading}>📺 Latest Videos</h2>

//       <div style={styles.grid}>
//         {videos.map((v) => (
//           <div
//             key={v._id}
//             style={styles.card}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = styles.cardHover.transform;
//               e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
//             }}
//           >
//             <video
//               src={`http://localhost:5000/api/stream/${v.filename}`}
//               style={styles.videoThumb}
//               controls
//             ></video>

//             <p style={styles.title}>{v.title}</p>

//             <a href={`/watch/${v.filename}`} style={styles.watchLink}>
//               ▶ Watch Now
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       const res = await axios.get("http://localhost:5000/api/videos/all");
//       setVideos(res.data);
//     };
//     fetchVideos();
//   }, []);

//   // SAME FILE STYLES
//   const styles = {
//     page: {
//       padding: "30px",
//       background: "#f7f7f7",
//       minHeight: "100vh",
//     },
//     heading: {
//       fontSize: "26px",
//       fontWeight: "bold",
//       marginBottom: "20px",
//     },
//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//       gap: "20px",
//     },
//     card: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "12px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       transition: "0.2s",
//       cursor: "pointer",
//     },
//     cardHover: {
//       transform: "scale(1.03)",
//       boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
//     },
//     thumbnail: {
//       width: "100%",
//       height: "160px",
//       objectFit: "cover",
//       borderRadius: "10px",
//       marginBottom: "8px",
//       background: "#ddd",
//     },
//     title: {
//       fontSize: "16px",
//       fontWeight: "600",
//       marginBottom: "5px",
//       color: "#333",
//     },
//     watchLink: {
//       textDecoration: "none",
//       color: "#ff0000",
//       fontWeight: "bold",
//     },
//   };

//   return (
//     <div style={styles.page}>
//       <h2 style={styles.heading}>📺 Latest Videos</h2>

//       <div style={styles.grid}>
//         {videos.map((v) => (
//           <div
//             key={v._id}
//             style={styles.card}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = styles.cardHover.transform;
//               e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow =
//                 "0 4px 12px rgba(0,0,0,0.1)";
//             }}
//           >
//             {/* Thumbnail */}
//             <img
//               src={`http://localhost:5000/uploads/${v.thumbnail}`}
//               style={styles.thumbnail}
//               alt="Video Thumbnail"
//             />

//             {/* Title */}
//             <p style={styles.title}>{v.title}</p>

//             {/* Watch Link */}
//             <a href={`/watch/${v.filename}`} style={styles.watchLink}>
//               ▶ Watch Now
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const fetchVideos = async () => {
//       const res = await axios.get("http://localhost:5000/api/videos/all");
//       setVideos(res.data);
//     };
//     fetchVideos();
//   }, []);

//   // SAME FILE STYLES
//   const styles = {
//     navbar: {
//       width: "100%",
//       padding: "15px 25px",
//       background: "#ffffff",
//       boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       position: "sticky",
//       top: 0,
//       zIndex: 10,
//     },

//     logo: {
//       fontSize: "28px",
//       fontWeight: "bold",
//       color: "#ff0000",
//       cursor: "pointer",
//       width: "150px",
//     },

//     centerBox: {
//       display: "flex",
//       justifyContent: "center",
//       flex: 1,
//     },

//     searchBox: {
//       width: "600px",
//       padding: "10px 15px",
//       border: "1px solid #ccc",
//       borderRadius: "25px",
//       fontSize: "15px",
//       outline: "none",
//     },

//     rightSpace: {
//       width: "150px",
//     },

//     page: {
//       padding: "30px",
//       background: "#f7f7f7",
//       minHeight: "100vh",
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//       gap: "20px",
//     },

//     card: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "12px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       transition: "0.2s",
//       cursor: "pointer",
//     },

//     cardHover: {
//       transform: "scale(1.03)",
//       boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
//     },

//     thumbnail: {
//       width: "100%",
//       height: "160px",
//       objectFit: "cover",
//       borderRadius: "10px",
//       marginBottom: "8px",
//     },

//     title: {
//       fontSize: "16px",
//       fontWeight: "600",
//       marginBottom: "5px",
//       color: "#333",
//     },

//     watchLink: {
//       textDecoration: "none",
//       color: "#ff0000",
//       fontWeight: "bold",
//     },
//   };

//   // FILTER VIDEOS BASED ON SEARCH
//   const filteredVideos = videos.filter((v) =>
//     v.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       {/* NAVBAR */}
//       <div style={styles.navbar}>
//         <div style={styles.logo}>MyTube</div>

//         <div style={styles.centerBox}>
//           <input
//             type="text"
//             placeholder="Search videos..."
//             style={styles.searchBox}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div style={styles.rightSpace}></div>
//       </div>

//       {/* PAGE CONTENT */}
//       <div style={styles.page}>
//         <h2>📺 Latest Videos</h2>

//         <div style={styles.grid}>
//           {filteredVideos.map((v) => (
//             <div
//               key={v._id}
//               style={styles.card}
//               onMouseOver={(e) => {
//                 e.currentTarget.style.transform = styles.cardHover.transform;
//                 e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
//               }}
//               onMouseOut={(e) => {
//                 e.currentTarget.style.transform = "scale(1)";
//                 e.currentTarget.style.boxShadow =
//                   "0 4px 12px rgba(0,0,0,0.1)";
//               }}
//             >
//               <img
//                 src={`http://localhost:5000/uploads/${v.thumbnail}`}
//                 style={styles.thumbnail}
//                 alt="Video Thumbnail"
//               />

//               <p style={styles.title}>{v.title}</p>

//               <a href={`/watch/${v.filename}`} style={styles.watchLink}>
//                 ▶ Watch Now
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const fetchVideos = async () => {
//       const res = await axios.get("http://localhost:5000/api/videos/all");
//       setVideos(res.data);
//     };
//     fetchVideos();
//   }, []);

//   // SAME FILE STYLES — YouTube Layout
//   const styles = {
//     navbar: {
//       width: "100%",
//       padding: "15px 25px",
//       background: "#ffffff",
//       boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       position: "sticky",
//       top: 0,
//       zIndex: 10,
//     },

//     logo: {
//       fontSize: "28px",
//       fontWeight: "bold",
//       color: "#ff0000",
//       cursor: "pointer",
//       width: "150px",
//     },

//     centerBox: {
//       display: "flex",
//       justifyContent: "center",
//       flex: 1,
//     },

//     searchBox: {
//       width: "600px",
//       padding: "12px 20px",
//       border: "1px solid #ccc",
//       borderRadius: "25px",
//       fontSize: "16px",
//       outline: "none",
//     },

//     rightSpace: {
//       width: "150px",
//     },

//     page: {
//       padding: "25px",
//       background: "#f7f7f7",
//       minHeight: "100vh",
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//       gap: "40px",
//     },

//     card: {
//       background: "transparent",
//       cursor: "pointer",
//       transition: "0.2s",
//     },

//     cardHover: {
//       transform: "scale(1.02)",
//     },

//     thumbnail: {
//       width: "100%",
//       height: "220px",
//       objectFit: "cover",
//       borderRadius: "12px",
//       marginBottom: "10px",
//       boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
//     },

//     title: {
//       fontSize: "17px",
//       fontWeight: "600",
//       color: "#111",
//       marginBottom: "6px",
//       lineHeight: "1.3",
//       display: "-webkit-box",
//       WebkitLineClamp: 2,
//       WebkitBoxOrient: "vertical",
//       overflow: "hidden",
//     },

//     watchLink: {
//       textDecoration: "none",
//       color: "#ff0000",
//       fontWeight: "bold",
//       fontSize: "14px",
//     },
//   };

//   // FILTER VIDEOS BASED ON SEARCH
//   const filteredVideos = videos.filter((v) =>
//     v.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       {/* NAVBAR */}
//       <div style={styles.navbar}>
//         <div style={styles.logo}>MyTube</div>

//         <div style={styles.centerBox}>
//           <input
//             type="text"
//             placeholder="Search videos..."
//             style={styles.searchBox}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div style={styles.rightSpace}></div>
//       </div>

//       {/* PAGE CONTENT */}
//       <div style={styles.page}>
//         <div style={styles.grid}>
//           {filteredVideos.map((v) => (
//             <div
//               key={v._id}
//               style={styles.card}
//               onMouseOver={(e) => {
//                 e.currentTarget.style.transform = styles.cardHover.transform;
//               }}
//               onMouseOut={(e) => {
//                 e.currentTarget.style.transform = "scale(1)";
//               }}
//             >
//               {/* Thumbnail */}
//               <img
//                 src={`http://localhost:5000/uploads/${v.thumbnail}`}
//                 style={styles.thumbnail}
//                 alt="Video Thumbnail"
//               />

//               {/* Title */}
//               <p style={styles.title}>{v.title}</p>

//               {/* Watch Link */}
//               <a href={`/watch/${v.filename}`} style={styles.watchLink}>
//                 ▶ Watch Now
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);

//   // Fetch all videos
//   const fetchVideos = async () => {
//     const res = await axios.get("http://localhost:5000/api/videos/all");
//     setVideos(res.data);
//     setFiltered(res.data);
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // Fuzzy Search (Live Search)
//   useEffect(() => {
//     const searchVideos = async () => {
//       if (search.trim() === "") {
//         setFiltered(videos);
//         return;
//       }

//       const res = await axios.get(
//         `http://localhost:5000/api/search?query=${search}`
//       );

//       setFiltered(res.data);
//     };

//     searchVideos();
//   }, [search, videos]);

//   // Styles
//   const styles = {
//     navbar: {
//       width: "100%",
//       padding: "15px 25px",
//       background: "#ffffff",
//       boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       position: "sticky",
//       top: 0,
//       zIndex: 10,
//     },

//     logo: {
//       fontSize: "26px",
//       fontWeight: "bold",
//       color: "#ff0000",
//       cursor: "pointer",
//     },

//     centerBox: {
//       flex: 1,
//       display: "flex",
//       justifyContent: "center",
//     },

//     searchBox: {
//       width: "600px",
//       padding: "12px 18px",
//       border: "1px solid #ccc",
//       borderRadius: "25px",
//       fontSize: "16px",
//       outline: "none",
//     },

//     page: {
//       padding: "30px",
//       background: "#f7f7f7",
//       minHeight: "100vh",
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
//       gap: "25px",
//       marginTop: "20px",
//     },

//     card: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "10px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       cursor: "pointer",
//       transition: "0.2s ease",
//     },

//     thumbnail: {
//       width: "100%",
//       height: "190px",
//       objectFit: "cover",
//       borderRadius: "10px",
//       marginBottom: "10px",
//       background: "#ddd",
//     },

//     title: {
//       fontSize: "16px",
//       fontWeight: "600",
//       marginBottom: "8px",
//       color: "#333",
//     },

//     watchBtn: {
//       textDecoration: "none",
//       color: "#ff0000",
//       fontWeight: "bold",
//     },
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <div style={styles.navbar}>
//         <div style={styles.logo}>MyTube</div>

//         <div style={styles.centerBox}>
//           <input
//             type="text"
//             placeholder="Search videos..."
//             style={styles.searchBox}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div style={{ width: "150px" }}></div>
//       </div>

//       {/* PAGE CONTENT */}
//       <div style={styles.page}>
//         <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>📺 Latest Videos</h2>

//         <div style={styles.grid}>
//           {filtered.map((v) => (
//             <div key={v._id} style={styles.card}>
//               <img
//                 src={`http://localhost:5000/uploads/${v.thumbnail}`}
//                 style={styles.thumbnail}
//                 alt="thumb"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/310x190?text=No+Thumbnail";
//                 }}
//               />

//               <p style={styles.title}>{v.title}</p>

//               <a href={`/watch/${v.filename}`} style={styles.watchBtn}>
//                 ▶ Watch Now
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);

//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Fetch all videos
//   const fetchVideos = async () => {
//     const res = await axios.get("http://localhost:5000/api/videos/all");
//     setVideos(res.data);
//     setFiltered(res.data);
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // Fuzzy Search (live)
//   useEffect(() => {
//     const searchVideos = async () => {
//       if (search.trim() === "") {
//         setFiltered(videos);
//         return;
//       }
//       const res = await axios.get(
//         `http://localhost:5000/api/search?query=${search}`
//       );
//       setFiltered(res.data);
//     };
//     searchVideos();
//   }, [search, videos]);

//   // Styles
//   const styles = {
//     navbar: {
//       width: "100%",
//       padding: "15px 25px",
//       background: "#ffffff",
//       boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       position: "sticky",
//       top: 0,
//       zIndex: 10,
//     },

//     logo: {
//       fontSize: "26px",
//       fontWeight: "bold",
//       color: "#ff0000",
//       cursor: "pointer",
//     },

//     centerBox: {
//       flex: 1,
//       display: "flex",
//       justifyContent: "center",
//     },

//     searchBox: {
//       width: "600px",
//       padding: "12px 18px",
//       border: "1px solid #ccc",
//       borderRadius: "25px",
//       fontSize: "16px",
//       outline: "none",
//     },

//     authBtn: {
//       padding: "16px 32px",
//       background: "#ff0000",
//       color: "#fff",
//       fontWeight: "bold",
//       border: "none",
//       borderRadius: "12px",
//       cursor: "pointer",
//       boxShadow: "0 6px 0 #c00",        // dark red shadow neeche
//       transform: "translateY(-4px)",
//       transition: "all 0.18s ease",
      
//       // Hover pe aur upar
//       "&:hover": {
//         transform: "translateY(-6px)",
//         boxShadow: "0 12px 0 #c00",
//       },
      
//       // Click pe neeche dab jaaye (real button feel)
//       "&:active": {
//         transform: "translateY(2px)",
//         boxShadow: "0 2px 0 #c00",
//       },
//     },

//     page: {
//       padding: "30px",
//       background: "#f7f7f7",
//       minHeight: "100vh",
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
//       gap: "25px",
//       marginTop: "20px",
//     },

//     card: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "10px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       cursor: "pointer",
//       transition: "0.2s ease",
//     },

//     thumbnail: {
//       width: "100%",
//       height: "190px",
//       objectFit: "cover",
//       borderRadius: "10px",
//       marginBottom: "10px",
//       background: "#ddd",
//     },

//     title: {
//       fontSize: "16px",
//       fontWeight: "600",
//       marginBottom: "8px",
//       color: "#333",
//     },

//     watchBtn: {
//       textDecoration: "none",
//       color: "#ff0000",
//       fontWeight: "bold",
//     },
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <div style={styles.navbar}>
//         <div style={styles.logo} onClick={() => navigate("/")}>MyTube</div>

//         <div style={styles.centerBox}>
//           <input
//             type="text"
//             placeholder="Search videos..."
//             style={styles.searchBox}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* 🔐 LOGIN / LOGOUT BUTTON */}
//         <div>
//           {user ? (
//             <button
//               style={styles.authBtn}
//               onClick={() => {
//                 logout();
//                 navigate("/");
//               }}
//             >
//               Logout
//             </button>
//           ) : (
//             <button
//               style={styles.authBtn}
//               onClick={() => navigate("/login")}
//             >
//               Login
//             </button>
//           )}
//         </div>
//       </div>

//       {/* PAGE CONTENT */}
//       <div style={styles.page}>
//         <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>
//           📺 Latest Videos
//         </h2>

//         <div style={styles.grid}>
//           {filtered.map((v) => (
//             <div key={v._id} style={styles.card}>
//               <img
//                 src={`http://localhost:5000/uploads/${v.thumbnail}`}
//                 style={styles.thumbnail}
//                 alt="thumb"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/310x190?text=No+Thumbnail";
//                 }}
//               />

//               <p style={styles.title}>{v.title}</p>

//               <a href={`/watch/${v.filename}`} style={styles.watchBtn}>
            

//                 ▶ Watch Now
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const [videos, setVideos] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);

//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Fetch all videos
//   const fetchVideos = async () => {
//     const res = await axios.get("http://localhost:5000/api/videos/all");
//     setVideos(res.data);
//     setFiltered(res.data);
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // Fuzzy Search
//   useEffect(() => {
//     const searchVideos = async () => {
//       if (search.trim() === "") {
//         setFiltered(videos);
//         return;
//       }
//       const res = await axios.get(
//         `http://localhost:5000/api/search?query=${search}`
//       );
//       setFiltered(res.data);
//     };
//     searchVideos();
//   }, [search, videos]);

//   // Styles
//   const styles = {
//     navbar: {
//       width: "100%",
//       padding: "15px 25px",
//       background: "#ffffff",
//       boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       position: "sticky",
//       top: 0,
//       zIndex: 10,
//     },

//     logo: {
//       fontSize: "26px",
//       fontWeight: "bold",
//       color: "#ff0000",
//       cursor: "pointer",
//     },

//     centerBox: {
//       flex: 1,
//       display: "flex",
//       justifyContent: "center",
//     },

//     searchBox: {
//       width: "600px",
//       padding: "12px 18px",
//       border: "1px solid #ccc",
//       borderRadius: "25px",
//       fontSize: "16px",
//       outline: "none",
//     },

//     navRight: {
//       display: "flex",
//       alignItems: "center",
//       gap: "15px",
//     },

//     profileBtn: {
//       fontWeight: "600",
//       cursor: "pointer",
//       textDecoration: "none",
//       color: "#000",
//     },

//     authBtn: {
//       padding: "12px 22px",
//       background: "#ff0000",
//       color: "#fff",
//       fontWeight: "bold",
//       border: "none",
//       borderRadius: "12px",
//       cursor: "pointer",
//       boxShadow: "0 6px 0 #c00",
//       transform: "translateY(-4px)",
//       transition: "all 0.18s ease",
//     },

//     page: {
//       padding: "30px",
//       background: "#f7f7f7",
//       minHeight: "100vh",
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
//       gap: "25px",
//       marginTop: "20px",
//     },

//     card: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "10px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       cursor: "pointer",
//       transition: "0.2s ease",
//     },

//     thumbnail: {
//       width: "100%",
//       height: "190px",
//       objectFit: "cover",
//       borderRadius: "10px",
//       marginBottom: "10px",
//       background: "#ddd",
//     },

//     title: {
//       fontSize: "16px",
//       fontWeight: "600",
//       marginBottom: "8px",
//       color: "#333",
//     },

//     watchBtn: {
//       textDecoration: "none",
//       color: "#ff0000",
//       fontWeight: "bold",
//     },
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <div style={styles.navbar}>
//         <div style={styles.logo} onClick={() => navigate("/")}>MyTube</div>

//         <div style={styles.centerBox}>
//           <input
//             type="text"
//             placeholder="Search videos..."
//             style={styles.searchBox}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div style={styles.navRight}>
//           {/* Profile Button (only when logged in) */}
//           {user && (
//             <span
//               style={styles.profileBtn}
//               onClick={() => navigate("/profile")}
//             >
//               👤 Profile
//             </span>
//           )}
// {user && (
//   <span 
//     style={{ fontWeight: "600", cursor: "pointer" }}
//     onClick={() => navigate("/UserUpload")}
//   >
//     ➕ Upload
//   </span>
// )}

//           {/* LOGIN / LOGOUT Button */}
//           {user ? (
//             <button
//               style={styles.authBtn}
//               onClick={() => {
//                 logout();
//                 navigate("/");
//               }}
//             >
//               Logout
//             </button>
//           ) : (
//             <button style={styles.authBtn} onClick={() => navigate("/login")}>
//               Login
//             </button>
//           )}
//         </div>
//       </div>

//       {/* PAGE CONTENT */}
//       <div style={styles.page}>
//         <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>
//           📺 Latest Videos
//         </h2>

//         <div style={styles.grid}>
//           {filtered.map((v) => (
//             <div key={v._id} style={styles.card}>
//               <img
//                 src={`http://localhost:5000/uploads/${v.thumbnail}`}
//                 style={styles.thumbnail}
//                 alt="thumb"
//               />

//               <p style={styles.title}>{v.title}</p>

//               <a href={`/watch/${v.filename}`} style={styles.watchBtn}>
//                 ▶ Watch Now
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos/all");
    setVideos(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const searchVideos = async () => {
      if (search.trim() === "") {
        setFiltered(videos);
        return;
      }
      const res = await axios.get(
        `http://localhost:5000/api/search?query=${search}`
      );
      setFiltered(res.data);
    };
    searchVideos();
  }, [search, videos]);

  return (
    <>
      {/* NAVBAR - Modern YouTube Style */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo" onClick={() => navigate("/")}>
            MyTube
          </h1>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="nav-right">
          {user && (
            <>
              <button
                className="icon-btn"
                onClick={() => navigate("/UserUpload")}
                title="Upload"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M14 13h-4v4H8v-4H4v-2h4V7h2v4h4v2zm-2-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm6 16H6V6h12v14z"
                  />
                </svg>
              </button>

              <button
                className="profile-btn"
                onClick={() => navigate("/profile")}
              >
                <div className="avatar">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>
            </>
          )}

          {user ? (
            <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h2 className="section-title">Latest Videos</h2>

        {filtered.length === 0 ? (
          <p className="no-videos">No videos found...</p>
        ) : (
          <div className="video-grid">
            {filtered.map((v) => (
              <div
                key={v._id}
                className="video-card"
                onClick={() => navigate(`/watch/${v.filename}`)}
              >
                <div className="thumbnail-wrapper">
                  <img
                    src={`http://localhost:5000/uploads/${v.thumbnail}`}
                    alt={v.title}
                    className="thumbnail"
                  />
                  <div className="play-overlay">
                    <svg viewBox="0 0 72 72" width="48" height="48">
                      <circle cx="36" cy="36" r="34" fill="rgba(0,0,0,0.6)" />
                      <path
                        fill="#fff"
                        d="M28 24l24 12-24 12z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="video-info">
                  <h3 className="video-title">{v.title}</h3>
                  <p className="video-meta">
                    {v.views || 0} views • {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Inline CSS (You can move this to a separate CSS file later) */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Roboto, sans-serif;
          background: #0f0f0f;
          color: #fff;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(12px);
          padding: 0 20px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #333;
        }

        .nav-left .logo {
          font-size: 28px;
          font-weight: 800;
          color: #ff0033;
          cursor: pointer;
          letter-spacing: -1px;
        }

        .nav-center {
          flex: 1;
          max-width: 720px;
          margin: 0 40px;
        }

        .search-container {
          display: flex;
          height: 46px;
          background: #1f1f1f;
          border-radius: 50px;
          overflow: hidden;
          border: 1px solid #333;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .search-input {
          flex: 1;
          padding: 0 20px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 16px;
          outline: none;
        }

        .search-btn {
          width: 64px;
          background: #333;
          border: none;
          color: #aaa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .search-btn:hover {
          background: #ff0033;
          color: white;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .icon-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ff0033, #ff6b6b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          color: white;
        }

        .login-btn, .logout-btn {
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .login-btn {
          background: #ff0033;
          color: white;
        }

        .logout-btn {
          background: transparent;
          color: #ff0033;
          border: 2px solid #ff0033 !important;
        }

        .login-btn:hover {
          background: #e6002e;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255,0,51,0.3);
        }

        .logout-btn:hover {
          background: rgba(255,0,51,0.1);
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 20px;
        }

        .section-title {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 30px;
          color: #fff;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .video-card {
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .video-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }

        .video-card:hover .thumbnail {
          transform: scale(1.08);
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .video-card:hover .play-overlay {
          opacity: 1;
        }

        .video-info {
          padding: 14px;
        }

        .video-title {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-meta {
          font-size: 13px;
          color: #aaa;
        }

        .no-videos {
          text-align: center;
          padding: 60px;
          font-size: 20px;
          color: #666;
        }

        @media (max-width: 768px) {
          .nav-center {
            display: none;
          }
          .video-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}