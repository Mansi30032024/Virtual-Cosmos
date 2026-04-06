import { useEffect, useState, useRef } from "react";
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

  const nearbySound = useRef(new Audio("/ding.mp3"));      // user nearby
  const messageSound = useRef(new Audio("/message.mp3"));  // message received
  const prevNearbyRef = useRef(false);                     // track previous nearby status

  // Movement
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

  // Send position to server
  useEffect(() => {
    socket.emit("move", pos);
  }, [pos]);

  // Receive all users
  useEffect(() => {
    const handler = (data) => setUsers(data);
    socket.on("updateUsers", handler);
    return () => socket.off("updateUsers", handler);
  }, []);

  // Play ding sound when a user enters nearby radius
  useEffect(() => {
    const nearby = Object.entries(users).some(
      ([id, u]) => id !== socket.id && getDistance(pos, u) < RADIUS
    );

    if (nearby && !prevNearbyRef.current) {
      nearbySound.current.currentTime = 0;
      nearbySound.current.play().catch(() => {});
    }

    prevNearbyRef.current = nearby; // update ref, no state update needed
  }, [users, pos]);

  // Play message sound when a message is received
  useEffect(() => {
    const handleMessage = (msg) => {
      if (!msg || typeof msg !== "object") return;
      if (typeof msg.text !== "string") return;

      messageSound.current.currentTime = 0;
      messageSound.current.play().catch(() => {});
    };
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, []);

  // Compute if chat should show
  const isNearbyUser = Object.entries(users).some(
    ([id, u]) => id !== socket.id && getDistance(pos, u) < RADIUS
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>🌌 Virtual Cosmos</div>
      <div style={styles.grid} />

      {socket.id && (
        <div
          style={{
            ...styles.radius,
            left: pos.x - RADIUS / 2,
            top: pos.y - RADIUS / 2,
          }}
        />
      )}

      {Object.entries(users).map(([id, user]) => (
        <User
          key={id}
          id={id}
          user={user}
          isMe={id === socket.id}
          isNearby={id !== socket.id && getDistance(pos, user) < RADIUS}
        />
      ))}

      <Chat isConnected={isNearbyUser} />

      <div style={styles.footer}>Move with arrow keys 🚀</div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "radial-gradient(circle, #0f172a, #020617)",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
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
    width: RADIUS,
    height: RADIUS,
    borderRadius: "50%",
    border: "3px dashed #22c55e",
    opacity: 0.4,
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