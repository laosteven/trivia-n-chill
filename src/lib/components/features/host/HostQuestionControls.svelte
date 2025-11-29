<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  const p = $props<{ buzzerLocked: boolean; onCancel: () => void; onLock: () => void; onUnlock: () => void; onClear: () => void; onSkip: () => void }>();
</script>

<div class="flex justify-center gap-4 flex-wrap">
  <Button onclick={p.onCancel} variant="ghost">Cancel question</Button>
  {#if !p.buzzerLocked}
    <Button onclick={p.onLock} variant="outline">Lock buzzers</Button>
  {:else}
    <Button onclick={p.onUnlock} variant="outline">Unlock buzzers</Button>
  {/if}
  <Button onclick={p.onClear} variant="outline">Clear queue</Button>
  <Button onclick={p.onSkip} variant="destructive">Skip question</Button>
</div>
