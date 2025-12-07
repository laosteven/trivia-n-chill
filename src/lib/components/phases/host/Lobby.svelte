<script lang="ts">
  import HostRemoveAllPlayersDialog from "$lib/components/features/host/HostRemoveAllPlayersDialog.svelte";
  import HostRemoveDisconnectedDialog from "$lib/components/features/host/HostRemoveDisconnectedDialog.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { useGame } from "$lib/composables/useGame.svelte";
  import { useQRCode } from "$lib/composables/useQRCode.svelte";
  import { gameConfig, gameState } from "$lib/stores/socket";
  import BrushCleaning from "@lucide/svelte/icons/brush-cleaning";
  import MoreHorizontal from "@lucide/svelte/icons/more-horizontal";
  import UserRoundX from "@lucide/svelte/icons/user-round-x";
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
            <div>
              <div class="flex items-center gap-4 mb-4">
                <h3 class="text-xl font-semibold mr-auto">
                  Players ({$gameState.players.length})
                </h3>
                {#if $gameState.players.length > 0}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button size="icon" variant="outline" aria-label="More Options">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        {#snippet child({ props })}
                          <HostRemoveDisconnectedDialog {...props}>
                            <div class="flex items-center gap-2">
                              <UserRoundX size={12} /> Remove disconnected
                            </div>
                          </HostRemoveDisconnectedDialog>
                        {/snippet}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {#snippet child({ props })}
                          <HostRemoveAllPlayersDialog {...props}>
                            <div class="flex items-center gap-2">
                              <BrushCleaning size={12} /> Clear players
                            </div>
                          </HostRemoveAllPlayersDialog>
                        {/snippet}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                {/if}
              </div>
              <ScrollArea class="h-40 rounded-md">
                {#each $gameState.players as player}
                  <div
                    class="px-4 py-2 bg-secondary rounded-lg flex items-center justify-between m-2"
                  >
                    {#if editingPlayerId === player.id}
                      <div class="flex flex-col gap-1 flex-1">
                        <input
                          type="text"
                          bind:value={editingName}
                          class="px-2 py-1 rounded border bg-background"
                          placeholder="Player name"
                        />
                        {#if editError}
                          <span class="text-xs text-red-600">{editError}</span>
                        {/if}
                      </div>
                      <div class="flex items-center gap-2 ml-2">
                        <Button size="sm" onclick={saveEditName}>Save</Button>
                        <Button size="sm" variant="outline" onclick={cancelEditName}>Cancel</Button>
                      </div>
                    {:else}
                      <span>{player.name}</span>
                      {#if !player.connected}
                        <div class="flex items-center gap-2">
                          <span class="text-xs text-red-600 font-semibold">Disconnected</span>
                          <Button
                            variant="outline"
                            size="icon"
                            class="text-xs"
                            onclick={() => game.removePlayer(player.id)}>❌</Button
                          >
                        </div>
                      {/if}
                      {#if player.connected}
                        <Button
                          variant="outline"
                          size="icon"
                          class="text-xs"
                          onclick={() => startEditingName(player.id, player.name)}>✏️</Button
                        >
                      {/if}
                    {/if}
                  </div>
                {/each}
                {#if $gameState.players.length === 0}
                  <p class="text-muted-foreground my-auto h-full flex items-center justify-center">
                    Waiting for players to join...
                  </p>
                {/if}
              </ScrollArea>
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
