<script lang="ts">
  import Pin from "@lucide/svelte/icons/pin";
  import PinOff from "@lucide/svelte/icons/pin-off";

  import { Button } from "$lib/components/ui/button/index.js";
  import { useWakeLock } from "$lib/composables/useWakeLock.svelte";

  const wakeLock = useWakeLock();
</script>

{#if wakeLock.isSupported}
  <Button
    onclick={wakeLock.toggle}
    variant={wakeLock.isActive ? "destructive" : "outline"}
    size="icon"
  >
    {#if wakeLock.isActive}
      <Pin />
    {:else}
      <PinOff />
    {/if}
    <span class="sr-only">Toggle screen wake lock</span>
  </Button>
{/if}
