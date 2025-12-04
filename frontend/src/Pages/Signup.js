import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SAME STYLE AS LOGIN
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
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful 🎉");
      navigate("/login");

    } catch (err) {
      alert("Registration failed. Email may already exist.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📝 Create Account</h2>

        <form onSubmit={handleSignup}>
          <input
            style={styles.input}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "12px" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
