<script lang="ts">
  import EmojiPickerReaction from "$lib/components/features/player/EmojiPickerReaction.svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { usePlayer } from "$lib/composables/usePlayer.svelte";
  import { gameState } from "$lib/stores/socket";

  const player = usePlayer();
</script>

<Card class="w-full max-w-md">
  <CardHeader class="text-center">
    <CardTitle class="text-3xl">🏆 Game over! 🏆</CardTitle>
  </CardHeader>
  <CardContent class="text-center space-y-4">
    {@const rank = player.playerRank}
    <div class="text-6xl">
      {#if rank === 1}🥇{:else if rank === 2}🥈{:else if rank === 3}🥉{:else}🎮{/if}
    </div>
    <p class="text-2xl font-semibold">{player.currentPlayer?.name}</p>
    <div class="bg-secondary p-4 rounded-lg">
      <p class="text-sm text-muted-foreground">Final score</p>
      <p class="text-4xl font-bold text-purple-600">${player.currentPlayer?.score ?? 0}</p>
    </div>
    {#if $gameState.scoringEnabled}
      <div class="bg-secondary p-4 rounded-lg">
        <p class="text-sm text-muted-foreground">Final rank</p>
        <p class="text-2xl font-bold">#{rank} of {$gameState.players.length}</p>
      </div>
    {/if}

    <div class="mt-4 flex items-center justify-center gap-4">
      <EmojiPickerReaction />
    </div>
  </CardContent>
</Card>
