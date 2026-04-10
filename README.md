# Ticket Topple - Real-Time Multiplayer Web Game

## Folder Structure
```
tiki-topple/
├── app/                # Next.js App Router (Frontend)
│   ├── globals.css     # Global styles (Tailwind 4)
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main game page
├── components/         # React Components
│   ├── ui/             # Shadcn UI components
│   ├── action-card.tsx # Power card component
│   ├── game-setup.tsx  # Initial setup (Mode/Room)
│   ├── tiki-stack.tsx  # Totem board component
│   └── tiki-topple-game.tsx # Main game controller
├── hooks/
│   └── use-game.ts     # Core game logic & socket sync
├── lib/
│   ├── game-types.ts   # Interfaces & Constants
│   └── socket.ts       # Socket.io client setup
├── public/             # Assets (board.png, icons)
├── server/             # Node.js + Socket.io (Backend)
│   └── server.js       # Real-time game server
├── package.json        
└── postcss.config.mjs
```

## Setup & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Backend Server**:
   ```bash
   node server/server.js
   ```
   *The server runs on `http://localhost:3001`.*

3. **Run Frontend**:
   ```bash
   npm run dev
   ```
   *The app runs on `http://localhost:3000`.*

## Deployment Steps

### Backend (Render or Railway)
1. Push your code to a GitHub repository.
2. Create a new "Web Service" on **Render**.
3. Point to the `server/server.js` (or use a start script: `node server/server.js`).
4. Set Environment Variables:
   - `PORT=3001`
5. Note the deployment URL (e.g., `https://tiki-topple-backend.onrender.com`).

### Frontend (Vercel)
1. Create a new project on **Vercel**.
2. Connect your GitHub repository.
3. Set Environment Variables:
   - `NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com`
4. Deploy!

## How to Play
1. **Setup**: Enter your name and choose a side.
2. **Mode**: 
   - **Bot**: Play against a simple AI.
   - **Online**: Create a room with a password or join a friend using their Room ID.
3. **Gameplay**: 
   - Pick a card from your hand on the right.
   - Tap a Tiki on the board to move it.
   - Goal: Get your secret Tikis into the top 3 spots before the round ends!
