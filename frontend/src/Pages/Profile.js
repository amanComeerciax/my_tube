// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// export default function Profile() {
//   const { user } = useContext(AuthContext);
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const loadProfile = async () => {
//     const token = localStorage.getItem("token");
//     const res = await axios.get("http://localhost:5000/api/user/profile", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setVideos(res.data.videos);
//   };

//   if (!user) return <h2>Login required</h2>;

//   const s = {
//     box: { padding: "30px" },
//     card: {
//       background: "#fff",
//       padding: "10px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//       width: "260px",
//     },
//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//       gap: "20px",
//     },
//     thumb: {
//       width: "100%",
//       height: "140px",
//       borderRadius: "10px",
//       objectFit: "cover",
//     },
//   };

//   return (
//     <div style={s.box}>
//       <h2>👤 Profile</h2>
//       <p><b>Name:</b> {user.name}</p>
//       <p><b>Email:</b> {user.email}</p>

//       <h2 style={{ marginTop: "20px" }}>📦 Your Uploaded Videos</h2>

//       <div style={s.grid}>
//         {videos.map((v) => (
//           <div key={v._id} style={s.card}>
//             <img src={`http://localhost:5000/uploads/${v.thumbnail}`} style={s.thumb} alt="thumb" />
//             <p><b>{v.title}</b></p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Profile() {
//   const { user } = useContext(AuthContext);
//   const [videos, setVideos] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const loadProfile = async () => {
//     const token = localStorage.getItem("token");
//     const res = await axios.get("http://localhost:5000/api/user/profile", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setVideos(res.data.videos);
//   };

//   if (!user) return <h2 style={{ padding: 20 }}>Login required</h2>;

//   // 🎨 Styles
//   const s = {
//     box: { padding: "30px", background: "#f8f8f8", minHeight: "100vh" },

//     profileCard: {
//       display: "flex",
//       alignItems: "center",
//       gap: "20px",
//       padding: "20px",
//       background: "#fff",
//       borderRadius: "14px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       maxWidth: "500px",
//       marginBottom: "30px",
//     },

//     avatar: {
//       width: "70px",
//       height: "70px",
//       borderRadius: "50%",
//       objectFit: "cover",
//       border: "2px solid #ff0000",
//     },

//     uploadBtn: {
//       padding: "8px 16px",
//       background: "#ff0000",
//       color: "#fff",
//       borderRadius: "8px",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: 600,
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
//       gap: "25px",
//     },

//     card: {
//       background: "#fff",
//       padding: "12px",
//       borderRadius: "12px",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//       transition: "0.25s ease",
//       cursor: "pointer",
//     },

//     cardHover: {
//       transform: "scale(1.03)",
//       boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//     },

//     thumb: {
//       width: "100%",
//       height: "170px",
//       borderRadius: "10px",
//       objectFit: "cover",
//       marginBottom: "10px",
//     },

//     title: { fontWeight: 600, marginBottom: "6px" },
//     views: { fontSize: "13px", color: "#777" },
//   };

//   return (
//     <div style={s.box}>
//       {/* 👤 PROFILE CARD */}
//       <div style={s.profileCard}>
//         <img
//           src={
//             user.avatar ||
//             "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//           }
//           alt="avatar"
//           style={s.avatar}
//         />

//         <div>
//           <h2 style={{ margin: 0 }}>{user.name}</h2>
//           <p style={{ margin: "3px 0", color: "#555" }}>{user.email}</p>

//           <button style={s.uploadBtn} onClick={() => navigate("/UserUpload")}>
//             ⬆ Upload Video
//           </button>
//         </div>
//       </div>

//       {/* 🎥 USER VIDEOS */}
//       <h3 style={{ marginBottom: "10px" }}>📦 Your Uploaded Videos</h3>

//       <div style={s.grid}>
//         {videos.map((v) => (
//           <div
//             key={v._id}
//             style={s.card}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = s.cardHover.transform;
//               e.currentTarget.style.boxShadow = s.cardHover.boxShadow;
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow =
//                 "0 2px 10px rgba(0,0,0,0.1)";
//             }}
//             onClick={() => navigate(`/watch/${v.filename}`)}
//           >
//             <img
//               src={`http://localhost:5000/uploads/${v.thumbnail}`}
//               style={s.thumb}
//               alt="thumb"
//             />

//             <p style={s.title}>{v.title}</p>
//             <p style={s.views}>👁 {v.views} views</p>
//           </div>
//         ))}

//         {videos.length === 0 && <p>No uploads yet.</p>}
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// export default function Profile() {
//   const { user } = useContext(AuthContext);
//   const [profileUser, setProfileUser] = useState(null); // profile owner
//   const [videos, setVideos] = useState([]);
//   const [subscribed, setSubscribed] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams(); // channel id

//   useEffect(() => {
//     loadProfile();
//   }, [id]);

//   const loadProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       // if id exists → other's channel | else → current user
//       const route = id
//         ? `http://localhost:5000/api/user/profile/${id}`
//         : `http://localhost:5000/api/user/profile`;

//       const res = await axios.get(route, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setProfileUser(res.data.user);
//       setVideos(res.data.videos);
//       setSubscribed(res.data.isSubscribed);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ⭐ Subscribe / Unsubscribe
//   const toggleSubscribe = async () => {
//     if (!user) return alert("Login first");
//     const token = localStorage.getItem("token");

//     const route = subscribed ? "unsubscribe" : "subscribe";

//     await axios.post(
//       `http://localhost:5000/api/subscribe/${route}/${profileUser._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setSubscribed(!subscribed);
//     loadProfile();
//   };

//   if (!profileUser) return <h2 style={{ padding: 20 }}>Loading...</h2>;

//   // 🎨 Styles
//   const s = {
//     box: { padding: "30px", background: "#fafafa", minHeight: "100vh" },

//     profileCard: {
//       display: "flex",
//       alignItems: "center",
//       gap: "20px",
//       padding: "20px",
//       background: "#fff",
//       borderRadius: "14px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       marginBottom: "30px",
//     },

//     avatar: {
//       width: "80px",
//       height: "80px",
//       borderRadius: "50%",
//       objectFit: "cover",
//       border: "2px solid #ff0000",
//     },

//     subscribeBtn: {
//       padding: "8px 18px",
//       background: subscribed ? "#444" : "#ff0000",
//       color: "#fff",
//       borderRadius: "8px",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: 600,
//       marginTop: "10px",
//     },

//     uploadBtn: {
//       padding: "8px 18px",
//       background: "#007bff",
//       color: "#fff",
//       borderRadius: "8px",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: 600,
//       marginTop: "10px",
//     },

//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
//       gap: "25px",
//     },

//     card: {
//       background: "#fff",
//       padding: "12px",
//       borderRadius: "12px",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//       cursor: "pointer",
//       transition: ".25s",
//     },

//     thumb: {
//       width: "100%",
//       height: "170px",
//       borderRadius: "10px",
//       objectFit: "cover",
//       marginBottom: "10px",
//     },
//   };

//   return (
//     <div style={s.box}>
//       {/* 👤 CHANNEL PROFILE */}
//       <div style={s.profileCard}>
//         <img
//           src={
//             profileUser.avatar ||
//             "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//           }
//           alt="avatar"
//           style={s.avatar}
//         />

//         <div>
//           <h2 style={{ margin: 0 }}>{profileUser.name}</h2>
//           <p style={{ margin: "3px 0", color: "#555" }}>{profileUser.email}</p>
//           <p style={{ margin: "3px 0", fontWeight: 600 }}>
//             🔔 Subscribers: {profileUser.subscribers?.length || 0}
//           </p>

//           {user && user._id === profileUser._id ? (
//             // Only show upload for owner
//             <button style={s.uploadBtn} onClick={() => navigate("/UserUpload")}>
//               ⬆ Upload Video
//             </button>
//           ) : (
//             <button style={s.subscribeBtn} onClick={toggleSubscribe}>
//               {subscribed ? "✓ Subscribed" : "🔔 Subscribe"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* 🎥 USER VIDEOS */}
//       <h3 style={{ marginBottom: "10px" }}>📦 Videos by {profileUser.name}</h3>

//       <div style={s.grid}>
//         {videos.map((v) => (
//           <div
//             key={v._id}
//             style={s.card}
//             onClick={() => navigate(`/watch/${v.filename}`)}
//           >
//             <img
//               src={`http://localhost:5000/uploads/${v.thumbnail}`}
//               style={s.thumb}
//               alt="thumb"
//             />

//             <p style={{ fontWeight: 600 }}>{v.title}</p>
//             <p style={{ color: "#777", fontSize: 13 }}>👁 {v.views} views</p>
//           </div>
//         ))}

//         {videos.length === 0 && <p>No uploads yet.</p>}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // channel id

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const route = id
        ? `http://localhost:5000/api/user/profile/${id}`
        : `http://localhost:5000/api/user/profile`;

      const res = await axios.get(route, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileUser(res.data);
      setVideos(res.data.videos);
      setSubscribed(res.data.subscribers?.includes(user?._id) || false);
    } catch (err) {
      console.log(err);
    }
  };

  // ⭐ Subscribe To Channel
  const toggleSubscribe = async () => {
    if (!user) return alert("Login first");
    const token = localStorage.getItem("token");

    await axios.post(
      `http://localhost:5000/api/user/subscribe/${profileUser._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSubscribed(!subscribed);
  };

  if (!profileUser) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  // 🎨 STYLES
  const s = {
    box: { padding: "30px", background: "#fafafa", minHeight: "100vh" },

    profileCard: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      padding: "20px",
      background: "#fff",
      borderRadius: "14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      marginBottom: "30px",
    },

    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #ff0000",
    },

    subscribeBtn: {
      padding: "10px 22px",
      background: subscribed ? "#222" : "#ff0000",
      color: "#fff",
      borderRadius: "25px",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "15px",
      marginTop: "12px",
    },

    uploadBtn: {
      padding: "10px 22px",
      background: "#007bff",
      color: "#fff",
      borderRadius: "25px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      marginTop: "12px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "25px",
    },

    card: {
      background: "#fff",
      padding: "12px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: ".25s",
    },

    cardHover: {
      transform: "scale(1.03)",
      boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
    },

    thumb: {
      width: "100%",
      height: "170px",
      borderRadius: "10px",
      objectFit: "cover",
      marginBottom: "10px",
    },
  };

  return (
    <div style={s.box}>
      {/* 👤 CHANNEL HEADER */}
      <div style={s.profileCard}>
        <img
          src={
            profileUser.avatar?.trim()
              ? profileUser.avatar
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          style={s.avatar}
        />

        <div>
          <h2 style={{ margin: 0 }}>{profileUser.name}</h2>
          <p style={{ margin: "3px 0", color: "#555" }}>{profileUser.email}</p>
          <p style={{ margin: "3px 0", fontWeight: 600 }}>
            🔔 Subscribers: {profileUser.subscribers?.length || 0}
          </p>

          {user && user._id === profileUser._id ? (
            <button style={s.uploadBtn} onClick={() => navigate("/UserUpload")}>
              ⬆ Upload Video
            </button>
          ) : (
            <button style={s.subscribeBtn} onClick={toggleSubscribe}>
              {subscribed ? "✓ Subscribed" : "🔔 Subscribe"}
            </button>
          )}
        </div>
      </div>

      {/* 🎥 VIDEO GRID */}
      <h3 style={{ marginBottom: "10px" }}>📦 Videos by {profileUser.name}</h3>

      <div style={s.grid}>
        {videos.map((v) => (
          <div
            key={v._id}
            style={s.card}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = s.cardHover.transform;
              e.currentTarget.style.boxShadow = s.cardHover.boxShadow;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            }}
            onClick={() => navigate(`/watch/${v.filename}`)}
          >
            <img
              src={`http://localhost:5000/uploads/${v.thumbnail}`}
              style={s.thumb}
              alt="thumb"
            />
            <p style={{ fontWeight: 600 }}>{v.title}</p>
            <p style={{ color: "#777", fontSize: 13 }}>👁 {v.views} views</p>
          </div>
        ))}

        {videos.length === 0 && <p>No uploads yet.</p>}
      </div>
    </div>
  );
}
