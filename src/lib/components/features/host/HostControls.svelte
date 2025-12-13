<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { useGame } from "$lib/composables/useGame.svelte";
  import BadgeCheck from "@lucide/svelte/icons/badge-check";
  import BadgeX from "@lucide/svelte/icons/badge-x";

  const p = $props<{
    title: string;
    onRevealScoring: () => void;
  }>();

  const game = useGame();
  let hasNegative = $state(false);

  $effect(() => {
    hasNegative = game.getLeaderboard().some((pl: any) => pl.score < 0);
  });
</script>

<div class="flex justify-between items-center mb-4">
  <h1 class="text-2xl uppercase font-bold text-white">{p.title}</h1>
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
