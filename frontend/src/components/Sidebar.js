import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [showMoreSubs, setShowMoreSubs] = useState(false);
  const [showMoreExplore, setShowMoreExplore] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(res.data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const categories = [
    "Gaming",
    "Music",
    "Education",
    "Entertainment",
    "Sports",
    "Technology",
    "Cooking",
    "Travel",
    "Vlogs",
    "News",
    "Comedy",
    "Animation",
    "Science",
    "Fashion",
    "Fitness",
    "Other",
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      Gaming: "🎮",
      Music: "🎵",
      Education: "📚",
      Entertainment: "🎬",
      Sports: "⚽",
      Technology: "💻",
      Cooking: "🍳",
      Travel: "✈️",
      Vlogs: "📹",
      News: "📰",
      Comedy: "😂",
      Animation: "🎨",
      Science: "🔬",
      Fashion: "👗",
      Fitness: "💪",
      Other: "📦",
    };
    return icons[category] || "📁";
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          style={styles.overlay}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={styles.sidebarContent}>
          {/* Home Section */}
          <div style={styles.section}>
            <div
              style={styles.menuItem}
              onClick={() => handleNavigation("/")}
            >
              <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span style={styles.menuText}>Home</span>
            </div>

            <div
              style={styles.menuItem}
              onClick={() => handleNavigation("/?category=Trending")}
            >
              <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
              <span style={styles.menuText}>Trending</span>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Subscriptions Section */}
          {user && (
            <>
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionTitle}>Subscriptions</span>
                  <svg style={styles.icon} viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>

                {subscriptions.length === 0 ? (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyText}>No subscriptions yet</p>
                  </div>
                ) : (
                  <>
                    {subscriptions.slice(0, showMoreSubs ? subscriptions.length : 7).map((sub) => (
                      <div
                        key={sub._id}
                        style={styles.menuItem}
                        onClick={() => handleNavigation(`/profile/${sub._id}`)}
                      >
                        <div style={styles.avatar}>
                          {sub.avatar ? (
                            <img src={sub.avatar} alt={sub.name} style={styles.avatarImg} />
                          ) : (
                            <span style={styles.avatarText}>
                              {sub.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span style={styles.menuText}>{sub.name}</span>
                      </div>
                    ))}

                    {subscriptions.length > 7 && (
                      <div
                        style={styles.showMore}
                        onClick={() => setShowMoreSubs(!showMoreSubs)}
                      >
                        <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                          <path
                            fill="currentColor"
                            d={showMoreSubs ? "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" : "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"}
                          />
                        </svg>
                        <span style={styles.menuText}>{showMoreSubs ? "Show less" : "Show more"}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={styles.divider} />
            </>
          )}

          {/* You Section */}
          {user && (
            <>
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionTitle}>You</span>
                  <svg style={styles.icon} viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>

                <div style={styles.menuItem} onClick={() => handleNavigation("/history")}>
                  <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                  </svg>
                  <span style={styles.menuText}>History</span>
                </div>

                <div style={styles.menuItem} onClick={() => handleNavigation("/playlists")}>
                  <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                  </svg>
                  <span style={styles.menuText}>Playlists</span>
                </div>

                <div style={styles.menuItem} onClick={() => handleNavigation("/watch-later")}>
                  <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                  </svg>
                  <span style={styles.menuText}>Watch later</span>
                </div>

                <div style={styles.menuItem} onClick={() => handleNavigation("/liked")}>
                  <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                  </svg>
                  <span style={styles.menuText}>Liked videos</span>
                </div>

                <div style={styles.menuItem} onClick={() => handleNavigation("/profile")}>
                  <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M10 8l6 4-6 4V8zm11-5v18H3V3h18zm-2 2H5v14h14V5z" />
                  </svg>
                  <span style={styles.menuText}>Your videos</span>
                </div>
              </div>

              <div style={styles.divider} />
            </>
          )}

          {/* Explore Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Explore</h3>

            {categories.slice(0, showMoreExplore ? categories.length : 6).map((category) => (
              <div
                key={category}
                style={styles.menuItem}
                onClick={() => handleNavigation(`/?category=${category}`)}
              >
                <div style={styles.categoryIcon}>{getCategoryIcon(category)}</div>
                <span style={styles.menuText}>{category}</span>
              </div>
            ))}

            <div
              style={styles.showMore}
              onClick={() => setShowMoreExplore(!showMoreExplore)}
            >
              <svg style={styles.icon} viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d={showMoreExplore ? "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" : "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"}
                />
              </svg>
              <span style={styles.menuText}>{showMoreExplore ? "Show less" : "Show more"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 998,
  },
  sidebar: {
    position: "fixed",
    top: "70px",
    left: 0,
    width: "240px",
    height: "calc(100vh - 70px)",
    background: "#0f0f0f",
    overflowY: "auto",
    overflowX: "hidden",
    zIndex: 999,
    transition: "transform 0.3s ease",
    borderRight: "1px solid #333",
  },
  sidebarContent: {
    padding: "12px 0",
  },
  section: {
    padding: "0 12px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s",
    color: "#fff",
  },
  icon: {
    flexShrink: 0,
  },
  menuText: {
    fontSize: "14px",
    fontWeight: "500",
  },
  avatar: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#ff0033",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff",
  },
  categoryIcon: {
    fontSize: "20px",
    flexShrink: 0,
  },
  showMore: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s",
    color: "#fff",
  },
  emptyState: {
    padding: "20px 12px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: "13px",
    color: "#666",
  },
  divider: {
    height: "1px",
    background: "#333",
    margin: "12px 0",
  },
};