



import React, { useEffect, useState, useContext, useRef } from "react";
import api from "../config/api";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiThumbsUp, FiThumbsDown, FiShare2, FiBell, FiCheck, 
  FiZap, FiMoreVertical, FiChevronDown, FiChevronUp,
  FiMaximize, FiSend, FiTrendingUp, FiEye, FiClock, FiHeart, FiMic
} from "react-icons/fi";
import { 
  MdOutlineScreenShare, 
  MdOutlineFullscreenExit, 
  MdOutlineSpeed, 
  MdSort,
  MdAutoAwesome,
  MdGraphicEq
} from 'react-icons/md';
import Notifications from "../components/Notifications";
import HLSPlayer from "../components/HLSPlayer";

const WatchAd = () => (
  <div style={styles.adBanner}>
    <div style={styles.adGlowEffect}></div>
    <div style={styles.adContent}>
      <div style={styles.adIcon}>⭐</div>
      <div>
        <h3 style={styles.adTitle}>Upgrade to Premium</h3>
        <p style={styles.adText}>
          Ad-free videos, background play, and exclusive content
        </p>
      </div>
      <button onClick={() => window.location.href = "/profile"} style={styles.premiumBtn}>
        Premium $99
      </button>
    </div>
  </div>
);

export default function Watch() {
  const { filename } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchRecognitionRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Navbar States
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchListening, setIsSearchListening] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ad States
  const [ad, setAd] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [adTime, setAdTime] = useState(0);

  // Video & Channel Data
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [isQualitySwitching, setIsQualitySwitching] = useState(false);
  
  // AI Insights
  const [aiInsights, setAiInsights] = useState({ summary: "", sentiment: "", status: "pending" });
  const [showAIInsights, setShowAIInsights] = useState(true);
  
  // Comment States
  const [comment, setComment] = useState("");
  
  // Like/Dislike
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  
  // Subscription
  const [subscribed, setSubscribed] = useState(false);
  
  // UI States
  const [showDescription, setShowDescription] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  
  // Video Controls
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState('original');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [captionsAvailable, setCaptionsAvailable] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  
  // Features
  const [isSaved, setIsSaved] = useState(false);

  // Voice Control States
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);

  /* ================= NAVBAR SEARCH SUGGESTIONS ================= */
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(
          `/api/search/suggestions?query=${search}`
        );
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  /* ================= CLICK OUTSIDE HANDLERS ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= NAVBAR VOICE SEARCH SETUP ================= */
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      searchRecognitionRef.current = new SpeechRecognition();
      searchRecognitionRef.current.continuous = false;
      searchRecognitionRef.current.interimResults = false;
      searchRecognitionRef.current.lang = "en-US";

      searchRecognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setSearch(transcript);
      };

      searchRecognitionRef.current.onerror = () => setIsSearchListening(false);
      searchRecognitionRef.current.onend = () => setIsSearchListening(false);
    }
  }, []);

  const startNavbarVoiceSearch = () => {
    if (!searchRecognitionRef.current) {
      alert("❌ Your browser does not support voice search. Try Chrome or Edge.");
      return;
    }
    if (isSearchListening) {
      searchRecognitionRef.current.stop();
    } else {
      searchRecognitionRef.current.start();
      setIsSearchListening(true);
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search)}`);
    }
  };

  /* ================= VIDEO VOICE CONTROL SETUP ================= */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("🎙️ Speech Recognition not supported");
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      console.log("🎙️ Voice Command:", text);
      setLastCommand(text);
      handleVoiceCommand(text);
    };

    recognition.onerror = (event) => {
      console.error("🎙️ Recognition error:", event.error);
      if (event.error === 'no-speech') {
        if (isListening) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {}
          }, 1000);
        }
      }
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          console.log("🎙️ Recognition restart failed");
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  /* ================= VOICE COMMAND HANDLER ================= */
  function handleVoiceCommand(command) {
    const video = videoRef.current;
    if (!video) return;

    if (command.includes("play") || command.includes("start")) {
      video.play();
      showVoiceFeedback("▶️ Playing");
    }
    else if (command.includes("pause") || command.includes("stop")) {
      video.pause();
      showVoiceFeedback("⏸ Paused");
    }
    else if (command.includes("skip") || command.includes("forward")) {
      let seconds = 10;
      const matchNumber = command.match(/(\d+)/);
      if (matchNumber) {
        seconds = parseInt(matchNumber[1]);
      }
      if (command.includes("one minute")) seconds = 60;
      else if (command.includes("two minute")) seconds = 120;
      else if (command.includes("three minute")) seconds = 180;
      
      video.currentTime += seconds;
      showVoiceFeedback(`⏩ Skipped ${seconds}s`);
    }
    else if (command.includes("rewind") || command.includes("back")) {
      let seconds = 10;
      const matchNumber = command.match(/(\d+)/);
      if (matchNumber) {
        seconds = parseInt(matchNumber[1]);
      }
      video.currentTime -= seconds;
      showVoiceFeedback(`⏪ Rewound ${seconds}s`);
    }
    else if (command.includes("mute")) {
      video.muted = true;
      showVoiceFeedback("🔇 Muted");
    }
    else if (command.includes("unmute")) {
      video.muted = false;
      showVoiceFeedback("🔊 Unmuted");
    }
    else if (command.includes("volume up") || command.includes("increase volume")) {
      video.volume = Math.min(1, video.volume + 0.2);
      showVoiceFeedback(`🔊 Volume: ${Math.round(video.volume * 100)}%`);
    }
    else if (command.includes("volume down") || command.includes("decrease volume")) {
      video.volume = Math.max(0, video.volume - 0.2);
      showVoiceFeedback(`🔉 Volume: ${Math.round(video.volume * 100)}%`);
    }
    else if (command.includes("full screen") || command.includes("fullscreen")) {
      toggleFullscreen();
      showVoiceFeedback("⛶ Fullscreen");
    }
    else if (command.includes("exit full") || command.includes("minimize")) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        showVoiceFeedback("🚪 Exit Fullscreen");
      }
    }
    else if (command.includes("theater") || command.includes("theatre")) {
      toggleTheaterMode();
      showVoiceFeedback("🎬 Theater Mode");
    }
    else if (command.includes("subtitle") || command.includes("caption") || command.includes("cc")) {
      toggleSubtitles();
      showVoiceFeedback(showSubtitles ? "💬 Subtitles Off" : "💬 Subtitles On");
    }
    else if (command.includes("like this") || command.includes("like video")) {
      likeVideo();
      showVoiceFeedback("👍 Liked");
    }
    else if (command.includes("subscribe")) {
      if (channel && !subscribed) {
        toggleSubscribe({ stopPropagation: () => {} });
        showVoiceFeedback("🔔 Subscribed");
      }
    }
    else if (command.includes("next video") || command.includes("next")) {
      if (recommended.length > 0 && recommended[0]?.filename) {
        navigate(`/watch/${recommended[0].filename}`);
        showVoiceFeedback("⏭️ Next Video");
      }
    }
    else if (command.includes("restart") || command.includes("replay")) {
      video.currentTime = 0;
      video.play();
      showVoiceFeedback("🔄 Restarting");
    }
    else if (command.includes("speed up") || command.includes("faster")) {
      const newSpeed = Math.min(2, playbackSpeed + 0.25);
      changePlaybackSpeed(newSpeed);
      showVoiceFeedback(`🎵 Speed: ${newSpeed}x`);
    }
    else if (command.includes("slow down") || command.includes("slower")) {
      const newSpeed = Math.max(0.25, playbackSpeed - 0.25);
      changePlaybackSpeed(newSpeed);
      showVoiceFeedback(`🎵 Speed: ${newSpeed}x`);
    }
    else if (command.includes("normal speed")) {
      changePlaybackSpeed(1);
      showVoiceFeedback("🎵 Normal Speed");
    }
  }

  function showVoiceFeedback(message) {
    setLastCommand(message);
    setTimeout(() => setLastCommand(""), 3000);
  }

  const toggleVoiceControl = () => {
    if (!voiceSupported) {
      alert("Voice control is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (!isListening) {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        showVoiceFeedback("🎙️ Voice Control Active");
      } catch (err) {
        console.error("Failed to start recognition:", err);
        alert("Could not start voice recognition. Please check microphone permissions.");
      }
    } else {
      recognitionRef.current?.stop();
      setIsListening(false);
      showVoiceFeedback("🎙️ Voice Control Off");
    }
  };

  /* ================= FETCH VIDEO ================= */
  const fetchVideo = async () => {
    try {
      const res = await api.get(`/api/videos/by-filename/${filename}`);
      setVideo(res.data);
      setLikes(res.data.likes?.length || 0);
      setDislikes(res.data.dislikes?.length || 0);
      
      setAiInsights({
        summary: res.data.aiSummary || "",
        sentiment: res.data.sentiment || "Neutral",
        status: res.data.summaryStatus || "pending"
      });

      if (user) {
        setUserLiked(res.data.likes?.includes(user._id));
        setUserDisliked(res.data.dislikes?.includes(user._id));
        checkIfSaved(res.data._id);
      }

      if (res.data.uploadedBy?._id) {
        fetchChannel(res.data.uploadedBy._id);
        fetchComments(res.data._id);
      }

      if (user && res.data._id) {
        addToHistory(res.data._id);
      }

      if (res.data?._id && (!user || !user.isPremium)) {
        fetchAd(res.data._id);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const fetchChannel = async (id) => {
    const res = await api.get(`/api/user/profile/${id}`);
    setChannel(res.data);
    if (user) setSubscribed(res.data.subscribers?.includes(user._id));
  };

  const fetchComments = async (id) => {
    const res = await api.get(`/api/comments/video/${id}`);
    setVideo((p) => ({ ...p, comments: res.data })); 
  };

  const fetchRecommended = async () => {
    try {
      const matrixRes = await api.get(`/api/videos/similar/${filename}`);
      
      if (matrixRes.data && matrixRes.data.length > 0) {
        setRecommended(matrixRes.data.slice(0, 15));
      } else {
        throw new Error("Matrix returned empty");
      }
    } catch (err) {
      try {
        const allRes = await api.get("/api/videos/all");
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
    if (!user) return;
    try {
      await api.post(
        `/api/user/watch-history/add/${videoId}`,
        {},
        {  }
      );
    } catch (err) {
      console.error("Failed to add to history:", err);
    }
  };

  const fetchAd = async (videoId) => {
    try {
      const res = await api.get(`/api/ads/${videoId}`);
      
      if (res.data) {
        setAd(res.data);
        setShowAd(true);
        setAdTime(0);
        console.log("📺 Ad loaded:", res.data.title);
      }
    } catch (err) {
      console.error("Ad fetch error", err);
    }
  };

  const getAutoQuality = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const type = connection.effectiveType;
      if (type === '4g') return '720p';
      if (type === '3g') return '480p';
      return 'original';
    }
    return 'original';
  };

  useEffect(() => {
    fetchVideo();
    api.post(`/api/videos/view/${filename}`);
  }, [filename, user?._id]);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");
    if (video?._id) {
      socketRef.current.emit("join-video", video._id);
    }
    
    socketRef.current.on("caption-ready", (data) => {
      setVideo((prev) => ({ ...prev, captions: data.captions }));
    });

    socketRef.current.on("summary-ready", (data) => {
      if (data.videoId === video?._id) {
        setAiInsights({
          summary: data.summary || "",
          sentiment: data.sentiment || "Neutral",
          status: "ready"
        });
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [video?._id]);

  useEffect(() => {
    if (video) fetchRecommended();
  }, [video]);

  useEffect(() => {
    if (aiInsights.status === "pending" || aiInsights.status === "processing") {
      const interval = setInterval(async () => {
        try {
          const res = await api.get(`/api/videos/by-filename/${filename}`);
          if (res.data.summaryStatus === "ready" && res.data.aiSummary) {
            setAiInsights({
              summary: res.data.aiSummary,
              sentiment: res.data.sentiment || "Neutral",
              status: "ready"
            });
          }
        } catch (err) {
          console.error("Error polling for summary:", err);
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [aiInsights.status, filename]);

  const handleQualityChange = (newQuality) => {
    if (!videoRef.current || !video) return;
  
    let targetQuality = newQuality;
    if (newQuality === 'auto') {
      targetQuality = getAutoQuality();
    }
  
    const currentTime = videoRef.current.currentTime;
    const isPlaying = !videoRef.current.paused;
  
    setIsQualitySwitching(true);
    setVideoQuality(newQuality);
    setShowQualityMenu(false);
  
    const newSource = `/api/stream/${video.filename}?q=${targetQuality}`;
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

  const checkIfSaved = async (videoId) => {
    if (!user) return;
    try {
      const res = await api.get(`/api/user/saved/${videoId}`, {
        
      });
      setIsSaved(res.data.isSaved);
    } catch (err) {}
  };

  const toggleSave = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post(`/api/user/save/${video._id}`, {}, {
        
      });
      setIsSaved(!isSaved);
    } catch (err) {}
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    }
  };

  const handleVideoEnd = () => {
    if (recommended.length > 0) {
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
    } else {
      document.exitFullscreen();
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

  const likeVideo = async () => {
    if (!user) return navigate("/login");
    
    try {
      const res = await api.post(
        `/api/videos/like/${video._id}`, 
        {}, 
        {  }
      );
      
      setLikes(res.data.likes.length);
      setDislikes(res.data.dislikes.length);
      setUserLiked(res.data.likes.includes(user._id));
      setUserDisliked(res.data.dislikes.includes(user._id));
      
      console.log("✅ Like registered - notification sent to video owner");
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const dislikeVideo = async () => {
    if (!user) return navigate("/login");
    
    try {
      const res = await api.post(
        `/api/videos/dislike/${video._id}`, 
        {}, 
        {  }
      );
      
      setLikes(res.data.likes.length);
      setDislikes(res.data.dislikes.length);
      setUserLiked(res.data.likes.includes(user._id));
      setUserDisliked(res.data.dislikes.includes(user._id));
    } catch (err) {
      console.error("Dislike error:", err);
    }
  };

  const toggleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    
    
    try {
      const res = await api.post(
        `/api/user/subscribe/${channel._id}`, 
        {}, 
        {  }
      );
      
      setSubscribed(res.data.subscribed);
      setChannel(p => ({ 
        ...p, 
        subscribers: res.data.subscribers || p.subscribers 
      }));
      
      if (res.data.subscribed) {
        console.log("✅ Subscribed - notification sent to channel owner");
      }
    } catch (err) {
      console.error("Subscribe error:", err);
    }
  };

  const postComment = async () => {
    if (!comment.trim() || !user) return;
  
  
    const tempComment = {
      _id: Date.now(),
      user: {
        _id: user._id,
        name: user.name || user.username,
        avatar: user.avatar
      },
      text: comment.trim(),
      createdAt: new Date().toISOString(),
      isPending: true,
      replies: []
    };
  
    setVideo(p => ({
      ...p,
      comments: [tempComment, ...(p.comments || [])]
    }));
  
    setComment("");
  
    try {
      const res = await api.post(
        "/api/comments/add",
        {
          videoId: video._id,
          text: tempComment.text
        },
        {
          
        }
      );
  
      setVideo(p => ({
        ...p,
        comments: p.comments.map(c =>
          c._id === tempComment._id ? res.data : c
        )
      }));
  
      console.log("✅ Comment posted - notification sent to video owner");
    } catch (error) {
      console.error("Comment error:", error);
  
      setVideo(p => ({
        ...p,
        comments: p.comments.filter(c => c._id !== tempComment._id)
      }));
    }
  };

  const getSortedComments = () => {
    if (!video?.comments) return [];
    let filtered = [...video.comments];
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

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

  const getAIInsightsMessage = () => {
    switch(aiInsights.status) {
      case "pending":
        return "⏳ AI analysis will begin after captions are generated...";
      case "processing":
        return "🤖 AI is analyzing the video content...";
      case "failed":
        return "❌ AI analysis failed. Please try again later.";
      case "not-available":
        return "ℹ️ AI analysis not available for this video.";
      default:
        return "";
    }
  };

  if (!video) return (
    <div style={styles.loaderContainer}>
      <div className="spinner"></div>
      <p style={styles.loadingText}>Loading amazing content...</p>
    </div>
  );

  return (
    <>
      {/* ========== NAVBAR ========== */}
      <nav style={styles.navbar}>
        <div style={styles.navStart}>
          <button style={styles.iconBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          
          <div style={styles.logo} onClick={() => navigate("/")}>
            <svg viewBox="0 0 90 20" style={styles.logoIcon}>
              <g>
                <path fill="#FF0000" d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" />
                <path fill="#FFFFFF" d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" />
              </g>
            </svg>
            <span style={styles.logoText}>MyTube</span>
          </div>
        </div>

        <div style={styles.navCenter} ref={searchRef}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              style={styles.searchInput}
            />
            <button style={styles.searchBtn} onClick={handleSearchSubmit}>
              <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div style={styles.suggestions}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  style={styles.suggestionItem}
                  onClick={() => {
                    setSearch(s.text);
                    setShowSuggestions(false);
                    navigate(`/?search=${encodeURIComponent(s.text)}`);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: '#aaa' }}>
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                  <span>{s.text}</span>
                  <span style={styles.suggestionType}>{s.type}</span>
                </div>
              ))}
            </div>
          )}

          <button
            style={{
              ...styles.voiceBtn,
              background: isSearchListening ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
            }}
            onClick={startNavbarVoiceSearch}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </div>

        <div style={styles.navEnd}>
          {user ? (
            <>
              <button style={styles.iconBtn} onClick={() => navigate("/UserUpload")}>
                <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </button>
              <Notifications />
              
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button 
                  style={styles.userAvatar}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </button>

                {showUserMenu && (
                  <div style={styles.userDropdown}>
                    <div style={styles.dropdownHeader}>
                      <div style={styles.dropdownAvatar}>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div style={styles.dropdownName}>{user.name}</div>
                        <div style={styles.dropdownEmail}>{user.email}</div>
                      </div>
                    </div>
                    <div style={styles.dropdownDivider} />
                    <button style={styles.dropdownItem} onClick={() => navigate("/profile")}>
                      <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: '#fff' }}>
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      Your channel
                    </button>
                    <button style={styles.dropdownItem} onClick={() => logout()}>
                      <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: '#fff' }}>
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button style={styles.signinBtn} onClick={() => navigate("/login")}>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: '#3ea6ff' }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Sign in
            </button>
          )}
        </div>
      </nav>

      <div style={styles.pageWrapper}>
        <div style={{ 
          ...styles.contentGrid,
          gridTemplateColumns: isTheaterMode ? "1fr" : "1fr 400px",
        }}>
          {/* MAIN CONTENT */}
          <div style={styles.mainContent}>
            {/* Video Player */}
            <div ref={playerContainerRef} style={styles.playerWrapper}>
              {/* Use HLSPlayer if hlsPath exists, otherwise fallback to MP4 */}
              {video.hlsPath && !showAd ? (
                <HLSPlayer
                  videoId={video._id}
                  hlsPath={video.hlsPath}
                  onTimeUpdate={handleTimeUpdate}
                  autoPlay={true}
                  controls={true}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={
                    showAd && ad
                      ? `${process.env.REACT_APP_API_URL}/uploads/ads/${ad.videoFile}`
                      : `${process.env.REACT_APP_API_URL}/api/stream/${video.filename}?q=${videoQuality}`
                  }
                  crossOrigin="anonymous"
                  controls
                  autoPlay
                  onTimeUpdate={(e) => {
                    if (showAd) {
                      setAdTime(e.target.currentTime);
                    } else {
                      handleTimeUpdate();
                    }
                  }}
                  onEnded={() => {
                    if (showAd) {
                      setShowAd(false);
                      setAdTime(0);
                    } else {
                      handleVideoEnd();
                    }
                  }}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  style={styles.videoElement}
                >
                  {video.captions && (
                    <track
                      kind="subtitles"
                      src={`${process.env.REACT_APP_API_URL}/captions/${video.captions}`}
                      srcLang="en"
                      label="English (Auto)"
                    />
                  )}
                </video>
              )}

              {showAd && ad && adTime >= ad.skipAfter && (
                <button
                  onClick={async () => {
                    try {
                      await api.post(`/api/ads/click/${ad._id}`, {
                        videoId: video._id
                      });
                    } catch (err) {
                      console.error("❌ Failed to track ad click:", err);
                    }
                    setShowAd(false);
                    setAdTime(0);
                  }}
                  style={styles.skipAdButton}
                >
                  Skip Ad →
                </button>
              )}

              {lastCommand && (
                <div style={styles.voiceFeedback}>
                  <MdGraphicEq size={20} style={{ animation: 'pulse 1s infinite' }} />
                  <span>{lastCommand}</span>
                </div>
              )}

              <div style={styles.videoControls}>
                <button 
                  onClick={toggleVoiceControl} 
                  style={{
                    ...styles.controlBtn,
                    background: isListening 
                      ? "linear-gradient(135deg, #ff0000 0%, #ff4444 100%)"
                      : "rgba(0,0,0,0.7)",
                    animation: isListening ? 'pulse 1.5s infinite' : 'none',
                  }}
                  title={isListening ? "Voice Control Active - Click to stop" : "Activate Voice Control"}
                >
                  {isListening ? <MdGraphicEq size={20} /> : <FiMic size={20} />}
                  <span style={{marginLeft: 4, fontSize: '11px', fontWeight: 700}}>
                    {isListening ? 'Listening...' : 'Voice'}
                  </span>
                </button>

                <button onClick={toggleTheaterMode} style={styles.controlBtn} title="Theater mode">
                  {isTheaterMode ? <MdOutlineFullscreenExit size={20} /> : <MdOutlineScreenShare size={20} />}
                </button>
                
                <button 
                  onClick={toggleSubtitles} 
                  style={{
                    ...styles.controlBtn, 
                    background: showSubtitles ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(0,0,0,0.7)"
                  }}
                  disabled={!captionsAvailable}
                  title="Subtitles"
                >
                  CC
                </button>
                
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} style={styles.controlBtn}>
                    <MdOutlineSpeed size={20} /> 
                    <span style={{marginLeft: 4}}>{playbackSpeed}x</span>
                  </button>
                  {showSpeedMenu && (
                    <div style={styles.controlMenu}>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(s => (
                        <div 
                          key={s} 
                          onClick={() => changePlaybackSpeed(s)} 
                          style={{
                            ...styles.menuItem,
                            background: playbackSpeed === s ? "rgba(102, 126, 234, 0.2)" : "transparent"
                          }}
                        >
                          <span>{s === 1 ? 'Normal' : `${s}x`}</span>
                          {playbackSpeed === s && <FiCheck size={16} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowQualityMenu(!showQualityMenu)} style={styles.controlBtn}>
                    <FiZap size={18} /> 
                    <span style={{marginLeft: 4}}>{videoQuality}</span>
                  </button>
                  {showQualityMenu && (
                    <div style={styles.controlMenu}>
                      {['auto', 'original', '720p', '480p'].map(q => (
                        <div 
                          key={q} 
                          onClick={() => handleQualityChange(q)} 
                          style={{
                            ...styles.menuItem,
                            background: videoQuality === q ? "rgba(102, 126, 234, 0.2)" : "transparent"
                          }}
                        >
                          <span>{q === 'auto' ? 'Auto' : q}</span>
                          {videoQuality === q && <FiCheck size={16} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen} style={styles.controlBtn} title="Fullscreen">
                  <FiMaximize size={20} />
                </button>
              </div>
            </div>

            {isListening && (
              <div style={styles.voiceHelpCard}>
                <div style={styles.voiceHelpHeader}>
                  <MdGraphicEq size={24} style={{ color: '#ff0000', animation: 'pulse 1.5s infinite' }} />
                  <h4 style={styles.voiceHelpTitle}>Voice Control Active</h4>
                </div>
                <div style={styles.voiceCommands}>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Playback:</span>
                    <span style={styles.commandText}>"Play" • "Pause" • "Stop"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Navigation:</span>
                    <span style={styles.commandText}>"Skip 30" • "Rewind 10" • "Next video"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Audio:</span>
                    <span style={styles.commandText}>"Mute" • "Volume up" • "Volume down"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Display:</span>
                    <span style={styles.commandText}>"Fullscreen" • "Theater mode" • "Subtitles"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Actions:</span>
                    <span style={styles.commandText}>"Like this" • "Subscribe"</span>
                  </div>
                </div>
              </div>
            )}

            <h1 style={styles.videoTitle}>{video.title}</h1>

            <div style={styles.statsBar}>
              <div style={styles.stat}>
                <FiEye size={16} />
                <span>{formatViews(video.views)} views</span>
              </div>
              <div style={styles.stat}>
                <FiClock size={16} />
                <span>{getTimeAgo(video.createdAt)}</span>
              </div>
              <div style={styles.stat}>
                <FiTrendingUp size={16} />
                <span>{formatViews(likes)} likes</span>
              </div>
            </div>

            {(!user || !user.isPremium) && <WatchAd />}

            {showAIInsights && (
              <div style={styles.aiCard}>
                <div style={styles.aiHeader}>
                  <div style={styles.aiTitleSection}>
                    <MdAutoAwesome style={styles.aiIcon} size={24} />
                    <h3 style={styles.aiTitle}>AI Insights</h3>
                    {aiInsights.status === "ready" && aiInsights.sentiment && (
                      <span style={styles.sentimentPill}>{aiInsights.sentiment}</span>
                    )}
                  </div>
                  <button onClick={() => setShowAIInsights(false)} style={styles.closeAIBtn}>
                    ×
                  </button>
                </div>
                
                <div style={styles.aiBody}>
                  {aiInsights.status === "ready" && aiInsights.summary ? (
                    <div style={styles.summaryGrid}>
                      {aiInsights.summary.split('\n').filter(line => line.trim()).map((line, i) => (
                        <div key={i} style={styles.summaryPoint}>
                          <div style={styles.pointBullet}></div>
                          <p style={styles.pointText}>{line.trim()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.aiLoading}>
                      <div className="pulse"></div>
                      <p>{getAIInsightsMessage()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={styles.actionBar}>
              <div style={styles.channelSection}>
                {channel && (
                  <>
                    <div 
                      style={styles.channelInfo} 
                      onClick={() => navigate(`/profile/${channel._id}`)}
                    >
                      <div style={styles.avatar}>
                        {channel.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.channelName}>{channel.name}</div>
                        <div style={styles.subCount}>
                          {formatViews(channel.subscribers?.length || 0)} subscribers
                        </div>
                      </div>
                    </div>
                    <button 
                      style={subscribed ? styles.subscribedBtn : styles.subscribeBtn} 
                      onClick={toggleSubscribe}
                    >
                      {subscribed ? (
                        <>
                          <FiBell size={18} />
                          Subscribed
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </>
                )}
              </div>

              <div style={styles.actionsGroup}>
                <div style={styles.likeGroup}>
                  <button 
                    onClick={likeVideo} 
                    style={{
                      ...styles.actionBtn,
                      borderRadius: "24px 0 0 24px"
                    }}
                  >
                    <FiThumbsUp size={20} fill={userLiked ? "#fff" : "none"} />
                    <span>{formatViews(likes)}</span>
                  </button>
                  <div style={styles.separator}></div>
                  <button 
                    onClick={dislikeVideo} 
                    style={{
                      ...styles.actionBtn,
                      borderRadius: "0 24px 24px 0"
                    }}
                  >
                    <FiThumbsDown size={20} fill={userDisliked ? "#fff" : "none"} />
                  </button>
                </div>

                <button style={styles.actionBtn}>
                  <FiShare2 size={20} />
                  <span>Share</span>
                </button>

                <button onClick={toggleSave} style={styles.actionBtn}>
                  <FiHeart size={20} fill={isSaved ? "#ff0000" : "none"} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button style={styles.moreBtn}>
                  <FiMoreVertical size={20} />
                </button>
              </div>
            </div>

            <div style={styles.descCard}>
              <p style={styles.descText}>
                {showDescription 
                  ? video.description 
                  : video.description?.slice(0, 200) + (video.description?.length > 200 ? '...' : '')
                }
              </p>
              {video.description?.length > 200 && (
                <button 
                  onClick={() => setShowDescription(!showDescription)} 
                  style={styles.showMoreBtn}
                >
                  {showDescription ? 'Show less' : 'Show more'}
                  {showDescription ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
              )}
            </div>

            <div style={styles.commentsWrapper}>
              <div style={styles.commentsHead}>
                <h2 style={styles.commentsCount}>
                  {video.comments?.length || 0} Comments
                </h2>
                <button style={styles.sortBtn}>
                  <MdSort size={22} />
                  Sort by
                </button>
              </div>

              {user && (
                <div style={styles.addComment}>
                  <div style={styles.commentAvatar}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={styles.commentInputWrapper}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && postComment()}
                      style={styles.commentField}
                    />
                    {comment.trim() && (
                      <div style={styles.commentBtns}>
                        <button onClick={() => setComment("")} style={styles.cancelBtn}>
                          Cancel
                        </button>
                        <button onClick={postComment} style={styles.postBtn}>
                          <FiSend size={16} />
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={styles.commentList}>
                {getSortedComments().map((c) => (
                  <div key={c._id} style={styles.commentCard}>
                    <div style={styles.commentAvatar}>
                      {c.user?.name?.charAt(0).toUpperCase() || c.user?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={styles.commentBody}>
                      <div style={styles.commentMeta}>
                        <span style={styles.commentUser}>
                          {c.user?.name || c.user || 'Anonymous'}
                        </span>
                        <span style={styles.commentDate}>
                          {getTimeAgo(c.createdAt)}
                        </span>
                      </div>
                      <p style={styles.commentContent}>{c.text}</p>
                      <div style={styles.commentActions}>
                        <button style={styles.commentBtn}>
                          <FiThumbsUp size={14} />
                        </button>
                        <button style={styles.commentBtn}>
                          <FiThumbsDown size={14} />
                        </button>
                        <button style={styles.commentBtn}>Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isTheaterMode && (
            <div style={styles.sidebar}>
              <h3 style={styles.sidebarHead}>Up Next</h3>
              <div style={styles.recList}>
                {recommended.map((v) => (
                  <div 
                    key={v._id} 
                    style={styles.recCard}
                    onClick={() => navigate(`/watch/${v.filename}`)}
                  >
                    <div style={styles.recThumb}>
                      <img 
                        src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                        alt={v.title}
                        style={styles.thumbImg}
                      />
                      <div style={styles.duration}>
                        {v.duration || '10:23'}
                      </div>
                    </div>
                    <div style={styles.recInfo}>
                      <h4 style={styles.recTitle}>{v.title}</h4>
                      <p style={styles.recChannel}>
                        {v.uploadedBy?.name || 'Unknown'}
                      </p>
                      <div style={styles.recMeta}>
                        <span>{formatViews(v.views)} views</span>
                        <span style={styles.metaDot}>•</span>
                        <span>{getTimeAgo(v.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(255,255,255,0.1);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .pulse {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          borderRadius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
      `}</style>
    </>
  );
}

/* ================= STYLES ================= */
const styles = {
  // Navbar Styles
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '56px',
    background: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 2000,
    borderBottom: '1px solid #3f3f3f',
  },
  navStart: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '0 0 auto',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    color: '#f1f1f1',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '90px',
    height: '20px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
    color: '#fff',
  },
  navCenter: {
    flex: 1,
    maxWidth: '640px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
  },
  searchContainer: {
    flex: 1,
    display: 'flex',
    height: '40px',
    border: '1px solid #303030',
    borderRadius: '40px',
    overflow: 'hidden',
    background: '#121212',
  },
  searchInput: {
    flex: 1,
    padding: '0 16px',
    background: 'transparent',
    border: 'none',
    color: '#f1f1f1',
    fontSize: '16px',
    outline: 'none',
  },
  searchBtn: {
    width: '64px',
    background: '#222',
    border: 'none',
    borderLeft: '1px solid #303030',
    color: '#f1f1f1',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: '76px',
    background: '#212121',
    border: '1px solid #303030',
    borderRadius: '12px',
    marginTop: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    zIndex: 3000,
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    cursor: 'pointer',
    color: '#f1f1f1',
    fontSize: '14px',
  },
  suggestionType: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: '#aaa',
    textTransform: 'uppercase',
  },
  voiceBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    color: '#f1f1f1',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
  },
  navEnd: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '0 0 auto',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#ff0000',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '300px',
    background: '#282828',
    border: '1px solid #3f3f3f',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    zIndex: 3000,
  },
  dropdownHeader: {
    padding: '16px',
    display: 'flex',
    gap: '12px',
  },
  dropdownAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#ff0000',
    color: '#fff',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownName: {
    fontWeight: '500',
    fontSize: '16px',
    marginBottom: '4px',
    color: '#fff',
  },
  dropdownEmail: {
    fontSize: '14px',
    color: '#aaa',
  },
  dropdownDivider: {
    height: '1px',
    background: '#3f3f3f',
    margin: '8px 0',
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    color: '#f1f1f1',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  signinBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 15px',
    background: 'transparent',
    border: '1px solid #3ea6ff',
    borderRadius: '40px',
    color: '#3ea6ff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },

  // Page Styles
  pageWrapper: {
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
    minHeight: "100vh",
    padding: "80px 20px 40px",
    color: "#fff",
  },
  contentGrid: {
    display: "grid",
    gap: "24px",
    maxWidth: "1800px",
    margin: "0 auto",
  },
  mainContent: {
    minWidth: 0,
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    gap: "20px",
  },
  loadingText: {
    fontSize: "18px",
    color: "#888",
    fontWeight: "500",
  },
  playerWrapper: {
    position: "relative",
    background: "#000",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
  },
  videoElement: {
    width: "100%",
    aspectRatio: "16/9",
    display: "block",
  },
  skipAdButton: {
    position: "absolute",
    bottom: "90px",
    right: "20px",
    padding: "12px 24px",
    background: "rgba(0,0,0,0.9)",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    zIndex: 20,
    transition: "all 0.3s",
  },
  voiceFeedback: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0.95)",
    backdropFilter: "blur(20px)",
    padding: "20px 40px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 100,
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
    border: "2px solid rgba(255,255,255,0.2)",
  },
  videoControls: {
    position: "absolute",
    top: "16px",
    right: "16px",
    display: "flex",
    gap: "10px",
    zIndex: 10,
    flexWrap: "wrap",
  },
  controlBtn: {
    padding: "10px 14px",
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.3s",
  },
  controlMenu: {
    position: "absolute",
    top: "110%",
    right: 0,
    background: "rgba(15,15,15,0.98)",
    backdropFilter: "blur(20px)",
    borderRadius: "12px",
    padding: "8px",
    minWidth: "160px",
    zIndex: 1000,
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  menuItem: {
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  voiceHelpCard: {
    background: "linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 68, 68, 0.1) 100%)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
  voiceHelpHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  voiceHelpTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
    color: "#fff",
  },
  voiceCommands: {
    display: "grid",
    gap: "8px",
  },
  commandGroup: {
    display: "flex",
    gap: "10px",
    fontSize: "13px",
    alignItems: "baseline",
  },
  commandLabel: {
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    minWidth: "80px",
  },
  commandText: {
    color: "rgba(255,255,255,0.6)",
  },
  videoTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #fff 0%, #ccc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: "1.4",
  },
  statsBar: {
    display: "flex",
    gap: "24px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  adBanner: {
    position: "relative",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "20px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
  },
  adGlowEffect: {
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
    animation: "rotate 20s linear infinite",
  },
  adContent: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  adIcon: {
    fontSize: "32px",
  },
  adTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#fff",
  },
  adText: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.95)",
    lineHeight: "1.5",
  },
  premiumBtn: {
    padding: "12px 24px",
    background: "#fff",
    color: "#667eea",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    marginLeft: "auto",
    transition: "all 0.3s",
    boxShadow: "0 4px 16px rgba(255,255,255,0.2)",
  },
  aiCard: {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid rgba(102, 126, 234, 0.3)",
    boxShadow: "0 0 30px rgba(102, 126, 234, 0.2)",
    backdropFilter: "blur(10px)",
  },
  aiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  aiTitleSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  aiIcon: {
    color: "#667eea",
    filter: "drop-shadow(0 0 8px rgba(102, 126, 234, 0.6))",
  },
  aiTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  sentimentPill: {
    padding: "6px 14px",
    background: "rgba(102, 126, 234, 0.2)",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#b8c5ff",
    border: "1px solid rgba(102, 126, 234, 0.3)",
  },
  closeAIBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
  },
  aiBody: {
    fontSize: "14px",
    lineHeight: "1.8",
  },
  summaryGrid: {
    display: "grid",
    gap: "12px",
  },
  summaryPoint: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  pointBullet: {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    marginTop: "6px",
    flexShrink: 0,
    boxShadow: "0 0 8px rgba(102, 126, 234, 0.5)",
  },
  pointText: {
    margin: 0,
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  aiLoading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    color: "rgba(255,255,255,0.7)",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "16px",
  },
  channelSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  channelInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
  },
  channelName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
  },
  subCount: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  subscribeBtn: {
    padding: "12px 24px",
    background: "#ff0000",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.3s",
    boxShadow: "0 4px 16px rgba(255, 0, 0, 0.3)",
  },
  subscribedBtn: {
    padding: "12px 24px",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "24px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s",
  },
  actionsGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  likeGroup: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "24px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  actionBtn: {
    padding: "12px 20px",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s",
    backdropFilter: "blur(10px)",
  },
  separator: {
    width: "1px",
    height: "24px",
    background: "rgba(255,255,255,0.2)",
  },
  moreBtn: {
    padding: "12px",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    backdropFilter: "blur(10px)",
  },
  descCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "32px",
    backdropFilter: "blur(10px)",
  },
  descText: {
    fontSize: "14px",
    lineHeight: "1.8",
    color: "rgba(255,255,255,0.85)",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  showMoreBtn: {
    marginTop: "16px",
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.3s",
  },
  commentsWrapper: {
    marginTop: "32px",
  },
  commentsHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  commentsCount: {
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
  },
  sortBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
  addComment: {
    display: "flex",
    gap: "16px",
    marginBottom: "36px",
  },
  commentAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    flexShrink: 0,
  },
  commentInputWrapper: {
    flex: 1,
  },
  commentField: {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: "15px",
    padding: "12px 0",
    outline: "none",
    transition: "all 0.3s",
  },
  commentBtns: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px",
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "none",
    border: "none",
    borderRadius: "24px",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s",
  },
  postBtn: {
    padding: "10px 20px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s",
    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
  },
  commentList: {
    display: "grid",
    gap: "28px",
  },
  commentCard: {
    display: "flex",
    gap: "16px",
  },
  commentBody: {
    flex: 1,
  },
  commentMeta: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "6px",
  },
  commentUser: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff",
  },
  commentDate: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
  },
  commentContent: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.9)",
    margin: "0 0 10px 0",
  },
  commentActions: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  commentBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "600",
    padding: "6px 12px",
    borderRadius: "20px",
    transition: "all 0.3s",
  },
  sidebar: {
    width: "100%",
  },
  sidebarHead: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  recList: {
    display: "grid",
    gap: "16px",
  },
  recCard: {
    display: "flex",
    gap: "12px",
    cursor: "pointer",
    borderRadius: "12px",
    padding: "10px",
    transition: "all 0.3s",
    background: "rgba(255,255,255,0.03)",
  },
  recThumb: {
    position: "relative",
    width: "168px",
    height: "94px",
    flexShrink: 0,
    borderRadius: "10px",
    overflow: "hidden",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  duration: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    background: "rgba(0,0,0,0.9)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 6px",
    borderRadius: "4px",
  },
  recInfo: {
    flex: 1,
    minWidth: 0,
  },
  recTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    margin: "0 0 6px 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    lineHeight: "1.4",
  },
  recChannel: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
    margin: "0 0 4px 0",
    fontWeight: "500",
  },
  recMeta: {
    display: "flex",
    gap: "6px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
    alignItems: "center",
  },
  metaDot: {
    fontSize: "10px",
  },
};



// import React, { useEffect, useState, useContext, useRef } from "react";
// import api from "../config/api";
// import { io } from "socket.io-client";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { 
//   FiThumbsUp, FiThumbsDown, FiShare2, FiBell, FiCheck, 
//   FiZap, FiMoreVertical, FiChevronDown, FiChevronUp, FiCpu,
//   FiMaximize, FiSend, FiTrendingUp, FiEye, FiClock, FiHeart, FiMic, FiMicOff
// } from "react-icons/fi";
// import { 
//   MdOutlineScreenShare, 
//   MdOutlineFullscreenExit, 
//   MdOutlineSpeed, 
//   MdPlaylistAdd, 
//   MdSort,
//   MdAutoAwesome,
//   MdVolumeUp,
//   MdVolumeDown,
//   MdGraphicEq
// } from 'react-icons/md';

// const WatchAd = () => (
//   <div style={styles.adBanner}>
//     <div style={styles.adGlowEffect}></div>
//     <div style={styles.adContent}>
//       <div style={styles.adIcon}>⭐</div>
//       <div>
//         <h3 style={styles.adTitle}>Upgrade to Premium</h3>
//         <p style={styles.adText}>
//           Ad-free videos, background play, and exclusive content
//         </p>
//       </div>
//       <button onClick={() => window.location.href = "/profile"} style={styles.premiumBtn}>
//         Premium $99
//       </button>
//     </div>
//   </div>
// );

// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const socketRef = useRef(null);
//   const videoRef = useRef(null);
//   const playerContainerRef = useRef(null);
//   const recognitionRef = useRef(null); // 🎙️ Voice Recognition

//   // Ad States
//   const [ad, setAd] = useState(null);
//   const [showAd, setShowAd] = useState(false);
//   const [adTime, setAdTime] = useState(0);

//   // Video & Channel Data
//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [isQualitySwitching, setIsQualitySwitching] = useState(false);
  
//   // AI Insights
//   const [aiInsights, setAiInsights] = useState({ summary: "", sentiment: "", status: "pending" });
//   const [showAIInsights, setShowAIInsights] = useState(true);
  
//   // Comment States
//   const [comment, setComment] = useState("");
//   const [sortComments, setSortComments] = useState('top');
  
//   // Like/Dislike
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [userDisliked, setUserDisliked] = useState(false);
  
//   // Subscription
//   const [subscribed, setSubscribed] = useState(false);
  
//   // UI States
//   const [showDescription, setShowDescription] = useState(false);
//   const [isTheaterMode, setIsTheaterMode] = useState(false);
  
//   // Video Controls
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [videoQuality, setVideoQuality] = useState('original');
//   const [showQualityMenu, setShowQualityMenu] = useState(false);
//   const [captionsAvailable, setCaptionsAvailable] = useState(false);
//   const [showSubtitles, setShowSubtitles] = useState(false);
  
//   // Features
//   const [isSaved, setIsSaved] = useState(false);

//   // 🎙️ Voice Control States
//   const [isListening, setIsListening] = useState(false);
//   const [lastCommand, setLastCommand] = useState("");
//   const [voiceSupported, setVoiceSupported] = useState(true);

//   /* ================= VOICE CONTROL SETUP ================= */
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.warn("🎙️ Speech Recognition not supported");
//       setVoiceSupported(false);
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-IN"; // Hinglish friendly
//     recognition.continuous = true;
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const text = event.results[event.results.length - 1][0].transcript
//         .toLowerCase()
//         .trim();

//       console.log("🎙️ Voice Command:", text);
//       setLastCommand(text);
//       handleVoiceCommand(text);
//     };

//     recognition.onerror = (event) => {
//       console.error("🎙️ Recognition error:", event.error);
//       if (event.error === 'no-speech') {
//         // Auto-restart on no speech
//         if (isListening) {
//           setTimeout(() => {
//             try {
//               recognition.start();
//             } catch (e) {}
//           }, 1000);
//         }
//       }
//     };

//     recognition.onend = () => {
//       if (isListening) {
//         try {
//           recognition.start(); // auto-restart
//         } catch (e) {
//           console.log("🎙️ Recognition restart failed");
//         }
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       if (recognition) {
//         recognition.stop();
//       }
//     };
//   }, [isListening]);

//   /* ================= VOICE COMMAND HANDLER ================= */
//   function handleVoiceCommand(command) {
//     const video = videoRef.current;
//     if (!video) return;

//     // ▶️ Play
//     if (command.includes("play") || command.includes("start")) {
//       video.play();
//       showVoiceFeedback("▶️ Playing");
//     }

//     // ⏸ Pause / Stop
//     else if (command.includes("pause") || command.includes("stop")) {
//       video.pause();
//       showVoiceFeedback("⏸ Paused");
//     }

//     // ⏩ Skip seconds
//     else if (command.includes("skip") || command.includes("forward")) {
//       let seconds = 10; // default
      
//       const matchNumber = command.match(/(\d+)/);
//       if (matchNumber) {
//         seconds = parseInt(matchNumber[1]);
//       }
      
//       // Handle "one minute", "two minutes"
//       if (command.includes("one minute")) seconds = 60;
//       else if (command.includes("two minute")) seconds = 120;
//       else if (command.includes("three minute")) seconds = 180;
      
//       video.currentTime += seconds;
//       showVoiceFeedback(`⏩ Skipped ${seconds}s`);
//     }

//     // ⏪ Rewind
//     else if (command.includes("rewind") || command.includes("back")) {
//       let seconds = 10;
//       const matchNumber = command.match(/(\d+)/);
//       if (matchNumber) {
//         seconds = parseInt(matchNumber[1]);
//       }
//       video.currentTime -= seconds;
//       showVoiceFeedback(`⏪ Rewound ${seconds}s`);
//     }

//     // 🔇 Mute
//     else if (command.includes("mute")) {
//       video.muted = true;
//       showVoiceFeedback("🔇 Muted");
//     }

//     // 🔊 Unmute
//     else if (command.includes("unmute")) {
//       video.muted = false;
//       showVoiceFeedback("🔊 Unmuted");
//     }

//     // 🔊 Volume Up
//     else if (command.includes("volume up") || command.includes("increase volume")) {
//       video.volume = Math.min(1, video.volume + 0.2);
//       showVoiceFeedback(`🔊 Volume: ${Math.round(video.volume * 100)}%`);
//     }

//     // 🔉 Volume Down
//     else if (command.includes("volume down") || command.includes("decrease volume")) {
//       video.volume = Math.max(0, video.volume - 0.2);
//       showVoiceFeedback(`🔉 Volume: ${Math.round(video.volume * 100)}%`);
//     }

//     // ⛶ Fullscreen
//     else if (command.includes("full screen") || command.includes("fullscreen")) {
//       toggleFullscreen();
//       showVoiceFeedback("⛶ Fullscreen");
//     }

//     // 🚪 Exit Fullscreen
//     else if (command.includes("exit full") || command.includes("minimize")) {
//       if (document.fullscreenElement) {
//         document.exitFullscreen();
//         showVoiceFeedback("🚪 Exit Fullscreen");
//       }
//     }

//     // 🎬 Theater Mode
//     else if (command.includes("theater") || command.includes("theatre")) {
//       toggleTheaterMode();
//       showVoiceFeedback("🎬 Theater Mode");
//     }

//     // 💬 Subtitles/Captions
//     else if (command.includes("subtitle") || command.includes("caption") || command.includes("cc")) {
//       toggleSubtitles();
//       showVoiceFeedback(showSubtitles ? "💬 Subtitles Off" : "💬 Subtitles On");
//     }

//     // 👍 Like Video
//     else if (command.includes("like this") || command.includes("like video")) {
//       likeVideo();
//       showVoiceFeedback("👍 Liked");
//     }

//     // 🔔 Subscribe
//     else if (command.includes("subscribe")) {
//       if (channel && !subscribed) {
//         toggleSubscribe({ stopPropagation: () => {} });
//         showVoiceFeedback("🔔 Subscribed");
//       }
//     }

//     // ⏭️ Next Video
//     else if (command.includes("next video") || command.includes("next")) {
//       if (recommended.length > 0 && recommended[0]?.filename) {
//         navigate(`/watch/${recommended[0].filename}`);
//         showVoiceFeedback("⏭️ Next Video");
//       }
//     }

//     // 🔄 Restart
//     else if (command.includes("restart") || command.includes("replay")) {
//       video.currentTime = 0;
//       video.play();
//       showVoiceFeedback("🔄 Restarting");
//     }

//     // 🎵 Speed Controls
//     else if (command.includes("speed up") || command.includes("faster")) {
//       const newSpeed = Math.min(2, playbackSpeed + 0.25);
//       changePlaybackSpeed(newSpeed);
//       showVoiceFeedback(`🎵 Speed: ${newSpeed}x`);
//     }
//     else if (command.includes("slow down") || command.includes("slower")) {
//       const newSpeed = Math.max(0.25, playbackSpeed - 0.25);
//       changePlaybackSpeed(newSpeed);
//       showVoiceFeedback(`🎵 Speed: ${newSpeed}x`);
//     }
//     else if (command.includes("normal speed")) {
//       changePlaybackSpeed(1);
//       showVoiceFeedback("🎵 Normal Speed");
//     }
//   }

//   /* ================= VOICE FEEDBACK ================= */
//   function showVoiceFeedback(message) {
//     setLastCommand(message);
//     setTimeout(() => setLastCommand(""), 3000);
//   }

//   /* ================= TOGGLE VOICE CONTROL ================= */
//   const toggleVoiceControl = () => {
//     if (!voiceSupported) {
//       alert("Voice control is not supported in your browser. Please use Chrome, Edge, or Safari.");
//       return;
//     }

//     if (!isListening) {
//       try {
//         recognitionRef.current?.start();
//         setIsListening(true);
//         showVoiceFeedback("🎙️ Voice Control Active");
//       } catch (err) {
//         console.error("Failed to start recognition:", err);
//         alert("Could not start voice recognition. Please check microphone permissions.");
//       }
//     } else {
//       recognitionRef.current?.stop();
//       setIsListening(false);
//       showVoiceFeedback("🎙️ Voice Control Off");
//     }
//   };

//   /* ================= FETCH VIDEO ================= */
//   const fetchVideo = async () => {
//     try {
//       const res = await api.get(`/api/videos/by-filename/${filename}`);
//       setVideo(res.data);
//       setLikes(res.data.likes?.length || 0);
//       setDislikes(res.data.dislikes?.length || 0);
      
//       setAiInsights({
//         summary: res.data.aiSummary || "",
//         sentiment: res.data.sentiment || "Neutral",
//         status: res.data.summaryStatus || "pending"
//       });

//       if (user) {
//         setUserLiked(res.data.likes?.includes(user._id));
//         setUserDisliked(res.data.dislikes?.includes(user._id));
//         checkIfSaved(res.data._id);
//       }

//       if (res.data.uploadedBy?._id) {
//         fetchChannel(res.data.uploadedBy._id);
//         fetchComments(res.data._id);
//       }

//       if (user && res.data._id) {
//         addToHistory(res.data._id);
//       }

//       if (res.data?._id && (!user || !user.isPremium)) {
//         fetchAd(res.data._id);
//       }
//     } catch (error) {
//       console.error("Error fetching video:", error);
//     }
//   };

//   const fetchChannel = async (id) => {
//     const res = await api.get(`/api/user/profile/${id}`);
//     setChannel(res.data);
//     if (user) setSubscribed(res.data.subscribers?.includes(user._id));
//   };

//   const fetchComments = async (id) => {
//     const res = await api.get(`/api/comments/video/${id}`);
//     setVideo((p) => ({ ...p, comments: res.data })); 
//   };

//   const fetchRecommended = async () => {
//     try {
//       const matrixRes = await api.get(`/api/videos/similar/${filename}`);
      
//       if (matrixRes.data && matrixRes.data.length > 0) {
//         setRecommended(matrixRes.data.slice(0, 15));
//       } else {
//         throw new Error("Matrix returned empty");
//       }
//     } catch (err) {
//       try {
//         const allRes = await api.get("/api/videos/all");
//         const popular = allRes.data
//           .filter(v => v.filename !== filename)
//           .sort((a, b) => (b.views || 0) - (a.views || 0))
//           .slice(0, 15);
//         setRecommended(popular);
//       } catch (fallbackErr) {
//         setRecommended([]);
//       }
//     }
//   };

//   const addToHistory = async (videoId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       await api.post(
//         `/api/user/watch-history/add/${videoId}`,
//         {},
//         {  }
//       );
//     } catch (err) {
//       console.error("Failed to add to history:", err);
//     }
//   };

//   const fetchAd = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
//       const res = await api.get(`/api/ads/${videoId}`, { headers });
      
//       if (res.data) {
//         setAd(res.data);
//         setShowAd(true);
//         setAdTime(0);
//         console.log("📺 Ad loaded:", res.data.title);
//       }
//     } catch (err) {
//       console.error("Ad fetch error", err);
//     }
//   };

//   const getAutoQuality = () => {
//     const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
//     if (connection) {
//       const type = connection.effectiveType;
//       if (type === '4g') return '720p';
//       if (type === '3g') return '480p';
//       return 'original';
//     }
//     return 'original';
//   };

//   useEffect(() => {
//     fetchVideo();
//     api.post(`/api/videos/view/${filename}`);
//   }, [filename, user?._id]);

//   useEffect(() => {
//     socketRef.current = io("http://localhost:5000");
//     if (video?._id) {
//       socketRef.current.emit("join-video", video._id);
//     }
    
//     socketRef.current.on("caption-ready", (data) => {
//       setVideo((prev) => ({ ...prev, captions: data.captions }));
//     });

//     socketRef.current.on("summary-ready", (data) => {
//       if (data.videoId === video?._id) {
//         setAiInsights({
//           summary: data.summary || "",
//           sentiment: data.sentiment || "Neutral",
//           status: "ready"
//         });
//       }
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [video?._id]);

//   useEffect(() => {
//     if (video) fetchRecommended();
//   }, [video]);

//   useEffect(() => {
//     if (aiInsights.status === "pending" || aiInsights.status === "processing") {
//       const interval = setInterval(async () => {
//         try {
//           const res = await api.get(`/api/videos/by-filename/${filename}`);
//           if (res.data.summaryStatus === "ready" && res.data.aiSummary) {
//             setAiInsights({
//               summary: res.data.aiSummary,
//               sentiment: res.data.sentiment || "Neutral",
//               status: "ready"
//             });
//           }
//         } catch (err) {
//           console.error("Error polling for summary:", err);
//         }
//       }, 10000);

//       return () => clearInterval(interval);
//     }
//   }, [aiInsights.status, filename]);

//   const handleQualityChange = (newQuality) => {
//     if (!videoRef.current || !video) return;
  
//     let targetQuality = newQuality;
//     if (newQuality === 'auto') {
//       targetQuality = getAutoQuality();
//     }
  
//     const currentTime = videoRef.current.currentTime;
//     const isPlaying = !videoRef.current.paused;
  
//     setIsQualitySwitching(true);
//     setVideoQuality(newQuality);
//     setShowQualityMenu(false);
  
//     const newSource = `/api/stream/${video.filename}?q=${targetQuality}`;
//     videoRef.current.src = newSource;
  
//     const syncAndPlay = () => {
//       videoRef.current.currentTime = currentTime;
//       if (isPlaying) videoRef.current.play();
//       setIsQualitySwitching(false);
//       videoRef.current.removeEventListener('loadedmetadata', syncAndPlay);
//     };
  
//     videoRef.current.addEventListener('loadedmetadata', syncAndPlay);
//     videoRef.current.load();
//   };

//   const checkIfSaved = async (videoId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const res = await api.get(`/api/user/saved/${videoId}`, {
//         
//       });
//       setIsSaved(res.data.isSaved);
//     } catch (err) {}
//   };

//   const toggleSave = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     try {
//       await api.post(`/api/user/save/${video._id}`, {}, {
//         
//       });
//       setIsSaved(!isSaved);
//     } catch (err) {}
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
//     }
//   };

//   const handleVideoEnd = () => {
//     if (recommended.length > 0) {
//       const nextVideo = recommended[0];
//       if (nextVideo?.filename) navigate(`/watch/${nextVideo.filename}`);
//     }
//   };

//   const changePlaybackSpeed = (speed) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = speed;
//       setPlaybackSpeed(speed);
//       setShowSpeedMenu(false);
//     }
//   };

//   const toggleTheaterMode = () => setIsTheaterMode(!isTheaterMode);

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       playerContainerRef.current?.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const toggleSubtitles = () => {
//     const videoEl = videoRef.current;
//     if (!videoEl) return;
//     const tracks = videoEl.textTracks;
//     if (!tracks || tracks.length === 0) return;
//     const nextState = !showSubtitles;
//     setShowSubtitles(nextState);
//     for (let i = 0; i < tracks.length; i++) {
//       tracks[i].mode = nextState ? "showing" : "hidden";
//     }
//   };

//   const handleVideoLoadedMetadata = () => {
//     const videoEl = videoRef.current;
//     if (!videoEl) return;
//     const tracks = videoEl.textTracks;
//     if (tracks && tracks.length > 0) {
//       setCaptionsAvailable(true);
//       for (let i = 0; i < tracks.length; i++) tracks[i].mode = "hidden";
//       setShowSubtitles(false);
//     } else {
//       setCaptionsAvailable(false);
//     }
//   };

//   const likeVideo = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await api.post(`/api/videos/like/${video._id}`, {}, {
//       
//     });
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const dislikeVideo = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await api.post(`/api/videos/dislike/${video._id}`, {}, {
//       
//     });
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const toggleSubscribe = async (e) => {
//     e.stopPropagation();
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await api.post(`/api/user/subscribe/${channel._id}`, {}, {
//       
//     });
//     setSubscribed(res.data.subscribed);
//     setChannel(p => ({ ...p, subscribers: res.data.subscribers || p.subscribers }));
//   };

//   const postComment = async () => {
//     if (!comment.trim() || !user) return;
//     const token = localStorage.getItem("token");
//     const tempComment = {
//       _id: Date.now(),
//       user: user.name || user.username, 
//       text: comment,
//       createdAt: new Date().toISOString(),
//       isPending: true,
//       replies: []
//     };
//     setVideo(p => ({ ...p, comments: [tempComment, ...(p.comments || [])] }));
//     setComment("");
//     try {
//       await api.post("/api/comments/add", { videoId: video._id, text: tempComment.text }, {
//         
//       });
//       fetchComments(video._id); 
//     } catch (error) {
//       setVideo(p => ({ ...p, comments: p.comments.filter(c => c._id !== tempComment._id) }));
//     }
//   };

//   const getSortedComments = () => {
//     if (!video?.comments) return [];
//     let filtered = [...video.comments];
//     return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   };

//   const formatViews = (views) => {
//     if (!views) return "0";
//     if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
//     if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
//     return views.toString();
//   };

//   const getTimeAgo = (date) => {
//     if (!date) return "Just now";
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };
//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
//     }
//     return "Just now";
//   };

//   const getAIInsightsMessage = () => {
//     switch(aiInsights.status) {
//       case "pending":
//         return "⏳ AI analysis will begin after captions are generated...";
//       case "processing":
//         return "🤖 AI is analyzing the video content...";
//       case "failed":
//         return "❌ AI analysis failed. Please try again later.";
//       case "not-available":
//         return "ℹ️ AI analysis not available for this video.";
//       default:
//         return "";
//     }
//   };

//   if (!video) return (
//     <div style={styles.loaderContainer}>
//       <div className="spinner"></div>
//       <p style={styles.loadingText}>Loading amazing content...</p>
//     </div>
//   );

//   return (
//     <>
    
//       <div style={styles.pageWrapper}>
//         <div style={{ 
//           ...styles.contentGrid,
//           gridTemplateColumns: isTheaterMode ? "1fr" : "1fr 400px",
//         }}>
//           {/* MAIN CONTENT */}
//           <div style={styles.mainContent}>
//             {/* Video Player */}
//             <div ref={playerContainerRef} style={styles.playerWrapper}>
//               <video
//                 ref={videoRef}
//                 src={
//                   showAd && ad
//                     ? `http://localhost:5000/uploads/ads/${ad.videoFile}`
//                     : `/api/stream/${video.filename}?q=${videoQuality}`
//                 }
//                 crossOrigin="anonymous"
//                 controls
//                 autoPlay
//                 onTimeUpdate={(e) => {
//                   if (showAd) {
//                     setAdTime(e.target.currentTime);
//                   } else {
//                     handleTimeUpdate();
//                   }
//                 }}
//                 onEnded={() => {
//                   if (showAd) {
//                     setShowAd(false);
//                     setAdTime(0);
//                   } else {
//                     handleVideoEnd();
//                   }
//                 }}
//                 onLoadedMetadata={handleVideoLoadedMetadata}
//                 style={styles.videoElement}
//               >
//                 {video.captions && (
//                   <track
//                     kind="subtitles"
//                     src={`${process.env.REACT_APP_API_URL}/captions/${video.captions}`}
//                     srcLang="en"
//                     label="English (Auto)"
//                   />
//                 )}
//               </video>

//               {/* 🔥 UPDATED SKIP AD BUTTON WITH REVENUE TRACKING */}
//               {showAd && ad && adTime >= ad.skipAfter && (
//                 <button
//                   onClick={async () => {
//                     // 🔥 TRACK AD CLICK & CREDIT REVENUE TO CREATOR
//                     try {
//                       console.log("💰 Tracking ad click...");
//                       console.log("Ad ID:", ad._id);
//                       console.log("Video ID:", video._id);
                      
//                       await api.post(`/api/ads/click/${ad._id}`, {
//                         videoId: video._id  // ⚠️ CRITICAL: Pass videoId for creator revenue
//                       });
                      
//                       console.log("✅ Ad click tracked successfully! Creator will receive revenue.");
//                     } catch (err) {
//                       console.error("❌ Failed to track ad click:", err);
//                       console.error("Error details:", err.response?.data || err.message);
//                     }
                    
//                     // Close the ad
//                     setShowAd(false);
//                     setAdTime(0);
//                   }}
//                   style={styles.skipAdButton}
//                 >
//                   Skip Ad →
//                 </button>
//               )}

//               {/* 🎙️ Voice Feedback Overlay */}
//               {lastCommand && (
//                 <div style={styles.voiceFeedback}>
//                   <MdGraphicEq size={20} style={{ animation: 'pulse 1s infinite' }} />
//                   <span>{lastCommand}</span>
//                 </div>
//               )}

//               {/* Enhanced Controls */}
//               <div style={styles.videoControls}>
//                 {/* 🎙️ VOICE CONTROL BUTTON */}
//                 <button 
//                   onClick={toggleVoiceControl} 
//                   style={{
//                     ...styles.controlBtn,
//                     background: isListening 
//                       ? "linear-gradient(135deg, #ff0000 0%, #ff4444 100%)"
//                       : "rgba(0,0,0,0.7)",
//                     animation: isListening ? 'pulse 1.5s infinite' : 'none',
//                   }}
//                   title={isListening ? "Voice Control Active - Click to stop" : "Activate Voice Control"}
//                 >
//                   {isListening ? <MdGraphicEq size={20} /> : <FiMic size={20} />}
//                   <span style={{marginLeft: 4, fontSize: '11px', fontWeight: 700}}>
//                     {isListening ? 'Listening...' : 'Voice'}
//                   </span>
//                 </button>

//                 <button onClick={toggleTheaterMode} style={styles.controlBtn} title="Theater mode">
//                   {isTheaterMode ? <MdOutlineFullscreenExit size={20} /> : <MdOutlineScreenShare size={20} />}
//                 </button>
                
//                 <button 
//                   onClick={toggleSubtitles} 
//                   style={{
//                     ...styles.controlBtn, 
//                     background: showSubtitles ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(0,0,0,0.7)"
//                   }}
//                   disabled={!captionsAvailable}
//                   title="Subtitles"
//                 >
//                   CC
//                 </button>
                
//                 <div style={{ position: "relative" }}>
//                   <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} style={styles.controlBtn}>
//                     <MdOutlineSpeed size={20} /> 
//                     <span style={{marginLeft: 4}}>{playbackSpeed}x</span>
//                   </button>
//                   {showSpeedMenu && (
//                     <div style={styles.controlMenu}>
//                       {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(s => (
//                         <div 
//                           key={s} 
//                           onClick={() => changePlaybackSpeed(s)} 
//                           style={{
//                             ...styles.menuItem,
//                             background: playbackSpeed === s ? "rgba(102, 126, 234, 0.2)" : "transparent"
//                           }}
//                         >
//                           <span>{s === 1 ? 'Normal' : `${s}x`}</span>
//                           {playbackSpeed === s && <FiCheck size={16} />}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ position: "relative" }}>
//                   <button onClick={() => setShowQualityMenu(!showQualityMenu)} style={styles.controlBtn}>
//                     <FiZap size={18} /> 
//                     <span style={{marginLeft: 4}}>{videoQuality}</span>
//                   </button>
//                   {showQualityMenu && (
//                     <div style={styles.controlMenu}>
//                       {['auto', 'original', '720p', '480p'].map(q => (
//                         <div 
//                           key={q} 
//                           onClick={() => handleQualityChange(q)} 
//                           style={{
//                             ...styles.menuItem,
//                             background: videoQuality === q ? "rgba(102, 126, 234, 0.2)" : "transparent"
//                           }}
//                         >
//                           <span>{q === 'auto' ? 'Auto' : q}</span>
//                           {videoQuality === q && <FiCheck size={16} />}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <button onClick={toggleFullscreen} style={styles.controlBtn} title="Fullscreen">
//                   <FiMaximize size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* 🎙️ Voice Commands Help Card */}
//             {isListening && (
//               <div style={styles.voiceHelpCard}>
//                 <div style={styles.voiceHelpHeader}>
//                   <MdGraphicEq size={24} style={{ color: '#ff0000', animation: 'pulse 1.5s infinite' }} />
//                   <h4 style={styles.voiceHelpTitle}>Voice Control Active</h4>
//                 </div>
//                 <div style={styles.voiceCommands}>
//                   <div style={styles.commandGroup}>
//                     <span style={styles.commandLabel}>Playback:</span>
//                     <span style={styles.commandText}>"Play" • "Pause" • "Stop"</span>
//                   </div>
//                   <div style={styles.commandGroup}>
//                     <span style={styles.commandLabel}>Navigation:</span>
//                     <span style={styles.commandText}>"Skip 30" • "Rewind 10" • "Next video"</span>
//                   </div>
//                   <div style={styles.commandGroup}>
//                     <span style={styles.commandLabel}>Audio:</span>
//                     <span style={styles.commandText}>"Mute" • "Volume up" • "Volume down"</span>
//                   </div>
//                   <div style={styles.commandGroup}>
//                     <span style={styles.commandLabel}>Display:</span>
//                     <span style={styles.commandText}>"Fullscreen" • "Theater mode" • "Subtitles"</span>
//                   </div>
//                   <div style={styles.commandGroup}>
//                     <span style={styles.commandLabel}>Actions:</span>
//                     <span style={styles.commandText}>"Like this" • "Subscribe"</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Video Title with Gradient */}
//             <h1 style={styles.videoTitle}>{video.title}</h1>

//             {/* Stats Bar */}
//             <div style={styles.statsBar}>
//               <div style={styles.stat}>
//                 <FiEye size={16} />
//                 <span>{formatViews(video.views)} views</span>
//               </div>
//               <div style={styles.stat}>
//                 <FiClock size={16} />
//                 <span>{getTimeAgo(video.createdAt)}</span>
//               </div>
//               <div style={styles.stat}>
//                 <FiTrendingUp size={16} />
//                 <span>{formatViews(likes)} likes</span>
//               </div>
//             </div>

//             {/* Premium Banner for Free Users */}
//             {(!user || !user.isPremium) && <WatchAd />}

//             {/* AI Insights - Enhanced */}
//             {showAIInsights && (
//               <div style={styles.aiCard}>
//                 <div style={styles.aiHeader}>
//                   <div style={styles.aiTitleSection}>
//                     <MdAutoAwesome style={styles.aiIcon} size={24} />
//                     <h3 style={styles.aiTitle}>AI Insights</h3>
//                     {aiInsights.status === "ready" && aiInsights.sentiment && (
//                       <span style={styles.sentimentPill}>{aiInsights.sentiment}</span>
//                     )}
//                   </div>
//                   <button onClick={() => setShowAIInsights(false)} style={styles.closeAIBtn}>
//                     ×
//                   </button>
//                 </div>
                
//                 <div style={styles.aiBody}>
//                   {aiInsights.status === "ready" && aiInsights.summary ? (
//                     <div style={styles.summaryGrid}>
//                       {aiInsights.summary.split('\n').filter(line => line.trim()).map((line, i) => (
//                         <div key={i} style={styles.summaryPoint}>
//                           <div style={styles.pointBullet}></div>
//                           <p style={styles.pointText}>{line.trim()}</p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div style={styles.aiLoading}>
//                       <div className="pulse"></div>
//                       <p>{getAIInsightsMessage()}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Channel & Actions Bar */}
//             <div style={styles.actionBar}>
//               <div style={styles.channelSection}>
//                 {channel && (
//                   <>
//                     <div 
//                       style={styles.channelInfo} 
//                       onClick={() => navigate(`/profile/${channel._id}`)}
//                     >
//                       <div style={styles.avatar}>
//                         {channel.name?.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <div style={styles.channelName}>{channel.name}</div>
//                         <div style={styles.subCount}>
//                           {formatViews(channel.subscribers?.length || 0)} subscribers
//                         </div>
//                       </div>
//                     </div>
//                     <button 
//                       style={subscribed ? styles.subscribedBtn : styles.subscribeBtn} 
//                       onClick={toggleSubscribe}
//                     >
//                       {subscribed ? (
//                         <>
//                           <FiBell size={18} />
//                           Subscribed
//                         </>
//                       ) : (
//                         'Subscribe'
//                       )}
//                     </button>
//                   </>
//                 )}
//               </div>

//               <div style={styles.actionsGroup}>
//                 <div style={styles.likeGroup}>
//                   <button 
//                     onClick={likeVideo} 
//                     style={{
//                       ...styles.actionBtn,
//                       borderRadius: "24px 0 0 24px"
//                     }}
//                   >
//                     <FiThumbsUp size={20} fill={userLiked ? "#fff" : "none"} />
//                     <span>{formatViews(likes)}</span>
//                   </button>
//                   <div style={styles.separator}></div>
//                   <button 
//                     onClick={dislikeVideo} 
//                     style={{
//                       ...styles.actionBtn,
//                       borderRadius: "0 24px 24px 0"
//                     }}
//                   >
//                     <FiThumbsDown size={20} fill={userDisliked ? "#fff" : "none"} />
//                   </button>
//                 </div>

//                 <button style={styles.actionBtn}>
//                   <FiShare2 size={20} />
//                   <span>Share</span>
//                 </button>

//                 <button onClick={toggleSave} style={styles.actionBtn}>
//                   <FiHeart size={20} fill={isSaved ? "#ff0000" : "none"} />
//                   <span>{isSaved ? 'Saved' : 'Save'}</span>
//                 </button>

//                 <button style={styles.moreBtn}>
//                   <FiMoreVertical size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Description */}
//             <div style={styles.descCard}>
//               <p style={styles.descText}>
//                 {showDescription 
//                   ? video.description 
//                   : video.description?.slice(0, 200) + (video.description?.length > 200 ? '...' : '')
//                 }
//               </p>
//               {video.description?.length > 200 && (
//                 <button 
//                   onClick={() => setShowDescription(!showDescription)} 
//                   style={styles.showMoreBtn}
//                 >
//                   {showDescription ? 'Show less' : 'Show more'}
//                   {showDescription ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
//                 </button>
//               )}
//             </div>

//             {/* Comments */}
//             <div style={styles.commentsWrapper}>
//               <div style={styles.commentsHead}>
//                 <h2 style={styles.commentsCount}>
//                   {video.comments?.length || 0} Comments
//                 </h2>
//                 <button style={styles.sortBtn}>
//                   <MdSort size={22} />
//                   Sort by
//                 </button>
//               </div>

//               {user && (
//                 <div style={styles.addComment}>
//                   <div style={styles.commentAvatar}>
//                     {user.name?.charAt(0).toUpperCase() || 'U'}
//                   </div>
//                   <div style={styles.commentInputWrapper}>
//                     <input
//                       type="text"
//                       placeholder="Add a comment..."
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && postComment()}
//                       style={styles.commentField}
//                     />
//                     {comment.trim() && (
//                       <div style={styles.commentBtns}>
//                         <button onClick={() => setComment("")} style={styles.cancelBtn}>
//                           Cancel
//                         </button>
//                         <button onClick={postComment} style={styles.postBtn}>
//                           <FiSend size={16} />
//                           Comment
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div style={styles.commentList}>
//                 {getSortedComments().map((c) => (
//                   <div key={c._id} style={styles.commentCard}>
//                     <div style={styles.commentAvatar}>
//                       {c.user?.name?.charAt(0).toUpperCase() || c.user?.charAt(0).toUpperCase() || 'U'}
//                     </div>
//                     <div style={styles.commentBody}>
//                       <div style={styles.commentMeta}>
//                         <span style={styles.commentUser}>
//                           {c.user?.name || c.user || 'Anonymous'}
//                         </span>
//                         <span style={styles.commentDate}>
//                           {getTimeAgo(c.createdAt)}
//                         </span>
//                       </div>
//                       <p style={styles.commentContent}>{c.text}</p>
//                       <div style={styles.commentActions}>
//                         <button style={styles.commentBtn}>
//                           <FiThumbsUp size={14} />
//                         </button>
//                         <button style={styles.commentBtn}>
//                           <FiThumbsDown size={14} />
//                         </button>
//                         <button style={styles.commentBtn}>Reply</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* SIDEBAR */}
//           {!isTheaterMode && (
//             <div style={styles.sidebar}>
//               <h3 style={styles.sidebarHead}>Up Next</h3>
//               <div style={styles.recList}>
//                 {recommended.map((v) => (
//                   <div 
//                     key={v._id} 
//                     style={styles.recCard}
//                     onClick={() => navigate(`/watch/${v.filename}`)}
//                   >
//                     <div style={styles.recThumb}>
//                       <img 
//                         src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                         alt={v.title}
//                         style={styles.thumbImg}
//                       />
//                       <div style={styles.duration}>
//                         {v.duration || '10:23'}
//                       </div>
//                     </div>
//                     <div style={styles.recInfo}>
//                       <h4 style={styles.recTitle}>{v.title}</h4>
//                       <p style={styles.recChannel}>
//                         {v.uploadedBy?.name || 'Unknown'}
//                       </p>
//                       <div style={styles.recMeta}>
//                         <span>{formatViews(v.views)} views</span>
//                         <span style={styles.metaDot}>•</span>
//                         <span>{getTimeAgo(v.createdAt)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         .spinner {
//           width: 60px;
//           height: 60px;
//           border: 5px solid rgba(255,255,255,0.1);
//           border-top-color: #667eea;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         .pulse {
//           width: 40px;
//           height: 40px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           border-radius: 50%;
//           animation: pulse 1.5s ease-in-out infinite;
//         }
//         @keyframes pulse {
//           0%, 100% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.1); opacity: 0.7; }
//         }
//       `}</style>
//     </>
//   );
// }

// /* ================= MODERN STYLES ================= */
// const styles = {
//   pageWrapper: {
//     background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
//     minHeight: "100vh",
//     padding: "80px 20px 40px",
//     color: "#fff",
//   },
//   contentGrid: {
//     display: "grid",
//     gap: "24px",
//     maxWidth: "1800px",
//     margin: "0 auto",
//   },
//   mainContent: {
//     minWidth: 0,
//   },
//   loaderContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "80vh",
//     gap: "20px",
//   },
//   loadingText: {
//     fontSize: "18px",
//     color: "#888",
//     fontWeight: "500",
//   },
//   playerWrapper: {
//     position: "relative",
//     background: "#000",
//     borderRadius: "16px",
//     overflow: "hidden",
//     marginBottom: "20px",
//     boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
//   },
//   videoElement: {
//     width: "100%",
//     aspectRatio: "16/9",
//     display: "block",
//   },
//   skipAdButton: {
//     position: "absolute",
//     bottom: "90px",
//     right: "20px",
//     padding: "12px 24px",
//     background: "rgba(0,0,0,0.9)",
//     color: "#fff",
//     border: "2px solid #fff",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontSize: "15px",
//     fontWeight: "700",
//     zIndex: 20,
//     transition: "all 0.3s",
//   },
//   voiceFeedback: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     background: "rgba(0,0,0,0.95)",
//     backdropFilter: "blur(20px)",
//     padding: "20px 40px",
//     borderRadius: "16px",
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     zIndex: 100,
//     fontSize: "18px",
//     fontWeight: "700",
//     color: "#fff",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
//     border: "2px solid rgba(255,255,255,0.2)",
//   },
//   videoControls: {
//     position: "absolute",
//     top: "16px",
//     right: "16px",
//     display: "flex",
//     gap: "10px",
//     zIndex: 10,
//     flexWrap: "wrap",
//   },
//   controlBtn: {
//     padding: "10px 14px",
//     background: "rgba(0,0,0,0.7)",
//     backdropFilter: "blur(10px)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     fontSize: "13px",
//     fontWeight: "600",
//     transition: "all 0.3s",
//   },
//   controlMenu: {
//     position: "absolute",
//     top: "110%",
//     right: 0,
//     background: "rgba(15,15,15,0.98)",
//     backdropFilter: "blur(20px)",
//     borderRadius: "12px",
//     padding: "8px",
//     minWidth: "160px",
//     zIndex: 1000,
//     boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
//     border: "1px solid rgba(255,255,255,0.1)",
//   },
//   menuItem: {
//     padding: "12px 16px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: "500",
//     transition: "all 0.2s",
//   },
//   voiceHelpCard: {
//     background: "linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 68, 68, 0.1) 100%)",
//     borderRadius: "16px",
//     padding: "20px",
//     marginBottom: "20px",
//     border: "1px solid rgba(255, 0, 0, 0.3)",
//     backdropFilter: "blur(10px)",
//   },
//   voiceHelpHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     marginBottom: "16px",
//   },
//   voiceHelpTitle: {
//     fontSize: "16px",
//     fontWeight: "700",
//     margin: 0,
//     color: "#fff",
//   },
//   voiceCommands: {
//     display: "grid",
//     gap: "8px",
//   },
//   commandGroup: {
//     display: "flex",
//     gap: "10px",
//     fontSize: "13px",
//     alignItems: "baseline",
//   },
//   commandLabel: {
//     fontWeight: "700",
//     color: "rgba(255,255,255,0.8)",
//     minWidth: "80px",
//   },
//   commandText: {
//     color: "rgba(255,255,255,0.6)",
//   },
//   videoTitle: {
//     fontSize: "22px",
//     fontWeight: "700",
//     marginBottom: "12px",
//     background: "linear-gradient(135deg, #fff 0%, #ccc 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     lineHeight: "1.4",
//   },
//   statsBar: {
//     display: "flex",
//     gap: "24px",
//     marginBottom: "20px",
//     flexWrap: "wrap",
//   },
//   stat: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "14px",
//     color: "rgba(255,255,255,0.7)",
//     fontWeight: "500",
//   },
//   adBanner: {
//     position: "relative",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     padding: "24px",
//     borderRadius: "16px",
//     marginBottom: "20px",
//     overflow: "hidden",
//     boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
//   },
//   adGlowEffect: {
//     position: "absolute",
//     top: "-50%",
//     right: "-50%",
//     width: "200%",
//     height: "200%",
//     background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
//     animation: "rotate 20s linear infinite",
//   },
//   adContent: {
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//     gap: "20px",
//   },
//   adIcon: {
//     fontSize: "32px",
//   },
//   adTitle: {
//     fontSize: "18px",
//     fontWeight: "700",
//     marginBottom: "6px",
//     color: "#fff",
//   },
//   adText: {
//     fontSize: "14px",
//     color: "rgba(255,255,255,0.95)",
//     lineHeight: "1.5",
//   },
//   premiumBtn: {
//     padding: "12px 24px",
//     background: "#fff",
//     color: "#667eea",
//     border: "none",
//     borderRadius: "12px",
//     fontWeight: "700",
//     cursor: "pointer",
//     fontSize: "15px",
//     marginLeft: "auto",
//     transition: "all 0.3s",
//     boxShadow: "0 4px 16px rgba(255,255,255,0.2)",
//   },
//   aiCard: {
//     background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
//     borderRadius: "16px",
//     padding: "24px",
//     marginBottom: "20px",
//     border: "1px solid rgba(102, 126, 234, 0.3)",
//     boxShadow: "0 0 30px rgba(102, 126, 234, 0.2)",
//     backdropFilter: "blur(10px)",
//   },
//   aiHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "16px",
//   },
//   aiTitleSection: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//   },
//   aiIcon: {
//     color: "#667eea",
//     filter: "drop-shadow(0 0 8px rgba(102, 126, 234, 0.6))",
//   },
//   aiTitle: {
//     fontSize: "18px",
//     fontWeight: "700",
//     margin: 0,
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//   },
//   sentimentPill: {
//     padding: "6px 14px",
//     background: "rgba(102, 126, 234, 0.2)",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "600",
//     color: "#b8c5ff",
//     border: "1px solid rgba(102, 126, 234, 0.3)",
//   },
//   closeAIBtn: {
//     background: "rgba(255,255,255,0.1)",
//     border: "none",
//     color: "#fff",
//     fontSize: "24px",
//     width: "32px",
//     height: "32px",
//     borderRadius: "50%",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "all 0.3s",
//   },
//   aiBody: {
//     fontSize: "14px",
//     lineHeight: "1.8",
//   },
//   summaryGrid: {
//     display: "grid",
//     gap: "12px",
//   },
//   summaryPoint: {
//     display: "flex",
//     gap: "12px",
//     alignItems: "flex-start",
//   },
//   pointBullet: {
//     width: "8px",
//     height: "8px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     borderRadius: "50%",
//     marginTop: "6px",
//     flexShrink: 0,
//     boxShadow: "0 0 8px rgba(102, 126, 234, 0.5)",
//   },
//   pointText: {
//     margin: 0,
//     color: "rgba(255,255,255,0.9)",
//     fontSize: "14px",
//     lineHeight: "1.6",
//   },
//   aiLoading: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "16px",
//     padding: "20px",
//     color: "rgba(255,255,255,0.7)",
//   },
//   actionBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "20px 0",
//     borderTop: "1px solid rgba(255,255,255,0.1)",
//     borderBottom: "1px solid rgba(255,255,255,0.1)",
//     marginBottom: "20px",
//     flexWrap: "wrap",
//     gap: "16px",
//   },
//   channelSection: {
//     display: "flex",
//     alignItems: "center",
//     gap: "16px",
//   },
//   channelInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     cursor: "pointer",
//   },
//   avatar: {
//     width: "48px",
//     height: "48px",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "20px",
//     fontWeight: "700",
//     color: "#fff",
//     boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
//   },
//   channelName: {
//     fontSize: "16px",
//     fontWeight: "700",
//     color: "#fff",
//   },
//   subCount: {
//     fontSize: "13px",
//     color: "rgba(255,255,255,0.6)",
//     fontWeight: "500",
//   },
//   subscribeBtn: {
//     padding: "12px 24px",
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     borderRadius: "24px",
//     fontWeight: "700",
//     cursor: "pointer",
//     fontSize: "15px",
//     transition: "all 0.3s",
//     boxShadow: "0 4px 16px rgba(255, 0, 0, 0.3)",
//   },
//   subscribedBtn: {
//     padding: "12px 24px",
//     background: "rgba(255,255,255,0.15)",
//     color: "#fff",
//     border: "1px solid rgba(255,255,255,0.3)",
//     borderRadius: "24px",
//     fontWeight: "700",
//     cursor: "pointer",
//     fontSize: "15px",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     transition: "all 0.3s",
//   },
//   actionsGroup: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     flexWrap: "wrap",
//   },
//   likeGroup: {
//     display: "flex",
//     alignItems: "center",
//     background: "rgba(255,255,255,0.1)",
//     borderRadius: "24px",
//     overflow: "hidden",
//     backdropFilter: "blur(10px)",
//   },
//   actionBtn: {
//     padding: "12px 20px",
//     background: "rgba(255,255,255,0.1)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "24px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "14px",
//     fontWeight: "600",
//     transition: "all 0.3s",
//     backdropFilter: "blur(10px)",
//   },
//   separator: {
//     width: "1px",
//     height: "24px",
//     background: "rgba(255,255,255,0.2)",
//   },
//   moreBtn: {
//     padding: "12px",
//     background: "rgba(255,255,255,0.1)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50%",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "all 0.3s",
//     backdropFilter: "blur(10px)",
//   },
//   descCard: {
//     background: "rgba(255,255,255,0.05)",
//     borderRadius: "16px",
//     padding: "20px",
//     marginBottom: "32px",
//     backdropFilter: "blur(10px)",
//   },
//   descText: {
//     fontSize: "14px",
//     lineHeight: "1.8",
//     color: "rgba(255,255,255,0.85)",
//     margin: 0,
//     whiteSpace: "pre-wrap",
//   },
//   showMoreBtn: {
//     marginTop: "16px",
//     background: "none",
//     border: "none",
//     color: "#667eea",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "700",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     transition: "all 0.3s",
//   },
//   commentsWrapper: {
//     marginTop: "32px",
//   },
//   commentsHead: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "28px",
//   },
//   commentsCount: {
//     fontSize: "22px",
//     fontWeight: "700",
//     margin: 0,
//   },
//   sortBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     background: "none",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "15px",
//     fontWeight: "600",
//   },
//   addComment: {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "36px",
//   },
//   commentAvatar: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#fff",
//     flexShrink: 0,
//   },
//   commentInputWrapper: {
//     flex: 1,
//   },
//   commentField: {
//     width: "100%",
//     background: "transparent",
//     border: "none",
//     borderBottom: "2px solid rgba(255,255,255,0.2)",
//     color: "#fff",
//     fontSize: "15px",
//     padding: "12px 0",
//     outline: "none",
//     transition: "all 0.3s",
//   },
//   commentBtns: {
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: "12px",
//     marginTop: "16px",
//   },
//   cancelBtn: {
//     padding: "10px 20px",
//     background: "none",
//     border: "none",
//     borderRadius: "24px",
//     color: "rgba(255,255,255,0.7)",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "600",
//     transition: "all 0.3s",
//   },
//   postBtn: {
//     padding: "10px 20px",
//     background: "#667eea",
//     color: "#fff",
//     border: "none",
//     borderRadius: "24px",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "700",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     transition: "all 0.3s",
//     boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
//   },
//   commentList: {
//     display: "grid",
//     gap: "28px",
//   },
//   commentCard: {
//     display: "flex",
//     gap: "16px",
//   },
//   commentBody: {
//     flex: 1,
//   },
//   commentMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     marginBottom: "6px",
//   },
//   commentUser: {
//     fontSize: "14px",
//     fontWeight: "700",
//     color: "#fff",
//   },
//   commentDate: {
//     fontSize: "13px",
//     color: "rgba(255,255,255,0.6)",
//   },
//   commentContent: {
//     fontSize: "14px",
//     lineHeight: "1.6",
//     color: "rgba(255,255,255,0.9)",
//     margin: "0 0 10px 0",
//   },
//   commentActions: {
//     display: "flex",
//     gap: "16px",
//     alignItems: "center",
//   },
//   commentBtn: {
//     background: "none",
//     border: "none",
//     color: "rgba(255,255,255,0.7)",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     fontSize: "13px",
//     fontWeight: "600",
//     padding: "6px 12px",
//     borderRadius: "20px",
//     transition: "all 0.3s",
//   },
//   sidebar: {
//     width: "100%",
//   },
//   sidebarHead: {
//     fontSize: "18px",
//     fontWeight: "700",
//     marginBottom: "20px",
//   },
//   recList: {
//     display: "grid",
//     gap: "16px",
//   },
//   recCard: {
//     display: "flex",
//     gap: "12px",
//     cursor: "pointer",
//     borderRadius: "12px",
//     padding: "10px",
//     transition: "all 0.3s",
//     background: "rgba(255,255,255,0.03)",
//   },
//   recThumb: {
//     position: "relative",
//     width: "168px",
//     height: "94px",
//     flexShrink: 0,
//     borderRadius: "10px",
//     overflow: "hidden",
//   },
//   thumbImg: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },
//   duration: {
//     position: "absolute",
//     bottom: "6px",
//     right: "6px",
//     background: "rgba(0,0,0,0.9)",
//     color: "#fff",
//     fontSize: "12px",
//     fontWeight: "700",
//     padding: "4px 6px",
//     borderRadius: "4px",
//   },
//   recInfo: {
//     flex: 1,
//     minWidth: 0,
//   },
//   recTitle: {
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#fff",
//     margin: "0 0 6px 0",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     lineHeight: "1.4",
//   },
//   recChannel: {
//     fontSize: "13px",
//     color: "rgba(255,255,255,0.6)",
//     margin: "0 0 4px 0",
//     fontWeight: "500",
//   },
//   recMeta: {
//     display: "flex",
//     gap: "6px",
//     fontSize: "12px",
//     color: "rgba(255,255,255,0.6)",
//     alignItems: "center",
//   },
//   metaDot: {
//     fontSize: "10px",
//   },
// };



// import React, { useEffect, useState, useContext, useRef } from "react";
// import api from "../config/api";
// import { io } from "socket.io-client";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { 
//   FiThumbsUp, FiThumbsDown, FiShare2, FiBell,
//   FiMoreHorizontal, FiChevronDown, FiChevronUp, FiCheck,
//   FiMaximize, FiMic
// } from "react-icons/fi";
// import { 
//   MdOutlineScreenShare, 
//   MdOutlineFullscreenExit, 
//   MdOutlineSpeed,
//   MdAutoAwesome,
//   MdGraphicEq
// } from 'react-icons/md';

// export default function Watch() {
//   const { filename } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const socketRef = useRef(null);
//   const videoRef = useRef(null);
//   const playerContainerRef = useRef(null);
//   const recognitionRef = useRef(null);

//   // States
//   const [video, setVideo] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [comment, setComment] = useState("");
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [userDisliked, setUserDisliked] = useState(false);
//   const [subscribed, setSubscribed] = useState(false);
//   const [showDescription, setShowDescription] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [isTheaterMode, setIsTheaterMode] = useState(false);
  
//   // Video Controls
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [videoQuality, setVideoQuality] = useState('original');
//   const [showQualityMenu, setShowQualityMenu] = useState(false);
//   const [captionsAvailable, setCaptionsAvailable] = useState(false);
//   const [showSubtitles, setShowSubtitles] = useState(false);
  
//   // AI Insights
//   const [aiInsights, setAiInsights] = useState({ summary: "", sentiment: "", status: "pending" });
//   const [showAIInsights, setShowAIInsights] = useState(true);
  
//   // Voice Control
//   const [isListening, setIsListening] = useState(false);
//   const [lastCommand, setLastCommand] = useState("");
//   const [voiceSupported, setVoiceSupported] = useState(true);

//   /* ================= VOICE CONTROL SETUP ================= */
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       setVoiceSupported(false);
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.continuous = true;
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
//       setLastCommand(text);
//       handleVoiceCommand(text);
//     };

//     recognition.onerror = (event) => {
//       if (event.error === 'no-speech' && isListening) {
//         setTimeout(() => {
//           try { recognition.start(); } catch (e) {}
//         }, 1000);
//       }
//     };

//     recognition.onend = () => {
//       if (isListening) {
//         try { recognition.start(); } catch (e) {}
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       if (recognition) recognition.stop();
//     };
//   }, [isListening]);

//   const handleVoiceCommand = (command) => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (command.includes("play") || command.includes("start")) {
//       video.play();
//       showVoiceFeedback("▶️ Playing");
//     } else if (command.includes("pause") || command.includes("stop")) {
//       video.pause();
//       showVoiceFeedback("⏸ Paused");
//     } else if (command.includes("skip") || command.includes("forward")) {
//       const seconds = command.match(/(\d+)/) ? parseInt(command.match(/(\d+)/)[1]) : 10;
//       video.currentTime += seconds;
//       showVoiceFeedback(`⏩ Skipped ${seconds}s`);
//     } else if (command.includes("mute")) {
//       video.muted = true;
//       showVoiceFeedback("🔇 Muted");
//     } else if (command.includes("unmute")) {
//       video.muted = false;
//       showVoiceFeedback("🔊 Unmuted");
//     } else if (command.includes("full screen") || command.includes("fullscreen")) {
//       toggleFullscreen();
//       showVoiceFeedback("⛶ Fullscreen");
//     } else if (command.includes("theater") || command.includes("theatre")) {
//       toggleTheaterMode();
//       showVoiceFeedback("🎬 Theater Mode");
//     } else if (command.includes("like")) {
//       likeVideo();
//       showVoiceFeedback("👍 Liked");
//     } else if (command.includes("subscribe")) {
//       if (channel && !subscribed) {
//         toggleSubscribe();
//         showVoiceFeedback("🔔 Subscribed");
//       }
//     }
//   };

//   const showVoiceFeedback = (message) => {
//     setLastCommand(message);
//     setTimeout(() => setLastCommand(""), 3000);
//   };

//   const toggleVoiceControl = () => {
//     if (!voiceSupported) {
//       alert("Voice control not supported in your browser.");
//       return;
//     }

//     if (!isListening) {
//       try {
//         recognitionRef.current?.start();
//         setIsListening(true);
//         showVoiceFeedback("🎙️ Voice Control Active");
//       } catch (err) {
//         alert("Could not start voice recognition.");
//       }
//     } else {
//       recognitionRef.current?.stop();
//       setIsListening(false);
//       showVoiceFeedback("🎙️ Voice Control Off");
//     }
//   };

//   /* ================= FETCH VIDEO ================= */
//   const fetchVideo = async () => {
//     try {
//       const res = await api.get(`/api/videos/by-filename/${filename}`);
//       setVideo(res.data);
//       setLikes(res.data.likes?.length || 0);
//       setDislikes(res.data.dislikes?.length || 0);

//       // AI Insights
//       setAiInsights({
//         summary: res.data.aiSummary || "",
//         sentiment: res.data.sentiment || "Neutral",
//         status: res.data.summaryStatus || "pending"
//       });

//       if (user) {
//         setUserLiked(res.data.likes?.includes(user._id));
//         setUserDisliked(res.data.dislikes?.includes(user._id));
//       }

//       if (res.data.uploadedBy?._id) {
//         fetchChannel(res.data.uploadedBy._id);
//         fetchComments(res.data._id);
//       }

//       if (user && res.data._id) {
//         addToHistory(res.data._id);
//       }
//     } catch (error) {
//       console.error("Error fetching video:", error);
//     }
//   };

//   const fetchChannel = async (id) => {
//     const res = await api.get(`/api/user/profile/${id}`);
//     setChannel(res.data);
//     if (user) setSubscribed(res.data.subscribers?.includes(user._id));
//   };

//   const fetchComments = async (id) => {
//     const res = await api.get(`/api/comments/video/${id}`);
//     setVideo((p) => ({ ...p, comments: res.data }));
//   };

//   const fetchRecommended = async () => {
//     try {
//       const res = await api.get(`/api/videos/similar/${filename}`);
//       setRecommended(res.data.slice(0, 20));
//     } catch {
//       const res = await api.get("/api/videos/all");
//       setRecommended(res.data.filter(v => v.filename !== filename).slice(0, 20));
//     }
//   };

//   const addToHistory = async (videoId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       await api.post(
//         `/api/user/watch-history/add/${videoId}`,
//         {},
//         {  }
//       );
//     } catch (err) {
//       console.error("Failed to add to history:", err);
//     }
//   };

//   useEffect(() => {
//     fetchVideo();
//     api.post(`/api/videos/view/${filename}`);
//   }, [filename, user?._id]);

//   useEffect(() => {
//     if (video) fetchRecommended();
//   }, [video]);

//   useEffect(() => {
//     socketRef.current = io("http://localhost:5000");
//     if (video?._id) {
//       socketRef.current.emit("join-video", video._id);
//     }
    
//     socketRef.current.on("caption-ready", (data) => {
//       setVideo((prev) => ({ ...prev, captions: data.captions }));
//     });

//     socketRef.current.on("summary-ready", (data) => {
//       if (data.videoId === video?._id) {
//         setAiInsights({
//           summary: data.summary || "",
//           sentiment: data.sentiment || "Neutral",
//           status: "ready"
//         });
//       }
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [video?._id]);

//   const getAIInsightsMessage = () => {
//     switch(aiInsights.status) {
//       case "pending":
//         return "⏳ AI analysis will begin after captions are generated...";
//       case "processing":
//         return "🤖 AI is analyzing the video content...";
//       case "failed":
//         return "❌ AI analysis failed. Please try again later.";
//       case "not-available":
//         return "ℹ️ AI analysis not available for this video.";
//       default:
//         return "";
//     }
//   };

//   const likeVideo = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await api.post(`/api/videos/like/${video._id}`, {}, {
//       
//     });
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const dislikeVideo = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await api.post(`/api/videos/dislike/${video._id}`, {}, {
//       
//     });
//     setLikes(res.data.likes.length);
//     setDislikes(res.data.dislikes.length);
//     setUserLiked(res.data.likes.includes(user._id));
//     setUserDisliked(res.data.dislikes.includes(user._id));
//   };

//   const toggleSubscribe = async () => {
//     if (!user) return navigate("/login");
//     const token = localStorage.getItem("token");
//     const res = await api.post(`/api/user/subscribe/${channel._id}`, {}, {
//       
//     });
//     setSubscribed(res.data.subscribed);
//     setChannel(p => ({ ...p, subscribers: res.data.subscribers || p.subscribers }));
//   };

//   const handleQualityChange = (newQuality) => {
//     if (!videoRef.current || !video) return;
//     const currentTime = videoRef.current.currentTime;
//     const isPlaying = !videoRef.current.paused;
    
//     setVideoQuality(newQuality);
//     setShowQualityMenu(false);
    
//     const newSource = `/api/videos/stream/${video.filename}?q=${newQuality}`;
//     videoRef.current.src = newSource;
    
//     const syncAndPlay = () => {
//       videoRef.current.currentTime = currentTime;
//       if (isPlaying) videoRef.current.play();
//       videoRef.current.removeEventListener('loadedmetadata', syncAndPlay);
//     };
    
//     videoRef.current.addEventListener('loadedmetadata', syncAndPlay);
//     videoRef.current.load();
//   };

//   const changePlaybackSpeed = (speed) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = speed;
//       setPlaybackSpeed(speed);
//       setShowSpeedMenu(false);
//     }
//   };

//   const toggleTheaterMode = () => {
//     setIsTheaterMode(!isTheaterMode);
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       playerContainerRef.current?.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const toggleSubtitles = () => {
//     const videoEl = videoRef.current;
//     if (!videoEl) return;
//     const tracks = videoEl.textTracks;
//     if (!tracks || tracks.length === 0) return;
//     const nextState = !showSubtitles;
//     setShowSubtitles(nextState);
//     for (let i = 0; i < tracks.length; i++) {
//       tracks[i].mode = nextState ? "showing" : "hidden";
//     }
//   };

//   const handleVideoLoadedMetadata = () => {
//     const videoEl = videoRef.current;
//     if (!videoEl) return;
//     const tracks = videoEl.textTracks;
//     if (tracks && tracks.length > 0) {
//       setCaptionsAvailable(true);
//       for (let i = 0; i < tracks.length; i++) tracks[i].mode = "hidden";
//       setShowSubtitles(false);
//     }
//   };

//   const postComment = async () => {
//     if (!comment.trim() || !user) return;
//     const token = localStorage.getItem("token");
//     try {
//       await api.post("/api/comments/add", 
//         { videoId: video._id, text: comment }, 
//         {  }
//       );
//       setComment("");
//       fetchComments(video._id);
//     } catch (error) {
//       console.error("Comment failed:", error);
//     }
//   };

//   const formatViews = (views) => {
//     if (!views) return "0 views";
//     if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
//     if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
//     return `${views} views`;
//   };

//   const formatNumber = (num) => {
//     if (!num) return "0";
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   const getTimeAgo = (date) => {
//     if (!date) return "Just now";
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     const intervals = { 
//       year: 31536000, 
//       month: 2592000, 
//       week: 604800,
//       day: 86400, 
//       hour: 3600, 
//       minute: 60 
//     };
//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
//     }
//     return "Just now";
//   };

//   if (!video) {
//     return (
//       <div className="yt-loading">
//         <div className="yt-spinner" />
//         <p>Loading video...</p>
//         <style jsx>{`
//           .yt-loading {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             min-height: 100vh;
//             background: #0f0f0f;
//             color: #f1f1f1;
//           }
//           .yt-spinner {
//             width: 48px;
//             height: 48px;
//             border: 3px solid #3f3f3f;
//             border-top-color: #f00;
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//           }
//           @keyframes spin {
//             to { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   return (
//     <div className="yt-watch-page">
//       <div className="yt-watch-container">
//         {/* LEFT: Video Player + Info */}
//         <div className="yt-primary">
//           {/* Video Player */}
//           <div className="yt-player" ref={playerContainerRef}>
//             <video
//               ref={videoRef}
//               src={`/api/videos/stream/${video.filename}?q=${videoQuality}`}
//               controls
//               autoPlay
//               className="yt-video"
//               onLoadedMetadata={handleVideoLoadedMetadata}
//               crossOrigin="anonymous"
//             >
//               {video.captions && (
//                 <track
//                   kind="subtitles"
//                   src={`${process.env.REACT_APP_API_URL}/captions/${video.captions}`}
//                   srcLang="en"
//                   label="English (Auto)"
//                 />
//               )}
//             </video>

//             {/* Voice Feedback */}
//             {lastCommand && (
//               <div className="yt-voice-feedback">
//                 <MdGraphicEq size={20} style={{ animation: 'pulse 1s infinite' }} />
//                 <span>{lastCommand}</span>
//               </div>
//             )}

//             {/* Advanced Controls Overlay */}
//             <div className="yt-controls-overlay">
//               {/* Voice Control */}
//               <button 
//                 onClick={toggleVoiceControl}
//                 className={`yt-control-btn ${isListening ? 'active' : ''}`}
//                 title="Voice Control"
//               >
//                 {isListening ? <MdGraphicEq size={18} /> : <FiMic size={18} />}
//               </button>

//               {/* Theater Mode */}
//               <button 
//                 onClick={toggleTheaterMode}
//                 className="yt-control-btn"
//                 title="Theater mode"
//               >
//                 {isTheaterMode ? <MdOutlineFullscreenExit size={18} /> : <MdOutlineScreenShare size={18} />}
//               </button>

//               {/* Subtitles */}
//               <button 
//                 onClick={toggleSubtitles}
//                 className={`yt-control-btn ${showSubtitles ? 'active' : ''}`}
//                 disabled={!captionsAvailable}
//                 title="Subtitles"
//               >
//                 CC
//               </button>

//               {/* Speed Control */}
//               <div className="yt-control-menu-wrapper">
//                 <button 
//                   onClick={() => setShowSpeedMenu(!showSpeedMenu)}
//                   className="yt-control-btn"
//                   title="Playback speed"
//                 >
//                   <MdOutlineSpeed size={18} />
//                   <span>{playbackSpeed}x</span>
//                 </button>
//                 {showSpeedMenu && (
//                   <div className="yt-control-menu">
//                     {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(s => (
//                       <div 
//                         key={s}
//                         onClick={() => changePlaybackSpeed(s)}
//                         className={`yt-menu-item ${playbackSpeed === s ? 'active' : ''}`}
//                       >
//                         <span>{s === 1 ? 'Normal' : `${s}x`}</span>
//                         {playbackSpeed === s && <FiCheck size={14} />}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Quality Control */}
//               <div className="yt-control-menu-wrapper">
//                 <button 
//                   onClick={() => setShowQualityMenu(!showQualityMenu)}
//                   className="yt-control-btn"
//                   title="Quality"
//                 >
//                   {videoQuality}
//                 </button>
//                 {showQualityMenu && (
//                   <div className="yt-control-menu">
//                     {['auto', 'original', '720p', '480p', '360p'].map(q => (
//                       <div 
//                         key={q}
//                         onClick={() => handleQualityChange(q)}
//                         className={`yt-menu-item ${videoQuality === q ? 'active' : ''}`}
//                       >
//                         <span>{q === 'auto' ? 'Auto' : q}</span>
//                         {videoQuality === q && <FiCheck size={14} />}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Fullscreen */}
//               <button 
//                 onClick={toggleFullscreen}
//                 className="yt-control-btn"
//                 title="Fullscreen"
//               >
//                 <FiMaximize size={18} />
//               </button>
//             </div>
//           </div>

//           {/* Voice Commands Help */}
//           {isListening && (
//             <div className="yt-voice-help">
//               <div className="yt-voice-help-header">
//                 <MdGraphicEq size={20} style={{ color: '#f00' }} />
//                 <span>Voice Control Active</span>
//               </div>
//               <div className="yt-voice-commands">
//                 <span>"Play" • "Pause" • "Mute" • "Skip 10" • "Like" • "Subscribe" • "Fullscreen"</span>
//               </div>
//             </div>
//           )}

//           {/* AI Insights */}
//           {showAIInsights && (aiInsights.status === "ready" || aiInsights.status === "processing" || aiInsights.status === "pending") && (
//             <div className="yt-ai-card">
//               <div className="yt-ai-header">
//                 <div className="yt-ai-title">
//                   <MdAutoAwesome size={20} />
//                   <span>AI Summary</span>
//                   {aiInsights.sentiment && aiInsights.status === "ready" && (
//                     <span className="yt-ai-badge">{aiInsights.sentiment}</span>
//                   )}
//                 </div>
//                 <button onClick={() => setShowAIInsights(false)} className="yt-ai-close">×</button>
//               </div>
//               <div className="yt-ai-content">
//                 {aiInsights.status === "ready" && aiInsights.summary ? (
//                   <p>{aiInsights.summary}</p>
//                 ) : (
//                   <p className="yt-ai-loading">{getAIInsightsMessage()}</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Video Title */}
//           <h1 className="yt-title">{video.title}</h1>

//           {/* Video Info Bar */}
//           <div className="yt-info-bar">
//             <div className="yt-stats">
//               <span>{formatViews(video.views)}</span>
//               <span className="yt-dot">•</span>
//               <span>{getTimeAgo(video.createdAt)}</span>
//             </div>

//             <div className="yt-actions">
//               {/* Like/Dislike */}
//               <div className="yt-like-section">
//                 <button 
//                   className={`yt-action-btn ${userLiked ? 'active' : ''}`}
//                   onClick={likeVideo}
//                 >
//                   <FiThumbsUp size={20} />
//                   <span>{formatNumber(likes)}</span>
//                 </button>
//                 <div className="yt-divider" />
//                 <button 
//                   className={`yt-action-btn ${userDisliked ? 'active' : ''}`}
//                   onClick={dislikeVideo}
//                 >
//                   <FiThumbsDown size={20} />
//                 </button>
//               </div>

//               {/* Share */}
//               <button className="yt-action-btn">
//                 <FiShare2 size={20} />
//                 <span>Share</span>
//               </button>

//               {/* More */}
//               <button className="yt-action-btn-icon">
//                 <FiMoreHorizontal size={24} />
//               </button>
//             </div>
//           </div>

//           {/* Channel Info + Subscribe */}
//           <div className="yt-channel-bar">
//             {channel && (
//               <>
//                 <div 
//                   className="yt-channel-info"
//                   onClick={() => navigate(`/profile/${channel._id}`)}
//                 >
//                   <div className="yt-channel-avatar">
//                     {channel.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="yt-channel-text">
//                     <div className="yt-channel-name">{channel.name}</div>
//                     <div className="yt-channel-subs">
//                       {formatNumber(channel.subscribers?.length || 0)} subscribers
//                     </div>
//                   </div>
//                 </div>

//                 <button 
//                   className={subscribed ? "yt-subscribed-btn" : "yt-subscribe-btn"}
//                   onClick={toggleSubscribe}
//                 >
//                   {subscribed ? (
//                     <>
//                       <FiBell size={20} />
//                       <span>Subscribed</span>
//                     </>
//                   ) : (
//                     <span>Subscribe</span>
//                   )}
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Description */}
//           <div className="yt-description">
//             <div className="yt-description-header">
//               <div className="yt-desc-meta">
//                 {formatViews(video.views)} • {getTimeAgo(video.createdAt)}
//               </div>
//             </div>
//             <div className={`yt-description-text ${showDescription ? 'expanded' : ''}`}>
//               {video.description}
//             </div>
//             {video.description && video.description.length > 200 && (
//               <button 
//                 className="yt-show-more"
//                 onClick={() => setShowDescription(!showDescription)}
//               >
//                 {showDescription ? 'Show less' : 'Show more'}
//               </button>
//             )}
//           </div>

//           {/* Comments Section */}
//           <div className="yt-comments">
//             <div className="yt-comments-header">
//               <h2>{video.comments?.length || 0} Comments</h2>
//             </div>

//             {/* Add Comment */}
//             {user && (
//               <div className="yt-add-comment">
//                 <div className="yt-comment-avatar">
//                   {user.name?.charAt(0).toUpperCase() || 'U'}
//                 </div>
//                 <div className="yt-comment-input-wrapper">
//                   <input
//                     type="text"
//                     placeholder="Add a comment..."
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && postComment()}
//                     className="yt-comment-input"
//                   />
//                   {comment.trim() && (
//                     <div className="yt-comment-actions">
//                       <button onClick={() => setComment("")} className="yt-cancel">
//                         Cancel
//                       </button>
//                       <button onClick={postComment} className="yt-post">
//                         Comment
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Comments List */}
//             <div className="yt-comments-list">
//               {video.comments?.map((c) => (
//                 <div key={c._id} className="yt-comment">
//                   <div className="yt-comment-avatar">
//                     {c.user?.name?.charAt(0).toUpperCase() || c.user?.charAt(0).toUpperCase() || 'U'}
//                   </div>
//                   <div className="yt-comment-content">
//                     <div className="yt-comment-header">
//                       <span className="yt-comment-author">
//                         {c.user?.name || c.user || 'Anonymous'}
//                       </span>
//                       <span className="yt-comment-time">
//                         {getTimeAgo(c.createdAt)}
//                       </span>
//                     </div>
//                     <p className="yt-comment-text">{c.text}</p>
//                     <div className="yt-comment-toolbar">
//                       <button className="yt-comment-btn">
//                         <FiThumbsUp size={16} />
//                       </button>
//                       <button className="yt-comment-btn">
//                         <FiThumbsDown size={16} />
//                       </button>
//                       <button className="yt-comment-btn">Reply</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: Recommended Videos */}
//         <div className="yt-secondary">
//           {recommended.map((v) => (
//             <div
//               key={v._id}
//               className="yt-recommend-card"
//               onClick={() => navigate(`/watch/${v.filename}`)}
//             >
//               <div className="yt-recommend-thumb">
//                 <img
//                   src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                   alt={v.title}
//                   onError={(e) => {
//                     e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="168" height="94"><rect fill="%23282828" width="168" height="94"/></svg>';
//                   }}
//                 />
//                 <div className="yt-recommend-duration">
//                   {v.duration || '10:23'}
//                 </div>
//               </div>
//               <div className="yt-recommend-info">
//                 <h4 className="yt-recommend-title">{v.title}</h4>
//                 <p className="yt-recommend-channel">{v.uploadedBy?.name}</p>
//                 <div className="yt-recommend-meta">
//                   <span>{formatViews(v.views)}</span>
//                   <span>•</span>
//                   <span>{getTimeAgo(v.createdAt)}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <style jsx>{`
//         .yt-watch-page {
//           min-height: 100vh;
//           background: #0f0f0f;
//           color: #f1f1f1;
//           padding-top: 56px;
//         }

//         .yt-watch-container {
//           max-width: ${isTheaterMode ? '100%' : '1754px'};
//           margin: 0 auto;
//           padding: 24px;
//           display: grid;
//           grid-template-columns: ${isTheaterMode ? '1fr' : '1fr 402px'};
//           gap: 24px;
//         }

//         /* PRIMARY COLUMN */
//         .yt-primary {
//           min-width: 0;
//         }

//         .yt-player {
//           position: relative;
//           width: 100%;
//           aspect-ratio: 16/9;
//           background: #000;
//           border-radius: 12px;
//           overflow: hidden;
//           margin-bottom: 12px;
//         }

//         .yt-video {
//           width: 100%;
//           height: 100%;
//           display: block;
//         }

//         /* Controls Overlay */
//         .yt-controls-overlay {
//           position: absolute;
//           top: 12px;
//           right: 12px;
//           display: flex;
//           gap: 8px;
//           z-index: 10;
//         }

//         .yt-control-btn {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           padding: 8px 12px;
//           background: rgba(0, 0, 0, 0.7);
//           backdrop-filter: blur(10px);
//           border: none;
//           border-radius: 8px;
//           color: #fff;
//           font-size: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: background 0.15s;
//         }

//         .yt-control-btn:hover {
//           background: rgba(0, 0, 0, 0.85);
//         }

//         .yt-control-btn.active {
//           background: rgba(255, 0, 0, 0.8);
//         }

//         .yt-control-btn:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .yt-control-menu-wrapper {
//           position: relative;
//         }

//         .yt-control-menu {
//           position: absolute;
//           top: calc(100% + 8px);
//           right: 0;
//           background: rgba(28, 28, 28, 0.98);
//           backdrop-filter: blur(20px);
//           border: 1px solid #3f3f3f;
//           border-radius: 8px;
//           padding: 8px;
//           min-width: 140px;
//           z-index: 100;
//         }

//         .yt-menu-item {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 10px 12px;
//           border-radius: 6px;
//           color: #f1f1f1;
//           font-size: 14px;
//           cursor: pointer;
//           transition: background 0.15s;
//         }

//         .yt-menu-item:hover {
//           background: #3f3f3f;
//         }

//         .yt-menu-item.active {
//           background: rgba(62, 166, 255, 0.2);
//           color: #3ea6ff;
//         }

//         /* Voice Feedback */
//         .yt-voice-feedback {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           background: rgba(0, 0, 0, 0.9);
//           backdrop-filter: blur(20px);
//           padding: 16px 32px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           color: #fff;
//           font-size: 16px;
//           font-weight: 600;
//           z-index: 100;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//         }

//         /* Voice Help Card */
//         .yt-voice-help {
//           background: rgba(255, 0, 0, 0.1);
//           border: 1px solid rgba(255, 0, 0, 0.3);
//           border-radius: 12px;
//           padding: 16px;
//           margin-bottom: 12px;
//         }

//         .yt-voice-help-header {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 14px;
//           font-weight: 600;
//           margin-bottom: 8px;
//           color: #f1f1f1;
//         }

//         .yt-voice-commands {
//           font-size: 13px;
//           color: #aaa;
//           line-height: 1.5;
//         }

//         /* AI Card */
//         .yt-ai-card {
//           background: rgba(62, 166, 255, 0.1);
//           border: 1px solid rgba(62, 166, 255, 0.3);
//           border-radius: 12px;
//           padding: 16px;
//           margin-bottom: 12px;
//         }

//         .yt-ai-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 12px;
//         }

//         .yt-ai-title {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 14px;
//           font-weight: 600;
//           color: #3ea6ff;
//         }

//         .yt-ai-badge {
//           padding: 4px 12px;
//           background: rgba(62, 166, 255, 0.2);
//           border-radius: 12px;
//           font-size: 11px;
//           color: #3ea6ff;
//         }

//         .yt-ai-close {
//           width: 28px;
//           height: 28px;
//           background: rgba(255, 255, 255, 0.1);
//           border: none;
//           border-radius: 50%;
//           color: #f1f1f1;
//           font-size: 20px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .yt-ai-close:hover {
//           background: rgba(255, 255, 255, 0.2);
//         }

//         .yt-ai-content {
//           font-size: 14px;
//           line-height: 1.6;
//           color: #f1f1f1;
//         }

//         .yt-ai-loading {
//           color: #aaa;
//           font-style: italic;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }

//         .yt-title {
//           font-size: 20px;
//           font-weight: 600;
//           line-height: 1.4;
//           margin: 0 0 12px 0;
//           color: #f1f1f1;
//         }

//         .yt-info-bar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 12px 0;
//           border-bottom: 1px solid #3f3f3f;
//           margin-bottom: 12px;
//         }

//         .yt-stats {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 14px;
//           color: #aaa;
//         }

//         .yt-dot {
//           font-size: 10px;
//         }

//         .yt-actions {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .yt-like-section {
//           display: flex;
//           align-items: center;
//           background: #272727;
//           border-radius: 18px;
//           overflow: hidden;
//         }

//         .yt-action-btn {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 16px;
//           background: transparent;
//           border: none;
//           color: #f1f1f1;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.15s;
//         }

//         .yt-action-btn:hover {
//           background: #3f3f3f;
//         }

//         .yt-action-btn.active {
//           color: #3ea6ff;
//         }

//         .yt-action-btn svg {
//           stroke: currentColor;
//         }

//         .yt-divider {
//           width: 1px;
//           height: 24px;
//           background: #3f3f3f;
//         }

//         .yt-action-btn-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 40px;
//           height: 40px;
//           background: #272727;
//           border: none;
//           border-radius: 50%;
//           color: #f1f1f1;
//           cursor: pointer;
//           transition: background 0.15s;
//         }

//         .yt-action-btn-icon:hover {
//           background: #3f3f3f;
//         }

//         .yt-channel-bar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 12px 0;
//           margin-bottom: 12px;
//         }

//         .yt-channel-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           cursor: pointer;
//         }

//         .yt-channel-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: #f00;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 600;
//           font-size: 18px;
//           color: #fff;
//         }

//         .yt-channel-text {
//           display: flex;
//           flex-direction: column;
//         }

//         .yt-channel-name {
//           font-size: 16px;
//           font-weight: 500;
//           color: #f1f1f1;
//         }

//         .yt-channel-subs {
//           font-size: 12px;
//           color: #aaa;
//         }

//         .yt-subscribe-btn {
//           padding: 10px 16px;
//           background: #f00;
//           border: none;
//           border-radius: 18px;
//           color: #fff;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.15s;
//         }

//         .yt-subscribe-btn:hover {
//           background: #cc0000;
//         }

//         .yt-subscribed-btn {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 16px;
//           background: #272727;
//           border: none;
//           border-radius: 18px;
//           color: #f1f1f1;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.15s;
//         }

//         .yt-subscribed-btn:hover {
//           background: #3f3f3f;
//         }

//         .yt-description {
//           background: #272727;
//           border-radius: 12px;
//           padding: 12px;
//           margin-bottom: 24px;
//         }

//         .yt-desc-meta {
//           font-size: 14px;
//           font-weight: 500;
//           color: #f1f1f1;
//           margin-bottom: 8px;
//         }

//         .yt-description-text {
//           font-size: 14px;
//           line-height: 1.6;
//           color: #f1f1f1;
//           white-space: pre-wrap;
//           max-height: 80px;
//           overflow: hidden;
//         }

//         .yt-description-text.expanded {
//           max-height: none;
//         }

//         .yt-show-more {
//           margin-top: 8px;
//           background: none;
//           border: none;
//           color: #f1f1f1;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//         }

//         .yt-comments {
//           margin-top: 24px;
//         }

//         .yt-comments-header h2 {
//           font-size: 20px;
//           font-weight: 600;
//           margin: 0 0 32px 0;
//         }

//         .yt-add-comment {
//           display: flex;
//           gap: 16px;
//           margin-bottom: 32px;
//         }

//         .yt-comment-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: #f00;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 600;
//           font-size: 16px;
//           color: #fff;
//           flex-shrink: 0;
//         }

//         .yt-comment-input-wrapper {
//           flex: 1;
//         }

//         .yt-comment-input {
//           width: 100%;
//           background: transparent;
//           border: none;
//           border-bottom: 1px solid #3f3f3f;
//           color: #f1f1f1;
//           font-size: 14px;
//           padding: 8px 0;
//           outline: none;
//         }

//         .yt-comment-input:focus {
//           border-bottom-color: #f1f1f1;
//         }

//         .yt-comment-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 8px;
//           margin-top: 12px;
//         }

//         .yt-cancel {
//           padding: 10px 16px;
//           background: transparent;
//           border: none;
//           border-radius: 18px;
//           color: #f1f1f1;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//         }

//         .yt-cancel:hover {
//           background: #3f3f3f;
//         }

//         .yt-post {
//           padding: 10px 16px;
//           background: #3ea6ff;
//           border: none;
//           border-radius: 18px;
//           color: #0f0f0f;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//         }

//         .yt-post:hover {
//           background: #65b8ff;
//         }

//         .yt-comments-list {
//           display: flex;
//           flex-direction: column;
//           gap: 24px;
//         }

//         .yt-comment {
//           display: flex;
//           gap: 16px;
//         }

//         .yt-comment-content {
//           flex: 1;
//         }

//         .yt-comment-header {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           margin-bottom: 4px;
//         }

//         .yt-comment-author {
//           font-size: 13px;
//           font-weight: 500;
//           color: #f1f1f1;
//         }

//         .yt-comment-time {
//           font-size: 12px;
//           color: #aaa;
//         }

//         .yt-comment-text {
//           font-size: 14px;
//           line-height: 1.6;
//           color: #f1f1f1;
//           margin: 0 0 8px 0;
//         }

//         .yt-comment-toolbar {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         .yt-comment-btn {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           background: transparent;
//           border: none;
//           color: #aaa;
//           font-size: 12px;
//           font-weight: 500;
//           cursor: pointer;
//           padding: 4px 8px;
//           border-radius: 12px;
//         }

//         .yt-comment-btn:hover {
//           background: #3f3f3f;
//         }

//         /* SECONDARY COLUMN */
//         .yt-secondary {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .yt-recommend-card {
//           display: flex;
//           gap: 8px;
//           cursor: pointer;
//           padding: 8px;
//           border-radius: 8px;
//           transition: background 0.15s;
//         }

//         .yt-recommend-card:hover {
//           background: #272727;
//         }

//         .yt-recommend-thumb {
//           position: relative;
//           width: 168px;
//           height: 94px;
//           flex-shrink: 0;
//           border-radius: 8px;
//           overflow: hidden;
//           background: #181818;
//         }

//         .yt-recommend-thumb img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .yt-recommend-duration {
//           position: absolute;
//           bottom: 4px;
//           right: 4px;
//           background: rgba(0, 0, 0, 0.8);
//           color: #fff;
//           font-size: 12px;
//           font-weight: 500;
//           padding: 2px 4px;
//           border-radius: 2px;
//         }

//         .yt-recommend-info {
//           flex: 1;
//           min-width: 0;
//         }

//         .yt-recommend-title {
//           font-size: 14px;
//           font-weight: 500;
//           line-height: 1.4;
//           color: #f1f1f1;
//           margin: 0 0 4px 0;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         .yt-recommend-channel {
//           font-size: 12px;
//           color: #aaa;
//           margin: 0 0 2px 0;
//         }

//         .yt-recommend-meta {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           font-size: 12px;
//           color: #aaa;
//         }

//         /* RESPONSIVE */
//         @media (max-width: 1024px) {
//           .yt-watch-container {
//             grid-template-columns: 1fr;
//           }

//           .yt-secondary {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//           }
//         }

//         @media (max-width: 768px) {
//           .yt-watch-container {
//             padding: 0;
//             gap: 0;
//           }

//           .yt-player {
//             border-radius: 0;
//             margin-bottom: 0;
//           }

//           .yt-primary {
//             padding: 0 12px;
//           }

//           .yt-secondary {
//             grid-template-columns: 1fr;
//             padding: 0 12px;
//           }

//           .yt-info-bar {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 12px;
//           }

//           .yt-actions {
//             width: 100%;
//             overflow-x: auto;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }