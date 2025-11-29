<script lang="ts">
  const p = $props<{ players: { id: string; name: string; score: number; connected: boolean }[] }>();
</script>

<div class="space-y-4">
  {#each [...p.players].sort((a, b) => b.score - a.score) as player, index}
    <div
      class="flex items-center justify-between p-4 rounded-lg {index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-orange-100' : 'bg-secondary'} {!player.connected ? 'opacity-60' : ''}"
    >
      <div class="flex items-center gap-4">
        <span class="text-3xl">
          {#if index === 0}🥇{:else if index === 1}🥈{:else if index === 2}🥉{:else}{index + 1}{/if}
        </span>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-xl">{player.name}</span>
          {#if !player.connected}
            <span class="text-xs text-red-600 font-semibold">⚠️ Disconnected</span>
          {/if}
        </div>
      </div>
      <span class="text-2xl font-bold text-blue-600">${player.score}</span>
    </div>
  {/each}
</div>
