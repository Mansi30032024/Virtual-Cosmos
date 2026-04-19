# Orbit Office Client

This is the Vite + React frontend for Orbit Office.

## Features

- Login screen with tab-specific display names
- Shared office map with live user movement
- Zone-based chat UI
- Generated avatars
- Responsive office layout scaling

## Main Files

- `src/App.jsx`: login flow and app entry
- `src/components/Cosmos.jsx`: office map, movement, zones, layout
- `src/components/Chat.jsx`: zone chat panel
- `src/components/User.jsx`: avatar and user rendering
- `src/socket.js`: Socket.IO client connection

## Scripts

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

## Development Notes

- User names are stored in `sessionStorage` so each tab can use a different identity.
- The frontend currently connects to the deployed backend URL configured in `src/socket.js`.
