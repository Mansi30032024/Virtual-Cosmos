import { useState } from "react";
import Cosmos from "./components/Cosmos";

const STORAGE_KEY = "orbit-office-name";

function LoginScreen({ onJoin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    sessionStorage.setItem(STORAGE_KEY, trimmed);
    onJoin(trimmed);
  };

  return (
    <div style={styles.shell}>
      <div style={styles.panel}>
        <div style={styles.kicker}>Remote Workplace</div>
        <h1 style={styles.title}>Orbit Office</h1>
        <p style={styles.copy}>
          Join the workspace with your name and move between work, meeting, and lounge areas.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="display-name" style={styles.label}>
            Display name
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={styles.input}
            maxLength={24}
            autoFocus
          />
          <button type="submit" style={styles.button}>
            Enter Office
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [displayName, setDisplayName] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");

  if (!displayName) {
    return <LoginScreen onJoin={setDisplayName} />;
  }

  return <Cosmos displayName={displayName} />;
}

const styles = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background:
      "radial-gradient(circle at top, #1e293b 0%, #0f172a 48%, #020617 100%)",
  },
  panel: {
    width: "min(480px, 100%)",
    padding: 36,
    borderRadius: 32,
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    boxShadow: "0 30px 80px rgba(2, 6, 23, 0.4)",
    color: "white",
  },
  kicker: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color: "#93c5fd",
  },
  title: {
    margin: "10px 0 12px",
    fontSize: 42,
    lineHeight: 1,
  },
  copy: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },
  form: {
    marginTop: 28,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#e2e8f0",
  },
  input: {
    height: 52,
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(2, 6, 23, 0.65)",
    color: "white",
    padding: "0 16px",
    fontSize: 16,
    outline: "none",
  },
  button: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    border: "none",
    background: "#0ea5e9",
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default App;
