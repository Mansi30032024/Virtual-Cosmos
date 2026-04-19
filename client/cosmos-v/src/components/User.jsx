const getAvatarUrl = (seed) =>
  `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed || "orbit-office-user")}&backgroundType=gradientLinear`;

function User({ user, isMe, isNearby, id }) {
  const displayName = user?.name || id.slice(0, 4);
  const avatarUrl = getAvatarUrl(`${id}-${displayName}`);

  return (
    <div
      style={{
        position: "absolute",
        left: user?.x ?? 0,
        top: user?.y ?? 0,
        width: 110,
        textAlign: "center",
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          margin: "0 auto",
          borderRadius: "50%",
          border: isNearby ? "4px solid #10b981" : "3px solid rgba(255,255,255,0.92)",
          boxShadow: isNearby ? "0 0 0 7px rgba(16, 185, 129, 0.16)" : "0 12px 24px rgba(15, 23, 42, 0.12)",
          overflow: "hidden",
          background: "#dbeafe",
        }}
      >
        <img
          src={avatarUrl}
          alt={displayName}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          marginTop: 8,
          padding: "6px 10px",
          borderRadius: 14,
          background: "rgba(255, 255, 255, 0.92)",
          color: "#0f172a",
          fontWeight: 700,
          fontSize: 13,
          lineHeight: 1.2,
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "0 8px 16px rgba(148, 163, 184, 0.12)",
        }}
      >
        {isMe ? `You (${displayName})` : displayName}
      </div>
    </div>
  );
}

export default User;
