<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ButtonGroup } from "$lib/components/ui/button-group";
  import { useGame } from "$lib/composables/useGame.svelte";
  import { gameState } from "$lib/stores/socket";
  import BadgeCheck from "@lucide/svelte/icons/badge-check";
  import BadgeX from "@lucide/svelte/icons/badge-x";

  const p = $props<{
    title: string;
    onRevealScoring: () => void;
  }>();

  const game = useGame();
  let hasNegative = $state(false);

  const multipliers = [1, 2, 5, 10];

  $effect(() => {
    hasNegative = game.getLeaderboard().some((pl: any) => pl.score < 0);
  });
</script>

<div class="flex justify-between items-center mb-4">
  <div class="flex items-center gap-4">
    <h1 class="text-2xl uppercase font-bold text-white">{p.title}</h1>
    <ButtonGroup class="flex items-center ml-4 h-2">
      {#each multipliers as mult}
        <Button
          size="sm"
          onclick={() => game.setPointMultiplier(mult)}
          variant="secondary"
          class={($gameState.pointMultiplier === mult
            ? "bg-blue-600/70 text-white"
            : "dark:text-white text-black") + " text-xs"}
        >
          x{mult}
        </Button>
      {/each}
    </ButtonGroup>
  </div>
  <div class="space-x-2">
    <Button onclick={p.onRevealScoring} variant="ghost">
      {#if hasNegative}
        <BadgeX />
      {:else}
        <BadgeCheck />
      {/if}
      Finish game
    </Button>
  </div>
</div>
