// import React, { useState, useEffect, useRef, useContext } from "react";
// import io from "socket.io-client";
// import { AuthContext } from "../context/AuthContext";
// import { useParams } from "react-router-dom";
// import { FiSend, FiZap, FiAlertCircle } from "react-icons/fi";

// // ICE servers for WebRTC connection
// const ICE_SERVERS = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" }
//   ]
// };

// export default function LivePage() {
//   const { user } = useContext(AuthContext);
//   const { roomId } = useParams();

//   const videoRef = useRef(null);
//   const socketRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerConnectionsRef = useRef({});


//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [streamActive, setStreamActive] = useState(false);
//   const [viewerCount, setViewerCount] = useState(0);
//   const [error, setError] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState("connecting");

//   // Initialize socket connection
//   useEffect(() => {
//     console.log("🔌 Initializing socket connection...");
//     socketRef.current = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000
//     });

//     const socket = socketRef.current;

//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//       setConnectionStatus("connected");
//       setError(null);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Socket connection error:", err);
//       setConnectionStatus("error");
//       setError("Unable to connect to server. Please check your connection.");
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("🔴 Socket disconnected:", reason);
//       setConnectionStatus("disconnected");
//       if (reason === "io server disconnect") {
//         socket.connect();
//       }
//     });

//     // Join the live room
//     socket.emit("join-live", { roomId, userId: user?._id, userName: user?.name });

//     // Listen for viewer count updates
//     socket.on("viewer-count", (count) => {
//       setViewerCount(count);
//     });

//     socket.on("new-viewer", async ({ viewerId }) => {
//         if (!localStreamRef.current) return;

//         console.log("📤 New viewer joined:", viewerId);

//         const pc = new RTCPeerConnection(ICE_SERVERS);
//         peerConnectionsRef.current[viewerId] = pc;

//         localStreamRef.current.getTracks().forEach(track => {
//           pc.addTrack(track, localStreamRef.current);
//         });

//         pc.onicecandidate = (e) => {
//           if (e.candidate) {
//             socket.emit("ice-candidate", {
//               candidate: e.candidate,
//               roomId,
//               to: viewerId
//             });
//           }
//         };

//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);

//         socket.emit("offer", {
//           offer,
//           roomId,
//           to: viewerId
//         });

//         console.log("✅ Offer sent to viewer");
//       });


//     // Listen for messages
//     socket.on("receive-message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     // WebRTC signaling for viewers
//     socket.on("broadcaster", (broadcasterId) => {
//       console.log("📺 Broadcaster detected:", broadcasterId);
//       if (user?._id !== roomId) {
//         // Viewer: create peer connection to receive stream
//         createViewerConnection(broadcasterId);
//       }
//     });

//     socket.on("offer", async ({ offer, broadcasterId }) => {
//       console.log("📥 Received offer from broadcaster");
//       await handleOffer(offer, broadcasterId);
//     });

//     // socket.on("answer", async (answer) => {
//     //   console.log("📥 Received answer from viewer");
//     //   if (peerConnectionRef.current) {
//     //     await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//     //   }
//     // });



//     // socket.on("ice-candidate", async (candidate) => {
//     //   console.log("🧊 Received ICE candidate");
//     //   if (peerConnectionRef.current && candidate) {
//     //     try {
//     //       await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//     //     } catch (err) {
//     //       console.error("Error adding ICE candidate:", err);
//     //     }
//     //   }
//     // });


//     // --- Find these inside your useEffect in LivePage.js ---

// socket.on("answer", async ({ answer, from }) => {
//     console.log("📥 Received answer from viewer:", from);
//     // Use the map of connections instead of the single peerConnectionRef
//     const pc = peerConnectionsRef.current[from];
//     if (pc) {
//       await pc.setRemoteDescription(new RTCSessionDescription(answer));
//     }
//   });

//   socket.on("ice-candidate", async ({ candidate, from }) => {
//     console.log("🧊 Received ICE candidate from:", from);
//     // Find the specific connection this candidate belongs to
//     const pc = isBroadcaster 
//       ? peerConnectionsRef.current[from] 
//       : peerConnectionRef.current;

//     if (pc && candidate) {
//       try {
//         await pc.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (err) {
//         console.error("Error adding ICE candidate:", err);
//       }
//     }
//   });
//     socket.on("broadcaster-left", () => {
//       console.log("📴 Broadcaster left the stream");
//       setStreamActive(false);
//       setError("Stream ended by broadcaster");
//       cleanup();
//     });

//     return () => {
//       console.log("🧹 Cleaning up socket connection");
//       socket.emit("leave-live", roomId);
//       socket.off();
//       socket.close();
//       cleanup();
//     };
//   }, [roomId, user]);

//   // Initialize broadcaster stream
//   useEffect(() => {
//     const isBroadcaster = user && String(user._id) === String(roomId);

//     if (isBroadcaster && connectionStatus === "connected") {
//       console.log("🎥 Initializing broadcaster mode...");
//       initBroadcaster();
//     }

//     return () => {
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach(track => {
//           track.stop();
//           console.log("🛑 Stopped track:", track.kind);
//         });
//       }
//     };
//   }, [user, roomId, connectionStatus]);

//   const initBroadcaster = async () => {
//     try {
//       setError(null);
//       console.log("📹 Requesting camera and microphone access...");

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           facingMode: "user"
//         },
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100
//         }
//       });

//       localStreamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.muted = true; // Broadcaster sees their own feed muted
//         await videoRef.current.play();
//         setStreamActive(true);
//         console.log("✅ Broadcaster stream active");
//       }

//       // Notify server that broadcaster is ready
//       socketRef.current.emit("broadcaster-ready", roomId);

//     } catch (err) {
//       console.error("❌ Media access error:", err);
//       let errorMsg = "Unable to access camera/microphone. ";

//       if (err.name === "NotAllowedError") {
//         errorMsg += "Please grant permission to access your camera and microphone.";
//       } else if (err.name === "NotFoundError") {
//         errorMsg += "No camera or microphone found.";
//       } else if (err.name === "NotReadableError") {
//         errorMsg += "Camera/microphone is already in use by another application.";
//       } else {
//         errorMsg += err.message;
//       }

//       setError(errorMsg);
//       setStreamActive(false);
//     }
//   };

//   const createViewerConnection = async (broadcasterId) => {
//     try {
//       console.log("🔗 Creating peer connection as viewer...");

//       const pc = new RTCPeerConnection(ICE_SERVERS);
//       peerConnectionRef.current = pc;

//       // Handle incoming stream
//       // pc.ontrack = (event) => {
//       //   console.log("📺 Received remote stream");
//       //   if (videoRef.current && event.streams[0]) {
//       //       videoRef.current.srcObject = event.streams[0];

//       //       // autoplay trick
//       //       videoRef.current.muted = true;
//       //       videoRef.current.play()
//       //         .then(() => {
//       //           // unmute after play starts
//       //           setTimeout(() => {
//       //             videoRef.current.muted = false;
//       //           }, 500);
//       //         })
//       //         .catch(() => {
//       //           setError("Click anywhere on screen to start audio");
//       //         });

//       //       setStreamActive(true);

//       //   }
//       // };
//       pc.ontrack = (event) => {
//         if (videoRef.current && event.streams[0]) {
//           videoRef.current.srcObject = event.streams[0];
//           videoRef.current.muted = true;
//           videoRef.current.play().catch(() => {});
//           setStreamActive(true);
//         }
//       };


//       // Handle ICE candidates
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log("🧊 Sending ICE candidate to broadcaster");
//           socketRef.current.emit("ice-candidate", {
//             candidate: event.candidate,
//             roomId,
//             to: broadcasterId
//           });
//         }
//       };

//       // Handle connection state
//       pc.onconnectionstatechange = () => {
//         console.log("🔗 Connection state:", pc.connectionState);
//         if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
//           setError("Connection lost. Trying to reconnect...");
//           setTimeout(() => createViewerConnection(broadcasterId), 3000);
//         }
//       };

//       // Request stream from broadcaster
//       socketRef.current.emit("viewer-ready", { roomId, viewerId: socketRef.current.id });

//     } catch (err) {
//       console.error("❌ Peer connection error:", err);
//       setError("Failed to establish connection. Please refresh.");
//     }
//   };

//   const handleOffer = async (offer, broadcasterId) => {
//     try {
//       if (!peerConnectionRef.current) {
//         await createViewerConnection(broadcasterId);
//       }

//       const pc = peerConnectionRef.current;
//       await pc.setRemoteDescription(new RTCSessionDescription(offer));

//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);

//       socketRef.current.emit("answer", {
//         answer,
//         roomId,
//         to: broadcasterId
//       });

//       console.log("✅ Sent answer to broadcaster");
//     } catch (err) {
//       console.error("❌ Error handling offer:", err);
//       setError("Failed to connect to stream");
//     }
//   };

//   const cleanup = () => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => track.stop());
//       localStreamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//   };

//   const handleSendMessage = (e, isSuper = false) => {
//     e.preventDefault();
//     if (!inputText.trim()) return;

//     const data = {
//       roomId,
//       text: inputText,
//       user: user?.name || "Guest",
//       userId: user?._id,
//       isSuperChat: isSuper,
//       amount: isSuper ? 100 : 0
//     };

//     socketRef.current.emit("send-message", data);
//     setInputText("");
//   };

//   const isBroadcaster = user && String(user._id) === String(roomId);

//   return (
//     <div className="live-wrapper">
//       <div className="video-container">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="live-feed"
//         />

//         {streamActive && (
//           <div className="live-status">
//             <span className="pulse"></span>
//             🔴 LIVE
//           </div>
//         )}

//         {connectionStatus === "connected" && (
//           <div className="viewer-count">
//             👁️ {viewerCount} watching
//           </div>
//         )}

//         {!streamActive && isBroadcaster && connectionStatus === "connected" && (
//           <div className="loading-overlay">
//             <div className="spinner"></div>
//             <p>Connecting Neon Signal...</p>
//           </div>
//         )}

//         {!streamActive && !isBroadcaster && connectionStatus === "connected" && (
//           <div className="loading-overlay">
//             <div className="spinner"></div>
//             <p>Waiting for stream...</p>
//           </div>
//         )}

//         {error && (
//           <div className="error-overlay">
//             <FiAlertCircle size={48} />
//             <p>{error}</p>
//             <button onClick={() => window.location.reload()} className="retry-btn">
//               Retry
//             </button>
//           </div>
//         )}

//         {connectionStatus === "connecting" && (
//           <div className="loading-overlay">
//             <div className="spinner"></div>
//             <p>Connecting to server...</p>
//           </div>
//         )}
//       </div>

//       <div className="chat-container">
//         <div className="chat-header">
//           <span>NEON LIVE CHAT</span>
//           <span className="chat-status">
//             {connectionStatus === "connected" ? "🟢" : "🔴"}
//           </span>
//         </div>

//         <div className="chat-messages">
//           {messages.length === 0 && (
//             <div className="empty-chat">No messages yet. Be the first to say hi! 👋</div>
//           )}
//           {messages.map((m, i) => (
//             <div key={i} className={`msg ${m.isSuperChat ? "super-chat" : ""}`}>
//               {m.isSuperChat && (
//                 <div className="sc-header">
//                   <FiZap /> ₹{m.amount} NEON ZAP
//                 </div>
//               )}
//               <span className="user">{m.user}: </span>
//               <span className="text">{m.text}</span>
//               <span className="timestamp">
//                 {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="chat-input-area">
//           <input
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             placeholder="Type neon message..."
//             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
//             disabled={connectionStatus !== "connected"}
//           />
//           <button
//             onClick={handleSendMessage}
//             className="btn-send"
//             disabled={!inputText.trim() || connectionStatus !== "connected"}
//             title="Send message"
//           >
//             <FiSend />
//           </button>
//           <button
//             onClick={(e) => handleSendMessage(e, true)}
//             className="btn-sc"
//             disabled={!inputText.trim() || connectionStatus !== "connected"}
//             title="Send Super Chat (₹100)"
//           >
//             <FiZap />
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         .live-wrapper {
//           display: flex;
//           height: calc(100vh - 70px);
//           background: #000;
//           overflow: hidden;
//         }

//         .video-container {
//           flex: 3;
//           position: relative;
//           background: #111;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .live-feed {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           background: #000;
//           border: 1px solid #333;
//         }

//         .live-status {
//           position: absolute;
//           top: 20px;
//           left: 20px;
//           background: rgba(255, 0, 51, 0.9);
//           padding: 8px 20px;
//           border-radius: 6px;
//           font-weight: 900;
//           font-size: 14px;
//           box-shadow: 0 0 20px rgba(255, 0, 51, 0.6);
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           animation: pulse 2s infinite;
//         }

//         .pulse {
//           width: 8px;
//           height: 8px;
//           background: #fff;
//           border-radius: 50%;
//           animation: blink 1s infinite;
//         }

//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.3; }
//         }

//         @keyframes pulse {
//           0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 51, 0.6); }
//           50% { box-shadow: 0 0 30px rgba(255, 0, 51, 0.9); }
//         }

//         .viewer-count {
//           position: absolute;
//           top: 20px;
//           right: 20px;
//           background: rgba(0, 0, 0, 0.8);
//           padding: 8px 16px;
//           border-radius: 6px;
//           font-size: 14px;
//           color: #fff;
//           backdrop-filter: blur(10px);
//         }

//         .loading-overlay, .error-overlay {
//           position: absolute;
//           color: #fff;
//           font-size: 1.2rem;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 20px;
//         }

//         .error-overlay {
//           background: rgba(255, 0, 0, 0.1);
//           padding: 40px;
//           border-radius: 12px;
//           text-align: center;
//           max-width: 400px;
//         }

//         .spinner {
//           width: 50px;
//           height: 50px;
//           border: 4px solid #333;
//           border-top: 4px solid #a8edea;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .retry-btn {
//           margin-top: 15px;
//           padding: 10px 24px;
//           background: #ff0033;
//           color: #fff;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-weight: 600;
//           transition: all 0.3s;
//         }

//         .retry-btn:hover {
//           background: #cc0029;
//           transform: scale(1.05);
//         }

//         .chat-container {
//           flex: 1;
//           min-width: 350px;
//           max-width: 450px;
//           background: #0d0d1a;
//           border-left: 1px solid #222;
//           display: flex;
//           flex-direction: column;
//         }

//         .chat-header {
//           padding: 20px;
//           border-bottom: 1px solid #222;
//           color: #a8edea;
//           font-weight: 800;
//           letter-spacing: 2px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .chat-status {
//           font-size: 12px;
//         }

//         .chat-messages {
//           flex: 1;
//           overflow-y: auto;
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .chat-messages::-webkit-scrollbar {
//           width: 8px;
//         }

//         .chat-messages::-webkit-scrollbar-track {
//           background: #111;
//         }

//         .chat-messages::-webkit-scrollbar-thumb {
//           background: #333;
//           border-radius: 4px;
//         }

//         .empty-chat {
//           color: #666;
//           text-align: center;
//           padding: 40px 20px;
//           font-size: 14px;
//         }

//         .msg {
//           font-size: 14px;
//           color: #fff;
//           padding: 8px;
//           border-radius: 6px;
//           background: rgba(255, 255, 255, 0.03);
//           transition: background 0.2s;
//           word-wrap: break-word;
//         }

//         .msg:hover {
//           background: rgba(255, 255, 255, 0.05);
//         }

//         .user {
//           color: #fed6e3;
//           font-weight: 700;
//           margin-right: 8px;
//         }

//         .timestamp {
//           font-size: 10px;
//           color: #666;
//           margin-left: 8px;
//         }

//         .super-chat {
//           background: linear-gradient(135deg, #667eea, #764ba2);
//           padding: 14px;
//           border-radius: 8px;
//           border-left: 4px solid #facc15;
//           animation: slideIn 0.3s ease-out;
//         }

//         @keyframes slideIn {
//           from {
//             transform: translateX(-20px);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         .sc-header {
//           color: #facc15;
//           font-weight: 900;
//           margin-bottom: 6px;
//           font-size: 12px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .chat-input-area {
//           padding: 20px;
//           background: #111;
//           display: flex;
//           gap: 10px;
//           border-top: 1px solid #222;
//         }

//         .chat-input-area input {
//           flex: 1;
//           background: #000;
//           border: 1px solid #333;
//           color: #fff;
//           padding: 12px;
//           border-radius: 8px;
//           outline: none;
//           font-size: 14px;
//           transition: border 0.3s;
//         }

//         .chat-input-area input:focus {
//           border-color: #a8edea;
//         }

//         .chat-input-area input:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .btn-send, .btn-sc {
//           background: #272727;
//           border: none;
//           color: #fff;
//           padding: 12px 16px;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.3s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .btn-send:hover:not(:disabled) {
//           background: #333;
//           color: #a8edea;
//         }

//         .btn-sc:hover:not(:disabled) {
//           background: #333;
//           color: #facc15;
//           box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
//         }

//         .btn-send:disabled, .btn-sc:disabled {
//           opacity: 0.4;
//           cursor: not-allowed;
//         }

//         @media (max-width: 768px) {
//           .live-wrapper {
//             flex-direction: column;
//           }

//           .chat-container {
//             max-width: 100%;
//             height: 40vh;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { FiSend, FiZap, FiAlertCircle, FiVolume2, FiVolumeX } from "react-icons/fi";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
  ]
};

export default function LivePage() {
  const { user } = useContext(AuthContext);
  const { roomId } = useParams();

  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [streamActive, setStreamActive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay

  useEffect(() => {
    console.log("🔌 Initializing socket connection...");
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setConnectionStatus("connected");
      setError(null);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      setConnectionStatus("error");
      setError("Unable to connect to server. Please check your connection.");
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setConnectionStatus("disconnected");
    });

    socket.emit("join-live", { roomId, userId: user?._id, userName: user?.name });

    socket.on("viewer-count", (count) => {
      setViewerCount(count);
    });

    socket.on("new-viewer", async ({ viewerId }) => {
      if (!localStreamRef.current) return;

      console.log("📤 New viewer joined:", viewerId);

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current[viewerId] = pc;

      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            candidate: e.candidate,
            roomId,
            to: viewerId
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", {
        offer,
        roomId,
        to: viewerId
      });
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("broadcaster", (broadcasterId) => {
      console.log("📺 Broadcaster detected:", broadcasterId);
      if (user?._id !== roomId) {
        createViewerConnection(broadcasterId);
      }
    });

    socket.on("offer", async ({ offer, broadcasterId }) => {
      console.log("📥 Received offer from broadcaster");
      await handleOffer(offer, broadcasterId);
    });

    socket.on("answer", async ({ answer, from }) => {
      console.log("📥 Received answer from viewer:", from);
      const pc = peerConnectionsRef.current[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      console.log("🧊 Received ICE candidate from:", from);
      const isBroadcaster = user && String(user._id) === String(roomId);
      const pc = isBroadcaster ? peerConnectionsRef.current[from] : peerConnectionRef.current;

      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    socket.on("broadcaster-left", () => {
      console.log("📴 Broadcaster left the stream");
      setStreamActive(false);
      setError("Stream ended by broadcaster");
      cleanup();
    });

    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.emit("leave-live", roomId);
      socket.off();
      socket.close();
      cleanup();
    };
  }, [roomId, user]);

  useEffect(() => {
    const isBroadcaster = user && String(user._id) === String(roomId);
    if (isBroadcaster && connectionStatus === "connected") {
      console.log("🎥 Initializing broadcaster mode...");
      initBroadcaster();
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, roomId, connectionStatus]);

  const initBroadcaster = async () => {
    try {
      setError(null);
      console.log("📹 Requesting camera and microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
      });

      localStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
        setStreamActive(true);
        console.log("✅ Broadcaster stream active");
      }

      socketRef.current.emit("broadcaster-ready", roomId);
    } catch (err) {
      console.error("❌ Media access error:", err);
      let errorMsg = "Unable to access camera/microphone. ";
      if (err.name === "NotAllowedError") errorMsg += "Please grant permission.";
      else if (err.name === "NotFoundError") errorMsg += "No camera or microphone found.";
      else if (err.name === "NotReadableError") errorMsg += "Device in use by another app.";
      else errorMsg += err.message;

      setError(errorMsg);
      setStreamActive(false);
    }
  };

  const createViewerConnection = async (broadcasterId) => {
    try {
      console.log("🔗 Creating peer connection as viewer...");
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.muted = isMuted;
          videoRef.current.play().catch(() => { });
          setStreamActive(true);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("ice-candidate", {
            candidate: event.candidate,
            roomId,
            to: broadcasterId
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          setError("Connection lost. Reconnecting...");
          setTimeout(() => createViewerConnection(broadcasterId), 3000);
        }
      };

      socketRef.current.emit("viewer-ready", { roomId, viewerId: socketRef.current.id });
    } catch (err) {
      console.error("❌ Peer connection error:", err);
      setError("Failed to establish connection.");
    }
  };

  const handleOffer = async (offer, broadcasterId) => {
    try {
      if (!peerConnectionRef.current) {
        await createViewerConnection(broadcasterId);
      }

      const pc = peerConnectionRef.current;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current.emit("answer", {
        answer,
        roomId,
        to: broadcasterId
      });
    } catch (err) {
      console.error("❌ Error handling offer:", err);
      setError("Failed to connect to stream");
    }
  };

  const cleanup = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    peerConnectionsRef.current = {};

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleSendMessage = (e, isSuper = false) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const data = {
      roomId,
      text: inputText,
      user: user?.name || "Guest",
      userId: user?._id,
      isSuperChat: isSuper,
      amount: isSuper ? 100 : 0
    };

    socketRef.current.emit("send-message", data);
    setInputText("");
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const isBroadcaster = user && String(user._id) === String(roomId);

  return (
    <div className="live-wrapper">
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline muted={isMuted} className="live-feed" />

        <button onClick={toggleMute} className="audio-toggle-btn" title={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
        </button>

        {streamActive && (
          <div className="live-badge">
            <div className="live-dot"></div>
            LIVE
          </div>
        )}

        <div className="viewer-count-badge">
          <span className="eye-icon">👁️</span>
          <span className="count">{viewerCount}</span>
          <span className="label">watching</span>
        </div>

        {!streamActive && isBroadcaster && connectionStatus === "connected" && (
          <div className="overlay">
            <div className="spinner"></div>
            <p>Starting your MyTube stream...</p>
          </div>
        )}

        {!streamActive && !isBroadcaster && connectionStatus === "connected" && (
          <div className="overlay">
            <div className="spinner"></div>
            <p>Connecting to broadcaster...</p>
          </div>
        )}

        {error && (
          <div className="overlay error">
            <FiAlertCircle size={56} />
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Retry Connection
            </button>
          </div>
        )}

        {connectionStatus === "connecting" && (
          <div className="overlay">
            <div className="spinner"></div>
            <p>Connecting to NEON server...</p>
          </div>
        )}
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div>
            <h3>MyTube LIVE CHAT</h3>
            <span className="status">
              {connectionStatus === "connected" ? "🟢 Online" : "🔴 Connecting"}
            </span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No messages yet.</p>
              <p>Say something neon! ✨</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`message ${m.isSuperChat ? "super" : "normal"}`}>
                {m.isSuperChat && (
                  <div className="super-badge">
                    <FiZap /> ₹{m.amount} SUPER ZAP
                  </div>
                )}
                <div className="content">
                  <span className="username">{m.user}</span>
                  <span className="text">{m.text}</span>
                </div>
                <span className="time">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a neon message..."
            disabled={connectionStatus !== "connected"}
          />
          <button type="submit" className="send-btn" disabled={!inputText.trim() || connectionStatus !== "connected"}>
            <FiSend />
          </button>
          <button
            type="button"
            onClick={(e) => handleSendMessage(e, true)}
            className="zap-btn"
            disabled={!inputText.trim() || connectionStatus !== "connected"}
            title="Send Super Chat (₹100)"
          >
            <FiZap />
          </button>
        </form>
      </div>

      {/* Same beautiful styles as previous response */}
      <style jsx>{`
        /* ... (exact same <style jsx> block from my previous response) ... */
        .live-wrapper { display: flex; height: calc(100vh - 70px); background: #0a0a0f; color: #e0e0ff; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
        .video-container { flex: 3; position: relative; background: #000; overflow: hidden; }
        .live-feed { width: 100%; height: 100%; object-fit: cover; background: #000; }
        .audio-toggle-btn { position: absolute; bottom: 100px; right: 20px; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 10; }
        .audio-toggle-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }
        .live-badge { position: absolute; top: 20px; left: 20px; background: linear-gradient(45deg, #ff0066, #ff3366); color: white; padding: 10px 20px; border-radius: 30px; font-weight: 900; font-size: 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 0 20px rgba(255,0,102,0.6); animation: glow 2s infinite alternate; z-index: 10; }
        .live-dot { width: 12px; height: 12px; background: white; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes glow { from { box-shadow: 0 0 20px rgba(255,0,102,0.6); } to { box-shadow: 0 0 30px rgba(255,0,102,0.9); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .viewer-count-badge { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); padding: 10px 18px; border-radius: 30px; display: flex; align-items: center; gap: 8px; font-size: 14px; border: 1px solid rgba(255,255,255,0.1); z-index: 10; }
        .eye-icon { font-size: 18px; }
        .count { font-weight: 700; }
        .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: #fff; font-size: 1.3rem; z-index: 20; }
        .overlay.error { background: rgba(20,0,0,0.9); }
        .spinner { width: 60px; height: 60px; border: 5px solid #333; border-top: 5px solid #a8edea; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .retry-btn { margin-top: 20px; padding: 12px 32px; background: #ff3366; border: none; border-radius: 30px; color: white; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .retry-btn:hover { background: #ff1a55; transform: translateY(-2px); }
        .chat-container { flex: 1; min-width: 360px; background: linear-gradient(to bottom, #111122, #0a0a0f); display: flex; flex-direction: column; border-left: 1px solid #222233; }
        .chat-header { padding: 20px; border-bottom: 1px solid #222233; display: flex; justify-content: space-between; align-items: center; }
        .chat-header h3 { margin: 0; font-size: 18px; background: linear-gradient(90deg, #a8edea, #fed6e3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; }
        .status { font-size: 12px; opacity: 0.8; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .empty-state { text-align: center; color: #666; margin-top: 100px; font-size: 15px; }
        .message { max-width: 90%; align-self: flex-start; animation: fadeIn 0.4s ease-out; }
        .message.normal { background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 18px; border-bottom-left-radius: 4px; }
        .message.super { background: linear-gradient(135deg, #667eea, #764ba2); padding: 16px; border-radius: 18px; border-left: 5px solid #facc15; box-shadow: 0 4px 20px rgba(102,126,234,0.4); animation: superPop 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes superPop { 0% { transform: scale(0.9); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        .super-badge { font-size: 12px; font-weight: 900; color: #facc15; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; text-shadow: 0 0 10px rgba(250,204,21,0.6); }
        .content { display: flex; flex-wrap: wrap; gap: 6px; }
        .username { font-weight: 700; color: #fed6e3; }
        .text { color: #fff; }
        .time { font-size: 10px; color: #888; align-self: flex-end; margin-top: 4px; opacity: 0.8; }
        .chat-input-area { padding: 20px; background: #0f0f1a; display: flex; gap: 12px; border-top: 1px solid #222233; }
        .chat-input-area input { flex: 1; background: #1a1a2e; border: 1px solid #333; color: #fff; padding: 14px 18px; border-radius: 30px; outline: none; font-size: 15px; }
        .chat-input-area input:focus { border-color: #a8edea; box-shadow: 0 0 15px rgba(168,237,234,0.3); }
        .send-btn, .zap-btn { width: 50px; height: 50px; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .send-btn { background: #272740; color: #a8edea; }
        .send-btn:hover:not(:disabled) { background: #a8edea; color: #000; transform: scale(1.1); }
        .zap-btn { background: linear-gradient(45deg, #764ba2, #667eea); color: #facc15; }
        .zap-btn:hover:not(:disabled) { transform: scale(1.15); box-shadow: 0 0 20px rgba(250,204,21,0.6); }
        @media (max-width: 868px) { .live-wrapper { flex-direction: column; } .chat-container { min-width: unset; height: 45vh; } .audio-toggle-btn { bottom: 90px; } }
      `}</style>
    </div>
  );
}