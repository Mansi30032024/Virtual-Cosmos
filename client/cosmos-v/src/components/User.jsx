const avatars = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=3",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=4",
];

function User({ user, isMe, isNearby, id }) {
  const avatar = isMe
    ? avatars[0]
    : avatars[
        id.split("").reduce((a, b) => a + b.charCodeAt(0), 0) %
          avatars.length
      ];

  return (
    <div
      style={{
        position: "absolute",
        left: user.x,
        top: user.y,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: isNearby ? "6px solid #22c55e" : "2px solid white",
          boxShadow: isNearby ? "0 0 25px #22c55e" : "",
          overflow: "hidden",
        }}
      >
        <img src={avatar} style={{ width: "100%", height: "100%" }} />
      </div>

      <div style={{ color: "white", marginTop: 5 }}>
        {isMe ? "You" : id.slice(0, 4)}
      </div>
    </div>
  );
}

export default User;