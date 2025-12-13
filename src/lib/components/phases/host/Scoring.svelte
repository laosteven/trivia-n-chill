<script lang="ts">
  import ChartPhase from "$lib/components/features/leaderboard/ChartPhase.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { useGame } from "$lib/composables/useGame.svelte";
  const game = useGame();
</script>

<Card class="relative z-10 space-y-6 max-w-[80vw] max-h-[80vh] w-full">
  <CardHeader>
    <CardTitle class="text-center text-4xl font-bold">Score</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartPhase players={game.getLeaderboard()} />
    <div class="mt-8 flex justify-center gap-4">
      <Button onclick={() => game.backToGame()} variant="outline">Back to game</Button>
      <Button onclick={() => game.showLeaderboard()} variant="default">Leaderboard</Button>
    </div>
  </CardContent>
</Card>
