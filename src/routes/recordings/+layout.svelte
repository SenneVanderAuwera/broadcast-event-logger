<script lang="ts">
	import { Toaster } from "#lib/components/ui/sonner/index.js";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<Toaster richColors />

{@render children()}
