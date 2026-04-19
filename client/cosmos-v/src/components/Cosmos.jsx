import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import User from "./User";
import Chat from "./Chat";

const WORLD_WIDTH = 1340;
const WORLD_HEIGHT = 900;
const AVATAR_SIZE = 92;
const STEP = 18;

const OFFICE_AREAS = [
  {
    id: "work",
    label: "Work Studio",
    subtitle: "Deep work desks | quiet zone",
    x: 40,
    y: 120,
    width: 510,
    height: 350,
    accent: "#0ea5e9",
    fill: "linear-gradient(135deg, rgba(224, 242, 254, 0.96), rgba(186, 230, 253, 0.86))",
  },
  {
    id: "meeting",
    label: "Conference Suite",
    subtitle: "Collab table | chat enabled",
    x: 600,
    y: 120,
    width: 700,
    height: 350,
    accent: "#10b981",
    fill: "linear-gradient(135deg, rgba(236, 253, 245, 0.96), rgba(187, 247, 208, 0.88))",
  },
  {
    id: "lounge",
    label: "Break Lounge",
    subtitle: "Coffee break | chat enabled",
    x: 140,
    y: 540,
    width: 1060,
    height: 280,
    accent: "#f59e0b",
    fill: "linear-gradient(135deg, rgba(255, 251, 235, 0.96), rgba(254, 215, 170, 0.86))",
  },
];

const CHAT_ENABLED_ZONES = new Set(["meeting", "lounge"]);

const WORK_DESKS = [
  { label: "Desk 1", x: 155, y: 255 },
  { label: "Desk 2", x: 390, y: 255 },
  { label: "Desk 3", x: 155, y: 395 },
  { label: "Desk 4", x: 390, y: 395 },
];

const LOUNGE_SPOTS = [
  { label: "Lounge 1", x: 360, y: 695 },
  { label: "Lounge 2", x: 670, y: 695 },
  { label: "Lounge 3", x: 980, y: 695 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getAreaForPosition = (pos) =>
  OFFICE_AREAS.find(
    (area) =>
      pos.x >= area.x &&
      pos.x <= area.x + area.width &&
      pos.y >= area.y &&
      pos.y <= area.y + area.height
  ) || null;

const getDistance = (a, b) => {
  if (!a || !b) return Infinity;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

function Cosmos({ displayName }) {
  const [pos, setPos] = useState({ x: 190, y: 285 });
  const [users, setUsers] = useState({});
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : WORLD_WIDTH,
    height: typeof window !== "undefined" ? window.innerHeight : WORLD_HEIGHT,
  });

  const nearbySound = useRef(new Audio("/ding.mp3"));
  const messageSound = useRef(new Audio("/message.mp3"));
  const prevNearbyRef = useRef(false);

  const currentArea = getAreaForPosition(pos);
  const activeZoneUsers = Object.entries(users).filter(([, user]) =>
    CHAT_ENABLED_ZONES.has(getAreaForPosition(user)?.id)
  );
  const isChatZone = CHAT_ENABLED_ZONES.has(currentArea?.id);
  const scale = Math.min(
    (viewport.width - 48) / WORLD_WIDTH,
    (viewport.height - 120) / WORLD_HEIGHT,
    1
  );

  useEffect(() => {
    socket.emit("registerUser", { name: displayName });
  }, [displayName]);

  useEffect(() => {
    const handleKey = (e) => {
      setPos((prev) => {
        const next = { ...prev };
        if (e.key === "ArrowUp") next.y -= STEP;
        if (e.key === "ArrowDown") next.y += STEP;
        if (e.key === "ArrowLeft") next.x -= STEP;
        if (e.key === "ArrowRight") next.x += STEP;

        if (next.x === prev.x && next.y === prev.y) return prev;

        return {
          x: clamp(next.x, AVATAR_SIZE / 2, WORLD_WIDTH - AVATAR_SIZE / 2),
          y: clamp(next.y, 96 + AVATAR_SIZE / 2, WORLD_HEIGHT - 60),
        };
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    socket.emit("move", pos);
  }, [pos]);

  useEffect(() => {
    const handler = (data) => setUsers(data);
    socket.on("updateUsers", handler);
    return () => socket.off("updateUsers", handler);
  }, []);

  useEffect(() => {
    const nearby = Object.entries(users).some(
      ([id, user]) => id !== socket.id && getDistance(pos, user) < 150
    );

    if (nearby && !prevNearbyRef.current) {
      nearbySound.current.currentTime = 0;
      nearbySound.current.play().catch(() => {});
    }

    prevNearbyRef.current = nearby;
  }, [users, pos]);

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Remote Office Simulation</div>
          <div style={styles.title}>Orbit Office</div>
        </div>
        <div style={styles.headerMeta}>
          <div style={styles.metaCard}>
            <span style={styles.metaLabel}>Profile</span>
            <strong>{`You (${displayName})`}</strong>
          </div>
          <div style={styles.metaCard}>
            <span style={styles.metaLabel}>Current zone</span>
            <strong>{currentArea?.label || "Hallway"}</strong>
          </div>
          <div style={styles.metaCard}>
            <span style={styles.metaLabel}>Mode</span>
            <strong>{isChatZone ? "Social" : "Focus"}</strong>
          </div>
        </div>
      </div>

      <div style={styles.worldFrame}>
        <div
          style={{
            ...styles.world,
            transform: `scale(${scale})`,
          }}
        >
          <div style={styles.grid} />

          {OFFICE_AREAS.map((area) => (
            <div key={area.id}>
              <div
                style={{
                  ...styles.areaTitle,
                  left: area.x,
                  top: area.y - 58,
                  color: area.accent,
                }}
              >
                {area.label}
              </div>
              <div
                style={{
                  ...styles.areaSubtitle,
                  left: area.x,
                  top: area.y - 28,
                }}
              >
                {area.subtitle}
              </div>
              <div
                style={{
                  ...styles.areaCard,
                  left: area.x,
                  top: area.y,
                  width: area.width,
                  height: area.height,
                  borderColor: area.accent,
                  background: area.fill,
                  boxShadow:
                    currentArea?.id === area.id
                      ? `0 0 0 3px ${area.accent} inset, 0 18px 36px rgba(148, 163, 184, 0.2)`
                      : "0 18px 36px rgba(148, 163, 184, 0.14)",
                }}
              />
            </div>
          ))}

          {WORK_DESKS.map((desk) => (
            <div key={desk.label}>
              <div
                style={{
                  ...styles.itemLabel,
                  left: desk.x,
                  top: desk.y - 64,
                }}
              >
                {desk.label}
              </div>
              <div
                style={{
                  ...styles.desk,
                  left: desk.x,
                  top: desk.y,
                }}
              />
            </div>
          ))}

          <div style={{ ...styles.itemLabel, left: 900, top: 270 - 82 }}>
            Discussion Table
          </div>
          <div style={styles.meetingTable} />

          {LOUNGE_SPOTS.map((spot) => (
            <div key={spot.label}>
              <div
                style={{
                  ...styles.itemLabel,
                  left: spot.x,
                  top: spot.y - 68,
                }}
              >
                {spot.label}
              </div>
              <div
                style={{
                  ...styles.loungeSeat,
                  left: spot.x,
                  top: spot.y,
                }}
              />
            </div>
          ))}

          {Object.entries(users).map(([id, user]) => (
            <User
              key={id}
              id={id}
              user={user}
              isMe={id === socket.id}
              isNearby={id !== socket.id && getDistance(pos, user) < 150}
            />
          ))}
        </div>
      </div>

      <Chat
        isEnabled={isChatZone}
        zoneName={currentArea?.label || "Shared Space"}
        occupantCount={activeZoneUsers.length}
      />

      <div style={styles.footer}>Use arrow keys to move through the office.</div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef6ff 36%, #e6f6ef 100%)",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 84,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#0f172a",
    padding: "0 24px",
    background: "rgba(255, 255, 255, 0.84)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color: "#0284c7",
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
  },
  headerMeta: {
    display: "flex",
    gap: 12,
  },
  metaCard: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 180,
    padding: "12px 16px",
    borderRadius: 18,
    background: "rgba(255, 255, 255, 0.82)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)",
  },
  metaLabel: {
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  worldFrame: {
    position: "absolute",
    inset: "84px 0 48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  world: {
    position: "relative",
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    transformOrigin: "center center",
    borderRadius: 36,
    overflow: "visible",
    background: "linear-gradient(180deg, #ffffff, #f8fafc)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 32px 80px rgba(148, 163, 184, 0.22)",
  },
  grid: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 36,
    backgroundImage:
      "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
    backgroundSize: "62px 62px",
  },
  areaCard: {
    position: "absolute",
    borderRadius: 34,
    border: "2px solid",
    boxSizing: "border-box",
    zIndex: 1,
  },
  areaTitle: {
    position: "absolute",
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.1,
    zIndex: 2,
  },
  areaSubtitle: {
    position: "absolute",
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    zIndex: 2,
  },
  itemLabel: {
    position: "absolute",
    transform: "translateX(-50%)",
    fontSize: 14,
    fontWeight: 700,
    color: "#334155",
    zIndex: 2,
  },
  desk: {
    position: "absolute",
    width: 150,
    height: 88,
    transform: "translate(-50%, -50%)",
    borderRadius: 24,
    background: "rgba(255, 255, 255, 0.94)",
    border: "1px solid rgba(14, 165, 233, 0.2)",
    boxShadow: "0 16px 26px rgba(14, 165, 233, 0.12)",
    zIndex: 1,
  },
  meetingTable: {
    position: "absolute",
    left: 900,
    top: 285,
    width: 300,
    height: 150,
    transform: "translate(-50%, -50%)",
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.96)",
    border: "2px solid rgba(16, 185, 129, 0.34)",
    boxShadow: "0 18px 36px rgba(16, 185, 129, 0.12)",
    zIndex: 1,
  },
  loungeSeat: {
    position: "absolute",
    width: 165,
    height: 92,
    transform: "translate(-50%, -50%)",
    borderRadius: 26,
    background: "rgba(255, 255, 255, 0.94)",
    border: "1px solid rgba(245, 158, 11, 0.24)",
    boxShadow: "0 18px 34px rgba(245, 158, 11, 0.12)",
    zIndex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 48,
    color: "#334155",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.84)",
    backdropFilter: "blur(10px)",
    fontSize: 14,
    padding: "0 18px",
    textAlign: "center",
    borderTop: "1px solid rgba(148, 163, 184, 0.18)",
  },
};

export default Cosmos;
