// Lightweight wrapper around canvas-confetti with dynamic import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let confettiImpl: any;

async function load() {
  if (typeof window === "undefined") return null;
  if (confettiImpl) return confettiImpl;
  const mod = await import("canvas-confetti");
  confettiImpl = mod.default || mod;
  return confettiImpl;
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export async function celebrateCorrect(duration = 1000) {
  const confetti = await load();
  if (!confetti) return;
  // Responsive scaling based on viewport
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const referenceArea = 1366 * 768;
  const area = Math.max(1, vw * vh);
  const scale = Math.min(4, Math.sqrt(area / referenceArea));

  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: Math.floor(30 * Math.max(1, scale)),
    spread: 360,
    ticks: Math.floor(60 * Math.min(2, scale)),
    zIndex: 9999,
  };

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const base = 50;
    const particleCount = Math.floor(base * (timeLeft / duration) * Math.max(1, scale));
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

export async function celebrateLeaderboard(duration = 5000) {
  const confetti = await load();
  if (!confetti) return;

  // Responsive scaling for leaderboard celebration
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const referenceArea = 1366 * 768;
  const area = Math.max(1, vw * vh);
  const scale = Math.min(4, Math.sqrt(area / referenceArea));

  const end = Date.now() + duration;

  (function frame() {
    const perSide = Math.max(2, Math.floor(2 * scale));
    confetti({ particleCount: perSide, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: perSide, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export async function playerEmojiReact(emoji: string) {
  const confetti = await load();
  const emojiShape = confetti.shapeFromText({ text: emoji });
  if (!confetti) return;
  // Compute a scale factor based on viewport size so confetti looks good on TVs
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  // Reference area is 1366x768 (common laptop); larger areas will scale up
  const referenceArea = 1366 * 768;
  const area = Math.max(1, vw * vh);
  // Scale factor capped to avoid excessive particle counts
  const scale = Math.min(4, Math.sqrt(area / referenceArea));

  // Base values tuned for small screens
  const baseParticleCount = 30;
  const baseScalar = 2; // visual size multiplier
  const baseVelocity = 30;
  const baseGravity = 0.5;
  const baseTicks = 60;

  confetti({
    particleCount: Math.floor(baseParticleCount * scale),
    spread: 100,
    shapes: [emojiShape],
    origin: { x: Math.random(), y: 1 },
    scalar: Math.max(0.5, baseScalar * (Math.random() * 0.6 + 0.7) * scale),
    startVelocity: Math.floor(baseVelocity * scale),
    gravity: baseGravity * Math.max(1, scale / 1.5),
    ticks: Math.floor(baseTicks * Math.min(2, scale)),
  });
}

export default { celebrateCorrect, celebrateLeaderboard, playerEmojiReact };
