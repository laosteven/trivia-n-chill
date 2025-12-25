<script lang="ts">
  import GameFileSelector from "$lib/components/features/host/GameFileSelector.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { useSidebar } from "$lib/components/ui/sidebar";
  import { useGame } from "$lib/composables/useGame.svelte";
  import { useQRCode } from "$lib/composables/useQRCode.svelte";
  import { gameConfig, gameState } from "$lib/stores/socket";
  import { onDestroy, onMount } from "svelte";

  const game = useGame();
  const qrCode = useQRCode();

  onMount(() => {
    qrCode.generate();
    useSidebar().setOpen(true);
  });

  onDestroy(() => {
    useSidebar().setOpen(false);
  });
</script>

<div class="relative z-10 space-y-6 max-w-2xl w-full">
  <div class="flex items-center justify-center flex-1">
    <div class="max-w-6xl w-full">
      <Card class="mb-6">
        <CardHeader class="text-center">
          <div class="flex items-center justify-between mb-2">
            <CardTitle
              class="flex-1 text-4xl font-bold uppercase tracking-tighter bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-sm"
              >{$gameConfig.title}</CardTitle
            >
          </div>
          <div class="flex-1 flex justify-center mt-4">
            <GameFileSelector />
          </div>
        </CardHeader>
        <CardContent>
          <div class="gap-6 md-2">
            <div class="text-center">
              <h3 class="text-xl font-semibold">Scan the QR code to join!</h3>
              {#if qrCode.qrCodeDataUrl}
                <img src={qrCode.qrCodeDataUrl} alt="QR Code to join game" class="mx-auto mb-2" />
              {/if}
              <p class="text-sm text-muted-foreground break-all">{qrCode.joinUrl}</p>
            </div>
          </div>
          <div class="flex mt-6 flex-col text-center gap-4 justify-center">
            <Button
              onclick={() => game.startGame()}
              disabled={$gameState.players.length === 0}
              class="p-8 text-xl mx-auto"
              size="lg">Start game</Button
            >
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
