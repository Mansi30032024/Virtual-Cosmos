# Orbit Office

Orbit Office is a real-time remote office simulation built with React, Node.js, Express, and Socket.IO.
Users join with a tab-specific display name, move around a shared office, and chat in collaboration-friendly spaces.

## What It Does

- Shared multiplayer office with live movement updates
- Login screen with per-tab profile names
- Three office zones:
  - `Work Studio` for focused work
  - `Conference Suite` for team collaboration
  - `Break Lounge` for casual conversation
- Chat enabled in collaboration spaces only
- Real-time presence and messaging with Socket.IO
- Generated avatars and light office-style UI

## Project Structure

```text
Virtual-Cosmos/
  client/
    cosmos-v/
      src/
        components/
          Chat.jsx
          Cosmos.jsx
          User.jsx
        App.jsx
        socket.js
      public/
      package.json
  server/
    index.js
    package.json
  README.md
```

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express, Socket.IO
- Realtime: Socket.IO client/server

## Run Locally

### Server

```powershell
cd server
npm install
node index.js
```

The server uses `PORT` from `server/.env` and defaults to `5000`.

### Client

```powershell
cd client/cosmos-v
npm install
npm run dev
```

The current frontend socket connection is configured in `client/cosmos-v/src/socket.js`.

## Current Office Behavior

1. Open the app in one or more browser tabs.
2. Enter a display name on the login screen.
3. Move with the arrow keys.
4. Chat is available in:
   - `Conference Suite`
   - `Break Lounge`
5. `Work Studio` stays a quiet zone.

## Notes

- Names are stored in `sessionStorage`, so each browser tab can act as a different person.
- The server keeps user positions in memory.
- There is no persistent database yet.

## Scripts

### Client

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```powershell
node index.js
```

## Future Ideas

- Seat snapping and smarter collision spacing
- Private rooms or team rooms
- Click-to-move navigation
- Status indicators like `Available`, `Busy`, and `In Meeting`
