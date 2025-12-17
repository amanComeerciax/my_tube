


import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiThumbsUp, FiThumbsDown, FiShare2, FiBell, FiCheck, 
  FiPlay, FiLayers, FiZap, FiMessageSquare, FiUser,
  FiMoreVertical, FiFlag, FiDownload, FiList, FiClock,
  FiBookmark, FiSend, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { 
  MdOutlineScreenShare, 
  MdOutlineFullscreenExit, 
  MdOutlineSpeed, 
  MdPlaylistAdd, 
  MdOutlineWatchLater,
  MdSort
} from 'react-icons/md';

export default function Watch() {
  const { filename } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  // Video & Channel Data
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [isQualitySwitching, setIsQualitySwitching] = useState(false);
  
  // Comment States
  const [comment, setComment] = useState("");
  const [sortComments, setSortComments] = useState('top');
  const [commentFilter, setCommentFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  
  // Like/Dislike States
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  
  // Subscription & Notifications
  const [subscribed, setSubscribed] = useState(false);
  const [notifications, setNotifications] = useState('all');
  
  // UI States
  const [showDescription, setShowDescription] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Video Controls
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState('original');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  
  // Features
  const [isSaved, setIsSaved] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [captionsAvailable, setCaptionsAvailable] = useState(false);
  
  // Chapters
  const [chapters, setChapters] = useState([]);
  const [showChapters, setShowChapters] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  /* ================= FETCH VIDEO ================= */
  const fetchVideo = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/by-filename/${filename}`);
      setVideo(res.data);
      setLikes(res.data.likes?.length || 0);
      setDislikes(res.data.dislikes?.length || 0);
      
      if (user) {
        setUserLiked(res.data.likes?.includes(user._id));
        setUserDisliked(res.data.dislikes?.includes(user._id));
        checkIfSaved(res.data._id);
        checkIfWatchLater(res.data._id);
      }

      if (res.data.uploadedBy?._id) {
        fetchChannel(res.data.uploadedBy._id);
        fetchComments(res.data._id);
      }

      parseChapters(res.data.description);

      if (user && res.data._id) {
        addToHistory(res.data._id);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
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
    try {
      const matrixRes = await axios.get(`http://localhost:5000/api/videos/similar/${filename}`);
      
      if (matrixRes.data && matrixRes.data.length > 0) {
        setRecommended(matrixRes.data.slice(0, 15));
      } else {
        throw new Error("Matrix returned empty");
      }
    } catch (err) {
      try {
        const allRes = await axios.get("http://localhost:5000/api/videos/all");
        const popular = allRes.data
          .filter(v => v.filename !== filename)
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 15);
        setRecommended(popular);
      } catch (fallbackErr) {
        setRecommended([]);
      }
    }
  };

  const addToHistory = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `http://localhost:5000/api/user/watch-history/add/${videoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to add to history:", err);
    }
  };

  const getAutoQuality = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const type = connection.effectiveType;
      console.log("Current Connection Type:", type);
  
      if (type === '4g') return '720p';
      if (type === '3g') return '480p';
      return 'original';
    }
    return 'original';
  };

  useEffect(() => {
    fetchVideo();
    axios.post(`http://localhost:5000/api/videos/view/${filename}`);
  }, [filename, user?._id]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    if (video?._id) {
      socketRef.current.emit("join-video", video._id);
    }
    socketRef.current.on("caption-ready", (data) => {
      setVideo((prev) => ({ ...prev, captions: data.captions }));
      alert("✅ Captions ready! CC available now");
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [video?._id]);

  useEffect(() => {
    if (video) fetchRecommended();
  }, [video]);

  const handleQualityChange = (newQuality) => {
    if (!videoRef.current || !video) return;
  
    let targetQuality = newQuality;
  
    if (newQuality === 'auto') {
      targetQuality = getAutoQuality();
      console.log("Auto-selected quality based on speed:", targetQuality);
    }
  
    const currentTime = videoRef.current.currentTime;
    const isPlaying = !videoRef.current.paused;
  
    setIsQualitySwitching(true);
    setVideoQuality(newQuality);
    setShowQualityMenu(false);
  
    const newSource = `http://localhost:5000/api/stream/${video.filename}?q=${targetQuality}`;
    videoRef.current.src = newSource;
  
    const syncAndPlay = () => {
      videoRef.current.currentTime = currentTime;
      if (isPlaying) videoRef.current.play();
      setIsQualitySwitching(false);
      videoRef.current.removeEventListener('loadedmetadata', syncAndPlay);
    };
  
    videoRef.current.addEventListener('loadedmetadata', syncAndPlay);
    videoRef.current.load();
  };

  /* ================= CHAPTERS ================= */
  const parseChapters = (description) => {
    if (!description) return setChapters([]);
    const timestampRegex = /(\d{1,2}):(\d{2})\s+(.+)/g;
    const foundChapters = [];
    let match;
    while ((match = timestampRegex.exec(description)) !== null) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      foundChapters.push({
        time: minutes * 60 + seconds,
        title: match[3].trim()
      });
    }
    setChapters(foundChapters);
  };

  const skipToChapter = (time) => {
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  /* ================= SAVE & WATCH LATER ================= */
  const checkIfSaved = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/saved/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(res.data.isSaved);
    } catch (err) {}
  };

  const checkIfWatchLater = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/watch-later/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsWatchLater(res.data.isWatchLater);
    } catch (err) {}
  };

  const toggleSave = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:5000/api/user/save/${video._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(!isSaved);
    } catch (err) {}
  };

  const toggleWatchLater = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:5000/api/user/watch-later/${video._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsWatchLater(!isWatchLater);
    } catch (err) {}
  };

  /* ================= VIDEO CONTROLS ================= */
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
      const currentTime = videoRef.current.currentTime;
      const chapterIndex = chapters.findIndex((ch, idx) => {
        const nextChapter = chapters[idx + 1];
        return currentTime >= ch.time && (!nextChapter || currentTime < nextChapter.time);
      });
      if (chapterIndex !== -1) setCurrentChapter(chapterIndex);
    }
  };

  const handleVideoEnd = () => {
    if (autoplay && recommended.length > 0) {
      const nextVideo = recommended[0];
      if (nextVideo?.filename) navigate(`/watch/${nextVideo.filename}`);
    }
  };

  const changePlaybackSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const toggleTheaterMode = () => setIsTheaterMode(!isTheaterMode);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleSubtitles = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const tracks = videoEl.textTracks;
    if (!tracks || tracks.length === 0) return;
    const nextState = !showSubtitles;
    setShowSubtitles(nextState);
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = nextState ? "showing" : "hidden";
    }
  };

  const handleVideoLoadedMetadata = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const tracks = videoEl.textTracks;
    if (tracks && tracks.length > 0) {
      setCaptionsAvailable(true);
      for (let i = 0; i < tracks.length; i++) tracks[i].mode = "hidden";
      setShowSubtitles(false);
    } else {
      setCaptionsAvailable(false);
    }
  };

  /* ================= LIKE & DISLIKE ================= */
  const likeVideo = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    const res = await axios.post(`http://localhost:5000/api/videos/like/${video._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
    setUserLiked(res.data.likes.includes(user._id));
    setUserDisliked(res.data.dislikes.includes(user._id));
  };

  const dislikeVideo = async () => {
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    const res = await axios.post(`http://localhost:5000/api/videos/dislike/${video._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
    setUserLiked(res.data.likes.includes(user._id));
    setUserDisliked(res.data.dislikes.includes(user._id));
  };

  /* ================= SUBSCRIBE ================= */
  const toggleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    const token = localStorage.getItem("token");
    const res = await axios.post(`http://localhost:5000/api/user/subscribe/${channel._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSubscribed(res.data.subscribed);
    setChannel(p => ({ ...p, subscribers: res.data.subscribers || p.subscribers }));
  };

  /* ================= COMMENTS ================= */
  const postComment = async () => {
    if (!comment.trim() || !user) return;
    const token = localStorage.getItem("token");
    const tempComment = {
      _id: Date.now(),
      user: user.name || user.username, 
      text: comment,
      createdAt: new Date().toISOString(),
      isPending: true,
      replies: []
    };
    setVideo(p => ({ ...p, comments: [tempComment, ...(p.comments || [])] }));
    setComment("");
    try {
      await axios.post("http://localhost:5000/api/comments/add", { videoId: video._id, text: tempComment.text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments(video._id); 
    } catch (error) {
      setVideo(p => ({ ...p, comments: p.comments.filter(c => c._id !== tempComment._id) }));
    }
  };

  const getSortedComments = () => {
    if (!video?.comments) return [];
    let filtered = [...video.comments];
    if (commentFilter === 'creator') filtered = filtered.filter(c => c.userId === video.uploadedBy._id);
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  /* ================= HELPERS ================= */
  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getTimeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  if (!video) return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <>
      <div style={styles.mainContainer}>
        <div style={{ 
          ...styles.contentWrapper,
          maxWidth: isTheaterMode ? "100%" : "1800px",
          flexDirection: isTheaterMode ? "column" : "row"
        }}>
          {/* MAIN VIDEO SECTION */}
          <div style={{ 
            flex: isTheaterMode ? "1" : "1", 
            maxWidth: isTheaterMode ? "100%" : "calc(100% - 424px)",
            minWidth: 0
          }}>
            {/* Video Player */}
            <div ref={playerContainerRef} style={styles.videoContainer}>
              <video
                ref={videoRef}
                src={`http://localhost:5000/api/stream/${video.filename}?q=${videoQuality}`}
                crossOrigin="anonymous"
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnd}
                onLoadedMetadata={handleVideoLoadedMetadata}
                style={{ 
                  ...styles.videoPlayer,
                  maxHeight: isTheaterMode ? "90vh" : "720px"
                }}
              >
                {video.captions && (
                  <track
                    kind="subtitles"
                    src={`http://localhost:5000/captions/${video.captions}`}
                    srcLang="en"
                    label="English (Auto)"
                  />
                )}
              </video>

              {/* Video Controls Overlay */}
              <div style={styles.controlsOverlay}>
                <button onClick={toggleTheaterMode} style={styles.overlayBtn} title="Theater mode">
                  {isTheaterMode ? <MdOutlineFullscreenExit size={20} /> : <MdOutlineScreenShare size={20} />}
                </button>
                
                <button 
                  onClick={toggleSubtitles} 
                  style={{...styles.overlayBtn, background: showSubtitles ? "#ff0000" : "rgba(0,0,0,0.8)"}}
                  disabled={!captionsAvailable}
                  title="Subtitles/CC"
                >
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>CC</span>
                </button>
                
                {/* Playback Speed */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} style={styles.overlayBtn} title="Playback speed">
                    <MdOutlineSpeed size={20} /> 
                    <span style={{marginLeft: 5, fontSize: "13px"}}>{playbackSpeed}x</span>
                  </button>
                  {showSpeedMenu && (
                    <div style={styles.dropdownMenu}>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(s => (
                        <div 
                          key={s} 
                          onClick={() => changePlaybackSpeed(s)} 
                          style={{
                            ...styles.dropdownItem,
                            background: playbackSpeed === s ? "rgba(255,255,255,0.1)" : "transparent"
                          }}
                        >
                          <span>{s === 1 ? 'Normal' : `${s}x`}</span>
                          {playbackSpeed === s && <FiCheck size={16} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quality Selector */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowQualityMenu(!showQualityMenu)} style={styles.overlayBtn} title="Quality">
                    <FiZap size={18} /> 
                    <span style={{marginLeft: 5, fontSize: "13px"}}>{videoQuality}</span>
                  </button>
                  {showQualityMenu && (
                    <div style={styles.dropdownMenu}>
                      {['auto', 'original', '720p', '480p'].map(q => (
                        <div 
                          key={q} 
                          onClick={() => handleQualityChange(q)} 
                          style={{
                            ...styles.dropdownItem,
                            background: videoQuality === q ? "rgba(255,255,255,0.1)" : "transparent"
                          }}
                        >
                          <span>{q === 'auto' ? 'Auto' : q}</span>
                          {videoQuality === q && <FiCheck size={16} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Title */}
            <h1 style={styles.videoTitle}>{video.title}</h1>

            {/* Video Info Bar */}
            <div style={styles.videoInfoBar}>
              {/* Channel Info + Subscribe */}
              <div style={styles.channelInfoSection}>
                {channel && (
                  <>
                    <div 
                      style={styles.channelAvatarClickable} 
                      onClick={() => navigate(`/profile/${channel._id}`)}
                    >
                      <div style={styles.channelAvatar}>
                        {channel.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.channelDetails}>
                        <div style={styles.channelName}>{channel.name}</div>
                        <div style={styles.subscriberCount}>
                          {formatViews(channel.subscribers?.length || 0)} subscribers
                        </div>
                      </div>
                    </div>
                    <button 
                      style={subscribed ? styles.subscribedButton : styles.subscribeButton} 
                      onClick={toggleSubscribe}
                    >
                      {subscribed ? (
                        <>
                          <FiBell size={18} />
                          <span style={{ marginLeft: 6 }}>Subscribed</span>
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtonsSection}>
                {/* Like/Dislike */}
                <div style={styles.likeDislikeGroup}>
                  <button 
                    onClick={likeVideo} 
                    style={{
                      ...styles.iconButton,
                      ...styles.likeButton,
                      color: userLiked ? "#fff" : "#fff"
                    }}
                    title="Like"
                  >
                    <FiThumbsUp size={20} fill={userLiked ? "#fff" : "none"} />
                    <span style={styles.buttonText}>{formatViews(likes)}</span>
                  </button>
                  <div style={styles.buttonDivider}></div>
                  <button 
                    onClick={dislikeVideo} 
                    style={{
                      ...styles.iconButton,
                      ...styles.dislikeButton
                    }}
                    title="Dislike"
                  >
                    <FiThumbsDown size={20} fill={userDisliked ? "#fff" : "none"} />
                  </button>
                </div>

                {/* Share */}
                <button style={styles.iconButton} title="Share">
                  <FiShare2 size={20} />
                  <span style={styles.buttonText}>Share</span>
                </button>

                {/* Save */}
                <button onClick={toggleSave} style={styles.iconButton} title="Save to playlist">
                  <MdPlaylistAdd size={24} />
                  <span style={styles.buttonText}>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {/* More */}
                <button style={styles.iconButtonCircle} title="More">
                  <FiMoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Video Stats */}
            <div style={styles.videoStats}>
              <span style={styles.viewCount}>
                {formatViews(video.views)} views
              </span>
              <span style={styles.uploadDate}>
                {getTimeAgo(video.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div style={styles.descriptionContainer}>
              <div style={styles.descriptionContent}>
                <p style={styles.descriptionText}>
                  {showDescription 
                    ? video.description 
                    : video.description?.slice(0, 200) + (video.description?.length > 200 ? '...' : '')
                  }
                </p>
                {video.description?.length > 200 && (
                  <button 
                    onClick={() => setShowDescription(!showDescription)} 
                    style={styles.showMoreButton}
                  >
                    {showDescription ? (
                      <>Show less <FiChevronUp size={16} /></>
                    ) : (
                      <>Show more <FiChevronDown size={16} /></>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div style={styles.commentsSection}>
              <div style={styles.commentsHeader}>
                <h2 style={styles.commentsTitle}>
                  {video.comments?.length || 0} Comments
                </h2>
                <button style={styles.sortButton}>
                  <MdSort size={24} />
                  <span style={{ marginLeft: 8 }}>Sort by</span>
                </button>
              </div>

              {/* Comment Input */}
              {user && (
                <div style={styles.commentInputSection}>
                  <div style={styles.commentAvatar}>
                    {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      style={styles.commentInput}
                      onKeyPress={(e) => e.key === "Enter" && postComment()}
                    />
                    {comment && (
                      <div style={styles.commentActions}>
                        <button 
                          onClick={() => setComment("")} 
                          style={styles.cancelButton}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={postComment} 
                          style={styles.commentButton}
                          disabled={!comment.trim()}
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div style={styles.commentsList}>
                {getSortedComments().map(c => (
                  <div key={c._id} style={styles.commentItem}>
                    <div style={styles.commentAvatar}>
                      {c.user?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.commentContent}>
                      <div style={styles.commentHeader}>
                        <span style={styles.commentAuthor}>{c.user}</span>
                        <span style={styles.commentTime}>{getTimeAgo(c.createdAt)}</span>
                      </div>
                      <p style={styles.commentText}>{c.text}</p>
                      <div style={styles.commentActionsBar}>
                        <button style={styles.commentActionBtn}>
                          <FiThumbsUp size={16} />
                        </button>
                        <button style={styles.commentActionBtn}>
                          <FiThumbsDown size={16} />
                        </button>
                        <button style={styles.commentActionBtn}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR - Recommended Videos */}
          {!isTheaterMode && (
            <div style={styles.sidebar}>
              {recommended.map((v, idx) => (
                <div 
                  key={v._id} 
                  onClick={() => navigate(`/watch/${v.filename}`)} 
                  style={styles.recommendedCard}
                >
                  <div style={styles.thumbnailContainer}>
                    <img 
                      src={`http://localhost:5000/uploads/${v.thumbnail}`} 
                      style={styles.recommendedThumbnail} 
                      alt={v.title} 
                    />
                    {v.duration && (
                      <span style={styles.videoDuration}>{v.duration}</span>
                    )}
                  </div>
                  <div style={styles.recommendedInfo}>
                    <h3 style={styles.recommendedTitle}>{v.title}</h3>
                    <p style={styles.recommendedChannel}>{v.uploadedBy?.name}</p>
                    <div style={styles.recommendedStats}>
                      <span>{formatViews(v.views)} views</span>
                      <span style={styles.dot}>•</span>
                      <span>{getTimeAgo(v.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .spinner { 
          width: 48px; 
          height: 48px; 
          border: 4px solid #303030; 
          border-top-color: #ff0000; 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite; 
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        video::cue { 
          background: rgba(0,0,0,0.8); 
          color: #fff; 
          font-size: 18px; 
        }
      `}</style>
    </>
  );
}

const styles = {
  mainContainer: {
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "#f1f1f1",
    paddingTop: "56px"
  },
  contentWrapper: {
    display: "flex",
    gap: 24,
    padding: "24px",
    margin: "0 auto"
  },
  videoContainer: {
    position: "relative",
    background: "#000",
    borderRadius: "12px",
    overflow: "hidden"
  },
  videoPlayer: {
    width: "100%",
    display: "block",
    aspectRatio: "16/9"
  },
  controlsOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    display: "flex",
    gap: 8,
    zIndex: 10
  },
  overlayBtn: {
    padding: "8px 12px",
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s",
    ":hover": {
      background: "rgba(255,255,255,0.2)"
    }
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#282828",
    borderRadius: "12px",
    overflow: "hidden",
    minWidth: "140px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    zIndex: 100
  },
  dropdownItem: {
    padding: "12px 16px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.2s"
  },
  videoTitle: {
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "1.4",
    margin: "12px 0",
    color: "#f1f1f1"
  },
  videoInfoBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    paddingBottom: "12px",
    gap: "12px",
    flexWrap: "wrap"
  },
  channelInfoSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  channelAvatarClickable: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer"
  },
  channelAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff"
  },
  channelDetails: {
    display: "flex",
    flexDirection: "column"
  },
  channelName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f1f1f1"
  },
  subscriberCount: {
    fontSize: "12px",
    color: "#aaa"
  },
  subscribeButton: {
    padding: "10px 16px",
    background: "#cc0000",
    border: "none",
    borderRadius: "24px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  subscribedButton: {
    padding: "10px 16px",
    background: "#272727",
    border: "none",
    borderRadius: "24px",
    color: "#f1f1f1",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  actionButtonsSection: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  likeDislikeGroup: {
    display: "flex",
    background: "#272727",
    borderRadius: "24px",
    overflow: "hidden"
  },
  iconButton: {
    padding: "10px 16px",
    background: "#272727",
    border: "none",
    borderRadius: "24px",
    color: "#f1f1f1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.2s"
  },
  likeButton: {
    borderRadius: "24px 0 0 24px",
    paddingRight: "14px"
  },
  dislikeButton: {
    borderRadius: "0 24px 24px 0",
    paddingLeft: "14px"
  },
  buttonDivider: {
    width: "1px",
    height: "24px",
    background: "rgba(255,255,255,0.1)",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: "14px",
    fontWeight: "500"
  },
  iconButtonCircle: {
    padding: "10px",
    background: "#272727",
    border: "none",
    borderRadius: "50%",
    color: "#f1f1f1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px"
  },
  videoStats: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    fontSize: "14px",
    color: "#aaa",
    marginTop: "8px"
  },
  viewCount: {
    fontWeight: "500"
  },
  uploadDate: {},
  descriptionContainer: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "12px",
    marginTop: "12px"
  },
  descriptionContent: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#f1f1f1"
  },
  descriptionText: {
    margin: 0,
    whiteSpace: "pre-wrap"
  },
  showMoreButton: {
    marginTop: "8px",
    background: "none",
    border: "none",
    color: "#f1f1f1",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  commentsSection: {
    marginTop: "24px"
  },
  commentsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    marginBottom: "24px"
  },
  commentsTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0
  },
  sortButton: {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    color: "#f1f1f1",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500"
  },
  commentInputSection: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px"
  },
  commentAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#717171",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    flexShrink: 0
  },
  commentInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #717171",
    color: "#f1f1f1",
    padding: "8px 0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  commentActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "12px"
  },
  cancelButton: {
    padding: "10px 16px",
    background: "none",
    border: "none",
    borderRadius: "24px",
    color: "#f1f1f1",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500"
  },
  commentButton: {
    padding: "10px 16px",
    background: "#3ea6ff",
    border: "none",
    borderRadius: "24px",
    color: "#0f0f0f",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  },
  commentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  commentItem: {
    display: "flex",
    gap: "16px"
  },
  commentContent: {
    flex: 1
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px"
  },
  commentAuthor: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#f1f1f1"
  },
  commentTime: {
    fontSize: "12px",
    color: "#aaa"
  },
  commentText: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#f1f1f1"
  },
  commentActionsBar: {
    display: "flex",
    gap: "16px",
    alignItems: "center"
  },
  commentActionBtn: {
    background: "none",
    border: "none",
    color: "#f1f1f1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "500"
  },
  sidebar: {
    width: "402px",
    flexShrink: 0
  },
  recommendedCard: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background 0.2s"
  },
  thumbnailContainer: {
    position: "relative",
    flexShrink: 0
  },
  recommendedThumbnail: {
    width: "168px",
    height: "94px",
    borderRadius: "8px",
    objectFit: "cover"
  },
  videoDuration: {
    position: "absolute",
    bottom: "4px",
    right: "4px",
    background: "rgba(0,0,0,0.8)",
    padding: "2px 4px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600"
  },
  recommendedInfo: {
    flex: 1,
    minWidth: 0
  },
  recommendedTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.4",
    color: "#f1f1f1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical"
  },
  recommendedChannel: {
    margin: "4px 0 2px 0",
    fontSize: "12px",
    color: "#aaa"
  },
  recommendedStats: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    fontSize: "12px",
    color: "#aaa"
  },
  dot: {
    fontSize: "8px"
  }
};