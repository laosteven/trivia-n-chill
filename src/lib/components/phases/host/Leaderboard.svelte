<script lang="ts">
  import TakeScreenshot from "$lib/components/features/game/TakeScreenshot.svelte";
  import HostEndGameDialog from "$lib/components/features/host/HostEndGameDialog.svelte";
  import Leaderboard from "$lib/components/features/leaderboard/Leaderboard.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { useGame } from "$lib/composables/useGame.svelte";

  const game = useGame();
</script>

<Card class="relative z-10 space-y-6 max-w-[80vw] max-h-[80vh] w-full">
  <CardHeader>
    <CardTitle class="text-center text-4xl font-bold">🏆 Leaderboard 🏆</CardTitle>
  </CardHeader>
  <CardContent>
    <Leaderboard players={game.getLeaderboard()} />
    <div class="mt-8 flex justify-center gap-4">
      <Button onclick={() => game.backToGame()} variant="outline">Back to game</Button>
      <HostEndGameDialog>
        <Button>Back to lobby</Button>
      </HostEndGameDialog>
    </div>
    <TakeScreenshot nodeId="host-node" class="mt-4 flex justify-center" />
  </CardContent>
</Card>
