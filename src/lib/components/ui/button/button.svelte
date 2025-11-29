<script lang="ts">
  import { cn } from "$lib/utils";
  import { buttonVariants, type Props } from "./index.js";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    class: className,
    variant = "default",
    size = "default",
    children,
    ...restProps
  }: Props & HTMLButtonAttributes & { children?: Snippet } = $props();
</script>

<button class={cn(buttonVariants({ variant, size, className }))} {...restProps}>
  {@render children?.()}
</button>
