import { useEffect, useState } from "react";
import { socket } from "../socket";

function Chat({ isConnected }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const send = () => {
    if (!msg.trim()) return;
    socket.emit("sendMessage", msg);
    setMsg("");
  };

  // ✅ ENTER KEY SUPPORT
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      send();
    }
  };

  if (!isConnected) return null;

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        💬 Nearby Chat
      </div>

      {/* MESSAGES */}
      <div style={styles.messages}>
        <div style={styles.welcome}>
          Welcome to Virtual Cosmos 🌌
        </div>

        {messages.map((m, i) => {
          const isMe = m.id === socket.id;
          return (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#22c55e" : "#e5e7eb",
                color: isMe ? "white" : "black",
              }}
            >
              {!isMe && (
                <div style={styles.username}>
                  {m.id.slice(0, 4)}
                </div>
              )}
              {m.text}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown} // ✅ ENTER
          placeholder="Type message..."
          style={styles.input}
        />
        <button onClick={send} style={styles.button}>
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    right: 0,
    top: 60,
    width: 380, // slightly bigger
    height: "calc(100% - 60px)",
    background: "rgba(255,255,255,0.98)",
    display: "flex",
    flexDirection: "column",
    borderLeft: "2px solid #ddd",
    boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
    zIndex: 10,
  },

  header: {
    padding: "14px",
    fontWeight: "bold",
    fontSize: 18, // bigger
    borderBottom: "1px solid #ddd",
    background: "#f9fafb",
  },

  messages: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 12,
    gap: 10,
    overflowY: "auto",
  },

  welcome: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },

  message: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 16, // ✅ BIGGER TEXT
    lineHeight: "1.4",
    wordBreak: "break-word",
  },

  username: {
    fontSize: 12, // bigger username
    fontWeight: "bold",
    marginBottom: 3,
    opacity: 0.7,
  },

  inputBox: {
    display: "flex",
    padding: 12,
    borderTop: "1px solid #ddd",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    border: "1px solid #ccc",
    fontSize: 15,
    outline: "none",
  },

  button: {
    padding: "0 18px",
    borderRadius: "50%",
    border: "none",
    background: "#22c55e",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
  },
};

export default Chat;