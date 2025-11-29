<script lang="ts">
  export let size: number = 24;
</script>

<div class="flex items-center justify-center" aria-busy="true" aria-live="polite">
  <svg width={size} height={size} viewBox="0 0 24 24" class="animate-spin text-purple-600">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.25" />
    <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" stroke-width="4" />
  </svg>
</div>
