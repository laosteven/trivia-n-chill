/**
 * Game Composable
 * Manages game state and flow for host
 */

import {
    gameState,
    backToGame as socketBackToGame,
    cancelQuestion as socketCancelQuestion,
    clearBuzzers as socketClearBuzzers,
    clearDisconnected as socketClearDisconnected,
    clearPlayers as socketClearPlayers,
    correctAnswer as socketCorrectAnswer,
    hostUpdatePlayerName as socketHostUpdatePlayerName,
    incorrectAnswer as socketIncorrectAnswer,
    lockBuzzer as socketLockBuzzer,
    reloadConfig as socketReloadConfig,
    removeBuzz as socketRemoveBuzz,
    removePlayer as socketRemovePlayer,
    resetGame as socketResetGame,
    revealAnswer as socketRevealAnswer,
    selectQuestion as socketSelectQuestion,
    setPointMultiplier as socketSetPointMultiplier,
    showLeaderboard as socketShowLeaderboard,
    showScoring as socketShowScoring,
    skipQuestion as socketSkipQuestion,
    startGame as socketStartGame,
    unlockBuzzer as socketUnlockBuzzer,
    updatePlayerScore as socketUpdatePlayerScore,
} from "$lib/stores/socket";
import type { Player } from "$lib/types";
import { get } from "svelte/store";

export function useGame() {
  /**
   * Check if a question has been answered
   */
  function isQuestionAnswered(category: string, value: number): boolean {
    const state = get(gameState);
    return state.answeredQuestions.includes(`${category}-${value}`);
  }

  /**
   * Select a question if not already answered
   */
  function selectQuestion(category: string, value: number) {
    if (!isQuestionAnswered(category, value)) {
      socketSelectQuestion(category, value);
    }
  }

  /**
   * Get sorted leaderboard
   */
  function getLeaderboard(): Player[] {
    const state = get(gameState);
    return [...state.players].sort((a, b) => b.score - a.score);
  }

  /**
   * Start the game
   */
  function startGame() {
    socketStartGame();
  }

  /**
   * Reset game to lobby
   */
  function resetGame() {
    socketResetGame();
  }

  /**
   * Clear all players and return to lobby (fresh start)
   */
  function clearPlayers() {
    socketClearPlayers();
  }

  /**
   * Remove a single player
   */
  function removePlayer(playerId: string) {
    socketRemovePlayer(playerId);
  }

  /**
   * Clear only disconnected players
   */
  function clearDisconnected() {
    socketClearDisconnected();
  }

  /**
   * Show leaderboard view
   */
  function showLeaderboard() {
    socketShowLeaderboard();
  }

  /**
   * Show chart view
   */
  function showScoring() {
    socketShowScoring();
  }

  /**
   * Return from leaderboard to game board
   */
  function backToGame() {
    socketBackToGame();
  }

  /**
   * Mark answer as correct
   */
  function markCorrect(playerId: string) {
    socketCorrectAnswer(playerId);
  }

  /**
   * Mark answer as incorrect
   */
  function markIncorrect(playerId: string) {
    socketIncorrectAnswer(playerId);
  }

  /**
   * Skip current question
   */
  function skipQuestion() {
    socketSkipQuestion();
  }

  /**
   * Cancel current question (doesn't mark as answered)
   */
  function cancelQuestion() {
    socketCancelQuestion();
  }

  /**
   * Lock buzzer
   */
  function lockBuzzer() {
    socketLockBuzzer();
  }

  /**
   * Unlock buzzer
   */
  function unlockBuzzer() {
    socketUnlockBuzzer();
  }

  /**
   * Clear buzzer queue
   */
  function clearBuzzers() {
    socketClearBuzzers();
  }

  /**
   * Remove a single player's buzz from queue
   */
  function removeBuzz(playerId: string) {
    socketRemoveBuzz(playerId);
  }

  /**
   * Reveal answer
   */
  function revealAnswer() {
    socketRevealAnswer();
  }

  /**
   * Update player score
   */
  function updatePlayerScore(playerId: string, score: number) {
    socketUpdatePlayerScore(playerId, score);
  }

  /**
   * Update player name
   */
  async function updatePlayerName(
    playerId: string,
    newName: string
  ): Promise<{ success: boolean; error?: string }> {
    return socketHostUpdatePlayerName(playerId, newName);
  }

  /**
   * Reload game config
   */
  function reloadConfig() {
    socketReloadConfig();
  }

  /**
   * Set point multiplier
   */
  function setPointMultiplier(multiplier: number) {
    socketSetPointMultiplier(multiplier);
  }

  return {
    isQuestionAnswered,
    selectQuestion,
    getLeaderboard,
    startGame,
    resetGame,
    clearPlayers,
    removePlayer,
    clearDisconnected,
    showScoring,
    showLeaderboard,
    backToGame,
    markCorrect,
    markIncorrect,
    skipQuestion,
    cancelQuestion,
    lockBuzzer,
    unlockBuzzer,
    clearBuzzers,
    removeBuzz,
    revealAnswer,
    updatePlayerScore,
    updatePlayerName,
    reloadConfig,
    setPointMultiplier,
  };
}
