<script lang="ts">
  import { browser } from "$app/environment";
  import LeaderboardPhase from "$lib/components/phases/host/LeaderboardPhase.svelte";
  import LobbyPhase from "$lib/components/phases/host/Lobby.svelte";
  import PlayingPhase from "$lib/components/phases/host/Playing.svelte";
  import QuestionPhase from "$lib/components/phases/host/Question.svelte";
  import ScoringPhase from "$lib/components/phases/host/Scoring.svelte";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { useBuzzer } from "$lib/composables/useBuzzer.svelte";
  import {
    connected,
    gameState,
    hostEmojiReaction,
    hostJoin,
    hostLeave,
    hostNotification,
    initSocket,
  } from "$lib/stores/socket";
  import { celebrateLeaderboard } from "$lib/utils/confetti";
  import { onDestroy, onMount } from "svelte";
  import { toast, Toaster } from "svelte-sonner";

  const buzzer = useBuzzer();
  let _prevPhase: string | null = null;

  onMount(() => {
    if (browser) {
      initSocket();
      hostJoin();
      buzzer.init();
      buzzer.setupAutoPlay();
    }
  });

  onDestroy(() => {
    if (browser) {
      hostLeave();
    }
  });

  $effect(() => {
    const phase = $gameState.gamePhase;
    if (_prevPhase !== phase && phase === "leaderboard") {
      if (typeof window !== "undefined") {
        celebrateLeaderboard().catch(() => {});
      }
    }
    _prevPhase = phase;
  });

  $effect(() => {
    if ($hostNotification) {
      toast.info($hostNotification.message, { dismissable: true });
    }
    if ($hostEmojiReaction) {
      toast.info(`${$hostEmojiReaction.playerName} sent ${$hostEmojiReaction.emoji}`, {
        dismissable: true,
      });
    }
  });
</script>

<div
  class="min-h-screen bg-blue-950 dark:bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30"
>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-12 relative overflow-hidden"
  >
    {#if !$connected}
      <div class="relative z-10 space-y-6 max-w-2xl w-full">
        <div class="flex items-center justify-center flex-1">
          <Card class="p-8">
            <CardContent>
              <p class="text-xl">Connecting to server...</p>
            </CardContent>
          </Card>
        </div>
      </div>
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
</div>

<Toaster richColors position="top-left" />
