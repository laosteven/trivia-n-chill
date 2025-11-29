<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { updatePlayerScore } from "$lib/stores/socket";
  import type { Player } from "$lib/types";
  import { validateScore } from "$lib/utils/validation";

  const p = $props<{ player: Player }>();
  let localScore = $state<number>(p.player.score);
  let error = $state<string | null>(null);

  $effect(() => {
    localScore = p.player.score;
    error = null;
  });

  function save() {
    const newScore = Number(localScore);
    const { valid, error: e } = validateScore(newScore);
    if (!valid) {
      error = e ?? "Invalid score";
      return;
    }
    error = null;
    updatePlayerScore(p.player.id, newScore);
  }
</script>

<div class="flex items-center gap-2">
  <Input type="number" bind:value={localScore} class="w-24" />
  <Button size="sm" onclick={save}>Save</Button>
</div>
{#if error}
  <div class="text-red-700 text-xs mt-1">{error}</div>
{/if}
