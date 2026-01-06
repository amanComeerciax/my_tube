

// import React, { useState, useContext, useEffect, useMemo } from "react";
// import api from "../config/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import {
//   FiUpload, FiVideo, FiSettings, FiLogOut, FiEdit2, FiTrash2,
//   FiPlayCircle, FiEye, FiThumbsUp, FiTrendingUp,
//   FiHome, FiMenu, FiX, FiSearch, FiDownload,
//   FiDollarSign, FiMousePointer, FiBarChart2, FiActivity,
//   FiUsers, FiCheckCircle, FiClock, FiRefreshCw,
//   FiPieChart, FiTarget, FiAlertCircle, FiZap, FiPercent
// } from "react-icons/fi";
// import { MdDashboard, MdVideoLibrary, MdAnalytics } from "react-icons/md";

// export default function AdvancedAdminDashboard() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // ==================== STATE MANAGEMENT ====================

//   // UI States
//   const [activeTab, setActiveTab] = useState("overview");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // Data States
//   const [videos, setVideos] = useState([]);
//   const [ads, setAds] = useState([]);
//   const [creators, setCreators] = useState([]);
//   const [revenueData, setRevenueData] = useState(null);

//   // Filter States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [dateRange, setDateRange] = useState("all"); // all, today, week, month
//   const [sortBy, setSortBy] = useState("recent"); // recent, views, revenue, engagement

//   // Upload States
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);

//   // Edit States
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   const categories = [
//     "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
//     "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
//     "Fashion", "Fitness", "Other"
//   ];

//   // ==================== DATA FETCHING ====================

//   useEffect(() => {
//     if (user) {
//       fetchAllData();
//     }
//   }, [user]);

//   const fetchAllData = async () => {
//     setLoading(true);
//     await Promise.all([
//       fetchVideos(),
//       fetchAds(),
//       fetchCreators(),
//       fetchRevenueData()
//     ]);
//     setLoading(false);
//   };

//   const fetchVideos = async () => {
//     try {
//       const res = await api.get("/api/videos/all");
//       // res.data now contains { videos, total, page ... } due to pagination
//       setVideos(Array.isArray(res.data.videos) ? res.data.videos : (Array.isArray(res.data) ? res.data : []));
//     } catch (err) {
//       console.error("Failed to fetch videos:", err);
//       setVideos([]);
//     }
//   };

//   const fetchAds = async () => {
//     try {
//       const res = await api.get("/api/ads");
//       setAds(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Failed to fetch ads:", err);
//       setAds([]);
//     }
//   };

//   const fetchCreators = async () => {
//     try {
//       const res = await api.get("/api/monetization/admin/creators");
//       setCreators(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Failed to fetch creators:", err);
//       setCreators([]);
//     }
//   };

//   const fetchRevenueData = async () => {
//     try {
//       const res = await api.get("/api/ads/dashboard/revenue", {

//       });
//       setRevenueData(res.data);
//     } catch (err) {
//       console.error("Failed to fetch revenue:", err);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchAllData();
//     setRefreshing(false);
//   };

//   // ==================== ANALYTICS CALCULATIONS ====================

//   const calculateMetrics = () => {
//     const videoList = Array.isArray(videos) ? videos : [];
//     const totalVideos = videoList.length;
//     const totalViews = videoList.reduce((sum, v) => sum + (v.views || 0), 0);
//     const totalLikes = videoList.reduce((sum, v) => sum + (v.likes?.length || 0), 0);
//     const avgViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;

//     const adList = Array.isArray(ads) ? ads : [];
//     const creatorList = Array.isArray(creators) ? creators : [];

//     const totalAds = adList.length;
//     const activeAds = adList.filter(a => a.active).length;
//     const totalAdViews = adList.reduce((sum, a) => sum + (a.views || 0), 0);
//     const totalAdClicks = adList.reduce((sum, a) => sum + (a.clicks || 0), 0);
//     const avgCTR = totalAdViews > 0 ? ((totalAdClicks / totalAdViews) * 100).toFixed(2) : 0;

//     const totalRevenue = revenueData?.overview?.totalRevenue || 0;
//     const pendingPayouts = creatorList.reduce((sum, c) => sum + (c.earnings?.pendingBalance || 0), 0);

//     const approvedCreators = creatorList.filter(c => c.monetizationStatus === "approved").length;
//     const pendingCreators = creatorList.filter(c => c.monetizationStatus === "pending").length;

//     // Growth calculations (mock - in production, compare with previous period)
//     const viewsGrowth = 12.5;
//     const revenueGrowth = 8.3;
//     const creatorsGrowth = 15.7;

//     return {
//       videos: { total: totalVideos, views: totalViews, likes: totalLikes, avgViews, growth: viewsGrowth },
//       ads: { total: totalAds, active: activeAds, views: totalAdViews, clicks: totalAdClicks, ctr: avgCTR },
//       revenue: { total: totalRevenue, pending: pendingPayouts, growth: revenueGrowth },
//       creators: { total: creatorList.length, approved: approvedCreators, pending: pendingCreators, growth: creatorsGrowth },
//       engagement: {
//         rate: totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : 0,
//         avgWatchTime: "8:32", // Mock - get from backend
//         retention: "68%" // Mock - get from backend
//       }
//     };
//   };

//   const metrics = calculateMetrics();

//   // ==================== VIDEO MANAGEMENT ====================

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       alert("⚠️ Please login first to upload videos");
//       navigate("/login");
//       return;
//     }

//     if (!title || !category || !video || !thumbnail) {
//       alert("Please fill all required fields");
//       return;
//     }

//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("category", category);
//     fd.append("description", description);
//     fd.append("tags", tags);
//     fd.append("video", video);
//     fd.append("thumbnail", thumbnail);

//     try {
//       setUploading(true);
//       setProgress(0);

//       await api.post("/api/ads/upload", fd, {

//         onUploadProgress: (e) => {
//           setProgress(Math.round((e.loaded * 100) / e.total));
//         },
//       });

//       alert("✅ Video uploaded successfully!");
//       resetForm();
//       fetchVideos();
//       setActiveTab("videos");
//     } catch (err) {
//       alert("❌ Upload failed");
//     } finally {
//       setUploading(false);
//       setProgress(0);
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setCategory("");
//     setDescription("");
//     setTags("");
//     setVideo(null);
//     setThumbnail(null);
//     setVideoPreview(null);
//     setThumbnailPreview(null);
//     if (document.getElementById("video-input")) {
//       document.getElementById("video-input").value = "";
//     }
//     if (document.getElementById("thumb-input")) {
//       document.getElementById("thumb-input").value = "";
//     }
//   };

//   const handleVideoSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setVideo(file);
//       setVideoPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleThumbnailSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnail(file);
//       setThumbnailPreview(URL.createObjectURL(file));
//     }
//   };

//   const deleteVideo = async (id) => {
//     if (!user) {
//       alert("⚠️ Please login first");
//       return;
//     }

//     if (!window.confirm("🗑️ Delete this video permanently?")) return;

//     try {
//       await api.delete(`/api/videos/delete/${id}`, {

//       });
//       fetchVideos();
//       alert("✅ Video deleted successfully");
//     } catch (err) {
//       alert("❌ Delete failed");
//     }
//   };

//   const updateTitle = async () => {
//     if (!user) {
//       alert("⚠️ Please login first");
//       return;
//     }

//     if (!editTitle.trim()) return;

//     try {
//       await api.put(
//         `/api/videos/update/${editId}`,
//         { title: editTitle },
//         {}
//       );
//       setEditId(null);
//       fetchVideos();
//       alert("✅ Title updated");
//     } catch (err) {
//       alert("❌ Update failed");
//     }
//   };

//   // ==================== FILTERING & SORTING ====================

//   const filteredVideos = videos
//     .filter(v => {
//       const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCategory = filterCategory === "All" || v.category === filterCategory;
//       return matchesSearch && matchesCategory;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "views":
//           return (b.views || 0) - (a.views || 0);
//         case "revenue":
//           return 0; // Implement revenue sortåing
//         case "engagement":
//           return (b.likes?.length || 0) - (a.likes?.length || 0);
//         default:
//           return new Date(b.createdAt) - new Date(a.createdAt);
//       }
//     });

//   // ==================== HELPERS ====================

//   const formatNumber = (num) => {
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num;
//   };

//   const formatCurrency = (amount) => {
//     return "₹" + (amount || 0).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     });
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric"
//     });
//   };

//   const getGrowthColor = (growth) => {
//     return growth >= 0 ? "#10b981" : "#ef4444";
//   };

//   // ==================== RENDER ====================

//   if (loading && videos.length === 0) {
//     return (
//       <div style={styles.loadingScreen}>
//         <div style={styles.loadingSpinner}>
//           <div className="spinner"></div>
//           <p style={styles.loadingText}>Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       {/* Sidebar */}
//       <aside style={{
//         ...styles.sidebar,
//         width: sidebarOpen ? '280px' : '80px',
//         transform: sidebarOpen ? 'translateX(0)' : 'translateX(0)'
//       }}>
//         <div style={styles.sidebarHeader}>
//           {sidebarOpen && (
//             <div style={styles.logo}>
//               <div style={styles.logoIcon}>
//                 <FiZap size={28} />
//               </div>
//               <div>
//                 <div style={styles.logoText}>AdminHub</div>
//                 <div style={styles.logoSubtext}>Pro Analytics</div>
//               </div>
//             </div>
//           )}
//           <button
//             style={styles.toggleBtn}
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//           </button>
//         </div>

//         <nav style={styles.nav}>
//           <div style={styles.navSection}>
//             {sidebarOpen && <div style={styles.navSectionTitle}>Main</div>}

//             <button
//               style={{
//                 ...styles.navItem,
//                 background: activeTab === 'overview' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
//                 color: activeTab === 'overview' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
//               }}
//               onClick={() => setActiveTab('overview')}
//             >
//               <MdDashboard size={22} />
//               {sidebarOpen && <span>Overview</span>}
//               {activeTab === 'overview' && <div style={styles.activeIndicator}></div>}
//             </button>

//             <button
//               style={{
//                 ...styles.navItem,
//                 background: activeTab === 'analytics' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
//                 color: activeTab === 'analytics' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
//               }}
//               onClick={() => setActiveTab('analytics')}
//             >
//               <MdAnalytics size={22} />
//               {sidebarOpen && <span>Analytics</span>}
//               {activeTab === 'analytics' && <div style={styles.activeIndicator}></div>}
//             </button>

//             <button
//               style={{
//                 ...styles.navItem,
//                 background: activeTab === 'videos' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
//                 color: activeTab === 'videos' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
//               }}
//               onClick={() => setActiveTab('videos')}
//             >
//               <MdVideoLibrary size={22} />
//               {sidebarOpen && <span>Videos</span>}
//               {activeTab === 'videos' && <div style={styles.activeIndicator}></div>}
//             </button>

//             <button
//               style={{
//                 ...styles.navItem,
//                 background: activeTab === 'ads' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
//                 color: activeTab === 'ads' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
//               }}
//               onClick={() => setActiveTab('ads')}
//             >
//               <FiTarget size={22} />
//               {sidebarOpen && <span>Advertisements</span>}
//               {activeTab === 'ads' && <div style={styles.activeIndicator}></div>}
//             </button>

//             <button
//               style={{
//                 ...styles.navItem,
//                 background: activeTab === 'revenue' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
//                 color: activeTab === 'revenue' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
//               }}
//               onClick={() => setActiveTab('revenue')}
//             >
//               <FiDollarSign size={22} />
//               {sidebarOpen && <span>Revenue</span>}
//               {activeTab === 'revenue' && <div style={styles.activeIndicator}></div>}
//             </button>

//             <button
//               style={{
//                 ...styles.navItem,
//                 background: activeTab === 'creators' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
//                 color: activeTab === 'creators' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
//               }}
//               onClick={() => setActiveTab('creators')}
//             >
//               <FiUsers size={22} />
//               {sidebarOpen && <span>Creators</span>}
//               {activeTab === 'creators' && <div style={styles.activeIndicator}></div>}
//             </button>
//           </div>

//           <div style={styles.divider}></div>

//           <div style={styles.navSection}>
//             {sidebarOpen && <div style={styles.navSectionTitle}>System</div>}

//             <button style={styles.navItem} onClick={() => navigate("/")}>
//               <FiHome size={22} />
//               {sidebarOpen && <span>Home</span>}
//             </button>

//             {user ? (
//               <>
//                 <button style={styles.navItem} onClick={() => navigate("/profile")}>
//                   <FiSettings size={22} />
//                   {sidebarOpen && <span>Settings</span>}
//                 </button>
//                 <button style={styles.navItem} onClick={logout}>
//                   <FiLogOut size={22} />
//                   {sidebarOpen && <span>Logout</span>}
//                 </button>
//               </>
//             ) : (
//               <button style={styles.navItem} onClick={() => navigate("/login")}>
//                 <FiLogOut size={22} />
//                 {sidebarOpen && <span>Login</span>}
//               </button>
//             )}
//           </div>
//         </nav>

//         {sidebarOpen && user && (
//           <div style={styles.sidebarFooter}>
//             <div style={styles.userCard}>
//               <div style={styles.userAvatar}>
//                 {user?.name?.charAt(0).toUpperCase()}
//               </div>
//               <div style={styles.userInfo}>
//                 <div style={styles.userName}>{user?.name}</div>
//                 <div style={styles.userRole}>Administrator</div>
//               </div>
//               <div style={styles.userStatus}></div>
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Main Content */}
//       <main style={{
//         ...styles.main,
//         marginLeft: sidebarOpen ? '280px' : '80px',
//         transition: 'margin-left 0.3s ease'
//       }}>
//         {/* Top Bar */}
//         <div style={styles.topBar}>
//           <div style={styles.topBarLeft}>
//             <h1 style={styles.pageTitle}>
//               {activeTab === 'overview' && 'Dashboard Overview'}
//               {activeTab === 'analytics' && 'Advanced Analytics'}
//               {activeTab === 'videos' && 'Video Management'}
//               {activeTab === 'ads' && 'Ad Management'}
//               {activeTab === 'revenue' && 'Revenue Dashboard'}
//               {activeTab === 'creators' && 'Creator Management'}
//             </h1>
//             <div style={styles.breadcrumb}>
//               <span>Admin</span>
//               <span style={styles.breadcrumbSeparator}>/</span>
//               <span style={styles.breadcrumbActive}>
//                 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//               </span>
//             </div>
//           </div>

//           <div style={styles.topBarRight}>
//             <button
//               style={styles.refreshButton}
//               onClick={handleRefresh}
//               disabled={refreshing}
//             >
//               <FiRefreshCw size={18} className={refreshing ? 'spinning' : ''} />
//               {!refreshing && <span>Refresh</span>}
//             </button>

//             <button style={styles.exportButton}>
//               <FiDownload size={18} />
//               <span>Export</span>
//             </button>

//             <div style={styles.notificationBadge}>
//               <FiAlertCircle size={20} />
//               {metrics.creators.pending > 0 && (
//                 <span style={styles.badge}>{metrics.creators.pending}</span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={styles.content}>
//           {/* ==================== OVERVIEW TAB ==================== */}
//           {activeTab === 'overview' && (
//             <>
//               {/* Key Metrics Grid */}
//               <div style={styles.metricsGrid}>
//                 <div style={styles.metricCard}>
//                   <div style={styles.metricHeader}>
//                     <div style={styles.metricIcon} className="gradient-purple">
//                       <FiVideo size={24} />
//                     </div>
//                     <div style={styles.metricGrowth}>
//                       <FiTrendingUp size={16} color={getGrowthColor(metrics.videos.growth)} />
//                       <span style={{ color: getGrowthColor(metrics.videos.growth) }}>
//                         {metrics.videos.growth}%
//                       </span>
//                     </div>
//                   </div>
//                   <div style={styles.metricValue}>{formatNumber(metrics.videos.total)}</div>
//                   <div style={styles.metricLabel}>Total Videos</div>
//                   <div style={styles.metricFooter}>
//                     <span>{formatNumber(metrics.videos.views)} views</span>
//                     <span>•</span>
//                     <span>{formatNumber(metrics.videos.likes)} likes</span>
//                   </div>
//                 </div>

//                 <div style={styles.metricCard}>
//                   <div style={styles.metricHeader}>
//                     <div style={styles.metricIcon} className="gradient-green">
//                       <FiDollarSign size={24} />
//                     </div>
//                     <div style={styles.metricGrowth}>
//                       <FiTrendingUp size={16} color={getGrowthColor(metrics.revenue.growth)} />
//                       <span style={{ color: getGrowthColor(metrics.revenue.growth) }}>
//                         {metrics.revenue.growth}%
//                       </span>
//                     </div>
//                   </div>
//                   <div style={styles.metricValue}>{formatCurrency(metrics.revenue.total)}</div>
//                   <div style={styles.metricLabel}>Total Revenue</div>
//                   <div style={styles.metricFooter}>
//                     <span>{formatCurrency(metrics.revenue.pending)} pending</span>
//                   </div>
//                 </div>

//                 <div style={styles.metricCard}>
//                   <div style={styles.metricHeader}>
//                     <div style={styles.metricIcon} className="gradient-blue">
//                       <FiTarget size={24} />
//                     </div>
//                     <div style={styles.metricGrowth}>
//                       <span style={{ color: '#667eea' }}>{metrics.ads.ctr}%</span>
//                     </div>
//                   </div>
//                   <div style={styles.metricValue}>{metrics.ads.active}/{metrics.ads.total}</div>
//                   <div style={styles.metricLabel}>Active Ads</div>
//                   <div style={styles.metricFooter}>
//                     <span>{formatNumber(metrics.ads.views)} views</span>
//                     <span>•</span>
//                     <span>{formatNumber(metrics.ads.clicks)} clicks</span>
//                   </div>
//                 </div>

//                 <div style={styles.metricCard}>
//                   <div style={styles.metricHeader}>
//                     <div style={styles.metricIcon} className="gradient-orange">
//                       <FiUsers size={24} />
//                     </div>
//                     <div style={styles.metricGrowth}>
//                       <FiTrendingUp size={16} color={getGrowthColor(metrics.creators.growth)} />
//                       <span style={{ color: getGrowthColor(metrics.creators.growth) }}>
//                         {metrics.creators.growth}%
//                       </span>
//                     </div>
//                   </div>
//                   <div style={styles.metricValue}>{metrics.creators.total}</div>
//                   <div style={styles.metricLabel}>Total Creators</div>
//                   <div style={styles.metricFooter}>
//                     <span>{metrics.creators.approved} approved</span>
//                     <span>•</span>
//                     <span>{metrics.creators.pending} pending</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Performance Overview */}
//               <div style={styles.performanceSection}>
//                 <div style={styles.performanceCard}>
//                   <h3 style={styles.sectionTitle}>
//                     <FiBarChart2 size={20} />
//                     Performance Metrics
//                   </h3>
//                   <div style={styles.performanceGrid}>
//                     <div style={styles.performanceItem}>
//                       <div style={styles.performanceLabel}>
//                         <FiEye size={18} />
//                         <span>Avg Views/Video</span>
//                       </div>
//                       <div style={styles.performanceValue}>{formatNumber(metrics.videos.avgViews)}</div>
//                       <div style={styles.performanceBar}>
//                         <div style={{ ...styles.performanceBarFill, width: '75%', background: '#667eea' }}></div>
//                       </div>
//                     </div>

//                     <div style={styles.performanceItem}>
//                       <div style={styles.performanceLabel}>
//                         <FiMousePointer size={18} />
//                         <span>Ad CTR</span>
//                       </div>
//                       <div style={styles.performanceValue}>{metrics.ads.ctr}%</div>
//                       <div style={styles.performanceBar}>
//                         <div style={{ ...styles.performanceBarFill, width: `${metrics.ads.ctr * 10}%`, background: '#10b981' }}></div>
//                       </div>
//                     </div>

//                     <div style={styles.performanceItem}>
//                       <div style={styles.performanceLabel}>
//                         <FiThumbsUp size={18} />
//                         <span>Engagement Rate</span>
//                       </div>
//                       <div style={styles.performanceValue}>{metrics.engagement.rate}%</div>
//                       <div style={styles.performanceBar}>
//                         <div style={{ ...styles.performanceBarFill, width: `${metrics.engagement.rate * 2}%`, background: '#f59e0b' }}></div>
//                       </div>
//                     </div>

//                     <div style={styles.performanceItem}>
//                       <div style={styles.performanceLabel}>
//                         <FiActivity size={18} />
//                         <span>Avg Watch Time</span>
//                       </div>
//                       <div style={styles.performanceValue}>{metrics.engagement.avgWatchTime}</div>
//                       <div style={styles.performanceBar}>
//                         <div style={{ ...styles.performanceBarFill, width: '68%', background: '#8b5cf6' }}></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div style={styles.alertsCard}>
//                   <h3 style={styles.sectionTitle}>
//                     <FiAlertCircle size={20} />
//                     System Alerts
//                   </h3>
//                   <div style={styles.alertsList}>
//                     {metrics.creators.pending > 0 && (
//                       <div style={styles.alertItem}>
//                         <div style={styles.alertIcon} className="alert-warning">
//                           <FiClock size={18} />
//                         </div>
//                         <div style={styles.alertContent}>
//                           <div style={styles.alertTitle}>Pending Creator Applications</div>
//                           <div style={styles.alertText}>
//                             {metrics.creators.pending} creators waiting for approval
//                           </div>
//                         </div>
//                         <button
//                           style={styles.alertButton}
//                           onClick={() => setActiveTab('creators')}
//                         >
//                           Review
//                         </button>
//                       </div>
//                     )}

//                     {metrics.revenue.pending > 1000 && (
//                       <div style={styles.alertItem}>
//                         <div style={styles.alertIcon} className="alert-info">
//                           <FiDollarSign size={18} />
//                         </div>
//                         <div style={styles.alertContent}>
//                           <div style={styles.alertTitle}>Pending Payouts</div>
//                           <div style={styles.alertText}>
//                             {formatCurrency(metrics.revenue.pending)} awaiting payout
//                           </div>
//                         </div>
//                         <button
//                           style={styles.alertButton}
//                           onClick={() => setActiveTab('revenue')}
//                         >
//                           Process
//                         </button>
//                       </div>
//                     )}

//                     <div style={styles.alertItem}>
//                       <div style={styles.alertIcon} className="alert-success">
//                         <FiCheckCircle size={18} />
//                       </div>
//                       <div style={styles.alertContent}>
//                         <div style={styles.alertTitle}>All Systems Operational</div>
//                         <div style={styles.alertText}>
//                           Platform running smoothly
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Activity */}
//               <div style={styles.activitySection}>
//                 <h3 style={styles.sectionTitle}>
//                   <FiActivity size={20} />
//                   Recent Activity
//                 </h3>
//                 <div style={styles.activityGrid}>
//                   {videos.slice(0, 5).map((v) => (
//                     <div key={v._id} style={styles.activityCard}>
//                       <img
//                         src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                         alt={v.title}
//                         style={styles.activityThumb}
//                       />
//                       <div style={styles.activityInfo}>
//                         <div style={styles.activityTitle}>{v.title}</div>
//                         <div style={styles.activityMeta}>
//                           <span style={styles.activityBadge}>{v.category}</span>
//                           <span style={styles.activityStats}>
//                             <FiEye size={14} /> {formatNumber(v.views || 0)}
//                           </span>
//                           <span style={styles.activityStats}>
//                             <FiThumbsUp size={14} /> {v.likes?.length || 0}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* ==================== ANALYTICS TAB ==================== */}
//           {activeTab === 'analytics' && (
//             <>
//               <div style={styles.analyticsHeader}>
//                 <div style={styles.dateRangeSelector}>
//                   {['today', 'week', 'month', 'all'].map(range => (
//                     <button
//                       key={range}
//                       style={{
//                         ...styles.dateRangeButton,
//                         ...(dateRange === range ? styles.dateRangeButtonActive : {})
//                       }}
//                       onClick={() => setDateRange(range)}
//                     >
//                       {range.charAt(0).toUpperCase() + range.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Analytics Grid */}
//               <div style={styles.analyticsGrid}>
//                 {/* Top Performing Videos */}
//                 <div style={styles.analyticsCard}>
//                   <h3 style={styles.cardTitle}>
//                     <FiTrendingUp size={20} />
//                     Top Performing Videos
//                   </h3>
//                   <div style={styles.topList}>
//                     {videos
//                       .sort((a, b) => (b.views || 0) - (a.views || 0))
//                       .slice(0, 5)
//                       .map((v, i) => (
//                         <div key={v._id} style={styles.topItem}>
//                           <div style={styles.topRank}>#{i + 1}</div>
//                           <img
//                             src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                             alt={v.title}
//                             style={styles.topThumb}
//                           />
//                           <div style={styles.topInfo}>
//                             <div style={styles.topTitle}>{v.title}</div>
//                             <div style={styles.topStats}>
//                               {formatNumber(v.views || 0)} views
//                             </div>
//                           </div>
//                           <div style={styles.topValue}>
//                             {((v.views || 0) / metrics.videos.views * 100).toFixed(1)}%
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>

//                 {/* Category Distribution */}
//                 <div style={styles.analyticsCard}>
//                   <h3 style={styles.cardTitle}>
//                     <FiPieChart size={20} />
//                     Category Distribution
//                   </h3>
//                   <div style={styles.categoryList}>
//                     {categories.map((cat) => {
//                       const count = videos.filter(v => v.category === cat).length;
//                       const percentage = metrics.videos.total > 0
//                         ? (count / metrics.videos.total * 100).toFixed(1)
//                         : 0;
//                       if (count === 0) return null;
//                       return (
//                         <div key={cat} style={styles.categoryItem}>
//                           <div style={styles.categoryInfo}>
//                             <span style={styles.categoryName}>{cat}</span>
//                             <span style={styles.categoryCount}>{count} videos</span>
//                           </div>
//                           <div style={styles.categoryProgress}>
//                             <div
//                               style={{
//                                 ...styles.categoryProgressFill,
//                                 width: `${percentage}%`
//                               }}
//                             />
//                           </div>
//                           <span style={styles.categoryPercentage}>{percentage}%</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Engagement Metrics */}
//                 <div style={styles.analyticsCard}>
//                   <h3 style={styles.cardTitle}>
//                     <FiActivity size={20} />
//                     Engagement Metrics
//                   </h3>
//                   <div style={styles.engagementGrid}>
//                     <div style={styles.engagementItem}>
//                       <div style={styles.engagementIcon} className="gradient-purple">
//                         <FiThumbsUp size={24} />
//                       </div>
//                       <div style={styles.engagementValue}>{formatNumber(metrics.videos.likes)}</div>
//                       <div style={styles.engagementLabel}>Total Likes</div>
//                     </div>
//                     <div style={styles.engagementItem}>
//                       <div style={styles.engagementIcon} className="gradient-blue">
//                         <FiPercent size={24} />
//                       </div>
//                       <div style={styles.engagementValue}>{metrics.engagement.rate}%</div>
//                       <div style={styles.engagementLabel}>Engagement Rate</div>
//                     </div>
//                     <div style={styles.engagementItem}>
//                       <div style={styles.engagementIcon} className="gradient-green">
//                         <FiClock size={24} />
//                       </div>
//                       <div style={styles.engagementValue}>{metrics.engagement.avgWatchTime}</div>
//                       <div style={styles.engagementLabel}>Avg Watch Time</div>
//                     </div>
//                     <div style={styles.engagementItem}>
//                       <div style={styles.engagementIcon} className="gradient-orange">
//                         <FiTarget size={24} />
//                       </div>
//                       <div style={styles.engagementValue}>{metrics.engagement.retention}</div>
//                       <div style={styles.engagementLabel}>Retention Rate</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Revenue Breakdown */}
//                 <div style={styles.analyticsCard}>
//                   <h3 style={styles.cardTitle}>
//                     <FiDollarSign size={20} />
//                     Revenue Breakdown
//                   </h3>
//                   <div style={styles.revenueBreakdown}>
//                     <div style={styles.revenueItem}>
//                       <div style={styles.revenueLabel}>
//                         <FiTarget size={16} />
//                         <span>Ad Revenue</span>
//                       </div>
//                       <div style={styles.revenueAmount}>
//                         {formatCurrency(metrics.revenue.total * 0.7)}
//                       </div>
//                       <div style={styles.revenuePercentage}>70%</div>
//                     </div>
//                     <div style={styles.revenueItem}>
//                       <div style={styles.revenueLabel}>
//                         <FiUsers size={16} />
//                         <span>Creator Payouts</span>
//                       </div>
//                       <div style={styles.revenueAmount}>
//                         {formatCurrency(metrics.revenue.total * 0.2)}
//                       </div>
//                       <div style={styles.revenuePercentage}>20%</div>
//                     </div>
//                     <div style={styles.revenueItem}>
//                       <div style={styles.revenueLabel}>
//                         <FiPieChart size={16} />
//                         <span>Platform Fees</span>
//                       </div>
//                       <div style={styles.revenueAmount}>
//                         {formatCurrency(metrics.revenue.total * 0.1)}
//                       </div>
//                       <div style={styles.revenuePercentage}>10%</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* ==================== VIDEOS TAB ==================== */}
//           {activeTab === 'videos' && (
//             <>
//               {/* Filters */}
//               <div style={styles.filterBar}>
//                 <div style={styles.searchBox}>
//                   <FiSearch size={20} color="#888" />
//                   <input
//                     style={styles.searchInput}
//                     placeholder="Search videos..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>

//                 <select
//                   style={styles.filterSelect}
//                   value={filterCategory}
//                   onChange={(e) => setFilterCategory(e.target.value)}
//                 >
//                   <option value="All">All Categories</option>
//                   {categories.map((c) => (
//                     <option key={c}>{c}</option>
//                   ))}
//                 </select>

//                 <select
//                   style={styles.filterSelect}
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                 >
//                   <option value="recent">Most Recent</option>
//                   <option value="views">Most Viewed</option>
//                   <option value="engagement">Most Engaging</option>
//                 </select>

//                 <button
//                   style={styles.uploadButton}
//                   onClick={() => setActiveTab('upload')}
//                 >
//                   <FiUpload size={18} />
//                   <span>Upload Video</span>
//                 </button>
//               </div>

//               {/* Videos Grid */}
//               <div style={styles.videosGrid}>
//                 {filteredVideos.map((v) => (
//                   <div key={v._id} style={styles.videoCard}>
//                     <div style={styles.videoThumbContainer}>
//                       <img
//                         src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
//                         alt={v.title}
//                         style={styles.videoThumb}
//                       />
//                       <div style={styles.videoOverlay}>
//                         <button
//                           style={styles.playButton}
//                           onClick={() => window.open(`/watch/${v.filename}`, '_blank')}
//                         >
//                           <FiPlayCircle size={32} />
//                         </button>
//                       </div>
//                       <div style={styles.videoStats}>
//                         <span><FiEye size={14} /> {formatNumber(v.views || 0)}</span>
//                         <span><FiThumbsUp size={14} /> {v.likes?.length || 0}</span>
//                       </div>
//                     </div>

//                     <div style={styles.videoCardContent}>
//                       {editId === v._id ? (
//                         <div style={styles.editMode}>
//                           <input
//                             style={styles.editInput}
//                             value={editTitle}
//                             onChange={(e) => setEditTitle(e.target.value)}
//                           />
//                           <div style={styles.editActions}>
//                             <button style={styles.saveBtn} onClick={updateTitle}>
//                               <FiCheckCircle size={16} /> Save
//                             </button>
//                             <button style={styles.cancelBtn} onClick={() => setEditId(null)}>
//                               <FiX size={16} /> Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           <h3 style={styles.videoCardTitle}>{v.title}</h3>
//                           <div style={styles.videoMeta}>
//                             <span style={styles.videoBadge}>{v.category}</span>
//                             <span style={styles.videoDate}>{formatDate(v.createdAt)}</span>
//                           </div>
//                         </>
//                       )}

//                       {user && (
//                         <div style={styles.videoActions}>
//                           <button
//                             style={styles.videoActionBtn}
//                             onClick={() => { setEditId(v._id); setEditTitle(v.title); }}
//                           >
//                             <FiEdit2 size={16} />
//                           </button>
//                           <button
//                             style={{ ...styles.videoActionBtn, color: '#ef4444' }}
//                             onClick={() => deleteVideo(v._id)}
//                           >
//                             <FiTrash2 size={16} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {filteredVideos.length === 0 && (
//                 <div style={styles.emptyState}>
//                   <FiVideo size={64} color="#555" />
//                   <h3 style={styles.emptyTitle}>No videos found</h3>
//                   <p style={styles.emptyText}>
//                     {searchQuery || filterCategory !== "All"
//                       ? "Try adjusting your filters"
//                       : "Upload your first video to get started"}
//                   </p>
//                 </div>
//               )}
//             </>
//           )}

//           {/* ==================== ADS TAB ==================== */}
//           {activeTab === 'ads' && (
//             <div style={styles.comingSoon}>
//               <FiTarget size={64} color="#667eea" />
//               <h2>Ad Management</h2>
//               <p>Manage your advertisements from the dedicated Ad Management panel</p>
//               <button
//                 style={styles.primaryButton}
//                 onClick={() => navigate("/admin/upload-ad")}
//               >
//                 Go to Ad Management
//               </button>
//             </div>
//           )}

//           {/* ==================== REVENUE TAB ==================== */}
//           {activeTab === 'revenue' && (
//             <div style={styles.comingSoon}>
//               <FiDollarSign size={64} color="#10b981" />
//               <h2>Revenue Dashboard</h2>
//               <p>View detailed revenue analytics and reports</p>
//               <button
//                 style={styles.primaryButton}
//                 onClick={() => navigate("/revenue-dashboard")}
//               >
//                 Go to Revenue Dashboard
//               </button>
//             </div>
//           )}

//           {/* ==================== CREATORS TAB ==================== */}
//           {activeTab === 'creators' && (
//             <div style={styles.comingSoon}>
//               <FiUsers size={64} color="#f59e0b" />
//               <h2>Creator Management</h2>
//               <p>Manage creator applications and monetization</p>
//               <button
//                 style={styles.primaryButton}
//                 onClick={() => navigate("/AdminMonetizationPanel")}
//               >
//                 Go to Creator Management
//               </button>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Styles */}
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

//         * {
//           font-family: 'Outfit', sans-serif;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes slideIn {
//           from { transform: translateX(-20px); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .spinner {
//           width: 56px;
//           height: 56px;
//           border: 4px solid rgba(102, 126, 234, 0.1);
//           border-top-color: #667eea;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }

//         .spinning {
//           animation: spin 0.8s linear infinite;
//         }

//         .gradient-purple {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         }

//         .gradient-green {
//           background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//         }

//         .gradient-blue {
//           background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//         }

//         .gradient-orange {
//           background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//         }

//         .alert-warning {
//           background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//         }

//         .alert-info {
//           background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//         }

//         .alert-success {
//           background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//         }
//       `}</style>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: 'flex',
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
//     color: '#fff',
//   },

//   // Loading Screen
//   loadingScreen: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
//   },
//   loadingSpinner: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '24px',
//   },
//   loadingText: {
//     fontSize: '16px',
//     color: 'rgba(255, 255, 255, 0.6)',
//     fontWeight: '500',
//   },

//   // Sidebar
//   sidebar: {
//     position: 'fixed',
//     left: 0,
//     top: 0,
//     height: '100vh',
//     background: 'rgba(10, 10, 15, 0.98)',
//     backdropFilter: 'blur(20px)',
//     borderRight: '1px solid rgba(102, 126, 234, 0.2)',
//     display: 'flex',
//     flexDirection: 'column',
//     transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     zIndex: 1000,
//     boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
//   },
//   sidebarHeader: {
//     padding: '28px 24px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
//     minHeight: '88px',
//   },
//   logo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//   },
//   logoIcon: {
//     width: '48px',
//     height: '48px',
//     borderRadius: '14px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: '#fff',
//     boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
//   },
//   logoText: {
//     fontSize: '24px',
//     fontWeight: '800',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     letterSpacing: '-0.5px',
//   },
//   logoSubtext: {
//     fontSize: '12px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '600',
//     letterSpacing: '1px',
//     textTransform: 'uppercase',
//   },
//   toggleBtn: {
//     background: 'rgba(102, 126, 234, 0.1)',
//     border: '1px solid rgba(102, 126, 234, 0.2)',
//     borderRadius: '10px',
//     padding: '10px',
//     color: '#667eea',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   nav: {
//     flex: 1,
//     padding: '24px 12px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     overflowY: 'auto',
//   },
//   navSection: {
//     marginBottom: '16px',
//   },
//   navSectionTitle: {
//     fontSize: '11px',
//     fontWeight: '700',
//     color: 'rgba(255, 255, 255, 0.4)',
//     textTransform: 'uppercase',
//     letterSpacing: '1.5px',
//     padding: '8px 16px',
//     marginBottom: '8px',
//   },
//   navItem: {
//     position: 'relative',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '14px',
//     padding: '14px 18px',
//     background: 'transparent',
//     border: 'none',
//     borderRadius: '12px',
//     color: 'rgba(255, 255, 255, 0.7)',
//     cursor: 'pointer',
//     fontSize: '15px',
//     fontWeight: '600',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     textAlign: 'left',
//     overflow: 'hidden',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     right: '8px',
//     width: '6px',
//     height: '6px',
//     borderRadius: '50%',
//     background: '#fff',
//     boxShadow: '0 0 12px rgba(255, 255, 255, 0.8)',
//   },
//   divider: {
//     height: '1px',
//     background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
//     margin: '16px 24px',
//   },
//   sidebarFooter: {
//     padding: '20px',
//     borderTop: '1px solid rgba(102, 126, 234, 0.1)',
//   },
//   userCard: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '12px',
//     background: 'rgba(102, 126, 234, 0.05)',
//     borderRadius: '12px',
//     border: '1px solid rgba(102, 126, 234, 0.1)',
//   },
//   userAvatar: {
//     width: '44px',
//     height: '44px',
//     borderRadius: '12px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '18px',
//     fontWeight: '700',
//     color: '#fff',
//     flexShrink: 0,
//   },
//   userInfo: {
//     flex: 1,
//     minWidth: 0,
//   },
//   userName: {
//     fontSize: '14px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '2px',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     whiteSpace: 'nowrap',
//   },
//   userRole: {
//     fontSize: '12px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '500',
//   },
//   userStatus: {
//     width: '10px',
//     height: '10px',
//     borderRadius: '50%',
//     background: '#10b981',
//     boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
//     flexShrink: 0,
//   },

//   // Main Content
//   main: {
//     flex: 1,
//     transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     minHeight: '100vh',
//   },
//   topBar: {
//     position: 'sticky',
//     top: 0,
//     zIndex: 100,
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '20px 40px',
//     background: 'rgba(10, 10, 15, 0.95)',
//     backdropFilter: 'blur(20px)',
//     borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
//     boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
//   },
//   topBarLeft: {
//     flex: 1,
//   },
//   pageTitle: {
//     fontSize: '28px',
//     fontWeight: '800',
//     margin: 0,
//     marginBottom: '6px',
//     background: 'linear-gradient(135deg, #fff 0%, #667eea 100%)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     letterSpacing: '-0.5px',
//   },
//   breadcrumb: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '500',
//   },
//   breadcrumbSeparator: {
//     color: 'rgba(255, 255, 255, 0.3)',
//   },
//   breadcrumbActive: {
//     color: '#667eea',
//     fontWeight: '600',
//   },
//   topBarRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//   },
//   refreshButton: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '12px 20px',
//     background: 'rgba(102, 126, 234, 0.1)',
//     border: '1px solid rgba(102, 126, 234, 0.3)',
//     borderRadius: '10px',
//     color: '#667eea',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   exportButton: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '12px 20px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '10px',
//     color: '#fff',
//     fontSize: '14px',
//     fontWeight: '700',
//     cursor: 'pointer',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
//   },
//   notificationBadge: {
//     position: 'relative',
//     padding: '10px',
//     background: 'rgba(239, 68, 68, 0.1)',
//     borderRadius: '10px',
//     color: '#ef4444',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badge: {
//     position: 'absolute',
//     top: '-4px',
//     right: '-4px',
//     background: '#ef4444',
//     color: '#fff',
//     fontSize: '10px',
//     fontWeight: '700',
//     padding: '2px 6px',
//     borderRadius: '10px',
//     boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
//   },
//   content: {
//     padding: '40px',
//     animation: 'fadeIn 0.5s ease',
//   },

//   // Metrics Grid
//   metricsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//     gap: '24px',
//     marginBottom: '32px',
//   },
//   metricCard: {
//     background: 'rgba(255, 255, 255, 0.03)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     padding: '28px',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     animation: 'slideIn 0.5s ease',
//   },
//   metricHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '20px',
//   },
//   metricIcon: {
//     width: '56px',
//     height: '56px',
//     borderRadius: '16px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: '#fff',
//     boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
//   },
//   metricGrowth: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     fontSize: '13px',
//     fontWeight: '700',
//   },
//   metricValue: {
//     fontSize: '36px',
//     fontWeight: '800',
//     color: '#fff',
//     marginBottom: '8px',
//     letterSpacing: '-1px',
//   },
//   metricLabel: {
//     fontSize: '14px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '600',
//     marginBottom: '12px',
//     textTransform: 'uppercase',
//     letterSpacing: '0.5px',
//   },
//   metricFooter: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.4)',
//     fontWeight: '500',
//   },

//   // Performance Section
//   performanceSection: {
//     display: 'grid',
//     gridTemplateColumns: '2fr 1fr',
//     gap: '24px',
//     marginBottom: '32px',
//   },
//   performanceCard: {
//     background: 'rgba(255, 255, 255, 0.03)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     padding: '32px',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//   },
//   sectionTitle: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     fontSize: '20px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '28px',
//   },
//   performanceGrid: {
//     display: 'grid',
//     gap: '24px',
//   },
//   performanceItem: {
//     background: 'rgba(255, 255, 255, 0.02)',
//     padding: '20px',
//     borderRadius: '14px',
//     border: '1px solid rgba(102, 126, 234, 0.1)',
//   },
//   performanceLabel: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     fontSize: '14px',
//     color: 'rgba(255, 255, 255, 0.6)',
//     fontWeight: '600',
//     marginBottom: '12px',
//   },
//   performanceValue: {
//     fontSize: '28px',
//     fontWeight: '800',
//     color: '#fff',
//     marginBottom: '12px',
//   },
//   performanceBar: {
//     height: '8px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: '4px',
//     overflow: 'hidden',
//   },
//   performanceBarFill: {
//     height: '100%',
//     borderRadius: '4px',
//     transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
//     boxShadow: '0 0 12px rgba(102, 126, 234, 0.5)',
//   },

//   // Alerts Card
//   alertsCard: {
//     background: 'rgba(255, 255, 255, 0.03)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     padding: '32px',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//   },
//   alertsList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   alertItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//     padding: '16px',
//     background: 'rgba(255, 255, 255, 0.02)',
//     borderRadius: '12px',
//     border: '1px solid rgba(102, 126, 234, 0.1)',
//   },
//   alertIcon: {
//     width: '44px',
//     height: '44px',
//     borderRadius: '12px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: '#fff',
//     flexShrink: 0,
//   },
//   alertContent: {
//     flex: 1,
//   },
//   alertTitle: {
//     fontSize: '14px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '4px',
//   },
//   alertText: {
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '500',
//   },
//   alertButton: {
//     padding: '8px 16px',
//     background: 'rgba(102, 126, 234, 0.2)',
//     border: '1px solid rgba(102, 126, 234, 0.3)',
//     borderRadius: '8px',
//     color: '#667eea',
//     fontSize: '13px',
//     fontWeight: '700',
//     cursor: 'pointer',
//   },

//   // Activity Section
//   activitySection: {
//     background: 'rgba(255, 255, 255, 0.03)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     padding: '32px',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//   },
//   activityGrid: {
//     display: 'grid',
//     gap: '16px',
//   },
//   activityCard: {
//     display: 'flex',
//     gap: '16px',
//     padding: '16px',
//     background: 'rgba(255, 255, 255, 0.02)',
//     borderRadius: '14px',
//     border: '1px solid rgba(102, 126, 234, 0.1)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   activityThumb: {
//     width: '120px',
//     height: '68px',
//     borderRadius: '10px',
//     objectFit: 'cover',
//   },
//   activityInfo: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     gap: '8px',
//   },
//   activityTitle: {
//     fontSize: '15px',
//     fontWeight: '700',
//     color: '#fff',
//   },
//   activityMeta: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     fontSize: '13px',
//   },
//   activityBadge: {
//     padding: '4px 10px',
//     background: 'rgba(102, 126, 234, 0.2)',
//     borderRadius: '6px',
//     color: '#667eea',
//     fontSize: '11px',
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },
//   activityStats: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '600',
//   },

//   // Analytics
//   analyticsHeader: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     marginBottom: '24px',
//   },
//   dateRangeSelector: {
//     display: 'flex',
//     gap: '8px',
//     background: 'rgba(255, 255, 255, 0.03)',
//     padding: '6px',
//     borderRadius: '12px',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//   },
//   dateRangeButton: {
//     padding: '10px 20px',
//     background: 'transparent',
//     border: 'none',
//     borderRadius: '8px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   dateRangeButtonActive: {
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     color: '#fff',
//   },
//   analyticsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
//     gap: '24px',
//   },
//   analyticsCard: {
//     background: 'rgba(255, 255, 255, 0.03)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     padding: '32px',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//   },
//   cardTitle: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     fontSize: '18px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '24px',
//   },
//   topList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '12px',
//   },
//   topItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '12px',
//     background: 'rgba(255, 255, 255, 0.02)',
//     borderRadius: '12px',
//     border: '1px solid rgba(102, 126, 234, 0.1)',
//   },
//   topRank: {
//     width: '36px',
//     height: '36px',
//     borderRadius: '10px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '14px',
//     fontWeight: '800',
//     color: '#fff',
//     flexShrink: 0,
//   },
//   topThumb: {
//     width: '80px',
//     height: '45px',
//     borderRadius: '8px',
//     objectFit: 'cover',
//   },
//   topInfo: {
//     flex: 1,
//     minWidth: 0,
//   },
//   topTitle: {
//     fontSize: '14px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '4px',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     whiteSpace: 'nowrap',
//   },
//   topStats: {
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '600',
//   },
//   topValue: {
//     fontSize: '15px',
//     fontWeight: '800',
//     color: '#10b981',
//   },
//   categoryList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   categoryItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//   },
//   categoryInfo: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '4px',
//     minWidth: '120px',
//   },
//   categoryName: {
//     fontSize: '14px',
//     fontWeight: '700',
//     color: '#fff',
//   },
//   categoryCount: {
//     fontSize: '12px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '500',
//   },
//   categoryProgress: {
//     flex: 1,
//     height: '8px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: '4px',
//     overflow: 'hidden',
//   },
//   categoryProgressFill: {
//     height: '100%',
//     background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//     borderRadius: '4px',
//     transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   categoryPercentage: {
//     fontSize: '13px',
//     fontWeight: '800',
//     color: '#667eea',
//     minWidth: '48px',
//     textAlign: 'right',
//   },
//   engagementGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//     gap: '20px',
//   },
//   engagementItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '24px',
//     background: 'rgba(255, 255, 255, 0.02)',
//     borderRadius: '14px',
//     border: '1px solid rgba(102, 126, 234, 0.1)',
//     textAlign: 'center',
//   },
//   engagementIcon: {
//     width: '56px',
//     height: '56px',
//     borderRadius: '14px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: '#fff',
//     marginBottom: '16px',
//   },
//   engagementValue: {
//     fontSize: '28px',
//     fontWeight: '800',
//     color: '#fff',
//     marginBottom: '8px',
//   },
//   engagementLabel: {
//     fontSize: '12px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: '0.5px',
//   },
//   revenueBreakdown: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   revenueItem: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '16px',
//     background: 'rgba(255, 255, 255, 0.02)',
//     borderRadius: '12px',
//     border: '1px solid rgba(102, 126, 234, 0.1)',
//   },
//   revenueLabel: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     fontSize: '14px',
//     color: 'rgba(255, 255, 255, 0.7)',
//     fontWeight: '600',
//   },
//   revenueAmount: {
//     fontSize: '18px',
//     fontWeight: '800',
//     color: '#10b981',
//   },
//   revenuePercentage: {
//     fontSize: '13px',
//     fontWeight: '700',
//     color: 'rgba(255, 255, 255, 0.5)',
//   },

//   // Filter Bar
//   filterBar: {
//     display: 'flex',
//     gap: '16px',
//     marginBottom: '32px',
//     flexWrap: 'wrap',
//   },
//   searchBox: {
//     flex: 1,
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '14px 20px',
//     background: 'rgba(255, 255, 255, 0.03)',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//     borderRadius: '12px',
//     minWidth: '280px',
//   },
//   searchInput: {
//     flex: 1,
//     background: 'transparent',
//     border: 'none',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: '500',
//     outline: 'none',
//   },
//   filterSelect: {
//     padding: '14px 20px',
//     background: 'rgba(255, 255, 255, 0.03)',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     outline: 'none',
//   },
//   uploadButton: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     padding: '14px 24px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: '700',
//     cursor: 'pointer',
//     boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
//   },

//   // Videos Grid
//   videosGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
//     gap: '24px',
//   },
//   videoCard: {
//     background: 'rgba(255, 255, 255, 0.03)',
//     borderRadius: '16px',
//     overflow: 'hidden',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   videoThumbContainer: {
//     position: 'relative',
//     aspectRatio: '16/9',
//     overflow: 'hidden',
//   },
//   videoThumb: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
//   videoOverlay: {
//     position: 'absolute',
//     inset: 0,
//     background: 'rgba(0, 0, 0, 0.6)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     opacity: 0,
//     transition: 'opacity 0.3s',
//   },
//   playButton: {
//     background: 'rgba(102, 126, 234, 0.9)',
//     border: 'none',
//     borderRadius: '50%',
//     padding: '16px',
//     color: '#fff',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   videoStats: {
//     position: 'absolute',
//     bottom: '12px',
//     left: '12px',
//     right: '12px',
//     display: 'flex',
//     gap: '12px',
//     fontSize: '13px',
//     fontWeight: '700',
//     color: '#fff',
//   },
//   videoCardContent: {
//     padding: '20px',
//   },
//   videoCardTitle: {
//     fontSize: '16px',
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: '12px',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     display: '-webkit-box',
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: 'vertical',
//   },
//   videoMeta: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '16px',
//   },
//   videoBadge: {
//     padding: '6px 12px',
//     background: 'rgba(102, 126, 234, 0.2)',
//     borderRadius: '8px',
//     color: '#667eea',
//     fontSize: '12px',
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },
//   videoDate: {
//     fontSize: '13px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '600',
//   },
//   videoActions: {
//     display: 'flex',
//     gap: '8px',
//   },
//   videoActionBtn: {
//     flex: 1,
//     padding: '10px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(102, 126, 234, 0.2)',
//     borderRadius: '8px',
//     color: '#667eea',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   editMode: {
//     marginBottom: '12px',
//   },
//   editInput: {
//     width: '100%',
//     padding: '12px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     border: '1px solid rgba(102, 126, 234, 0.2)',
//     borderRadius: '8px',
//     color: '#fff',
//     fontSize: '15px',
//     fontWeight: '600',
//     marginBottom: '8px',
//     outline: 'none',
//   },
//   editActions: {
//     display: 'flex',
//     gap: '8px',
//   },
//   saveBtn: {
//     flex: 1,
//     padding: '10px',
//     background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//     border: 'none',
//     borderRadius: '8px',
//     color: '#fff',
//     fontSize: '13px',
//     fontWeight: '700',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '6px',
//   },
//   cancelBtn: {
//     flex: 1,
//     padding: '10px',
//     background: 'rgba(239, 68, 68, 0.2)',
//     border: '1px solid rgba(239, 68, 68, 0.3)',
//     borderRadius: '8px',
//     color: '#ef4444',
//     fontSize: '13px',
//     fontWeight: '700',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '6px',
//   },

//   // Empty State
//   emptyState: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '80px 20px',
//     textAlign: 'center',
//   },
//   emptyTitle: {
//     fontSize: '24px',
//     fontWeight: '700',
//     color: '#fff',
//     marginTop: '24px',
//     marginBottom: '8px',
//   },
//   emptyText: {
//     fontSize: '16px',
//     color: 'rgba(255, 255, 255, 0.5)',
//     fontWeight: '500',
//   },

//   // Coming Soon
//   comingSoon: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '80px 20px',
//     textAlign: 'center',
//     background: 'rgba(255, 255, 255, 0.03)',
//     borderRadius: '20px',
//     border: '1px solid rgba(102, 126, 234, 0.15)',
//   },
//   primaryButton: {
//     marginTop: '24px',
//     padding: '16px 32px',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '16px',
//     fontWeight: '700',
//     cursor: 'pointer',
//     boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
//   },
// };
import React, { useState, useContext, useEffect, useMemo } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiUpload, FiVideo, FiSettings, FiLogOut, FiEdit2, FiTrash2,
  FiPlayCircle, FiEye, FiThumbsUp, FiTrendingUp,
  FiHome, FiMenu, FiX, FiSearch, FiDownload,
  FiDollarSign, FiMousePointer, FiBarChart2, FiActivity,
  FiUsers, FiCheckCircle, FiClock, FiRefreshCw,
  FiPieChart, FiTarget, FiAlertCircle, FiZap, FiPercent
} from "react-icons/fi";
import { MdDashboard, MdVideoLibrary, MdAnalytics } from "react-icons/md";

export default function AdvancedAdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ==================== STATE MANAGEMENT ====================

  // UI States
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Data States
  const [videos, setVideos] = useState([]);
  const [ads, setAds] = useState([]);
  const [creators, setCreators] = useState([]);
  const [revenueData, setRevenueData] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateRange, setDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Upload States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Edit States
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const categories = [
    "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
    "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
    "Fashion", "Fitness", "Other"
  ];

  // ==================== DATA FETCHING (FIXED FOR VERCEL) ====================

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        fetchVideos(),
        fetchAds(),
        fetchCreators(),
        fetchRevenueData()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await api.get("/api/videos/all");
      console.log("Videos Response:", res.data);

      let videoData = [];

      // Handle different response formats
      if (res.data) {
        if (Array.isArray(res.data)) {
          videoData = res.data;
        } else if (Array.isArray(res.data.videos)) {
          videoData = res.data.videos;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          videoData = res.data.data;
        }
      }

      // Ensure each video has required properties
      videoData = videoData.map(v => ({
        ...v,
        views: v.views || 0,
        likes: Array.isArray(v.likes) ? v.likes : [],
        category: v.category || "Other",
        createdAt: v.createdAt || new Date().toISOString()
      }));

      setVideos(videoData);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setVideos([]);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await api.get("/api/ads");
      console.log("Ads Response:", res.data);

      let adsData = [];

      if (res.data) {
        if (Array.isArray(res.data)) {
          adsData = res.data;
        } else if (Array.isArray(res.data.ads)) {
          adsData = res.data.ads;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          adsData = res.data.data;
        }
      }

      // Ensure each ad has required properties
      adsData = adsData.map(a => ({
        ...a,
        views: a.views || 0,
        clicks: a.clicks || 0,
        active: a.active !== undefined ? a.active : true
      }));

      setAds(adsData);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      setAds([]);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await api.get("/api/monetization/admin/creators");
      console.log("Creators Response:", res.data);

      let creatorsData = [];

      if (res.data) {
        if (Array.isArray(res.data)) {
          creatorsData = res.data;
        } else if (Array.isArray(res.data.creators)) {
          creatorsData = res.data.creators;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          creatorsData = res.data.data;
        }
      }

      // Ensure each creator has required properties
      creatorsData = creatorsData.map(c => ({
        ...c,
        monetizationStatus: c.monetizationStatus || "pending",
        earnings: c.earnings || { pendingBalance: 0 }
      }));

      setCreators(creatorsData);
    } catch (err) {
      console.error("Failed to fetch creators:", err);
      setCreators([]);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const res = await api.get("/api/ads/dashboard/revenue");
      console.log("Revenue Response:", res.data);

      if (res.data && res.data.overview) {
        setRevenueData(res.data);
      } else {
        setRevenueData({
          overview: {
            totalRevenue: 0
          }
        });
      }
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
      setRevenueData({
        overview: {
          totalRevenue: 0
        }
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  // ==================== ANALYTICS CALCULATIONS (SAFE) ====================

  const calculateMetrics = () => {
    try {
      // Safe array extraction with defaults
      const videoList = Array.isArray(videos) ? videos : [];
      const adList = Array.isArray(ads) ? ads : [];
      const creatorList = Array.isArray(creators) ? creators : [];

      // Video metrics
      const totalVideos = videoList.length;
      const totalViews = videoList.reduce((sum, v) => {
        const views = typeof v?.views === 'number' ? v.views : 0;
        return sum + views;
      }, 0);
      const totalLikes = videoList.reduce((sum, v) => {
        const likes = Array.isArray(v?.likes) ? v.likes.length : 0;
        return sum + likes;
      }, 0);
      const avgViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;

      // Ad metrics
      const totalAds = adList.length;
      const activeAds = adList.filter(a => a?.active === true).length;
      const totalAdViews = adList.reduce((sum, a) => {
        const views = typeof a?.views === 'number' ? a.views : 0;
        return sum + views;
      }, 0);
      const totalAdClicks = adList.reduce((sum, a) => {
        const clicks = typeof a?.clicks === 'number' ? a.clicks : 0;
        return sum + clicks;
      }, 0);
      const avgCTR = totalAdViews > 0 ? ((totalAdClicks / totalAdViews) * 100).toFixed(2) : 0;

      // Revenue metrics
      const totalRevenue = revenueData?.overview?.totalRevenue || 0;
      const pendingPayouts = creatorList.reduce((sum, c) => {
        const pending = typeof c?.earnings?.pendingBalance === 'number' ? c.earnings.pendingBalance : 0;
        return sum + pending;
      }, 0);

      // Creator metrics
      const approvedCreators = creatorList.filter(c => c?.monetizationStatus === "approved").length;
      const pendingCreators = creatorList.filter(c => c?.monetizationStatus === "pending").length;

      // Growth calculations (mock)
      const viewsGrowth = 12.5;
      const revenueGrowth = 8.3;
      const creatorsGrowth = 15.7;

      return {
        videos: {
          total: totalVideos,
          views: totalViews,
          likes: totalLikes,
          avgViews,
          growth: viewsGrowth
        },
        ads: {
          total: totalAds,
          active: activeAds,
          views: totalAdViews,
          clicks: totalAdClicks,
          ctr: avgCTR
        },
        revenue: {
          total: totalRevenue,
          pending: pendingPayouts,
          growth: revenueGrowth
        },
        creators: {
          total: creatorList.length,
          approved: approvedCreators,
          pending: pendingCreators,
          growth: creatorsGrowth
        },
        engagement: {
          rate: totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : 0,
          avgWatchTime: "8:32",
          retention: "68%"
        }
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      // Return safe default values
      return {
        videos: { total: 0, views: 0, likes: 0, avgViews: 0, growth: 0 },
        ads: { total: 0, active: 0, views: 0, clicks: 0, ctr: 0 },
        revenue: { total: 0, pending: 0, growth: 0 },
        creators: { total: 0, approved: 0, pending: 0, growth: 0 },
        engagement: { rate: 0, avgWatchTime: "0:00", retention: "0%" }
      };
    }
  };

  const metrics = useMemo(() => calculateMetrics(), [videos, ads, creators, revenueData]);

  // ==================== VIDEO MANAGEMENT ====================

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("⚠️ Please login first to upload videos");
      navigate("/login");
      return;
    }

    if (!title || !category || !video || !thumbnail) {
      alert("Please fill all required fields");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("description", description);
    fd.append("tags", tags);
    fd.append("video", video);
    fd.append("thumbnail", thumbnail);

    try {
      setUploading(true);
      setProgress(0);

      await api.post("/api/ads/upload", fd, {
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      alert("✅ Video uploaded successfully!");
      resetForm();
      fetchVideos();
      setActiveTab("videos");
    } catch (err) {
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setTags("");
    setVideo(null);
    setThumbnail(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    if (document.getElementById("video-input")) {
      document.getElementById("video-input").value = "";
    }
    if (document.getElementById("thumb-input")) {
      document.getElementById("thumb-input").value = "";
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const deleteVideo = async (id) => {
    if (!user) {
      alert("⚠️ Please login first");
      return;
    }

    if (!window.confirm("🗑️ Delete this video permanently?")) return;

    try {
      await api.delete(`/api/videos/delete/${id}`);
      fetchVideos();
      alert("✅ Video deleted successfully");
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  const updateTitle = async () => {
    if (!user) {
      alert("⚠️ Please login first");
      return;
    }

    if (!editTitle.trim()) return;

    try {
      await api.put(
        `/api/videos/update/${editId}`,
        { title: editTitle }
      );
      setEditId(null);
      fetchVideos();
      alert("✅ Title updated");
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  // ==================== FILTERING & SORTING (SAFE) ====================

  const filteredVideos = useMemo(() => {
    try {
      const videoList = Array.isArray(videos) ? videos : [];

      return videoList
        .filter(v => {
          if (!v || typeof v !== 'object') return false;

          const title = v.title || "";
          const category = v.category || "";

          const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = filterCategory === "All" || category === filterCategory;
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          try {
            switch (sortBy) {
              case "views":
                return (b.views || 0) - (a.views || 0);
              case "revenue":
                return 0;
              case "engagement":
                const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
                const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
                return bLikes - aLikes;
              default:
                const aDate = new Date(a.createdAt || 0);
                const bDate = new Date(b.createdAt || 0);
                return bDate - aDate;
            }
          } catch (error) {
            return 0;
          }
        });
    } catch (error) {
      console.error("Error filtering videos:", error);
      return [];
    }
  }, [videos, searchQuery, filterCategory, sortBy]);

  // ==================== HELPERS ====================

  const formatNumber = (num) => {
    const n = typeof num === 'number' ? num : 0;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n;
  };

  const formatCurrency = (amount) => {
    const amt = typeof amount === 'number' ? amount : 0;
    return "₹" + amt.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (date) => {
    try {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getGrowthColor = (growth) => {
    const g = typeof growth === 'number' ? growth : 0;
    return g >= 0 ? "#10b981" : "#ef4444";
  };

  // ==================== RENDER ====================

  if (loading && videos.length === 0) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingSpinner}>
          <div className="spinner"></div>
          <p style={styles.loadingText}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarOpen ? '280px' : '80px',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(0)'
      }}>
        <div style={styles.sidebarHeader}>
          {sidebarOpen && (
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <FiZap size={28} />
              </div>
              <div>
                <div style={styles.logoText}>AdminHub</div>
                <div style={styles.logoSubtext}>Pro Analytics</div>
              </div>
            </div>
          )}
          <button
            style={styles.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navSection}>
            {sidebarOpen && <div style={styles.navSectionTitle}>Main</div>}

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'overview' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'overview' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('overview')}
            >
              <MdDashboard size={22} />
              {sidebarOpen && <span>Overview</span>}
              {activeTab === 'overview' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'analytics' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'analytics' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('analytics')}
            >
              <MdAnalytics size={22} />
              {sidebarOpen && <span>Analytics</span>}
              {activeTab === 'analytics' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'videos' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'videos' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('videos')}
            >
              <MdVideoLibrary size={22} />
              {sidebarOpen && <span>Videos</span>}
              {activeTab === 'videos' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'ads' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'ads' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('ads')}
            >
              <FiTarget size={22} />
              {sidebarOpen && <span>Advertisements</span>}
              {activeTab === 'ads' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'revenue' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'revenue' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('revenue')}
            >
              <FiDollarSign size={22} />
              {sidebarOpen && <span>Revenue</span>}
              {activeTab === 'revenue' && <div style={styles.activeIndicator}></div>}
            </button>

            <button
              style={{
                ...styles.navItem,
                background: activeTab === 'creators' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'creators' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={() => setActiveTab('creators')}
            >
              <FiUsers size={22} />
              {sidebarOpen && <span>Creators</span>}
              {activeTab === 'creators' && <div style={styles.activeIndicator}></div>}
            </button>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.navSection}>
            {sidebarOpen && <div style={styles.navSectionTitle}>System</div>}

            <button style={styles.navItem} onClick={() => navigate("/")}>
              <FiHome size={22} />
              {sidebarOpen && <span>Home</span>}
            </button>

            {user ? (
              <>
                <button style={styles.navItem} onClick={() => navigate("/profile")}>
                  <FiSettings size={22} />
                  {sidebarOpen && <span>Settings</span>}
                </button>
                <button style={styles.navItem} onClick={logout}>
                  <FiLogOut size={22} />
                  {sidebarOpen && <span>Logout</span>}
                </button>
              </>
            ) : (
              <button style={styles.navItem} onClick={() => navigate("/login")}>
                <FiLogOut size={22} />
                {sidebarOpen && <span>Login</span>}
              </button>
            )}
          </div>
        </nav>

        {sidebarOpen && user && (
          <div style={styles.sidebarFooter}>
            <div style={styles.userCard}>
              <div style={styles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user?.name}</div>
                <div style={styles.userRole}>Administrator</div>
              </div>
              <div style={styles.userStatus}></div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        marginLeft: sidebarOpen ? '280px' : '80px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <h1 style={styles.pageTitle}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'analytics' && 'Advanced Analytics'}
              {activeTab === 'videos' && 'Video Management'}
              {activeTab === 'ads' && 'Ad Management'}
              {activeTab === 'revenue' && 'Revenue Dashboard'}
              {activeTab === 'creators' && 'Creator Management'}
            </h1>
            <div style={styles.breadcrumb}>
              <span>Admin</span>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span style={styles.breadcrumbActive}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </div>
          </div>

          <div style={styles.topBarRight}>
            <button
              style={styles.refreshButton}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw size={18} className={refreshing ? 'spinning' : ''} />
              {!refreshing && <span>Refresh</span>}
            </button>

            <button style={styles.exportButton}>
              <FiDownload size={18} />
              <span>Export</span>
            </button>

            <div style={styles.notificationBadge}>
              <FiAlertCircle size={20} />
              {metrics.creators.pending > 0 && (
                <span style={styles.badge}>{metrics.creators.pending}</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.content}>
          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === 'overview' && (
            <>
              {/* Key Metrics Grid */}
              <div style={styles.metricsGrid}>
                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-purple">
                      <FiVideo size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <FiTrendingUp size={16} color={getGrowthColor(metrics.videos.growth)} />
                      <span style={{ color: getGrowthColor(metrics.videos.growth) }}>
                        {metrics.videos.growth}%
                      </span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{formatNumber(metrics.videos.total)}</div>
                  <div style={styles.metricLabel}>Total Videos</div>
                  <div style={styles.metricFooter}>
                    <span>{formatNumber(metrics.videos.views)} views</span>
                    <span>•</span>
                    <span>{formatNumber(metrics.videos.likes)} likes</span>
                  </div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-green">
                      <FiDollarSign size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <FiTrendingUp size={16} color={getGrowthColor(metrics.revenue.growth)} />
                      <span style={{ color: getGrowthColor(metrics.revenue.growth) }}>
                        {metrics.revenue.growth}%
                      </span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{formatCurrency(metrics.revenue.total)}</div>
                  <div style={styles.metricLabel}>Total Revenue</div>
                  <div style={styles.metricFooter}>
                    <span>{formatCurrency(metrics.revenue.pending)} pending</span>
                  </div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-blue">
                      <FiTarget size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <span style={{ color: '#667eea' }}>{metrics.ads.ctr}%</span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{metrics.ads.active}/{metrics.ads.total}</div>
                  <div style={styles.metricLabel}>Active Ads</div>
                  <div style={styles.metricFooter}>
                    <span>{formatNumber(metrics.ads.views)} views</span>
                    <span>•</span>
                    <span>{formatNumber(metrics.ads.clicks)} clicks</span>
                  </div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <div style={styles.metricIcon} className="gradient-orange">
                      <FiUsers size={24} />
                    </div>
                    <div style={styles.metricGrowth}>
                      <FiTrendingUp size={16} color={getGrowthColor(metrics.creators.growth)} />
                      <span style={{ color: getGrowthColor(metrics.creators.growth) }}>
                        {metrics.creators.growth}%
                      </span>
                    </div>
                  </div>
                  <div style={styles.metricValue}>{metrics.creators.total}</div>
                  <div style={styles.metricLabel}>Total Creators</div>
                  <div style={styles.metricFooter}>
                    <span>{metrics.creators.approved} approved</span>
                    <span>•</span>
                    <span>{metrics.creators.pending} pending</span>
                  </div>
                </div>
              </div>

              {/* Performance Overview */}
              <div style={styles.performanceSection}>
                <div style={styles.performanceCard}>
                  <h3 style={styles.sectionTitle}>
                    <FiBarChart2 size={20} />
                    Performance Metrics
                  </h3>
                  <div style={styles.performanceGrid}>
                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiEye size={18} />
                        <span>Avg Views/Video</span>
                      </div>
                      <div style={styles.performanceValue}>{formatNumber(metrics.videos.avgViews)}</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: '75%', background: '#667eea' }}></div>
                      </div>
                    </div>

                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiMousePointer size={18} />
                        <span>Ad CTR</span>
                      </div>
                      <div style={styles.performanceValue}>{metrics.ads.ctr}%</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: `${Math.min(metrics.ads.ctr * 10, 100)}%`, background: '#10b981' }}></div>
                      </div>
                    </div>

                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiThumbsUp size={18} />
                        <span>Engagement Rate</span>
                      </div>
                      <div style={styles.performanceValue}>{metrics.engagement.rate}%</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: `${Math.min(metrics.engagement.rate * 2, 100)}%`, background: '#f59e0b' }}></div>
                      </div>
                    </div>

                    <div style={styles.performanceItem}>
                      <div style={styles.performanceLabel}>
                        <FiActivity size={18} />
                        <span>Avg Watch Time</span>
                      </div>
                      <div style={styles.performanceValue}>{metrics.engagement.avgWatchTime}</div>
                      <div style={styles.performanceBar}>
                        <div style={{ ...styles.performanceBarFill, width: '68%', background: '#8b5cf6' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.alertsCard}>
                  <h3 style={styles.sectionTitle}>
                    <FiAlertCircle size={20} />
                    System Alerts
                  </h3>
                  <div style={styles.alertsList}>
                    {metrics.creators.pending > 0 && (
                      <div style={styles.alertItem}>
                        <div style={styles.alertIcon} className="alert-warning">
                          <FiClock size={18} />
                        </div>
                        <div style={styles.alertContent}>
                          <div style={styles.alertTitle}>Pending Creator Applications</div>
                          <div style={styles.alertText}>
                            {metrics.creators.pending} creators waiting for approval
                          </div>
                        </div>
                        <button
                          style={styles.alertButton}
                          onClick={() => setActiveTab('creators')}
                        >
                          Review
                        </button>
                      </div>
                    )}

                    {metrics.revenue.pending > 1000 && (
                      <div style={styles.alertItem}>
                        <div style={styles.alertIcon} className="alert-info">
                          <FiDollarSign size={18} />
                        </div>
                        <div style={styles.alertContent}>
                          <div style={styles.alertTitle}>Pending Payouts</div>
                          <div style={styles.alertText}>
                            {formatCurrency(metrics.revenue.pending)} awaiting payout
                          </div>
                        </div>
                        <button
                          style={styles.alertButton}
                          onClick={() => setActiveTab('revenue')}
                        >
                          Process
                        </button>
                      </div>
                    )}

                    <div style={styles.alertItem}>
                      <div style={styles.alertIcon} className="alert-success">
                        <FiCheckCircle size={18} />
                      </div>
                      <div style={styles.alertContent}>
                        <div style={styles.alertTitle}>All Systems Operational</div>
                        <div style={styles.alertText}>
                          Platform running smoothly
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={styles.activitySection}>
                <h3 style={styles.sectionTitle}>
                  <FiActivity size={20} />
                  Recent Activity
                </h3>
                <div style={styles.activityGrid}>
                  {Array.isArray(videos) && videos.slice(0, 5).map((v) => (
                    <div key={v._id} style={styles.activityCard}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                        alt={v.title}
                        style={styles.activityThumb}
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      <div style={styles.activityInfo}>
                        <div style={styles.activityTitle}>{v.title}</div>
                        <div style={styles.activityMeta}>
                          <span style={styles.activityBadge}>{v.category}</span>
                          <span style={styles.activityStats}>
                            <FiEye size={14} /> {formatNumber(v.views || 0)}
                          </span>
                          <span style={styles.activityStats}>
                            <FiThumbsUp size={14} /> {Array.isArray(v.likes) ? v.likes.length : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ==================== ANALYTICS TAB ==================== */}
          {activeTab === 'analytics' && (
            <>
              <div style={styles.analyticsHeader}>
                <div style={styles.dateRangeSelector}>
                  {['today', 'week', 'month', 'all'].map(range => (
                    <button
                      key={range}
                      style={{
                        ...styles.dateRangeButton,
                        ...(dateRange === range ? styles.dateRangeButtonActive : {})
                      }}
                      onClick={() => setDateRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analytics Grid */}
              <div style={styles.analyticsGrid}>
                {/* Top Performing Videos */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiTrendingUp size={20} />
                    Top Performing Videos
                  </h3>
                  <div style={styles.topList}>
                    {Array.isArray(videos) && videos
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((v, i) => (
                        <div key={v._id} style={styles.topItem}>
                          <div style={styles.topRank}>#{i + 1}</div>
                          <img
                            src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                            alt={v.title}
                            style={styles.topThumb}
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                          />
                          <div style={styles.topInfo}>
                            <div style={styles.topTitle}>{v.title}</div>
                            <div style={styles.topStats}>
                              {formatNumber(v.views || 0)} views
                            </div>
                          </div>
                          <div style={styles.topValue}>
                            {metrics.videos.views > 0 ? ((v.views || 0) / metrics.videos.views * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Category Distribution */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiPieChart size={20} />
                    Category Distribution
                  </h3>
                  <div style={styles.categoryList}>
                    {categories.map((cat) => {
                      const count = Array.isArray(videos) ? videos.filter(v => v.category === cat).length : 0;
                      const percentage = metrics.videos.total > 0
                        ? (count / metrics.videos.total * 100).toFixed(1)
                        : 0;
                      if (count === 0) return null;
                      return (
                        <div key={cat} style={styles.categoryItem}>
                          <div style={styles.categoryInfo}>
                            <span style={styles.categoryName}>{cat}</span>
                            <span style={styles.categoryCount}>{count} videos</span>
                          </div>
                          <div style={styles.categoryProgress}>
                            <div
                              style={{
                                ...styles.categoryProgressFill,
                                width: `${percentage}%`
                              }}
                            />
                          </div>
                          <span style={styles.categoryPercentage}>{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiActivity size={20} />
                    Engagement Metrics
                  </h3>
                  <div style={styles.engagementGrid}>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-purple">
                        <FiThumbsUp size={24} />
                      </div>
                      <div style={styles.engagementValue}>{formatNumber(metrics.videos.likes)}</div>
                      <div style={styles.engagementLabel}>Total Likes</div>
                    </div>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-blue">
                        <FiPercent size={24} />
                      </div>
                      <div style={styles.engagementValue}>{metrics.engagement.rate}%</div>
                      <div style={styles.engagementLabel}>Engagement Rate</div>
                    </div>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-green">
                        <FiClock size={24} />
                      </div>
                      <div style={styles.engagementValue}>{metrics.engagement.avgWatchTime}</div>
                      <div style={styles.engagementLabel}>Avg Watch Time</div>
                    </div>
                    <div style={styles.engagementItem}>
                      <div style={styles.engagementIcon} className="gradient-orange">
                        <FiTarget size={24} />
                      </div>
                      <div style={styles.engagementValue}>{metrics.engagement.retention}</div>
                      <div style={styles.engagementLabel}>Retention Rate</div>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div style={styles.analyticsCard}>
                  <h3 style={styles.cardTitle}>
                    <FiDollarSign size={20} />
                    Revenue Breakdown
                  </h3>
                  <div style={styles.revenueBreakdown}>
                    <div style={styles.revenueItem}>
                      <div style={styles.revenueLabel}>
                        <FiTarget size={16} />
                        <span>Ad Revenue</span>
                      </div>
                      <div style={styles.revenueAmount}>
                        {formatCurrency(metrics.revenue.total * 0.7)}
                      </div>
                      <div style={styles.revenuePercentage}>70%</div>
                    </div>
                    <div style={styles.revenueItem}>
                      <div style={styles.revenueLabel}>
                        <FiUsers size={16} />
                        <span>Creator Payouts</span>
                      </div>
                      <div style={styles.revenueAmount}>
                        {formatCurrency(metrics.revenue.total * 0.2)}
                      </div>
                      <div style={styles.revenuePercentage}>20%</div>
                    </div>
                    <div style={styles.revenueItem}>
                      <div style={styles.revenueLabel}>
                        <FiPieChart size={16} />
                        <span>Platform Fees</span>
                      </div>
                      <div style={styles.revenueAmount}>
                        {formatCurrency(metrics.revenue.total * 0.1)}
                      </div>
                      <div style={styles.revenuePercentage}>10%</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==================== VIDEOS TAB ==================== */}
          {activeTab === 'videos' && (
            <>
              {/* Filters */}
              <div style={styles.filterBar}>
                <div style={styles.searchBox}>
                  <FiSearch size={20} color="#888" />
                  <input
                    style={styles.searchInput}
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  style={styles.filterSelect}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <select
                  style={styles.filterSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="views">Most Viewed</option>
                  <option value="engagement">Most Engaging</option>
                </select>

                <button
                  style={styles.uploadButton}
                  onClick={() => navigate('/upload')}
                >
                  <FiUpload size={18} />
                  <span>Upload Video</span>
                </button>
              </div>

              {/* Videos Grid */}
              <div style={styles.videosGrid}>
                {filteredVideos.map((v) => (
                  <div key={v._id} style={styles.videoCard}>
                    <div style={styles.videoThumbContainer}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${v.thumbnail}`}
                        alt={v.title}
                        style={styles.videoThumb}
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      <div style={styles.videoOverlay}>
                        <button
                          style={styles.playButton}
                          onClick={() => window.open(`/watch/${v.filename}`, '_blank')}
                        >
                          <FiPlayCircle size={32} />
                        </button>
                      </div>
                      <div style={styles.videoStats}>
                        <span><FiEye size={14} /> {formatNumber(v.views || 0)}</span>
                        <span><FiThumbsUp size={14} /> {Array.isArray(v.likes) ? v.likes.length : 0}</span>
                      </div>
                    </div>

                    <div style={styles.videoCardContent}>
                      {editId === v._id ? (
                        <div style={styles.editMode}>
                          <input
                            style={styles.editInput}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <div style={styles.editActions}>
                            <button style={styles.saveBtn} onClick={updateTitle}>
                              <FiCheckCircle size={16} /> Save
                            </button>
                            <button style={styles.cancelBtn} onClick={() => setEditId(null)}>
                              <FiX size={16} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 style={styles.videoCardTitle}>{v.title}</h3>
                          <div style={styles.videoMeta}>
                            <span style={styles.videoBadge}>{v.category}</span>
                            <span style={styles.videoDate}>{formatDate(v.createdAt)}</span>
                          </div>
                        </>
                      )}

                      {user && (
                        <div style={styles.videoActions}>
                          <button
                            style={styles.videoActionBtn}
                            onClick={() => { setEditId(v._id); setEditTitle(v.title); }}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            style={{ ...styles.videoActionBtn, color: '#ef4444' }}
                            onClick={() => deleteVideo(v._id)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div style={styles.emptyState}>
                  <FiVideo size={64} color="#555" />
                  <h3 style={styles.emptyTitle}>No videos found</h3>
                  <p style={styles.emptyText}>
                    {searchQuery || filterCategory !== "All"
                      ? "Try adjusting your filters"
                      : "Upload your first video to get started"}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ==================== ADS TAB ==================== */}
          {activeTab === 'ads' && (
            <div style={styles.comingSoon}>
              <FiTarget size={64} color="#667eea" />
              <h2>Ad Management</h2>
              <p>Manage your advertisements from the dedicated Ad Management panel</p>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/admin/upload-ad")}
              >
                Go to Ad Management
              </button>
            </div>
          )}

          {/* ==================== REVENUE TAB ==================== */}
          {activeTab === 'revenue' && (
            <div style={styles.comingSoon}>
              <FiDollarSign size={64} color="#10b981" />
              <h2>Revenue Dashboard</h2>
              <p>View detailed revenue analytics and reports</p>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/revenue-dashboard")}
              >
                Go to Revenue Dashboard
              </button>
            </div>
          )}

          {/* ==================== CREATORS TAB ==================== */}
          {activeTab === 'creators' && (
            <div style={styles.comingSoon}>
              <FiUsers size={64} color="#f59e0b" />
              <h2>Creator Management</h2>
              <p>Manage creator applications and monetization</p>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/AdminMonetizationPanel")}
              >
                Go to Creator Management
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Outfit', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          width: 56px;
          height: 56px;
          border: 4px solid rgba(102, 126, 234, 0.1);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spinning {
          animation: spin 0.8s linear infinite;
        }

        .gradient-purple {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .gradient-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .gradient-orange {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .alert-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .alert-info {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .alert-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
      `}</style>
    </div>
  );
}

// Keep all existing styles...
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#fff',
  },

  // Loading Screen
  loadingScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
  },
  loadingSpinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  loadingText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },

  // ... (rest of your styles remain exactly the same)
  // Copy all the remaining styles from your original code
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: 'rgba(10, 10, 15, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(102, 126, 234, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
  },
  sidebarHeader: {
    padding: '28px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
    minHeight: '88px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  logoSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  toggleBtn: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '10px',
    padding: '10px',
    color: '#667eea',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  nav: {
    flex: 1,
    padding: '24px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
  },
  navSection: {
    marginBottom: '16px',
  },
  navSectionTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '8px 16px',
    marginBottom: '8px',
  },
  navItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    right: '8px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.8)',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
    margin: '16px 24px',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid rgba(102, 126, 234, 0.1)',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  userAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userRole: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  userStatus: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
    flexShrink: 0,
  },

  // Main Content
  main: {
    flex: 1,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100vh',
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(10, 10, 15, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  },
  topBarLeft: {
    flex: 1,
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    margin: 0,
    marginBottom: '6px',
    background: 'linear-gradient(135deg, #fff 0%, #667eea 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  breadcrumbActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '10px',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
  },
  notificationBadge: {
    position: 'relative',
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '10px',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ef4444',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
  },
  content: {
    padding: '40px',
    animation: 'fadeIn 0.5s ease',
  },

  // Metrics Grid
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  metricCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideIn 0.5s ease',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  metricIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  metricGrowth: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
    letterSpacing: '-1px',
  },
  metricLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },

  // Performance Section
  performanceSection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  performanceCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '28px',
  },
  performanceGrid: {
    display: 'grid',
    gap: '24px',
  },
  performanceItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  performanceLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    marginBottom: '12px',
  },
  performanceValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '12px',
  },
  performanceBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 0 12px rgba(102, 126, 234, 0.5)',
  },

  // Alerts Card
  alertsCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  alertIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
  },
  alertText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  alertButton: {
    padding: '8px 16px',
    background: 'rgba(102, 126, 234, 0.2)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '8px',
    color: '#667eea',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  // Activity Section
  activitySection: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  activityGrid: {
    display: 'grid',
    gap: '16px',
  },
  activityCard: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  activityThumb: {
    width: '120px',
    height: '68px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  activityInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
  },
  activityTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#fff',
  },
  activityMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
  },
  activityBadge: {
    padding: '4px 10px',
    background: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '6px',
    color: '#667eea',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  activityStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },

  // Analytics
  analyticsHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
  },
  dateRangeSelector: {
    display: 'flex',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '6px',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  dateRangeButton: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dateRangeButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  analyticsCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '24px',
  },
  topList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  topItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  topRank: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '800',
    color: '#fff',
    flexShrink: 0,
  },
  topThumb: {
    width: '80px',
    height: '45px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  topInfo: {
    flex: 1,
    minWidth: 0,
  },
  topTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  topStats: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
  topValue: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#10b981',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  categoryInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '120px',
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
  },
  categoryCount: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  categoryProgress: {
    flex: 1,
    height: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  categoryPercentage: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#667eea',
    minWidth: '48px',
    textAlign: 'right',
  },
  engagementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  engagementItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    textAlign: 'center',
  },
  engagementIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    marginBottom: '16px',
  },
  engagementValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
  },
  engagementLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  revenueBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  revenueItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  revenueLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  revenueAmount: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#10b981',
  },
  revenuePercentage: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Filter Bar
  filterBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    borderRadius: '12px',
    minWidth: '280px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    outline: 'none',
  },
  filterSelect: {
    padding: '14px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
  },

  // Videos Grid
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  videoCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  videoThumbContainer: {
    position: 'relative',
    aspectRatio: '16/9',
    overflow: 'hidden',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  playButton: {
    background: 'rgba(102, 126, 234, 0.9)',
    border: 'none',
    borderRadius: '50%',
    padding: '16px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoStats: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
  },
  videoCardContent: {
    padding: '20px',
  },
  videoCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  videoMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  videoBadge: {
    padding: '6px 12px',
    background: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    color: '#667eea',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  videoDate: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
  videoActions: {
    display: 'flex',
    gap: '8px',
  },
  videoActionBtn: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    color: '#667eea',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editMode: {
    marginBottom: '12px',
  },
  editInput: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '8px',
    outline: 'none',
  },
  editActions: {
    display: 'flex',
    gap: '8px',
  },
  saveBtn: {
    flex: 1,
    padding: '10px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },

  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginTop: '24px',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },

  // Coming Soon
  comingSoon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    border: '1px solid rgba(102, 126, 234, 0.15)',
  },
  primaryButton: {
    marginTop: '24px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
  },
};