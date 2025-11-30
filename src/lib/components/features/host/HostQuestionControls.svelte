<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import Eye from "@lucide/svelte/icons/eye";
  import SkipForward from "@lucide/svelte/icons/skip-forward";

  const p = $props<{
    showAnswer: boolean;
    reveal: () => void;
    onCancel: () => void;
    onSkip: () => void;
  }>();
</script>

<div class="flex justify-center gap-4 flex-wrap">
  <ButtonGroup>
    <ButtonGroup>
      <Button
        onclick={p.onCancel}
        variant="outline"
        size="icon"
        title="Go back to question selection"
      >
        <ArrowLeft />
      </Button>
    </ButtonGroup>

    <ButtonGroup>
      <Button onclick={p.onSkip} variant="outline" title="Skip question">
        <SkipForward />Skip question
      </Button>
      <Button
        class="text-green-600"
        onclick={p.reveal}
        disabled={p.showAnswer}
        variant="outline"
        title="Reveal answer"
      >
        <Eye />
        Reveal answer
      </Button>
    </ButtonGroup>
  </ButtonGroup>
</div>
