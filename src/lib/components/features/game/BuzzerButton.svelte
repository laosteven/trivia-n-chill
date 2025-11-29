<script lang="ts">
  const p = $props<{ onBuzz: () => void }>();
</script>

<button
  onclick={p.onBuzz}
  class="w-full aspect-square bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-95 rounded-xl shadow-2xl transition-all flex items-center justify-center"
>
  <span class="text-white text-4xl font-bold">BUZZ!</span>
</button>
