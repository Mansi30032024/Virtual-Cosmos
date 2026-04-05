import { useEffect, useState } from "react";
import { socket } from "../socket";
import User from "./User";
import Chat from "./Chat";

const RADIUS = 150;

const getDistance = (a, b) => {
  if (!a || !b) return Infinity;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

function Cosmos() {
  const [pos, setPos] = useState({ x: 300, y: 200 });
  const [users, setUsers] = useState({});

  useEffect(() => {
    const handleKey = (e) => {
      setPos((prev) => {
        let p = { ...prev };
        if (e.key === "ArrowUp") p.y -= 15;
        if (e.key === "ArrowDown") p.y += 15;
        if (e.key === "ArrowLeft") p.x -= 15;
        if (e.key === "ArrowRight") p.x += 15;
        return p;
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    socket.emit("move", pos);
  }, [pos]);

  useEffect(() => {
    const handler = (data) => setUsers(data);
    socket.on("updateUsers", handler);
    return () => socket.off("updateUsers", handler);
  }, []);

  const nearby = Object.entries(users).filter(([id, u]) => {
    if (id === socket.id) return false;
    return getDistance(pos, u) < RADIUS;
  });

  const isConnected = nearby.length > 0;

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        ⚙️
        <div>🌌 Virtual Cosmos</div>
        <div>📞 🔊</div>
      </div>

      {/* GRID */}
      <div style={styles.grid} />

      {/* RADIUS */}
      {socket.id && (
        <div
          style={{
            ...styles.radius,
            left: pos.x - RADIUS / 2,
            top: pos.y - RADIUS / 2,
          }}
        />
      )}

      {/* USERS */}
      {Object.entries(users).map(([id, user]) => (
        <User
          key={id}
          id={id}
          user={user}
          isMe={id === socket.id}
          isNearby={id !== socket.id && getDistance(pos, user) < RADIUS}
        />
      ))}

      <Chat isConnected={isConnected} />

      {/* FOOTER */}
      <div style={styles.footer}>
        Move with arrow keys 🚀 | Come close to chat 💬
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "radial-gradient(circle, #0f172a, #020617)",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "white",
    background: "rgba(0,0,0,0.5)",
  },
  grid: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
  },
  radius: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: "50%",
    border: "2px dashed #22c55e",
    opacity: 0.3,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 40,
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.5)",
  },
};

export default Cosmos;