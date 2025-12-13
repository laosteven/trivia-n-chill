<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { useGame } from "$lib/composables/useGame.svelte";
  import { useQRCode } from "$lib/composables/useQRCode.svelte";
  import { gameConfig, gameState } from "$lib/stores/socket";
  import { onMount } from "svelte";

  const game = useGame();
  const qrCode = useQRCode();

  let editingPlayerId: string | null = null;
  let editingName = "";
  let editError = "";

  onMount(() => {
    qrCode.generate();
  });

  function startEditingName(playerId: string, currentName: string) {
    editingPlayerId = playerId;
    editingName = currentName;
    editError = "";
  }

  function cancelEditName() {
    editingPlayerId = null;
    editingName = "";
    editError = "";
  }

  async function saveEditName() {
    if (!editingPlayerId) return;
    const result = await game.updatePlayerName(editingPlayerId, editingName);
    if (result.success) {
      editingPlayerId = null;
      editingName = "";
      editError = "";
    } else {
      editError = result.error || "Failed to update name";
    }
  }
</script>

<div class="relative z-10 space-y-6 max-w-2xl w-full">
  <div class="flex items-center justify-center flex-1">
    <div class="max-w-6xl w-full">
      <Card class="mb-6">
        <CardHeader class="text-center">
          <CardTitle
            class="text-4xl font-bold uppercase tracking-tighter bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-sm"
            >{$gameConfig.title}</CardTitle
          >
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
          <div class="flex mt-6 text-center gap-4 justify-center">
            <Button
              onclick={() => game.startGame()}
              disabled={$gameState.players.length === 0}
              class="px-8 py-4 text-xl"
              size="lg">Start game</Button
            >
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
