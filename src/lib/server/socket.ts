import { Server as SocketIOServer, Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { GameState, Player, BuzzEvent, Question, ClientGameState } from '$lib/types';
import { loadGameConfig, watchGameConfig } from './config';

let io: SocketIOServer | null = null;
let gameConfig = loadGameConfig();
watchGameConfig(cfg => {
	gameConfig = cfg;
	console.log('[socket] Config reloaded; broadcasting new config');
	broadcastConfig();
});

const gameState: GameState = {
	players: new Map(),
	currentQuestion: null,
	currentCategory: null,
	answeredQuestions: new Set(),
	buzzerOrder: [],
	buzzerLocked: true,
	gamePhase: 'lobby',
	hostConnected: false,
	showAnswer: false
};

// Persist scores across reconnects (browser refresh) by username (case-insensitive)
const playerScores = new Map<string, number>();

function getClientGameState(): ClientGameState {
	return {
		players: Array.from(gameState.players.values()),
		currentQuestion: gameState.currentQuestion,
		currentCategory: gameState.currentCategory,
		answeredQuestions: Array.from(gameState.answeredQuestions),
		buzzerOrder: gameState.buzzerOrder,
		buzzerLocked: gameState.buzzerLocked,
		gamePhase: gameState.gamePhase,
		showAnswer: gameState.showAnswer
	};
}

function broadcastGameState() {
	if (io) {
		io.emit('gameState', getClientGameState());
	}
}

function broadcastConfig() {
	if (io) {
		io.emit('gameConfig', {
			title: gameConfig.title,
			countdown: gameConfig.countdown,
			categories: gameConfig.categories.map(cat => ({
				name: cat.name,
				questions: cat.questions.map(q => ({ value: q.value }))
			}))
		});
	}
}

export function initSocketServer(server: HTTPServer) {
	if (io) return io;

	io = new SocketIOServer(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', (socket: Socket) => {
		console.log('Client connected:', socket.id);

		// Send current config and state to new connection
		socket.emit('gameConfig', {
			title: gameConfig.title,
			countdown: gameConfig.countdown,
			categories: gameConfig.categories.map(cat => ({
				name: cat.name,
				questions: cat.questions.map(q => ({ value: q.value }))
			}))
		});
		socket.emit('gameState', getClientGameState());

		// Host joins
		socket.on('hostJoin', () => {
			socket.join('host');
			gameState.hostConnected = true;
			console.log('Host connected');
			broadcastGameState();
		});

		// Manual config reload (host only)
		socket.on('reloadConfig', () => {
			if (!socket.rooms.has('host')) return; // only host can trigger
			gameConfig = loadGameConfig();
			console.log('[socket] Manual config reload triggered');
			broadcastConfig();
		});

		// Player joins with username
		socket.on('playerJoin', (username: string, callback?: (result: { success: boolean; error?: string }) => void) => {
			const cleanName = (username || '').trim();
			if (!cleanName) {
				callback?.({ success: false, error: 'Username cannot be empty' });
				return;
			}
			
			const key = cleanName.toLowerCase();
			
			// Check if username is already taken by an active player
			const existingPlayer = Array.from(gameState.players.values()).find(
				p => p.name.toLowerCase() === key
			);
			
			if (existingPlayer) {
				console.log(`Player join rejected: username "${cleanName}" already taken`);
				callback?.({ success: false, error: 'Username already taken' });
				socket.emit('joinError', { error: 'Username already taken' });
				return;
			}
			
			const restoredScore = playerScores.get(key) ?? 0;
			const player: Player = {
				id: socket.id,
				name: cleanName,
				score: restoredScore
			};
			gameState.players.set(socket.id, player);
			playerScores.set(key, restoredScore); // ensure map has entry
			socket.join('players');
			console.log(`Player joined: ${cleanName} (restored score: ${restoredScore})`);
			callback?.({ success: true });
			broadcastGameState();
		});

		// Host starts the game
		socket.on('startGame', () => {
			gameState.gamePhase = 'playing';
			gameState.answeredQuestions.clear();
			// Reset all player scores
			gameState.players.forEach(player => {
				player.score = 0;
				playerScores.set(player.name.toLowerCase(), 0);
			});
			gameState.showAnswer = false;
			broadcastGameState();
		});

		// Host selects a question
		socket.on('selectQuestion', (data: { category: string; value: number }) => {
			const category = gameConfig.categories.find(c => c.name === data.category);
			if (category) {
				const question = category.questions.find(q => q.value === data.value);
				if (question) {
					gameState.currentQuestion = question;
					gameState.currentCategory = data.category;
					gameState.buzzerOrder = [];
					gameState.buzzerLocked = false;
					gameState.gamePhase = 'question';
					gameState.showAnswer = false;
					broadcastGameState();

					// Send full question (including media) to host only
					io?.to('host').emit('fullQuestion', {
						category: data.category,
						question: question.question,
						answer: question.answer,
						value: question.value,
						image: question.image,
						youtube: question.youtube
					});
				}
			}
		});

		// Player buzzes
		socket.on('buzz', () => {
			if (gameState.buzzerLocked) return;

			const player = gameState.players.get(socket.id);
			if (!player) return;

			// Check if player already buzzed
			if (gameState.buzzerOrder.some(b => b.playerId === socket.id)) return;

			const buzzEvent: BuzzEvent = {
				playerId: socket.id,
				playerName: player.name,
				timestamp: Date.now()
			};
			gameState.buzzerOrder.push(buzzEvent);
			broadcastGameState();
		});

		// Host locks buzzer
		socket.on('lockBuzzer', () => {
			gameState.buzzerLocked = true;
			broadcastGameState();
		});

		// Host unlocks buzzer
		socket.on('unlockBuzzer', () => {
			gameState.buzzerLocked = false;
			broadcastGameState();
		});

		// Host clears buzzer queue
		socket.on('clearBuzzers', () => {
			gameState.buzzerOrder = [];
			broadcastGameState();
		});

		// Host marks answer correct
		socket.on('correctAnswer', (playerId: string) => {
			const player = gameState.players.get(playerId);
			if (player && gameState.currentQuestion) {
				player.score += gameState.currentQuestion.value;
				playerScores.set(player.name.toLowerCase(), player.score);
				if (gameState.currentCategory && gameState.currentQuestion) {
					const key = `${gameState.currentCategory}-${gameState.currentQuestion.value}`;
					gameState.answeredQuestions.add(key);
				}
				gameState.currentQuestion = null;
				gameState.currentCategory = null;
				gameState.buzzerOrder = [];
				gameState.buzzerLocked = true;
				gameState.gamePhase = 'playing';
				gameState.showAnswer = false;
				broadcastGameState();
			}
		});

		// Host marks answer incorrect
		socket.on('incorrectAnswer', (playerId: string) => {
			const player = gameState.players.get(playerId);
			if (player && gameState.currentQuestion) {
				player.score -= gameState.currentQuestion.value;
				playerScores.set(player.name.toLowerCase(), player.score);
				// Remove the player from the buzzer order so others can try
				gameState.buzzerOrder = gameState.buzzerOrder.filter(b => b.playerId !== playerId);
				// Unlock buzzer for others
				gameState.buzzerLocked = false;
				gameState.showAnswer = false;
				broadcastGameState();
			}
		});

		// Host cancels an accidentally selected question (does NOT mark answered)
		socket.on('cancelQuestion', () => {
			if (gameState.gamePhase === 'question') {
				gameState.currentQuestion = null;
				gameState.currentCategory = null;
				gameState.buzzerOrder = [];
				gameState.buzzerLocked = true;
				gameState.gamePhase = 'playing';
				gameState.showAnswer = false;
				broadcastGameState();
			}
		});

		// Host skips question
		socket.on('skipQuestion', () => {
			if (gameState.currentCategory && gameState.currentQuestion) {
				const key = `${gameState.currentCategory}-${gameState.currentQuestion.value}`;
				gameState.answeredQuestions.add(key);
			}
			gameState.currentQuestion = null;
			gameState.currentCategory = null;
			gameState.buzzerOrder = [];
			gameState.buzzerLocked = true;
			gameState.gamePhase = 'playing';
			gameState.showAnswer = false;
			broadcastGameState();
		});

		// Host shows leaderboard
		socket.on('showLeaderboard', () => {
			gameState.gamePhase = 'leaderboard';
			gameState.currentQuestion = null;
			gameState.currentCategory = null;
			gameState.showAnswer = false;
			broadcastGameState();
		});

		// Host returns from leaderboard to game board
		socket.on('backToGame', () => {
			if (gameState.gamePhase === 'leaderboard') {
				gameState.gamePhase = 'playing';
				gameState.showAnswer = false;
				broadcastGameState();
			}
		});

		// Host resets game
		socket.on('resetGame', () => {
			gameState.players.forEach(player => {
				player.score = 0;
				playerScores.set(player.name.toLowerCase(), 0);
			});
			gameState.answeredQuestions.clear();
			gameState.currentQuestion = null;
			gameState.currentCategory = null;
			gameState.buzzerOrder = [];
			gameState.buzzerLocked = true;
			gameState.gamePhase = 'lobby';
			gameState.showAnswer = false;
			broadcastGameState();
		});

		// Host reveals answer (sets showAnswer true)
		socket.on('revealAnswer', () => {
			if (gameState.gamePhase === 'question') {
				gameState.showAnswer = true;
				broadcastGameState();
			}
		});

		// Host manually updates a player's score
		socket.on('updatePlayerScore', (data: { playerId: string; newScore: number }) => {
			if (!socket.rooms.has('host')) return; // only host can update scores
			const player = gameState.players.get(data.playerId);
			if (player) {
				player.score = data.newScore;
				playerScores.set(player.name.toLowerCase(), data.newScore);
				console.log(`Host updated ${player.name}'s score to ${data.newScore}`);
				broadcastGameState();
			}
		});

		// Disconnect handling
		socket.on('disconnect', () => {
			const player = gameState.players.get(socket.id);
			if (player) {
				console.log(`Player disconnected: ${player.name}`);
				gameState.players.delete(socket.id);
				gameState.buzzerOrder = gameState.buzzerOrder.filter(b => b.playerId !== socket.id);
				// Keep their score in playerScores for future reconnects
				playerScores.set(player.name.toLowerCase(), player.score);
				broadcastGameState();
			}
		});
	});

	return io;
}

export function getIO() {
	return io;
}
