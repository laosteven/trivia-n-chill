declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    startVelocity?: number;
    ticks?: number;
    zIndex?: number;
    colors?: string[];
  }

  function confetti(opts?: ConfettiOptions): void;

  export default confetti;
  export { confetti };
}
