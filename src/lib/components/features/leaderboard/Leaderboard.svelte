<script lang="ts">
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { onMount } from "svelte";

  const p = $props<{
    players: { id: string; name: string; score: number; connected: boolean }[];
  }>();

  // Credit roll options
  const WAIT_MS = 5000; // wait before starting the roll
  const DURATION_MS = 20000; // duration of the scroll animation
  const PAUSE_MS = 1000; // pause at bottom before scrolling back
  const LOOP = false; // disable continuous loop to keep UI responsive

  let viewport = $state<HTMLElement | null>(null);
  let autoscrollEnabled = $state(true);

  // smooth scroll helper: animate from current scrollTop to target over duration
  // Returns a promise that resolves when animation completes and provides a cancel function
  function smoothScrollTo(element: HTMLElement, target: number, duration: number) {
    return new Promise<void>((resolve) => {
      const start = element.scrollTop;
      const change = target - start;
      const startTime = performance.now();
      let rafId: number | null = null;

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        // ease-in-out cubic
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        element.scrollTop = start + change * eased;
        if (t < 1) rafId = requestAnimationFrame(animate);
        else resolve();
      }

      rafId = requestAnimationFrame(animate);

      // attach cancel helper to element for cleanup if needed
      (element as any).__rafId = rafId;
    });
  }

  onMount(() => {
    let destroyed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function runLoop() {
      // initial wait
      await new Promise((r) => (timer = setTimeout(r, WAIT_MS)));
      if (destroyed) return;

      do {
        if (!viewport) return;
        if (!autoscrollEnabled) break;
        const bottom = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
        if (bottom > 0) {
          await smoothScrollTo(viewport, bottom, DURATION_MS);
          if (destroyed) return;
          // pause at bottom
          await new Promise((r) => (timer = setTimeout(r, PAUSE_MS)));
          if (destroyed) return;
          // scroll back to top
          await smoothScrollTo(viewport, 0, DURATION_MS);
        }
      } while (LOOP && !destroyed);
    }

    runLoop().catch(() => {});

    // disable autoscroll on user interaction inside the viewport
    const disableOnInteract = () => (autoscrollEnabled = false);
    viewport?.addEventListener("pointerdown", disableOnInteract, { once: true });
    viewport?.addEventListener("wheel", disableOnInteract, { once: true });

    return () => {
      destroyed = true;
      if (timer) clearTimeout(timer);
      if (viewport && (viewport as any).__rafId) cancelAnimationFrame((viewport as any).__rafId);
    };
  });
</script>

<div class="space-y-4">
  <ScrollArea class="responsive-scrollarea h-[50vh]" bind:viewportRef={viewport}>
    {#each [...p.players].sort((a, b) => b.score - a.score) as player, index}
      <div
        class="flex items-center justify-between p-4 rounded-lg bg-secondary mb-2 {!player.connected
          ? 'opacity-60'
          : ''}"
      >
        <div class="flex items-center gap-4">
          <span class="text-rank">
            {#if index === 0}🥇{:else if index === 1}🥈{:else if index === 2}🥉{:else}{index +
                1}{/if}
          </span>
          <div class="flex items-center gap-2">
            <span class="font-semibold name-text">{player.name}</span>
            {#if !player.connected}
              <span class="text-xs text-red-600 font-semibold"><TriangleAlert size={16} /></span>
            {/if}
          </div>
        </div>
        <span class="score-text font-bold text-blue-600 font-mono tabular-nums"
          >${player.score}</span
        >
      </div>
    {/each}
  </ScrollArea>
</div>

<style>
  .responsive-scrollarea {
    height: clamp(18rem, 45vh, 40rem);
  }

  .text-rank {
    font-size: clamp(1rem, 2.2vw, 2rem);
    color: var(--muted-foreground);
  }

  .name-text {
    font-size: clamp(1rem, 2.6vw, 2.2rem);
  }

  .score-text {
    font-size: clamp(1.25rem, 3vw, 2.6rem);
  }
</style>
