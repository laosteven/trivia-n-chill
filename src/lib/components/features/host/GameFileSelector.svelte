<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { listConfigFiles, switchConfigFile } from "$lib/stores/socket";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import FileText from "@lucide/svelte/icons/file-text";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  let configFiles = $state<string[]>([]);
  let currentFile = $state<string>("example.yml");
  let loading = $state(false);
  let isOpen = $state(false);

  onMount(async () => {
    const files = await listConfigFiles();
    configFiles = files;
    currentFile = files[0] || "";
  });

  async function handleSelectFile(fileName: string) {
    if (loading) return;
    loading = true;
    try {
      const result = await switchConfigFile(fileName);
      if (result.success) {
        currentFile = result.currentFile || fileName;
        toast.success(`Switched to ${fileName}`);
      } else {
        toast.error(result.error || "Failed to switch config file");
      }
    } catch (error) {
      toast.error("Failed to switch config file");
    } finally {
      loading = false;
      isOpen = false;
    }
  }
</script>

<DropdownMenu.Root bind:open={isOpen}>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="gap-2">
        <FileText class="h-4 w-4" />
        <span>{currentFile}</span>
        <ChevronDown class="h-4 w-4" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="start">
    {#if configFiles.length === 0}
      <DropdownMenu.Item disabled>No config files found</DropdownMenu.Item>
    {:else}
      {#each configFiles as file}
        <DropdownMenu.Item
          onclick={() => handleSelectFile(file)}
          disabled={loading || file === currentFile}
          class={file === currentFile ? "bg-accent" : ""}
        >
          <FileText class="mr-2 h-4 w-4" />
          {file}
          {#if file === currentFile}
            <span class="ml-auto text-xs text-muted-foreground">(current)</span>
          {/if}
        </DropdownMenu.Item>
      {/each}
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
