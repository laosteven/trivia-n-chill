/**
 * Data Transfer Objects for socket events
 * These define the exact shape of data sent over sockets
 */

export interface PlayerJoinDTO {
  username: string;
}

export interface PlayerRenameDTO {
  newUsername: string;
}

export interface SelectQuestionDTO {
  category: string;
  value: number;
}

export interface UpdatePlayerScoreDTO {
  playerId: string;
  newScore: number;
}

export interface HostUpdatePlayerNameDTO {
  playerId: string;
  newName: string;
}

export interface OperationResult {
  success: boolean;
  error?: string;
}

export interface NotificationDTO {
  message: string;
}

export interface UpdateUsernameDTO {
  newUsername: string;
}

export interface BuzzerSoundDTO {
  playerName: string;
}

export interface JoinErrorDTO {
  error: string;
}
