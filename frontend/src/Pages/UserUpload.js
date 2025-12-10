

// import React, { useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function UserUpload() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [currentStep, setCurrentStep] = useState(1);

//   // Refs to trigger file inputs
//   const videoInputRef = useRef(null);
//   const thumbnailInputRef = useRef(null);

//   if (!user) {
//     return (
//       <div style={styles.loginRequired}>
//         <div style={styles.loginCard}>
//           <svg width="64" height="64" viewBox="0 0 24 24" fill="#ff0000">
//             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
//           </svg>
//           <h2 style={{ marginTop: 16, marginBottom: 8 }}>Login Required</h2>
//           <p style={{ color: "#aaa", marginBottom: 24 }}>
//             You need to be logged in to upload videos
//           </p>
//           <button style={styles.loginButton} onClick={() => navigate("/login")}>
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleVideoSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setVideo(file);
//       setVideoPreview(URL.createObjectURL(file));
//       setCurrentStep(2);
//       // Reset input so same file can be selected again
//       e.target.value = "";
//     }
//   };

//   const handleThumbnailSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnail(file);
//       setThumbnailPreview(URL.createObjectURL(file));
//       e.target.value = "";
//     }
//   };

//   const handleUpload = async () => {
//     if (!title.trim() || !video || !thumbnail) {
//       alert("Title, video, and thumbnail are required!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title.trim());
//     formData.append("description", description);
//     formData.append("tags", tags);
//     formData.append("video", video);
//     formData.append("thumbnail", thumbnail);

//     try {
//       setLoading(true);
//       setUploadProgress(0);
//       const token = localStorage.getItem("token");

//       await axios.post("http://localhost:5000/api/videos/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percent);
//         },
//       });

//       alert("Video Uploaded Successfully!");
//       navigate("/profile");
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Upload Failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//       setUploadProgress(0);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <button style={styles.backButton} onClick={() => navigate(-1)}>
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
//           </svg>
//         </button>
//         <h1 style={styles.headerTitle}>Upload Video</h1>
//       </div>

//       <div style={styles.content}>
//         {/* Progress Steps */}
//         <div style={styles.steps}>
//           <div style={currentStep >= 1 ? styles.stepActive : styles.step}>
//             <div style={currentStep >= 1 ? styles.stepCircleActive : styles.stepCircle}>
//               {currentStep > 1 ? "✓" : "1"}
//             </div>
//             <span style={styles.stepLabel}>Upload File</span>
//           </div>
//           <div style={styles.stepLine}></div>
//           <div style={currentStep >= 2 ? styles.stepActive : styles.step}>
//             <div style={currentStep >= 2 ? styles.stepCircleActive : styles.stepCircle}>
//               {currentStep > 2 ? "✓" : "2"}
//             </div>
//             <span style={styles.stepLabel}>Details</span>
//           </div>
//           <div style={styles.stepLine}></div>
//           <div style={currentStep >= 3 ? styles.stepActive : styles.step}>
//             <div style={currentStep >= 3 ? styles.stepCircleActive : styles.stepCircle}>3</div>
//             <span style={styles.stepLabel}>Preview</span>
//           </div>
//         </div>

//         <div style={styles.uploadArea}>
//           {/* Step 1: Upload Video */}
//           {currentStep === 1 && !video && (
//             <div style={styles.uploadBox}>
//               <input
//                 ref={videoInputRef}
//                 type="file"
//                 accept="video/*"
//                 onChange={handleVideoSelect}
//                 style={{ display: "none" }}
//               />
//               <div
//                 style={styles.uploadLabel}
//                 onClick={() => videoInputRef.current?.click()}
//               >
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="#606060">
//                   <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
//                 </svg>
//                 <h3 style={{ marginTop: 16, marginBottom: 8 }}>Select video to upload</h3>
//                 <p style={{ color: "#aaa", marginBottom: 24 }}>
//                   Or drag and drop a file
//                 </p>
//                 <button type="button" style={styles.selectButton}>
//                   Select File
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2 & 3: Details + Preview */}
//           {(currentStep === 2 || currentStep === 3) && (
//             <div style={styles.formArea}>
//               <div style={styles.formContainer}>
//                 <div style={styles.formSection}>
//                   <h3 style={styles.sectionTitle}>Details</h3>

//                   {/* Title */}
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>
//                       Title <span style={{ color: "#ff0000" }}>*</span>
//                     </label>
//                     <input
//                       style={styles.input}
//                       type="text"
//                       placeholder="Add a title that describes your video"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       maxLength={100}
//                     />
//                     <div style={styles.charCount}>{title.length}/100</div>
//                   </div>

//                   {/* Description */}
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Description</label>
//                     <textarea
//                       style={styles.textarea}
//                       placeholder="Tell viewers about your video"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       rows={5}
//                       maxLength={500}
//                     />
//                     <div style={styles.charCount}>{description.length}/500</div>
//                   </div>

//                   {/* Tags */}
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Tags</label>
//                     <input
//                       style={styles.input}
//                       type="text"
//                       placeholder="gaming, tutorial, funny, etc."
//                       value={tags}
//                       onChange={(e) => setTags(e.target.value)}
//                     />
//                   </div>

//                   {/* Thumbnail Upload */}
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>
//                       Thumbnail <span style={{ color: "#ff0000" }}>*</span>
//                     </label>
//                     <input
//                       ref={thumbnailInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={handleThumbnailSelect}
//                       style={{ display: "none" }}
//                     />

//                     {thumbnailPreview ? (
//                       <div style={styles.thumbnailPreview}>
//                         <img src={thumbnailPreview} alt="Thumbnail" style={styles.thumbnailImage} />
//                         <button
//                           type="button"
//                           style={styles.changeThumbnailBtn}
//                           onClick={() => thumbnailInputRef.current?.click()}
//                         >
//                           Change Thumbnail
//                         </button>
//                       </div>
//                     ) : (
//                       <div
//                         style={styles.thumbnailUploadBox}
//                         onClick={() => thumbnailInputRef.current?.click()}
//                       >
//                         <svg width="40" height="40" viewBox="0 0 24 24" fill="#606060">
//                           <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
//                         </svg>
//                         <p style={{ marginTop: 8, color: "#aaa" }}>Click to upload thumbnail</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div style={styles.actionButtons}>
//                   <button style={styles.cancelButton} onClick={() => navigate(-1)} disabled={loading}>
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     style={styles.previewButton}
//                     onClick={() => setCurrentStep(3)}
//                     disabled={!title || !thumbnail || loading}
//                   >
//                     Next: Preview
//                   </button>
//                   <button
//                     style={{
//                       ...styles.uploadButton,
//                       opacity: loading || !title || !thumbnail ? 0.5 : 1,
//                       cursor: loading || !title || !thumbnail ? "not-allowed" : "pointer"
//                     }}
//                     onClick={handleUpload}
//                     disabled={loading || !title || !thumbnail}
//                   >
//                     {loading ? `Uploading... ${uploadProgress}%` : "Upload Video"}
//                   </button>
//                 </div>

//                 {/* Progress Bar */}
//                 {loading && (
//                   <div style={styles.progressContainer}>
//                     <div style={styles.progressBar}>
//                       <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }}></div>
//                     </div>
//                     <p style={styles.progressText}>{uploadProgress}% uploaded...</p>
//                   </div>
//                 )}
//               </div>

//               {/* Video Preview Sidebar */}
//               <div style={styles.previewSidebar}>
//                 <h4 style={styles.previewTitle}>Preview</h4>
//                 {videoPreview && (
//                   <video src={videoPreview} controls style={styles.videoPreview} />
//                 )}
//                 <div style={styles.videoInfo}>
//                   <p style={styles.videoFileName}>File: {video?.name}</p>
//                   <p style={styles.videoSize}>Size: {(video?.size / (1024*1024)).toFixed(1)} MB</p>
//                   <button
//                     style={styles.changeVideoBtn}
//                     onClick={() => {
//                       setVideo(null);
//                       setVideoPreview(null);
//                       setCurrentStep(1);
//                     }}
//                   >
//                     Change Video
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Final Preview Step */}
//           {currentStep === 3 && (
//             <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
//               <button style={styles.backToEditBtn} onClick={() => setCurrentStep(2)}>
//                 ← Edit Details
//               </button>
//               <h2 style={{ margin: "24px 0" }}>Everything looks good!</h2>
//               <div style={styles.previewCard}>
//                 <img src={thumbnailPreview} alt="Thumbnail" style={styles.previewThumbnail} />
//                 <div style={styles.previewDetails}>
//                   <h3>{title}</h3>
//                   <p style={{ color: "#aaa", margin: "12px 0" }}>{description || "No description"}</p>
//                   {tags && (
//                     <div>
//                       {tags.split(",").map((tag, i) => (
//                         <span key={i} style={styles.previewTag}>#{tag.trim()}</span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div style={{ marginTop: 32 }}>
//                 <button style={styles.uploadButton} onClick={handleUpload} disabled={loading}>
//                   {loading ? `Publishing... ${uploadProgress}%` : "Publish Video"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// /* =======================
//    🎨 STYLES
// ======================= */
// const styles = {
//   container: {
//     background: "#0f0f0f",
//     minHeight: "100vh",
//     color: "#fff"
//   },

//   header: {
//     padding: "16px 24px",
//     borderBottom: "1px solid #333",
//     display: "flex",
//     alignItems: "center",
//     gap: 16
//   },

//   backButton: {
//     background: "transparent",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     padding: 8,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "background 0.2s"
//   },

//   headerTitle: {
//     fontSize: "20px",
//     margin: 0,
//     fontWeight: 600
//   },

//   content: {
//     maxWidth: "1400px",
//     margin: "0 auto",
//     padding: "40px 24px"
//   },

//   steps: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 48,
//     gap: 16
//   },

//   step: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 8
//   },

//   stepActive: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 8
//   },

//   stepCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "#272727",
//     color: "#aaa",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 600,
//     fontSize: 16
//   },

//   stepCircleActive: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "#ff0000",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 600,
//     fontSize: 16
//   },

//   stepLabel: {
//     fontSize: 13,
//     color: "#aaa"
//   },

//   stepLine: {
//     width: 60,
//     height: 2,
//     background: "#333"
//   },

//   uploadArea: {
//     background: "#1a1a1a",
//     borderRadius: 16,
//     padding: 40,
//     minHeight: "500px"
//   },

//   uploadBox: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "500px"
//   },

//   uploadLabel: {
//     textAlign: "center",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center"
//   },

//   selectButton: {
//     padding: "12px 32px",
//     background: "#3ea6ff",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "background 0.2s"
//   },

//   formArea: {
//     display: "grid",
//     gridTemplateColumns: "1fr 400px",
//     gap: 32
//   },

//   formContainer: {
//     flex: 1
//   },

//   formSection: {
//     marginBottom: 32
//   },

//   sectionTitle: {
//     fontSize: 18,
//     marginBottom: 24,
//     fontWeight: 600
//   },

//   formGroup: {
//     marginBottom: 24
//   },

//   label: {
//     display: "block",
//     marginBottom: 8,
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#fff"
//   },

//   input: {
//     width: "100%",
//     padding: "12px 16px",
//     background: "#272727",
//     border: "1px solid #3f3f3f",
//     borderRadius: 8,
//     color: "#fff",
//     fontSize: 14,
//     outline: "none",
//     transition: "border-color 0.2s"
//   },

//   textarea: {
//     width: "100%",
//     padding: "12px 16px",
//     background: "#272727",
//     border: "1px solid #3f3f3f",
//     borderRadius: 8,
//     color: "#fff",
//     fontSize: 14,
//     outline: "none",
//     resize: "vertical",
//     fontFamily: "inherit",
//     transition: "border-color 0.2s"
//   },

//   charCount: {
//     textAlign: "right",
//     fontSize: 12,
//     color: "#aaa",
//     marginTop: 4
//   },

//   helpText: {
//     fontSize: 12,
//     color: "#aaa",
//     marginTop: 4
//   },

//   thumbnailPreview: {
//     position: "relative",
//     width: "100%",
//     maxWidth: 400
//   },

//   thumbnailImage: {
//     width: "100%",
//     borderRadius: 8,
//     display: "block"
//   },

//   changeThumbnailBtn: {
//     marginTop: 12,
//     padding: "8px 16px",
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14
//   },

//   thumbnailUploadBox: {
//     border: "2px dashed #3f3f3f",
//     borderRadius: 8,
//     padding: 40,
//     textAlign: "center",
//     cursor: "pointer",
//     transition: "border-color 0.2s"
//   },

//   thumbnailUploadLabel: {
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     color: "#aaa"
//   },

//   actionButtons: {
//     display: "flex",
//     gap: 12,
//     justifyContent: "flex-end",
//     paddingTop: 24,
//     borderTop: "1px solid #333"
//   },

//   cancelButton: {
//     padding: "10px 24px",
//     background: "transparent",
//     color: "#fff",
//     border: "1px solid #3f3f3f",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: 600
//   },

//   previewButton: {
//     padding: "10px 24px",
//     background: "#272727",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: 600
//   },

//   uploadButton: {
//     padding: "10px 24px",
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: 600
//   },

//   progressContainer: {
//     marginTop: 24,
//     padding: 16,
//     background: "#272727",
//     borderRadius: 8
//   },

//   progressBar: {
//     width: "100%",
//     height: 8,
//     background: "#3f3f3f",
//     borderRadius: 4,
//     overflow: "hidden"
//   },

//   progressFill: {
//     height: "100%",
//     background: "#ff0000",
//     transition: "width 0.3s"
//   },

//   progressText: {
//     marginTop: 8,
//     textAlign: "center",
//     fontSize: 14,
//     color: "#aaa"
//   },

//   previewSidebar: {
//     background: "#272727",
//     padding: 24,
//     borderRadius: 12,
//     height: "fit-content",
//     position: "sticky",
//     top: 80
//   },

//   previewTitle: {
//     fontSize: 16,
//     marginBottom: 16,
//     fontWeight: 600
//   },

//   videoPreview: {
//     width: "100%",
//     borderRadius: 8,
//     marginBottom: 16
//   },

//   videoInfo: {
//     fontSize: 13,
//     color: "#aaa"
//   },

//   videoFileName: {
//     marginBottom: 8,
//     wordBreak: "break-all"
//   },

//   videoSize: {
//     marginBottom: 12
//   },

//   changeVideoBtn: {
//     width: "100%",
//     padding: "8px 16px",
//     background: "#3f3f3f",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 13
//   },

//   finalPreview: {
//     maxWidth: 800,
//     margin: "0 auto"
//   },

//   backToEditBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#3ea6ff",
//     cursor: "pointer",
//     fontSize: 14,
//     marginBottom: 24,
//     fontWeight: 600
//   },

//   previewCard: {
//     background: "#272727",
//     borderRadius: 12,
//     overflow: "hidden"
//   },

//   previewThumbnail: {
//     width: "100%",
//     display: "block"
//   },

//   previewDetails: {
//     padding: 24
//   },

//   previewTag: {
//     display: "inline-block",
//     background: "#3f3f3f",
//     padding: "4px 12px",
//     borderRadius: 16,
//     fontSize: 12,
//     marginRight: 8,
//     marginBottom: 8
//   },

//   loginRequired: {
//     background: "#0f0f0f",
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   loginCard: {
//     textAlign: "center",
//     background: "#1a1a1a",
//     padding: 48,
//     borderRadius: 16,
//     maxWidth: 400
//   },

//   loginButton: {
//     padding: "12px 32px",
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: 600
//   }
// };

// import React, { useState, useContext, useRef } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function UserUpload() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [category, setCategory] = useState("");
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);

//   const [videoPreview, setVideoPreview] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [currentStep, setCurrentStep] = useState(1);

//   // File input refs
//   const videoInputRef = useRef(null);
//   const thumbnailInputRef = useRef(null);

//   // Category Options
//   const categories = [
//     "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
//     "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
//     "Fashion", "Fitness", "Other"
//   ];

//   // If not logged in
//   if (!user) {
//     return (
//       <div style={styles.loginRequired}>
//         <div style={styles.loginCard}>
//           <h2 style={{ marginBottom: 10 }}>⚠ Login Required</h2>
//           <p style={{ color: "#aaa", marginBottom: 20 }}>
//             You must be logged in to upload videos.
//           </p>
//           <button style={styles.loginButton} onClick={() => navigate("/login")}>
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Select Video
//   const handleVideoSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setVideo(file);
//       setVideoPreview(URL.createObjectURL(file));
//       setCurrentStep(2);
//       e.target.value = "";
//     }
//   };

//   // Select Thumbnail
//   const handleThumbnailSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnail(file);
//       setThumbnailPreview(URL.createObjectURL(file));
//       e.target.value = "";
//     }
//   };

//   // Upload Handler
//   const handleUpload = async () => {
//     if (!title.trim() || !video || !thumbnail || !category) {
//       alert("⚠ Title, category, video & thumbnail are required!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title.trim());
//     formData.append("description", description);
//     formData.append("tags", tags);
//     formData.append("category", category);
//     formData.append("video", video);
//     formData.append("thumbnail", thumbnail);

//     try {
//       setLoading(true);
//       setUploadProgress(0);

//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5000/api/videos/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//         onUploadProgress: (e) => {
//           setUploadProgress(Math.round((e.loaded * 100) / e.total));
//         },
//       });

//       alert("🎉 Your video is uploaded!");
//       navigate("/profile");
//     } catch (err) {
//       alert("Upload Failed ❌ " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//       setUploadProgress(0);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button style={styles.backButton} onClick={() => navigate(-1)}>←</button>
//         <h1 style={styles.headerTitle}>Upload Video</h1>
//       </div>

//       <div style={styles.content}>
        
//         {/* STEP 1: Upload Video */}
//         {currentStep === 1 && (
//           <div style={styles.uploadArea}>
//             <input
//               ref={videoInputRef}
//               type="file"
//               accept="video/*"
//               onChange={handleVideoSelect}
//               style={{ display: "none" }}
//             />
//             <div style={styles.uploadLabel} onClick={() => videoInputRef.current?.click()}>
//               <h3>Select video to upload</h3>
//               <p style={{ color: "#aaa" }}>Click to select or drag & drop</p>
//               <button style={styles.selectButton}>Select File</button>
//             </div>
//           </div>
//         )}

//         {/* STEP 2 & 3: Form + Preview */}
//         {currentStep > 1 && (
//           <div style={styles.formArea}>
//             {/* FORM */}
//             <div style={styles.formContainer}>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Title*</label>
//                 <input
//                   style={styles.input}
//                   type="text"
//                   maxLength={100}
//                   placeholder="Enter video title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Category*</label>
//                 <select
//                   style={styles.input}
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((c) => (
//                     <option key={c} value={c}>{c}</option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Description</label>
//                 <textarea
//                   style={styles.textarea}
//                   rows={4}
//                   maxLength={500}
//                   placeholder="Say something about your video..."
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                 ></textarea>
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Tags</label>
//                 <input
//                   style={styles.input}
//                   type="text"
//                   placeholder="music, comedy, tech"
//                   value={tags}
//                   onChange={(e) => setTags(e.target.value)}
//                 />
//               </div>

//               {/* THUMBNAIL */}
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Thumbnail*</label>

//                 {!thumbnailPreview ? (
//                   <div
//                     style={styles.thumbnailUploadBox}
//                     onClick={() => thumbnailInputRef.current?.click()}
//                   >
//                     <p style={{ color: "#aaa" }}>Click to upload thumbnail</p>
//                   </div>
//                 ) : (
//                   <div>
//                     <img src={thumbnailPreview} alt="Thumbnail" style={styles.thumbnailImage} />
//                     <button
//                       style={styles.changeThumbnailBtn}
//                       onClick={() => thumbnailInputRef.current?.click()}
//                     >
//                       Change Thumbnail
//                     </button>
//                   </div>
//                 )}

//                 <input
//                   ref={thumbnailInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleThumbnailSelect}
//                   style={{ display: "none" }}
//                 />
//               </div>

//               {/* ACTIONS */}
//               <div style={styles.actionButtons}>
//                 <button style={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
//                 <button
//                   style={styles.previewButton}
//                   onClick={() => setCurrentStep(3)}
//                   disabled={!title || !thumbnail || !category}
//                 >
//                   Preview
//                 </button>

//                 <button
//                   style={{
//                     ...styles.uploadButton,
//                     opacity: (!title || !thumbnail || !category) ? 0.5 : 1,
//                   }}
//                   disabled={!title || !thumbnail || !category || loading}
//                   onClick={handleUpload}
//                 >
//                   {loading ? `Uploading... ${uploadProgress}%` : "Upload"}
//                 </button>
//               </div>

//               {/* Progress Bar */}
//               {loading && (
//                 <div style={styles.progressContainer}>
//                   <div style={styles.progressBar}>
//                     <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }}></div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* VIDEO PREVIEW */}
//             <div style={styles.previewSidebar}>
//               <h4 style={styles.previewTitle}>Preview</h4>
//               {videoPreview && <video src={videoPreview} controls style={styles.videoPreview} />}
//               <button
//                 style={styles.changeVideoBtn}
//                 onClick={() => { setVideo(null); setVideoPreview(null); setCurrentStep(1); }}
//               >
//                 Change Video
//               </button>
//             </div>
//           </div>
//         )}

//         {/* FINAL PREVIEW STEP */}
//         {currentStep === 3 && (
//           <div style={{ textAlign: "center", marginTop: 40 }}>
//             <h2>💯 Looks Good?</h2>
//             <img src={thumbnailPreview} alt="thumbnail" style={{ width: "60%", borderRadius: 10 }} />
//             <h3 style={{ marginTop: 20 }}>{title}</h3>
//             <p style={{ color: "#aaa" }}>{description || "No description"}</p>

//             {tags && (
//               <p>
//                 {tags.split(",").map((t, i) => (
//                   <span key={i} style={styles.previewTag}>#{t.trim()}</span>
//                 ))}
//               </p>
//             )}

//             <p style={{ marginTop: 10, fontSize: 15 }}>📌 Category: {category}</p>

//             <button style={styles.backToEditBtn} onClick={() => setCurrentStep(2)}>🔙 Edit</button>

//             <button
//               style={styles.uploadButton}
//               onClick={handleUpload}
//               disabled={loading}
//             >
//               {loading ? `Publishing... ${uploadProgress}%` : "Publish Video 🚀"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// /* 🎨 STYLES */
// const styles = {
//   container: { minHeight: "100vh", background: "#0f0f0f", color: "white" },
//   header: { padding: "16px 24px", borderBottom: "1px solid #333", display: "flex", gap: 10 },
//   backButton: { background: "transparent", border: "none", color: "white", cursor: "pointer" },
//   headerTitle: { fontSize: 20, fontWeight: 600 },

//   loginRequired: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f0f0f" },
//   loginCard: { background: "#1a1a1a", padding: 40, borderRadius: 12, textAlign: "center" },
//   loginButton: { marginTop: 16, padding: "10px 24px", background: "#ff0000", border: "none", color: "#fff", borderRadius: 8, cursor: "pointer" },

//   content: { maxWidth: 1300, margin: "0 auto", padding: 30 },
//   uploadArea: { background: "#1a1a1a", height: 400, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 12 },
//   uploadLabel: { textAlign: "center", cursor: "pointer" },
//   selectButton: { marginTop: 20, padding: "10px 24px", background: "#3ea6ff", borderRadius: 8, border: "none", color: "#fff" },

//   formArea: { display: "grid", gridTemplateColumns: "1fr 400px", gap: 30 },
//   formContainer: { background: "#1a1a1a", padding: 36, borderRadius: 12 },
//   formGroup: { marginBottom: 20 },
//   label: { marginBottom: 6, display: "block", fontSize: 14, fontWeight: 600 },
//   input: { width: "100%", padding: "12px", borderRadius: 8, background: "#272727", border: "1px solid #333", color: "white" },
//   textarea: { width: "100%", padding: "12px", borderRadius: 8, background: "#272727", border: "1px solid #333", color: "white", resize: "vertical" },

//   thumbnailUploadBox: { border: "2px dashed #444", padding: 30, borderRadius: 12, textAlign: "center", cursor: "pointer" },
//   thumbnailImage: { width: "100%", borderRadius: 8 },
//   changeThumbnailBtn: { marginTop: 12, padding: "8px 16px", background: "#333", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" },

//   actionButtons: { display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 20, borderTop: "1px solid #333" },
//   cancelButton: { background: "transparent", border: "1px solid #333", color: "#fff", padding: "10px 24px", borderRadius: 8, cursor: "pointer" },
//   previewButton: { background: "#444", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8 },
//   uploadButton: { background: "#ff0000", border: "none", padding: "10px 24px", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600 },

//   progressContainer: { marginTop: 16 },
//   progressBar: { width: "100%", height: 6, background: "#333", borderRadius: 4 },
//   progressFill: { height: "100%", background: "#ff0000" },

//   previewSidebar: { background: "#1a1a1a", padding: 24, borderRadius: 12 },
//   previewTitle: { marginBottom: 10, fontSize: 16 },
//   videoPreview: { width: "100%", borderRadius: 8, marginBottom: 10 },
//   changeVideoBtn: { width: "100%", padding: "10px 0", background: "#333", border: "none", borderRadius: 8, color: "white", cursor: "pointer" },

//   previewTag: { display: "inline-block", background: "#333", padding: "5px 10px", borderRadius: 12, marginRight: 6, marginTop: 6 },
//   backToEditBtn: { background: "transparent", color: "#3ea6ff", border: "none", marginTop: 20, cursor: "pointer" }
// };

import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Configuration for Chunking
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB per chunk

export default function UserUpload() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  
  // New state to hold the filename returned by the server for the thumbnail
  const [thumbnailFilename, setThumbnailFilename] = useState(null); 

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadId, setUploadId] = useState(null); // Unique ID for the entire upload session

  // File input refs
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Category Options
  const categories = [
    "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology",
    "Cooking", "Travel", "Vlogs", "News", "Comedy", "Animation", "Science",
    "Fashion", "Fitness", "Other"
  ];

  // If not logged in
  if (!user) {
    // ... (Login Required block remains the same)
    return (
      <div style={styles.loginRequired}>
        <div style={styles.loginCard}>
          <h2 style={{ marginBottom: 10 }}>⚠ Login Required</h2>
          <p style={{ color: "#aaa", marginBottom: 20 }}>
            You must be logged in to upload videos.
          </p>
          <button style={styles.loginButton} onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Select Video
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      // Generate a unique ID for this upload session
      setUploadId(Date.now().toString() + '-' + file.name.replace(/[^a-zA-Z0-9]/g, ''));
      setCurrentStep(2);
      e.target.value = "";
    }
  };

  // Select Thumbnail
  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  // ----------------------------------------------------
  // CORE CHUNKING LOGIC
  // ----------------------------------------------------

  const uploadChunk = async (chunk, index, totalChunks, token) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("chunkIndex", index);
    formData.append("totalChunks", totalChunks);
    formData.append("uploadId", uploadId);
    
    // Send all video metadata with every chunk (essential for the final chunk)
    formData.append("title", title.trim());
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("thumbnailFilename", thumbnailFilename); // The key from the first step!

    const res = await axios.post(
      "http://localhost:5000/api/videos/upload/chunk", // 🎯 NEW CHUNK UPLOAD URL
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          // Calculate progress based on total file size, not just this chunk
          const percent = Math.round(((index * CHUNK_SIZE + e.loaded) * 100) / video.size);
          setUploadProgress(Math.min(percent, 99)); 
        },
      }
    );

    return res.data;
  };

  const handleFullChunkUpload = async (token) => {
    const totalChunks = Math.ceil(video.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, video.size);
      const chunk = video.slice(start, end);

      try {
        const data = await uploadChunk(chunk, i, totalChunks, token);
        
        if (i === totalChunks - 1) {
          // Final check after the last chunk
          setUploadProgress(100);
          alert("🎉 Your video is uploaded and assembled!");
          navigate(`/watch/${data.video.filename}`); // Navigate to the video page
        }
      } catch (chunkError) {
        alert(`Chunk ${i}/${totalChunks} Upload Failed ❌. Please try again.`);
        console.error("Chunk upload failed:", chunkError);
        setLoading(false);
        setUploadProgress(0);
        return; // Abort the whole process
      }
    }
  };

  // Main Upload Handler (now handles two steps: Thumbnail then Chunks)
  const handleUpload = async () => {
    if (!title.trim() || !video || !thumbnail || !category) {
      alert("⚠ Title, category, video & thumbnail are required!");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    const token = localStorage.getItem("token");

    try {
      // ------------------------------------------------
      // STEP 1: UPLOAD THUMBNAIL (Non-chunking)
      // ------------------------------------------------
      setUploadProgress(1);
      const thumbFormData = new FormData();
      thumbFormData.append("thumbnail", thumbnail);

      const thumbRes = await axios.post(
        "http://localhost:5000/api/videos/upload/thumbnail", // 🎯 NEW THUMBNAIL URL
        thumbFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      const uploadedFilename = thumbRes.data.filename;
      setThumbnailFilename(uploadedFilename); // Save the filename for the video chunks

      // ------------------------------------------------
      // STEP 2: UPLOAD VIDEO CHUNKS
      // ------------------------------------------------
      await handleFullChunkUpload(token);

    } catch (err) {
      alert("Upload Failed ❌ " + (err.response?.data?.message || err.message));
      console.error("Main upload handler error:", err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };


  // ----------------------------------------------------
  // RENDER LOGIC
  // ----------------------------------------------------

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>←</button>
        <h1 style={styles.headerTitle}>Upload Video</h1>
      </div>

      <div style={styles.content}>
        
        {/* STEP 1: Upload Video */}
        {currentStep === 1 && (
          <div style={styles.uploadArea}>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              style={{ display: "none" }}
            />
            <div style={styles.uploadLabel} onClick={() => videoInputRef.current?.click()}>
              <h3>Select video to upload</h3>
              <p style={{ color: "#aaa" }}>Click to select or drag & drop</p>
              <button style={styles.selectButton}>Select File</button>
            </div>
          </div>
        )}

        {/* STEP 2 & 3: Form + Preview */}
        {currentStep > 1 && (
          <div style={styles.formArea}>
            {/* FORM */}
            <div style={styles.formContainer}>

              {/* ... (Form Groups for Title, Category, Description, Tags remain the same) ... */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Title*</label>
                <input
                  style={styles.input}
                  type="text"
                  maxLength={100}
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category*</label>
                <select
                  style={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  rows={4}
                  maxLength={500}
                  placeholder="Say something about your video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="music, comedy, tech"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              {/* THUMBNAIL */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Thumbnail*</label>

                {!thumbnailPreview ? (
                  <div
                    style={styles.thumbnailUploadBox}
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <p style={{ color: "#aaa" }}>Click to upload thumbnail</p>
                  </div>
                ) : (
                  <div>
                    <img src={thumbnailPreview} alt="Thumbnail" style={styles.thumbnailImage} />
                    <button
                      style={styles.changeThumbnailBtn}
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      Change Thumbnail
                    </button>
                  </div>
                )}

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  style={{ display: "none" }}
                />
              </div>

              {/* ACTIONS */}
              <div style={styles.actionButtons}>
                <button style={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
                <button
                  style={styles.previewButton}
                  onClick={() => setCurrentStep(3)}
                  disabled={!title || !thumbnail || !category}
                >
                  Preview
                </button>

                <button
                  style={{
                    ...styles.uploadButton,
                    opacity: (!title || !thumbnail || !category) ? 0.5 : 1,
                  }}
                  disabled={!title || !thumbnail || !category || loading}
                  onClick={handleUpload}
                >
                  {loading ? `Uploading... ${uploadProgress}%` : "Upload"}
                </button>
              </div>

              {/* Progress Bar */}
              {loading && (
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }}></div>
                  </div>
                  <p style={{ fontSize: 12, marginTop: 5, color: '#ff0000' }}>
                     {uploadProgress < 10 ? 'Uploading Thumbnail...' : 'Uploading Video Chunks...'}
                  </p>
                </div>
              )}
            </div>

            {/* VIDEO PREVIEW */}
            <div style={styles.previewSidebar}>
              <h4 style={styles.previewTitle}>Preview</h4>
              {videoPreview && <video src={videoPreview} controls style={styles.videoPreview} />}
              <button
                style={styles.changeVideoBtn}
                onClick={() => { setVideo(null); setVideoPreview(null); setCurrentStep(1); }}
              >
                Change Video
              </button>
            </div>
          </div>
        )}

        {/* FINAL PREVIEW STEP */}
        {currentStep === 3 && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <h2>💯 Looks Good?</h2>
            <img src={thumbnailPreview} alt="thumbnail" style={{ width: "60%", borderRadius: 10 }} />
            <h3 style={{ marginTop: 20 }}>{title}</h3>
            <p style={{ color: "#aaa" }}>{description || "No description"}</p>

            {tags && (
              <p>
                {tags.split(",").map((t, i) => (
                  <span key={i} style={styles.previewTag}>#{t.trim()}</span>
                ))}
              </p>
            )}

            <p style={{ marginTop: 10, fontSize: 15 }}>📌 Category: {category}</p>

            <button style={styles.backToEditBtn} onClick={() => setCurrentStep(2)}>🔙 Edit</button>

            <button
              style={styles.uploadButton}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? `Publishing... ${uploadProgress}%` : "Publish Video 🚀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* 🎨 STYLES (Styles block remains the same) */
const styles = {
  container: { minHeight: "100vh", background: "#0f0f0f", color: "white" },
  header: { padding: "16px 24px", borderBottom: "1px solid #333", display: "flex", gap: 10 },
  backButton: { background: "transparent", border: "none", color: "white", cursor: "pointer" },
  headerTitle: { fontSize: 20, fontWeight: 600 },

  loginRequired: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f0f0f" },
  loginCard: { background: "#1a1a1a", padding: 40, borderRadius: 12, textAlign: "center" },
  loginButton: { marginTop: 16, padding: "10px 24px", background: "#ff0000", border: "none", color: "#fff", borderRadius: 8, cursor: "pointer" },

  content: { maxWidth: 1300, margin: "0 auto", padding: 30 },
  uploadArea: { background: "#1a1a1a", height: 400, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 12 },
  uploadLabel: { textAlign: "center", cursor: "pointer" },
  selectButton: { marginTop: 20, padding: "10px 24px", background: "#3ea6ff", borderRadius: 8, border: "none", color: "#fff" },

  formArea: { display: "grid", gridTemplateColumns: "1fr 400px", gap: 30 },
  formContainer: { background: "#1a1a1a", padding: 36, borderRadius: 12 },
  formGroup: { marginBottom: 20 },
  label: { marginBottom: 6, display: "block", fontSize: 14, fontWeight: 600 },
  input: { width: "100%", padding: "12px", borderRadius: 8, background: "#272727", border: "1px solid #333", color: "white" },
  textarea: { width: "100%", padding: "12px", borderRadius: 8, background: "#272727", border: "1px solid #333", color: "white", resize: "vertical" },

  thumbnailUploadBox: { border: "2px dashed #444", padding: 30, borderRadius: 12, textAlign: "center", cursor: "pointer" },
  thumbnailImage: { width: "100%", borderRadius: 8 },
  changeThumbnailBtn: { marginTop: 12, padding: "8px 16px", background: "#333", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" },

  actionButtons: { display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 20, borderTop: "1px solid #333" },
  cancelButton: { background: "transparent", border: "1px solid #333", color: "#fff", padding: "10px 24px", borderRadius: 8, cursor: "pointer" },
  previewButton: { background: "#444", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8 },
  uploadButton: { background: "#ff0000", border: "none", padding: "10px 24px", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600 },

  progressContainer: { marginTop: 16 },
  progressBar: { width: "100%", height: 6, background: "#333", borderRadius: 4 },
  progressFill: { height: "100%", background: "#ff0000" },

  previewSidebar: { background: "#1a1a1a", padding: 24, borderRadius: 12 },
  previewTitle: { marginBottom: 10, fontSize: 16 },
  videoPreview: { width: "100%", borderRadius: 8, marginBottom: 10 },
  changeVideoBtn: { width: "100%", padding: "10px 0", background: "#333", border: "none", borderRadius: 8, color: "white", cursor: "pointer" },

  previewTag: { display: "inline-block", background: "#333", padding: "5px 10px", borderRadius: 12, marginRight: 6, marginTop: 6 },
  backToEditBtn: { background: "transparent", color: "#3ea6ff", border: "none", marginTop: 20, cursor: "pointer" }
};