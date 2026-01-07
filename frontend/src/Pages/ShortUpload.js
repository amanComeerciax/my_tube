import React, { useState, useContext, useRef } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiImage, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { MdVideoLibrary } from "react-icons/md";

export default function ShortUpload() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const videoRef = useRef(null);
  const thumbRef = useRef(null);

  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <FiAlertCircle size={48} style={{ color: '#ff6b6b', marginBottom: 16 }} />
          <h2 style={styles.loginTitle}>Login Required</h2>
          <p style={styles.loginText}>You need to be logged in to upload Shorts</p>
          <button style={styles.loginBtn} onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      setError("Short must be under 150MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbPreview(null);
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setError("Title is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!video) {
      setError("Video is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!thumbnail) {
      setError("Thumbnail is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setProgress(0);
    setError("");

    try {
      const formData = new FormData();

      formData.append("video", video);
      formData.append("thumbnail", thumbnail);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("category", "Shorts");
      formData.append("isShort", true);

      await api.post("/api/videos/upload-short", formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/shorts");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            <svg viewBox="0 0 24 24" width="24" height="24" style={{ fill: '#fff' }}>
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <h1 style={styles.navTitle}>
            <MdVideoLibrary size={28} style={{ marginRight: 12 }} />
            Upload Short
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.grid}>
          {/* Left Column - Video Upload */}
          <div style={styles.column}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <FiUpload size={20} style={{ marginRight: 8 }} />
                Video
              </h2>

              <input
                ref={videoRef}
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideo}
              />

              {!videoPreview ? (
                <div
                  style={styles.uploadBox}
                  onClick={() => videoRef.current.click()}
                >
                  <MdVideoLibrary size={48} style={{ color: '#667eea', marginBottom: 12 }} />
                  <p style={styles.uploadText}>Click to select video</p>
                  <p style={styles.uploadHint}>Vertical video recommended (9:16)</p>
                  <p style={styles.uploadHint}>Max 60 seconds • Max 150MB</p>
                </div>
              ) : (
                <div style={styles.previewContainer}>
                  <video
                    src={videoPreview}
                    controls
                    style={styles.videoPreview}
                  />
                  <button style={styles.removeBtn} onClick={removeVideo}>
                    <FiX size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <FiImage size={20} style={{ marginRight: 8 }} />
                Thumbnail
              </h2>

              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleThumb}
              />

              {!thumbPreview ? (
                <button
                  style={styles.thumbnailBtn}
                  onClick={() => thumbRef.current.click()}
                >
                  <FiImage size={24} style={{ marginBottom: 8 }} />
                  <span>Upload Thumbnail</span>
                </button>
              ) : (
                <div style={styles.thumbnailPreview}>
                  <img
                    src={thumbPreview}
                    alt="thumbnail"
                    style={styles.thumbnailImg}
                  />
                  <button style={styles.removeBtn} onClick={removeThumbnail}>
                    <FiX size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div style={styles.column}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Details</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  style={styles.input}
                  placeholder="Give your Short a catchy title"
                  maxLength={80}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span style={styles.charCount}>{title.length}/80</span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Tell viewers what your Short is about (optional)"
                  rows={4}
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <span style={styles.charCount}>{description.length}/500</span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags</label>
                <input
                  style={styles.input}
                  placeholder="e.g. funny, entertainment, viral"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <span style={styles.hint}>Separate tags with commas</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
              {error && (
                <div style={styles.errorAlert}>
                  <FiAlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div style={styles.successAlert}>
                  <FiCheck size={20} />
                  <span>Short uploaded successfully! Redirecting...</span>
                </div>
              )}

              {loading && (
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                  </div>
                  <span style={styles.progressText}>Uploading... {progress}%</span>
                </div>
              )}

              <div style={styles.buttonGroup}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...styles.publishBtn,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading}
                  onClick={handleUpload}
                >
                  {loading ? 'Uploading...' : '🚀 Publish Short'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f0f',
    color: '#fff',
  },

  // Navbar
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    background: '#0f0f0f',
    borderBottom: '1px solid #3f3f3f',
    zIndex: 1000,
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: '16px',
  },
  backBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  navTitle: {
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },

  // Content
  content: {
    paddingTop: '80px',
    paddingBottom: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '80px 24px 40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  // Card
  card: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },

  // Upload Box
  uploadBox: {
    height: '400px',
    border: '2px dashed rgba(102, 126, 234, 0.3)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    background: 'rgba(102, 126, 234, 0.05)',
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '8px',
  },
  uploadHint: {
    fontSize: '13px',
    color: '#aaa',
    margin: '4px 0',
  },

  // Preview
  previewContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  videoPreview: {
    maxWidth: '100%',
    maxHeight: '500px',
    borderRadius: '12px',
  },
  removeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },

  // Thumbnail
  thumbnailBtn: {
    width: '100%',
    padding: '48px 24px',
    border: '2px dashed rgba(102, 126, 234, 0.3)',
    borderRadius: '12px',
    background: 'rgba(102, 126, 234, 0.05)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
  },
  thumbnailPreview: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  thumbnailImg: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '12px',
  },

  // Form
  formGroup: {
    marginBottom: '24px',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  charCount: {
    position: 'absolute',
    right: '16px',
    bottom: '-20px',
    fontSize: '12px',
    color: '#888',
  },
  hint: {
    fontSize: '13px',
    color: '#888',
    marginTop: '6px',
    display: 'block',
  },

  // Actions
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  errorAlert: {
    padding: '12px 16px',
    background: 'rgba(255, 107, 107, 0.1)',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    borderRadius: '8px',
    color: '#ff6b6b',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  successAlert: {
    padding: '12px 16px',
    background: 'rgba(81, 207, 102, 0.1)',
    border: '1px solid rgba(81, 207, 102, 0.3)',
    borderRadius: '8px',
    color: '#51cf66',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '13px',
    color: '#aaa',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '12px 32px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  publishBtn: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(255,0,0,0.3)',
  },

  // Login
  loginContainer: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: '400px',
  },
  loginTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '12px',
  },
  loginText: {
    fontSize: '15px',
    color: '#aaa',
    marginBottom: '32px',
  },
  loginBtn: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  // Responsive overrides (handled via window.matchMedia in component)
  '@media (max-width: 1024px)': {
    grid: {
      gridTemplateColumns: '1fr',
    },
  },
};
