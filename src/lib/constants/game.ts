/**
 * Game-related constants
 */

export const GAME_CONSTANTS = {
  /** Maximum length for player usernames */
  MAX_USERNAME_LENGTH: 20,
  
  /** Storage key for persisting username in localStorage */
  USERNAME_STORAGE_KEY: 'jeopardy-game_username',
  
  /** Duration for auto-dismissing notifications (ms) */
  NOTIFICATION_DURATION: 5000,
  
  /** Buzzer sound frequency (Hz) */
  BUZZER_FREQUENCY: 440,
  
  /** Buzzer sound duration (seconds) */
  BUZZER_DURATION: 0.2,
  
  /** Default QR code size */
  QR_CODE_SIZE: 200,
} as const;

export const GAME_PHASES = {
  LOBBY: 'lobby',
  PLAYING: 'playing',
  QUESTION: 'question',
  ANSWER: 'answer',
  LEADERBOARD: 'leaderboard',
} as const;

export type GamePhase = typeof GAME_PHASES[keyof typeof GAME_PHASES];
