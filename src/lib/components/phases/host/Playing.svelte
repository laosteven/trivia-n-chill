<script lang="ts">
  import GameBoard from "$lib/components/features/game/GameBoard.svelte";
  import HostControls from "$lib/components/features/host/HostControls.svelte";
  import { useGame } from "$lib/composables/useGame.svelte";
  import { gameConfig } from "$lib/stores/socket";

  const game = useGame();
</script>

<div class="relative z-10 space-y-6 max-w-[80vw] w-full h-full">
  <div class="flex items-center justify-center flex-1">
    <div class="max-w-12xl w-full">
      <HostControls title={$gameConfig.title} onRevealScoring={() => game.showScoring()} />

      <!-- Game Board -->
      <GameBoard
        categories={$gameConfig.categories}
        isAnswered={(cat, value) => game.isQuestionAnswered(cat, value)}
        onSelect={(cat, value) => game.selectQuestion(cat, value)}
      />
    </div>
  </div>
</div>
