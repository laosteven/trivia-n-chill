<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { gameState, toggleNegativeScores } from "$lib/stores/socket";
  import type { Player } from "$lib/types";
  import { BarChart, type ChartContextValue } from "layerchart";
  import { cubicInOut } from "svelte/easing";

  interface ChartPlayer {
    id: string;
    name: string;
    score: number;
    connected: boolean;
  }

  const p = $props<{ players: ChartPlayer[] }>();

  let context = $state<ChartContextValue>();
  let hasNegativeScores = $derived(p.players.some((player: Player) => player.score < 0));
  let showNegativeScores = $state($gameState.negativeScoresEnabled);

  // Initialize to show negative scores first if they exist (for roasting)
  $effect(() => {
    if (hasNegativeScores && $gameState.negativeScoresEnabled === undefined) {
      showNegativeScores = true;
      toggleNegativeScores(true);
    } else {
      showNegativeScores = $gameState.negativeScoresEnabled ?? false;
    }
  });

  function handleToggleNegativeScores() {
    showNegativeScores = !showNegativeScores;
    toggleNegativeScores(showNegativeScores);
  }
</script>

<div class="bg-secondary rounded-lg p-4">
  {#if p.players.length === 0}
    <div class="text-sm text-muted-foreground">No players</div>
  {:else if $gameState.negativeScoresEnabled}
    <Chart.Container config={{}} class="h-full w-full h-[30vh] my-6">
      <BarChart
        bind:context
        data={[...p.players]
          .slice()
          .filter((d) => d.score < 0)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((d) => ({ name: d.name, score: d.score * -1, color: "var(--color-red-500)" }))}
        y="score"
        x="name"
        c="color"
        labels={{ offset: 12, format: (v) => `${v * -1}` }}
        yNice={12}
        yBaseline={0}
        axis="y"
        props={{
          bars: {
            stroke: "none",
            rounded: "all",
            radius: 4,
            initialY: context?.height,
            initialHeight: 0,
            motion: {
              height: { type: "tween", duration: 3000, easing: cubicInOut },
              y: { type: "tween", duration: 3000, easing: cubicInOut },
            },
            fill: "var(--color-red-500)",
            fillOpacity: 0.8,
          },
          highlight: { area: { fill: "none" } },
        }}
      >
        {#snippet tooltip()}
          <Chart.Tooltip />
        {/snippet}
      </BarChart>
    </Chart.Container>
  {:else}
    <Chart.Container config={{}} class="h-full w-full max-h-[40vh]  my-6">
      <BarChart
        bind:context
        data={[...p.players]
          .slice()
          .filter((d) => d.score > 0)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((d) => ({ name: d.name, score: d.score, color: "var(--color-green-500)" }))}
        y="score"
        x="name"
        c="color"
        labels={{ offset: 12 }}
        yNice={12}
        yBaseline={0}
        axis="y"
        props={{
          bars: {
            stroke: "none",
            rounded: "all",
            radius: 4,
            initialY: context?.height,
            initialHeight: 0,
            motion: {
              height: { type: "tween", duration: 3000, easing: cubicInOut },
              y: { type: "tween", duration: 3000, easing: cubicInOut },
            },
            fill: "var(--color-green-500)",
            fillOpacity: 0.8,
          },
          highlight: { area: { fill: "none" } },
        }}
      >
        {#snippet tooltip()}
          <Chart.Tooltip />
        {/snippet}
      </BarChart>
    </Chart.Container>
  {/if}

  {#if hasNegativeScores}
    <Button
      onclick={handleToggleNegativeScores}
      class={showNegativeScores
        ? "w-full mt-2 bg-green-500 hover:bg-green-700 text-white border-green-700"
        : "w-full mt-2 bg-red-500 hover:bg-red-700 text-white border-red-700"}
      size="sm"
    >
      {#if showNegativeScores}
        Show positive scores
      {:else}
        Show negative scores
      {/if}
    </Button>
  {/if}
</div>
