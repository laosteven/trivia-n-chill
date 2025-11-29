<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  const p = $props<{ title: string; canStart: boolean; onStart: () => void; onShowLeaderboard: () => void; onReset: () => void }>();
</script>

<div class="flex justify-between items-center mb-4">
  <h1 class="text-3xl font-bold text-white">{p.title}</h1>
  <div class="space-x-2">
    <Button onclick={p.onShowLeaderboard} variant="secondary">Show leaderboard</Button>
    <Button onclick={p.onReset} variant="destructive">Reset game</Button>
  </div>
</div>
