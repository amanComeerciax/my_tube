import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const res = await api.get("/api/notifications", {
        
      });
      
      setNotifications(res.data);
      
      // Count unread
      const unread = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(
        `/api/notifications/read/${notificationId}`,
        {},
        {  }
      );
      
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(
        `/api/notifications/${notificationId}`,
        {  }
      );
      
      const deletedNotif = notifications.find(n => n._id === notificationId);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    
    // Navigate based on notification type
    if (notification.type === "new_video" && notification.video?.filename) {
      navigate(`/watch/${notification.video.filename}`);
    } else if (notification.type === "subscribe" && notification.sender?._id) {
      navigate(`/profile/${notification.sender._id}`);
    } else if ((notification.type === "like" || notification.type === "comment") && notification.video?.filename) {
      navigate(`/watch/${notification.video.filename}`);
    }
    
    setShowDropdown(false);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_video":
        return (
          <div className="notif-icon notif-icon-video">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
        );
      case "like":
        return (
          <div className="notif-icon notif-icon-like">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
            </svg>
          </div>
        );
      case "comment":
        return (
          <div className="notif-icon notif-icon-comment">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
          </div>
        );
      case "subscribe":
        return (
          <div className="notif-icon notif-icon-subscriber">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="notif-icon notif-icon-default">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </div>
        );
    }
  };

  // Get time ago
  const getTimeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="notifications-wrapper" ref={dropdownRef}>
      <button
        className="yt-icon-btn notif-bell"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>Notifications</h3>
          </div>

          <div className="notif-list">
            {loading ? (
              <div className="notif-loading">
                <div className="notif-spinner" />
                <p>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="#606060">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif._id}
                  className={`notif-item ${!notif.isRead ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  {getNotificationIcon(notif.type)}
                  
                  <div className="notif-content">
                    <p className="notif-message">{notif.message}</p>
                    <span className="notif-time">{getTimeAgo(notif.createdAt)}</span>
                  </div>

                  <button
                    className="notif-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>

                  {!notif.isRead && <div className="notif-unread-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notifications-wrapper {
          position: relative;
        }

        .notif-bell {
          position: relative;
        }

        .notif-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #ff0000;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .notif-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 420px;
          max-width: 90vw;
          background: #282828;
          border: 1px solid #3f3f3f;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          z-index: 3000;
          max-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .notif-header {
          padding: 16px 20px;
          border-bottom: 1px solid #3f3f3f;
        }

        .notif-header h3 {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .notif-list {
          overflow-y: auto;
          max-height: 480px;
        }

        .notif-list::-webkit-scrollbar {
          width: 8px;
        }

        .notif-list::-webkit-scrollbar-thumb {
          background: #3f3f3f;
          border-radius: 4px;
        }

        .notif-loading,
        .notif-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .notif-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #3f3f3f;
          border-top-color: #3ea6ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .notif-loading p,
        .notif-empty p {
          color: #aaa;
          font-size: 14px;
          margin-top: 12px;
        }

        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .notif-item:hover {
          background: #3f3f3f;
        }

        .notif-item.unread {
          background: rgba(62, 166, 255, 0.05);
        }

        .notif-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-icon svg {
          fill: #fff;
        }

        .notif-icon-video {
          background: #065fd4;
        }

        .notif-icon-like {
          background: #ff0000;
        }

        .notif-icon-comment {
          background: #00a152;
        }

        .notif-icon-subscriber {
          background: #f57c00;
        }

        .notif-icon-default {
          background: #606060;
        }

        .notif-content {
          flex: 1;
          min-width: 0;
        }

        .notif-message {
          font-size: 14px;
          line-height: 1.4;
          margin: 0 0 4px;
          color: #f1f1f1;
        }

        .notif-time {
          font-size: 12px;
          color: #aaa;
        }

        .notif-delete {
          background: transparent;
          border: none;
          color: #aaa;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .notif-item:hover .notif-delete {
          opacity: 1;
        }

        .notif-delete:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f1f1f1;
        }

        .notif-delete svg {
          fill: currentColor;
        }

        .notif-unread-dot {
          position: absolute;
          top: 50%;
          left: 8px;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #3ea6ff;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .notif-dropdown {
            width: 100vw;
            max-width: 100vw;
            right: -16px;
            border-radius: 12px 12px 0 0;
          }
        }
      `}</style>
    </div>
  );
}