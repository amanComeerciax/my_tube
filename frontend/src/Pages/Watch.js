

// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [subscribed, setSubscribed] = useState(false);
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [recommended, setRecommended] = useState([]);
//   const [comment, setComment] = useState("");

//   /* =======================================================
//      📌 FETCH VIDEO + CHANNEL + COMMENTS
//   ======================================================== */
//   const fetchVideo = async () => {
//     const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
//     setVideo(res.data);
//     setLikes(res.data.likes?.length || 0);
//     setDislikes(res.data.dislikes?.length || 0);

//     if (res.data.uploadedBy?._id) {
//       fetchChannel(res.data.uploadedBy._id);
//       fetchComments(res.data._id);
//     }
//   };

//   const fetchChannel = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
//     setChannel(res.data);

//     if (user) {
//       setSubscribed(res.data?.subscribers?.includes(user._id));
//     }
//   };

//   const fetchComments = async (id) => {
//     const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
//     setVideo((p) => ({ ...p, comments: res.data }));
//   };

//   const fetchRecommended = async () => {
//     const res = await axios.get("http://localhost:5000/api/videos/all");
//     setRecommended(res.data.filter((v) => v.filename !== filename));
//   };

//   const updateViews = async () => {
//     await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
//   };

//   useEffect(() => {
//     fetchVideo();
//     fetchRecommended();
//     updateViews();
//   }, [filename]);

//   /* =======================================================
//      👍 LIKE + 👎 DISLIKE
//   ======================================================== */
//   const likeVideo = async () => {
//     if (!user) return alert("Login to like videos");
//     const token = localStorage.getItem("token");

//     const res = await axios.post(
//       `http://localhost:5000/api/videos/like/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//   };

//   const dislikeVideo = async () => {
//     if (!user) return alert("Login to dislike videos");
//     const token = localStorage.getItem("token");

//     const res = await axios.post(
//       `http://localhost:5000/api/videos/dislike/${video._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//   };

//   /* =======================================================
//      🔔 SUBSCRIBE / UNSUBSCRIBE (NO REDIRECT, LIVE UPDATE)
//   ======================================================== */
//   const toggleSubscribe = async () => {
//     if (!user) return alert("Login to subscribe");
//     const token = localStorage.getItem("token");

//     const res = await axios.post(
//       `http://localhost:5000/api/user/subscribe/${channel._id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setSubscribed(res.data.subscribed);

//     // 🔃 Update subscribers count without reload
//     setChannel((prev) => ({
//       ...prev,
//       subscribers: res.data.subscribed
//         ? [...prev.subscribers, user._id]
//         : prev.subscribers.filter((id) => id !== user._id)
//     }));
//   };

//   /* =======================================================
//      💬 COMMENTS
//   ======================================================== */
//   const postComment = async () => {
//     if (!comment.trim()) return alert("Enter comment");
//     if (!user) return alert("Login to comment");
//     const token = localStorage.getItem("token");

//     await axios.post(
//       "http://localhost:5000/api/comments/add",
//       { videoId: video._id, text: comment },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setComment("");
//     fetchComments(video._id);
//   };

//   const deleteComment = async (cid) => {
//     if (!user?.isAdmin) return alert("Admin only");
//     const token = localStorage.getItem("token");

//     await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     fetchComments(video._id);
//   };

//   /* =======================================================
//      ⏳ LOADING
//   ======================================================== */
//   if (!video) return <h2 style={{ padding: 20 }}>Loading...</h2>;

//   /* =======================================================
//      🎨 UI STYLES
//   ======================================================== */
//   const s = {
//     container: { display: "flex", padding: "20px", gap: "20px" },
//     playerBox: { flex: 3 },
//     sideBox: { flex: 1 },
//     videoPlayer: { width: "100%", borderRadius: "10px" },
//     title: { fontSize: "22px", fontWeight: "bold", marginTop: "10px" },
//     meta: { color: "#555", fontSize: "14px", marginBottom: "10px" },
//     channelBar: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       background: "#f9f9f9",
//       padding: "10px 15px",
//       borderRadius: "10px",
//       marginTop: "10px",
//       cursor: "pointer",
//     },
//     subscribeBtn: {
//       padding: "8px 16px",
//       borderRadius: "8px",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: "600",
//       background: subscribed ? "#ddd" : "#cc0000",
//       color: subscribed ? "#000" : "#fff",
//     },
//     actionBtn: {
//       padding: "6px 12px",
//       borderRadius: "6px",
//       background: "#eee",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: "600",
//       marginRight: "10px",
//     },
//     card: {
//       display: "flex",
//       gap: "10px",
//       marginBottom: "10px",
//       cursor: "pointer",
//       padding: "5px",
//       borderRadius: "10px",
//       background: "#fff",
//       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     },
//     thumb: {
//       width: "100px",
//       height: "60px",
//       borderRadius: "8px",
//       objectFit: "cover",
//     },
//   };

//   /* =======================================================
//      📺 RENDER UI
//   ======================================================== */
//   return (
//     <div style={s.container}>
//       {/* 🎬 MAIN PLAYER */}
//       <div style={s.playerBox}>
//         <video src={`http://localhost:5000/api/stream/${video.filename}`} controls autoPlay style={s.videoPlayer} />

//         <h2 style={s.title}>{video.title}</h2>

//         <div style={s.meta}>
//           👁 {video.views} views • {new Date(video.createdAt).toDateString()}
//         </div>

//         {/* 📺 Channel Bar */}
//         {channel && (
//           <div style={s.channelBar} onClick={() => navigate(`/profile/${channel._id}`)}>
//             <b>📺 {channel.name}</b>
//             <button style={s.subscribeBtn} onClick={(e) => { e.stopPropagation(); toggleSubscribe(); }}>
//               {subscribed ? "Subscribed ✔" : "Subscribe"}
//             </button>
//           </div>
//         )}

//         {/* 👍👎 Like Dislike */}
//         <button style={s.actionBtn} onClick={likeVideo}>👍 Like ({likes})</button>
//         <button style={s.actionBtn} onClick={dislikeVideo}>👎 Dislike ({dislikes})</button>

//         {/* 💬 Comments */}
//         <div style={{ marginTop: "25px" }}>
//           <h3>💬 Comments</h3>

//           {user && (
//             <>
//               <textarea
//                 style={{ width: "100%", height: "60px", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
//                 placeholder="Add a public comment..."
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//               ></textarea>

//               <button
//                 style={{
//                   padding: "6px 12px",
//                   borderRadius: "6px",
//                   background: "#ff0000",
//                   color: "#fff",
//                   border: "none",
//                   cursor: "pointer",
//                   marginTop: "5px",
//                 }}
//                 onClick={postComment}
//               >
//                 Comment
//               </button>
//             </>
//           )}

//           {video.comments?.map((c) => (
//             <div
//               key={c._id}
//               style={{
//                 marginTop: "15px",
//                 paddingBottom: "10px",
//                 borderBottom: "1px solid #ddd",
//               }}
//             >
//               <b>{c.user}</b>{" "}
//               <span style={{ color: "#777", fontSize: "12px" }}>
//                 {new Date(c.createdAt).toLocaleDateString()}
//               </span>
//               <p>{c.text}</p>
//               {user?.isAdmin && (
//                 <button
//                   style={{
//                     padding: "3px 8px",
//                     borderRadius: "4px",
//                     background: "#222",
//                     color: "#fff",
//                     border: "none",
//                     cursor: "pointer",
//                     fontSize: "12px",
//                   }}
//                   onClick={() => deleteComment(c._id)}
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 📌 Recommended Section */}
//       <div style={s.sideBox}>
//         <h3>🔔 Recommended</h3>
//         {recommended.map((v) => (
//           <a key={v._id} href={`/watch/${v.filename}`} style={{ textDecoration: "none", color: "black" }}>
//             <div style={s.card}>
//               <img src={`http://localhost:5000/uploads/${v.thumbnail}`} style={s.thumb} alt="thumb" />
//               <div>
//                 <p style={{ fontSize: "14px", fontWeight: "600" }}>{v.title}</p>
//                 <p style={{ fontSize: "12px", color: "#777" }}>👁 {v.views} views</p>
//               </div>
//             </div>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Watch() {
  const { filename } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [recommended, setRecommended] = useState([]);
  const [comment, setComment] = useState("");

  // Fetch everything
  const fetchVideo = async () => {
    const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
    setVideo(res.data);
    setLikes(res.data.likes?.length || 0);
    setDislikes(res.data.dislikes?.length || 0);

    if (res.data.uploadedBy?._id) {
      fetchChannel(res.data.uploadedBy._id);
      fetchComments(res.data._id);
    }
  };

  const fetchChannel = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
    setChannel(res.data);
    if (user) setSubscribed(res.data.subscribers?.includes(user._id));
  };

  const fetchComments = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
    setVideo((p) => ({ ...p, comments: res.data }));
  };

  const fetchRecommended = async () => {
    const res = await axios.get("http://localhost:5000/api/videos/all");
    setRecommended(res.data.filter((v) => v.filename !== filename));
  };

  const updateViews = async () => {
    await axios.post(`http://localhost:5000/api/videos/view/${filename}`);
  };

  useEffect(() => {
    fetchVideo();
    fetchRecommended();
    updateViews();
  }, [filename]);

  // Actions
  const likeVideo = async () => {
    if (!user) return alert("Login to like");
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/videos/like/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
  };

  const dislikeVideo = async () => {
    if (!user) return alert("Login to dislike");
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/videos/dislike/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
  };

  const toggleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Login to subscribe");
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/user/subscribe/${channel._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubscribed(res.data.subscribed);
    setChannel(prev => ({
      ...prev,
      subscribersCount: res.data.subscribed
        ? prev.subscribersCount + 1
        : prev.subscribersCount - 1
    }));
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    if (!user) return alert("Login to comment");
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/comments/add",
      { videoId: video._id, text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComment("");
    fetchComments(video._id);
  };

  const deleteComment = async (cid) => {
    if (!user?.isAdmin) return alert("Admin only");
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/comments/delete/${cid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchComments(video._id);
  };

  if (!video) return (
    <div className="loading">Loading video...</div>
  );

  return (
    <div className="watch-page">
      <div className="watch-main">
        {/* Video Player */}
        <div className="video-player-container">
          <video
            src={`http://localhost:5000/api/stream/${video.filename}`}
            controls
            autoPlay
            className="video-player"
          />
        </div>

        {/* Video Info */}
        <div className="video-info">
          <h1 className="video-title">{video.title}</h1>

          <div className="video-stats">
            <span>{video.views?.toLocaleString() || 0} views</span>
            <span>•</span>
            <span>{new Date(video.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Action Bar */}
          <div className="action-bar">
            <div className="like-dislike">
              <button onClick={likeVideo} className="like-btn">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.96 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                <span>{likes}</span>
              </button>
              <button onClick={dislikeVideo} className="dislike-btn">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.58-6.59c.37-.37.59-.86.59-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
              </button>
            </div>
          </div>

          {/* Channel Card */}
          {channel && (
            <div className="channel-card" onClick={() => navigate(`/profile/${channel._id}`)}>
              <div className="channel-info">
                <div className="channel-avatar">
                  {channel.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="channel-name">{channel.name}</h3>
                  <p className="subscriber-count">
                    {channel.subscribersCount || channel.subscribers?.length || 0} subscribers
                  </p>
                </div>
              </div>
              <button
                className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
                onClick={toggleSubscribe}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          )}

          {/* Description */}
          <div className="description-box">
            <p>{video.description || "No description available."}</p>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3>{video.comments?.length || 0} Comments</h3>

            {user && (
              <div className="comment-input-box">
                <div className="user-avatar-small">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && postComment()}
                />
                <button onClick={postComment} className="post-comment-btn">
                  Comment
                </button>
              </div>
            )}

            <div className="comments-list">
              {video.comments?.map((c) => (
                <div key={c._id} className="comment">
                  <div className="comment-avatar">
                    {c.user?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-username">{c.user}</span>
                      <span className="comment-date">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                    {user?.isAdmin && (
                      <button
                        className="delete-comment"
                        onClick={() => deleteComment(c._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <div className="recommended-sidebar">
        <h3>Recommended</h3>
        {recommended.slice(0, 12).map((v) => (
          <a
            key={v._id}
            href={`/watch/${v.filename}`}
            className="recommended-card"
            onClick={(e) => { e.preventDefault(); navigate(`/watch/${v.filename}`); }}
          >
            <img
              src={`http://localhost:5000/uploads/${v.thumbnail}`}
              alt={v.title}
              className="rec-thumbnail"
            />
            <div className="rec-info">
              <h4 className="rec-title">{v.title}</h4>
              {/* <p className="rec-channel">{v.uploadedBy?.name || "Unknown"}</p> */}
              <p className="rec-meta">
                {v.views?.toLocaleString() || 0} views • {new Date(v.createdAt).toLocaleDateString()}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Beautiful Inline CSS (move to CSS file later) */}
      <style jsx>{`
        .watch-page {
          display: flex;
          gap: 24px;
          max-width: 1600px;
          margin: 0 auto;
          padding: 20px;
          color: #fff;
          background: #0f0f0f;
          min-height: 100vh;
        }

        .watch-main {
          flex: 1;
          max-width: 1000px;
        }

        .video-player-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          margin-bottom: 20px;
        }

        .video-player {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
        }

        .video-title {
          font-size: 22px;
          font-weight: 600;
          margin: 16px 0 8px;
          line-height: 1.3;
        }

        .video-stats {
          color: #aaa;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #333;
          margin-bottom: 20px;
        }

        .like-dislike {
          display: flex;
          background: #272727;
          border-radius: 50px;
          overflow: hidden;
        }

        .like-btn, .dislike-btn {
          padding: 10px 24px;
          background: transparent;
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .like-btn:hover { background: #3ea6ff; }
        .dislike-btn:hover { background: #f33; }

        .like-btn svg, .dislike-btn svg {
          width: 20px;
          height: 20px;
        }

        .channel-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1f1f1f;
          padding: 16px;
          border-radius: 16px;
          margin: 20px 0;
          cursor: pointer;
          transition: background 0.2s;
        }

        .channel-card:hover {
          background: #272727;
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .channel-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ff0033, #ff6b6b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
        }

        .channel-name {
          font-size: 18px;
          font-weight: 600;
        }

        .subscriber-count {
          color: #aaa;
          font-size: 13px;
        }

        .subscribe-btn {
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          background: #ff0033;
          color: white;
          transition: all 0.3s;
        }

        .subscribe-btn.subscribed {
          background: #3f3f3f;
          color: #aaa;
        }

        .subscribe-btn:hover {
          background: #e6002e;
          transform: scale(1.05);
        }

        .description-box {
          background: #1f1f1f;
          padding: 16px;
          border-radius: 12px;
          margin: 20px 0;
          line-height: 1.5;
        }

        .comments-section h3 {
          margin: 30px 0 20px;
          font-size: 20px;
        }

        .comment-input-box {
          display: flex;
          gap: 12px;
          margin: 20px 0;
          align-items: flex-start;
        }

        .user-avatar-small {
          width: 40px;
          height: 40px;
          background: #ff0033;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .comment-input-box input {
          flex: 1;
          background: transparent;
          border: none;
          border-bottom: 2px solid #444;
          padding: 10px 0;
          color: white;
          font-size: 15px;
        }

        .comment-input-box input:focus {
          border-color: #ff0033;
          outline: none;
        }

        .post-comment-btn {
          padding: 8px 20px;
          background: #ff0033;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
        }

        .comments-list {
          margin-top: 20px;
        }

        .comment {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid #333;
        }

        .comment-avatar {
          width: 40px;
          height: 40px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .comment-content {
          flex: 1;
        }

        .comment-header {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: #aaa;
          margin-bottom: 4px;
        }

        .comment-username {
          color: white;
          font-weight: 600;
        }

        .comment-text {
          margin-top: 4px;
          line-height: 1.4;
        }

        .delete-comment {
          margin-top: 8px;
          padding: 4px 12px;
          background: #c00;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .recommended-sidebar {
          width: 400px;
          flex-shrink: 0;
        }

        .recommended-sidebar h3 {
          margin-bottom: 16px;
          font-size: 18px;
        }

        .recommended-card {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          text-decoration: none;
          color: white;
          border-radius: 12px;
          overflow: hidden;
          transition: background 0.2s;
        }

        .recommended-card:hover {
          background: #272727;
        }

        .rec-thumbnail {
          width: 168px;
          height: 94px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .rec-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .rec-title {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rec-channel, .rec-meta {
          font-size: 13px;
          color: #aaa;
          margin-top: 4px;
        }

        @media (max-width: 1024px) {
          .watch-page {
            flex-direction: column;
          }
          .recommended-sidebar {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .recommended-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}