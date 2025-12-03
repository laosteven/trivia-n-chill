<script lang="ts">
  import { browser } from "$app/environment";
  import { buttonVariants } from "$lib/components/ui/button";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { usePlayer } from "$lib/composables/usePlayer.svelte";
  import SmilePlus from "@lucide/svelte/icons/smile-plus";
  import { onMount } from "svelte";

  const player = usePlayer();
  let emoji = $state<string>("😀");

  let open = $state(false);
  let pickerLoaded = $state(false);

  onMount(async () => {
    if (!browser) return;
    try {
      await import("emoji-picker-element");
      pickerLoaded = true;
    } catch (e) {
      // fail silently — avoid crashing SSR or client if import fails
      console.warn("Failed to load emoji-picker-element:", e);
    }
  });
</script>

<div class="flex items-center gap-2">
  <ButtonGroup>
    <Button
      variant="outline"
      size="icon"
      onclick={() => {
        open = !open;
        player.sendEmojiReaction(emoji);
      }}
    >
      {emoji}
    </Button>
    <Popover.Root>
      <Popover.Trigger
        class={buttonVariants({ variant: "outline", size: "icon" })}
        onclick={() => (open = !open)}
      >
        <SmilePlus />
      </Popover.Trigger>
      <Popover.Content class="bg-transparent p-0 shadow-none border-0">
        {#if pickerLoaded}
          <emoji-picker
            align="end"
            onemoji-click={(e: any) => {
              emoji = e.detail?.unicode || e.detail;
              open = false;
            }}
          ></emoji-picker>
        {:else}
          <div class="p-2">Loading…</div>
        {/if}
      </Popover.Content>
    </Popover.Root>
  </ButtonGroup>
</div>
