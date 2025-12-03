
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


import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Fetch all videos
  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos/all");
    setVideos(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Fuzzy Search (Live Search)
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

  // Styles
  const styles = {
    navbar: {
      width: "100%",
      padding: "15px 25px",
      background: "#ffffff",
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },

    logo: {
      fontSize: "26px",
      fontWeight: "bold",
      color: "#ff0000",
      cursor: "pointer",
    },

    centerBox: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
    },

    searchBox: {
      width: "600px",
      padding: "12px 18px",
      border: "1px solid #ccc",
      borderRadius: "25px",
      fontSize: "16px",
      outline: "none",
    },

    page: {
      padding: "30px",
      background: "#f7f7f7",
      minHeight: "100vh",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
      gap: "25px",
      marginTop: "20px",
    },

    card: {
      background: "#fff",
      borderRadius: "12px",
      padding: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "0.2s ease",
    },

    thumbnail: {
      width: "100%",
      height: "190px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "10px",
      background: "#ddd",
    },

    title: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#333",
    },

    watchBtn: {
      textDecoration: "none",
      color: "#ff0000",
      fontWeight: "bold",
    },
  };

  return (
    <>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo}>MyTube</div>

        <div style={styles.centerBox}>
          <input
            type="text"
            placeholder="Search videos..."
            style={styles.searchBox}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ width: "150px" }}></div>
      </div>

      {/* PAGE CONTENT */}
      <div style={styles.page}>
        <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>📺 Latest Videos</h2>

        <div style={styles.grid}>
          {filtered.map((v) => (
            <div key={v._id} style={styles.card}>
              <img
                src={`http://localhost:5000/uploads/${v.thumbnail}`}
                style={styles.thumbnail}
                alt="thumb"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/310x190?text=No+Thumbnail";
                }}
              />

              <p style={styles.title}>{v.title}</p>

              <a href={`/watch/${v.filename}`} style={styles.watchBtn}>
                ▶ Watch Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
