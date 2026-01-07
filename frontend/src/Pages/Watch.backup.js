


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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
  const [videoQuality, setVideoQuality] = useState('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQualityOption, setSelectedQualityOption] = useState('auto');
  const [captionsAvailable, setCaptionsAvailable] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);

  // Features
  const [isSaved, setIsSaved] = useState(false);

  // Voice Control States
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setShowMobileSearch(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ================= NAVBAR SEARCH SUGGESTIONS ================= */
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(`/api/search/suggestions?query=${search}`);
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
            } catch (e) { }
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
        toggleSubscribe({ stopPropagation: () => { } });
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
        const videoList = Array.isArray(allRes.data.videos) ? allRes.data.videos : (Array.isArray(allRes.data) ? allRes.data : []);
        const popular = videoList
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
      await api.post(`/api/user/watch-history/add/${videoId}`, {}, {});
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
      return '720p';
    }
    return '720p';
  };

  // Set initial video quality based on auto detection
  useEffect(() => {
    if (selectedQualityOption === 'auto') {
      const detectedQuality = getAutoQuality();
      setVideoQuality(detectedQuality);
    }
  }, []);

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

  const handleQualityChange = (newQualityOption) => {
    if (!videoRef.current || !video) return;

    let targetQuality = newQualityOption;
    if (newQualityOption === 'auto') {
      targetQuality = getAutoQuality();
    }

    const currentTime = videoRef.current.currentTime;
    const isPlaying = !videoRef.current.paused;

    setIsQualitySwitching(true);
    setSelectedQualityOption(newQualityOption); // Store what user selected (auto/720p/480p/etc)
    setVideoQuality(targetQuality); // Store actual quality for video src
    setShowQualityMenu(false);

    const newSource = `${process.env.REACT_APP_API_URL}/api/stream/${video.filename}?q=${targetQuality}`;
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
      const res = await api.get(`/api/user/saved/${videoId}`, {});
      setIsSaved(res.data.isSaved);
    } catch (err) { }
  };

  const toggleSave = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post(`/api/user/save/${video._id}`, {}, {});
      setIsSaved(!isSaved);
    } catch (err) { }
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
      const res = await api.post(`/api/videos/like/${video._id}`, {}, {});

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
      const res = await api.post(`/api/videos/dislike/${video._id}`, {}, {});

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
      const res = await api.post(`/api/user/subscribe/${channel._id}`, {}, {});

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
      const res = await api.post("/api/comments/add", {
        videoId: video._id,
        text: tempComment.text
      }, {});

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
    switch (aiInsights.status) {
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
          <button style={styles.iconBtn} onClick={() => navigate("/")}>
            <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
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

        <div style={{ ...styles.navCenter, ...(showMobileSearch && styles.mobileSearchActive) }} ref={searchRef}>
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
          <button
            style={{ ...styles.iconBtn, display: 'none' }}
            className="mobile-search-btn-class"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>

          {user ? (
            <>
              <button style={styles.iconBtn} onClick={() => navigate("/UserUpload")} className="hide-small-mobile">
                <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </button>
              <div className="hide-small-mobile">
                <Notifications />
              </div>

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
              <span className="signin-text-class">Sign in</span>
            </button>
          )}
        </div>
      </nav>

      <div style={styles.pageWrapper}>
        <div style={{
          ...styles.contentGrid,
          gridTemplateColumns: (isTheaterMode || window.innerWidth < 1024) ? "1fr" : "1fr 400px",
          display: "grid",
          gap: "24px"
        }}>
          {/* MAIN CONTENT */}
          <div style={styles.mainContent}>
            {/* Video Player */}
            <div ref={playerContainerRef} style={styles.playerWrapper}>
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
                  <span style={{ marginLeft: 4, fontSize: '11px', fontWeight: 700 }} className="control-label-class">
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
                    <span style={{ marginLeft: 4 }} className="control-label-class">{playbackSpeed}x</span>
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
                    <span style={{ marginLeft: 4 }} className="control-label-class">{selectedQualityOption === 'auto' ? 'Auto' : selectedQualityOption}</span>
                  </button>
                  {showQualityMenu && (
                    <div style={styles.controlMenu}>
                      {['auto', '720p', '480p'].map(q => (
                        <div
                          key={q}
                          onClick={() => handleQualityChange(q)}
                          style={{
                            ...styles.menuItem,
                            background: selectedQualityOption === q ? "rgba(102, 126, 234, 0.2)" : "transparent"
                          }}
                        >
                          <span>{q === 'auto' ? 'Auto' : q}</span>
                          {selectedQualityOption === q && <FiCheck size={16} />}
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


            {/* Voice Help Card */}
            {isListening && (
              <div style={styles.voiceHelpCard}>
                <div style={styles.voiceHelpHeader}>
                  <MdGraphicEq size={24} style={{ color: '#ff0000' }} />
                  <h4 style={styles.voiceHelpTitle}>Voice Commands Active</h4>
                </div>
                <div style={styles.commandsGrid}>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Playback:</span>
                    <span style={styles.commandValue}>"play", "pause", "restart"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Seek:</span>
                    <span style={styles.commandValue}>"skip 30 seconds", "rewind"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Volume:</span>
                    <span style={styles.commandValue}>"mute", "volume up/down"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Speed:</span>
                    <span style={styles.commandValue}>"faster", "slower", "normal speed"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>View:</span>
                    <span style={styles.commandValue}>"fullscreen", "theater mode"</span>
                  </div>
                  <div style={styles.commandGroup}>
                    <span style={styles.commandLabel}>Actions:</span>
                    <span style={styles.commandValue}>"like video", "subscribe", "next video"</span>
                  </div>
                </div>
              </div>
            )}

            {/* Title & Stats */}
            <h1 style={styles.videoTitle}>{video.title}</h1>

            <div style={styles.statsBar}>
              <span style={styles.stat}>
                <FiEye size={18} /> {formatViews(video.views)} views
              </span>
              <span style={styles.stat}>
                <FiClock size={18} /> {getTimeAgo(video.uploadedAt)}
              </span>
              <span style={styles.stat}>
                <FiTrendingUp size={18} /> Trending
              </span>
            </div>

            {/* Ad Banner (Premium Upgrade) */}
            {!user?.isPremium && <WatchAd />}

            {/* AI Insights Card */}
            {aiInsights.status === "ready" && aiInsights.summary && (
              <div style={styles.aiCard}>
                <div style={styles.aiTitleSection}>
                  <div style={styles.aiTitleLeft}>
                    <MdAutoAwesome size={24} style={{ color: '#667eea' }} />
                    <h3 style={styles.aiTitle}>AI Video Insights</h3>
                  </div>
                  <button
                    style={styles.toggleAIBtn}
                    onClick={() => setShowAIInsights(!showAIInsights)}
                  >
                    {showAIInsights ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </button>
                </div>

                {showAIInsights && (
                  <>
                    <div style={styles.sentimentBadge}>
                      <span style={styles.sentimentEmoji}>
                        {aiInsights.sentiment === "Positive" && "😊"}
                        {aiInsights.sentiment === "Neutral" && "😐"}
                        {aiInsights.sentiment === "Negative" && "😞"}
                      </span>
                      <span style={styles.sentimentText}>{aiInsights.sentiment} Sentiment</span>
                    </div>

                    <p style={styles.aiSummary}>{aiInsights.summary}</p>

                    <div style={styles.aiFooter}>
                      <span style={styles.aiDisclaimer}>
                        ✨ Generated by AI • May not be 100% accurate
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {aiInsights.status !== "ready" && (
              <div style={styles.aiCard}>
                <div style={styles.aiTitleSection}>
                  <MdAutoAwesome size={24} style={{ color: '#667eea' }} />
                  <h3 style={styles.aiTitle}>AI Video Insights</h3>
                </div>
                <p style={styles.aiPending}>{getAIInsightsMessage()}</p>
              </div>
            )}

            {/* Action Bar */}
            <div style={styles.actionBar}>
              <div style={styles.channelSection}>
                <div style={styles.avatar}>
                  {channel?.name?.charAt(0).toUpperCase() || "C"}
                </div>
                <div style={styles.channelInfo}>
                  <div style={styles.channelName}>{channel?.name || "Channel"}</div>
                  <div style={styles.subCount}>
                    {channel?.subscribers?.length || 0} subscribers
                  </div>
                </div>

                {channel?._id !== user?._id && (
                  <button
                    onClick={toggleSubscribe}
                    style={subscribed ? styles.subscribedBtn : styles.subscribeBtn}
                  >
                    {subscribed ? (
                      <>
                        <FiCheck size={18} />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <FiBell size={18} />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div style={styles.actionsGroup}>
                <button
                  onClick={likeVideo}
                  style={{
                    ...styles.actionBtn,
                    background: userLiked ? "rgba(102, 126, 234, 0.2)" : "rgba(255,255,255,0.1)"
                  }}
                >
                  <FiThumbsUp size={18} style={{ color: userLiked ? "#667eea" : "#fff" }} />
                  <span className="action-label-class">{likes}</span>
                </button>

                <button
                  onClick={dislikeVideo}
                  style={{
                    ...styles.actionBtn,
                    background: userDisliked ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.1)"
                  }}
                >
                  <FiThumbsDown size={18} style={{ color: userDisliked ? "#ef4444" : "#fff" }} />
                  <span className="action-label-class">{dislikes}</span>
                </button>

                <button style={styles.actionBtn}>
                  <FiShare2 size={18} />
                  <span className="action-label-class">Share</span>
                </button>

                <button onClick={toggleSave} style={styles.actionBtn}>
                  <FiHeart
                    size={18}
                    style={{
                      color: isSaved ? "#ff0000" : "#fff",
                      fill: isSaved ? "#ff0000" : "none"
                    }}
                  />
                  <span className="action-label-class">{isSaved ? "Saved" : "Save"}</span>
                </button>

                <button style={styles.moreBtn}>
                  <FiMoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div style={styles.descCard}>
              <p style={{
                ...styles.descText,
                maxHeight: showDescription ? 'none' : '60px',
                overflow: 'hidden'
              }}>
                {video.description || "No description available."}
              </p>
              {video.description && video.description.length > 150 && (
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  style={styles.showMoreBtn}
                >
                  {showDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Comments Section */}
            <div style={styles.commentsSection}>
              <div style={styles.commentsHeader}>
                <h3 style={styles.commentsCount}>
                  {video.comments?.length || 0} Comments
                </h3>
                <button style={styles.sortBtn}>
                  <MdSort size={20} />
                  <span className="sort-label-class">Sort by</span>
                </button>
              </div>

              {user && (
                <div style={styles.addComment}>
                  <div style={styles.commentAvatar}>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && postComment()}
                      style={styles.commentField}
                    />
                    {comment.trim() && (
                      <div style={styles.commentActions}>
                        <button onClick={() => setComment("")} style={styles.cancelBtn}>
                          Cancel
                        </button>
                        <button onClick={postComment} style={styles.commentBtn}>
                          <FiSend size={16} />
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={styles.commentsList}>
                {getSortedComments().map((c) => (
                  <div key={c._id} style={styles.commentCard}>
                    <div style={styles.commentAvatar}>
                      {c.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.commentHeader}>
                        <span style={styles.commentUser}>{c.user?.name || "Anonymous"}</span>
                        <span style={styles.commentTime}>{getTimeAgo(c.createdAt)}</span>
                      </div>
                      <p style={styles.commentContent}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR - Recommended Videos */}
          {!isTheaterMode && (
            <div style={styles.sidebar}>
              <h3 style={styles.sidebarTitle}>Recommended</h3>
              {recommended.map((v) => (
                <div
                  key={v._id}
                  style={styles.recCard}
                  onClick={() => navigate(`/watch/${v.filename}`)}
                >
                  <div style={styles.recThumb}>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/thumbnails/${v.thumbnail}`}
                      alt={v.title}
                      style={styles.recThumbImg}
                    />
                    <div style={styles.recDuration}>
                      {Math.floor((v.duration || 0) / 60)}:{String((v.duration || 0) % 60).padStart(2, '0')}
                    </div>
                  </div>
                  <div style={styles.recInfo}>
                    <h4 style={styles.recTitle}>{v.title}</h4>
                    <p style={styles.recChannel}>{v.uploadedBy?.name || "Unknown"}</p>
                    <div style={styles.recMeta}>
                      {formatViews(v.views)} views • {getTimeAgo(v.uploadedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }

        .mobile-search-btn-class {
          display: none !important;
        }

        /* ========== RESPONSIVE - TABLET ========== */
        @media (max-width: 1024px) {
          .contentGrid {
            grid-template-columns: 1fr !important;
          }
        }

        /* ========== RESPONSIVE - MOBILE ========== */
        @media (max-width: 768px) {
          .mobile-search-btn-class {
            display: flex !important;
          }

          .signin-text-class {
            display: none !important;
          }

          .hide-small-mobile {
            display: none !important;
          }

          .control-label-class {
            display: none !important;
          }

          .action-label-class {
            display: none !important;
          }

          .sort-label-class {
            display: none !important;
          }
        }

        /* ========== RESPONSIVE - SMALL MOBILE ========== */
        @media (max-width: 480px) {
          .control-label-class {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}


/* ================= STYLES ================= */
const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0f0f0f',
    gap: '20px',
  },
  loadingText: {
    color: '#aaa',
    fontSize: '16px',
    fontWeight: 500,
  },

  // Navbar
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '56px',
    background: '#0f0f0f',
    borderBottom: '1px solid #3f3f3f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 2000,
  },
  navStart: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '600px',
    flex: 1,
    margin: '0 40px',
  },
  mobileSearchActive: {
    position: 'fixed',
    top: '56px',
    left: 0,
    right: 0,
    background: '#0f0f0f',
    padding: '12px',
    borderBottom: '1px solid #3f3f3f',
    zIndex: 1900,
    maxWidth: 'none',
    margin: 0,
  },
  navEnd: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '90px',
    height: '20px',
  },
  logoText: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  searchContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    background: '#121212',
    borderRadius: '40px',
    border: '1px solid #3f3f3f',
    overflow: 'hidden',
    height: '40px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    color: '#fff',
    padding: '0 16px',
    fontSize: '16px',
    outline: 'none',
  },
  searchBtn: {
    width: '64px',
    height: '40px',
    border: 'none',
    background: '#222',
    borderLeft: '1px solid #3f3f3f',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  voiceBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#212121',
    borderRadius: '12px',
    marginTop: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  suggestionType: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#aaa',
    textTransform: 'uppercase',
  },
  signinBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '20px',
    border: '1px solid #3ea6ff',
    background: 'transparent',
    color: '#3ea6ff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    minHeight: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
  },
  userDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '320px',
    background: '#282828',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    zIndex: 3000,
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
  },
  dropdownAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
  },
  dropdownName: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
  },
  dropdownEmail: {
    color: '#aaa',
    fontSize: '13px',
    marginTop: '2px',
  },
  dropdownDivider: {
    height: '1px',
    background: '#3f3f3f',
    margin: '8px 0',
  },
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textAlign: 'left',
  },

  // Page Layout
  pageWrapper: {
    paddingTop: '70px',
    paddingBottom: '32px',
    minHeight: '100vh',
    background: '#0f0f0f',
  },
  contentGrid: {
    display: 'grid',
    gap: '24px',
    maxWidth: '1920px',
    margin: '0 auto',
    padding: '0 24px',
  },
  mainContent: {
    minWidth: 0,
  },

  // Video Player
  playerWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    background: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  videoElement: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  skipAdButton: {
    position: 'absolute',
    bottom: '80px',
    right: '16px',
    padding: '12px 24px',
    background: 'rgba(0,0,0,0.9)',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    zIndex: 100,
    transition: 'all 0.2s',
  },
  voiceFeedback: {
    position: 'absolute',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.9)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  videoControls: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
    flexWrap: 'wrap',
  },
  controlBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'rgba(0,0,0,0.7)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s',
  },
  controlMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: 'rgba(28,28,28,0.98)',
    borderRadius: '8px',
    minWidth: '140px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  // Voice Help Card
  voiceHelpCard: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  voiceHelpHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  voiceHelpTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    margin: 0,
  },
  commandsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px',
  },
  commandGroup: {
    display: 'flex',
    gap: '8px',
  },
  commandLabel: {
    color: '#aaa',
    fontSize: '13px',
    fontWeight: 600,
    minWidth: '80px',
  },
  commandValue: {
    color: '#fff',
    fontSize: '13px',
  },

  // Video Info
  videoTitle: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '12px',
    lineHeight: 1.3,
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#aaa',
    fontSize: '14px',
    fontWeight: 500,
  },

  // Ad Banner
  adBanner: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  adGlowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  adContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    zIndex: 1,
  },
  adIcon: {
    fontSize: '32px',
  },
  adTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  adText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
  },
  premiumBtn: {
    marginLeft: 'auto',
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '24px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },

  // AI Insights
  aiCard: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  aiTitleSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  aiTitleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  aiTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
  },
  toggleAIBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  sentimentBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    marginBottom: '12px',
  },
  sentimentEmoji: {
    fontSize: '18px',
  },
  sentimentText: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
  },
  aiSummary: {
    color: '#fff',
    fontSize: '15px',
    lineHeight: 1.6,
    marginBottom: '12px',
  },
  aiFooter: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '12px',
  },
  aiDisclaimer: {
    color: '#aaa',
    fontSize: '12px',
  },
  aiPending: {
    color: '#aaa',
    fontSize: '14px',
    fontStyle: 'italic',
  },

  // Action Bar
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '16px',
    padding: '16px 0',
    borderTop: '1px solid #3f3f3f',
    borderBottom: '1px solid #3f3f3f',
  },
  channelSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: 48,
    height: 48,
    minWidth: 48,
    minHeight: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 700,
  },
  channelInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  channelName: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
  },
  subCount: {
    color: '#aaa',
    fontSize: '13px',
  },
  subscribeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginLeft: '16px',
  },
  subscribedBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginLeft: '16px',
  },
  actionsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 18px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '24px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  moreBtn: {
    width: '44px',
    height: '44px',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },

  // Description
  descCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  descText: {
    color: '#fff',
    fontSize: '14px',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  showMoreBtn: {
    marginTop: '12px',
    padding: '8px 16px',
    background: 'transparent',
    border: 'none',
    color: '#3ea6ff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  // Comments
  commentsSection: {
    marginTop: '24px',
  },
  commentsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  commentsCount: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
  },
  sortBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '24px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addComment: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
  },
  commentAvatar: {
    width: 40,
    height: 40,
    minWidth: 40,
    minHeight: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
  },
  commentField: {
    width: '100%',
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #3f3f3f',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  commentActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '24px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  commentBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#3ea6ff',
    border: 'none',
    borderRadius: '24px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  commentCard: {
    display: 'flex',
    gap: '16px',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  commentUser: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
  },
  commentTime: {
    color: '#aaa',
    fontSize: '12px',
  },
  commentContent: {
    color: '#fff',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: 0,
  },

  // Sidebar
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  recCard: {
    display: 'flex',
    gap: '12px',
    cursor: 'pointer',
    borderRadius: '8px',
    padding: '8px',
    transition: 'background 0.2s',
  },
  recThumb: {
    position: 'relative',
    width: '168px',
    height: '94px',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
    background: '#000',
  },
  recThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  recDuration: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    padding: '2px 6px',
    background: 'rgba(0,0,0,0.9)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '4px',
  },
  recInfo: {
    flex: 1,
    minWidth: 0,
  },
  recTitle: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.4,
    margin: '0 0 4px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  recChannel: {
    color: '#aaa',
    fontSize: '13px',
    marginBottom: '4px',
  },
  recMeta: {
    color: '#aaa',
    fontSize: '12px',
  },
};