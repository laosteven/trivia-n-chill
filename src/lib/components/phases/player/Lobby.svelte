<script lang="ts">
  import EmojiPickerReaction from "$lib/components/features/player/EmojiPickerReaction.svelte";
  import RenameDialog from "$lib/components/features/player/RenameDialog.svelte";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { usePlayer } from "$lib/composables/usePlayer.svelte";
  import { gameConfig, gameState } from "$lib/stores/socket";
  import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";

  const player = usePlayer();
</script>

<Card class="w-full max-w-md">
  <CardHeader class="text-center">
    <CardTitle class="text-2xl">{$gameConfig.title}</CardTitle>
    <CardDescription>Waiting for host to start the game...</CardDescription>
  </CardHeader>
  <CardContent class="text-center space-y-4">
    <LottiePlayer src="/animations/sandy.json" autoplay loop style="display: inline-block" />
    <p class="text-xl font-semibold mb-2">Welcome, {player.currentPlayer?.name}!</p>
    <p class="text-muted-foreground">{$gameState.players.length} player(s) joined</p>
    <div class="mt-4 flex items-center justify-center gap-4">
      <RenameDialog value={player.currentPlayer?.name}>
        <button class="btn">Change name</button>
      </RenameDialog>
      <EmojiPickerReaction />
    </div>
  </CardContent>
</Card>
