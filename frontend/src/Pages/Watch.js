import React from "react";
import { useParams } from "react-router-dom";

export default function Watch() {
  const { filename } = useParams();

  const videoURL = `http://localhost:5000/api/stream/${filename}`;

  return (
    <div style={{ padding: 20 }}>
      <h2>Now Playing</h2>

      <video
        width="720"
        controls
        autoPlay
        src={videoURL}
        style={{ borderRadius: "10px", backgroundColor: "#000" }}
      ></video>

      <p style={{ marginTop: 10 }}>Streaming: {filename}</p>
    </div>
  );
}
