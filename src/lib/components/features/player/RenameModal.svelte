<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

  export let open: boolean;
  export let value: string;
  export let error: string | null = null;
  export let onClose: () => void;
  export let onSubmit: (newName: string) => void;
</script>

{#if open}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    onclick={onClose}
    onkeydown={(e) => e.key === "Escape" && onClose()}
    role="button"
    tabindex="-1"
  >
    <div
      class="w-full max-w-md"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="0"
    >
      <Card class="w-full">
        <CardHeader>
          <CardTitle>Change your name</CardTitle>
          <CardDescription>Enter a new username</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onsubmit={(e) => {
              e.preventDefault();
              onSubmit(value.trim());
            }}
            class="space-y-4"
          >
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> To keep your current score, use the same name when you
                rejoin.
              </p>
            </div>
            <Input type="text" bind:value maxlength={20} class="text-lg py-6" />
            {#if error}
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p class="text-sm font-semibold">{error}</p>
              </div>
            {/if}
            <div class="flex gap-2">
              <Button type="button" onclick={onClose} variant="outline" class="flex-1"
                >Cancel</Button
              >
              <Button type="submit" class="flex-1" disabled={!value.trim()}>Change name</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
{/if}
