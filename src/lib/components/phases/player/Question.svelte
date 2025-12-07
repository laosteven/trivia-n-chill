<script lang="ts">
  import BuzzerButton from "$lib/components/features/game/BuzzerButton.svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { usePlayer } from "$lib/composables/usePlayer.svelte";
  import { gameState } from "$lib/stores/socket";
  import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";

  const player = usePlayer();
  function handleBuzz() {
    player.doBuzz();
  }
</script>

<div class="w-full max-w-md">
  <Card class="mb-4">
    <CardHeader class="text-center pb-2">
      <CardTitle class="text-xl">{player.currentPlayer?.name}</CardTitle>
      <CardContent class="text-2xl font-bold text-purple-600">${player.currentPlayer?.score ?? 0}</CardContent>
    </CardHeader>
  </Card>

  {#if $gameState.buzzerLocked}
    <Card class="bg-red-100 border-red-300">
      <CardContent class="p-8 text-center">
        <div class="text-6xl mb-4">🔒</div>
        <p class="text-xl font-semibold text-red-800">Buzzer locked</p>
        <p class="text-muted-foreground">Wait for the host to unlock...</p>
      </CardContent>
    </Card>
  {:else if player.hasBuzzedValue}
    <Card class="bg-yellow-100 border-yellow-300">
      <CardContent class="p-8 text-center">
        <LottiePlayer src="/animations/idea.json" autoplay loop style="display: inline-block" />
        <p class="text-xl font-semibold text-yellow-800">You buzzed!</p>
        <p class="text-2xl font-bold text-yellow-900">Position: #{player.buzzPosition}</p>
      </CardContent>
    </Card>
  {:else}
    <BuzzerButton onBuzz={handleBuzz} />
  {/if}
</div>
