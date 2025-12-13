<script lang="ts">
  const p = $props<{
    categories: { name: string; questions: { value: number }[] }[];
    isAnswered: (cat: string, value: number) => boolean;
    onSelect: (cat: string, value: number) => void;
  }>();

  // compute the ordered unique value rows so we can set grid-template-rows
  const valueRows = Array.from(
    new Set(
      p.categories.flatMap((c: { questions: { value: number }[] }) =>
        c.questions.map((q: { value: number }) => q.value)
      )
    )
  ).sort((a, b) => (a as number) - (b as number));

  // dynamic rows string: one header row + one row per value
  const rowsCount = 1 + valueRows.length;
  const gridTemplateRows = `repeat(${rowsCount}, 1fr)`;
</script>

<div class="overflow-x-auto">
  <div
    class="grid gap-2 min-w-full sm:min-w-0 responsive-board"
    style={`grid-template-columns: repeat(${p.categories.length}, minmax(160px, 1fr)); grid-template-rows: ${gridTemplateRows};`}
  >
    {#each p.categories as category}
      <div
        class="bg-blue-800 text-white p-4 text-center font-bold rounded-t flex items-center justify-center category-title"
      >
        {category.name}
      </div>
    {/each}

    {#each valueRows as value}
      {#each p.categories as category}
        {@const answered = p.isAnswered(category.name, value)}
        <button
          onclick={() => p.onSelect(category.name, value)}
          disabled={answered}
          class="bg-blue-700 text-yellow-300 p-4 hover:bg-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold tabular-nums value-button"
        >
          <div
            class="font-bold uppercase tracking-tighter bg-gradient-to-br from-amber-200 via-amber-250 to-amber-300 bg-clip-text text-transparent combined-drop-shadows"
          >
            {answered ? "" : `$${value}`}
          </div>
        </button>
      {/each}
    {/each}
  </div>
</div>

<style>
  .responsive-board {
    height: clamp(40vh, 60vh, 80vh);
    max-height: calc(100vh - 120px);
    overflow: hidden;
  }

  .category-title {
    font-size: clamp(1rem, 1.5rem, 2.25rem);
  }

  .value-button {
    font-size: clamp(1.25rem, 2rem, 3rem);
    padding: clamp(0.75rem, 1rem, 2rem);
  }

  .combined-drop-shadows {
    filter: drop-shadow(0 0.25rem 0 rgba(168, 85, 0, 0.85))
      drop-shadow(0 0.25rem 0.25rem rgba(0, 0, 0, 0.3));
  }

  :global(.overflow-x-auto) {
    height: 100%;
    min-height: 0;
  }

  :global(.overflow-x-auto) > .responsive-board {
    height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
