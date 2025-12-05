<script lang="ts">
  import { browser } from "$app/environment";
  import AppSidebar from "$lib/components/features/sidebar/AppSidebar.svelte";
  import ToggleMode from "$lib/components/features/toggleMode/ToggleMode.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { gameConfig, initSocket } from "$lib/stores/socket";
  import Github from "@lucide/svelte/icons/github";
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";
  import "./layout.css";

  let { children } = $props();

  onMount(() => {
    if (browser) {
      initSocket();
    }
  });
</script>

<svelte:head>
  <title>{$gameConfig.title}</title>
  <meta name="description" content="Self-hosted trivia game" />
</svelte:head>

<ModeWatcher />

<Sidebar.Provider open={false}>
  <Sidebar.Inset>
    <div class="relative">
      <div class="absolute top-4 right-4 z-50">
        <ButtonGroup>
          <a
            href="https://github.com/laosteven/trivia-n-chill"
            target="_blank"
            rel="noopener noreferrer"
            class={buttonVariants({ variant: "outline", size: "icon" })}
            title="View on GitHub"
          >
            <Github />
          </a>
          <ToggleMode />
          <Sidebar.Trigger class={buttonVariants({ variant: "outline", size: "icon" })} />
        </ButtonGroup>
      </div>

      {@render children?.()}
    </div>
  </Sidebar.Inset>
  <AppSidebar variant="inset" />
</Sidebar.Provider>
