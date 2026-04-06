
import { useEffect, useState } from "react";
import { socket } from "../socket";

function Chat({ isConnected }) {
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
    const msg = { text: text, sender: socket.id };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  if (!isConnected) return null; // Only show chat if a nearby user

  return (
    <div style={styles.chatBox}>
      <div style={styles.header}>💬 Lets Connect!</div>

      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={styles.msg}>
            <b>{m.sender === socket.id ? "You" : "User"}:</b> {String(m.text)}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage} style={styles.button}>
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatBox: {
    position: "absolute",
    right: 0,
    top: 60,
    width: 420,
    height: "calc(100% - 100px)",
    background: "white",
    display: "flex",
    flexDirection: "column",
  },
  header: { padding: 15, fontSize: 18, fontWeight: "bold", borderBottom: "1px solid #ddd" },
  messages: { flex: 1, overflowY: "auto", padding: 15, fontSize: 18 },
  msg: { marginBottom: 12 },
  inputRow: { display: "flex", borderTop: "1px solid #ddd" },
  input: { flex: 1, padding: 15, fontSize: 16, border: "none", outline: "none" },
  button: { padding: "0 20px", fontSize: 20, background: "#22c55e", color: "white", border: "none", cursor: "pointer" },
};

export default Chat;