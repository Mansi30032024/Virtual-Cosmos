import { useEffect, useState } from "react";
import { socket } from "../socket";

function Chat({ isEnabled, zoneName, occupantCount }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const handleMessage = (msg) => {
      if (!msg || typeof msg !== "object") return;
      if (typeof msg.text !== "string") return;

      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", { text, sender: socket.id });
    setText("");
  };

  if (!isEnabled) return null;

  return (
    <div style={styles.chatBox}>
      <div style={styles.header}>
        <div style={styles.title}>Office Chat</div>
        <div style={styles.subHeader}>
          {zoneName} | {occupantCount} people
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={styles.msg}>
            <div style={styles.msgSender}>
              {m.sender === socket.id ? "You" : m.senderName || "Team"}
            </div>
            <div style={styles.msgBody}>{String(m.text)}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatBox: {
    position: "absolute",
    right: 28,
    top: 96,
    width: 390,
    height: 430,
    background: "rgba(255, 255, 255, 0.96)",
    color: "#0f172a",
    display: "flex",
    flexDirection: "column",
    borderRadius: 28,
    border: "1px solid rgba(148, 163, 184, 0.24)",
    boxShadow: "0 28px 60px rgba(148, 163, 184, 0.24)",
    overflow: "hidden",
  },
  header: {
    padding: 20,
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
    background: "linear-gradient(180deg, #ffffff, #f8fafc)",
  },
  title: {
    fontSize: 19,
    fontWeight: 800,
  },
  subHeader: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 18,
    background: "#f8fafc",
  },
  msg: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    background: "white",
    border: "1px solid rgba(148, 163, 184, 0.14)",
  },
  msgSender: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0369a1",
    marginBottom: 5,
  },
  msgBody: {
    fontSize: 15,
    lineHeight: 1.45,
    color: "#0f172a",
  },
  inputRow: {
    display: "flex",
    borderTop: "1px solid rgba(148, 163, 184, 0.18)",
    background: "white",
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 15,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
  },
  button: {
    padding: "0 22px",
    fontSize: 14,
    fontWeight: 700,
    background: "#0ea5e9",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Chat;
