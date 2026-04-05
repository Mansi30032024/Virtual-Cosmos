# 🌌 Virtual Cosmos

A real-time interactive virtual space where users can move around and communicate with nearby users using proximity-based chat.

Virtual Cosmos is a multiplayer web application that simulates a shared digital environment. Users can navigate freely using keyboard controls, and when they come close to other users, they can interact through a real-time chat system.
This project demonstrates real-time communication, spatial interaction, and modern UI design using web technologies.


## Features

* Real-time user movement (arrow keys)
*  Multiple users connected simultaneously
*  Proximity-based interaction (radius detection)
*  Real-time chat system (only when users are nearby)
*  Visual indicators (glowing border for nearby users)
*  Clean and modern UI
*  Instant updates using WebSockets


##  How It Works

1. Each user is assigned a position (x, y) in a shared space.
2. Movement is handled using keyboard arrow keys.
3. The frontend continuously sends updated positions to the server.
4. The server broadcasts all user positions to every connected client.
5. Distance between users is calculated.
6. If users are within a defined radius:
   * Chat is enabled
   * Visual indicators are shown
7. Messages are sent using Socket.io and displayed in real-time.

## Tech Stack

### Frontend

* React (Vite)
* JavaScript
* CSS (inline styling)

### Backend

* Node.js
* Express
* Socket.io

### Deployment

* Frontend: Vercel
* Backend: Render

---

##  Project Structure

```
virtual-cosmos/
│
├── client/
│   └── cosmos-v/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Cosmos.jsx
│       │   │   ├── User.jsx
│       │   │   └── Chat.jsx
│       │   ├── socket.js
│       │   └── main.jsx
│       └── package.json
│
├── server/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/Mansi30032024/Virtual-Cosmos.git
cd Virtual-Cosmos
```

---

### 2. Setup Backend

```
cd server
npm install
node index.js
```

Server runs on:

```
http://localhost:PORT
```

---

### 3. Setup Frontend

```
cd client/cosmos-v
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:PORT
```

---

##  How to Use

1. Open the app in two browser tabs.
2. Move users using arrow keys.
3. Bring users close to each other.
4. Chat panel will appear automatically.
5. Send messages in real-time.

---

##  Deployment

### Backend (Render)

* Deploy server using Node environment
* Use:

  ```
  process.env.PORT
  ```

### Frontend (Vercel)

---

##  Key Highlights

* Real-time synchronization using WebSockets
* Spatial interaction logic using distance calculation
* Clean UI with responsive layout
* Scalable architecture



##  Future Improvements

*  Voice calling (WebRTC)
*  When a user comes closer, a beep sound will play
*  Animated background (stars, particles)
*  Usernames and profiles
*  Mobile responsiveness
*  Map boundaries and collision detection

---

##  Author

**Mansi Arora**
B.E. CSE Student


⭐ If you like this project, feel free to star the repository!
