<script lang="ts">
  import HostQuestionControls from "$lib/components/features/host/HostQuestionControls.svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { gameConfig, gameState } from "$lib/stores/socket";
  import { get } from "svelte/store";
  const p = $props<{
    question: {
      category: string;
      value: number;
      question: string;
      questionImage?: string;
      questionYoutube?: string;
      answer: string;
      answerImage?: string;
      answerYoutube?: string;
    } | null;
    showAnswer: boolean;
    reveal: () => void;
    isVideo: (src: string) => boolean;
    toVideoUrl: (src: string) => string;
    getYoutubeEmbedUrl: (id: string) => string;
    buzzerLocked: boolean;
    onCancel: () => void;
    onSkip: () => void;
    questionRevealed: () => void;
  }>();

  let displayedText = $state("");
  let typing = $state(false);
  let showMedia = $state(true);

  // Start typewriter whenever question changes
  $effect(() => {
    const currentQuestion = p.question;
    const cfg = get(gameConfig)?.typewriter || {
      enabled: true,
      speedMsPerChar: 20,
      delayBeforeMediaMs: 300,
    };
    const enabled = cfg.enabled ?? true;
    const speed = cfg.speedMsPerChar ?? 20;
    const delayBeforeMedia = cfg.delayBeforeMediaMs ?? 300;

    displayedText = "";
    showMedia = !enabled; // hide media while typing

    if (!currentQuestion) {
      displayedText = "";
      typing = false;
      showMedia = true;
      return;
    }

    if (!enabled) {
      // If typewriter is disabled, ensure typing state is cleared and media visibility is correct
      typing = false;
      displayedText = currentQuestion.question || "";
      showMedia = true;
      return;
    }

    typing = true;
    let cancelled = false;

    setTimeout(() => {
      (async () => {
        const full = currentQuestion.question || "";
        for (let i = 0; i <= full.length; i++) {
          if (cancelled) return;
          displayedText = full.slice(0, i);
          await new Promise((r) => setTimeout(r, speed));
        }
        if (cancelled) return;
        typing = false;
        await new Promise((r) => setTimeout(r, delayBeforeMedia));
        if (cancelled) return;
        showMedia = true;
        p.questionRevealed();
      })();

      return () => {
        cancelled = true;
      };
    }, $gameConfig?.game?.delayBeforeQuestionMs || 0);
  });
</script>

<Card>
  <CardHeader>
    <CardTitle class="text-center" style="font-size: clamp(1.25rem, 2.5vw, 2rem);">
      {p.question?.category} - <span class="font-mono tabular-nums"
        >${p.question ? p.question.value * ($gameState.pointMultiplier || 1) : 0}</span
      >
    </CardTitle>
  </CardHeader>
  <CardContent class="space-y-6">
    <div class="bg-blue-900 text-white p-8 rounded-lg text-center">
      <p class="font-bold" style="font-size: clamp(1.5rem, 4vw, 4rem);">
        {displayedText}{#if typing}<span class="font-thin animate-pulse">|</span>{/if}
      </p>

      {#if showMedia && p.question?.questionImage}
        {#if p.isVideo(p.question.questionImage)}
          <video
            src={p.toVideoUrl(p.question.questionImage)}
            autoplay
            loop
            playsinline
            controls
            class="mx-auto mt-4 rounded-lg responsive-media"
          >
            <track kind="captions" label="Video" default />
          </video>
        {:else}
          <img
            src={p.question.questionImage}
            alt="Question"
            class="mx-auto mt-4 rounded-lg responsive-media"
          />
        {/if}
      {/if}

      {#if showMedia && p.question?.questionYoutube}
        <div class="mt-4 aspect-video">
          <iframe
            src={p.getYoutubeEmbedUrl(p.question.questionYoutube)}
            title="Question video"
            class="w-full h-full rounded-lg responsive-media-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      {/if}
    </div>

    {#if p.showAnswer}
      <div class="bg-green-100 p-4 rounded-lg">
        <p class="text-muted-foreground mb-1" style="font-size: clamp(0.9rem, 1.5vw, 1.1rem);">
          Answer:
        </p>
        <p class="font-semibold text-green-800" style="font-size: clamp(1rem, 2.2vw, 2rem);">
          {p.question?.answer}
        </p>
        {#if p.question?.answerImage}
          {#if p.isVideo(p.question.answerImage)}
            <video
              src={p.toVideoUrl(p.question.answerImage)}
              autoplay
              loop
              playsinline
              controls
              class="mx-auto mt-4 rounded-lg responsive-media"
            >
              <track kind="captions" label="Video" default />
            </video>
          {:else}
            <img
              src={p.question.answerImage}
              alt="Answer"
              class="mx-auto mt-4 rounded-lg responsive-media"
            />
          {/if}
        {/if}
        {#if p.question?.answerYoutube}
          <div class="mt-4 aspect-video">
            <iframe
              src={p.getYoutubeEmbedUrl(p.question.answerYoutube)}
              title="Answer video"
              class="w-full h-full rounded-lg responsive-media-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        {/if}
      </div>
    {/if}

    <div class="mt-6">
      <HostQuestionControls
        showAnswer={p.showAnswer}
        reveal={p.reveal}
        onCancel={p.onCancel}
        onSkip={p.onSkip}
      />
    </div>

    <div class="sm:hidden text-sm text-muted-foreground">
      {p.question?.answer}
    </div>
  </CardContent>
</Card>

<style>
  .responsive-media {
    max-height: clamp(160px, 40vh, 640px);
    width: auto;
    display: block;
  }

  .responsive-media-iframe {
    max-height: clamp(180px, 50vh, 720px);
    width: 100%;
    display: block;
  }
</style>
