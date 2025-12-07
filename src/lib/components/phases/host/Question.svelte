<script lang="ts">
  import QuestionCard from "$lib/components/features/game/QuestionCard.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import { useGame } from "$lib/composables/useGame.svelte";
  import { useMedia } from "$lib/composables/useMedia.svelte";
  import { fullQuestion, gameState } from "$lib/stores/socket";
  import { celebrateCorrect } from "$lib/utils/confetti";
  import Check from "@lucide/svelte/icons/check";
  import LockKeyhole from "@lucide/svelte/icons/lock-keyhole";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import X from "@lucide/svelte/icons/x";

  const game = useGame();
  const media = useMedia();
</script>

<div class="relative z-10 space-y-6 max-w-2xl w-full">
  <div class="flex items-center justify-center flex-1">
    <div class="max-w-4xl w-full">
      <QuestionCard
        question={$fullQuestion}
        showAnswer={$gameState.showAnswer}
        reveal={() => game.revealAnswer()}
        isVideo={media.isVideo}
        toVideoUrl={media.toVideoUrl}
        getYoutubeEmbedUrl={media.getYoutubeEmbedUrl}
        buzzerLocked={$gameState.buzzerLocked}
        onCancel={() => game.cancelQuestion()}
        onSkip={() => game.skipQuestion()}
      />

      <Card class="mt-6">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <p class="text-xl mr-auto">Buzzer queue</p>
            <div
              class="flex items-center mr-2 border-input bg-background border shadow-sm h-8 rounded-md px-3 text-xs"
            >
              <Switch
                id="buzzer-lock-switch"
                checked={$gameState.buzzerLocked}
                title="Toggle buzzer lock"
                onCheckedChange={(checkedEvent) => {
                  if (checkedEvent) {
                    game.lockBuzzer();
                  } else {
                    game.unlockBuzzer();
                  }
                }}
              />
              <Label for="buzzer-lock-switch" class="select-none ml-2">
                <LockKeyhole size={16} />
              </Label>
            </div>
            <Button
              onclick={() => game.clearBuzzers()}
              size="sm"
              variant="outline"
              title="Clear queue"
              ><Trash2 /> Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {#if $gameState.buzzerOrder.length === 0}
              <p class="text-muted-foreground">No one has buzzed yet...</p>
            {:else}
              <div class="space-y-2">
                {#each $gameState.buzzerOrder as buzz, index}
                  <div
                    class="p-3 rounded-lg flex items-center justify-between {index === 0
                      ? 'bg-yellow-100 border-2 border-yellow-400'
                      : 'bg-secondary'}"
                  >
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-lg">#{index + 1}</span>
                      <span class="font-semibold">{buzz.playerName}</span>
                    </div>
                    <div class="flex gap-2 items-center">
                      {#if index === 0}
                        <Button
                          onclick={() => game.markIncorrect(buzz.playerId)}
                          variant="destructive"
                        >
                          <X /> Wrong
                        </Button>
                        <Button
                          onclick={() => {
                            game.markCorrect(buzz.playerId);
                            // celebrate for correct answer
                            celebrateCorrect().catch(() => {});
                          }}
                          variant="default"
                          class="bg-green-600 hover:bg-green-700 text-white border-green-700"
                        >
                          <Check /> Correct
                        </Button>
                      {/if}
                      <Button
                        onclick={() => game.removeBuzz(buzz.playerId)}
                        variant="outline"
                        class="text-xs"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
