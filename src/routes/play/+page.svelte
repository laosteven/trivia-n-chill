<script lang="ts">
  import { browser } from "$app/environment";
  import LeaderboardPhase from "$lib/components/phases/player/Leaderboard.svelte";
  import LobbyPhase from "$lib/components/phases/player/Lobby.svelte";
  import PlayingPhase from "$lib/components/phases/player/Playing.svelte";
  import QuestionPhase from "$lib/components/phases/player/Question.svelte";
  import ScoringPhase from "$lib/components/phases/player/Scoring.svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { usePlayer } from "$lib/composables/usePlayer.svelte";
  import {
    connected,
    gameConfig,
    gameState,
    hostNotification,
    initSocket,
    joinError,
  } from "$lib/stores/socket";
  import { onMount } from "svelte";
  import { Toaster, toast } from "svelte-sonner";

  const player = usePlayer();

  onMount(() => {
    if (browser) {
      initSocket();
      player.init();
    }
  });

  async function handleJoin() {
    if (player.username.trim()) {
      await player.join(player.username);
      // Error handling is done in the composable
    }
  }

  function handleBuzz() {
    player.doBuzz();
  }

  // Reset buzzed state when question changes or phase changes
  $effect(() => {
    if ($gameState.gamePhase !== "question") {
      player.resetBuzz();
    }
  });

  // Show toast notification when host updates something
  $effect(() => {
    if ($hostNotification) {
      toast.info($hostNotification.message, { dismissable: true });
    }
  });
</script>

<div
  class="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 p-4 flex items-center justify-center"
>
  {#if !$connected}
    <Card class="w-full max-w-md">
      <CardContent class="p-8 text-center">
        <p class="text-xl">Connecting to server...</p>
      </CardContent>
    </Card>
  {:else if !player.hasJoined}
    <!-- Username Entry -->
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-3xl font-bold text-purple-600">{$gameConfig.title}</CardTitle>
        <CardDescription>Enter your name to join the game</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handleJoin();
          }}
          class="space-y-4"
        >
          <Input
            type="text"
            placeholder="Your name"
            bind:value={player.username}
            maxlength={20}
            class="text-lg py-6"
          />
          {#if $joinError}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p class="text-sm font-semibold">{$joinError}</p>
            </div>
          {/if}
          <Button type="submit" class="w-full text-lg py-6" disabled={!player.username.trim()}>
            Join game
          </Button>
        </form>

        <p class="text-muted-foreground mt-4 text-sm text-center">
          Make sure to use a unique name to keep your score!
        </p>
      </CardContent>
    </Card>
  {:else if $gameState.gamePhase === "lobby"}
    <LobbyPhase />
  {:else if $gameState.gamePhase === "playing"}
    <PlayingPhase />
  {:else if $gameState.gamePhase === "question"}
    <QuestionPhase />
  {:else if $gameState.gamePhase === "scoring"}
    <ScoringPhase />
  {:else if $gameState.gamePhase === "leaderboard"}
    <LeaderboardPhase />
  {/if}
</div>

<Toaster richColors position="top-right" />
