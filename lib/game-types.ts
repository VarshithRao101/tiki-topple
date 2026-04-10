export interface Token {
  id: string;
  color: string;
  name: string;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  score: number;
  secretTikis: string[]; // IDs of secret tikis assigned to this player
}

export interface Card {
  id: string;
  type: 'tiki-up' | 'tiki-topple' | 'tiki-toast';
  value?: number; // For Tiki Up cards (1, 2, or 3)
}

export interface GameState {
  stack: Token[]; // Index 0 = top of stack
  players: Player[];
  currentPlayerIndex: number;
  turn: number;
  gamePhase: 'setup' | 'playing' | 'ended';
  winner: Player | null;
  selectedTokenIndex: number | null;
  selectedCard: Card | null;
  playerHands: Card[][]; // Cards for each player
  mode: 'bot' | 'online';
  roomCode?: string;
}

// 9 Tiki tokens matching the original game colors
export const TOKEN_COLORS = [
  { color: '#E53935', name: 'Red Tiki' },      // Red
  { color: '#FF9800', name: 'Orange Tiki' },   // Orange
  { color: '#FFEB3B', name: 'Yellow Tiki' },   // Yellow
  { color: '#4CAF50', name: 'Green Tiki' },    // Green
  { color: '#00BCD4', name: 'Teal Tiki' },     // Teal/Cyan
  { color: '#2196F3', name: 'Blue Tiki' },     // Blue
  { color: '#9C27B0', name: 'Purple Tiki' },   // Purple
  { color: '#E91E63', name: 'Pink Tiki' },     // Pink
  { color: '#795548', name: 'Brown Tiki' },    // Brown
];

// Scoring: position in final stack determines points
export const SCORING_TABLE: Record<number, number> = {
  1: 9, // 1st place (top)
  2: 7,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
  8: 0,
  9: 0,
};
