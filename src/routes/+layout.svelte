<script lang="ts">
	import './layout.css';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>Jeopardy</title>
	<meta name="description" content="Self-hosted Jeopardy game" />
</svelte:head>

{@render children()}
