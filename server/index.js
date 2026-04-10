const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', ({ roomId, password, maxPlayers, playerName, playerColor }) => {
    if (rooms.has(roomId)) {
      socket.emit('error', 'Room already exists');
      return;
    }

    const roomData = {
      id: roomId,
      password,
      maxPlayers: parseInt(maxPlayers),
      players: [{
        id: socket.id,
        name: playerName,
        color: playerColor,
        isHost: true
      }],
      gameState: null,
      status: 'waiting'
    };

    rooms.set(roomId, roomData);
    socket.join(roomId);
    socket.emit('room-created', roomData);
    console.log(`Room created: ${roomId} by ${playerName}`);
  });

  socket.on('join-room', ({ roomId, password, playerName, playerColor }) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    if (room.password !== password) {
      socket.emit('error', 'Incorrect password');
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit('error', 'Room is full');
      return;
    }

    if (room.status !== 'waiting') {
      socket.emit('error', 'Game already started');
      return;
    }

    const newPlayer = {
      id: socket.id,
      name: playerName,
      color: playerColor,
      isHost: false
    };

    room.players.push(newPlayer);
    socket.join(roomId);
    
    io.to(roomId).emit('player-joined', room.players);
    socket.emit('room-joined', room);
    
    console.log(`Player ${playerName} joined room: ${roomId}`);

    if (room.players.length === room.maxPlayers) {
      room.status = 'starting';
      io.to(roomId).emit('game-ready', room);
    }
  });

  socket.on('start-game', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.players[0].id === socket.id) {
      room.status = 'playing';
      io.to(roomId).emit('game-started', room);
    }
  });

  socket.on('player-move', ({ roomId, gameState }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.gameState = gameState;
      socket.to(roomId).emit('opponent-move', gameState);
    }
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('player-left', room.players);
          // If host left, assign new host
          if (playerIndex === 0 && room.players.length > 0) {
            room.players[0].isHost = true;
            io.to(roomId).emit('new-host', room.players[0].id);
          }
        }
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
