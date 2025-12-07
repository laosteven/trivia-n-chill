<script lang="ts">
  import EmojiPickerReaction from "$lib/components/features/player/EmojiPickerReaction.svelte";
  import PlayerStats from "$lib/components/features/player/PlayerStats.svelte";
  import RenameDialog from "$lib/components/features/player/RenameDialog.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { usePlayer } from "$lib/composables/usePlayer.svelte";
  import { gameState } from "$lib/stores/socket";

  const player = usePlayer();
</script>

<Card class="w-full max-w-md">
  <CardHeader class="text-center">
    <CardTitle class="text-2xl">{player.currentPlayer?.name}</CardTitle>
  </CardHeader>
  <CardContent class="text-center space-y-4">
    <PlayerStats
      name={player.currentPlayer?.name || ""}
      score={player.currentPlayer?.score ?? 0}
      rank={player.playerRank}
      totalPlayers={$gameState.players.length}
    />
    <p class="text-muted-foreground">Waiting for host to select a question...</p>

    <div class="mt-4 flex items-center justify-center gap-4">
      <RenameDialog value={player.currentPlayer?.name}>
        <Button variant="outline">Change name</Button>
      </RenameDialog>
      <EmojiPickerReaction />
    </div>
  </CardContent>
</Card>
