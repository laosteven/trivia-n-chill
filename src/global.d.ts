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

declare module "@lottiefiles/svelte-lottie-player" {
  import { SvelteComponentTyped } from "svelte";
  // Add any specific props or events if known

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export class LottiePlayer extends SvelteComponentTyped<any, any, any> {}
}
