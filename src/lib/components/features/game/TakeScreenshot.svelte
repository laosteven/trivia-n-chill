<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import ImagePlus from "@lucide/svelte/icons/image-plus";
  import { domToPng } from "modern-screenshot";
  import type { ClassValue } from "svelte/elements";

  let {
    nodeId,
    playerName,
    class: className,
  }: {
    nodeId: string;
    playerName?: string;
    class?: ClassValue | null | undefined;
  } = $props();

  let hide = $state(false);

  function takeScreenshot() {
    // Hide the button before taking the screenshot
    hide = true;

    const node = document.getElementById(nodeId);

    if (!node) {
      console.error(`Element with id '${nodeId}' not found.`);
      return;
    }

    domToPng(node, { quality: 1 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        const date = new Date();
        const timestamp = date.toISOString().replace(/[:.]/g, "-");

        link.download = `${playerName || "screenshot"}-${timestamp}.png`;
        link.href = dataUrl;
        link.click();

        link.remove();
      })
      .finally(() => {
        hide = false;
      });
  }
</script>

<div class="sm:hidden {hide ? 'hidden' : 'w-full '} {className}">
  {#if !hide}
    <Button disabled={hide} onclick={takeScreenshot} variant="outline">
      <ImagePlus />
      Take screenshot
    </Button>
  {/if}
</div>
