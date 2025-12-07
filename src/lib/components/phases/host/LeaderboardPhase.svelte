<script lang="ts">
  import HostEndGameDialog from "$lib/components/features/host/HostEndGameDialog.svelte";
  import Leaderboard from "$lib/components/features/leaderboard/Leaderboard.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { useGame } from "$lib/composables/useGame.svelte";

  const game = useGame();
</script>

<div class="relative z-10 space-y-6 max-w-2xl w-full">
  <div class="flex items-center justify-center flex-1">
    <div class="max-w-2xl w-full">
      <Card>
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
        </CardContent>
      </Card>
    </div>
  </div>
</div>
