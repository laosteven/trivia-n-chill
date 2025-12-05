<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { gameState, hostUpdatePlayerName, updatePlayerScore } from "$lib/stores/socket";
  import type { Player } from "$lib/types";
  import User from "@lucide/svelte/icons/user";
  import type { ComponentProps } from "svelte";
  import { derived } from "svelte/store";

  let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

  const players = derived(gameState, ($gameState) =>
    ($gameState?.players || []).slice().sort((a: Player, b: Player) => b.score - a.score)
  );

  let selected: Player | null = null;
  let editingScore = $state(0);
  let editingName = $state("");
  let open = $state(false);

  const isHost = typeof window !== "undefined" && window.location.pathname.startsWith("/host");

  function openEditor(p: Player) {
    selected = { ...p };
    editingScore = p.score;
    editingName = p.name;
    open = true;
  }

  async function save() {
    if (!selected) return;

    // Update name if changed
    const newName = editingName.trim();
    if (newName && newName !== selected.name) {
      const res = await hostUpdatePlayerName(selected.id, newName);
      if (!res.success) {
        // keep dialog open on error
        return;
      }
    }

    // Update score if changed
    const newScore = Number(editingScore);
    if (!Number.isNaN(newScore) && newScore !== selected.score) {
      await updatePlayerScore(selected.id, newScore);
    }

    open = false;
    selected = null;
  }
</script>

<Sidebar.Root collapsible="offcanvas" side="right" {...restProps}>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton>
          <User />
          Players ({$players.length})
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>

      <Dialog.Root bind:open>
        {#if $players.length}
          <Sidebar.MenuSub>
            {#each $players as p}
              <Sidebar.MenuSubItem>
                <Sidebar.MenuSubButton>
                  {#if isHost}
                    <Dialog.Trigger onclick={() => openEditor(p)} class="w-full">
                      <Button
                        variant="ghost"
                        class="text-xs font-normal p-2 w-full justify-between rounded-lg"
                      >
                        <div class="truncate">{p.name}</div>
                        <div class="text-muted-foreground">${p.score}</div>
                      </Button>
                    </Dialog.Trigger>
                  {:else}
                    <Button
                      variant="ghost"
                      class="text-xs font-normal p-2 w-full justify-between rounded-lg"
                    >
                      <div class="truncate">{p.name}</div>
                      <div class="text-muted-foreground">${p.score}</div>
                    </Button>
                  {/if}
                </Sidebar.MenuSubButton>
              </Sidebar.MenuSubItem>
            {/each}
          </Sidebar.MenuSub>
        {:else}
          <div class="text-sm text-muted-foreground px-2">No players yet</div>
        {/if}<Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit Player</Dialog.Title>
          </Dialog.Header>
          <div class="space-y-3">
            <Label for="name">Name</Label>
            <Input id="name" type="text" bind:value={editingName} />
            <Label for="score">Score</Label>
            <Input id="score" type="number" bind:value={editingScore} />
          </div>
          <Dialog.Footer>
            <Button onclick={save}>Save</Button>
            <Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Sidebar.Menu>
  </Sidebar.Header>
</Sidebar.Root>
