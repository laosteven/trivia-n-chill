<script lang="ts">
  import { BarChart, type ChartContextValue } from "layerchart";
  import { cubicInOut } from "svelte/easing";

  const p = $props<{
    players: { id: string; name: string; score: number; connected: boolean }[];
  }>();

  let context = $state<ChartContextValue>();
</script>

<div class="bg-secondary rounded-lg p-4">
  {#if p.players.length === 0}
    <div class="text-sm text-muted-foreground">No players</div>
  {:else}
    <div class="mt-4 h-64">
      <div class="h-full w-full text-sm">
        <BarChart
          bind:context
          data={[...p.players]
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((d) => ({ name: d.name, score: d.score }))}
          y="score"
          x="name"
          tooltip={false}
          labels={{ offset: 12 }}
          yNice={12}
          yBaseline={0}
          axis={false}
          props={{
            bars: {
              stroke: "none",
              rounded: "all",
              radius: 4,
              initialY: context?.height,
              initialHeight: 0,
              motion: {
                height: { type: "tween", duration: 500, easing: cubicInOut },
                y: { type: "tween", duration: 500, easing: cubicInOut },
              },
              fill: "var(--color-foreground)",
              fillOpacity: 0.9,
            },
            highlight: { area: { fill: "none" } },
          }}
        />
      </div>
    </div>
  {/if}
</div>
