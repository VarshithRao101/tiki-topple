import React from "react";

export const TIKI_MASKS = [
  // MASK 1
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="25" y="10" width="50" height="80" rx="15" fill={color} />
      <circle cx="40" cy="40" r="4" fill="white" />
      <circle cx="60" cy="40" r="4" fill="white" />
      <rect x="48" y="45" width="4" height="20" fill="white" />
      <rect x="40" y="70" width="20" height="5" fill="white" />
      <line x1="30" y1="20" x2="70" y2="20" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  ),
  // MASK 2
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="30" ry="40" fill={color} />
      <circle cx="40" cy="40" r="3" fill="white" />
      <circle cx="60" cy="40" r="3" fill="white" />
      <polygon points="50,45 45,60 55,60" fill="white" />
      <rect x="40" y="70" width="20" height="4" fill="white" />
      <circle cx="50" cy="25" r="4" fill="white" />
    </svg>
  ),
  // MASK 3
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="30" y="10" width="40" height="80" fill={color} />
      <rect x="38" y="35" width="8" height="5" fill="white" />
      <rect x="54" y="35" width="8" height="5" fill="white" />
      <rect x="48" y="45" width="4" height="18" fill="white" />
      <rect x="42" y="65" width="16" height="4" fill="white" />
      <line x1="30" y1="25" x2="70" y2="25" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  ),
  // MASK 4
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,10 75,25 75,80 50,90 25,80 25,25" fill={color} />
      <circle cx="40" cy="40" r="3" fill="white" />
      <circle cx="60" cy="40" r="3" fill="white" />
      <rect x="48" y="45" width="4" height="20" fill="white" />
      <rect x="40" y="70" width="20" height="5" fill="white" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  ),
  // MASK 5
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="25" ry="40" fill={color} />
      <circle cx="40" cy="40" r="3" fill="white" />
      <circle cx="60" cy="40" r="3" fill="white" />
      <rect x="48" y="45" width="4" height="15" fill="white" />
      <rect x="42" y="65" width="16" height="4" fill="white" />
      <line x1="30" y1="50" x2="70" y2="50" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  ),
  // MASK 6
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="25" y="10" width="50" height="80" rx="8" fill={color} />
      <rect x="38" y="35" width="8" height="5" fill="white" />
      <rect x="54" y="35" width="8" height="5" fill="white" />
      <rect x="48" y="45" width="4" height="18" fill="white" />
      <rect x="40" y="70" width="20" height="4" fill="white" />
      <circle cx="50" cy="25" r="4" fill="white" />
    </svg>
  ),
  // MASK 7
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="30" ry="40" fill={color} />
      <circle cx="40" cy="40" r="4" fill="white" />
      <circle cx="60" cy="40" r="4" fill="white" />
      <polygon points="50,45 45,60 55,60" fill="white" />
      <rect x="40" y="70" width="20" height="5" fill="white" />
      <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  ),
  // MASK 8
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,10 85,30 75,80 50,90 25,80 15,30" fill={color} />
      <circle cx="40" cy="40" r="3" fill="white" />
      <circle cx="60" cy="40" r="3" fill="white" />
      <rect x="48" y="45" width="4" height="18" fill="white" />
      <rect x="40" y="70" width="20" height="5" fill="white" />
    </svg>
  ),
  // MASK 9
  (color: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="25" ry="40" fill={color} />
      <rect x="38" y="35" width="8" height="5" fill="white" />
      <rect x="54" y="35" width="8" height="5" fill="white" />
      <rect x="48" y="45" width="4" height="18" fill="white" />
      <rect x="42" y="65" width="16" height="5" fill="white" />
      <circle cx="50" cy="25" r="3" fill="white" />
    </svg>
  ),
];
