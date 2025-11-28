import { Server as SocketIOServer, Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { GameState, Player, BuzzEvent, Question, ClientGameState } from '$lib/types';
import { loadGameConfig } from './config';

let io: SocketIOServer | null = null;
let gameConfig = loadGameConfig();

const gameState: GameState = {
	players: new Map(),
	currentQuestion: null,
	currentCategory: null,
	answeredQuestions: new Set(),
	buzzerOrder: [],
	buzzerLocked: true,
	gamePhase: 'lobby',
	hostConnected: false
};

function getClientGameState(): ClientGameState {
	return {
		players: Array.from(gameState.players.values()),
		currentQuestion: gameState.currentQuestion,
		currentCategory: gameState.currentCategory,
		answeredQuestions: Array.from(gameState.answeredQuestions),
		buzzerOrder: gameState.buzzerOrder,
		buzzerLocked: gameState.buzzerLocked,
		gamePhase: gameState.gamePhase
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

		// Player joins with username
		socket.on('playerJoin', (username: string) => {
			const player: Player = {
				id: socket.id,
				name: username,
				score: 0
			};
			gameState.players.set(socket.id, player);
			socket.join('players');
			console.log(`Player joined: ${username}`);
			broadcastGameState();
		});

		// Host starts the game
		socket.on('startGame', () => {
			gameState.gamePhase = 'playing';
			gameState.answeredQuestions.clear();
			// Reset all player scores
			gameState.players.forEach(player => {
				player.score = 0;
			});
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
					broadcastGameState();

					// Send full question to host only
					io?.to('host').emit('fullQuestion', {
						category: data.category,
						question: question.question,
						answer: question.answer,
						value: question.value
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
				if (gameState.currentCategory && gameState.currentQuestion) {
					const key = `${gameState.currentCategory}-${gameState.currentQuestion.value}`;
					gameState.answeredQuestions.add(key);
				}
				gameState.currentQuestion = null;
				gameState.currentCategory = null;
				gameState.buzzerOrder = [];
				gameState.buzzerLocked = true;
				gameState.gamePhase = 'playing';
				broadcastGameState();
			}
		});

		// Host marks answer incorrect
		socket.on('incorrectAnswer', (playerId: string) => {
			const player = gameState.players.get(playerId);
			if (player && gameState.currentQuestion) {
				player.score -= gameState.currentQuestion.value;
				// Remove the player from the buzzer order so others can try
				gameState.buzzerOrder = gameState.buzzerOrder.filter(b => b.playerId !== playerId);
				// Unlock buzzer for others
				gameState.buzzerLocked = false;
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
			broadcastGameState();
		});

		// Host shows leaderboard
		socket.on('showLeaderboard', () => {
			gameState.gamePhase = 'leaderboard';
			gameState.currentQuestion = null;
			gameState.currentCategory = null;
			broadcastGameState();
		});

		// Host resets game
		socket.on('resetGame', () => {
			gameState.players.forEach(player => {
				player.score = 0;
			});
			gameState.answeredQuestions.clear();
			gameState.currentQuestion = null;
			gameState.currentCategory = null;
			gameState.buzzerOrder = [];
			gameState.buzzerLocked = true;
			gameState.gamePhase = 'lobby';
			broadcastGameState();
		});

		// Disconnect handling
		socket.on('disconnect', () => {
			const player = gameState.players.get(socket.id);
			if (player) {
				console.log(`Player disconnected: ${player.name}`);
				gameState.players.delete(socket.id);
				gameState.buzzerOrder = gameState.buzzerOrder.filter(b => b.playerId !== socket.id);
				broadcastGameState();
			}
		});
	});

	return io;
}

export function getIO() {
	return io;
}
