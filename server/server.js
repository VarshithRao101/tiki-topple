const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

const TOKEN_COLORS = [
  { color: '#E53935', name: 'Red Tiki' },
  { color: '#FF9800', name: 'Orange Tiki' },
  { color: '#FFEB3B', name: 'Yellow Tiki' },
  { color: '#4CAF50', name: 'Green Tiki' },
  { color: '#00BCD4', name: 'Teal Tiki' },
  { color: '#2196F3', name: 'Blue Tiki' },
  { color: '#9C27B0', name: 'Purple Tiki' },
  { color: '#E91E63', name: 'Pink Tiki' },
  { color: '#795548', name: 'Brown Tiki' },
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createPlayerDeck(playerId) {
  return shuffleArray([
    { id: `${playerId}-up1-1`, type: 'tiki-up', value: 1 },
    { id: `${playerId}-up1-2`, type: 'tiki-up', value: 1 },
    { id: `${playerId}-up2`, type: 'tiki-up', value: 2 },
    { id: `${playerId}-up3`, type: 'tiki-up', value: 3 },
    { id: `${playerId}-topple`, type: 'tiki-topple' },
    { id: `${playerId}-toast-1`, type: 'tiki-toast' },
    { id: `${playerId}-toast-2`, type: 'tiki-toast' },
  ]);
}

function initGame(players, mode = 'online') {
  const allTokens = TOKEN_COLORS.map((tc, i) => ({
function generateHand() {
  return [
    { id: uuidv4(), type: 'tiki-up', value: 1 },
    { id: uuidv4(), type: 'tiki-up', value: 1 },
    { id: uuidv4(), type: 'tiki-up', value: 2 },
    { id: uuidv4(), type: 'tiki-up', value: 3 },
    { id: uuidv4(), type: 'tiki-topple' },
    { id: uuidv4(), type: 'tiki-toast' },
    { id: uuidv4(), type: 'tiki-toast' },
  ];
}

function initGame(players, previousGameState = null) {
  const allTikiIds = TOKEN_COLORS.map((_, i) => `tiki-${i}`);
  const shuffledTikis = [...allTikiIds].sort(() => Math.random() - 0.5);
  
  const numPlayers = players.length;
  const tikisPerPlayer = Math.floor(9 / numPlayers);
  
  const assignments = [];
  for (let i = 0; i < numPlayers; i++) {
    const start = i * tikisPerPlayer;
    const end = start + tikisPerPlayer;
    assignments.push(shuffledTikis.slice(start, end));
  }

  const updatedPlayers = players.map((p, i) => ({
    ...p,
    score: previousGameState ? (previousGameState.players.find(oldP => oldP.id === p.id)?.score || 0) : 0,
    secretTikis: assignments[i]
  }));

  const playerHands = [];
  for (let i = 0; i < numPlayers; i++) {
    playerHands.push(generateHand());
  }

  return {
    stack: shuffledTikis.map(id => ({
      id,
      color: TOKEN_COLORS[parseInt(id.split('-')[1])].color,
      name: TOKEN_COLORS[parseInt(id.split('-')[1])].name,
    })),
    players: updatedPlayers,
    currentPlayerIndex: previousGameState ? (previousGameState.currentRound % numPlayers) : 0,
    turn: 1,
    gamePhase: 'playing',
    winner: null,
    selectedTokenIndex: null,
    selectedCard: null,
    playerHands,
    mode: 'online',
    currentRound: previousGameState ? (previousGameState.currentRound + 1) : 1,
    totalRounds: numPlayers
  };
}

function checkRoundEnd(gameState) {
  const cardsLeft = gameState.playerHands.some(hand => hand.length > 0);
  const tikisLeft = gameState.stack.length <= 3;

  if (tikisLeft || !cardsLeft) {
    // Round ended! Calculate scores
    const updatedPlayers = gameState.players.map(player => {
      let roundScore = 0;
      player.secretTikis.forEach(tikiId => {
        const pos = gameState.stack.findIndex(t => t.id === tikiId);
        if (pos !== -1 && pos < 3) {
          // Top 1-3 scores points specifically
          const points = [9, 5, 2]; // 1st = 9, 2nd = 5, 3rd = 2
          roundScore += points[pos];
        }
      });
      return { ...player, score: player.score + roundScore };
    });

    gameState.players = updatedPlayers;
    
    if (gameState.currentRound >= gameState.totalRounds) {
      gameState.gamePhase = 'ended';
      gameState.winner = [...updatedPlayers].sort((a, b) => b.score - a.score)[0];
    } else {
      gameState.gamePhase = 'roundEnded';
    }
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', ({ playerName, playerColor, password, numPlayers }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomId] = {
      password,
      requiredPlayers: numPlayers || 2,
      players: [{ id: socket.id, name: playerName, color: playerColor, socketId: socket.id }],
      gameState: null,
      mode: 'online'
    };
    socket.join(roomId);
    socket.emit('room-created', { roomId, password });
    console.log(`Room created: ${roomId} for ${numPlayers} players`);
  });

  socket.on('join-room', ({ roomId, password, playerName, playerColor }) => {
    const room = rooms[roomId];
    if (!room) {
      return socket.emit('error', 'Room not found');
    }
    if (room.password !== password) {
      return socket.emit('error', 'Invalid password');
    }
    if (room.players.length >= room.requiredPlayers) {
      return socket.emit('error', 'Room is full');
    }

    room.players.push({ id: socket.id, name: playerName, color: playerColor, socketId: socket.id });
    socket.join(roomId);
    console.log(`User ${playerName} joined room ${roomId}`);

    if (room.players.length === room.requiredPlayers) {
      room.gameState = initGame(room.players);
      io.to(roomId).emit('game-start', room.gameState);
    } else {
      socket.emit('waiting-for-opponent', { roomId, current: room.players.length, total: room.requiredPlayers });
      io.to(roomId).emit('room-update', { current: room.players.length, total: room.requiredPlayers });
    }
  });

  socket.on('player-move', ({ roomId, move }) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;

    const state = room.gameState;
    const playerIndex = state.players.findIndex(p => p.id === socket.id);
    
    if (playerIndex !== state.currentPlayerIndex) return;

    // Execute move logic
    const { card, tokenIndex } = move;
    let newStack = [...state.stack];
    
    if (card.type === 'tiki-up') {
      const moveAmount = Math.min(card.value || 1, tokenIndex);
      if (moveAmount > 0) {
        const [token] = newStack.splice(tokenIndex, 1);
        newStack.splice(tokenIndex - moveAmount, 0, token);
      }
    } else if (card.type === 'tiki-topple') {
      const [token] = newStack.splice(tokenIndex, 1);
      newStack.push(token);
    } else if (card.type === 'tiki-toast') {
      const toastIndex = tokenIndex !== null ? tokenIndex : newStack.length - 1;
      newStack.splice(toastIndex, 1);
    }

    state.stack = newStack;
    state.playerHands[playerIndex] = state.playerHands[playerIndex].filter(c => c.id !== card.id);
    state.selectedCard = null;
    state.selectedTokenIndex = null;

    checkRoundEnd(state);

    if (state.gamePhase === 'playing') {
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    }

    state.turn += 1;
    io.to(roomId).emit('game-update', state);
  });

  socket.on('start-next-round', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || !room.gameState || room.gameState.gamePhase !== 'roundEnded') return;
    
    room.gameState = initGame(room.players, room.gameState);
    io.to(roomId).emit('game-start', room.gameState);
    console.log(`Starting round ${room.gameState.currentRound} in room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Cleanup rooms
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit('player-disconnected');
        if (room.players.length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
