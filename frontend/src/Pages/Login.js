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


import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SAME STYLES (INLINE)
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f7f7f7",
    },
    card: {
      background: "#fff",
      padding: "35px",
      width: "380px",
      borderRadius: "14px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
      textAlign: "center",
    },
    heading: {
      marginBottom: "5px",
      fontSize: "24px",
      fontWeight: "bold",
    },
    subText: {
      fontSize: "14px",
      marginBottom: "20px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      marginBottom: "15px",
      fontSize: "15px",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#ff0000",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.2s",
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      login(res.data); // Save user + token
      alert("Login successful 🎉");

      navigate("/"); // Redirect to home page

    } catch (err) {
      alert("Invalid email or password ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🔐 Login</h2>
        <p style={styles.subText}>
          Don't have an account? <a href="/signup">Create one</a>
        </p>

        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = "#cc0000")}
            onMouseOut={(e) => (e.target.style.background = "#ff0000")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
