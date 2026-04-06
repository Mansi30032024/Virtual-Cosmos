🌌 Virtual Cosmos

A real-time interactive virtual space where users move around and communicate with nearby users using proximity-based chat and sound notifications.

Virtual Cosmos is a multiplayer web application simulating a shared digital environment. Users navigate freely using keyboard controls, and when they come close to other users, they can interact through a real-time chat system.

This project demonstrates real-time communication, spatial interaction, proximity logic, sound alerts, and modern UI design using web technologies.

## Features
• Real-time movement using arrow keys
• Multiple users connected simultaneously
• Proximity-based interaction (radius detection)
• Real-time chat system (enabled only for nearby users)
• Sound notifications:
   ding.mp3 → triggers when a user enters your radius
   message.mp3 → triggers when a new message is received
• Visual indicators: glowing border for nearby users
• Clean and modern UI
• Instant updates using Socket.io (WebSockets)
 
## How It Works
• Each user is assigned a position (x, y) in a shared space.
• Movement is handled using keyboard arrow keys.
• The frontend continuously sends updated positions to the server.
• The server broadcasts all user positions to every connected client.
• Distance between users is calculated.
• If users are within a defined radius:
• Chat is enabled
• Visual indicators are shown
   ding.mp3 plays once when a user enters
• Messages are sent using Socket.io and displayed in real-time, with message.mp3 alerts.


#### Tech Stack

## Frontend

‣ React (Vite)
‣ JavaScript
‣ CSS (inline styling)
‣ Audio API for sound notifications

## Backend

‣ Node.js
‣ Express
‣ Socket.io

## Deployment

◉ Frontend: Netlify / Vercel
◉ Backend: Render
 
## Project Structure
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
│       ├── public/
│       │   ├── ding.mp3
│       │   └── message.mp3
│       └── package.json
│
├── server/
│   ├── index.js
│   └── package.json
│
└── README.md


## Installation & Setup

1. Clone the repository
    git clone https://github.com/Mansi30032024/Virtual-Cosmos.git
    cd Virtual-Cosmos
2. Setup Backend
    cd server
    npm install
    node index.js

Server runs on:
http://localhost:PORT

◉ Use process.env.PORT when deploying on Render.

3. Setup Frontend
    cd client/cosmos-v
    npm install
    npm run dev

## Frontend runs on:
   http://localhost:PORT2

◉ Ensure your socket.js points to the backend deployed URL when running on Netlify/Vercel:

import { io } from "socket.io-client";
export const socket = io("https://your-backend.onrender.com");

## How to Use

▪ Open the app in two or more browser tabs
▪ Move users using arrow keys
▪ Bring users close to each other
▪ Chat panel appears automatically
▪ Send messages in real-time
▪ Listen for sounds: ding for nearby users, message for chat

## Deployment

Backend (Render)
 Deploy server using Node environment
 Make sure .env contains the PORT variable

Frontend (Netlify / Vercel)
  Build the frontend
  Ensure socket.js uses the backend URL
  
## Key Highlights
▪ Real-time synchronization using WebSockets
▪ Spatial interaction logic using distance calculation
▪ Sound notifications for chat and proximity
▪ Clean UI with responsive layout
▪ Scalable architecture

## Future Improvements
▪ Voice calling using WebRTC
▪ Animated background (stars, particles)
▪ Usernames, profiles, and avatars
▪ Mobile responsiveness
▪ Map boundaries and collision detection


#### Author

Mansi Arora
B.E. CSE Student

⭐ If you like this project, feel free to star the repository!
