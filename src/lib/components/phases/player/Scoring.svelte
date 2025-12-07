<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { usePlayer } from "$lib/composables/usePlayer.svelte";

  const player = usePlayer();
</script>

<Card class="w-full max-w-md">
  <CardHeader class="text-center">
    <CardTitle class="text-3xl">Results</CardTitle>
  </CardHeader>
  <CardContent class="text-center space-y-4">
    <div class="bg-secondary p-4 rounded-lg">
      <p class="text-sm text-muted-foreground">Final score</p>
      <p class="text-4xl font-bold text-purple-600">${player.currentPlayer?.score ?? 0}</p>
    </div>
  </CardContent>
</Card>
