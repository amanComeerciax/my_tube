// // import React, { useState, useContext } from "react";
// // import axios from "axios";
// // import { AuthContext } from "../context/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // export default function Login() {
// //   const { login } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleLogin = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const res = await axios.post("http://localhost:5000/api/auth/login", {
// //         email,
// //         password,
// //       });

// //       login(res.data);
// //       alert("Login successful!");

// //       navigate("/upload");

// //     } catch (err) {
// //       alert("Invalid email or password");
// //     }
// //   };

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2>Admin Login</h2>

// //       <form onSubmit={handleLogin}>
// //         <input 
// //           type="email" 
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         <br /><br />

// //         <input 
// //           type="password" 
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         <br /><br />

// //         <button type="submit">Login</button>
// //       </form>
// //     </div>
// //   );
// // }


// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // SAME FILE STYLES (NO CSS FILE)
//   const styles = {
//     container: {
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "100vh",
//       background: "#f7f7f7",
//     },
//     card: {
//       background: "#fff",
//       padding: "35px",
//       width: "380px",
//       borderRadius: "14px",
//       boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
//       textAlign: "center",
//     },
//     heading: {
//       marginBottom: "20px",
//       fontSize: "24px",
//       fontWeight: "bold",
//     },
//     input: {
//       width: "100%",
//       padding: "12px",
//       border: "1px solid #ccc",
//       borderRadius: "10px",
//       marginBottom: "15px",
//       fontSize: "15px",
//       outline: "none",
//     },
//     button: {
//       width: "100%",
//       padding: "12px",
//       background: "#ff0000",
//       color: "#fff",
//       border: "none",
//       borderRadius: "10px",
//       fontSize: "16px",
//       cursor: "pointer",
//       transition: "0.2s",
//     },
//     buttonHover: {
//       background: "#cc0000",
//     },
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       login(res.data);
//       alert("Login successful!");
//       navigate("/upload");

//     } catch (err) {
//       alert("Invalid email or password");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.heading}>🔐 Admin Login</h2>

//         <form onSubmit={handleLogin}>
//           <input
//             style={styles.input}
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             style={styles.input}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="submit"
//             style={styles.button}
//             onMouseOver={(e) => (e.target.style.background = "#cc0000")}
//             onMouseOut={(e) => (e.target.style.background = "#ff0000")}
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // SAME STYLES (INLINE)
//   const styles = {
//     container: {
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "100vh",
//       background: "#f7f7f7",
//     },
//     card: {
//       background: "#fff",
//       padding: "35px",
//       width: "380px",
//       borderRadius: "14px",
//       boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
//       textAlign: "center",
//     },
//     heading: {
//       marginBottom: "5px",
//       fontSize: "24px",
//       fontWeight: "bold",
//     },
//     subText: {
//       fontSize: "14px",
//       marginBottom: "20px",
//       color: "#555",
//     },
//     input: {
//       width: "100%",
//       padding: "12px",
//       border: "1px solid #ccc",
//       borderRadius: "10px",
//       marginBottom: "15px",
//       fontSize: "15px",
//       outline: "none",
//     },
//     button: {
//       width: "100%",
//       padding: "12px",
//       background: "#ff0000",
//       color: "#fff",
//       border: "none",
//       borderRadius: "10px",
//       fontSize: "16px",
//       cursor: "pointer",
//       transition: "0.2s",
//     },
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       login(res.data); // Save user + token
//       alert("Login successful 🎉");

//       navigate("/"); // Redirect to home page

//     } catch (err) {
//       alert("Invalid email or password ❌");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.heading}>🔐 Login</h2>
//         <p style={styles.subText}>
//           Don't have an account? <a href="/signup">Create one</a>
//         </p>

//         <form onSubmit={handleLogin}>
//           <input
//             style={styles.input}
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             style={styles.input}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="submit"
//             style={styles.button}
//             onMouseOver={(e) => (e.target.style.background = "#cc0000")}
//             onMouseOut={(e) => (e.target.style.background = "#ff0000")}
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// Assuming you have an icon library like 'react-icons' installed
import { FiEye, FiEyeOff, FiLogIn, FiLoader } from "react-icons/fi";
import { FaLock } from "react-icons/fa";

// Component is renamed to better reflect its function and style
export default function CyberpunkLoginCard() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      login(res.data);
      navigate("/");
    } catch (err) {
      alert("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  // Animated particle background (Kept as is - it's already great!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 100;
    // Define a subtle neon blue color palette for the particles
    const particleColor = `hsl(${Math.random() * 60 + 220}, 70%, 60%)`;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1, // Reduced opacity for subtlety
        color: particleColor
      });
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="login-canvas" />

      <div className="login-card">
        <h1 className="gradient-text">
          <FaLock style={{ marginRight: '10px' }} /> Access MyTube
        </h1>
        <p className="sub-text">
          Authenticate to your secure network terminal.
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="user@neoncity.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            <span className="shimmer-effect" />
            <span className="button-content">
              {loading ? (
                <>
                  <FiLoader className="spinner" /> AUTHENTICATING...
                </>
              ) : (
                <>
                  <FiLogIn /> Sign In
                </>
              )}
            </span>
          </button>
        </form>

        <p className="footer-text">
          No account found?{" "}
          <a href="/signup" className="signup-link">
            Initiate new user protocol
          </a>
        </p>

        <p className="security-note">
          <FaLock style={{ verticalAlign: 'middle' }} /> Connection secured with 256-bit encryption.
        </p>
      </div>

      {/* Styled-JSX block for modern, clean CSS */}
      <style jsx>{`
        /* Global Styles for theme */
        :root {
          --dark-bg: #0d0d1a;
          --card-bg: rgba(20, 20, 40, 0.9);
          --neon-blue: #a8edea;
          --neon-pink: #fed6e3;
          --primary-gradient: linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #ffecd2 100%);
          --button-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          --shadow-base: rgba(0, 0, 0, 0.5);
          --glow-blue: 0 0 15px rgba(168, 237, 234, 0.3), 0 0 5px rgba(168, 237, 234, 0.1);
          --glow-pink: 0 0 15px rgba(254, 214, 227, 0.3), 0 0 5px rgba(254, 214, 227, 0.1);
        }

        /* Container and Canvas */
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--dark-bg);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .login-canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }

        /* Card Styles (Glassmorphism/Cyberpunk) */
        .login-card {
          position: relative;
          z-index: 10;
          background: var(--card-bg);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 50px 40px;
          width: 420px;
          max-width: 90vw;
          box-shadow: 
            0 25px 50px -12px var(--shadow-base),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: white;
          text-align: center;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Typography */
        .gradient-text {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 10px;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.05em;
          line-height: 1.1;
          text-shadow: 0 0 10px rgba(168, 237, 234, 0.2);
        }

        .sub-text {
          font-size: 15px;
          margin-bottom: 35px;
          opacity: 0.7;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        /* Form Elements */
        .input-group {
          position: relative;
          margin-bottom: 25px;
          text-align: left;
        }

        .input-group label {
          position: absolute;
          top: -10px;
          left: 15px;
          font-size: 12px;
          font-weight: 700;
          color: var(--neon-blue);
          background: #0d0d1a;
          padding: 0 8px;
          border-radius: 4px;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 2;
          text-transform: uppercase;
        }

        .input-group input {
          width: 100%;
          padding: 18px 20px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(40, 40, 70, 0.4);
          color: white;
          font-size: 16px;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-group input:focus {
          border-color: var(--neon-blue);
          box-shadow: var(--glow-blue);
          background: rgba(40, 40, 70, 0.6);
          transform: translateY(-1px);
        }

        .input-group input::placeholder {
          color: rgba(255, 255, 255, 0.3);
          font-weight: 300;
        }

        /* Password Toggle */
        .password-group {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(calc(-50% + 5px)); /* Adjusted due to padding/label */
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 20px;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .password-toggle:hover {
          color: var(--neon-pink);
          box-shadow: 0 0 10px rgba(254, 214, 227, 0.2);
        }

        /* Submit Button */
        .submit-button {
          width: 100%;
          padding: 16px;
          background: var(--button-gradient);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 15px 30px rgba(102, 126, 234, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.2),
            0 0 15px rgba(240, 147, 251, 0.5); /* Neon button glow */
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-button:hover:not(.loading) {
          transform: translateY(-3px);
          box-shadow: 
            0 25px 45px rgba(102, 126, 234, 0.5),
            0 8px 20px rgba(0, 0, 0, 0.3),
            0 0 25px rgba(240, 147, 251, 0.7);
        }

        .submit-button.loading {
          opacity: 0.9;
          cursor: not-allowed;
          background: #3e2060; /* Solid color while loading */
        }
        
        .submit-button .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        }
        
        .submit-button svg {
            margin-right: 8px;
            font-size: 1.1em;
        }

        /* Shimmer Effect for Button */
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s;
          z-index: 1;
        }
        
        .submit-button:hover:not(.loading) .shimmer-effect {
            left: 150%; /* Shimmer slides on hover */
        }
        
        .submit-button.loading .shimmer-effect {
             animation: shimmer 1.5s infinite linear;
        }

        /* Footer and Link */
        .footer-text {
          margin-top: 30px;
          font-size: 13px;
          opacity: 0.7;
          font-weight: 500;
        }

        .signup-link {
          color: var(--neon-blue);
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          text-shadow: var(--glow-blue);
        }

        .signup-link:hover {
          color: var(--neon-pink);
          text-shadow: var(--glow-pink);
        }
        
        .security-note {
            margin-top: 15px;
            font-size: 11px;
            opacity: 0.5;
            font-weight: 500;
            color: var(--neon-blue);
        }

        /* Keyframe Animations */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shimmer {
          0% { left: -150%; }
          100% { left: 150%; }
        }
        
        @keyframes spinner {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .spinner {
            animation: spinner 1s linear infinite;
        }
      `}</style>
    </div>
  );
}